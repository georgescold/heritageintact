import fs from "node:fs";import path from "node:path";import vm from "node:vm";import assert from "node:assert/strict";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript"),cache=new Map();let n=0;
function mod(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,process:{env:{}},require:p=>mod(path.resolve(path.dirname(file),p)+".ts")});return exports;}
const ok=(x,m)=>{assert.ok(x,m);n++;};
const lire=f=>fs.readFileSync(f,"utf8");
const {cheminSansPixel,scriptPixelMeta,META_PIXEL_ID}=mod("src/lib/meta-pixel.ts");

// 1. Les adresses qui portent une clé n'ont jamais de pixel.
for(const p of ["/espace","/espace/abcdefghijklmnopqrst","/reprendre/xyz","/offre/upsell1","/plan-complet","/kit-assurance-vie","/dossier-complet","/situation","/bienvenue","/merci","/resultat-plan","/simulateur-seul","/desinscription","/derniere-chance","/commande/confirmation"])ok(cheminSansPixel(p),"chemin privé : "+p);
for(const p of ["/","/lp","/faq","/guide","/guide/usufruit-nue-propriete-indivision","/methode","/commande","/lp-questions","/apercu","/connexion","/cgv","/confidentialite","/conditions-offres"])ok(!cheminSansPixel(p),"chemin public : "+p);
ok(!cheminSansPixel("/methodes-annexes"),"préfixe partiel non bloqué par erreur");

// 2. Le script du <head> porte l'identifiant et coupe les suivis automatiques.
const script=scriptPixelMeta();
ok(META_PIXEL_ID==="3751904564985082","identifiant du pixel");
ok(script.includes("fbq.disablePushState=true"),"suivi automatique des navigations coupé");
ok(script.includes("fbq('set','autoConfig',false,")," autoConfig coupé");
ok(script.includes("connect.facebook.net/en_US/fbevents.js")&&script.includes("'PageView'"),"code de base Meta");
ok(script.startsWith("(function(){if(new RegExp("),"garde des chemins privés en tête du script");

// 3. Les événements du parcours, posés là où l'adresse est publique.
const methode=lire("src/app/methode/page.tsx"),commande=lire("src/app/commande/page.tsx"),actions=lire("src/app/actions.ts"),checkout=lire("src/components/CheckoutForm.tsx");
ok(methode.includes('<EvenementPixel nom="ViewContent" />')&&methode.includes("<LeadInscription />"),"ViewContent et Lead sur la page de vente");
ok(commande.includes('<EvenementPixel nom="InitiateCheckout" />'),"InitiateCheckout sur le bon de commande");
ok(actions.includes('redirect("/methode?inscrit=1")'),"marqueur d'inscription pour le Lead");
ok(checkout.includes("achatPixel(done.mesure)"),"achat signalé depuis la page de commande");
ok(!checkout.includes("achatPixel(prep")&&!checkout.includes("orderId}`);\n        achatPixel"),"aucun identifiant de commande transmis au pixel");

// 4. L'achat partage son identifiant avec l'envoi serveur : Meta ne le comptera qu'une fois.
const conversions=lire("src/lib/meta-conversions.ts");
ok(conversions.includes("export const identifiantAchatMeta")&&conversions.includes("event_id: identifiantAchatMeta(paiement.id)"),"identifiant d'achat partagé");
ok(actions.includes("eventId: identifiantAchatMeta(intent.id)"),"le navigateur utilise le même identifiant");
ok(actions.includes("valeur: (intent.amount_received || intent.amount || 0) / 100"),"montant réellement débité");
ok(lire("src/app/layout.tsx").includes("scriptPixelMeta()")&&lire("src/app/layout.tsx").includes("<SuiviPagesMeta />"),"pixel et suivi des navigations montés");
console.log(n+" contrôles pixel réussis : chemins privés, script du head, événements du parcours, identifiant d'achat partagé.");
