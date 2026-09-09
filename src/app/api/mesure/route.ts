import { sql, sqlActif } from "@/lib/sql";
const EVENEMENTS=["vue_vente","vue_commande","vue_offre","clic_apercu","clic_commande"];
async function schema(){await sql()`create table if not exists funnel_compteurs(jour date not null, evenement text not null, version text not null, nombre bigint not null default 0, primary key(jour,evenement,version))`;}
export async function POST(req: Request){
  if(process.env.NEXT_PUBLIC_FUNNEL_METRICS_ACTIVE!=="true" || !sqlActif)return new Response(null,{status:204});
  if(req.headers.get("origin")!==new URL(req.url).origin)return new Response(null,{status:403});
  const raw=await req.text();if(raw.length>150)return new Response(null,{status:413});
  try{
    const {evenement}=JSON.parse(raw);
    if(!EVENEMENTS.includes(evenement))return new Response(null,{status:400});
    await schema();
    await sql()`insert into funnel_compteurs(jour,evenement,version,nombre) values (current_date,${evenement},'v3',1)
      on conflict(jour,evenement,version) do update set nombre=funnel_compteurs.nombre+1`;
    return new Response(null,{status:204});
  }catch{return new Response(null,{status:503});}
}
export async function GET(req:Request){
  const secret=process.env.CRON_SECRET;
  if(!secret || req.headers.get("authorization")!==`Bearer ${secret}`)return new Response(null,{status:401});
  if(!sqlActif)return new Response(null,{status:503});
  try{
    await schema();
    const compteurs=await sql()`select jour,evenement,version,nombre from funnel_compteurs where jour>=current_date-30 order by jour,evenement`;
    return Response.json({version:"v3",compteurs,limites:"Comptages de vues et clics, pas de visiteurs uniques ni preuve d’attribution. Confronter aux paiements confirmés ; ne pas déduire un profit de ces compteurs."},{headers:{"Cache-Control":"no-store"}});
  }catch{return new Response(null,{status:503});}
}
