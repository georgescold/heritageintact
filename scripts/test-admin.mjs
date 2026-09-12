import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

/**
 * Les agrégats du panel, éprouvés sans base, sans serveur et sans réseau.
 * Ce sont eux qui portent les chiffres affichés : un total faux ici se lit
 * comme une vérité sur un tableau de bord.
 */
const require = createRequire(import.meta.url);
const ts = require("typescript");
const cache = new Map();
function mod(rel) {
  const file = path.resolve(process.cwd(), rel);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(
    js,
    {
      exports,
      process: { env: {} },
      Buffer,
      require: (p) => {
        if (p === "next/headers") return { cookies: async () => ({}) };
        if (p === "node:crypto" || p === "crypto") return require("node:crypto");
        return mod(path.relative(process.cwd(), path.resolve(path.dirname(file), p)) + ".ts");
      },
    },
    { filename: file },
  );
  return exports;
}

let n = 0;
const ok = (v, m) => {
  assert.ok(v, m);
  n++;
};
/**
 * ⚠️ NORMALISATION PAR JSON, ET ELLE EST NÉCESSAIRE.
 *
 * Les valeurs rendues par les modules chargés viennent du contexte `vm` : leurs
 * tableaux et objets portent le prototype de CE contexte, pas celui de l'hôte.
 * `deepStrictEqual` compare les prototypes et échouerait donc sur deux tableaux
 * pourtant identiques, avec un message illisible montrant deux fois la même
 * chose. Le passage par JSON aligne les deux réalités.
 */
const eq = (a, b, m) => {
  const normal = (v) => (v !== null && typeof v === "object" ? JSON.parse(JSON.stringify(v)) : v);
  assert.deepEqual(normal(a), normal(b), m);
  n++;
};

const A = mod("src/lib/admin/agregats.ts");

/* ── Période ─────────────────────────────────────────────────────────── */
eq(A.periodeValide("7j"), "7j");
eq(A.periodeValide("tout"), "tout");
eq(A.periodeValide("pirate"), "30j", "une valeur inconnue retombe sur 30 jours, jamais sur tout");
eq(A.periodeValide(undefined), "30j");
eq(A.debutPeriode("tout", 1_000_000), null);
eq(A.debutPeriode("7j", 7 * 86400000), 0);
ok(A.dansPeriode(new Date(500).toISOString(), 400));
ok(!A.dansPeriode(new Date(300).toISOString(), 400));
ok(!A.dansPeriode("pas une date", null), "une date illisible n'entre dans aucune période");
ok(!A.dansPeriode(undefined, null));

/* ── Jeux d'essai ────────────────────────────────────────────────────── */
const jour = (n) => new Date(Date.UTC(2026, 0, n)).toISOString();
const commande = (email, jourDuMois, items, extra = {}) => ({
  id: "o" + jourDuMois + email,
  email,
  firstName: "X",
  items,
  mode: "live",
  status: "paid",
  consentImmediateAccess: true,
  createdAt: jour(jourDuMois),
  ...extra,
});

const commandes = [
  commande("a@x.fr", 1, [{ sku: "front", price: 26 }, { sku: "bump", price: 17 }]),
  commande("a@x.fr", 3, [{ sku: "upsell1", price: 297 }]),
  commande("b@x.fr", 2, [{ sku: "front", price: 26 }]),
  // Remboursée : la ligne porte le remboursement, pas le statut de la commande.
  commande("c@x.fr", 2, [{ sku: "front", price: 26, rembourse: true }]),
  // Ni le paiement simulé ni le bon non réglé ne doivent entrer dans les recettes.
  commande("d@x.fr", 2, [{ sku: "front", price: 26 }], { mode: "test" }),
  commande("e@x.fr", 2, [{ sku: "front", price: 26 }], { status: "pending" }),
  // Un prix aberrant est ignoré plutôt que propagé.
  commande("f@x.fr", 4, [{ sku: "front", price: Number.NaN }, { sku: "bump", price: -5 }]),
];

