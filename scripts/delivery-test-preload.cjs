const fs=require("node:fs"),path=require("node:path");
process.env.__NEXT_PROCESSED_ENV="true";
process.env.NEXT_TELEMETRY_DISABLED="1";
for(const key of ["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET","NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY","POSTGRES_URL","DATABASE_URL","RESEND_API_KEY","META_CAPI_TOKEN","META_PIXEL_ID","PILOTAGE_SECRET","VERCEL"])process.env[key]="";
const root=process.cwd(),fixture=path.join(root,".build-refonte","db-test.json");
if(JSON.parse(fs.readFileSync(fixture,"utf8")).orders.some(o=>!o.email.endsWith("@example.invalid")))throw Error("Fixture non fictive");
const original=path.join(root,"data","db.json").toLowerCase(),delivery=path.join(root,"data","delivery").toLowerCase();
function map(p){if(typeof p!=="string")return p;const resolved=path.resolve(p).toLowerCase();if(resolved===original)return fixture;if(resolved===delivery||resolved.startsWith(delivery+path.sep))return path.join(process.env.HI_TEST_DELIVERY_DIR,path.relative(path.join(root,"data","delivery"),p));return p;}
for(const k of ["readFile","writeFile","mkdir"]){const old=fs.promises[k].bind(fs.promises);fs.promises[k]=(p,...args)=>{if(k==="writeFile"&&typeof p==="string"&&path.resolve(p).toLowerCase()===original)throw Error("Modification base interdite dans cette recette");return old(map(p),...args);};}
global.fetch=()=>{throw Error("Réseau externe interdit dans cette recette");};
