"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addItem,
  addLead,
  attachStripeCustomer,
  createOrder,
  getOrder,
  markOrderPaid,
} from "@/lib/db";
import { isTestMode, PRODUCTS, type ProductSku } from "@/lib/config";
import { stripe, toCents } from "@/lib/stripe";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Opt-in landing page → cookie lead → VSL */
export async function optin(_prev: FormState, formData: FormData): Promise<FormState> {
  const firstName = clean(formData.get("firstName"));
  const email = clean(formData.get("email"));
  const cgv = formData.get("cgv") === "on";

  if (firstName.length < 2) return { error: "Indiquez votre prénom." };
  if (!EMAIL_RE.test(email)) return { error: "Vérifiez votre adresse email : elle semble incomplète." };
  if (!cgv) {
    return { error: "Cochez la case pour accepter les conditions générales avant de continuer." };
  }

  const lead = await addLead({ email, firstName });
  const jar = await cookies();
  jar.set("hi_lead", JSON.stringify({ email: lead.email, firstName: lead.firstName }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/methode");
}

// ─────────────────────────────────────────────────────────────────────
//  PAIEMENT
// ─────────────────────────────────────────────────────────────────────

export type PrepareResult =
  | { ok: true; clientSecret: string; orderId: string }
  | { ok: false; error: string };

/**
 * Étape 1 du paiement : on crée la commande (statut « pending »), le client Stripe,
 * et le PaymentIntent. `setup_future_usage: off_session` est la clé du projet :
 * c'est ce qui permet de débiter les upsells en un clic, sans ressaisie de carte.
 */
export async function prepareCheckout(input: {
  firstName: string;
  email: string;
  withBump: boolean;
  consent: boolean;
}): Promise<PrepareResult> {
  const firstName = input.firstName.trim();
  const email = input.email.trim().toLowerCase();

  if (firstName.length < 2) return { ok: false, error: "Indiquez votre prénom." };
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Vérifiez votre adresse email : elle semble incomplète." };
  }
  if (!input.consent) {
    return {
      ok: false,
      error:
        "Pour accéder immédiatement au programme, cochez la case concernant le droit de rétractation.",
    };
  }

  const order = await createOrder({
    email,
    firstName,
    withBump: input.withBump,
    consentImmediateAccess: input.consent,
    mode: isTestMode ? "test" : "live",
    status: isTestMode ? "paid" : "pending",
  });

  // Mode test simulé : aucune clé Stripe, aucun débit.
  if (!stripe) return { ok: true, clientSecret: "", orderId: order.id };

  const amount = PRODUCTS.front.price + (input.withBump ? PRODUCTS.bump.price : 0);

  try {
    const customer = await stripe.customers.create({
      email,
      name: firstName,
      metadata: { orderId: order.id },
    });

    const intent = await stripe.paymentIntents.create({
      amount: toCents(amount),
      currency: "eur",
      customer: customer.id,
      // Autorise le débit ultérieur des upsells sans que le client ressaisisse sa carte.
      setup_future_usage: "off_session",
      // Carte uniquement : doit correspondre à `paymentMethodTypes` côté navigateur.
      payment_method_types: ["card"],
      description: input.withBump
        ? `${PRODUCTS.front.short} + ${PRODUCTS.bump.short}`
        : PRODUCTS.front.short,
      metadata: { orderId: order.id, withBump: String(input.withBump) },
    });

    // On mémorise le client Stripe, mais la commande reste « pending » :
    // rien n'est encaissé tant que confirmCheckout (ou le webhook) n'a pas validé.
    await attachStripeCustomer(order.id, customer.id);

    return { ok: true, clientSecret: intent.client_secret ?? "", orderId: order.id };
  } catch (e) {
    console.error("[stripe] prepareCheckout", e);
    return {
      ok: false,
      error: "Le paiement n'a pas pu être initialisé. Réessayez dans un instant.",
    };
  }
}

/**
 * Étape 2 : appelée par le navigateur une fois le paiement confirmé par Stripe.
 * On revérifie côté serveur que le PaymentIntent est bien « succeeded » : on ne
 * fait jamais confiance au client sur un statut de paiement.
 */
export async function confirmCheckout(
  orderId: string,
  paymentIntentId: string,
): Promise<{ ok: boolean; error?: string }> {
  const order = await getOrder(orderId);
  if (!order) return { ok: false, error: "Commande introuvable." };
  if (!stripe) return { ok: true };

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return { ok: false, error: "Le paiement n'a pas abouti." };
    }
    if (intent.metadata?.orderId !== orderId) {
      return { ok: false, error: "Paiement non rattaché à cette commande." };
    }

    await markOrderPaid(orderId, {
      customerId: typeof intent.customer === "string" ? intent.customer : undefined,
      paymentMethodId:
        typeof intent.payment_method === "string" ? intent.payment_method : undefined,
      paymentIntentId: intent.id,
    });
    return { ok: true };
  } catch (e) {
    console.error("[stripe] confirmCheckout", e);
    return { ok: false, error: "Vérification du paiement impossible." };
  }
}

// ─────────────────────────────────────────────────────────────────────
//  UPSELLS EN UN CLIC
// ─────────────────────────────────────────────────────────────────────

export type UpsellResult =
  | { ok: true }
  | { ok: false; error: string; needsAuthentication?: boolean };

/**
 * Débit hors session sur la carte déjà enregistrée : c'est ce qui rend l'upsell
 * possible en un seul clic.
 *
 * Cas particulier européen : la directive DSP2 peut exiger une authentification
 * forte, même sur une carte enregistrée. Stripe renvoie alors `authentication_required`.
 * On le traite explicitement plutôt que d'afficher une erreur générique.
 */
export async function chargeUpsell(orderId: string, sku: ProductSku): Promise<UpsellResult> {
  const order = await getOrder(orderId);
  if (!order) return { ok: false, error: "Commande introuvable." };
  if (order.items.some((i) => i.sku === sku)) return { ok: true }; // déjà acheté

  if (!stripe) {
    await addItem(orderId, sku);
    return { ok: true };
  }

  if (!order.stripeCustomerId || !order.stripePaymentMethodId) {
    return { ok: false, error: "Moyen de paiement introuvable pour cette commande." };
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: toCents(PRODUCTS[sku].price),
      currency: "eur",
      customer: order.stripeCustomerId,
      payment_method: order.stripePaymentMethodId,
      off_session: true,
      confirm: true,
      description: PRODUCTS[sku].short,
      metadata: { orderId, sku },
    });

    if (intent.status !== "succeeded") {
      return { ok: false, error: "Le paiement n'a pas abouti." };
    }

    await addItem(orderId, sku, intent.id);
    return { ok: true };
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === "authentication_required") {
      return {
        ok: false,
        needsAuthentication: true,
        error:
          "Votre banque demande une confirmation supplémentaire pour ce paiement. Vous pourrez ajouter ce produit depuis votre espace, dans l'onglet Outils et Kits.",
      };
    }
    console.error("[stripe] chargeUpsell", e);
    return {
      ok: false,
      error: "Le paiement a été refusé. Votre commande précédente reste bien enregistrée.",
    };
  }
}

/** Acceptation d'un upsell : on débite, puis on avance dans le funnel. */
export async function acceptUpsell(
  orderId: string,
  sku: ProductSku,
  next: string,
): Promise<void> {
  const result = await chargeUpsell(orderId, sku);
  if (!result.ok) {
    redirect(`${next}${next.includes("?") ? "&" : "?"}err=1`);
  }
  redirect(next);
}
