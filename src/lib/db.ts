/**
 * Couche de données. Deux implémentations derrière les mêmes signatures.
 *
 *   POSTGRES_URL renseignée  →  Postgres. C'est le mode de production.
 *   sinon                    →  ./data/db.json, pour le développement local.
 *
 * ═══ Pourquoi ce double mode ═══
 *
 * Le fichier JSON était le seul mode jusqu'au 6 septembre 2026, et c'était le
 * bloqueur de mise en ligne : sur Vercel le disque est en lecture seule sauf
 * `/tmp`, et `/tmp` est éphémère ET propre à chaque instance. En production,
 * un inscrit écrit sur une instance n'existait pas pour la suivante, le cron
 * ne voyait presque personne, et la commande n'étant pas retrouvée après le
 * paiement, la chaîne d'upsells cassait. Sans une seule erreur affichée.
 *
 * Le mode fichier reste, parce qu'il permet de développer sans rien installer.
 * Il n'est jamais utilisé en production : `stockageEphemere` (lib/config.ts)
 * affiche une bannière rouge sur tout le site si c'était le cas.
 *
 * ⚠️ Une différence de comportement, assumée. Le mode fichier relit et
 * réécrit TOUT à chaque opération : deux inscriptions simultanées peuvent
 * s'écraser. Le mode Postgres, lui, fait des écritures atomiques ligne par
 * ligne. Ce n'est pas gênant en local, où on est seul.
 */
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { CONSENTEMENT_MARKETING_EXIGE, PRODUCTS, type ProductSku } from "./config";
import { nouveauJeton } from "./jeton";
import { assurerSchema, sql, sqlActif } from "./sql";

/**
 * Une fenêtre de prix, et au plus une relance.
 *
 * `commenceLe` est le départ pris sur le site, au premier clic vers la commande.
 * `relanceLe` est la SECONDE fenêtre, la seule, ouverte depuis le dernier email
 * de la séquence pour quelqu'un qui n'a jamais acheté. Elle ne s'écrit qu'une
 * fois : c'est ce qui permet d'écrire « elle ne se rouvrira pas » sans mentir,
 * et ce que promet `/conditions-offres`.
 */
export type Promotion = { id: string; email: string; gamme: "front" | "suite"; commenceLe: string; relanceLe?: string };

export type Lead = {
  marketingConsent?: boolean;
  marketingConsentAt?: string;
  id: string;
  email: string;
  firstName: string;
  createdAt: string;
  /** Chemin de la landing page d'arrivée : c'est la mesure de l'A/B test. */
  source?: string;
  /** Désinscrit : plus aucun email ne part, jamais. */
  desabonne?: boolean;
  /** Étapes déjà envoyées : "j0", "j1"… Empêche tout doublon si le cron rejoue. */
  envoyes?: string[];
};

export type OrderItem = {
  sku: ProductSku;
  price: number;
  /** Identifiant du paiement Stripe correspondant. Absent en mode test simulé. */
  paymentIntentId?: string;
  /**
   * Article remboursé. Le remboursement se note ICI, dans l'article, et
   * JAMAIS dans `Order.status`.
   *
   * ⚠️ Introduire un statut 'refunded' casserait le compteur de places
   * fondatrices : `countFounders` filtre sur `status <> 'pending'`, donc tout
   * troisième statut serait compté comme une place vendue — sur un chiffre
   * affiché en page de vente.
   *
   * Ce champ est purement additif : les deux prédicats de contenance existants
   * — `items @> [{"sku":"front"}]` dans countFounders, `not (items @> …)` dans
   * addItem — testent des objets PARTIELS et ne le voient pas.
   */
  rembourse?: boolean;
};

export type Order = {
  id: string;
  email: string;
  firstName: string;
  items: OrderItem[];
  mode: "test" | "live";
  consentImmediateAccess: boolean;
  createdAt: string;
  /** Statut du paiement principal. Une commande n'est "paid" qu'après confirmation Stripe. */
  status: "pending" | "paid";
  /** Nécessaires pour débiter les upsells en un clic, sans ressaisie de carte. */
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
};

/**
 * L'accès à l'espace membre. UN accès = UNE adresse email, jamais une commande :
 * quelqu'un qui achète Le guide puis un backend trois mois plus tard doit
 * retrouver un seul espace.
 */
export type Acces = {
  jeton: string;
  email: string;
  firstName: string;
  createdAt: string;
  /** Produit d'appel remboursé : l'accès est fermé, la ligne reste. */
  revoque: boolean;
  /** Dernière visite. Pour le support et la relance, jamais affichée au membre. */
  vuLe?: string;
  /** Dernier renvoi du lien perdu. Sert au garde anti-abus de 2 minutes. */
  renvoyeLe?: string;
  /** Clés déjà envoyées : "acces", "c1"…"c3", "recu:<sku>". */
  envoyes: string[];
};

/** L'avancement d'un membre sur une étape. Clé (email, etape) : voir sql.ts. */
export type Progression = {
  email: string;
  /** "e0" … "e7". Écrit en base : ne change plus jamais. */
  etape: string;
  /** Premier affichage de l'étape. C'est ce signal qui déverrouille la boutique. */
  ouverteLe: string;
  /** Coche « j'ai terminé cette étape ». Absent = ouverte mais pas finie. */
  faiteLe?: string;
};

/**
 * LES RÉPONSES DE QUALIFICATION, telles qu'elles sortent de `profils`.
 *
 * Les codes sont typés `string` et non des unions de littéraux : ils
 * viennent de la base, pas du compilateur. Une union donnerait l'illusion qu'un
 * code inconnu est impossible, alors qu'une vieille ligne en produirait un. Le
 * routage (`lib/qualification.ts`) traite tout code inconnu comme une absence
 * de réponse, c'est-à-dire comme le tunnel d'aujourd'hui.
 *
 * ⚠️ CE TYPE NE DOIT JAMAIS S'ÉTENDRE À UNE DATE DE NAISSANCE, UN MONTANT, UN
 * TEXTE LIBRE NI UNE DONNÉE DE SANTÉ. Voir le commentaire de la table (sql.ts).
 */
export type Profil = {
  objectif?: string;
  orderId: string;
  email: string;
  /** M marié(e) · P pacsé(e) · U en couple · V veuf/veuve · S seul(e) · X refus. */
  vie?: string;
  /** 1 un enfant · 2 deux ou plus · R enfants d'une autre union · 0 aucun · X refus. */
  enfants?: string;
  /** O oui · N non · ? je ne sais plus · X refus. */
  av?: string;
  /** a moins de 60 · b 60-64 · c 65-69 · d 70 · e 71+ · X refus. Une tranche, jamais une date. */
  age?: string;
  /** Frein principal déclaré, parmi une liste fermée. Aucun texte libre. */
  blocage?: string;
  /** "plan-seul" · "pack" · "av-dabord" · "defaut". Pour la mesure, et rien d'autre. */
  piste?: string;
  createdAt: string;
};

type Db = {
  promotions?: Promotion[];
  leads: Lead[];
  orders: Order[];
  acces: Acces[];
  progression: Progression[];
  profils: Profil[];
};

/* ═════════════════════════════════════════════════════════════════
   LE MODE FICHIER — développement local uniquement
   ═══════════════════════════════════════════════════════════════ */

const FILE = process.env.VERCEL
  ? path.join("/tmp", "heritage-intact-db.json")
  : path.join(process.cwd(), "data", "db.json");

