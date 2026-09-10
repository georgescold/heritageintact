import fs from "node:fs";import path from "node:path";import vm from "node:vm";import assert from "node:assert/strict";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript"),cache=new Map();let n=0;
function mod(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,process:{env:{}},require:p=>mod(path.resolve(path.dirname(file),p)+".ts")});return exports;}
const ok=(x)=>{assert.ok(x);n++;},e=mod("src/lib/exemple-headline.ts").EXEMPLE_HEADLINE;
ok(e.enfants===2);ok(e.maison===480000);ok(e.epargne===149030);ok(e.age===65);ok(Math.abs(e.succession-82194.7)<.001);ok(Math.abs(e.donation-13988.7)<.001);ok(e.ecart===68206);
ok(e.hypotheses.includes("Aucune donation antérieure"));ok(e.limites.includes("pas gain net"));ok(e.limites.includes("Chaque famille"));
for(const p of ["src/app/page.tsx","src/app/methode/page.tsx"]){const t=fs.readFileSync(p,"utf8");ok(t.includes("68 206 €"));ok(!t.includes("Écart de droits dans un exemple fictif à deux enfants, hors frais. Pas une économie promise."));ok(t.includes(p.includes("/methode/")?"votre mort":"7 erreurs à connaître à temps"));ok(t.includes("<UrgencyBar"));ok(t.includes("<SortieGuide"));ok(p.includes("/methode/")?t.includes("<CalculHistorique"):!t.includes("<ConditionsExoneration"));ok(!/Loys|Coquelle/.test(t));}
const lp=fs.readFileSync("src/app/page.tsx","utf8"),optin=fs.readFileSync("src/components/OptinForm.tsx","utf8"),actions=fs.readFileSync("src/app/actions.ts","utf8");
ok(lp.includes('const cta = "Voir la vidéo"'));ok(lp.includes("7 erreurs à connaître à temps"));ok(!lp.includes("L’exemple présenté sur la page suivante"));
ok(optin.includes('name="cgv"')&&optin.includes("required")&&optin.includes("J&apos;accepte les"));ok(actions.includes("if (!cgv)")&&actions.includes("Cochez la case pour accepter"));
const position=mod("src/lib/positionnement.ts");ok(position.conseilOffre({objectif:"assurance-vie",av:"O"}).titre.includes("contrat désigne"));ok(position.conseilOffre({enfants:"R"}).titre.includes("interprétant"));ok(position.conseilOffre({vie:"V"}).titre.includes("seul face"));ok(position.conseilOffre({vie:"P"}).titre.includes("l’autre"));
const email=fs.readFileSync("src/lib/email.ts","utf8"),route=fs.readFileSync("src/app/reprendre/[token]/route.ts","utf8");
ok(email.includes('?destination=commande'));ok(route.includes('==="commande"?"/commande":"/methode"'));ok(route.includes("promotionParId"));ok(!route.includes("commencerPromotion"));
const sequence=fs.readFileSync("src/lib/sequence.ts","utf8");
for(const key of ["j1","j2","j3","j4","j5","j6","j7"])ok(sequence.includes('cle: "'+key+'"'));
ok(sequence.includes("52 €"));ok(sequence.includes("cas fictif"));ok(!sequence.includes("Le prix ne disparaît pas ce soir"));
const sortie=fs.readFileSync("src/components/SortieOffre.tsx","utf8");
ok(sortie.includes('dossier=produit==="bump"'));ok(sortie.includes("Ce que vous risquez si vous fermez cette page"));ok(sortie.includes("Aucun achat sur ce clic"));
console.log(n+" contrôles copy V8 réussis : headline, calcul fictif, profils, CTA, liens chauds, preuve et droits. Aucun service externe.");
