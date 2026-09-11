// Recette navigateur de l'onglet « Mon avis », sur la base fictive de .build-refonte : aucun réseau, aucune base réelle.
// Prérequis : une compilation à jour (node --require ./scripts/delivery-test-preload.cjs node_modules/next/dist/bin/next build).
import {spawn} from "node:child_process";import fs from "node:fs";import path from "node:path";import assert from "node:assert/strict";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),{chromium}=require("C:/Users/loysc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const dir=fs.mkdtempSync(path.resolve(".build-refonte/avis-")),avisDir=path.join(dir,"avis");
const server=spawn(process.execPath,["--require","./scripts/delivery-test-preload.cjs","--require","./scripts/avis-test-preload.cjs","node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3313"],{env:{...process.env,HI_TEST_DELIVERY_DIR:path.join(dir,"delivery"),HI_TEST_AVIS_DIR:avisDir},stdio:["ignore","pipe","pipe"],windowsHide:true});
let browser,logs="";for(const s of [server.stdout,server.stderr])s.on("data",x=>logs+=x);
const cles=page=>page.locator('fieldset input[type="radio"]:not([name="note"])').evaluateAll(els=>[...new Set(els.map(e=>e.name))]);
// Les accès fictifs datent du 9 septembre 2026 : « récent » tant que moins de 3 jours se sont écoulés.
const recent=(Date.now()-Date.parse("2026-09-09T08:00:00Z"))/86400000<3;
try {
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error(logs)),25000);server.stdout.on("data",x=>{if(String(x).includes("Ready")){clearTimeout(timeout);resolve();}});server.once("exit",()=>{clearTimeout(timeout);reject(Error(logs));});});
 browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
 const context=await browser.newContext({viewport:{width:390,height:900}});
 await context.route("**/*",r=>new URL(r.request().url()).hostname==="127.0.0.1"?r.continue():r.abort());
 const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
 const site="http://127.0.0.1:3313/espace/";

 // 1. Guide seul, assurance-vie déclarée : questions du guide, frein du plan, clause à vérifier.
 await page.goto(site+"aaaaaaaaaaaaaaaaaaaa?vue=avis");
 await page.getByRole("heading",{name:"Votre avis sur Héritage Intact",exact:true}).waitFor();
 const guide=await cles(page);
 for(const c of ["guide_lecture","guide_clarte","plan_frein","av_verifiee","recommander"])assert.ok(guide.includes(c),"attendu : "+c);
 for(const c of ["notaire_rdv","plan_estimation","av_clause","testament_rdv"])assert.ok(!guide.includes(c),"produit non possédé : "+c);
 assert.equal(guide.includes("guide_erreur"),!recent,"questions de résultat selon l'ancienneté");
 const trustpilot=page.getByRole("link",{name:"Publier mon avis sur Trustpilot ↗"});
 assert.equal(await trustpilot.getAttribute("href"),"https://fr.trustpilot.com/evaluate/heritageintact.fr");

 // 2. Dépôt : 4 étoiles, deux réponses, un message publiable.
 await page.locator('label:has(input[name="note"][value="4"])').click();
 await page.getByText("4/5 : Satisfait",{exact:true}).waitFor();
 await page.getByText("J’en ai lu une partie",{exact:true}).click();
 await page.getByText("Le prix",{exact:true}).click();
 await page.locator("#avis-message").fill("Clair et utile. Il manque un exemple avec deux enfants.");
 await page.getByText("J’accepte que ce message soit publié",{exact:false}).click();
 await page.getByRole("button",{name:"Envoyer mon avis",exact:true}).click();
 await page.getByText("Merci ! Votre avis est bien enregistré.",{exact:false}).waitFor();
 assert.ok(await trustpilot.isVisible(),"Trustpilot reste proposé après l'envoi, quelle que soit la note");

 // 3. Enregistrement : un avis par client, avec la note et les réponses choisies.
 const fichiers=fs.readdirSync(avisDir);assert.equal(fichiers.length,1);
 const enregistre=JSON.parse(fs.readFileSync(path.join(avisDir,fichiers[0]),"utf8"));
 assert.equal(enregistre.email,"front@example.invalid");assert.equal(enregistre.note,4);
 assert.equal(enregistre.reponses.guide_lecture,"J’en ai lu une partie");assert.equal(enregistre.reponses.plan_frein,"Le prix");
 assert.equal(enregistre.publication,true);assert.ok(enregistre.produits.includes("front"));

 // 4. Retour sur l'onglet : l'avis est repris et modifiable.
 await page.goto(site+"aaaaaaaaaaaaaaaaaaaa?vue=avis");
 await page.getByText("Vous nous avez donné votre avis le",{exact:false}).waitFor();
 assert.ok(await page.locator('input[name="guide_lecture"][value="J’en ai lu une partie"]').isChecked(),"réponse reprise");
 assert.equal(await page.getByRole("button",{name:"Mettre à jour mon avis",exact:true}).count(),1);
 await page.screenshot({path:path.join(dir,"avis-mobile.png"),fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),"pas de débordement mobile");

 // 5. Le parcours invite à donner son avis, puis à le modifier.
 await page.goto(site+"aaaaaaaaaaaaaaaaaaaa");
 await page.getByRole("heading",{name:"Merci pour votre avis",exact:true}).waitFor();

 // 6. Client du pack : les questions de ses produits, pas celles des produits qu'il n'a pas pris.
 await page.goto(site+"bbbbbbbbbbbbbbbbbbbb?vue=avis");
 await page.getByRole("heading",{name:"Votre avis sur Héritage Intact",exact:true}).waitFor();
 const pack=await cles(page);
 for(const c of ["guide_lecture","notaire_rdv","plan_estimation","av_clause","recommander"])assert.ok(pack.includes(c),"attendu : "+c);
 for(const c of ["plan_frein","av_verifiee"])assert.ok(!pack.includes(c),"inutile pour un acheteur : "+c);
 await page.screenshot({path:path.join(dir,"avis-pack-mobile.png"),fullPage:true});
 await page.goto(site+"bbbbbbbbbbbbbbbbbbbb");
 await page.getByRole("heading",{name:"Votre avis nous aide",exact:true}).waitFor();

 // 7. Accès clôturé : aucun formulaire.
 await page.goto(site+"cccccccccccccccccccc?vue=avis");
 assert.equal(await page.getByRole("heading",{name:"Votre avis sur Héritage Intact",exact:true}).count(),0);

 assert.deepEqual(errors,[]);
 console.log("Recette avis OK : questions selon les achats"+(recent?" et l'ancienneté (premières impressions)":"")+", dépôt, reprise, Trustpilot proposé à tous, accès clôturé, mobile sans débordement. Captures : "+dir);
} finally {await browser?.close();server.kill();}
