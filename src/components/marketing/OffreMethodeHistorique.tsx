import Image from "next/image";
import type { ReactNode } from "react";
import { Check, Cross } from "../ui";
import { euros } from "@/lib/config";

/** Présentation commerciale uniquement : le catalogue, les inclusions et les PDF restent inchangés. */
export function OffreMethodeHistorique({ montant, action }: { montant: number; action: ReactNode }) {
  return <section id="la-methode" className="wrap py-10">
    <h2 className="mb-2 text-[1.4rem]">Ce que vous éviterez de laisser sans réponse avec « Les 7 erreurs qui offrent votre héritage à l’État »</h2>
    <p className="mb-4 text-[1.06rem]">La Méthode est une suite de <strong>8 étapes, dans un ordre précis</strong>. Un guide commun à tous, entièrement écrit, pour comprendre les sept erreurs et préparer les questions qui concernent votre famille.</p>
    <figure className="mb-5">
      <div className="relative aspect-[16/9] overflow-hidden border border-grey-line"><Image src="/img/maison-a-vendre.jpg" alt="Un panneau À vendre devant une maison de famille." fill sizes="(min-width: 640px) 42rem, 100vw" className="object-cover" /></div>
      <figcaption className="mt-2 text-[0.92rem] text-text-soft">Quand la question des liquidités arrive au milieu d’un deuil, garder la maison peut devenir difficile. C’est une des questions à examiner de votre vivant.</figcaption>
    </figure>
    <ul className="mb-5 space-y-3 text-[1.05rem]">
      <Cross><strong>La maison qu’on redoute de devoir vendre.</strong> Comprendre les questions de transmission avant de découvrir les contraintes dans l’urgence.</Cross>
      <Cross><strong>Le chiffre découvert trop tard.</strong> Distinguer ce qui compose un calcul, au lieu d’attendre une facture pour poser les premières questions.</Cross>
      <Cross><strong>La date qui passe sans qu’on y ait pensé.</strong> Repérer les échéances à examiner avec votre professionnel.</Cross>
      <Cross><strong>Les documents signés puis oubliés.</strong> Savoir quels points reprendre, plutôt que supposer que tout est réglé.</Cross>
      <Cross><strong>Vos enfants qui doivent deviner vos intentions.</strong> Mettre vos priorités en mots pendant que vous pouvez encore les expliquer.</Cross>
    </ul>
    <h3 className="mb-3 text-[1.15rem]">Et ce que vous aurez, dès votre achat</h3>
    <ul className="mb-5 space-y-3 text-[1.05rem]">
      <Check><strong>La Méthode complète à lire.</strong> Une première étape pour faire le point, puis les sept erreurs expliquées simplement.</Check>
      <Check><strong>Le guide PDF à garder.</strong> Retrouvez vos explications et vos supports sans avoir une série de vidéos à regarder.</Check>
      <Check><strong>Des exemples pour comprendre les règles.</strong> Les dates, la maison, le couple, les donations et l’assurance-vie prennent une place concrète.</Check>
      <Check><strong>Les fiches utiles de la Méthode.</strong> Vos informations, vos priorités et les premières questions à préparer.</Check>
    </ul>
    <div className="overflow-hidden border border-grey-line">
      <table className="w-full text-left text-[0.95rem] sm:text-[1rem]"><tbody>
        {["Les 8 étapes écrites : faire le point, puis comprendre les 7 erreurs", "Le guide complet téléchargeable en PDF", "Les exemples et les fiches incluses dans la Méthode", "L’accès à votre parcours dans l’espace membre"].map(t => <tr key={t} className="border-b border-grey-line-soft"><td className="px-3 py-2">{t}</td><td className="px-3 py-2 text-right font-bold text-green">Inclus</td></tr>)}
        <tr className="bg-yellow-bg"><td className="px-3 py-3 text-[1.1rem] font-bold text-blue">Votre Méthode complète · paiement unique</td><td className="whitespace-nowrap px-3 py-3 text-right text-[1.5rem] font-bold text-red">{euros(montant)}</td></tr>
      </tbody></table>
    </div>
    <p className="mt-3 text-sm text-text-soft">Le Dossier et les packs restent des compléments distincts. Le simulateur appartient aux packs Préparation. Aucun autre achat n’est nécessaire pour terminer la Méthode.</p>
    <div className="mt-5">{action}</div>
  </section>;
}
