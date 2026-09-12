import { NextResponse } from "next/server";
import { accesParEmail, getLead, relancerPromotion } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * LA SECONDE FENÊTRE, OUVERTE DEPUIS LE DERNIER EMAIL.
 *
 * ⚠️ L'ADRESSE PORTE UN IDENTIFIANT D'INSCRIT : elle ne doit jamais fuir. Même
 * traitement que le lien de désinscription, qui porte le même genre de clé :
 * pas de pixel (voir `lib/meta-pixel.ts`), pas d'indexation, pas de Referer.
 *
 * ⚠️ LA RELANCE N'EST ACCORDÉE QU'UNE FOIS, ET C'EST `relancerPromotion` QUI
 * LE GARANTIT, PAS CETTE ROUTE. Un email transféré, un deuxième clic ou un
 * autre navigateur retombent sur la même date de fin. C'est ce qui permet
 * d'écrire dans l'email « elle ne se rouvrira pas », et c'est ce que promet
 * `/conditions-offres`.
 *
 * Un identifiant inconnu, un désinscrit ou quelqu'un qui a déjà acheté sont
 * renvoyés vers la page de vente sans un mot : l'inverse apprendrait au
 * visiteur que l'identifiant essayé était le bon.
 */
export async function GET(request: Request) {
  const identifiant = new URL(request.url).searchParams.get("id") ?? "";
  const refus = NextResponse.redirect(new URL("/methode", request.url));
  for (const r of [refus]) {
    r.headers.set("Cache-Control", "private, no-store");
    r.headers.set("Referrer-Policy", "no-referrer");
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  if (!identifiant) return refus;

  const lead = await getLead(identifiant).catch(() => null);
  // Pas d'accord marketing, désinscrit, ou déjà client : aucune fenêtre à ouvrir.
  if (!lead || lead.desabonne || lead.marketingConsent !== true) return refus;
  if (await accesParEmail(lead.email).catch(() => null)) return refus;

  const promotion = await relancerPromotion(lead.email, "front");
  const response = NextResponse.redirect(new URL("/commande", request.url));
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.cookies.set("hi_offre", promotion.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });
  return response;
}
