/**
 * Grappe donation — score 60,8. SERP tenue par hypotheques-en-ligne,
 * prosper-conseil, Groupama, nopillo, notaires-office : que des « guides de la
 * donation » qui présentent le dispositif et ses avantages.
 *
 * ANGLE : aucun ne dit ce qu'on PERD. La donation est irrévocable (art. 894), et
 * c'est la seule chose qu'on ne peut pas défaire dans toute la préparation d'une
 * succession. Cette page est écrite autour de ça.
 *
 * ⚠️ Frontière : aucun pourcentage de l'art. 669 (fermé par calendrier-3-dates,
 * vendu). Aucune pièce, aucune question au notaire, aucune action.
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

export function DonnerSaMaison() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Donner sa maison à ses enfants de son vivant : ce qu’on ne pourra plus défaire
      </h1>
      <p className="mb-2 text-text-soft">
        Tout le monde explique les avantages. Presque personne n’explique qu’une donation est
        définitive, ni ce que ça implique concrètement quand la vie change. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Pourquoi l’idée revient toujours">
        <p className="mb-3">
          Vous avez une maison payée et deux enfants. Vous savez qu’au décès, ils auront six mois
          pour payer des droits en euros. Donner de votre vivant permet de préparer, d’étaler, et
          d’utiliser des abattements qui se reconstituent avec le temps.
        </p>
        <p>
          C’est une bonne raison. Elle est juste rarement accompagnée de la contrepartie, qui est
          pourtant la donnée la plus importante du dossier.
        </p>
      </Bloc>

      <Bloc titre="La contrepartie : c’est définitif">
        <p className="mb-3">
          L’article 894 du Code civil définit la donation comme l’acte par lequel le donateur se
          dépouille <strong>actuellement et irrévocablement</strong> de la chose donnée. Les deux
          mots comptent : actuellement, donc tout de suite ; irrévocablement, donc sans retour.
        </p>
        <p className="mb-3">
          Vous ne pourrez pas changer d’avis. Ni si vous vous fâchez. Ni si l’un de vos enfants
          divorce et que son conjoint réclame sa part. Ni si vous avez besoin de l’argent dix ans
          plus tard pour financer une maison de retraite. La maison ne vous appartient plus.
        </p>
        <p>
          Le droit prévoit trois cas de révocation, et ils sont volontairement étroits :
          l’inexécution des charges convenues, l’ingratitude — au sens d’un attentat à la vie ou de
          sévices et injures graves — et la survenance d’un enfant si l’acte l’a prévu. Une
          brouille de famille n’en fait pas partie.
        </p>
      </Bloc>

      <Bloc titre="Garder l’usage : la réserve d’usufruit">
        <p className="mb-3">
          C’est la réponse classique à cette crainte, et elle est solide : vous donnez la
          nue-propriété, vous conservez l’usufruit. Vous continuez d’habiter la maison, ou de
          percevoir les loyers, jusqu’à votre décès. Les droits ne portent que sur la valeur de la
          nue-propriété, qui dépend de votre âge au jour de la donation.
        </p>
        <p>
          Mais ce que vous gardez, c’est <strong>l’usage</strong> — pas la propriété, ni la liberté
          de vendre seul. Ce que crée exactement ce montage, qui décide quoi et ce qui se passe
          ensuite, est détaillé ici :{" "}
          <Link href="/guide/usufruit-nue-propriete-indivision">
            usufruit et nue-propriété en indivision
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Ce que vos enfants reçoivent vraiment">
        <p className="mb-3">
          Une maison donnée à deux enfants n’est pas coupée en deux : elle leur appartient{" "}
          <strong>en indivision</strong>. Chacun détient une quote-part d’un tout, aucun ne détient
          une pièce.
        </p>
        <p>
          Et l’indivision porte une règle qui domine les autres, à l’article 815 : nul ne peut être
          contraint à y demeurer. Le jour où l’un veut sortir, il peut provoquer le partage — donc
          la vente si la maison ne se divise pas. Donner la maison ne garantit donc pas qu’elle
          reste dans la famille : ça garantit qu’elle y entre, pas qu’elle y reste.
        </p>
      </Bloc>

      <CaptureDocument
        titre="La question à trancher avant : combien, si vous ne faites rien"
        accroche="Une donation se décide en comparant deux chiffres, et le premier c'est ce que vos enfants paieraient aujourd'hui sans rien faire. Recevez la grille complète, par patrimoine et par nombre d'enfants — chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Si donner est une bonne idée pour vous, et sous quelle forme, dépend de votre âge, de votre
          régime matrimonial, de ce que vous avez déjà donné, de vos revenus futurs et de l’entente
          entre vos enfants. Aucun article ne répond à ça.
        </p>
        <p>
          Ce qui est certain, en revanche, c’est qu’une donation signée ne se reprend pas. C’est la
          seule décision de toute votre préparation qui n’a pas de marche arrière — et c’est la
          raison pour laquelle elle se prépare plus longuement que les autres.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 894 (définition et irrévocabilité de la donation), 953 à 960
          (révocation pour inexécution des charges, ingratitude, survenance d’enfant), 815 (droit de
          provoquer le partage). État du droit vérifié le {VERIFIE_LE} sur Legifrance.
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
