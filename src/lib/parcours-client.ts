"use client";

import { COOKIE_AB } from "./ab";
import { COOKIE_VISITEUR, type EtapeClient } from "./parcours-etapes";

/**
 * L'ENVOI D'UNE ÉTAPE DEPUIS LE NAVIGATEUR.
 *
 * Ne lève jamais et n'attend rien : une mesure qui échoue ne doit ni ralentir ni
 * casser le parcours d'achat. `keepalive` laisse partir la requête même quand la
 * page se ferme ou redirige juste après (clic vers la commande, départ vers la
 * banque).
 */
function assurerVisiteur() {
  if (document.cookie.split("; ").some((c) => c.startsWith(COOKIE_VISITEUR + "="))) return;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_VISITEUR}=${id}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
}

export function suivre(
  etape: EtapeClient,
  detail?: Record<string, string | number | boolean>,
  utm?: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  try {
    assurerVisiteur();
    // La version du test A/B voyage avec chaque étape : sans elle, impossible de
    // comparer deux versions sur autre chose que le total.
    const ab = document.cookie.split("; ").find((c) => c.startsWith(COOKIE_AB + "="))?.slice(COOKIE_AB.length + 1);
    void fetch("/api/parcours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etape, chemin: location.pathname, detail: ab ? { ...detail, ab } : detail, utm }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silence volontaire.
  }
}
