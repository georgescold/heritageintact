import { Feuille, Titre } from "@/components/documents/Feuille";
export function ExempleDossier() {
  return (
    <Feuille
      titre="Un exemple de dossier rempli"
      sousTitre="Claire et Marc · Cas guidé de préparation"
    >
      <Titre>Notre objectif</Titre>
      <p>Comprendre comment chacun pourrait rester dans le logement si l’autre décédait.</p>
      <Titre>Ce que nous savons</Titre>
      <p>
        Nous sommes mariés et avons deux enfants communs. Nous avons retrouvé l’acte d’achat de la
        maison et un relevé d’épargne. La valeur de la maison doit être datée et les quotes-parts
        vérifiées.
      </p>
      <Titre>Ce qui nous manque</Titre>
      <p>
        Confirmation du régime matrimonial, éventuelles dispositions entre époux, historique des
        donations et documents d’assurance-vie.
      </p>
      <Titre>Nos trois questions</Titre>
      <ol className="list-decimal pl-5">
        <li>À qui appartient quoi aujourd’hui ?</li>
        <li>Quels seraient les droits de chacun au premier décès ?</li>
        <li>Quels coûts, contraintes et protections comportent les options envisagées ?</li>
      </ol>
      <Titre>Notre message</Titre>
      <p>
        Bonjour, nous souhaitons préparer notre transmission en comprenant d’abord la protection de
        chacun dans le logement. Pouvez-vous nous indiquer les pièces utiles, le canal sécurisé pour
        les transmettre et le coût du rendez-vous ou de l’étude ? Merci.
      </p>
      <Titre>Après le rendez-vous</Titre>
      <p>
        Nous notons les réponses confirmées, les pièces complémentaires et la prochaine démarche.
        Une option discutée n’est pas une décision prise. Nous ne signons rien uniquement pour
        terminer un dossier.
      </p>
    </Feuille>
  );
}
