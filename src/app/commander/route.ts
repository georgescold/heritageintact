import { NextRequest, NextResponse } from "next/server";
import { commencerPromotion } from "@/lib/db";
import { COOKIE_FENETRE, marqueFenetre } from "@/lib/fenetre-guide";
import { guideVendable } from "@/lib/guides-vente";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Le délai commercial ne commence qu'au clic vers la commande, jamais sur la page de vente. */
export async function GET(request: NextRequest) {
  /**
   * ?g=<sku> — LA PORTE D'ENTRÉE DES GUIDES VENDUS À L'UNITÉ.
   *
   * C'est ici que leur fenêtre de prix s'ouvre, et nulle part ailleurs : une
   * page ne peut pas déposer de cookie, et surtout le délai commercial ne doit
   * commencer qu'au CLIC vers la commande — jamais pendant qu'on lit la fiche.
   * C'est la même règle que pour le produit d'appel, deux lignes plus bas.
   *
   * ⚠️ Une fenêtre déjà ouverte n'est PAS réinitialisée. Sans cette garde, il
   * suffirait de revenir sur la boutique et de recliquer pour se maintenir au
   * meilleur palier indéfiniment, et le compte à rebours ne voudrait plus rien
   * dire.
   */
  const guide = request.nextUrl.searchParams.get("g");
  if (guide) {
    if (!guideVendable(guide)) return NextResponse.redirect(new URL("/nos-guides", request.url));
    const versGuide = NextResponse.redirect(new URL("/commander/" + guide, request.url));
    if (!request.cookies.get(COOKIE_FENETRE)) {
      const marque = marqueFenetre();
      // Sans secret configuré, aucun cookie n'est posé : le visiteur voit le
      // prix du catalogue plutôt qu'une remise qu'on ne saurait pas vérifier.
      if (marque) {
        versGuide.cookies.set(COOKIE_FENETRE, marque, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 86400,
        });
      }
    }
    return versGuide;
  }

  const destination = new URL("/commande", request.url);
  let email = "";
  try {
    const lead = JSON.parse(request.cookies.get("hi_lead")?.value ?? "{}") as { email?: string };
    email = lead.email?.trim().toLowerCase() ?? "";
  } catch {}

  const response = NextResponse.redirect(destination);
  if (!EMAIL_RE.test(email)) return response;

  const promotion = await commencerPromotion(email, "front");
  response.cookies.set("hi_offre", promotion.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });
  return response;
}
