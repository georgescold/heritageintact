/**
 * Grappe donation — l'une des plus grosses intentions du gisement (15 requêtes).
 * SERP : impots.gouv.fr en 1er, puis boursier.com, notaires-office, CNP,
 * senioractu (« cette règle des 15 ans qui a coûté 20 000 € »).
 *
 * ANGLE : tout le monde explique le compteur fiscal. Presque personne ne dit que
 * le rapport CIVIL, lui, n'a pas de délai — une donation de 1995 est oubliée par
 * le fisc et toujours vivante entre les héritiers. C'est la confusion qui coûte
 * le plus cher, et la demande du SERP (« ça a coûté 20 000 € ») porte dessus.
 *
 * ⚠️ Frontière : calendrier-15-ans.tsx est vendu, mais c'est une FEUILLE DE SUIVI
 * (« une ligne par donation »). La règle de l'art. 784 est du droit public. Ne
 * jamais reproduire ici un tableau de suivi à remplir.
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

export function RegleDes15Ans() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        La règle des 15 ans : ce que le fisc oublie, et ce que vos enfants n’oublieront pas
      </h1>
      <p className="mb-2 text-text-soft">
        Passé quinze ans, une donation disparaît du calcul de l’impôt. Elle ne disparaît pas du
        partage entre vos enfants — et c’est là que naissent les disputes. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Le compteur fiscal, d’abord">
        <p className="mb-3">
          Chaque parent peut donner jusqu’à {eur(100_000)} à chacun de ses enfants sans droits
          (art. 779 I du Code général des impôts). Cet abattement n’est pas utilisable une fois pour
          toutes : il <strong>se reconstitue intégralement tous les quinze ans</strong>.
        </p>
        <p className="mb-3">
          Le mécanisme s’appelle le rappel fiscal (art. 784). Lors d’une nouvelle donation, ou au
          décès, l’administration regarde les donations consenties dans les quinze années
          précédentes et les réintègre dans le calcul. Au-delà de quinze ans, elles sont ignorées :
          l’abattement repart à zéro, entier.
        </p>
        <p>
          C’est ce qui fait qu’un couple ayant deux enfants peut transmettre {eur(400_000)} sans
          droits — deux parents, deux enfants, {eur(100_000)} chacun — puis recommencer quinze ans
          plus tard.
        </p>
      </Bloc>

      <Bloc titre="Le point que presque tout le monde rate : le compteur n’est pas familial">
        <p className="mb-3">
          Il n’existe pas <em>une</em> date des quinze ans pour votre famille. Le compteur tourne{" "}
          <strong>pour chaque couple donateur → bénéficiaire</strong>, séparément.
        </p>
        <p className="mb-3">
          Vous donnez à votre fille en 2018 : un compteur démarre entre vous et elle. Votre épouse
          donne à votre fils en 2022 : un autre compteur, indépendant, démarre. Vous donnez à votre
          fils en 2024 : un troisième. Trois lignes, trois dates, trois disponibilités
          d’abattement différentes.
        </p>
        <p>
          C’est pour cette raison qu’une phrase du type « on a déjà donné il y a dix ans, on ne peut
          plus rien faire » est presque toujours fausse : elle mélange des compteurs qui n’ont rien
          à voir entre eux.
        </p>
      </Bloc>

      <Bloc titre="Et maintenant le piège : civilement, il n’y a pas de délai">
        <p className="mb-3">
          Voilà ce que les articles sur « la règle des 15 ans » omettent presque systématiquement.
          Les quinze ans sont une règle <strong>fiscale</strong>. Elle dit ce que l’État recalcule.
          Elle ne dit rien de ce que vos enfants se doivent entre eux.
        </p>
        <p className="mb-3">
          Civilement, toute donation faite à un héritier est présumée être une avance sur sa part
          d’héritage. Au décès, elle doit être rapportée à la succession pour que le partage soit
          égal (art. 843 du Code civil). Et ce rapport,{" "}
          <strong>lui, n’a aucune limite de temps</strong>. Une donation de 1994 sera rapportée en
          2035.
        </p>
        <p>
          Pire : la valeur retenue n’est pas celle du jour du don, mais celle du bien{" "}
          <strong>au jour du partage</strong>, dans l’état où il était au moment de la donation
          (art. 860). Le studio donné 60 000 € à votre fille en 2005 et qui en vaut 190 000
          aujourd’hui sera rapporté pour 190 000. Fiscalement, il a disparu depuis longtemps.
          Civilement, il vient d’écraser sa part.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Le chiffre qui rend ces arbitrages lisibles"
        accroche="Décider d'utiliser un abattement suppose de savoir ce qui se joue sans lui. Recevez la grille de ce que vos enfants paieraient aujourd'hui si rien n'était fait — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce que ça change pour vous">
        <p className="mb-3">
          Deux conclusions tiennent en une phrase chacune. La première : attendre quinze ans entre
          deux donations a un intérêt fiscal réel, et le compteur se lit par bénéficiaire, pas pour
          la famille entière.
        </p>
        <p>
          La seconde, plus lourde : <strong>l’égalité fiscale n’est pas l’égalité entre vos
          enfants.</strong> Deux donations identiques en euros, faites à dix ans d’écart sur des
          biens différents, peuvent produire un partage très déséquilibré. Il existe une forme de
          donation qui fige les valeurs au jour de l’acte et ferme cette porte — c’est l’objet de la
          page{" "}
          <Link href="/guide/donation-partage-ou-donation-simple">
            donation-partage ou donation simple
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 779 I (abattement de {eur(100_000)} par enfant et par
          parent) et 784 (rappel fiscal des donations de moins de quinze ans). Code civil : articles
          843 (rapport des libéralités) et 860 (évaluation au jour du partage). Montants et état du
          droit vérifiés le {VERIFIE_LE}.
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
