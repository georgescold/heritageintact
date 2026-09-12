// Recette navigateur du Pixel Meta : présent sur les pages publiques, absent partout où l'adresse est une clé.
// Base fictive, réseau externe bloqué : le script fbevents.js ne se charge pas, les appels restent dans fbq.queue.
// Prérequis : une compilation à jour (node --require ./scripts/delivery-test-preload.cjs node_modules/next/dist/bin/next build).
import {spawn} from "node:child_process";import fs from "node:fs";import path from "node:path";import assert from "node:assert/strict";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),{chromium}=require("C:/Users/loysc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const dir=fs.mkdtempSync(path.resolve(".build-refonte/pixel-"));
const server=spawn(process.execPath,["--require","./scripts/delivery-test-preload.cjs","node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3314"],{env:{...process.env,HI_TEST_DELIVERY_DIR:path.join(dir,"delivery")},stdio:["ignore","pipe","pipe"],windowsHide:true});
let browser,logs="";for(const s of [server.stdout,server.stderr])s.on("data",x=>logs+=x);
const ID="3751904564985082",site="http://127.0.0.1:3314";
try {
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error(logs)),25000);server.stdout.on("data",x=>{if(String(x).includes("Ready")){clearTimeout(timeout);resolve();}});server.once("exit",()=>{clearTimeout(timeout);reject(Error(logs));});});
 browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 const context=await browser.newContext({viewport:{width:390,height:900}});
 const versMeta=[];
 await context.route("**/*",r=>{const u=new URL(r.request().url());if(/facebook\.(net|com)$/.test(u.hostname))versMeta.push(r.request().frame().url());return u.hostname==="127.0.0.1"?r.continue():r.abort();});
 const page=await context.newPage();
 // Certaines pages redirigent côté navigateur après leur chargement : on attend qu'elles se posent.
 const appels=async()=>{for(let i=0;i<8;i++){await page.waitForLoadState("networkidle").catch(()=>{});try{return await page.evaluate(()=>window.fbq?window.fbq.queue.map(a=>Array.from(a).slice(0,3).map(String)):null);}catch(e){if(!/context was destroyed|navigation/i.test(e.message))throw e;await page.waitForTimeout(400);}}throw Error("page instable : "+page.url());};

 // 1. Pages publiques : pixel chargé, autoConfig coupé, suivi automatique coupé, un PageView.
 for(const chemin of ["/","/methode","/commande","/lp-questions","/mentions-legales"]) {
  versMeta.length=0;
  await page.goto(site+chemin);await page.waitForLoadState("load");
  const a=await appels();
  assert.ok(a,"pixel absent sur "+chemin);
  assert.deepEqual(a.slice(0,3),[["set","autoConfig","false"],["init",ID],["track","PageView"]],"appels du pixel sur "+chemin);
  const attendu={"/methode":"ViewContent","/commande":"InitiateCheckout"}[chemin];
  if(attendu)assert.ok(a.some(x=>x[0]==="track"&&x[1]===attendu),attendu+" attendu sur "+chemin);
  else assert.ok(!a.some(x=>x[0]==="track"&&x[1]!=="PageView"),"événement inattendu sur "+chemin+" : "+JSON.stringify(a));
  assert.equal(await page.evaluate(()=>window.fbq.disablePushState),true,"suivi automatique des navigations coupé sur "+chemin);
  assert.ok(await page.locator("head script#meta-pixel").count()===1,"script dans le head sur "+chemin);
  assert.ok(versMeta.length>=1,"fbevents.js demandé sur "+chemin);
 }

 // 1 bis. Le retour d'inscription : un Lead, puis le marqueur disparaît de l'adresse.
 await page.goto(site+"/methode?inscrit=1");await page.waitForLoadState("load");
 const retour=await appels();
 assert.ok(retour.some(x=>x[0]==="track"&&x[1]==="Lead"),"Lead absent au retour d'inscription");
 assert.equal(new URL(page.url()).search,"","marqueur d'inscription laissé dans l'adresse");
 console.log("  /methode?inscrit=1 : Lead envoyé, adresse nettoyée");

 // 2. Adresses privées : aucun pixel, aucune requête vers Meta. Une adresse privée qui redirige
 //    (commande inconnue, espace sans jeton) atterrit sur une page publique : c'est la page
 //    d'arrivée qui décide, et le pixel y est alors normal.
 const PRIVE=/^\/(espace|reprendre|offre|plan-complet|kit-assurance-vie|dossier-complet|situation|bienvenue|merci|resultat-plan|simulateur-seul|desinscription|commande\/confirmation)(\/|$)/;
 let restees=0;
 for(const chemin of ["/espace/aaaaaaaaaaaaaaaaaaaa","/espace/aaaaaaaaaaaaaaaaaaaa?vue=avis","/espace/bbbbbbbbbbbbbbbbbbbb?vue=dossier","/merci?o=ord_revue_front","/bienvenue?o=ord_revue_front","/plan-complet?o=ord_revue_front","/situation?o=ord_revue_front","/resultat-plan?o=ord_revue_pack","/commande/confirmation?o=ord_revue_front","/offre/upsell1?o=ord_revue_front","/desinscription?id=inscrit-test","/reprendre/jeton-test","/espace"]) {
  versMeta.length=0;
  // La page privée ne doit jamais se transmettre comme page précédente au pixel d'une page publique :
  // son en-tête est lu sur la réponse HTTP elle-même, sans suivre les redirections.
  const brut=await context.request.get(site+chemin,{maxRedirects:0});
  if(brut.status()<300||brut.status()>=400)assert.equal(brut.headers()["referrer-policy"],"no-referrer","en-tête Referrer-Policy absent sur "+chemin);
  await page.goto(site+chemin).catch(()=>{});await page.waitForLoadState("load").catch(()=>{});
  const trouves=await appels();
  const arrivee=new URL(page.url()).pathname;
  if(!PRIVE.test(arrivee)){
   const precedente=await page.evaluate(()=>document.referrer).catch(()=>"");
   assert.ok(!/[?&](o|id)=|\/espace\/|\/reprendre\//.test(precedente),"adresse privée visible comme page précédente après "+chemin+" : "+precedente);
   console.log("  "+chemin+" redirige vers "+arrivee+" (page publique, aucune adresse privée transmise)");continue;
  }
  restees++;
  console.log("  "+chemin+" : page privée affichée ("+arrivee+")");
  assert.equal(trouves,null,"pixel présent sur une page privée : "+chemin+" → "+page.url());
  assert.equal(versMeta.length,0,"requête vers Meta depuis "+chemin);
 }
 assert.ok(restees>=6,"trop peu d'adresses privées réellement affichées : "+restees);
 console.log("Recette pixel OK : PageView, ViewContent, InitiateCheckout et Lead sur les pages publiques, suivi automatique et autoConfig coupés, aucun chargement ni requête Meta sur les "+restees+" adresses privées affichées.");
} finally {await browser?.close();server.kill();}
