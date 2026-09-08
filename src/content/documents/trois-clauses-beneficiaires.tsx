import type { ReactNode } from "react";
import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * TROIS CLAUSES BÉNÉFICIAIRES, COMMENTÉES PHRASE PAR PHRASE (upsell 2).
 *
 * ⚠️ Pourquoi les clauses sont données EN TOUTES LETTRES, et non résumées.
 * Le lecteur ne doit pas « s'inspirer » d'un principe : il doit avoir sous les
 * yeux une phrase recopiable, parce que c'est exactement ce qu'il enverra à sa
 * compagnie. Une clause décrite au lieu d'être écrite produit une rédaction
 * maison, et une rédaction maison produit un capital bloqué.
 *
 * ⚠️ Pourquoi chaque segment porte « si on l'enlève », et pas seulement « ce
 * que ça fait ». Le lecteur de 75 ans coupe ce qu'il ne comprend pas — c'est le
 * réflexe qui a créé la moitié des clauses défectueuses en circulation. Chiffrer
 * la conséquence du retrait est le seul commentaire qui empêche la coupe.
 *
 * ═══ LA PAGINATION A4, QUI EST LA RAISON DU DÉCOUPAGE ═══
 *
 * ⚠️ Aux conditions d'impression du projet — A4, marges 18/16 mm, `html` à
 * 12 pt, `article` de 170 mm dont 8,5 mm de `p-8` de chaque côté, soit 153 mm
 * de largeur utile et 261 mm de hauteur par page — la version d'origine tenait
 * en quatre `Feuille` qui sortaient sur NEUF pages A4. Cinq de ces pages
 * étaient des pages de continuation : sans en-tête (marque, titre), sans le
 * pied de page légal que `Feuille` répète justement sur CHAQUE feuille parce
 * que les feuilles voyagent séparées dans un classeur et sont relues des mois
 * plus tard, parfois par un enfant qui n'a jamais vu le site.
 *
 * Le document est donc découpé en feuilles qui tiennent réellement sur une
 * page. Le budget retenu est de 248 mm et non 261 : le modèle de mesure
 * sous-estime d'environ 5 % (mesuré sur la version d'origine — 368 mm calculés
 * contre 386 mm réels), et une feuille qui déborde d'un millimètre coûte une
 * page entière. C'est la même faute, et le même remède, que
 * `grille-audit-assurance-vie.tsx` dans ce dossier.
 *
 * ⚠️ LE NUMÉRO DE FEUILLE EST CALCULÉ, JAMAIS ÉCRIT À LA MAIN. `FEUILLES` est
 * un tableau, et le titre reçoit `(feuille i+1 sur FEUILLES.length)`. Ajouter
 * une clause ou déplacer une coupure renumérote tout le classeur sans qu'on ait
 * à y penser — un « feuille 7 sur 12 » resté faux après un découpage est
 * exactement ce qu'un lecteur de 78 ans ne peut pas rattraper : il croira qu'il
 * a perdu une feuille.
 *
 * ⚠️ Chaque feuille de clause porte SON bloc `Source` et SA mention « à faire
 * relire par votre notaire », rendues dans le `.map()`. C'est volontairement
 * redondant et volontairement mécanique : une feuille détachée du classeur doit
 * rester vérifiable sur legifrance par son lecteur, et aucune ne peut être
 * oubliée si une quatrième clause est ajoutée un jour.
 *
 * ⚠️ PAS D'INTERTITRE `Titre` DANS LES FEUILLES DE CLAUSE. Le découpage a fait
 * le travail que des intertitres auraient fait : « le texte à recopier » et
 * « phrase par phrase » sont devenus des titres de feuille, donc des `h2` avec
 * leur en-tête et leur pied de page. Un `Titre` en plus coûterait 13 mm par
 * feuille, c'est-à-dire une feuille de plus tous les vingt intertitres.
 *
 * ⚠️ AUCUN CONTRAT, AUCUNE COMPAGNIE, AUCUN SUPPORT N'EST NOMMÉ NULLE PART.
 * Recommander un produit d'assurance relève du statut CIF. On apprend à écrire
 * une phrase, pas à choisir un contrat.
 *
 * ⚠️ LE NOM DU PRODUIT N'EST PAS ÉCRIT DANS LE CORPS. Ce document relève de
 * l'upsell 2 (« Votre assurance-vie, vérifiée en 30 minutes »), pas de La
 * Méthode : une feuille détachée qui s'attribue au mauvais produit, c'est le
 * lecteur qui la cherche dans le mauvais classeur. Le pied de page porte déjà
 * la marque, et cela suffit.
 *
 * ═══ CE QUI A ÉTÉ REDRESSÉ EN DROIT ═══
 *
 * ⚠️ « VIVANTS OU REPRÉSENTÉS » REPOSE SUR L'ART. L. 132-9, PAS SUR L. 132-8.
 * L'art. L. 132-8 traite de la désignation et de la substitution de
 * bénéficiaire. C'est L. 132-9 qui présume l'attribution faite sous la
 * condition de l'existence du bénéficiaire au jour de l'exigibilité du capital,
 * « à moins que le contraire ne résulte des termes de la stipulation » — ce que
 * fait exactement la mention « vivants ou représentés ».
 * `grille-audit-assurance-vie.tsx` citait déjà correctement L. 132-9 pour la
 * même règle : les deux feuilles se contredisaient dans le même classeur.
 *
 * ⚠️ L'ART. 669 A NEUF TRANCHES, PAS DEUX. « Avant son 71e anniversaire : 40 %
 * et 60 % » n'est vrai que de 61 à 70 ans révolus. Un lecteur de 68 ans dont le
 * conjoint a 58 ans appliquait 40/60 là où la loi donne 50/50, et concluait que
 * ses enfants gardaient 60 % de l'abattement quand ils n'en ont que 50 %.
 *
 * ⚠️ ET SURTOUT : L'ÂGE S'APPRÉCIE AU JOUR DU DÉCÈS DE L'ASSURÉ. La formule
 * « avant son 71e anniversaire » calquait les 3 dates de la Méthode, où le 71e
 * anniversaire est une date que le lecteur peut DEVANCER (donation de
 * nue-propriété). Ici il ne le peut pas : la date déclenchante est son propre
 * décès. Le lecteur qui annote au stylo inscrivait l'âge actuel de son conjoint
 * et bâtissait son arbitrage dessus.
 *
 * ⚠️ LA CLAUSE 2 PROMETTAIT UN RÉSULTAT QUE SON TEXTE NE TENAIT PAS. Le délai
 * de six mois n'avait aucune sanction : si le conjoint ne répond pas, refuse de
 * choisir, n'est plus en état de le faire ou décède dans le délai, l'assureur
 * restait dans le blocage même que la feuille décrivait sous « si on l'enlève ».
 * La clause porte désormais une option par défaut et une ligne de prédécès —
 * cette dernière manquait au premier rang, là où la clause 3 en avait une.
 *
 * ⚠️ L. 132-12 SANS L. 132-13, C'ÉTAIT UNE AFFIRMATION SANS SA RÉSERVE. Les
 * primes manifestement exagérées redeviennent rapportables et réductibles — et
 * c'est la réserve qui mord précisément sur ce lectorat : des versements faits à
 * un âge avancé sur une part importante du patrimoine.
 *
 * ⚠️ LA CONVENTION DE QUASI-USUFRUIT NE CRÉE PAS LA CRÉANCE. Elle existe de
 * plein droit dès que l'usufruit porte sur une somme d'argent (art. 587 du code
 * civil). Ce que la convention apporte, c'est la preuve et la DÉDUCTIBILITÉ
 * (art. 773, 2° du CGI). « Sans elle, la clause 3 ne produit pas son effet »
 * était surestimé, et le fichier se contredisait lui-même deux lignes plus haut.
 *
 * ⚠️ LES RÉGIMES 990 I ET 757 B ONT UNE DATE D'ENTRÉE. Contrats souscrits
 * depuis le 20 novembre 1991, sommes versées depuis le 13 octobre 1998. Sur un
 * lectorat de 65-85 ans, le contrat plus ancien est fréquent.
 */

