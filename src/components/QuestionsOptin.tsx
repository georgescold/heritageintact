"use client";

import { useState } from "react";
import { OptinForm } from "./OptinForm";

/**
 * Structure LP 3 : la LP questionnaire (règle des 3 oui).
 * Chaque réponse est un micro-engagement ; l'email devient la conclusion logique.
 *
 * ⚠️ La règle Personal Attributes de Meta s'applique aux ANNONCES, pas à cette page :
 * les questions peuvent donc interpeller directement. Ne jamais recopier une de ces
 * formulations dans une créative — là, c'est 1re ou 3e personne (08-creatives-ads.md).
 */
const QUESTIONS = [
  {
    q: "Souhaitez-vous que ce que vous avez construit revienne à vos enfants plutôt qu'à l'État ?",
    answers: ["Oui, évidemment", "Non"],
  },
  {
    q: "Accepteriez-vous d'y consacrer une soirée, si cela permettait de réduire la facture de plusieurs dizaines de milliers d'euros ?",
    answers: ["Oui", "Non"],
  },
  {
    q: "Avez-vous déjà chiffré, précisément, ce que votre succession coûtera à votre famille ?",
    answers: ["Non, jamais", "Oui, je connais le montant"],
  },
];

export function QuestionsOptin() {
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length;

  return (
    <div className="rounded border border-grey-line bg-white">
      <div className="border-b border-grey-line bg-grey-bg px-4 py-2 text-[0.9rem] font-bold text-blue">
        {done ? "Dernière étape" : `Question ${step + 1} sur ${QUESTIONS.length}`}
      </div>

      {/* Barre de progression */}
      <div className="h-2 w-full bg-grey-bg">
        <div
          className="h-full bg-orange transition-none"
          style={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="p-4 sm:p-5">
        {done ? (
          <>
            <p className="mb-4 text-[1.05rem]">
              Parfait. La vidéo de 9 minutes vous montre exactement ce que l&apos;État prendrait, et
              les 3 décisions qui changent ce chiffre. Indiquez où vous souhaitez la recevoir.
            </p>
            <OptinForm cta="Recevoir la vidéo maintenant" />
            <button
              type="button"
              onClick={() => setStep(0)}
              className="mt-3 w-full cursor-pointer text-center text-[0.85rem] text-text-soft underline"
            >
              Revoir les questions
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-[1.15rem] font-bold">{QUESTIONS[step].q}</p>
            <div className="space-y-2">
              {QUESTIONS[step].answers.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="block w-full cursor-pointer rounded border-2 border-grey-line bg-white px-4 py-3 text-left text-[1.05rem] font-bold text-blue hover:border-orange hover:bg-yellow-bg"
                >
                  {a}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-3 cursor-pointer text-[0.85rem] text-text-soft underline"
              >
                Question précédente
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
