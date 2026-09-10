import { PDF_GUIDES } from "@/lib/pdf-guides";
import type { ProductSku } from "@/lib/config";
import { TelechargerPlanPersonnalise } from "./TelechargerPlanPersonnalise";
export function MesGuidesPdf({jeton,possede}:{jeton:string;possede:Set<ProductSku>}){
 const guides=PDF_GUIDES.filter(g=>possede.has(g.sku));
 const plan=possede.has("upsell1");
 if(!guides.length&&!plan)return null;
 return <section><h2 className="mb-5 text-[1.5rem]">Mes dossiers à télécharger</h2><ul className="space-y-4">{guides.map(g=><li key={g.slug} className="border-2 border-blue bg-grey-bg p-5"><p className="mb-3 text-[1.1rem] font-bold text-blue">{g.titre}</p><a className="inline-flex min-h-[50px] w-full items-center justify-center bg-orange px-4 py-3 text-center font-bold text-white no-underline sm:w-auto" href={"/espace/"+jeton+"/pdf/"+g.slug} download>Télécharger le dossier PDF</a></li>)}{plan&&<TelechargerPlanPersonnalise jeton={jeton}/>}</ul></section>;
}
