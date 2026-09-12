/**
 * PAGE ÉDITORIALE n°2 — grappe démembrement, sous-intention « vente » (16 requêtes,
 * la plus demandée de la grappe).
 *
 * ANGLE DIFFÉRENCIANT (segmentation) : la SERP traite la vente du point de vue de
 * l'héritier qui veut sortir d'une situation subie. Ici, c'est le propriétaire
 * vivant qui a démembré — ou s'apprête à le faire — et qui veut savoir s'il
 * garde la main sur une vente future. Ce n'est pas la même question.
 *
 * Approfondit la section « Et si la maison doit être vendue » de la page pilier
 * `usufruit-indivision.tsx`, qui y renvoie. Pilier + approfondissements : pas de
 * cannibalisation tant que chaque page va plus loin que le bloc du pilier.
 *
 * ⚠️ FRONTIÈRE PRODUIT. On explique ce que la loi permet et ce que ça produit.
 * Jamais quoi faire : ni pièce, ni question au notaire, ni action. Et aucun
 * pourcentage de l'article 669 — ces valeurs sont dans `calendrier-3-dates.tsx`,
 * qui est vendu.
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

export function VendreBienDemembre() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Vendre une maison en usufruit et nue-propriété : qui peut, et qui touche l’argent
      </h1>
      <p className="mb-2 text-text-soft">
        Une fois la nue-propriété donnée, vous n’êtes plus seul à décider d’une vente — mais vous
        n’êtes pas dépossédé pour autant. Ce que la loi permet exactement, et à qui revient le prix.
        Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="La question qu’on ne pose jamais avant de signer">
        <p className="mb-3">
          Au moment de la donation, personne ne pense à la vente. On pense à transmettre, à
          l’économie de droits, à la maison qui reste dans la famille. La question arrive cinq ou dix
          ans plus tard, et souvent dans un mauvais moment : un veuvage, une maison devenue trop
          grande, un besoin d’argent pour entrer en résidence, ou simplement l’envie de se
          rapprocher des enfants.
        </p>
        <p>
          Et là, une inquiétude revient toujours : <em>« ai-je encore le droit de vendre ma
          maison ? »</em> La réponse est précise, et elle mérite d’être connue avant de démembrer,
          pas après.
        </p>
      </Bloc>

      <Bloc titre="Trois ventes différentes, trois règles différentes">
        <p className="mb-4">
          On parle de « vendre la maison » comme d’une seule opération. Juridiquement, il y en a
          trois, et elles n’exigent pas les mêmes accords :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-current text-left">
                <th className="py-2 pr-3">Ce qu’on vend</th>
                <th className="py-2 pr-3">Accord nécessaire</th>
                <th className="py-2">Ce que ça donne</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "La pleine propriété",
                  "Vous ET tous vos enfants",
                  "L’acheteur reçoit la maison entière, libre",
                ],
                [
                  "Votre usufruit seul",
                  "Vous seul",
                  "L’acheteur jouit du bien jusqu’à votre décès",
                ],
                [
                  "La nue-propriété seule",
                  "Vos enfants, entre eux",
                  "L’acheteur attend votre décès pour en jouir",
                ],
              ].map(([quoi, accord, effet]) => (
                <tr key={quoi} className="border-b border-current/20">
                  <td className="py-2 pr-3 font-bold">{quoi}</td>
                  <td className="py-2 pr-3">{accord}</td>
                  <td className="py-2 text-[0.92rem]">{effet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Les deux dernières lignes n’ont, dans les faits, presque aucun marché : personne n’achète
          volontiers un bien qu’il ne pourra pas occuper, ou dont il ignore combien de temps il
          devra attendre. <strong>En pratique, une vente réelle suppose l’accord de tout le
          monde.</strong> C’est le vrai changement qu’introduit la donation.
        </p>
      </Bloc>

      <Bloc titre="À qui revient le prix">
        <p className="mb-3">
          C’est le point qui surprend le plus, et il est réglé par l’article 621 du Code civil : en
          cas de vente simultanée de l’usufruit et de la nue-propriété,{" "}
          <strong>le prix se répartit entre les deux droits selon leur valeur respective</strong>,
          sauf accord contraire des parties.
        </p>
        <p className="mb-3">
          Autrement dit, vous ne récupérez pas la totalité du prix de la maison que vous avez payée
          pendant trente ans. Vous en recevez la part correspondant à votre usufruit, et vos enfants
          reçoivent le reste, immédiatement. Cette part se calcule selon votre âge au jour de la
          vente — et plus vous avancez en âge, plus elle diminue.
        </p>
        <p>
          C’est logique, puisque l’usufruit s’éteindra plus tôt. Mais c’est rarement ce que le
          vendeur avait en tête en signant.
        </p>
      </Bloc>

      <Bloc titre="L’autre voie : reporter l’usufruit au lieu de le vendre">
        <p className="mb-3">
          L’article 621 réserve expressément le cas d’un accord entre les parties. Deux arrangements
          existent, et ils changent tout pour vos revenus :
        </p>
        <p className="mb-3">
          <strong>Le remploi.</strong> Le prix sert à acheter un autre bien, sur lequel le
          démembrement se reconstitue à l’identique : vous restez usufruitier, vos enfants restent
          nus-propriétaires. C’est ce qui permet de vendre la grande maison pour un appartement de
          plain-pied sans défaire ce qui a été organisé.
        </p>
        <p>
          <strong>Le quasi-usufruit sur le prix.</strong> L’usufruit se reporte sur la somme
          d’argent elle-même. Vous en disposez librement, mais vos enfants détiennent une créance sur
          votre succession, à hauteur de ce montant. L’argent est à vous ; il leur sera dû à votre
          décès.
        </p>
      </Bloc>

      <Bloc titre="Et si vos enfants ne sont pas d’accord entre eux">
        <p className="mb-3">
          Tant que vous êtes là, l’unanimité est nécessaire et le blocage est réciproque : ils ne
          peuvent rien vendre sans vous, vous ne pouvez rien vendre sans eux.
        </p>
        <p>
          Après votre décès, l’équilibre change du tout au tout : l’usufruit s’éteint, ils se
          retrouvent en indivision, et l’article 815 permet à{" "}
          <strong>un seul d’entre eux</strong> de provoquer le partage — donc la vente aux enchères
          si la maison ne peut pas être partagée. C’est expliqué en détail sur la page{" "}
          <Link href="/guide/usufruit-nue-propriete-indivision">
            usufruit et nue-propriété en indivision
          </Link>
          .
        </p>
      </Bloc>

      <CaptureDocument
        titre="Avant d’arbitrer : combien vos enfants paieraient aujourd’hui"
        accroche="Le démembrement se décide en regard d'un chiffre : ce que l'État prendrait si rien n'était fait. Recevez la grille complète, par patrimoine et par nombre d'enfants — abattement et barème déjà appliqués, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Le traitement fiscal d’une vente en démembrement — notamment la plus-value et la manière
          dont elle se répartit — dépend de la voie retenue, de l’origine du bien et de votre
          situation. Il ne se déduit pas des règles civiles exposées ici.
        </p>
        <p>
          Le choix entre partage du prix, remploi et quasi-usufruit se prépare{" "}
          <strong>avant</strong> la vente, avec un notaire : après la signature, la plupart de ces
          portes sont fermées.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 578 et 595 (droits de l’usufruitier), 621 (vente simultanée de
          l’usufruit et de la nue-propriété), 617 (extinction de l’usufruit), 815 (droit de
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
