import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanEnfantEtranger() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Enfant ou patrimoine à l’étranger",
        objectif: "Faire coordonner les règles françaises et étrangères.",
        pieces:
          "Pays de résidence et nationalités, localisation des biens, actes existants, professionnels déjà consultés.",
        questions:
          "Quelle loi civile s’applique ? Quels pays peuvent taxer ? Existe-t-il une convention ou des formalités locales ?",
        vigilance:
          "La langue française ou la nationalité ne suffisent pas à déterminer la loi applicable. L’atelier de calcul n’intègre pas l’international.",
        action:
          "Demander au notaire s’il traite ces pays ou s’il travaille avec un correspondant compétent.",
      }}
    />
  );
}
