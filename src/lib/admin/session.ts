import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * LA GARDE DU PANEL D'ADMINISTRATION.
 *
 * Le site n'a ni comptes, ni mots de passe, ni table d'utilisateurs — c'est un
 * choix produit assumé partout ailleurs (voir `/connexion`). En introduire une
 * pour une seule personne serait la pire des réponses : une surface d'attaque
 * permanente, à maintenir, pour un unique compte.
 *
 * On reprend donc la discipline déjà en place sur `/api/pilotage` :
 *
 *   1. UN SECRET D'ENVIRONNEMENT, jamais une valeur par défaut. Sans
 *      `ADMIN_PASSWORD`, le panel n'existe pas — il ne se replie sur aucun mot
 *      de passe « de développement », parce qu'un mot de passe de repli finit
 *      toujours par tourner en production.
 *   2. UNE LONGUEUR MINIMALE. Un secret court est refusé à l'ouverture de
 *      session, pas au moment où quelqu'un le devine.
 *   3. UNE COMPARAISON À TEMPS CONSTANT. `timingSafeEqual` sur des tampons de
 *      même longueur : on compare d'abord les longueurs, puis les octets.
 *
 * La session tient dans un cookie signé, sans stockage serveur : il n'y a rien
 * à révoquer côté base, et changer `ADMIN_PASSWORD` invalide instantanément
 * toutes les sessions ouvertes, puisque la clé de signature en dérive.
 *
 * ⚠️ Le cookie ne contient AUCUNE donnée — seulement une échéance et sa
 * signature. Il n'y a donc rien à voler dedans, et rien à falsifier sans le
 * secret.
 */

const COOKIE = "hi_admin";
/** Douze heures : une journée de travail, pas une session permanente. */
const DUREE_MS = 12 * 60 * 60 * 1000;
/**
 * Le plancher, et il ne dépend plus de l'environnement.
 *
 * ⚠️ IL VALAIT 16 CARACTÈRES EN PRODUCTION JUSQU'AU 12/09/2026, et un secret
 * plus court y fermait le panel plutôt que de l'ouvrir faiblement. Loys a
 * demandé le même mot de passe partout, en connaissance de cause et après que
 * la conséquence lui a été exposée deux fois : le panel affiche l'adresse
 * email, les commandes et les réponses personnelles de chaque client.
 *
 * Les huit caractères qui restent ne protègent plus de grand-chose — ils
 * écartent la valeur vide et la faute de frappe à un caractère, rien de plus.
 * Ce qui protège réellement aujourd'hui tient en trois lignes, et il faut les
 * garder à l'esprit avant de toucher à ce fichier :
 *
 *   1. la comparaison à temps constant, qui interdit de deviner le secret
 *      caractère par caractère en mesurant le temps de réponse ;
 *   2. l'absence totale de mot de passe par défaut — sans variable, 404 ;
 *   3. le message d'erreur unique, qui ne dit jamais si le panel existe.
 *
 * ⚠️ CE QUI MANQUE, ET QUI DEVIENT LE VRAI SUJET : rien ne limite le nombre de
 * tentatives. Un mot de passe court et prononçable se devine en ligne si on
 * laisse quelqu'un essayer indéfiniment. La réponse n'est pas d'allonger ce
 * nombre en douce, c'est un compteur de tentatives — à faire le jour où de
 * vrais clients seront en base.
 */
const LONGUEUR_MINIMALE = 8;

function secret(): string | null {
  const valeur = process.env.ADMIN_PASSWORD ?? "";
  return valeur.length >= LONGUEUR_MINIMALE ? valeur : null;
}

/** Le panel est-il installable du tout ? Faux = secret absent ou trop court. */
export function adminConfigure(): boolean {
  return secret() !== null;
}

function signer(echeance: number, cle: string): string {
  return createHmac("sha256", cle).update(String(echeance)).digest("hex");
}

/** Égalité en temps constant, longueurs comprises. */
function memeValeur(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function motDePasseValide(fourni: string): boolean {
  const cle = secret();
  return cle !== null && memeValeur(fourni, cle);
}

/**
 * La session est-elle ouverte ? À appeler AVANT toute lecture de données, dans
 * chaque page du panel — et non une seule fois dans le layout : sous le routeur
 * d'application, un layout ne s'exécute pas nécessairement à chaque rendu de
 * page, et une garde qui ne s'exécute pas est une garde absente.
 */
export async function sessionAdminOuverte(): Promise<boolean> {
  const cle = secret();
  if (!cle) return false;
  const brut = (await cookies()).get(COOKIE)?.value ?? "";
  const [partEcheance, signature] = brut.split(".");
  const echeance = Number(partEcheance);
  if (!Number.isFinite(echeance) || !signature) return false;
  if (echeance < Date.now()) return false;
  return memeValeur(signature, signer(echeance, cle));
}

export async function ouvrirSessionAdmin(): Promise<void> {
  const cle = secret();
  if (!cle) return;
  const echeance = Date.now() + DUREE_MS;
  (await cookies()).set(COOKIE, `${echeance}.${signer(echeance, cle)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: Math.floor(DUREE_MS / 1000),
  });
}
