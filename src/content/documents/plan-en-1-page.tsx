import { Feuille, Titre, Champ, TableauVierge } from "@/components/documents/Feuille";

export function PlanEnUnePage() {
  return (
    <Feuille
      titre="Mon plan en une page"
      sousTitre="La synthèse de ma préparation — pas un testament ni une instruction de donation."
    >
      <Champ label="Préparé le" />
      <Champ label="Ce que je souhaite protéger" />
      <Champ label="Le point principal encore à vérifier" />
      <Titre>Mes trois prochaines démarches</Titre>
      <TableauVierge
        colonnes={["Question ou document", "Interlocuteur", "Date choisie"]}
        lignes={3}
      />
      <Titre>Où retrouver les informations</Titre>
      <Champ label="Actes de propriété et dispositions familiales" />
      <Champ label="Contrats et donations passées" />
      <Champ label="Notaire ou professionnel à contacter" />
      <p>
        Cette feuille organise les informations. Elle ne garantit pas le résultat d’une succession
        et ne remplace aucun acte. Après le rendez-vous, distinguez les pistes discutées des
        décisions effectivement validées.
      </p>
    </Feuille>
  );
}
