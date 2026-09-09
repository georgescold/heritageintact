import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanDonationsDejaFaites() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Donations déjà faites",
        objectif: "Reconstituer l’historique avant tout nouveau calcul.",
        pieces: "Actes et déclarations, dates, valeurs, bénéficiaires, droits payés et clauses.",
        questions:
          "Quelle date fait foi ? Quelles donations restent fiscalement rappelables ? Quel traitement civil s’applique au décès ?",
        vigilance:
          "La sortie du rappel fiscal ne signifie pas nécessairement que la donation disparaît du règlement civil de la succession. Les tranches déjà utilisées peuvent compter.",
        action:
          "Créer une ligne par donation et par bénéficiaire ; marquer « à retrouver » plutôt que zéro quand une pièce manque.",
      }}
    />
  );
}
