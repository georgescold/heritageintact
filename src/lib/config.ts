/**
 * Configuration produit : source de vérité des prix et des noms.
 * Les pages et le récap de commande lisent ici, jamais des chiffres en dur.
 */

export const BRAND = "Héritage Intact";
export const CONTACT_EMAIL = "contact@heritageintact.fr";
/**
 * ⚠️ `||` et non `??`. La variable existait sur Vercel avec une valeur VIDE :
 * `??` ne rattrape que `undefined`, donc SITE_URL valait "" en production et
 * tous les liens des emails partaient en relatif, inutilisables dans une boîte
 * de réception. Une chaîne vide doit être traitée comme une absence.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Identité légale de l'éditeur (LCEN, CGV, RGPD).
 * Source de vérité unique : les 3 pages légales lisent ici.
 * ⚠️ Les champs marqués TODO doivent être renseignés avant la mise en ligne.
 */
export const LEGAL = {
  siret: "989 331 418 00016",
  siren: "989 331 418",
  /**
   * ⚠️ La mention « EI » (ou « Entrepreneur individuel ») accolée au nom est OBLIGATOIRE
   * sur tous les documents commerciaux depuis 2022 (art. R526-27 du code de commerce).
   */
  operatorName: "Loys Coquelle EI",
  legalForm: "Entrepreneur individuel (micro-entreprise)",
  address: "14 bis rue de la Carrière, 02190 La Malmaison, France",
  registration: "Immatriculée au RNE le 17 juillet 2025",
  /** Héritage Intact est une enseigne de l'entreprise, qui exploite déjà le nom commercial Leadheure. */
  tradeName: "Héritage Intact",
  /** Médiateur de la consommation (adhésion obligatoire, art. L611-1 code de la consommation). */
  mediator: {
    name: "CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)",
    address: "49 rue de Ponthieu, 75008 Paris",
    phone: "01 89 47 00 14",
    email: "litiges@cm2c.net",
    url: "https://www.cm2c.net/declarer-un-litige.php",
  },
  /**
   * Micro-entreprise sous le seuil : pas de TVA.
   * Mention obligatoire sur les factures et les CGV (art. 293 B du CGI).
   */
  vatNotice: "TVA non applicable, article 293 B du Code général des impôts.",
  /** Date de dernière mise à jour des documents légaux. */
  updatedAt: "4 septembre 2026",
} as const;

export type ProductSku = "front" | "bump" | "upsell1" | "upsell2";

export type Product = {
  sku: ProductSku;
  name: string;
  short: string;
  price: number;
  anchor: number;
};

