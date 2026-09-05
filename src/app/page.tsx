import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ProofUnderButton } from "@/components/LpExtras";
import { StickyCta } from "@/components/StickyCta";
import {
  BeforeAfter,
  Disqualification,
  Hero,
  NotThis,
  Section,
  SectionTitle,
  TheEnemy,
  TheFear,
  TheGap,
  TheNumber,
  TheyWillManage,
  ThreeDoors,
} from "@/components/Lp";
import {
  TheDoubt,
  TheDreamFirst,
  TheFailure,
  TheGuarantee,
  TheMechanism,
  TheStaircase,
} from "@/components/LpCeo";

export const metadata: Metadata = {
  title: "Combien l'État prendra-t-il sur ce que vous laisserez ?",
  description:
    "Vous avez plus de 60 ans, une maison payée et des enfants ? Découvrez en 20 minutes ce que l'État prendra sur votre succession, et les trois décisions légales qui le réduisent.",
};

/**
 * VARIANTE A — LP MAX (structure #6) montée sur la structure CEO.
 *
 * Le squelette vient de `03-marketing-copy/structure-ceo.md`, les onze blocs,
 * dans l'ordre. Ce qui ne bouge jamais : le rêve est en premier, l'ennemi
 * précède le mécanisme, le mécanisme précède le rêve final, l'urgence précède
 * le CTA.
 *
 *   1. RÊVE                TheDreamFirst
 *   2. ÉCHEC               TheFailure — « ce n'est pas votre faute »
 *   3. PEUR                TheNumber + TheFear
 *   4. ENNEMI              TheEnemy
 *   5. DOUTE               TheDoubt + NotThis + TheyWillManage
 *   6. PREUVE / BIG IDEA   TheGap + BeforeAfter
 *   7. MÉCANISME           TheMechanism — les 3 Verrous
 *   8. BÉNÉFICE + RÊVE     TheStaircase — l'escalier de l'imagination
 *   9. URGENCE             ThreeDoors
 *  10. GARANTIE            TheGuarantee
 *  11. CTA                 disqualification + formulaire
 *
 * Les cinq blocs de la LP MAX restent tenus : qualification (hero), autorité
 * chiffrée (TheDoubt), promesse et garantie (TheGuarantee), deux appels à
 * l'action, disqualification. A/B test contre /lp-courte et /lp-questions.
 */
export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero form={<OptinForm cta="Voir la vidéo maintenant" />} />

        {/* 1. RÊVE — toujours en premier */}
        <TheDreamFirst />

        {/* 2. ÉCHEC — « ce n'est pas votre faute », et l'ennemi s'annonce */}
        <TheFailure />

        {/* 3. PEUR */}
        <TheNumber />
        <TheFear />

        {/* 4. ENNEMI */}
        <TheEnemy />

        {/* 5. DOUTE */}
        <TheDoubt />
        <NotThis />
        <TheyWillManage />

        {/* 6. PREUVE + BIG IDEA */}
        <TheGap />
        <BeforeAfter />

        {/* 7. MÉCANISME */}
        <TheMechanism />

        {/* 8. BÉNÉFICE + RÊVE FINAL */}
        <TheStaircase />

        {/* 9. URGENCE */}
        <ThreeDoors />

        {/* 10. GARANTIE */}
        <TheGuarantee />

        {/* 11. CTA */}
        <Section tone="grey" id="acces">
          <SectionTitle>Ce que vous recevez, dans les deux minutes</SectionTitle>

          <ul className="mb-6 space-y-2 text-[1.05rem]">
            {[
              "La vidéo de 9 minutes : les 3 Verrous, expliqués en français, sans un mot de jargon.",
              "Le calcul complet du cas, à l'écran, ligne par ligne, avec les articles du Code en référence.",
              "Les 3 dates de votre situation, celles qui se ferment, avec votre âge d'aujourd'hui.",
              "De quoi arriver chez le notaire en sachant exactement quoi demander.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="shrink-0 font-bold text-green">
                  ✔
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <Disqualification />
          </div>

          <div className="border-2 border-blue bg-white p-4 sm:p-5">
            <p className="mb-1 text-[1.2rem] font-bold text-blue">
              Votre chiffre, ce soir. Gratuitement.
            </p>
            <p className="mb-4 text-[0.95rem] text-text-soft">
              Vous recevez le lien immédiatement. Rien à installer, rien à payer, aucun appel
              téléphonique.
            </p>
            <OptinForm cta="Recevoir la vidéo de 9 minutes" />
          </div>

          <div className="mt-5">
            <ProofUnderButton />
          </div>

          <p className="mt-6 text-center text-[0.9rem]">
            <Link href="/lp-questions">Vous préférez répondre à 3 questions d&apos;abord&nbsp;?</Link>
          </p>
        </Section>
      </main>
      <Footer />

      <StickyCta label="Voir la vidéo de 9 minutes — gratuit" />

      <ExitPopup
        storageKey="lp"
        title="Avant de partir : savez-vous laquelle de vos trois dates se ferme en premier ?"
      >
        <p className="mb-3 text-[0.98rem]">
          Le compteur des 15 ans, votre 70e anniversaire, votre 71e. L&apos;une des trois est déjà
          passée pour beaucoup de gens de votre âge, et c&apos;est la plus coûteuse.
        </p>
        <OptinForm cta="Recevoir les 3 dates" />
      </ExitPopup>
    </>
  );
}
