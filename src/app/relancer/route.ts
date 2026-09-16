import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_FENETRE_LP, marqueFenetreLp, relanceValide } from "@/lib/fenetre-lp";
import { enregistrerEtape } from "@/lib/parcours";

export const dynamic = "force-dynamic";

/**
 * LE LIEN DE L'EMAIL DE RELANCE : il rouvre la fenêtre à −50 % puis renvoie au
 * bon de commande de /lp.
 *
 * Sans lui, le destinataire arriverait au prix plein : son cookie de fenêtre
 * existe déjà, expiré, et `proxy.ts` ne remplace que ce qui manque.
 *
 * ⚠️ L'adresse ne porte AUCUNE donnée personnelle, seulement un identifiant de
 * commande et sa signature : pas de pixel, pas d'indexation, pas de `Referer`
 * (mêmes en-têtes que les autres adresses à jeton).
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const commande = params.get("o") ?? "";
  const reponse = NextResponse.redirect(new URL("/lp#paywall", request.url));
  reponse.headers.set("Cache-Control", "private, no-store");
  reponse.headers.set("Referrer-Policy", "no-referrer");
  reponse.headers.set("X-Robots-Tag", "noindex, nofollow");

  if (!commande || !relanceValide(commande, params.get("s"))) return reponse;

  const marque = marqueFenetreLp();
  if (marque) {
    reponse.cookies.set(COOKIE_FENETRE_LP, marque, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86400,
    });
  }
  await enregistrerEtape({ etape: "clic_commande", chemin: "/relancer", detail: { commande, relance: true } });
  return reponse;
}
