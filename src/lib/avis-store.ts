import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { sql, sqlActif } from "./sql";
import type { ProductSku } from "./config";
import type { AvisSaisi } from "./avis-questions";

/**
 * LES AVIS DÉPOSÉS DANS L'ESPACE. Un avis par client, qu'il peut modifier.
 *
 * Même double mode que le reste (voir db.ts) : Postgres en production, un
 * fichier par client dans ./data/avis en local. La table est créée à la
 * première utilisation, avec la sécurité par ligne activée et aucune politique
 * publique : seul le serveur applicatif la lit.
 *
 * ⚠️ Ces données ne partent ni vers Trustpilot ni vers les outils publicitaires.
 * Un message n'est publiable que si `publication` est vrai.
 */
export type AvisClient = AvisSaisi & {
  email: string;
  prenom: string;
  produits: ProductSku[];
  creeLe: string;
  modifieLe: string;
};

let schema: Promise<unknown> | undefined;
async function ready() {
  schema ??= sql()`create table if not exists avis_clients (
    email text primary key,
    prenom text not null default '',
    produits jsonb not null default '[]'::jsonb,
    note smallint not null check (note between 1 and 5),
    reponses jsonb not null default '{}'::jsonb,
    message text not null default '',
    publication boolean not null default false,
    cree_le timestamptz not null default now(),
    modifie_le timestamptz not null default now()
  )`
    .then(() => sql()`alter table avis_clients enable row level security`)
    .catch((error) => {
      schema = undefined;
      throw error;
    });
  await schema;
}

function fichier(email: string) {
  return path.join(process.cwd(), "data", "avis", createHash("sha256").update(email).digest("hex") + ".json");
}

// Le pilote peut rendre un jsonb déjà sérialisé : même précaution que delivery-store.
const decoder = <T>(v: unknown): T => (typeof v === "string" ? JSON.parse(v) : v) as T;

export async function lireAvis(email: string): Promise<AvisClient | null> {
  if (sqlActif) {
    await ready();
    const [r] = await sql()`select * from avis_clients where email=${email}`;
    if (!r) return null;
    return {
      email: r.email,
      prenom: r.prenom,
      produits: decoder<ProductSku[]>(r.produits),
      note: r.note,
      reponses: decoder<Record<string, string>>(r.reponses),
      message: r.message,
      publication: r.publication,
      creeLe: new Date(r.cree_le).toISOString(),
      modifieLe: new Date(r.modifie_le).toISOString(),
    };
  }
  try {
    return JSON.parse(await fs.readFile(fichier(email), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function enregistrerAvis(
  email: string,
  prenom: string,
  produits: ProductSku[],
  avis: AvisSaisi,
): Promise<AvisClient> {
  if (sqlActif) {
    await ready();
    const s = sql();
    const json = (v: unknown) => s.json(v as Parameters<typeof s.json>[0]);
    const [r] = await s`insert into avis_clients (email, prenom, produits, note, reponses, message, publication)
      values (${email}, ${prenom}, ${json(produits)}::jsonb, ${avis.note}, ${json(avis.reponses)}::jsonb, ${avis.message}, ${avis.publication})
      on conflict (email) do update set prenom=excluded.prenom, produits=excluded.produits, note=excluded.note,
        reponses=excluded.reponses, message=excluded.message, publication=excluded.publication, modifie_le=now()
      returning cree_le, modifie_le`;
    return { ...avis, email, prenom, produits, creeLe: new Date(r.cree_le).toISOString(), modifieLe: new Date(r.modifie_le).toISOString() };
  }
  const maintenant = new Date().toISOString();
  const precedent = await lireAvis(email);
  const avisClient: AvisClient = { ...avis, email, prenom, produits, creeLe: precedent?.creeLe ?? maintenant, modifieLe: maintenant };
  await fs.mkdir(path.dirname(fichier(email)), { recursive: true });
  await fs.writeFile(fichier(email), JSON.stringify(avisClient), { mode: 0o600 });
  return avisClient;
}
