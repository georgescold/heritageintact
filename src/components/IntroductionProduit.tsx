import { EDITORIAL_PRODUITS } from "@/lib/editorial-produits";
export function IntroductionProduit({sku}:{sku:keyof typeof EDITORIAL_PRODUITS}) {
 const e=EDITORIAL_PRODUITS[sku];
 return <section className="my-7" aria-label="Comprendre votre guide">
  <h2 className="mb-4 text-[1.6rem] leading-tight">{e.ouverture}</h2>
  <div className="space-y-4 text-lg leading-relaxed">{e.histoire.map(p=><p key={p}>{p}</p>)}</div>
  <div className="my-6 border-l-4 border-orange bg-grey-bg p-5"><h3 className="mb-3 text-[1.25rem]">Ce que vous allez apprendre</h3><ul className="list-disc space-y-2 pl-5">{e.apprendre.map(p=><li key={p}>{p}</li>)}</ul></div>
  <p><strong>Pour aller à l’essentiel : </strong>{e.essentiel}</p>
 </section>;
}
