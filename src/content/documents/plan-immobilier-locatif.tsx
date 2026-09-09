import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanImmobilierLocatif() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Immobilier locatif",
        objectif: "Préserver revenus et capacité de gestion avant d’étudier une transmission.",
        pieces:
          "Titres, emprunts, baux, revenus nets, charges, travaux et éventuelles parts de société.",
        questions:
          "Qui percevrait les loyers ? Qui financerait les travaux ? Comment organiser une vente, une incapacité ou un désaccord ?",
        vigilance:
          "La valeur fiscale ne mesure ni la liquidité ni les contraintes de gestion. Une société ou un démembrement n’est pas une solution universelle.",
        action:
          "Établir une fiche revenus-charges-travaux, puis demander une étude de la capacité à conserver ou vendre.",
      }}
    />
  );
}
