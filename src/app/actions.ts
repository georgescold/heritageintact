"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accesParEmail,
  addItem,
  addLead,
  marquerEnvoye,
  attachStripeCustomer,
  createOrder,
  getOrder,
  markOrderPaid,
} from "@/lib/db";
import { isTestMode, PRODUCTS, type ProductSku } from "@/lib/config";
import { possessions } from "@/lib/espace";
import { palierDe } from "@/lib/palier";
import { prixFront, prixUpsell } from "@/lib/prix";
import { stripe, toCents } from "@/lib/stripe";
import { envoyerLivraison, envoyerRecuAchat } from "@/lib/email";
import { livrer } from "@/lib/livraison";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Opt-in landing page → cookie lead → VSL */
export async function optin(_prev: FormState, formData: FormData): Promise<FormState> {
  const firstName = clean(formData.get("firstName"));
  const email = clean(formData.get("email"));
  const cgv = formData.get("cgv") === "on";
  // D'où vient ce lead : c'est ce qui rend l'A/B test mesurable après l'opt-in.
  const source = clean(formData.get("source")).slice(0, 60) || undefined;

  if (firstName.length < 2) return { error: "Indiquez votre prénom." };
  if (!EMAIL_RE.test(email))
    return { error: "Vérifiez votre adresse email : elle semble incomplète." };
  if (!cgv) {
    return { error: "Cochez la case pour accepter les conditions générales avant de continuer." };
  }

  const lead = await addLead({ email, firstName, source });

  // L'email de livraison part tout de suite. On l'attend : sans ça, la fonction
  // se termine avec la redirection et l'envoi peut être coupé net sur Vercel.
  // Il ne lève jamais, un incident chez Resend ne doit pas bloquer l'inscription.
  const envoi = await envoyerLivraison(lead);
  if (envoi.ok) await marquerEnvoye(lead.id, "j0");

  const jar = await cookies();
  jar.set("hi_lead", JSON.stringify({ email: lead.email, firstName: lead.firstName }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/methode");
}

// ─────────────────────────────────────────────────────────────────────
//  PAIEMENT
// ─────────────────────────────────────────────────────────────────────

export type PrepareResult =
  { ok: true; clientSecret: string; orderId: string } | { ok: false; error: string };

/**
 * Étape 1 du paiement : on crée la commande (statut « pending »), le client Stripe,
 * et le PaymentIntent. `setup_future_usage: off_session` est la clé du projet :
 * c'est ce qui permet de débiter les upsells en un clic, sans ressaisie de carte.
 */
export async function prepareCheckout(input: {
  firstName: string;
  email: string;
  withBump: boolean;
  consent: boolean;
}): Promise<PrepareResult> {
  const firstName = input.firstName.trim();
  const email = input.email.trim().toLowerCase();

  if (firstName.length < 2) return { ok: false, error: "Indiquez votre prénom." };
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Vérifiez votre adresse email : elle semble incomplète." };
  }
  if (!input.consent) {
    return {
      ok: false,
      error:
        "Pour accéder immédiatement à la Méthode, cochez la case concernant le droit de rétractation.",
    };
  }

  // ⚠️ LE PRIX SE CALCULE UNE SEULE FOIS, ET AVANT LA COMMANDE.
  //
  // Il était calculé plus bas, juste pour Stripe, pendant que `createOrder`
  // écrivait la ligne « front » au prix catalogue : la banque prélevait 89 €
  // (ou 62 €) et la commande en enregistrait 27. /merci facturait donc un
  // montant que le relevé bancaire contredisait, et l'événement Purchase de
  // Meta remontait la valeur basse. Une seule variable alimente désormais la
  // ligne de commande ET le PaymentIntent.
  const jar = await cookies();
  const prix = prixFront(jar.get("hi_flash")?.value, jar.get("hi_rattrapage")?.value);

  const order = await createOrder({
    email,
    firstName,
    withBump: input.withBump,
    consentImmediateAccess: input.consent,
    mode: isTestMode ? "test" : "live",
    status: isTestMode ? "paid" : "pending",
    prixFront: prix,
  });

  // Mode test simulé : aucune clé Stripe, aucun débit.
  //
  // ⚠️ Ce parcours-là ne passe JAMAIS par `confirmCheckout` : le navigateur
  // enchaîne directement sur l'upsell. Sans cet appel, le mode simulé ne
  // créerait aucun accès et le chantier entier deviendrait intestable en local.
  // Le garde sur le statut évite de livrer une commande restée « pending »
  // (clé publique présente mais clé secrète absente : `isTestMode` est alors
  // faux alors que `stripe` est nul).
  if (!stripe) {
    if (order.status === "paid") await livrer(order);
    return { ok: true, clientSecret: "", orderId: order.id };
  }

  // Le montant débité se construit à partir de la MÊME variable que la ligne
  // de commande : l'écran, la base et la banque ne peuvent plus diverger.
  const amount = prix + (input.withBump ? PRODUCTS.bump.price : 0);

  try {
    const customer = await stripe.customers.create({
      email,
      name: firstName,
      metadata: { orderId: order.id },
    });

    const intent = await stripe.paymentIntents.create({
      amount: toCents(amount),
      currency: "eur",
      customer: customer.id,
      // Autorise le débit ultérieur des upsells sans que le client ressaisisse sa carte.
      setup_future_usage: "off_session",
      // Carte uniquement : doit correspondre à `paymentMethodTypes` côté navigateur.
      payment_method_types: ["card"],
      // Le reçu Stripe. /merci promet « un reçu vous est envoyé par email »
      // depuis toujours, et aucun reçu ne partait : sur cette cible, une
      // promesse d'écran non tenue le jour du paiement est un email au support.
      receipt_email: email,
      description: input.withBump
        ? `${PRODUCTS.front.short} + ${PRODUCTS.bump.short}`
        : PRODUCTS.front.short,
      metadata: { orderId: order.id, withBump: String(input.withBump) },
    });

    // On mémorise le client Stripe, mais la commande reste « pending » :
    // rien n'est encaissé tant que confirmCheckout (ou le webhook) n'a pas validé.
    await attachStripeCustomer(order.id, customer.id);

    return { ok: true, clientSecret: intent.client_secret ?? "", orderId: order.id };
  } catch (e) {
    console.error("[stripe] prepareCheckout", e);
    return {
      ok: false,
      error: "Le paiement n'a pas pu être initialisé. Réessayez dans un instant.",
    };
  }
}

/**
 * Étape 2 : appelée par le navigateur une fois le paiement confirmé par Stripe.
 * On revérifie côté serveur que le PaymentIntent est bien « succeeded » : on ne
 * fait jamais confiance au client sur un statut de paiement.
 *
 * C'est aussi ici que la livraison se déclenche, et l'ordre est le sujet :
 * `markOrderPaid` D'ABORD (c'est lui qui écrit le couple client / moyen de
 * paiement, carburant de tous les débits suivants), la livraison ENSUITE.
 */
export async function confirmCheckout(
  orderId: string,
  paymentIntentId: string,
): Promise<{ ok: boolean; error?: string; jeton?: string }> {
  const order = await getOrder(orderId);
  if (!order) return { ok: false, error: "Commande introuvable." };
  if (!stripe) return { ok: true };

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return { ok: false, error: "Le paiement n'a pas abouti." };
    }
    if (intent.metadata?.orderId !== orderId) {
      return { ok: false, error: "Paiement non rattaché à cette commande." };
    }

    await markOrderPaid(orderId, {
      customerId: typeof intent.customer === "string" ? intent.customer : undefined,
      paymentMethodId:
        typeof intent.payment_method === "string" ? intent.payment_method : undefined,
      paymentIntentId: intent.id,
    });
  } catch (e) {
    console.error("[stripe] confirmCheckout", e);
    return { ok: false, error: "Vérification du paiement impossible." };
  }

  // ⚠️ LA LIVRAISON EST HORS DU try/catch CI-DESSUS, ET CE N'EST PAS UN DÉTAIL
  // DE STYLE : à l'intérieur, la moindre exception serait attrapée par le
  // `catch` du paiement et rendrait « Vérification du paiement impossible » à
  // quelqu'un qui vient d'être débité. `livrer` ne lève jamais, mais on ne
  // laisse pas cette garantie dépendre d'un fichier qu'un autre lot maintient.
  //
  // L'envoi est ATTENDU, comme celui de l'opt-in : sans le `await`, Vercel
  // coupe la fonction à la redirection et l'email ne part pas. Coût pour le
  // client : environ 400 ms avant l'upsell.
  try {
    const acces = await livrer(order);
    return { ok: true, jeton: acces?.jeton };
  } catch (e) {
    console.error("[livraison] confirmCheckout", e);
    return { ok: true };
  }
}

