/**
 * Grappe maison / coûts. Sujet étroit mais à demande réelle et à très faible
 * concurrence éditoriale : l'abattement de 20 % de l'art. 764 bis CGI.
 *
 * ANGLE : cet abattement est cité partout comme un avantage automatique de la
 * résidence principale. Il ne l'est pas du tout — il dépend de QUI habite encore
 * le logement au jour du décès. Une maison vide n'y a pas droit. C'est une
 * condition que presque aucun article grand public ne met en avant, alors
 * qu'elle décide de tout.
 *
 * ⚠️ Frontière : aucun document vendu ne traite cet abattement.
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

export function AbattementResidencePrincipale() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        L’abattement de 20 % sur la résidence principale : à qui il profite vraiment
      </h1>
      <p className="mb-2 text-text-soft">
        Il est présenté partout comme un avantage attaché à la maison. Il est en réalité attaché à
        la personne qui y habite encore — et si elle n’y habite plus, il disparaît. Vérifié le{" "}
        {VERIFIE_LE}.
      </p>

      <Bloc titre="Ce que dit le texte">
        <p className="mb-3">
          L’article 764 bis du Code général des impôts permet de retenir la valeur de la résidence
          principale du défunt <strong>diminuée de 20 %</strong> pour le calcul des droits de
          succession.
        </p>
        <p>
          Sur une maison estimée {eur(400_000)}, cela retire {eur(80_000)} de l’assiette. Pour deux
          enfants, dans la tranche à 20 %, cela représente environ {eur(16_000)} de droits en moins.
          Ce n’est pas un détail : c’est souvent l’un des allègements les plus importants du dossier.
        </p>
      </Bloc>

      <Bloc titre="La condition que presque personne ne met en avant">
        <p className="mb-3">
          L’abattement ne s’applique pas parce que le bien était la résidence principale du défunt.
          Il s’applique <strong>si, au jour du décès, ce logement est aussi la résidence principale</strong>{" "}
          de l’une de ces personnes :
        </p>
        <ul className="mb-3 list-disc space-y-1 pl-6">
          <li>le conjoint survivant ;</li>
          <li>le partenaire lié au défunt par un PACS ;</li>
          <li>
            un ou plusieurs enfants — du défunt ou de son conjoint — mineurs ou majeurs protégés.
          </li>
        </ul>
        <p className="mb-3">
          La conséquence est brutale et rarement anticipée : <strong>une maison vide n’y a pas
          droit.</strong> Une personne veuve qui décède seule dans sa maison, avec des enfants
          majeurs autonomes installés ailleurs, ne transmet aucun abattement de 20 %. Le cas est
          extrêmement fréquent, et c’est précisément celui de la plupart des successions.
        </p>
        <p>
          Autre conséquence : un couple marié dont le premier décède pourra en bénéficier, puisque le
          survivant habite toujours le logement. Au second décès, la maison étant vide, l’abattement
          ne s’appliquera plus. Le même bien, deux traitements, à quelques années d’écart.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Le calcul sans cet abattement"
        accroche="La grille ci-dessous raisonne sur un patrimoine taxable net, sans abattement de résidence principale — c'est-à-dire le cas le plus fréquent. Recevez-la : par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce qu’il ne faut pas confondre avec">
        <p className="mb-3">
          <strong>Le droit temporaire au logement.</strong> Le conjoint survivant bénéficie de plein
          droit de la jouissance gratuite du logement pendant un an après le décès (art. 763 du Code
          civil). C’est un droit d’habitation, pas un allègement d’impôt : les deux se cumulent et
          n’ont rien à voir.
        </p>
        <p>
          <strong>L’exonération du conjoint survivant.</strong> L’époux et le partenaire de PACS sont
          totalement exonérés de droits de succession (art. 796-0 bis CGI). Quand c’est le conjoint
          qui hérite du logement, l’abattement de 20 % ne lui sert donc à rien — il ne paie déjà
          rien. Il profite en réalité aux <em>autres</em> héritiers, qui eux sont taxés, dès lors que
          la condition d’occupation est remplie par l’un des occupants listés plus haut.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle ne dit pas quelle valeur retenir pour votre maison. C’est le second enjeu du dossier,
          et il a une contrepartie : une valeur basse réduit les droits aujourd’hui mais augmente la
          plus-value imposable si les héritiers revendent plus tard. Voir{" "}
          <Link href="/guide/vendre-maison-heritee-six-mois">
            six mois pour payer : faut-il vraiment vendre la maison
          </Link>
          .
        </p>
        <p>
          Elle ne dit pas non plus si votre situation remplira la condition d’occupation au moment
          venu — personne ne le sait à l’avance. Elle dit simplement qu’il ne faut pas compter
          dessus par défaut.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 764 bis (abattement de 20 % sur la résidence
          principale), 796-0 bis (exonération du conjoint survivant et du partenaire de PACS), 779 I
          (abattement par enfant). Code civil : article 763 (droit temporaire au logement). État du
          droit vérifié le {VERIFIE_LE} sur Legifrance.
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
