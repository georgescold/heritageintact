import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ModalTrigger } from "@/components/Modal";
import { PhotoBanner, Section } from "@/components/Lp";
import { ProofUnderButton, UrgencyBand } from "@/components/LpExtras";

export const metadata: Metadata = {
  title: "Cette facture, vos enfants la paieront-ils vraiment ?",
  description:
    "82 194 € de droits de succession sur une maison de province. Découvrez les 3 décisions légales qui divisent cette facture.",
};

/**
 * VARIANTE B — la LP courte avec pop-up (05-funnel/landing-pages.md, structure #1).
 *
 * Headline = bénéfice + curiosité, la curiosité venant de la forme interrogative.
 * Sub-headline = objection levée + appel au clic. Un bouton, et le formulaire
 * seulement dans le pop-up : aucun champ visible avant que la décision soit prise.
 *
 * C'est la variante courte : on ne lui ajoute pas de sections. Sa force est là.
 */
export default function LpCourtePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PhotoBanner
          image="/img/chaise-vide.jpg"
          kicker="Propriétaires de plus de 60 ans · France"
          title={
            <>
              Vos enfants paieront-ils vraiment{" "}
              <span className="text-orange">82 194 €</span> à l&apos;État sur ce que vous leur
              laisserez&nbsp;?
            </>
          }
        >
          <p>
            C&apos;est le montant qu&apos;une famille ordinaire a payé sur une maison de province
            et les économies d&apos;une vie. Cliquez sur le bouton ci-dessous pour découvrir les
            trois décisions, parfaitement légales, qui divisent cette facture par trois.
          </p>
        </PhotoBanner>

        <Section>
          <ModalTrigger
            label="Découvrir les 3 décisions"
            title="Où souhaitez-vous recevoir la vidéo ?"
          >
            <OptinForm cta="Recevoir la vidéo de 9 minutes" />
          </ModalTrigger>

          {/* Levier n°1 : la preuve juste sous le premier bouton */}
          <div className="mt-5">
            <ProofUnderButton />
          </div>

          {/* Levier n°2 : l'urgence, structurelle et vérifiable */}
          <div className="mt-4">
            <UrgencyBand />
          </div>

          {/* Second appel à l'action, après la preuve */}
          <div className="mt-5">
            <ModalTrigger
              label="Recevoir la vidéo maintenant"
              title="Où souhaitez-vous recevoir la vidéo ?"
            >
              <OptinForm cta="Recevoir la vidéo de 9 minutes" />
            </ModalTrigger>
          </div>
        </Section>
      </main>
      <Footer />

      <ExitPopup
        storageKey="lp-courte"
        title="Avant de partir : savez-vous laquelle de vos trois dates se ferme en premier ?"
      >
        <OptinForm cta="Recevoir les 3 dates" />
      </ExitPopup>
    </>
  );
}
