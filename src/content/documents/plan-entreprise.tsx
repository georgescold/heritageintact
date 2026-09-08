import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * SITUATION 7 — AVEC UNE ENTREPRISE OU DES PARTS.
 *
 * ⚠️ C'est le seul plan-type des douze où la bonne décision n'est jamais « je
 * signe ». Le pacte Dutreil est le dispositif le plus contrôlé de la
 * transmission : il fait sortir 75 % de la valeur de la base taxable, et il se
 * défait sur un détail — une activité requalifiée, des statuts non modifiés,
 * un enfant qui revend trop tôt. Un lecteur qui repart d'ici en ayant compris
 * qu'il doit s'entourer a gagné ; un lecteur qui repart en croyant pouvoir
 * rédiger son engagement seul nous coûtera un redressement et sa confiance.
 *
 * ⚠️ LA RÉFORME DU 19 FÉVRIER 2026 EST DANS CETTE FEUILLE, ET ELLE CHANGE DEUX
 * CHIFFRES QUE LE LECTEUR RECOPIE AU STYLO. L'art. 8 de la loi n° 2026-103 du
 * 19 février 2026 de finances pour 2026 a (1) porté de quatre à SIX ANS la
 * durée de l'engagement individuel de conservation, aux art. 787 B c ET 787 C
 * b, et (2) exclu de la part exonérée les biens non affectés exclusivement à
 * l'activité dans les trois années qui précèdent la transmission — véhicules,
 * bateaux, bijoux, œuvres, chevaux, vins et alcools, logements. Les deux
 * mesures valent pour les transmissions intervenant à compter du
 * 21 février 2026. Une feuille imprimée, rangée dans un classeur et relue en
 * 2030 avec « quatre ans » dessus fait revendre deux ans trop tôt : reprise
 * des droits sur 75 % de la valeur, plus l'intérêt de retard.
 *
 * ⚠️ LA FONCTION DE DIRECTION N'EST PAS SUR LES MÊMES ÉPAULES SELON LE CAS, et
 * c'est le piège le plus fréquent de tout le dossier. Engagement collectif
 * réellement signé : l'un des signataires — le donateur OU l'un des enfants —
 * peut la porter (art. 787 B d). Engagement RÉPUTÉ ACQUIS : elle doit être
 * exercée par l'un des héritiers, donataires ou légataires, et le donateur ne
 * peut pas la porter seul (Cass. com., 24 janvier 2024, n° 22-10.413 ; BOFiP
 * BOI-ENR-DMTG-10-20-40-10). Or le cas le plus courant est exactement
 * celui-là : le dirigeant majoritaire qui donne ses titres et continue à
 * diriger. Lui dire que c'est bon, c'est lui faire perdre les 75 % en totalité.
 *
 * ⚠️ DEUX ARTICLES, PAS UN. L'art. 787 B ne régit que « les parts ou actions
 * d'une société ». Celui qui exploite en nom propre — entreprise individuelle,
 * fonds de commerce, exploitation agricole détenus en direct — relève de
 * l'art. 787 C : même exonération de 75 %, mais AUCUN engagement collectif, et
 * donc aucun des pourcentages de droits de vote demandés sur cette feuille. La
 * section « Vous êtes dans ce cas si… » recrute les deux publics ; l'encadré du
 * point 4 les sépare, et la fourche à cocher qui le suit fait ÉCRIRE au lecteur
 * l'article dont il relève. Sans cette ligne, la feuille relue six mois plus
 * tard ne dit à personne sous quel régime elle a été remplie.
 *
 * ⚠️ L'ORDRE DES TROIS DATES CHANGE ICI, et c'est tout l'intérêt de la feuille.
 * Le 70e anniversaire arrive en premier — non pas pour l'assurance-vie, mais
 * parce que l'article 790 du CGI supprime ce jour-là une réduction de 50 % des
 * droits sur la donation de titres. Il exige d'être « âgé de moins de soixante-
 * dix ans » : le jour de l'anniversaire, le donateur A 70 ans, la réduction est
 * déjà perdue. La date butoir écrite sur la feuille est donc la VEILLE, jamais
 * l'anniversaire — et elle a sa propre ligne à remplir, parce que personne ne
 * calcule une veille de tête à 78 ans. Le 71e anniversaire, lui, tombe en
 * dernier et peut même être écarté : démembrer fait perdre cette réduction, qui
 * n'est accordée qu'en pleine propriété. Deux leviers qui se contredisent :
 * c'est exactement ce qu'un lecteur ne peut pas deviner seul.
 *
 * ⚠️ EN REVANCHE, LA SECTION RESTE LE POINT 3, comme dans les onze autres
 * plans-types. Ce qui change d'un plan à l'autre est l'ordre INTERNE des trois
 * dates, jamais la place de la section : un lecteur qui a déjà travaillé deux
 * plans a appris que « point 3 = mes dates », et il doit lire sa date butoir
 * — parfois à six semaines — avant les deux pages et demie d'engagements.
 *
 * ⚠️ DEUX `Feuille`, ET C'EST VOLONTAIRE. Le `header` de marque et la mention
 * légale « ne constitue ni une consultation juridique » sont dans le composant
 * `Feuille`, donc imprimés une seule fois par feuille : un document rendu d'un
 * seul bloc sort ses pages 2 à 5 sans titre, sans repère et sans mention
 * légale. Une page isolée retrouvée des mois plus tard par un enfant n'est
 * alors ni identifiable ni rattachable. Feuille 1 = le diagnostic, les dates et
 * le levier ; feuille 2 = les pièges, les questions, le chiffrage, la décision.
 * La classe `eviter-coupure` reste posée sur chaque bloc pour que la coupure
 * tombe ENTRE deux blocs et jamais au milieu d'une ligne à remplir.
 *
 * ⚠️ Aucun montant d'honoraires n'est écrit, ici moins qu'ailleurs : ce dossier
 * mobilise un notaire ET un expert-comptable ou un avocat fiscaliste. On fait
 * poser la question, on ne la chiffre pas.
 */

