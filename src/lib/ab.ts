/**
 * LE TEST A/B DE LA PAGE D'ATTERRISSAGE (16/09/2026, demande de Loys).
 *
 *   A — la vidéo en haut, le bon de commande juste en dessous.
 *   B — pas de vidéo : le bon de commande tout de suite.
 *
 * Un visiteur sur deux, tiré à l'arrivée par `proxy.ts` et conservé 30 jours.
 * La version est attachée à chaque étape du parcours et à chaque événement
 * PostHog : c'est ce qui permet de comparer ventes et CA par version.
 *
 * ⚠️ Ce fichier n'importe RIEN : il est lu par le proxy, le serveur et le
 * navigateur.
 */
export const COOKIE_AB = "hi_ab";
export const VARIANTES = ["A", "B"] as const;
export type Variante = (typeof VARIANTES)[number];

export const varianteValide = (v: unknown): Variante | null =>
  typeof v === "string" && (VARIANTES as readonly string[]).includes(v) ? (v as Variante) : null;
