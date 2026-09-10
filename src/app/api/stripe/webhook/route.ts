import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  commandeParPaymentIntent,
  getOrder,
  markOrderPaid,
  marquerRembourse,
  revoquerAcces,
} from "@/lib/db";
import { possessions } from "@/lib/espace";
import { livrer } from "@/lib/livraison";

/**
 * Webhook Stripe — filet de sécurité.
 *
 * Le parcours normal confirme déjà le paiement côté navigateur puis côté serveur.
 * Ce webhook rattrape les cas où le client ferme l'onglet juste après avoir payé :
 * sans lui, la commande resterait « pending » alors que l'argent est encaissé.
 *
 * En local :  stripe listen --forward-to localhost:3000/api/stripe/webhook
 * En prod :   Dashboard → Développeurs → Webhooks → endpoint
 *             https://heritageintact.fr/api/stripe/webhook
 *             Événements : payment_intent.succeeded, charge.refunded
 */
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET manquant" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente" }, { status: 400 });
  }

  // La signature se vérifie sur le corps brut : ne jamais utiliser req.json() ici.
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (e) {
    console.error("[stripe] signature de webhook invalide", e);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const orderId = intent.metadata?.orderId;
      if (orderId) {
        const order = await getOrder(orderId);
        if (order) {
          // La garde de statut ne protège QUE `markOrderPaid` : réécrire une
          // commande déjà payée n'apporte rien.
          if (order.status !== "paid") {
            await markOrderPaid(orderId, {
              customerId: typeof intent.customer === "string" ? intent.customer : undefined,
              paymentMethodId:
                typeof intent.payment_method === "string" ? intent.payment_method : undefined,
              paymentIntentId: intent.id,
            });
            console.log(`[stripe] commande ${orderId} confirmée par webhook`);
          }

          // ⚠️ LA LIVRAISON EST HORS DE LA GARDE, ET C'EST TOUT LE SUJET.
          // Dans le cas nominal, `confirmCheckout` a déjà passé la commande à
          // « paid » : brancher `livrer` à l'intérieur du bloc ci-dessus
          // reviendrait à ne jamais rien livrer par ce chemin, donc à
          // supprimer le filet de sécurité qu'est ce webhook.
          // L'idempotence de l'email est portée par la réservation atomique
          // interne à `livrer` — un seul gagnant entre le navigateur et nous —
          // et jamais par un statut de commande.
          await livrer(order);
        }
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;

      /**
       * ⚠️ STRIPE ÉMET `charge.refunded` POUR UN REMBOURSEMENT PARTIEL EXACTEMENT
       * COMME POUR UN TOTAL, ET LE CODE NE FAISAIT PAS LA DIFFÉRENCE.
       *
       * Un geste commercial de 17 € sur une charge de 44 € marquait donc `front`
       * ET `bump` remboursés — les deux partagent le même PaymentIntent — puis
       * fermait l'espace parce que `front` était du lot. Le client avait payé
       * 27 € qui ne lui ont pas été rendus, et il ne recevait plus rien.
       *
       * Le démêlage fin d'un partiel reste un geste manuel, comme annoncé plus
       * bas. Mais il ne doit RIEN fermer tout seul.
       */
      if (charge.amount_refunded < charge.amount) {
        console.log(
          `[stripe] remboursement partiel sur ${charge.id} ` +
            `(${charge.amount_refunded}/${charge.amount}) : traitement manuel, rien n'est modifié`,
        );
        return NextResponse.json({ received: true });
      }

      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : (charge.payment_intent?.id ?? null);

      if (!paymentIntentId) {
        console.log("[stripe] remboursement sans payment_intent, ignoré");
      } else {
        const order = await commandeParPaymentIntent(paymentIntentId);
        if (!order) {
          console.log(`[stripe] remboursement sur ${paymentIntentId} : aucune commande trouvée`);
        } else {
          // Le remboursement se note DANS L'ARTICLE. Surtout pas dans
          // `Order.status` : `countFounders` filtre sur `status <> 'pending'`,
          // donc un troisième statut ferait compter un remboursé comme une
          // place fondatrice vendue — sur un chiffre affiché en page de vente.
          const maj = await marquerRembourse(order.id, paymentIntentId);

          // ⚠️ LIMITE CONNUE ET ASSUMÉE : le produit d'appel et le bump
          // partagent le MÊME PaymentIntent (`markOrderPaid` le pose sur tous
          // les articles qui n'en ont pas). Rembourser l'un marque donc les
          // deux. Le démêlage fin d'un remboursement partiel front/bump est un
          // geste manuel en v1 — il est rare, et une automatisation
          // approximative ferait plus de dégâts que de bien.
          const rembourses = (maj ?? order).items.filter(
            (i) => i.paymentIntentId === paymentIntentId,
          );

          /**
           * ⚠️ ON NE FERME L'ESPACE QUE SI LE PRODUIT D'APPEL EST REMBOURSÉ
           * *ET* QU'IL NE RESTE PLUS RIEN D'AUTRE DE PAYÉ.
           *
           * Se faire rembourser 97 € d'assurance-vie ne doit pas fermer la
           * porte de quelqu'un qui gardu guide — c'était déjà le cas. Mais
           * l'inverse était vrai aussi : quelqu'un qui rendait Le guide à
           * 27 € perdait l'accès aux 97 € qu'il avait payés dans une commande
           * ADDITIONNELLE et jamais contestés. Il avait payé, il ne recevait
           * plus rien, et l'écran lui affirmait que « sa commande » avait été
           * remboursée. C'est le litige, pas le remboursement.
           *
           * `possessions()` relit toutes les commandes payées de l'adresse en
           * écartant les articles remboursés : elle est la seule à savoir s'il
           * reste quelque chose.
           */
          if (rembourses.some((i) => i.sku === "front")) {
            const restants = await possessions(order.email);
            if (restants.size === 0) {
              await revoquerAcces(order.email);
              console.log(`[stripe] accès révoqué pour la commande ${order.id}`);
            } else {
              console.log(
                `[stripe] produit d'appel remboursé sur ${order.id} mais ` +
                  `${restants.size} produit(s) encore payé(s) : accès gardé`,
              );
            }
          } else {
            console.log(`[stripe] remboursement hors produit d'appel sur ${order.id}, accès gardé`);
          }
        }
      }
    }
  } catch (e) {
    console.error("[stripe] traitement du webhook", e);
    // On répond 200 quand même : sinon Stripe rejoue l'événement en boucle.
  }

  return NextResponse.json({ received: true });
}
