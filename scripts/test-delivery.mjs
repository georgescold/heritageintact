// Contrôles isolés : aucune base, aucun email et aucun paiement réels.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url), ts = require("typescript");
function loader(overrides = {}) {
  const cache = new Map();
  const load = rel => {
    if (cache.has(rel)) return cache.get(rel);
    const file = path.resolve(rel), exports = {}; cache.set(rel, exports);
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText, {
      exports, Date, URL, Request, Response, Headers, Buffer, Uint8Array, console,
      process:{env:{},cwd:()=>process.cwd()}, fetch:()=>{throw Error("Réseau interdit");},
      require:name=>{
        if (name in overrides) return overrides[name];
        if (!name.startsWith(".") && !name.startsWith("@/")) return require(name);
        const base = name.startsWith("@/") ? path.resolve("src",name.slice(2)) : path.resolve(path.dirname(file),name);
        return load([".ts",".tsx"].map(e=>base+e).find(f=>fs.existsSync(f)));
      }
    },{filename:rel});
    return exports;
  };
  return load;
}
const load = loader(), data = load("src/lib/simulateur/donnees.ts");
let row={value:JSON.stringify({donnees:{age:65},termine:true}),version:4};
const fakeSql=async(strings,...values)=>{
 const query=strings.join("?");
 if(query.includes("create table")||query.includes("alter table"))return [];
 if(query.includes("select value"))return [row];
 const json=values.find(v=>v?.jsonParameter);
 assert.ok(json,"Utiliser le paramètre JSON natif du pilote");
 assert.equal(typeof json.value,"object","Pas de double sérialisation");
 row={value:json.value,version:row.version+1};return [row];
};
fakeSql.json=value=>({jsonParameter:true,value});
const sqlStore=loader({"./sql":{sql:()=>fakeSql,sqlActif:true}})("src/lib/delivery-store.ts");
assert.equal((await sqlStore.readDelivery("test@example.invalid","simulation")).value.termine,true);
assert.equal((await sqlStore.writeDelivery("test@example.invalid","simulation",{termine:true},4)).value.termine,true);
const d = {...data.DONNEES_VIDES,age:65,vie:"S",enfants:2,testament:"N",international:"N",donationsMultiples:"N",entreprise:"N",recomposition:"N",intention:"ordre",descendantDecede:"N",demembrement:"N",repartition:"O"};
assert.equal(data.raisonsChiffrage(d).length,0);
for (const variation of [{inconnues:["epargne"]},{vie:"M"},{testament:"O"},{international:"O"},{entreprise:"O"},{enfants:0},{avAvant:1000},{donationAnnee:2020}]) assert.ok(data.raisonsChiffrage({...d,...variation}).length);
assert.equal(data.validerDonneesSimulation({...d,epargne:-1}),null);
assert.equal(data.validerDonneesSimulation({...d,age:500}),null);
assert.equal(data.validerDonneesSimulation({...d,enfants:0}).enfants,0);

let possede = new Set(["front"]), revoked = false, stored = null, writes = 0;
const api = loader({
  "@/lib/espace":{chargerEspace:async()=>({acces:{email:"test@example.invalid",revoque:revoked},possede})},
  "@/lib/jeton":{estJetonValide:j=>j==="test-only"},
  "@/lib/methode":{documentParCle:k=>k==="inventaire"?{sku:"bump"}:null},
  "@/lib/delivery-store":{
    readDelivery:async()=>stored,
    writeDelivery:async(_e,_k,value,version)=>{if ((stored?.version??0)!==version) return null;writes++;return stored={value,version:version+1};}
  }
})("src/app/espace/[jeton]/sauvegarde/[cle]/route.ts");
const context = cle=>({params:Promise.resolve({jeton:"test-only",cle})});
const request = (value,version=0,origin="https://local.invalid")=>new Request("https://local.invalid/save",{method:"PUT",headers:{origin,"Content-Type":"application/json"},body:JSON.stringify({value,version})});
assert.equal((await api.GET(new Request("https://local.invalid"),context("inventaire"))).status,403);
assert.equal((await api.PUT(request({donnees:d,index:3,termine:false}),context("simulation"))).status,200);
assert.equal((await api.GET(new Request("https://local.invalid"),context("simulation"))).headers.get("Cache-Control"),"private, no-store");
assert.equal((await api.PUT(request({donnees:d,index:4,termine:false}),context("simulation"))).status,409);
assert.equal((await api.PUT(request({donnees:d,index:4,termine:false},1,"https://foreign.invalid"),context("simulation"))).status,403);
assert.equal(writes,1);
assert.equal((await api.PUT(request({donnees:{...d,epargne:-1},index:4,termine:false},1),context("simulation"))).status,400);
assert.equal((await api.PUT(request({donnees:d,index:30,termine:true},1),context("simulation"))).status,200);
assert.equal((await api.PUT(request({donnees:{...d,epargne:5000},index:4,termine:false},2),context("simulation"))).status,200);
assert.equal(stored.value.dernierPlan.epargne,d.epargne,"La reprise ne supprime pas le dernier plan terminé");
assert.equal(stored.value.donnees.epargne,5000);
const pdf = loader({
  "@/lib/espace":{chargerEspace:async()=>({acces:{email:"test@example.invalid",revoque:false},possede:new Set(["upsell1"])})},
  "@/lib/jeton":{estJetonValide:()=>true},
  "@/lib/delivery-store":{readDelivery:async()=>stored},
  "@/lib/simulateur/pdf-plan":{genererPlanPersonnalisePdf:async value=>{assert.equal(value.epargne,d.epargne);return Buffer.from("%PDF-test");}},
})("src/app/espace/[jeton]/pdf/[slug]/route.ts");
assert.equal((await pdf.GET(new Request("https://local.invalid"),{params:Promise.resolve({jeton:"test-only",slug:"plan-personnalise"})})).status,200);
possede.add("bump"); stored=null;
assert.equal((await api.PUT(request({0:"Information de test"}),context("inventaire"))).status,200);
assert.equal((await (await api.GET(new Request("https://local.invalid"),context("inventaire"))).json()).value[0],"Information de test");
revoked=true;
assert.equal((await api.GET(new Request("https://local.invalid"),context("inventaire"))).status,403);

const {SEQUENCE_CLIENT,etapeClientDue}=load("src/lib/sequence-client.ts");
assert.equal(SEQUENCE_CLIENT.length,3);
for(const e of SEQUENCE_CLIENT) {
  assert.ok(!e.bouton.chemin("test").includes("/etape/0"));
  assert.ok(!e.corps("Test","/espace/test").join(" ").includes("bouton « Reprendre »"));
}
assert.ok(etapeClientDue({createdAt:new Date(Date.now()-4*86400000).toISOString(),envoyes:["c1"]},{etape0Ouverte:false,nbFaites:0}));
const {etapeLtvDue}=load("src/lib/sequence-ltv.ts");
const lead={marketingConsent:true,desabonne:false},acces={createdAt:new Date(Date.now()-11*86400000).toISOString(),envoyes:[],revoque:false};
assert.ok(etapeLtvDue(lead,acces,[]));
assert.equal(etapeLtvDue({...lead,marketingConsent:false},acces,[]),null);
assert.equal(etapeLtvDue(lead,{...acces,envoyes:["ltv-pause"]},[]),null);
console.log("Delivery : validation, inconnus ≠ zéro, accès produits, révocation, sauvegarde, reprise, conflits multi-écrans, origine, séquences et consentement : OK.");
