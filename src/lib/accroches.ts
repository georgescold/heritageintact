/**
 * LE TITRE DU PREMIER ÉCRAN DE VENTE — module pur, sans base, sans React.
 *
 * `qualification.ts` décide QUELS écrans sont montrés et dans quel ordre. Ce
 * fichier décide de ce qui est écrit en haut du PREMIER d'entre eux, et de rien
 * d'autre : le second écran garde sa copie standard. Un acheteur qui voit deux
 * écrans personnalisés d'affilée ne se sent pas compris, il se sent profilé.
 *
 * ═══ LA RÈGLE DE DÉPARTAGE, UNE SEULE ═══
 *
 * LA PORTE DATÉE L'EMPORTE SUR LE TAUX PERMANENT, parce qu'une porte se referme
 * et qu'un taux ne bouge pas. À portes égales, le taux le plus élevé gagne.
 *
 * Cette règle est encodée par l'ORDRE de la liste ci-dessous, pas par un calcul :
 * une liste ordonnée se relit et se vérifie à l'œil, un score ne se vérifie pas.
 *
 * ═══ LE MOTIF QUI PERD N'EST PAS JETÉ ═══
 *
 * La deuxième accroche applicable devient le `h2`. C'est ce qui évite le choix
 * cornélien entre « il est veuf » et « il a 70 ans » : les deux sont vrais, les
 * deux sont dits, dans l'ordre de leur urgence. S'il n'y a qu'un motif, il n'y a
 * qu'un titre.
 *
 * ═══ CONTRAINTE JURIDIQUE, À RESPECTER MOT À MOT ═══
 *
 * CHAQUE PHRASE DÉCRIT UN RÉGIME FISCAL. AUCUNE NE RECOMMANDE UN PLACEMENT.
 * Le site n'a pas le statut CIF, et la frontière est nette :
 *
 *   · « Avant 70 ans, l'article 990 I retient 152 500 € par bénéficiaire » est
 *     un FAIT : c'est ce que la loi fait.
 *   · « Versez avant vos 70 ans » est une RECOMMANDATION D'INVESTISSEMENT :
 *     c'est ce que le lecteur devrait faire de son argent. Interdit.
 *
 * Le test à appliquer à toute phrase ajoutée ici, avant mise en ligne : est-ce
 * qu'elle dit ce que LA LOI FAIT, ou ce que LE LECTEUR DEVRAIT FAIRE ?
 *
 * Et trois précisions de fond, chacune déjà écrite de travers ailleurs :
 *
 *   1. Après 70 ans, ce sont les PRIMES VERSÉES qui changent de régime
 *      (art. 757 B du CGI), jamais le contrat, jamais sa date d'ouverture,
 *      jamais ses gains. Écrire « votre assurance-vie sera taxée » est faux, et
 *      faux d'une manière qu'un lecteur bien conseillé repère en une lecture.
 *   2. À 65 ans, « il vous reste moins de cinq anniversaires » est faux :
 *      on écrit « cinq ans au plus ».
 *   3. On n'a pas demandé au lecteur s'il avait déjà donné. Toute phrase sur
 *      son compteur de quinze ans est au CONDITIONNEL, ou n'est pas écrite.
 *
 * Aucune promesse de résultat, aucun montant personnalisé, aucun compte à
 * rebours, aucune offre qui ferme à minuit.
 */
import { DOCUMENTS } from "@/lib/methode";
import { codeUtile, type Reponses } from "@/lib/qualification";

export type Accroche = {
  /** Le titre du premier écran. Toujours présent : A11 est le filet. */
  h1: string;
  /** Le motif qui perd le départage. Absent s'il n'y en a qu'un. */
  h2?: string;
  /** Une ligne ajoutée AU-DESSUS du titre retenu. Ne remplace jamais un titre. */
  chapeau?: string;
};

/**
 * LA FEUILLE EST-ELLE RÉELLEMENT LIVRÉE ?
 *
 * ⚠️ C'EST UN VERROU, PAS UNE COMMODITÉ. /plan-complet annonce elle-même que
 * huit des douze plans-types arrivent « sous 30 jours ». Un titre qui nomme la
 * situation d'un plan non encore livré — « famille recomposée », « sans
 * enfant » — promet nommément ce qui n'est pas dans le colis, sur une garantie
 * de 30 jours et devant un acheteur de 74 ans. C'est un remboursement à 100 %,
 * et le pire genre : celui qu'on a écrit soi-même.
 *
 * La condition n'est donc pas une date dans un commentaire, c'est un test de
 * code évalué à chaque rendu. Le gel de A5 et A6 se lève tout seul le jour où la
 * feuille correspondante est déclarée dans `DOCUMENTS`, sans que personne ait à
 * se souvenir de revenir ici. Tant qu'elle n'y est pas, l'accroche suivante
 * applicable prend la main, et A11 en dernier recours.
 */
