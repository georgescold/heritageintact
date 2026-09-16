/**
 * LES ÉTAPES DU PARCOURS — partagées entre le navigateur et le serveur.
 *
 * Ce fichier ne contient rien de secret ni d'importé côté serveur : le composant
 * de suivi du navigateur l'importe tel quel.
 *
 * Deux familles :
 *   - les étapes que le NAVIGATEUR peut déclarer (pages vues, visionnage de la
 *     vidéo, clic sur « Valider ma commande », message d'erreur affiché…) —
 *     liste fermée, tout le reste est refusé par /api/parcours ;
 *   - les étapes que seul le SERVEUR constate (inscription, commande créée,
 *     achat payé, upsell accepté). Un navigateur ne peut pas les inventer.
 */
export const ETAPES_CLIENT = [
  "page_vue",
  "vsl_lecture",
  "vsl_25",
  "vsl_50",
  "vsl_75",
  "vsl_100",
  "inscription_erreur",
  "paiement_clic",
  "paiement_erreur",
  "paiement_reussi",
  "upsell_refuse",
] as const;

export const ETAPES_SERVEUR = [
  "inscription",
  "clic_commande",
  "commande_creee",
  "achat",
  "upsell_accepte",
  "relance_paiement",
] as const;

export type EtapeClient = (typeof ETAPES_CLIENT)[number];
export type Etape = EtapeClient | (typeof ETAPES_SERVEUR)[number];

export const estEtapeClient = (v: unknown): v is EtapeClient =>
  typeof v === "string" && (ETAPES_CLIENT as readonly string[]).includes(v);

export const LIBELLES_ETAPES: Record<Etape, string> = {
  page_vue: "Page vue",
  vsl_lecture: "Vidéo lancée",
  vsl_25: "Vidéo vue à 25 %",
  vsl_50: "Vidéo vue à 50 %",
  vsl_75: "Vidéo vue à 75 %",
  vsl_100: "Vidéo vue en entier",
  inscription_erreur: "Erreur à l’inscription",
  inscription: "Inscription",
  clic_commande: "Clic vers la commande",
  paiement_clic: "Clic « Valider ma commande »",
  paiement_erreur: "Blocage au paiement",
  commande_creee: "Commande créée",
  paiement_reussi: "Paiement validé (navigateur)",
  achat: "Achat payé",
  upsell_accepte: "Upsell accepté",
  relance_paiement: "Relance de paiement envoyée",
  upsell_refuse: "Upsell refusé",
};

/** Le cookie du visiteur anonyme : un identifiant aléatoire, rien d'autre. */
export const COOKIE_VISITEUR = "hi_v";

export const visiteurValide = (v: unknown): string | null =>
  typeof v === "string" && /^[A-Za-z0-9-]{8,64}$/.test(v) ? v : null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Les chemins dont le 2e segment est une clé d'accès. */
const PRIVES = new Set(["espace", "reprendre", "desinscription", "offre", "document-prive"]);

/**
 * ⚠️ UN CHEMIN ENREGISTRÉ NE PORTE JAMAIS DE CLÉ. Le lien de l'espace client, le
 * lien de reprise ou de désinscription SONT des accès : les stocker en clair
 * reviendrait à ouvrir ces comptes à quiconque lit la table. La requête (`?o=`,
 * identifiant de commande) est retirée d'office, et tout segment qui ressemble à
 * un identifiant est remplacé par `:id`.
 */
export function normaliserChemin(v: unknown): string | null {
  if (typeof v !== "string" || !v.startsWith("/")) return null;
  const segments = v.split(/[?#]/)[0].split("/").filter(Boolean).slice(0, 6);
  const propres = segments.map((s, i) => {
    if (i === 1 && PRIVES.has(segments[0])) return ":cle";
    if (UUID.test(s) || /^(ord|lead|promo|acc)_/.test(s)) return ":id";
    if (s.length >= 16 && /\d/.test(s) && !s.includes("-")) return ":id";
    return s.replace(/[^A-Za-z0-9._:-]/g, "").slice(0, 60);
  });
  return ("/" + propres.join("/")).slice(0, 160);
}
