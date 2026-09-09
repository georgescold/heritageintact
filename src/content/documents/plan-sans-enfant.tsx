import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanSansEnfant() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Sans enfant",
        objectif: "Identifier les personnes et projets que vous souhaitez favoriser.",
        pieces:
          "État familial, parents vivants, frères et sœurs, partenaire, titres et dispositions existantes.",
        questions:
          "Qui hériterait sans nouvelle disposition ? Quelle liberté ai-je ? Que changerait une transmission à un proche ou une association ?",
        vigilance:
          "Ne transposez pas l’abattement parent-enfant à un neveu, un ami ou un partenaire. Les droits et les taux dépendent de la relation et de l’opération.",
        action:
          "Faire deux listes : bénéficiaires souhaités et héritiers présumés à faire confirmer.",
      }}
    />
  );
}
