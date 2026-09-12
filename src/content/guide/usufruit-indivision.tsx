/**
 * PAGE ÉDITORIALE n°1 — grappe démembrement (la plus ouverte des 87 SERP jugées :
 * 50,9, 31 % d'institutionnel).
 *
 * ANGLE DIFFÉRENCIANT (A11 §6.3, segmentation) : la SERP est tenue par trois
 * cabinets d'avocats, Legifrance et un site de niche — et tous écrivent pour
 * quelqu'un DÉJÀ coincé dans l'indivision, qui subit. Cette page écrit pour
 * l'inverse : le propriétaire vivant qui s'apprête à la créer en donnant la
 * nue-propriété à ses enfants. Même sujet, lecteur opposé.
 *
 * Structure CEO (03-marketing-copy/structure-ceo.md), ennemi imposé : LE SILENCE.
 *
 * ⚠️ FRONTIÈRE PRODUIT. Cette page explique ce que la loi fait et ce que ça
 * produit. Elle ne dit jamais quoi faire : ni pièce à réunir, ni question à
 * poser au notaire, ni action — c'est le parcours vendu. Aucun import de
 * `lib/simulateur/` ni de `content/documents/`.
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

export function UsufruitIndivision() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Usufruit et nue-propriété en indivision : qui décide quoi
      </h1>
      <p className="mb-2 text-text-soft">
        Ce que vous créez vraiment en donnant la nue-propriété de votre maison à vos enfants — qui
        décide, qui paie, et ce qui se passe le jour où vous n’êtes plus là. Chaque règle porte son
        article. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Ce que vous cherchez à éviter">
        <p className="mb-3">
          Vous avez une maison payée et des enfants. Ce que vous voulez n’est pas compliqué à
          formuler : qu’elle leur revienne entière, qu’ils n’aient pas à se déchirer pour elle, et
          que personne ne soit obligé de la vendre dans l’urgence.
        </p>
        <p>
          On vous a probablement parlé de la donation avec réserve d’usufruit : vous donnez la
          nue-propriété, vous gardez l’usage et les revenus jusqu’à votre décès. C’est souvent un bon
          outil. Mais entre « c’est un bon outil » et « voilà exactement la situation que ça crée
          pour vos enfants », il y a un silence que presque personne ne comble.
        </p>
      </Bloc>

      <Bloc titre="La confusion à lever d’abord : démembrement n’est pas indivision">
        <p className="mb-3">
          Les deux mots arrivent toujours ensemble et désignent deux choses différentes. Tant qu’on
          les mélange, rien de ce qui suit n’est lisible.
        </p>
        <p className="mb-3">
          Le <strong>démembrement</strong> coupe la propriété en deux dans le temps :
          l’usufruitier jouit du bien et en perçoit les revenus
          (<span className="whitespace-nowrap">art. 578 du Code civil</span>), le nu-propriétaire
          détient le bien mais n’en a pas l’usage. Deux droits différents sur le même bien.
        </p>
        <p className="mb-3">
          L’<strong>indivision</strong>, elle, met plusieurs personnes sur <em>le même droit</em> :
          deux enfants qui détiennent ensemble la nue-propriété sont en indivision entre eux.
        </p>
        <p>
          Si vous donnez la nue-propriété de votre maison à vos deux enfants en gardant l’usufruit,
          vous créez donc les deux à la fois : un démembrement entre vous et eux, et une indivision
          entre eux. Vous, vous n’êtes en indivision avec personne — vous êtes seul usufruitier.
        </p>
      </Bloc>

      <Bloc titre="De votre vivant : qui décide quoi">
        <p className="mb-4">
          Tant que vous êtes usufruitier, l’équilibre est très favorable à votre tranquillité — et
          c’est le point que les explications juridiques rendent rarement clair :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-current text-left">
                <th className="py-2 pr-3">La décision</th>
                <th className="py-2 pr-3">Qui la prend</th>
                <th className="py-2">L’article</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Habiter la maison", "Vous seul, usufruitier", "art. 578"],
                ["La louer et encaisser les loyers", "Vous seul, usufruitier", "art. 578 et 595"],
                ["Vendre la maison entière", "Vous ET tous les nus-propriétaires", "art. 621"],
                ["Vendre seulement la nue-propriété", "Vos enfants, entre eux", "art. 815-3"],
                ["Vendre seulement l’usufruit", "Vous seul", "art. 595"],
              ].map(([quoi, qui, art]) => (
                <tr key={quoi} className="border-b border-current/20">
                  <td className="py-2 pr-3">{quoi}</td>
                  <td className="py-2 pr-3 font-bold">{qui}</td>
                  <td className="py-2 text-[0.85rem] text-text-soft">{art}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Autrement dit : <strong>vos enfants ne peuvent pas vous mettre dehors, ni vendre la maison
          sans vous.</strong> C’est la crainte la plus répandue, et c’est celle qui n’a pas lieu
          d’être. La donation avec réserve d’usufruit ne vous dépossède pas de l’usage.
        </p>
      </Bloc>

      <Bloc titre="Qui paie quoi, et c’est là que ça grince">
        <p className="mb-3">
          La répartition des charges est écrite, et elle surprend souvent les deux camps.
          L’usufruitier supporte l’entretien courant et les charges annuelles
          (<span className="whitespace-nowrap">art. 605 et 608</span>) : la taxe foncière, l’entretien,
          les petites réparations.
        </p>
        <p className="mb-3">
          Le nu-propriétaire, lui, supporte les <strong>grosses réparations</strong>, et l’article 606
          en donne la liste : les gros murs et les voûtes, le rétablissement des poutres et des
          couvertures entières, les digues, les murs de soutènement et de clôture en entier. Tout le
          reste est réputé réparation d’entretien.
        </p>
        <p>
          Conséquence concrète : le jour où la toiture doit être refaite, la facture est pour vos
          enfants — alors qu’ils n’habitent pas la maison et n’en tirent aucun revenu. C’est le point
          de friction numéro un des démembrements familiaux, et il n’apparaît jamais au moment de
          signer. Le détail ligne par ligne, et le piège que le texte contient, sont ici :{" "}
          <Link href="/guide/usufruit-travaux-charges">
            qui paie les travaux, la taxe foncière et les charges
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Le jour où vous n’êtes plus là">
        <p className="mb-3">
          À votre décès, l’usufruit s’éteint (<span className="whitespace-nowrap">art. 617</span>).
          Vos enfants deviennent pleins propriétaires sans avoir rien à payer de plus sur la valeur de
          l’usufruit — c’est l’intérêt fiscal du montage.
        </p>
        <p className="mb-3">
          Mais quelque chose d’autre se produit au même instant : ils se retrouvent{" "}
          <strong>en indivision sur la pleine propriété</strong>. Et l’indivision a une règle qui
          domine toutes les autres, à l’article 815 : « <em>Nul ne peut être contraint à demeurer
          dans l’indivision</em> ».
        </p>
        <p className="mb-3">
          Un seul de vos enfants peut donc demander le partage, à tout moment, sans avoir à motiver
          sa demande. Si la maison ne peut pas être partagée en nature — et une maison ne se coupe
          pas en deux — le juge en ordonne la vente aux enchères entre les indivisaires, ce qu’on
          appelle la licitation.
        </p>
        <p>
          Ce n’est pas un scénario rare ni malveillant. Il suffit que l’un ait besoin de liquidités,
          divorce, ou vive à 600 kilomètres. <strong>Le démembrement organise la transmission ; il
          n’organise pas l’entente entre vos enfants après.</strong>
        </p>
      </Bloc>

      <Bloc titre="Et si la maison doit être vendue de votre vivant">
        <p className="mb-3">
          C’est possible, mais à l’unanimité : usufruitier et nus-propriétaires doivent être
          d’accord. Le prix se répartit alors entre eux selon la valeur respective de chaque droit
          (<span className="whitespace-nowrap">art. 621</span>), sauf accord contraire.
        </p>
        <p>
          Vous pouvez aussi convenir que l’usufruit se reporte sur le prix ou sur un autre bien
          plutôt que d’être payé — ce qu’on appelle le remploi. Ce sont deux issues très
          différentes pour vos revenus futurs, et elles se décident avant la vente, pas après. Les
          trois ventes possibles, la répartition du prix et les deux formes de report sont
          détaillées ici :{" "}
          <Link href="/guide/vendre-maison-usufruit-nue-propriete">
            vendre une maison en usufruit et nue-propriété
          </Link>
          .
        </p>
      </Bloc>

      <CaptureDocument
        titre="Avant de démembrer quoi que ce soit : le chiffre"
        accroche="La question qui précède toutes les autres, c'est combien vos enfants paieraient aujourd'hui si rien n'était fait. Recevez la grille complète, par patrimoine et par nombre d'enfants — abattement et barème déjà appliqués, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle décrit ce que la loi prévoit. Elle ne dit pas si le démembrement est une bonne idée
          dans votre cas : ça dépend de votre âge, de votre régime matrimonial, des donations que
          vous avez déjà faites, de l’entente entre vos enfants et de ce que vous voulez protéger en
          premier.
        </p>
        <p>
          Ces arbitrages se font avec un notaire, qui engage sa responsabilité. Ce que vous pouvez
          faire seul, et qui change tout à l’entretien : arriver en sachant déjà de quoi il parle.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 578 (définition de l’usufruit), 595 (baux consentis par
          l’usufruitier), 605 et 606 (répartition des réparations), 608 (charges annuelles), 617
          (extinction de l’usufruit), 621 (vente simultanée de l’usufruit et de la nue-propriété),
          815 (droit de provoquer le partage), 815-3 (actes des indivisaires) et 815-18 (indivision
          en usufruit). État du droit vérifié le {VERIFIE_LE} sur Legifrance.
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