/** Les trois engagements du pacte, dans l'ordre chronologique où ils se signent. */
const ENGAGEMENTS: { titre: string; texte: string }[] = [
  {
    titre: "1. L’engagement collectif — 2 ans au minimum",
    texte:
      "Vous et, le cas échéant, d’autres associés vous engagez par écrit à conserver les titres. Il doit porter sur au moins 17 % des droits financiers et 34 % des droits de vote si la société n’est pas cotée en bourse (10 % et 20 % si elle l’est). Si vous détenez ces seuils depuis au moins deux ans — seul, ou avec votre conjoint, votre partenaire de PACS ou votre concubin notoire — et que vous exercez depuis au moins deux ans dans la société votre activité professionnelle principale ou une fonction de direction, l’engagement peut être « réputé acquis » : il est considéré comme déjà pris, sans rien signer (art. 787 B du CGI).",
  },
  {
    titre: "2. L’engagement individuel — 6 ans",
    texte:
      "Chaque enfant qui reçoit les titres s’engage à son tour à les conserver six ans, à compter de la fin de l’engagement collectif — ou, si l’engagement collectif est réputé acquis, à compter du jour de la donation ou du décès. Un seul enfant qui revend, et l’exonération tombe pour lui. Cette durée était de quatre ans jusqu’au 20 février 2026 : si une feuille plus ancienne traîne dans votre classeur, c’est celle-ci qui fait foi.",
  },
  {
    titre: "3. La fonction de direction — 3 ans, si l’engagement collectif a été SIGNÉ",
    texte:
      "L’un des signataires — vous, ou l’un des enfants qui reçoit — doit exercer une fonction de direction pendant l’engagement collectif et pendant les trois années qui suivent la donation ou le décès (art. 787 B d du CGI).",
  },
  {
    titre: "3 bis. La fonction de direction si l’engagement est RÉPUTÉ ACQUIS — ce n’est plus vous",
    texte:
      "Quand rien n’a été signé et que l’engagement collectif est seulement réputé acquis, la règle change : la fonction de direction doit être exercée, pendant les trois années qui suivent la transmission, par l’un des enfants qui reçoit les titres — et non par vous. Si vous restez seul dirigeant après la donation, l’exonération est perdue en totalité (art. 787 B du CGI ; Cass. com., 24 janvier 2024, n° 22-10.413). C’est le cas le plus fréquent, et le plus coûteux : le dirigeant donne ses parts et continue à diriger, sans savoir qu’il vient d’annuler les 75 %.",
  },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Croire que sa société patrimoniale est éligible",
    texte:
      "L’exonération vise les activités industrielles, commerciales, artisanales, agricoles ou libérales. La loi de finances pour 2024 a inscrit dans l’article 787 B que sont exclues les sociétés dont l’activité est la gestion de leur propre patrimoine mobilier ou immobilier — ce qui vise la société civile de location, le portefeuille de titres, et, selon la lecture dominante, la location meublée. Une société civile immobilière (SCI) familiale : non. Le doute se lève avec votre notaire avant de signer, pas après.",
  },
  {
    titre: "Rester seul dirigeant après avoir donné, sur un engagement réputé acquis",
    texte:
      "C’est le piège numéro un de ce dossier, parce qu’il ressemble à la normale : vous donnez vos titres à vos enfants et vous continuez à diriger la société, comme avant. Si aucun engagement collectif n’a été signé et que le vôtre est seulement « réputé acquis », l’exonération n’est acquise que si l’un des enfants qui reçoit exerce lui-même une fonction de direction dans les trois ans qui suivent (art. 787 B du CGI ; Cass. com., 24 janvier 2024, n° 22-10.413). Le donateur ne peut pas la porter seul. Posez la question dans ces termes-là à votre notaire, avant l’acte.",
  },
  {
    titre: "Donner la nue-propriété sans avoir modifié les statuts",
    texte:
      "Si vous donnez la nue-propriété en gardant l’usufruit, l’article 787 B exige que les statuts limitent vos droits de vote d’usufruitier aux seules décisions portant sur l’affectation des bénéfices. Statuts non modifiés : l’exonération tombe. Et démembrer vous fait perdre la réduction de 50 % de l’article 790, réservée à la pleine propriété.",
  },
  {
    titre: "Laisser l’engagement se casser après coup",
    texte:
      "Une cession de titres pendant la période, un apport mal monté — un apport, c’est le fait de faire entrer vos parts dans une autre société —, un enfant qui revend, une fonction de direction abandonnée trop tôt : l’administration reprend les droits, avec l’intérêt de retard (art. 1727 du CGI). Le pacte n’est pas un acte que l’on signe et que l’on oublie : il se surveille pendant six à huit ans — six si l’engagement collectif était réputé acquis, huit au minimum s’il a été signé. Reportez les dates de fin sur les lignes prévues à la fin du point 4, puis dans votre plan en une page.",
  },
];