async function read(): Promise<Db> {
  try {
    const db = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Db>;
    // ⚠️ Les cinq défauts sont obligatoires : le db.json local a été écrit
    // quand `acces`, `progression` et `profils` n'existaient pas. Sans eux, la
    // première lecture rendrait `undefined` là où l'appelant attend un tableau,
    // et le fichier — sept inscrits et quatre commandes — serait perdu à la
    // première écriture qui suivrait.
    return {
      leads: db.leads ?? [],
      orders: db.orders ?? [],
      acces: db.acces ?? [],
      progression: db.progression ?? [],
      profils: db.profils ?? [],
      promotions: db.promotions ?? [],
    };
  } catch {
    return { leads: [], orders: [], acces: [], progression: [], profils: [], promotions: [] };
  }
}

async function write(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

/* ═════════════════════════════════════════════════════════════════
   LE MODE POSTGRES — traduction des lignes
   ═══════════════════════════════════════════════════════════════ */

type LigneLead = {
  marketing_consent?: boolean;
  marketing_consent_at?: Date | null;
  id: string;
  email: string;
  first_name: string;
  created_at: Date;
  source: string | null;
  desabonne: boolean;
  envoyes: string[];
};

type LigneOrder = {
  id: string;
  email: string;
  first_name: string;
  items: OrderItem[];
  mode: "test" | "live";
  consent_immediate_access: boolean;
  created_at: Date;
  status: "pending" | "paid";
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
};

const versLead = (r: LigneLead): Lead => ({
  marketingConsent: r.marketing_consent === true,
  marketingConsentAt: r.marketing_consent_at?.toISOString(),
  id: r.id,
  email: r.email,
  firstName: r.first_name,
  createdAt: r.created_at.toISOString(),
  source: r.source ?? undefined,
  desabonne: r.desabonne,
  envoyes: r.envoyes ?? [],
});

type LigneAcces = {
  jeton: string;
  email: string;
  first_name: string;
  created_at: Date;
  revoque: boolean;
  vu_le: Date | null;
  renvoye_le: Date | null;
  envoyes: string[];
};

type LigneProgression = {
  email: string;
  etape: string;
  ouverte_le: Date;
  faite_le: Date | null;
};

const versOrder = (r: LigneOrder): Order => ({
  id: r.id,
  email: r.email,
  firstName: r.first_name,
  items: r.items ?? [],
  mode: r.mode,
  consentImmediateAccess: r.consent_immediate_access,
  createdAt: r.created_at.toISOString(),
  status: r.status,
  stripeCustomerId: r.stripe_customer_id ?? undefined,
  stripePaymentMethodId: r.stripe_payment_method_id ?? undefined,
});

const versAcces = (r: LigneAcces): Acces => ({
  jeton: r.jeton,
  email: r.email,
  firstName: r.first_name,
  createdAt: r.created_at.toISOString(),
  revoque: r.revoque,
  vuLe: r.vu_le?.toISOString() ?? undefined,
  renvoyeLe: r.renvoye_le?.toISOString() ?? undefined,
  envoyes: r.envoyes ?? [],
});

const versProgression = (r: LigneProgression): Progression => ({
  email: r.email,
  etape: r.etape,
  ouverteLe: r.ouverte_le.toISOString(),
  faiteLe: r.faite_le?.toISOString() ?? undefined,
});

type LigneProfil = {
  objectif?: string | null;
  order_id: string;
  email: string;
  vie: string | null;
  enfants: string | null;
  av: string | null;
  age: string | null;
  blocage?: string | null;
  piste: string | null;
  created_at: Date;
};

// Le `?? undefined` n'est pas cosmétique : une colonne vide revient à `null` de
// Postgres et à `undefined` du mode fichier. Sans cette conversion, `codeUtile`
// (qualification.ts) verrait `null` d'un côté et `undefined` de l'autre, et les
// deux modes ne routeraient pas pareil — un parcours déroulé à la main en local
// ne prouverait plus rien sur la production.
const versProfil = (r: LigneProfil): Profil => ({
  objectif: r.objectif ?? undefined,
  orderId: r.order_id,
  email: r.email,
  vie: r.vie ?? undefined,
  enfants: r.enfants ?? undefined,
  av: r.av ?? undefined,
  age: r.age ?? undefined,
  blocage: r.blocage ?? undefined,
  piste: r.piste ?? undefined,
  createdAt: r.created_at.toISOString(),
});

/**
 * L'email tel qu'il est STOCKÉ : `addLead` et `createOrder` écrivent déjà en
 * minuscules et sans espaces. Toute recherche par email doit passer par ici,
 * sinon un acheteur qui saisit « Jean-Pierre@Orange.FR » dans le formulaire de
 * récupération se voit répondre qu'aucun achat ne correspond — et il n'a aucun
 * autre chemin pour rentrer.
 */
const normaliserEmail = (e: string) => e.trim().toLowerCase();

/** Prépare la connexion et le schéma. Le schéma n'est créé qu'une fois par instance. */
async function pg() {
  await assurerSchema();
  return sql();
}

function id(prefix: string): string {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

/* ═════════════════════════════════════════════════════════════════
   L'API PUBLIQUE
   ═══════════════════════════════════════════════════════════════ */

export async function addLead(input: {
  email: string;
  firstName: string;
  source?: string;
  marketingConsent?: boolean;
}): Promise<Lead> {
  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();

  if (sqlActif) {
    const s = await pg();
    // `on conflict` fait le get-or-create en un aller-retour et sans course :
    // deux inscriptions simultanées avec le même email ne peuvent pas créer
    // deux lignes. Le `do update` est un no-op — il ne sert qu'à obtenir la
    // ligne existante en retour, `do nothing` ne renvoyant rien.
    const [r] = await s<LigneLead[]>`
      insert into leads (id, email, first_name, source, marketing_consent, marketing_consent_at)
      values (${id("lead")}, ${email}, ${firstName}, ${input.source ?? null},
              ${input.marketingConsent === true}, ${input.marketingConsent === true ? new Date().toISOString() : null})
      on conflict (email) do update set
        marketing_consent = leads.marketing_consent or excluded.marketing_consent,
        marketing_consent_at = coalesce(leads.marketing_consent_at, excluded.marketing_consent_at)
      returning *
    `;
    return versLead(r);
  }

  const db = await read();
  const existing = db.leads.find((l) => l.email === email);
  if (existing) {
    if (input.marketingConsent === true && !existing.marketingConsent) {
      existing.marketingConsent = true;
      existing.marketingConsentAt = new Date().toISOString();
      await write(db);
    }
    return existing;
  }
  const lead: Lead = {
    id: id("lead"),
    email,
    firstName,
    createdAt: new Date().toISOString(),
    source: input.source,
    marketingConsent: input.marketingConsent === true,
    marketingConsentAt: input.marketingConsent === true ? new Date().toISOString() : undefined,
  };
  db.leads.push(lead);
  await write(db);
  return lead;
}

export async function createOrder(input: {
  email: string;
  firstName: string;
  withBump: boolean;
  consentImmediateAccess: boolean;
  mode: "test" | "live";
  status?: "pending" | "paid";
  /**
   * ⚠️ LE PRIX RÉELLEMENT DÛ PAR CE VISITEUR, ET IL EST OBLIGATOIRE EN PRATIQUE.
   *
   * La ligne « front » était écrite à `PRODUCTS.front.price` — 27 € — pendant
   * que `prepareCheckout` commandait à Stripe `prixFront(...)`, soit 89 € après
   * le compteur ou 62 € au rattrapage. Deux chemins calculaient le même nombre,
   * et ils avaient divergé : la banque prélevait 106 € quand le récapitulatif
   * de /merci annonçait 44 €, et l'événement Purchase de Meta remontait la
   * valeur basse. Un seul chemin, désormais : l'appelant calcule le prix UNE
   * fois et le passe ici comme il le passe à Stripe.
   *
   * Le repli sur le prix catalogue ne couvre que les appels sans compteur (le
   * mode simulé), jamais le tunnel réel.
   */
  prixFront?: number;
}): Promise<Order> {
  const items: OrderItem[] = [{ sku: "front", price: input.prixFront ?? PRODUCTS.front.price }];
  if (input.withBump) items.push({ sku: "bump", price: PRODUCTS.bump.price });
  const base = {
    id: id("ord"),
    email: input.email.trim().toLowerCase(),
    firstName: input.firstName.trim(),
    mode: input.mode,
    consentImmediateAccess: input.consentImmediateAccess,
    status: input.status ?? "paid",
  };

  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneOrder[]>`
      insert into orders (id, email, first_name, items, mode, consent_immediate_access, status)
      values (${base.id}, ${base.email}, ${base.firstName}, ${s.json(items)},
              ${base.mode}, ${base.consentImmediateAccess}, ${base.status})
      returning *
    `;
    return versOrder(r);
  }

  const db = await read();
  const order: Order = { ...base, items, createdAt: new Date().toISOString() };
  db.orders.push(order);
  await write(db);
  return order;
}

/** Appelé après confirmation du paiement : marque la commande payée et mémorise la carte. */
export async function markOrderPaid(
  orderId: string,
  stripe: { customerId?: string; paymentMethodId?: string; paymentIntentId?: string },
): Promise<Order | null> {
  const appliquer = (order: Order) => {
    order.status = "paid";
    if (stripe.customerId) order.stripeCustomerId = stripe.customerId;
    if (stripe.paymentMethodId) order.stripePaymentMethodId = stripe.paymentMethodId;
    if (stripe.paymentIntentId) {
      for (const item of order.items) {
        if (!item.paymentIntentId) item.paymentIntentId = stripe.paymentIntentId;
      }
    }
    return order;
  };

  if (sqlActif) {
    const s = await pg();
    const [ligne] = await s<LigneOrder[]>`select * from orders where id = ${orderId}`;
    if (!ligne) return null;
    const order = appliquer(versOrder(ligne));
    await s`
      update orders set
        status                   = ${order.status},
        items                    = ${s.json(order.items)},
        stripe_customer_id       = ${order.stripeCustomerId ?? null},
        stripe_payment_method_id = ${order.stripePaymentMethodId ?? null}
      where id = ${orderId}
    `;
    return order;
  }

  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  appliquer(order);
  await write(db);
  return order;
}

/* ─────────────────────────────────────────────────────────────────
   La séquence email
   ───────────────────────────────────────────────────────────── */

export async function getLead(id: string): Promise<Lead | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneLead[]>`select * from leads where id = ${id}`;
    return r ? versLead(r) : null;
  }
  const db = await read();
  return db.leads.find((l) => l.id === id) ?? null;
}

