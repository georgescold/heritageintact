import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url),
  ts = require("typescript");
let n = 0;
const eq = (a, b) => {
  assert.equal(a, b);
  n++;
};
const ok = (a) => {
  assert.ok(a);
  n++;
};
function loader(
  env = {},
  overrides = {},
  transport = async () => {
    throw Error("Réseau interdit");
  },
) {
  const cache = new Map();
  function mod(rel) {
    if (overrides[rel]) return overrides[rel];
    if (cache.has(rel)) return cache.get(rel);
    const file = path.resolve(rel),
      exports = {};
    cache.set(rel, exports);
    const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(
      js,
      {
        exports,
        process: { env },
        Buffer,
        Headers,
        Request,
        Response,
        URL,
        Date,
        AbortSignal,
        console: { info() {}, error() {}, log() {} },
        fetch: transport,
        require: (p) => {
          if (overrides[p]) return overrides[p];
          if (!p.startsWith(".") && !p.startsWith("@/")) return require(p);
          const target = p.startsWith("@/")
            ? "src/" + p.slice(2) + ".ts"
            : path
                .relative(process.cwd(), path.resolve(path.dirname(file), p + ".ts"))
                .replaceAll("\\", "/");
          return mod(target);
        },
      },
      { filename: file },
    );
    return exports;
  }
  return mod;
}
let mod = loader();
const { avantagePack, bilanSupports, motifEtape, alternativeAv } = mod("src/lib/complements.ts");
eq(avantagePack().difference, 17);
eq(avantagePack().separes, 264);
eq(avantagePack().ensemble, 247);
eq(bilanSupports("pack1", new Set(["front", "bump"])).acquis.length, 2);
eq(bilanSupports("pack1", new Set(["front", "bump"])).ajoutes.length, 3);
eq(motifEtape("upsell2", "e0"), null);
ok(motifEtape("upsell2", "e3").includes("terminé"));
for (const av of ["N", "?", "X", undefined]) eq(alternativeAv({ av }, "pack1", new Set()), false);
eq(alternativeAv({ av: "O" }, "pack1", new Set()), true);
eq(alternativeAv({ av: "O" }, "pack1", new Set(["upsell2"])), false);
const { capaciteEmail, reserveComplements } = mod("src/lib/capacite-email.ts");
for (const value of ["", "abc", "-1", "1501", "2.5"])
  eq(capaciteEmail({ EMAIL_DAILY_CAP: value }), 150);
eq(capaciteEmail({ EMAIL_DAILY_CAP: "900" }), 150);
eq(capaciteEmail({ EMAIL_DAILY_CAP: "900", EMAIL_CAPACITY_VALIDATED: "true" }), 900);
eq(capaciteEmail({ EMAIL_DAILY_CAP: "50" }), 50);
eq(reserveComplements(150, true), 30);
eq(reserveComplements(150, false), 0);
const now = Date.now(),
  recent = new Date(now - 3 * 86400000).toISOString();
const order = {
  id: "ord_fictif",
  email: "client@example.invalid",
  firstName: "Test",
  createdAt: recent,
  mode: "live",
  status: "paid",
  stripeCustomerId: "cus_fictif",
  items: [
    { sku: "front", price: 27, paymentIntentId: "pi_initial" },
    { sku: "bump", price: 17, paymentIntentId: "pi_initial" },
    { sku: "pack1", price: 203, paymentIntentId: "pi_pack" },
  ],
};
const { syntheseCohortes, margeDisponible } = mod("src/lib/pilotage.ts");
const report = syntheseCohortes(
  [order, { ...order, id: "test", mode: "test" }, { ...order, id: "pending", status: "pending" }],
  30,
  now,
);
eq(report.acheteurs, 1);
eq(report.recettesBrutes, 247);
eq(report.clientsAvecComplement, 1);
ok(!JSON.stringify(report).includes(order.email));
eq(syntheseCohortes([], 30).recettesMoyennesParAcheteur, 0);
eq(
  syntheseCohortes(
    [{ ...order, items: order.items.map((i) => ({ ...i, rembourse: true })) }],
    30,
    now,
  ).recettesApresRemboursementsEnregistres,
  0,
);
eq(
  margeDisponible({
    recettes: 120,
    remboursements: 0,
    fraisPaiement: 3,
    support: 2,
    tva: 0.2,
    cotisations: 0.25,
    fraisFixes: 10,
    publicite: 40,
    clients: 2,
  }).apresPublicite,
  20,
);
assert.throws(() => margeDisponible({ recettes: 1, remboursements: 2 }));
n++;

// Transport et SQL simulés : aucun service réel, aucun fichier de client écrit.
let consent = true,
  stripeCalls = 0,
  networkCalls = 0,
  bodies = [],
  status = 200;
