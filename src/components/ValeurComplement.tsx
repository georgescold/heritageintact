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
 <h2 className="mb-3 text-[1.4rem]">{av?"Vos intentions méritent mieux qu’une ancienne photocopie.":"Le guide vous montre quoi regarder. Le pack vous évite d’inventer seul toute la suite."}</h2>
 <p className="mb-5">{av?"Vous n’achetez pas un autre placement. Vous achetez le fil pour interroger celui que vous avez déjà.":"Vous avez votre point de départ avec Les 7 erreurs. Si vous voulez aller jusqu’à la préparation familiale et au suivi du rendez-vous, voici ce que le complément change."}</p>
 <ol className="space-y-4">{changements.map(([t,p],i)=><li key={t} className="border-t border-grey-line pt-4"><h3 className="mb-2 text-[1.15rem]">{i+1}. {t}</h3><p>{p}</p></li>)}</ol>
 {complet&&<p className="mt-5 border border-blue bg-white p-4"><strong>Maison + famille + assurance-vie, dans le même pack.</strong> La vérification des contrats n’est pas laissée de côté : son guide, ses trames et son suivi sont inclus, sans second achat à prévoir pour ces supports.</p>}
 </section>;
}
