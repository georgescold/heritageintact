import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { QuestionsOptin } from "@/components/QuestionsOptin";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ProofUnderButton, UrgencyBand } from "@/components/LpExtras";

export const metadata: Metadata = {
  title: "3 questions sur votre succession",
};

/**
 * VARIANTE C : la LP questionnaire (structure LP 3), celle qui performe le mieux aux États-Unis.
 * Règle des 3 oui : chaque réponse est un micro-engagement, et l'email devient la conclusion
 * logique d'une conversation déjà entamée.
 */
export default function LpQuestionsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="wrap py-6 sm:py-12">
          <h1 className="mb-3 text-[1.5rem] sm:text-[2rem]">
            Trois questions, trente secondes : découvrez ce que l&apos;État prendrait sur votre
            succession.
          </h1>
          <p className="mb-6 text-[1.05rem] text-text-soft">
            La plupart des familles françaises n&apos;ont jamais fait ce calcul. Elles découvrent le
            montant dans le bureau du notaire, avec six mois pour le payer.
          </p>

          <QuestionsOptin />

          <div className="mt-5">
            <UrgencyBand />
          </div>

          <div className="mt-4">
            <ProofUnderButton />
          </div>
        </section>
      </main>
      <Footer />

      <ExitPopup
        storageKey="lp-questions"
        title="Avant de partir : voulez-vous connaître les 3 dates qui ferment des portes sur votre succession ?"
      >
        <OptinForm cta="Recevoir les 3 dates" />
      </ExitPopup>
    </>
  );
}
