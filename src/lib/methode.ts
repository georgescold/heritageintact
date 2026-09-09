/**
 * LE CONTENU DE LA MÉTHODE — le chaînon qui manquait entre le catalogue et
 * l'espace membre.
 *
 * `config.ts` sait ce qu'on vend (les SKU, les prix, ce qui est disponible).
 * Il ne sait pas ce que l'acheteur REÇOIT. Ce fichier le dit, et il est la
 * seule source de vérité sur ce point : le hub, la page d'une étape, la
 * boutique, « Tout imprimer » et les emails de relance lisent tous ici.
 *
 * ═══ CE QUI EST DÉCLARÉ, ET CE QUI NE L'EST PAS ═══
 *
 * Les documents de La Méthode (front) et du Dossier notaire (bump) sont
 * déclarés avec leur contenu réel : ce sont les deux produits que l'acheteur
 * d'aujourd'hui a déjà payés.
 *
 * ⚠️ LES DOCUMENTS DU PLAN (upsell1) SE DÉCLARENT AU FUR ET À MESURE QUE LEUR
 * CONTENU EXISTE, ET SEULEMENT À CETTE CONDITION. Une entrée dans `DOCUMENTS`
 * est immédiatement visible dans « MES DOCUMENTS » et dans « Tout imprimer »
 * de quiconque possède le SKU : déclarer une feuille « contenu à produire » à
 * quelqu'un qui vient de payer 297 €, c'est le premier remboursement. La règle
 * n'est donc pas « tout ou rien », c'est « rien avant le contenu ».
 *
 * ⚠️ CE QUI RESTE VRAI : `PRODUCTS.upsell1.disponible` est à `false` et n'est
 * PAS remis à `true` par un ajout ici. Le passage à `true` est une décision de
 * livraison, prise à la main. Même chose pour l'ASSURANCE-VIE (upsell2).
 * Les douze plans-types annoncés sont désormais tous branchés (ordres 15 à 26),
 * et quatre des cinq feuilles de l'Assurance-vie le sont aussi : ce qui manque
 * encore est écrit en clair au-dessus de chaque bloc. Ouvrir la vente reste un
 * geste distinct, fait le même jour que la vérification de ce qui est livré.
 *
 * ⚠️ AUCUNE VIDÉO N'EST TOURNÉE ET AUCUNE DES 8 ÉTAPES N'EXISTE EN CONTENU.
 * `VIDEO.etapes` peut être plus court que 8, voire vide : tout appelant doit
 * traiter `VIDEO.etapes[videoIndex]` comme éventuellement absent et afficher
 * la feuille seule plutôt qu'un lecteur vide. L'espace ne doit pas être ouvert
 * au public, et surtout aucune publicité ne doit tourner, tant que l'étape 0
 * et la Facture Invisible ne sont pas livrés.
 */
