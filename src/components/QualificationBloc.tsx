"use client";
import { useState } from "react";
import type { Reponses } from "@/lib/qualification";
import { QUESTIONS as questions } from "@/lib/questionnaire";
export function QualificationBloc({ onTermine, initial }: { onTermine: (r: Reponses) => void; initial?: Reponses }) {
  const [index, setIndex] = useState(0);
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
      <h2 className="my-4 text-[1.4rem]" aria-live="polite">
        {q.titre}
      </h2>
      <div className="space-y-2">
        {q.choix.map(([code, label]) => (
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

      </div>
    </section>
  );
}
