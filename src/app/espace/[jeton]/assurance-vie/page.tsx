import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { VideoEmbed } from "@/components/VideoEmbed";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { VIDEO } from "@/lib/config";
const ETAPES = [
  [
    "1. Retrouvez la bonne version",
    "Rassemblez votre relevé, l’historique des versements, la clause bénéficiaire en vigueur et ses avenants. Un souvenir ou une brochure ne suffit pas. Si une pièce manque, utilisez la demande d’informations ; ne devinez pas.",
  ],
  [
    "2. Séparez quatre informations",
    "Pour chaque contrat, relevez qui est assuré, quand il a été ouvert, quand les versements ont été effectués et à qui le capital est destiné. L’âge à l’ouverture ne remplace pas l’âge au moment des versements. Les règles des contrats anciens nécessitent une vérification spécifique.",
  ],
  [
    "3. Comprenez sans choisir une clause toute faite",
    "Un bénéficiaire peut être désigné à un rang prioritaire, puis d’autres à défaut. Une répartition entre plusieurs personnes n’est pas la même chose. Demandez ce qui se passe si une personne décède avant vous, renonce ou si la famille change. Ne copiez pas une clause juridique sans validation.",
  ],
  [
    "4. Ne comparez pas seulement deux abattements",
    "Les régimes fiscaux usuels avant et après 70 ans ne reposent pas sur la même assiette. Les exonérations et l’historique du contrat comptent aussi. Une différence de seuil ne prouve ni une économie ni l’intérêt d’un versement ou d’un rachat.",
  ],
  [
    "5. Préparez un échange traçable",
    "Adressez vos questions à l’assureur par son canal habituel. Demandez confirmation des documents à jour, de l’existence éventuelle d’une acceptation du bénéficiaire et du régime applicable. Conservez la réponse. En cas de projet de modification, faites d’abord vérifier sa cohérence par votre notaire.",
  ],
  [
    "6. Votre livrable",
    "Une fiche par contrat : documents reçus, informations manquantes, trois questions et prochaine date de suivi. Une case inconnue est un point à éclaircir, pas la preuve que votre contrat est mauvais. Aucune opération financière n’est nécessaire pour terminer ce module.",
  ],
];
export default async function Page({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;
  if (!estJetonValide(jeton)) return <LienInvalide />;
  const e = await chargerEspace(jeton);
  if (!e || e.acces.revoque || !e.possede.has("upsell2")) return <LienInvalide />;
  return (
    <>
      <Header minimal />
      <main className="wrap flex-1 py-8">
        <Link href={`/espace/${jeton}?vue=outils`}>Mes outils</Link>
        <h1 className="my-5 text-[2rem]">Faire le point sur mon assurance-vie</h1>
        <p className="mb-6 text-lg">
          Objectif : comprendre vos documents et préparer une demande d’informations. Pas choisir un
          placement ni rédiger seul une clause.
        </p>
        {VIDEO.etapes[2] && (
          <VideoEmbed
            id={VIDEO.etapes[2]}
            title="Lire votre contrat sans le modifier"
            dejaPossede
          />
        )}
        <article className="space-y-7">
          {ETAPES.map(([t, p]) => (
            <section key={t}>
              <h2 className="mb-2 text-[1.3rem]">{t}</h2>
              <p className="leading-relaxed">{p}</p>
            </section>
          ))}
        </article>
        <p className="my-6 border-l-4 border-blue bg-grey-bg p-4"><Link href={`/espace/${jeton}/demarrer#guide-upsell2`}>Suivre les trois séances : grille, questions, demande et suivi</Link></p>
        <section className="my-8 border border-grey-line p-5">
          <h2 className="mb-3 text-[1.4rem]">Exemple fictif : ce que Marc note dans sa grille</h2>
          <p className="mb-3">Marc retrouve son relevé annuel, mais seulement une ancienne photocopie de la clause. Il inscrit « relevé reçu » et « clause actuellement enregistrée à demander ». Il ne recopie pas l’ancienne version comme si elle était confirmée.</p>
          <p className="mb-3">Sa demande porte sur la version en vigueur, ses avenants et l’historique des versements. Dans le suivi, il note la date d’envoi puis, à réception, les pièces obtenues et la question restant sans réponse.</p>
          <p><strong>Pour terminer votre séance :</strong> vous devez pouvoir nommer le contrat, la pièce demandée et la prochaine action. Vous n’avez pas à avoir modifié un contrat ni obtenu une réponse pour avoir avancé.</p>
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
        <p className="mt-8 text-sm">
          Repères du 9 septembre 2026.{" "}
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
