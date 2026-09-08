"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isTestMode, PRODUCTS, SKU_TUNNEL_UNIQUEMENT, type ProductSku } from "@/lib/config";
import {
  commandeAvecCarte,
  commandeEspaceEnCours,
  commandesEspacePendantes,
  creerCommandeEspace,
  getOrder,
  markOrderPaid,
  type Acces,
} from "@/lib/db";
import { envoyerRecuAchat } from "@/lib/email";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { prixUpsell } from "@/lib/prix";
import { stripe, toCents } from "@/lib/stripe";

/**
 * L'ACHAT DEPUIS L'ESPACE MEMBRE.
 *
 * Trois mois après sa commande, le membre ajoute un produit sans ressaisir sa
 * carte. Ce fichier est le seul chemin d'écriture de cette boutique, et il
 * porte trois obligations que le rendu ne peut pas porter à sa place.
 *
 * ═══ 1. LES GARDES SONT REJOUÉES ICI, INTÉGRALEMENT ═══
 *
 * L'écran de confirmation les vérifie déjà. Ça ne suffit pas : une server
 * action est une URL, elle s'appelle sans passer par l'écran qui la précède.
 * « Étape 0 ouverte », « produit disponible », « produit non possédé » sont
 * donc revérifiés ci-dessous, à partir du jeton et de rien d'autre.
 *
 * ═══ 2. `redirect()` NE DOIT JAMAIS ÊTRE APPELÉE DANS UN try QUI ENTOURE STRIPE ═══
 *
 * `redirect()` fonctionne EN LEVANT une exception : c'est sa conception. Dans
 * un `try` qui attrape les erreurs de paiement, elle serait avalée par le
 * `catch` et traduite en « paiement refusé » à quelqu'un qui vient d'être
 * débité pour de bon. On sort du `try`, on décide, puis on redirige.
 *
 * ═══ 3. UNE COMMANDE ADDITIONNELLE, JAMAIS UN AJOUT SUR LA COMMANDE D'ORIGINE ═══
 *
 * Empiler l'article sur la commande du tunnel ferait gonfler `orderTotal`, et
 * un vieux `/merci?o=…` rouvert des mois plus tard rejouerait l'événement
 * Purchase de Meta avec un montant jamais débité en une fois.
 */
