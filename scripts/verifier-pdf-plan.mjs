import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const cache = new Map();
function charger(relatif) {
  if (cache.has(relatif)) return cache.get(relatif);
  const fichier = path.resolve(relatif);
  const exports = {};
  cache.set(relatif, exports);
  const js = ts.transpileModule(fs.readFileSync(fichier, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(js, {
    exports,
    require: (nom) => {
      if (!nom.startsWith(".")) return require(nom);
      return charger(path.relative(process.cwd(), path.resolve(path.dirname(fichier), `${nom}.ts`)).replaceAll("\\", "/"));
    },
    console,
    Buffer,
    Uint8Array,
    Date,
  }, { filename: relatif });
  return exports;
}

const exemple = {
  age: 69, vie: "M", residence: 480000, immobilier: 90000, epargne: 40000,
  titres: 25000, autres: 10000, dettes: 30000, enfants: 2, petitsEnfants: 1,
  fratrie: 0, neveux: 0, sansLien: 0, beauxEnfants: 1, handicap: 0,
  avAvant: 180000, avApres: 45000, beneficiaires: 2, donationAnnee: 2017,
  donationMontant: 60000, protectionSignee: "N", personneConfiance: "?",
  detentionResidence: "couple", souhaitResidence: "transmettre",
};
const donnees = charger("src/lib/simulateur/donnees.ts");
assert.equal(donnees.validerDonneesSimulation(exemple)?.age, 69);
assert.equal(donnees.validerDonneesSimulation({ ...exemple, residence: -1 }), null);
assert.ok(donnees.validerDonneesSimulation({ ...exemple, enfants: 0, petitsEnfants: 0, beauxEnfants: 0 }));
assert.ok(donnees.raisonsChiffrage({ ...exemple, enfants: 0, petitsEnfants: 0, beauxEnfants: 0 }).length > 0);
assert.ok(donnees.raisonsChiffrage({ ...exemple, inconnues: ["epargne"] }).length > 0);
assert.ok(donnees.informationsARetrouver({ ...exemple, inconnues: ["epargne"] }).length > 0);
assert.match(donnees.planPreparation({ ...exemple, urgence: "signature" })[0], /notaire/i);
assert.ok(donnees.pointsPreparation(exemple).some((point) => point.cle === "protection"));
assert.ok(donnees.pointsPreparation(exemple).some((point) => point.cle === "famille"));
assert.ok(donnees.pointsPreparation(exemple).some((point) => point.cle === "maison"));
const pdf = await charger("src/lib/simulateur/pdf-plan.ts").genererPlanPersonnalisePdf(exemple, new Date("2026-09-10T10:00:00Z"));
assert.equal(Buffer.from(pdf).subarray(0, 5).toString(), "%PDF-");
const sortie = path.resolve("tmp/pdfs/exemple-plan-personnalise.pdf");
fs.mkdirSync(path.dirname(sortie), { recursive: true });
fs.writeFileSync(sortie, Buffer.from(pdf));
const document = await require("pdf-lib").PDFDocument.load(pdf);
assert.ok(document.getPageCount() >= 4);
console.log(`PDF personnalisé valide : ${document.getPageCount()} pages, ${pdf.length} octets.`);
const aide = charger("src/lib/simulateur/accompagnement.ts");
const simple = {...donnees.DONNEES_VIDES, age:65, vie:"S", enfants:2, residence:180000, epargne:20000, testament:"N", international:"N", entreprise:"N", donationsMultiples:"N", descendantDecede:"N", demembrement:"N", repartition:"O", recomposition:"N", urgence:"non", intention:"ordre"};
assert.equal(donnees.raisonsChiffrage(simple).length,0);
assert.ok(aide.incoherencesReponses({...simple,age:20,avApres:40000}).length);
assert.ok(aide.incoherencesReponses({...simple,age:20,donationAnnee:1990}).length);
let casesTested=0;
for(const vie of ["M","P","U","V","S"])for(const urgence of ["non","signature","succession","conflit"])for(const intention of ["ordre","maison","conjoint","famille"])for(const statut of ["O","N","?"]) {
 const d={...simple,vie,urgence,intention,testament:statut,international:statut,entreprise:statut,donationsMultiples:statut,descendantDecede:statut,demembrement:statut,recomposition:statut,regime:"communaute"};
 assert.ok(donnees.validerDonneesSimulation(d));
 assert.ok(aide.questionsSituation(d).length);
 for(const p of donnees.pointsPreparation(d)) assert.ok(Object.values(aide.accompagnementPoint(p)).every(x=>x.length>20));
 assert.ok(donnees.planPreparation(d).length);casesTested++;
}
const variants={simple,pacs:{...simple,age:20,vie:"P",avApres:40000,urgence:"signature",entreprise:"O",descendantDecede:"O"},inconnus:{...simple,inconnues:["epargne","quotePart","donationAnnee"], international:"?"},sans_enfant:{...simple,enfants:0,vie:"V"},maximal:{...exemple,age:90,residence:1000000000,epargne:1000000000,international:"O",entreprise:"O",testament:"O",urgence:"conflit",descendantDecede:"O"}};
for(const [name,d] of Object.entries(variants)) {
 const bytes=await charger("src/lib/simulateur/pdf-plan.ts").genererPlanPersonnalisePdf(d);
 fs.writeFileSync(path.resolve(`tmp/pdfs/qa-${name}.pdf`),bytes);
 assert.equal(Buffer.from(bytes).subarray(0,5).toString(),"%PDF-");
}
console.log(`${casesTested} combinaisons + 5 PDF représentatifs : OK.`);
