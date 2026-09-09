import { createHash, randomUUID } from "node:crypto";
import { sql, sqlActif } from "./sql";
/** Journal technique distinct du contenu et des données familiales. Aucun corps d’email stocké. */
export const empreinte = (v: string) => createHash("sha256").update(v).digest("hex");
let pret: Promise<void> | undefined;
async function schema() {
  if (!sqlActif) throw new Error("Journal email : Postgres requis pour les envois réels");
  if (!pret) pret = (async () => {
    const s = sql();
    await s`create table if not exists email_dispatch (
      cle text primary key, destinataire text not null, empreinte text not null,
      etat text not null, debut timestamptz not null default now(),
      bail timestamptz not null default now(), accepte_le timestamptz,
      provider_id text, marketing boolean not null default false)`;
    await s`create index if not exists email_dispatch_dest_idx on email_dispatch (destinataire, accepte_le)`;
    await s`create table if not exists email_suppressions (
      destinataire text primary key, raison text not null, cree_le timestamptz not null default now())`;
    await s`create table if not exists job_leases (
      nom text primary key, proprietaire text not null, expire_le timestamptz not null)`;
  })().catch(e => { pret = undefined; throw e; });
  return pret;
}
export async function reserverEmail(cle: string, email: string, corps: string, marketing: boolean) {
  await schema(); const s = sql(), dest = empreinte(email.trim().toLowerCase()), hash = empreinte(corps);
  const suppression = await s`select 1 from email_suppressions where destinataire = ${dest}`;
  if (suppression.length) return "bloque" as const;
  // Une acceptation antérieure est conservée au-delà de la fenêtre de 24 h du fournisseur.
  const precedent = await s`select etat, empreinte from email_dispatch where cle = ${cle}`;
  if (precedent[0]?.etat === "accepte") return "deja" as const;
  if (precedent[0] && precedent[0].empreinte !== hash) return "revue" as const;
  if (marketing) {
    const recent = await s`select 1 from email_dispatch where destinataire = ${dest} and marketing = true
      and accepte_le > now() - interval '22 hours' and cle <> ${cle} limit 1`;
    if (recent.length) return "attendre" as const;
  }
  const rows = await s`insert into email_dispatch (cle,destinataire,empreinte,etat,bail,marketing)
    values (${cle},${dest},${hash},'envoi',now() + interval '2 minutes',${marketing})
    on conflict (cle) do update set etat='envoi', bail=now() + interval '2 minutes'
    where email_dispatch.etat in ('envoi','reessayer') and email_dispatch.bail < now()
      and email_dispatch.debut > now() - interval '23 hours'
      and email_dispatch.empreinte = excluded.empreinte
    returning cle`;
  return rows.length ? "envoyer" as const : "attendre" as const;
}
export async function terminerEmail(cle: string, etat: "accepte" | "reessayer" | "refuse", providerId?: string) {
  await schema();
  await sql()`update email_dispatch set etat=${etat}, provider_id=${providerId ?? null},
    accepte_le=case when ${etat}='accepte' then now() else accepte_le end,
    bail=now() + interval '5 minutes' where cle=${cle}`;
}
export async function supprimerDestinataire(email: string, raison: string) {
  await schema();
  await sql()`insert into email_suppressions (destinataire,raison) values (${empreinte(email.trim().toLowerCase())},${raison})
    on conflict (destinataire) do nothing`;
}
export async function verrouCron() {
  await schema(); const owner=randomUUID();
  const r=await sql()`insert into job_leases (nom,proprietaire,expire_le)
    values ('emails',${owner},now()+interval '30 minutes')
    on conflict (nom) do update set proprietaire=excluded.proprietaire,expire_le=excluded.expire_le
    where job_leases.expire_le < now() returning nom`;
  return r.length ? owner : null;
}
export async function libererCron(owner: string) {
  await sql()`delete from job_leases where nom='emails' and proprietaire=${owner}`;
}