export async function acheterDepuisEspace(jeton: string, sku: ProductSku): Promise<void> {
  const hub = `/espace/${jeton}`;

  // La forme du jeton se vérifie sans ouvrir la base. Un jeton malformé ne
  // mène pas au hub — il n'y a pas de hub — mais au formulaire de
  // récupération, qui est la seule page utile dans ce cas.
  if (!estJetonValide(jeton)) redirect("/espace");

  const etat = await chargerEspace(jeton);
  if (!etat) redirect("/espace");
  if (etat.acces.revoque) redirect(hub);

  // ⚠️ Le SKU arrive d'une URL. Le type ne protège de rien à l'exécution :
  // `PRODUCTS[sku]` sur une clé inventée vaut `undefined`, et la ligne
  // suivante lèverait une 500 sur un membre qui a simplement mal recopié.
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, sku)) redirect(hub);

  // Les trois gardes, dans l'ordre où elles coûtent cher quand elles manquent.
  if (!etat.etape0Ouverte) redirect(hub);
  if (!PRODUCTS[sku].disponible) redirect(hub);
  if (etat.possede.has(sku)) redirect(hub);

  /**
   * QUATRIÈME GARDE — LES SKU RÉSERVÉS AU TUNNEL.
   *
   * Le Dossier complet se justifie par le clic unique, trois secondes après la
   * saisie de la carte. Trois mois plus tard cette justification n'existe
   * plus, et l'URL qui mène ici est devinable. La garde `etat.possede.has(sku)`
   * juste au-dessus ne suffit pas : elle ne teste que `pack1` lui-même, donc
   * elle laisserait passer un débit de 347 € sur quelqu'un qui possède déjà
   * la moitié du contenu.
   *
   * Retour silencieux au hub, comme les trois précédentes : ni 404, ni « accès
   * refusé » — le second apprendrait surtout au visiteur que l'URL devinée
   * était bonne.
   */
  if (SKU_TUNNEL_UNIQUEMENT.includes(sku)) redirect(hub);

  const { email, firstName } = etat.acces;

  /**
   * ⚠️ LE PRIX VIENT DE `prixUpsell`, PAS DU CATALOGUE. C'est le même acheteur
   * que dans le tunnel : il ne doit pas payer 97 € ici là où le tunnel lui
   * aurait dit 50 €. La ligne « 3 clauses bénéficiaires commentées » figure
   * dans les deux piles de valeur et n'est encaissée qu'une fois — la règle
   * vaut partout ou elle ne vaut rien.
   *
   * `etat.possede` vient de `possessions(email)`, donc de la base, jamais de
   * l'URL.
   */
  const prix = prixUpsell(sku, etat.possede);

  // La carte du membre : celle de sa commande payée la plus récente qui porte
  // un moyen de paiement mémorisé. C'est elle, et elle seule, qui autorise un
  // débit hors session.
  const commandeCarte = await commandeAvecCarte(email);

  /**
   * ⚠️ LA PROTECTION ANTI-DOUBLE-DÉBIT, ET ELLE EST EN TROIS TEMPS.
   *
   * TEMPS 1 — LE RATTRAPAGE D'UN DÉBIT DÉJÀ ENCAISSÉ. Sans lui, second débit
   * de 297 € possible. La fenêtre de 2 minutes du temps 2 ne protège que 2
   * minutes ; au-delà, une commande neuve porte une clé d'idempotence neuve, et
   * la seule autre garde (`etat.possede.has(sku)`) repose sur `status = 'paid'`.
   * Si `markOrderPaid` a levé, ou si la fonction a été coupée après la réponse
   * de Stripe, la commande est restée « pending » et rien ne voit le paiement :
   * le membre ne trouve pas son produit, redescend, et reclique.
   *
   * On demande donc à Stripe — la seule source de vérité sur ce qui a été
   * encaissé — si l'une des commandes en suspens de ce membre pour ce produit
   * porte déjà un paiement réussi. Si oui : on répare la ligne et on l'emmène à
   * son produit, sans rien débiter.
   */
  const repare = await rattraperPaiementEnSuspens(email, sku);
  if (repare) {
    revalidatePath(hub);
    redirect(`${hub}?ajoute=${sku}`);
  }

  /**
   * TEMPS 2 — LA RÉUTILISATION DE COMMANDE. Une commande espace « pending » de
   * moins de 2 minutes pour le même SKU est RÉUTILISÉE : la clé d'idempotence
   * Stripe est construite sur l'identifiant de commande, elle reste donc
   * identique sur un double-clic et Stripe rend le premier paiement au lieu
   * d'en créer un second. Passé ces 2 minutes, une nouvelle commande est créée —
   * c'est ce qui autorise une vraie seconde tentative après un refus de carte,
   * au lieu de rejouer éternellement la clé d'un paiement échoué.
   *
   * TEMPS 3 — la seconde tentative d'écriture après le débit, plus bas.
   */
  const enCours = await commandeEspaceEnCours(email, sku);
  const order =
    enCours ??
    (await creerCommandeEspace({
      email,
      firstName,
      sku,
      mode: isTestMode ? "test" : "live",
      stripeCustomerId: commandeCarte?.stripeCustomerId,
      stripePaymentMethodId: commandeCarte?.stripePaymentMethodId,
    }));

  // Mode simulé : aucune clé Stripe, aucun appel réseau, aucun débit. Sans ce
  // chemin, tout le parcours d'achat depuis l'espace serait intestable en
  // local — et c'est précisément le parcours qu'on ne peut pas se permettre de
  // découvrir en production.
  if (!stripe) {
    await markOrderPaid(order.id, {});
    await recu(etat.acces, sku, prix);
    revalidatePath(hub);
    redirect(`${hub}?ajoute=${sku}`);
  }

  const customer = order.stripeCustomerId ?? commandeCarte?.stripeCustomerId;
  const paymentMethod = order.stripePaymentMethodId ?? commandeCarte?.stripePaymentMethodId;

  // Aucune carte mémorisée : ce n'est pas un échec, c'est le formulaire de
  // carte. Renvoyer quelqu'un de 75 ans écrire au support pour pouvoir payer,
  // c'est la vente perdue.
  if (!customer || !paymentMethod) redirect(`${hub}/ajouter/${sku}/carte?o=${order.id}`);

  type Issue =
    | { statut: "ok"; intentId: string }
    /** DSP2 : la banque exige une authentification forte. Ce n'est pas un refus. */
    | { statut: "sca" }
    | { statut: "refus" };

  let issue: Issue = { statut: "refus" };

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount: toCents(prix),
        currency: "eur",
        customer,
        payment_method: paymentMethod,
        off_session: true,
        confirm: true,
        description: PRODUCTS[sku].short,
        // Le reçu Stripe part de lui-même. C'est le second filet du dispositif
        // anti-fraude, après notre propre reçu : si quelqu'un d'autre avait le
        // lien, le propriétaire de la carte est prévenu deux fois.
        receipt_email: email,
        metadata: { orderId: order.id, sku },
      },
      // La clé d'idempotence est l'identifiant de la commande : un double-clic
      // ne peut pas produire deux débits.
      { idempotencyKey: order.id },
    );

    if (intent.status === "succeeded") issue = { statut: "ok", intentId: intent.id };
    else if (intent.status === "requires_action") issue = { statut: "sca" };
  } catch (e) {
    const err = e as { code?: string };
    issue = err.code === "authentication_required" ? { statut: "sca" } : { statut: "refus" };
    if (issue.statut === "refus") console.error("[achat-espace] paiement refusé", e);
  }

  // ⚠️ TOUT CE QUI SUIT EST HORS DU try. Voir l'en-tête du fichier : une
  // redirection à l'intérieur y serait attrapée et transformée en refus.

  if (issue.statut === "ok") {
    /**
     * ⚠️ LE DÉBIT A EU LIEU. À partir d'ici, plus rien ne doit ressembler à un
     * échec pour le membre : l'argent est parti, et lui dire « paiement
     * refusé » à cet instant est le pire message possible.
     *
     * Si l'écriture en base échoue, le trou est réel et connu (le débit est
     * encaissé, la ligne est perdue) — une réconciliation par paymentIntentId
     * reste à écrire, et elle existe déjà pour les upsells du tunnel. Ce qu'on
     * peut faire ici, c'est le journaliser bruyamment et laisser partir le
     * reçu, qui est la trace que le membre aura sous les yeux.
     */
    // ⚠️ UNE SECONDE TENTATIVE AVANT D'ABANDONNER. Une commande restée
    // « pending » alors que l'argent est parti est ce qui ouvre la porte au
    // second débit : `possessions()` ne la voit pas, et le membre reclique.
    // Un incident passager de la base ne doit pas coûter cela.
    try {
      await markOrderPaid(order.id, {
        customerId: customer,
        paymentMethodId: paymentMethod,
        paymentIntentId: issue.intentId,
      });
    } catch (premiere) {
      console.error(
        "[achat-espace] écriture en base refusée, seconde tentative",
        order.id,
        premiere,
      );
      try {
        await markOrderPaid(order.id, {
          customerId: customer,
          paymentMethodId: paymentMethod,
          paymentIntentId: issue.intentId,
        });
      } catch (e) {
        console.error("[achat-espace] débit encaissé sans écriture en base", order.id, sku, e);
      }
    }
    await recu(etat.acces, sku, prix);
    revalidatePath(hub);
    redirect(`${hub}?ajoute=${sku}`);
  }

  if (issue.statut === "sca") redirect(`${hub}/ajouter/${sku}/carte?o=${order.id}`);

  redirect(`${hub}/ajouter/${sku}?err=refus`);
}