import type { ReactNode } from "react";
import type { ProductSku } from "./config";
import { AbattementsDeChacun } from "@/content/documents/abattements-de-chacun";
import { Calendrier15Ans } from "@/content/documents/calendrier-15-ans";
import { CalendrierTroisDates } from "@/content/documents/calendrier-3-dates";
import { CompteRendu } from "@/content/documents/compte-rendu";
import { Decision70Ans } from "@/content/documents/decision-70-ans";
import { FicheFamille } from "@/content/documents/fiche-famille";
import { GrilleAuditAssuranceVie } from "@/content/documents/grille-audit-assurance-vie";
import { Inventaire } from "@/content/documents/inventaire";
import { LettreAuxEnfants } from "@/content/documents/lettre-aux-enfants";
import { LettreModificationClause } from "@/content/documents/lettre-modification-clause";
import { Lexique } from "@/content/documents/lexique";
import { MaSituation } from "@/content/documents/ma-situation";
import { MailRendezVous } from "@/content/documents/mail-rendez-vous";
import { PiecesAApporter } from "@/content/documents/pieces-a-apporter";
import { PlanConcubinsPacs } from "@/content/documents/plan-concubins-pacs";
import { PlanDonationsDejaFaites } from "@/content/documents/plan-donations-deja-faites";
import { PlanEnUnePage } from "@/content/documents/plan-en-1-page";
import { PlanEnfantEtranger } from "@/content/documents/plan-enfant-etranger";
import { PlanEnfantVulnerable } from "@/content/documents/plan-enfant-vulnerable";
import { PlanEntreprise } from "@/content/documents/plan-entreprise";
import { PlanFamilleRecomposee } from "@/content/documents/plan-famille-recomposee";
import { PlanImmobilierLocatif } from "@/content/documents/plan-immobilier-locatif";
import { PlanMarie1Enfant } from "@/content/documents/plan-marie-1-enfant";
import { PlanMarie2Enfants } from "@/content/documents/plan-marie-2-enfants";
import { PlanPatrimoineImportant } from "@/content/documents/plan-patrimoine-important";
import { PlanSansEnfant } from "@/content/documents/plan-sans-enfant";
import { PlanVeufVeuve } from "@/content/documents/plan-veuf-veuve";
import { QuestionsNotaire } from "@/content/documents/questions-notaire";
import { RegleMiseAJour } from "@/content/documents/regle-mise-a-jour";
import { SimulateurPapier } from "@/content/documents/simulateur-papier";
import { TableauBordFamilial } from "@/content/documents/tableau-bord-familial";
import { TroisClausesBeneficiaires } from "@/content/documents/trois-clauses-beneficiaires";
import { TroisPoches } from "@/content/documents/trois-poches";

export type EtapeMethode = {
  /**
   * "e0" … "e7".
   *
   * ⚠️ ÉCRITE EN BASE dans la colonne `progression.etape`. La renommer une
   * fois en production n'échouerait nulle part : les anciennes lignes
   * resteraient en base sous l'ancienne clé, et chaque membre verrait sa
   * progression revenir à « 0 étape sur 8 » — y compris ceux qui ont tout
   * terminé. Ces huit chaînes sont définitives.
   */
  cle: string;
  numero: number;
  titre: string;
  minutes: number;
  /** Une phrase, affichée sous le titre. */
  resume: string;
  /** L'encadré « Ce soir, faites ceci » : une seule action, jamais deux. */
  ceSoir: string;
  /**
   * CE QUE LE MEMBRE SAIT MAINTENANT — trois lignes, jamais plus.
   *
   * ⚠️ C'EST UN GAIN, PAS UN SOMMAIRE. La page d'étape disait ce qu'il y
   * avait à FAIRE (« ce soir ») et jamais ce qui venait d'être ACQUIS.
   * Quelqu'un qui termine une vidéo de douze minutes et qui ne voit
   * s'afficher qu'une tâche de plus ne se sent pas avancer : il se sent
   * en retard. Sur un parcours de huit étapes, c'est comme ça qu'on
   * abandonne à la troisième — et qu'on demande un remboursement à la
   * quatrième.
   *
   * ⚠️ VOUVOIEMENT, comme partout ailleurs dans l'espace. Le panneau qui
   * les affiche s'intitule « Ce que VOUS savez maintenant » ; une puce à la
   * première personne juste en dessous se remarque immédiatement. Et le
   * script de la vidéo dit exactement les mêmes lignes, à voix haute,
   * pendant que le membre a l'écran sous les yeux.
   *
   * Chaque ligne nomme une chose CONCRÈTE. Jamais « comprendre les enjeux
   * de la transmission » : « le montant exact que votre famille paierait
   * aujourd'hui ». Le test : si la ligne pourrait figurer sur la page de
   * vente d'un concurrent, elle est trop vague.
   *
   * Trois, parce que deux paraît maigre pour douze minutes et que quatre
   * ne se retient pas.
   */
  acquis: [string, string, string];
  /** Index dans `VIDEO.etapes`. Peut ne pas exister encore : voir l'en-tête. */
  videoIndex: number;
  /** Clés de `DOCUMENTS` rattachées à cette étape. */
  documents: string[];
};

