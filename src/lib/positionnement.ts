import type { Reponses } from "./qualification";
export const OBJECTIFS = ["comprendre", "preparer", "assurance-vie"] as const;
export type Objectif = (typeof OBJECTIFS)[number];
export function objectifValide(v: unknown): Objectif | undefined {
  return typeof v === "string" && OBJECTIFS.includes(v as Objectif) ? v as Objectif : undefined;
}
export function conseilOffre(p: Reponses | null | undefined) {
  if (p?.objectif === "assurance-vie" && p.av === "O") return {
    titre: "Vos contrats existent. Préparez maintenant les bonnes vérifications.",
    raison: "Vous souhaitez faire le point sur votre assurance-vie. Ce module vous aide à retrouver les clauses en vigueur et à demander des réponses écrites à votre assureur.",
  };
  const famille = p?.enfants === "R" ? "Votre famille comprend des enfants d’une autre union : une fiche dédiée vous aide à préparer les questions propres à votre famille."
    : p?.vie === "V" ? "Après un veuvage, distinguer ce qui a déjà été transmis de ce qui vous appartient encore est un point de départ important."
    : p?.vie === "P" || p?.vie === "U" ? "Votre situation de couple mérite des questions précises : la fiche PACS et union libre vous sert de point de départ."
    : p?.enfants === "0" ? "Sans enfant, la préparation de vos souhaits et des personnes à protéger mérite une attention particulière."
    : "Vos priorités familiales donnent l’ordre de votre préparation, pas une liste de documents à remplir au hasard.";
  return {
    titre: p?.av === "O" ? "Votre famille, vos contrats : une préparation réunie." : "Passez de « je dois m’en occuper » à un dossier que vous pouvez ouvrir.",
    raison: famille,
  };
}
export const CHANGEMENTS = [
  ["Retrouver le fil", "Une méthode en huit étapes pour distinguer votre priorité, les informations connues et les questions en suspens."],
  ["Préparer sans partir de zéro", "Des modèles pour rassembler les pièces, demander le rendez-vous et conserver les réponses."],
  ["Tenir compte de votre famille", "Douze fiches de situations, avec un point de départ mis en avant selon vos réponses."],
  ["Comprendre ce qu’un calcul suppose", "Un atelier pédagogique avec hypothèses visibles et comparaison de deux scénarios couverts."],
] as const;
