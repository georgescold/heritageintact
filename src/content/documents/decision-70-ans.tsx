import { Feuille, Titre, Champ, TableauVierge, Source } from "@/components/documents/Feuille";
export function Decision70Ans() {
  return (
    <Feuille
      titre="Assurance-vie : mes questions avant et après 70 ans"
      sousTitre="L’âge aide à lire une règle. Il ne choisit pas une opération à votre place."
    >
      <Titre>Avant de comparer des seuils</Titre>
      <p>
        Demandez à l’assureur de distinguer les dates du contrat, les versements, les gains et les
        bénéficiaires. Les régimes usuels avant et après 70 ans n’ont pas la même assiette. Les
        contrats anciens et certaines personnes exonérées demandent un traitement spécifique.
      </p>
      <Titre>Si mes 70 ans approchent</Titre>
      <p>
        Ne versez pas une somme uniquement pour franchir une date. Posez les questions de
        disponibilité, frais, risques, utilité familiale et fiscalité dans cet ordre.
      </p>
      <Titre>Si mes 70 ans sont passés</Titre>
      <p>
        Il reste utile de retrouver les documents, de relire la désignation et de vérifier sa
        cohérence. N’effectuez pas un rachat ou un changement de contrat simplement parce que vous
        avez dépassé ce seuil.
      </p>
      <TableauVierge
        colonnes={["Ce que je sais", "Ce qui manque", "Qui peut confirmer ?"]}
        lignes={4}
      />
      <Champ label="Ma question prioritaire" />
      <Source>
        <a href="https://www.impots.gouv.fr/je-suis-beneficiaire-dune-assurance-vie">
          Documentation officielle sur les capitaux d’assurance-vie
        </a>
        . Consultez toujours la version en vigueur.
      </Source>
    </Feuille>
  );
}
