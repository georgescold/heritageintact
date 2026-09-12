/**
 * Grappe donation — score 59,0. SERP : service-public en 1er, puis Matmut,
 * fortunyconseil, info-legs, bonjoursenior, Groupama. Tous présentent « les
 * solutions pour donner à un proche sans lien de parenté ».
 *
 * ANGLE : aucun ne met en avant le vrai risque, qui n'est pas fiscal mais civil —
 * si vous avez des enfants, le don peut être RÉDUIT après votre mort. La personne
 * que vous vouliez protéger peut devoir rendre. C'est la seule chose qui compte
 * vraiment, et elle arrive en fin d'article partout, quand elle y arrive.
 *
 * ⚠️ Frontière : aucun document vendu ne traite la donation à un tiers.
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

export function DonnerAUnTiers() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Donner à un ami, un filleul, un voisin : les deux murs que personne n’annonce
      </h1>
      <p className="mb-2 text-text-soft">
        Il y a un mur fiscal, connu, et un mur civil, presque jamais mentionné — celui qui peut
        obliger la personne que vous vouliez protéger à rendre ce que vous lui avez donné. Vérifié
        le {VERIFIE_LE}.
      </p>

      <Bloc titre="Pourquoi cette question se pose">
        <p className="mb-3">
          Une aide-soignante qui s’est occupée de vous pendant huit ans. Un filleul dont vous êtes
          le seul repère. Un voisin qui passe tous les jours depuis que vous vivez seul. Une
          association qui a accompagné votre femme.
        </p>
        <p>
          Le droit successoral français ne connaît aucune de ces personnes. Il ne connaît que des
          liens de parenté, et il les traite par ordre. Pour que ces gens reçoivent quelque chose,
          il faut le décider soi-même — et savoir ce que ça coûte.
        </p>
      </Bloc>

      <Bloc titre="Le premier mur : 60 %">
        <p className="mb-3">
          Entre personnes sans lien de parenté, le taux est de <strong>60 %</strong> (art. 777 du
          Code général des impôts), après un abattement de seulement {eur(1_594)} (art. 788 IV).
          C’est le taux le plus élevé du barème français, et il s’applique dès le premier euro
          au-delà de l’abattement.
        </p>
        <p className="mb-3">
          Sur un don de {eur(100_000)} à un ami : base taxable {eur(98_406)}, droits{" "}
          <strong>{eur(59_044)}</strong>. Votre ami reçoit {eur(40_956)}. Vous avez donné cent mille
          euros ; il en garde quarante mille.
        </p>
        <p>
          À titre de comparaison, un enfant bénéficie d’un abattement de {eur(100_000)} et n’aurait
          rien payé du tout sur la même somme. Ce n’est pas une nuance, c’est un rapport de un à
          deux et demi.
        </p>
      </Bloc>

      <Bloc titre="Le second mur, et c’est celui qui surprend : la réserve héréditaire">
        <p className="mb-3">
          Si vous avez des enfants, vous n’êtes pas libre de donner ce que vous voulez. Le Code
          civil leur garantit une part minimale de votre patrimoine, appelée réserve héréditaire
          (art. 912 et 913) : la moitié avec un enfant, deux tiers avec deux enfants, trois quarts
          avec trois enfants ou plus.
        </p>
        <p className="mb-3">
          Ce qui dépasse s’appelle la quotité disponible, et c’est la seule part dont vous pouvez
          disposer librement. Un don qui l’excède n’est pas nul : il est{" "}
          <strong>réductible</strong>. Concrètement, à votre décès, vos enfants peuvent demander
          que le bénéficiaire leur rende l’excédent.
        </p>
        <p>
          C’est le scénario qu’il faut avoir en tête : la personne que vous vouliez remercier se
          retrouve, des années plus tard, face à vos enfants, à devoir restituer une partie de ce
          que vous lui aviez donné. Le don n’a pas protégé — il a créé un conflit qu’elle devra
          affronter sans vous.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Avant d’arbitrer : ce que vos enfants paieraient déjà"
        accroche="La quotité disponible se calcule sur l'ensemble de votre patrimoine, et la première chose à connaître est ce qu'il représente fiscalement. Recevez la grille complète, par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Deux cas qui échappent au taux de 60 %">
        <p className="mb-3">
          <strong>Le partenaire de PACS.</strong> En succession, il est totalement exonéré de droits
          (art. 796-0 bis CGI), exactement comme un époux. En donation, il bénéficie d’un abattement
          spécifique et d’un barème propre. Le concubin, lui, reste au taux de 60 % : c’est la
          signature qui change tout, pas la durée de la vie commune.
        </p>
        <p>
          <strong>Les associations reconnues d’utilité publique</strong> et certains organismes sont
          exonérés de droits de mutation à titre gratuit. Un legs ou un don à une telle structure
          arrive donc intact, là où un ami en perdrait 60 %.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Le calcul de la quotité disponible tient compte de ce que vous avez déjà donné, de votre
          régime matrimonial et de la composition exacte de votre patrimoine. Il ne se fait pas de
          tête, et il conditionne tout le reste.
        </p>
        <p>
          Il existe par ailleurs des formes d’aide qui ne sont pas des donations et ne suivent pas
          ces règles. Savoir laquelle correspond à votre intention relève d’un notaire, qui engage
          sa responsabilité sur la réponse.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 777 (barème, taux de 60 % entre non-parents), 788 IV
          (abattement de {eur(1_594)}), 796-0 bis (exonération du conjoint et du partenaire de
          PACS). Code civil : articles 912 et 913 (réserve héréditaire et quotité disponible), 920
          et suivants (réduction des libéralités excessives). Montants et état du droit vérifiés le{" "}
          {VERIFIE_LE}.
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
