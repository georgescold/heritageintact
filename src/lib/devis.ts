import { commandesPayeesParEmail } from "./db";
import { devis } from "./prix";
import type { ProductSku } from "./config";

/** Devis exclusivement calculé sur les encaissements enregistrés, jamais sur l’URL. */
export async function devisPour(email: string, sku: ProductSku) {
  const commandes = await commandesPayeesParEmail(email);
  return devis(
    sku,
    commandes.flatMap((c) => c.items),
  );
}
