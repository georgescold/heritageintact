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

export type OrderItem = { sku: ProductSku; price: number };

export type Order = {
  id: string;
  email: string;
  firstName: string;
  items: OrderItem[];
  mode: "test" | "live";
  consentImmediateAccess: boolean;
  createdAt: string;
};

type Db = { leads: Lead[]; orders: Order[] };

const FILE = path.join(process.cwd(), "data", "db.json");

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
  };
  db.orders.push(order);
  await write(db);
  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const db = await read();
  return db.orders.find((o) => o.id === orderId) ?? null;
}

export async function addItem(orderId: string, sku: ProductSku): Promise<Order | null> {
  const db = await read();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;
  if (!order.items.some((i) => i.sku === sku)) {
    order.items.push({ sku, price: PRODUCTS[sku].price });
    await write(db);
  }
  return order;
}

/** Nombre réel d'acheteurs du produit d'appel : alimente le compteur "membres fondateurs". */
export async function countFounders(): Promise<number> {
  const db = await read();
  return db.orders.filter((o) => o.items.some((i) => i.sku === "front")).length;
}

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.price, 0);
}