// ─────────────────────────────────────────────────────────────────────
//  UPSELLS EN UN CLIC
// ─────────────────────────────────────────────────────────────────────

export type UpsellResult =
  { ok: true } | { ok: false; error: string; needsAuthentication?: boolean; expire?: boolean };

/**
 * LA DURÉE DE VIE DU CLIC UNIQUE, ET ELLE EST COURTE PAR NÉCESSITÉ.
 *
 * Le débit en un clic ne se justifie que tant que le geste est continu : le
 * client vient de saisir sa carte, il est encore en train de payer. Le tunnel
 * dure quelques minutes. Sans cette borne, `?o=<orderId>` restait une URL
 * valable POUR TOUJOURS : trois mois plus tard, n'importe qui rouvrant
 * l'historique du navigateur familial débitait 297 € sur la carte du père,
 * sans écran de confirmation.
 *
 * Passé ce délai, on ne refuse pas la vente — on la renvoie vers l'espace, qui
 * a l'écran de confirmation en deux clics et le rappel de la carte.
 */
const FENETRE_UPSELL_MS = 30 * 60 * 1000;

/**
 * Débit hors session sur la carte déjà enregistrée : c'est ce qui rend l'upsell
 * possible en un seul clic.
 *
 * Cas particulier européen : la directive DSP2 peut exiger une authentification
 * forte, même sur une carte enregistrée. Stripe renvoie alors `authentication_required`.
 * On le traite explicitement plutôt que d'afficher une erreur générique.
 */
