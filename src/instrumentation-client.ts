import posthog, { type CaptureResult } from "posthog-js";
import { cheminSansPixel } from "@/lib/meta-pixel";

/**
 * POSTHOG — le comportement des visiteurs sur les pages (demande de Loys, 14/09/2026) :
 * pages vues, clics, défilement, enregistrements de session et heatmaps.
 *
 * ⚠️ JAMAIS SUR LES ADRESSES QUI SONT DES CLÉS. Même liste que le Pixel Meta
 * (`cheminSansPixel`) : espace client, `?o=` du tunnel, reprise, désinscription,
 * pages d'après paiement, /admin. Un enregistrement de session recopie la page
 * entière, liens compris : sur ces pages, il emporterait le jeton d'accès ou
 * l'identifiant de commande qui autorise un débit. On y coupe donc les
 * événements ET l'enregistrement.
 *
 * ⚠️ Sur les autres pages, la requête d'URL est réduite aux seuls `utm_*` :
 * aucun identifiant ne part vers PostHog par l'adresse.
 *
 * Les champs de saisie sont masqués dans les enregistrements (réglage par
 * défaut, forcé ici) ; la carte bancaire est dans un cadre Stripe, jamais visible.
 * Hébergement européen, appels relayés par notre domaine (`/ingest`, next.config.ts).
 */
const CLE = process.env.NEXT_PUBLIC_POSTHOG_KEY;

const cheminPrive = (url: string | undefined) => {
  try {
    return cheminSansPixel(new URL(url ?? location.href, location.origin).pathname);
  } catch {
    return true;
  }
};

/** Garde les seuls paramètres de campagne ; tout le reste de la requête est retiré. */
function nettoyerUrl(valeur: unknown): unknown {
  if (typeof valeur !== "string" || !valeur) return valeur;
  try {
    const url = new URL(valeur, location.origin);
    const utm = new URLSearchParams();
    url.searchParams.forEach((v, k) => {
      if (k.startsWith("utm_")) utm.set(k, v);
    });
    url.search = utm.toString();
    url.hash = "";
    return url.toString();
  } catch {
    return valeur;
  }
}

function avantEnvoi(evenement: CaptureResult | null): CaptureResult | null {
  if (!evenement) return null;
  const p = evenement.properties ?? {};
  if (cheminPrive(p.$current_url as string | undefined)) return null;
  for (const cle of ["$current_url", "$referrer", "$initial_current_url", "$initial_referrer"]) {
    if (cle in p) p[cle] = nettoyerUrl(p[cle]);
  }
  return evenement;
}

if (CLE && typeof window !== "undefined") {
  posthog.init(CLE, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_pageview: "history_change",
    capture_pageleave: true,
    person_profiles: "identified_only",
    disable_session_recording: cheminPrive(location.href),
    session_recording: { maskAllInputs: true },
    before_send: avantEnvoi,
  });
}

/** Navigation interne : l'enregistrement s'arrête en entrant sur une page privée, reprend en sortant. */
export function onRouterTransitionStart(url: string) {
  if (!CLE) return;
  if (cheminPrive(url)) posthog.stopSessionRecording();
  else if (!posthog.sessionRecordingStarted()) posthog.startSessionRecording();
}
