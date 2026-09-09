import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanEnfantVulnerable() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Enfant vulnérable",
        objectif: "Préparer une protection compatible avec ses besoins et son autonomie.",
        pieces:
          "Mesures de protection éventuelles, ressources et aides, besoins de logement, interlocuteurs autorisés.",
        questions:
          "Quel effet aurait la transmission sur ses aides et sa protection ? Qui pourrait gérer les biens ? Quels dispositifs méritent une étude ?",
        vigilance:
          "Une vulnérabilité ne suffit pas à établir l’éligibilité à un abattement fiscal. Ne partagez pas de pièces médicales dans la formation.",
        action:
          "Préparer un budget de besoins et demander un rendez-vous adapté, avec les personnes habilitées.",
      }}
    />
  );
}
