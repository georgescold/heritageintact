import { createHmac, timingSafeEqual } from "node:crypto";
import { PROMOTIONS_ACTIVES, type Palier } from "./promotions";

/**
 * LA FENÊTRE DE PRIX DE LA PAGE D'ATTERRISSAGE PUBLICITAIRE.
 *
 * Depuis le 16/09/2026, /lp vend directement : la pub mène à la vidéo et au bon
 * de commande sur la même page, sans capture d'email intermédiaire (décision de
 * Loys). Il n'y a donc plus de clic vers /commander pour ouvrir la fenêtre
 * à −50 %, et plus d'adresse email pour l'ancrer dans la table `promotions`.
 *
 * Le départ vit dans un cookie SIGNÉ, posé par `proxy.ts` à l'arrivée — même
 * dispositif que la boutique de guides (`fenetre-guide.ts`), et mêmes
 * conséquences :
 *
 * ⚠️ LA SIGNATURE N'EST PAS DÉCORATIVE. Sans elle, n'importe qui écrirait une
 * date de départ dans le futur et resterait à −50 % pour toujours. Effacer le
 * cookie ne donne qu'une fenêtre de plus ; le falsifier en donnerait une infinie.
 *
 * ⚠️ SANS SECRET CONFIGURÉ, PAS DE FENÊTRE : le prix du catalogue s'affiche
 * plutôt qu'une remise que la page de paiement ne saurait pas justifier.
 */
/**
 * Fenêtre portée de 5 à 10, puis 30, puis 60 minutes le 16/09/2026, à la demande de Loys.
 * Motif du dernier passage : un visiteur venu d'Instagram a regardé la vidéo deux
 * fois (18 min sur la page) et a vu la remise expirer AVANT d'avoir touché au bon
 * de commande — il a cliqué à 52 € au lieu de 26 €. Le compte à rebours doit
 * survivre au visionnage, sinon il pénalise exactement ceux qui écoutent tout.
 */
export const COOKIE_FENETRE_LP = "hi_lp";
export const MINUTES_FENETRE_LP = 60;
export const REMISE_LP = 50;

function cle(): string | null {
  const valeur = process.env.PRIX_SECRET || process.env.CRON_SECRET || "";
  return valeur.length >= 16 ? valeur : null;
}

/** Domaine séparé : la même clé ne doit pas signer deux choses différentes. */
function signer(debut: number, secret: string): string {
  return createHmac("sha256", secret).update("fenetre-lp|" + debut).digest("hex");
}

const memeValeur = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** La valeur à déposer dans le cookie, ou `null` si aucune clé n'est configurée. */
export function marqueFenetreLp(debut = Date.now()): string | null {
  const secret = cle();
  return secret ? `${debut}.${signer(debut, secret)}` : null;
}

/** Le départ lu dans le cookie, ou `null` si absent, illisible ou falsifié. */
export function debutFenetreLp(brut: string | undefined): number | null {
  const secret = cle();
  if (!secret || !brut) return null;
  const [partie, signature] = brut.split(".");
  const debut = Number(partie);
  if (!Number.isFinite(debut) || !signature) return null;
  // Une date de départ dans le futur ne peut venir que d'une falsification.
  if (debut > Date.now() + 60_000) return null;
  return memeValeur(signature, signer(debut, secret)) ? debut : null;
}

/** Le palier courant, dans la forme que `AvantageDemarrage` et le prix savent lire. */
export function palierLp(brut: string | undefined, maintenant = Date.now()): Palier {
  const ferme: Palier = {
    pourcent: 0,
    fin: null,
    suivant: 0,
    serveurMaintenant: maintenant,
    gamme: "front",
    montantFixe: null,
    suivantFixe: null,
  };
  const debut = debutFenetreLp(brut);
  if (debut === null || !PROMOTIONS_ACTIVES) return ferme;
  const fin = debut + MINUTES_FENETRE_LP * 60_000;
  if (maintenant >= fin) return ferme;
  return { ...ferme, pourcent: REMISE_LP, fin: new Date(fin).toISOString() };
}

/**
 * LE JETON DU LIEN DE RELANCE.
 *
 * L'email de relance (`relance-paiement.ts`) doit rouvrir une fenêtre à −50 %,
 * sinon son destinataire retombe sur le prix plein : son cookie existe déjà,
 * expiré, et le proxy ne le remplace pas. Le jeton lie le lien à UNE commande,
 * pour qu'une adresse `/relancer` recopiée au hasard n'ouvre rien.
 */
export function jetonRelance(orderId: string): string | null {
  const secret = cle();
  return secret ? createHmac("sha256", secret).update("relance-lp|" + orderId).digest("hex").slice(0, 32) : null;
}

export function relanceValide(orderId: string, jeton: string | null | undefined): boolean {
  const attendu = jetonRelance(orderId);
  if (!attendu || !jeton || jeton.length !== attendu.length) return false;
  return timingSafeEqual(Buffer.from(attendu), Buffer.from(jeton));
}
