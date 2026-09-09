import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanFamilleRecomposee() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Famille recomposée",
        objectif:
          "Rendre visibles les liens de filiation, les besoins du conjoint et les volontés familiales.",
        pieces:
          "Livret de famille, actes d’adoption éventuels, régime matrimonial, testament connu, donations.",
        questions:
          "Qui est juridiquement l’enfant de qui ? Quels droits sont réservés ? Comment protéger le conjoint et les enfants de chaque union ?",
        vigilance:
          "L’attachement familial ne détermine pas le régime civil ou fiscal. Un enfant du conjoint non adopté n’a pas automatiquement les droits d’un enfant du défunt.",
        action:
          "Faire un schéma de filiation factuel. Faire vérifier les adoptions et chaque projet par le notaire.",
      }}
    />
  );
}