/**
 * LE REÇU, ENVOYÉ IMMÉDIATEMENT.
 *
 * Ce n'est pas une politesse, c'est le filet anti-fraude du lien portant : le
 * jeton voyage dans un historique de navigateur, sur un ordinateur familial,
 * dans une capture d'écran envoyée au support. Si quelqu'un d'autre s'en
 * servait, c'est le propriétaire de la carte qui est prévenu dans la minute,
 * et le message lui dit en toutes lettres qu'un mot suffit à tout annuler.
 *
 * L'envoi est attendu — sur Vercel, la fonction est coupée à la redirection et
 * un envoi non attendu ne part pas — mais il ne peut pas faire échouer
 * l'achat : le membre a payé, il a son produit.
 */
async function recu(acces: Acces, sku: ProductSku, montant: number): Promise<void> {
  try {
    await envoyerRecuAchat(acces, sku, montant);
  } catch (e) {
    console.error("[achat-espace] reçu non envoyé", acces.email, sku, e);
  }
}

/**
 * « CE MEMBRE A-T-IL DÉJÀ PAYÉ CE PRODUIT SANS QUE LA LIGNE SOIT ÉCRITE ? »
 *
 * On interroge Stripe, pas la base : la base est précisément ce qui a manqué.
 * Pour chaque commande espace restée « pending » sur ce SKU, on cherche parmi
 * les derniers PaymentIntents du client celui qui porte son identifiant et qui
 * a réussi. S'il existe, on marque la commande payée et on rend `true` —
 * l'appelant emmène alors le membre à son produit sans rien débiter.
 *
 * ⚠️ NE LÈVE JAMAIS. En cas d'incident chez Stripe on rend `false` : le pire
 * qui puisse arriver est de retomber sur le comportement d'avant, jamais de
 * bloquer quelqu'un qui veut acheter.
 */
