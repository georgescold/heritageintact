import { createHmac, timingSafeEqual } from "node:crypto";
import { PRODUCTS, type ProductSku } from "./config";
import { appliquerRemise, PROMOTIONS_ACTIVES, type Palier } from "./promotions";

/**
 * LA FENÊTRE DE PRIX DES GUIDES VENDUS À L'UNITÉ.
 *
 * Dégressive : −30 % pendant vingt minutes, puis −20 % pendant dix de plus,
 * puis le prix du catalogue. Deux paliers plutôt qu'un seul couperet, parce que
 * l'expiration brutale d'une remise sous les yeux de quelqu'un qui lisait
 * encore fait plus de mal que pas de remise du tout — et parce qu'un second
 * palier rattrape celui qui a voulu en parler à son conjoint.
 *
 * ⚠️ POURQUOI UN COOKIE ET PAS LA BASE. Les fenêtres du tunnel sont ancrées par
 * email dans la table `promotions` : elles ne peuvent pas se relancer. Ici, la
 * boutique reçoit des visiteurs dont on ne connaît pas l'adresse, et Loys a
 * choisi que la fenêtre s'ouvre pour tout le monde. Le départ vit donc dans un
 * cookie signé. Conséquence assumée : quelqu'un qui vide ses cookies rouvre une
 * fenêtre. Le risque est de perdre une remise, jamais d'ouvrir une faille.
 *
 * ⚠️ LA SIGNATURE N'EST PAS DÉCORATIVE. Sans elle, n'importe qui peut écrire une
 * date de départ dans le futur et se figer au meilleur palier pour toujours.
 * Effacer le cookie ne donne qu'une fenêtre de plus ; le falsifier en donnerait
 * une infinie.
 *
 * ⚠️ SANS SECRET, PAS DE FENÊTRE. Si aucune clé n'est configurée, la fonction
 * rend le prix du catalogue plutôt qu'une remise non signée. Une remise
 * forgeable coûte plus cher qu'une remise absente.
 */

export const COOKIE_FENETRE = "hi_fenetre";

/** Paliers cumulés depuis l'ouverture. Le dernier ferme la fenêtre. */
export const PALIERS_GUIDE = [
  { finMinutes: 20, pourcent: 30 },
  { finMinutes: 30, pourcent: 20 },
] as const;

function cle(): string | null {
  const valeur = process.env.PRIX_SECRET || process.env.CRON_SECRET || "";
  return valeur.length >= 16 ? valeur : null;
}

/** Domaine séparé : la même clé ne doit pas signer deux choses différentes. */
function signer(debut: number, secret: string): string {
  return createHmac("sha256", secret).update("fenetre-guide|" + debut).digest("hex");
}

const memeValeur = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/**
 * LA FENÊTRE PEUT-ELLE S’OUVRIR SUR CE SERVEUR ?
 *
 * Sert à n’annoncer une promotion QUE si le site sait l’appliquer. Sans secret
 * configuré, aucun cookie n’est posé et le prix reste celui du catalogue :
 * afficher « en promotion » dans ce cas ferait une promesse que la page de
 * commande démentirait dix secondes plus tard.
 */
export function fenetreDisponible(): boolean {
  return cle() !== null && PROMOTIONS_ACTIVES;
}

/** La remise du premier palier, pour l’annoncer sans la recopier. */
export const REMISE_MAX = PALIERS_GUIDE[0].pourcent;
/** La durée du premier palier, en minutes. */
export const DUREE_PREMIER_PALIER = PALIERS_GUIDE[0].finMinutes;

/** La valeur à déposer dans le cookie, ou `null` si aucune clé n'est configurée. */
export function marqueFenetre(debut = Date.now()): string | null {
  const secret = cle();
  return secret ? `${debut}.${signer(debut, secret)}` : null;
}

/** Le départ lu dans le cookie, ou `null` si absent, illisible ou falsifié. */
export function debutFenetre(brut: string | undefined): number | null {
  const secret = cle();
  if (!secret || !brut) return null;
  const [partie, signature] = brut.split(".");
  const debut = Number(partie);
  if (!Number.isFinite(debut) || !signature) return null;
  // Une date de départ dans le futur ne peut venir que d'une falsification.
  if (debut > Date.now() + 60_000) return null;
  return memeValeur(signature, signer(debut, secret)) ? debut : null;
}

/**
 * Le palier courant, dans la forme que `AvantageDemarrage` sait afficher.
 *
 * `gamme: "suite"` et `montantFixe: null` sélectionnent sa branche générique en
 * pourcentage — celle qui annonce le palier suivant et l'heure de fin. Aucun
 * montant fixe ici : les guides n'ont pas le même prix, et 147 € de remise sur
 * un guide à 47 € n'aurait aucun sens.
 */
export function fenetreGuide(debut: number | null, maintenant = Date.now()): Palier {
  const ferme: Palier = {
    pourcent: 0,
    fin: null,
    suivant: 0,
    serveurMaintenant: maintenant,
    gamme: "suite",
    montantFixe: null,
    suivantFixe: null,
  };
  if (debut === null || !PROMOTIONS_ACTIVES) return ferme;

  const ecoule = maintenant - debut;
  if (ecoule < 0) return ferme;

  for (let i = 0; i < PALIERS_GUIDE.length; i++) {
    const palier = PALIERS_GUIDE[i];
    const fin = debut + palier.finMinutes * 60_000;
    if (maintenant < fin) {
      return {
        ...ferme,
        pourcent: palier.pourcent,
        fin: new Date(fin).toISOString(),
        suivant: PALIERS_GUIDE[i + 1]?.pourcent ?? 0,
      };
    }
  }
  return ferme;
}

/**
 * LE PRIX DÛ, ET IL EST CALCULÉ ICI POUR TOUT LE MONDE.
 *
 * L'écran comme la banque appellent cette fonction : c'est ce qui empêche qu'un
 * montant affiché diverge du montant débité, l'accident que `db.ts` et
 * `actions.ts` racontent tous les deux.
 *
 * ⚠️ La remise porte sur le GUIDE seul. Le complément reste au prix du
 * catalogue, comme le bump du tunnel : une remise qui s'étend silencieusement à
 * une case cochée après coup rend le total impossible à vérifier.
 */
export function prixGuide(
  sku: ProductSku,
  palier: Palier,
  complement: ProductSku | null,
): { guide: number; complement: number; total: number; base: number } {
  const base = PRODUCTS[sku].price;
  const guide = palier.pourcent ? appliquerRemise(base, palier.pourcent) : base;
  const sup = complement ? PRODUCTS[complement].price : 0;
  return {
    guide,
    complement: sup,
    total: Math.round((guide + sup) * 100) / 100,
    base,
  };
}
