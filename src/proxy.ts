import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_AB, VARIANTES, type Variante } from "@/lib/ab";
import { COOKIE_FENETRE_LP, marqueFenetreLp } from "@/lib/fenetre-lp";

/**
 * CE QUI SE DÉCIDE AVANT MÊME LE RENDU DE /lp.
 *
 * 1. LA VERSION DU TEST A/B, tirée une seule fois par visiteur puis conservée
 *    30 jours : sans cookie, un rechargement changerait de version et le test
 *    ne voudrait plus rien dire.
 * 2. LE DÉPART DE LA FENÊTRE À −50 %, signé (`fenetre-lp.ts`). Il n'y a plus de
 *    clic vers la commande pour l'ouvrir : la page VEND, donc le compte à
 *    rebours part à l'arrivée.
 *
 * ⚠️ UNE PAGE, UN SEUL ENDROIT POUR POSER CES COOKIES. Un composant serveur ne
 * peut pas écrire de cookie pendant le rendu ; le faire dans une action ou une
 * route ajouterait un aller-retour, donc un clic ou un délai — exactement ce
 * que la consigne interdit (« pas de page en plus, pas de clic supplémentaire »).
 *
 * ⚠️ Ne jamais élargir le `matcher` sans raison : chaque chemin couvert ajoute
 * une exécution avant chaque rendu.
 */
export function proxy(request: NextRequest) {
  const reponse = NextResponse.next();

  if (!request.cookies.get(COOKIE_AB)) {
    const variante: Variante = VARIANTES[Math.random() < 0.5 ? 0 : 1];
    // Lisible par le navigateur : le suivi du parcours et PostHog l'attachent
    // à chaque événement. Elle ne donne aucun droit et n'ouvre aucun accès.
    reponse.cookies.set(COOKIE_AB, variante, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86400,
    });
  }

  if (!request.cookies.get(COOKIE_FENETRE_LP)) {
    const marque = marqueFenetreLp();
    // Sans secret configuré, aucun cookie : le prix du catalogue s'affiche.
    if (marque) {
      reponse.cookies.set(COOKIE_FENETRE_LP, marque, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 86400,
      });
    }
  }

  return reponse;
}

export const config = { matcher: ["/lp"] };
