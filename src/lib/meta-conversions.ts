import { createHash } from "node:crypto";
import { sql, sqlActif } from "./sql";
import { stripe } from "./stripe";
import { lireChoixPublicitaire, purgerPreuvesPublicitaires } from "./consentement-publicitaire";
import type { Order } from "./db";
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export function configurationMeta(env: Record<string, string | undefined>) {
  const test = env.META_CAPI_MODE === "test";
  const valide =
    env.META_CAPI_VALIDEE === "true" &&
    (test || env.META_CAPI_MODE === "live") &&
    /^\d{5,30}$/.test(env.META_PIXEL_ID ?? "") &&
    /^v\d{1,3}\.\d{1,2}$/.test(env.META_GRAPH_VERSION ?? "") &&
    Boolean(env.META_CAPI_TOKEN) &&
    (!test || Boolean(env.META_TEST_EVENT_CODE));
  return { valide, test };
}
/** Un paiement, un événement. Ne pas additionner un pack complet à son complément. */
export function paiementsMesurables(order: Order) {
  if (order.status !== "paid") return [];
  const groupes = new Map<string, { montant: number; rembourse: boolean }>();
  for (const i of order.items) {
    if (
      !i.paymentIntentId ||
      !/^pi_[a-zA-Z0-9]+$/.test(i.paymentIntentId) ||
      !Number.isFinite(i.price) ||
      i.price < 0
    )
      continue;
    const p = groupes.get(i.paymentIntentId) ?? { montant: 0, rembourse: false };
    p.montant += Math.round(i.price * 100);
    p.rembourse ||= Boolean(i.rembourse);
    groupes.set(i.paymentIntentId, p);
  }
  return [...groupes]
    .filter(([, p]) => p.montant > 0 && !p.rembourse)
    .map(([id, p]) => ({ id, montant: p.montant }));
}
export function evenementMeta(
  email: string,
  paiement: { id: string; montant: number; date: number },
  site: string,
) {
  const origine = new URL(site);
  if (origine.protocol !== "https:" || origine.username || origine.password)
    throw new Error("Origine Meta invalide");
  return {
    event_name: "Purchase",
    event_id: "hi-v5-" + hash(paiement.id),
    event_time: paiement.date,
    action_source: "website",
    event_source_url: origine.origin + "/merci",
    user_data: { em: [hash(email.trim().toLowerCase())] },
    custom_data: { currency: "EUR", value: paiement.montant / 100 },
  };
}
let pret: Promise<void> | undefined;
async function schema() {
  if (!pret)
    pret = (async () => {
      await sql()`create table if not exists meta_dispatch (
      cle text primary key, etat text not null, montant integer not null, event_time bigint not null,
      consentement text not null, version_consentement text not null,
      cree_le timestamptz not null default now(), bail timestamptz not null, accepte_le timestamptz)`;
    })().catch((e) => {
      pret = undefined;
      throw e;
    });
  await pret;
}
export async function purgerJournalMeta() {
  if (!sqlActif) return;
  await schema();
  await sql()`delete from meta_dispatch where cree_le < now()-interval '13 months'`;
  await purgerPreuvesPublicitaires();
}
/** Aucun SDK navigateur, données familiales, jeton d’accès ou URL privée transmis. */
export async function mesurerCommandeMeta(
  order: Order,
  jetonConsentement: string | undefined,
  fin = Date.now() + 25000,
) {
  const env = process.env,
    config = configurationMeta(env);
  if (
    !config.valide ||
    !stripe ||
    !sqlActif ||
    order.status !== "paid" ||
    (!config.test && order.mode !== "live")
  )
    return;
  const accord = await lireChoixPublicitaire(jetonConsentement);
  if (!accord?.accord) return;
  await schema();
  for (const p of paiementsMesurables(order).slice(-3)) {
    if (Date.now() >= fin) break;
    const cle = (config.test ? "test:" : "live:") + "hi-v5-" + hash(p.id);
    const s = sql();
    const precedent = await s`select etat from meta_dispatch where cle=${cle}`;
    if (precedent[0] && ["accepte", "refuse", "retire"].includes(precedent[0].etat)) continue;
    const intent = await stripe.paymentIntents.retrieve(
      p.id,
      { expand: ["latest_charge"] },
      { timeout: Math.min(10000, Math.max(1, fin - Date.now())), maxNetworkRetries: 0 },
    );
    const charge = typeof intent.latest_charge === "object" ? intent.latest_charge : null;
    const client = typeof intent.customer === "string" ? intent.customer : intent.customer?.id;
    if (
      !charge ||
      intent.status !== "succeeded" ||
      intent.livemode === config.test ||
      intent.currency !== "eur" ||
      intent.amount_received !== p.montant ||
      !order.stripeCustomerId ||
      client !== order.stripeCustomerId ||
      charge.refunded ||
      charge.amount_refunded > 0 ||
      charge.disputed ||
      charge.created > Date.now() / 1000 ||
      charge.created < Date.now() / 1000 - 7 * 86400
    )
      continue;
    const evenement = evenementMeta(
      order.email,
      { ...p, date: charge.created },
      env.NEXT_PUBLIC_SITE_URL ?? "",
    );
    const reserve =
      await s`insert into meta_dispatch(cle,etat,montant,event_time,consentement,version_consentement,bail)
      values(${cle},'envoi',${p.montant},${charge.created},${accord.cle},${accord.version},now()+interval '2 minutes')
      on conflict(cle) do update set etat='envoi',bail=now()+interval '2 minutes'
      where meta_dispatch.etat in ('envoi','reessayer') and meta_dispatch.bail < now()
        and meta_dispatch.cree_le > now()-interval '23 hours' and meta_dispatch.montant=excluded.montant
      returning cle`;
    if (!reserve.length) continue;
    try {
      if (!(await lireChoixPublicitaire(jetonConsentement))?.accord) {
        await s`update meta_dispatch set etat='retire' where cle=${cle}`;
        continue;
      }
      if (Date.now() >= fin) {
        await s`update meta_dispatch set etat='reessayer' where cle=${cle}`;
        break;
      }
      const reponse = await fetch(
        `https://graph.facebook.com/${env.META_GRAPH_VERSION}/${env.META_PIXEL_ID}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.META_CAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: [evenement],
            ...(config.test ? { test_event_code: env.META_TEST_EVENT_CODE } : {}),
          }),
          signal: AbortSignal.timeout(Math.max(1, Math.min(12000, fin - Date.now()))),
        },
      );
      const resultat = await reponse.json();
      const etat =
        reponse.ok && resultat.events_received === 1
          ? "accepte"
          : reponse.status >= 500 || reponse.status === 429
            ? "reessayer"
            : "refuse";
      await s`update meta_dispatch set etat=${etat},accepte_le=case when ${etat}='accepte' then now() else null end,bail=now()+interval '5 minutes' where cle=${cle}`;
    } catch {
      await s`update meta_dispatch set etat='reessayer',bail=now()+interval '5 minutes' where cle=${cle}`;
    }
  }
}
