import type { Acces } from "./db";

/**
 * LA SÉQUENCE DE RASSURANCE POST-ACHAT. Trois emails, et aucun ne vend.
 *
 * Elle n'a rien à voir avec `sequence.ts`, qui s'adresse à un prospect et
 * cherche une vente. Ici l'acheteur a déjà payé : le seul risque qui reste est
 * qu'il n'ouvre jamais ce qu'il a acheté, doute de ce qu'il a fait, et demande
 * un remboursement. On répond donc à une seule question — « est-ce que j'ai
 * bien reçu quelque chose, et est-ce que je saurai y retourner ? »
 *
 * ⚠️ AUCUNE FAUSSE URGENCE, JAMAIS. Pas de « vague qui ferme à minuit » :
 * annoncer une limite qui n'existe pas est une pratique commerciale trompeuse
 * nommément citée par l'article L121-4 du code de la consommation. Les deux
 * seules urgences vraies du projet — les places fondatrices (compteur réel en
 * base) et le 31 décembre 2026 (art. 790 A bis du CGI) — n'ont de toute façon
 * rien à faire dans une séquence adressée à quelqu'un qui a déjà acheté.
 *
 * ⚠️ LA SÉQUENCE DE VENTE DES QUATRE BACKENDS (J+10, J+31, J+52, J+73)
 * S'AJOUTERA DANS CE MÊME TABLEAU, avec ses propres clés dans `acces.envoyes`,
 * et SANS AUCUNE MIGRATION DE SCHÉMA. C'est précisément pour cela que les
 * traces d'envoi sont un `jsonb` et non des colonnes : `create table if not
 * exists` ne crée jamais une colonne sur une table déjà en place, donc toute
 * colonne nouvelle exigerait un ALTER TABLE lancé à la main sur Supabase.
 *
 * Elle ne partira évidemment que quand les backends existeront pour de bon —
 * `disponible: false` aujourd'hui, et vendre un contenu qui n'existe pas sur
 * cette cible, c'est un remboursement à 100 %.
 */

export type EtapeClient = {
  /**
   * "c1", "c2", "c3".
   * ⚠️ ÉCRITE EN BASE dans `acces.envoyes` : ne jamais la renommer. Un
   * renommage ferait repartir la séquence entière à tous les clients déjà
   * servis.
   */
  cle: string;
  /** Jours écoulés depuis la création de l'accès avant l'envoi. */
  jour: number;
  objet: (prenom: string) => string;
  /** `lien` est le lien personnel du membre, déjà complet. */
  corps: (prenom: string, lien: string) => string[];
  bouton: { texte: string; chemin: (jeton: string) => string };
  ps?: string;
  /** L'étape ne part que si vrai. Absent = elle part toujours. */
  condition?: (etat: EtatMembre) => boolean;
};

/**
 * Ce que le cron sait de l'avancement du membre au moment de décider.
 * Calculé depuis `progressionDe(email)`, jamais deviné.
 */
export type EtatMembre = {
  /** L'étape 0 a été AFFICHÉE au moins une fois. */
  etape0Ouverte: boolean;
  /** Nombre d'étapes cochées « j'ai terminé ». */
  nbFaites: number;
};

/** Le nombre d'étapes de La Méthode. Sert au garde de c3. */
const NB_ETAPES = 8;

/**
 * Les chemins de l'espace.
 *
 * `config.urlEspace()` reste le seul endroit qui fabrique l'URL ABSOLUE du
 * membre — c'est elle que l'email affiche en toutes lettres. Ici on ne
 * manipule que des chemins, que `email.ts` recompose avec `lien()`.
 */
const chemin = {
  hub: (jeton: string) => `/espace/${jeton}`,
  etape0: (jeton: string) => `/espace/${jeton}/etape/0`,
};

