import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";

export function GrilleAuditAssuranceVie() {
  return (
    <Feuille
      titre="Ma grille de lecture assurance-vie"
      sousTitre="Un état des documents, pas une note de qualité du contrat."
    >
      <Champ label="Assureur et référence, à conserver chez moi" />
      <Champ label="Assuré et date du contrat" />
      <Titre>Ce que je peux documenter</Titre>
      <TableauVierge
        colonnes={["Information", "Retrouvée / à demander", "Document daté"]}
        lignes={6}
      />
      <p>
        À reporter dans le tableau : relevé récent ; historique des versements ; clause en vigueur ;
        avenants ; éventuelle acceptation du bénéficiaire ; frais, garanties et conditions de
        disponibilité prévus au contrat.
      </p>
      <Titre>Ce que je comprends</Titre>
      <Champ label="Personnes désignées et ordre / répartition" />
      <Champ label="Mots ou situations que je veux faire expliquer" />
      <Champ label="Ma demande à l’assureur, envoyée le" />
      <Encadre titre="Le bon résultat">
        <p>
          Retrouver tous les documents ne prouve pas que le contrat convient à vos besoins. Une
          pièce manquante ne prouve pas qu’il est mauvais. Ne modifiez rien uniquement sur la base
          de cette grille.
        </p>
      </Encadre>
    </Feuille>
  );
}
