import { PDF_GUIDES } from "@/lib/pdf-guides";
import type { ProductSku } from "@/lib/config";
import { TelechargerPlanPersonnalise } from "./TelechargerPlanPersonnalise";
import { DOCUMENTS } from "@/lib/methode";
import { readDelivery } from "@/lib/delivery-store";
import { validerDonneesSimulation, fichesPourSituation } from "@/lib/simulateur/donnees";
export async function MesGuidesPdf({jeton,possede,email}:{jeton:string;possede:Set<ProductSku>;email?:string}){
 const guides=PDF_GUIDES.filter(g=>possede.has(g.sku));
 const achats=guides.filter(g=>g.categorie==="achat");
 const offerts=guides.filter(g=>g.categorie==="offert");
 const plan=possede.has("upsell1");
 let suggestions:string[]=[];
 if(plan&&email)try { const record=await readDelivery(email,"simulation"); const value=record?.value as {donnees?:unknown}|undefined; const d=validerDonneesSimulation(value?.donnees); if(d)suggestions=fichesPourSituation(d); }catch{ /* Tous les documents restent disponibles si les suggestions sont indisponibles. */ }
 if(!guides.length&&!plan)return null;
 return <section>
  <h2 className="mb-2 text-[1.5rem]">Tous mes documents à télécharger</h2>
  <p className="mb-5 text-text-soft">Vos contenus sont regroupés ci-dessous.</p>
  <h3 className="mb-3 text-[1.2rem] font-bold text-blue">Mes produits</h3>
  <ul className="mb-7 space-y-4">
   {plan&&<TelechargerPlanPersonnalise jeton={jeton}/>}
   {achats.map(g=><li key={g.slug} className="border-2 border-blue bg-grey-bg p-5">
    <p className="mb-2 text-[1.15rem] font-bold text-blue">{g.titre}</p>
    <p className="mb-4">{g.description}</p>
    <a className="inline-flex min-h-[50px] w-full items-center justify-center bg-orange px-4 py-3 text-center font-bold text-white no-underline sm:w-auto" href={"/espace/"+jeton+"/pdf/"+g.slug} download>{g.bouton}</a>
    {g.sku==="upsell1"&&suggestions.length>0&&<div className="mt-4 border-l-4 border-green pl-4"><p className="font-bold">D’après vos réponses, commencez par ces fiches</p><p className="text-sm">Vous n’avez pas à lire les douze situations.</p><ul>{suggestions.map(cle=>{const doc=DOCUMENTS.find(x=>x.cle===cle&&x.sku==="upsell1");return doc?<li key={cle}><a className="inline-flex min-h-[44px] items-center underline" href={`/espace/${jeton}/document/${cle}`}>{doc.titre}</a></li>:null;})}</ul></div>}
    {g.sku !== "front" && <details className="mt-4"><summary className="cursor-pointer py-3 font-bold text-blue">Remplir mes fiches en ligne ou les imprimer séparément</summary><ul className="mt-2 space-y-2">{DOCUMENTS.filter(doc => doc.sku === g.sku).sort((a,b) => a.ordre-b.ordre).map(doc => <li key={doc.cle}><a className="inline-flex min-h-[44px] items-center underline" href={`/espace/${jeton}/document/${doc.cle}`}>{doc.titre}</a></li>)}</ul></details>}
   </li>)}
  </ul>
  {offerts.length>0&&<>
   <h3 className="mb-3 text-[1.2rem] font-bold text-green">Offert</h3>
   <ul className="space-y-4">
    {offerts.map(g=><li key={g.slug} className="border-2 border-green bg-green-bg p-5">
     <p className="mb-2 text-[1.15rem] font-bold text-green">{g.titre}</p>
     <p className="mb-4">{g.description}</p>
     <a className="inline-flex min-h-[50px] w-full items-center justify-center bg-green px-4 py-3 text-center font-bold text-white no-underline sm:w-auto" href={"/espace/"+jeton+"/pdf/"+g.slug} download>{g.bouton}</a>
    </li>)}
   </ul>
  </>}
 </section>;
}
