import { Feuille, Titre, Champ, TableauVierge } from "@/components/documents/Feuille";

export function PlanEnUnePage() {
  return (
    <Feuille
      titre="Mon plan en une page"
      sousTitre="La synthèse de mes priorités, de mes documents et de mes prochaines démarches."
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
        Après le rendez-vous, reportez ici les décisions effectivement validées et conservez les
        actes correspondants avec cette synthèse.
      </p>
    </Feuille>
  );
}
