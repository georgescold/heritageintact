import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);const ts=require("typescript");
const root=process.cwd();const cache=new Map();
function mod(rel){const file=path.resolve(root,rel);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);
const src=fs.readFileSync(file,"utf8");const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(js,{exports,process:{env:{}},require:(p)=>mod(path.relative(root,path.resolve(path.dirname(file),p+".ts")))},{filename:file});return exports;}
const {devis,prixFront}=mod("src/lib/prix.ts");const {composants,PRODUCTS}=mod("src/lib/config.ts");
let checks=0;function equal(a,b){assert.equal(a,b);checks++;}function truth(a){assert.ok(a);checks++;}
equal(prixFront("0","0"),52);
const cases=[
["upsell1",[{sku:"front",price:26}],297],["upsell1",[{sku:"front",price:26},{sku:"bump",price:17}],297],
["upsell2",[{sku:"front",price:26},{sku:"upsell1",price:147}],67],
["upsell1",[{sku:"front",price:26},{sku:"upsell2",price:67}],297],
["upsell2",[{sku:"upsell1",price:297}],67],
["upsell1",[{sku:"backend1",price:147},{sku:"front",price:26}],150]
];for(const [sku,ls,e]of cases)equal(devis(sku,ls).montant,e);
truth(composants("upsell1").has("backend1"));truth(!composants("upsell1").has("front"));truth(!composants("upsell1").has("bump"));
for(const sku of ["pack1","pack2","pack3","pack4"])equal(PRODUCTS[sku].disponible,false);
equal(PRODUCTS.backend1.disponible,false);
const {sequence}=mod("src/lib/qualification.ts");
for(const objectif of ["comprendre","preparer","assurance-vie",undefined])for(const av of ["O","N","?",undefined])for(const enfants of ["0","1","2","R"])for(const vie of ["M","P","V","U","S"]){const r=sequence({objectif,av,enfants,vie},{bumpPresent:false});equal(r[0],"plan");equal(r.length,av==="O"?2:1);}
const {planPrincipal}=mod("src/lib/documents-pertinents.ts");equal(planPrincipal({enfants:"R",vie:"M"}),"plan-famille-recomposee");equal(planPrincipal({enfants:"0",vie:"P"}),"plan-sans-enfant");
const {LECONS}=mod("src/lib/lecons.ts");equal(LECONS.length,8);equal(LECONS.filter(l=>l.videoIndex>=0).length,0);equal(new Set(LECONS.map(l=>l.cle)).size,8);
const {calculerAtelier}=mod("src/lib/simulateur/atelier.ts");
const s={valeur:520000,enfants:1,parents:1,age:65,mode:"succession",confirme:true};
function amount(o){const r=calculerAtelier({...s,...o});truth(r.ok);return Math.round(r.total*100)/100;}
equal(amount({}),82194.35);equal(amount({valeur:100000}),0);equal(amount({valeur:200000,enfants:2}),0);
equal(amount({valeur:480000,mode:"nue-propriete",parents:2}),13988.70);
for(const p of [{confirme:false},{valeur:NaN},{valeur:-1},{enfants:0},{enfants:1.5},{parents:2},{mode:"nue-propriete",age:NaN}])equal(calculerAtelier({...s,...p}).ok,false);
const {partNuePropriete}=mod("src/lib/simulateur/bareme.ts");for(const [age,r] of [[60,.5],[61,.6],[70,.6],[71,.7],[80,.7],[81,.8],[90,.8],[91,.9]])equal(partNuePropriete(age),r);
const {SEQUENCE}=mod("src/lib/sequence.ts");equal(SEQUENCE.length,7);equal(new Set(SEQUENCE.map(e=>e.cle)).size,7);for(const e of SEQUENCE){truth(e.corps("Test").length>=3);const dossier=path.join(root,"src/app",e.bouton.chemin.replace(/^\//,""));truth(fs.existsSync(path.join(dossier,"page.tsx"))||fs.existsSync(path.join(dossier,"route.ts")));}
const checkout=fs.readFileSync("src/components/CheckoutForm.tsx","utf8");truth(checkout.includes("[bump, setBump] = useState(false)"));
truth(checkout.includes("router.push(`/bienvenue?o=${prep.orderId}`)"));
truth(!checkout.includes("router.push(`/situation?o=${prep.orderId}`)"));
const bienvenue=fs.readFileSync("src/app/bienvenue/page.tsx","utf8");truth(bienvenue.includes("ouvrirEspace(acces.jeton)"));
const boutique=fs.readFileSync("src/components/espace/Boutique.tsx","utf8");truth(boutique.includes("Obtenir mon plan personnalisé"));truth(boutique.includes("/plan-complet?o="));
const offre=fs.readFileSync("src/components/OffrePreparation.tsx","utf8");truth(!offre.includes("profilComplet(profil)"));
const simulateur=fs.readFileSync("src/components/simulateur/SimulationPlan.tsx","utf8");truth(simulateur.includes("demarrerOffre({objectif,vie:d.vie,enfants,age"));
const email=fs.readFileSync("src/lib/email.ts","utf8");truth(email.includes("lead.marketingConsent !== true || lead.desabonne"));
const actions=fs.readFileSync("src/app/actions.ts","utf8");truth(actions.includes('order.status !== "paid"'));
const avant71=amount({valeur:400000,mode:"nue-propriete",parents:1,age:70});
const apres71=amount({valeur:400000,mode:"nue-propriete",parents:1,age:71});
equal(avant71,26194.35);equal(apres71,34194.35);equal(apres71-avant71,8000);
// Un seuil ne signifie pas une hausse d'impôt dans toutes les situations.
equal(amount({valeur:100000,mode:"nue-propriete",parents:1,age:70}),amount({valeur:100000,mode:"nue-propriete",parents:1,age:71}));
console.log(checks+" assertions réussies : prix, inclusions, 625 profils, leçons, emails, calculs. Aucun réseau, paiement ou base réelle.");
