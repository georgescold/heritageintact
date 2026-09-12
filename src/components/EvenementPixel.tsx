"use client";

import { useEffect, useRef } from "react";
import { evenementPixel } from "@/lib/meta-pixel";

/** Un événement standard, envoyé une seule fois à l'affichage de la page. */
export function EvenementPixel({ nom }: { nom: "ViewContent" | "InitiateCheckout" }) {
  const fait = useRef(false);
  useEffect(() => {
    if (fait.current) return;
    fait.current = true;
    evenementPixel(nom);
  }, [nom]);
  return null;
}

/**
 * LE LEAD, AU RETOUR DE L'INSCRIPTION.
 *
 * L'inscription redirige vers /methode?inscrit=1 : le marqueur déclenche le Lead,
 * puis il est retiré de l'adresse pour qu'un rafraîchissement ne le rejoue pas et
 * qu'un lien partagé ne le porte pas. Lu depuis `location`, et non par
 * `useSearchParams`, qui obligerait cette page statique à devenir dynamique.
 */
export function LeadInscription() {
  const fait = useRef(false);
  useEffect(() => {
    if (fait.current) return;
    fait.current = true;
    const params = new URLSearchParams(window.location.search);
    if (params.get("inscrit") !== "1") return;
    evenementPixel("Lead");
    params.delete("inscrit");
    const reste = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (reste ? "?" + reste : ""));
  }, []);
  return null;
}
