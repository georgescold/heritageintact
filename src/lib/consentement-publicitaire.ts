import { createHash, randomBytes } from "node:crypto";
import { sql, sqlActif } from "./sql";
import { TEXTE_CONSENTEMENT } from "./texte-consentement";
export const COOKIE_PUBLICITE = "hi_publicite";
export const VERSION_CONSENTEMENT = "meta-achats-v1";
export const DUREE_CHOIX = 180 * 86400;
export const empreinteChoix = (v: string) => createHash("sha256").update(v).digest("hex");
export const jetonChoixValide = (v: unknown): v is string =>
  typeof v === "string" && /^[a-f0-9]{48}$/.test(v);
export type ChoixPublicitaire = { cle: string; accord: boolean; version: string; choisiLe: string };
let pret: Promise<void> | undefined;
async function schema() {
  if (!sqlActif) throw new Error("Stockage du consentement indisponible");
  if (!pret)
    pret = (async () => {
      await sql()`create table if not exists ad_consent (
      cle text primary key, accord boolean not null, version text not null, texte text not null,
      choisi_le timestamptz not null default now(), expire_le timestamptz not null,
      retire_le timestamptz)`;
    })().catch((e) => {
      pret = undefined;
      throw e;
    });
  await pret;
}
export async function lireChoixPublicitaire(
  jeton: string | undefined,
): Promise<ChoixPublicitaire | null> {
  if (!jetonChoixValide(jeton) || !sqlActif) return null;
  await schema();
  const rows = await sql()`select cle,accord,version,choisi_le from ad_consent
    where cle=${empreinteChoix(jeton)} and retire_le is null and expire_le > now() and version=${VERSION_CONSENTEMENT}`;
  const r = rows[0];
  return r
    ? {
        cle: String(r.cle),
        accord: r.accord === true,
        version: String(r.version),
        choisiLe: new Date(r.choisi_le).toISOString(),
      }
    : null;
}
export async function enregistrerChoixPublicitaire(accord: boolean, ancien?: string) {
  if (typeof accord !== "boolean") throw new Error("Choix invalide");
  await schema();
  // Le retrait est écrit avant la nouvelle préférence : un échec reste sans autorisation.
  if (jetonChoixValide(ancien))
    await sql()`update ad_consent set retire_le=now() where cle=${empreinteChoix(ancien)} and retire_le is null`;
  const jeton = randomBytes(24).toString("hex");
  await sql()`insert into ad_consent(cle,accord,version,texte,expire_le)
    values(${empreinteChoix(jeton)},${accord},${VERSION_CONSENTEMENT},${TEXTE_CONSENTEMENT},now()+interval '180 days')`;
  return jeton;
}
/** Politique technique bornée : ne supprime ni commandes, ni accès, ni journaux email. */
export async function purgerPreuvesPublicitaires() {
  if (!sqlActif) return;
  await schema();
  await sql()`delete from ad_consent where choisi_le < now()-interval '13 months'`;
}