type Segment = {
  /** Doit exister MOT POUR MOT dans `texte`. Voir la garantie mécanique plus bas. */
  segment: string;
  produit: string;
  retrait: string;
};

type Clause = {
  numero: number;
  nom: string;
  pourQui: string;
  texte: string;
  segments: Segment[];
  /**
   * Les indices de `segments` où commence une nouvelle feuille « phrase par
   * phrase ». Mesurés, pas choisis : voir le budget de 248 mm en en-tête.
   */
  coupures: number[];
  /**
   * La conséquence fiscale de la clause ENTIÈRE, sur sa propre feuille. Elle ne
   * descend pas dans la liste des segments : y rattacher une règle d'impôt à un
   * fragment de phrase casse la lecture au stylo, mot à mot, qui est la promesse
   * du document.
   */
  consequence?: { titre: string; corps: string[]; source: string };
  note?: string;
  /** Les articles portés par cette clause-là. Voir l'en-tête : la feuille voyage seule. */
  source: string;
};

const CLAUSES: Clause[] = [
  {
    numero: 1,
    nom: "La clause standard",
    pourQui: "Marié, avec des enfants, et rien de particulier à arbitrer.",
    texte:
      "Mon conjoint, non séparé de corps ; à défaut, mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux ; à défaut, mes héritiers légaux.",
    segments: [
      {
        segment: "Mon conjoint, non séparé de corps",
        produit:
          "Il est désigné par sa qualité, pas par son nom. La clause vise celui ou celle qui sera votre conjoint le jour du décès, quoi qu'il arrive d'ici là. La séparation de corps est un jugement qui laisse le mariage debout mais met fin à l'obligation de vivre ensemble (art. 296 et 299 du code civil) : ces trois mots écartent ce cas.",
        retrait:
          "Écrite avec un nom (« Madame Untel »), la désignation reste valable tant que vous ne l'avez pas révoquée — et vous seul pouvez le faire, tant qu'aucun bénéficiaire n'a accepté (art. L. 132-8 du code des assurances pour le droit de désigner ou de remplacer un bénéficiaire, art. L. 132-9 pour la révocation). Un ex-conjoint touche alors le capital des années après le divorce.",
      },
      {
        segment: "à défaut",
        produit:
          "Deux mots d'aiguillage. Le rang suivant ne reçoit que si le rang précédent est absent : les enfants ne touchent rien tant que le conjoint est là.",
        retrait:
          "Remplacé par « et », tous les rangs deviennent bénéficiaires ensemble et se partagent le capital le même jour.",
      },
      {
        segment: "mes enfants nés ou à naître, vivants ou représentés",
        produit:
          "« Nés ou à naître » inclut un enfant qui arriverait après la signature. « Vivants ou représentés » fait descendre la part d'un enfant décédé avant vous vers ses propres enfants, c'est-à-dire vos petits-enfants. Sans ces trois mots, le bénéfice est présumé attribué sous la condition que le bénéficiaire soit en vie au jour du décès (art. L. 132-9 du code des assurances) : la représentation ne joue pas toute seule en assurance-vie, contrairement à une succession.",
        retrait:
          "Sans « représentés », la part de l'enfant décédé est repartagée entre ses frères et sœurs, et ses enfants à lui ne reçoivent rien.",
      },
      {
        segment: "par parts égales entre eux",
        produit:
          "Fixe la règle de partage. La compagnie n'a plus à interpréter la répartition, et n'a personne à faire trancher.",
        retrait:
          "La compagnie doit interpréter, et le règlement s'arrête au premier désaccord entre les enfants.",
      },
      {
        segment: "à défaut, mes héritiers légaux",
        produit: "Le dernier filet : il évite que la clause reste sans destinataire le jour venu.",
        retrait:
          "À défaut de bénéficiaire désigné, ou si aucun bénéficiaire désigné n'est vivant au jour du décès, le capital fait partie de la succession (art. L. 132-11 du code des assurances). Il perd alors l'abattement de 152 500 € par bénéficiaire de l'assurance-vie (art. 990 I du CGI) et bascule dans le régime des droits de succession : chaque enfant retrouve l'abattement de 100 000 € (art. 779 du CGI), puis le barème de l'art. 777.",
      },
    ],
    coupures: [3],
    source:
      "Séparation de corps : art. 296 et 299 du code civil. Désignation du bénéficiaire, y compris par testament, et substitution : art. L. 132-8 du code des assurances. Révocation tant que le bénéfice n'a pas été accepté, et présomption d'existence du bénéficiaire au jour du décès — écartée par la mention « vivants ou représentés » : art. L. 132-9 du même code. Absence de bénéficiaire désigné ou vivant : art. L. 132-11. Abattement propre à l'assurance-vie : art. 990 I du CGI. Abattement de succession : art. 779 du CGI. Barème en ligne directe : art. 777 du CGI.",
  },
  {
    numero: 2,
    nom: "La clause à options",
    pourQui:
      "Marié, avec des enfants, et vous ne savez pas de combien votre conjoint aura besoin. C'est lui qui décidera.",
    texte:
      "Mon conjoint, non séparé de corps, pour la quotité du capital qu'il choisira, soit la totalité, soit les trois quarts, soit la moitié, soit le quart ; le solde à mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux ; à défaut, mes héritiers légaux. Le choix de mon conjoint devra être exprimé par écrit auprès de l'assureur dans les six mois du décès, avant tout versement. À défaut de choix exprimé dans ce délai, mon conjoint sera réputé avoir opté pour la moitié. En cas de prédécès de mon conjoint, le capital revient à mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux, en pleine propriété.",
    segments: [
      {
        segment: "Mon conjoint, non séparé de corps",
        produit:
          "Désigné par sa qualité, pas par son nom : la clause vise celui ou celle qui sera votre conjoint le jour du décès. « Non séparé de corps » écarte le cas d'un jugement de séparation de corps, qui laisse le mariage debout mais met fin à l'obligation de vivre ensemble (art. 296 et 299 du code civil).",
        retrait:
          "Écrite avec un nom, la désignation survit au divorce et l'ex-conjoint touche le capital (art. L. 132-8 et L. 132-9 du code des assurances).",
      },
      {
        segment:
          "pour la quotité du capital qu'il choisira, soit la totalité, soit les trois quarts, soit la moitié, soit le quart",
        produit:
          "Quotité veut dire fraction, tout simplement — à ne pas confondre avec la quotité disponible du lexique, qui désigne autre chose. Votre conjoint décide au moment du décès de la fraction qu'il garde, en connaissant son âge, sa santé et ses ressources : ce que vous ne pouvez pas savoir en écrivant la clause. Les quatre options sont chiffrées, donc la compagnie n'a rien à interpréter.",
        retrait:
          "Il prend tout, ou rien. Or le conjoint survivant ne paie aucun droit de succession (art. 796-0 bis du CGI) : ce qu'il garde sans en avoir l'usage sera transmis une seconde fois, et taxé cette fois-là.",
      },
      {
        segment:
          "le solde à mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux ; à défaut, mes héritiers légaux",
        produit:
          "Ce que le conjoint ne prend pas descend d'un rang immédiatement, et chaque enfant utilise son propre abattement de 152 500 € (art. 990 I du CGI). « Vivants ou représentés » fait descendre la part d'un enfant décédé avant vous vers ses propres enfants, ce que l'assurance-vie ne fait pas toute seule (art. L. 132-9 du code des assurances). « Par parts égales » fixe le partage ; la dernière ligne évite que la clause reste sans destinataire.",
        retrait:
          "Sans rang suivant nommé, la fraction que le conjoint ne prend pas rejoint la succession et sort du régime de l'assurance-vie (art. L. 132-11 du code des assurances).",
      },
      {
        segment:
          "Le choix de mon conjoint devra être exprimé par écrit auprès de l'assureur dans les six mois du décès, avant tout versement",
        produit:
          "Un délai écrit borne l'attente des enfants. Six mois est l'usage des rédacteurs, par analogie avec le délai de dépôt de la déclaration de succession — six mois pour un décès en France métropolitaine, un an dans les autres cas (art. 641 du CGI). Aucun texte n'impose ce délai dans une clause bénéficiaire : c'est vous qui le fixez. « Avant tout versement » empêche que l'assureur paie avant que le choix soit fait.",
        retrait:
          "Sans délai, la compagnie attend la décision du conjoint, et les enfants attendent avec elle — parfois des années.",
      },
      {
        segment:
          "À défaut de choix exprimé dans ce délai, mon conjoint sera réputé avoir opté pour la moitié",
        produit:
          "C'est la phrase qui rend le délai utile : elle dit ce qui se passe si votre conjoint ne répond pas, refuse de choisir ou n'est plus en état de le faire. La compagnie applique alors la fraction écrite ici, sans faire trancher personne. La moitié est un choix, pas une règle : remplacez ce mot par « le quart » ou « les trois quarts » si vous préférez, mais écrivez-en un.",
        retrait:
          "Le délai ne sanctionne plus rien. Si le conjoint ne choisit pas, l'assureur reste exactement dans le blocage décrit juste au-dessus, et les enfants attendent avec lui.",
      },
      {
        segment:
          "En cas de prédécès de mon conjoint, le capital revient à mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux, en pleine propriété",
        produit:
          "Si votre conjoint part avant vous, il n'y a plus personne pour exercer l'option : cette phrase donne le capital entier aux enfants, sans qu'on ait à interpréter une clause à options devenue sans objet.",
        retrait:
          "La compagnie se retrouve avec une option que personne ne peut lever, et le règlement s'arrête le temps qu'elle fasse trancher la question.",
      },
    ],
    coupures: [3],
    note: "Demandez à votre notaire de vérifier que l'exercice de l'option par votre conjoint — le fait qu'il prenne moins que la totalité, laissant le solde à vos enfants — ne sera pas regardé par le fisc comme une donation de votre conjoint à vos enfants, et taxé comme telle. C'est le point à faire examiner avant de signer, pas après.",
    source:
      "Séparation de corps : art. 296 et 299 du code civil. Désignation du bénéficiaire : art. L. 132-8 du code des assurances. Révocation, et présomption d'existence du bénéficiaire au jour du décès — écartée par la mention « vivants ou représentés » : art. L. 132-9 du même code. Absence de bénéficiaire désigné ou vivant : art. L. 132-11. Abattement de 152 500 € par bénéficiaire : art. 990 I du CGI. Exonération du conjoint survivant : art. 796-0 bis du CGI. Délai de dépôt de la déclaration de succession : art. 641 du CGI.",
  },
  {
    numero: 3,
    nom: "La clause démembrée",
    pourQui:
      "Marié, avec des enfants, et un capital dont le conjoint aura besoin de vivre sans que les enfants soient taxés deux fois.",
    texte:
      "Mon conjoint, non séparé de corps, pour l'usufruit du capital ; mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux, pour la nue-propriété. En cas de prédécès de mon conjoint, mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux, en pleine propriété. En l'absence d'enfant vivant ou représenté au jour de mon décès, mon conjoint, non séparé de corps, recevra le capital en pleine propriété. À défaut de tout bénéficiaire ci-dessus désigné, mes héritiers légaux.",
    segments: [
      {
        segment: "Mon conjoint, non séparé de corps",
        produit:
          "Désigné par sa qualité, pas par son nom : la clause vise celui ou celle qui sera votre conjoint le jour du décès. « Non séparé de corps » écarte le cas d'un jugement de séparation de corps, qui laisse le mariage debout mais met fin à l'obligation de vivre ensemble (art. 296 et 299 du code civil).",
        retrait:
          "Écrite avec un nom, la désignation survit au divorce et l'ex-conjoint touche le capital (art. L. 132-8 et L. 132-9 du code des assurances).",
      },
      {
        segment: "pour l'usufruit du capital",
        produit:
          "Le conjoint reçoit la somme et peut la dépenser : sur de l'argent, l'usufruit est un quasi-usufruit (art. 587 du code civil), c'est-à-dire le droit de dépenser la somme à charge d'en restituer l'équivalent à la fin.",
        retrait:
          "Le conjoint reçoit le capital en pleine propriété. Il en fait ce qu'il veut, et rien n'est réservé aux enfants.",
      },
      {
        segment:
          "mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux, pour la nue-propriété",
        produit:
          "Les enfants ne touchent rien tout de suite : ils détiennent une créance sur la succession du conjoint, c'est-à-dire une somme qu'ils pourront réclamer à son décès, avant tout partage. « Vivants ou représentés » fait descendre la part d'un enfant décédé avant vous vers ses propres enfants (art. L. 132-9 du code des assurances) ; « par parts égales » fixe le partage entre eux. Cette créance n'est déductible de la succession du conjoint que si elle est constatée par acte notarié, ou par un écrit enregistré auprès de l'administration, ce qui lui donne une date incontestable (art. 773, 2° du CGI).",
        retrait:
          "Le capital est transmis deux fois — à votre décès, puis à celui du conjoint — et taxé la seconde fois.",
      },
      {
        segment:
          "En cas de prédécès de mon conjoint, mes enfants nés ou à naître, vivants ou représentés, par parts égales entre eux, en pleine propriété",
        produit:
          "Le démembrement suppose un usufruitier ET des nus-propriétaires. Si votre conjoint part avant vous, cette phrase donne le capital entier aux enfants, en pleine propriété, sans usufruit à reconstituer ni interprétation à demander.",
        retrait:
          "La compagnie se retrouve à appliquer un démembrement sans usufruitier, et le règlement s'arrête le temps qu'elle fasse trancher la question.",
      },
      {
        segment:
          "En l'absence d'enfant vivant ou représenté au jour de mon décès, mon conjoint, non séparé de corps, recevra le capital en pleine propriété",
        produit:
          "Le cas miroir du précédent : votre conjoint est là, mais aucun enfant ni petit-enfant ne l'est. Sans cette phrase, l'assureur se retrouve avec un usufruit sans nu-propriétaire, et la ligne suivante ne joue pas puisqu'il reste un bénéficiaire vivant.",
        retrait:
          "Le blocage exact que cette clause cherche à éviter, pris par l'autre bout : un démembrement impossible à exécuter, et un capital immobilisé le temps d'une décision.",
      },
      {
        segment: "À défaut de tout bénéficiaire ci-dessus désigné, mes héritiers légaux",
        produit:
          "Cette dernière ligne ne joue que si AUCUN des bénéficiaires désignés plus haut n'est vivant au jour du décès : ni le conjoint, ni un enfant, ni un petit-enfant venant en représentation.",
        retrait:
          "Sans elle, et sans bénéficiaire désigné vivant, le capital fait partie de la succession (art. L. 132-11 du code des assurances) et sort du régime de l'assurance-vie.",
      },
    ],
    coupures: [3],
    consequence: {
      titre: "CE QUE CETTE CLAUSE COÛTE EN ABATTEMENT",
      corps: [
        "L'abattement de 152 500 € par bénéficiaire (art. 990 I du CGI) n'est pas doublé par le démembrement. Il se compte par couple usufruitier / nu-propriétaire : un abattement de 152 500 € pour votre conjoint et chaque enfant pris deux à deux, et non un seul abattement partagé par toute la famille. Ce mode de répartition est celui retenu par l'administration fiscale ; l'art. 990 I dit seulement que l'abattement est réparti entre les personnes concernées en proportion de leurs droits. Faites confirmer ce point par votre notaire, au même titre que le chiffrage.",
        "Ces proportions se lisent dans le barème d'âge de l'art. 669 du CGI, qui avance par tranches de dix ans. Conjoint de 71 à 80 ans révolus : usufruit compté 30 %, nue-propriété 70 %. De 61 à 70 ans révolus : 40 % et 60 %. De 51 à 60 ans révolus : 50 % et 50 %. Le barème continue au-delà dans les deux sens.",
        "L'âge retenu est celui de votre conjoint au jour de votre décès, et non aujourd'hui (art. 669 du CGI) : contrairement à la donation de nue-propriété, ce 71e anniversaire n'est pas une date que vous pouvez devancer.",
        "La fraction d'abattement qui revient au conjoint usufruitier ne profite à personne, puisqu'il est déjà exonéré de tout droit (art. 796-0 bis du CGI) — elle n'est pas reversée aux enfants. Avec un conjoint de 72 ans au jour du décès, chaque enfant ne dispose donc que des 70 % restants, soit 106 750 €. La clause 2 leur laisse l'abattement entier, et la clause 1 aussi — mais seulement le jour où le conjoint n'est plus là pour recevoir. Cette clause s'achète au prix d'une partie de l'abattement : faites chiffrer les deux hypothèses par votre notaire, avec vos vrais montants et vos vrais âges, avant de choisir.",
      ],
      source:
        "Abattement de 152 500 € par bénéficiaire et sa répartition en cas de démembrement : art. 990 I du CGI. Barème de l'usufruit et de la nue-propriété selon l'âge de l'usufruitier : art. 669 du CGI. Exonération du conjoint survivant : art. 796-0 bis du CGI.",
    },
    note: "Cette clause n'a d'effet complet que si une convention de quasi-usufruit est signée : c'est l'écrit qui prouve la créance de vos enfants sur la succession de votre conjoint, et qui la rend déductible (art. 773, 2° du CGI). Un écrit signé entre vous, sans notaire et sans enregistrement, ne suffit pas. Demandez aussi à votre notaire ce qu'il en est de l'art. 774 bis du CGI, qui limite la déduction des dettes de restitution portant sur une somme d'argent — et faites-vous répondre par écrit.",
    source:
      "Séparation de corps : art. 296 et 299 du code civil. Désignation du bénéficiaire : art. L. 132-8 du code des assurances. Présomption d'existence du bénéficiaire au jour du décès, écartée par la mention « vivants ou représentés » : art. L. 132-9 du même code. Absence de bénéficiaire désigné ou vivant : art. L. 132-11. Quasi-usufruit : art. 587 du code civil. Déduction des dettes envers les héritiers : art. 773, 2° du CGI. Dettes de restitution portant sur une somme d'argent : art. 774 bis du CGI.",
  },
];

