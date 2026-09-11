import {spawn} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),{chromium}=require("C:/Users/loysc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const dir=fs.mkdtempSync(path.resolve(".build-refonte/delivery-"));
const server=spawn(process.execPath,["--require","./scripts/delivery-test-preload.cjs","node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3312"],{env:{...process.env,HI_TEST_DELIVERY_DIR:dir},stdio:["ignore","pipe","pipe"],windowsHide:true});
let browser,logs="";for(const s of [server.stdout,server.stderr])s.on("data",x=>logs+=x);
try {
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error(logs)),25000);server.stdout.on("data",x=>{if(String(x).includes("Ready")){clearTimeout(timeout);resolve();}});server.once("exit",()=>{clearTimeout(timeout);reject(Error(logs));});});
 browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 const context=await browser.newContext({viewport:{width:390,height:900}});
 await context.route("**/*",r=>new URL(r.request().url()).hostname==="127.0.0.1"?r.continue():r.abort());
 const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
 const base="http://127.0.0.1:3312/espace/bbbbbbbbbbbbbbbbbbbb";
 await page.goto(base+"/simulateur");
 await page.getByRole("heading",{name:"Quel âge avez-vous aujourd’hui ?",exact:true}).waitFor();
 for(let i=0;i<45;i++) {
  if(await page.getByText("Votre plan personnalisé est prêt.",{exact:true}).count())break;
  const before=await page.locator("h2").first().innerText();
  console.log("Question : "+before);
  const input=page.locator('input[type="number"]');
  if(await input.count()) {
   const key=(await input.getAttribute("id")).replace("question-","");
   if(key==="donationAnnee")await page.getByRole("button",{name:"Je n’ai effectué aucune donation",exact:true}).click();
   else if(key==="epargne")await page.getByRole("button",{name:"Je ne sais pas : à retrouver",exact:true}).click();
   else if(["age","enfants"].includes(key)) {await input.fill(key==="age"?"65":"2");await page.getByRole("button",{name:"Continuer",exact:true}).click();}
   else await page.getByRole("button",{name:"Aucun / zéro",exact:true}).click();
  } else {
   const heading=await page.locator("h2").first().innerText();
   const option=heading.includes("couple")?"Seul(e)":heading.includes("responsabilité")?"Non ou personne non identifiée":heading.includes("urgente")?"Je prépare l’avenir":heading.includes("compte le plus")?"Savoir par quoi commencer":"Non";
   await page.getByRole("button",{name:option,exact:true}).click();
  }
  await page.waitForFunction(before=>document.querySelector("h2")?.textContent!==before||document.querySelector('p[role="alert"]'),before);
  if(await page.locator('p[role="alert"]').count())throw Error(await page.locator('p[role="alert"]').innerText()+"\n"+logs);
 }
 await page.getByText("Votre plan personnalisé est prêt.",{exact:true}).waitFor();
 assert.equal(await page.getByRole("heading",{name:/Votre estimation indicative/}).count(),0);
 await page.screenshot({path:path.join(dir,"plan-mobile.png"),fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const second=await browser.newContext();
 await second.route("**/*",r=>new URL(r.request().url()).hostname==="127.0.0.1"?r.continue():r.abort());
 const other=await second.newPage();await other.goto(base+"/simulateur");
 await other.getByText("Votre plan personnalisé est prêt.",{exact:true}).waitFor();
 assert.equal(await other.getByRole("link",{name:"Reprendre ou modifier mes réponses",exact:true}).count(),0);
 assert.equal(await other.getByRole("button",{name:"Relire ou modifier mes réponses",exact:true}).count(),1);
 const downloadPromise=other.waitForEvent("download");
 await other.getByRole("button",{name:"Télécharger mon plan personnalisé PDF",exact:true}).click();
 const download=await downloadPromise;assert.equal(await download.failure(),null);
 // Reprendre une réponse ne rend pas indisponible le dernier PDF finalisé.
 await other.getByRole("button",{name:"Relire ou modifier mes réponses",exact:true}).click();
 await other.locator('input[type="number"]').fill("66");
 await other.getByRole("button",{name:"Continuer",exact:true}).click();
 await other.getByRole("heading",{name:/couple/}).waitFor();
 const pdf=await second.request.get(base+"/pdf/plan-personnalise");assert.equal(pdf.status(),200);assert.equal((await pdf.body()).subarray(0,5).toString(),"%PDF-");
 assert.equal((await second.request.get("http://127.0.0.1:3312/espace/aaaaaaaaaaaaaaaaaaaa/pdf/plan-personnalise")).status(),403);
 await page.goto(base+"/document/inventaire");await page.getByRole("button",{name:"Enregistrer ma fiche",exact:true}).waitFor();
 const field=page.locator('[contenteditable="plaintext-only"]').first();await field.fill("Test de reprise sur un autre appareil");
 await page.getByRole("button",{name:"Enregistrer ma fiche",exact:true}).click();await page.getByText("Fiche enregistrée.",{exact:false}).waitFor();
 await other.goto(base+"/document/inventaire");await other.locator('[contenteditable="plaintext-only"]').first().waitFor();
 assert.equal(await other.locator('[contenteditable="plaintext-only"]').first().innerText(),"Test de reprise sur un autre appareil");
 await page.screenshot({path:path.join(dir,"fiche-mobile.png"),fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.deepEqual(errors,[]);
 console.log("Recette navigateur OK : questionnaire, inconnu conservé, reprise sans localStorage, PDF payé seulement, fiche sauvegardée/reprise, mobile sans débordement. Captures : "+dir);
} finally {await browser?.close();server.kill();}