function planLivre(cle: string): boolean {
  return DOCUMENTS.some((d) => d.cle === cle);
}

/**
 * L'ACCROCHE DU PREMIER ÉCRAN POUR CET ACHETEUR.
 *
 * Liste ordonnée, le premier applicable devient `h1`, le deuxième devient `h2`.
 * `r === null` (aucune réponse, ou dispositif inactif) tombe sur A11, qui est le
 * titre actuel de la page : le comportement par défaut est l'existant.
 */
export function accroches(r: Reponses | null): Accroche {
  const vie = codeUtile(r?.vie);
  const enfants = codeUtile(r?.enfants);
  const av = codeUtile(r?.av);
  const age = codeUtile(r?.age);

  /** `true` quand le lecteur a un contrat, ou n'est pas sûr d'en avoir un. */
  const contratPossible = av === "O" || av === "?";

  // ═══ LA LISTE ORDONNÉE ═══
  // L'ordre EST la règle de départage : ne pas réordonner sans relire l'en-tête.
  const candidats: Array<{ actif: boolean; texte: string }> = [
    {
      // A1 — la porte datée la plus proche de toutes : cinq ans au plus.
      // Le sujet de la phrase est la PRIME, jamais le contrat : c'est la prime
      // versée qui change de régime au passage des 70 ans.
      actif: age === "b" && contratPossible,
      texte:
        "Avant vos 70 ans, c’est-à-dire dans cinq ans au plus, chaque bénéficiaire de votre contrat dispose de 152 500 € hors succession sur les primes que vous avez versées. Sur les primes versées après cette date, c’est un abattement unique de 30 500 €, partagé entre tous. Le contrat ne change pas. La date du versement, si.",
    },
    {
      // A2 — le veuvage. Ce n'est pas un taux, c'est une erreur matérielle très
      // fréquente, et elle se corrige par un courrier : on décrit un fait et un
      // geste administratif, jamais un arbitrage de placement.
      actif: vie === "V" && contratPossible,
      texte:
        "Une chose à vérifier avant les autres : sur beaucoup de contrats, la clause bénéficiaire désigne encore l’époux disparu. Quand c’est le cas, le capital rejoint la succession et perd son régime propre. Cela se corrige par courrier.",
    },
    {
      // A3 — le concubinage : la ligne la plus lourde du barème français.
      // Le taux le plus élevé passe donc devant les autres taux.
      actif: vie === "U",
      texte:
        "Entre concubins, l’abattement est de 1 594 €, puis le taux est de 60 %. C’est la ligne la plus lourde du barème français, et c’est le seul cas où l’ordre des décisions ne se discute pas.",
    },
    {
      // A4 — le PACS. Deux phrases vraies en même temps, et c'est précisément
      // leur coexistence qui piège : exonéré n'est pas héritier.
      actif: vie === "P",
      texte:
        "Le PACS exonère votre partenaire de droits de succession. Il ne le fait pas hériter : sans testament qui le désigne, il ne reçoit rien. Les deux phrases sont vraies en même temps.",
    },
    {
      // A5 — GELÉE tant que la feuille n'est pas livrée. Voir `planLivre`.
      actif: enfants === "R" && planLivre("plan-famille-recomposee"),
      texte:
        "L’enfant de votre conjoint que vous n’avez pas adopté n’est pas héritier en ligne directe : au-delà de 1 594 €, sa part relève du taux de 60 %. Et la donation au dernier vivant, efficace en famille classique, est précisément ce qui peut réduire la part des enfants d’un premier lit.",
    },
    {
      // A6 — GELÉE tant que la feuille n'est pas livrée. Voir `planLivre`.
      actif: enfants === "0" && planLivre("plan-sans-enfant"),
      texte:
        "Sans enfant, la loi appelle vos frères et sœurs, puis vos neveux et nièces (55 %), puis des parents plus éloignés (60 %). Il n’y a plus d’abattement en ligne directe : l’ordre est écrit, et il ne tient aucun compte de ce que vous auriez voulu.",
    },
    {
      // A7 — 70 ans : une porte vient de se refermer, une autre se referme au
      // prochain anniversaire. On décrit le barème de l'article 669, on ne
      // conseille aucun démembrement.
      actif: age === "c",
      texte:
        "Vous avez 70 ans. Une porte s’est refermée cette année. Une autre se referme à votre prochain anniversaire : jusqu’à 71 ans, l’article 669 du CGI compte la nue-propriété à 60 % de la valeur du bien ; à partir de 71 ans, à 70 %.",
    },
    {
      // A8 — 71 ans et plus. Les deux dates datées sont derrière : on le dit
      // comme une bonne nouvelle, parce que c'en est une, et parce qu'un
      // acheteur de 78 ans à qui on annonce qu'il est en retard n'achète pas.
      actif: age === "d",
      texte:
        "Deux de vos trois dates sont derrière vous, et c’est une bonne nouvelle : la troisième ne se referme jamais. L’abattement de 100 000 € par parent et par enfant se reconstitue quinze ans après la dernière donation déclarée. Reste à savoir dans quel ordre.",
    },
    {
      // A9 — moins de 65 ans. LE CONDITIONNEL EST OBLIGATOIRE : on n'a jamais
      // demandé s'il avait déjà donné. « Il vous reste deux recharges » serait
      // le seul fait personnel inventé de tout le dispositif — et il supposerait
      // en plus de vivre jusqu'à 95 ans.
      actif: age === "a",
      texte:
        "L’abattement de 100 000 € par parent et par enfant se reconstitue quinze ans après la dernière donation déclarée. À votre âge, si aucune donation n’a encore été déclarée, ce compteur n’a jamais démarré.",
    },
  ];

  const retenus = candidats.filter((c) => c.actif).map((c) => c.texte);

  /**
   * A11 — LE DÉFAUT, qui est le titre actuel de /plan-complet, mot pour mot.
   * Il n'a aucune raison de changer : il fonctionne, et un profil vide doit
   * rendre le tunnel d'aujourd'hui à l'identique.
   * L'espace insécable avant le point d'interrogation est la typographie
   * française, et reproduit le `&nbsp;` de la page.
   */
  const A11 =
    "Avant d’accéder à votre espace, une seule question : dans VOTRE situation familiale, laquelle de vos 3 dates en premier\u00A0?";

  /**
   * LES SURIMPRESSIONS. Elles s'ajoutent AU-DESSUS du titre retenu, elles n'en
   * remplacent aucun : le chapeau parle du parcours, le titre parle de la loi.
   *
   * ⚠️ `av === "N"` doit rester STRICTEMENT distinct de l'absence de réponse.
   * Annoncer « vous nous avez dit que vous n'avez pas d'assurance-vie » à
   * quelqu'un qui n'a rien dit lui prête un propos qu'il n'a pas tenu — et sur
   * un lecteur méfiant, une seule phrase qu'il sait fausse suffit à discréditer
   * toutes les autres. `codeUtile` garantit que « X » n'arrive jamais ici.
   */
  let chapeau: string | undefined;
  if (av === "?") {
    // A10 — l'incertitude retournée en argument, sans jamais suggérer d'ouvrir
    // ni d'alimenter un contrat.
    chapeau =
      "Vous n’êtes pas certain d’avoir un contrat. C’est déjà une réponse : un contrat qu’on ne relit pas transmet selon une clause écrite le jour de son ouverture, souvent « mon conjoint, à défaut mes enfants ».";
  } else if (av === "N") {
    // A12 — on annonce ce qu'on a RETIRÉ du parcours. C'est la seule ligne du
    // dispositif qui enlève quelque chose à l'acheteur au lieu de lui vendre,
    // et c'est pour cela qu'elle vaut plus que les autres.
    chapeau =
      "Vous nous avez dit que vous n’avez pas d’assurance-vie. Nous avons donc retiré de votre parcours le dossier qui va avec : il ne vous servirait à rien.";
  }

  return {
    h1: retenus.length > 0 ? retenus[0] : A11,
    // Pas de `h2` sur A11 : s'il n'y a pas de premier motif, il n'y a pas de
    // second motif à repêcher.
    h2: retenus.length > 1 ? retenus[1] : undefined,
    chapeau,
  };
}
