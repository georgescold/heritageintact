import type { ProductSku } from "@/lib/config";

const COMPARATIFS = {
  bump: {
    titre: "La différence entre ceux qui préparent leur rendez-vous chez le notaire — et ceux qui l’improvisent",
    risqueTitre: "Ceux qui comptent sur leur mémoire",
    risqueIntro: "Ils ne manquent pas de sérieux. Mais leur préparation repose sur le réflexe le plus fragile : croire qu’ils se souviendront de tout au bon moment.",
    risques: [
      "Ils arrivent avec une pile de papiers, sans voir la pièce décisive qui manque.",
      "Ils laissent le stress choisir les questions posées et les sujets oubliés.",
      "Ils peuvent repartir avec un second échange à organiser — et des recherches ou honoraires supplémentaires à vérifier.",
    ],
    qualiteTitre: "Ceux qui arrivent avec un dossier préparé",
    qualiteIntro: "Leur force n’est pas de tout connaître. C’est d’avoir remplacé l’improvisation par une préparation visible, vérifiable et facile à suivre.",
    qualites: [
      "Ils repèrent les pièces absentes avant qu’elles ne bloquent le rendez-vous.",
      "Ils hiérarchisent leurs questions au lieu de laisser l’échange partir dans tous les sens.",
      "Ils conservent les réponses, le responsable et la prochaine date pour ne rien recommencer.",
    ],
    chute: "Improviser donne l’impression de gagner du temps avant le rendez-vous. C’est souvent après que l’on paie ce temps : nouvel échange, document à rechercher et décision encore repoussée.",
  },
  upsell2: {
    titre: "La différence entre ceux qui vérifient leur assurance-vie — et ceux qui se fient à leurs souvenirs",
    risqueTitre: "Ceux que leur relevé rassure trop vite",
    risqueIntro: "Ils regardent le capital et supposent que le reste est réglé. Cette sécurité apparente peut cacher l’information que l’assureur appliquera réellement.",
    risques: [
      "Ils confondent le montant visible avec la clause bénéficiaire enregistrée.",
      "Ils pensent qu’une conversation ou une ancienne intention a automatiquement modifié le contrat.",
      "Ils risquent de laisser un ancien nom ou une répartition imprécise n’apparaître que lorsqu’il sera trop tard pour les corriger.",
    ],
    qualiteTitre: "Ceux qui exigent une preuve écrite",
    qualiteIntro: "Ils ne modifient rien à l’aveugle. Ils vérifient d’abord ce qui existe, puis font examiner les conséquences avant de décider.",
    qualites: [
      "Ils retrouvent la clause réellement détenue par l’assureur.",
      "Ils reconstituent les versements avant et après 70 ans au lieu de supposer.",
      "Ils conservent une réponse écrite et savent précisément quel point faire vérifier.",
    ],
    chute: "Le contrat n’exécutera ni vos souvenirs ni vos conversations familiales. Il exécutera ce qui est effectivement enregistré le jour où vous ne pourrez plus l’expliquer.",
  },
} as const;

export function ComparatifDecision({ sku }: { sku: ProductSku }) {
  if (sku !== "bump" && sku !== "upsell2") return null;
  const contenu = COMPARATIFS[sku];

  return (
    <section className="my-7 border-2 border-blue bg-white p-4 shadow-[0_6px_18px_rgba(9,55,96,0.08)] sm:p-6">
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-dark">Deux façons d’aborder la même situation</p>
      <h2 className="mb-5 text-[1.45rem] leading-snug sm:text-[1.7rem]">{contenu.titre}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="border-2 border-red bg-red-bg p-4 sm:p-5">
          <p className="mb-2 font-bold uppercase tracking-wide text-red">✕ Le réflexe qui expose</p>
          <h3 className="mb-3 text-[1.2rem]">{contenu.risqueTitre}</h3>
          <p className="mb-4">{contenu.risqueIntro}</p>
          <ul className="space-y-3">
            {contenu.risques.map(risque => <li key={risque} className="flex gap-2"><span aria-hidden="true" className="font-bold text-red">✕</span><span>{risque}</span></li>)}
          </ul>
        </article>
        <article className="border-2 border-green bg-green-bg p-4 sm:p-5">
          <p className="mb-2 font-bold uppercase tracking-wide text-green">✓ Le réflexe qui protège</p>
          <h3 className="mb-3 text-[1.2rem]">{contenu.qualiteTitre}</h3>
          <p className="mb-4">{contenu.qualiteIntro}</p>
          <ul className="space-y-3">
            {contenu.qualites.map(qualite => <li key={qualite} className="flex gap-2"><span aria-hidden="true" className="font-bold text-green">✓</span><span>{qualite}</span></li>)}
          </ul>
        </article>
      </div>
      <p className="mt-4 border-l-4 border-orange bg-grey-bg p-4 font-bold">{contenu.chute}</p>
    </section>
  );
}
