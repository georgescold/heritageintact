import { composants, PRODUCTS, type ProductSku } from "./config";
export type LignePayee = { sku: ProductSku; price: number; rembourse?: boolean };
/** Prix stable : ni cookie, ni durée de visionnage ne change le montant. */
export function prixFront(_flash?: string, _rattrapage?: string): number {
  void _flash; void _rattrapage;
  return PRODUCTS.front.price;
}

/** Un crédit porte uniquement sur des achats effectivement payés et inclus. */
export function devis(sku: ProductSku, lignes: LignePayee[]) {
  const actives = lignes.filter((l) => !l.rembourse && Number.isFinite(l.price) && l.price >= 0);
  const acquis = new Set(actives.flatMap((l) => [...composants(l.sku)]));
  // L’AV après le pack de préparation complète le pack à 247 €, quel que soit l’ordre.
  const cible =
    (sku === "upsell2" && acquis.has("upsell1")) || (sku === "upsell1" && acquis.has("upsell2"))
      ? "pack1"
      : sku;
  const inclus = composants(cible);
  const credit = actives
    .filter((l) =>
      [...composants(l.sku)]
        .filter((c) => !["pack2", "pack3", "pack4"].includes(c))
        .every((c) => inclus.has(c)),
    )
    .reduce((s, l) => s + Math.round(l.price * 100), 0);
  const total = Math.round(PRODUCTS[cible].price * 100);
  return {
    total: total / 100,
    credit: Math.min(total, credit) / 100,
    montant: Math.max(0, total - credit) / 100,
    dejaPossede: acquis.has(sku),
  };
}
/** Compatibilité : ne pas utiliser cette estimation pour encaisser. */
export function prixUpsell(sku: ProductSku, possede: Set<ProductSku>, _remise = 0): number {
  void _remise;
  const racines = [...possede].filter(
    (s) => ![...possede].some((t) => t !== s && composants(t).has(s)),
  );
  return devis(
    sku,
    racines.map((s) => ({ sku: s, price: PRODUCTS[s].price })),
  ).montant;
}
export const prixUpsellPlein = prixUpsell;