/**
 * Désinscription. Idempotent : cliquer deux fois ne casse rien.
 *
 * ⚠️ ELLE PURGE AUSSI LES RÉPONSES DU BON DE COMMANDE. Une réponse sur la
 * situation de couple, les enfants ou l'âge ne survit pas à une désinscription :
 * c'est ce que la page de confidentialité annonce, et ce qui doit rester
 * littéralement vrai. Les lignes de `orders` restent, elles — obligation
 * comptable de 10 ans —, mais elles ne disent rien de la famille de personne.
 *
 * Effet de bord assumé : un désinscrit qui rachète plus tard repart avec un
 * profil vide, donc au tunnel par défaut. C'est le bon sens du compromis — le
 * défaut est l'existant, jamais pire.
 */
export async function desabonner(id: string): Promise<Lead | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneLead[]>`
      update leads set desabonne = true where id = ${id} returning *
    `;
    if (!r) return null;
    // La purge est enveloppée : l'acte visible pour l'inscrit est la
    // désinscription elle-même, et un incident sur une table annexe ne doit pas
    // lui afficher une erreur qui lui ferait croire qu'il reçoit encore des
    // emails. La trace au journal reste, et un reclic rejoue la suppression.
    try {
      await s`delete from profils where email = ${r.email}`;
    } catch (e) {
      console.error("[profils] purge à la désinscription impossible", e);
    }
    return versLead(r);
  }
  const db = await read();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.desabonne = true;
  // Le miroir exact du `delete` SQL : les deux modes doivent se comporter à
  // l'identique, sinon un test passé en local ne prouve rien sur la production.
  db.profils = db.profils.filter((p) => p.email !== lead.email);
  await write(db);
  return lead;
}

/** Trace l'étape envoyée, pour qu'elle ne reparte jamais deux fois. */
export async function marquerEnvoye(id: string, etape: string): Promise<void> {
  if (sqlActif) {
    const s = await pg();
    // Concaténation côté base : le cron peut repasser sans jamais perdre une
    // étape déjà notée, ce qu'un lire-puis-écrire ne garantit pas.
    await s`
      update leads
      set envoyes = envoyes || ${s.json([etape])}
      where id = ${id} and not (envoyes @> ${s.json([etape])})
    `;
    return;
  }
  const db = await read();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return;
  // Le même garde qu'en SQL : les deux modes doivent se comporter à l'identique,
  // sinon un test passé en local ne prouve rien sur la production.
  const faites = lead.envoyes ?? [];
  if (faites.includes(etape)) return;
  lead.envoyes = [...faites, etape];
  await write(db);
}

/**
 * Les inscrits encore abonnés ET PAS ENCORE ACHETEURS, pour le passage
 * quotidien du cron.
 *
 * ⚠️ L'exclusion des acheteurs ferme un bug qui se voyait de l'extérieur.
 * Quelqu'un qui achetait à J2 continuait de recevoir la séquence prospect :
 * J4 lui demandait « 27 € sur internet, à mon âge ? » à propos d'un produit
 * qu'il avait déjà payé, J6 lui proposait un bouton « Accéder à la démarche »,
 * et J7 lui vendait une dernière fois la place fondatrice qu'il occupait.
 * Sur cette cible, ce n'est pas une maladresse : c'est un email au support,
 * puis un doute sur ce qu'il a réellement acheté.
 *
 * Le critère est l'EXISTENCE D'UN ACCÈS, pas d'une commande : un accès n'est
 * créé que sur commande payée, et c'est la seule table qui suive le client
 * plutôt que la transaction.
 */
/** Clients consentants récents uniquement ; aucune réactivation de l’historique. */
export async function leadsClientsRecents(): Promise<Lead[]> {
  const debut = new Date(Date.now() - 35 * 86400000).toISOString();
  if (sqlActif) {
    const s = await pg();
    const rows = await s<LigneLead[]>`select l.* from leads l join acces a on a.email=l.email
      where l.desabonne=false ${CONSENTEMENT_MARKETING_EXIGE ? s`and l.marketing_consent=true` : s``}
      and a.revoque=false and a.created_at > ${debut}
      and not (a.envoyes @> ${s.json(["ltv-v3-1","ltv-v3-2"])}) order by a.created_at asc limit 500`;
    return rows.map(versLead);
  }
  const db=await read();
  return db.leads.filter(l=>(!CONSENTEMENT_MARKETING_EXIGE || l.marketingConsent) && !l.desabonne && db.acces.some(a=>a.email===l.email && !a.revoque && a.createdAt>debut && !a.envoyes.includes("ltv-v3-2"))).slice(0,500);
}
export async function leadsActifs(): Promise<Lead[]> {
  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneLead[]>`
      select l.* from leads l
      where l.desabonne = false
        ${CONSENTEMENT_MARKETING_EXIGE ? s`and l.marketing_consent = true` : s``}
        and not exists (select 1 from acces a where a.email = l.email)
      order by l.created_at asc
    `;
    return r.map(versLead);
  }
  const db = await read();
  // Le miroir exact du `not exists` : les deux modes doivent se comporter à
  // l'identique, sinon un test passé en local ne prouve rien sur la production.
  const acheteurs = new Set(db.acces.map((a) => a.email));
  return db.leads.filter(
    (l) =>
      (!CONSENTEMENT_MARKETING_EXIGE || l.marketingConsent === true) &&
      !l.desabonne &&
      !acheteurs.has(l.email),
  );
}

