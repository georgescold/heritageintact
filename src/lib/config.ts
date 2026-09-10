/** Catalogue V2. Les SKU historiques restent lisibles pour honorer les achats. */
export const BRAND = "Héritage Intact";
export const CONTACT_EMAIL = "contact@heritageintact.fr";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
export type ProductSku =
  | "front"
  | "bump"
  | "upsell1"
  | "upsell2"
  | "pack1"
  | "pack2"
  | "pack3"
  | "pack4"
  | "backend1"
  | "backend2"
  | "backend3"
  | "backend4";
export type Product = {
  sku: ProductSku;
  name: string;
  short: string;
  price: number;
  anchor: number;
  disponible: boolean;
};
const produit = (sku: ProductSku, name: string, price: number, disponible = true): Product => ({
  sku,
  name,
  short: name,
  price,
  anchor: price,
  disponible,
});
export const PRODUCTS: Record<ProductSku, Product> = {
  front: { ...produit("front", "Les 7 erreurs qui offrent votre héritage à l’État", 52), short: "Les 7 erreurs" },
  bump: produit("bump", "Mon dossier notaire", 17),
  upsell1: produit("upsell1", "Préparer ma transmission", 197),
  upsell2: produit("upsell2", "Faire le point sur mon assurance-vie", 67),
  pack1: produit("pack1", "Préparer ma transmission + assurance-vie", 247),
  pack2: produit("pack2", "Préparer ma transmission — ancien pack", 197, false),
  pack3: produit("pack3", "Préparation + assurance-vie — ancien pack", 247, false),
  pack4: produit("pack4", "Assurance-vie + dossier — ancien pack", 84, false),
  backend1: produit("backend1", "Mon atelier de simulation", 0, false),
  backend2: produit("backend2", "Préparer une éventuelle perte d’autonomie", 97, false),
  backend3: produit("backend3", "Le Classeur Héritage Intact", 67, false),
  backend4: produit("backend4", "Préparer ses questions sur le testament", 47, false),
};
export const INCLUS_DANS: Partial<Record<ProductSku, ProductSku[]>> = {
  upsell1: ["front", "bump", "backend1"],
  pack1: ["upsell1", "upsell2"],
  pack2: ["upsell1", "bump"],
  pack3: ["upsell1", "upsell2", "bump"],
  pack4: ["upsell2", "bump"],
};
export function composants(sku: ProductSku): Set<ProductSku> {
  const resultat = new Set<ProductSku>([sku]);
  for (const s of resultat) for (const inclus of INCLUS_DANS[s] ?? []) resultat.add(inclus);
  return resultat;
}
export const PRESENTATION: Partial<Record<ProductSku, { promesse: string; contenu: string[] }>> = {
  front: {
    promesse:
      "Comprenez les points essentiels et préparez vos premières questions, sans prendre de décision irréversible.",
    contenu: [
      "8 étapes écrites, avec exemples et actions",
      "Votre fiche de situation et vos premières questions",
      "Les repères sur la famille, les donations et l’assurance-vie",
      "Un accès personnel pour avancer à votre rythme",
    ],
  },
  bump: {
    promesse: "Gagnez du temps pour rassembler vos papiers avant le rendez-vous.",
    contenu: [
      "Inventaire guidé et fiche famille",
      "Liste des pièces à rassembler",
      "Modèle de demande de rendez-vous",
      "Compte rendu et exemple de dossier rempli",
    ],
  },
  upsell1: {
    promesse:
      "Préparez un dossier clair pour votre rendez-vous et repérez les points propres à votre famille.",
    contenu: [
      "Les 7 erreurs qui offrent votre héritage à l’État inclus",
      "Mon dossier notaire inclus",
      "Parcours familial et fiches de situations particulières",
      "Atelier de simulation pédagogique, avec hypothèses explicites",
      "Tableau familial et suivi de vos prochaines démarches",
    ],
  },
  upsell2: {
    promesse:
      "Repérez les informations manquantes et préparez les questions à adresser à votre assureur.",
    contenu: [
      "Grille de lecture de vos contrats",
      "Demande d’informations à votre assureur",
      "Repères sur les clauses et les versements",
      "Suivi des réponses et de la vérification professionnelle",
    ],
  },
  pack1: {
    promesse:
      "Réunissez votre préparation familiale et les points à vérifier sur vos contrats d’assurance-vie.",
    contenu: [
      "Tout le pack Préparer ma transmission",
      "Le module Faire le point sur mon assurance-vie",
      "Le dossier notaire et l’atelier de simulation inclus",
      "Un seul espace, sans documents facturés deux fois",
    ],
  },
};
export const REMISE_LIGNE_DUPLIQUEE = 0; // Compatibilité des anciennes pages, aucun ancrage fictif.
export const SKU_TUNNEL_UNIQUEMENT: ProductSku[] = ["pack2", "pack3", "pack4"];
export const urlEspace = (jeton: string) => `${SITE_URL}/espace/${jeton}`;
export const VARIANTES = { "/": "Présentation", "/lp-questions": "Orientation" };
export const CTA = {
  benefice: "Commencer maintenant",
  urgence: "Accéder au guide",
  optin: "Recevoir les repères pour commencer",
};
// Anciens exports conservés sans changement de prix au fil du temps.
export const FLASH_MINUTES = 0;
export const PRIX_APRES_FLASH = 52;
export const REDUCTION_RATTRAPAGE = 0;
export const PRIX_RATTRAPAGE = 52;
export const PRIX_APRES_FONDATEURS = 52;
export const FOUNDERS_CAP = 20;
const CLE_STRIPE = process.env.STRIPE_SECRET_KEY ?? "";
export const isTestMode = !CLE_STRIPE;
export const stripeEnModeTest = CLE_STRIPE.startsWith("sk_test_");
export const stockageEphemere =
  Boolean(process.env.VERCEL) && !(process.env.POSTGRES_URL || process.env.DATABASE_URL);
export const VIDEO = {
  provider: (process.env.NEXT_PUBLIC_VIDEO_PROVIDER as "vimeo" | "wistia" | undefined) ?? "vimeo",
  vsl: process.env.NEXT_PUBLIC_VSL_VIDEO_ID,
  upsell1: undefined,
  upsell2: undefined,
  module1: process.env.NEXT_PUBLIC_MODULE1_VIDEO_ID,
  etapes: (process.env.NEXT_PUBLIC_FORMATION_V2_VIDEO_IDS ?? "").split(",").map((v) => v.trim()),
};
export const DATE_ESPACE_EN_LIGNE = "2026-09-08T00:00:00.000Z";
export function euros(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}
