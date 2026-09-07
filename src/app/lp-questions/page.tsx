import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { QuestionsOptin } from "@/components/QuestionsOptin";
import { OptinForm } from "@/components/OptinForm";
import { CTA } from "@/lib/config";
import { ExitPopup } from "@/components/ExitPopup";
import { PhotoBanner, Section } from "@/components/Lp";
import { UrgencyBand } from "@/components/LpExtras";
import { UrgencyBar, UrgencyUnderButton } from "@/components/Urgency";

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
      <UrgencyBar />
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

          <div className="mt-4">
            <UrgencyUnderButton />
          </div>

          {/* « D'où viennent ces chiffres ? » retiré le 6 septembre 2026, pour
              la même raison que sur `/` : le bloc cite cinq articles du Code
              pour justifier un calcul que cette page ne montre nulle part. Il
              répondait à une question que le lecteur ne s'était pas posée, et
              lui apprenait au passage qu'il lui manquait quelque chose. Sa
              place est sur /methode, sous le calcul détaillé. */}
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
        <OptinForm cta={CTA.optin} />
      </ExitPopup>
    </>
  );
}
