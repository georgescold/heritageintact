import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { ExitPopup } from "@/components/ExitPopup";
import { Disqualification } from "@/components/Lp";
import { MetaDisclaimer, ProofUnderButton } from "@/components/LpExtras";
import { OptinForm } from "@/components/OptinForm";
import { CTA } from "@/lib/config";
import { UrgencyBar, UrgencyCountdown, UrgencyUnderButton } from "@/components/Urgency";

export const metadata: Metadata = {
  title: "Et si vos enfants héritaient de 58 400 € de plus ?",
  description:
    "Vous avez plus de 60 ans, une maison payée et des enfants ? Découvrez les 3 dates butoirs que personne n'est payé pour vous dire, et qu'il faut connaître pour faire baisser la facture que l'État présentera à vos enfants.",
};

/**
 * LA LANDING PAGE — structure #2 de `05-funnel/landing-pages.md`.
 *
 * ═══ Pourquoi cette page a été raccourcie le 6 septembre 2026 ═══
 *
 * Elle faisait 22 blocs et 9 appels à l'action. C'était une très bonne page
 * de vente — et c'est précisément le problème. Dans l'anatomie du funnel
 * (`05-funnel/anatomie-funnel.md`), une landing page n'a qu'un seul travail :
 *
 *     ADS → LANDING PAGE → VSL → BON DE COMMANDE → UPSELLS → MERCI
 *             (l'email)    (la vente)
 *
 * Le récit, les personnages, l'escalier de projection, la garantie : tout ça
 * vend. Donc tout ça appartient à la **page de vente**, pas à la page qui
 * demande un email. Rien n'a été jeté — les onze blocs CEO sont sur
 * `/methode`, sous la vidéo, où ils font enfin leur travail.
 *
 * Deux règles du repo tranchaient déjà, on ne les avait pas appliquées :
 *   — le tableau de choix des six structures attribue la **LP MAX (#6) au
 *     high ticket**, or on vend un produit à 27 € ;
 *   — le repère de conversion d'une landing page est **~50 %**, hors
 *     d'atteinte pour une page de 3 000 mots.
 *
 * ═══ La structure, à la lettre ═══
 *
 *     HEADLINE          → bénéfice (curiosité par la forme interrogative)
 *     SUB-HEADLINE      → objection levée
 *     SUB-SUB-HEADLINE  → mécanisme, développé très rapidement
 *     [ FORM : prénom + email ]
 *     [ BOUTON ]
 *
 * Puis les quatre améliorations valables sur toutes les LP : la preuve sous
 * le premier bouton, l'urgence sous le bouton, la mention anti-spam (dans
 * `OptinForm`), la conformité Meta. Plus les trois règles universelles :
 * urgence, pop-up de sortie, A/B test. Plus la disqualification, seul
 * élément de la LP MAX qui vaille d'être gardé ici : elle filtre, et Meta
 * récompense sur le CPA quand il voit des conversions de qualité.
 *
 * ═══ Ce qu'on n'a PAS mis, et c'est délibéré ═══
 *
 * Aucune photo. La structure #2 est du texte et un formulaire. Chaque
 * élément au-dessus du champ repousse le bouton sous la ligne de flottaison,
 * et le repère est explicite : *si le bouton est atteignable sans scroller
 * sur mobile, tu gagnes en conversion.*
 */
