import {
  Case,
  Champ,
  Encadre,
  Feuille,
  Source,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";
import { SchemaBareme } from "@/components/documents/Schemas";

/**
 * LA FEUILLE DE VOTRE FACTURE INVISIBLE — VERSION PAPIER.
 *
 * C'est le document qui tient la promesse de la page de vente : « votre
 * chiffre ». Il existe en trois formes (tableur, Excel, papier) et c'est la
 * version papier qui compte le plus sur cet avatar — il la remplit au stylo,
 * à la table de la cuisine, et il la garde.
 *
 * Le barème est recopié en entier plutôt que résumé : quelqu'un qui refait le
 * calcul à la main doit pouvoir aller au bout sans revenir à l'écran.
 */
export function SimulateurPapier() {
  return (
    <Feuille
      titre="La Facture Invisible"
      sousTitre="Ce que votre famille paierait si la succession s'ouvrait aujourd'hui."
    >
      <SchemaBareme />
      <p>
        Remplissez les six lignes ci-dessous au stylo. Comptez vingt minutes. À la fin, vous aurez
        un nombre — celui que personne ne vous a jamais donné.
      </p>

      <Titre>1. Ce que vous possédez</Titre>
      <TableauVierge colonnes={["Bien ou compte", "Valeur estimée", "Détenu par"]} lignes={6} />
      <Champ label="A. Total de vos biens" indice="(additionnez la colonne du milieu)" />

      <Titre>2. Ce que vous devez</Titre>
      <Champ label="B. Crédits et dettes en cours" />

      <Titre>3. La masse à partager</Titre>
      <Champ label="C = A − B" />

      <Titre>4. La part de chaque enfant</Titre>
      <p>
        Divisez C par le nombre d&apos;enfants. Chaque enfant est imposé sur SA part, après SON
        abattement.
      </p>
      <Champ label="D. Part d'un enfant" indice="C ÷ nombre d'enfants" />

      <Titre>5. L&apos;abattement</Titre>
      <p>
        Chaque enfant reçoit un abattement de <strong>100 000 €</strong> par parent. Il se
        reconstitue tous les 15 ans.
      </p>
      <Source>Articles 779 et 784 du Code général des impôts.</Source>
      <Champ
        label="E. Part taxable = D − 100 000 €"
        indice="si le résultat est négatif, écrivez 0"
      />

      <Titre>6. Le barème, tranche par tranche</Titre>
      <p>Appliquez chaque tranche à la part taxable E, puis additionnez la colonne de droite.</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[18rem] border-collapse text-left text-[0.92rem]">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1.5 font-bold">
                Fraction de la part taxable
              </th>
              <th className="border border-black px-2 py-1.5 font-bold">Taux</th>
              <th className="border border-black px-2 py-1.5 font-bold">Votre montant</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Jusqu'à 8 072 €", "5 %"],
              ["De 8 072 € à 12 109 €", "10 %"],
              ["De 12 109 € à 15 932 €", "15 %"],
              ["De 15 932 € à 552 324 €", "20 %"],
              ["De 552 324 € à 902 838 €", "30 %"],
              ["De 902 838 € à 1 805 677 €", "40 %"],
              ["Au-delà de 1 805 677 €", "45 %"],
            ].map(([tranche, taux]) => (
              <tr key={tranche}>
                <td className="border border-black px-2 py-1.5">{tranche}</td>
                <td className="border border-black px-2 py-1.5">{taux}</td>
                <td className="h-[36px] border border-black px-2 py-1.5" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Source>Article 777 du Code général des impôts, barème en ligne directe.</Source>

      <Encadre titre="F. VOTRE FACTURE INVISIBLE, PAR ENFANT">
        <div className="min-h-[44px] border-b border-black" />
        <p className="mt-2 text-[0.9rem]">
          Multipliez par le nombre d&apos;enfants pour obtenir le total que votre famille devra
          régler. Les droits se paient dans les six mois du décès, en argent.
        </p>
      </Encadre>

      <Titre>Le cas de Jean-Pierre, pour comparer</Titre>
      <p>
        Maison 480 000 € + épargne 40 000 € = 520 000 €. Un enfant, Julien. Part taxable : 520 000 −
        100 000 = <strong>420 000 €</strong>.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left text-[0.92rem]">
          <tbody>
            {[
              ["8 072 € à 5 %", "403,60 €"],
              ["4 037 € à 10 %", "403,70 €"],
              ["3 823 € à 15 %", "573,45 €"],
              ["404 068 € à 20 %", "80 813,60 €"],
            ].map(([ligne, montant]) => (
              <tr key={ligne}>
                <td className="border border-black px-2 py-1.5">{ligne}</td>
                <td className="border border-black px-2 py-1.5 text-right">{montant}</td>
              </tr>
            ))}
            <tr>
              <td className="border border-black px-2 py-1.5 font-bold">Total dû par Julien</td>
              <td className="border border-black px-2 py-1.5 text-right font-bold">82 194 €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Julien a 40 000 € d&apos;économies. Il doit 82 194 €. La maison part en vente. Les étapes
        suivantes montrent comment ce même chiffre tombe à <strong>13 988 €</strong> — 68 206 € de
        moins, près de six fois moins.
      </p>

      <Titre>Ce soir, avant de ranger cette feuille</Titre>
      <ul className="space-y-1">
        <Case>J&apos;ai écrit mon chiffre dans l&apos;encadré F.</Case>
        <Case>Je l&apos;ai reporté en haut du Calendrier des 3 dates.</Case>
        <Case>J&apos;ai daté cette feuille : les valeurs bougent, le calcul se refait.</Case>
      </ul>
      <Champ label="Fait le" />
    </Feuille>
  );
}
