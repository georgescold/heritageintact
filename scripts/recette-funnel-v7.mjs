import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const require=createRequire(import.meta.url),{chromium}=require("C:/Users/loysc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const server=spawn(process.execPath,["--require","./.build-refonte/recette-preload.cjs","node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3311"],{stdio:["ignore","pipe","pipe"],windowsHide:true});
const fixture=".build-refonte/db-test.json", initial=fs.readFileSync(fixture,"utf8");
if(JSON.parse(initial).orders.some(o=>!o.email.endsWith("@example.invalid")))throw Error("Fixture non fictive");
let browser,n=0;const ok=x=>{assert.ok(x);n++};
let logs="";
for(const stream of [server.stdout,server.stderr]) stream.on("data",b=>{logs=(logs+b.toString()).slice(-18000);});
try {
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error("Démarrage serveur")),20000);server.stdout.on("data",b=>{if(b.toString().includes("Ready")){clearTimeout(timer);resolve();}});server.once("exit",()=>{clearTimeout(timer);reject(Error("Serveur arrêté"));});});
  browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
  const page=await browser.newPage();
  await page.route("**/*",r=>["127.0.0.1","localhost"].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  await page.route("**/api/confidentialite/preferences",r=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify({choix:"non"})}));
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const go=async p=>{console.log("Contrôle "+p);const r=await page.goto("http://127.0.0.1:3311"+p,{waitUntil:"domcontentloaded"});ok(r.status()===200);await page.locator("main").waitFor();};
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const p of ["/methode","/apercu","/espace/aaaaaaaaaaaaaaaaaaaa/demarrer","/espace/bbbbbbbbbbbbbbbbbbbb/demarrer","/plan-complet?o=ord_revue_front"]) {
      await go(p);
      ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
  }
  await go("/methode");
  ok(await page.getByText("Il faut de toute façon aller chez le notaire, alors autant y aller directement.",{exact:false}).isVisible());
  ok(await page.evaluate(()=>document.querySelector("#exemple-chiffre").getBoundingClientRect().top>document.querySelector("#premier-cta").getBoundingClientRect().top));
  await go("/apercu");
  ok(await page.getByText("Deux éléments illustratifs seulement.",{exact:false}).isVisible());
  ok(!(await page.content()).includes("Bonjour, nous souhaitons préparer notre transmission"));
  ok(await page.getByText("Lire l’explication",{exact:true}).count()===0);
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    await go("/");
    ok(await page.locator("#inscription input[name=email]").isVisible());
    ok(await page.locator('select[name="objectif"]').count()===0);
    ok(!(await page.locator('#inscription input[name="marketingConsent"]').isChecked()));
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:".build-refonte/v8-lp-"+width+".png",fullPage:true});
    await go("/methode");
    ok(await page.locator("#presentation-video").isVisible());
    ok(await page.evaluate(()=>document.querySelector("#presentation-video").getBoundingClientRect().top<document.querySelector("#premier-cta").getBoundingClientRect().top));
    ok(await page.locator("#jean-pierre img").isVisible());
    ok(await page.locator("#martine img").isVisible());
    ok(!/Loys|Coquelle/.test(await page.locator("body").innerText()));
    const headline=await page.locator("h1").innerText();
    await page.context().addCookies([{name:"hi_objectif",value:"assurance-vie",url:"http://127.0.0.1:3311"}]);
    await page.reload({waitUntil:"networkidle"});
    ok(await page.locator("h1").innerText()===headline);
    await page.screenshot({path:".build-refonte/v6-vente-"+width+".png",fullPage:true});
    await page.screenshot({path:".build-refonte/v11-vente-haut-"+width+".png"});
    for(const [id,nom] of [["#avant-apres","avant-apres"],["#jean-pierre","jean-pierre"],["#martine","martine"],["#la-methode","methode"]]){const bloc=page.locator(id);for(const img of await bloc.locator("img").all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());ok(await img.evaluate(el=>el.naturalWidth>0));}await bloc.screenshot({path:".build-refonte/v11-"+nom+"-"+width+".jpg",quality:72,style:".fixed { visibility: hidden !important; }"});}
    ok(await page.getByRole("heading",{name:"Le jour où ils chercheront les réponses, pourrez-vous encore les leur donner ?",exact:true}).count()===1);
    ok(await page.getByText("Un exemple chiffré, pas une promesse d’économie",{exact:true}).count()===1);
    ok(await page.locator("#avant-apres img").count()===2);
    await page.locator("#jean-pierre").scrollIntoViewIfNeeded();
    await page.screenshot({path:".build-refonte/v6-recit-"+width+".png"});
    await go("/apercu");
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:".build-refonte/v6-apercu-"+width+".png",fullPage:true});
  }
  // Sortie au clavier, une fois par session, sans gêner le formulaire.
  await go("/");
  await page.evaluate(()=>document.dispatchEvent(new MouseEvent("mouseout",{clientY:0,bubbles:true})));
  await page.locator("dialog[open]").waitFor();
  await page.keyboard.press("Escape");
  ok(await page.locator("dialog[open]").count()===0);
  await page.evaluate(()=>document.dispatchEvent(new MouseEvent("mouseout",{clientY:0,bubbles:true})));
  ok(await page.locator("dialog[open]").count()===0);
  // Qualification effectuée réellement sur la fixture, sans payer ni envoyer d’email.
  for(const [objectif,av,path] of [
    ["Préparer mon rendez-vous","Non","/plan-complet"],
    ["Préparer mon rendez-vous","Oui","/dossier-complet"],
    ["Faire le point sur mon assurance-vie","Oui","/kit-assurance-vie"],
    ["Repérer les erreurs qui peuvent concerner ma famille","Oui","/dossier-complet"]
  ]) {
    await go("/situation?o=ord_revue_front");
    ok(await page.getByText("Question 1 sur 4",{exact:true}).isVisible());
    await page.getByRole("button",{name:objectif,exact:true}).click();
    await page.getByRole("button",{name:"Marié(e)",exact:true}).click();
    await page.getByRole("button",{name:"Deux enfants ou plus",exact:true}).click();
    await page.getByRole("button",{name:av,exact:true}).click();
    await page.waitForURL("**/bienvenue?*");
    await page.waitForLoadState("networkidle");
    ok(await page.locator("#livraison-produit").isVisible());
    ok(await page.getByRole("link",{name:"Ouvrir ma Méthode",exact:true}).isVisible());
    ok(await page.locator('input[name="montantAffiche"]').count()===0);
    ok(!new URL(page.url()).searchParams.has("objectif"));
    if(path) {
      ok(await page.evaluate(()=>document.querySelector("#livraison-produit").getBoundingClientRect().top<document.querySelector("#suite-adaptee").getBoundingClientRect().top));
      await page.getByRole("link",{name:"Découvrir maintenant ma préparation complémentaire",exact:true}).click();
      await page.waitForURL(u=>u.pathname===path);
      await page.waitForLoadState("networkidle");
      ok(await page.locator("#decision-complement form").count()===1);
      if(path==="/dossier-complet") {
        for(const w of [390,1440]) {
          await page.setViewportSize({width:w,height:1000});
          await page.locator("#decision-complement").scrollIntoViewIfNeeded();
          ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
          await page.screenshot({path:".build-refonte/v6-decision-"+w+".png"});
        }
      }
      ok(await page.locator('input[name="montantAffiche"]').count()===1);
      ok(await page.getByRole("link",{name:"Non merci, conserver mon achat actuel",exact:true}).isVisible());
      ok(await page.evaluate(()=>document.querySelector("#decision-complement").getBoundingClientRect().top<document.querySelector("figure").getBoundingClientRect().top));
    } else ok(await page.locator("#suite-adaptee").count()===0);
  }
  await go("/situation?o=ord_revue_front");
  ok(await page.getByRole("button",{name:"Accéder directement à mon achat",exact:true}).count()===0);
  ok(await page.getByText("Question 1 sur 4",{exact:true}).isVisible());
  await go("/espace/aaaaaaaaaaaaaaaaaaaa/document/exemple-dossier");
  ok(new URL(page.url()).pathname==="/espace/aaaaaaaaaaaaaaaaaaaa");
  ok(!(await page.content()).includes("Bonjour, nous souhaitons préparer notre transmission"));
  await go("/espace/invalide/document/exemple-dossier");
  ok(!(await page.content()).includes("Bonjour, nous souhaitons préparer notre transmission"));
  const current=JSON.parse(fs.readFileSync(fixture,"utf8"));
  ok(JSON.stringify(current.orders)===JSON.stringify(JSON.parse(initial).orders));
  await go("/bienvenue?o=commande_inexistante");
  ok(new URL(page.url()).pathname==="/commande");

  for(let i=0;i<8;i++) {
    await go("/espace/aaaaaaaaaaaaaaaaaaaa/etape/"+i);
    ok(await page.getByRole("heading",{name:"Ce que vous allez comprendre",exact:true}).isVisible());
    ok(await page.getByRole("heading",{name:"Vérifiez que vous avez compris"}).count()===0);
    ok(await page.locator("[data-suite]").count()<=1);
  }
  await go("/espace/aaaaaaaaaaaaaaaaaaaa/demarrer");
  ok(await page.locator('section[id^="guide-"]').count()===1);
  ok(await page.locator("#guide-upsell1").count()===0);
  await go("/espace/bbbbbbbbbbbbbbbbbbbb/demarrer");
  ok(await page.locator('section[id^="guide-"]').count()===4);
  const docs=await page.locator('a[href*="/document/"]').evaluateAll(as=>as.map(a=>a.getAttribute("href")));
  for(const p of new Set(docs)){await go(p);ok(new URL(page.url()).pathname===p);}
  await go("/espace/cccccccccccccccccccc/demarrer");
  ok(await page.locator('section[id^="guide-"]').count()===0);
  await go("/espace/invalide/demarrer");ok(await page.locator('section[id^="guide-"]').count()===0);
  await page.setViewportSize({width:390,height:1000});await go("/espace/aaaaaaaaaaaaaaaaaaaa/etape/0");
  await page.getByRole("heading",{name:"Ce que vous allez comprendre",exact:true}).scrollIntoViewIfNeeded();
  await page.screenshot({path:".build-refonte/v9-chapitre-mobile.png"});
  await page.setViewportSize({width:1440,height:1000});await go("/methode");
  await page.getByText("Il faut de toute façon aller chez le notaire, alors autant y aller directement.",{exact:false}).scrollIntoViewIfNeeded();
  await page.screenshot({path:".build-refonte/v4-preuve-desktop.png"});
  await page.setViewportSize({width:390,height:1000});await go("/espace/bbbbbbbbbbbbbbbbbbbb/demarrer");
  await page.screenshot({path:".build-refonte/v9-guides-mobile.png"});

  // V7 : tous les PDF sont livrés uniquement avec les bonnes possessions.
  for(const [jeton,slug,expected] of [
    ["aaaaaaaaaaaaaaaaaaaa","les-7-erreurs",200],
    ["aaaaaaaaaaaaaaaaaaaa","dossier-notaire",403],
    ["bbbbbbbbbbbbbbbbbbbb","preparation-familiale",200],
    ["bbbbbbbbbbbbbbbbbbbb","assurance-vie",200],
    ["cccccccccccccccccccc","les-7-erreurs",403]
  ]){
    const r=await page.request.get("http://127.0.0.1:3311/espace/"+jeton+"/pdf/"+slug);
    ok(r.status()===expected);
    ok((r.headers()["cache-control"]||"").includes("no-store"));
    if(expected===200){ok((await r.body()).subarray(0,5).toString()==="%PDF-");ok(r.headers()["content-type"]==="application/pdf");}
  }
  // Popup de chaque offre : revenir à la décision, jamais facturer.
  for(const p of ["/methode","/dossier-complet?o=ord_revue_front"]){
    await page.evaluate(()=>sessionStorage.clear());
    await go(p);
    await page.evaluate(()=>document.dispatchEvent(new MouseEvent("mouseout",{clientY:0,bubbles:true})));
    await page.locator("dialog[open]").waitFor();
    ok(await page.getByRole("heading",{name:"Ce que vous risquez si vous fermez cette page",exact:true}).isVisible());
    if(p==="/methode"){ok(await page.locator("dialog[open] li").count()===4);await page.locator("dialog[open]").screenshot({path:".build-refonte/v11-popup-vente.png"});}
    await page.keyboard.press("Escape");
    ok(await page.locator("dialog[open]").count()===0);
  }
  // Passage réel d'un palier dans le navigateur, avec remise enregistrée dans la fixture.
  const d=JSON.parse(fs.readFileSync(fixture,"utf8"));
  d.promotions=[...(d.promotions||[]).filter(p=>p.gamme!=="front"),{id:"promo_navfront",email:"front@example.invalid",gamme:"front",commenceLe:new Date(Date.now()-20*60000+7000).toISOString()}];
  fs.writeFileSync(fixture,JSON.stringify(d));
  await page.context().addCookies([{name:"hi_offre",value:"promo_navfront",url:"http://127.0.0.1:3311"}]);
  await go("/methode");
  ok((await page.locator("#premier-cta").innerText()).includes("21,60"));
  await page.waitForFunction(()=>document.querySelector("#premier-cta")?.textContent?.includes("24,30"),{},{timeout:15000});
  ok((await page.locator("#premier-cta").innerText()).includes("24,30"));
  await page.reload({waitUntil:"networkidle"});
  ok((await page.locator("#premier-cta").innerText()).includes("24,30"));
  // Nouveau client fictif, paiement simulé, questionnaire obligatoire puis offre.
  await page.context().clearCookies();
  await go("/commande");
  await page.getByLabel("Prénom",{exact:true}).fill("Client fictif");
  await page.getByLabel("Adresse email",{exact:false}).fill("parcours-v7@example.invalid");
  await page.getByRole("checkbox").last().check();
  await page.getByRole("button",{name:/Valider ma commande/}).click();
  await page.waitForURL("**/situation?*");
  const orderId=new URL(page.url()).searchParams.get("o");
  await go("/bienvenue?o="+orderId);
  ok(new URL(page.url()).pathname==="/situation");
  await page.getByRole("button",{name:"Préparer mon rendez-vous",exact:true}).click();
  await page.getByRole("button",{name:"Ma situation reste à préciser",exact:true}).click();
  await page.getByRole("button",{name:"Ma situation familiale reste à préciser",exact:true}).click();
  await page.getByRole("button",{name:"Je ne sais pas",exact:true}).click();
  await page.waitForURL("**/bienvenue?*");
  await page.getByRole("link",{name:"Découvrir maintenant ma préparation complémentaire",exact:true}).click();
  await page.waitForURL(u=>u.pathname==="/plan-complet");
  ok(await page.locator('input[name="montantAffiche"]').inputValue()==="127.5");
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:1000});
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.locator("#decision-complement").scrollIntoViewIfNeeded();
    await page.screenshot({path:".build-refonte/v8-offre-"+width+".png"});
  }
  await page.getByRole("button",{name:"Oui, préparer la suite maintenant · 127,50 €",exact:true}).click();
  await page.waitForURL("**/merci?*");
  const final=JSON.parse(fs.readFileSync(fixture,"utf8"));
  const order=final.orders.find(o=>o.id===orderId);
  ok(order.items.some(i=>i.sku==="upsell1"&&i.price===127.5));
  ok(final.orders.every(o=>o.email.endsWith("@example.invalid")));

  ok(errors.length===0);
  console.log(n+" contrôles navigateur V7 réussis : mobile/desktop, aperçu limité, LP commune, qualification réelle, remise avant offre, paiement unique, guides narratifs sans quiz et droits préservés. Aucun service externe.");
} catch(error) {console.error(logs);throw error;} finally {await browser?.close();server.kill();await new Promise(resolve=>server.exitCode!==null?resolve():server.once("exit",resolve));fs.writeFileSync(fixture,initial);}
