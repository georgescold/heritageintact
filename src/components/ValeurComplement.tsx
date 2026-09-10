export function ValeurComplement({av=false,complet=false}:{av?:boolean;complet?:boolean}){
 const changements=av?[
 ["Ne plus confondre « signé » et « vérifié »","Retrouvez le contrat et la clause en vigueur ; distinguez les informations confirmées de celles que vous supposez."],
 ["Savoir quoi demander, sans trouver seul les mots","La demande à adapter vous aide à obtenir la version enregistrée, l’historique et les explications manquantes."],
 ["Ne pas perdre la réponse dans un nouveau tiroir","Classez la réponse et la prochaine vérification. Vous gardez le fil, même après une interruption."]
 ]:[
 ["Au prochain échange, ouvrir un dossier plutôt que vider trois tiroirs","Inventaire, pièces et message de rendez-vous : les trames sont déjà préparées. Vous complétez ce qui concerne votre famille."],
 ["Parler de votre famille, pas d’un cas général lu sur Internet","Une fiche de départ adaptée à vos réponses, parmi douze situations, avec les particularités et les questions à faire examiner."],
 ["Sortir de « on verra » avec une prochaine démarche","L’atelier explicite ses hypothèses ; le tableau de bord relie les questions, les réponses et leur suivi."]
 ];
 return <section className="my-7 border-l-4 border-orange bg-grey-bg p-5">
 <h2 className="mb-3 text-[1.4rem]">{av?"Vos intentions méritent mieux qu’une ancienne photocopie.":"Le guide montre les erreurs. Le simulateur et le plan les relient à votre situation."}</h2>
 <p className="mb-5">{av?"Vous n’achetez pas un autre placement. Vous achetez le fil pour interroger celui que vous avez déjà.":"Vous avez compris les risques généraux. Ce produit distinct transforme maintenant vos réponses en estimation indicative, hypothèses visibles et ordre de préparation."}</p>
 <ol className="space-y-4">{changements.map(([t,p],i)=><li key={t} className="border-t border-grey-line pt-4"><h3 className="mb-2 text-[1.15rem]">{i+1}. {t}</h3><p>{p}</p></li>)}</ol>
 {complet&&null}
 </section>;
}