/* ── Recettes ────────────────────────────────────────────────────────── */
const r = A.recettes(commandes);
eq(r.brut, 392, "26 + 17 + 297 + 26 + 26 remboursé");
eq(r.rembourse, 26);
eq(r.net, 366);
eq(r.commandes, 5, "les commandes réelles seulement : ni test, ni pending");
eq(r.lignes, 5, "les lignes à prix invalide ne comptent pas");

ok(A.commandeReelle(commandes[0]));
ok(!A.commandeReelle(commandes[4]), "mode test exclu");
ok(!A.commandeReelle(commandes[5]), "statut pending exclu");

/* ── Produits ────────────────────────────────────────────────────────── */
const produits = A.parProduit(commandes);
const front = produits.find((p) => p.sku === "front");
eq(front.ventes, 3, "les trois ventes réelles du produit d'appel");
eq(front.remboursees, 1);
eq(front.brut, 78);
eq(front.net, 52, "le net retire la ligne remboursée");
eq(produits[0].sku, "upsell1", "le classement se fait sur le net");

/* ── Acheteurs et KPI ────────────────────────────────────────────────── */
const acheteurs = A.acheteurs(commandes);
eq(acheteurs.size, 4, "a, b, c et f — d est simulé et e impayé ; f a bien payé, même si ses lignes sont inexploitables");
ok(acheteurs.has("a@x.fr"));
ok(!acheteurs.has("d@x.fr"));

const leads = [
  { id: "l1", email: "a@x.fr", firstName: "A", createdAt: jour(1), source: "/lp" },
  { id: "l2", email: "B@X.FR", firstName: "B", createdAt: jour(1), source: "/" },
  { id: "l3", email: "z@x.fr", firstName: "Z", createdAt: jour(2), source: "/", desabonne: true },
  { id: "l4", email: "y@x.fr", firstName: "Y", createdAt: jour(2) },
];

const k = A.kpi({ leads, commandes, acces: [{ revoque: false }, { revoque: true }] });
eq(k.leads, 4);
eq(k.desabonnes, 1);
eq(k.acheteurs, 4);
eq(k.commandesEnAttente, 1);
eq(k.accesActifs, 1);
eq(k.accesRevoques, 1);
eq(k.recettes.net, 366);
eq(k.panierMoyen, 91.5, "366 / 4");
ok(Math.abs(k.tauxConversion - 4 / 4) < 1e-9);

/* ── Attribution ─────────────────────────────────────────────────────── */
const sources = A.parSource(leads, commandes);
const lp = sources.find((s) => s.source === "/lp");
const racine = sources.find((s) => s.source === "/");
eq(lp.leads, 1);
eq(lp.acheteurs, 1);
eq(lp.net, 340, "26 + 17 + 297");
eq(lp.epl, 340);
eq(racine.leads, 2);
eq(racine.acheteurs, 1, "le rapprochement par email ignore la casse");
eq(racine.net, 26);
eq(racine.epl, 13, "26 réparti sur les deux inscrits de la source");
ok(sources.some((s) => s.source === "(inconnue)"), "un inscrit sans source est rangé, pas perdu");
eq(sources[0].source, "/lp", "classement par recettes");

/* ── Série quotidienne ───────────────────────────────────────────────── */
const serie = A.parJour(leads, commandes, Date.parse(jour(1)), Date.parse(jour(5)));
eq(serie.length, 5, "du 1er au 5 janvier, trous compris");
eq(
  serie.map((p) => p.jour),
  ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04", "2026-01-05"],
);
eq(serie[0].leads, 2);
eq(serie[0].commandes, 1);
eq(serie[0].net, 43);
eq(serie[4].leads, 0, "un jour sans activité vaut zéro, il n'est pas omis");
eq(serie[4].commandes, 0);
ok(
  serie.every((p) => Number.isFinite(p.net)),
  "aucun NaN ne se propage dans la série",
);

/* ── Parcours membre ─────────────────────────────────────────────────── */
const progression = [
  { email: "a@x.fr", etape: "e0", ouverteLe: jour(1), faiteLe: jour(1) },
  { email: "b@x.fr", etape: "e0", ouverteLe: jour(2) },
  { email: "a@x.fr", etape: "e1", ouverteLe: jour(2), faiteLe: jour(3) },
];
const etapes = A.parEtape(progression);
eq(etapes.length, 2);
eq(etapes[0].etape, "e0");
eq(etapes[0].ouvertes, 2);
eq(etapes[0].faites, 1);
eq(etapes[0].tauxAchevement, 0.5);
eq(etapes[1].tauxAchevement, 1);

