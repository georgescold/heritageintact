import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ProofUnderButton, UrgencyBand } from "@/components/LpExtras";
import { Panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Combien l'État prendra-t-il sur ce que vous laisserez ?",
};

/**
 * VARIANTE A : la LP classique / curiosité (structure LP 2).
 * Headline bénéfice, sub-headline qui lève l'objection, sub-sub-headline mécanisme, formulaire.
 * Les deux autres variantes à tester : /lp-courte et /lp-questions.
 */
export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section id="top" className="wrap py-6 sm:py-12">
          {/* H1 : bénéfice */}
          <h1 className="mb-3 text-[1.6rem] sm:text-[2.2rem]">
            Combien l&apos;État prendra-t-il sur ce que vous laisserez à vos enfants&nbsp;?
          </h1>

          {/* H2 : lève l'objection principale + urgence */}
          <p className="mb-2 text-[1.05rem] sm:text-[1.15rem]">
            Sachez-le ce soir, en 20 minutes, sans rien vendre et sans quitter votre maison. Trois
            portes se ferment avec le temps sur une succession, et aucune ne se rouvre.
          </p>

          {/* H3 : le mécanisme nommé, en une ligne */}
          <p className="mb-5 text-[1.05rem] text-text-soft">
            La Méthode des 3 Verrous : trois décisions écrites dans le Code général des impôts, que les
            familles averties prennent de leur vivant pour transmettre intact ce qu&apos;elles ont
            construit.
          </p>

          <Panel title="Recevoir la vidéo gratuitement">
            <OptinForm />
          </Panel>

          {/* Règle 1 : toujours de l'urgence */}
          <div className="mt-5">
            <UrgencyBand />
          </div>

          {/* Levier : preuve sous le bouton, puis second call to action */}
          <div className="mt-4">
            <ProofUnderButton />
          </div>
          <div className="mt-4">
            <a
              href="#top"
              className="inline-flex min-h-[60px] w-full items-center justify-center rounded border-b-4 border-blue bg-blue-mid px-5 text-center text-[1.1rem] font-bold text-white no-underline hover:bg-blue"
            >
              Voir la vidéo de 9 minutes
            </a>
          </div>
        </section>

        {/* Sous la ligne de flottaison : ce qui donne envie de faire défiler */}
        <section className="border-t border-grey-line bg-grey-bg py-8 sm:py-12">
          <div className="wrap">
            <blockquote className="border-l-4 border-blue bg-white p-4 text-[1.1rem] leading-snug text-blue sm:p-5 sm:text-[1.3rem]">
              «&nbsp;82 194 €. C&apos;est ce qu&apos;une famille ordinaire a payé sur une maison de province.
              Le notaire a dit&nbsp;: <em>si votre père était venu dix ans plus tôt, on aurait divisé ça par
              trois.</em>&nbsp;»
            </blockquote>
            <p className="mt-5 text-[1.05rem]">
              Personne ne lui avait dit. Pas sa banque. Pas son notaire. Pas l&apos;État.{" "}
              <strong>Personne n&apos;est payé pour ça.</strong> Trois portes se ferment avec le temps sur une
              succession, et aucune ne se rouvre. La vidéo vous dit lesquelles.
            </p>
            <div className="mt-6">
              <a
                href="#top"
                className="inline-flex min-h-[60px] w-full items-center justify-center rounded border-b-4 border-orange-dark bg-orange px-5 text-center text-[1.15rem] font-bold text-white no-underline hover:bg-orange-dark"
              >
                Accéder à la vidéo
              </a>
            </div>
            <p className="mt-4 text-center text-[0.85rem]">
              <Link href="/lp-questions">Vous préférez répondre à 3 questions d&apos;abord ?</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />

      <ExitPopup
        storageKey="lp"
        title="Avant de partir : voulez-vous connaître les 3 dates qui ferment des portes sur votre succession ?"
      >
        <OptinForm cta="Recevoir les 3 dates" />
      </ExitPopup>
    </>
  );
}
