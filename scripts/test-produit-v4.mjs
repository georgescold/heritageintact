import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript");
function read(rel){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(rel,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports});return exports;}
let n=0;const ok=x=>{assert.ok(x);n++};
const {EXERCICES}=read("src/lib/exercices.ts"),{LECONS}=read("src/lib/lecons.ts"),{GUIDES_UTILISATION,guidesPossedes}=read("src/lib/guides-utilisation.ts");
ok(EXERCICES.length===8);
for(const l of LECONS){const e=EXERCICES.find(e=>e.cle===l.cle);ok(e);ok(e.gestes.length===3);for(const k of ["titre","resultat","exemple","question","correction","siBloque"])ok(e[k].length>20);}
ok(new Set(EXERCICES.map(e=>e.cle)).size===8);
ok(GUIDES_UTILISATION.length===4);
ok(guidesPossedes(new Set()).length===0);
for(const sku of ["front","bump","upsell1","upsell2"]){const g=guidesPossedes(new Set([sku]));ok(g.length===1);ok(g[0].sku===sku);ok(g[0].seances.length>=3);}
ok(guidesPossedes(new Set(["front","bump","upsell1","upsell2"])).length===4);
const catalogue=fs.readFileSync("src/lib/methode.ts","utf8");
for(const g of GUIDES_UTILISATION)for(const s of g.seances){ok(s.length===4);ok(s[1].length>100);ok(s[2].length>35);if(s[3])ok(catalogue.includes('"'+s[3]+'"'));}
const sale=fs.readFileSync("src/app/methode/page.tsx","utf8");
ok(sale.indexOf("Mon réflexe")<sale.indexOf('id="premier-cta"'));ok(sale.indexOf("<PreuvePreparation")<sale.indexOf('id="premier-cta"'));
console.log(n+" contrôles produit réussis : exercices, guides, supports existants, filtrage des achats et preuve avant CTA. Sans réseau ni base.");
