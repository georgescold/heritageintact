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
  const promotion = palier(["upsell1","upsell2","pack1"].includes(sku) ? await promotionParEmail(email, "suite") : null);
  const montant = base.dejaPossede ? 0 : appliquerRemise(base.montant, promotion.pourcent);
  return { ...base, montant, avantRemise: base.montant, remise: Math.round((base.montant-montant)*100)/100, promotion };
}
