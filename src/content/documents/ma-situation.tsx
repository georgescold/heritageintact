import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";

export function MaSituation() {
  return (
    <Feuille
      titre="Ma fiche de situation"
      sousTitre="Une priorité, les informations disponibles, les questions à vérifier."
    >
      <Champ label="Fiche préparée le" />
      <Champ label="Mon objectif en une phrase" />
      <Titre>Ma famille et mes documents</Titre>
      <p>
        Notez les liens familiaux utiles, la présence d’un conjoint ou partenaire et les grandes
        catégories de biens. Pas de numéro de compte, de donnée médicale ou de montant à envoyer à
        la formation.
      </p>
      <TableauVierge
        colonnes={["Ce que je sais", "Document ou information à retrouver", "Question à vérifier"]}
        lignes={4}
      />
      <Titre>Mon point de départ</Titre>
      <p>
        Plusieurs situations peuvent coexister : couple marié, famille recomposée, veuvage, PACS ou
        union libre, absence d’enfant, enfant vulnérable, international, donations passées, biens
        locatifs, entreprise ou patrimoine diversifié. Le questionnaire met une fiche en avant ; il
        n’établit pas un diagnostic.
      </p>
      <Champ label="La situation que je souhaite éclaircir d’abord" />
      <Encadre titre="Une seule action pour commencer">
        <Champ label="Ce que je vais retrouver ou demander" />
        <Champ label="À qui, et quand" />
      </Encadre>
    </Feuille>
  );
}
