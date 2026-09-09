import Link from "next/link";
import type { EtatEspace } from "@/lib/espace";
import { selectionParDefaut, planPrincipal } from "@/lib/documents-pertinents";
export function MesDocuments({ etat }: { etat: EtatEspace }) {
  const hub = `/espace/${etat.acces.jeton}`;
  const selection = selectionParDefaut(
    etat.documents.map((d) => d.cle),
    etat.profil,
  );
  const principal = planPrincipal(etat.profil);
  const utiles = etat.documents.filter((d) => selection.includes(d.cle));
  const autres = etat.documents.filter((d) => !selection.includes(d.cle));
  const ligne = (d: EtatEspace["documents"][number]) => (
    <div key={d.cle} className="flex items-center gap-3 border-b border-grey-line py-3">
      <label className="flex min-h-[44px] items-center">
        <input
          type="checkbox"
          name="cle"
          value={d.cle}
          defaultChecked={selection.includes(d.cle)}
          className="h-6 w-6"
          aria-label={`Imprimer ${d.titre}`}
        />
      </label>
      <Link href={`${hub}/document/${d.cle}`}>{d.titre}</Link>
    </div>
  );
  return (
    <section id="mes-documents">
      <h2 className="mb-3 text-[1.5rem]">Mon dossier</h2>
      <p className="mb-5 border-l-4 border-blue bg-grey-bg p-4"><Link href={`${hub}/demarrer`}>Quel document ouvrir et comment le remplir ? Suivre le mode d’emploi de mes achats.</Link></p>
      <p className="mb-5">
        Commencez par cette sélection courte. Les fiches se remplissent ; les références se lisent.
        Vous n’avez pas besoin de tout imprimer.
      </p>
      {principal && etat.documents.some((d) => d.cle === principal) && (
        <p className="mb-5 border-l-4 border-orange p-4">
          Point de départ d’après vos réponses :{" "}
          <Link href={`${hub}/document/${principal}`}>
            {etat.documents.find((d) => d.cle === principal)?.titre}
          </Link>
          . Une orientation de lecture, pas un diagnostic.
        </p>
      )}
      <form action={`${hub}/imprimer`} method="get">
        <h3 className="text-[1.2rem]">Pour ma préparation</h3>
        <div className="space-y-2">{utiles.map(ligne)}</div>
        {autres.length > 0 && (
          <details className="mt-6 border border-grey-line p-4">
            <summary className="min-h-[44px] cursor-pointer font-bold">
              Mes autres supports inclus ({autres.length})
            </summary>
            <p className="my-3 text-text-soft">
              À ouvrir selon vos questions. Une fiche non sélectionnée reste accessible.
            </p>
            {autres.map(ligne)}
          </details>
        )}
        <button className="mt-6 min-h-[56px] w-full bg-blue px-5 font-bold text-white">
          Préparer l’impression de ma sélection
        </button>
      </form>
    </section>
  );
}
