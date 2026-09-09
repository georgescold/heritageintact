import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanConcubinsPacs() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Couple pacsé ou en union libre",
        objectif: "Vérifier la protection du partenaire sans la supposer.",
        pieces:
          "Convention de PACS le cas échéant, titre du logement, quotes-parts, testament existant, contrats.",
        questions:
          "Mon partenaire hérite-t-il dans notre situation ? Peut-il rester dans le logement ? Quel acte et quel coût seraient nécessaires pour réaliser nos souhaits ?",
        vigilance:
          "PACS et mariage ne donnent pas les mêmes droits successoraux. Exonération fiscale et qualité d’héritier sont deux questions distinctes.",
        action:
          "Écrire séparément votre souhait et la protection effectivement prévue par les documents.",
      }}
    />
  );
}
