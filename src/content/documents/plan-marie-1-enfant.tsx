import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanMarie1Enfant() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Marié, un enfant",
        objectif: "Protéger le conjoint sans confondre ses droits avec ceux de l’enfant.",
        pieces:
          "Contrat de mariage et avenants ; titres de propriété ; éventuelle donation entre époux.",
        questions:
          "Quelle part appartient déjà à chacun ? Que reçoit l’enfant au premier décès ? Quelles options sont réellement ouvertes au conjoint ?",
        vigilance:
          "L’exonération fiscale du conjoint n’implique pas qu’il hérite automatiquement de tout. Ne calculez pas deux décès en additionnant simplement les biens.",
        action:
          "Décrire vos besoins de logement et de revenus respectifs, puis demander une explication des deux décès séparément.",
      }}
    />
  );
}
