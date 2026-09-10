import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const require=createRequire(import.meta.url),{chromium}=require("C:/Users/loysc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const server=spawn(process.execPath,["--require","./.build-refonte/recette-preload.cjs","node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3311"],{stdio:["ignore","pipe","pipe"],windowsHide:true});
const fixture=".build-refonte/db-test.json", initial=fs.readFileSync(fixture,"utf8");
if(JSON.parse(initial).orders.some(o=>!o.email.endsWith("@example.invalid")))throw Error("Fixture non fictive");
let browser,n=0;const ok=x=>{assert.ok(x);n++};
try {
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error("Démarrage serveur")),20000);server.stdout.on("data",b=>{if(b.toString().includes("Ready")){clearTimeout(timer);resolve();}});server.once("exit",()=>{clearTimeout(timer);reject(Error("Serveur arrêté"));});});
  browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
  const page=await browser.newPage();
  await page.route("**/*",r=>["127.0.0.1","localhost"].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
  await page.route("**/api/confidentialite/preferences",r=>r.fulfill({status:200,contentType:"application/json",body:JSON.stringify({choix:"non"})}));
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const go=async p=>{const r=await page.goto("http://127.0.0.1:3311"+p,{waitUntil:"networkidle"});ok(r.status()===200);};
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const p of ["/methode","/apercu","/espace/aaaaaaaaaaaaaaaaaaaa/demarrer","/espace/bbbbbbbbbbbbbbbbbbbb/demarrer","/plan-complet?o=ord_revue_front"]) {
      await go(p);
      ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
  }
  await go("/methode");
  ok(await page.getByRole("heading",{name:"« Mon réflexe, c’est de prendre rendez-vous chez le notaire. »"}).isVisible());
  ok(await page.evaluate(()=>document.querySelector("#preuve-preparation").getBoundingClientRect().top>document.querySelector("#premier-cta").getBoundingClientRect().top));
  await go("/apercu");
  ok(await page.getByText("Deux éléments illustratifs seulement.",{exact:false}).isVisible());
  ok(!(await page.content()).includes("Bonjour, nous souhaitons préparer notre transmission"));
  ok(await page.getByText("Lire l’explication",{exact:true}).count()===0);
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    await go("/");
    ok(await page.locator("#inscription input[name=email]").isVisible());
    ok(await page.locator('select[name="objectif"]').count()===0);
    ok(await page.locator('#inscription input[name="marketingConsent"]').count()===0);
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:".build-refonte/v6-lp-"+width+".png",fullPage:true});
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
    await page.screenshot({path:".build-refonte/v6-vente-haut-"+width+".png"});
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
    ["Que mes enfants doivent vendre la maison pour payer les droits","Non","/plan-complet"],
    ["Ne pas savoir quelle part l’État pourrait prendre","Oui","/dossier-complet"],
    ["Que mon assurance-vie ne protège pas la bonne personne","Oui","/kit-assurance-vie"],
    ["Que mes proches ne retrouvent pas les documents et les réponses","Oui","/dossier-complet"]
  ]) {
    await go("/situation?o=ord_revue_front");
    ok(await page.getByText("Question 1 sur 4",{exact:true}).count()===0);
    await page.getByRole("button",{name:objectif,exact:true}).click();
    await page.getByRole("button",{name:"Marié(e)",exact:true}).click();
    await page.getByRole("button",{name:"Deux enfants ou plus",exact:true}).click();
    await page.getByRole("button",{name:"De 65 à 69 ans",exact:true}).click();
    await page.getByRole("button",{name:av,exact:true}).click();
    await page.getByRole("button",{name:"Je ne sais pas quoi faire en premier",exact:true}).click();
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
  await page.getByRole("button",{name:"Accéder directement à mon achat",exact:true}).click();
  await page.waitForURL("**/bienvenue?*");
  ok(await page.locator("#suite-adaptee").count()===0);
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
    ok(await page.getByRole("heading",{name:"Vérifiez que vous avez compris"}).isVisible());
    await page.getByText("Lire l’explication",{exact:true}).click();
    ok(await page.locator("details[open]").count()===1);
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
  await page.getByRole("heading",{name:"Votre première fiche utilisable"}).scrollIntoViewIfNeeded();
  await page.screenshot({path:".build-refonte/v4-exercice-mobile.png"});
  await page.setViewportSize({width:1440,height:1000});await go("/methode");
  await page.getByRole("heading",{name:"« Mon réflexe, c’est de prendre rendez-vous chez le notaire. »"}).scrollIntoViewIfNeeded();
  await page.screenshot({path:".build-refonte/v4-preuve-desktop.png"});
  await page.setViewportSize({width:390,height:1000});await go("/espace/bbbbbbbbbbbbbbbbbbbb/demarrer");
  await page.screenshot({path:".build-refonte/v4-guides-mobile.png"});
  ok(errors.length===0);
  console.log(n+" contrôles navigateur V6 réussis : mobile/desktop, aperçu limité, LP commune, qualification réelle, remise avant offre, paiement unique, exercices et droits préservés. Aucun service externe.");
} finally {await browser?.close();server.kill();await new Promise(resolve=>server.exitCode!==null?resolve():server.once("exit",resolve));fs.writeFileSync(fixture,initial);}
