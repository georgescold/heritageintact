import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { ExitPopup } from "@/components/ExitPopup";
import { ExempleHeadline } from "@/components/ExempleHeadline";
import { UrgencyBar, UrgencyUnderButton, UrgencyCountdown, ConditionsExoneration } from "@/components/Urgency";

export const metadata: Metadata = {
  title: "Et si vos enfants héritaient de 68 206 € de plus ? — exemple fictif",
  description: "Maison, famille, transmission : les repères à vérifier de votre vivant pour ne pas laisser vos proches découvrir seuls ce qui aurait pu être préparé.",
};

/** LP #2 : une promesse, un mécanisme court, un formulaire visible. */
export default function Page() {
  return <>
    <UrgencyBar />
    <Header minimal />
    <main className="flex-1">
      <section className="wrap pb-8 pt-5 sm:pt-9">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-orange-dark">Plus de 60 ans · Une maison · Des enfants</p>
        <h1 className="text-[1.7rem] leading-[1.12] sm:text-[2.6rem]">
          Et si vos enfants héritaient de <span className="whitespace-nowrap text-orange-dark">68 206 €</span> de plus ?
        </h1>
        <p className="mt-3 text-[1.1rem] font-bold text-blue">Comprenez ce qui peut changer avant de donner quoi que ce soit — sans vendre votre maison ni signer de placement pour suivre le guide.</p>
        <p className="mt-3 text-[1.02rem]">À votre mort, vos enfants ne pourront plus vous demander ce que vous vouliez pour la maison. Découvrez les 3 repères de temps à connaître — pendant que vous pouvez encore préparer la suite avec eux.</p>
        <div id="inscription" className="mt-5 border-2 border-blue bg-white p-4 sm:p-5">
          <p className="mb-3 font-bold text-blue">Avant de vous dire « je m’en occuperai plus tard », découvrez ce qu’il faut vérifier.</p>
          <OptinForm cta="Découvrir maintenant les 7 erreurs" />
        </div>
        <section id="pourquoi-maintenant" className="mt-5"><UrgencyUnderButton /></section>
        <ExempleHeadline compact />
        <ConditionsExoneration />
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
      <div className="mb-4"><UrgencyCountdown /></div>
      <p className="mb-3 font-bold">Le temps que vous laissez passer ne pourra pas être ajouté après votre mort. Reporter une donation, c’est aussi décaler le repère de ses 15 ans.</p>
      <p>La page se ferme. Pas les questions que vos enfants pourraient un jour devoir résoudre sans vous : où sont les documents ? Que vouliez-vous pour la maison ? Qu’aurait-il fallu vérifier plus tôt ? Gardez le lien et commencez aujourd’hui par les 7 erreurs.</p>
      <OptinForm cta="Recevoir mon lien de présentation" />
    </ExitPopup>
  </>;
}