async function rattraperPaiementEnSuspens(email: string, sku: ProductSku): Promise<boolean> {
  if (!stripe) return false;

  try {
    const enSuspens = await commandesEspacePendantes(email, sku);
    if (enSuspens.length === 0) return false;

    const client = enSuspens.find((o) => o.stripeCustomerId)?.stripeCustomerId;
    if (!client) return false;

    const intents = await stripe.paymentIntents.list({ customer: client, limit: 25 });

    let repare = false;
    for (const order of enSuspens) {
      const intent = intents.data.find(
        (i) => i.status === "succeeded" && i.metadata?.orderId === order.id,
      );
      if (!intent) continue;

      await markOrderPaid(order.id, {
        customerId: client,
        paymentMethodId:
          typeof intent.payment_method === "string" ? intent.payment_method : undefined,
        paymentIntentId: intent.id,
      });
      console.log("[achat-espace] paiement retrouvé chez Stripe, commande réparée", order.id);
      repare = true;
    }
    return repare;
  } catch (e) {
    console.error("[achat-espace] rattrapage impossible", email, sku, e);
    return false;
  }
}

/**
 * LE REÇU DU CHEMIN DSP2, ENVOYÉ CÔTÉ SERVEUR APRÈS VÉRIFICATION.
 *
 * ⚠️ LE FILET ANTI-FRAUDE DISPARAISSAIT EXACTEMENT LÀ OÙ UNE CARTE EST
 * RESAISIE. Le chemin nominal passe par `acheterDepuisEspace`, qui envoie le
 * reçu ; le repli DSP2, lui, confirme par `confirmCheckout`, dont la livraison
 * n'envoie que l'email d'ACCÈS — et sa clé est posée depuis le premier achat,
 * donc rien ne partait du tout. Quelqu'un d'autre pouvait déclencher un débit
 * de 297 € sans que le titulaire de la carte en soit averti par nous.
 *
 * Le jeton et la propriété de la commande sont revalidés ici : une server
 * action est une URL, et celle-ci déclenche un envoi nominatif.
 */
