import fs from "node:fs";import vm from "node:vm";import assert from "node:assert/strict";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript");
function read(file){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});return exports;}
const {EDITORIAL_PRODUITS:guides,OUVERTURES_CHAPITRES:chapitres,suiteProduit:suite}=read("src/lib/editorial-produits.ts"),{EDITORIAL_FICHES:fiches}=read("src/lib/editorial-fiches.ts");
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++};
for(const g of Object.values(guides)){ok(g.histoire.length===2);ok(g.apprendre.length===3);for(const p of [g.ouverture,...g.histoire,...g.apprendre,g.essentiel,g.limite,g.acquis,g.suite])ok(p.length>30);}
ok(Object.keys(chapitres).length===8);ok(Object.keys(fiches).length===34);
for(const [cle,[histoire,objectif]] of Object.entries(fiches)){ok(histoire.length>80,cle);ok(objectif.length>50,cle);}
const catalogue=fs.readFileSync("src/lib/methode.ts","utf8");for(const cle of Object.keys(fiches))ok(catalogue.includes('"'+cle+'"'),cle);
const front=new Set(["front"]),pack=new Set(["front","bump","upsell1","upsell2","backend1"]),prep=new Set(["front","bump","upsell1","backend1"]);
for(const moment of [...Object.keys(chapitres),...Object.keys(fiches),...Object.keys(guides)]){ok(suite(moment,pack,{av:"O"})===null);ok(suite(moment,prep,{av:"N"})===null);}
ok(suite("front",front,{av:"O",objectif:"assurance-vie"}).sku==="upsell2");
ok(suite("e3",front,{av:"N"})===null);ok(suite("e3",front,{av:"?"})===null);ok(suite("e3",front,{av:"O"}).sku==="upsell2");
ok(suite("e4",front,{av:"O"}).sku==="pack1");ok(suite("e4",front,{av:"N"}).sku==="upsell1");
ok(suite("upsell1",prep,{av:"O"}).sku==="upsell2");
ok(suite("upsell2",new Set(["front","upsell2"]),{av:"O"}).sku==="upsell1");
for(const moment of ["e1","e2","e5","e6","lexique","inventaire"])ok(suite(moment,front,{av:"O"})===null);
const page=fs.readFileSync("src/app/espace/[jeton]/etape/[n]/page.tsx","utf8"),renderer=fs.readFileSync("scripts/creer-guides-v7.py","utf8");
ok(!page.includes("ExerciceGuide"));ok(!renderer.includes('DATA["exercices"]'));ok(page.includes("OUVERTURES_CHAPITRES"));ok(renderer.includes('DATA["fichesEditorial"]'));
const composant=fs.readFileSync("src/components/SuiteProduit.tsx","utf8");ok(composant.includes("Aucun achat sur ce clic"));ok(!composant.includes("commencerPromotion"));ok(!composant.includes("chargeUpsell"));
console.log(n+" contrôles éditoriaux V9 réussis : 4 guides, 8 chapitres, 34 fiches, pas de quiz, suites pertinentes et fin de parcours sans revente. Aucun service externe.");
