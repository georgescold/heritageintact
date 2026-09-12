/**
 * Score 60,2. Grappe situation familiale — le seul cas non couvert par la
 * grappe démembrement, et le plus lourd de conséquences.
 *
 * ANGLE : la SERP explique que le bel-enfant n'hérite pas. Presque aucune page
 * n'explique la règle qui frappe le CONJOINT — l'option de l'article 757 du Code
 * civil disparaît dès qu'un seul enfant n'est pas commun. C'est ce qui empêche
 * le conjoint survivant de rester dans la maison par l'usufruit, et c'est la
 * mécanique centrale de toute famille recomposée.
 *
 * ⚠️ Frontière : plan-famille-recomposee.tsx (vendu) est un parcours — pièces,
 * questions, vigilance, action. Cette page ne donne que les règles. Aucune
 * pièce, aucune question au notaire, aucune action.
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

export function FamilleRecomposeeConjoint() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Famille recomposée : la règle qui change tout pour le conjoint survivant
      </h1>
      <p className="mb-2 text-text-soft">
        Un seul enfant né d’une autre union suffit à supprimer le droit qui permet au conjoint de
        rester dans la maison. C’est la mécanique la plus déterminante du sujet, et la moins
        expliquée. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Le choix que le conjoint survivant a, normalement">
        <p className="mb-3">
          Quand une personne mariée décède en laissant des enfants, l’article 757 du Code civil
          offre à son conjoint une option : recevoir <strong>un quart de la succession en pleine
          propriété</strong>, ou <strong>la totalité en usufruit</strong>.
        </p>
        <p>
          La seconde branche est celle qui protège vraiment : en usufruit total, le conjoint
          continue d’habiter le logement, de percevoir les revenus, et les enfants attendent. C’est
          ce qui permet à une veuve de rester chez elle sans rien demander à personne.
        </p>
      </Bloc>

      <Bloc titre="Et la condition, qui tient en quatre mots">
        <p className="mb-3">
          Cette option n’existe que <strong>si tous les enfants sont issus des deux époux</strong>.
          Le texte est sans nuance : dès lors qu’un seul enfant n’est pas commun au couple, le
          conjoint n’a plus le choix. Il reçoit le quart en pleine propriété, et rien d’autre.
        </p>
        <p className="mb-3">
          Prenez un couple remarié. Elle a deux enfants d’une première union, lui aucun. Il décède.
          Elle n’aura pas l’usufruit du logement : elle recevra un quart de la succession en pleine
          propriété, et les trois quarts iront aux enfants de son mari — qu’elle connaît peu, qui
          vivent loin, et qui deviennent du jour au lendemain ses co-indivisaires.
        </p>
        <p>
          C’est la situation qui produit le plus de conflits en France, et elle ne vient d’aucune
          mauvaise intention : elle vient d’un texte, appliqué mécaniquement, que personne n’avait
          lu avant.
        </p>
      </Bloc>

      <Bloc titre="Ce qui reste, malgré tout">
        <p className="mb-3">
          Le <strong>droit temporaire au logement</strong> (art. 763) : le conjoint survivant
          bénéficie de plein droit de la jouissance gratuite du logement pendant un an après le
          décès. Un an, pas davantage, et il n’a rien à demander pour l’obtenir.
        </p>
        <p>
          L’<strong>attribution préférentielle</strong> : le conjoint qui habitait le logement peut
          demander qu’il lui soit attribué lors du partage, à charge d’indemniser les autres. C’est
          la voie qui permet de garder la maison quand l’usufruit n’est pas disponible — elle est
          détaillée sur la page{" "}
          <Link href="/guide/sortir-de-l-indivision">sortir de l’indivision</Link>.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Ce que les enfants auront à payer, de leur côté"
        accroche="Dans une famille recomposée, chaque enfant relève d'un régime différent selon son lien avec le défunt. Recevez la grille de ce que vos enfants paieraient aujourd'hui, par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Du côté du bel-enfant : 60 %">
        <p className="mb-3">
          L’enfant de votre conjoint, que vous avez peut-être élevé pendant vingt-cinq ans, n’est
          pas votre héritier. Fiscalement, il est une personne{" "}
          <strong>sans lien de parenté</strong> : taxé à 60 % après un abattement de {eur(1_594)}.
          Sur {eur(100_000)}, il en conserve environ {eur(41_000)}.
        </p>
        <p className="mb-3">
          Une porte existe pourtant, et elle est peu connue : l’article 786 du Code général des
          impôts écarte en principe l’adopté simple du régime de la ligne directe,{" "}
          <strong>mais prévoit une exception pour les enfants issus d’un premier mariage du conjoint
          de l’adoptant.</strong> Une adoption simple permet alors au bel-enfant d’être traité
          fiscalement comme un enfant — abattement de {eur(100_000)} et barème en ligne directe.
        </p>
        <p>
          L’adoption simple n’efface pas la filiation d’origine : l’adopté conserve ses droits dans
          sa famille de naissance. Mais elle a des effets civils réels, notamment successoraux, qui
          dépassent la seule fiscalité — ce n’est pas une formalité d’optimisation.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle ne dit pas comment protéger votre conjoint dans votre situation. Plusieurs outils
          existent — dispositions entre époux, testament, aménagements du régime matrimonial,
          assurance-vie — et le bon dépend de votre patrimoine, de l’âge des enfants et de vos
          objectifs.
        </p>
        <p>
          Ce qui est certain : dans une famille recomposée,{" "}
          <strong>ne rien faire est une décision</strong>. Le texte s’appliquera, et il ne tient
          aucun compte de qui a élevé qui.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 757 (option du conjoint survivant), 763 (droit temporaire au
          logement), 831-2 (attribution préférentielle), 360 et suivants (adoption simple). Code
          général des impôts : articles 777 (barème et taux de 60 %), 779 I (abattement par enfant),
          786 (adopté simple et ses exceptions), 788 IV, 796-0 bis (exonération du conjoint). État
          du droit vérifié le {VERIFIE_LE} sur Legifrance.
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
