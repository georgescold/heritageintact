import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { QuestionsOptin } from "@/components/QuestionsOptin";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { PhotoBanner, Section } from "@/components/Lp";
import { ProofUnderButton, UrgencyBand } from "@/components/LpExtras";

export const metadata: Metadata = {
  title: "3 questions sur votre succession",
  description:
    "Trois questions, trente secondes : découvrez ce que l'État prendrait aujourd'hui sur votre succession.",
};

/**
 * VARIANTE C — la LP questionnaire (05-funnel/landing-pages.md, structure #3).
 *
 * Règle des 3 oui : chaque réponse est un micro-engagement, et l'email devient
 * la conclusion logique d'une conversation déjà entamée. Le bandeau photo reste
 * court exprès — ici, c'est le questionnaire qui doit occuper l'écran.
 */
export default function LpQuestionsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PhotoBanner
          image="/img/calendrier.jpg"
          kicker="Trois questions · trente secondes"
          title={
            <>
              Découvrez ce que l&apos;État prendrait{" "}
              <span className="text-orange">aujourd&apos;hui</span> sur votre succession.
            </>
          }
        >
          <p>
            La plupart des familles françaises n&apos;ont jamais fait ce calcul. Elles découvrent le
            montant dans le bureau du notaire, avec six mois pour le payer.
          </p>
        </PhotoBanner>

        <Section>
          <QuestionsOptin />

          <div className="mt-5">
            <ProofUnderButton />
          </div>

          <div className="mt-4">
            <UrgencyBand />
          </div>
        </Section>
      </main>
      <Footer />

      <ExitPopup
        storageKey="lp-questions"
        title="Avant de partir : savez-vous laquelle de vos trois dates se ferme en premier ?"
      >
        <OptinForm cta="Recevoir les 3 dates" />
      </ExitPopup>
    </>
  );
}
