"use server";

import { addItem, creerCommandeEspace, getOrder, markOrderPaid } from "@/lib/db";
import { livrer } from "@/lib/livraison";
import { stripe, toCents } from "@/lib/stripe";
import { PRODUCTS, isTestMode, stripeEnModeTest, type ProductSku } from "@/lib/config";
import { bumpPour, guideVendable } from "@/lib/guides-vente";

/**
 * LA COMMANDE D'UN GUIDE À L'UNITÉ, POUR QUI N'EST PAS ENCORE CLIENT.
 *
 * Jusqu'ici, seul le guide d'entrée se vendait à froid : `/commande` ne connaît
 * que lui, et les autres ne s'obtenaient que depuis l'espace, sur une carte déjà
 * enregistrée. La boutique affichait donc quatre produits sans bouton d'achat.
 *
 * ⚠️ CE FICHIER NE REFAIT PAS LE TUNNEL, IL S'Y BRANCHE. La création de la
 * commande passe par `creerCommandeEspace` — déjà en service et déjà éprouvée —
 * et la confirmation par `confirmCheckout` de `app/actions.ts`, inchangé, qui
 * vérifie le paiement auprès de Stripe puis livre l'accès. Le seul code
 * réellement nouveau est la création du PaymentIntent.
 *
 * Cette contrainte n'est pas de l'élégance : `db.ts` et `actions.ts` racontent
 * tous deux le même accident — deux chemins calculaient le même prix, ils ont
 * divergé, et la banque a prélevé un montant que le récapitulatif contredisait.
 * Un second tunnel complet rejouerait exactement cela.
 *
 * ⚠️ AUCUNE PROMOTION ICI. Les fenêtres de remise (`lib/promotions.ts`) sont
 * attachées à la gamme « front » et au parcours qui les ouvre. Un guide acheté
 * à l'unité part au prix du catalogue, le même que celui affiché sur sa fiche.
 */

export type PreparationGuide =
  | { ok: true; clientSecret: string; orderId: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function preparerCommandeGuide(input: {
  sku: string;
  firstName: string;
  email: string;
  consent: boolean;
  /** Le complément coché sur le bon de commande. */
  withBump?: boolean;
  montantAffiche: number;
}): Promise<PreparationGuide> {
  const firstName = input.firstName.trim();
  const email = input.email.trim().toLowerCase();

  if (!guideVendable(input.sku)) return { ok: false, error: "Ce guide n’est pas vendu à l’unité." };
  if (firstName.length < 2) return { ok: false, error: "Indiquez votre prénom." };
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Vérifiez votre adresse email : elle semble incomplète." };
  }
  if (!input.consent) {
    return {
      ok: false,
      error:
        "Pour accéder immédiatement au guide, cochez la case concernant le droit de rétractation.",
    };
  }

  const sku = input.sku as ProductSku;
  const complement = input.withBump ? bumpPour(sku) : null;

  // ⚠️ UN SEUL CALCUL DU PRIX, ET IL ALIMENTE LA LIGNE DE COMMANDE COMME LA
  // BANQUE. C'est la règle que db.ts et actions.ts répètent tous les deux, après
  // l'accident où deux chemins avaient divergé et où le débit contredisait le
  // récapitulatif.
  const prix = PRODUCTS[sku].price + (complement ? PRODUCTS[complement].price : 0);

  // ⚠️ LE MONTANT AFFICHÉ DOIT ÊTRE CELUI DU CATALOGUE. Le prix vient du serveur
  // dans les deux cas, mais on refuse quand même une page restée ouverte
  // pendant un changement de tarif : personne ne doit être débité d'un montant
  // qu'il n'a pas vu à l'écran.
  if (!Number.isFinite(input.montantAffiche) || input.montantAffiche !== prix) {
    return {
      ok: false,
      error:
        "Le montant a été actualisé. Rechargez la page et vérifiez le récapitulatif. Aucun paiement n’a été lancé.",
    };
  }

  let order = await creerCommandeEspace({
    email,
    firstName,
    sku,
    mode: isTestMode || stripeEnModeTest ? "test" : "live",
  });
  if (complement) order = (await addItem(order.id, complement)) ?? order;

  // La ligne écrite fait foi : si elle ne porte pas le montant attendu, on
  // s'arrête avant d'appeler la banque plutôt que de débiter puis constater.
  const ecrit = order.items.reduce((s, i) => s + i.price, 0);
  if (ecrit !== prix) {
    return {
      ok: false,
      error: "Le récapitulatif ne correspond pas au tarif. Aucun paiement n’a été lancé.",
    };
  }

  // Mode simulé : aucune clé Stripe, aucun débit. Sans ce chemin, ce parcours
  // serait intestable en local — et c'est un parcours de paiement.
  //
  // ⚠️ LA COMMANDE EST MARQUÉE PAYÉE ICI, EXPLICITEMENT. `creerCommandeEspace`
  // la crée « pending », et ce parcours-là ne passe jamais par
  // `confirmCheckout` : sans cet appel, le mode simulé créerait une commande
  // jamais livrée, et le test de bout en bout validerait un achat qui ne donne
  // aucun accès. C'est exactement ce que fait le même chemin dans
  // `app/espace/achat.ts`.
  if (!stripe) {
    await markOrderPaid(order.id, {});
    const paye = (await getOrder(order.id)) ?? order;
    await livrer(paye);
    return { ok: true, clientSecret: "", orderId: order.id };
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name: firstName,
      metadata: { orderId: order.id },
    });

    const intent = await stripe.paymentIntents.create({
      amount: toCents(prix),
      currency: "eur",
      customer: customer.id,
      // Même réglage que le tunnel : la carte reste utilisable pour un ajout
      // ultérieur en un clic depuis l'espace.
      setup_future_usage: "off_session",
      payment_method_types: ["card"],
      receipt_email: email,
      metadata: { orderId: order.id, sku, bump: complement ?? "" },
    });

    if (!intent.client_secret) {
      return { ok: false, error: "Le paiement n’a pas pu être initialisé." };
    }
    return { ok: true, clientSecret: intent.client_secret, orderId: order.id };
  } catch (e) {
    console.error("[stripe] preparerCommandeGuide", e);
    return { ok: false, error: "Le paiement n’a pas pu être initialisé." };
  }
}