const QUESTIONS: string[] = [
  "Mon activité est-elle éligible à l’article 787 B — ou à l’article 787 C si j’exploite en nom propre — et une partie de ce que je possède dans la société sera-t-elle considérée comme du patrimoine de placement, donc exclue de l’exonération ?",
  "Y a-t-il dans ma société des biens qui ne servent pas exclusivement à l’activité — véhicule, logement, œuvres, bateau, collection — et qui sortiraient de la part exonérée ? (art. 787 B du CGI, dans sa rédaction issue de l’art. 8 de la loi n° 2026-103 du 19 février 2026)",
  "Un engagement collectif est-il déjà réputé acquis dans mon cas, ou dois-je en signer un — et sur quel pourcentage de droits de vote et de droits financiers ? Si mon engagement est réputé acquis, lequel de mes enfants devra exercer la fonction de direction à ma place pendant trois ans ?",
  "Vaut-il mieux, à mon âge, donner en pleine propriété avec la réduction de 50 %, ou démembrer ? Et si je ne donne rien, mes héritiers pourront-ils étaler le paiement des droits dans le temps, et à quelles conditions (art. 1717 du CGI et art. 397 A de l’annexe III au CGI) ?",
];

/**
 * Le calcul est posé en colonnes, une ligne par tranche du barème, et non en
 * ligne courante : c'est LE chiffre que le lecteur montrera à ses enfants, et
 * une addition de cinq termes noyée dans un paragraphe ne se vérifie pas au
 * stylo à 78 ans.
 *
 * ⚠️ CHAQUE LIGNE NOMME LE MONTANT RÉELLEMENT TAXÉ, JAMAIS LE PLAFOND DE LA
 * TRANCHE. « Tranche à 10 % — jusqu'à 12 109 € » en face de 403,70 € invite le
 * lecteur à faire 12 109 × 10 % = 1 210,90 € et à conclure que la feuille se
 * trompe : il a raison de le conclure, l'énoncé est faux. On écrit donc la
 * LARGEUR de la tranche — « 4 037 € à 10 % » —, comme dans les plans frères.
 *
 * ⚠️ `total` n'est vrai que sur la ligne de résultat. Sans cette distinction,
 * la tranche à 5 % a exactement le même poids visuel que le total, et le seul
 * chiffre que le lecteur cherche disparaît dans les autres.
 */
