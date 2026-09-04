import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ModalTrigger } from "@/components/Modal";
import { ProofUnderButton, UrgencyBand } from "@/components/LpExtras";

export const metadata: Metadata = {
  title: "Cette facture, vos enfants la paieront-ils vraiment ?",
};

/**
 * VARIANTE B : la LP courte avec pop-up (structure LP 1).
 * Headline bénéfice + curiosité (forme interrogative), sub-headline qui lève l'objection
 * et appelle à l'action, un bouton, et le formulaire uniquement dans le pop-up.
 * Aucun champ visible avant que la décision soit prise.
 */
export default function LpCourtePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="wrap py-10 sm:py-20">
          {/* Bénéfice + curiosité */}
          <h1 className="mb-4 text-[1.7rem] sm:text-[2.3rem]">
            Vos enfants paieront-ils vraiment 82 194 € à l&apos;État sur ce que vous leur laisserez&nbsp;?
          </h1>

          {/* Lève l'objection + call to action */}
          <p className="mb-6 text-[1.1rem] sm:text-[1.2rem]">
            C&apos;est le montant qu&apos;une famille ordinaire a payé sur une maison de province.
            Cliquez sur le bouton ci-dessous pour découvrir les 3 décisions, parfaitement légales, qui
            divisent cette facture, et le simulateur qui vous donne votre propre chiffre ce soir.
          </p>

          <ModalTrigger
            label="Découvrir les 3 décisions"
            title="Où souhaitez-vous recevoir la vidéo ?"
          >
            <OptinForm cta="Recevoir la vidéo de 9 minutes" />
          </ModalTrigger>

          <div className="mt-5">
            <UrgencyBand />
          </div>

          <div className="mt-4">
            <ProofUnderButton />
          </div>

          <div className="mt-4">
            <ModalTrigger label="Recevoir la vidéo maintenant" title="Où souhaitez-vous recevoir la vidéo ?">
              <OptinForm cta="Recevoir la vidéo de 9 minutes" />
            </ModalTrigger>
          </div>
        </section>
      </main>
      <Footer />

      <ExitPopup
        storageKey="lp-courte"
        title="Avant de partir : voulez-vous connaître les 3 dates qui ferment des portes sur votre succession ?"
      >
        <OptinForm cta="Recevoir les 3 dates" />
      </ExitPopup>
    </>
  );
}