export async function getOrder(orderId: string): Promise<Order | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneOrder[]>`select * from orders where id = ${orderId}`;
    return r ? versOrder(r) : null;
  }
  const db = await read();
  return db.orders.find((o) => o.id === orderId) ?? null;
}

/**
 * @param prix LE PRIX RÉELLEMENT DÉBITÉ POUR CET ARTICLE, quand il diffère du
 *   catalogue. Même motif que `prixFront` sur `createOrder` : un article écrit
 *   au prix catalogue pendant que Stripe encaisse autre chose, ce sont deux
 *   chemins qui calculent le même nombre et qui finissent par diverger — la
 *   banque prélève un montant que le récapitulatif de /merci n'affiche pas, et
 *   l'événement Purchase de Meta remonte une valeur fausse.
 *
 *   Trois cas l'exigent : la seconde offre à prix réduit (l'Assurance-vie à
 *   50 € au lieu de 97 €, Le Plan à 250 € au lieu de 297 €, la ligne « 3 clauses
 *   bénéficiaires » n'étant facturée qu'une fois), et le Dossier notaire ajouté
 *   sans supplément, écrit à 0 €.
 *
 *   ⚠️ `0` doit rester `0`. D'où `?? PRODUCTS[sku].price` et jamais `||`, qui
 *   remettrait 17 € sur une ligne annoncée offerte à l'écran.
 *
 *   Sans ce paramètre, le comportement est exactement celui d'avant.
 */
export async function addItem(
  orderId: string,
  sku: ProductSku,
  paymentIntentId?: string,
  prix?: number,
): Promise<Order | null> {
  const item: OrderItem = { sku, price: prix ?? PRODUCTS[sku].price, paymentIntentId };

  if (sqlActif) {
    const s = await pg();
    // Le `not (items @> …)` rend l'ajout idempotent : un double clic sur
    // l'upsell, ou un rechargement de la page, n'ajoute pas la ligne deux fois.
    const [maj] = await s<LigneOrder[]>`
      update orders
      set items = items || ${s.json([item])}
      where id = ${orderId} and not (items @> ${s.json([{ sku }])})
      returning *
    `;
    if (maj) return versOrder(maj);
    const [existant] = await s<LigneOrder[]>`select * from orders where id = ${orderId}`;
    return existant ? versOrder(existant) : null;
  }

  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  if (!order.items.some((i) => i.sku === sku)) {
    order.items.push(item);
    await write(db);
  }
  return order;
}

/**
 * Nombre réel d'acheteurs du produit d'appel : alimente le compteur "membres fondateurs".
 * Ne compte que les commandes réellement payées.
 */
export async function countFounders(): Promise<number> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<{ n: string }[]>`
      select count(*)::text as n from orders
      where status <> 'pending' and items @> ${s.json([{ sku: "front" }])}
    `;
    return Number(r.n);
  }
  const db = await read();
  return db.orders.filter((o) => o.status !== "pending" && o.items.some((i) => i.sku === "front"))
    .length;
}

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.price, 0);
}

/**
 * Rattache le client Stripe à la commande sans toucher au statut.
 * Appelé à la création du PaymentIntent : à ce moment rien n'est encore encaissé,
 * la commande doit rester « pending ».
 */
export async function attachStripeCustomer(orderId: string, customerId: string): Promise<void> {
  if (sqlActif) {
    const s = await pg();
    await s`update orders set stripe_customer_id = ${customerId} where id = ${orderId}`;
    return;
  }
  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return;
  order.stripeCustomerId = customerId;
  await write(db);
}

/* ═════════════════════════════════════════════════════════════════
   L'ESPACE MEMBRE — l'accès, la progression, les achats depuis l'espace

   ⚠️ RAPPEL, POUR CHAQUE FONCTION DE CETTE SECTION : les deux modes doivent
   se comporter à l'identique. Une branche fichier oubliée ne lève RIEN — elle
   rend simplement le parcours local menteur, et c'est le seul parcours qu'on
   puisse dérouler à la main avant de facturer un vrai client.
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get-or-create de l'accès membre, sans course.
 *
 * Même tour qu'`addLead` : `on conflict (email) do update set email =
 * excluded.email` est un no-op volontaire dont le seul rôle est de faire
 * renvoyer la ligne existante. ⚠️ NE JAMAIS le remplacer par `do nothing` :
 * `do nothing` ne renvoie aucune ligne, donc `returning *` serait vide et
 * l'appelant croirait l'accès inexistant alors qu'il vient de le trouver.
 *
 * Appelée par `confirmCheckout` AVANT tout envoi d'email : le jeton doit
 * exister en base même si Resend ne répond jamais, sans quoi la page /merci
 * n'aurait pas de lien à afficher — et c'est ce lien affiché qui sauve
 * l'accès le jour où l'email ne part pas.
 */
export async function assurerAcces(input: { email: string; firstName: string }): Promise<Acces> {
  const email = normaliserEmail(input.email);
  const firstName = input.firstName.trim();

  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneAcces[]>`
      insert into acces (jeton, email, first_name)
      values (${nouveauJeton()}, ${email}, ${firstName})
      on conflict (email) do update set email = excluded.email
      returning *
    `;
    return versAcces(r);
  }

  const db = await read();
  const existant = db.acces.find((a) => a.email === email);
  if (existant) return existant;
  const acces: Acces = {
    jeton: nouveauJeton(),
    email,
    firstName,
    createdAt: new Date().toISOString(),
    revoque: false,
    envoyes: [],
  };
  db.acces.push(acces);
  await write(db);
  return acces;
}

/** L'unique lecture de toutes les pages de l'espace : le jeton est clé primaire. */
export async function accesParJeton(jeton: string): Promise<Acces | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneAcces[]>`select * from acces where jeton = ${jeton}`;
    return r ? versAcces(r) : null;
  }
  const db = await read();
  return db.acces.find((a) => a.jeton === jeton) ?? null;
}

/** Utilisée par /merci et par le formulaire « j'ai perdu mon lien ». */
export async function accesParEmail(email: string): Promise<Acces | null> {
  const cle = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneAcces[]>`select * from acces where email = ${cle}`;
    return r ? versAcces(r) : null;
  }
  const db = await read();
  return db.acces.find((a) => a.email === cle) ?? null;
}

/**
 * ⚠️ RÉSERVE UN ENVOI. LE MOTIF LE PLUS IMPORTANT DE CE FICHIER.
 *
 * `confirmCheckout` (le navigateur) et le webhook Stripe peuvent tomber à la
 * même seconde. Le motif naïf — lire, envoyer, marquer — enverrait alors DEUX
 * emails d'accès identiques, à la minute exacte où l'acheteur doute le plus de
 * ce qu'il vient de faire.
 *
 * La parade tient dans le `where not (envoyes @> …)` de l'`update` : la base
 * n'accorde la clé qu'à un seul des deux, et il n'y a donc jamais qu'un
 * gagnant. Renvoie une ligne SI ET SEULEMENT SI on a gagné la réservation.
 *
 * ⚠️ Réserver AVANT d'envoyer n'est sûr qu'accompagné de `libererEnvoi` :
 * sans la libération, un refus de Resend brûlerait la clé pour toujours et
 * l'email d'accès de cet acheteur ne partirait plus JAMAIS.
 */
