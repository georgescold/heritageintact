"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addItem, addLead, createOrder } from "@/lib/db";
import { isTestMode, type ProductSku } from "@/lib/config";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Opt-in landing page → cookie lead → VSL */
export async function optin(_prev: FormState, formData: FormData): Promise<FormState> {
  const firstName = clean(formData.get("firstName"));
  const email = clean(formData.get("email"));

  // Case CGV : obligatoire sur une landing page qui reçoit du trafic Meta.
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

/** Bon de commande → commande (front + bump éventuel) → upsell 1 */
export async function checkout(_prev: FormState, formData: FormData): Promise<FormState> {
  const firstName = clean(formData.get("firstName"));
  const email = clean(formData.get("email"));
  const withBump = formData.get("bump") === "on";
  const consent = formData.get("consent") === "on";

  if (firstName.length < 2) return { error: "Indiquez votre prénom." };
  if (!EMAIL_RE.test(email)) return { error: "Vérifiez votre adresse email : elle semble incomplète." };
  if (!consent) {
    return {
      error:
        "Pour accéder immédiatement au programme, cochez la case concernant le droit de rétractation.",
    };
  }

  // TODO Stripe : créer et confirmer le PaymentIntent ici (carte enregistrée pour les upsells).
  const order = await createOrder({
    email,
    firstName,
    withBump,
    consentImmediateAccess: consent,
    mode: isTestMode ? "test" : "live",
  });

  const jar = await cookies();
  jar.set("hi_order", order.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });

  redirect(`/plan-complet?o=${order.id}`);
}

/** Acceptation d'un upsell en un clic → produit ajouté → page suivante */
export async function acceptUpsell(orderId: string, sku: ProductSku, next: string): Promise<void> {
  // TODO Stripe : débiter la carte enregistrée (PaymentIntent off_session) avant d'ajouter l'article.
  await addItem(orderId, sku);
  redirect(next);
}