export const PRODUCTS: Record<ProductSku, Product> = {
  /**
   * ⚠️ L'ancrage est passé de 67 € à 429 € le 6 septembre 2026.
   *
   * La page affichait « 27 € au lieu de 67 € » sous le bouton, et deux écrans
   * plus bas une pile de valeur totalisant 429 €. Deux ancrages contradictoires
   * sur la même page : le lecteur ne sait plus ce que vaut le produit, et
   * l'offre paraît trois fois moins forte qu'elle ne l'est.
   *
   * 429 € est le total des lignes du packaging, à l'euro près. C'est le seul
   * ancrage défendable : chaque euro est justifié par une ligne à l'écran.
   *
   * Les 67 € ont ensuite disparu : le prix après les places fondatrices est
   * aligné sur celui d'après le compteur, soit `PRIX_APRES_FLASH`. Un seul
   * prix « d'après » dans tout le funnel.
   */
  front: {
    sku: "front",
    /**
     * ⚠️ LE PRODUIT S'APPELLE « LA MÉTHODE », ET RIEN D'AUTRE.
     *
     * Il s'est appelé « Les 7 Erreurs qui Offrent Votre Héritage à l'État »,
     * et la page parlait tantôt de « programme », tantôt de « guide ». Trois
     * mots pour une seule chose : le lecteur ne sait plus ce qu'il achète.
     *
     * Les 7 erreurs ne sont plus le nom du produit — elles sont ce que la
     * Méthode permet d'éviter. C'est une promesse, pas une étiquette, et ça
     * change le registre : un guide s'achète et se lit, une méthode se suit.
     * Un lecteur de 70 ans qui a peur de mal faire veut un protocole — des
     * étapes, dans l'ordre, sans rien à improviser.
     *
     * Ne jamais réécrire « programme » ni « guide » pour désigner le produit.
     */
    name: "La Méthode Héritage Intact",
    short: "La Méthode",
    price: 27,
    anchor: 429,
  },
  bump: {
    sku: "bump",
    /*
     * « Prêt-à-signer » promettait ce que le produit ne fait pas : on ne signe
     * rien, on apporte. Le nom dit maintenant l'usage, et rien d'autre.
     */
    name: "Le Dossier à apporter chez votre notaire",
    short: "Le Dossier notaire",
    price: 17,
    anchor: 47,
  },
  /**
   * ⚠️ TEST DE PRIX EN COURS depuis le 6 septembre 2026 : 197 € → 297 €.
   *
   * C'est la ligne qui porte le plus de revenu par point de taux de prise, et
   * la question de Valère s'y applique directement : *si je double le prix,
   * est-ce que j'ai deux fois moins de conversions ?*
   *
   *   197 € à 7 %    → 13,79 € par acheteur   (référence)
   *   297 € à 4,64 % → 13,78 €                (le seuil : neutre)
   *   297 € à 6 %    → 17,82 €                (+29 %)
   *
   * Le prix monte de 51 %, donc le taux de prise peut chuter de 34 % avant
   * qu'on y perde. Peu probable : l'acheteur vient de payer, il a 650 000 €
   * en jeu, et 297 € représentent moins d'un mois de son épargne.
   *
   * ⚠️ Pourquoi 297 et pas 397. Deux raisons.
   *   1. La doctrine nomme ce prix : « comment vendre du 297 € correctement :
   *      le 297 € en upsell 1 » (`09-faq/arbitrages.md`).
   *   2. Le stack de valeur de /plan-complet est CALCULÉ depuis ses lignes et
   *      totalise 497 €. À 397 € la page afficherait « 497 € → 397 € », soit
   *      20 % de remise : une offre qui paraît faible. À 297 €, c'est 40 %,
   *      et chaque euro annoncé est justifié ligne par ligne.
   *
   * ⚠️ Se juger sur l'EPC, jamais sur le taux de prise. Un taux qui baisse
   * pendant que l'EPC monte est une bonne nouvelle.
   *
   * Pour revenir en arrière : 197.
   */
  upsell1: {
    sku: "upsell1",
    /*
     * « Plan Transmission Complet » est du vocabulaire de conseiller. « Le Plan
     * adapté à votre famille » dit la même chose avec des mots que l'acheteur
     * emploie lui-même — et « votre famille » fait le travail de « sur mesure »
     * sans le mot.
     */
    name: "Le Plan adapté à votre famille",
    short: "Le Plan familial",
    price: 297,
    anchor: 497,
  },
  upsell2: {
    sku: "upsell2",
    /*
     * « Kit » ne dit ni ce qu'on reçoit ni ce qu'on en fait. Le nom porte
     * désormais la promesse complète, durée comprise.
     */
    name: "Votre assurance-vie, vérifiée en 30 minutes",
    short: "L'Assurance-vie",
    price: 97,
    anchor: 197,
  },
};

/**
 * Les landing pages en piste (05-funnel/landing-pages.md).
 *
 * Elles étaient quatre au 6 septembre 2026, toutes maintenues en parallèle et
 * toutes en train de diverger. Deux ont été retirées : la LP MAX (#6), qui est
 * une structure high ticket montée sur un produit à 27 €, et la LP courte (#1),
 * qui faisait doublon avec la classique. Ce qu'elles portaient de bon n'est pas
 * perdu — le récit CEO est passé sur /methode, où il vend.
 *
 * Il en reste deux, et c'est le bon nombre : le repo demande ~100 conversions
 * par variante pour départager, soit ~300 € de budget chacune.
 *
 * Le chemin d'arrivée est enregistré sur chaque lead : sans ça, on ne peut
 * comparer que les taux d'opt-in, jamais ce qui se passe après.
 */
export const VARIANTES: Record<string, string> = {
  "/": "A — classique (structure #2)",
  "/lp-questions": "B — questionnaire (structure #3)",
};

