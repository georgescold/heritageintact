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
