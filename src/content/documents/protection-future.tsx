import { Case, Champ, Encadre, Feuille, Source, TableauVierge, Titre } from "@/components/documents/Feuille";

export function ProtectionFuture() {
  return (
    <Feuille
      titre="Préparer ma protection si je ne peux plus décider"
      sousTitre="Un dossier de réflexion à apporter au professionnel - pas un mandat de protection future."
    >
      <Encadre titre="Ce que cette fiche fait réellement">
        <p>
          Elle vous aide à exprimer vos souhaits, à vérifier qu’une personne accepte la mission et
          à préparer les pouvoirs à discuter. Remplir cette fiche ne donne aucun pouvoir à qui que
          ce soit. Seul un dispositif valablement établi et, le moment venu, régulièrement mis en
          œuvre peut permettre à une autre personne d’agir pour vous.
        </p>
      </Encadre>

      <Titre>1. Les personnes auxquelles je pense</Titre>
      <TableauVierge
        colonnes={["Rôle envisagé", "Personne", "En a-t-elle parlé avec moi ?", "Remplaçant"]}
        lignes={3}
      />
      <ul className="space-y-2">
        <Case>La personne principale a compris la responsabilité et l’accepte en principe.</Case>
        <Case>Une solution de remplacement est prévue si elle devient indisponible.</Case>
        <Case>Les éventuels conflits d’intérêts ont été signalés au professionnel.</Case>
      </ul>

      <Titre>2. Ce que je souhaite préserver</Titre>
      <Champ label="Mon mode de vie et mon lieu de vie souhaités" />
      <Champ label="Les dépenses et revenus qui doivent continuer à être suivis" />
      <Champ label="Les biens ou activités qui demandent une attention particulière" />
      <Champ label="La personne qui pourrait contrôler ou recevoir les comptes de gestion" />

      <Titre>3. Les questions à faire formaliser</Titre>
      <TableauVierge
        colonnes={["Décision ou pouvoir envisagé", "Pourquoi", "Réponse du professionnel"]}
        lignes={4}
      />
      <Source>
        Un mandat sous signature privée et un mandat notarié n’accordent pas nécessairement les
        mêmes pouvoirs. Demandez quelle forme convient aux actes réellement envisagés.
      </Source>

      <Titre>4. Après l’acte officiel</Titre>
      <Champ label="Acte ou dispositif finalement retenu" />
      <Champ label="Date et lieu de conservation de l’original" />
      <Champ label="Personnes informées et copies remises" />
      <Champ label="Date choisie pour vérifier que tout est encore à jour" />

      <Source>
        Référence à vérifier au moment de votre démarche :{" "}
        <a href="https://www.service-public.fr/particuliers/vosdroits/F16670">
          Service-Public.fr - Mandat de protection future
        </a>
        .
      </Source>
    </Feuille>
  );
}