export default function LandingPage() {
  return (
    <>
      <UrgencyBar />
      <Header />

      {/*
        Padding vertical réduit sur téléphone : chaque pixel gagné au-dessus du
        premier champ est un pixel de moins entre le lecteur et le formulaire.
        Mesuré, pas estimé — le bas du bouton est passé de 1209 px à 885.
      */}
      <main className="flex-1">
        <section className="bg-white pb-9 pt-5 sm:py-14">
          <div className="wrap">
            {/* La qualification, en surtitre : elle appelle l'avatar sans
                manger une ligne de titre, et elle rend la disqualification
                cohérente plus bas. */}
            <p className="mb-1.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-orange">
              Propriétaires de plus de 60 ans · France
            </p>

            {/* ══ HEADLINE — le bénéfice, en question ══════════════════ */}
            <h1 className="text-[1.6rem] leading-[1.12] sm:text-[2.5rem]">
              Et si vos enfants héritaient de{" "}
              <span className="whitespace-nowrap text-orange">58 400 €</span> de plus&nbsp;?
            </h1>

            {/* ══ SUB-HEADLINE — l'objection levée ═════════════════════ */}
            <p className="mt-2.5 text-[1.08rem] font-bold text-blue sm:text-[1.3rem]">
              Sans rien vendre, sans quitter votre maison, et sans confier un centime à qui que ce
              soit.
            </p>

            {/* ══ SUB-SUB-HEADLINE — le mécanisme, et l'urgence ════════
                « Le mécanisme se développe en une ligne ou deux, pas plus. »

                ⚠️ La version précédente disait « trois dates du Code général
                des impôts changent le prix de votre succession ». Exact, et
                sans aucune tension : une phrase d'administration ne fait pas
                cliquer. Trois choses manquaient, et ce sont elles qui créent
                l'envie — une porte qui SE FERME, le fait qu'elle ne se rouvre
                JAMAIS, et un inconnu qui concerne le lecteur personnellement.

                Le mécanisme reste teasé, jamais expliqué : ce que sont les
                trois dates est exactement ce que la vidéo apporte. */}
            <p className="mt-2.5 text-[1.02rem] leading-snug">
              Découvrez les <strong>3 dates butoirs</strong> que personne n&apos;est payé pour vous
              dire, et qu&apos;il faut absolument connaître pour faire baisser{" "}
              <strong>la facture que l&apos;État présentera à vos enfants</strong> —{" "}
              <strong>
                avant qu&apos;il ne soit trop tard et que vous leur laissiez un chiffre que vous
                auriez pu diviser par trois&nbsp;:
              </strong>
            </p>

            {/* ══ LE FORMULAIRE ═══════════════════════════════════════
                Ni titre ni texte d'introduction au-dessus des champs : le
                gabarit n'en prévoit aucun, et ils coûtaient 143 px. La mention
                anti-spam et la case CGV sont dans le composant. */}
            <div className="mt-3 border-2 border-blue bg-white p-3 sm:mt-5 sm:p-5">
              <OptinForm cta={CTA.optin} />
            </div>

            {/* Amélioration n°2 : l'urgence, datée, juste sous le bouton. */}
            <div className="mt-4">
              <UrgencyUnderButton />
            </div>

            {/* La disqualification : elle filtre, et Meta récompense sur le CPA. */}
            <div className="mt-4">
              <Disqualification />
            </div>

            {/* Amélioration n°1 : la preuve sous le premier bouton.
                Le gabarit prévoit un SECOND formulaire juste derrière. Il a été
                retiré le 6 septembre 2026 : sur une page de 4,5 écrans, le
                premier reste à une hauteur de pouce, et le rendre deux fois
                donnait une page qui répète au lieu d'avancer. La règle du
                second appel garde tout son sens sur une page longue — c'est le
                cas de /methode. */}
            <div className="mt-6">
              <ProofUnderButton />
            </div>

            {/* Règle 3 : toujours être en A/B test. La variante questionnaire
                est la seule challenger conservée — c'est celle que le tableau
                de choix prescrit pour un ciblage très large, qui est le nôtre. */}
            <p className="mt-6 text-center text-[0.9rem]">
              <Link href="/lp-questions">
                Vous préférez répondre à 3 questions d&apos;abord&nbsp;?
              </Link>
            </p>

            {/* Amélioration n°4 : la conformité Meta. Son absence est une
                cause fréquente de bannissement de compte publicitaire. */}
            <div className="mt-8 border-t border-grey-line pt-4">
              <MetaDisclaimer />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Règle 2 : toujours un pop-up de sortie. Il porte l'argument le plus
          fort de la page — les deux compteurs qui tournent — parce que c'est
          le dernier moment où on peut encore parler à ce visiteur. */}
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
        <OptinForm cta={CTA.optin} />
      </ExitPopup>
    </>
  );
}
