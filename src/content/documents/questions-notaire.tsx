import { Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/** Douze questions à sélectionner et préciser avec le notaire, selon les pièces disponibles. */

const QUESTIONS: string[] = [
  "Compte tenu de mon régime matrimonial, qu'est-ce qui appartient à mon conjoint et qu'est-ce qui m'appartient en propre ?",
  "Avons-nous une donation au dernier vivant ? Si non, qu'est-ce qu'elle changerait dans notre cas ?",
  "Quelle serait la part de chacun de mes enfants si la succession s'ouvrait aujourd'hui ?",
  "Quelles hypothèses faut-il vérifier pour estimer les droits de chacun, et quels frais faut-il distinguer ?",
  "Ai-je intérêt à donner la nue-propriété de ma résidence principale, et à quelle valeur serait-elle comptée à mon âge ?",
  "Si je fais cette donation, que se passe-t-il si je dois entrer en maison de retraite ? Puis-je louer le bien ?",
  "Une clause de retour et une interdiction d'aliéner sont-elles utiles dans mon cas, et que coûtent-elles ?",
  "Les dons que j'ai déjà faits ont-ils été déclarés ? Lesquels seront recomptés, et jusqu'à quelle date ?",
  "Une donation-partage entre mes enfants est-elle possible chez moi, et qu'est-ce qu'elle éviterait ?",
  "La clause bénéficiaire de mes contrats d'assurance-vie est-elle cohérente avec le reste de mon dossier ?",
  "Quel est le coût complet des actes que nous venons d'évoquer, tout compris, et sur quelle valeur est-il calculé ?",
  "Qu'est-ce que je dois faire en premier, et avant quelle date ?",
];

const A_EVITER: { question: string; pourquoi: string }[] = [
  {
    question: "« Vous me conseillez quoi ? »",
    pourquoi:
      "Précisez votre objectif et ce qui manque : « Je souhaite protéger mon conjoint sans déséquilibrer les enfants ; quels points faut-il examiner ? »",
  },
  {
    question: "« Combien je vais payer ? »",
    pourquoi:
      "Distinguez les droits de chaque bénéficiaire, les frais d’acte et les honoraires éventuels. Demandez qui peut ou doit prendre chaque somme en charge dans votre projet.",
  },
  {
    question: "« Est-ce qu'on peut éviter les impôts ? »",
    pourquoi:
      "Demandez quels dispositifs légaux sont adaptés à votre situation, avec leurs conditions, leurs coûts et leurs conséquences. Une réduction d’impôt ne suffit pas à rendre une décision souhaitable.",
  },
];

export function QuestionsNotaire() {
  return (
    <Feuille
      titre="Les 12 questions à poser à votre notaire"
      sousTitre="Emportez cette feuille. Cochez au fur et à mesure, et notez la réponse à côté."
    >
      <p>
        Le notaire a un devoir de conseil, et il existe dès le premier rendez-vous. Mais il ne
        devine pas votre projet : choisissez les questions pertinentes et signalez les informations
        qui restent à retrouver. Il peut en faire apparaître d’autres.
      </p>

      <ol className="divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          <li key={q} className="py-2">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
              />
              <p>
                <strong>{i + 1}.</strong> {q}
              </p>
            </div>
            <div className="ml-[30px] mt-1 min-h-[36px] border-b border-black" />
          </li>
        ))}
      </ol>

      <Titre>Trois questions à rendre plus précises</Titre>
      <div className="space-y-2">
        {A_EVITER.map((a) => (
          <Encadre key={a.question} titre={a.question}>
            <p className="text-[0.93rem]">{a.pourquoi}</p>
          </Encadre>
        ))}
      </div>

      <Titre>À la fin du rendez-vous</Titre>
      <Champ label="Ce qui a été décidé" />
      <Champ label="Ce que je dois fournir, et pour quand" />
      <Champ label="Prochain rendez-vous le" />
    </Feuille>
  );
}
