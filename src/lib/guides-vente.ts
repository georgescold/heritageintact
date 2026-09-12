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

export function guideVendable(sku: string): sku is ProductSku {
  const s = sku as ProductSku;
  return (
    GUIDES_A_LA_CARTE.includes(s) &&
    PRODUCTS[s]?.disponible === true &&
    !SKU_TUNNEL_UNIQUEMENT.includes(s)
  );
}
