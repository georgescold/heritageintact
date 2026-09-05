import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getOrder, markOrderPaid } from "@/lib/db";

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
        if (order && order.status !== "paid") {
          await markOrderPaid(orderId, {
            customerId: typeof intent.customer === "string" ? intent.customer : undefined,
            paymentMethodId:
              typeof intent.payment_method === "string" ? intent.payment_method : undefined,
            paymentIntentId: intent.id,
          });
          console.log(`[stripe] commande ${orderId} confirmée par webhook`);
        }
      }
    }

    if (event.type === "charge.refunded") {
      // TODO : révoquer l'accès à l'espace membre et exclure des séquences de vente.
      const charge = event.data.object;
      console.log(`[stripe] remboursement sur ${charge.payment_intent}`);
    }
  } catch (e) {
    console.error("[stripe] traitement du webhook", e);
    // On répond 200 quand même : sinon Stripe rejoue l'événement en boucle.
  }

  return NextResponse.json({ received: true });
}
