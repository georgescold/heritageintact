import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { sql, sqlActif } from "./sql";

export type DeliveryRecord = { value: unknown; version: number };
function decodeRecord(row: DeliveryRecord): DeliveryRecord {
  // Compatibilité avec les sauvegardes doublement sérialisées par le pilote jsonb.
  return { value: typeof row.value === "string" ? JSON.parse(row.value) : row.value, version: row.version };
}
let schema: Promise<unknown> | undefined;
async function ready() {
  schema ??= sql()`create table if not exists delivery_documents (
    email text not null, document text not null, value jsonb not null,
    version integer not null default 1, updated_at timestamptz not null default now(),
    primary key(email, document)
  )`.then(() => sql()`alter table delivery_documents enable row level security`).catch(error => { schema = undefined; throw error; });
  await schema;
}
function file(email: string, key: string) {
  return path.join(process.cwd(), "data", "delivery", createHash("sha256").update(email + ":" + key).digest("hex") + ".json");
}
export async function readDelivery(email: string, key: string): Promise<DeliveryRecord | null> {
  if (sqlActif) {
    await ready();
    const rows = await sql()`select value, version from delivery_documents where email=${email} and document=${key}`;
    return rows[0] ? decodeRecord({ value: rows[0].value, version: rows[0].version }) : null;
  }
  try { return JSON.parse(await fs.readFile(file(email, key), "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export async function writeDelivery(email: string, key: string, value: unknown, version: number): Promise<DeliveryRecord | null> {
  if (sqlActif) {
    await ready();
    const s = sql();
    const encoded = s.json(value as Parameters<typeof s.json>[0]);
    const rows = version === 0
      ? await sql()`insert into delivery_documents(email,document,value) values(${email},${key},${encoded}::jsonb) on conflict do nothing returning value,version`
      : await sql()`update delivery_documents set value=${encoded}::jsonb,version=version+1,updated_at=now() where email=${email} and document=${key} and version=${version} returning value,version`;
    return rows[0] ? decodeRecord({ value: rows[0].value, version: rows[0].version }) : null;
  }
  const current = await readDelivery(email, key);
  if ((current?.version ?? 0) !== version) return null;
  const record = { value, version: version + 1 };
  await fs.mkdir(path.dirname(file(email, key)), { recursive: true });
  await fs.writeFile(file(email, key), JSON.stringify(record), { mode: 0o600 });
  return record;
}