export async function chargeUpsell(orderId: string, sku: ProductSku): Promise<UpsellResult> {
  // ⚠️ Le drapeau se vérifie DANS L'ACTION, pas seulement à l'affichage :
  // un SKU connu du type devient facturable dès que quelqu'un écrit son prix,
  // et l'URL qui mène ici est devinable. Encaisser 147 € pour un contenu qui
  // n'existe pas, sur une garantie de 30 jours, c'est un remboursement annoncé.
  if (!PRODUCTS[sku].disponible) {
    return { ok: false, error: "Ce produit n'est pas encore disponible à la vente." };
  }

  const order = await getOrder(orderId);
  if (!order) return { ok: false, error: "Commande introuvable." };
  if (order.items.some((i) => i.sku === sku)) return { ok: true }; // déjà acheté

  // ⚠️ HORS DE LA FENÊTRE, ON NE DÉBITE PLUS EN UN CLIC. Voir FENETRE_UPSELL_MS :
  // l'appelant redirige alors vers l'espace, qui demande une confirmation.
  if (Date.now() - Date.parse(order.createdAt) > FENETRE_UPSELL_MS) {
    return {
      ok: false,
      expire: true,
      error:
        "Cette offre ne peut plus être ajoutée à votre commande d'origine. Vous la retrouvez dans votre espace, avec sa page de confirmation.",
    };
  }

  /**
   * ⚠️ LE PRIX SE CALCULE ICI, SUR LE SERVEUR, À PARTIR DE LA BASE.
   *
   * `possessions()` est la même fonction que celle de l'espace membre : elle
   * lit toutes les commandes payées de l'adresse, écarte les articles
   * remboursés et applique l'expansion `INCLUS_DANS`. Rien de tout cela ne
   * peut venir de l'URL — celle qui mène ici est devinable, et un paramètre
   * qui baisserait un prix serait un tarif à la carte offert au premier
   * curieux.
   *
   * La règle des 47 € : l'Assurance-vie coûte 50 € à qui possède déjà Le Plan,
   * Le Plan coûte 250 € à qui possède déjà l'Assurance-vie. Voir `prixUpsell`.
   */
  const possede = await possessions(order.email);

  /**
   * LA GARDE DU PACK. Le Dossier complet ne contient QUE Le Plan et
   * l'Assurance-vie : le proposer à quelqu'un qui possède déjà l'un des deux,
   * c'est encaisser 347 € pour la moitié d'un contenu déjà payé.
   *
   * ⚠️ `order.items.some(...)` plus haut ne voit que `pack1` lui-même, et
   * `possede.has("pack1")` ne verrait pas davantage ses composants. C'est bien
   * sur les DEUX composants qu'il faut tester.
   */
  const COMPOSANTS: Partial<Record<string, ProductSku[]>> = {
    pack1: ["upsell1", "upsell2"],
    pack2: ["upsell1", "bump"],
    pack3: ["upsell1", "upsell2", "bump"],
    pack4: ["upsell2", "bump"],
  };
  if (COMPOSANTS[sku]?.some((c) => possede.has(c))) {
    return {
      ok: false,
      error: "Ce produit est déjà en partie dans votre commande. Rien n'a été débité.",
    };
  }

  /**
   * LE PALIER DE LANCEMENT, côté SERVEUR et nulle part ailleurs.
   *
   * Il se calcule sur `order.createdAt`, une date écrite en base au moment du
   * paiement : ni un rechargement, ni un nouvel onglet, ni un cookie effacé ne
   * la déplacent. C'est ce qui distingue une remise dégressive licite d'un
   * compteur qui se réinitialise — lequel serait une pratique trompeuse
   * (art. L121-2), quand bien même il afficherait le bon nombre.
   *
   * ⚠️ Le même appel doit servir à AFFICHER le prix sur l'écran d'upsell. Le
   * jour où l'affichage lira autre chose, l'écran annoncera un montant et
   * Stripe en débitera un autre — c'est le défaut qu'on a déjà corrigé une
   * fois sur le bon de commande.
   */
  const { remise } = palierDe(order.createdAt, Date.now());
  const montant = prixUpsell(sku, possede, remise);

  if (!stripe) {
    await addItem(orderId, sku, undefined, montant);
    await offrirDossierNotaire(orderId, sku, possede);
    await recuUpsell(order.email, sku, montant);
    return { ok: true };
  }

  if (!order.stripeCustomerId || !order.stripePaymentMethodId) {
    return { ok: false, error: "Moyen de paiement introuvable pour cette commande." };
  }

  try {
    const intent = await stripe.paymentIntents.create(
      {
        /**
         * ⚠️ UN SEUL PaymentIntent, Y COMPRIS POUR LE PACK. Deux débits en un
         * clic, ce sont deux lignes sur un relevé bancaire — et sur cet
         * acheteur, un relevé qu'on ne comprend pas est un appel à la banque
         * avant d'être un email au support, puis une opposition avant d'être
         * un remboursement. La propriété du Plan et de l'Assurance-vie vient
         * de `INCLUS_DANS`, jamais d'articles supplémentaires.
         */
        amount: toCents(montant),
        currency: "eur",
        customer: order.stripeCustomerId,
        payment_method: order.stripePaymentMethodId,
        off_session: true,
        confirm: true,
        description: PRODUCTS[sku].short,
        metadata: { orderId, sku },
      },
      // ⚠️ LA CLÉ D'IDEMPOTENCE, ET ELLE MANQUAIT. Un acheteur de 75 ans qui
      // ne voit « rien se passer » reclique — et Stripe créait alors un second
      // PaymentIntent de 297 €. Le garde `items @> [{sku}]` d'`addItem`
      // protège la base, pas la carte. Ici, Stripe renvoie le premier
      // paiement au lieu d'en créer un second : un seul débit, quoi qu'il
      // arrive. Une commande, un produit, un débit.
      //
      // ⚠️ LE MONTANT FAIT PARTIE DE LA CLÉ, ET CE N'EST PAS DÉCORATIF. Avec
      // la règle des 47 €, le MÊME sku peut être tenté à 97 € puis à 50 €
      // (l'acheteur a acquis Le Plan entre les deux). Stripe REFUSE une clé
      // rejouée avec des paramètres différents : la seconde tentative lèverait
      // au lieu de débiter, et l'acheteur lirait « paiement refusé » alors que
      // sa carte est bonne. Trois caractères, et sans eux la moitié des
      // secondes offres échoue.
      { idempotencyKey: `${orderId}:${sku}:${montant}` },
    );

    if (intent.status !== "succeeded") {
      return { ok: false, error: "Le paiement n'a pas abouti." };
    }

    await addItem(orderId, sku, intent.id, montant);
    await offrirDossierNotaire(orderId, sku, possede);
    await recuUpsell(order.email, sku, montant);
    return { ok: true };
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === "authentication_required") {
      // ⚠️ L'ancien message renvoyait vers « l'onglet Outils et Kits ». CET
      // ONGLET N'EXISTE PAS ET N'EXISTERA JAMAIS : l'espace membre est une
      // seule page dépliée, sans onglet ni accordéon. Envoyer quelqu'un
      // chercher un onglet introuvable, c'est fabriquer l'email au support
      // qu'on cherche à éviter.
      return {
        ok: false,
        needsAuthentication: true,
        error:
          "Votre banque demande une confirmation supplémentaire pour ce paiement. Vous pourrez l'ajouter en un instant depuis votre espace, dont le lien vient de vous être envoyé par email.",
      };
    }
    console.error("[stripe] chargeUpsell", e);
    return {
      ok: false,
      error: "Le paiement a été refusé. Votre commande précédente reste bien enregistrée.",
    };
  }
}