type LigneCalcul = { ligne: string; montant: string; total?: boolean };

const CALCUL_SANS_RIEN: LigneCalcul[] = [
  { ligne: "Valeur de l’entreprise au jour du décès", montant: "1 000 000 €" },
  { ligne: "÷ nombre d’enfants (ici, un enfant unique) = part de chacun", montant: "1 000 000 €" },
  { ligne: "− abattement de 100 000 € par enfant (art. 779) = base taxable", montant: "900 000 €" },
  { ligne: "8 072 € à 5 %", montant: "403,60 €" },
  { ligne: "4 037 € à 10 %", montant: "403,70 €" },
  { ligne: "3 823 € à 15 %", montant: "573,45 €" },
  { ligne: "536 392 € à 20 %", montant: "107 278,40 €" },
  { ligne: "347 676 € à 30 %", montant: "104 302,80 €" },
  { ligne: "TOTAL à payer dans les six mois", montant: "212 962 €", total: true },
];

const CALCUL_DUTREIL: LigneCalcul[] = [
  { ligne: "Valeur de l’entreprise", montant: "1 000 000 €" },
  { ligne: "− 75 % exonérés (art. 787 B ou 787 C) = valeur restante", montant: "250 000 €" },
  { ligne: "÷ nombre d’enfants (ici, un enfant unique) = part de chacun", montant: "250 000 €" },
  { ligne: "− abattement de 100 000 € par enfant (art. 779) = base taxable", montant: "150 000 €" },
  { ligne: "8 072 € à 5 %", montant: "403,60 €" },
  { ligne: "4 037 € à 10 %", montant: "403,70 €" },
  { ligne: "3 823 € à 15 %", montant: "573,45 €" },
  { ligne: "134 068 € à 20 %", montant: "26 813,60 €" },
  { ligne: "TOTAL au décès, ou en donation après 70 ans", montant: "28 194 €", total: true },
  {
    ligne: "En donation avant 70 ans : réduit de moitié (art. 790)",
    montant: "14 097 €",
    total: true,
  },
];

/**
 * Le tableau d'un calcul.
 *
 * ⚠️ La colonne des montants a une largeur FIXE et `tabular-nums` : sans les
 * deux, `justify-between` place chaque euro à un endroit différent, et une
 * ligne un peu longue renvoie son montant à la ligne suivante, à gauche. Le
 * lecteur suit la colonne avec le doigt pour additionner ; elle doit être une
 * colonne.
 */