/* ── Envois ──────────────────────────────────────────────────────────── */
const envois = A.parEnvoi(
  [{ envoyes: ["acces", "c1", "ltv-v3-date:2026-01-01"] }, { envoyes: ["acces"] }],
  [{ envoyes: ["j0", "j1"] }, {}],
);
eq(envois.find((e) => e.cle === "acces").nombre, 2);
eq(envois.find((e) => e.cle === "ltv-v3-date").nombre, 1, "la clé horodatée est regroupée sous son nom");
ok(!envois.some((e) => e.cle.includes(":")), "aucune clé horodatée ne ressort telle quelle");
ok(!envois.some((e) => e.nombre === 0));

/* ── Profils ─────────────────────────────────────────────────────────── */
const profils = A.parProfil([
  { orderId: "o1", email: "a@x.fr", objectif: "maison", vie: "M" },
  { orderId: "o2", email: "b@x.fr", objectif: "maison" },
]);
eq(profils.objectif[0], { valeur: "maison", nombre: 2 });
eq(profils.vie.find((v) => v.valeur === "(non renseigné)").nombre, 1, "une réponse absente est comptée, pas ignorée");

/* ── Fiche client ────────────────────────────────────────────────────── */
const evenements = A.fiche("A@X.FR", {
  leads,
  commandes,
  acces: [{ email: "a@x.fr", jeton: "SECRET-JETON-20-CARS", createdAt: jour(1), revoque: false, envoyes: ["acces"], firstName: "A" }],
  progression,
});
ok(evenements.length >= 5, "inscription, deux commandes, accès, étapes");
ok(
  evenements.every((e, i) => i === 0 || Date.parse(evenements[i - 1].date) >= Date.parse(e.date)),
  "du plus récent au plus ancien",
);
ok(
  !JSON.stringify(evenements).includes("SECRET-JETON-20-CARS"),
  "LE JETON D'ACCÈS NE SORT JAMAIS DE LA FICHE",
);
eq(A.fiche("inconnu@x.fr", { leads, commandes, acces: [], progression }), []);

/* ── Publicite et rentabilite ────────────────────────────────────────── */
const P = mod("src/lib/admin/publicite.ts");

const sem = [
  { debut: "2026-01-01", fin: "2026-01-07", depense: 100, clics: 200, impressions: 5000 },
  { debut: "2026-01-08", fin: "2026-01-14", depense: 0, clics: 0, impressions: 0 },
];
const leadsPub = [
  { id: "p1", email: "a@x.fr", firstName: "A", createdAt: "2026-01-02T10:00:00.000Z" },
  { id: "p2", email: "b@x.fr", firstName: "B", createdAt: "2026-01-07T23:30:00.000Z" },
  { id: "p3", email: "c@x.fr", firstName: "C", createdAt: "2026-01-09T10:00:00.000Z" },
];
const cmdPub = [
  commande("a@x.fr", 3, [{ sku: "front", price: 26 }, { sku: "bump", price: 17 }]),
  // Hors des deux semaines : ne doit peser nulle part.
  commande("z@x.fr", 20, [{ sku: "front", price: 26 }]),
];

const avec = P.cockpit(sem, leadsPub, cmdPub, true);
eq(avec.length, 2);
eq(avec[0].depense, 100);
eq(avec[0].ca, 43);
eq(avec[0].leads, 2, "la borne haute de la semaine est inclusive : 23h30 le dernier jour compte");
eq(avec[0].conversions, 1);
eq(avec[0].cpc, 0.5, "100 / 200 clics");
eq(avec[0].cpl, 50, "100 / 2 inscrits");
eq(avec[0].cpa, 100, "100 / 1 achat");
eq(avec[0].epl, 21.5, "43 / 2 inscrits");
eq(avec[0].roas, 0.43);
eq(avec[0].benefice, -57, "43 encaisses pour 100 depenses");
eq(avec[1].leads, 1);
eq(avec[1].ca, 0);
eq(avec[1].roas, null, "aucune division par zero : rien depense, donc pas de ROAS");
eq(avec[1].cpa, null);
eq(avec[1].cpc, null);

