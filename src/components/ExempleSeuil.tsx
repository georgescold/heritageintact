/** Calcul pédagogique reproductible. Même bien, même donateur, même enfant, seul l’âge change. */
export function ExempleSeuil() {
 return <section className="my-8 border-2 border-red p-5">
   <p className="text-sm font-bold uppercase text-orange-dark">Un exemple chiffré, pas une promesse d’économie</p>
   <h2 className="my-3 text-[1.6rem]">9 600 € de droits en plus dans cet exemple. Pour le même bien.</h2>
   <p>Un parent seul propriétaire donne la nue-propriété d’une maison de 480 000 € à un enfant et conserve l’usufruit viager. Aucun don antérieur, abattement de 100 000 € entièrement disponible. On compare uniquement l’âge au jour de la donation.</p>
   <div className="my-4 grid gap-3 sm:grid-cols-2">
     <div className="bg-grey-bg p-4"><h3>À 70 ans</h3><p>60% × 480 000 € = 288 000 €.</p><p>Après abattement : 188 000 € taxables.</p><p className="mt-2 text-xl font-bold">Environ 35 794 € de droits.</p></div>
     <div className="bg-red-bg p-4"><h3>À 71 ans</h3><p>70% × 480 000 € = 336 000 €.</p><p>Après abattement : 236 000 € taxables.</p><p className="mt-2 text-xl font-bold">Environ 45 394 € de droits.</p></div>
   </div>
   <p className="font-bold">Le bon réflexe : faire examiner les dates avant le projet, pas après.</p>
   <p className="mt-3 text-sm text-text-soft">Hors frais d’acte et autres paramètres. Ce cas ne décrit pas votre famille et ne recommande pas une donation. L’achat du guide ne réserve aucun régime fiscal. Sources officielles à consulter dans leur version en vigueur : <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">abattement et barème</a>, <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934">usufruit viager</a>.</p>
 </section>;
}
