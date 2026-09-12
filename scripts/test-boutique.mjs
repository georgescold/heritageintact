import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

/**
 * La boutique et la vente d'un guide à l'unité, éprouvées sans base, sans
 * réseau et sans Stripe. Ce qui est vérifié ici touche à l'argent : quels
 * produits sont vendables seuls, et à quel prix.
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
      require: (p) =>
        mod(path.relative(process.cwd(), path.resolve(path.dirname(file), p.replace(/^@\//, "src/"))) + ".ts"),
    },
    { filename: file },
  );
  return exports;
}

let n = 0;
const ok = (v, m) => { assert.ok(v, m); n++; };
const eq = (a, b, m) => { assert.equal(a, b, m); n++; };

const { guideVendable, GUIDES_A_LA_CARTE } = mod("src/lib/guides-vente.ts");
const { PRODUCTS, SKU_TUNNEL_UNIQUEMENT } = mod("src/lib/config.ts");

// Les quatre guides vendables a l'unite, et eux seuls.
for (const sku of ["upsell1", "upsell2", "backend4", "bump"]) ok(guideVendable(sku), sku + " vendable");

// ⚠️ LE PRODUIT D'APPEL N'EST PAS VENDABLE ICI. Il garde /commande et sa
// fenetre de prix : un second bon de commande sans promotion ferait exister
// deux tarifs du meme produit selon le lien emprunte.
ok(!guideVendable("front"), "LE GUIDE D'ENTREE GARDE SON PROPRE BON DE COMMANDE");

// Aucun pack : ils n'existent que dans le tunnel et contiennent des composants
// deja vendus ailleurs.
for (const sku of SKU_TUNNEL_UNIQUEMENT) ok(!guideVendable(sku), sku + " reste hors vente a l'unite");
ok(!guideVendable("pirate"), "un sku inconnu est refuse");
ok(!guideVendable(""), "une chaine vide est refusee");

// Un produit retire du catalogue ne doit plus se vendre.
for (const sku of GUIDES_A_LA_CARTE) {
  eq(PRODUCTS[sku].disponible, true, sku + " est disponible au catalogue");
  ok(PRODUCTS[sku].price > 0, sku + " a un prix");
}

// La boutique ne propose que des produits reels, et chaque fiche est complete.
const { BOUTIQUE, ORDRE_BOUTIQUE } = mod("src/content/boutique.ts");
eq(ORDRE_BOUTIQUE.length, 5, "cinq fiches");
eq(ORDRE_BOUTIQUE[0], "front", "le produit d'appel en premier");
for (const sku of ORDRE_BOUTIQUE) {
  const f = BOUTIQUE[sku];
  ok(f, "fiche presente : " + sku);
  ok(PRODUCTS[sku], "produit reel : " + sku);
  ok(f.resultat.length > 20, sku + " : le titre est un resultat");
  ok(f.changements.length >= 3, sku + " : au moins trois changements");
  ok(f.perte.length > 40, sku + " : le cout de l'inaction est ecrit");
  ok(!("limite" in f), sku + " : plus de ligne « ce qu'il ne fait pas »");
  // Vocabulaire proscrit par 05-funnel/teardowns.md (correction n°6).
  const texte = [f.resultat, ...f.changements, f.perte].join(" ").toLowerCase();
  ok(!texte.includes("offert"), sku + " : pas de « offert »");
  ok(!texte.includes("payez-moi"), sku + " : pas de « payez-moi »");
}

// ⚠️ Sauf le produit d'appel, toute fiche affichee doit etre achetable.
for (const sku of ORDRE_BOUTIQUE) {
  if (sku === "front") continue;
  ok(guideVendable(sku), "aucun bouton mort sur la boutique : " + sku);
}

// L'ordre du copy sur la page : le cout de l'inaction vient APRES les
// changements. Ouvrir par la douleur fait fuir (principes-premiers.md).
const page = fs.readFileSync("src/app/nos-guides/page.tsx", "utf8");
ok(
  page.indexOf("Ce qui change pour vous") < page.indexOf("Si vous ne le faites pas"),
  "LE REVE AVANT LA PEUR, JAMAIS L'INVERSE",
);

// L'ancrage est pose avant le premier prix de la page.
ok(page.includes("86 389"), "l'ancrage cite un montant de droits verifiable");
ok(page.indexOf("86 389") < page.indexOf("euros(produit.price)"), "l'ancrage precede les tarifs");

// La page reste hors index : elle affiche des prix.
const seo = fs.readFileSync("src/lib/seo.ts", "utf8");
ok(!seo.includes('"/nos-guides"'), "la boutique n'est pas indexable");
ok(!seo.includes('"/commander'), "les bons de commande ne sont pas indexables");

// Le bon de commande a l'unite ne refait pas le tunnel : il reutilise la
// creation de commande et la confirmation deja en service.
const action = fs.readFileSync("src/app/commande-guide.ts", "utf8");
ok(action.includes("creerCommandeEspace"), "reutilise la creation de commande existante");
ok(action.includes("markOrderPaid"), "le mode simule marque la commande payee, sinon rien n'est livre");
ok(action.includes("montantAffiche !== prix"), "refus si l'ecran et le serveur divergent");
ok(!action.includes("palier(") && !action.includes("appliquerRemise"), "aucune promotion sur la vente a l'unite");
const formulaire = fs.readFileSync("src/components/CommandeGuide.tsx", "utf8");
ok(formulaire.includes("confirmCheckout"), "la confirmation reste celle du tunnel");
ok(formulaire.includes("useStripe()"), "les hooks Stripe existent");
ok(
  formulaire.indexOf("function AvecStripe") > formulaire.indexOf("<Elements"),
  "les hooks Stripe ne sont appeles que sous <Elements>",
);

console.log(
  n +
    " controles boutique reussis : perimetre de vente a l'unite, produit d'appel preserve, fiches completes, reve avant peur, ancrage avant tarif, hors index, et bon de commande branche sur le tunnel existant. Aucun reseau ni base.",
);