/**
 * LE DOSSIER NOTAIRE, REMIS SANS SUPPLÉMENT APRÈS UN GRAND PANIER.
 *
 * Ce n'est ni un pack, ni une remise : c'est une ligne offerte, écrite à 0 €,
 * ajoutée à qui vient d'acheter Le Plan, l'Assurance-vie ou Le Dossier complet
 * SANS posséder le bump — donc à la minorité qui a décoché la case pré-cochée
 * du bon de commande.
 *
 * ═══ POURQUOI ON L'OFFRE ═══
 *
 * L'étape 7 de la Méthode s'appelle « Aller chez le notaire les mains vides ».
 * Un plan qu'on ne porte pas chez le notaire reste dans un tiroir, et un
 * rendez-vous raté sous une garantie de 30 jours coûte un remboursement de
 * 297 €. Offrir 17 € coûte moins cher. Et cela évite trois SKU de pack
 * supplémentaires à déclarer, à protéger et à tenir cohérents avec
 * `INCLUS_DANS` — de la surface de bug achetée d'avance.
 *
 * ═══ JAMAIS À QUI LE POSSÈDE DÉJÀ ═══
 *
 * Ce serait une remise sur ce qu'il vient de payer trois minutes plus tôt,
 * donc une raison de demander un remboursement. D'où le test sur `possede`,
 * lu AVANT le débit — `addItem` dédoublonne aussi par SKU, mais on ne se
 * repose pas sur un filet quand la règle se dit en une ligne.
 *
 * Le prix 0 est explicite : `addItem` fait `?? PRODUCTS[sku].price`, jamais
 * `||`, précisément pour qu'un zéro reste un zéro. `orderTotal` n'augmente pas,
 * donc l'événement Purchase de Meta reste juste.
 */
