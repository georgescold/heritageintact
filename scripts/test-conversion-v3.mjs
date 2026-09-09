import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url), ts=require("typescript");
let n=0; const eq=(a,b)=>{assert.equal(a,b);n++}; const ok=a=>{assert.ok(a);n++};
function loader(env={}, overrides={}, fakeFetch=()=>{throw Error("Réseau interdit");}) {
 const cache=new Map();
 const mod=rel=>{
  if(overrides[rel])return overrides[rel];
  if(cache.has(rel))return cache.get(rel);
  const file=path.resolve(rel), exports={};cache.set(rel,exports);
  const js=ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(js,{exports,process:{env},Buffer,Headers,Request,Response,AbortSignal,console:{info(){},error(){}},fetch:fakeFetch,require:p=>{
    if(p.startsWith("node:"))return require(p);
    const resolved=p.startsWith("@/")?"src/"+p.slice(2)+".ts":path.relative(process.cwd(),path.resolve(path.dirname(file),p+".ts")).replaceAll("\\","/");
    return mod(resolved);
  }},{filename:file});
  return exports;
 }; return mod;
}
let mod=loader();
const {objectifValide,conseilOffre}=mod("src/lib/positionnement.ts");
for(const x of [null,{},[],123,"pirate","",undefined])eq(objectifValide(x),undefined);
for(const x of ["comprendre","preparer","assurance-vie"])eq(objectifValide(x),x);
ok(conseilOffre({vie:"P"}).raison.includes("PACS"));
ok(conseilOffre({enfants:"R"}).raison.includes("autre union"));
const {SEQUENCE}=mod("src/lib/sequence.ts"); eq(SEQUENCE.map(x=>x.jour).join(","),"1,2,3,4,5,6,7");
ok(SEQUENCE[4].levier.includes("Ennemi"));ok(SEQUENCE[6].corps("Test").join(" ").includes("Une réduction commerciale ne change pas vos droits fiscaux"));
const {offreLtv,etapeLtvDue}=mod("src/lib/sequence-ltv.ts");
const now=Date.now(), lead={marketingConsent:true}, acces={createdAt:new Date(now-12*86400000).toISOString(),envoyes:[],revoque:false}, prog=[{etape:"e0",faiteLe:"2026-09-01"}];
eq(etapeLtvDue(lead,acces,prog,now),"ltv-v3-1");
for(const l of [{}, {marketingConsent:false},{marketingConsent:true,desabonne:true}])eq(etapeLtvDue(l,acces,prog,now),null);
eq(etapeLtvDue(lead,acces,[],now),null);
eq(etapeLtvDue(lead,{...acces,envoyes:["ltv-pause"]},prog,now),null);
eq(etapeLtvDue(lead,{...acces,revoque:true},prog,now),null);
eq(etapeLtvDue(lead,{...acces,createdAt:new Date(now-40*86400000).toISOString()},prog,now),null);
eq(offreLtv({objectif:"comprendre"},new Set(["front"])),"upsell1");
eq(offreLtv({objectif:"preparer",av:"N"},new Set(["front"])),"upsell1");
eq(offreLtv({av:"O"},new Set(["front","upsell1"])),"upsell2");
eq(offreLtv({av:"O"},new Set(["front","upsell1","upsell2","pack1"])),null);
const {signatureResendValide}=mod("src/lib/resend-signature.ts");
const body='{"event_type":"ping","data":{"success":true}}', stamp="1731705121", secret="whsec_"+Buffer.from("fixture-hmac-conversion-v3-not-a-real-key").toString("base64");
const headers=new Headers({"svix-id":"msg_loFOjxBNrRLzqYUf","svix-timestamp":stamp,"svix-signature":"v1,"+require("node:crypto").createHmac("sha256",Buffer.from("fixture-hmac-conversion-v3-not-a-real-key")).update(`msg_loFOjxBNrRLzqYUf.${stamp}.${body}`).digest("base64")});
eq(signatureResendValide(body,headers,secret,Number(stamp)*1000),true);
eq(signatureResendValide(body+" ",headers,secret,Number(stamp)*1000),false);
eq(signatureResendValide(body,headers,secret,Number(stamp)*1000+301000),false);
eq(signatureResendValide(body,new Headers(),secret,Number(stamp)*1000),false);
eq(signatureResendValide(body,headers,"",Number(stamp)*1000),false);
const realLead={id:"fictif",email:"test@example.invalid",firstName:"<img src=x>",marketingConsent:true,createdAt:new Date().toISOString()};
const journal=new Map();let called=0,lastBody, lastHeaders, reservation="envoyer";
const overrides={
 "src/lib/db.ts":{getLead:async()=>realLead,accesParEmail:async()=>null,promotionParEmail:async()=>null},
 "src/lib/mail-journal.ts":{empreinte:v=>require("node:crypto").createHash("sha256").update(v).digest("hex"),reserverEmail:async k=>journal.has(k)?"deja":reservation,terminerEmail:async(k,status)=>{if(status==="accepte")journal.set(k,true);}}
};
let email=loader({},overrides)("src/lib/email.ts");
eq((await email.envoyer({to:realLead.email,subject:"Test",html:"test",text:"test",type:"transactionnel"})).ok,false);
email=loader({RESEND_API_KEY:"fictif"},overrides,async(url,opts)=>{called++;lastBody=JSON.parse(opts.body);lastHeaders=opts.headers;return Response.json({id:"fake-id"});})("src/lib/email.ts");
eq((await email.envoyerEtape(realLead,SEQUENCE[0])).ok,true);
eq(called,1);ok(lastBody.headers["List-Unsubscribe"].includes("/api/desinscription?id="));ok(lastHeaders["Idempotency-Key"]);ok(lastBody.html.includes("&lt;img"));ok(!lastBody.html.includes("<img src=x>"));
eq((await email.envoyerEtape(realLead,SEQUENCE[0])).ok,true);eq(called,1);
realLead.desabonne=true;eq((await email.envoyerEtape(realLead,SEQUENCE[1])).ok,false);eq(called,1);
realLead.desabonne=false;reservation="bloque";eq((await email.envoyerEtape(realLead,SEQUENCE[1])).ok,false);eq(called,1);
let failed=loader({RESEND_API_KEY:"fictif"},overrides,async()=>{throw Error("timeout");})("src/lib/email.ts");
reservation="envoyer";eq((await failed.envoyerEtape(realLead,SEQUENCE[1])).ok,false);
console.log(n+" assertions V3 réussies : orientation, CEO J1–J7, LTV, signatures Svix, consentement, échappement, absence de service, idempotence et erreurs avec transport simulé.");
