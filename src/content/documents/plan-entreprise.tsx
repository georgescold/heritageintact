import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanEntreprise() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Entreprise ou titres professionnels",
        objectif: "Préparer la continuité de l’activité et la protection familiale.",
        pieces:
          "Statuts, pactes, valorisation récente, dettes, associés, fonctions et projet de reprise.",
        questions:
          "Qui peut diriger et qui peut détenir ? Quelles clauses ou engagements existent ? Quel calendrier professionnel faut-il respecter ?",
        vigilance:
          "Ne calculez pas un régime d’exonération d’entreprise avec le barème générique. L’éligibilité et les engagements demandent une étude spécifique.",
        action:
          "Identifier les interlocuteurs — notaire, expert-comptable, avocat — et préparer une réunion coordonnée.",
      }}
    />
  );
}
