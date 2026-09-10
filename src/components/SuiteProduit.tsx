import Link from "next/link";
import { suiteProduit } from "@/lib/editorial-produits";
import type { ProductSku } from "@/lib/config";
import type { Reponses } from "@/lib/qualification";
export function SuiteProduit({moment,possede,profil,hub,conclusion=false}:{moment:string;possede:ReadonlySet<ProductSku>;profil?:Reponses|null;hub:string;conclusion?:boolean}) {
 const suite=suiteProduit(moment,possede,profil);
 if(!suite)return conclusion?<section className="my-7 border-l-4 border-blue bg-grey-bg p-5" data-suite="terminee"><h2 className="mb-3 text-[1.3rem]">Votre prochaine étape est dans la vie réelle.</h2><p>Vous avez les supports de votre parcours. Adressez votre demande ou préparez votre rendez-vous ; gardez les réponses avec vos pièces. Aucun autre achat n’est nécessaire pour utiliser ce que vous possédez.</p></section>:null;
 return <aside className="my-7 border-l-4 border-orange bg-yellow-bg p-5" data-suite={suite.sku}>
 <p className="mb-2 text-sm font-bold uppercase text-orange-dark">Pour aller plus loin avec votre préparation</p>
 <h2 className="mb-3 text-[1.4rem] leading-tight">{suite.titre}</h2><p className="mb-4">{suite.besoin}</p>
 <p className="mb-4">Ne laissez pas cette question retourner à « plus tard ». Consultez maintenant le produit correspondant : son prix actuel est affiché avant toute confirmation.</p>
 <Link className="inline-flex min-h-[48px] items-center font-bold" href={hub+"/ajouter/"+suite.sku}>{suite.cta} →</Link>
 <p className="mt-3 text-sm">Si votre avantage de démarrage est encore actif, sa fin exacte apparaît sur l’offre. Aucun achat sur ce clic ; votre guide et vos accès restent acquis si vous ne prenez pas le complément.</p>
 </aside>;
}