// Meta absent : la depense est INCONNUE, et tout ce qui en depend reste vide.
const sans = P.cockpit(sem, leadsPub, cmdPub, false);
eq(sans[0].depense, null, "depense inconnue, jamais zero");
eq(sans[0].benefice, null, "un benefice egal au CA serait le pire des mensonges");
eq(sans[0].roas, null);
eq(sans[0].cpl, null);
eq(sans[0].ca, 43, "ce que nous savons reste affiche");
eq(sans[0].leads, 2);

// Le verdict de sante.
eq(P.sante(sans).scalable, null, "sans depense connue, on ne conclut pas");
ok(P.sante(sans).message.includes("inconnue"));
eq(P.sante(avec).scalable, false, "21,50 € par inscrit pour 50 € de cout : non scalable");
ok(P.sante(avec).message.includes("ROAS"));

const rentable = P.cockpit(
  [{ debut: "2026-01-01", fin: "2026-01-07", depense: 10, clics: 100, impressions: 1000 }],
  leadsPub.slice(0, 2),
  cmdPub,
  true,
);
eq(P.sante(rentable).scalable, true, "43 € encaisses pour 10 € depenses");

// Les semaines locales, quand Meta n'est pas connecte.
const locales = P.semainesLocales(3, Date.parse("2026-01-22T12:00:00.000Z"));
eq(locales.length, 3);
eq(locales[2].fin, "2026-01-22", "la derniere semaine se termine aujourd'hui");
eq(locales[0].debut, "2026-01-02");
ok(
  locales.every((l) => Date.parse(l.fin) - Date.parse(l.debut) === 6 * 86400000),
  "sept jours pleins par semaine",
);

// Le connecteur Meta ne parle a personne tant qu'il n'est pas configure.
const M = mod("src/lib/meta-ads.ts");
ok(!M.adsConfigure(), "sans jeton ni compte publicitaire, la lecture Meta est desactivee");
const source_ads = fs.readFileSync("src/lib/meta-ads.ts", "utf8");
ok(
  source_ads.includes("Authorization: `Bearer ${e.META_ADS_TOKEN}`"),
  "le jeton voyage en en-tete, jamais dans l'URL",
);
ok(!/searchParams.set\("access_token"/.test(source_ads), "aucun jeton en parametre d'URL");
ok(source_ads.includes("AbortSignal.timeout"), "un Meta muet ne doit pas bloquer le panel");

/* ── La garde ────────────────────────────────────────────────────────── */
/**
 * La garde se recharge sous plusieurs environnements : la règle de longueur ne
 * vaut qu'en production, et c'est précisément ce qu'il faut éprouver.
 */
function session(env) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync("src/lib/admin/session.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(
    js,
    {
      exports,
      process: { env },
      Buffer,
      require: (p) =>
        p === "next/headers" ? { cookies: async () => ({}) } : require("node:crypto"),
    },
    { filename: "session.ts" },
  );
  return exports;
}

// Valeur quelconque : le test porte sur la LONGUEUR, pas sur ce mot de passe.
// Le secret de développement réel vit dans .env.local, qui n'est jamais commité.
const COURT = "trop-court";
const LONG = "phrase-de-passe-assez-longue";

// Développement : un mot de passe court est accepté, et signalé comme faible.
const dev = session({ ADMIN_PASSWORD: COURT });
ok(dev.adminConfigure(), "en développement, un mot de passe court ouvre le panel");
ok(dev.motDePasseValide(COURT), "le mot de passe de développement fonctionne");
ok(!dev.motDePasseValide(COURT + "x"), "un mot de passe voisin est refusé");
ok(dev.secretFaible(), "un mot de passe court est signalé comme faible");

