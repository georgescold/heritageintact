import { readFile } from "node:fs/promises";
import path from "node:path";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { PDF_GUIDES } from "@/lib/pdf-guides";
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
