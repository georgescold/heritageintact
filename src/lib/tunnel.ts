import { PRODUCTS, type ProductSku } from "@/lib/config";
import { profilDeCommande } from "@/lib/db";
import {
  QUALIFICATION_ACTIVE,
  ROUTE,
  sequence,
  urlEcran,
  type Ecran,
  type Reponses,
} from "@/lib/qualification";

/**
 * LE TUNNEL D'UPSELLS, VU DEPUIS UNE PAGE.
 *
 * Chaque écran d'upsell pose la même question au moment où il s'affiche : « suis-je
 * bien le bon écran pour cet acheteur-ci, et qu'est-ce qui vient après moi ? »
 * C'est cette fonction qui répond, et elle est la SEULE à le faire — sans elle,
 * chaque page recalculerait sa suite dans son coin et les deux finiraient par
 * diverger.
 *
 * ═══ Pourquoi la séquence est filtrée par `disponible`, et pas seulement calculée
 *
 * `sequence()` répond à une question commerciale : de quoi cet acheteur a-t-il
 * besoin, dans quel ordre. Elle ne sait rien de ce qui est PRODUIT. Un écran peut
 * donc être parfaitement pertinent et pointer vers un produit qui ne livre encore
 * rien — c'est exactement le cas du pack aujourd'hui, dont la page n'existe pas.
 *
 * On filtre donc ici, en dernier ressort, sur le seul drapeau qui dit la vérité.
 * Conséquence utile : le jour où le pack sera prêt, il suffira de passer son
 * drapeau à `true` pour qu'il apparaisse dans le parcours de ceux qui y ont droit,
 * sans toucher une ligne de routage.
 *
 * ═══ Pourquoi aucune redirection ne peut boucler
 *
 * Une page ne se redirige JAMAIS vers elle-même : on ne redirige que vers un écran
 * différent, pris plus loin dans une séquence dont cette page vient d'être exclue.
 * La séquence étant finie et l'index strictement croissant, la chaîne se termine
 * toujours — au pire sur /merci.
 */

/** Le produit vendu par chaque écran. Sert à filtrer sur `disponible`. */
const SKU_DE_L_ECRAN: Record<Ecran, ProductSku> = {
  plan: "upsell1",
  "assurance-vie": "upsell2",
  pack: "pack1",
};

export type EtapeTunnel =
  | { afficher: true; suivant: string; position: number; total: number }
  | { afficher: false; versOu: string };

/**
 * Ce que doit faire l'écran `ecran` pour la commande `orderId`.
 *
 * `bumpPresent` conditionne le pack : sa remise se justifie en partie parce que
 * l'acheteur a déjà pris le Dossier notaire, qui est le mode d'emploi du Plan.
 */
export async function etapeTunnel(
  ecran: Ecran,
  orderId: string,
  opts: { bumpPresent: boolean },
): Promise<EtapeTunnel> {
  // Interrupteur général : à `false`, on ne lit même pas la base. Le tunnel se
  // comporte alors exactement comme avant le dispositif — c'est ce qui rend le
  // retour en arrière gratuit, et vérifiable en une ligne.
  const profil: Reponses | null = QUALIFICATION_ACTIVE ? await profilDeCommande(orderId) : null;

  const voulue = sequence(profil, opts);
  const seq = voulue.filter((e) => PRODUCTS[SKU_DE_L_ECRAN[e]].disponible);

  const i = seq.indexOf(ecran);
  const versMerci = `/merci?o=${encodeURIComponent(orderId)}`;

  // Cet écran n'a rien à faire dans ce parcours : on passe au premier qui reste.
  // Le client ne voit pas une offre sautée, il voit l'étape suivante.
  if (i < 0) {
    return { afficher: false, versOu: seq.length ? urlEcran(seq[0], orderId, 1) : versMerci };
  }

  const suivant = i + 1 < seq.length ? urlEcran(seq[i + 1], orderId, i + 2) : versMerci;
  return { afficher: true, suivant, position: i + 1, total: seq.length };
}

/** Le chemin d'un écran, sans paramètre — pour les liens écrits en dur. */
export const CHEMIN_ECRAN = ROUTE;