/**
 * LES DEUX SEULS APPELS À L'ACTION DU SITE.
 *
 * Il y en avait dix, tous différents. Trois problèmes : le lecteur ne retient
 * aucune formule, chaque bouton repart de zéro au lieu de marteler la même
 * promesse, et surtout **rien n'est testable** — la règle est d'A/B tester une
 * variable à la fois, or dix libellés font dix variables.
 *
 * Deux suffisent, et ils se répartissent par position sur la page :
 *
 *   BÉNÉFICE  en haut, tant que la tension monte et qu'on doit donner envie
 *   URGENCE   en bas, après l'échéance, quand il ne reste qu'à décider
 *
 * Les deux sont à l'**impératif** — un CTA est un verbe d'action, pas une
 * envie décrite à la première personne (« Agressivité du CTA », checklist
 * d'optimisation § 4).
 *
 * Pour tester une variante : changer une de ces deux lignes, et rien d'autre.
 */
export const CTA = {
  /** Page de vente, haut : on donne envie. */
  benefice: "Accéder à la méthode",
  /** Page de vente, bas : après l'échéance, il ne reste qu'à décider. */
  urgence: "Accéder à la méthode",
  /**
   * Landing page : l'action n'est pas la même — on ne vend rien, on débloque.
   * Un seul libellé, partout, y compris dans le pop-up de sortie.
   *
   * ⚠️ « Découvrez les 3 décisions » a été écarté : correct, à l'impératif, et
   * sans aucune tension. Il décrit un contenu. Celui-ci désigne une **échéance
   * inconnue qui concerne le lecteur** — c'est la question qu'il se pose depuis
   * la sous-headline, et le bouton est le seul endroit où il peut y répondre.
   *
   * Et il reste tenable : la vidéo donne bien les trois dates et de quoi situer
   * son âge sur chacune. On ne promet rien que le clic ne livre.
   */
  optin: "Voir laquelle se ferme en premier",
} as const;

/**
 * Durée de l'offre flash de la page de vente, en minutes.
 *
 * Le compteur démarre quand le visiteur quitte la vidéo (cf.
 * `components/OffreFlash.tsx`), il est persisté en cookie, et il est
 * **opposé au serveur** : passé ce délai, `prepareCheckout` facture
 * réellement `PRIX_APRES_FLASH`. C'est ce qui le distingue d'un faux
 * compteur, interdit par l'art. L121-2 du code de la consommation.
 */
export const FLASH_MINUTES = 10;

/**
 * Le prix de la Méthode une fois l'offre flash expirée.
 *
 * ⚠️ Ce n'est PAS `PRODUCTS.front.anchor`. Les 429 € sont la valeur du
 * contenu — le total des lignes du packaging, barré à l'écran — et le
 * Méthode n'est jamais vendue à ce prix. Or le compteur débite réellement
 * ce montant-ci quand il tombe à zéro : il doit donc être un prix qu'on
 * pratique vraiment, sans quoi l'annonce serait mensongère (art. L121-2).
 * 89 € est ce prix.
 */
export const PRIX_APRES_FLASH = 89;

/** La remise de rattrapage, en pourcentage, pour qui a laissé filer le compteur. */
export const REDUCTION_RATTRAPAGE = 30;

/**
 * Le prix de rattrapage : 89 € moins 30 %, arrondi à l'euro inférieur.
 *
 * 89 x 0,70 = 62,30 €. On facture 62 €, jamais 63 : quand on annonce « −30 % »,
 * l'arrondi doit toujours aller dans le sens du client, sinon le pourcentage
 * affiché est supérieur à la remise réelle. Ici la remise vaut 30,3 %.
 * (`euros()` n'affiche pas les centimes : un prix à virgule serait de toute
 * façon tronqué à l'écran et ne correspondrait plus au débit.)
 *
 * ⚠️ Ce prix n'est PAS une seconde chance permanente. Il n'est proposé
 * qu'une fois, au clic qui suit l'expiration du compteur, et le refus est
 * définitif (cookie `hi_rattrapage`). Sans cette règle, l'annonce « passé ce
 * délai, la Méthode repasse à 89 € » deviendrait fausse, et c'est exactement
 * ce que l'art. L121-2 sanctionne.
 */
export const PRIX_RATTRAPAGE = Math.floor((PRIX_APRES_FLASH * (100 - REDUCTION_RATTRAPAGE)) / 100);

