import { EXERCICES } from "@/lib/exercices";
export function ExerciceGuide({ cle }: { cle: string }) {
  const e = EXERCICES.find(e => e.cle === cle);
  if (!e) return null;
  return <section className="my-8 border border-grey-line bg-white p-5 sm:p-7">
    <p className="mb-2 font-bold text-orange-dark">À vous de préparer</p>
    <h2 className="mb-3 text-[1.5rem]">{e.titre}</h2><p className="mb-5">{e.resultat}</p>
    <ol className="list-decimal space-y-4 pl-6">{e.gestes.map(g => <li key={g}>{g}</li>)}</ol>
    <div className="my-6 border-l-4 border-blue bg-grey-bg p-4"><h3 className="mb-2">Cas guidé, pour vous montrer comment faire</h3><p>{e.exemple}</p></div>
    <h3 className="mb-2">Vérifiez que vous avez compris</h3><p className="mb-3">{e.question}</p>
    <details className="border-y border-grey-line py-3"><summary className="min-h-[44px] cursor-pointer font-bold">Lire l’explication</summary><p className="mt-3">{e.correction}</p></details>
    <p className="mt-5"><strong>Si vous bloquez :</strong> {e.siBloque}</p>
    <p className="mt-4 text-sm text-text-soft">Travaillez sur votre feuille ou un document conservé chez vous. Aucun renseignement patrimonial n’est à saisir ici.</p>
  </section>;
}
