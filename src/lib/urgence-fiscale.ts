/** Article 790 A bis : date légale fixe, sans stockage ni redémarrage par visiteur. */
export const FIN_EXONERATION_LOGEMENT = "2026-12-31T23:59:59+01:00";
export function secondesExonerationRestantes(now = Date.now()) {
  return Math.max(0, Math.ceil((Date.parse(FIN_EXONERATION_LOGEMENT) - now) / 1000));
}
