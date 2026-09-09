import { orienter } from "@/app/orientation/actions";
export function OrientationAvant() {
  return <section id="orientation" className="border-2 border-blue bg-white p-5 sm:p-7">
    <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-dark">Votre point de départ</p>
    <h2 className="mb-3 text-[1.4rem]">Qu’aimeriez-vous avoir clarifié en premier ?</h2>
    <p className="mb-5 text-text-soft">Une seule réponse pour adapter la présentation. Aucun email ni montant de patrimoine demandé.</p>
    <form action={orienter} className="space-y-3">
      {[["comprendre", "Comprendre ce qui concerne ma famille"], ["preparer", "Préparer mon rendez-vous chez le notaire"], ["assurance-vie", "Faire le point sur mon assurance-vie"]].map(([code, texte]) =>
        <button key={code} name="objectif" value={code} className="flex min-h-[60px] w-full items-center justify-between gap-3 border border-grey-line p-4 text-left font-bold text-blue hover:border-blue hover:bg-grey-bg">{texte}<span aria-hidden="true">→</span></button>)}
      <button name="objectif" value="passer" className="min-h-[44px] underline">Voir la présentation sans répondre</button>
    </form>
    <p className="mt-3 text-sm text-text-soft">Choix conservé 7 jours dans ce navigateur pour éviter de vous le redemander. Modifiable à tout moment.</p>
  </section>;
}
