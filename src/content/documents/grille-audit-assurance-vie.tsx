import {
  Champ,
  Encadre,
  Feuille,
  Source,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";

/**
 * LA GRILLE D'AUDIT DE VOTRE ASSURANCE-VIE — dix points, un point chacun.
 *
 * ⚠️ La note est sur 10 et pas sur 20, et chaque point vaut exactement 1 : un
 * lecteur de 75 ans qui coche dix cases sait immédiatement où il en est, alors
 * qu'une pondération l'obligerait à faire une multiplication au stylo. Le score
 * n'est pas là pour juger, il est là pour classer les contrats entre eux quand
 * il y en a trois et qu'on ne sait pas par lequel commencer.
 *
 * ⚠️ LES DIX POINTS PORTENT TOUS SUR LE CONTRAT AUDITÉ, ET SUR LUI SEUL. C'est
 * la condition pour que deux scores soient comparables. Le seul point qui ne
 * l'était pas — « le nombre de contrats », qui donne la même réponse sur les
 * trois grilles d'un lecteur qui a trois contrats, donc le même point gagné
 * trois fois — est sorti de la liste : c'est devenu le champ d'inventaire en
 * tête de feuille 1, rempli une seule fois. Le point 4 porte désormais l'année
 * d'ouverture, qui est propre au contrat et qui commande la règle applicable
 * (voir le 20 novembre 1991, plus bas).
 *
 * ⚠️ Chaque point est écrit comme un SEUIL, pas comme une question ouverte :
 * « le point si je peux citer le taux exact » se tranche seul, à la maison,
 * sans avoir à décider si la réponse est bonne. C'est ce qui rend la feuille
 * remplissable sans nous. Un seuil qui ne se tranche plus seul n'est plus un
 * seuil : c'est un cours, et il doit sortir de la case à cocher.
 *
 * ⚠️ AUCUN CONTRAT, AUCUN ASSUREUR, AUCUNE BANQUE N'EST NOMMÉ, et aucun seuil
 * de frais n'est présenté comme « bon » ou « mauvais » : recommander un support
 * serait du conseil en investissement, réglementé (statut CIF). On note ici la
 * connaissance que le lecteur a de son propre contrat — savoir lire, jamais
 * quoi acheter.
 *
 * ═══ TROIS `Feuille`, ET CE QUE LE DÉCOUPAGE FAIT VRAIMENT ═══
 *
 * Le document est découpé selon les trois choses qu'il fait réellement : le
 * contrat (4 points), la clause bénéficiaire (6 points), puis le score et les
 * corrections. Chaque `Feuille` repart sur une page propre grâce au
 * `break-before: page` de `.feuille`, ouvre sur son en-tête — marque, titre,
 * contrat audité, contrat au nom de qui — et ferme sur l'avertissement légal du
 * pied de page, que `Feuille` répète justement sur CHAQUE feuille parce que les
 * feuilles sont séparées, rangées dans un classeur et relues des mois plus
 * tard, parfois par un enfant.
 *
 * ⚠️ CE QUE LE DÉCOUPAGE NE FAIT PAS : une `Feuille` n'est pas une feuille A4.
 * Mesurées aux conditions d'impression du projet (A4, marges 18/16 mm, 12 pt,
 * soit environ 161 mm de largeur utile et 261 mm de hauteur par page), les
 * feuilles 2 et 3 dépassent la page et sortent donc chacune sur deux feuilles
 * de papier, dont la seconde n'a ni en-tête ni pied de page. NE PAS ÉCRIRE ICI
 * que chaque feuille tient sur une page : c'est faux, et ça se mesure. Le reste
 * du dossier se comporte pareil — questions-notaire.tsx fait environ 2,3 pages,
 * plan-en-1-page.tsx 1,7 alors que son propre commentaire jure le contraire.
 * C'est un sujet de gabarit, à traiter par une règle vérifiable au niveau de
 * `Feuille` et une passe sur tout `documents/`, pas par une rustine ici.
 *
 * ⚠️ CE QU'ON A FAIT À LA PLACE : retirer du poids là où il n'écrivait rien. Le
 * point 1 portait huit lignes de fiscalité à l'intérieur d'une case à cocher ;
 * les deux assiettes, les deux plafonds et les deux dates d'entrée en vigueur
 * sont descendus dans l'encadré au bas de la feuille 1, hors de la case. Ce
 * qu'on n'a PAS touché, ce sont les zones d'écriture : les rétrécir rendrait la
 * feuille inutilisable au stylo, et c'est tout ce qu'elle est.
 *
 * ⚠️ LE LIBELLÉ EST AU-DESSUS DE LA ZONE D'ÉCRITURE, JAMAIS DESSUS. La version
 * d'origine posait « Ma clause, recopiée mot pour mot : » sur la ligne
 * elle-même : 60 mm de libellé mangés sur 153 mm, pour recopier une clause
 * bénéficiaire entière. Le libellé passe donc au-dessus en 0,85 rem, et la zone
 * d'écriture est vide sur toute la largeur, à 44 px — le plancher fixé par
 * `Champ`, qui est la place qu'il faut pour écrire à la main à 75 ans. Trois
 * lignes là où on recopie une clause qui nomme les bénéficiaires avec leurs
 * dates de naissance, cinq lignes de tableau là où il y a un conjoint et trois
 * enfants.
 *
 * ⚠️ `eviter-coupure` SUR CHAQUE POINT. `.feuille { break-inside: avoid }` est
 * ignoré par le navigateur dès que le bloc dépasse une page — ce qui est le cas
 * ici. Sans la classe sur le `<li>`, un point se retrouve coupé par le saut de
 * page : la case cochée en bas d'une feuille, la ligne où l'on a écrit la
 * réponse en haut de la suivante.
 *
 * ═══ CE QUI A ÉTÉ REDRESSÉ EN DROIT ═══
 *
 * ⚠️ LES DEUX ASSIETTES NE SONT PAS LA MÊME, et la version d'origine les
 * présentait toutes deux comme « ce qui a été versé ». L'art. 990 I frappe les
 * SOMMES DUES au bénéficiaire — versements ET gains ; l'art. 757 B ne taxe que
 * les PRIMES versées après 70 ans, les gains qu'elles ont produits restant hors
 * du calcul. Un lecteur qui a versé 120 000 € avant 70 ans sur un contrat qui
 * en vaut 200 000 se croyait sous les 152 500 € alors qu'il a 47 500 € de base
 * taxable.
 *
 * ⚠️ LES 152 500 € SONT UNIQUES PAR BÉNÉFICIAIRE, TOUS CONTRATS DU MÊME ASSURÉ
 * CONFONDUS. Ils ne se multiplient pas par le nombre de contrats : l'abattement
 * de l'art. 990 I s'applique sur l'ensemble des parts taxables revenant au même
 * bénéficiaire au titre de chaque contrat souscrit sur la tête d'un même
 * assuré, et ne se cumule que si les assurés sont différents (BOFiP
 * BOI-TCAS-AUT-60). La feuille ordonnant « une grille par contrat », un lecteur
 * qui remplit trois grilles concluait mécaniquement à 3 × 152 500 € par enfant
 * — et sous-estimait donc l'impôt. La formule est désormais écrite comme celle
 * des 30 500 €, et la consigne de tête le dit : l'abattement, lui, ne se compte
 * pas grille par grille.
 *
 * ⚠️ DEUX DATES D'ENTRÉE, UNE PAR ARTICLE — et non deux conditions cumulatives
 * pesant sur les deux règles à la fois. L'art. 757 B ne vise que les contrats
 * souscrits à compter du 20 novembre 1991 (loi n° 91-1323) ; l'art. 990 I que
 * les sommes versées à compter du 13 octobre 1998 (LF 1999). La conséquence est
 * favorable au lecteur, donc on ne la lui cache pas : un contrat ouvert AVANT
 * le 20 novembre 1991 échappe entièrement à l'art. 757 B, y compris pour les
 * primes versées après 70 ans, qui relèvent alors de l'art. 990 I et de ses
 * 152 500 € — et non des 30 500 €. C'est le point 4 qui va chercher cette date.
 *
 * ⚠️ UN TESTAMENT PEUT CHANGER LE BÉNÉFICIAIRE. La version d'origine affirmait
 * qu'« un testament ne le redistribue pas ». Le capital ne se partage pas avec
 * le reste de la succession (art. L. 132-12), c'est exact ; mais la désignation
 * ou la substitution de bénéficiaire peut être faite par voie testamentaire
 * (art. L. 132-8), et la Cour de cassation la juge valable même sans que
 * l'assureur en ait été informé. Le lecteur à qui on affirmait le contraire ne
 * relisait pas son testament.
 *
 * ⚠️ CLAUSE SANS « À DEFAUT » : LE CHAÎNAGE, PAS LE RACCOURCI. L'art. L. 132-11
 * vise le contrat conclu SANS DÉSIGNATION de bénéficiaire — ce n'est pas notre
 * hypothèse, où la désignation existe mais est devenue caduque. On écrit donc
 * les deux temps : le bénéfice est présumé attribué sous condition que le
 * bénéficiaire soit en vie au jour de l'exigibilité (art. L. 132-9), et faute
 * de bénéficiaire le capital fait partie de la succession (art. L. 132-11). Le
 * résultat est le même, mais c'est un notaire qui lira la feuille.
 *
 * ⚠️ FICOVIE : DEUX ARTICLES, PAS UN, ET LE BON VERBE. L'art. 1649 ter du CGI
 * crée l'obligation de DÉCLARATION à la charge des assureurs, c'est lui qui
 * alimente le fichier. Le notaire, lui, n'interroge pas le fichier : il obtient
 * de l'administration fiscale, SUR DEMANDE ÉCRITE, communication des
 * informations détenues en application de cet article, en vue d'établir l'actif
 * successoral (art. L. 151 B du livre des procédures fiscales).
 *
 * ⚠️ LE FONDS EN EUROS N'EST PAS « GARANTI » DANS L'ABSOLU. La garantie en
 * capital n'est pas légale, elle est contractuelle, et son étendue varie — brute
 * ou nette de frais de gestion selon les contrats. Poser comme un fait ce qui
 * est une stipulation à lire serait le premier pas hors de la ligne du produit
 * (savoir lire, jamais quoi acheter) : on écrit « garanti dans les conditions
 * prévues au contrat », ce qui renvoie le lecteur là où il doit aller.
 *
 * ⚠️ AUCUNE AFFIRMATION DE DROIT SANS SON ARTICLE, y compris hors fiscalité :
 * le relevé annuel se demande parce que l'information annuelle de l'assuré est
 * une obligation de l'assureur (art. L. 132-22 du code des assurances), et les
 * frais sur versement sont écrits quelque part parce que l'information
 * précontractuelle l'impose (art. L. 132-5-2 du même code). Sans ces deux
 * articles, toute la partie « frais » de la feuille reposait sur notre parole.
 */

type PointAudit = {
  titre: string;
  /** Ce qui déclenche le point. Formulé de façon qu'on puisse trancher seul. */
  seuil: string;
  /** Le libellé posé AU-DESSUS de la zone d'écriture — jamais dessus. */
  aNoter: string;
  /**
   * Nombre de lignes de la zone d'écriture : lignes vierges de 44 px, ou lignes
   * du tableau quand `colonnes` est présent. 3 quand on recopie une clause
   * entière, 5 quand il y a un conjoint et trois enfants à lister.
   */
  lignes?: number;
  /**
   * Quand la réponse comporte plusieurs bénéficiaires, une ligne ne suffit
   * pas : c'est un tableau qu'il faut, sinon quatre noms s'écrasent sur 90 mm.
   */
  colonnes?: string[];
};

/** Feuille 1 — ce que le contrat coûte, et ce qu'il contient. Points 1 à 4. */
const POINTS_CONTRAT: PointAudit[] = [
  {
    titre: "La date de chaque versement, par rapport à mes 70 ans",
    seuil:
      "je sais, euro par euro, ce qui a été versé avant mon 70e anniversaire et ce qui l'a été après. C'est la seule chose à établir ici : ce que ces deux colonnes déclenchent est expliqué dans l'encadré au bas de cette feuille.",
    aNoter: "Versé avant mes 70 ans, puis versé après :",
  },
  {
    titre: "Les frais de gestion prélevés chaque année",
    seuil:
      "je peux citer le taux exact écrit au contrat, en % par an, et dire sur quelle partie de mon épargne il s'applique — le contrat distingue en général le fonds en euros, dont le capital est garanti dans les conditions prévues au contrat, des autres supports — les autres placements proposés par le contrat —, qui ne le sont pas. Si je ne l'ai pas : demander à l'assureur le relevé annuel de situation, qu'il est tenu de m'adresser (art. L. 132-22 du code des assurances).",
    aNoter: "Le taux, tel qu'il est écrit au contrat, et sur quoi il s'applique :",
  },
  {
    titre: "Les frais prélevés sur chaque versement",
    seuil:
      "je sais s'il s'en applique un, et lequel, sur les 10 000 € que je verserais demain. « Je ne crois pas » ne vaut pas le point : c'est écrit aux conditions générales, et l'assureur est tenu de l'indiquer avant la signature (art. L. 132-5-2 du code des assurances).",
    aNoter: "Frais sur versement annoncés :",
  },
  {
    titre: "L'année d'ouverture de ce contrat",
    seuil:
      "je peux dire l'année exacte où ce contrat a été ouvert, et donc s'il l'a été avant ou après le 20 novembre 1991. « Il est très ancien » ne vaut pas le point : cette date change la règle applicable, comme l'explique l'encadré au bas de cette feuille.",
    aNoter: "Année d'ouverture, telle qu'elle est écrite au contrat :",
  },
];

/** Feuille 2 — qui touche l'argent, et avec quel abattement. Points 5 à 10. */
const POINTS_CLAUSE: PointAudit[] = [
  {
    titre: "Le texte exact de la clause bénéficiaire",
    seuil:
      "j'ai sous les yeux la phrase du contrat qui désigne qui touchera l'argent — c'est cela, la clause bénéficiaire — et je la recopie ici mot pour mot. « Je crois que c'est mes enfants » ne vaut pas le point.",
    aNoter: "Ma clause, recopiée mot pour mot :",
    lignes: 3,
  },
  {
    titre: "L'existence d'un bénéficiaire de second rang",
    seuil:
      "la clause dit qui reçoit si la personne nommée en premier est déjà décédée. C'est la mention « à défaut ». Sans elle, la désignation tombe — le bénéfice est présumé attribué sous condition que le bénéficiaire soit en vie au jour de l'exigibilité (art. L. 132-9 du code des assurances) — et, faute de bénéficiaire, le capital fait partie de la succession (art. L. 132-11 du même code). Il est alors taxé comme le reste de votre patrimoine : l'abattement de 100 000 € par parent et par enfant, puis le barème des droits de succession (art. 777 du CGI).",
    aNoter: "Ce que ma clause dit après « à défaut » :",
  },
  {
    titre: "Le cas du décès d'un bénéficiaire avant moi",
    seuil:
      "la clause précise si la part de celui qui est parti revient à ses propres enfants — c'est la formule « vivants ou représentés ». Sans cette précision, sa part ne descend pas à ses enfants : le bénéfice est présumé attribué sous condition qu'il soit en vie au jour du décès (art. L. 132-9 du code des assurances), et sa part se répartit entre les autres bénéficiaires du même rang. S'il n'y en a pas, elle retombe dans la succession.",
    aNoter: "La formule employée dans ma clause :",
  },
  {
    titre: "Qui reçoit quoi, et avec quel abattement",
    seuil:
      "pour chaque bénéficiaire, je sais quelle part vient de sommes versées avant mes 70 ans (art. 990 I du CGI) et quelle part de sommes versées après (art. 757 B du CGI), y compris à l'intérieur d'un même contrat : c'est la date de chaque versement qui commande, pas le contrat. Un conjoint ou un partenaire de PACS bénéficiaire, lui, ne paie rien dans les deux cas (art. 796-0 bis du CGI).",
    aNoter: "Une ligne par bénéficiaire :",
    lignes: 5,
    colonnes: ["Bénéficiaire", "Quel contrat", "Avant ou après 70 ans"],
  },
  {
    titre: "La date de la dernière relecture de la clause",
    seuil:
      "elle a été relue depuis moins de deux ans, et surtout depuis le dernier événement de la famille : mariage, divorce, naissance, décès, brouille.",
    aNoter: "Dernière relecture le, et après quel événement :",
  },
  {
    titre: "La cohérence avec mon testament",
    seuil:
      "je sais que le capital revient au bénéficiaire désigné et ne se partage pas avec le reste de la succession (art. L. 132-12 du code des assurances) ; en revanche un testament peut lui-même désigner ou remplacer le bénéficiaire (art. L. 132-8 du code des assurances). J'ai donc vérifié que ma clause et mon testament disent la même chose.",
    aNoter: "Ce que mon testament dit du contrat :",
  },
];

/**
 * La liste des points, numérotée en continu d'une feuille à l'autre : le score
 * est sur 10, et un « point 1 » qui reparaîtrait en tête de la feuille 2
 * ferait compter deux fois la même case.
 */
function ListePoints({ points, depart }: { points: PointAudit[]; depart: number }) {
  return (
    <ol className="divide-y divide-black border-y border-black">
      {points.map((p, i) => (
        <li key={p.titre} className="eviter-coupure py-2">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
            />
            <div className="min-w-0">
              <p>
                <strong>
                  {depart + i}. {p.titre}
                </strong>
              </p>
              <p className="text-[0.9rem]">
                <strong>Le point si :</strong> {p.seuil}
              </p>
            </div>
          </div>
          <div className="ml-[30px] mt-1">
            <p className="text-[0.85rem]">{p.aNoter}</p>
            {p.colonnes ? (
              <TableauVierge colonnes={p.colonnes} lignes={p.lignes ?? 3} />
            ) : (
              Array.from({ length: p.lignes ?? 1 }, (_, n) => (
                <div key={n} className="min-h-[44px] border-b border-black" />
              ))
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function GrilleAuditAssuranceVie() {
  return (
    <>
      <Feuille
        titre="La grille d'audit de votre assurance-vie (feuille 1 sur 3)"
        sousTitre="Le contrat : les versements, les frais, l'année d'ouverture. Quatre points sur dix."
      >
        <p>
          Comptez trente minutes, contrat en main. Une grille par contrat : comptez ces trois
          feuilles pour chaque contrat, et ne notez jamais deux contrats ensemble.
          L&apos;abattement, lui, ne se compte pas grille par grille : il est unique par
          bénéficiaire pour tous vos contrats, et ne se calcule qu&apos;une fois vos grilles
          remplies — voir l&apos;encadré au bas de cette feuille.
        </p>

        <p className="text-[0.9rem]">
          Commencez donc par les compter tous, y compris celui ouvert il y a trente ans et jamais
          rouvert. Les contrats sont recensés dans un fichier de l&apos;administration fiscale,
          FICOVIE, alimenté par les déclarations des assureurs (art. 1649 ter du CGI) ; le notaire
          chargé de la succession peut en obtenir communication de l&apos;administration fiscale,
          sur demande écrite (art. L. 151 B du livre des procédures fiscales).
        </p>

        <div className="grid gap-3">
          <Champ
            label="Tous mes contrats, sans exception"
            indice="combien, et lesquels — à remplir une seule fois, sur la première grille"
          />
          <Champ label="Contrat audité" indice="compagnie, numéro" />
          <Champ label="Contrat au nom de" indice="dans un couple, chacun a les siens" />
          <Champ label="Où est rangé le contrat" indice="dossier, coffre, chez l'assureur" />
          <Champ label="Date de cet audit" />
          <Champ
            label="La date de mes 70 ans"
            indice="jour, mois, année — la deuxième des 3 dates"
          />
        </div>

        <Titre>Les 4 points du contrat</Titre>
        <ListePoints points={POINTS_CONTRAT} depart={1} />

        <div className="eviter-coupure">
          <Encadre titre="CE QUE VOS DATES DE VERSEMENT COMMANDENT">
            <p className="text-[0.9rem]">
              <strong>Versé avant vos 70 ans.</strong> Ce sont les sommes qui reviendront à chaque
              bénéficiaire, gains compris, qui se comparent à 152 500 € (art. 990 I du CGI). Cet
              abattement est unique : 152 500 € par bénéficiaire, tous contrats du même assuré
              confondus. Trois contrats ne font pas trois abattements — ils n&apos;en font
              qu&apos;un seul, à calculer une fois vos grilles remplies.
            </p>
            <p className="mt-2 text-[0.9rem]">
              <strong>Versé après vos 70 ans.</strong> Seules les sommes versées se comparent à 30
              500 €, tous contrats et tous bénéficiaires confondus, les gains qu&apos;elles ont
              produits restant hors du calcul (art. 757 B du CGI).
            </p>
            <p className="mt-2 text-[0.9rem]">
              <strong>Une date d&apos;entrée par article, et pas la même.</strong> L&apos;art. 757 B
              ne vise que les contrats souscrits à compter du 20 novembre 1991 ; l&apos;art. 990 I
              ne vise que les sommes versées à compter du 13 octobre 1998. Si un de vos contrats a
              été ouvert avant le 20 novembre 1991, signalez-le au notaire : les primes que vous y
              versez après 70 ans ne relèvent pas des 30 500 €.
            </p>
          </Encadre>
        </div>

        <Source>
          Sommes revenant à chaque bénéficiaire au titre des versements faits avant 70 ans, 152 500
          € par bénéficiaire, tous contrats du même assuré confondus : art. 990 I du CGI. Sommes
          versées après 70 ans, 30 500 € tous contrats et tous bénéficiaires confondus : art. 757 B
          du CGI. Chaque article a sa propre date d&apos;entrée en vigueur : contrats souscrits à
          compter du 20 novembre 1991 pour l&apos;art. 757 B, sommes versées à compter du 13 octobre
          1998 pour l&apos;art. 990 I. Information annuelle de l&apos;assuré par l&apos;assureur :
          art. L. 132-22 du code des assurances. Frais indiqués avant la signature : art. L. 132-5-2
          du même code. Déclaration des contrats par les assureurs, qui alimente le fichier FICOVIE
          : art. 1649 ter du CGI. Communication de ces informations au notaire chargé de la
          succession, sur sa demande écrite : art. L. 151 B du livre des procédures fiscales.
        </Source>
      </Feuille>

      <Feuille
        titre="La grille d'audit de votre assurance-vie (feuille 2 sur 3)"
        sousTitre="La clause bénéficiaire : qui touche l'argent, et avec quel abattement. Six points sur dix."
      >
        <div className="grid gap-3">
          <Champ
            label="Contrat audité"
            indice="à recopier de la feuille 1 — cette feuille circule seule"
          />
          <Champ label="Contrat au nom de" indice="dans un couple, chacun a les siens" />
        </div>

        <Titre>Les 6 points de la clause bénéficiaire</Titre>
        <ListePoints points={POINTS_CLAUSE} depart={5} />

        <Source>
          Le capital revient au bénéficiaire désigné et ne fait pas partie de la succession : art.
          L. 132-12 du code des assurances. Désignation ou substitution de bénéficiaire, y compris
          par voie testamentaire : art. L. 132-8. Bénéfice présumé attribué sous condition que le
          bénéficiaire soit en vie au jour du décès : art. L. 132-9. Assurance conclue sans
          bénéficiaire désigné, capital dans la succession : art. L. 132-11. Abattement de 100 000 €
          par parent et par enfant, puis barème en ligne directe : art. 779 et 777 du CGI. Conjoint
          et partenaire de PACS bénéficiaires, exonérés dans les deux régimes : art. 796-0 bis du
          CGI. Versements avant et après 70 ans : art. 990 I et 757 B du CGI.
        </Source>
      </Feuille>

      <Feuille
        titre="La grille d'audit de votre assurance-vie (feuille 3 sur 3)"
        sousTitre="Votre score sur 10, et les trois points que vous corrigez en premier."
      >
        <div className="grid gap-3">
          <Champ label="Contrat audité" indice="à recopier de la feuille 1" />
          <Champ label="Contrat au nom de" indice="dans un couple, chacun a les siens" />
          <Champ
            label="Date de cet audit"
            indice="la même que sur la feuille 1 — c'est elle qui dira laquelle est la dernière"
          />
        </div>

        <Titre>Mon score</Titre>
        <Champ label="Nombre de cases cochées" indice="sur 10" />

        <p className="text-[0.9rem]">
          Une dernière question, et c&apos;est celle qui décide si tout le reste est encore
          modifiable. Un bénéficiaire peut avoir <strong>accepté sa désignation</strong> : il a fait
          savoir formellement, avec votre accord, qu&apos;il acceptait d&apos;être bénéficiaire. À
          partir de là, la clause ne se modifie plus sans son accord écrit (art. L. 132-9 du code
          des assurances). C&apos;est à demander à l&apos;assureur avant d&apos;écrire quoi que ce
          soit.
        </p>
        <Champ
          label="Un bénéficiaire a-t-il accepté sa désignation ?"
          indice="oui, non, ou à demander à l'assureur"
        />

        <div className="eviter-coupure">
          <Encadre titre="COMMENT LIRE CE SCORE">
            <p className="text-[0.93rem]">
              <strong>9 ou 10.</strong> Vous connaissez votre contrat. Ce qui restait à vérifier est
              vérifié. Reprenez cette grille dans deux ans, ou au premier événement dans la famille.
            </p>
            <p className="mt-2 text-[0.93rem]">
              <strong>6 à 8.</strong> Ce qui manque se règle presque toujours par écrit, sans
              rendez-vous : une lettre à l&apos;assureur — le modèle est dans la feuille « La lettre
              pour modifier votre clause bénéficiaire » — et la pièce d&apos;identité demandée. Sauf
              si un bénéficiaire a déjà accepté la clause : dans ce cas, son accord écrit est
              nécessaire, comme dit plus haut.
            </p>
            <p className="mt-2 text-[0.93rem]">
              <strong>5 ou moins.</strong> Ce n&apos;est plus vous qui décidez de cette part de
              votre transmission, c&apos;est le contrat. Reprenez les cases non cochées une par une,
              dans l&apos;ordre, avant d&apos;ouvrir tout autre chantier.
            </p>
          </Encadre>
        </div>

        <Titre>Les trois points que je corrige en premier</Titre>
        <p className="text-[0.9rem]">
          La colonne « Fait le » est celle qui compte : c&apos;est elle qui dira, dans six mois, où
          vous en étiez resté.
        </p>
        <TableauVierge colonnes={["Le point à corriger", "Avant le", "Fait le"]} lignes={3} />
        <Champ
          label="À revoir le"
          indice="dans deux ans, ou au premier événement dans la famille"
        />

        <Source>Acceptation du bénéficiaire : art. L. 132-9 du code des assurances.</Source>

        <p className="text-[0.9rem]">
          Cette grille note la connaissance que vous avez de votre contrat. Elle ne recommande aucun
          contrat, aucun support et aucune compagnie. Toute nouvelle rédaction de clause
          bénéficiaire est à faire relire par votre notaire avant d&apos;être envoyée à
          l&apos;assureur.
        </p>
      </Feuille>
    </>
  );
}
