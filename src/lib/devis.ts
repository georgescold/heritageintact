import { commandesPayeesParEmail, promotionParEmail } from "./db";
import { devis } from "./prix";
import { palier, appliquerRemise } from "./promotions";
import { PRODUCTS, type ProductSku } from "./config";

/** Devis exclusivement calculé sur les encaissements enregistrés, jamais sur l’URL. */
export async function devisPour(email: string, sku: ProductSku) {
  const promotionPlan = sku === "upsell1" || sku === "pack5";
  const [commandes, offre] = await Promise.all([
    commandesPayeesParEmail(email),
    promotionPlan ? promotionParEmail(email, "suite") : Promise.resolve(null),
  ]);
  const base = devis(
    sku,
    commandes.flatMap((c) => c.items),
  );
  const promotion = palier(offre);
  const montantPromotionnel = sku === "pack5" && typeof promotion.montantFixe === "number"
    ? promotion.montantFixe + 29
    : promotion.montantFixe;
  const prixFixe = typeof montantPromotionnel === "number" && Number.isFinite(montantPromotionnel)
    ? Math.max(0, Math.min(base.montant, montantPromotionnel))
    : null;
  const montant = base.dejaPossede ? 0 : prixFixe ?? appliquerRemise(base.montant, promotion.pourcent);
  return {
    ...base,
    montant,
    avantRemise: base.montant,
    remise: Math.round((base.montant-montant)*100)/100,
    promotion,
    economiePack: sku === "pack5" ? PRODUCTS.upsell1.price + PRODUCTS.backend4.price - PRODUCTS.pack5.price : 0,
  };
}