export async function confirmerAchatEspace(
  jeton: string,
  sku: ProductSku,
  orderId: string,
): Promise<void> {
  if (!estJetonValide(jeton)) return;
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, sku)) return;

  const etat = await chargerEspace(jeton);
  if (!etat || etat.acces.revoque) return;

  const order = await getOrder(orderId);
  if (!order || order.status !== "paid") return;
  if (order.email !== etat.acces.email) return;
  if (!order.items.some((i) => i.sku === sku)) return;

  /**
   * ⚠️ LE MONTANT DU REÇU EST CELUI DE `prixUpsell`, PAS `orderTotal(order)`.
   *
   * `creerCommandeEspace` écrit la ligne au prix du CATALOGUE : une commande
   * espace pour l'Assurance-vie porte donc 97 € même quand 50 € ont été
   * débités (règle des 47 €). Un reçu qui annonce 97 € pendant que la banque
   * prélève 50 €, c'est l'appel au support qu'on cherche à éviter — et sur
   * cette cible, un reçu qui ne colle pas au relevé est le début d'un litige.
   *
   * `prixUpsell` reproduit exactement le montant débité : les deux offres ne
   * se regardent que l'une l'autre (Le Plan regarde l'Assurance-vie et
   * réciproquement), donc le fait que `etat.possede` contienne désormais `sku`
   * ne change pas le résultat.
   *
   * ⚠️ À CORRIGER À LA SOURCE : `creerCommandeEspace` (lib/db.ts) devrait
   * accepter un prix, comme `addItem` le fait déjà. Ce fichier n'en est pas
   * propriétaire.
   */
  await recu(etat.acces, sku, prixUpsell(sku, etat.possede));
}

/**
 * LE REPLI DSP2 — un PaymentIntent ON-SESSION sur la commande déjà créée.
 *
 * Trois semaines ou trois mois après le paiement initial, une banque
 * européenne peut exiger une authentification forte même sur une carte
 * enregistrée. Sans ce chemin, le membre lit « paiement refusé » et n'achète
 * jamais : c'est la condition pour que la boutique rapporte quoi que ce soit,
 * pas un raffinement.
 *
 * ⚠️ `metadata.orderId` est INDISPENSABLE : `confirmCheckout` exige que le
 * PaymentIntent porte le même identifiant de commande que celui qu'on lui
 * annonce. C'est l'un des deux contrôles serveur qui empêchent une validation
 * forgée depuis le navigateur.
 *
 * ⚠️ `setup_future_usage: "off_session"` : la carte confirmée ici remplace
 * celle qui vient d'échouer pour tous les débits suivants. Sans lui, le membre
 * repasserait par ce formulaire à chaque achat.
 */
