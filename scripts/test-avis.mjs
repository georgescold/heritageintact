import fs from "node:fs";import path from "node:path";import vm from "node:vm";import assert from "node:assert/strict";import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript"),cache=new Map();let n=0;
function mod(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,process:{env:{}},require:p=>mod(path.resolve(path.dirname(file),p)+".ts")});return exports;}
const ok=(x,m)=>{assert.ok(x,m);n++;};
const {questionnaireAvis,contexteAvis,lireSaisie,DELAI_USAGE_JOURS,MESSAGE_MAX}=mod("src/lib/avis-questions.ts");
const cles=s=>s.flatMap(x=>x.questions.map(q=>q.cle));
const jour=86400000,now=Date.parse("2026-09-11T12:00:00Z");
const ctx=(skus,{av="N",jours=20}={})=>contexteAvis({possede:new Set(skus),profil:{av},acces:{createdAt:new Date(now-jours*jour).toISOString()}},now);

// 1. Acheteur du guide depuis hier : premières impressions, aucune question de résultat.
let q=cles(questionnaireAvis(ctx(["front"],{jours:1})));
ok(q.includes("guide_lecture")&&q.includes("guide_clarte"),"premières impressions");
ok(!q.includes("guide_erreur")&&!q.includes("guide_erreur_marquante"),"pas de résultat demandé avant "+DELAI_USAGE_JOURS+" jours");
ok(q.includes("plan_frein"),"frein demandé à qui n'a pas le plan");
ok(!q.includes("plan_ordre")&&!q.includes("av_clause")&&!q.includes("notaire_rdv"),"aucune question sur un produit non possédé");
ok(q.at(-1)==="recommander","recommandation en dernier");

// 2. Client installé avec le plan et l'assurance-vie.
q=cles(questionnaireAvis(ctx(["front","upsell1","upsell2","backend1"],{av:"O",jours:20})));
ok(["guide_erreur","guide_erreur_marquante","plan_ordre","plan_estimation","av_clause","av_point"].every(c=>q.includes(c)),"questions des produits possédés");
ok(!q.includes("plan_frein")&&!q.includes("av_verifiee"),"ni frein du plan ni question AV générique pour un acheteur");

// 3. Assurance-vie déclarée au questionnaire, produit non acheté.
ok(cles(questionnaireAvis(ctx(["front"],{av:"O"}))).includes("av_verifiee"),"AV déclarée sans le produit");
ok(!cles(questionnaireAvis(ctx(["front"],{av:"N"}))).includes("av_verifiee"),"pas de question AV sans contrat déclaré");

// 4. Dossier notaire et Dossier Testament.
q=cles(questionnaireAvis(ctx(["front","bump","backend4"])));
ok(["notaire_rdv","notaire_utile","testament_clarte","testament_rdv"].every(c=>q.includes(c)),"notaire et testament");

// 5. Les erreurs proposées sont celles du guide.
const marquante=questionnaireAvis(ctx(["front"])).flatMap(s=>s.questions).find(x=>x.cle==="guide_erreur_marquante");
ok(marquante.options.length===8&&marquante.options[0].includes("quinze ans")&&marquante.options.at(-1)==="Aucune en particulier","7 erreurs + aucune");

// 6. Validation : on ne garde que ce qui appartient au questionnaire de ce membre.
const sections=questionnaireAvis(ctx(["front"]));
const fd=o=>({get:k=>k in o?o[k]:null});
ok(!lireSaisie(sections,fd({})).ok,"note obligatoire");
ok(!lireSaisie(sections,fd({note:"6"})).ok,"note bornée");
ok(!lireSaisie(sections,fd({note:"2.5"})).ok,"note entière");
let r=lireSaisie(sections,fd({note:"4",guide_lecture:"J’en ai lu une partie",guide_clarte:"inventé",plan_ordre:"Oui, clairement",message:"  Merci  ",publication:"oui"}));
ok(r.ok&&r.avis.note===4,"note lue");
ok(r.avis.reponses.guide_lecture==="J’en ai lu une partie","réponse valide gardée");
ok(!("guide_clarte" in r.avis.reponses),"option inventée rejetée");
ok(!("plan_ordre" in r.avis.reponses),"question hors questionnaire rejetée");
ok(r.avis.message==="Merci"&&r.avis.publication===true,"message et accord");
ok(lireSaisie(sections,fd({note:"5",publication:"oui"})).avis.publication===false,"pas d'accord de publication sans message");
ok(lireSaisie(sections,fd({note:"3",message:"x".repeat(MESSAGE_MAX+50)})).avis.message.length===MESSAGE_MAX,"message borné");

// 7. Trustpilot : l'invitation part avec le reçu du guide, et le lien public est proposé à tous.
const lire=f=>fs.readFileSync(f,"utf8");
ok(lire("src/lib/email.ts").includes('inviterAvis: sku === "front" && montant > 0'),"copie cachée Trustpilot sur le reçu du guide");
ok(lire("src/lib/livraison.ts").includes('envoyerRecuAchat(gagne, "front"'),"reçu du guide envoyé à la livraison");
ok(lire("src/lib/config.ts").includes('URL_AVIS_TRUSTPILOT = "https://fr.trustpilot.com/evaluate/heritageintact.fr"'),"adresse d'évaluation");
const formulaire=lire("src/components/espace/FormulaireAvis.tsx");
const blocTrustpilot=formulaire.slice(formulaire.lastIndexOf("</form>"));
ok(blocTrustpilot.includes("href={URL_AVIS_TRUSTPILOT}")&&!/note|etat/.test(blocTrustpilot.split("<section")[1].split(">")[0]),"lien Trustpilot hors du formulaire, sans condition de note");
ok(lire("src/app/espace/[jeton]/page.tsx").includes('["avis", "Mon avis"]'),"onglet Mon avis");
console.log(n+" contrôles avis réussis : questions selon les achats, validation, invitation Trustpilot.");
