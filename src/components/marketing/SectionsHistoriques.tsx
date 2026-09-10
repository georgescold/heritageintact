import Image from "next/image";
import type { ReactNode } from "react";
import { Section, SectionTitle } from "../Lp";
import { UrgencyUnderButton, ConditionsExoneration } from "../Urgency";

/** Structure et visuels de la page pré-refonte, sans modifier les supports payants. */
export function AvantApresHistorique() {
  return (
    <Section id="avant-apres" tone="grey" wide>
      <div className="wrap px-0">
        <SectionTitle>Ce que vos enfants trouveront sur la table</SectionTitle>
        <p className="mb-5 text-sm text-text-soft">Deux scènes illustratives : le désordre laissé à vos proches, ou une préparation faite de votre vivant.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
              src="/img/avant-desordre.jpg"
              alt="Une table couverte de courriers, de relevés et de chemises cartonnées en désordre."
              fill
              sizes="(min-width: 640px) 30rem, 100vw"
              className="object-cover"
            />
            <span className="absolute left-0 top-0 bg-red px-3 py-1.5 text-[0.9rem] font-bold uppercase tracking-wider text-white">
              Sans plan
            </span>
          </div>
          <figcaption className="mt-3 text-[1rem]">
            Des mois de démarches. Des organismes à prévenir. Des mots de passe que personne n’a. Et des droits à payer pendant qu’ils font le tri.
          </figcaption>
        </figure>

        <figure>
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
              src="/img/apres-classeur.jpg"
              alt="Une table nette avec un classeur bleu marine fermé et une pile de feuilles rangée."
              fill
              sizes="(min-width: 640px) 30rem, 100vw"
              className="object-cover"
            />
            <span className="absolute left-0 top-0 bg-green px-3 py-1.5 text-[0.9rem] font-bold uppercase tracking-wider text-white">
              Avec un plan
            </span>
          </div>
          <figcaption className="mt-3 text-[1rem]">
            Un document d’une page. Les décisions examinées avec le professionnel, les actes utiles préparés. Et des questions traitées avant le jour où vos enfants devront tout retrouver.
          </figcaption>
        </figure>
      </div>
      {/* Les deux colonnes, ligne à ligne. C'est le bloc le plus dur de la page,
 et c'est celui qui fait le plus de travail : chacun se place tout seul
 dans l'une des deux listes. */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="border-2 border-red bg-red-bg">
          <p className="border-b-2 border-red bg-red px-4 py-2 text-[1.05rem] font-bold text-white">
            Le jour où ça arrive, sans plan
          </p>
          <ul className="space-y-2 p-4 text-[1rem]">
            {[
              "Des droits découverts pendant le deuil",
              "Des comptes à débloquer et des justificatifs à retrouver",
              "Le risque de devoir vendre faute de liquidités",
              "Des décisions prises à plusieurs, dans l'urgence",
              "Le contrat d'assurance-vie mal réglé, découvert trop tard",
              "Des mois de démarches, sans savoir par quoi commencer",
              "Un enfant qui porte tout, les autres qui commentent",
              "Le deuil, avec de l'administratif par-dessus",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="shrink-0 font-bold text-red">
                  ✕
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-green bg-green-bg">
          <p className="border-b-2 border-green bg-green px-4 py-2 text-[1.05rem] font-bold text-white">
            Le jour où ça arrive, avec le plan
          </p>
          <ul className="space-y-2 p-4 text-[1rem]">
            {[
              "Des hypothèses de droits examinées en amont",
              "Les besoins de liquidités mis sur la table",
              "Les options pour garder la maison étudiées",
              "Les décisions déjà prises, datées, signées",
              "Le contrat de la banque relu et corrigé à temps",
              "Un document d'une page qui dit quoi faire, dans l'ordre",
              "Vos intentions expliquées, plutôt que devinées",
              "De la place pour faire son deuil",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="shrink-0 font-bold text-green">
                  ✔
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="wrap mt-6 px-0 text-[1.05rem]">
        La différence entre ces deux colonnes ne tient ni à l&apos;argent, ni à l&apos;intelligence,
        ni à l&apos;amour qu&apos;on porte à ses enfants.{" "}
        <strong>Elle commence par le temps que vous prenez aujourd’hui pour préparer la suite.</strong>
      </p>
    </Section>
  );
}

export function EcheanceHistorique() {
  return (
    <Section id="pourquoi-maintenant">
      <SectionTitle>
        Et il y a une quatrième date. Celle-là est la même pour tout le monde.
      </SectionTitle>
      <p className="mb-5 text-[1.06rem]">
        Les trois premières dépendent de votre âge, donc elles ne tombent pas le même jour pour vous
        et pour votre voisin. La quatrième est écrite au calendrier : elle concerne les familles dont le projet remplit les conditions de cette exonération temporaire.
      </p>

      <div className="overflow-hidden border-2 border-orange">
        <div className="relative">
          <div className="relative aspect-[21/6]">
            <Image
              src="/img/calendrier.jpg"
              alt="Un calendrier mural avec une date entourée au stylo rouge."
              fill
              sizes="(min-width: 640px) 46rem, 100vw"
              className="object-cover object-center"
            />
            <span className="scrim" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
              La quatrième date
            </p>
            <p className="figure-lg text-white">31 décembre 2026</p>
          </div>
        </div>
        <div className="bg-yellow-bg p-4">
          <p className="text-[1rem]">
            Depuis février 2025, un dispositif temporaire permet de donner{" "}
            <strong>jusqu&apos;à 100 000 € par parent</strong>, totalement exonérés, à un enfant ou
            un petit-enfant qui achète un logement neuf ou fait des travaux de rénovation
            énergétique (art. 790 A bis du CGI). Cette somme <strong>s&apos;ajoute</strong> aux 100
            000 € d&apos;abattement parent-enfant, selon les conditions propres à chaque dispositif.
          </p>
          <p className="mt-2 text-[1rem]">
            <strong>La date de fin prévue est le 31 décembre 2026.</strong> Vérifiez les règles en vigueur avant un projet.
          </p>
          <p className="mt-2 text-[0.95rem] text-text-soft">
            Ce n&apos;est pas un compte à rebours de page de vente. C&apos;est une date votée au
            Parlement, que vous pouvez vérifier sur legifrance.gouv.fr.
          </p>
        </div>
      </div>
      <div className="mt-5"><UrgencyUnderButton /></div>
      <ConditionsExoneration />
    </Section>
  );
}

export function DernierMotHistorique({ action }: { action: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-t-[6px] border-orange">
      {/* La hauteur suit le texte au lieu d'être imposée par un ratio.
          Avec `aspect-[21/8]`, le bloc gardait une hauteur fixe pendant que le
          texte, lui, occupait le tiers haut : une grande zone sombre et vide
          sous la dernière ligne, et le bouton qui venait se coller à la
          découpe. Un padding fait le travail et ne se décale jamais. */}
      <Image
        src="/img/mains-cles.jpg"
        alt="Des mains âgées transmettant un trousseau de clés au-dessus d'une table en bois."
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <span className="scrim-left" />

      <div className="relative py-12 sm:py-16">
        <div className="wrap">
          <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
            Une dernière chose
          </p>
          <h2 className="text-on-photo mb-4 max-w-[32rem] text-[1.45rem] leading-tight text-white sm:text-[2rem]">
            Un jour, votre fils ou votre fille ouvrira un tiroir chez vous.
          </h2>
          <div className="max-w-[34rem] space-y-3 text-[1.02rem] text-white/90 sm:text-[1.1rem]">
            <p>
              Il cherchera des papiers, quelques jours après vos obsèques. Ce qu&apos;il trouvera
              dira ce que vous aviez prévu pour lui. Une pile de courriers qu&apos;il faudra six
              mois à démêler, ou une page écrite par vous, qui commence par&nbsp;: «&nbsp;voilà ce
              que j&apos;ai décidé, et pourquoi&nbsp;».
            </p>
            <p className="font-bold text-white">
              Ce ne sont pas des papiers que vous laissez. C&apos;est la preuve que vous y aviez
              pensé.
            </p>
            <p className="text-white/75">
              Et ça ne peut se faire qu&apos;à un seul moment&nbsp;: un après-midi ordinaire, en
              bonne santé, pendant que tout est encore possible.
            </p>
          </div>

          {/* Le bouton vit DANS la section : le dernier argument et l'action
              ne doivent pas être séparés par une découpe de fond. */}
          <div className="mt-7 max-w-[34rem]">
            {action}
          </div>
        </div>
      </div>
    </section>
  );
}
