import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url),
  ts = require("typescript");
function read(rel) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(rel, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { exports },
  );
  return exports;
}
let n = 0;
const ok = (x) => {
  assert.ok(x);
  n++;
};
const { OUVERTURES_CHAPITRES } = read("src/lib/editorial-produits.ts"),
  { LECONS } = read("src/lib/lecons.ts"),
  { GUIDES_UTILISATION, guidesPossedes } = read("src/lib/guides-utilisation.ts");
ok(LECONS.length === 8);
for (const l of LECONS) {
  ok(OUVERTURES_CHAPITRES[l.cle].length > 100);
  ok(l.acquis.length >= 2);
  ok(l.aFaire.length > 20);
}
ok(Object.keys(OUVERTURES_CHAPITRES).length === 8);
ok(GUIDES_UTILISATION.length === 5);
ok(guidesPossedes(new Set()).length === 0);
for (const sku of ["front", "bump", "upsell1", "upsell2", "backend4"]) {
  const g = guidesPossedes(new Set([sku]));
  ok(g.length === 1);
  ok(g[0].sku === sku);
  ok(g[0].seances.length >= 3);
}
ok(guidesPossedes(new Set(["front", "bump", "upsell1", "upsell2"])).length === 4);
const catalogue = fs.readFileSync("src/lib/methode.ts", "utf8");
for (const g of GUIDES_UTILISATION)
  for (const s of g.seances) {
    ok(s.length === 4);
    ok(s[1].length > 100);
    ok(s[2].length > 35);
    if (s[3]) ok(catalogue.includes('"' + s[3] + '"'));
  }
const sale = fs.readFileSync("src/app/methode/page.tsx", "utf8");
// V6 : CTA sous la VSL ; preuve et objection restent présentes avant le CTA final.
const premier = sale.indexOf('id="premier-cta"'),
  dernier = sale.indexOf('id="dernier-cta"');
ok(premier > sale.indexOf("<VslPresentation") && sale.indexOf("<VslPresentation") >= 0);
const vsl = fs.readFileSync("src/components/VslPresentation.tsx", "utf8"),
  vslPath = "public/videos/vsl-heritage-intact-v2.mp4";
ok(vsl.includes("<video") && vsl.includes('src="/videos/vsl-heritage-intact-v2.mp4"'));
ok(vsl.includes('preload="none"'));
ok(
  !vsl.includes("\n          controls\n") &&
    vsl.includes("onSeeking={empecherLeSaut}") &&
    vsl.includes('controlsList="nodownload noplaybackrate noremoteplayback"'),
);
ok(
  vsl.includes('data-progression-visuelle="tres-acceleree-puis-ralentie"') &&
    vsl.includes("Math.pow(1 - reel, 4)"),
);
ok(!vsl.includes("dureeAffichee"));
ok(!vsl.includes("Présentation complète · 5 min 14 · Activez le son"));
ok(!vsl.includes("activerOffreApresVsl") && !vsl.includes("hi_vsl_terminee"));
ok(!sale.includes("AvantageDemarrage") && sale.includes('href="/commander"'));
ok(!sale.includes("<ExempleSeuil") && !sale.includes("<ChiffresHistoriques"));
ok(!sale.includes("52 € pour") && !sale.includes("euros(montant)"));
ok(!fs.readFileSync("src/components/SortieGuide.tsx", "utf8").includes("euros("));
const offreFront = fs.readFileSync("src/components/marketing/OffreMethodeHistorique.tsx", "utf8");
ok(!offreFront.includes("<table") && !offreFront.includes("guide complet téléchargeable") && !offreFront.includes("guide PDF"));
for (const dossier of ["src/app", "src/components", "src/content", "src/lib"]) {
  for (const fichier of fs.readdirSync(dossier, { recursive: true }).filter((nom) => /\.tsx?$/.test(nom))) {
    ok(!/\bméthodes?\b/i.test(fs.readFileSync(dossier + "/" + fichier, "utf8")));
  }
}
const checkout = fs.readFileSync("src/components/CheckoutForm.tsx", "utf8"),
  commander = fs.readFileSync("src/app/commander/route.ts", "utf8");
ok(checkout.includes("!identiteConnue &&") && !checkout.includes("Votre accès sera envoyé à"));
ok(!checkout.includes("Les questions à préparer au notaire"));
ok(!checkout.includes("Je saurai quoi demander") && commander.includes('commencerPromotion(email, "front")'));
ok(!sale.includes("<EcheanceHistorique"));
ok(JSON.stringify(LECONS.find((l) => l.cle === "e6")).includes("790 A bis") && JSON.stringify(LECONS.find((l) => l.cle === "e6")).includes("31 décembre 2026"));
ok(
  fs.existsSync(vslPath) &&
    fs.statSync(vslPath).size > 1_000_000 &&
    fs.statSync(vslPath).size < 100_000_000,
);
ok(fs.existsSync("public/img/vsl-heritage-intact-thumbnail-v4.webp"));
for (const bloc of ["Il faut de toute façon aller chez le notaire", "<CalculHistorique"])
  ok(sale.indexOf(bloc) > premier && sale.indexOf(bloc) < dernier);
console.log(
  n +
    " contrôles produit réussis : ouvertures, guides, supports existants, filtrage des achats, VSL et preuves conservées. Sans réseau ni base.",
);