function TableauCalcul({ lignes }: { lignes: LigneCalcul[] }) {
  return (
    <ul className="space-y-1 text-[0.93rem]">
      {lignes.map((l) => (
        <li
          key={l.ligne}
          className={
            l.total
              ? "flex items-baseline gap-x-4 border-t border-black pt-1 font-bold"
              : "flex items-baseline gap-x-4"
          }
        >
          <span className="min-w-0 flex-1">{l.ligne}</span>
          <span className="w-[6.75rem] shrink-0 text-right tabular-nums">{l.montant}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlanEntreprise() {
  return (
    <>
      <Feuille
        titre="Situation 7 — Avec une entreprise ou des parts (feuille 1 sur 2)"
        sousTitre="Votre plan-type. Remplissez-le au stylo, emportez-le chez le notaire. La règle ici : ne jamais rien faire seul."
      >
        <Titre>1. Vous êtes dans ce cas si…</Titre>
        <ul className="eviter-coupure space-y-1">
          <Case>
            Vous détenez des parts ou des actions d&apos;une société qui exerce une activité — ou
            vous exploitez en nom propre une entreprise, un fonds de commerce, une exploitation
            agricole (dans ce second cas, lisez l&apos;encadré du point 4 : votre article n&apos;est
            pas le même).
          </Case>
          <Case>
            Cette valeur pèse une part importante de votre patrimoine — souvent la plus grosse
            ligne, et celle dont personne dans la famille ne connaît le montant exact.
          </Case>
          <Case>
            Un enfant au moins reprendra, ou gardera les parts. Ou bien vous ne savez pas encore, et
            c&apos;est justement ce qui bloque tout le reste.
          </Case>
        </ul>
        <p className="text-[0.93rem]">Les trois cases cochées : ce plan est le vôtre.</p>

        {/* Une ligne par valeur, jamais deux valeurs sur une même ligne d'écriture :
            à 78 ans, « 17 % / 34 % » écrit au stylo dans un seul espace devient
            illisible pour le notaire comme pour l'enfant qui relira. Les seuils
            d'éligibilité sont rappelés dans l'indice, sinon le lecteur ne peut pas
            se contrôler lui-même au moment où il écrit son chiffre. */}
        <div className="eviter-coupure grid gap-3">
          <Champ
            label="Ma société, ou mon entreprise"
            indice="nom, forme juridique, activité réelle"
          />
          <Champ label="Nombre d'enfants qui recevront" />
          <Champ
            label="% de droits financiers que je détiens"
            indice="ma part des bénéfices — il en faut au moins 17 %, ou 10 % si la société est cotée"
          />
          <Champ
            label="% de droits de vote que je détiens"
            indice="mon poids en assemblée — il en faut au moins 34 %, ou 20 % si la société est cotée"
          />
          <Champ label="Valeur estimée" />
          <Champ label="Estimée par" indice="expert-comptable, commissaire, autre" />
          <Champ label="Le" indice="une valorisation de plus de deux ans ne vaut plus rien" />
        </div>

        <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
        <p>
          Au décès, vos titres — c&apos;est-à-dire vos parts ou vos actions — entrent dans la
          succession pour leur valeur entière. Chaque enfant déduit son abattement de 100 000 €,
          puis paie le barème en ligne directe, qui monte à 20 %, puis 30 %, puis 40 %. Sur une
          entreprise valorisée 1 000 000 € transmise à un enfant unique, la facture est de{" "}
          <strong>212 962 €</strong> — le calcul complet est au point 7, sur la seconde feuille.
        </p>
        <p>
          Le problème n&apos;est pas seulement le montant : c&apos;est la date. La déclaration de
          succession se dépose et les droits s&apos;acquittent dans les six mois du décès, alors que
          la valeur, elle, est dans l&apos;entreprise et non sur un compte. C&apos;est ce décalage
          qui fait vendre l&apos;outil de travail à la casse, ou emprunter pour payer l&apos;impôt
          sur une société qu&apos;on vient d&apos;hériter.
        </p>
        <Source>
          Abattement : art. 779 du CGI. Barème en ligne directe : art. 777 du CGI. Déclaration dans
          les six mois du décès en France métropolitaine (un an dans les autres cas) : art. 641 du
          CGI. Exigibilité des droits au dépôt : art. 1701 du CGI. Paiement différé puis fractionné
          pour les transmissions d&apos;entreprise : art. 1717 du CGI et art. 397 A de l&apos;annexe
          III au CGI.
        </Source>

        <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
        <ol className="divide-y divide-black border-y border-black">
          <li className="eviter-coupure py-2">
            <p>
              <strong>1. Le 70e anniversaire — et pas pour la raison habituelle.</strong> Une
              donation de titres en <strong>pleine propriété</strong> qui remplit les conditions du
              pacte Dutreil — le levier expliqué au point 4 — ouvre droit à une réduction de 50 %
              des droits, à condition d&apos;avoir moins de 70 ans le jour de la signature. Le jour
              de vos 70 ans, c&apos;est déjà trop tard : l&apos;acte doit être signé{" "}
              <strong>au plus tard la veille</strong> de cet anniversaire. Aucune autre date ne fait
              perdre la moitié d&apos;une facture d&apos;un seul coup. Ce même anniversaire commande
              par ailleurs votre assurance-vie : les primes versées avant vos 70 ans ouvrent 152 500
              € par bénéficiaire (art. 990 I) ; celles versées après, 30 500 € au total, tous
              contrats et tous bénéficiaires confondus (art. 757 B). C&apos;est la date de chaque
              versement qui commande, pas la date d&apos;ouverture du contrat. Ici, cet anniversaire
              compte donc deux fois.
            </p>
          </li>
          <li className="eviter-coupure py-2">
            <p>
              <strong>2. Le compteur des 15 ans.</strong> Il passe en second, et non en premier
              comme dans la plupart des familles : puisque 75 % de la valeur sort déjà de la somme
              sur laquelle l&apos;impôt se calcule, l&apos;abattement de 100 000 € ne sert plus que
              sur le quart restant. Mais il faut l&apos;avoir encore disponible le jour de la
              signature. Vérifiez donc ce que vous avez déjà donné, à qui et à quelle date,{" "}
              <em>avant</em> de fixer celle de la donation de titres — les lignes sont juste en
              dessous.
            </p>
          </li>
          <li className="eviter-coupure py-2">
            <p>
              <strong>3. Le 71e anniversaire — et parfois pas du tout.</strong> Donner la
              nue-propriété — la propriété sans l&apos;usage ni les revenus — en gardant
              l&apos;usufruit — le droit d&apos;utiliser le bien ou d&apos;en toucher les revenus
              jusqu&apos;à votre décès — fait compter les titres à 60 % de leur valeur avant 71 ans,
              70 % de 71 à 80 ans, 80 % de 81 à 90 ans, 90 % à partir de 91 ans. Le réflexe est bon
              partout ailleurs. Ici, il entre en conflit avec la réduction de 50 % de l&apos;article
              790, qui n&apos;existe qu&apos;en pleine propriété : les deux ne se cumulent pas.
              C&apos;est l&apos;arbitrage à faire chiffrer, pas à trancher soi-même.
            </p>
          </li>
        </ol>
        {/* La date butoir a sa propre ligne, et ce n'est pas un doublon de
            l'anniversaire : c'est le seul chiffre de la feuille qui ne se rattrape
            jamais, et personne ne calcule une veille de tête à 78 ans. */}
        <div className="eviter-coupure grid gap-3">
          <Champ label="Mon 70e anniversaire tombe le" />
          <Champ
            label="Date limite de signature — la VEILLE de mes 70 ans"
            indice="à recopier sur mon plan en une page, et à annoncer au notaire dès le premier rendez-vous"
          />
          <Champ
            label="Mon 71e anniversaire tombe le"
            indice="la veille, la nue-propriété compte encore pour 60 % ; le jour même, déjà 70 % (art. 669)"
          />
          <Champ
            label="Date de mon premier don déclaré"
            indice="le compteur des 15 ans part de ce jour-là"
          />
          <Champ
            label="Montant déjà donné à chaque enfant"
            indice="depuis moins de 15 ans, et à qui — c'est ce qui reste d'abattement disponible"
          />
        </div>
        <Source>
          Compteur des 15 ans : art. 779 et 784 du CGI. Assurance-vie : art. 990 I pour les primes
          versées avant 70 ans, art. 757 B pour celles versées après. Nue-propriété comptée à 60 %
          avant 71 ans, 70 % de 71 à 80 ans, 80 % de 81 à 90 ans, 90 % à partir de 91 ans : art. 669
          du CGI. Réduction de 50 % : art. 790 du CGI.
        </Source>

        <Titre>4. Le levier prioritaire : le pacte Dutreil</Titre>
        <p>
          L&apos;article 787 B du CGI exonère de droits{" "}
          <strong>75 % de la valeur des titres</strong> transmis, par donation ou par décès. Il ne
          reste que 25 % à taxer, et l&apos;abattement de 100 000 € s&apos;applique ensuite sur ce
          quart. Deux limites, et la seconde est récente : les biens de la société qui n&apos;ont
          pas servi <strong>exclusivement</strong> à l&apos;activité pendant les trois années qui
          précèdent la transmission — véhicule, logement, bateau, bijoux, œuvres et objets de
          collection, chevaux, vins et alcools — sortent de la part exonérée depuis le 21 février
          2026 ; et le dispositif reste le plus contrôlé de toute la transmission. En contrepartie,
          trois engagements — dont le troisième ne repose pas sur les mêmes épaules selon votre cas.
        </p>
        <p className="text-[0.93rem]">
          Deux mots reviennent sans arrêt ci-dessous. Les <strong>droits financiers</strong>,
          c&apos;est votre part des bénéfices. Les <strong>droits de vote</strong>, c&apos;est votre
          poids quand l&apos;assemblée décide. Les deux se comptent séparément, et le pacte exige un
          minimum sur chacun : ce sont eux que vous avez écrits au point 1.
        </p>

        <div className="eviter-coupure">
          <Encadre titre="SI VOUS EXPLOITEZ EN NOM PROPRE — SANS SOCIÉTÉ">
            <p className="text-[0.93rem]">
              Entreprise individuelle, fonds de commerce, exploitation agricole détenus en direct :
              votre article est le <strong>787 C</strong> du CGI, pas le 787 B. Même exonération de
              75 % de la valeur, mais <strong>aucun engagement collectif</strong> — les pourcentages
              de droits de vote et les dates d&apos;engagement collectif de cette feuille ne vous
              concernent pas. À la place : chaque héritier s&apos;engage à conserver les biens
              affectés à l&apos;exploitation pendant <strong>six ans</strong>, et l&apos;un
              d&apos;eux poursuit effectivement l&apos;exploitation pendant{" "}
              <strong>trois ans</strong>. Si vous avez acheté l&apos;entreprise, les biens doivent
              avoir été détenus depuis deux ans. La réduction de 50 % de l&apos;article 790 vous est
              ouverte dans les mêmes conditions.
            </p>
          </Encadre>
        </div>

        {/* Toute la feuille bifurque sur l'article applicable, et rien jusqu'ici ne
            faisait ÉCRIRE au lecteur celui dont il relève : l'encadré ci-dessus le
            dit, il ne le fait pas acter. Sans cette fourche, la feuille relue six
            mois plus tard ne dit à personne sous quel régime elle a été remplie. */}
        <div className="eviter-coupure space-y-1">
          <ul className="space-y-1">
            <Case>
              Je détiens des parts ou des actions d&apos;une société → mon article est le{" "}
              <strong>787 B</strong> : je remplis toutes les lignes ci-dessous.
            </Case>
            <Case>
              J&apos;exploite en nom propre, sans société → mon article est le{" "}
              <strong>787 C</strong> : je saute les deux lignes d&apos;engagement collectif.
            </Case>
          </ul>
          <Champ
            label="Mon article : 787 ___"
            indice="à faire confirmer par mon notaire au premier rendez-vous"
          />
        </div>

        <div className="space-y-2">
          {ENGAGEMENTS.map((e) => (
            <div key={e.titre} className="eviter-coupure">
              <Encadre titre={e.titre}>
                <p className="text-[0.93rem]">{e.texte}</p>
              </Encadre>
            </div>
          ))}
        </div>
        <Source>
          Exonération de 75 %, seuils, durées et fonction de direction : art. 787 B du CGI pour les
          parts et actions de société, art. 787 C du CGI pour l&apos;exploitation en nom propre,
          dans leur rédaction issue de l&apos;art. 8 de la loi n° 2026-103 du 19 février 2026 de
          finances pour 2026. Durée de l&apos;engagement individuel de conservation portée de quatre
          à six ans par ce même art. 8, pour les transmissions à titre gratuit — entre vifs ou par
          décès — intervenant à compter du 21 février 2026 ; exclusion, à la même date, des biens
          non affectés exclusivement à l&apos;activité dans les trois années précédant la
          transmission. Fonction de direction lorsque l&apos;engagement collectif est réputé acquis
          : Cass. com., 24 janvier 2024, n° 22-10.413. Réduction de 50 % des droits sur la donation
          en pleine propriété avant 70 ans : art. 790 du CGI.
        </Source>

        <div className="eviter-coupure space-y-1">
          <ul className="space-y-1">
            <Case>J&apos;ai signé un engagement collectif.</Case>
            <Case>
              Mon engagement collectif est réputé acquis — dans ce cas, qui dirige la société après
              la donation ?
            </Case>
          </ul>
          <div className="grid gap-3">
            <Champ label="Signé le" indice="ou : date à laquelle il est réputé acquis" />
            <Champ label="Fin de l'engagement collectif le" indice="2 ans au minimum" />
            <Champ
              label="Fin de l'engagement individuel le"
              indice="6 ans après la fin de l'engagement collectif ; si l'engagement est réputé acquis : 6 ans après la date de la transmission"
            />
            <Champ
              label="Qui exerce la fonction de direction"
              indice="si l'engagement est réputé acquis, ce ne peut pas être vous seul : ce doit être l'un des enfants qui reçoit"
            />
            <Champ label="Jusqu'à quelle date" indice="3 ans après la transmission" />
          </div>
        </div>
      </Feuille>

      <Feuille
        titre="Situation 7 — Avec une entreprise ou des parts (feuille 2 sur 2)"
        sousTitre="Les pièges, les questions, le chiffrage et la décision. Emportez les deux feuilles ensemble."
      >
        <Titre>5. Les 4 pièges de cette situation</Titre>
        <div className="space-y-2">
          {PIEGES.map((p) => (
            <div key={p.titre} className="eviter-coupure">
              <Encadre titre={p.titre}>
                <p className="text-[0.93rem]">{p.texte}</p>
              </Encadre>
            </div>
          ))}
        </div>

        <Titre>6. Les 4 questions à poser à votre notaire</Titre>
        <ol className="divide-y divide-black border-y border-black">
          {QUESTIONS.map((q, i) => (
            <li key={q} className="eviter-coupure py-2">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
                />
                <p>
                  <strong>{i + 1}.</strong> {q}
                </p>
              </div>
              <div className="ml-[30px] mt-1 min-h-[36px] border-b border-black" />
            </li>
          ))}
        </ol>

        <Titre>7. Ce que ça change, en euros</Titre>
        <p className="text-[0.95rem]">
          Une entreprise éligible valorisée <strong>1 000 000 €</strong>, transmise à un enfant
          unique. Les montants sont arrondis tranche par tranche, pour que vous puissiez refaire
          l&apos;addition à la calculette. Si vous avez plusieurs enfants, divisez d&apos;abord par
          leur nombre : la première ligne de chaque encadré est là pour ça, et chaque enfant a son
          propre abattement de 100 000 €.
        </p>

        <div className="eviter-coupure">
          <Encadre titre="A. SANS RIEN FAIRE — au décès">
            <TableauCalcul lignes={CALCUL_SANS_RIEN} />
          </Encadre>
        </div>
        <p className="text-[0.9rem]">
          Attention si votre entreprise vaut davantage : ici, les 900 000 € taxables restent juste
          sous le plafond de la tranche à 30 %. Au-delà de 902 838 €, on passe à 40 %, puis à 45 %
          au-delà de 1 805 677 €.
        </p>

        <div className="eviter-coupure">
          <Encadre titre="B. AVEC LE PACTE DUTREIL — au décès, ou en donation">
            <TableauCalcul lignes={CALCUL_DUTREIL} />
          </Encadre>
        </div>

        <p>
          <strong>212 962 € contre 14 097 € : 198 865 € d&apos;écart</strong>, sur exactement le
          même patrimoine. La différence n&apos;est pas dans ce que vous possédez : elle est dans
          une date, et dans des engagements tenus pendant six à huit ans. C&apos;est ce que ce
          rendez-vous sert à vérifier.
        </p>
        <Source>
          Art. 777 (barème), 779 (abattement), 787 B et 787 C (exonération de 75 %) et 790
          (réduction de 50 %) du CGI. Ce chiffre suppose réunies toutes les conditions de
          l&apos;article 787 B — activité éligible, pleine propriété, donateur de moins de 70 ans,
          et biens de la société affectés exclusivement à l&apos;activité dans les trois années
          précédant la transmission — et leur maintien jusqu&apos;au terme des engagements. Exemple
          pédagogique : votre valorisation et votre situation donneront un autre chiffre.
        </Source>

        <div className="eviter-coupure">
          <Encadre titre="LA RÈGLE DE CETTE SITUATION : NE JAMAIS RIEN FAIRE SEUL">
            <p className="text-[0.95rem]">
              Le pacte Dutreil est le point le plus contrôlé du sujet. La valorisation de la
              société, l&apos;éligibilité de l&apos;activité, la rédaction de l&apos;engagement et
              la modification des statuts se font à trois : vous, votre notaire, et votre
              expert-comptable ou un avocat fiscaliste. Tout modèle d&apos;acte est à faire relire
              par votre notaire. Cette feuille sert à arriver au rendez-vous avec les bonnes
              questions — elle ne remplace aucun des trois.
            </p>
          </Encadre>
        </div>

        <Titre>8. Ma décision</Titre>
        <div className="eviter-coupure space-y-1">
          <ul className="space-y-1">
            <Case>
              J&apos;ai pris rendez-vous avec mon notaire ET avec mon expert-comptable, en leur
              annonçant le sujet à l&apos;avance : « transmission de mon entreprise, article 787 B
              ou 787 C selon ma forme d&apos;exploitation ».
            </Case>
          </ul>
          <div className="grid gap-3">
            <Champ label="Mon notaire" indice="nom, étude, téléphone" />
            <Champ label="Mon expert-comptable ou mon avocat fiscaliste" indice="nom, téléphone" />
            <Champ label="Décidé le" indice="et reporté sur mon plan en une page" />
          </div>
        </div>
      </Feuille>
    </>
  );
}
