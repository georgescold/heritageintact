import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ExempleHeadline } from "@/components/ExempleHeadline";

export const metadata: Metadata = {
  title: "Et si vos enfants héritaient de 68 206 € de plus ? — exemple fictif",
  description: "Maison, famille, transmission : les repères à vérifier de votre vivant pour ne pas laisser vos proches découvrir seuls ce qui aurait pu être préparé.",
};

/** LP #2 : une promesse, un mécanisme court, un formulaire visible. */
export default function Page() {
  return <>
    <div className="border-b border-red bg-red px-4 py-2 text-center text-sm font-bold text-white">
      Votre maison est payée. Votre transmission ne se règle pas toute seule.
    </div>
    <Header minimal />
    <main className="flex-1">
      <section className="wrap pb-8 pt-5 sm:pt-9">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-orange-dark">Plus de 60 ans · Une maison · Des enfants</p>
        <h1 className="text-[1.7rem] leading-[1.12] sm:text-[2.6rem]">
          Et si vos enfants héritaient de <span className="whitespace-nowrap text-orange-dark">68 206 €</span> de plus ?
        </h1>
        <p className="mt-2 text-sm text-text-soft">Écart de droits dans un exemple fictif à deux enfants, hors frais. Pas une économie promise. <a href="#exemple-chiffre">Hypothèses ci-dessous.</a></p>
        <p className="mt-3 text-[1.1rem] font-bold text-blue">Comprenez ce qui peut changer avant de donner quoi que ce soit — sans vendre votre maison ni signer de placement pour suivre le guide.</p>
        <p className="mt-3 text-[1.02rem]">Vous avez payé votre maison pour eux. Découvrez les 3 repères de temps qui peuvent changer ce qu’ils recevront — et les erreurs à regarder pendant que vous pouvez encore en parler ensemble.</p>
        <div id="inscription" className="mt-5 border-2 border-blue bg-white p-4 sm:p-5">
          <p className="mb-3 font-bold text-blue">Avant de vous dire « je m’en occuperai plus tard », découvrez ce qu’il faut vérifier.</p>
          <OptinForm cta="Découvrir maintenant les 7 erreurs" />
        </div>
        <section aria-labelledby="pourquoi-maintenant" className="mt-5 border-l-4 border-red bg-red-bg p-4">
          <h2 id="pourquoi-maintenant" className="mb-2 text-[1.12rem]">Pourquoi vérifier maintenant plutôt que « plus tard » ?</h2>
          <p className="text-[0.98rem]">Le régime d’un versement ou la valeur fiscale d’une donation peuvent changer avec l’âge. Reporter une donation peut aussi décaler le renouvellement d’un abattement. C’est avant un projet qu’il faut regarder les dates, pas une fois les actes signés.</p>
          <p className="mt-2 text-sm text-text-soft">Ces repères ne constituent pas une échéance d’achat. Leur effet dépend de votre situation ; aucune économie n’est garantie.</p>
        </section>
        <ExempleHeadline compact />
        <section className="mt-6">
          <h2 className="mb-3 text-[1.25rem]">Ce que vous allez pouvoir mettre au clair</h2>
          <ul className="space-y-3 text-[1.02rem]">
            <li><strong>La maison :</strong> pourquoi l’avoir payée ne suffit pas à régler sa transmission.</li>
            <li><strong>L’assurance-vie :</strong> ce qu’il faut vérifier même si le contrat est signé depuis longtemps.</li>
            <li><strong>Le rendez-vous chez le notaire :</strong> comment arriver avec vos priorités et vos questions, plutôt qu’avec seulement vos inquiétudes.</li>
          </ul>
        </section>
        <p className="mt-6 text-sm text-text-soft">Un projet proche d’une échéance, une succession déjà ouverte ou un conflit ? Contactez directement un professionnel, sans attendre de suivre un parcours.</p>
      </section>
    </main>
    <Footer />
    <ExitPopup storageKey="lp-v7" title="Ce que vous risquez si vous fermez cette page">
      <p>La page se ferme. Pas les questions que vos enfants pourraient un jour devoir résoudre sans vous : où sont les documents ? Que vouliez-vous pour la maison ? Qu’aurait-il fallu vérifier plus tôt ? Gardez le lien et commencez aujourd’hui par les 7 erreurs.</p>
      <OptinForm cta="Recevoir mon lien de présentation" />
    </ExitPopup>
  </>;
}
