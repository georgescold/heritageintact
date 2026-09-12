/**
 * Grappe maison. Prolonge la page pilier `usufruit-indivision.tsx`, qui pose le
 * risque (art. 815) sans donner les issues.
 *
 * ANGLE : toute la SERP explique le blocage. Très peu expliquent l'attribution
 * préférentielle (art. 831-2), qui est justement le mécanisme qui SAUVE la
 * maison — celui qui y vit peut se la faire attribuer contre soulte. C'est la
 * seule bonne nouvelle du sujet, et elle est presque toujours absente.
 *
 * ⚠️ Frontière : maison-indivision.tsx (vendu) est une feuille de travail —
 * intentions, scénarios à faire expliquer, questions au notaire. Cette page ne
 * donne que les mécanismes légaux de sortie. Aucune pièce, aucune question,
 * aucune action.
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

export function SortirDeLIndivision() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Sortir de l’indivision sur la maison de famille : quatre issues, et une qui la sauve
      </h1>
      <p className="mb-2 text-text-soft">
        Tout le monde explique que l’indivision bloque. Presque personne n’explique le mécanisme qui
        permet à celui qui habite la maison de la garder. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Le point de départ : personne n’est prisonnier">
        <p className="mb-3">
          L’article 815 du Code civil ouvre par une phrase que tout le reste découle : « Nul ne peut
          être contraint à demeurer dans l’indivision, et le partage peut toujours être provoqué ».
        </p>
        <p>
          Un seul indivisaire suffit, sans motif à donner. C’est ce qui rend l’indivision fragile —
          et c’est aussi ce qui empêche qu’un héritier soit retenu indéfiniment dans un bien dont il
          ne veut pas.
        </p>
      </Bloc>

      <Bloc titre="Les quatre issues">
        <p className="mb-3">
          <strong>1. Le partage amiable.</strong> Tout le monde est d’accord, un notaire établit
          l’acte, chacun reçoit son lot. C’est la voie rapide et la moins coûteuse. Elle suppose
          l’unanimité — et elle suppose surtout qu’il y ait de quoi composer des lots équivalents,
          ce qui est rarement le cas quand le patrimoine est fait d’une maison et de peu d’épargne.
        </p>
        <p className="mb-3">
          <strong>2. Le rachat des parts.</strong> L’un rachète la quote-part des autres et devient
          seul propriétaire. Simple sur le papier, limité par une seule chose : il faut pouvoir
          financer, souvent en empruntant à un âge où ce n’est plus évident.
        </p>
        <p className="mb-3">
          <strong>3. La vente de sa quote-part à un tiers.</strong> Un indivisaire peut céder ses
          droits à quelqu’un d’extérieur. Mais les autres disposent d’un{" "}
          <strong>droit de préemption</strong> (art. 815-14) : ils doivent être informés du prix et
          des conditions, et peuvent se substituer à l’acheteur. En pratique, un tiers achète très
          rarement une part d’indivision familiale.
        </p>
        <p>
          <strong>4. Le partage judiciaire.</strong> Faute d’accord, le juge est saisi (art. 840).
          Si la maison ne peut pas être partagée en nature — et une maison ne se coupe pas en deux —
          il en ordonne la vente aux enchères entre les indivisaires : la licitation. C’est l’issue
          la plus chère, la plus longue, et celle qui laisse le plus de traces dans une famille.
        </p>
      </Bloc>

      <Bloc titre="L’issue que presque personne ne mentionne : l’attribution préférentielle">
        <p className="mb-3">
          C’est la disposition qui change tout, et elle est rarement expliquée : l’article 831-2 du
          Code civil permet au conjoint survivant, ou à un héritier qui{" "}
          <strong>habitait le logement à titre d’habitation principale</strong> au moment du décès,
          de demander que la maison lui soit attribuée.
        </p>
        <p className="mb-3">
          Il ne la reçoit pas gratuitement : il doit compenser les autres à hauteur de leur part —
          c’est ce qu’on appelle la soulte. Mais il obtient le bien plutôt qu’une part du prix d’une
          vente forcée, et c’est ce qui permet à la maison de rester dans la famille même en cas de
          désaccord.
        </p>
        <p>
          Pour le conjoint survivant qui occupait le logement, cette attribution est même de droit
          lorsqu’il la demande. Autrement dit : le conjoint qui vit dans la maison ne peut pas en
          être chassé par les enfants d’une précédente union, dès lors qu’il peut compenser.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Ce qui alimente ces blocages : le chiffre"
        accroche="Une indivision se dénoue presque toujours sur une question d'argent — la soulte, ou les droits à payer. Recevez la grille de ce que vos enfants paieraient aujourd'hui, par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="En attendant, l’indivision a ses propres règles">
        <p className="mb-3">
          Tant qu’elle dure, tout ne se décide pas à l’unanimité. Les actes d’administration —
          conclure un bail d’habitation, faire des travaux d’entretien, régler les charges — se
          prennent à la majorité des deux tiers des droits indivis (art. 815-3). Seuls les actes de
          disposition, dont la vente du bien, exigent l’accord de tous.
        </p>
        <p>
          Et celui qui occupe seul le bien doit en principe une indemnité d’occupation à l’indivision
          (art. 815-9). C’est l’un des sujets les plus conflictuels, parce qu’il se découvre
          généralement des années après, au moment du partage, sous forme d’une somme rétroactive.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Quelle issue convient à votre famille dépend de qui habite le bien, de la capacité de
          chacun à financer une soulte, et de ce que vos actes prévoient déjà. Cela s’examine avec un
          notaire.
        </p>
        <p>
          Le plus utile reste de savoir que ces issues existent <strong>avant</strong> que la
          situation se crée : ce qui se prépare de votre vivant coûte infiniment moins cher qu’un
          partage judiciaire. Voir aussi{" "}
          <Link href="/guide/usufruit-nue-propriete-indivision">
            usufruit et nue-propriété en indivision
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 815 (droit de provoquer le partage), 815-3 (majorité des deux tiers),
          815-9 (indemnité d’occupation), 815-14 (préemption en cas de cession de droits indivis),
          831-2 et 832-3 (attribution préférentielle), 840 (partage judiciaire). État du droit
          vérifié le {VERIFIE_LE} sur Legifrance.
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
