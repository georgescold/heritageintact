/**
 * Score 56,4 — « droits de succession déductible de la plus value immobilière ».
 * Requête technique, faible volume, mais SERP quasi vide d'institutionnel : c'est
 * exactement le type de page que personne n'écrit sérieusement.
 *
 * ANGLE : les héritiers découvrent au moment de revendre que l'impôt payé à la
 * succession peut s'ajouter au prix d'acquisition (art. 150 VB II 3°). Presque
 * personne ne l'explique, et c'est la contrepartie exacte du piège de la valeur
 * déclarée traité sur `vendre-maison-heritee.tsx` — les deux pages se répondent.
 *
 * ⚠️ Aucun document vendu ne traite la plus-value.
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

export function DroitsSuccessionPlusValue() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Revendre un bien hérité : les droits déjà payés viennent en déduction
      </h1>
      <p className="mb-2 text-text-soft">
        Vos héritiers paieront deux fois sur le même bien — une fois à la succession, une fois à la
        revente. Un mécanisme relie les deux, et il est presque toujours ignoré. Vérifié le{" "}
        {VERIFIE_LE}.
      </p>

      <Bloc titre="Le double coup, vu par ceux qui le subissent">
        <p className="mb-3">
          Vos enfants héritent de la maison, déclarée {eur(400_000)}, et règlent les droits de
          succession. Quatre ans plus tard, ils la vendent {eur(460_000)}. L’administration
          considère alors qu’ils ont réalisé une plus-value de {eur(60_000)}, imposable à
          l’impôt sur le revenu et aux prélèvements sociaux.
        </p>
        <p>
          Le sentiment est toujours le même : « on a déjà payé sur cette maison ». C’est vrai, et le
          droit en tient compte — mais seulement si on le demande.
        </p>
      </Bloc>

      <Bloc titre="Le point de départ : la valeur déclarée">
        <p className="mb-3">
          Pour un bien reçu par succession ou donation, l’article 150 VB du Code général des impôts
          retient comme prix d’acquisition <strong>la valeur retenue pour le calcul des droits</strong>{" "}
          — c’est-à-dire celle qui figure dans la déclaration de succession.
        </p>
        <p>
          C’est ce qui explique qu’un bien vendu rapidement après un décès dégage souvent une
          plus-value quasi nulle : le prix de vente est proche de la valeur déclarée quelques mois
          plus tôt.
        </p>
      </Bloc>

      <Bloc titre="Le mécanisme que presque personne n’utilise">
        <p className="mb-3">
          Le même article permet d’ajouter à cette valeur les{" "}
          <strong>frais d’acquisition à titre gratuit</strong> : les droits de mutation
          effectivement payés et les frais d’acte supportés par l’héritier.
        </p>
        <p className="mb-3">
          Reprenons l’exemple. Si les enfants ont acquitté {eur(28_000)} de droits et{" "}
          {eur(6_000)} de frais, le prix d’acquisition retenu devient {eur(434_000)} au lieu de{" "}
          {eur(400_000)}. La plus-value imposable tombe de {eur(60_000)} à {eur(26_000)}.
        </p>
        <p>
          Deux conditions, et c’est là que ça se perd : les frais doivent avoir été{" "}
          <strong>réellement supportés par le vendeur</strong>, et il faut pouvoir les{" "}
          <strong>justifier</strong>. D’où l’importance de conserver la déclaration de succession et
          les quittances — des documents que beaucoup de familles rangent et oublient pendant les dix
          ou quinze ans qui séparent la succession de la vente.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Le premier des deux impôts"
        accroche="Tout part du montant des droits payés à la succession. Recevez la grille de ce que vos enfants paieraient aujourd'hui sur ce que vous leur laissez — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="L’arbitrage que ça crée, et qui n’est pas évident">
        <p className="mb-3">
          Déclarer une valeur basse réduit les droits immédiatement, mais gonfle la plus-value à la
          revente. Déclarer une valeur haute fait l’inverse. Les deux ne s’annulent pas : les taux
          ne sont pas les mêmes, et l’abattement pour durée de détention réduit progressivement la
          plus-value au fil des années, jusqu’à l’exonérer totalement après un temps long.
        </p>
        <p>
          Autrement dit, l’arbitrage dépend de ce que vos héritiers feront du bien. S’ils comptent
          le garder longtemps, la plus-value finira par s’effacer et déclarer bas était le bon
          calcul. S’ils comptent vendre rapidement, déclarer bas les fera payer deux fois. Personne
          ne peut trancher sans savoir — et la valeur déclarée doit de toute façon correspondre à la
          valeur réelle du bien.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Les taux, les abattements pour durée de détention et les éventuelles exonérations changent
          régulièrement, et certaines situations y échappent entièrement — notamment quand le bien
          devient la résidence principale de l’héritier.
        </p>
        <p>
          Voir aussi{" "}
          <Link href="/guide/vendre-maison-heritee-six-mois">
            six mois pour payer : faut-il vraiment vendre la maison
          </Link>
          , qui traite l’autre bout du problème : le délai et la trésorerie.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 150 VB (prix d’acquisition, frais d’acquisition à titre
          gratuit), 150 VC (abattement pour durée de détention), 150 U (exonérations, dont la
          résidence principale), 666 et suivants (valeur vénale retenue). État du droit vérifié le{" "}
          {VERIFIE_LE} sur Legifrance.
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
