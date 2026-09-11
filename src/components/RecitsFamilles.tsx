import Image from "next/image";

/** Personnages des anciennes pages : récits illustratifs, jamais avis de clients. */
export function RecitJeanPierre() {
  return (
    <section id="jean-pierre" className="my-12 border-y border-grey-line bg-grey-bg py-7 sm:p-7" aria-labelledby="jean-pierre-titre">
      <div className="grid items-start gap-6 md:grid-cols-[0.85fr_1.15fr]">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/img/jean-pierre.jpg" alt="Illustration de Jean-Pierre, devant une lettre à sa table de cuisine." fill sizes="(min-width: 768px) 320px, 90vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 border-l-4 border-blue px-3 text-sm">
            <strong>Jean-Pierre, 67 ans</strong><br />Récit illustratif inspiré des questions fréquentes de nos lecteurs.
          </figcaption>
        </figure>
        <div className="space-y-4 px-4 text-[1.08rem] sm:px-0">
          <p className="font-bold uppercase tracking-wide text-orange-dark">Vous avez travaillé pour eux.</p>
          <h2 id="jean-pierre-titre" className="text-[1.65rem] leading-tight">Jean-Pierre a payé sa maison. Il pensait avoir fait le plus dur.</h2>
          <p>Un pavillon près de Nantes. Le jardin qu’il entretient le dimanche. Une maison remboursée après vingt-deux ans de travail. Pour Jean-Pierre, ces murs ne sont pas une ligne sur un relevé : c’est ce qu’il veut laisser à sa famille.</p>
          <p>Une assurance-vie à la banque, quelques papiers rangés, des enfants qui s’en sortent. La transmission ? « On en parlera quand on aura un moment. »</p>
          <p className="border-l-4 border-orange bg-white p-4 font-bold text-blue">Mais payer une maison ne règle pas, à lui seul, les droits de chacun ni la manière de la transmettre.</p>
          <p>Ce qui l’inquiète, ce n’est pas seulement l’impôt. C’est d’imaginer ses proches devoir chercher les contrats, comprendre ses choix et trouver des réponses au moment où il ne sera plus là pour les aider.</p>
          <p>Si vous vous reconnaissez, vous n’avez pas à vous reprocher de ne pas être spécialiste. Vous avez construit votre patrimoine. La prochaine étape, c’est de comprendre ce qu’il faut préparer autour.</p>
        </div>
      </div>
    </section>
  );
}

export function RecitMartine() {
  return (
    <section id="martine" className="my-12 border-y border-grey-line bg-grey-bg py-7 sm:p-7" aria-labelledby="martine-titre">
      <div className="grid items-start gap-6 md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4 px-4 text-[1.08rem] sm:px-0">
          <p className="font-bold uppercase tracking-wide text-orange-dark">Elle sait ce que les papiers peuvent peser.</p>
          <h2 id="martine-titre" className="text-[1.65rem] leading-tight">Martine ne veut pas laisser à ses enfants le désordre qu’elle a dû traverser.</h2>
          <p>Depuis la mort de son mari, Martine, 71 ans, connaît ces journées passées à retrouver un contrat, rappeler un organisme, réexpliquer la situation. Au milieu du chagrin, les démarches continuaient.</p>
          <p>Elle pense à la maison de vacances, aux repas avec les petits-enfants. Elle voudrait que ses trois enfants sachent ce qui existe, où le trouver et quelles questions poser. Pas qu’ils aient à tout deviner.</p>
          <p>Elle a une assurance-vie depuis longtemps. Mais quand elle reprend son contrat, une question surgit : les dates de ses versements ont-elles été examinées, ou a-t-elle simplement supposé que tout était réglé ?</p>
          <p className="border-l-4 border-orange bg-white p-4 font-bold text-blue">Avoir un contrat ne suffit pas à savoir ce qu’il prévoit pour ceux que vous aimez.</p>
          <p>Avant ou après 70 ans, le régime des versements peut différer. Cela ne signifie pas que tout est perdu après cet âge. Cela signifie qu’il faut vérifier les dates, les bénéficiaires et les règles applicables, au lieu de décider sur une impression.</p>
          <p>Le souhait de Martine est simple : pouvoir dire « voilà ce que j’ai préparé » plutôt que laisser cette conversation toujours à plus tard.</p>
        </div>
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/img/martine.jpg" alt="Illustration de Martine, assise devant ses documents de famille." fill sizes="(min-width: 768px) 320px, 90vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 border-l-4 border-blue px-3 text-sm">
            <strong>Martine, 71 ans</strong><br />Récit illustratif inspiré des questions fréquentes de nos lecteurs.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
