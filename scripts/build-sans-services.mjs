import {spawnSync} from "node:child_process";
const env={...process.env,__NEXT_PROCESSED_ENV:"true",NEXT_TELEMETRY_DISABLED:"1"};
for(const key of ["STRIPE_SECRET_KEY","STRIPE_WEBHOOK_SECRET","NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY","POSTGRES_URL","DATABASE_URL","RESEND_API_KEY","NEXT_PUBLIC_META_PIXEL_ID","META_CAPI_TOKEN","META_PIXEL_ID","PILOTAGE_SECRET","VERCEL","NEXT_PUBLIC_VSL_VIDEO_ID","NEXT_PUBLIC_ETAPES_VIDEO_IDS"])env[key]="";
env.META_CAPI_VALIDEE="false";
env.NEXT_PUBLIC_META_SERVER_MEASUREMENT=process.argv.includes("--consent-ui")?"true":"false";
const r=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build"],{env,stdio:"inherit"});process.exit(r.status??1);
