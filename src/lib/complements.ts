import { composants, PRODUCTS, type ProductSku } from "./config";
import type { Reponses } from "./qualification";

/** Une réduction de catalogue vérifiable, jamais une valeur fictive ou un avoir. */
export const avantagePack = () => ({
  separes: PRODUCTS.upsell1.price + PRODUCTS.upsell2.price,
  ensemble: PRODUCTS.pack1.price,
  difference: PRODUCTS.upsell1.price + PRODUCTS.upsell2.price - PRODUCTS.pack1.price,
});

const SUPPORTS: [ProductSku, string][] = [
  ["front", "Méthode et premières questions"],
  ["bump", "Dossier et trames de rendez-vous"],
  ["upsell1", "Fiches familiales et suivi des démarches"],
  ["backend1", "Atelier de simulation pédagogique"],
  ["upsell2", "Vérifications des contrats d’assurance-vie"],
];
export function bilanSupports(sku: ProductSku, possede: Set<ProductSku>) {
  const cible = composants(sku);
  return {
    acquis: SUPPORTS.filter(([s]) => possede.has(s)).map(([, texte]) => texte),
    ajoutes: SUPPORTS.filter(([s]) => cible.has(s) && !possede.has(s)).map(([, texte]) => texte),
  };
}
export function motifEtape(sku: ProductSku, etape?: string): string | null {
  if (etape === "e3" && sku === "upsell2")
    return "Vous avez terminé l’étape sur l’assurance-vie. Si vous souhaitez passer des repères généraux au suivi de chaque contrat, ce module vous donne la grille et les demandes à préparer.";
  if (etape === "e4" && (sku === "upsell1" || sku === "pack1"))
    return "Vous avez terminé l’étape sur le démembrement. Le pack permet d’explorer les hypothèses couvertes dans l’atelier et de conserver les questions à faire valider.";
  if (etape === "e7" && sku === "bump")
    return "Vous avez terminé l’étape de préparation du rendez-vous. Le Dossier ajoute les trames pour rassembler les pièces et conserver les réponses, avec un exemple rempli.";
  return null;
}
/** Proposition secondaire sur demande seulement, jamais après un échec bancaire. */
export function alternativeAv(profil: Reponses | null, sku: ProductSku, possede: Set<ProductSku>) {
  return sku === "pack1" && profil?.av === "O" && !possede.has("upsell2");
}