export async function reserverEnvoi(email: string, cle: string): Promise<Acces | null> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneAcces[]>`
      update acces
      set envoyes = envoyes || ${s.json([cle])}
      where email = ${adresse} and not (envoyes @> ${s.json([cle])})
      returning *
    `;
    return r ? versAcces(r) : null;
  }
  const db = await read();
  const acces = db.acces.find((a) => a.email === adresse);
  if (!acces) return null;
  // Le même garde qu'en SQL, dans le même ordre : on ne renvoie l'accès que si
  // la clé n'y était pas.
  if (acces.envoyes.includes(cle)) return null;
  acces.envoyes = [...acces.envoyes, cle];
  await write(db);
  return acces;
}

/**
 * Libère une réservation dont l'envoi a échoué. Le pendant obligatoire de
 * `reserverEnvoi`.
 *
 * ⚠️ Sans clé Resend, `envoyer()` renvoie `{ ok: true }` sans rien envoyer
 * (email.ts). Un déploiement mal configuré « livrerait » donc à tout le monde
 * sans qu'un seul email parte, et cette fonction ne serait jamais appelée : le
 * lien affiché en clair sur /merci reste le seul garde-fou de ce scénario-là.
 */
export async function libererEnvoi(email: string, cle: string): Promise<void> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    await s`
      update acces
      set envoyes = coalesce(
            (select jsonb_agg(v) from jsonb_array_elements(envoyes) v
             where v <> to_jsonb(${cle}::text)),
            '[]'::jsonb
          )
      where email = ${adresse}
    `;
    return;
  }
  const db = await read();
  const acces = db.acces.find((a) => a.email === adresse);
  if (!acces) return;
  acces.envoyes = acces.envoyes.filter((v) => v !== cle);
  await write(db);
}

/**
 * Remboursement du produit d'appel : l'accès se ferme, la ligne reste.
 * Le lien continue de répondre — il affiche une page polie avec la date,
 * jamais une 404.
 */
export async function revoquerAcces(email: string): Promise<Acces | null> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneAcces[]>`
      update acces set revoque = true where email = ${adresse} returning *
    `;
    return r ? versAcces(r) : null;
  }
  const db = await read();
  const acces = db.acces.find((a) => a.email === adresse);
  if (!acces) return null;
  acces.revoque = true;
  await write(db);
  return acces;
}

/**
 * ROUVRE UN ACCÈS FERMÉ, quand l'ancien remboursé repasse commande.
 *
 * ⚠️ LES DEUX MOITIÉS COMPTENT, ET LA SECONDE EST LA MOINS ÉVIDENTE.
 *
 * `revoque = false` rouvre la porte. Mais la clé « acces » est restée posée
 * dans `envoyes` depuis le premier achat : sans son retrait, `reserverEnvoi`
 * perdrait la réservation et l'email d'accès de ce nouvel achat ne partirait
 * JAMAIS — ni par le navigateur, ni par le webhook, ni par le rattrapage du
 * cron, qui exige lui aussi `not (envoyes @> ["acces"])`.
 *
 * Un seul `update` fait les deux : l'acheteur ne peut pas se retrouver rouvert
 * mais muet, ni averti mais toujours dehors.
 */
export async function reouvrirAcces(email: string): Promise<Acces | null> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneAcces[]>`
      update acces set
        revoque = false,
        envoyes = coalesce(
              (select jsonb_agg(v) from jsonb_array_elements(envoyes) v
               where v <> to_jsonb('acces'::text)),
              '[]'::jsonb
            )
      where email = ${adresse}
      returning *
    `;
    return r ? versAcces(r) : null;
  }
  const db = await read();
  const acces = db.acces.find((a) => a.email === adresse);
  if (!acces) return null;
  acces.revoque = false;
  acces.envoyes = acces.envoyes.filter((v) => v !== "acces");
  await write(db);
  return acces;
}

/** Anti-abus du formulaire « j'ai perdu mon lien » : un renvoi toutes les 2 minutes. */
export async function marquerLienRenvoye(email: string): Promise<void> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    await s`update acces set renvoye_le = now() where email = ${adresse}`;
    return;
  }
  const db = await read();
  const acces = db.acces.find((a) => a.email === adresse);
  if (!acces) return;
  acces.renvoyeLe = new Date().toISOString();
  await write(db);
}

/**
 * Note le premier affichage d'une étape. Idempotent en UNE requête, donc sans
 * course : aucun lire-puis-écrire, dans aucun des deux modes.
 *
 * ⚠️ C'est ce signal, et lui seul, qui déverrouille la boutique de l'espace.
 * On ne propose jamais un upsell à quelqu'un qui n'a pas encore ouvert
 * l'étape 0 : il vient de payer, il n'a rien vu, on ne lui vend rien.
 */
export async function ouvrirEtape(email: string, etape: string): Promise<void> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    await s`
      insert into progression (email, etape) values (${adresse}, ${etape})
      on conflict (email, etape) do nothing
    `;
    return;
  }
  const db = await read();
  if (db.progression.some((p) => p.email === adresse && p.etape === etape)) return;
  db.progression.push({ email: adresse, etape, ouverteLe: new Date().toISOString() });
  await write(db);
}

/**
 * Coche ou décoche une étape.
 *
 * ⚠️ Bascule EXPLICITE, jamais un toggle aveugle : la valeur cible vient du
 * bouton. Un double envoi du formulaire — chose banale sur un vieux navigateur
 * ou une connexion lente — donne donc exactement le même résultat, là où un
 * toggle décocherait ce que le membre vient de cocher.
 */
export async function cocherEtape(email: string, etape: string, faite: boolean): Promise<void> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    if (faite) {
      await s`
        insert into progression (email, etape, faite_le) values (${adresse}, ${etape}, now())
        on conflict (email, etape) do update set faite_le = now()
      `;
    } else {
      await s`
        update progression set faite_le = null where email = ${adresse} and etape = ${etape}
      `;
    }
    return;
  }
  const db = await read();
  const ligne = db.progression.find((p) => p.email === adresse && p.etape === etape);
  if (faite) {
    // L'`insert … on conflict` couvre le cas où l'étape n'a jamais été ouverte
    // (formulaire posté sans passer par le rendu) : le miroir doit la créer.
    if (ligne) ligne.faiteLe = new Date().toISOString();
    else
      db.progression.push({
        email: adresse,
        etape,
        ouverteLe: new Date().toISOString(),
        faiteLe: new Date().toISOString(),
      });
  } else {
    // L'`update` SQL ne touche rien quand la ligne n'existe pas : idem ici.
    if (!ligne) return;
    ligne.faiteLe = undefined;
  }
  await write(db);
}

/** Tout l'état d'avancement d'un membre, en une requête. */
export async function progressionDe(email: string): Promise<Progression[]> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneProgression[]>`select * from progression where email = ${adresse}`;
    return r.map(versProgression);
  }
  const db = await read();
  return db.progression.filter((p) => p.email === adresse);
}

/**
 * LA REQUÊTE D'HABILITATION : ce que le membre a réellement payé.
 *
 * ⚠️ `status = 'paid'` STRICTEMENT, et non le `status <> 'pending'` de
 * `countFounders`. Les deux ne disent pas la même chose : le compteur de
 * places compte des ventes, celle-ci ouvre des portes. Le jour où un
 * troisième statut existe, une vente comptée ne doit pas devenir un accès
 * accordé.
 *
 * ⚠️ Deux traitements restent à la charge de l'appelant, et ils ne sont pas
 * optionnels : écarter les articles `rembourse` (le drapeau est dans l'item,
 * jamais dans le statut), et étendre les possessions par `INCLUS_DANS` —
 * sans quoi la boutique proposera Le Simulateur à 147 € à quelqu'un qui vient
 * de l'obtenir dans Le Plan à 297 €.
 */
