import { Feuille, Champ, Encadre } from "@/components/documents/Feuille";
export function LettreModificationClause() {
  return (
    <Feuille
      titre="Mon courrier à l’assureur"
      sousTitre="Demander les informations avant toute modification."
    >
      <p>
        Ce modèle ne change pas votre clause. Envoyez-le par le canal sécurisé habituel de votre
        assureur, après avoir vérifié ses coordonnées. N’envoyez pas vos contrats au support de la
        formation.
      </p>
      <Champ label="Assureur et référence du contrat" />
      <Encadre titre="Texte à adapter">
        <p>
          Madame, Monsieur, je souhaite faire le point sur mon contrat référencé ci-dessus. Merci de
          me transmettre la clause bénéficiaire actuellement en vigueur et ses avenants,
          l’historique des versements permettant de distinguer ceux effectués avant et après mes 70
          ans, ainsi que les informations relatives à une éventuelle acceptation du bénéficiaire.
        </p>
        <p>
          Merci de préciser les documents et la procédure nécessaires si je souhaite, après conseil,
          envisager une modification. Cette demande d’informations ne constitue pas une instruction
          de changement de bénéficiaire, de rachat ou de versement.
        </p>
        <p>
          Je vous remercie de votre réponse écrite et reste disponible par votre canal sécurisé.
        </p>
      </Encadre>
      <Champ label="Envoyé le" />
      <Champ label="Réponse reçue le" />
      <Champ label="Point à revoir avec le notaire" />
      <p>
        Conservez la réponse. Une acceptation de bénéficiaire, un testament ou une situation
        particulière peuvent modifier la procédure : faites vérifier votre cas.
      </p>
    </Feuille>
  );
}
