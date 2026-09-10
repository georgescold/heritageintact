/** Une recommandation liée au besoin, jamais un diagnostic fiscal. */
export const QUALIFICATION_ACTIVE = true;
export type Reponses = {
  vie?: string;
  enfants?: string;
  av?: string;
  age?: string;
  objectif?: string;
  blocage?: string;
};
export type Ecran =
  | "plan"
  | "assurance-vie"
  | "pack"
  | "pack-notaire"
  | "plan-notaire"
  | "assurance-vie-notaire"
  | "simulateur";
export function codeUtile(code?: string) {
  const c = code?.trim();
  return c && c !== "X" ? c : undefined;
}
export function sequence(r: Reponses | null, _opts: { bumpPresent: boolean }): Ecran[] {
  void _opts;
  if (r?.objectif === "assurance-vie" && r.av === "O") return ["assurance-vie"];
  return [r?.av === "O" ? "pack" : "plan"];
}
export function piste(r: Reponses | null, opts: { bumpPresent: boolean }) {
  return "v2-" + (sequence(r, opts)[0] ?? "accueil");
}
export const ROUTE: Record<Ecran, string> = {
  plan: "/plan-complet",
  "assurance-vie": "/kit-assurance-vie",
  pack: "/dossier-complet",
  "pack-notaire": "/offre/pack3",
  "plan-notaire": "/offre/pack2",
  "assurance-vie-notaire": "/offre/pack4",
  simulateur: "/simulateur-seul",
};
export const LIBELLE: Record<Ecran, string> = {
  plan: "Votre préparation",
  "assurance-vie": "Votre assurance-vie",
  pack: "Votre préparation complète",
  "pack-notaire": "Votre préparation",
  "plan-notaire": "Votre préparation",
  "assurance-vie-notaire": "Votre assurance-vie",
  simulateur: "Votre atelier",
};
export function urlEcran(e: Ecran, id: string, _position: number) {
  void _position;
  return `${ROUTE[e]}?o=${encodeURIComponent(id)}`;
}
