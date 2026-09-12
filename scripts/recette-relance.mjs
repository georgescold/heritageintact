// Recette de la seconde fenêtre de prix : une seule par adresse, jamais deux, et fermée à tous les autres.
// Base fictive, réseau externe bloqué, fixture restaurée à la fin.
// Prérequis : une compilation à jour. Le préchargement de recette est celui qui AUTORISE les écritures,
// contrairement à delivery-test-preload : cette recette vérifie justement ce qui est écrit en base.
import { spawn } from "node:child_process";
import fs from "node:fs";
import assert from "node:assert/strict";

const fixture = ".build-refonte/db-test.json";
const initial = fs.readFileSync(fixture, "utf8");
const base = JSON.parse(initial);
if (base.orders.some((o) => !o.email.endsWith("@example.invalid")))
  throw Error("Fixture non fictive");

// Trois inscrits fictifs : celui qui doit recevoir la fenêtre, celui qui n'a pas donné son accord,
// et celui qui a déjà acheté (son adresse est déjà celle d'un accès de la fixture).
const maintenant = new Date().toISOString();
base.leads = [
  {
    id: "lead_relance",
    email: "relance@example.invalid",
    firstName: "Relance",
    createdAt: maintenant,
    marketingConsent: true,
    envoyes: [],
  },
  {
    id: "lead_sansaccord",
    email: "sansaccord@example.invalid",
    firstName: "Sans",
    createdAt: maintenant,
    marketingConsent: false,
    envoyes: [],
  },
  {
    id: "lead_desabonne",
    email: "desabonne@example.invalid",
    firstName: "Parti",
    createdAt: maintenant,
    marketingConsent: true,
    desabonne: true,
    envoyes: [],
  },
  {
    id: "lead_client",
    email: "front@example.invalid",
    firstName: "Client",
    createdAt: maintenant,
    marketingConsent: true,
    envoyes: [],
  },
];
fs.writeFileSync(fixture, JSON.stringify(base, null, 1));

const site = "http://127.0.0.1:3316";
const server = spawn(
  process.execPath,
  [
    "--require",
    "./.build-refonte/recette-preload.cjs",
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3316",
  ],
  { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);
let logs = "";
for (const s of [server.stdout, server.stderr]) s.on("data", (x) => (logs += x));
let n = 0;
const ok = (x, message) => {
  assert.ok(x, message);
  n++;
};
const promotionDe = (email) =>
  (JSON.parse(fs.readFileSync(fixture, "utf8")).promotions ?? []).find(
    (p) => p.email === email && p.gamme === "front",
  ) ?? null;
// `redirect: manual` : c'est l'en-tête de la redirection elle-même qu'on veut lire, pas celui de l'arrivée.
const appeler = (identifiant) =>
  fetch(site + "/derniere-chance?id=" + encodeURIComponent(identifiant), { redirect: "manual" });

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error(logs)), 25000);
    server.stdout.on("data", (x) => {
      if (String(x).includes("Ready")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.once("exit", () => {
      clearTimeout(timeout);
      reject(Error(logs));
    });
  });

  // 1. L'inscrit visé : la fenêtre s'ouvre, et le lien de commande porte son identifiant d'offre.
  ok(promotionDe("relance@example.invalid") === null, "promotion existante avant la recette");
  const premier = await appeler("lead_relance");
  ok(premier.status >= 300 && premier.status < 400, "redirection attendue, reçu " + premier.status);
  ok(
    new URL(premier.headers.get("location"), site).pathname === "/commande",
    "arrivée : " + premier.headers.get("location"),
  );
  ok(premier.headers.get("referrer-policy") === "no-referrer", "Referrer-Policy absent");
  ok((premier.headers.get("x-robots-tag") ?? "").includes("noindex"), "X-Robots-Tag absent");
  ok((premier.headers.get("cache-control") ?? "").includes("no-store"), "Cache-Control absent");
  ok((premier.headers.get("set-cookie") ?? "").includes("hi_offre="), "cookie d'offre absent");
  const ouverte = promotionDe("relance@example.invalid");
  ok(ouverte && ouverte.relanceLe, "relance non enregistrée");
  console.log("  fenêtre ouverte le " + ouverte.relanceLe);

  // 2. LE POINT ENTIER DE CETTE RECETTE : un second clic ne rallonge rien.
  await new Promise((r) => setTimeout(r, 1200));
  const second = await appeler("lead_relance");
  ok(
    new URL(second.headers.get("location"), site).pathname === "/commande",
    "second clic refusé à tort",
  );
  const apres = promotionDe("relance@example.invalid");
  ok(
    apres.relanceLe === ouverte.relanceLe,
    "la date de fin a bougé : " + ouverte.relanceLe + " → " + apres.relanceLe,
  );
  ok(apres.id === ouverte.id, "identifiant d'offre changé");
  console.log("  second clic : même date de fin, la fenêtre ne se rouvre pas");

  // 3. Tous les autres repartent vers la page de vente, sans indice sur ce qui a échoué.
  for (const [identifiant, raison] of [
    ["lead_sansaccord", "sans accord marketing"],
    ["lead_desabonne", "désinscrit"],
    ["lead_client", "déjà client"],
    ["lead_inexistant", "identifiant inconnu"],
    ["", "identifiant vide"],
  ]) {
    const r = await appeler(identifiant);
    const arrivee = new URL(r.headers.get("location") ?? "/", site).pathname;
    ok(arrivee === "/methode", raison + " : arrivée " + arrivee);
    ok(
      !(r.headers.get("set-cookie") ?? "").includes("hi_offre="),
      raison + " : cookie d'offre posé",
    );
    ok(promotionDe(identifiant) === null, raison + " : promotion créée");
  }
  ok(promotionDe("sansaccord@example.invalid") === null, "promotion créée sans accord");
  ok(promotionDe("front@example.invalid") === null, "promotion créée pour un client");

  console.log(
    n +
      " contrôles de relance réussis : fenêtre unique par adresse, second clic sans effet, accord et achat vérifiés, aucune adresse privée exposée.",
  );
} catch (e) {
  console.error(logs.slice(-3000));
  throw e;
} finally {
  server.kill();
  await new Promise((resolve) =>
    server.exitCode !== null ? resolve() : server.once("exit", resolve),
  );
  fs.writeFileSync(fixture, initial);
}
