/** Compatibilité des anciens composants : aucun palier commercial en V2. */
export const PALIERS: { jusqua: number; remise: number; nom: string }[] = [];
export type Palier = {
  remise: number;
  nom: string;
  resteMs: number | null;
  remiseSuivante: number | null;
};
export function palierDe(date: Date | string | number, maintenant: number): Palier {
  void date;
  void maintenant;
  return { remise: 0, nom: "stable-v2", resteMs: null, remiseSuivante: null };
}
export function appliquerPalier(prix: number, remise: number) {
  void remise;
  return prix;
}
export function creditDe(prix: number, remise: number) {
  void prix;
  void remise;
  return 0;
}
export function resteEnClair(reste: number | null): string | null {
  void reste;
  return null;
}
