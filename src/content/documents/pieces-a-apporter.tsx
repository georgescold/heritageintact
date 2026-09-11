import { Case, Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/**
 * LA CHECK-LIST DES 12 PIÈCES À APPORTER.
 *
 * ⚠️ Feuille à cocher, et rien d'autre. Elle se prépare la veille, posée sur
 * la pile de documents : chaque case cochée est une pièce déjà dans la
 * pochette. C'est le format qui empêche le deuxième rendez-vous — celui qui
 * n'existe que parce qu'il manquait un relevé.
 */

const PIECES: { titre: string; precision: string }[] = [
  { titre: "Ma pièce d'identité", precision: "et celle de mon conjoint ou partenaire." },
  {
    titre: "Le livret de famille",
    precision: "toutes les pages remplies, y compris les mentions.",
  },
  {
    titre: "Le contrat de mariage ou de PACS",
    precision:
      "s'il en existe un. À défaut, la date et le lieu du mariage suffisent pour commencer.",
  },
  {
    titre: "Le jugement de divorce",
    precision: "s'il y a lieu, ainsi que la convention qui l'accompagne.",
  },
  {
    titre: "Les titres de propriété",
    precision: "de chaque bien immobilier — l'acte d'achat remis par le notaire à l'époque.",
  },
  {
    titre: "Le dernier avis de taxe foncière",
    precision: "pour chaque bien : il porte les références cadastrales.",
  },
  {
    titre: "Les relevés d'assurance-vie",
    precision: "le relevé de situation annuel de chaque contrat, avec le numéro de contrat.",
  },
  {
    titre: "La clause bénéficiaire de chaque contrat",
    precision: "le texte exact. Demandez-le à votre assureur si vous ne l'avez pas sous les yeux.",
  },
  {
    titre: "Les relevés de comptes et de placements",
    precision: "un relevé récent par établissement suffit.",
  },
  {
    titre: "Les actes de donation déjà passés",
    precision: "et les déclarations de dons manuels, si elles ont été faites.",
  },
  {
    titre: "Les tableaux d'amortissement des crédits",
    precision: "pour connaître le capital restant dû à ce jour.",
  },
  {
    titre: "Le testament, s'il existe",
    precision: "ou l'indication de l'endroit où il est déposé.",
  },
];

export function PiecesAApporter() {
  return (
    <Feuille
      titre="Les 12 pièces à apporter chez votre notaire"
      sousTitre="Préparez la pochette la veille. Cochez au fur et à mesure."
    >
      <ol className="divide-y divide-black border-y border-black">
        {PIECES.map((p, i) => (
          <li key={p.titre} className="flex min-h-[44px] items-start gap-3 py-2">
            <span
              data-a-remplir={`Pièce ${i + 1} réunie : notez oui`}
              className="mt-[3px] block min-h-[24px] min-w-[32px] shrink-0 border border-black"
            />
            <div>
              <p className="font-bold">
                {i + 1}. {p.titre}
              </p>
              <p className="text-[0.93rem]">{p.precision}</p>
            </div>
          </li>
        ))}
      </ol>

      <Titre>Vos notes de préparation à joindre</Titre>
      <ul className="space-y-1">
        <Case>Mon inventaire patrimonial, rempli.</Case>
        <Case>Ma fiche famille, remplie.</Case>
        <Case>Une feuille avec mes priorités, mes questions et les dates à faire vérifier.</Case>
      </ul>

      <Encadre titre="SI UNE PIÈCE MANQUE, ALLEZ QUAND MÊME">
        <p className="text-[0.95rem]">
          Un dossier incomplet mais préparé vaut infiniment mieux qu&apos;un rendez-vous reporté de
          six mois. Notez ce qui manque ci-dessous, et vous l&apos;enverrez après.
        </p>
      </Encadre>
      <Champ label="Ce qui me manque encore" />

      <Champ label="Rendez-vous le" />
      <Champ label="Chez" indice="nom de l'étude, adresse, téléphone" />
    </Feuille>
  );
}