/**
 * LES QUATRE RÉPONSES DU BON DE COMMANDE, TELLES QU'UN DOCUMENT LES REÇOIT.
 *
 * Mêmes quatre codes que `Reponses` (lib/qualification.ts) et que la table
 * `profils` (lib/db.ts) : ce type est volontairement redéfini ici plutôt
 * qu'importé, pour qu'une feuille imprimable ne dépende ni de la table de
 * routage du tunnel, ni de la base. Une feuille ne route rien et ne vend rien ;
 * elle pré-coche une case et surligne une date, c'est tout.
 *
 *   vie     : M marié(e) · P pacsé(e) · U en couple sans mariage ni PACS
 *             V veuf ou veuve · S seul(e) aujourd'hui
 *   enfants : 1 un enfant · 2 deux ou plus · R enfants d'une autre union
 *             0 pas d'enfant
 *   av      : O oui · N non · ? je ne sais plus
 *   age     : a moins de 65 · b de 65 à 69 · c 70 ans · d 71 ans ou plus
 *
 * `X` (« Je préfère ne pas répondre ») et l'absence sont strictement
 * équivalents : les documents passent donc chaque code par `codeUtile`, le
 * point d'entrée unique de cette règle dans le projet.
 *
 * ⚠️ CE TYPE NE S'ÉTEND JAMAIS. Pas de date de naissance, pas de montant, pas
 * de texte libre, et surtout aucune donnée de santé — l'enfant vulnérable est
 * la situation n° 10 de la grille et elle ne se demande JAMAIS en ligne
 * (RGPD art. 9 : donnée de santé relative à un tiers qui n'a consenti à rien).
 * Elle reste sur la feuille papier, que le lecteur coche lui-même.
 */
export type ProfilDocument = {
  vie?: string;
  enfants?: string;
  av?: string;
  age?: string;
};

export type DocumentImprimable = {
  /**
   * Slug stable. ⚠️ Il apparaît dans les URL d'impression et sera mis en
   * favori : il ne change plus.
   */
  cle: string;
  titre: string;
  /**
   * Le SKU qui débloque ce document. C'EST LA GARDE D'HABILITATION, et elle
   * doit être vérifiée à l'affichage ET à l'impression : l'URL d'une feuille
   * est devinable, comme celle de la boutique.
   */
  sku: ProductSku;
  /** Ordre dans « Tout imprimer ». C'est l'ordre du classeur, pas d'achat. */
  ordre: number;
  /**
   * Le corps du document, sans Header ni Footer : il est déjà dans `Feuille`.
   *
   * ⚠️ `profil` EST OPTIONNEL DES DEUX CÔTÉS, et ce n'est pas une commodité de
   * typage : c'est la garantie du retour en arrière. Une feuille qui l'ignore
   * s'écrit `() => ReactNode` et reste valide ; une feuille qui l'utilise doit
   * rendre exactement la même page quand il est absent. Sans réponse, le
   * classeur imprimé est celui d'aujourd'hui, à l'identique — aucune case
   * cochée, aucune date surlignée.
   */
  corps: (props: { profil?: ProfilDocument }) => ReactNode;
};

/**
 * LES 8 ÉTAPES DE LA MÉTHODE.
 *
 * ⚠️ On dit « étape » ici. Le mot n'est pas décoratif : un
 * lecteur de 74 ans qui a peur de mal faire veut un protocole — des étapes,
 * dans l'ordre, sans rien à improviser. « Module » est du vocabulaire de
 * formation en ligne, et il ne veut rien dire pour lui.
 *
 * Les durées sont imposées par le brief de production et ne s'arrondissent
 * pas : elles sont annoncées à l'écran, et une étape de 12 minutes qui en dure
 * 20 est une petite trahison de plus.
 */
