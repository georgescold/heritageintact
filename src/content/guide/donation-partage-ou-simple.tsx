/**
 * Grappe donation. SERP : selexium, Swiss Life, notaires.fr, avocat-cahen,
 * la-retraite-en-clair, pierreetplacements, archersnotaires — neuf pages
 * « quelles différences », toutes construites en tableau comparatif.
 *
 * ANGLE : elles listent les différences ; aucune ne dit LAQUELLE empêche les
 * enfants de se déchirer, qui est la seule question de l'avatar. La réponse tient
 * à un seul mécanisme — le gel des valeurs au jour de l'acte (art. 1078) contre
 * l'évaluation au jour du partage (art. 860). Cette page est écrite autour de ce
 * mécanisme, pas autour d'un tableau.
 *
 * ⚠️ Frontière : aucun document vendu ne traite la donation-partage.
 */
import Link from "next/link";
import { CaptureDocument } from "@/components/CaptureDocument";

export const VERIFIE_LE = "12 septembre 2026";

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-[1.35rem] font-bold leading-snug">{titre}</h2>
      {children}
    </section>
  );
}

const eur = (n: number) => n.toLocaleString("fr-FR") + " €";

export function DonationPartageOuSimple() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Donation-partage ou donation simple : celle qui évite la dispute
      </h1>
      <p className="mb-2 text-text-soft">
        La différence tient à un seul mécanisme, et il décide de tout : à quelle date on compte ce
        que chacun a reçu. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Le cas qui se produit vraiment">
        <p className="mb-3">
          Vous avez deux enfants et vous voulez faire les choses également. En 2010, vous donnez un
          studio de {eur(120_000)} à votre fille. La même année, vous donnez {eur(120_000)} en
          liquidités à votre fils. Parfaitement équilibré, signé chez le notaire, personne ne peut
          rien reprocher à personne.
        </p>
        <p className="mb-3">
          En 2036, à l’ouverture de votre succession, le studio en vaut {eur(310_000)}. Les{" "}
          {eur(120_000)} de votre fils ont été dépensés en travaux et en études, il n’en reste rien.
        </p>
        <p>
          Si vous avez fait des <strong>donations simples</strong>, on ne compte pas ce que vous
          aviez donné : on compte ce que ça vaut aujourd’hui. Votre fille est réputée avoir reçu{" "}
          {eur(310_000)}, votre fils {eur(120_000)}. Elle devra compenser la différence sur le reste
          de la succession — et s’il n’y a pas assez, lui rendre de l’argent.
        </p>
      </Bloc>

      <Bloc titre="Pourquoi : deux articles, deux logiques">
        <p className="mb-3">
          <strong>Donation simple.</strong> Elle est présumée être une avance sur héritage. Au
          décès, elle est rapportée à la succession, et l’article 860 du Code civil impose de la
          valoriser <em>au jour du partage</em>, dans l’état où le bien était au jour de la
          donation. Vous avez donné un studio ; vos enfants se partageront la valeur de 2036.
        </p>
        <p className="mb-3">
          <strong>Donation-partage.</strong> Ce n’est pas une donation suivie d’un partage plus
          tard : c’est un partage fait <em>tout de suite</em>, du vivant du donateur. Et l’article
          1078 pose la règle décisive : les biens sont évalués{" "}
          <strong>au jour de l’acte</strong>, définitivement, à condition que tous les héritiers
          réservataires y participent et reçoivent un lot.
        </p>
        <p>
          Dans le même exemple, avec une donation-partage : votre fille a reçu {eur(120_000)}, votre
          fils {eur(120_000)}, et c’est gravé. Que le studio triple ou s’effondre ne change plus
          rien. Vous avez transmis, et vous avez aussi{" "}
          <strong>fermé le sujet</strong>.
        </p>
      </Bloc>

      <Bloc titre="Les trois conditions du gel">
        <p className="mb-3">
          Le gel des valeurs n’est pas automatique. Il suppose que tous les enfants héritiers
          réservataires soient présents à l’acte, que chacun reçoive effectivement un lot, et
          qu’aucun ne conteste au moment de la signature.
        </p>
        <p>
          Si un seul enfant est laissé de côté, ou ne reçoit rien, le mécanisme tombe et on revient
          à l’évaluation au jour du partage — c’est-à-dire à la donation simple, avec son
          incertitude. C’est le point sur lequel une donation-partage se rate.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Ce qui se joue si vous ne faites ni l’une ni l’autre"
        accroche="Ces deux formes se comparent à la lumière d'un seul chiffre : ce que vos enfants paieraient aujourd'hui sans rien préparer. Recevez la grille complète, par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce qui ne change pas entre les deux">
        <p className="mb-3">
          Fiscalement, les deux sont traitées de la même manière : mêmes abattements, même barème,
          même compteur de quinze ans. Choisir la donation-partage ne fait pas économiser un euro de
          droits — voir{" "}
          <Link href="/guide/regle-des-15-ans">la règle des 15 ans</Link>.
        </p>
        <p>
          Et les deux sont <strong>irrévocables</strong> de la même façon. La donation-partage
          n’atténue en rien ce que vous vous interdisez en signant : c’est expliqué sur la page{" "}
          <Link href="/guide/donner-sa-maison-a-ses-enfants">
            donner sa maison à ses enfants de son vivant
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Composer des lots équivalents quand le patrimoine est fait d’une maison et de peu de
          liquidités est le vrai travail, et il ne se fait pas sur un coin de table. C’est même la
          raison principale pour laquelle des familles renoncent à la donation-partage.
        </p>
        <p>
          Des variantes existent, notamment pour associer des petits-enfants ou pour attribuer un
          bien précis à un enfant en compensant les autres. Laquelle correspond à votre situation
          relève du notaire, qui engage sa responsabilité sur l’équilibre des lots.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 843 (rapport des libéralités), 860 (évaluation au jour du partage),
          1075 et suivants (donation-partage), 1078 (évaluation au jour de l’acte et ses
          conditions). État du droit vérifié le {VERIFIE_LE} sur Legifrance.
        </p>
        <p className="text-[0.9rem] text-text-soft">
          Information générale. Ne constitue ni une consultation juridique au sens de la loi
          n°71-1130, ni un conseil fiscal personnalisé, et ne remplace pas l’intervention d’un
          notaire. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
