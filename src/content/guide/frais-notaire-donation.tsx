/**
 * Grappe donation — « donation de son vivant coût notaire » (56,5 au lot 1).
 * SERP tenue par des sites qui détaillent des barèmes d'émoluments.
 *
 * ANGLE : deux choses que personne ne met en avant. D'abord la confusion de
 * départ — « frais de notaire » désigne surtout un impôt, pas la rémunération du
 * notaire. Ensuite le levier que presque aucun article ne mentionne : le donateur
 * peut payer les droits à la place du bénéficiaire sans que ce paiement soit
 * lui-même taxé comme un don supplémentaire (art. 1712 CGI).
 *
 * ⚠️ Frontière : aucun document vendu ne traite le coût d'une donation.
 * simulateur-papier.tsx traite les droits de SUCCESSION, pas les frais d'acte.
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

export function FraisNotaireDonation() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Ce que coûte vraiment une donation chez le notaire
      </h1>
      <p className="mb-2 text-text-soft">
        L’essentiel de ce qu’on appelle « frais de notaire » ne va pas au notaire. Et il existe un
        levier légal qui augmente ce que reçoit votre enfant, sans rien donner de plus. Vérifié le{" "}
        {VERIFIE_LE}.
      </p>

      <Bloc titre="Quatre lignes, dont une seule pour le notaire">
        <p className="mb-4">
          Le devis d’une donation mélange quatre choses de nature complètement différente :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-current text-left">
                <th className="py-2 pr-3">La ligne</th>
                <th className="py-2 pr-3">Ce que c’est</th>
                <th className="py-2">Pour qui</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Droits de mutation",
                  "L’impôt sur la donation, après abattement",
                  "L’État",
                ],
                [
                  "Émoluments",
                  "La rémunération du notaire, à tarif réglementé",
                  "Le notaire",
                ],
                [
                  "Débours",
                  "Ce qu’il avance pour vous : cadastre, état hypothécaire, publications",
                  "Des tiers",
                ],
                [
                  "Contribution de sécurité immobilière",
                  "La taxe de publicité foncière sur un bien immobilier",
                  "L’État",
                ],
              ].map(([l, quoi, qui]) => (
                <tr key={l} className="border-b border-current/20">
                  <td className="py-2 pr-3 font-bold">{l}</td>
                  <td className="py-2 pr-3 text-[0.92rem]">{quoi}</td>
                  <td className="py-2">{qui}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Sur une donation immobilière d’un montant significatif, la première ligne écrase
          généralement toutes les autres. Dire « les frais de notaire sont élevés » revient le plus
          souvent à dire « l’impôt est élevé ». Les émoluments, eux, sont fixés par un tarif
          national : ils sont identiques d’une étude à l’autre, il n’y a rien à négocier ni à
          comparer.
        </p>
      </Bloc>

      <Bloc titre="Le levier que presque personne ne mentionne">
        <p className="mb-3">
          Normalement, c’est le bénéficiaire qui doit les droits. Mais le donateur peut les payer à
          sa place — et, point décisif,{" "}
          <strong>ce paiement n’est pas considéré comme une donation supplémentaire</strong>{" "}
          (art. 1712 du Code général des impôts). Il n’est donc pas taxé à son tour.
        </p>
        <p className="mb-3">
          L’effet est concret. Si vous donnez {eur(150_000)} à un enfant et qu’il règle lui-même les
          droits, il conserve la somme diminuée de l’impôt. Si vous réglez les droits, il conserve{" "}
          {eur(150_000)} entiers, et vous avez transmis davantage pour le même acte — sans que le
          fisc y voie une libéralité de plus.
        </p>
        <p>
          C’est l’un des rares ajustements qui ne coûtent rien à mettre en place et qui changent
          réellement ce qui arrive dans les mains de vos enfants.
        </p>
      </Bloc>

      <Bloc titre="Ce qui fait varier la facture">
        <p className="mb-3">
          Trois choses, essentiellement. <strong>Le lien de parenté</strong> : l’abattement de{" "}
          {eur(100_000)} par enfant et par parent fait souvent tomber les droits à zéro, alors
          qu’un don à une personne sans lien de parenté est taxé à 60 % — voir{" "}
          <Link href="/guide/donner-a-un-tiers-sans-lien-de-parente">
            donner à un ami ou un filleul
          </Link>
          .
        </p>
        <p className="mb-3">
          <strong>Ce que vous avez déjà donné</strong> dans les quinze dernières années, qui
          détermine l’abattement encore disponible (voir{" "}
          <Link href="/guide/regle-des-15-ans">la règle des 15 ans</Link>).
        </p>
        <p>
          <strong>La nature de ce que vous donnez</strong> : donner la nue-propriété seule réduit
          l’assiette par rapport à une pleine propriété, puisque les droits ne portent que sur la
          valeur du droit transmis.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Le chiffre qui met ces frais en perspective"
        accroche="Le coût d'une donation n'a de sens qu'en regard de ce qu'elle évite. Recevez la grille de ce que vos enfants paieraient aujourd'hui si rien n'était fait — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle ne donne pas de devis. Le montant exact dépend de la valeur retenue pour le bien, de
          votre âge en cas de réserve d’usufruit, de l’abattement restant et de la nature du bien.
          Seul un notaire, sur pièces, peut le chiffrer.
        </p>
        <p>
          Demander ce chiffrage ne coûte rien et n’engage à rien : un notaire établit un devis avant
          tout acte.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code général des impôts : articles 777 (barème), 779 I (abattement par enfant), 784
          (rappel des donations antérieures), 1712 (prise en charge des droits par le donateur).
          Tarif réglementé des notaires : articles A444-53 et suivants du Code de commerce. État du
          droit vérifié le {VERIFIE_LE}.
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
