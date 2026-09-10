import { Case, Champ, Encadre, Feuille, Source, TableauVierge, Titre } from "@/components/documents/Feuille";

export function MaisonIndivision() {
  return (
    <Feuille
      titre="Ma maison : préparer les décisions avant qu’elles ne se bloquent"
      sousTitre="Clarifier vos intentions et les questions à faire formaliser - pas décider des droits des héritiers."
    >
      <Encadre titre="Pourquoi cette fiche existe">
        <p>
          Dire « je veux qu’ils gardent la maison » ne précise ni qui pourra l’occuper, ni qui
          paiera les charges, ni comment une part pourrait être rachetée. Cette fiche transforme
          une intention familiale en décisions concrètes à examiner avec le notaire.
        </p>
      </Encadre>

      <Titre>1. La situation actuelle du bien</Titre>
      <Champ label="Propriétaire(s) et quotes-parts à faire confirmer" />
      <Champ label="Emprunt, usufruit, indivision ou autre particularité" />
      <Champ label="Personne qui occupe actuellement le logement" />
      <Champ label="Charges, travaux ou revenus liés au bien" />

      <Titre>2. Ce que je souhaite réellement</Titre>
      <ul className="space-y-2">
        <Case>Pouvoir continuer à vivre dans le logement aussi longtemps que possible.</Case>
        <Case>Permettre à un proche de conserver ou de racheter le bien.</Case>
        <Case>Éviter qu’une vente nécessaire soit découverte dans l’urgence.</Case>
        <Case>Ne pas privilégier involontairement une personne au détriment des autres.</Case>
      </ul>

      <Titre>3. Les scénarios à faire expliquer</Titre>
      <TableauVierge
        colonnes={["Scénario", "Qui décide ?", "Financement / charges", "Acte à examiner"]}
        lignes={4}
      />
      <Source>Exemples à comparer : occupation, conservation en commun, rachat d’une part, location ou vente.</Source>

      <Titre>4. La conversation et le rendez-vous</Titre>
      <Champ label="Ce que mes proches ont compris de mon intention" />
      <Champ label="Le désaccord ou la difficulté que je veux éviter" />
      <Champ label="La première question que je poserai au notaire" />

      <Encadre titre="Ce qui donnera un effet réel">
        <p>
          Cette feuille ne crée aucun droit d’occupation, de vente ou de partage. Notez ici l’acte
          finalement conseillé, signé ou enregistré, puis conservez sa preuve avec votre dossier.
        </p>
        <Champ label="Acte ou décision effectivement formalisé(e)" />
      </Encadre>

      <Source>
        Référence à vérifier :{" "}
        <a href="https://www.service-public.fr/particuliers/vosdroits/F1296">
          Service-Public.fr - Succession et indivision entre les héritiers
        </a>
        .
      </Source>
    </Feuille>
  );
}
