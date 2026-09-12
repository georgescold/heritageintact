"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cheminSansPixel } from "@/lib/meta-pixel";

/**
 * LE PAGEVIEW DES NAVIGATIONS INTERNES.
 *
 * Le pixel ne suit plus tout seul les changements d'adresse (voir
 * lib/meta-pixel.ts) : c'est ici qu'ils sont comptés, jamais sur un chemin privé.
 * Si le pixel n'a pas été chargé (arrivée sur une page privée), rien ne part.
 */
export function SuiviPagesMeta() {
  const chemin = usePathname();
  const premier = useRef(true);
  useEffect(() => {
    // Le premier affichage est déjà compté par le script du <head>.
    if (premier.current) {
      premier.current = false;
      return;
    }
    if (!cheminSansPixel(chemin)) window.fbq?.("track", "PageView");
  }, [chemin]);
  return null;
}