export async function commandesPayeesParEmail(email: string): Promise<Order[]> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneOrder[]>`
      select * from orders where email = ${adresse} and status = 'paid'
      order by created_at asc
    `;
    return r.map(versOrder);
  }
  const db = await read();
  return db.orders
    .filter((o) => o.email === adresse && o.status === "paid")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * La commande payée la plus récente qui porte un moyen de paiement mémorisé.
 * C'est elle qui fournit la carte d'un achat fait depuis l'espace — et son
 * empreinte affichée à l'écran (« Visa se terminant par 4242 ») avant tout
 * débit.
 */
export async function commandeAvecCarte(email: string): Promise<Order | null> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneOrder[]>`
      select * from orders
      where email = ${adresse} and status = 'paid' and stripe_payment_method_id is not null
      order by created_at desc limit 1
    `;
    return r ? versOrder(r) : null;
  }
  const db = await read();
  return (
    db.orders
      .filter((o) => o.email === adresse && o.status === "paid" && o.stripePaymentMethodId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}

/**
 * Protection anti-double-débit des achats faits depuis l'espace.
 *
 * Une commande espace « pending » de moins de 2 minutes pour le même SKU est
 * RÉUTILISÉE : la clé d'idempotence Stripe, construite sur l'identifiant de
 * commande, reste donc stable sur un double-clic. Passé ces 2 minutes, une
 * nouvelle commande est créée — c'est ce qui autorise une vraie seconde
 * tentative après un refus de carte, au lieu de rejouer éternellement la clé
 * d'un paiement échoué.
 */
export async function commandeEspaceEnCours(email: string, sku: ProductSku): Promise<Order | null> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneOrder[]>`
      select * from orders
      where email = ${adresse} and status = 'pending'
        and created_at > now() - interval '2 minutes'
        and items @> ${s.json([{ sku }])}
      order by created_at desc limit 1
    `;
    return r ? versOrder(r) : null;
  }
  const db = await read();
  const limite = Date.now() - 2 * 60 * 1000;
  return (
    db.orders
      .filter(
        (o) =>
          o.email === adresse &&
          o.status === "pending" &&
          Date.parse(o.createdAt) > limite &&
          o.items.some((i) => i.sku === sku),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}

/**
 * LES COMMANDES ESPACE RESTÉES « PENDING » POUR CE PRODUIT, quel que soit leur âge.
 *
 * ⚠️ CE N'EST PAS UN DOUBLON DE `commandeEspaceEnCours`. Celle-ci sert la
 * réutilisation dans les 2 minutes ; celle-là sert la RÉCONCILIATION : une
 * commande peut rester « pending » alors que le débit a bien été encaissé —
 * `markOrderPaid` a levé, ou la fonction a été coupée après la réponse de
 * Stripe. Sans cette lecture, le membre reclique cinq minutes plus tard, une
 * commande neuve est créée, la clé d'idempotence change, et il est débité une
 * SECONDE fois de 297 €.
 *
 * Bornée à 7 jours : au-delà, un paiement resté en suspens est un incident à
 * traiter à la main, pas une commande à rejouer.
 */
export async function commandesEspacePendantes(email: string, sku: ProductSku): Promise<Order[]> {
  const adresse = normaliserEmail(email);
  const debut = new Date(Date.now() - 7 * 86_400_000).toISOString();

  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneOrder[]>`
      select * from orders
      where email = ${adresse} and status = 'pending'
        and created_at > ${debut}
        and items @> ${s.json([{ sku }])}
      order by created_at desc limit 10
    `;
    return r.map(versOrder);
  }
  const db = await read();
  return db.orders
    .filter(
      (o) =>
        o.email === adresse &&
        o.status === "pending" &&
        o.createdAt > debut &&
        o.items.some((i) => i.sku === sku),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10);
}

/**
 * Une commande ADDITIONNELLE, d'un seul article, pour un achat fait depuis
 * l'espace.
 *
 * ⚠️ Pourquoi ne pas empiler l'article sur la commande d'origine, comme le
 * fait `addItem` dans le tunnel. Deux raisons, et la seconde est un vrai bug :
 *   — `orderTotal` gonflerait indéfiniment, donc le récapitulatif de /merci
 *     afficherait un montant qui n'a jamais été débité en une fois ;
 *   — un vieux `/merci?o=…` rouvert des mois plus tard rejouerait l'événement
 *     Purchase de Meta avec ce montant faux, et l'algorithme optimiserait sur
 *     une valeur inventée.
 *
 * `createOrder` reste la fonction du tunnel front et n'est pas touchée.
 */
export async function creerCommandeEspace(input: {
  email: string;
  firstName: string;
  sku: ProductSku;
  mode: "test" | "live";
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
}): Promise<Order> {
  // Le prix ne vient jamais de l’appelant : relire les achats payés côté serveur.
  const { devis } = await import("./prix");
  const commandes = await commandesPayeesParEmail(input.email);
  const { appliquerRemise, palier } = await import("./promotions");
  const prixBase = devis(input.sku, commandes.flatMap(c => c.items)).montant;
  const reduction = palier(input.sku === "upsell1" ? await promotionParEmail(input.email,"suite") : null);
  const prixFixe = typeof reduction.montantFixe === "number" && Number.isFinite(reduction.montantFixe)
    ? Math.max(0, Math.min(prixBase, reduction.montantFixe))
    : null;
  const prix = prixFixe ?? appliquerRemise(prixBase, reduction.pourcent);
  if (!Number.isFinite(prix) || prix < 0) throw new Error("Prix de commande invalide");
  const items: OrderItem[] = [{ sku: input.sku, price: prix }];
  const base = {
    id: id("ord"),
    email: normaliserEmail(input.email),
    firstName: input.firstName.trim(),
    mode: input.mode,
    // Le consentement à l'exécution immédiate a été recueilli à la commande
    // d'origine ; l'achat depuis l'espace le reconduit explicitement à l'écran.
    consentImmediateAccess: true,
    // ⚠️ « pending » : rien n'est encaissé tant que Stripe n'a pas répondu.
    // `markOrderPaid` reste l'unique écrivain du statut « paid ».
    status: "pending" as const,
  };

  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneOrder[]>`
      insert into orders (id, email, first_name, items, mode, consent_immediate_access, status,
                          stripe_customer_id, stripe_payment_method_id)
      values (${base.id}, ${base.email}, ${base.firstName}, ${s.json(items)},
              ${base.mode}, ${base.consentImmediateAccess}, ${base.status},
              ${input.stripeCustomerId ?? null}, ${input.stripePaymentMethodId ?? null})
      returning *
    `;
    return versOrder(r);
  }

  const db = await read();
  const order: Order = {
    ...base,
    items,
    createdAt: new Date().toISOString(),
    stripeCustomerId: input.stripeCustomerId,
    stripePaymentMethodId: input.stripePaymentMethodId,
  };
  db.orders.push(order);
  await write(db);
  return order;
}

/**
 * Le rattrapage du cron : les commandes payées dont l'email d'accès n'est
 * jamais parti.
 *
 * ⚠️ `depuis` N'EST PAS UN CONFORT. Toutes les commandes payées antérieures à
 * la mise en ligne de l'espace — commandes de test comprises — n'ont aucun
 * accès : sans cette borne, le premier passage du cron enverrait l'email
 * d'accès à tout l'historique d'un coup. La constante est
 * `DATE_ESPACE_EN_LIGNE` (config.ts).
 *
 * Aucune colonne n'a été ajoutée à `orders` pour cela : la jointure gauche
 * sur `acces` suffit, et `acces` est une table neuve — donc vide.
 */
