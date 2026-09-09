import {
  Case,
  Champ,
  Encadre,
  Feuille,
  Source,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";

/**
 * LE TABLEAU DE BORD FAMILIAL — la feuille qu’on montre à ses enfants.
 *
 * Tous les autres documents du Plan familial parlent au lecteur. Celui-ci parle
 * à sa famille : une ligne par personne, son nom écrit à la main, ce qu’elle
 * reçoit, et ce qu’elle paierait aujourd’hui. C’est le seul endroit du classeur
 * où un enfant retrouve SON chiffre sans avoir à refaire le calcul de tout le
 * monde.
 *
 * ⚠️ LE TABLEAU DES ABATTEMENTS N’EST PLUS SUR CETTE FEUILLE. Il est parti sur
 * « Les abattements de chacun », la feuille suivante du classeur. Ce n’est pas
 * un renoncement au principe « elle voyage seule » : une fois écrites les
 * lignes qui manquaient — le conjoint et le partenaire de PACS, le
 * petit-enfant en donation ET au décès, l’abattement de l’héritier handicapé —
 * la table fait douze lignes et le barème sept tranches. Elle ne tenait plus au
 * bas d’une feuille à remplir au stylo, et une feuille qui voyage seule ne peut
 * pas être une liasse de trois. Les deux feuilles voyagent donc ensemble, dans
 * cet ordre, et la checklist le fait vérifier.
 *
 * ⚠️ LES TROIS DATES NE SONT PLUS SUR CETTE FEUILLE NON PLUS, et c’est la même
 * logique. Elles ont leur feuille — « Le Calendrier des 3 dates » — et leur
 * section sur « Mon plan en une page », toutes deux rangées dans ce classeur.
 * Recopiées ici en trois lignes d’indices, elles arrivaient forcément
 * mutilées : l’échelle de l’article 669 aplatie en deux marches (60 % / 70 %)
 * alors qu’elle en compte quatre, l’assurance-vie qui bascule sur la date des
 * VERSEMENTS et non sur celle du contrat, le compteur des quinze ans qui ne
 * part que d’une donation déclarée. Un chiffre faux sur la feuille que la
 * famille tend au notaire coûte plus cher que l’absence du chiffre. Et cette
 * feuille-ci répond à une seule question — qui reçoit quoi, et ce qu’il
 * paierait — qui n’est pas celle du calendrier du donateur.
 *
 * ⚠️ DEUX PAGES, ET LA COUPURE EST PLACÉE. Mesuré dans les conditions réelles
 * d’impression (@page A4, marges 18 mm / 16 mm → 178 mm utiles, html à 12 pt,
 * `.wrap-wide` autour de la feuille) : 502 mm, soit 1,92 page. La version qui
 * portait encore les trois dates faisait 547 mm et sortait sur TROIS feuilles,
 * dont une dernière ne portant que ~25 mm — la demi-page que `TableauVierge`
 * interdit. La coupure tombe désormais juste après la ligne « Total », donc
 * entre le travail à faire au stylo (consignes, tableau, total) et ce qui se
 * lit (sources, papiers, encadré, checklist). Il reste ~4 mm de marge avant
 * que le total ne bascule en page 2 : toute phrase ajoutée au-dessus se
 * remesure. Repère : la feuille compagnon « Les abattements de chacun » fait
 * 609 mm et « Mon plan en une page » 445 mm — deux pages sont la norme de la
 * collection, trois ne le sont pas.
 *
 * ⚠️ QUATRE COLONNES, PAS CINQ. La colonne « Sa prochaine date » a été retirée,
 * et pas seulement pour gagner de la largeur : elle était fausse. Le 70e et le
 * 71e anniversaire sont ceux du PARENT, pas de l’héritier, et le compteur des
 * 15 ans court par donation, la même pour tout le monde. Il n’existe pas de
 * « prochaine date » propre à chaque personne. Quatre colonnes sur 152 mm
 * utiles — la largeur intérieure réelle à l’impression, une fois retirés les
 * 16 mm de marge de page, le padding-inline d’1 rem de `.wrap-wide` et le p-8
 * de la feuille — soit ~38 mm par case : la place d’écrire « Julien, mon fils »
 * et « la moitié de la maison de Nantes » avec une main de 78 ans.
 *
 * ⚠️ Cinq lignes d’héritiers, pas davantage. Une famille qui déborde prend une
 * seconde feuille : mieux vaut deux tableaux lisibles qu’un tableau de douze
 * lignes écrit en pattes de mouche.
 *
 * ⚠️ Le mode d’emploi des colonnes est imprimé AVANT le tableau. On ne remplit
 * pas au stylo une case dont la consigne est vingt centimètres plus bas.
 *
 * ⚠️ Aucune durée promise dans l’encadré destiné aux enfants. « Elle lui fera
 * gagner plusieurs semaines » portait sur le travail d’un tiers dont on ne
 * maîtrise rien, au futur affirmatif et invérifiable. On dit ce que la feuille
 * CONTIENT, jamais ce qu’elle fera gagner — ni ce qu’elle épargnera au notaire.
 */

const COLONNES_HERITIERS: string[] = [
  "Prénom et lien de parenté",
  "Ce qui lui revient",
  "Son abattement",
  "Ce qu’il paierait aujourd’hui",
];

export function TableauBordFamilial() {
  return (
    <Feuille
      titre="Le tableau de bord familial"
      sousTitre="Qui reçoit quoi, et ce que chacun paierait aujourd’hui. Une ligne par personne — c’est la feuille que vous montrez à vos enfants."
    >
      <Champ label="Établi par" />
      <Champ label="Le" indice="à refaire à chaque donation et à chaque naissance" />

      <Titre>1. Une ligne par personne</Titre>
      <ul className="space-y-1 text-[0.93rem]">
        <li>
          <strong>Colonne 2</strong> — le bien, la part de la maison, le contrat.
        </li>
        {/* La colonne 4 chiffre une SUCCESSION : sans « ligne au décès », le
            lecteur reporte les 31 865 € de donation du petit-enfant (art. 790 B)
            sur quelqu’un qui n’y a pas droit au décès, et écrit 0 € là où il y a
            des droits. Sans le rappel de l’art. 784, il oublie ce qui a déjà été
            donné et sous-estime d’autant. */}
        <li>
          <strong>Colonne 3</strong> — son abattement : ce qu’elle reçoit sans payer un centime.
          Recopiez la ligne <strong>« au décès »</strong> de la feuille « Les abattements de chacun
          », rangée derrière celle-ci — la colonne 4 chiffre une succession, pas une donation.
          Retirez-en les donations déclarées qu’elle a déjà reçues de moi depuis moins de quinze ans
          (art. 784 du CGI ; elles sont au point 6 de « Ma fiche famille »).
        </li>
        <li>
          <strong>Colonne 4, pour un enfant ou un petit-enfant</strong> — refaites les points 5
          (l’abattement) et 6 (le barème) du Feuille de votre Facture Invisible sur la part de cette
          personne-là, avec SON abattement. Si tous vos enfants reçoivent la même part, le chiffre
          de l’encadré F de la Feuille vaut pour chacun d’eux.
        </li>
        {/* Le point 6 de la Feuille EST le barème de la ligne directe. Appliqué à
            un neveu, il écrit 16 601 € là où l’art. 777 en réclame 50 618 sur
            100 000 € reçus : 34 000 € d’écart sur la feuille montrée au notaire. */}
        <li>
          <strong>Colonne 4, pour tous les autres</strong> — frère, sœur, neveu, nièce, personne
          sans lien : le barème de la Feuille ne vaut pas. Calcul à la main avec la colonne «
          Au-delà, il paie » de la feuille des abattements, confirmé par le notaire.
        </li>
      </ul>
      <TableauVierge colonnes={COLONNES_HERITIERS} lignes={5} />
      {/* Le « total après mon plan » n’est pas ici : il est sur « Mon plan en une
          page », qui le demande déjà mot pour mot. Cette feuille-ci répond à une
          seule question — ce que la famille paierait AUJOURD’HUI — et une ligne
          vide « après mon plan » n’a aucun sens pour l’enfant qui la lit. */}
      <Champ label="Total, pour toute la famille, aujourd’hui" indice="additionnez la colonne 4" />
      <Source>
        Abattements : art. 779 du CGI. Rappel des donations de moins de quinze ans : art. 784.
        Barème en ligne directe, celui de la Feuille : art. 777.
      </Source>

      {/* Sans intertitre, ces deux champs se lisent à l’impression comme une
          quatrième et une cinquième ligne du tableau. « Mon plan en une page »
          leur donne déjà une section à eux (« Où sont les papiers »). */}
      <Titre>2. Où sont les papiers, et qui appeler</Titre>
      <Champ label="Ce classeur se trouve" />
      <Champ label="Mon notaire" indice="nom, étude, téléphone" />

      <div className="eviter-coupure">
        <Encadre titre="POUR MES ENFANTS, QUI LIRONT CETTE FEUILLE">
          <p className="text-[0.95rem]">
            Ce tableau n’est pas un testament et ne remplace aucun acte : c’est l’état des lieux tel
            que je le comprends à la date écrite en haut, et les colonnes 3 et 4 sont des ordres de
            grandeur, pas une facture. Apportez-le au notaire indiqué ci-dessus — il donne en une
            page qui reçoit quoi, avec quel abattement, et ce que chacun paierait. Faites-lui relire
            chaque ligne.
          </p>
        </Encadre>
      </div>

      <Titre>Avant de ranger cette feuille</Titre>
      <ul className="eviter-coupure space-y-1">
        <Case>Chaque ligne du tableau porte un prénom, pas seulement « les enfants ».</Case>
        <Case>La colonne 4 est remplie pour chacun, même quand le montant est 0 €.</Case>
        <Case>
          La feuille « Les abattements de chacun » et la Feuille de votre Facture Invisible sont
          rangés juste derrière celle-ci, et une copie des trois avec le Plan en une page, en tête
          de classeur.
        </Case>
        <Case>J’ai dit à mes enfants où est ce classeur, et c’est écrit au point 2.</Case>
      </ul>
      <Champ label="Mise à jour le" indice="et par qui" />

      <p className="text-[0.9rem]">
        Les montants et les articles cités ici sont ceux du Code général des impôts à la date écrite
        en haut de cette feuille. La législation évolue : vérifiez-les sur legifrance.gouv.fr ou
        impots.gouv.fr avant toute décision, et faites relire ce tableau par votre notaire.
      </p>
    </Feuille>
  );
}
