// Export éditorial sans chargement de base, email, réseau ou données clients.
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),ts=require("typescript"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
const cache=new Map();
function mod(file){
 file=path.resolve(file);
 if(cache.has(file))return cache.get(file);
 const exports={};cache.set(file,exports);
 const js=ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(js,{exports,process:{env:{}},require:p=>{
   if(!p.startsWith(".")&&!p.startsWith("@/"))return require(p);
   const stem=p.startsWith("@/")?path.resolve("src",p.slice(2)):path.resolve(path.dirname(file),p);
   return mod([".ts",".tsx"].map(e=>stem+e).find(f=>fs.existsSync(f)));
 }},{filename:file});
 return exports;
}
const {DOCUMENTS}=mod("src/lib/methode.ts");
const {EDITORIAL_PRODUITS,OUVERTURES_CHAPITRES,LEXIQUE_SUCCESSION}=mod("src/lib/editorial-produits.ts");
const {EDITORIAL_FICHES}=mod("src/lib/editorial-fiches.ts");
const {EXEMPLE_HEADLINE}=mod("src/lib/exemple-headline.ts");
const {EXPLICATIONS_ASSURANCE}=mod("src/lib/assurance-explications.ts");
const {LECONS}=mod("src/lib/lecons.ts"),{GUIDES_UTILISATION}=mod("src/lib/guides-utilisation.ts");
fs.mkdirSync("tmp/pdfs",{recursive:true});
fs.writeFileSync("tmp/pdfs/contenu-v7.json",JSON.stringify({editorial:EDITORIAL_PRODUITS,ouvertures:OUVERTURES_CHAPITRES,lexique:LEXIQUE_SUCCESSION,fichesEditorial:EDITORIAL_FICHES,headline:EXEMPLE_HEADLINE,assurance:EXPLICATIONS_ASSURANCE,lecons:LECONS,guides:GUIDES_UTILISATION,documents:DOCUMENTS.map(d=>({cle:d.cle,titre:d.titre,sku:d.sku,html:renderToStaticMarkup(React.createElement(d.corps,{}))}))},null,2));
console.log("Export des 8 chapitres, introductions et "+DOCUMENTS.length+" fiches, sans données clients.");
