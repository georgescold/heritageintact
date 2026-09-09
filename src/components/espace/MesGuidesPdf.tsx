import { PDF_GUIDES } from "@/lib/pdf-guides";
import type { ProductSku } from "@/lib/config";
export function MesGuidesPdf({jeton,possede}:{jeton:string;possede:Set<ProductSku>}){
 const guides=PDF_GUIDES.filter(g=>possede.has(g.sku));
 if(!guides.length)return null;
 return <section className="my-6 border-2 border-blue bg-grey-bg p-5"><h2 className="mb-3 text-[1.4rem]">Vos guides PDF, prêts à lire</h2><p className="mb-4">Explications, exemples et fiches regroupés. Aucun tournage pédagogique à attendre. Téléchargez un guide ou imprimez seulement les pages utiles.</p><ul className="space-y-3">{guides.map(g=><li key={g.slug}><a className="inline-flex min-h-[48px] items-center font-bold text-blue" href={"/espace/"+jeton+"/pdf/"+g.slug}>{g.titre} · Télécharger →</a></li>)}</ul><p className="mt-3 text-sm">Gardez vos exemplaires et les renseignements que vous y notez chez vous. Vos liens d’accès sont personnels.</p></section>;
}
