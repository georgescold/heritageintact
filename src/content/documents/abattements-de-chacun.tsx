import { Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * LES ABATTEMENTS DE CHACUN — la feuille de référence du tableau de bord.
 *
 * Elle est née du Tableau de bord familial, où la table des abattements tenait
 * en bas de page. Elle n’y tenait plus dès qu’on y a écrit les lignes qui
 * manquaient, et elle a sa fonction propre : on la garde à côté de soi, ouverte,
 * pendant qu’on remplit la colonne 3 de l’autre feuille. On ne remplit pas une
 * colonne en tournant les pages.
 *
 * ⚠️ CHAQUE LIGNE DIT S’ELLE VAUT EN DONATION OU AU DÉCÈS, et c’est la raison
 * d’être de cette feuille. L’ancienne version mélangeait sans le dire des
 * abattements de donation (art. 790 B, 790 G) et des abattements de succession
 * (art. 788 IV). Un petit-enfant à qui l’on prête 31 865 € au décès, c’est
 * 30 271 € de base oubliés et environ 6 000 € de droits réels présentés comme
 * nuls — sur la feuille même que la famille montrera au notaire.
 *
 * ⚠️ LE CONJOINT ET LE PARTENAIRE DE PACS SONT EN TÊTE, avant les enfants. Sur
 * une cible de 65 à 85 ans, le lecteur marié est le cas majoritaire ; sans sa
 * ligne, il rangeait son épouse à la dernière ligne disponible — « une personne
 * sans lien de parenté, 1 594 € puis 60 % » — et la feuille fabriquait une
 * facture pour quelqu’un qui ne doit rien.
 *
 * ⚠️ AUCUN TAUX N’EST ÉCRIT POUR LES DONATIONS ENTRE ÉPOUX ET PARTENAIRES. Le
 * tarif de l’article 777 qui leur est propre n’est pas recopié ici parce qu’un
 * barème à moitié recopié est pire qu’un renvoi : c’est exactement le défaut que
 * cette feuille corrige pour la ligne directe. On nomme l’article et on fait
 * poser la question.
 *
 * ⚠️ Aucun nom de contrat, d’assureur ou de banque. On explique comment LIRE ce
 * qu’on a, jamais quoi acheter : le second serait du conseil en investissement,
 * réglementé.
 */

/**
 * `qui` porte le périmètre — « en donation », « au décès », ou les deux. Une
 * cinquième colonne aurait ramené chaque case à ~32 mm de large, illisible à
 * l’impression ; le périmètre est donc écrit dans la colonne qui désigne la
 * personne, là où le lecteur cherche déjà sa ligne.
 */
const ABATTEMENTS: { qui: string; montant: string; audela: string; article: string }[] = [
  {
    qui: "Mon conjoint marié, ou mon partenaire de PACS — au décès",
    montant: "Il ne paie aucun droit de succession, quel que soit le montant",
    audela: "Rien : l’exonération est totale",
    article: "Art. 796-0 bis du CGI",
  },
  {
    qui: "Mon époux, ou mon partenaire de PACS — en donation, de mon vivant",
    montant: "80 724 €",
    audela: "Un tarif qui leur est propre : demandez-en le détail à votre notaire",
    article: "Art. 790 E, 790 F et 777 du CGI",
  },
  {
    qui: "Un enfant — en donation comme au décès",
    montant: "100 000 €, de chacun de ses deux parents",
    audela: "Barème en ligne directe, c’est-à-dire des parents vers les enfants — voir plus bas",
    article: "Art. 779, I et 784 du CGI",
  },
  {
    qui: "Un petit-enfant — en donation, de mon vivant",
    montant: "31 865 €, de chacun de ses quatre grands-parents",
    audela: "Barème en ligne directe — voir plus bas",
    article: "Art. 790 B du CGI",
  },
  {
    qui: "Un petit-enfant — au décès",
    montant:
      "Rien qui lui soit propre. S’il vient à la place de son parent décédé avant moi, il partage avec ses frères et sœurs les 100 000 € de ce parent. Sinon, 1 594 €",
    audela: "Barème en ligne directe — voir plus bas",
    article: "Art. 779, I et 788, IV du CGI",
  },
  {
    qui: "Un don d’argent, en plus — en donation seulement",
    montant: "31 865 €, si j’ai moins de 80 ans le jour du don et si celui qui reçoit est majeur",
    audela: "S’ajoute aux 100 000 € de l’enfant comme aux 31 865 € du petit-enfant",
    article: "Art. 790 G du CGI",
  },
  {
    qui: "Un frère ou une sœur — en donation comme au décès",
    montant: "15 932 €",
    audela: "35 % jusqu’à 24 430 €, puis 45 %",
    article: "Art. 777 et 779, IV du CGI",
  },
  {
    qui: "Un neveu ou une nièce — en donation comme au décès",
    montant: "7 967 €",
    audela: "55 %",
    article: "Art. 777 et 779, V du CGI",
  },
  {
    qui: "Une personne sans lien de parenté — au décès",
    montant: "1 594 €. En donation, de mon vivant, elle n’a aucun abattement",
    audela: "60 %",
    article: "Art. 777 et 788, IV du CGI",
  },
  {
    qui: "Un héritier ou un donataire handicapé — en plus de sa ligne ci-dessus",
    montant: "159 325 €",
    audela: "Se cumule avec tous les autres abattements de ce tableau",
    article: "Art. 779, II du CGI",
  },
  {
    qui: "Assurance-vie, versements faits avant mes 70 ans",
    montant: "152 500 € par bénéficiaire",
    audela: "Voir l’étape assurance-vie",
    article: "Art. 990 I du CGI",
  },
  {
    qui: "Assurance-vie, versements faits après mes 70 ans",
    montant: "30 500 € au total, tous contrats et tous bénéficiaires confondus",
    audela: "Voir l’étape assurance-vie",
    article: "Art. 757 B du CGI",
  },
];

export function AbattementsDeChacun() {
  return (
    <Feuille
      titre="Les abattements de chacun"
      sousTitre="La feuille de référence à garder ouverte à côté de vous pendant que vous remplissez le tableau de bord familial."
    >
      <p className="text-[0.95rem]">
        Un abattement, c’est ce que cette personne reçoit sans payer un centime. L’impôt ne commence
        qu’au-delà. Un abattement de donation ne vaut pas au décès, et l’inverse est vrai aussi : la
        première colonne dit chaque fois lequel des deux.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[18rem] border-collapse text-left text-[0.92rem]">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                Qui, et quand
              </th>
              <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                Reçoit sans payer
              </th>
              <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                Au-delà, il paie
              </th>
              <th className="border border-black px-2 py-1.5 align-bottom font-bold">L’article</th>
            </tr>
          </thead>
          <tbody>
            {ABATTEMENTS.map((a) => (
              <tr key={a.qui}>
                <td className="border border-black px-2 py-1.5">{a.qui}</td>
                <td className="border border-black px-2 py-1.5">{a.montant}</td>
                <td className="border border-black px-2 py-1.5">{a.audela}</td>
                <td className="border border-black px-2 py-1.5">{a.article}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Source>
        Un partenaire de PACS n’est pas héritier : sans testament, l’exonération de l’article 796-0
        bis s’applique à zéro euro. Le don de somme d’argent de l’article 790 G ne porte que sur de
        l’argent — espèces, chèque, virement — et doit être déclaré dans le mois. Chaque donation
        cesse d’être rappelée quinze ans après sa propre date, donation par donation (art. 784 du
        CGI).
      </Source>

      <Titre>Le barème en ligne directe</Titre>
      <Source>
        Article 777 du Code général des impôts, sept tranches : 5 % jusqu’à 8 072 €, 10 % jusqu’à 12
        109 €, 15 % jusqu’à 15 932 €, 20 % jusqu’à 552 324 €, 30 % jusqu’à 902 838 €, 40 % jusqu’à 1
        805 677 €, 45 % au-delà. Chaque héritier est imposé sur sa part à lui, après son abattement
        à lui.
      </Source>

      <Encadre titre="LES LIGNES QUE LE SIMULATEUR NE CALCULE PAS">
        <p className="text-[0.93rem]">
          La Feuille de votre Facture Invisible ne traite que la ligne directe : les enfants et les
          petits-enfants. Pour un frère, une sœur, un neveu, une nièce ou une personne sans lien de
          parenté, le calcul se fait à la main avec ce tableau — ce qu’elle reçoit, moins son
          abattement, puis le taux de la colonne « Au-delà, il paie ». Faites confirmer le résultat
          par votre notaire avant de le reporter sur le tableau de bord.
        </p>
      </Encadre>

      <p className="text-[0.9rem]">
        Les montants et les barèmes ci-dessus sont ceux du Code général des impôts aux articles
        cités, à la date écrite en haut de votre tableau de bord familial. La législation évolue :
        vérifiez-les sur legifrance.gouv.fr ou impots.gouv.fr avant toute décision, et faites relire
        ce tableau par votre notaire.
      </p>
    </Feuille>
  );
}
