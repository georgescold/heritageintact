import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ProofUnderButton } from "@/components/LpExtras";
import { StickyCta } from "@/components/StickyCta";
import { UrgencyBar, UrgencyCountdown, UrgencyUnderButton } from "@/components/Urgency";
import {
  BeforeAfter,
  Disqualification,
  Hero,
  NotThis,
  Section,
  SectionTitle,
  TheEnemy,
  TheDeadline,
  TheFear,
  TheGap,
  TheNumber,
  TheyWillManage,
} from "@/components/Lp";
import {
  CtaDates,
  CtaDetached,
  CtaFirstStep,
  CtaTwoChoices,
  CtaVerify,
  TheCostOfWaiting,
  TheDoubt,
  TheDreamFirst,
  TheFailure,
  TheGuarantee,
  TheLastWord,
  TheStaircase,
  TheMechanismShape,
  TheThreeDatesTease,
} from "@/components/LpCeo";

export const metadata: Metadata = {
  title: "Combien l'État prendra-t-il sur ce que vous laisserez ?",
  description:
    "Vous avez plus de 60 ans, une maison payée et des enfants ? Une vidéo de 9 minutes vous montre ce que l'État prendra sur votre succession, et les trois décisions légales qui le réduisent.",
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
 *   3. PEUR                TheNumber + TheFear + TheCostOfWaiting (Martine)
 *   4. ENNEMI              TheEnemy
 *   5. DOUTE               TheDoubt + NotThis + TheyWillManage
 *   6. PREUVE / BIG IDEA   TheGap + BeforeAfter
 *   7. MÉCANISME           TheMechanismShape — la forme, jamais le contenu
 *   8. BÉNÉFICE + RÊVE     TheStaircase — l'escalier de l'imagination
 *   9. URGENCE             TheDeadline — le 31 décembre 2026
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
      <UrgencyBar />
      <Header />
      <main className="flex-1">
        <Hero form={<OptinForm cta="Voir la vidéo maintenant" />} />

        {/* 1. RÊVE — toujours en premier */}
        <TheDreamFirst />

        {/* Le teaser des 3 dates : leur importance, jamais leur contenu */}
        <TheThreeDatesTease />

        {/* 2. ÉCHEC — « ce n'est pas votre faute », et l'ennemi s'annonce */}
        <TheFailure />

        {/* 3. PEUR — le calcul, la maison, puis le prix du mauvais moment */}
        <TheNumber />
        <CtaVerify />
        <TheFear />
        <TheCostOfWaiting />
        <CtaDates />

        {/* 4. ENNEMI */}
        <TheEnemy />

        {/* 5. DOUTE */}
        <TheDoubt />
        <NotThis />
        <TheyWillManage />
        <CtaDetached />

        {/* 6. PREUVE + BIG IDEA */}
        <TheGap />
        <BeforeAfter />
        <CtaTwoChoices />

        {/* 7. MÉCANISME */}
        <TheMechanismShape />

        {/* 8. BÉNÉFICE + RÊVE FINAL */}
        <TheStaircase />
        <CtaFirstStep />

        {/* 9. URGENCE */}
        <TheDeadline />

        {/* 10. GARANTIE */}
        <TheGuarantee />

        {/* Le dernier argument, celui qui doit rester en tête au moment de cliquer */}
        <TheLastWord />

        {/* 11. CTA */}
        <Section tone="grey">
          <SectionTitle>
            Il reste une décision à prendre maintenant. Elle est gratuite.
          </SectionTitle>

          <div className="mb-6 space-y-3 text-[1.06rem]">
            <p>
              Vous avez lu jusqu&apos;ici. Donc quelque chose, dans cette page, vous a parlé.
              Peut-être la maison. Peut-être la phrase que vos enfants diront de vous.
            </p>
            <p>
              Ce que vous ferez dans les trente prochaines secondes ne changera pas votre
              patrimoine. Ça changera seulement ce que vous saurez ce soir, en vous couchant.{" "}
              <strong>Et à partir de là, c&apos;est vous qui décidez</strong> — au lieu que ce soit
              décidé pour vous, dans quinze ans, par un barème.
            </p>
          </div>

          <p className="mb-3 text-[1.05rem] font-bold text-blue">
            Ce que vous recevez, dans les deux minutes&nbsp;:
          </p>
          <ul className="mb-6 space-y-2 text-[1.05rem]">
            {[
              "La vidéo de 9 minutes : les trois décisions, expliquées en français, sans un mot de jargon.",
              "Le calcul complet du cas, à l'écran, ligne par ligne, avec les articles du Code en référence.",
              "Les 3 dates qui se ferment, et comment situer votre âge sur chacune.",
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

          {/* L'ancre est ICI et non sur la section : les neuf boutons de la page
              renvoyaient sur le titre, et il restait huit cents pixels de texte
              avant d'apercevoir un champ. scroll-mt garde le titre visible. */}
          <div id="acces" className="scroll-mt-3 border-2 border-blue bg-white p-4 sm:p-5">
            <p className="mb-1 text-[1.2rem] font-bold text-blue">Votre vidéo, tout de suite.</p>
            <p className="mb-4 text-[0.95rem] text-text-soft">
              Votre prénom, votre email, et la vidéo s&apos;ouvre sur la page suivante. Il n&apos;y
              a pas d&apos;email à attendre, rien à installer, aucun appel téléphonique.
            </p>
            <OptinForm cta="Recevoir la vidéo de 9 minutes" />
            <div className="mt-3">
              <UrgencyUnderButton />
            </div>
          </div>

          <div className="mt-5">
            <ProofUnderButton />
          </div>

          <p className="mt-6 text-center text-[0.9rem]">
            <Link href="/lp-questions">
              Vous préférez répondre à 3 questions d&apos;abord&nbsp;?
            </Link>
          </p>
        </Section>
      </main>
      <Footer />

      <StickyCta label="Débloquer la vidéo — gratuit" />

      <ExitPopup storageKey="lp" title="Vous fermez cette page. Les compteurs, eux, continuent.">
        <div className="mb-4">
          <UrgencyCountdown />
        </div>
        <div className="mb-4 space-y-2.5 text-[0.98rem]">
          <p>
            Deux dates avancent en ce moment même, et personne ne peut les décaler. Ni vous, ni
            votre notaire, ni votre banque.
          </p>
          <p>
            <strong>Le 31 décembre 2026</strong>, la fenêtre des 100 000 € exonérés se referme. Elle
            n&apos;a pas été prolongée à ce jour.
          </p>
          <p>
            <strong>Et une donation met quinze ans à s&apos;effacer fiscalement.</strong> Lancée ce
            soir à 67 ans, le compteur arrive à terme à 82 ans. Lancée dans deux ans, à 84.
          </p>
          <p className="border-l-4 border-red bg-red-bg p-3 font-bold text-blue">
            Deux ans d&apos;attente ne coûtent pas deux ans. Ils coûtent un abattement de 100 000 €.
          </p>
          <p>La vidéo dure 9 minutes. Elle est gratuite. Elle est disponible dans deux minutes.</p>
        </div>
        <OptinForm cta="Recevoir la vidéo maintenant" />
      </ExitPopup>
    </>
  );
}
