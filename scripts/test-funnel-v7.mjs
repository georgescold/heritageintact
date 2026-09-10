import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript");
let n=0;const eq=(a,b)=>{assert.equal(a,b);n++},ok=(x)=>{assert.ok(x);n++};
function loader(overrides={},env={}){
 const cache=new Map();
 function mod(rel){
  if(overrides[rel])return overrides[rel];
  if(cache.has(rel))return cache.get(rel);
  const file=path.resolve(rel),exports={};cache.set(rel,exports);
  const js=ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  vm.runInNewContext(js,{exports,process:{env,cwd:()=>process.cwd()},Buffer,Date,URL,Response,Request,Headers,console,Uint8Array,fetch:()=>{throw Error("Réseau interdit")},require:p=>{
   if(overrides[p])return overrides[p];
   if(!p.startsWith(".")&&!p.startsWith("@/"))return require(p);
   return mod((p.startsWith("@/")?"src/"+p.slice(2)+".ts":path.relative(process.cwd(),path.resolve(path.dirname(file),p+".ts"))).replaceAll("\\","/"));
  }},{filename:rel});
  return exports;
 }
 return mod;
}
let mod=loader();
const {palier,appliquerRemise}=mod("src/lib/promotions.ts");
const now=Date.now(),start=new Date(now).toISOString();
for(const gamme of ["front","suite"]){
 const p={id:"promo_fictive",email:"test@example.invalid",gamme,commenceLe:start};
 eq(palier(null,now).pourcent,0);
 eq(palier(p,now-1).pourcent,0);
 eq(palier(p,now).pourcent,gamme==="front"?50:25);
 const premiereFin=now+(gamme==="front"?2:20)*60000;
 eq(palier(p,premiereFin-1).pourcent,gamme==="front"?50:25);
 eq(palier(p,premiereFin).pourcent,gamme==="front"?30:10);
 const end=now+(gamme==="front"?10*60000:48*3600000);
 eq(palier(p,end-1).pourcent,gamme==="front"?30:10);eq(palier(p,end).pourcent,0);eq(palier(p,end+1).fin,null);
 eq(palier({...p,commenceLe:"invalide"},now).pourcent,0);
 eq(loader({}, {OFFRES_TEMPORAIRES_ACTIVES:"false"})("src/lib/promotions.ts").palier(p,now).pourcent,0);
}
for(const [v,p,r]of[[52,50,26],[52,30,36.4],[170,25,127.5],[153,25,114.75],[203,25,152.25],[0,25,0],[67,25,50.25]])eq(appliquerRemise(v,p),r);
for(const [v,p]of[[NaN,20],[-1,20],[100,99],[Infinity,25]]){assert.throws(()=>appliquerRemise(v,p));n++}
const {QUESTIONS,profilComplet}=mod("src/lib/questionnaire.ts");
const valide={objectif:"maison",vie:"M",enfants:"2",age:"c",av:"N",blocage:"ordre"};
eq(QUESTIONS.length,6);ok(profilComplet(valide));ok(profilComplet({objectif:"facture",vie:"?",enfants:"?",age:"X",av:"?",blocage:"complexite"}));
for(const q of QUESTIONS){
 const absent={...valide};delete absent[q.champ];eq(profilComplet(absent),false);
 for(const code of ["","Z","injection",undefined,12])eq(profilComplet({...valide,[q.champ]:code}),false);
 for(const [code]of q.choix)eq(profilComplet({...valide,[q.champ]:code}),true);
}
// Base en mémoire exclusivement : aucun fichier data/db.json n’est lu ni écrit.
let data={leads:[],orders:[],acces:[],progression:[],profils:[]},writes=0;
const cookies=new Map(),jar={get:k=>cookies.has(k)?{value:cookies.get(k)}:undefined,set:(k,v)=>cookies.set(k,v),delete:k=>cookies.delete(k)};
const fakeFs={readFile:async()=>JSON.stringify(data),mkdir:async()=>{},writeFile:async(_p,v)=>{data=JSON.parse(v);writes++}};
const overrides={
 fs:{promises:fakeFs},
 "src/lib/sql.ts":{sqlActif:false,assurerSchema:async()=>{},sql:()=>{throw Error("SQL interdit")}},
 "next/headers":{cookies:async()=>jar},
 "next/navigation":{redirect:url=>{throw Error("REDIRECT "+url)}},
 "src/lib/espace.ts":{possessions:async()=>new Set()},
 "src/lib/stripe.ts":{stripe:null,toCents:n=>Math.round(n*100)},
 "src/lib/email.ts":{envoyerLivraison:async()=>({ok:false}),envoyerRecuAchat:async()=>({ok:false})},
 "src/lib/livraison.ts":{livrer:async()=>null}
};
mod=loader(overrides);const db=mod("src/lib/db.ts"),actions=mod("src/app/actions.ts");
const p=await db.commencerPromotion("  TEST@example.invalid ","front");
eq(p.email,"test@example.invalid");ok(/^promo_/.test(p.id));
const w=writes;eq((await db.commencerPromotion("test@example.invalid","front")).id,p.id);eq(writes,w);
eq((await db.promotionParId(p.id)).commenceLe,p.commenceLe);
eq(await db.promotionParId("../../secret"),null);
cookies.set("hi_offre",p.id);
let result=await actions.prepareCheckout({firstName:"Client",email:"test@example.invalid",consent:true,withBump:true,montantAffiche:52});
eq(result.ok,false);eq(result.actualiser,true);eq(data.orders.length,0);
result=await actions.prepareCheckout({firstName:"Client",email:"test@example.invalid",consent:true,withBump:true,montantAffiche:26});
eq(result.ok,true);const orderId=result.orderId;
eq(data.orders[0].items[0].price,26);eq(data.orders[0].items.reduce((s,i)=>s+i.price,0),43);
eq((await actions.chargeUpsell(orderId,"upsell1",118.8)).ok,false);
const save=mod("src/app/profil.ts").enregistrerReponses;
eq((await save(orderId,"pirate@example.invalid",{})).ok,false);eq(data.profils.length,0);
eq((await save("inconnue","test@example.invalid",valide)).ok,false);
eq((await save(orderId,"pirate@example.invalid",valide)).ok,true);
eq(data.profils[0].email,"test@example.invalid");eq(data.promotions.length,2);
const debutSuite=data.promotions.find(p=>p.gamme==="suite").commenceLe;
eq((await save(orderId,"",valide)).ok,true);
eq(data.promotions.find(p=>p.gamme==="suite").commenceLe,debutSuite);
const quote=mod("src/lib/devis.ts").devisPour;
eq((await quote("test@example.invalid","upsell1")).montant,115.5);
eq((await quote("test@example.invalid","pack1")).montant,153);
eq((await quote("test@example.invalid","upsell2")).montant,50.25);
eq((await quote("test@example.invalid","bump")).promotion.pourcent,0);
data.promotions.find(p=>p.gamme==="suite").commenceLe=new Date(Date.now()-21*60000).toISOString();
eq((await actions.chargeUpsell(orderId,"upsell1",115.5)).ok,false);
eq(data.orders[0].items.length,2);
eq((await quote("test@example.invalid","upsell1")).montant,138.6);
eq((await actions.chargeUpsell(orderId,"upsell1")).ok,false);
eq((await actions.chargeUpsell(orderId,"upsell1",138.6)).ok,true);
eq(data.orders[0].items.find(i=>i.sku==="upsell1").price,138.6);
const len=data.orders[0].items.length;
eq((await actions.chargeUpsell(orderId,"upsell1",138.6)).ok,true);eq(data.orders[0].items.length,len);
// Même calcul lorsque le complément est acheté depuis l’espace.
const target=await quote("test@example.invalid","upsell2");
const added=await db.creerCommandeEspace({email:"test@example.invalid",firstName:"Client",sku:"upsell2",mode:"test"});
eq(added.items[0].price,target.montant);
// Une panne de sauvegarde ne passe jamais pour une qualification terminée.
let broken=loader({...overrides,fs:{promises:{...fakeFs,writeFile:async()=>{throw Error("écriture impossible")}}}});
eq((await broken("src/app/profil.ts").enregistrerReponses(orderId,"",{...valide,av:"O"})).ok,false);
// Le tarif d’une adresse ne s’applique pas au paiement d’une autre adresse.
const mismatch=await actions.prepareCheckout({firstName:"Client",email:"autre@example.invalid",consent:true,withBump:false,montantAffiche:26});
eq(mismatch.ok,false);eq(cookies.has("hi_offre"),false);
let etat=null,reads=0;
const pdf=loader({"src/lib/espace.ts":{chargerEspace:async()=>etat},"node:fs/promises":{readFile:async p=>{ok(p.endsWith(path.join("output","pdf","les-7-erreurs.pdf")));reads++;return Buffer.from("%PDF-1.4 fictif");}}})("src/app/espace/[jeton]/pdf/[slug]/route.ts");
const req=new Request("http://localhost/espace/fictif/pdf");
const params={jeton:"aaaaaaaaaaaaaaaaaaaa",slug:"les-7-erreurs"};
eq((await pdf.GET(req,{params:Promise.resolve({...params,slug:"../secret"})})).status,404);
eq((await pdf.GET(req,{params:Promise.resolve(params)})).status,403);eq(reads,0);
etat={acces:{revoque:false},possede:new Set(["front"])};
let response=await pdf.GET(req,{params:Promise.resolve(params)});
eq(response.status,200);eq(response.headers.get("Content-Type"),"application/pdf");ok(response.headers.get("Cache-Control").includes("no-store"));eq(reads,1);
etat.acces.revoque=true;eq((await pdf.GET(req,{params:Promise.resolve(params)})).status,403);eq(reads,1);
etat.acces.revoque=false;eq((await pdf.GET(req,{params:Promise.resolve({...params,slug:"dossier-notaire"})})).status,403);
for(const slug of ["les-7-erreurs","dossier-notaire","preparation-familiale","assurance-vie"]){
 ok(fs.readFileSync("output/pdf/"+slug+".pdf").subarray(0,5).toString()==="%PDF-");
 ok(!fs.existsSync("public/"+slug+".pdf"));
}
console.log(n+" contrôles V7 réussis : six réponses, conservation, paliers, expirations, prix concordants, non-redébit simulé, droits PDF. Aucune base, API ni adresse réelle.");
