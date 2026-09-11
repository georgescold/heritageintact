import { PDF_GUIDES } from "@/lib/pdf-guides";
import type { ProductSku } from "@/lib/config";
import { TelechargerPlanPersonnalise } from "./TelechargerPlanPersonnalise";
export function MesGuidesPdf({jeton,possede}:{jeton:string;possede:Set<ProductSku>}){
 const guides=PDF_GUIDES.filter(g=>possede.has(g.sku));
 const achats=guides.filter(g=>g.categorie==="achat");
 const offerts=guides.filter(g=>g.categorie==="offert");
 const plan=possede.has("upsell1");
 if(!guides.length&&!plan)return null;
 return <section>
  <h2 className="mb-2 text-[1.5rem]">Tous mes documents à télécharger</h2>
  <p className="mb-5 text-text-soft">Vos contenus sont regroupés ci-dessous.</p>
  <h3 className="mb-3 text-[1.2rem] font-bold text-blue">Mes produits</h3>
  <ul className="mb-7 space-y-4">
   {achats.map(g=><li key={g.slug} className="border-2 border-blue bg-grey-bg p-5">
    <p className="mb-2 text-[1.15rem] font-bold text-blue">{g.titre}</p>
    <p className="mb-4">{g.description}</p>
    <a className="inline-flex min-h-[50px] w-full items-center justify-center bg-orange px-4 py-3 text-center font-bold text-white no-underline sm:w-auto" href={"/espace/"+jeton+"/pdf/"+g.slug} download>{g.bouton}</a>
   </li>)}
   {plan&&<TelechargerPlanPersonnalise jeton={jeton}/>}
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
