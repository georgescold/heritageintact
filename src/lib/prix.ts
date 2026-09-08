import {
  PRIX_APRES_FLASH,
  PRIX_RATTRAPAGE,
  PRODUCTS,
  REMISE_LIGNE_DUPLIQUEE,
  type ProductSku,
} from "@/lib/config";
import { appliquerPalier } from "@/lib/palier";

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

/**
 * LE PRIX D'UNE OFFRE APRÈS LA MÉTHODE, POUR CET ACHETEUR-CI. Source unique.
 *
 * ═══ LA RÈGLE, EN UNE LIGNE ═══
 *
 * La ligne « 3 clauses bénéficiaires commentées » figure dans les deux piles
 * de valeur affichées à l'écran, à 47 € chacune. On ne la livre qu'une fois,
 * donc on ne l'encaisse qu'une fois — voir `REMISE_LIGNE_DUPLIQUEE`.
 *
 *   Le Plan            297 €   ·   250 € si l'Assurance-vie est déjà acquise
 *   L'Assurance-vie     97 €   ·    50 € si Le Plan est déjà acquis
 *   Le Dossier complet 347 €   = 297 + 97 − 47
 *
 * ⚠️ LA PROPRIÉTÉ QUI JUSTIFIE TOUT : 297 + 50 = 347 et 97 + 250 = 347. Les
 * trois chemins arrivent au même total. Aucun chemin d'achat n'est puni, et
 * personne ne peut découvrir après coup qu'il aurait payé moins en cliquant
 * dans l'autre ordre. Sans la seconde offre à prix réduit, l'acheteur qui
 * prend les deux séparément paierait 394 € pour ce que son voisin a eu à
 * 347 €, pendant que l'écran du pack lui affirme « nous ne la facturons
 * qu'une fois » : sur un homme de 74 ans qui relit son relevé, c'est
 * exactement la faille qu'on prétendait fermer.
 *
 * ═══ D'OÙ VIENT `possede` ═══
 *
 * TOUJOURS DE LA BASE — `possessions(order.email)` de `@/lib/espace`, la même
 * fonction que l'espace membre — ET JAMAIS D'UN PARAMÈTRE D'URL. Le code
 * qualifie deux fois ses propres URL de devinables : un prix réduit qui
 * dépendrait de l'URL serait un tarif à la carte offert au premier curieux.
 *
 * Aucun montant n'est écrit en dur ici : tout se dérive de `PRODUCTS` et de
 * `REMISE_LIGNE_DUPLIQUEE`, pour que le prix affiché et le prix débité ne
 * puissent pas diverger.
 */
/**
 * @param remise La remise du palier de lancement, en fraction (0,5 = −50 %).
 *   Elle vient TOUJOURS de `palierDe(order.createdAt, Date.now())`, jamais d'un
 *   paramètre d'URL ni d'un cookie : c'est une date en base qui la fixe, donc
 *   ni un rechargement ni un nouvel onglet ne la rouvrent.
 *
 *   ⚠️ Elle s'applique à TOUS les chemins, jamais au seul pack. Sinon
 *   297 + 50 = 347 et pack = 347 deviendraient 297 + 50 = 347 et pack = 173 :
 *   celui qui prend les produits l'un après l'autre paierait le double de son
 *   voisin. C'est la propriété que la règle des 47 € existe pour tenir, et le
 *   palier ne doit pas la casser.
 */
export function prixUpsell(sku: ProductSku, possede: Set<ProductSku>, remise = 0): number {
  return appliquerPalier(prixUpsellPlein(sku, possede), remise);
}

/** Le prix hors palier. C'est lui qu'on barre à l'écran. */
export function prixUpsellPlein(sku: ProductSku, possede: Set<ProductSku>): number {
  if (sku === "upsell1") {
    return possede.has("upsell2")
      ? PRODUCTS.upsell1.price - REMISE_LIGNE_DUPLIQUEE
      : PRODUCTS.upsell1.price;
  }

  if (sku === "upsell2") {
    return possede.has("upsell1")
      ? PRODUCTS.upsell2.price - REMISE_LIGNE_DUPLIQUEE
      : PRODUCTS.upsell2.price;
  }

  // Le pack se recalcule au lieu de relire `PRODUCTS.pack1.price` : le prix du
  // catalogue sert à l'affichage, celui-ci part chez Stripe. Les deux doivent
  // être le même nombre, et la seule façon de s'en assurer est de le dériver
  // des deux produits qu'il contient. Le pack n'est jamais proposé à qui
  // possède déjà l'un des deux (garde dans `chargeUpsell`), il n'y a donc pas
  // de prix réduit du pack.
  if (sku === "pack1") {
    return PRODUCTS.upsell1.price + PRODUCTS.upsell2.price - REMISE_LIGNE_DUPLIQUEE;
  }

  /**
   * LES TROIS PACKS « NOTAIRE ». Le Dossier notaire y est OFFERT, donc il
   * n'entre pas dans l'addition : le prix est exactement celui du ou des
   * produits payants qu'ils contiennent.
   *
   * ⚠️ On ne relit pas `PRODUCTS.packN.price` : le prix du catalogue sert à
   * l'affichage, celui-ci part chez Stripe, et la seule façon de garantir que
   * les deux soient le même nombre est de le dériver de ses composants. Si un
   * jour Le Plan passe à 347 €, ces trois lignes suivent sans qu'on y pense.
   */
  if (sku === "pack2") return PRODUCTS.upsell1.price;
  if (sku === "pack3") {
    return PRODUCTS.upsell1.price + PRODUCTS.upsell2.price - REMISE_LIGNE_DUPLIQUEE;
  }
  if (sku === "pack4") return PRODUCTS.upsell2.price;

  return PRODUCTS[sku].price;
}