const journal = new Map();
const sql = async (parts, ...values) => {
  const q = parts.join("?");
  if (q.includes("create table")) return [];
  if (q.includes("select etat"))
    return journal.has(values[0]) ? [{ etat: journal.get(values[0]).etat }] : [];
  if (q.includes("insert into meta_dispatch")) {
    const prior = journal.get(values[0]);
    if (prior && (!prior.retry || !["envoi", "reessayer"].includes(prior.etat))) return [];
    journal.set(values[0], { etat: "envoi", retry: false });
    return [{ cle: values[0] }];
  }
  if (q.includes("update meta_dispatch")) {
    if (q.includes("set etat=?")) journal.get(values.at(-1)).etat = values[0];
    else journal.get(values.at(-1)).etat = q.includes("'retire'") ? "retire" : "reessayer";
    return [];
  }
  throw Error("SQL inattendu : " + q);
};
const baseEnv = {
  META_CAPI_VALIDEE: "true",
  META_CAPI_MODE: "live",
  META_PIXEL_ID: "123456789",
  META_GRAPH_VERSION: "v99.0",
  META_CAPI_TOKEN: "fictif",
  NEXT_PUBLIC_SITE_URL: "https://site.example.invalid",
};
const overrides = {
  "src/lib/sql.ts": { sqlActif: true, sql: () => sql },
  "src/lib/consentement-publicitaire.ts": {
    lireChoixPublicitaire: async () =>
      consent ? { accord: true, cle: "choix_fictif", version: "v1" } : null,
    purgerPreuvesPublicitaires: async () => {},
  },
  "src/lib/stripe.ts": {
    stripe: {
      paymentIntents: {
        retrieve: async (id) => {
          stripeCalls++;
          const amount = id === "pi_initial" ? 4400 : 20300;
          return {
            status: "succeeded",
            livemode: true,
            currency: "eur",
            amount_received: amount,
            customer: "cus_fictif",
            latest_charge: {
              created: Math.floor(now / 1000) - 60,
              refunded: false,
              amount_refunded: 0,
              disputed: false,
            },
          };
        },
      },
    },
  },
};
const transport = async (url, opts) => {
  networkCalls++;
  ok(url.startsWith("https://graph.facebook.com/"));
  bodies.push(JSON.parse(opts.body));
  return Response.json(status === 200 ? { events_received: 1 } : {}, { status });
};
let meta = loader(baseEnv, overrides, transport)("src/lib/meta-conversions.ts");
const grouped = meta.paiementsMesurables(order);
eq(grouped.length, 2);
eq(grouped[0].montant, 4400);
eq(grouped[1].montant, 20300);
eq(meta.paiementsMesurables({ ...order, status: "pending" }).length, 0);
eq(
  meta.paiementsMesurables({ ...order, items: order.items.map((i) => ({ ...i, rembourse: true })) })
    .length,
  0,
);
eq(meta.configurationMeta({ ...baseEnv, META_CAPI_VALIDEE: "false" }).valide, false);
eq(meta.configurationMeta({ ...baseEnv, META_CAPI_MODE: "test" }).valide, false);
eq(meta.configurationMeta({ ...baseEnv, META_GRAPH_VERSION: "../oops" }).valide, false);
consent = false;
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 0);
eq(stripeCalls, 0);
consent = true;
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 2);
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 2);
eq(stripeCalls, 2);
eq(bodies[0].data[0].custom_data.value + bodies[1].data[0].custom_data.value, 247);
for (const body of bodies) {
  const e = body.data[0];
  eq(e.event_name, "Purchase");
  eq(e.event_source_url, "https://site.example.invalid/merci");
  eq(e.user_data.em[0].length, 64);
  eq(Object.keys(e.user_data).join(","), "em");
  ok(!JSON.stringify(body).includes(order.email));
  ok(!JSON.stringify(body).includes(order.id));
  ok(!JSON.stringify(body).includes("cus_fictif"));
  ok(!JSON.stringify(body).includes("paymentIntent"));
}
ok(bodies[0].data[0].event_id !== bodies[1].data[0].event_id);
assert.throws(() =>
  meta.evenementMeta(
    "x@example.invalid",
    { id: "pi_x", montant: 100, date: 1 },
    "http://unsafe.invalid",
  ),
);
n++;
journal.clear();
bodies = [];
networkCalls = 0;
status = 429;
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 2);
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 2);
for (const row of journal.values()) row.retry = true;
status = 200;
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 4);
meta = loader(
  { ...baseEnv, META_CAPI_VALIDEE: "false" },
  overrides,
  transport,
)("src/lib/meta-conversions.ts");
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 4);
meta = loader(
  { ...baseEnv, META_CAPI_MODE: "test", META_TEST_EVENT_CODE: "fictif" },
  overrides,
  transport,
)("src/lib/meta-conversions.ts");
journal.clear();
await meta.mesurerCommandeMeta(order, "token");
eq(networkCalls, 4); // Test refuse les débits live.

