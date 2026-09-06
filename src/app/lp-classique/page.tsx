import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import { ExitPopup } from "@/components/ExitPopup";
import { MetaDisclaimer, ProofUnderButton } from "@/components/LpExtras";
import { OptinForm } from "@/components/OptinForm";
import { UrgencyBar, UrgencyUnderButton } from "@/components/Urgency";

export const metadata: Metadata = {
  title: "Et si vos enfants héritaient de 58 400 € de plus ?",
  description:
    "Trois dates du Code général des impôts changent le prix d'une succession. Une vidéo de 9 minutes vous dit lesquelles, et laquelle vous concerne en premier.",
};

/**
 * VARIANTE D — la LP CLASSIQUE, structure #2 de `05-funnel/landing-pages.md`.
 *
 * ─── Pourquoi cette page existe ──────────────────────────────────────
 *
 * Le tableau de choix des six structures attribue la **LP MAX (#6) au high
 * ticket**. Or `/` est une LP MAX et vend un produit à 27 €. Les trois
 * structures prévues pour le low ticket (#1 courte, #2 classique, #3 forms)
 * ont un point commun que la MAX n'a pas : **elles prennent l'email en haut
 * de page, avant tout contenu long, et aucune ne montre la VSL avant.**
 *
 * Le repère du même document — **taux d'opt-in cible ~50 %** — n'est
 * atteignable qu'avec une structure courte. Une page de 3 000 mots ne
 * l'atteindra jamais.
 *
 * ─── La structure, à la lettre ───────────────────────────────────────
 *
 *   HEADLINE          → bénéfice (+ curiosité, ici par la forme interrogative)
 *   SUB-HEADLINE      → objection levée
 *   SUB-SUB-HEADLINE  → mécanisme, développé très rapidement
 *   [ FORM : prénom + email ]
 *   [ BOUTON ]
 *
 * Puis les quatre améliorations valables sur toutes les LP : la preuve sous
 * le premier bouton, l'urgence sous le bouton, la mention anti-spam (dans
 * `OptinForm`), et la conformité Meta.
 *
 * ─── Ce qu'on emprunte à la LP MAX ───────────────────────────────────
 *
 * Un seul élément, sa signature : **la disqualification**. Double effet
 * documenté — on n'a que des leads qualifiés, et Facebook récompense sur le
 * CPA parce qu'il voit des conversions de qualité.
 *
 * ─── Ce qu'on n'a PAS mis, et c'est volontaire ───────────────────────
 *
 * Aucune photo. La structure #2 est du texte et un formulaire. Chaque
 * élément ajouté au-dessus du champ repousse le bouton sous la ligne de
 * flottaison, et le repère est explicite : *si le bouton est atteignable
 * sans scroller sur mobile, tu gagnes en conversion.* C'est toute la
 * différence avec `/` — et c'est ce que le test doit mesurer.
 */
export default function LpClassiquePage() {
  return (
    <>
      <UrgencyBar />
      <Header />

      {/*
        Le padding vertical est réduit sur téléphone (pt-5 au lieu du py-9 de
        Section) : chaque pixel gagné au-dessus du premier champ est un pixel
        de moins entre le lecteur et le formulaire. Mesuré, pas estimé.
      */}
      <main className="flex-1">
        <section className="bg-white pb-9 pt-5 sm:py-14">
          <div className="wrap">
            {/* La qualification, en surtitre : elle appelle l'avatar sans manger
                une ligne de titre. */}
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

            {/* ══ SUB-SUB-HEADLINE — le mécanisme ══════════════════════
                « Le mécanisme se développe en une ligne ou deux, pas plus. »
                La première version en faisait quatre sur téléphone et repoussait
                le formulaire d'autant. Il est teasé, jamais expliqué : ce que
                sont les trois dates est précisément ce que la vidéo apporte. */}
            <p className="mt-2.5 text-[1.02rem] leading-snug">
              Trois dates du Code général des impôts changent le prix de votre succession.{" "}
              <strong>L&apos;une des trois est bien plus proche que les autres.</strong>
            </p>

            {/* ══ LE FORMULAIRE — prénom + email, et le bouton ═════════
                Il est ici et pas plus bas : c'est la structure #2, et rien ne
                s'intercale. Pas de titre ni de texte d'introduction au-dessus
                des champs — le gabarit n'en prévoit aucun, et ils coûtaient
                143 px au-dessus du premier champ. La mention anti-spam et la
                case CGV sont dans le composant. */}
            <div className="mt-3 border-2 border-blue bg-white p-3 sm:mt-5 sm:p-5">
              <OptinForm cta="Voir la vidéo de 9 minutes" />
            </div>

            {/* Amélioration n°2 : l'urgence, datée, juste sous le bouton. */}
            <div className="mt-4">
              <UrgencyUnderButton />
            </div>

            {/* ══ LA DISQUALIFICATION — l'élément signature de la LP MAX ══ */}
            <p className="mt-4 border-l-4 border-red bg-red-bg px-4 py-3 text-[0.98rem]">
              <strong className="text-red">
                Une précision, pour ne pas vous faire perdre de temps
              </strong>
              <br />
              Si vous êtes locataire, ou si vous n&apos;avez pas d&apos;enfant, ne rentrez pas votre
              email&nbsp;: cette vidéo ne vous servira à rien. Elle est faite pour ceux qui ont une
              maison payée et quelqu&apos;un à qui la laisser.
            </p>

            {/* Amélioration n°1 : la preuve sous le premier bouton… */}
            <div className="mt-6">
              <ProofUnderButton />
            </div>

            {/* …puis le second appel à l'action, juste derrière. */}
            <div className="mt-6 border-2 border-blue bg-white p-4 sm:p-5">
              <p className="mb-3 text-[1.15rem] font-bold text-blue">
                Vous savez maintenant d&apos;où viennent ces chiffres. Reste à savoir ce qu&apos;ils
                valent chez vous.
              </p>
              <OptinForm cta="Voir la vidéo de 9 minutes" />
            </div>

            {/* Amélioration n°4 : la conformité Meta. Son absence est une cause
                fréquente de bannissement de compte publicitaire. */}
            <div className="mt-8 border-t border-grey-line pt-4">
              <MetaDisclaimer />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Règle n°2 des landing pages : toujours un pop-up de sortie. */}
      <ExitPopup
        storageKey="lp-classique"
        title="Avant de partir : savez-vous laquelle de vos trois dates se ferme en premier ?"
      >
        <OptinForm cta="Recevoir la vidéo de 9 minutes" />
      </ExitPopup>
    </>
  );
}
