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
  // Le questionnaire s'enrichit (régime, quote-part, recomposition…) : on répond à ce qui est
  // affiché plutôt qu'à une suite figée, qui casse dès qu'une question est ajoutée.
  const remplirPlan=async({assuranceVie=false}={})=>{
    // La simulation conserve les réponses : elle peut reprendre en cours de route, ou être déjà
    // terminée. On n'exige donc pas la première question — on attend soit une question, soit l'écran
    // de décision, puis on répond à ce qui s'affiche.
    await Promise.race([
      page.getByText(/QUESTION \d+ SUR \d+/).first().waitFor({timeout:20000}),
      page.locator("#decision-complement").waitFor({timeout:20000}),
    ]);
    n++;
    const montants={age:"68",enfants:"2",residenceTotale:"480000",epargne:"40000",avAvant:assuranceVie?"100000":"0",beneficiaires:assuranceVie?"2":"0"};
    const ignorer=["← Question précédente","Je ne sais pas","Je ne sais pas : à retrouver","Je préfère ne pas répondre","Reprendre mes anciennes réponses","Commencer de zéro","Réessayer"];
    for(let i=0;i<80;i++) {
      if(await page.locator("#decision-complement").count())break;
      // Le pop-up de sortie s'ouvre dès que la souris quitte la fenêtre : on le referme par programme
      // avant chaque réponse, sans dépendre du focus clavier.
      const fermerPopup=()=>page.evaluate(()=>document.querySelectorAll("dialog[open]").forEach(d=>d.close()));
      await fermerPopup();
      const titre=await page.locator("h2").first().innerText();
      await fermerPopup();
      const champ=page.locator('input[type="number"]');
      if(await champ.count()) {
        const cle=((await champ.getAttribute("id"))??"").replace("question-","");
        const valeur=montants[cle];
        if(cle==="donationAnnee")await page.getByRole("button",{name:"Je n’ai effectué aucune donation",exact:true}).click();
        else if(valeur&&valeur!=="0"){await champ.fill(valeur);await page.getByRole("button",{name:/^(Continuer|Préparer mon aperçu personnalisé)$/}).first().click();}
        else await page.getByRole("button",{name:"Aucun / zéro",exact:true}).click();
      } else {
        const boutons=page.locator("main button");
        let clique=false;
        for(let b=0;b<await boutons.count();b++) {
          const libelle=(await boutons.nth(b).innerText()).trim();
          if(!libelle||ignorer.includes(libelle))continue;
          await boutons.nth(b).click();clique=true;break;
        }
        if(!clique)throw Error("Aucune réponse possible sur : "+titre);
      }
      await page.waitForFunction(t=>document.querySelector("h2")?.textContent!==t||document.querySelector("#decision-complement"),titre,{timeout:15000});
    }
    await page.locator("#decision-complement").waitFor();
  };
  for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const p of ["/methode","/apercu","/espace/aaaaaaaaaaaaaaaaaaaa/demarrer","/espace/bbbbbbbbbbbbbbbbbbbb/demarrer","/plan-complet?o=ord_revue_front"]) {
      await go(p);
      ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
  }
  await go("/methode");
  ok(await page.getByText("Il faut de toute façon aller chez le notaire, alors autant y aller directement.",{exact:false}).isVisible());
  ok(await page.getByText("9 600 € de droits en plus dans cet exemple. Pour le même bien.",{exact:true}).count()===0);
  ok(await page.getByRole("heading",{name:"Ce que disent les chiffres publics",exact:true}).count()===0);
  ok(await page.evaluate(()=>document.querySelector("#la-methode").getBoundingClientRect().top>document.querySelector("#premier-cta").getBoundingClientRect().top));
  ok(await page.locator("#la-methode table").count()===0);
  ok(!(await page.locator("body").innerText()).match(/\bméthodes?\b/i));
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
    ok(await page.getByRole("heading",{name:"Le jour où vos enfants chercheront les réponses, pourrez-vous encore les leur donner ?",exact:true}).count()===1);
    ok(await page.getByText("Un exemple chiffré, pas une promesse d’économie",{exact:true}).count()===0);
    ok(await page.locator("#avant-apres img").count()===2);
    await page.locator("#jean-pierre").scrollIntoViewIfNeeded();
    await page.screenshot({path:".build-refonte/v6-recit-"+width+".png"});
    await go("/apercu");
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:".build-refonte/v6-apercu-"+width+".png",fullPage:true});
  }
  // Sortie au clavier, une fois par session, sans gêner le formulaire.
  await go("/");
  // Le pop-up ne s'affiche qu'une fois par session, et les pages visitées plus haut ont pu le consommer.
  // On repart d'une session neuve pour contrôler ici son ouverture, sa fermeture et son unicité.
  await page.evaluate(()=>{try{Object.keys(sessionStorage).filter(k=>k.startsWith("hi_exit_")).forEach(k=>sessionStorage.removeItem(k));}catch{}});
  await page.evaluate(()=>document.dispatchEvent(new MouseEvent("mouseout",{clientY:0,bubbles:true})));
  await page.locator("dialog[open]").waitFor();
  ok(await page.locator("dialog[open] li").count()===4);
  ok(await page.getByText("Vous ne saurez toujours pas ce qu’il faut faire vérifier sur votre maison, votre épargne et les documents que vous avez signés.",{exact:true}).isVisible());
  ok(await page.getByRole("link",{name:"Accéder au guide",exact:true}).isVisible());
  await page.keyboard.press("Escape");
  ok(await page.locator("dialog[open]").count()===0);
  await page.evaluate(()=>document.dispatchEvent(new MouseEvent("mouseout",{clientY:0,bubbles:true})));
  ok(await page.locator("dialog[open]").count()===0);
  // Qualification effectuée réellement sur la fixture, sans payer ni envoyer d’email.
  for(const [objectif,av,path] of [
    ["Que mes enfants doivent vendre la maison pour payer les droits","Non","/plan-complet"],
    ["Ne pas savoir quelle part l’État pourrait prendre","Oui","/plan-complet"],
    ["Que mon assurance-vie ne protège pas la bonne personne","Oui","/plan-complet"],
    ["Que mes proches ne retrouvent pas les documents et les réponses","Oui","/plan-complet"]
  ]) {
    await go("/situation?o=ord_revue_front");
    ok(await page.getByRole("heading",{name:"Qu’est-ce qui vous inquiète le plus aujourd’hui ?",exact:true}).isVisible());
    await page.getByRole("button",{name:objectif,exact:true}).click();
    await page.getByRole("button",{name:"Marié(e)",exact:true}).click();
    await page.getByRole("button",{name:"Deux enfants ou plus",exact:true}).click();
    await page.getByRole("button",{name:"De 65 à 69 ans",exact:true}).click();
    await page.getByRole("button",{name:av,exact:true}).click();
    await page.getByRole("button",{name:"Je ne sais pas quoi faire en premier",exact:true}).click();
    await page.waitForURL(u=>u.pathname===path);
    await page.waitForLoadState("networkidle");
    await remplirPlan({assuranceVie:av==="Oui"});
    ok(await page.locator("#decision-complement").isVisible());
    const titreOffre=await page.locator("h1").first().innerText().catch(()=>"(aucun h1)");
    if(!titreOffre.includes("L’État appliquera"))throw Error("Offre inattendue ("+page.url()+") : "+titreOffre+" | combinaison "+objectif+" / AV "+av);
    n++;
    ok(await page.locator("#livraison-produit").count()===0);
    ok(await page.locator('input[name="montantAffiche"]').count()===1);
    ok(!new URL(page.url()).searchParams.has("objectif"));
    ok(await page.locator("#decision-complement form").count()===1);
    if(av==="Oui") {
      for(const w of [390,1440]) {
        await page.setViewportSize({width:w,height:1000});
        await page.locator("#decision-complement").scrollIntoViewIfNeeded();
        ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        await page.screenshot({path:".build-refonte/v6-decision-"+w+".png"});
      }
    }
    ok(await page.getByRole("link",{name:"Non merci, continuer sans ce produit",exact:true}).isVisible());
    await page.getByRole("link",{name:"Non merci, continuer sans ce produit",exact:true}).click();
    // Le refus du plan termine le tunnel : l’assurance-vie est désormais proposée depuis la boutique
    // de l’espace, plus après l’offre du plan.
    // Depuis la refonte, /bienvenue ne montre plus le guide : elle renvoie le client dans son espace.
    await page.waitForURL(u=>u.pathname.includes("/espace/"),{timeout:20000});
    // Le bandeau de paiement n’est montré qu’à la première arrivée : ici le client revient d’une offre refusée.
    ok(new URL(page.url()).pathname.startsWith("/espace/"));
    ok(await page.getByRole("link",{name:"Télécharger mon guide PDF",exact:true}).isVisible());
    ok(await page.locator("#suite-adaptee").count()===0);
  }
  await go("/situation?o=ord_revue_front");
  ok(await page.getByRole("button",{name:"Accéder directement à mon achat",exact:true}).count()===0);
  ok(await page.getByText("Question 1 sur 4",{exact:true}).count()===0);
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
    // La page d'offre s'initialise plus lentement (elle recharge les réponses) : on répète le geste
    // de sortie jusqu'à ce que la page l'écoute, au lieu de l'envoyer une fois trop tôt.
    await page.waitForLoadState("networkidle");
    for(let essai=0;essai<12 && !(await page.locator("dialog[open]").count());essai++){
      await page.evaluate(()=>document.dispatchEvent(new MouseEvent("mouseout",{clientY:0,bubbles:true})));
      await page.waitForTimeout(400);
    }
    await page.locator("dialog[open]").waitFor();
    ok(await page.getByRole("heading",{name:"Ce que vous risquez si vous fermez cette page",exact:true}).isVisible());
    if(p==="/methode"){ok(await page.locator("dialog[open] li").count()===4);await page.locator("dialog[open]").screenshot({path:".build-refonte/v11-popup-vente.png"});}
    await page.keyboard.press("Escape");
    ok(await page.locator("dialog[open]").count()===0);
  }
  // Nouveau client fictif, paiement simulé : le guide est remis dans l'espace, sans questionnaire
  // intermédiaire. Le plan se demande ensuite depuis la boutique de l'espace.
  await page.context().clearCookies();
  await go("/commande");
  await page.getByLabel("Prénom",{exact:true}).fill("Client fictif");
  // Adresse unique par exécution : sinon les réponses enregistrées d'une exécution précédente sont
  // rechargées, le questionnaire s'affiche déjà terminé et le prix de départ n'est jamais posé.
  const emailParcours="parcours-v7-"+Date.now()+"@example.invalid";
  await page.getByLabel("Adresse email",{exact:false}).fill(emailParcours);
  await page.getByRole("checkbox").last().check();
  await page.getByRole("button",{name:/Valider ma commande/}).click();
  await page.waitForURL(u=>u.pathname.includes("/espace/"),{timeout:30000});
  ok(await page.getByRole("link",{name:"Télécharger mon guide PDF",exact:true}).isVisible());
  const orderId=JSON.parse(fs.readFileSync(fixture,"utf8")).orders.find(o=>o.email===emailParcours).id;
  await page.getByText("Construire mon plan adapté",{exact:true}).first().click();
  await page.waitForURL(u=>u.pathname==="/plan-complet",{timeout:30000});
  await remplirPlan();
  // Le prix de départ (147 € pendant 10 minutes) n’est posé qu’après le rafraîchissement déclenché par
  // la fin du questionnaire : on attend qu’il apparaisse plutôt que de lire le catalogue trop tôt.
  await page.waitForFunction(()=>document.querySelector("input[name=montantAffiche]")?.value==="147",null,{timeout:20000});
  const montantUpsell=Number(await page.locator('input[name="montantAffiche"]').inputValue());
  if(montantUpsell!==147)throw Error("montant affiché pour le plan : "+montantUpsell);
  n++;
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:1000});
    ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.locator("#decision-complement").scrollIntoViewIfNeeded();
    await page.screenshot({path:".build-refonte/v8-offre-"+width+".png"});
  }
  await page.getByRole("button",{name:/Déverrouiller mon plan adapté/}).click();
  await page.waitForURL("**/resultat-plan?*");
  ok(await page.getByText("votre plan adapté à votre situation est déverrouillé",{exact:false}).isVisible());
  await page.getByRole("link",{name:"Continuer mon parcours",exact:true}).click();
  await page.waitForURL(u=>u.pathname.includes("/espace/"),{timeout:30000});
  ok(await page.getByRole("link",{name:"Télécharger mon guide PDF",exact:true}).isVisible());
  const final=JSON.parse(fs.readFileSync(fixture,"utf8"));
  const order=final.orders.find(o=>o.id===orderId);
  ok(order.items.some(i=>i.sku==="upsell1"&&i.price===montantUpsell));
  ok(final.orders.every(o=>o.email.endsWith("@example.invalid")));

  ok(errors.length===0);
  console.log(n+" contrôles navigateur V7 réussis : mobile/desktop, aperçu limité, LP commune, qualification réelle, offre adaptée avant remise, paiement unique, guides narratifs sans quiz et droits préservés. Aucun service externe.");
} catch(error) {console.error(logs);throw error;} finally {await browser?.close();server.kill();await new Promise(resolve=>server.exitCode!==null?resolve():server.once("exit",resolve));fs.writeFileSync(fixture,initial);}
