import { commandesPayeesParEmail, promotionParEmail } from "./db";
import { devis } from "./prix";
import { palier, appliquerRemise } from "./promotions";
import type { ProductSku } from "./config";

/** Devis exclusivement calculé sur les encaissements enregistrés, jamais sur l’URL. */
export async function devisPour(email: string, sku: ProductSku) {
  const commandes = await commandesPayeesParEmail(email);
  const base = devis(
    sku,
    commandes.flatMap((c) => c.items),
  );
  const promotion = palier(sku === "upsell1" ? await promotionParEmail(email, "suite") : null);
  const prixFixe = typeof promotion.montantFixe === "number" && Number.isFinite(promotion.montantFixe)
    ? Math.max(0, Math.min(base.montant, promotion.montantFixe))
    : null;
  const montant = base.dejaPossede ? 0 : prixFixe ?? appliquerRemise(base.montant, promotion.pourcent);
  return { ...base, montant, avantRemise: base.montant, remise: Math.round((base.montant-montant)*100)/100, promotion };
}
