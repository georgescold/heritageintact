import Link from "next/link";
import { IntroductionProduit } from "@/components/IntroductionProduit";
import { SuiteProduit } from "@/components/SuiteProduit";
import { Header, Footer } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { EXPLICATIONS_ASSURANCE as ETAPES } from "@/lib/assurance-explications";
export default async function Page({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  if (!estJetonValide(jeton)) return <LienInvalide />;
  const e = await chargerEspace(jeton);
  if (!e || e.acces.revoque || !e.possede.has("upsell2")) return <LienInvalide />;
  return (
    <>
      <Header minimal />
      <main className="wrap flex-1 py-8">
        <Link href={`/espace/${jeton}?vue=dossier`}>Mon dossier</Link>
        <h1 className="my-5 text-[2rem]">Faire le point sur mon assurance-vie</h1>
        <IntroductionProduit sku="upsell2" />
        <a className="mb-6 inline-flex min-h-[48px] items-center border-2 border-blue px-4 font-bold" href={`/espace/${jeton}/pdf/assurance-vie`}>Télécharger mon guide assurance-vie en PDF</a>
        <article className="space-y-7">
          {ETAPES.map(([t, p]) => (
            <section key={t}>
              <h2 className="mb-2 text-[1.3rem]">{t}</h2>
              <p className="leading-relaxed">{p}</p>
            </section>
          ))}
        </article>
        <p className="my-6 border-l-4 border-blue bg-grey-bg p-4"><Link href={`/espace/${jeton}/demarrer#guide-upsell2`}>Retrouver la grille, les questions et le courrier</Link></p>
        <section className="my-8 border border-grey-line p-5">
          <h2 className="mb-3 text-[1.4rem]">Cas guidé : ce que Marc note dans sa grille</h2>
          <p className="mb-3">Marc retrouve son relevé annuel, mais seulement une ancienne photocopie de la clause. Il inscrit « relevé reçu » et « clause actuellement enregistrée à demander ». Il ne recopie pas l’ancienne version comme si elle était confirmée.</p>
          <p className="mb-3">Sa demande porte sur la version en vigueur, ses avenants et l’historique des versements. Dans le suivi, il note la date d’envoi puis, à réception, les pièces obtenues et la question restant sans réponse.</p>
          <p><strong>À retenir :</strong> une pièce manquante appelle une demande, pas une modification précipitée. Le courrier inclus vous aide à la formuler.</p>
        </section>
        <h2 className="mb-3 mt-8 text-[1.4rem]">Vos fiches de travail</h2>
        <ul className="space-y-3">
          {e.documents
            .filter((d) =>
              [
                "grille-audit-assurance-vie",
                "trois-clauses-beneficiaires",
                "decision-70-ans",
                "lettre-modification-clause",
              ].includes(d.cle),
            )
            .map((d) => (
              <li key={d.cle}>
                <Link href={`/espace/${jeton}/document/${d.cle}`}>{d.titre}</Link>
              </li>
            ))}
        </ul>
        <SuiteProduit moment="upsell2" possede={e.possede} profil={e.profil} hub={"/espace/"+jeton} conclusion />
        <p className="mt-8 text-sm">
          Source à consulter dans sa version en vigueur :{" "}
          <a href="https://www.impots.gouv.fr/je-suis-beneficiaire-dune-assurance-vie">
            Documentation fiscale officielle sur l’assurance-vie
          </a>
          . Faites confirmer son application à votre contrat.
        </p>
      </main>
      <Footer />
    </>
  );
}
