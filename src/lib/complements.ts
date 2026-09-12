import { composants, type ProductSku } from "./config";

const SUPPORTS: [ProductSku, string][] = [
  ["front", "Guide et premières questions"],
  ["bump", "Dossier et trames de rendez-vous"],
  ["upsell1", "Fiches familiales et suivi des démarches"],
  ["backend1", "Atelier de simulation pédagogique"],
  ["upsell2", "Vérifications des contrats d’assurance-vie"],
  ["backend4", "Dossier Testament : volontés, cohérence et brief notaire"],
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
  if (etape === "e4" && sku === "upsell1")
    return "Vous avez terminé l’étape sur le démembrement. Mon plan adapté à ma situation permet d’explorer les hypothèses couvertes et de conserver les questions à faire valider.";
  if (etape === "e7" && sku === "bump")
    return "Vous avez terminé l’étape de préparation du rendez-vous. Le Dossier ajoute les trames pour rassembler les pièces et conserver les réponses, avec un exemple rempli.";
  return null;
}
