"use client";
import { useState } from "react";
import type { Reponses } from "@/lib/qualification";
const questions: { champ: keyof Reponses; titre: string; choix: [string, string][] }[] = [
  {
    champ: "objectif",
    titre: "Que souhaitez-vous clarifier en priorité ?",
    choix: [
      ["comprendre", "Comprendre les bases"],
      ["preparer", "Préparer mon rendez-vous"],
      ["assurance-vie", "Faire le point sur mon assurance-vie"],
    ],
  },
  {
    champ: "vie",
    titre: "Quelle est votre situation aujourd’hui ?",
    choix: [
      ["M", "Marié(e)"],
      ["P", "Pacsé(e)"],
      ["U", "En couple sans mariage ni PACS"],
      ["V", "Veuf ou veuve"],
      ["S", "Seul(e)"],
    ],
  },
  {
    champ: "enfants",
    titre: "Avez-vous des enfants ?",
    choix: [
      ["1", "Un enfant"],
      ["2", "Deux enfants ou plus"],
      ["R", "Au moins un enfant d’une autre union"],
      ["0", "Pas d’enfant"],
    ],
  },
  {
    champ: "av",
    titre: "Possédez-vous une assurance-vie ?",
    choix: [
      ["O", "Oui"],
      ["N", "Non"],
      ["?", "Je ne sais pas"],
    ],
  },
];
export function QualificationBloc({ onTermine, initial }: { onTermine: (r: Reponses) => void; initial?: Reponses }) {
  const [index, setIndex] = useState(initial?.objectif ? 1 : 0);
  const [r, setR] = useState<Reponses>(initial ?? {});
  const q = questions[index];
  function choix(code: string) {
    const suite = { ...r, [q.champ]: code };
    setR(suite);
    if (index === questions.length - 1) onTermine(suite);
    else setIndex(index + 1);
  }
  return (
    <section className="border border-grey-line bg-white p-5">
      <p className="mb-4 text-text-soft">
        Ces réponses facultatives orientent vos supports et, si cela vous est utile, une proposition
        de préparation. Aucun montant de patrimoine ne vous est demandé.
      </p>
      <p className="font-bold text-orange-dark">
        Question {index + 1} sur {questions.length}
      </p>
      <h2 className="my-4 text-[1.4rem]" aria-live="polite">
        {q.titre}
      </h2>
      <div className="space-y-2">
        {[...q.choix, ["X", "Je préfère ne pas répondre"]].map(([code, label]) => (
          <button
            type="button"
            key={code}
            onClick={() => choix(code)}
            className="min-h-[56px] w-full border border-grey-line p-3 text-left hover:bg-grey-bg"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {index > 0 && (
          <button
            type="button"
            className="min-h-[44px] underline"
            onClick={() => setIndex(index - 1)}
          >
            Question précédente
          </button>
        )}
        <button
          type="button"
          className="min-h-[44px] underline"
          onClick={() => onTermine({ ...r, objectif: "comprendre" })}
        >
          Accéder directement à mon achat
        </button>
      </div>
    </section>
  );
}