export async function commandesSansAcces(depuis: string, limite: number): Promise<Order[]> {
  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneOrder[]>`
      select o.* from orders o
      left join acces a on a.email = o.email
      where o.status = 'paid'
        and o.created_at > ${depuis}
        and (a.email is null or not (a.envoyes @> ${s.json(["acces"])}))
      order by o.created_at asc
      limit ${limite}
    `;
    return r.map(versOrder);
  }
  const db = await read();
  const parEmail = new Map(db.acces.map((a) => [a.email, a]));
  return db.orders
    .filter((o) => {
      if (o.status !== "paid" || o.createdAt <= depuis) return false;
      const acces = parEmail.get(o.email);
      return !acces || !acces.envoyes.includes("acces");
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, limite);
}

/**
 * Combien de jours un accès reste candidat à la séquence de rassurance.
 *
 * La dernière étape part au jour 7 : dix jours laissent de la marge pour un
 * passage de cron manqué, et pas davantage.
 */
const FENETRE_SEQUENCE_JOURS = 10;

/**
 * LES ACCÈS QUI ONT ENCORE QUELQUE CHOSE À RECEVOIR.
 *
 * ⚠️ CETTE REQUÊTE REMPLACE UN `order by created_at asc limit 150` QUI NE
 * REGARDAIT QUE LES 150 MEMBRES LES PLUS ANCIENS. Les anciens n'ont plus
 * d'étape due — ils ne consommaient donc pas le budget d'envoi, mais ils
 * occupaient en permanence toutes les places de la fenêtre d'examen. À partir
 * du 151ᵉ acheteur, plus personne ne recevait c1, c2 ni c3, et le bilan du
 * cron affichait simplement `rassurances: 0`, ce qui ressemble à une journée
 * normale.
 *
 * Deux bornes, et il faut les deux :
 *   — la fenêtre de 10 jours : elle seule est bornée par le volume quotidien
 *     plutôt que par l'historique ;
 *   — les clés déjà toutes envoyées : un membre servi ne revient pas prendre
 *     une place. Elle ne suffit PAS seule — une étape à condition fausse (c2
 *     pour qui a ouvert son étape 0) n'est jamais notée, donc son accès
 *     resterait candidat pour toujours.
 *
 * `cles` vient de `SEQUENCE_CLIENT` et lui est passé par l'appelant : la liste
 * ne peut pas diverger du tableau qu'elle décrit.
 */
export async function accesEnSequence(cles: string[], limite: number): Promise<Acces[]> {
  const debut = new Date(Date.now() - FENETRE_SEQUENCE_JOURS * 86_400_000).toISOString();

  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneAcces[]>`
      select * from acces
      where revoque = false
        and created_at > ${debut}
        and not (envoyes @> ${s.json(cles)})
      order by created_at asc
      limit ${limite}
    `;
    return r.map(versAcces);
  }
  const db = await read();
  return db.acces
    .filter(
      (a) => !a.revoque && a.createdAt > debut && !cles.every((c) => (a.envoyes ?? []).includes(c)),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, limite);
}

/**
 * Retrouve une commande par son paiement Stripe : l'événement
 * `charge.refunded` ne porte que le `payment_intent`, jamais notre orderId.
 */
export async function commandeParPaymentIntent(paymentIntentId: string): Promise<Order | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneOrder[]>`
      select * from orders where items @> ${s.json([{ paymentIntentId }])} limit 1
    `;
    return r ? versOrder(r) : null;
  }
  const db = await read();
  return db.orders.find((o) => o.items.some((i) => i.paymentIntentId === paymentIntentId)) ?? null;
}

/**
 * Marque remboursés les articles payés par ce PaymentIntent.
 *
 * ⚠️ Le remboursement se note DANS L'ARTICLE, jamais dans `Order.status` :
 * un statut 'refunded' serait compté par `countFounders` (qui filtre sur
 * `status <> 'pending'`) comme une place fondatrice vendue, sur un chiffre
 * affiché en page de vente.
 *
 * ⚠️ Effet de bord connu : `addItem` dédoublonne sur le SKU seul, donc un
 * article remboursé — qui reste dans `items` — empêche de racheter le même
 * produit sur cette commande. C'est assumé, et c'est une raison de plus pour
 * que les achats faits depuis l'espace créent une commande additionnelle.
 */
export async function marquerRembourse(
  orderId: string,
  paymentIntentId: string,
): Promise<Order | null> {
  const appliquer = (order: Order) => {
    for (const item of order.items) {
      if (item.paymentIntentId === paymentIntentId) item.rembourse = true;
    }
    return order;
  };

  if (sqlActif) {
    const s = await pg();
    const [ligne] = await s<LigneOrder[]>`select * from orders where id = ${orderId}`;
    if (!ligne) return null;
    const order = appliquer(versOrder(ligne));
    await s`update orders set items = ${s.json(order.items)} where id = ${orderId}`;
    return order;
  }

  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  appliquer(order);
  await write(db);
  return order;
}

/* ═════════════════════════════════════════════════════════════════
   LES RÉPONSES DU BON DE COMMANDE — table `profils`

   Quatre questions facultatives posées entre « Vos coordonnées » et
   « Paiement sécurisé ». Elles ne servent QU'À choisir les écrans montrés après
   le paiement. Elles ne partent dans aucun événement publicitaire, ne transitent
   par aucune URL, et disparaissent à la désinscription (`desabonner`).

   ⚠️ RAPPEL VALABLE POUR LES TROIS FONCTIONS : une commande sans réponse
   n'écrit AUCUNE ligne ici, et l'absence de ligne est un état parfaitement
   normal — c'est même le cas majoritaire tant que `QUALIFICATION_ACTIVE` est à
   `false`. Toute lecture rend alors `null`, et le routage retombe sur le tunnel
   d'aujourd'hui.
   ═══════════════════════════════════════════════════════════════ */

/**
 * ÉCRIT (OU RÉÉCRIT) LES RÉPONSES D'UNE COMMANDE. NE LÈVE JAMAIS.
 *
 * ⚠️ LE « NE LÈVE JAMAIS » EST LA MOITIÉ IMPORTANTE. Cette écriture a lieu dans
 * la fenêtre la plus fragile du tunnel : après `prepareCheckout`, avant
 * `stripe.confirmPayment`. Un incident de base à cette seconde-là ne doit pas
 * empêcher un paiement — on perdrait 27 € et un client pour une information de
 * confort. En cas d'échec, il n'y a pas de ligne, donc pas de réponse, donc le
 * tunnel par défaut : le pire cas du dispositif reste l'existant.
 *
 * `on conflict (order_id) do update` rend l'appel idempotent : un double clic,
 * un rechargement, ou une seconde tentative après un refus de carte laissent UNE
 * ligne. La réécriture est volontairement totale — l'appelant envoie l'état
 * complet du formulaire, donc une case décochée doit bien effacer l'ancienne
 * valeur, pas la laisser en place.
 */
