/**
 * Configuration produit : source de vérité des prix et des noms.
 * Les pages et le récap de commande lisent ici, jamais des chiffres en dur.
 */

export const BRAND = "Héritage Intact";
export const CONTACT_EMAIL = "contact@heritageintact.fr";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  front: {
    sku: "front",
    name: "Les 7 Erreurs qui Offrent Votre Héritage à l'État",
    short: "Les 7 Erreurs",
    price: 27,
    anchor: 67,
  },
  bump: {
    sku: "bump",
    name: "Le Dossier Notaire Prêt-à-Signer",
    short: "Dossier Notaire",
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
    name: "Le Plan Transmission Complet : les 12 situations familiales",
    short: "Plan Transmission Complet",
    price: 297,
    anchor: 497,
  },
  upsell2: {
    sku: "upsell2",
    name: "Le Kit Assurance-Vie",
    short: "Kit Assurance-Vie",
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

/** Nombre de places fondatrices au prix de 27 €. Le compteur est réel (cf. db). */
export const FOUNDERS_CAP = 500;

/** Tant que Stripe n'est pas branché, le paiement est simulé (aucun débit). */
export const isTestMode = !process.env.STRIPE_SECRET_KEY;

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
