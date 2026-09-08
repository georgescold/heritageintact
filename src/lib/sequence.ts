import { FOUNDERS_CAP, PRIX_APRES_FONDATEURS, PRODUCTS, SITE_URL, euros } from "./config";

/**
 * La séquence de sept jours, un levier CEO par jour (`09-emails.md`).
 *
 * ⚠️ Ce qui a changé par rapport au brouillon du dossier.
 *
 * Les J6 et J7 écrits à l'origine annonçaient « je ferme cette vague demain
 * soir à minuit ». Cette vague n'existe pas : rien dans le code ne ferme quoi
 * que ce soit à minuit. Annoncer une offre limitée dans le temps qui ne l'est
 * pas est une pratique commerciale trompeuse au sens de l'article L121-4 du
 * code de la consommation, qui la cite nommément — et c'est le genre de chose
 * qu'un destinataire vérifie en revenant sur la page le lendemain.
 *
 * Les deux urgences utilisées ici sont réelles et vérifiables :
 *   — les places au prix fondateur (FOUNDERS_CAP), compteur branché en base ;
 *   — le 31 décembre 2026, date votée au Parlement (art. 790 A bis du CGI).
 */

export type Etape = {
  /** Clé de traçage : ne repart jamais deux fois. */
  cle: string;
  /** Jours écoulés depuis l'inscription avant l'envoi. */
  jour: number;
  levier: string;
  objet: (prenom: string) => string;
  corps: (prenom: string) => string[];
  bouton: { texte: string; chemin: string };
  ps?: string;
};

const VIDEO = "/methode";
const COMMANDE = "/commande";

