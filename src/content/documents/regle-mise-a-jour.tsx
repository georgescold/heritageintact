import { Case, Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/**
 * LA RÈGLE DE MISE À JOUR (bonus B4).
 *
 * ⚠️ Le vrai risque de ce produit n'est pas de se tromper aujourd'hui : c'est
 * qu'un acheteur ressorte sa feuille dans quatre ans et applique un chiffre
 * périmé. Cette page existe pour que le classeur porte lui-même sa date de
 * péremption, et pour séparer ce qui bouge de ce qui ne bouge pas.
 *
 * ⚠️ Aucun chiffre n'est répété ici : ce serait un endroit de plus à corriger
 * à chaque loi de finances. On renvoie aux feuilles qui les portent.
 */
export function RegleMiseAJour() {
  return (
    <Feuille
      titre="La règle de mise à jour"
      sousTitre="Si la loi change : ce qui bouge, ce qui ne bouge pas, et ce que vous avez à refaire."
    >
      <Titre>Ce qui ne bouge presque jamais</Titre>
      <p>Les principes tiennent depuis des décennies et ne sont pas révisés chaque année :</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Chaque héritier est imposé sur SA part, après SON abattement.</li>
        <li>Le conjoint marié et le partenaire de PACS sont exonérés de droits de succession.</li>
        <li>L&apos;assurance-vie est traitée hors succession civile.</li>
        <li>
          Au décès de l&apos;usufruitier, l&apos;usufruit s&apos;éteint et le nu-propriétaire
          devient plein propriétaire sans droits.
        </li>
        <li>Un enfant ne peut pas être déshérité : sa part minimale est garantie par la loi.</li>
        <li>Une donation non déclarée reste une donation, et elle se découvre au décès.</li>
      </ul>
      <p>
        Tant que ces six lignes restent vraies, la logique de votre plan reste valable, même si un
        montant a changé.
      </p>

      <Titre>Ce qui bouge, et quand</Titre>
      <p>
        Les <strong>montants</strong> — abattements, tranches du barème, plafonds des dons — sont
        fixés par la <strong>loi de finances</strong>, votée chaque année en décembre et applicable
        au 1er janvier. C&apos;est le seul rendez-vous à surveiller.
      </p>
      <p>
        Bougent aussi, plus rarement : la durée du rappel fiscal, les régimes d&apos;exonération
        propres aux entreprises, et les dispositifs temporaires créés pour quelques mois — ces
        derniers ont une date de fin écrite dans le texte, et elle arrive vite.
      </p>

      <Encadre titre="LA RÈGLE, EN UNE PHRASE">
        <p>
          Chaque année, entre le 1er et le 31 janvier, ressortez cette feuille : vérifiez les
          montants sur <strong>impots.gouv.fr</strong>, corrigez-les au stylo sur vos feuilles, et
          recalculez votre chiffre. Comptez trente minutes.
        </p>
      </Encadre>

      <Titre>Les quatre gestes de la revue annuelle</Titre>
      <ul className="space-y-1">
        <Case>
          J&apos;ai vérifié l&apos;abattement par enfant et le barème sur impots.gouv.fr, et je les
          ai corrigés sur La Facture Invisible si besoin.
        </Case>
        <Case>
          J&apos;ai vérifié les deux abattements de l&apos;assurance-vie (avant et après 70 ans).
        </Case>
        <Case>
          J&apos;ai réactualisé la valeur de mes biens : c&apos;est ce qui change le plus, et
          personne n&apos;y pense.
        </Case>
        <Case>
          J&apos;ai relu mes trois dates : l&apos;une d&apos;elles s&apos;est peut-être rapprochée
          au point de devenir la première.
        </Case>
      </ul>

      <Titre>Ce qui oblige à refaire le tour sans attendre janvier</Titre>
      <ul className="list-disc space-y-1 pl-5">
        <li>Un mariage, un PACS, un divorce, un veuvage.</li>
        <li>Une naissance dans la famille.</li>
        <li>Une vente ou un achat immobilier.</li>
        <li>Une donation que vous venez de faire — le compteur des 15 ans repart ce jour-là.</li>
        <li>Un décès dans la famille proche.</li>
      </ul>

      <Champ label="Dernière revue faite le" />
      <Champ label="Prochaine revue prévue le" />

      <p className="text-[0.9rem]">
        Cette feuille décrit une méthode de vérification, pas l&apos;état du droit. La source de
        référence reste impots.gouv.fr, et votre notaire pour ce qui vous concerne personnellement.
      </p>
    </Feuille>
  );
}
