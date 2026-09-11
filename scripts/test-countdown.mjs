import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url),ts=require("typescript");
const start=Date.now();let now=start,remaining,effect,refreshes=0;
const events=new Map();
const surface={addEventListener:(event,fn)=>events.set(event,fn),removeEventListener:event=>events.delete(event)};
const exports={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/components/AvantageDemarrage.tsx","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{
 exports,Date:class extends Date{static now(){return now;}},window:surface,document:surface,
 setInterval:()=>1,clearInterval:()=>{},
 require:name=>name==="react"?{useState:v=>[v,n=>remaining=n],useEffect:fn=>effect=fn}:name==="next/navigation"?{useRouter:()=>({refresh:()=>refreshes++})}:name==="@/lib/config"?{euros:n=>String(n)}:{jsx:()=>null,jsxs:()=>null},
});
const props={promotion:{fin:new Date(start+600000).toISOString(),serveurMaintenant:start,pourcent:50,gamme:"suite",montantFixe:147},base:297};
exports.AvantageDemarrage(props);let cleanup=effect();assert.equal(remaining,600000);
now+=65000;cleanup();exports.AvantageDemarrage(props);cleanup=effect();
assert.equal(remaining,535000,"Retour arrière : les anciennes props ne relancent pas dix minutes");
now+=30000;events.get("pageshow")();assert.equal(remaining,505000);
now=start+601000;events.get("visibilitychange")();assert.equal(remaining,0);assert.equal(refreshes,1);
events.get("pageshow")();assert.equal(refreshes,1);cleanup();assert.equal(events.size,0);
console.log("Chrono : retour arrière, cache, reprise d’onglet et expiration OK.");
