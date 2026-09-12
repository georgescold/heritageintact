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
const LONGUEUR_MINIMALE = 16;

/**
 * ⚠️ LA LONGUEUR MINIMALE NE S'APPLIQUE QU'EN PRODUCTION, ET C'EST VOLONTAIRE.
 *
 * En développement, un mot de passe court est commode et sans conséquence : la
 * base locale est sur la machine de son propriétaire. En production, le même
 * mot de passe ouvrirait l'email, les commandes et les réponses personnelles de
 * chaque client à quiconque le devine.
 *
 * Le choix fait ici est donc qu'un secret trop court en production ne DÉGRADE
 * pas la protection : il l'annule. `secret()` rend `null`, la garde répond 404,
 * et le panel reste fermé. Un mot de passe de test ne peut pas se retrouver en
 * ligne par oubli — il n'ouvre simplement rien.
 *
 * Le prix de ce choix, assumé : en production, un ADMIN_PASSWORD trop court se
 * manifeste par un 404, pas par un message. C'est indistinguable d'un panel non
 * installé, ce qui est exactement le comportement voulu vis-à-vis d'un visiteur
 * — et ce qui oblige à relire ce commentaire quand on se demande pourquoi.
 */
function secret(): string | null {
  const valeur = process.env.ADMIN_PASSWORD ?? "";
  if (!valeur) return null;
  if (process.env.NODE_ENV === "production") {
    return valeur.length >= LONGUEUR_MINIMALE ? valeur : null;
  }
  return valeur;
}

/** Le panel est-il installable du tout ? Faux = secret absent, ou trop court en production. */
export function adminConfigure(): boolean {
  return secret() !== null;
}

/**
 * Le secret en place tiendrait-il en production ?
 *
 * Sert à afficher un avertissement permanent sur le panel en développement. Un
 * réglage de confort qui ne se voit pas est un réglage qu'on oublie, et
 * celui-ci garde des adresses email de clients.
 */
export function secretFaible(): boolean {
  const valeur = process.env.ADMIN_PASSWORD ?? "";
  return valeur.length > 0 && valeur.length < LONGUEUR_MINIMALE;
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

export async function fermerSessionAdmin(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
