import { EXEMPLE_HEADLINE as e } from "@/lib/exemple-headline";
import { euros } from "@/lib/config";
export function ExempleHeadline({compact=false}:{compact?:boolean}){
 return <section id="exemple-chiffre" className="my-7 border-2 border-blue bg-white p-5">
  <p className="text-sm font-bold text-orange-dark">EXEMPLE FICTIF · DEUX ENFANTS · HORS FRAIS</p>
  <h2 className="my-3 text-[1.4rem]">La même maison. Les mêmes enfants. 68 206 € d’écart de droits dans ce modèle.</h2>
  <p className="mb-4">Une vie de travail mérite mieux qu’une décision prise sans avoir regardé ce que les règles permettent. Voici ce que l’anticipation peut changer dans un cas précis, pas ce que l’achat du guide vous ferait gagner.</p>
  {!compact&&<div className="mb-4 space-y-4" aria-label="Comparaison des droits dans le cas fictif">
   <div><p className="mb-2 font-bold">Sans ces opérations : {euros(e.succession)} de droits calculés</p><div className="h-5 bg-red" aria-hidden="true"/></div>
   <div><p className="mb-2 font-bold">Avec les opérations décrites : {euros(e.donation)}</p><div className="h-5 bg-blue" style={{width:(100*e.donation/e.succession)+"%"}} aria-hidden="true"/></div>
  </div>}
  <details><summary className="cursor-pointer font-bold text-blue">Voir les hypothèses et le calcul des 68 206 €</summary>
   <div className="mt-4 space-y-3 text-sm"><p>{e.hypotheses}</p><p>{e.scenarioA}</p><p>{e.scenarioB}</p><p>Barème en ligne directe : {euros(e.succession)} − {euros(e.donation)} = {euros(e.ecart)} pour les deux enfants réunis, avant arrondis fiscaux.</p><p>{e.limites}</p>
   <p>Repères vérifiés le 9 septembre 2026 : <a href="https://www.impots.gouv.fr/particulier/questions/comment-dois-je-calculer-les-droits-de-succession">succession</a>, <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">donation</a>, <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934">nue-propriété</a>, <a href="https://www.impots.gouv.fr/particulier/questions/je-suis-beneficiaire-dune-assurance-vie-comment-la-declarer">assurance-vie</a>.</p></div>
  </details>
  <p className="mt-3 text-sm text-text-soft">Écart illustratif, non représentatif de toutes les familles. Votre résultat peut être différent ou nul. La préparation ne remplace pas le notaire.</p>
 </section>;
}
