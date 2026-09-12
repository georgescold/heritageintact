/**
 * Grappe maison. Sujet le plus proche de la peur centrale de l'avatar :
 * « ses enfants obligés de vendre la maison pour payer les droits ».
 *
 * ANGLE : la SERP explique le délai de six mois comme une formalité de
 * déclaration. Presque personne ne dit qu'il existe deux dispositifs légaux —
 * paiement fractionné et paiement différé — qui sont exactement faits pour
 * éviter la vente forcée, et qu'ils se demandent AVANT l'échéance, jamais après.
 *
 * ⚠️ Frontière : pieces-a-apporter.tsx (vendu) évoque les six mois dans un
 * contexte de pièces à réunir. Cette page ne donne aucune liste de pièces,
 * aucune démarche à faire — seulement ce que la loi prévoit.
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

export function VendreMaisonHeritee() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Six mois pour payer : faut-il vraiment vendre la maison ?
      </h1>
      <p className="mb-2 text-text-soft">
        Le délai est réel et la facture aussi. Mais il existe deux dispositifs faits précisément
        pour éviter la vente dans l’urgence — à condition de les demander à temps. Vérifié le{" "}
        {VERIFIE_LE}.
      </p>

      <Bloc titre="Le compte à rebours">
        <p className="mb-3">
          Pour un décès survenu en France, la déclaration de succession doit être déposée dans les{" "}
          <strong>six mois</strong>, et les droits payés au moment du dépôt (art. 641 et 1701 du
          Code général des impôts). En euros, pas en parts de maison : l’administration n’accepte
          pas une fraction d’immeuble en règlement.
        </p>
        <p>
          C’est là que naît la situation que redoutent tous les parents : une maison qui vaut
          beaucoup, une épargne qui ne suffit pas, et un délai qui court. Une maison ne se vend pas
          toujours en six mois — surtout quand deux héritiers ne sont pas d’accord sur le principe
          de la vendre.
        </p>
      </Bloc>

      <Bloc titre="Ce que coûte le retard">
        <p className="mb-3">
          Passé le délai, l’<strong>intérêt de retard est de 0,20 % par mois</strong> (art. 1727),
          soit 2,4 % par an. S’y ajoute, en cas de mise en demeure restée sans effet, une{" "}
          <strong>majoration de 10 %</strong> (art. 1728).
        </p>
        <p>
          Sur des droits de {eur(58_389)}, cela représente 117 € de plus chaque mois, puis{" "}
          {eur(5_839)} d’un seul coup. Le retard n’est pas une catastrophe immédiate, mais il
          transforme un problème de trésorerie en problème qui grossit tout seul.
        </p>
      </Bloc>

      <Bloc titre="Les deux dispositifs que presque personne ne mentionne">
        <p className="mb-3">
          <strong>Le paiement fractionné.</strong> Les droits sont réglés en plusieurs versements
          égaux étalés dans le temps, au lieu d’être payés en une fois. La durée dépend de la
          composition de la succession — un patrimoine majoritairement immobilier, donc peu liquide,
          ouvre droit à un étalement plus long.
        </p>
        <p className="mb-3">
          <strong>Le paiement différé.</strong> Réservé à des situations précises, notamment quand
          les héritiers ne reçoivent que la nue-propriété d’un bien : on ne leur demande pas de
          payer sur un bien dont ils n’ont pas encore la jouissance. Le règlement intervient plus
          tard, à la réunion de l’usufruit et de la nue-propriété.
        </p>
        <p className="mb-3">
          Ces deux dispositifs ont trois caractéristiques communes qu’il faut connaître. Ils
          <strong> se demandent avec la déclaration</strong>, donc dans les six mois — pas après.
          Ils portent <strong>intérêt</strong> : c’est un crédit du Trésor, pas une remise. Et ils
          exigent une <strong>garantie</strong>, le plus souvent une hypothèque sur un bien de la
          succession.
        </p>
        <p>
          Ce dernier point mérite d’être posé clairement : pour garder la maison de leurs parents,
          vos enfants peuvent avoir à la donner en garantie à l’État. C’est une solution réelle, et
          elle a un prix.
        </p>
      </Bloc>

      <CaptureDocument
        titre="La question qui précède toutes les autres"
        accroche="Savoir s'il faudra vendre suppose de connaître le montant en jeu. Recevez la grille de ce que vos enfants paieraient aujourd'hui, par patrimoine et par nombre d'enfants — abattement et barème déjà appliqués, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Le piège de la valeur déclarée">
        <p className="mb-3">
          Une tentation classique consiste à retenir une valeur basse pour la maison dans la
          déclaration, afin de réduire les droits. Cette valeur a une seconde vie que peu de gens
          anticipent : elle devient le <strong>prix d’acquisition</strong> des héritiers pour le
          calcul de la plus-value, s’ils revendent plus tard.
        </p>
        <p>
          Déclarer bas économise aujourd’hui et coûte demain — la plus-value imposable est d’autant
          plus élevée que la valeur retenue était faible. Et la valeur déclarée doit de toute façon
          correspondre à la valeur vénale réelle : l’administration dispose d’un droit de
          rectification.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Les durées, les conditions d’éligibilité et le taux d’intérêt applicable à ces dispositifs
          varient et se vérifient au moment de la demande. Ce sont des règles techniques, révisées,
          et un notaire ou le service des impôts les confirmera sur votre dossier.
        </p>
        <p>
          Ce qui ne change pas : la demande se fait <strong>avec la déclaration</strong>. Une fois le
          délai passé, ces portes sont fermées et il ne reste que les intérêts de retard. C’est
          exactement pour cela que le sujet se prépare de votre vivant, quand personne n’est dans
          l’urgence.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 641 (délai de déclaration), 1701 (exigibilité des
          droits), 1717 (paiement fractionné et différé), 1727 (intérêt de retard de 0,20 % par
          mois), 1728 (majoration), 150 VB (valeur d’acquisition en cas d’acquisition à titre
          gratuit). État du droit vérifié le {VERIFIE_LE} sur Legifrance.
        </p>
        <p className="text-[0.9rem] text-text-soft">
          Information générale. Ne constitue ni une consultation juridique au sens de la loi
          n°71-1130, ni un conseil fiscal personnalisé, et ne remplace pas l’intervention d’un
          notaire. Pour une succession déjà ouverte ou un délai en cours, contactez directement un
          professionnel. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
