import type { Reponses } from "./qualification";
/** Une fiche de départ, sans rendre les autres fiches inaccessibles. */
export function planPrincipal(p: Reponses | null): string | null {
  if (p?.enfants === "R") return "plan-famille-recomposee";
  if (p?.enfants === "0") return "plan-sans-enfant";
  if (p?.vie === "P" || p?.vie === "U") return "plan-concubins-pacs";
  if (p?.vie === "V") return "plan-veuf-veuve";
  if (p?.vie === "M" && p.enfants === "1") return "plan-marie-1-enfant";
  if (p?.vie === "M" && p.enfants === "2") return "plan-marie-2-enfants";
  return null;
}
export function selectionParDefaut(cles: string[], p: Reponses | null): string[] {
  const plan = planPrincipal(p);
  const base = [
    "ma-situation",
    "trois-poches",
    "fiche-famille",
    "inventaire",
    "pieces-a-apporter",
    "questions-notaire",
    "plan-en-1-page",
  ];
  return cles.filter((c) => base.includes(c) || c === plan);
}
