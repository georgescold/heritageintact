import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import { OptinForm } from "@/components/OptinForm";
import { SortieGuide } from "@/components/SortieGuide";
import { UrgencyBar } from "@/components/Urgency";

export const metadata: Metadata = {
  title: "Et si vos enfants héritaient de 68 206 € de plus ?",
  description: "Vous avez plus de 60 ans, une maison payée et des enfants ? Découvrez les repères à connaître de votre vivant pour préparer votre transmission.",
};
const cta = "Voir la vidéo";

/**
 * PAGE DE CAPTURE PUBLICITAIRE — l'adresse d'atterrissage des annonces.
 *
 * Elle vivait sur `/` jusqu'au 12/09/2026. La racine accueille désormais la page
 * de marque, celle que Google doit renvoyer sur « heritage intact » ; les deux
 * poursuivent des buts différents et ne doivent pas être confondues :
 *
 * - ici, un visiteur payé, sans contexte, qu'on convertit en une seule promesse
 *   et un seul champ. D'où la barre d'urgence, le pop-up de sortie et l'absence
 *   totale de navigation : rien qui permette de partir ailleurs.
 * - sur `/`, un visiteur qui a tapé la marque, qui veut savoir qui nous sommes,
 *   lire, ou retrouver son espace. D'où un header navigable et une FAQ.
 *
 * ⚠️ Elle reste hors index, volontairement : elle n'est pas dans la liste blanche
 * de `lib/seo.ts`, donc le `noindex` du layout racine s'applique. Deux pages
 * indexées sur la même promesse se cannibaliseraient.
 *
 * ⚠️ En changeant cette adresse, mettre à jour les annonces : c'est `/lp` que
 * les pubs doivent viser, plus la racine.
 */
export default function CapturePublicitaire() {
  return <>
    <UrgencyBar />
    <Header />
    <main className="flex-1" data-version-lp="historique-v11" data-role="capture-publicitaire">
      <section className="bg-white pb-9 pt-5 sm:py-14">
        <div className="wrap">
          <p className="mb-1.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-orange">Propriétaires de plus de 60 ans · France</p>
          <h1 className="text-[1.6rem] leading-[1.12] sm:text-[2.5rem]">Et si vos enfants héritaient de <span className="whitespace-nowrap text-orange">68 206 €</span> de plus&nbsp;?</h1>
          <p className="mt-2.5 text-[1.08rem] font-bold text-blue sm:text-[1.3rem]">Sans rien vendre, sans quitter votre maison, et sans confier un centime à qui que ce soit.</p>
          <p className="mt-2.5 text-[1.02rem] leading-snug">Découvrez les <strong>7 erreurs à absolument connaitre rapidement</strong> afin d’éviter <strong>une trop grosse facture de l’État sur votre succession.</strong></p>
          <div id="inscription" className="mt-3 border-2 border-blue bg-white p-3 sm:mt-5 sm:p-5"><OptinForm cta={cta} /></div>
          <div className="mt-5 border border-grey-line bg-grey-bg px-3.5 py-3">
            <p className="mb-2 text-[0.98rem] font-bold text-blue">Ce que vous vous apprêtez à découvrir :</p>
            <ul className="space-y-1.5">{[
              ["Pourquoi la date de vos versements peut changer le régime de votre assurance-vie", "art. 990 I et 757 B"],
              ["Comment la loi valorise un bien selon votre âge — et pourquoi un anniversaire change cette valeur", "art. 669"],
              ["Ce qui fait courir le délai de renouvellement d’un abattement", "art. 779 et 784"],
              ["La fenêtre des dons familiaux pour le logement prévue jusqu’au 31 décembre 2026", "art. 790 A bis"]
            ].map(([t,a])=><li key={a} className="flex gap-2 text-[0.92rem] leading-snug"><span aria-hidden className="mt-0.5 shrink-0 font-bold text-green">✔</span><span>{t} <span className="whitespace-nowrap text-[0.8rem] text-text-soft">— {a}</span></span></li>)}</ul>
            <p className="mt-2.5 border-t border-grey-line pt-2 text-[0.85rem] text-text-soft">Basé sur le Code général des impôts. Vérifiable sur impots.gouv.fr.</p>
          </div>
          <div className="mt-4 border-2 border-red bg-red-bg p-4 sm:p-5">
            <p className="mb-3 text-[1.1rem] font-bold text-red"><span aria-hidden>⚠</span> Ne remplissez pas ce formulaire si :</p>
            <ul className="space-y-2">{[
              "Vous cherchez un moyen de ne pas déclarer quelque chose : ici, les opérations sont légales et déclarées.",
              "Vous attendez un conseil juridique ou un montant fiscal personnel certifié : ce n’est pas ce que ce guide propose.",
              "Vous avez une succession déjà ouverte, un conflit ou une échéance proche : contactez un professionnel sans attendre ce parcours."
            ].map(t=><li key={t} className="flex gap-2 text-[1rem]"><span aria-hidden className="shrink-0 font-bold text-red">✕</span><span>{t}</span></li>)}</ul>
            <p className="mt-3 text-[0.95rem] text-text-soft">Nous préférons vous le dire avant. Le guide sert à comprendre et préparer, pas à décider d’un acte à votre place.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <SortieGuide storageKey="lp-historique-v12" />
  </>;
}