export const SEQUENCE: Etape[] = [
  {
    cle: "j1",
    jour: 1,
    levier: "Encourager les rêves",
    objet: () => "« Il avait tout prévu »",
    corps: (p) => [
      `${p},`,
      "Il y a une phrase qu'on entend parfois, après un enterrement, autour d'un café.",
      "<em>« Il avait tout prévu. On n'a eu à s'occuper de rien. »</em>",
      "On la dit avec une sorte de gratitude. Pas pour l'argent — pour la tranquillité. Le dossier était dans le tiroir du bureau. Le notaire avait déjà tout. Les enfants n'ont pas eu à se regarder en chiens de faïence au sujet de la maison.",
      "Cette phrase-là ne se prépare pas en une semaine. Elle se prépare de son vivant, avec un plan simple, qu'on peut expliquer à son conjoint en dix minutes.",
      "Imaginez un dimanche : votre fille vous annonce qu'elle a signé pour son appartement. L'apport, c'était vous. Vous l'avez vu. La maison ? Elle restera. C'est réglé. Vos petits-enfants ? Vous savez déjà ce que chacun recevra, et quand.",
      "Ce n'est pas réservé aux familles « qui ont des montages ». C'est écrit dans le Code général des impôts, pour tout le monde. Il faut simplement le savoir, et agir avant que les dates soient passées.",
    ],
    bouton: { texte: "Revoir la présentation", chemin: VIDEO },
  },
  {
    cle: "j2",
    jour: 2,
    levier: "Excuser les échecs",
    objet: (p) => `Ce n'est pas votre faute, ${p}`,
    corps: (p) => [
      `${p},`,
      "Si vous n'avez encore rien réglé pour votre succession, voici ce que personne ne vous dit : <strong>ce n'est pas votre faute.</strong> C'est un système.",
      "Votre banquier vous a vendu une assurance-vie il y a vingt ans. Il est rémunéré sur les frais du contrat, pas sur ce que vos enfants paieront un jour. Il n'est pas malhonnête — il n'est pas payé pour ça.",
      "Le notaire est payé à l'acte. Il intervient quand on l'appelle, c'est-à-dire presque toujours après.",
      "L'État encaisse. Il n'a aucune raison de vous expliquer comment lui donner moins.",
      "Et par-dessus tout ça, on a rendu le sujet illisible. Usufruit, nue-propriété, clause démembrée, rapport à succession. Personne ne parle comme ça à table. Alors on remet à plus tard, comme neuf familles sur dix.",
      "Vous avez fait confiance au silence. Tout le monde le fait. La seule différence entre vous et les familles qui transmettent intact, ce n'est pas l'argent : c'est que quelqu'un leur a expliqué <strong>les mêmes articles de loi que les vôtres</strong>, dix ans avant, et dans le bon ordre.",
    ],
    bouton: { texte: "Voir les 3 décisions", chemin: VIDEO },
  },
  {
    cle: "j3",
    jour: 3,
    levier: "Réduire les peurs",
    objet: () => "Les 3 dates",
    corps: (p) => [
      `${p},`,
      "Je vous ai promis trois dates. Les voici, en clair.",
      "<strong>Première date : le compteur des 15 ans.</strong> L'abattement de 100 000 € par parent et par enfant se recharge tous les quinze ans — mais seulement si on l'a utilisé une première fois. Une donation à 62 ans, une autre à 77 : 200 000 € par enfant, sans droits. Rien jusqu'au décès : 100 000 €. Chaque année sans donation est une année perdue, et elle ne revient pas.",
      "<strong>Deuxième date : votre 70e anniversaire.</strong> Ce qu'on verse sur une assurance-vie avant cet anniversaire se transmet jusqu'à 152 500 € par bénéficiaire, sans droits. Après : 30 500 € au total, pour tous les bénéficiaires et tous les contrats réunis. La même somme, pas le même traitement.",
      "<strong>Troisième date : votre 71e anniversaire.</strong> Donner les murs de sa maison en gardant l'usage à vie, c'est possible. Avant 71 ans, la valeur transmise est calculée sur 60 %. À partir de 71 ans, sur 70 %. Dix points de patrimoine, pour un anniversaire.",
      "Ce qui fait peur dans une succession, ce n'est pas la loi. C'est le temps, et le fait de découvrir ces dates <em>après</em>.",
      "La bonne nouvelle : maintenant vous les connaissez. Reste à savoir laquelle vous concerne le plus, et quoi faire — sans rien vendre, sans rien quitter, sans vous déposséder de quoi que ce soit.",
    ],
    bouton: { texte: "Savoir laquelle me concerne", chemin: VIDEO },
  },
  {
    cle: "j4",
    jour: 4,
    levier: "Confirmer les doutes",
    objet: () => "« Ma situation est particulière »",
    corps: (p) => [
      `${p},`,
      "Vous vous dites peut-être : <em>« C'est bien joli, mais ma situation est particulière. »</em>",
      "Vous avez raison.",
      "Un enfant divorcé, un autre en couple sans être marié. Un studio locatif acheté « pour la retraite ». Une maison de vacances à trois. Une famille recomposée. Un contrat ouvert avant 70 ans, un autre après. Une donation faite en 2011 de la main à la main, jamais déclarée.",
      "Je n'ai jamais vu de situation qui ne soit pas particulière. C'est exactement pour ça que la méthode ne commence pas par une théorie : elle commence par <strong>votre chiffre</strong> et <strong>vos dates</strong>. L'étape 7 vous oriente ensuite selon votre situation familiale, parmi douze.",
      "Autre doute légitime : <em>« Il faudra de toute façon aller chez le notaire. »</em> Oui. Et c'est précisément le point. Y aller avec un dossier et des décisions plutôt que les mains vides change tout. Le notaire acte ce que vous demandez ; sans dossier, vous ressortez avec « revenez quand vous saurez ».",
      `Dernier doute : <em>« ${euros(PRODUCTS.front.price)} sur internet, à mon âge ? »</em> Garantie 30 jours, sans justification à fournir, et vous gardez le simulateur. Vous ne pouvez pas y perdre.`,
    ],
    bouton: { texte: "Revoir la présentation", chemin: VIDEO },
  },
  {
    cle: "j5",
    jour: 5,
    levier: "Jeter la pierre à l'ennemi",
    objet: () => "Personne n'est payé pour vous prévenir",
    corps: (p) => [
      `${p},`,
      "Les abattements sur les successions n'ont pas bougé depuis 2012.",
      "Le prix des maisons, lui, a explosé. Résultat : chaque année, des familles qui se croyaient « moyennes » basculent dans la tranche à 20 %. Une maison de province et des économies suffisent.",
      "Et personne ne le leur dit. Ni la banque, ni le notaire, ni l'État. Chacun a une bonne raison, aucun n'est malhonnête. C'est simplement que <strong>personne n'est payé pour prévenir</strong>.",
      "Les familles qui transmettent intact, celles dont on dit qu'« elles ont des montages », n'ont pas de montages. Elles ont eu l'information dix ans avant. Toute la différence est là : pas l'argent, l'information et le moment.",
      "Il y a donc deux camps : ceux qui se servent en silence, et ceux qui ont décidé de savoir.",
    ],
    bouton: { texte: "Passer dans le second camp", chemin: VIDEO },
  },
  {
    cle: "j6",
    jour: 6,
    levier: "Urgence — la rareté réelle",
    objet: () => `L’offre à ${euros(PRODUCTS.front.price)}, et pourquoi elle existe`,
    corps: (p) => [
      `${p},`,
      "Je serai bref.",
      `La Méthode complète vaut ${euros(PRODUCTS.front.anchor)}. Elle est à ${euros(PRODUCTS.front.price)} pour les ${FOUNDERS_CAP} premiers membres, puis à ${euros(PRIX_APRES_FONDATEURS)}. Le compteur est réel, il est affiché sur la page de commande, et il ne se réinitialise pas.`,
      "La raison est simple et je préfère la dire : j'ai besoin des retours des premiers membres pour améliorer le simulateur. En échange, ils gardent ce prix à vie, mises à jour comprises.",
      "Ce que vous recevez, dans l'ordre où il faut le faire : les 7 erreurs et leurs corrections, le Simulateur de Facture Invisible, le Calendrier de vos 3 dates, le Plan en 1 page, les 12 questions au notaire, et la lettre pour en parler à vos enfants. Garantie 30 jours, et vous gardez le simulateur.",
      "Mais la vraie urgence n'est pas le prix. C'est celle de vos 3 dates qui arrive le plus vite — et à ce stade, vous ne savez toujours pas laquelle c'est.",
    ],
    bouton: { texte: "Accéder à la méthode", chemin: COMMANDE },
  },
  {
    cle: "j7",
    jour: 8,
    levier: "Closing — la seule date qui ne bouge pas",
    objet: (p) => `Une question, ${p}, et j'arrête`,
    corps: (p) => [
      `${p},`,
      "Une seule question, et je vous laisse tranquille.",
      "<strong>Si vos enfants étaient assis dans le bureau du notaire demain matin, quel chiffre verraient-ils ?</strong>",
      "Si vous ne savez pas, c'est que la réponse est encore modifiable. C'est la seule bonne nouvelle de ce message.",
      "Deux compteurs tournent pendant que vous lisez. Le premier est le vôtre : les quinze ans d'une donation ne commencent à courir que le jour de la signature, et chaque mois d'attente recule d'autant la date où l'abattement se recharge. Le second est commun à tout le monde : la fenêtre des 100 000 € exonérés ferme le 31 décembre 2026, et elle n'a pas été prolongée.",
      "Vous n'avez pas construit ce que vous avez au hasard. Vous ne le transmettrez pas au hasard non plus.",
    ],
    bouton: { texte: "Connaître mon chiffre", chemin: COMMANDE },
    ps: "Garantie 30 jours, sans justification. Vous gardez le simulateur même si vous demandez le remboursement.",
  },
];

export const lien = (chemin: string) => `${SITE_URL}${chemin}`;