// Consentement : le texte réellement montré est celui conservé dans la preuve.
const records = new Map();
const consentSql = async (parts, ...v) => {
  const q = parts.join("?");
  if (q.includes("create table") || q.includes("delete from")) return [];
  if (q.includes("insert into ad_consent")) {
    records.set(v[0], {
      cle: v[0],
      accord: v[1],
      version: v[2],
      texte: v[3],
      choisi_le: new Date(),
      active: true,
    });
    return [];
  }
  if (q.includes("update ad_consent")) {
    if (records.has(v[0])) records.get(v[0]).active = false;
    return [];
  }
  if (q.includes("select cle")) {
    const r = records.get(v[0]);
    return r?.active && r.version === v[1] ? [r] : [];
  }
  throw Error(q);
};
const consentOverrides = { "src/lib/sql.ts": { sqlActif: true, sql: () => consentSql } };
mod = loader({}, consentOverrides);
const prefs = mod("src/lib/consentement-publicitaire.ts");
eq(await prefs.lireChoixPublicitaire(undefined), null);
eq(await prefs.lireChoixPublicitaire("bad"), null);
const oui = await prefs.enregistrerChoixPublicitaire(true);
eq(oui.length, 48);
eq((await prefs.lireChoixPublicitaire(oui)).accord, true);
ok(!records.has(oui));
ok(records.get(prefs.empreinteChoix(oui)).texte.includes("empreinte"));
const non = await prefs.enregistrerChoixPublicitaire(false, oui);
eq(await prefs.lireChoixPublicitaire(oui), null);
eq((await prefs.lireChoixPublicitaire(non)).accord, false);
const { NextRequest } = require("next/server");
const route = mod("src/app/api/confidentialite/preferences/route.ts");
const request = (body, origin = "https://site.example.invalid") =>
  new NextRequest("https://site.example.invalid/api/confidentialite/preferences", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
eq((await route.POST(request({ accord: true }, "https://autre.invalid"))).status, 403);
eq((await route.POST(request({ accord: "true" }))).status, 400);
eq((await route.POST(request({ accord: true, extra: "x".repeat(200) }))).status, 413);
const accepted = await route.POST(request({ accord: true }));
eq(accepted.status, 200);
const cookie = accepted.headers.get("set-cookie");
ok(cookie.includes("HttpOnly"));
ok(cookie.includes("Secure"));
ok(cookie.includes("SameSite=lax"));
ok(cookie.includes("Max-Age=15552000"));
const rawCookie = cookie.split(";")[0];
const read = await route.GET(
  new NextRequest("https://site.example.invalid/api/confidentialite/preferences", {
    headers: { cookie: rawCookie },
  }),
);
eq((await read.json()).choix, "oui");
ok(read.headers.get("cache-control").includes("no-store"));

// Profil : aucune modification de prix, d'autres réponses ou de consentement email.
let profile = {
    orderId: order.id,
    objectif: "comprendre",
    av: "N",
    vie: "M",
    enfants: "2",
    piste: "origine",
  },
  writes = 0;
mod = loader(
  {},
  {
    "next/cache": { revalidatePath() {} },
    "src/lib/db.ts": {
      accesParJeton: async () => ({ email: order.email, revoque: false }),
      reserverEnvoi: async () => {},
      profilParEmail: async () => profile,
      commandesPayeesParEmail: async () => [order],
      progressionDe: async () => [{ etape: "e0", faiteLe: recent }],
      enregistrerProfil: async (p) => {
        writes++;
        profile = p;
      },
    },
  },
);
const change = mod("src/app/espace/preferences.ts").actualiserPriorite;
let form = new FormData();
form.set("objectif", "preparer");
await change("aaaaaaaaaaaaaaaaaaaa", { message: "" }, form);
eq(writes, 1);
eq(profile.objectif, "preparer");
eq(profile.av, "N");
eq(profile.vie, "M");
eq(profile.piste, "origine");
form.set("objectif", "pirate");
await change("aaaaaaaaaaaaaaaaaaaa", { message: "" }, form);
eq(writes, 1);
await change("bad", { message: "" }, form);
eq(writes, 1);
const source = fs.readFileSync("src/components/MetaPixel.tsx", "utf8");
ok(!source.includes("fbevents.js"));
ok(!source.includes("fbq("));
ok(source.includes("TEXTE_CONSENTEMENT"));

// Le client peut retirer son accord entre la préparation et l'envoi.
let lectures = 0;
journal.clear();
meta = loader(
  baseEnv,
  {
    ...overrides,
    "src/lib/consentement-publicitaire.ts": {
      lireChoixPublicitaire: async () =>
        ++lectures === 1 ? { accord: true, cle: "x", version: "v1" } : null,
      purgerPreuvesPublicitaires: async () => {},
    },
  },
  transport,
)("src/lib/meta-conversions.ts");
const avant = networkCalls;
await meta.mesurerCommandeMeta({ ...order, items: order.items.slice(0, 2) }, "token");
eq(networkCalls, avant);
eq([...journal.values()][0].etat, "retire");
for (const anomalie of [
  { status: "processing" },
  { livemode: false },
  { currency: "usd" },
  { amount_received: 1 },
  { customer: "autre" },
  { latest_charge: { created: Math.floor(now / 1000) - 60, amount_refunded: 1 } },
]) {
  journal.clear();
  meta = loader(
    baseEnv,
    {
      ...overrides,
      "src/lib/stripe.ts": {
        stripe: {
          paymentIntents: {
            retrieve: async () => ({
              status: "succeeded",
              livemode: true,
              currency: "eur",
              amount_received: 4400,
              customer: "cus_fictif",
              latest_charge: { created: Math.floor(now / 1000) - 60, amount_refunded: 0 },
              ...anomalie,
            }),
          },
        },
      },
    },
    transport,
  )("src/lib/meta-conversions.ts");
  await meta.mesurerCommandeMeta({ ...order, items: order.items.slice(0, 2) }, "token");
  eq(networkCalls, avant);
}
async function testerCron(ltv) {
  const envois = [],
    leads = Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      email: "prospect" + i + "@example.invalid",
    }));
  const clients = ltv
    ? Array.from({ length: 4 }, (_, i) => ({
        id: "c" + i,
        email: "client" + i + "@example.invalid",
        marketingConsent: true,
      }))
    : [];
  const acces = (email) => ({
    email,
    createdAt: new Date(now - 12 * 86400000).toISOString(),
    envoyes: [],
    revoque: false,
  });
  const m = loader(
    {
      CRON_SECRET: "fictif",
      RESEND_API_KEY: "fictif",
      POSTGRES_URL: "fictif",
      EMAIL_MARKETING_ACTIVE: "true",
      EMAIL_LTV_ACTIVE: "true",
      EMAIL_DAILY_CAP: "10",
    },
    {
      "src/lib/db.ts": {
        commandesSansAcces: async () => [],
        accesEnSequence: async () => [],
        leadsActifs: async () => leads,
        leadsClientsRecents: async () => clients,
        accesParEmail: async (e) => acces(e),
        progressionDe: async () => [{ etape: "e0", faiteLe: recent }],
        profilParEmail: async () => ({ objectif: "preparer", av: "N" }),
        reserverEnvoi: async () => {},
        marquerEnvoye: async () => {},
      },
      "src/lib/email.ts": {
        etapeDue: () => ({ cle: "j1" }),
        envoyerEtape: async (l) => {
          envois.push(l.email);
          return { ok: true };
        },
        envoyerEtapeClient: async () => ({ ok: true }),
        envoyerComplement: async (l) => {
          envois.push(l.email);
          return { ok: true };
        },
      },
      "src/lib/espace.ts": { possessions: async () => new Set(["front"]) },
      "src/lib/devis.ts": { devisPour: async () => ({ montant: 170, credit: 27 }) },
      "src/lib/mail-journal.ts": { verrouCron: async () => "bail", libererCron: async () => {} },
      "src/lib/livraison.ts": { livrer: async () => null },
      "src/lib/sequence-client.ts": { SEQUENCE_CLIENT: [], etapeClientDue: () => null },
      "src/lib/meta-conversions.ts": {
        configurationMeta: () => ({ valide: false }),
        purgerJournalMeta: async () => {},
      },
    },
  );
  const r = await m("src/app/api/cron/emails/route.ts").GET(
    new Request("https://site.example.invalid/api/cron/emails", {
      headers: { authorization: "Bearer fictif" },
    }),
  );
  eq(r.status, 200);
  const b = await r.json();
  eq(envois.length, 10);
  eq(new Set(envois).size, 10);
  eq(b.complements, ltv ? 2 : 0);
  eq(b.envoyes, ltv ? 8 : 10);
  eq(b.plafondAtteint, true);
}
await testerCron(true);
await testerCron(false);
console.log(
  n +
    " assertions V5 réussies : offres, déductions, capacité, cohortes, consentement, Meta simulé et préférences. Aucun réseau, paiement ou base réelle.",
);
