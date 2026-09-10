import { readFile } from "node:fs/promises";
import path from "node:path";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { PDF_GUIDES } from "@/lib/pdf-guides";
import { genererPlanPersonnalisePdf } from "@/lib/simulateur/pdf-plan";
import { validerDonneesSimulation } from "@/lib/simulateur/donnees";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow","Referrer-Policy":"no-referrer"};
export async function GET(_request:Request,{params}:{params:Promise<{jeton:string;slug:string}>}){
 const {jeton,slug}=await params;
 const guide=PDF_GUIDES.find(g=>g.slug===slug);
 if(!guide||!estJetonValide(jeton))return new Response("Document indisponible",{status:404,headers});
 const etat=await chargerEspace(jeton);
 if(!etat||etat.acces.revoque||!etat.possede.has(guide.sku))return new Response("Ce document nécessite un accès valide au produit.",{status:403,headers});
 try{
   const file=await readFile(path.join(process.cwd(),"output","pdf",guide.slug+".pdf"));
   return new Response(new Uint8Array(file),{headers:{...headers,"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="'+guide.slug+'.pdf"'}});
 }catch{return new Response("Téléchargement momentanément indisponible. Les fiches restent lisibles dans votre espace.",{status:503,headers});}
}

export async function POST(request:Request,{params}:{params:Promise<{jeton:string;slug:string}>}){
 const {jeton,slug}=await params;
 if(slug!=="plan-personnalise"||!estJetonValide(jeton))return new Response("Document indisponible",{status:404,headers});
 const longueur=Number(request.headers.get("content-length")||0);
 if(longueur>25_000)return new Response("Les données de simulation sont trop volumineuses.",{status:413,headers});
 const etat=await chargerEspace(jeton);
 if(!etat||etat.acces.revoque||!etat.possede.has("upsell1"))return new Response("Ce document nécessite l’achat du simulateur et du plan adapté.",{status:403,headers});
 try{
   const corps=await request.text();
   if(corps.length>25_000)return new Response("Les données de simulation sont trop volumineuses.",{status:413,headers});
   const donnees=validerDonneesSimulation(JSON.parse(corps));
   if(!donnees)return new Response("La simulation enregistrée est incomplète ou invalide.",{status:400,headers});
   const pdf=await genererPlanPersonnalisePdf(donnees);
   return new Response(new Uint8Array(pdf),{headers:{...headers,"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="mon-plan-personnalise.pdf"'}});
 }catch{return new Response("Génération momentanément indisponible. Réessayez dans quelques instants.",{status:503,headers});}
}
