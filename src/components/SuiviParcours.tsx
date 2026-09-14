"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { suivre } from "@/lib/parcours-client";
import { estEtapeClient } from "@/lib/parcours-etapes";
import { CHAMPS_UTM } from "@/lib/utm";

/**
 * LE SUIVI DU PARCOURS, SUR TOUT LE SITE.
 *
 * Une « page vue » à chaque changement d'adresse (avec l'origine publicitaire
 * quand l'adresse la porte), et les clics sur tout élément marqué
 * `data-parcours="<étape>"` — c'est ainsi que le refus d'un upsell est compté
 * sans transformer ses pages en composants client.
 *
 * Le panel /admin n'est jamais mesuré : ce sont nos propres visites.
 */
export function SuiviParcours() {
  const chemin = usePathname();

  useEffect(() => {
    if (chemin.startsWith("/admin")) return;
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const champ of CHAMPS_UTM) {
      const v = params.get(champ);
      if (v) utm[champ] = v;
    }
    suivre("page_vue", undefined, utm);
  }, [chemin]);

  useEffect(() => {
    const clic = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest?.<HTMLElement>("[data-parcours]");
      const etape = element?.dataset.parcours;
      if (!estEtapeClient(etape)) return;
      const detail = element?.dataset.parcoursDetail;
      suivre(etape, detail ? { produit: detail } : undefined);
    };
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, []);

  return null;
}
