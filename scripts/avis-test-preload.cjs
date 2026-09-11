// À charger APRÈS delivery-test-preload.cjs : redirige les avis de la recette vers un dossier temporaire.
const fs=require("node:fs"),path=require("node:path");
const racine=path.join(process.cwd(),"data","avis"),avis=racine.toLowerCase();
if(!process.env.HI_TEST_AVIS_DIR)throw Error("HI_TEST_AVIS_DIR manquant : la recette n'écrit jamais dans data/avis");
const map=p=>{if(typeof p!=="string")return p;const r=path.resolve(p).toLowerCase();return r===avis||r.startsWith(avis+path.sep)?path.join(process.env.HI_TEST_AVIS_DIR,path.relative(racine,p)):p;};
for(const k of ["readFile","writeFile","mkdir"]){const old=fs.promises[k].bind(fs.promises);fs.promises[k]=(p,...a)=>old(map(p),...a);}
