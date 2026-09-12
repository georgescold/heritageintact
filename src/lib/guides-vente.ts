import { PRODUCTS, SKU_TUNNEL_UNIQUEMENT, type ProductSku } from "./config";

/**
 * LES GUIDES VENDABLES À L'UNITÉ, hors du tunnel.
 *
 * ⚠️ Le guide d'entrée n'y est pas. Il garde `/commande`, qui porte sa fenêtre
 * de prix : lui ouvrir un second bon de commande sans promotion ferait exister
 * deux tarifs pour le même produit selon le lien emprunté.
 *
 * ⚠️ Les packs non plus. `SKU_TUNNEL_UNIQUEMENT` dit qu'ils n'existent que dans
 * le tunnel, et les proposer isolément vendrait une seconde fois des composants
 * déjà inclus dans un autre achat.
 *
 * Ce fichier est volontairement séparé de `app/commande-guide.ts` : celui-ci
 * porte `"use server"`, qui interdit d'exporter autre chose que des fonctions
 * asynchrones. Une constante et un prédicat n'y ont donc pas leur place.
 */
export const GUIDES_A_LA_CARTE: ProductSku[] = ["upsell1", "upsell2", "backend4", "bump"];

/**
 * LE BUMP PROPOSÉ SUR LE BON DE COMMANDE D'UN GUIDE.
 *
 * Toujours « Mon dossier notaire » : c'est le moins cher du catalogue, il
 * complète les quatre autres sans les recouper, et c'est déjà celui du tunnel —
 * un acheteur qui verrait un bump différent selon la porte d'entrée ne
 * comprendrait pas lequel est le bon.
 *
 * `null` quand le guide commandé EST le dossier notaire : se proposer soi-même
 * en complément est le genre de détail qui fait douter de tout le reste.
 */
export function bumpPour(sku: ProductSku): ProductSku | null {
  if (sku === "bump") return null;
  return PRODUCTS.bump.disponible ? "bump" : null;
}

export function guideVendable(sku: string): sku is ProductSku {
  const s = sku as ProductSku;
  return (
    GUIDES_A_LA_CARTE.includes(s) &&
    PRODUCTS[s]?.disponible === true &&
    !SKU_TUNNEL_UNIQUEMENT.includes(s)
  );
}
