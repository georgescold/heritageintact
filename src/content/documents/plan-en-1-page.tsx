import {
  Champ,
  Encadre,
  Feuille,
  Source,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";

/**
 * LE PLAN EN 1 PAGE — la feuille de sortie de La Méthode.
 *
 * C'est le seul document qui rassemble tout : le chiffre, les trois dates, les
 * décisions prises. Il est conçu pour être posé sur le bureau du notaire et
 * pour que le conjoint sache où en sont les choses sans avoir à demander.
 *
 * ⚠️ Une seule page, et jamais deux. La valeur tient exactement là : une
 * personne qui a tout compris tient sur une feuille.
 */
export function PlanEnUnePage() {
  return (
    <Feuille
      titre="Mon plan en une page"
      sousTitre="Le chiffre, les dates, les décisions. Rien d'autre. Rangez-le en tête de classeur."
    >
      <div className="grid gap-3">
        <Champ label="Établi par" />
        <Champ label="Le" />
        <Champ label="À revoir le" indice="chaque année, et à chaque changement de loi" />
      </div>

      <Titre>1. Mon chiffre</Titre>
      <Champ label="Ce que ma famille paierait aujourd'hui" indice="Facture Invisible, encadré F" />
      <Champ
        label="Ce qu'elle paierait après mon plan"
        indice="à recalculer une fois les décisions prises"
      />

      <Titre>2. Mes trois dates</Titre>
      <TableauVierge colonnes={["La date", "Le jour", "Ce que je fais avant"]} lignes={3} />
      <Source>
        Compteur des 15 ans : art. 779 et 784 du CGI. 70e anniversaire : art. 990 I et 757 B du CGI.
        71e anniversaire : art. 669 du CGI.
      </Source>

      <Titre>3. Ce que j&apos;ai décidé</Titre>
      <TableauVierge
        colonnes={["La décision", "Qui la met en œuvre", "Avant quelle date"]}
        lignes={5}
      />

      <Titre>4. Où sont les papiers</Titre>
      <Champ label="Titres de propriété" />
      <Champ label="Contrats d'assurance-vie" indice="numéro, compagnie, où est le contrat" />
      <Champ label="Donations déjà faites" />
      <Champ label="Testament" indice="où il est déposé" />
      <Champ label="Mon notaire" indice="nom, étude, téléphone" />

      <Encadre titre="POUR CELUI OU CELLE QUI LIRA CETTE FEUILLE APRÈS MOI">
        <p className="text-[0.95rem]">
          Tout est là. Commencez par appeler le notaire indiqué ci-dessus, et donnez-lui cette
          feuille : elle lui donne en une page ce qu&apos;il devrait sinon reconstituer avec vous
          rendez-vous après rendez-vous.
        </p>
      </Encadre>

      <p className="text-[0.9rem]">
        Ce plan est le vôtre, écrit de votre main. Il n&apos;a aucune valeur juridique tant que les
        actes correspondants n&apos;ont pas été passés devant notaire. Faites-le relire au premier
        rendez-vous.
      </p>
    </Feuille>
  );
}
