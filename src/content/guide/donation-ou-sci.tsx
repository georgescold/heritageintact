/**
 * Grappe donation — score 57,0. SERP : LegalVision, LegalPlace,
 * entreprendre.service-public, avocat-cahen, Crédit Agricole, l-expert-comptable.
 * Que des acteurs qui VENDENT la création de société, et qui écrivent pour un
 * dirigeant, pas pour un retraité avec une maison.
 *
 * ANGLE : contrarien et assumé. Pour une maison habitée et deux enfants, la SCI
 * est le plus souvent disproportionnée. Aucun des sites classés n'a intérêt à
 * l'écrire — c'est précisément pour ça que ça vaut d'être écrit.
 *
 * ⚠️ Frontière : plan-entreprise.tsx (vendu) traite l'exonération de transmission
 * d'ENTREPRISE, sujet distinct. Rien de vendu ne traite la SCI familiale.
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

export function DonationOuSci() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Donation ou SCI : pourquoi la réponse est souvent « ni l’un ni l’autre pour vous »
      </h1>
      <p className="mb-2 text-text-soft">
        La SCI règle un problème réel. Encore faut-il avoir ce problème — et pour une maison habitée
        transmise à deux enfants, ce n’est généralement pas le cas. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="D’abord, qui écrit sur le sujet">
        <p className="mb-3">
          Si vous cherchez « donation ou SCI », vous tomberez surtout sur des plateformes juridiques
          et des cabinets qui créent des sociétés. Leur contenu est sérieux, mais il est écrit pour
          quelqu’un qui envisage déjà de constituer une structure, et il répond à la question
          « comment » plutôt qu’à la question « faut-il ».
        </p>
        <p>
          Cette page répond à la seconde. Elle est écrite pour quelqu’un qui possède une maison, pas
          un patrimoine professionnel.
        </p>
      </Bloc>

      <Bloc titre="Le vrai problème que la SCI résout">
        <p className="mb-3">
          Il n’y en a qu’un, et il est sérieux : <strong>l’indivision</strong>. Si vous donnez votre
          maison à deux enfants, ils la détiennent ensemble, et l’article 815 du Code civil permet à
          l’un d’eux de provoquer le partage à tout moment — donc la vente. Une maison ne se coupe
          pas en deux.
        </p>
        <p className="mb-3">
          Avec une SCI, la maison appartient à la société. Vos enfants ne détiennent pas la maison :
          ils détiennent des parts. Les statuts fixent qui décide, à quelle majorité, et comment on
          sort. Un enfant qui veut partir cède ses parts ; il ne peut pas exiger la vente du bien.
        </p>
        <p>
          Second avantage réel : les parts se donnent par tranches, ce qui épouse bien un abattement
          qui se reconstitue tous les quinze ans, alors qu’une maison se donne difficilement en
          morceaux.
        </p>
      </Bloc>

      <Bloc titre="Ce que ça coûte, et qui dure trente ans">
        <p className="mb-3">
          Une SCI n’est pas un montage qu’on fait une fois. C’est une société : elle a des statuts,
          un gérant, une comptabilité à tenir, des assemblées à convoquer et des décisions à
          consigner. Pendant toute la durée où vous vivez dans cette maison, et après.
        </p>
        <p className="mb-3">
          Et pour y placer une maison que vous possédez déjà, il faut la transmettre à la société.
          Cette opération n’est pas neutre : elle constitue une mutation, avec ce que cela implique
          en frais et, selon le bien, en imposition. Ce n’est pas une formalité, c’est souvent le
          poste le plus lourd du projet.
        </p>
        <p>
          S’ajoute une question que beaucoup découvrent tard : quand la société possède le logement
          que vous habitez, votre occupation doit être organisée. On ne vit pas gratuitement chez
          une personne morale sans que cela se documente.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Avant d’envisager une structure : le chiffre"
        accroche="Une SCI se justifie par rapport à un enjeu, et l'enjeu se mesure. Recevez la grille de ce que vos enfants paieraient aujourd'hui si rien n'était fait — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="La question qui tranche">
        <p className="mb-3">
          Elle n’est pas fiscale, elle est familiale : <strong>y a-t-il un risque réel qu’un de vos
          enfants veuille vendre et pas l’autre ?</strong>
        </p>
        <p className="mb-3">
          Si oui — un enfant à l’étranger, un écart de moyens important, une mésentente ancienne, ou
          plusieurs biens à répartir — la SCI mérite d’être étudiée, parce qu’elle est à peu près le
          seul outil qui neutralise l’article 815.
        </p>
        <p>
          Si non — deux enfants proches, une maison, un patrimoine simple — la complexité et le coût
          d’une société sont rarement justifiés. Une{" "}
          <Link href="/guide/donation-partage-ou-donation-simple">donation-partage</Link> atteint
          souvent le même objectif d’équilibre, sans société à faire vivre pendant trente ans.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Le coût exact de l’apport d’un bien existant à une SCI, et son traitement fiscal, dépendent
          du bien, de sa date et de son origine. C’est le chiffre qui décide, et il demande un
          professionnel.
        </p>
        <p>
          La rédaction des statuts est l’essentiel du travail : une SCI mal rédigée reproduit à
          l’intérieur les blocages qu’on voulait éviter à l’extérieur. Ce n’est pas un formulaire.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 815 (droit de provoquer le partage), 1832 et suivants (société
          civile), 1845 et suivants (société civile immobilière). Code général des impôts :
          article 784 (rappel fiscal des donations antérieures). État du droit vérifié le{" "}
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
