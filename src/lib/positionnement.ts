import type { Reponses } from "./qualification";
export const OBJECTIFS = ["comprendre", "preparer", "assurance-vie"] as const;
export type Objectif = (typeof OBJECTIFS)[number];
export function objectifValide(v: unknown): Objectif | undefined {
  return typeof v === "string" && OBJECTIFS.includes(v as Objectif) ? v as Objectif : undefined;
}
export function conseilOffre(p: Reponses | null | undefined) {
  if (p?.objectif === "assurance-vie" && p.av === "O") return {
    titre: "La personne que vous voulez protéger est-elle bien celle que votre contrat désigne ?",
    raison: "Un contrat rangé depuis des années peut vous rassurer sans répondre à la question essentielle : que prévoit-il aujourd’hui ? Vous avez choisi ce sujet ; passez maintenant de la supposition à une demande précise.",
  };
  const famille = p?.enfants === "R" ? "Votre famille comprend des enfants d’une autre union : une fiche dédiée vous aide à préparer les questions propres à votre famille."
    : p?.vie === "V" ? "Après un veuvage, distinguer ce qui a déjà été transmis de ce qui vous appartient encore est un point de départ important."
    : p?.vie === "P" || p?.vie === "U" ? "Votre situation de couple mérite des questions précises : la fiche PACS et union libre vous sert de point de départ."
    : p?.enfants === "0" ? "Sans enfant, la préparation de vos souhaits et des personnes à protéger mérite une attention particulière."
    : "Vos priorités familiales donnent l’ordre de votre préparation, pas une liste de documents à remplir au hasard.";
  return {
    titre: p?.enfants === "R" ? "Vous voulez protéger chacun. Ne laissez pas vos enfants découvrir vos intentions en les interprétant."
      : p?.vie === "V" ? "Vous savez ce que c’est de rester seul face aux papiers. Préparez ce que vous voudriez leur épargner."
      : p?.vie === "P" || p?.vie === "U" ? "Vous partagez votre vie. Mais avez-vous vérifié ce qui reviendrait à l’autre ?"
      : p?.enfants === "0" ? "Sans enfant ne veut pas dire sans personne à protéger. Ne laissez pas vos souhaits dans le silence."
      : p?.av === "O" ? "La maison est payée. Les contrats sont signés. Et si l’essentiel restait à clarifier ?"
      : "Vous avez construit cette maison pour eux. Ne leur laissez pas aussi toutes les questions.",
    raison: famille,
  };
}
export const CHANGEMENTS = [
  ["Retrouver le fil", "Une méthode en huit étapes pour distinguer votre priorité, les informations connues et les questions en suspens."],
  ["Préparer sans partir de zéro", "Des modèles pour rassembler les pièces, demander le rendez-vous et conserver les réponses."],
  ["Tenir compte de votre famille", "Douze fiches de situations, avec un point de départ mis en avant selon vos réponses."],
  ["Comprendre ce qu’un calcul suppose", "Un atelier pédagogique avec hypothèses visibles et comparaison de deux scénarios couverts."],
] as const;