/**
 * ⚠️ GARANTIE MÉCANIQUE, DANS LES DEUX SENS.
 *
 * 1. Chaque segment commenté existe MOT POUR MOT dans le texte de sa clause, et
 *    dans l'ordre où il y apparaît.
 * 2. Les segments RECOUVRENT le texte : aucun fragment de la clause à recopier
 *    ne reste sans commentaire.
 *
 * Le premier sens était déjà vérifié, et il ne suffisait pas. Le second est
 * celui qui compte le plus : la phrase orpheline — présente dans le cadre « À
 * RECOPIER MOT POUR MOT », commentée nulle part — est exactement celle que le
 * lecteur va couper, puisque rien ne lui dit à quoi elle sert. Les clauses 2 et
 * 3 en portaient deux chacune (« Mon conjoint, non séparé de corps », « à
 * défaut, mes héritiers légaux »), commentées seulement sur la feuille de la
 * clause 1 — que le lecteur n'a pas, puisqu'il n'emporte qu'UNE clause.
 *
 * On lève plutôt qu'on n'avertit : la feuille est générée par un `.map()`, donc
 * une divergence est invisible à la relecture et visible seulement du lecteur.
 * Mieux vaut casser au premier rendu, chez nous.
 */
for (const clause of CLAUSES) {
  let reste = clause.texte;
  const orphelins: string[] = [];

  for (const { segment } of clause.segments) {
    const debut = reste.indexOf(segment);
    if (debut === -1) {
      throw new Error(
        `Clause ${clause.numero} : le segment « ${segment} » n'existe pas mot pour mot dans le texte à recopier, ou n'y vient pas dans l'ordre.`,
      );
    }
    orphelins.push(reste.slice(0, debut));
    reste = reste.slice(debut + segment.length);
  }
  orphelins.push(reste);

  for (const fragment of orphelins) {
    // Ce qui reste entre deux segments ne doit être que de la ponctuation.
    if (/[0-9A-Za-zÀ-ÖØ-öø-ÿ]/.test(fragment)) {
      throw new Error(
        `Clause ${clause.numero} : « ${fragment.trim()} » est dans le texte à recopier mais n'est commenté par aucun segment.`,
      );
    }
  }
}

