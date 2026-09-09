import { Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/**
 * LES 12 QUESTIONS À POSER À VOTRE NOTAIRE (bonus B2), et les 3 à ne pas poser.
 *
 * ⚠️ Chaque question est fermée et porte sur SA situation. Une question ouverte
 * — « vous me conseillez quoi ? » — appelle une réponse générale, et c'est
 * exactement ce qui fait ressortir le lecteur avec « revenez quand vous
 * saurez ».
 *
 * ⚠️ AUCUN MONTANT D'ÉMOLUMENTS N'EST ÉCRIT ICI. Le barème est réglementé,
 * révisé par arrêté, et l'assiette d'une donation de nue-propriété est la
 * pleine propriété du bien : un ordre de grandeur imprimé aujourd'hui serait
 * faux dans un an et cité contre nous. On fait poser la question au notaire,
 * qui est la seule personne habilitée à chiffrer son acte.
 */

const QUESTIONS: string[] = [
  "Compte tenu de mon régime matrimonial, qu'est-ce qui appartient à mon conjoint et qu'est-ce qui m'appartient en propre ?",
  "Avons-nous une donation au dernier vivant ? Si non, qu'est-ce qu'elle changerait dans notre cas ?",
  "Quelle serait la part de chacun de mes enfants si la succession s'ouvrait aujourd'hui ?",
  "D'après le calcul que j'ai apporté, mes enfants devraient payer ce montant. Le confirmez-vous ?",
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
      "Sans dossier sous les yeux, il ne peut répondre que par des généralités. Apportez vos chiffres et la question devient répondable.",
  },
  {
    question: "« Combien je vais payer ? »",
    pourquoi:
      "Ce n'est pas vous qui paierez : ce sont vos héritiers, chacun sur sa part. Demandez plutôt ce que paiera chaque enfant.",
  },
  {
    question: "« Est-ce qu'on peut éviter les impôts ? »",
    pourquoi:
      "La question ferme la conversation. On n'évite pas l'impôt, on utilise ce que la loi prévoit — et il y a beaucoup à utiliser.",
  },
];

export function QuestionsNotaire() {
  return (
    <Feuille
      titre="Les 12 questions à poser à votre notaire"
      sousTitre="Emportez cette feuille. Cochez au fur et à mesure, et notez la réponse à côté."
    >
      <p>
        {/* ⚠️ CETTE PHRASE DISAIT « Le notaire est payé à l'acte, et il acte ce
            que vous lui demandez ». Les deux affirmations sont fausses, et la
            seconde est dénigrante pour une profession réglementée (art. 1240 du
            code civil) : le notaire a un devoir de conseil, qui existe dès le
            premier rendez-vous, et il peut refuser un acte illégal.

            Elle était surtout contredite mot pour mot par la vidéo de
            l'étape 7, que le membre regarde AVEC cette feuille sous les yeux. */}
        Le notaire a un devoir de conseil, et il existe dès le premier rendez-vous. Mais il ne
        devine pas votre projet : ces douze questions le lui donnent en vingt minutes.
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

      <Titre>Les 3 questions à ne pas poser</Titre>
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
