import type { ProductSku } from "@/lib/config";

/**
 * LES FICHES DE LA BOUTIQUE.
 *
 * ⚠️ RÈGLE D'ÉCRITURE, ET C'EST LA PLUS IMPORTANTE DU DOSSIER : le value
 * stacking liste des CHANGEMENTS, pas des livrables (`05-funnel/teardowns.md`,
 * correction n°4). Personne n'achète une liste de pièces à rassembler ; on
 * achète de ne plus arriver chez le notaire en ayant l'air de découvrir son
 * propre dossier. `changements` porte donc ce que le lecteur saura faire, et
 * `contenu` — secondaire, affiché plus bas — ce qu'il recevra.
 *
 * ⚠️ Vocabulaire proscrit par le même fichier : « découvrir », « offert »,
 * « payez-moi ». Aucun de ces mots ici.
 *
 * ⚠️ CE QUI EST VENDU EST UN RÉSULTAT, JAMAIS UN PRODUIT (loi 4). Le titre de
 * chaque fiche est donc la phrase du résultat ; le nom commercial vient après.
 */

export type FicheBoutique = {
  /** Le résultat, en une phrase. C'est le titre affiché. */
  resultat: string;
  /** Ce que le lecteur saura faire. Trois à cinq, jamais des livrables. */
  changements: string[];
  pourQui: string;
  /** Ce que ce guide ne fait PAS. Lever l'objection avant qu'elle ne se pose. */
  limite: string;
};

export const BOUTIQUE: Partial<Record<ProductSku, FicheBoutique>> = {
  front: {
    resultat: "Savoir ce que l’État prendra, et ce qui reste évitable",
    changements: [
      "Vous mettez un chiffre sur ce que vos enfants paieraient aujourd’hui, au lieu de le redouter sans le connaître.",
      "Vous repérez, parmi sept erreurs courantes, celles qui vous concernent vraiment — et celles dont vous pouvez cesser de vous inquiéter.",
      "Vous savez lesquelles de vos décisions dépendent d’une date, et laquelle de ces dates vous concerne en premier.",
      "Vous cessez d’être exclu du vocabulaire : usufruit, abattement, clause bénéficiaire redeviennent des questions concrètes.",
    ],
    pourQui:
      "Vous avez plus de 60 ans, une maison payée, des enfants, et vous n’avez jamais rien chiffré.",
    limite:
      "Ce guide explique les repères ; il ne calcule pas votre situation et ne décide rien à votre place.",
  },
  bump: {
    resultat: "Arriver chez le notaire avec vos questions, repartir avec ses réponses",
    changements: [
      "Vous arrivez au rendez-vous avec vos pièces réunies, au lieu de découvrir sur place ce qui manque.",
      "Vous posez trois questions précises plutôt que « qu’est-ce que vous me conseillez ».",
      "Vous savez à l’avance ce qui sera facturé et ce qui ne l’est pas.",
      "Vous repartez avec une trace écrite des réponses, au lieu de les reconstituer de mémoire une semaine plus tard.",
    ],
    pourQui: "Vous avez un rendez-vous prévu, ou vous voulez enfin en prendre un.",
    limite:
      "Il prépare l’échange avec le professionnel ; il ne remplace ni son analyse ni sa responsabilité.",
  },
  upsell1: {
    resultat: "Obtenir l’ordre exact des vérifications, à partir de votre situation",
    changements: [
      "Vous voyez votre estimation avec les hypothèses affichées, et non un chiffre sorti d’une boîte noire.",
      "Vous identifiez ce qui, chez vous, change réellement le résultat — et ce qui n’y change rien.",
      "Vous obtenez l’ordre dans lequel traiter vos vérifications, au lieu de tout regarder en même temps.",
      "Vous repérez les points propres à votre famille : recomposition, protection future, avenir de la maison.",
      "Vous remettez au professionnel un dossier qu’il peut lire en cinq minutes.",
    ],
    pourQui:
      "Votre situation a une particularité — famille recomposée, bien locatif, proche vulnérable — ou vous voulez simplement savoir par quoi commencer.",
    limite:
      "L’estimation est conditionnelle et reste à confirmer par un professionnel. Ce n’est pas une consultation.",
  },
  upsell2: {
    resultat: "Savoir qui votre contrat d’assurance-vie protège réellement",
    changements: [
      "Vous obtenez la clause bénéficiaire réellement enregistrée, et non celle dont vous vous souvenez.",
      "Vous comprenez pourquoi la date de vos versements change le régime applicable, et de quel côté vous êtes.",
      "Vous savez quoi demander à votre assureur, par écrit, et quoi faire de sa réponse.",
      "Vous traitez la question pendant qu’une correction reste possible.",
    ],
    pourQui:
      "Vous détenez au moins un contrat, souvent ouvert il y a longtemps, et vous ne l’avez jamais relu.",
    limite:
      "Il vous aide à lire et à demander ; il ne modifie aucun contrat et ne vend aucun placement.",
  },
  backend4: {
    resultat: "Transformer ce que vous avez dit à voix haute en volontés vérifiables",
    changements: [
      "Vous savez si un testament se justifie dans votre situation, ou s’il est inutile.",
      "Vous écrivez ce que vous voulez pour chaque personne et chaque bien, avec votre raison.",
      "Vous détectez les contradictions entre vos volontés, vos donations passées et vos contrats.",
      "Vous remettez au notaire un projet clair à vérifier et à formaliser, au lieu d’une conversation.",
    ],
    pourQui:
      "Vous avez des intentions précises que personne n’a écrites, ou une situation où la loi ne prévoit pas ce que vous souhaitez.",
    limite:
      "Il prépare la formalisation ; la rédaction et la validité relèvent du notaire.",
  },
};

/**
 * L'ordre d'affichage. Le produit d'appel d'abord — c'est le seul achetable
 * directement, et le point d'entrée de tout le reste.
 */
export const ORDRE_BOUTIQUE: ProductSku[] = ["front", "upsell1", "upsell2", "backend4", "bump"];
