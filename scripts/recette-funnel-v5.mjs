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
    if (["127.0.0.1", "localhost"].includes(new URL(r.request().url()).hostname))
      return r.continue();
    externes++;
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
  const go = async (p) => {
    const r = await page.goto("http://127.0.0.1:3311" + p, { waitUntil: "networkidle" });
    ok(r.status() === 200);
  };
  for (const width of [390, 1440]) {
    choix = "inconnu";
    await page.setViewportSize({ width, height: 1000 });
    await go("/methode");
    ok(
      await page
        .getByRole("heading", { name: "Votre choix pour la mesure publicitaire" })
        .isVisible(),
    );
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
  ok((await page.locator('script[src*="facebook"]').count()) === 0);
  ok((await page.request.get("http://127.0.0.1:3311/api/pilotage")).status() === 401);
  await go("/espace/aaaaaaaaaaaaaaaaaaaa");
  await page.getByText("Votre besoin a évolué ? Actualiser ma priorité", { exact: true }).click();
  await page.locator('select[name="objectif"]').selectOption("assurance-vie");
  await page.locator('select[name="av"]').selectOption("O");
  await page.getByRole("button", { name: "Actualiser sans rien acheter" }).click();
  await page.waitForFunction(() =>
    document.body.textContent.includes("Votre priorité a été actualisée"),
  );
  ok(
    JSON.parse(fs.readFileSync(fixture, "utf8")).profils.find(
      (p) => p.email === "front@example.invalid",
    ).av === "O",
  );
  await go("/espace/aaaaaaaaaaaaaaaaaaaa/etape/3");
  const coche = page.getByRole("button", { name: "J'ai terminé cette étape", exact: true });
  if (await coche.count()) await coche.click();
  await go("/espace/aaaaaaaaaaaaaaaaaaaa?vue=outils");
  ok(
    await page
      .getByText("Vous avez terminé l’étape sur l’assurance-vie.", { exact: false })
      .isVisible(),
  );
  await page.getByText("Votre besoin a évolué ? Actualiser ma priorité", { exact: true }).click();
  await page.locator('select[name="objectif"]').selectOption("preparer");
  await page.getByRole("button", { name: "Actualiser sans rien acheter" }).click();
  await page.waitForFunction(() =>
    document.body.textContent.includes("Votre priorité a été actualisée"),
  );
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await go("/dossier-complet?o=ord_revue_front");
    ok(await page.getByRole("heading", { name: "Vous conservez", exact: true }).isVisible());
    ok(await page.getByRole("heading", { name: "Vous ajoutez", exact: true }).isVisible());
    ok(await page.getByText("L’avantage du pack :", { exact: false }).isVisible());
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page
      .getByRole("heading", { name: "Vous conservez", exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({ path: ".build-refonte/v5-bilan-" + width + ".png" });
  }
  await page.getByText("Le pack est trop large pour mon besoin actuel", { exact: true }).click();
  await page
    .getByRole("link", { name: "Voir uniquement le module assurance-vie, sans acheter" })
    .click();
  await page.waitForURL("**/kit-assurance-vie?*");
  ok(new URL(page.url()).searchParams.get("alternative") === "1");
  ok(await page.getByRole("button", { name: /Ajouter pour 67/ }).isVisible());
  ok(
    (await page
      .getByText("Le pack est trop large pour mon besoin actuel", { exact: true })
      .count()) === 0,
  );
  await page.getByRole("link", { name: "Commencer avec mon achat actuel", exact: true }).click();
  await page.waitForURL("**/merci?*");
  ok(new URL(page.url()).pathname === "/merci");
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
  ok(errors.length === 0);
  console.log(
    n +
      " contrôles navigateur V5 réussis. Interface de consentement avec service simulé, échec réel sans Postgres, priorité réelle sur fixture, offres et absence de requêtes tierces.",
  );
} finally {
  await browser?.close();
  server.kill();
  await new Promise((resolve) =>
    server.exitCode !== null ? resolve() : server.once("exit", resolve),
  );
  fs.writeFileSync(fixture, initial); // Restauration de la fixture fictive uniquement.
}