export const ETAPES: EtapeMethode[] = [
  {
    cle: "e0",
    numero: 0,
    titre: "Bienvenue, et votre facture invisible",
    minutes: 14,
    resume:
      "Comment se calcule une succession en France, et le montant exact que votre famille paierait si elle s'ouvrait aujourd'hui.",
    ceSoir:
      "Remplissez la Facture Invisible avec vos vrais montants, puis reportez votre chiffre en haut du Calendrier des 3 dates.",
    acquis: [
      "Comment une succession se calcule : le total, le partage, l'abattement, puis le barème",
      "Le montant exact que votre famille paierait aujourd'hui — le vôtre, pas celui d'un exemple",
      "Vos trois dates, et laquelle arrive en premier",
    ],
    videoIndex: 0,
    documents: ["simulateur-papier", "calendrier-3-dates", "lexique"],
  },
  {
    cle: "e1",
    numero: 1,
    titre: "« Je verrai ça plus tard »",
    minutes: 10,
    resume:
      "L'abattement de 100 000 € par parent et par enfant se reconstitue tous les 15 ans. Attendre, c'est en perdre un.",
    ceSoir:
      "Écrivez la date de votre dernière donation sur le Calendrier des 3 dates — ou le mot « jamais », qui est une réponse aussi.",
    acquis: [
      "L'abattement de 100 000 € se refait à neuf tous les 15 ans, et le compteur part du papier, pas du don",
      "Ce qu'une enveloppe rechargée vaut en euros",
      "Qu'une seconde enveloppe de 31 865 € existe, et qu'elle se ferme le jour de vos 80 ans",
    ],
    videoIndex: 1,
    documents: ["trois-poches"],
  },
  {
    cle: "e2",
    numero: 2,
    titre: "Ne pas être marié, ou l'être mal",
    minutes: 11,
    resume:
      "Le conjoint marié ou pacsé ne paie aucun droit de succession. Le concubin en paie 60 % au-delà de 1 594 €.",
    ceSoir:
      "Vérifiez deux choses sur votre contrat de mariage : votre régime, et l'existence d'une donation au dernier vivant.",
    acquis: [
      "Ce que le mariage, le PACS et le concubinage changent : 0 %, 0 %, ou 60 %",
      "Que le PACS efface l'impôt mais n'ouvre pas la porte — sans testament, le partenaire ne reçoit rien",
      "Le nom exact de votre régime matrimonial, écrit noir sur blanc",
    ],
    videoIndex: 2,
    documents: [],
  },
  {
    cle: "e3",
    numero: 3,
    titre: "L'assurance-vie jamais relue",
    minutes: 12,
    resume:
      "C'est le premier levier de transmission, et le plus souvent mal réglé : la clause bénéficiaire et la date des versements décident de tout.",
    ceSoir:
      "Sortez vos contrats et répondez à trois questions : quelle est ma clause, quand ai-je versé, combien de frais.",
    acquis: [
      "Que c'est la date de chaque versement qui compte, jamais l'âge du contrat",
      "Ce que votre 70e anniversaire change : 152 500 € par bénéficiaire avant, 30 500 € pour tout le monde après",
      "Où se trouve votre clause bénéficiaire, et qu'elle se change par simple courrier",
    ],
    videoIndex: 3,
    documents: [],
  },
  {
    cle: "e4",
    numero: 4,
    titre: "La maison gardée en pleine propriété",
    minutes: 12,
    resume:
      "Donner les murs en gardant l'usage à vie : vous restez chez vous, et la valeur transmise est comptée à 60 % tant que vous n'avez pas 71 ans.",
    ceSoir:
      "Notez la valeur de votre maison et votre âge, puis lisez votre ligne du barème de l'article 669 du CGI.",
    acquis: [
      "Qu'on peut donner les murs de son logement et en garder l'usage, les loyers et la clé jusqu'au bout",
      "Ce que votre 71e anniversaire change : les murs comptent pour 60 % de la valeur, puis 70 %",
      "Ce que vous perdez en le faisant — vendre seul — et ce que vous gardez",
    ],
    videoIndex: 4,
    documents: [],
  },
  {
    cle: "e5",
    numero: 5,
    titre: "Le don de la main à la main",
    minutes: 9,
    resume:
      "Un don non déclaré reste un don : il se découvre au décès, il se recompte, et il divise les héritiers.",
    ceSoir:
      "Listez tous les dons que vous avez faits depuis 15 ans, avec leur date exacte et leur montant.",
    acquis: [
      "Qu'un don remis sans papier n'a jamais démarré son compteur de 15 ans",
      "Qu'au partage entre vos enfants, un don revient pour ce qu'il est DEVENU, pas pour ce qu'il valait",
      "Qu'un acte existe pour arrêter les valeurs au jour où on le signe",
    ],
    videoIndex: 5,
    documents: [],
  },
  {
    cle: "e6",
    numero: 6,
    titre: "Oublier les petits-enfants",
    minutes: 9,
    resume:
      "Chaque grand-parent dispose d'un abattement propre par petit-enfant, tous les 15 ans, cumulable avec le don familial de sommes d'argent.",
    ceSoir:
      "Écrivez le nom de chaque petit-enfant, et en face, ce que vous voudriez pour lui. Une ligne par enfant, pas davantage.",
    acquis: [
      "Ce que vous pouvez donner à un petit-enfant de votre vivant : 31 865 €, et 31 865 € de plus s'il est majeur",
      "Que ce compteur est séparé de celui de son parent — l'un n'entame pas l'autre",
      "Ce qu'il reçoit à votre décès si rien n'est écrit : 1 594 €, et seulement s'il y a un testament",
    ],
    videoIndex: 6,
    documents: ["lettre-aux-enfants"],
  },
  {
    cle: "e7",
    numero: 7,
    titre: "Aller chez le notaire les mains vides",
    minutes: 12,
    resume:
      "Le notaire acte ce que vous lui demandez. Sans dossier, il pose trois questions et vous ressortez avec « revenez quand vous saurez ».",
    ceSoir:
      "Cochez votre situation sur la grille, et écrivez la première question que vous poserez. Puis prenez le rendez-vous.",
    acquis: [
      "Les trois questions que le notaire pose toujours en premier, et vos réponses écrites",
      "Ce qu'il faut poser sur son bureau : cinq blocs, une pochette",
      "Les trois questions à reformuler pour obtenir autre chose qu'une généralité",
    ],
    videoIndex: 7,
    documents: ["ma-situation", "questions-notaire", "plan-en-1-page", "regle-mise-a-jour"],
  },
];