export async function enregistrerProfil(input: {
  objectif?: string;
  orderId: string;
  email: string;
  vie?: string;
  enfants?: string;
  av?: string;
  age?: string;
  blocage?: string;
  piste?: string;
}): Promise<void> {
  // Même normalisation que `addLead` et `createOrder` : la purge à la
  // désinscription compare des emails, et « Jean-Pierre@Orange.FR » ne doit pas
  // survivre à la désinscription de « jean-pierre@orange.fr ».
  const email = normaliserEmail(input.email);

  try {
    if (sqlActif) {
      const s = await pg();
      await s`
        insert into profils (order_id, email, vie, enfants, av, age, blocage, piste, objectif)
        values (${input.orderId}, ${email}, ${input.vie ?? null}, ${input.enfants ?? null},
                ${input.av ?? null}, ${input.age ?? null}, ${input.blocage ?? null}, ${input.piste ?? null}, ${input.objectif ?? null})
        on conflict (order_id) do update set
          email   = excluded.email,
          vie     = excluded.vie,
          enfants = excluded.enfants,
          av      = excluded.av,
          age     = excluded.age,
          blocage = excluded.blocage,
          piste   = excluded.piste,
          objectif = excluded.objectif
      `;
      return;
    }

    const db = await read();
    const profil: Profil = {
      objectif: input.objectif,
      orderId: input.orderId,
      email,
      vie: input.vie,
      enfants: input.enfants,
      av: input.av,
      age: input.age,
      blocage: input.blocage,
      piste: input.piste,
      // Le miroir du `on conflict do update` : la date de création ne bouge pas
      // à la réécriture, exactement comme la colonne `created_at` en base.
      createdAt:
        db.profils.find((p) => p.orderId === input.orderId)?.createdAt ?? new Date().toISOString(),
    };
    db.profils = [...db.profils.filter((p) => p.orderId !== input.orderId), profil];
    await write(db);
  } catch (e) {
    // Journalisé, jamais propagé : voir l'avertissement ci-dessus.
    console.error("[profils] enregistrement impossible", e);
  }
}

/**
 * LES RÉPONSES D'UNE COMMANDE. C'est la lecture du tunnel : chaque écran de
 * vente résout sa commande par le paramètre `o`, puis demande son profil ici.
 */
export async function profilDeCommande(orderId: string): Promise<Profil | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneProfil[]>`select * from profils where order_id = ${orderId}`;
    return r ? versProfil(r) : null;
  }
  const db = await read();
  return db.profils.find((p) => p.orderId === orderId) ?? null;
}

/**
 * LE PROFIL LE PLUS RÉCENT DE CET ACHETEUR, toutes commandes confondues.
 *
 * Sert là où il n'y a pas d'identifiant de commande sous la main — l'espace
 * membre, par exemple, qui ne doit pas épingler l'Assurance-vie à quelqu'un qui
 * a déclaré ne pas en avoir. « Le plus récent » et non « le premier » : quelqu'un
 * qui a ouvert un contrat entre deux commandes a raison contre son ancienne
 * réponse.
 */
export async function profilParEmail(email: string): Promise<Profil | null> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneProfil[]>`
      select * from profils where email = ${adresse}
      order by created_at desc limit 1
    `;
    return r ? versProfil(r) : null;
  }
  const db = await read();
  return (
    db.profils
      .filter((p) => p.email === adresse)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}

/** Lecture réservée au pilotage serveur protégé. La limite est explicite, jamais un total tronqué silencieux. */
export async function commandesPourPilotage(): Promise<{ commandes: Order[]; tronque: boolean }> {
  const limite = 50000;
  if (sqlActif) {
    const s = await pg();
    const lignes = await s<LigneOrder[]>`select * from orders where status = 'paid' and mode = 'live' order by created_at asc limit ${limite + 1}`;
    return { commandes: lignes.slice(0, limite).map(versOrder), tronque: lignes.length > limite };
  }
  const db = await read();
  const lignes = db.orders.filter(c => c.status === "paid" && c.mode === "live");
  return { commandes: lignes.slice(0, limite), tronque: lignes.length > limite };
}

/** Une seule fenêtre par email et gamme. Un refresh, une réinscription ou un nouvel onglet ne la réinitialise pas. */
export async function commencerPromotion(email: string, gamme: Promotion["gamme"]): Promise<Promotion> {
  const adresse = normaliserEmail(email);
  if (sqlActif) {
    const s = await pg();
    await assurerPromotions();
    const [r] = await s<LignePromotion[]> `
      insert into promotions (id,email,gamme) values (${id("promo")},${adresse},${gamme})
      on conflict (email,gamme) do update set email=excluded.email returning *
    `;
    return versPromotion(r);
  }
  const db = await read();
  const existante = db.promotions?.find(p=>p.email===adresse && p.gamme===gamme);
  if (existante) return existante;
  const p:Promotion={id:id("promo"),email:adresse,gamme,commenceLe:new Date().toISOString()};
  db.promotions=[...(db.promotions??[]),p]; await write(db); return p;
}
let promotionsPretes:Promise<void>|null=null;
async function assurerPromotions() {
  if(!promotionsPretes)promotionsPretes=(async()=>{
    const s=await pg();
    await s`create table if not exists promotions (
      id text primary key, email text not null, gamme text not null check (gamme in ('front','suite')),
      commence_le timestamptz not null default now(), unique(email,gamme)
    )`;
    await s`alter table promotions add column if not exists relance_le timestamptz`;
  })().catch(e=>{promotionsPretes=null;throw e;});
  await promotionsPretes;
}

/** Les lignes SQL et les lignes du fichier n'ont pas la même forme : un seul endroit les traduit. */
type LignePromotion = {id:string;email:string;gamme:Promotion["gamme"];commence_le:Date;relance_le?:Date|null};
const versPromotion = (r:LignePromotion):Promotion => ({
  id:r.id, email:r.email, gamme:r.gamme, commenceLe:r.commence_le.toISOString(),
  ...(r.relance_le ? {relanceLe:r.relance_le.toISOString()} : {}),
});
export async function promotionParEmail(email:string,gamme:Promotion["gamme"]):Promise<Promotion|null> {
  const adresse=normaliserEmail(email);
  if(sqlActif){
    await assurerPromotions(); const s=await pg();
    const [r]=await s<LignePromotion[]>`select * from promotions where email=${adresse} and gamme=${gamme}`;
    return r?versPromotion(r):null;
  }
  return (await read()).promotions?.find(p=>p.email===adresse&&p.gamme===gamme)??null;
}
export async function promotionParId(identifiant:string):Promise<Promotion|null> {
  if(!/^promo_[a-zA-Z0-9]+$/.test(identifiant))return null;
  if(sqlActif){
    await assurerPromotions();const s=await pg();
    const [r]=await s<LignePromotion[]>`select * from promotions where id=${identifiant}`;
    return r?versPromotion(r):null;
  }
  return (await read()).promotions?.find(p=>p.id===identifiant)??null;
}

/**
 * LA SECONDE FENÊTRE, ET IL N'Y EN A QU'UNE.
 *
 * Ouverte depuis le dernier email de la séquence, pour quelqu'un dont le départ
 * est passé sans achat. Le `where relance_le is null` est tout le mécanisme :
 * un deuxième clic, un autre navigateur ou un email transféré retombent sur la
 * même date et ne rallongent rien. Sans lui, « elle ne se rouvrira pas » serait
 * faux, et le prix barré de 52 € ne serait plus un prix de référence.
 */
export async function relancerPromotion(email:string,gamme:Promotion["gamme"]):Promise<Promotion> {
  const adresse=normaliserEmail(email);
  if(sqlActif){
    await assurerPromotions(); const s=await pg();
    await s`
      insert into promotions (id,email,gamme) values (${id("promo")},${adresse},${gamme})
      on conflict (email,gamme) do update set email=excluded.email
    `;
    const [r]=await s<LignePromotion[]>`
      update promotions set relance_le=now() where email=${adresse} and gamme=${gamme} and relance_le is null returning *
    `;
    if(r)return versPromotion(r);
    const [existante]=await s<LignePromotion[]>`select * from promotions where email=${adresse} and gamme=${gamme}`;
    return versPromotion(existante);
  }
  const db=await read();
  let p=db.promotions?.find(x=>x.email===adresse&&x.gamme===gamme);
  if(!p){p={id:id("promo"),email:adresse,gamme,commenceLe:new Date().toISOString()};db.promotions=[...(db.promotions??[]),p];}
  if(!p.relanceLe)p.relanceLe=new Date().toISOString();
  await write(db);
  return p;
}
