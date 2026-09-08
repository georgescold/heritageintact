"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Pixel Meta : ne charge rien tant que NEXT_PUBLIC_META_PIXEL_ID n'est pas défini.
 *
 * ⚠️ ET RIEN DU TOUT SOUS /espace, QUELLE QUE SOIT LA CONFIGURATION.
 *
 * Le pixel est monté dans le layout racine, donc sur toutes les pages. Or il
 * envoie à Meta l'URL COMPLÈTE de la page consultée : sur l'espace membre, cette
 * URL contient le jeton, c'est-à-dire la clé unique d'un compte sans mot de
 * passe. Ce serait donner à un tiers publicitaire de quoi entrer chez chacun de
 * nos acheteurs. Et la mesure n'y perd rien : il n'y a aucune conversion à
 * suivre derrière le paiement.
 *
 * ⚠️ `usePathname()` est appelé AVANT le garde sur PIXEL_ID : un hook React
 * doit s'exécuter à chaque rendu, sans condition. L'inverse casserait le
 * composant le jour où la variable d'environnement apparaît en cours de route.
 */
export function MetaPixel() {
  const chemin = usePathname();
  if (!PIXEL_ID) return null;
  if (chemin.startsWith("/espace")) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}

type EventName = "Lead" | "InitiateCheckout" | "Purchase" | "ViewContent";

/** Déclenche un événement standard au montage de la page. */
export function PixelEvent({
  name,
  params,
}: {
  name: EventName;
  params?: Record<string, string | number>;
}) {
  useEffect(() => {
    if (!PIXEL_ID || typeof window.fbq !== "function") return;
    window.fbq("track", name, params);
  }, [name, params]);
  return null;
}
