// Recette navigateur de l'interface de consentement publicitaire et de la boutique de l'espace.
//
// ⚠️ PRÉREQUIS : une compilation FAITE AVEC le bandeau, sinon rien ne s'affiche.
//   node scripts/build-sans-services.mjs --consent-ui
// NEXT_PUBLIC_META_SERVER_MEASUREMENT est figé à la compilation : la compilation ordinaire
// (sans --consent-ui) retire le composant du bundle, et cette recette échoue dès le premier écran.
// Les autres recettes se contentent de la compilation ordinaire.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/Users/loysc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fixture = ".build-refonte/db-test.json",
  initial = fs.readFileSync(fixture, "utf8");
const data = JSON.parse(initial);
if (data.orders.some((o) => !o.email.endsWith("@example.invalid")))
  throw Error("Fixture non fictive : recette refusée");
const env = {
  ...process.env,
  META_CAPI_VALIDEE: "false",
  META_CAPI_TOKEN: "",
  NEXT_TELEMETRY_DISABLED: "1",
};
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
    "3311",
  ],
  { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);
let browser,
  n = 0,
  externes = 0;
const versMeta = [];
const ok = (x) => {
  assert.ok(x);
  n++;
};
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Démarrage serveur")), 20000);
    server.stdout.on("data", (b) => {
      if (b.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("exit", () => {
      clearTimeout(timer);
      reject(Error("Serveur arrêté"));
    });
  });
  browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (r) => {
    const u = new URL(r.request().url());
    if (["127.0.0.1", "localhost"].includes(u.hostname)) return r.continue();
    // Le Pixel Meta est chargé volontairement sur les pages publiques : sa demande de fbevents.js
    // n'est pas un service tiers oublié. Elle est comptée à part, et jamais laissée passer.
    if (u.hostname.endsWith("facebook.net") || u.hostname.endsWith("facebook.com"))
      versMeta.push(r.request().frame().url());
    else externes++;
    return r.abort();
  });
  let choix = "inconnu",
    posts = [];
  await page.route("**/api/confidentialite/preferences", async (r) => {
    if (r.request().method() === "POST") {
      const body = r.request().postDataJSON();
      posts.push(body);
      choix = body.accord ? "oui" : "non";
    }
    await r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ choix }),
    });
  });
  // Les pages de l'espace gardent une connexion ouverte : « networkidle » n'y arrive jamais.
  // On attend le document puis le contenu principal, comme la recette V7.
  const go = async (p) => {
    const r = await page.goto("http://127.0.0.1:3311" + p, { waitUntil: "domcontentloaded" });
    ok(r.status() === 200);
    await page.locator("main").waitFor();
  };
  for (const width of [390, 1440]) {
    choix = "inconnu";
    await page.setViewportSize({ width, height: 1000 });
    await go("/methode");
    // Le bandeau n'apparaît qu'après la lecture de la préférence enregistrée : on l'attend.
    const titreBandeau = page.getByRole("heading", {
      name: "Votre choix pour la mesure publicitaire",
    });
    await titreBandeau.waitFor().catch(() => {
      throw Error(
        "Bandeau de consentement absent : compilez avec « node scripts/build-sans-services.mjs --consent-ui » avant cette recette.",
      );
    });
    ok(await titreBandeau.isVisible());
    const refuse = page.getByRole("button", { name: "Refuser", exact: true }),
      accepte = page.getByRole("button", { name: "Autoriser", exact: true });
    const r = await refuse.boundingBox(),
      a = await accepte.boundingBox();
    ok(Math.abs(r.width - a.width) < 2);
    ok(r.height >= 48 && a.height >= 48);
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: ".build-refonte/v5-consentement-" + width + ".png" });
    await page.getByRole("button", { name: "Fermer sans donner d’accord" }).click();
    ok(choix === "inconnu");
    ok(posts.length === 0);
  }
  await page.getByRole("button", { name: "Mes préférences publicitaires", exact: true }).click();
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.waitForFunction(() =>
    document.body.textContent.includes("Mes préférences publicitaires : refusées"),
  );
  ok(posts.at(-1).accord === false);
  await page.reload({ waitUntil: "networkidle" });
  ok(
    (await page
      .getByRole("heading", { name: "Votre choix pour la mesure publicitaire" })
      .count()) === 0,
  );
  await page.getByRole("button", { name: "Mes préférences publicitaires : refusées" }).click();
  await page.getByRole("button", { name: "Autoriser", exact: true }).click();
  await page.waitForFunction(() =>
    document.body.textContent.includes("Mes préférences publicitaires : autorisées"),
  );
  ok(posts.at(-1).accord === true);
  await page.getByRole("button", { name: "Mes préférences publicitaires : autorisées" }).click();
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.waitForFunction(() =>
    document.body.textContent.includes("Mes préférences publicitaires : refusées"),
  );
  ok(posts.at(-1).accord === false);
  // Le Pixel Meta du navigateur est posé sans recueil d'accord (décision du 11/09/2026) : il est
  // donc normalement présent ici. Le bandeau ci-dessus ne gouverne que la transmission serveur des
  // achats ; il ne conditionne pas encore le pixel, comme l'annonce la politique de confidentialité.
  ok((await page.locator("head script#meta-pixel").count()) === 1);
  ok((await page.request.get("http://127.0.0.1:3311/api/pilotage")).status() === 401);
  // L'espace est organisé en quatre onglets depuis la refonte. Le bloc « Actualiser ma priorité »
  // et l'onglet « outils » ont été retirés de la page : on vérifie les onglets réellement offerts,
  // et que le réglage supprimé ne réapparaît pas par une ancienne adresse.
  await go("/espace/aaaaaaaaaaaaaaaaaaaa");
  for (const onglet of ["Mon parcours", "Mon dossier", "Mon avis", "Aide"])
    ok((await page.getByRole("link", { name: onglet, exact: true }).count()) === 1);
  ok(
    (await page
      .getByText("Votre besoin a évolué ? Actualiser ma priorité", { exact: true })
      .count()) === 0,
  );
  await go("/espace/aaaaaaaaaaaaaaaaaaaa?vue=outils");
  ok((await page.locator('select[name="objectif"]').count()) === 0);
  ok((await page.getByRole("link", { name: "Mon parcours", exact: true }).count()) === 1);
  // La vente d'un complément a quitté le tunnel : /dossier-complet renvoie désormais vers
  // /plan-complet, et le bilan « Vous conservez / Vous ajoutez » se lit dans la boutique de
  // l'espace, sur /espace/<jeton>/ajouter/<sku>. C'est cet écran que l'on contrôle ici.
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await go("/espace/aaaaaaaaaaaaaaaaaaaa/ajouter/upsell2");
    ok(await page.getByRole("heading", { name: "Vous conservez", exact: true }).isVisible());
    ok(await page.getByRole("heading", { name: "Vous ajoutez", exact: true }).isVisible());
    // Le titre d'un Panel n'est pas un titre de section : on le lit comme du texte.
    ok(await page.getByText("Votre carte", { exact: true }).isVisible());
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page
      .getByRole("heading", { name: "Vous conservez", exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({ path: ".build-refonte/v5-bilan-" + width + ".png" });
  }
  // Le prix affiché est celui qui sera débité, et il est porté par le formulaire de décision.
  ok((await page.locator("#decision-membre").count()) === 1);
  ok(
    Number(await page.locator('#decision-membre input[name="montantAffiche"]').inputValue()) === 67,
  );
  // Les gardes de la boutique, sur une adresse devinable : rien ne se vend deux fois, rien ne se
  // vend hors tunnel, et un accès révoqué n'achète pas.
  for (const [jeton, sku] of [
    ["aaaaaaaaaaaaaaaaaaaa", "pack1"],
    ["aaaaaaaaaaaaaaaaaaaa", "inexistant"],
    ["bbbbbbbbbbbbbbbbbbbb", "upsell1"],
  ]) {
    await page.goto("http://127.0.0.1:3311/espace/" + jeton + "/ajouter/" + sku, {
      waitUntil: "domcontentloaded",
    });
    ok(new URL(page.url()).pathname === "/espace/" + jeton);
  }
  await page.goto("http://127.0.0.1:3311/espace/cccccccccccccccccccc/ajouter/upsell2", {
    waitUntil: "domcontentloaded",
  });
  ok((await page.locator("#decision-membre").count()) === 0);
  // Rien n'a été acheté : la commande de référence garde son unique ligne.
  ok(
    JSON.parse(fs.readFileSync(fixture, "utf8")).orders.find((o) => o.id === "ord_revue_front")
      .items.length === 1,
  );
  await go("/espace/cccccccccccccccccccc");
  ok((await page.locator('select[name="objectif"]').count()) === 0);
  await page.unroute("**/api/confidentialite/preferences");
  await go("/methode");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  const alerte = page.getByRole("alert").filter({ hasText: "Aucune nouvelle autorisation" });
  await alerte.waitFor();
  ok(await alerte.isVisible());
  ok(externes === 0);
  // Les seules demandes sortantes tolérées viennent du pixel, et seulement depuis une page publique.
  ok(versMeta.length > 0);
  ok(
    versMeta.every(
      (u) => !u.includes("/espace/") && !u.includes("/reprendre/") && !/[?&](o|id)=/.test(u),
    ),
  );
  ok(errors.length === 0);
  console.log(
    n +
      " contrôles navigateur V5 réussis : interface de consentement avec service simulé, échec réel sans enregistrement, onglets de l'espace, gardes et bilan de la boutique, pixel isolé et aucune autre requête tierce.",
  );
} finally {
  await browser?.close();
  server.kill();
  await new Promise((resolve) =>
    server.exitCode !== null ? resolve() : server.once("exit", resolve),
  );
  fs.writeFileSync(fixture, initial); // Restauration de la fixture fictive uniquement.
}