export const SEQUENCE_CLIENT: EtapeClient[] = [
  {
    cle: "c1",
    jour: 1,
    // Sans condition : celui qui a déjà tout ouvert la reçoit aussi, et c'est
    // voulu. Elle ne demande rien, elle confirme que le lien est le bon.
    objet: () => "Vous avez bien reçu votre lien ?",
    corps: (p, lien) => [
      `Bonjour ${p},`,
      "Un mot rapide, pour être sûr que tout est en ordre de votre côté.",
      "Vous avez reçu hier un lien personnel vers votre espace. C'est le seul dont vous aurez jamais besoin.",
      "<strong>Il n'y a pas de mot de passe, et il n'y a pas de compte à créer.</strong> Ce lien est votre clé, et il ne s'arrêtera jamais de fonctionner.",
      `Le voici à nouveau, écrit en toutes lettres&nbsp;:<br><strong>${lien}</strong>`,
      "Le plus simple est de le mettre dans vos favoris tout de suite&nbsp;: sur un ordinateur, l'étoile en haut à droite de la page. Ainsi vous n'aurez plus jamais à chercher cet email.",
    ],
    bouton: { texte: "Ouvrir mon espace", chemin: chemin.hub },
    ps: `<strong>P.-S.</strong> Et si vous perdiez tout — cet email supprimé, le favori disparu, un autre ordinateur — il suffit d'indiquer votre adresse sur la page « mon espace » du site&nbsp;: le lien repart aussitôt. Vous ne pouvez pas rester dehors.`,
  },
  {
    cle: "c2",
    jour: 3,
    // C'est ici qu'on perd les gens, et c'est ici qu'on les rattrape : trois
    // jours sans avoir seulement affiché l'étape 0, c'est le début d'un
    // remboursement. Le bouton va DIRECTEMENT à l'étape 0, jamais à l'accueil.
    condition: (etat) => !etat.etape0Ouverte,
    objet: () => "Votre étape 0 vous attend",
    corps: (p, lien) => [
      `Bonjour ${p},`,
      "Votre espace est ouvert depuis trois jours, et l'étape 0 n'a pas encore été ouverte. Ce n'est pas un reproche&nbsp;: c'est souvent qu'on ne sait pas par où commencer.",
      "Alors voilà, en une phrase&nbsp;: <strong>l'étape 0 dure douze minutes, et à la fin vous connaissez votre chiffre</strong> — ce que votre famille paierait aujourd'hui si rien ne changeait.",
      "Vous n'avez rien à préparer, rien à calculer, rien à imprimer. Une vidéo, et la Facture Invisible juste en dessous.",
      "Le bouton ci-dessous vous emmène directement à cette étape, sans passer par l'accueil.",
      `Et votre lien personnel, toujours le même&nbsp;:<br><strong>${lien}</strong>`,
    ],
    bouton: { texte: "Commencer l'étape 0", chemin: chemin.etape0 },
  },
  {
    cle: "c3",
    jour: 7,
    // Celui qui a terminé les 8 étapes n'a plus besoin d'être encouragé.
    condition: (etat) => etat.nbFaites < NB_ETAPES,
    objet: (p) => `Où en êtes-vous, ${p} ?`,
    corps: (p, lien) => [
      `Bonjour ${p},`,
      "Une semaine a passé. Aucune obligation de suivre un rythme&nbsp;: La Méthode ne se périme pas, et votre espace reste ouvert aussi longtemps que vous voulez.",
      "Si vous avez commencé, la suite est là où vous vous êtes arrêté&nbsp;: le gros bouton en haut de votre espace reprend toujours à l'étape suivante, vous n'avez rien à retrouver vous-même.",
      "Si vous n'avez pas encore commencé, une seule étape suffit pour aujourd'hui. La première est la plus utile, et c'est aussi la plus courte.",
      "Le conseil que je donne le plus souvent&nbsp;: faites-la avec votre conjoint, un après-midi, sans téléphone. Le chiffre qui sort à la fin se discute mieux à deux.",
      `Votre lien, comme toujours&nbsp;:<br><strong>${lien}</strong>`,
    ],
    bouton: { texte: "Reprendre où j'en suis", chemin: chemin.hub },
    ps: "<strong>P.-S.</strong> Une question sur une étape ? Répondez à ce message, il arrive dans une boîte relevée par un humain.",
  },
];

/**
 * L'étape due pour ce membre aujourd'hui, s'il y en a une.
 *
 * Même logique que `etapeDue` (email.ts) : on n'en renvoie qu'UNE par passage.
 * Deux emails le même jour sur un domaine encore jeune, c'est le meilleur
 * moyen de finir en indésirable — et un client qui ne reçoit plus rien est un
 * client qui ne retrouve plus son accès.
 */
export function etapeClientDue(
  acces: Acces,
  etat: EtatMembre,
  maintenant = Date.now(),
): EtapeClient | null {
  const jours = Math.floor((maintenant - new Date(acces.createdAt).getTime()) / 86_400_000);
  const faites = new Set(acces.envoyes ?? []);
  return (
    SEQUENCE_CLIENT.find(
      (e) => e.jour <= jours && !faites.has(e.cle) && (e.condition?.(etat) ?? true),
    ) ?? null
  );
}
