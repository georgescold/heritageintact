export function DemonstrationPack() {
  return (
    <section className="my-8 border border-grey-line bg-[#f5f2eb] p-5 sm:p-7">
      <p className="mb-2 text-sm font-bold text-orange-dark">
        UNE MÊME QUESTION, UNE PRÉPARATION PLUS APPROFONDIE
      </p>
      <h2 className="mb-4 text-[1.5rem]">
        « Quelles hypothèses dois-je faire vérifier avant de donner ? »
      </h2>
      <p className="mb-5 text-sm">
        Exemple fictif d’utilisation. Ce n’est ni un témoignage ni une recommandation de donation.
      </p>
      <ol className="grid gap-4 sm:grid-cols-3">
        <li className="border border-grey-line bg-white p-4">
          <h3 className="mb-3 font-bold">1. Avec le guide</h3>
          <p>
            Vous distinguez propriété, droits de votre famille et fiscalité. Vous notez votre
            priorité et vos premières questions.
          </p>
        </li>
        <li className="border border-grey-line bg-white p-4">
          <h3 className="mb-3 font-bold">2. Avec le Dossier</h3>
          <p>
            Vous rassemblez les pièces connues et manquantes. Vous préparez la demande de
            rendez-vous avec une trame et un exemple.
          </p>
        </li>
        <li className="border-2 border-blue bg-white p-4">
          <h3 className="mb-3 font-bold">3. Le pack ajoute</h3>
          <p>
            Vous consultez la fiche familiale utile, comparez deux scénarios couverts par l’atelier
            et inscrivez les hypothèses et points à vérifier dans votre suivi.
          </p>
        </li>
      </ol>
      <div className="mt-5 border-l-4 border-blue bg-white p-4">
        <h3 className="mb-2 font-bold">Ce que vous pouvez apporter à l’échange</h3>
        <p>
          « Voici les informations que j’ai retrouvées, celles qu’il me manque et les hypothèses que
          j’ai explorées. Lesquelles correspondent réellement à ma situation ? »
        </p>
      </div>
      <p className="mt-4 text-sm">
        Le simulateur demande de confirmer son cadre simplifié et affiche ses hypothèses. Il ne
        couvre pas toutes les situations et ne remplace pas la vérification du professionnel.
      </p>
    </section>
  );
}