/**
 * ÉTAPE TERMINÉE → PRODUIT ÉPINGLÉ EN TÊTE DE BOUTIQUE.
 *
 * C'est la meilleure mécanique de vente du projet, et elle tient dans un
 * `Record` : le membre revient dix fois dans son espace, et le seul moment où
 * une offre lui parle est celui où il vient de terminer l'étape qui pose le
 * problème qu'elle résout.
 *
 * ⚠️ Rien d'algorithmique, et surtout aucune promesse de personnalisation :
 * c'est une correspondance écrite à la main, révisable en une ligne. Les
 * étapes absentes de cette table n'épinglent rien — c'est le cas le plus
 * fréquent, et il est volontaire.
 */
export const ETAPE_PRODUIT: Record<string, ProductSku | undefined> = {
  e3: "upsell2",
  e4: "upsell1",
  e7: "bump",
};

/**
 * LES DOCUMENTS IMPRIMABLES.
 *
 * L'ordre est celui du classeur : les feuilles de La Méthode dans l'ordre des
 * étapes, puis celles du Dossier notaire dans l'ordre où on les remplit. Ce
 * n'est ni l'ordre d'achat ni l'ordre alphabétique, parce que la pile qui sort
 * de l'imprimante doit pouvoir être perforée telle quelle.
 */
