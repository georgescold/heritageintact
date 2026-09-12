/**
 * Grappe assurance-vie — droit pur.
 *
 * ANGLE : le cas est traité partout comme une curiosité en fin d'article. C'est
 * pourtant le seul où l'avantage fiscal disparaît ENTIÈREMENT, et il arrive par
 * inadvertance — un contrat ancien, une clause jamais relue, un bénéficiaire
 * décédé avant l'assuré.
 *
 * ⚠️ Frontière : trois-clauses-beneficiaires.tsx (vendu) explique les LOGIQUES de
 * désignation — bénéficiaires successifs, répartition, démembrement. Cette page
 * ne traite que l'ABSENCE de bénéficiaire et ses conséquences légales. Elle ne
 * dit jamais comment rédiger une clause, ni ce que « à défaut » recouvre.
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

export function AssuranceVieSansBeneficiaire() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Une assurance-vie sans bénéficiaire : l’avantage disparaît en entier
      </h1>
      <p className="mb-2 text-text-soft">
        C’est le seul cas où le contrat perd tout ce qui le rend intéressant. Et il n’arrive presque
        jamais par choix — il arrive par oubli. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Ce que dit la loi, en une phrase">
        <p className="mb-3">
          L’article L.132-11 du Code des assurances est sans nuance : lorsque l’assurance en cas de
          décès a été conclue sans désignation de bénéficiaire, le capital{" "}
          <strong>fait partie de la succession</strong> du souscripteur.
        </p>
        <p>
          Tout tombe d’un coup. Plus d’abattement de {eur(152_500)} par bénéficiaire, plus de
          versement direct et rapide, plus de transmission hors partage. Le capital devient un actif
          successoral comme un autre : il entre dans le partage, il supporte les droits selon le lien
          de parenté, et il attend le règlement de la succession.
        </p>
      </Bloc>

      <Bloc titre="Les quatre façons d’y arriver sans le vouloir">
        <p className="mb-3">
          Presque personne ne coche délibérément « aucun bénéficiaire ». On y arrive autrement :
        </p>
        <ul className="mb-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Un contrat ancien</strong> souscrit sans qu’on y prête attention, parfois adossé
            à un prêt ou ouvert en agence en quelques minutes.
          </li>
          <li>
            <strong>Le bénéficiaire désigné est décédé avant vous</strong>, et la clause ne prévoit
            personne après lui. C’est le cas le plus fréquent, et il frappe surtout les contrats
            ouverts il y a vingt ou trente ans.
          </li>
          <li>
            <strong>Tous les bénéficiaires renoncent.</strong> Le capital n’a plus de destinataire.
          </li>
          <li>
            <strong>La désignation est trop imprécise pour être exécutée.</strong> Une formulation
            qui ne permet pas d’identifier quelqu’un avec certitude peut se révéler inapplicable au
            moment où il faudrait l’appliquer — c’est-à-dire quand vous n’êtes plus là pour
            l’expliquer.
          </li>
        </ul>
        <p>
          Le point commun de ces quatre situations : elles se sont constituées en silence, parfois
          des décennies avant le décès, sans qu’aucun signal ne prévienne.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Ce que ça change, en euros"
        accroche="Quand le capital réintègre la succession, il vient s'ajouter à ce que vos enfants avaient déjà à payer. Recevez la grille de ce que représente votre patrimoine aujourd'hui — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce qui change vraiment pour vos enfants">
        <p className="mb-3">
          Si vos bénéficiaires sont vos enfants, la perte est fiscale mais pas catastrophique : ils
          bénéficient de l’abattement de {eur(100_000)} en succession. Le capital vient simplement
          s’ajouter à ce qu’ils avaient déjà à déclarer, et peut les faire changer de tranche.
        </p>
        <p>
          Si vous vouliez avantager quelqu’un qui n’est pas un héritier — un partenaire, un filleul,
          une personne qui vous accompagne — la conséquence est d’un tout autre ordre :{" "}
          <strong>cette personne ne reçoit plus rien du tout.</strong> Le capital suit les règles de
          la succession, donc il va aux héritiers légaux. Ce n’est plus une question d’impôt, c’est
          une question de destinataire.
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle ne vous dit pas ce que contient votre contrat. Cette information existe, elle est
          détenue par votre assureur, et vous pouvez en demander une copie datée à tout moment —
          c’est une démarche documentaire, qui n’engage à aucune modification.
        </p>
        <p>
          Et elle ne vous dit pas comment rédiger une désignation. Les formes de clause et leurs
          effets civils et fiscaux relèvent d’un professionnel : une clause mal écrite crée
          exactement le problème que cette page décrit. Voir aussi{" "}
          <Link href="/guide/assurance-vie-et-succession">
            pourquoi le capital échappe à la succession
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code des assurances : articles L.132-9 (acceptation et révocation), L.132-11 (absence de
          bénéficiaire désigné), L.132-12 (capital hors succession). Code général des impôts :
          articles 990 I, 757 B et 779 I. État du droit vérifié le {VERIFIE_LE} sur Legifrance.
        </p>
        <p className="text-[0.9rem] text-text-soft">
          Information générale. Ne constitue ni une consultation juridique au sens de la loi
          n°71-1130, ni un conseil fiscal personnalisé, ni une activité d’intermédiation en
          assurance. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