async function offrirDossierNotaire(
  orderId: string,
  sku: ProductSku,
  possede: Set<ProductSku>,
): Promise<void> {
  if (sku !== "upsell1" && sku !== "upsell2" && sku !== "pack1") return;
  if (possede.has("bump")) return;

  try {
    await addItem(orderId, "bump", undefined, 0);
  } catch (e) {
    // Une ligne offerte ne doit jamais transformer une vente réussie en écran
    // d'échec : le client a payé, il a son produit.
    console.error("[upsell] dossier notaire offert non ajouté", orderId, sku, e);
  }
}

/**
 * LE REÇU D'UN UPSELL DU TUNNEL.
 *
 * ⚠️ Il n'existait que pour les achats faits depuis l'espace, alors que c'est
 * ici qu'un débit de 297 € part sans écran de confirmation. Le reçu n'est pas
 * une politesse comptable : c'est la trace qui permet au titulaire de la carte
 * de dire non tout de suite, et c'est notre seul message à contenir cette
 * phrase — le reçu de Stripe, lui, ne la contient pas.
 *
 * Ne lève jamais : le client a payé, il a son produit. Un incident chez Resend
 * ne doit pas transformer une vente réussie en écran d'échec.
 */
async function recuUpsell(email: string, sku: ProductSku, montant: number): Promise<void> {
  try {
    const acces = await accesParEmail(email);
    if (!acces) return;
    await envoyerRecuAchat(acces, sku, montant);
  } catch (e) {
    console.error("[upsell] reçu non envoyé", email, sku, e);
  }
}

/** Acceptation d'un upsell : on débite, puis on avance dans le funnel. */
export async function acceptUpsell(orderId: string, sku: ProductSku, next: string): Promise<void> {
  const result = await chargeUpsell(orderId, sku);

  // Hors fenêtre : on n'affiche pas un échec, on emmène vers le seul endroit
  // où cet achat reste possible — l'espace et son écran de confirmation. Sans
  // jeton retrouvable, la page /espace refabrique l'accès depuis la commande.
  if (!result.ok && result.expire) {
    const order = await getOrder(orderId);
    const acces = order ? await accesParEmail(order.email) : null;
    redirect(acces ? `/espace/${acces.jeton}/ajouter/${sku}` : "/espace");
  }

  if (!result.ok) {
    redirect(`${next}${next.includes("?") ? "&" : "?"}err=1`);
  }
  redirect(next);
}
