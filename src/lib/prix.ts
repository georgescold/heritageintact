import { PRIX_APRES_FLASH, PRIX_RATTRAPAGE, PRODUCTS } from "@/lib/config";

/**
 * LE PRIX DE LA MÉTHODE POUR CE VISITEUR-CI. Source unique.
 *
 * Trois endroits ont besoin de ce nombre et doivent tomber sur le même, sinon
 * le site ment : le bloc prix de la page de vente, le récapitulatif du bon de
 * commande (« Valider ma commande : … »), et le montant réellement envoyé à
 * Stripe. Le calcul vivait en double — en dur à 27 € dans le formulaire, et en
 * conditionnel dans `prepareCheckout` — et les deux avaient déjà divergé : le
 * bouton annonçait 27 € pendant que le serveur pr��parait un débit de 89 €.
 *
 * La règle, dans l'ordre :
 *   1. compteur jamais démarré  → l'offre à 27 € tient (on ne retire rien)
 *   2. compteur en cours        → 27 €
 *   3. compteur expiré + remise acceptée → PRIX_RATTRAPAGE
 *   4. compteur expiré          → PRIX_APRES_FLASH
 */
export function prixFront(flash: string | undefined, rattrapage: string | undefined): number {
  const echeance = Number(flash ?? 0);
  const expire = echeance > 0 && Date.now() > echeance;
  if (!expire) return PRODUCTS.front.price;
  return rattrapage === "1" ? PRIX_RATTRAPAGE : PRIX_APRES_FLASH;
}
