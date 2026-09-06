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
  upsell1: {
    sku: "upsell1",
    name: "Le Plan Transmission Complet : les 12 situations familiales",
    short: "Plan Transmission Complet",
    price: 197,
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
