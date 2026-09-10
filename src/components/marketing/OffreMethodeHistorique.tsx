import Image from "next/image";
import type { ReactNode } from "react";
import { Check, Cross } from "../ui";

/** Présentation commerciale uniquement : le catalogue, les inclusions et les PDF restent inchangés. */
export function OffreMethodeHistorique({ action }: { action: ReactNode }) {
  return <section id="la-methode" className="wrap py-10">
    <h2 className="mb-2 text-[1.4rem]">Découvrez « Les 7 erreurs qui offrent votre héritage à l’État »</h2>
    <p className="mb-4 text-[1.06rem]">Une lecture claire et directe pour reconnaître les sept erreurs avant qu’elles ne pèsent sur votre famille.</p>
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
    <h3 className="mb-3 text-[1.15rem]">Ce que vous allez découvrir</h3>
    <ul className="mb-5 space-y-3 text-[1.05rem]">
      <Check><strong>Les 7 erreurs expliquées simplement.</strong> Comprenez pourquoi elles peuvent coûter cher lorsqu’elles sont découvertes trop tard.</Check>
      <Check><strong>Les dates et les décisions à connaître à temps.</strong> Donation, assurance-vie, maison et organisation familiale sont remis dans un ordre facile à suivre.</Check>
      <Check><strong>Les questions à ne plus repousser.</strong> Vous saurez quels sujets méritent d’être vérifiés pendant que vous pouvez encore agir.</Check>
    </ul>
    <div className="mt-5">{action}</div>
  </section>;
}
