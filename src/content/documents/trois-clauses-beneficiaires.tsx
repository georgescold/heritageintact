import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";
export function TroisClausesBeneficiaires() {
  return (
    <Feuille
      titre="Comprendre trois logiques de désignation"
      sousTitre="Exemples de lecture, jamais clauses à recopier."
    >
      <Titre>1. Des bénéficiaires successifs</Titre>
      <p>
        Une personne est prévue en premier, puis d’autres à défaut. Demandez ce que « à défaut »
        recouvre dans votre contrat : décès préalable, renonciation, absence de personne désignée.
        Ne supposez pas que les rangs reçoivent tous ensemble.
      </p>
      <Titre>2. Une répartition entre plusieurs personnes</Titre>
      <p>
        Le capital peut être réparti selon des proportions. Vérifiez l’identification, le total de
        la répartition et ce qui advient si l’un ne reçoit pas sa part. La simplicité apparente ne
        résout pas les changements familiaux.
      </p>
      <Titre>3. Une désignation complexe ou démembrée</Titre>
      <p>
        La répartition entre usufruit et nue-propriété soulève des questions civiles, fiscales et de
        protection. Elle demande une rédaction professionnelle et ne se choisit pas à partir d’un
        modèle de formation.
      </p>
      <Encadre titre="Votre travail aujourd’hui">
        <p>
          Retrouver la clause exacte et noter les mots que vous ne comprenez pas. Ne signez ni ne
          recopiez une nouvelle clause à partir de cette fiche.
        </p>
      </Encadre>
      <TableauVierge
        colonnes={[
          "Formulation de mon contrat",
          "Ce que je comprends",
          "Question à faire confirmer",
        ]}
        lignes={4}
      />
      <Champ label="Document daté reçu de l’assureur" />
    </Feuille>
  );
}
