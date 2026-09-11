import {
  accesParEmail,
  assurerAcces,
  commandesPayeesParEmail,
  libererEnvoi,
  marquerLienRenvoye,
  reouvrirAcces,
  reserverEnvoi,
  type Acces,
  type Order,
} from "./db";
import { envoyerAcces, envoyerRecuAchat } from "./email";

/**
 * LA LIVRAISON. Ce que reçoit un acheteur, et par quels chemins il peut le
 * recevoir quand le premier échoue.
 *
 * Trois filets, et il en faut trois :
 *   1. `livrer()`, appelée par `confirmCheckout` juste après le paiement, et
 *      par le webhook Stripe qui rattrape le navigateur fermé trop tôt ;
 *   2. le rattrapage du cron, qui repasse chaque jour sur les commandes payées
 *      restées sans email d'accès ;
 *   3. le lien affiché EN CLAIR sur /merci, qui est le seul des trois à
 *      survivre au scénario le plus vicieux — `RESEND_API_KEY` absente, où
 *      `envoyer()` renvoie `{ ok: true }` sans rien expédier et sans qu'aucun
 *      log ne s'en plaigne.
 */

/** La clé de traçage de l'email d'accès dans `acces.envoyes`. Écrite en base. */
const CLE_ACCES = "acces";

/**
 * Anti-abus du formulaire « j'ai perdu mon lien ». Deux minutes suffisent :
 * assez pour qu'un plaisantin ne puisse pas inonder la boîte d'un client,
 * assez court pour que celui qui a mal tapé son adresse recommence sans
 * attendre — et il a 74 ans, il ne comprendra pas qu'on le fasse patienter.
 */
const DELAI_RENVOI_MS = 2 * 60 * 1000;

/**
 * Crée l'accès si besoin et envoie l'email d'accès UNE SEULE FOIS.
 *
 * ⚠️ L'ORDRE DES TROIS ÉTAPES EST TOUT LE SUJET DE CETTE FONCTION.
 *
 * 1. `assurerAcces` d'abord : LE JETON EXISTE EN BASE AVANT QUE RESEND SOIT
 *    SOLLICITÉ. C'est ce qui permet à /merci d'afficher le lien en clair même
 *    si l'email ne part jamais. Inverser les deux lignes suffirait à faire
 *    dépendre l'accès du bon vouloir d'un service tiers.
 *
 * 2. `reserverEnvoi` ensuite, et c'est une réservation ATOMIQUE :
 *    `confirmCheckout` (le navigateur) et le webhook Stripe peuvent tomber à
 *    la même seconde. Un seul des deux obtient une ligne en retour, donc UN
 *    SEUL email part. Deux emails d'accès identiques à la minute où l'acheteur
 *    doute le plus de ce qu'il vient de faire, c'est un email au support.
 *
 *    ⚠️ L'idempotence ne peut PAS reposer sur la garde de statut du webhook
 *    (`order.status !== "paid"`) : après un `confirmCheckout` réussi, le
 *    webhook n'entre jamais dans ce bloc, et le filet de sécurité ne livrerait
 *    donc jamais rien. `livrer` doit être appelée HORS de cette garde.
 *
 * 3. L'envoi, et la LIBÉRATION de la réservation si Resend refuse — sans
 *    quoi la clé resterait posée et l'email d'accès de cet acheteur ne
 *    partirait plus JAMAIS, ni par le webhook, ni par le cron.
 *
 * NE LÈVE JAMAIS. Un paiement réussi ne doit jamais être annulé parce qu'un
 * email n'est pas parti.
 */