export const DOCUMENTS: DocumentImprimable[] = [
  {
    cle: "simulateur-papier",
    titre: "La Facture Invisible",
    sku: "front",
    ordre: 1,
    corps: SimulateurPapier,
  },
  {
    cle: "calendrier-3-dates",
    titre: "Le Calendrier des 3 dates",
    sku: "front",
    ordre: 2,
    corps: CalendrierTroisDates,
  },
  { cle: "lexique", titre: "Le lexique en une page", sku: "front", ordre: 3, corps: Lexique },
  {
    cle: "trois-poches",
    titre: "Combien garder pour soi : la règle des 3 poches",
    sku: "front",
    ordre: 4,
    corps: TroisPoches,
  },
  {
    cle: "lettre-aux-enfants",
    titre: "La lettre pour ouvrir le sujet avec vos enfants",
    sku: "front",
    ordre: 5,
    corps: LettreAuxEnfants,
  },
  {
    cle: "ma-situation",
    titre: "Quelle est ma situation ?",
    sku: "front",
    ordre: 6,
    corps: MaSituation,
  },
  {
    cle: "questions-notaire",
    titre: "Les 12 questions à poser à votre notaire",
    sku: "front",
    ordre: 7,
    corps: QuestionsNotaire,
  },
  {
    cle: "plan-en-1-page",
    titre: "Mon plan en une page",
    sku: "front",
    ordre: 8,
    corps: PlanEnUnePage,
  },
  {
    cle: "regle-mise-a-jour",
    titre: "La règle de mise à jour",
    sku: "front",
    ordre: 9,
    corps: RegleMiseAJour,
  },

  /* ─── Le Dossier à apporter chez votre notaire (bump, 17 €) ─────────── */
  {
    cle: "inventaire",
    titre: "Mon inventaire patrimonial",
    sku: "bump",
    ordre: 10,
    corps: Inventaire,
  },
  { cle: "fiche-famille", titre: "Ma fiche famille", sku: "bump", ordre: 11, corps: FicheFamille },
  {
    cle: "pieces-a-apporter",
    titre: "Les 12 pièces à apporter chez votre notaire",
    sku: "bump",
    ordre: 12,
    corps: PiecesAApporter,
  },
  {
    cle: "mail-rendez-vous",
    titre: "Le message de prise de rendez-vous",
    sku: "bump",
    ordre: 13,
    corps: MailRendezVous,
  },
  {
    cle: "compte-rendu",
    titre: "Mon compte-rendu de rendez-vous",
    sku: "bump",
    ordre: 14,
    corps: CompteRendu,
  },

  /* ─── Le Plan adapté à votre famille (upsell1, 297 €) ────────────────
   *
   * ⚠️ L'ORDRE SUIT LE NUMÉRO DE SITUATION IMPRIMÉ SUR LA FEUILLE, décalé de
   * 14 : « Situation 2 » → ordre 16. C'est ce qui fait que la pile qui sort de
   * l'imprimante est perforable telle quelle, et que le lecteur retrouve sa
   * situation au même rang que sur la grille « Quelle est ma situation ? ».
   * Les douze plans se déclarent donc de 15 à 26, sans trou renuméroté.
   *
   * ⚠️ DÉCLARER UNE FEUILLE ICI NE MET PAS LE PRODUIT EN VENTE.
   * `PRODUCTS.upsell1.disponible` reste à `false` : c'est une décision de
   * livraison, prise à la main quand les douze plans seront branchés, jamais
   * un effet de bord d'un ajout dans cette table.
   *
   * ⚠️ LA NUMÉROTATION SUIT LA GRILLE DE `ma-situation.tsx`, QUI FAIT FOI, et
   * elle n'a plus de trou : cette grille compte une seule case « Concubins ou
   * pacsés » (n° 5), comme le plan-type qui porte ce titre, et « Sans enfant »
   * est la n° 6. Les douze plans occupent donc les ordres 15 à 26 sans
   * exception. Le lecteur qui écrit « Ma situation est la n° 6 » sur la grille
   * doit trouver le sixième plan de la pile : c'est tout le contrat.        */
  {
    cle: "plan-marie-1-enfant",
    titre: "Situation 1 — Marié, 1 enfant",
    sku: "upsell1",
    ordre: 15,
    corps: PlanMarie1Enfant,
  },
  {
    cle: "plan-marie-2-enfants",
    titre: "Situation 2 — Marié, 2 enfants ou plus",
    sku: "upsell1",
    ordre: 16,
    corps: PlanMarie2Enfants,
  },
  {
    cle: "plan-famille-recomposee",
    titre: "Situation 3 — Famille recomposée",
    sku: "upsell1",
    ordre: 17,
    corps: PlanFamilleRecomposee,
  },
  {
    cle: "plan-veuf-veuve",
    titre: "Situation 4 — Veuf ou veuve",
    sku: "upsell1",
    ordre: 18,
    corps: PlanVeufVeuve,
  },
  {
    /* UNE SEULE ENTRÉE, ET UN SEUL ORDRE (19), pour une feuille qui couvre les
       concubins ET les partenaires de PACS. Le plan-type lui-même s'intitule
       « Situation 5 — Concubins ou pacsés » et la grille ne compte qu'une case
       pour les deux : lui donner deux entrées la ferait sortir deux fois de
       « Tout imprimer », et lui donner l'ordre 20 laisserait un trou devant
       « Sans enfant », qui est la n° 6 de la grille.                          */
    cle: "plan-concubins-pacs",
    titre: "Situation 5 — Concubins ou pacsés",
    sku: "upsell1",
    ordre: 19,
    corps: PlanConcubinsPacs,
  },
  {
    cle: "plan-sans-enfant",
    titre: "Situation 6 — Sans enfant",
    sku: "upsell1",
    ordre: 20,
    corps: PlanSansEnfant,
  },
  {
    /* Une seule entrée pour les DEUX `Feuille` de ce plan : `corps` rend le
       fragment complet, et « Tout imprimer » sort donc les feuilles 1 et 2 à la
       suite, chacune sur sa page. Comme pour plan-marie-2-enfants.            */
    cle: "plan-entreprise",
    titre: "Situation 7 — Avec une entreprise ou des parts",
    sku: "upsell1",
    ordre: 21,
    corps: PlanEntreprise,
  },
  {
    cle: "plan-immobilier-locatif",
    titre: "Situation 8 — Avec de l’immobilier locatif",
    sku: "upsell1",
    ordre: 22,
    corps: PlanImmobilierLocatif,
  },
  {
    cle: "plan-enfant-etranger",
    titre: "Situation 9 — Un enfant à l’étranger",
    sku: "upsell1",
    ordre: 23,
    corps: PlanEnfantEtranger,
  },
  {
    cle: "plan-enfant-vulnerable",
    titre: "Situation 10 — Un enfant vulnérable",
    sku: "upsell1",
    ordre: 24,
    corps: PlanEnfantVulnerable,
  },
  {
    cle: "plan-patrimoine-important",
    titre: "Situation 11 — Patrimoine supérieur à 1 million",
    sku: "upsell1",
    ordre: 25,
    corps: PlanPatrimoineImportant,
  },
  {
    cle: "plan-donations-deja-faites",
    titre: "Situation 12 — Des donations déjà faites",
    sku: "upsell1",
    ordre: 26,
    corps: PlanDonationsDejaFaites,
  },

  /* Les trois feuilles transversales du Plan familial : elles ne portent aucun
   * numéro de situation, elles servent les douze. Elles se rangent donc APRÈS
   * les plans (15 à 26), et dans cet ordre-là : le tableau de bord se remplit
   * au stylo, la feuille des abattements se garde ouverte à côté pendant qu'on
   * le remplit, et le calendrier sur 15 ans se remplit en dernier, une fois
   * qu'on sait qui reçoit quoi. Les séparer ou les inverser, c'est faire
   * tourner les pages à un lecteur de 78 ans au milieu d'une colonne.      */
  {
    cle: "tableau-bord-familial",
    titre: "Le tableau de bord familial",
    sku: "upsell1",
    ordre: 27,
    corps: TableauBordFamilial,
  },
  {
    cle: "abattements-de-chacun",
    titre: "Les abattements de chacun",
    sku: "upsell1",
    ordre: 28,
    corps: AbattementsDeChacun,
  },
  {
    /* ⚠️ `upsell1`, ET PAS `upsell2`. « Le Calendrier de Transmission sur
       15 ans » est une ligne de la pile de valeur du Plan (67 €, voir
       app/plan-complet/page.tsx) ; il ne figure nulle part dans celle de
       l'Assurance-vie. Il parle du compteur des donations — année de naissance,
       année du premier don déclaré —, pas d'un contrat. Le déclarer sous
       `upsell2` priverait l'acheteur du Plan d'une ligne qu'il a payée, et en
       donnerait une à l'acheteur de l'Assurance-vie qui ne l'a pas achetée. */
    cle: "calendrier-15-ans",
    titre: "Le calendrier de transmission sur 15 ans",
    sku: "upsell1",
    ordre: 29,
    corps: Calendrier15Ans,
  },

  /* ─── Votre assurance-vie, vérifiée en 30 minutes (upsell2, 97 €) ─────
   *
   * L'ordre est celui du travail réel, qui est aussi celui de la pile de valeur
   * affichée sur app/kit-assurance-vie/page.tsx : on note d'abord ce qu'on a
   * (la grille), on choisit ensuite la clause qui convient, on regarde ce que
   * la date des versements change, et on écrit la lettre en dernier — parce
   * qu'une lettre postée avant d'avoir choisi sa clause est une lettre à
   * réécrire.
   *
   * ⚠️ COMME POUR LE PLAN, DÉCLARER ICI NE MET RIEN EN VENTE :
   * `PRODUCTS.upsell2.disponible` reste à `false` tant que la décision de
   * livraison n'est pas prise à la main.
   *
   * ⚠️ IL MANQUE « Le comparatif des frais » (19 € dans la pile de valeur) :
   * aucun fichier de contenu n'existe pour lui sur le disque. On ne déclare pas
   * une feuille vide — c'est la règle « rien avant le contenu ».             */
  {
    cle: "grille-audit-assurance-vie",
    titre: "La grille d’audit de votre assurance-vie",
    sku: "upsell2",
    ordre: 30,
    corps: GrilleAuditAssuranceVie,
  },
  {
    /* ⚠️ C'EST LA LIGNE FACTURÉE DANS LES DEUX PILES DE VALEUR, à 47 € de
       chaque côté, et c'est elle qui fonde la règle des 47 € (voir
       REMISE_LIGNE_DUPLIQUEE dans lib/config.ts). Elle n'existe ici qu'une
       fois, et sous `upsell2` : la clause bénéficiaire est un objet du contrat
       d'assurance-vie, et un même document ne peut porter qu'un seul SKU —
       `chargerEspace` filtre sur `possede.has(d.sku)`. Conséquence à connaître :
       l'acheteur du seul Plan ne reçoit pas cette feuille aujourd'hui. */
    cle: "trois-clauses-beneficiaires",
    titre: "Trois clauses bénéficiaires, commentées ligne par ligne",
    sku: "upsell2",
    ordre: 31,
    corps: TroisClausesBeneficiaires,
  },
  {
    /* Une seule entrée pour les DEUX `Feuille` de ce document (avant 70 ans,
       après 70 ans) : elles se lisent côte à côte, elles ne se séparent pas. */
    cle: "decision-70-ans",
    titre: "Le tableau de décision — avant et après 70 ans",
    sku: "upsell2",
    ordre: 32,
    corps: Decision70Ans,
  },
  {
    cle: "lettre-modification-clause",
    titre: "La lettre pour modifier votre clause bénéficiaire",
    sku: "upsell2",
    ordre: 33,
    corps: LettreModificationClause,
  },
];

/** L'étape par son numéro d'affichage. `null` hors des bornes : /etape/12 ne plante pas. */
export function etapeParNumero(n: number): EtapeMethode | null {
  return ETAPES.find((e) => e.numero === n) ?? null;
}

/** L'étape par sa clé de base ("e0"…"e7"). Utile côté progression. */
export function etapeParCle(cle: string): EtapeMethode | null {
  return ETAPES.find((e) => e.cle === cle) ?? null;
}

/** Le document par son slug. `null` sur un slug inconnu ou périmé. */
export function documentParCle(cle: string): DocumentImprimable | null {
  return DOCUMENTS.find((d) => d.cle === cle) ?? null;
}
