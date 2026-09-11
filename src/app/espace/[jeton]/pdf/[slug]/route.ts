import { readFile } from "node:fs/promises";
import path from "node:path";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { PDF_GUIDES } from "@/lib/pdf-guides";
import { validerDonneesSimulation } from "@/lib/simulateur/donnees";
import { readDelivery } from "@/lib/delivery-store";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow","Referrer-Policy":"no-referrer"};
export async function GET(_request:Request,{params}:{params:Promise<{jeton:string;slug:string}>}){
 const {jeton,slug}=await params;
 if(slug==="plan-personnalise") {
   if(!estJetonValide(jeton))return new Response("Document indisponible",{status:404,headers});
   const etat=await chargerEspace(jeton);
   if(!etat||etat.acces.revoque||!etat.possede.has("upsell1"))return new Response("Ce document nécessite un accès valide au Plan.",{status:403,headers});
   try {
     const record=await readDelivery(etat.acces.email,"simulation");
     const saved=record?.value as {donnees?:unknown;termine?:boolean;dernierPlan?:unknown}|undefined;
     const donnees=validerDonneesSimulation(saved?.termine ? saved.donnees : saved?.dernierPlan);
     if(!donnees)return new Response("Complétez vos réponses avec le lien ci-dessous : votre PDF sera alors prêt.",{status:409,headers});
     const { genererPlanPersonnalisePdf } = await import("@/lib/simulateur/pdf-plan");
     return new Response(new Uint8Array(await genererPlanPersonnalisePdf(donnees)),{headers:{...headers,"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="mon-plan-personnalise.pdf"'}});
   }catch{return new Response("Votre PDF n’a pas pu être généré. Réessayez dans quelques instants.",{status:503,headers});}
 }
 const slugCanonique=slug==="preparation-familiale"?"bibliotheque-12-situations-familiales":slug;
 const guide=PDF_GUIDES.find(g=>g.slug===slugCanonique);
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
 if(!etat||etat.acces.revoque||!etat.possede.has("upsell1"))return new Response("Ce document nécessite l’achat de Mon plan adapté à ma situation.",{status:403,headers});
 try{
   const corps=await request.text();
   if(corps.length>25_000)return new Response("Les données de simulation sont trop volumineuses.",{status:413,headers});
   const donnees=validerDonneesSimulation(JSON.parse(corps));
   if(!donnees)return new Response("La simulation enregistrée est incomplète ou invalide.",{status:400,headers});
   const { genererPlanPersonnalisePdf } = await import("@/lib/simulateur/pdf-plan");
   const pdf=await genererPlanPersonnalisePdf(donnees);
   return new Response(new Uint8Array(pdf),{headers:{...headers,"Content-Type":"application/pdf","Content-Disposition":'attachment; filename="mon-plan-personnalise.pdf"'}});
 }catch{return new Response("Génération momentanément indisponible. Réessayez dans quelques instants.",{status:503,headers});}
}
