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
import { PRODUCTS, type ProductSku } from "./config";
import { assurerSchema, sql, sqlActif } from "./sql";

export type Lead = {
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

type Db = { leads: Lead[]; orders: Order[] };

/* ═════════════════════════════════════════════════════════════════
   LE MODE FICHIER — développement local uniquement
   ═══════════════════════════════════════════════════════════════ */

const FILE = process.env.VERCEL
  ? path.join("/tmp", "heritage-intact-db.json")
  : path.join(process.cwd(), "data", "db.json");

async function read(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Db;
  } catch {
    return { leads: [], orders: [] };
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
  id: r.id,
  email: r.email,
  firstName: r.first_name,
  createdAt: r.created_at.toISOString(),
  source: r.source ?? undefined,
  desabonne: r.desabonne,
  envoyes: r.envoyes ?? [],
});

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
      insert into leads (id, email, first_name, source)
      values (${id("lead")}, ${email}, ${firstName}, ${input.source ?? null})
      on conflict (email) do update set email = excluded.email
      returning *
    `;
    return versLead(r);
  }

  const db = await read();
  const existing = db.leads.find((l) => l.email === email);
  if (existing) return existing;
  const lead: Lead = {
    id: id("lead"),
    email,
    firstName,
    createdAt: new Date().toISOString(),
    source: input.source,
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
}): Promise<Order> {
  const items: OrderItem[] = [{ sku: "front", price: PRODUCTS.front.price }];
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

/** Désinscription. Idempotent : cliquer deux fois ne casse rien. */
export async function desabonner(id: string): Promise<Lead | null> {
  if (sqlActif) {
    const s = await pg();
    const [r] = await s<LigneLead[]>`
      update leads set desabonne = true where id = ${id} returning *
    `;
    return r ? versLead(r) : null;
  }
  const db = await read();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.desabonne = true;
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

/** Tous les inscrits encore abonnés, pour le passage quotidien du cron. */
export async function leadsActifs(): Promise<Lead[]> {
  if (sqlActif) {
    const s = await pg();
    const r = await s<LigneLead[]>`
      select * from leads where desabonne = false order by created_at asc
    `;
    return r.map(versLead);
  }
  const db = await read();
  return db.leads.filter((l) => !l.desabonne);
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

export async function addItem(
  orderId: string,
  sku: ProductSku,
  paymentIntentId?: string,
): Promise<Order | null> {
  const item: OrderItem = { sku, price: PRODUCTS[sku].price, paymentIntentId };

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
