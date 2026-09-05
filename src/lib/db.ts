/**
 * Couche de données : implémentation fichier JSON pour le développement local.
 * À remplacer par Supabase : garder les mêmes signatures, changer le corps des fonctions.
 * Le fichier vit dans ./data/db.json (ignoré par git).
 */
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { PRODUCTS, type ProductSku } from "./config";

export type Lead = {
  id: string;
  email: string;
  firstName: string;
  createdAt: string;
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

/**
 * En local : ./data/db.json (ignoré par git).
 * Sur Vercel : le disque est en lecture seule sauf /tmp, et /tmp est éphémère.
 * Les données ne survivent donc pas à un redéploiement tant que Supabase n'est pas branché.
 */
const FILE = process.env.VERCEL
  ? path.join("/tmp", "heritage-intact-db.json")
  : path.join(process.cwd(), "data", "db.json");

async function read(): Promise<Db> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Db;
  } catch {
    return { leads: [], orders: [] };
  }
}

async function write(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

function id(prefix: string): string {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

export async function addLead(input: { email: string; firstName: string }): Promise<Lead> {
  const db = await read();
  const email = input.email.trim().toLowerCase();
  const existing = db.leads.find((l) => l.email === email);
  if (existing) return existing;
  const lead: Lead = {
    id: id("lead"),
    email,
    firstName: input.firstName.trim(),
    createdAt: new Date().toISOString(),
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
  const db = await read();
  const items: OrderItem[] = [{ sku: "front", price: PRODUCTS.front.price }];
  if (input.withBump) items.push({ sku: "bump", price: PRODUCTS.bump.price });
  const order: Order = {
    id: id("ord"),
    email: input.email.trim().toLowerCase(),
    firstName: input.firstName.trim(),
    items,
    mode: input.mode,
    consentImmediateAccess: input.consentImmediateAccess,
    createdAt: new Date().toISOString(),
    status: input.status ?? "paid",
  };
  db.orders.push(order);
  await write(db);
  return order;
}

/** Appelé après confirmation du paiement : marque la commande payée et mémorise la carte. */
export async function markOrderPaid(
  orderId: string,
  stripe: { customerId?: string; paymentMethodId?: string; paymentIntentId?: string },
): Promise<Order | null> {
  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = "paid";
  if (stripe.customerId) order.stripeCustomerId = stripe.customerId;
  if (stripe.paymentMethodId) order.stripePaymentMethodId = stripe.paymentMethodId;
  if (stripe.paymentIntentId) {
    for (const item of order.items) {
      if (!item.paymentIntentId) item.paymentIntentId = stripe.paymentIntentId;
    }
  }
  await write(db);
  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const db = await read();
  return db.orders.find((o) => o.id === orderId) ?? null;
}

export async function addItem(
  orderId: string,
  sku: ProductSku,
  paymentIntentId?: string,
): Promise<Order | null> {
  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  if (!order.items.some((i) => i.sku === sku)) {
    order.items.push({ sku, price: PRODUCTS[sku].price, paymentIntentId });
    await write(db);
  }
  return order;
}

/**
 * Nombre réel d'acheteurs du produit d'appel : alimente le compteur "membres fondateurs".
 * Ne compte que les commandes réellement payées.
 */
export async function countFounders(): Promise<number> {
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
  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return;
  order.stripeCustomerId = customerId;
  await write(db);
}
