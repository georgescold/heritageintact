import type { Reponses } from "./qualification";
export const OBJECTIFS = ["comprendre", "preparer", "maison", "facture", "date", "documents", "assurance-vie"] as const;
export type Objectif = (typeof OBJECTIFS)[number];
export function objectifValide(v: unknown): Objectif | undefined {
  return typeof v === "string" && OBJECTIFS.includes(v as Objectif) ? v as Objectif : undefined;
}
export function conseilOffre(p: Reponses | null | undefined) {
  const frein = p?.blocage === "securite" ? "Vous avez peur de vous démunir : la préparation commence par ce que vous devez préserver pour vous avant d’envisager une opération."
    : p?.blocage === "documents" ? "Vous ne savez pas quoi réunir : les inventaires, listes de pièces et trames de rendez-vous vous évitent de partir d’une page blanche."
    : p?.blocage === "complexite" ? "Les démarches vous paraissent compliquées : chaque support transforme les termes techniques en une question concrète à faire vérifier."
    : p?.blocage === "delegation" ? "Vous pensiez que le sujet serait traité automatiquement : ce parcours vous aide à remettre les bonnes questions sur la table."
    : p?.blocage === "ordre" ? "Vous ne savez pas par quoi commencer : le pack donne un ordre précis à vos pièces, vos questions et votre prochain échange."
    : "Vous êtes prêt à agir : profitez de cet élan pour organiser maintenant les informations que vos proches ne devront pas chercher seuls.";
  const repereAge = p?.age === "d" || p?.age === "e"
    ? "Votre tranche d’âge rend notamment les repères autour de 70 ans utiles à faire vérifier sans repousser."
    : p?.age === "c" ? "Vous approchez de repères d’âge qui méritent d’être compris avant de décider."
    : "";
  if (p?.objectif === "assurance-vie" && p.av === "O") return {
    titre: "La personne que vous voulez protéger est-elle bien celle que votre contrat désigne ?",
    raison: "Un contrat rangé depuis des années peut vous rassurer sans répondre à la question essentielle : que prévoit-il aujourd’hui ? Vous avez choisi ce sujet ; passez maintenant de la supposition à une demande précise. " + frein + " " + repereAge,
  };
  const famille = p?.enfants === "R" ? "Votre famille comprend des enfants d’une autre union : une fiche dédiée vous aide à préparer les questions propres à votre famille."
    : p?.vie === "V" ? "Après un veuvage, distinguer ce qui a déjà été transmis de ce qui vous appartient encore est un point de départ important."
    : p?.vie === "P" || p?.vie === "U" ? "Votre situation de couple mérite des questions précises : la fiche PACS et union libre vous sert de point de départ."
    : p?.enfants === "0" ? "Sans enfant, la préparation de vos souhaits et des personnes à protéger mérite une attention particulière."
    : "Vos priorités familiales donnent l’ordre de votre préparation, pas une liste de documents à remplir au hasard.";
  return {
    titre: p?.objectif === "maison" ? "Vous voulez leur laisser la maison, pas une vente forcée pour trouver l’argent."
      : p?.objectif === "facture" ? "Ne laissez pas vos enfants découvrir la facture quand il sera trop tard pour vous poser leurs questions."
      : p?.objectif === "date" ? "Une date passée ne se rattrape pas. Donnez maintenant un ordre à votre préparation."
      : p?.objectif === "documents" ? "Ne laissez pas vos proches ouvrir chaque tiroir pendant leur deuil."
      : p?.enfants === "R" ? "Vous voulez protéger chacun. Ne laissez pas vos enfants découvrir vos intentions en les interprétant."
      : p?.vie === "V" ? "Vous savez ce que c’est de rester seul face aux papiers. Préparez ce que vous voudriez leur épargner."
      : p?.vie === "P" || p?.vie === "U" ? "Vous partagez votre vie. Mais avez-vous vérifié ce qui reviendrait à l’autre ?"
      : p?.enfants === "0" ? "Sans enfant ne veut pas dire sans personne à protéger. Ne laissez pas vos souhaits dans le silence."
      : p?.av === "O" ? "La maison est payée. Les contrats sont signés. Et si l’essentiel restait à clarifier ?"
      : "Vous avez construit cette maison pour eux. Ne leur laissez pas aussi toutes les questions.",
    raison: famille + " " + frein + " " + repereAge,
  };
}
export const CHANGEMENTS = [
  ["Retrouver le fil", "Une méthode en huit étapes pour distinguer votre priorité, les informations connues et les questions en suspens."],
  ["Préparer sans partir de zéro", "Des modèles pour rassembler les pièces, demander le rendez-vous et conserver les réponses."],
  ["Tenir compte de votre famille", "Douze fiches de situations, avec un point de départ mis en avant selon vos réponses."],
  ["Comprendre ce qu’un calcul suppose", "Un atelier pédagogique avec hypothèses visibles et comparaison de deux scénarios couverts."],
] as const;