export async function livrer(order: Order): Promise<Acces | null> {
  try {
    let acces = await assurerAcces({ email: order.email, firstName: order.firstName });

    /**
     * ⚠️ L'ANCIEN REMBOURSÉ QUI REPASSE COMMANDE. Il restait dehors À VIE.
     *
     * `assurerAcces` rend la ligne existante telle quelle — `revoque` à true
     * pour toujours — et la clé « acces » y était posée depuis le premier
     * achat, donc `reserverEnvoi` perdait et AUCUN email ne partait. Il payait
     * une seconde fois, /merci lui affichait son lien, et le lien lui répondait
     * « votre accès a été clôturé ». Le formulaire de récupération sortait lui
     * aussi en silence sur `acces.revoque`. Les trois chemins d'entrée lui
     * mentaient en chœur, et l'écran de révocation l'invitait explicitement
     * dans ce piège (« il suffira de repasser commande »).
     *
     * On ne rouvre que sur le PRODUIT D'APPEL non remboursé : c'est lui, et lui
     * seul, qui avait fermé la porte.
     */
    if (acces.revoque && order.items.some((i) => i.sku === "front" && !i.rembourse)) {
      acces = (await reouvrirAcces(acces.email)) ?? acces;
    }

    const gagne = await reserverEnvoi(acces.email, CLE_ACCES);
    // Perdu la réservation : l'email est déjà parti, ou il est en train de
    // partir dans l'autre appelant. On rend quand même l'accès — l'appelant en
    // a besoin pour afficher le lien.
    if (!gagne) return acces;

    const r = await envoyerAcces(gagne);
    if (!r.ok) await libererEnvoi(gagne.email, CLE_ACCES);

    // LE REÇU DU GUIDE, séparé de l'accès. C'est lui qui porte l'invitation
    // Trustpilot (copie cachée), et il ne contient jamais le lien personnel.
    // Sans lui, l'invitation ne partait jamais : le reçu n'existait que pour les
    // achats suivants. Même clé à chaque appel (confirmation, webhook, cron) :
    // un seul envoi par commande.
    const guide = order.items.find((i) => i.sku === "front" && !i.rembourse);
    if (r.ok && guide) {
      const autres = order.items
        .filter((i) => i.sku !== "front" && !i.rembourse)
        .map((i) => ({ sku: i.sku, montant: i.price }));
      await envoyerRecuAchat(gagne, "front", guide.price, order.id, autres);
    }
    return gagne;
  } catch (err) {
    console.error("[livraison] livrer a échoué", err);
    return null;
  }
}

/**
 * Retrouve l'accès d'une adresse, ou le refabrique depuis une commande payée.
 *
 * C'est l'AUTO-RÉPARATION : elle sert aux commandes antérieures à l'existence
 * de l'espace, et à tout accès qu'un incident aurait laissé non créé. Tant
 * qu'il existe une commande payée à cette adresse, il n'existe aucun chemin
 * par lequel l'acheteur reste dehors.
 *
 * Renvoie `null` si l'adresse n'a jamais rien payé. L'appelant ne doit RIEN en
 * déduire à l'écran : le message affiché est le même dans les deux cas.
 */
export async function assurerAccesDepuisEmail(email: string): Promise<Acces | null> {
  try {
    const existant = await accesParEmail(email);
    if (existant) return existant;

    const commandes = await commandesPayeesParEmail(email);
    if (commandes.length === 0) return null;

    // Le prénom de la commande la plus récente qui en porte un : c'est celui
    // sous lequel l'acheteur se reconnaîtra le mieux aujourd'hui.
    const prenom = [...commandes].reverse().find((o) => o.firstName.trim())?.firstName ?? "";
    return await assurerAcces({ email, firstName: prenom });
  } catch (err) {
    console.error("[livraison] assurerAccesDepuisEmail a échoué", err);
    return null;
  }
}

/**
 * Renvoie le lien personnel à l'adresse enregistrée. TOUJOURS SILENCIEUSE.
 *
 * ⚠️ Elle ne renvoie rien d'exploitable, et c'est délibéré : l'appelant doit
 * afficher exactement le même message que l'adresse existe ou non
 * (« Si cette adresse correspond à un achat, votre lien vient de repartir »).
 * Sans cela, le formulaire deviendrait un moyen de savoir qui a acheté.
 *
 * Le lien ne part QUE vers l'adresse déjà en base. Un inconnu qui saisit
 * l'adresse d'un tiers n'apprend rien et ne peut que déranger le vrai
 * propriétaire — c'est du bruit, pas une fuite, et le garde des deux minutes
 * en limite le volume.
 */
export async function renvoyerAcces(email: string): Promise<void> {
  try {
    const acces = await assurerAccesDepuisEmail(email);
    if (!acces) return;

    // Accès révoqué (produit d'appel remboursé) : on ne renvoie pas un email
    // intitulé « votre accès » à quelqu'un dont l'accès est fermé. L'espace
    // lui affiche déjà une page polie s'il ouvre un ancien lien.
    if (acces.revoque) return;

    const dernier = acces.renvoyeLe ? new Date(acces.renvoyeLe).getTime() : 0;
    if (Date.now() - dernier < DELAI_RENVOI_MS) return;

    // Noté AVANT l'envoi : c'est une limite de débit, elle doit tenir même si
    // Resend met du temps à répondre.
    await marquerLienRenvoye(acces.email);

    const r = await envoyerAcces(acces, `renvoi-v3/${acces.jeton}/${Math.floor(Date.now() / 120000)}`);

    // Le lien vient de partir de toute façon : on pose la clé "acces" pour que
    // le rattrapage du cron ne renvoie pas un second email demain matin. Le
    // retour est ignoré — perdre cette réservation signifie simplement qu'elle
    // était déjà posée.
    if (r.ok) await reserverEnvoi(acces.email, CLE_ACCES);
  } catch (err) {
    console.error("[livraison] renvoyerAcces a échoué", err);
  }
}