export async function preparerPaiementEspace(
  jeton: string,
  orderId: string,
  sku: ProductSku,
): Promise<{ ok: true; clientSecret: string } | { ok: false; error: string }> {
  /**
   * ⚠️ L'HABILITATION EST REJOUÉE ICI, ENTIÈREMENT.
   *
   * Cette action ne vérifiait QUE `order.status !== "paid"` sur un identifiant
   * de commande fourni par le navigateur. Deux trous s'ouvraient d'un coup :
   *
   *   — un visiteur au compteur expiré appelait l'action avec l'identifiant de
   *     sa propre commande du tunnel et payait `orderTotal` au lieu du prix dû ;
   *   — un onglet /carte laissé ouvert restait armé : les gardes de la page
   *     sont évaluées AU RENDU, et le membre qui avait entre-temps acheté le
   *     produit par une AUTRE commande pouvait le payer une seconde fois — la
   *     clé d'idempotence, construite sur l'identifiant de commande, ne pouvait
   *     rien puisque les deux commandes en ont un différent.
   *
   * Les quatre mêmes gardes qu'`acheterDepuisEspace`, plus la propriété de la
   * commande et sa forme (un seul article, celui de l'URL).
   */
  if (!estJetonValide(jeton)) return { ok: false, error: "Ce lien n'est plus valable." };
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, sku)) {
    return { ok: false, error: "Ce produit n'existe pas." };
  }

  const etat = await chargerEspace(jeton);
  if (!etat) return { ok: false, error: "Ce lien n'est plus valable." };
  if (etat.acces.revoque) return { ok: false, error: "Votre accès est clôturé." };

  if (!PRODUCTS[sku].disponible) {
    return { ok: false, error: "Ce produit n'est pas encore disponible à la vente." };
  }

  // Le repli DSP2 est un chemin de paiement à part entière, et une server
  // action est une URL : la garde des SKU réservés au tunnel se rejoue ici,
  // sans quoi Le Dossier complet redeviendrait payable depuis l'espace par
  // l'onglet /carte.
  if (SKU_TUNNEL_UNIQUEMENT.includes(sku)) {
    return { ok: false, error: "Ce produit n'est pas disponible depuis votre espace." };
  }

  if (etat.possede.has(sku)) {
    return {
      ok: false,
      error: "Vous avez déjà ce document, il est dans votre espace. Rien n'a été débité.",
    };
  }

  const order = await getOrder(orderId);
  if (!order) return { ok: false, error: "Cette commande est introuvable." };
  if (order.email !== etat.acces.email) {
    return { ok: false, error: "Cette commande n'est pas la vôtre." };
  }
  // La forme d'une commande créée par `creerCommandeEspace` : un seul article,
  // celui de l'URL. Une commande du tunnel (front + bump) n'entre pas ici.
  if (order.items.length !== 1 || order.items[0].sku !== sku) {
    return { ok: false, error: "Cette commande ne correspond pas à ce produit." };
  }

  // Déjà réglée : le navigateur rejoue un formulaire que le membre a laissé
  // ouvert. On ne redébite pas, et on ne parle pas d'erreur.
  if (order.status === "paid") {
    return { ok: false, error: "Cette commande est déjà réglée. Vous n'avez rien à faire." };
  }

  if (!stripe) {
    return { ok: false, error: "Le paiement n'est pas disponible pour le moment." };
  }

  try {
    const intent = await stripe.paymentIntents.create({
      // ⚠️ `prixUpsell` et non `orderTotal(order)` : la ligne écrite par
      // `creerCommandeEspace` porte le prix du CATALOGUE, donc 97 € là où la
      // règle des 47 € dit 50 €. Le chemin nominal (`acheterDepuisEspace`) et
      // le repli DSP2 doivent débiter le même montant, sinon le membre paie
      // plus cher parce que sa banque a demandé une confirmation.
      amount: toCents(prixUpsell(sku, etat.possede)),
      currency: "eur",
      customer: order.stripeCustomerId,
      setup_future_usage: "off_session",
      // Carte uniquement : doit correspondre au `paymentMethodTypes` du
      // navigateur, sinon Stripe refuse la confirmation sans rien expliquer.
      payment_method_types: ["card"],
      receipt_email: order.email,
      description: order.items.map((i) => PRODUCTS[i.sku].short).join(" + "),
      metadata: { orderId: order.id, sku },
    });
    return { ok: true, clientSecret: intent.client_secret ?? "" };
  } catch (e) {
    console.error("[achat-espace] preparerPaiementEspace", e);
    return { ok: false, error: "Le paiement n'a pas pu être préparé. Réessayez dans un instant." };
  }
}
