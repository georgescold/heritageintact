import { Feuille, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";

export function TableauBordFamilial() {
  return (
    <Feuille
      titre="Mon tableau familial de préparation"
      sousTitre="Distinguer les souhaits des droits confirmés."
    >
      <p>
        Une ligne par sujet. La colonne « confirmé » ne se remplit qu’à partir d’un acte ou d’une
        explication professionnelle identifiée. Un souhait n’est pas encore un droit acquis pour un
        proche.
      </p>
      <TableauVierge
        colonnes={["Personne ou sujet", "Souhait exprimé", "Point confirmé / source", "À vérifier"]}
        lignes={4}
      />
      <Champ label="Besoins de logement et de revenus à préserver" />
      <Champ label="Qui connaît l’emplacement des documents ?" />
      <Champ label="Prochain point de suivi" />
      <Encadre titre="Pour la discussion familiale">
        <p>
          Présentez cette feuille comme une préparation, pas comme une répartition décidée. Ne
          faites pas signer vos proches pour donner une valeur juridique à ce tableau.
        </p>
      </Encadre>
    </Feuille>
  );
}