/** La case à cocher au stylo du gabarit, hors d'une liste `Case`. */
function CarreACocher() {
  return (
    <span aria-hidden className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black" />
  );
}

/**
 * Le pied de toute feuille de clause : la relecture obligatoire, puis les
 * articles. Un composant et non deux lignes recopiées, pour que ni l'un ni
 * l'autre ne puisse manquer sur une feuille qui voyagera seule.
 */
function PiedDeClause({ source }: { source: string }) {
  return (
    <>
      <p className="text-[0.9rem] font-bold">
        À faire relire par votre notaire avant d&apos;être transmise à votre assureur.
      </p>
      <Source>{source}</Source>
    </>
  );
}

/** Découpe une liste aux indices donnés. `[3]` sur six segments donne 0-2 puis 3-5. */
function tranches<T>(items: T[], coupures: number[]): T[][] {
  const bornes = [0, ...coupures, items.length];
  return bornes.slice(0, -1).map((debut, i) => items.slice(debut, bornes[i + 1]));
}

type FeuilleImprimee = { cle: string; titre: string; sousTitre: string; corps: ReactNode };

/** Les trois feuilles de pilotage : choisir, situer son contrat, envoyer et suivre. */
const PILOTAGE: FeuilleImprimee[] = [
  {
    cle: "pilotage-choix",
    titre: "Trois clauses bénéficiaires — laquelle est la mienne",
    sousTitre: "Cochez celle qui correspond à votre situation.",
    corps: (
      <>
        <p>
          La clause bénéficiaire est la phrase qui décide qui reçoit l&apos;argent de votre contrat,
          et combien. C&apos;est celle imprimée par défaut sur le bulletin.
        </p>

        <p>
          Le capital versé au bénéficiaire ne fait pas partie de votre succession (art. L. 132-12 du
          code des assurances) : votre testament ne le redistribue pas — sauf si les primes versées
          sont manifestement exagérées par rapport à votre patrimoine et à vos revenus (art. L.
          132-13 du même code), point à faire trancher par votre notaire. En revanche, un testament
          peut lui-même désigner ou changer le bénéficiaire (art. L. 132-8 du même code) : vérifiez
          que vos deux documents ne se contredisent pas.
        </p>

        <ul className="divide-y divide-black border-y border-black">
          {CLAUSES.map((c) => (
            <li key={c.nom} className="flex min-h-[44px] items-start gap-3 py-2">
              <CarreACocher />
              <div>
                <p className="font-bold">
                  Clause {c.numero} — {c.nom}
                </p>
                <p className="text-[0.95rem]">{c.pourQui}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-[0.9rem]">
          Le texte complet de chaque clause, et le rôle de chacune de ses phrases, sont sur les
          feuilles <em>Clause 1</em>, <em>Clause 2</em> et <em>Clause 3</em>. N&apos;imprimez que
          celle que vous avez cochée.
        </p>

        <Source>
          Le capital versé au bénéficiaire ne fait pas partie de la succession : art. L. 132-12 du
          code des assurances. Primes manifestement exagérées, rapport et réduction : art. L. 132-13
          du même code. Désignation du bénéficiaire, y compris par testament : art. L. 132-8.
          Présomption d&apos;existence du bénéficiaire au jour du décès : art. L. 132-9.
        </Source>
      </>
    ),
  },
  {
    cle: "pilotage-contrat",
    titre: "Mon contrat, et quand j'ai versé",
    sousTitre: "Une feuille de pilotage par contrat : deux contrats, deux exemplaires.",
    corps: (
      <>
        <p className="text-[0.9rem]">
          Ne notez jamais deux contrats sur la même feuille : deux clauses différentes remplies au
          même endroit sont indiscernables six mois plus tard.
        </p>

        <Champ label="Le contrat concerné" indice="compagnie et numéro du contrat" />
        <Champ
          label="La clause écrite dessus aujourd'hui"
          indice="demandez-en la copie par écrit"
        />
        <Champ label="La clause que je retiens" indice="1, 2 ou 3" />

        <Titre>Mes primes ont été versées</Titre>
        <ul className="space-y-1">
          <Case>Avant mes 70 ans.</Case>
          <Case>Après mes 70 ans.</Case>
          <Case>Les deux — j&apos;ai versé avant, et j&apos;ai versé après.</Case>
        </ul>

        <Source>
          Primes versées avant votre 70e anniversaire : abattement de 152 500 € par bénéficiaire
          (art. 990 I du CGI). Cet abattement se compare à tout ce que le bénéficiaire touche au
          décès, gains compris, et non aux sommes que vous avez versées. Primes versées après : 30
          500 € au total, tous contrats et tous bénéficiaires confondus (art. 757 B du CGI) — et
          au-delà de ce montant, seules les primes sont taxées, les intérêts produits par le contrat
          ne le sont pas. Ces deux règles ne valent que pour les contrats souscrits depuis le 20
          novembre 1991 et les sommes versées depuis le 13 octobre 1998 : pour un contrat plus
          ancien, la question se pose au notaire.
        </Source>
      </>
    ),
  },
  {
    cle: "pilotage-envoi",
    titre: "Envoyer ma clause, et suivre",
    sousTitre: "Ce qui reste à faire une fois la clause choisie.",
    corps: (
      <>
        <Champ label="Le contrat concerné" indice="à recopier — cette feuille circule seule" />

        <ul className="space-y-1">
          <Case>
            J&apos;ai vérifié qu&apos;aucun bénéficiaire n&apos;a déjà <strong>accepté</strong> le
            bénéfice du contrat : une acceptation signée m&apos;empêche de changer la clause sans
            son accord (art. L. 132-9 du code des assurances).
          </Case>
          <Case>J&apos;ai fait relire la nouvelle rédaction par mon notaire.</Case>
          <Case>
            Si j&apos;ai retenu la clause 3 : j&apos;ai demandé à mon notaire la convention de
            quasi-usufruit, et je l&apos;ai rangée avec le contrat. Sans elle, la créance de mes
            enfants existe mais ne pourra pas être déduite de la succession de mon conjoint (art.
            773, 2° du CGI), et l&apos;avantage fiscal de la clause 3 est perdu.
          </Case>
          <Case>
            Je l&apos;ai envoyée en lettre recommandée avec accusé de réception, sur le modèle de la
            feuille <em>La lettre pour modifier votre clause bénéficiaire</em>.
          </Case>
          <Case>
            J&apos;ai reçu l&apos;avenant de la compagnie — le document par lequel elle constate par
            écrit ma nouvelle clause — je l&apos;ai relu, et je l&apos;ai rangé avec le contrat.
          </Case>
        </ul>

        <Champ label="Envoyée le" />
        <Champ label="Avenant reçu le" indice="relancez la compagnie au bout de six semaines" />
        <Champ label="Convention de quasi-usufruit signée le" indice="clause 3 uniquement" />

        <Source>
          Acceptation du bénéficiaire, qui rend la clause irrévocable sans son accord : art. L.
          132-9 du code des assurances. Déduction des dettes envers les héritiers : art. 773, 2° du
          CGI.
        </Source>
      </>
    ),
  },
];

/** Les feuilles d'une clause : le texte à recopier, puis les phrases, puis le coût. */
function feuillesDeClause(c: Clause): FeuilleImprimee[] {
  const parts = tranches(c.segments, c.coupures);

  const feuilles: FeuilleImprimee[] = [
    {
      cle: `clause-${c.numero}-texte`,
      titre: `Clause ${c.numero} — le texte à recopier`,
      sousTitre: `${c.nom}. Chaque phrase a un rôle : rien ne se coupe.`,
      corps: (
        <>
          <p className="text-[0.93rem]">
            <strong>Pour qui :</strong> {c.pourQui}
          </p>

          <div className="flex min-h-[36px] items-start gap-3">
            <CarreACocher />
            <span>
              Je retiens cette clause : c&apos;est celle que je recopie, et je reporte son numéro
              sur ma feuille de pilotage.
            </span>
          </div>

          <div className="eviter-coupure">
            <Encadre titre="À RECOPIER MOT POUR MOT">
              <p className="text-[0.95rem]">« {c.texte} »</p>
            </Encadre>
          </div>

          {c.note && (
            <div className="eviter-coupure">
              <Encadre titre="À DEMANDER À VOTRE NOTAIRE EN MÊME TEMPS">
                <p className="text-[0.93rem]">{c.note}</p>
              </Encadre>
            </div>
          )}

          <PiedDeClause source={c.source} />
        </>
      ),
    },
  ];

  parts.forEach((part, i) => {
    feuilles.push({
      cle: `clause-${c.numero}-phrases-${i}`,
      titre: `Clause ${c.numero} — phrase par phrase`,
      sousTitre:
        i === 0
          ? `${c.nom}. Ce que fait chaque phrase, et ce qu'on perd en la coupant.`
          : `${c.nom}. Suite des phrases, dans l'ordre de la clause.`,
      corps: (
        <>
          <ul className="divide-y divide-black border-y border-black">
            {part.map((s) => (
              <li key={s.segment} className="eviter-coupure py-2">
                <p className="text-[0.93rem]">
                  <strong>« {s.segment} »</strong> — {s.produit}
                </p>
                <p className="text-[0.9rem]">
                  <em>Si on l&apos;enlève :</em> {s.retrait}
                </p>
              </li>
            ))}
          </ul>

          <PiedDeClause source={c.source} />
        </>
      ),
    });
  });

  if (c.consequence) {
    const { titre, corps, source } = c.consequence;
    feuilles.push({
      cle: `clause-${c.numero}-cout`,
      titre: `Clause ${c.numero} — ce qu'elle coûte en abattement`,
      sousTitre: `${c.nom}. À lire avant de choisir, et à faire chiffrer.`,
      corps: (
        <>
          <div className="eviter-coupure">
            <Encadre titre={titre}>
              {corps.map((paragraphe, i) => (
                <p
                  key={paragraphe.slice(0, 40)}
                  className={i === 0 ? "text-[0.93rem]" : "mt-2 text-[0.93rem]"}
                >
                  {paragraphe}
                </p>
              ))}
            </Encadre>
          </div>

          <PiedDeClause source={source} />
        </>
      ),
    });
  }

  return feuilles;
}

const FEUILLES: FeuilleImprimee[] = [...PILOTAGE, ...CLAUSES.flatMap(feuillesDeClause)];

export function TroisClausesBeneficiaires() {
  return (
    <>
      {FEUILLES.map((f, i) => (
        <Feuille
          key={f.cle}
          titre={`${f.titre} (feuille ${i + 1} sur ${FEUILLES.length})`}
          sousTitre={f.sousTitre}
        >
          {f.corps}
        </Feuille>
      ))}
    </>
  );
}