// Production : le même mot de passe n'ouvre RIEN. Il ne dégrade pas la
// protection, il l'annule — c'est ce qui empêche un secret de test de se
// retrouver en ligne par oubli.
const prod = session({ ADMIN_PASSWORD: COURT, NODE_ENV: "production" });
ok(!prod.adminConfigure(), "EN PRODUCTION, UN MOT DE PASSE COURT N'OUVRE RIEN");
ok(!prod.motDePasseValide(COURT), "et il ne vaut pas non plus pour entrer");

// Production avec un secret suffisant : tout fonctionne, sans avertissement.
const prodOk = session({ ADMIN_PASSWORD: LONG, NODE_ENV: "production" });
ok(prodOk.adminConfigure(), "en production, un secret assez long ouvre le panel");
ok(prodOk.motDePasseValide(LONG));
ok(!prodOk.secretFaible(), "aucun avertissement quand le secret tient en production");
ok(!session({}).adminConfigure(), "aucun ADMIN_PASSWORD : le panel n'existe pas");

const cadre = fs.readFileSync("src/components/admin/Cadre.tsx", "utf8");
ok(cadre.includes("secretFaible()"), "l'avertissement est affiché sur chaque écran du panel");

const S = mod("src/lib/admin/session.ts");
ok(!S.adminConfigure(), "sans ADMIN_PASSWORD, le panel n'existe pas");
ok(!S.motDePasseValide(""), "aucun mot de passe n'ouvre un panel non configuré");
ok(!S.motDePasseValide("court"), "un secret trop court est refusé");

const source = fs.readFileSync("src/lib/admin/session.ts", "utf8");
ok(source.includes("timingSafeEqual"), "comparaison à temps constant");
// Un repli vers la chaîne vide est la normalisation attendue ; ce qui est
// interdit, c'est un repli vers une VALEUR, qui finirait par tourner en production.
ok(!/ADMIN_PASSWORD\s*\?\?\s*"[^"]+"/.test(source), "aucun mot de passe de repli en dur");
ok(/length >= LONGUEUR_MINIMALE/.test(source), "une longueur minimale est exigée");
const actions = fs.readFileSync("src/app/admin/actions.ts", "utf8");
ok(
  (actions.match(/Accès refusé/g) ?? []).length === 1,
  "un seul message d'erreur, quelle que soit la cause",
);
const robots = fs.readFileSync("src/app/robots.ts", "utf8");
ok(robots.includes('"/admin"'), "/admin refusé aux robots");
const layout = fs.readFileSync("src/app/admin/layout.tsx", "utf8");
ok(layout.includes("index: false"), "noindex sur tout le panel");
// On cherche l'USAGE en JSX, pas le mot : le commentaire du fichier les cite.
ok(!layout.includes("<MetaPixel") && !layout.includes("<MesureFunnel"), "aucun mouchard sur le panel");
const pixel = fs.readFileSync("src/lib/meta-pixel.ts", "utf8");
ok(/\^\/\(admin\|/.test(pixel), "/admin est un chemin sans pixel Meta");

// L'adresse email d'un client ne doit jamais transiter par une URL.
const recherche = fs.readFileSync("src/app/admin/recherche.ts", "utf8");
ok(recherche.includes("sessionAdminOuverte"), "l'action de recherche refait la garde elle-même");
const pageClient = fs.readFileSync("src/app/admin/client/page.tsx", "utf8");
ok(!pageClient.includes("email?: string"), "la fiche ne lit aucun email depuis l'URL");

// Chaque page du panel garde elle-même : une garde posée seulement dans le
// layout ne s'exécuterait pas à chaque rendu.
for (const page of ["page", "acquisition/page", "ventes/page", "membres/page", "emails/page", "client/page"]) {
  const contenu = fs.readFileSync(`src/app/admin/${page}.tsx`, "utf8");
  ok(contenu.includes("await exigerAdmin()"), `garde présente sur ${page}`);
}

console.log(
  n +
    " contrôles du panel réussis : périodes, recettes hors test et hors impayé, remboursement par ligne, attribution par source, série sans trou, entonnoir, envois, rentabilité publicitaire à dépense connue ET inconnue, verdict de scalabilité, fiche sans jeton et garde d'accès. Aucun réseau ni base.",
);
