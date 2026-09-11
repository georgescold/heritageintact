import { Case, Champ, Feuille, Source, TableauVierge, Titre } from "@/components/documents/Feuille";

/**
 * LA FICHE FAMILLE (Le Dossier à apporter chez votre notaire).
 *
 * ⚠️ Le tableau des donations passées porte une colonne « déclarée ? » et une
 * colonne « date exacte ». Ce sont les deux seules informations que le notaire
 * ne peut pas retrouver seul, et ce sont elles qui commandent le compteur des
 * 15 ans. Une donation datée « vers 2011 » ne sert à rien.
 */
export function FicheFamille() {
  return (
    <Feuille
      titre="Ma fiche famille"
      sousTitre="Qui est qui, et ce qui a déjà été donné. La seconde pièce du dossier."
    >
      <Titre>1. Moi</Titre>
      <Champ label="Nom, prénom" />
      <Champ label="Date et lieu de naissance" />
      <Champ label="Adresse" />

      <Titre>2. Ma situation matrimoniale</Titre>
      <ul className="space-y-1">
        <Case>Marié — date et lieu du mariage :</Case>
        <Case>Pacsé — date d&apos;enregistrement :</Case>
        <Case>Concubin</Case>
        <Case>Divorcé</Case>
        <Case>Veuf ou veuve — date du décès :</Case>
        <Case>Célibataire</Case>
      </ul>
      <Champ
        label="Régime matrimonial"
        indice="communauté, séparation de biens, participation aux acquêts"
      />
      <Champ
        label="Contrat de mariage"
        indice="oui / non — si oui, chez quel notaire et en quelle année"
      />
      <Champ label="Donation au dernier vivant" indice="oui / non / je ne sais pas" />

      <Titre>3. Mon conjoint ou partenaire</Titre>
      <Champ label="Nom, prénom" />
      <Champ label="Date et lieu de naissance" />

      <Titre>4. Mes enfants</Titre>
      <TableauVierge
        colonnes={["Nom et prénom", "Né(e) le", "Issu de quelle union", "Situation particulière"]}
        lignes={4}
      />
      <Source>
        Situation particulière : enfant d&apos;un premier lit, enfant du conjoint, enfant adopté,
        enfant résidant à l&apos;étranger, enfant protégé ou en situation de handicap.
      </Source>

      <Titre>5. Mes petits-enfants</Titre>
      <TableauVierge colonnes={["Nom et prénom", "Né(e) le", "Enfant de"]} lignes={5} />

      <Titre>6. Les donations déjà faites</Titre>
      <TableauVierge
        colonnes={["À qui", "Quoi", "Montant ou valeur", "Date exacte", "Déclarée ?"]}
        lignes={5}
      />
      <Source>
        Notez aussi les dons d&apos;argent remis de la main à la main, même anciens, même modestes,
        même non déclarés. C&apos;est précisément ce que le notaire a besoin de savoir avant de
        rédiger quoi que ce soit.
      </Source>

      <Titre>7. Testament</Titre>
      <Champ label="J'ai rédigé un testament" indice="oui / non — si oui, où est-il déposé ?" />

      <p className="text-[0.9rem]">
        Joignez les justificatifs d’état civil demandés par l’étude : cette fiche donnera au
        notaire une vue d’ensemble pour préparer l’examen des pièces officielles.
      </p>
    </Feuille>
  );
}