/**
 * Le prix une fois les places fondatrices épuisées.
 *
 * ⚠️ C'est **le même nombre** que `PRIX_APRES_FLASH`, et l'alias est
 * délibéré : les deux raretés du funnel — le compteur de 10 minutes sur la
 * page de vente, les {FOUNDERS_CAP} places sur le bon de commande — doivent
 * retomber sur le même prix.
 *
 * Il valait 67 € jusqu'ici, et c'était un piège : quelqu'un qui laissait
 * expirer son compteur voyait 89 €, puis arrivait sur le bon de commande où
 * le compteur de places annonçait 67 € — moins cher que ce qu'il venait de
 * perdre. Deux prix « d'après » qui se contredisent ne rendent aucune des
 * deux raretés crédible.
 *
 * Une seule idée à retenir pour le lecteur : la Méthode vaut 89 €, elle est
 * à 27 € maintenant. À ne pas confondre avec l'ancrage à 429 €, qui est la
 * valeur du contenu acheté à l'unité et n'est jamais un prix pratiqué.
 */
export const PRIX_APRES_FONDATEURS = PRIX_APRES_FLASH;

/**
 * Places au prix fondateur. **Le compteur est réel** : il lit le nombre de
 * commandes payées en base (`countFounders`).
 *
 * ⚠️ Passé de 500 à 50 le 6 septembre 2026, et c'est une décision de fond.
 * « Il reste 500 places » ne crée aucune urgence — personne ne se dépêche pour
 * une place sur cinq cents. « Il reste 20 places » en crée une, et la
 * différence est qu'elle est **vraie** : le compteur descend pour de bon à
 * chaque vente, et le prix passera réellement à 89 € à la 20ᵉ.
 *
 * Une rareté réelle et petite est plus forte qu'une rareté large — et elle ne
 * se retourne pas contre la marque le jour où quelqu'un recharge la page.
 * 20 retours suffisent largement pour la version 2 du simulateur, et le prix
 * monte d'autant plus vite.
 */
export const FOUNDERS_CAP = 20;

const CLE_STRIPE = process.env.STRIPE_SECRET_KEY ?? "";

/**
 * Aucune clé Stripe : le paiement est entièrement **simulé**. Stripe n'est
 * jamais appelé, la commande est marquée payée d'office, aucun formulaire de
 * carte n'est affiché.
 */
export const isTestMode = !CLE_STRIPE;

/**
 * Clé de test (`sk_test_…`) : Stripe est **réellement** appelé, le vrai
 * formulaire de carte s'affiche, la 3-D Secure se déclenche — et aucun euro ne
 * peut bouger. C'est l'état pour parcourir le funnel comme un client.
 *
 * ⚠️ Cette distinction existe parce que sans elle le site aurait eu l'air en
 * production tout en tournant sur des clés de test : pas de bandeau, aucun
 * signal. Une vraie carte serait refusée sans qu'on comprenne pourquoi.
 */
export const stripeEnModeTest = CLE_STRIPE.startsWith("sk_test_");

/**
 * ⚠️ LE BLOQUEUR DE MISE EN LIGNE.
 *
 * Les leads et les commandes vivent dans un fichier JSON (`src/lib/db.ts`). En
 * local c'est `./data/db.json` et tout va bien. Sur Vercel, le disque est en
 * lecture seule sauf `/tmp` — et `/tmp` est **éphémère et propre à chaque
 * instance**. Concrètement, en production et sans base :
 *
 *   — un inscrit écrit sur l'instance A n'existe pas pour l'instance B ;
 *   — le cron des emails ne voit presque personne ;
 *   — la commande n'est pas retrouvée après le paiement, donc `/plan-complet`
 *     redirige au lieu de proposer l'upsell : **la chaîne d'upsells casse.**
 *
 * Rien ne plante, rien ne s'affiche en erreur : les données disparaissent en
 * silence. C'est la pire catégorie de bug, d'où la bannière.
 *
 * Le jour où une base est branchée, `POSTGRES_URL` devient non vide et la
 * bannière s'éteint toute seule — il n'y a aucun code à retoucher.
 */
export const stockageEphemere =
  Boolean(process.env.VERCEL) && !(process.env.POSTGRES_URL || process.env.DATABASE_URL);

export const VIDEO = {
  provider: (process.env.NEXT_PUBLIC_VIDEO_PROVIDER as "vimeo" | "wistia" | undefined) ?? "vimeo",
  vsl: process.env.NEXT_PUBLIC_VSL_VIDEO_ID,
  upsell1: process.env.NEXT_PUBLIC_UPSELL1_VIDEO_ID,
  upsell2: process.env.NEXT_PUBLIC_UPSELL2_VIDEO_ID,
  module1: process.env.NEXT_PUBLIC_MODULE1_VIDEO_ID,
};

export function euros(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
