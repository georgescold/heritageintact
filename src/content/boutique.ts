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
  /**
   * CE QUE COÛTE L'INACTION, et pourquoi ce champ existe.
   *
   * « Les gens détestent perdre plus qu'ils n'aiment gagner »
   * (03-marketing-copy/biais-cognitifs.md § 8). Pour une même action demandée,
   * « fais X pour ne pas rester pauvre » convertit mieux que « fais X pour
   * devenir riche » : le biais de négativité est plus fort que le biais de
   * désir (01-principes/principes-premiers.md § Peur > Rêve).
   *
   * ⚠️ MAIS ELLE NE VIENT JAMAIS EN PREMIER. Le même fichier l'écrit : ne pas
   * ouvrir par la douleur, ça fait fuir. La séquence tenue par chaque fiche est
   * donc rêve d'abord (`resultat`, `changements`), peur ensuite (ici).
   *
   * ⚠️ Et elle reste VRAIE. La peur utilisée ici est une conséquence réelle et
   * datée du droit, pas une menace inventée : sur ce sujet, une exagération se
   * vérifie en un appel au notaire et détruit tout le reste.
   */
  perte: string;
  pourQui: string;
  /**
   * La teinte de la fiche. Elle reprend le code déjà porté par l'espace membre
   * (components/espace/Boutique.tsx) : le plan en orange, l'assurance-vie en
   * vert. Un client doit retrouver après l'achat la couleur qu'il a vue avant.
   */
  teinte: "blue" | "orange" | "green" | "brown" | "blue-mid";
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
    perte:
      "Chaque année qui passe sans que vous ayez regardé, ce sont des décisions qui se prennent toutes seules — et c’est la loi, pas vous, qui décide alors qui reçoit quoi.",
    pourQui:
      "Vous avez plus de 60 ans, une maison payée, des enfants, et vous n’avez jamais rien chiffré.",
    teinte: "blue",
  },
  bump: {
    resultat: "Arriver chez le notaire avec vos questions, repartir avec ses réponses",
    changements: [
      "Vous arrivez au rendez-vous avec vos pièces réunies, au lieu de découvrir sur place ce qui manque.",
      "Vous posez trois questions précises plutôt que « qu’est-ce que vous me conseillez ».",
      "Vous savez à l’avance ce qui sera facturé et ce qui ne l’est pas.",
      "Vous repartez avec une trace écrite des réponses, au lieu de les reconstituer de mémoire une semaine plus tard.",
    ],
    perte:
      "Un rendez-vous passé à expliquer ce que vous auriez pu lire est un rendez-vous perdu : vous le paierez au même prix, et vous repartirez avec les mêmes questions.",
    pourQui: "Vous avez un rendez-vous prévu, ou vous voulez enfin en prendre un.",
    teinte: "brown",
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
    perte:
      "Sans ordre, on traite d’abord ce qui est facile. Les points qui coûtent vraiment restent au fond du tiroir — et ce sont eux qui se referment avec le temps.",
    pourQui:
      "Votre situation a une particularité — famille recomposée, bien locatif, proche vulnérable — ou vous voulez simplement savoir par quoi commencer.",
    teinte: "orange",
  },
  upsell2: {
    resultat: "Savoir qui votre contrat d’assurance-vie protège réellement",
    changements: [
      "Vous obtenez la clause bénéficiaire réellement enregistrée, et non celle dont vous vous souvenez.",
      "Vous comprenez pourquoi la date de vos versements change le régime applicable, et de quel côté vous êtes.",
      "Vous savez quoi demander à votre assureur, par écrit, et quoi faire de sa réponse.",
      "Vous traitez la question pendant qu’une correction reste possible.",
    ],
    perte:
      "Une clause écrite il y a vingt ans désigne parfois quelqu’un qui n’est plus là, ou oublie quelqu’un qui est arrivé depuis. Personne ne s’en apercevra de votre vivant — c’est précisément le problème.",
    pourQui:
      "Vous détenez au moins un contrat, souvent ouvert il y a longtemps, et vous ne l’avez jamais relu.",
    teinte: "green",
  },
  backend4: {
    resultat: "Transformer ce que vous avez dit à voix haute en volontés vérifiables",
    changements: [
      "Vous savez si un testament se justifie dans votre situation, ou s’il est inutile.",
      "Vous écrivez ce que vous voulez pour chaque personne et chaque bien, avec votre raison.",
      "Vous détectez les contradictions entre vos volontés, vos donations passées et vos contrats.",
      "Vous remettez au notaire un projet clair à vérifier et à formaliser, au lieu d’une conversation.",
    ],
    perte:
      "Ce qui n’est pas écrit devra être deviné. Vos enfants interpréteront vos intentions au moment où ils sont le moins en état de le faire, et parfois les uns contre les autres.",
    pourQui:
      "Vous avez des intentions précises que personne n’a écrites, ou une situation où la loi ne prévoit pas ce que vous souhaitez.",
    teinte: "blue-mid",
  },
};

/**
 * L'ordre d'affichage. Le produit d'appel d'abord — c'est le seul achetable
 * directement, et le point d'entrée de tout le reste.
 */
export const ORDRE_BOUTIQUE: ProductSku[] = ["front", "upsell1", "upsell2", "backend4", "bump"];
