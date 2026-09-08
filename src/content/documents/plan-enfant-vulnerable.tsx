import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * SITUATION 10 — UN ENFANT VULNÉRABLE. Plan-type de l'étape « Le Plan familial ».
 *
 * ⚠️ C'est la seule situation où le levier fiscal est écrasant ET secondaire.
 * Écrasant, parce que l'abattement de l'article 779 II est le plus élevé des
 * abattements personnels du barème et qu'il se cumule avec celui de 100 000 € :
 * 259 325 € par parent. Le superlatif s'arrête là, et le sous-titre le borne
 * désormais à « abattement » — le pacte Dutreil de l'article 787 B (voir
 * plan-entreprise) sort bien davantage d'assiette : 75 % de la valeur des
 * titres, soit 750 000 € sur un million. Une famille qui a une entreprise ET un
 * enfant vulnérable hiérarchiserait à l'envers si cette feuille se disait « le
 * plus fort levier des douze situations ».
 * Secondaire, parce qu'un parent qui lit cette feuille ne pense pas à l'impôt,
 * il pense à « qui s'en occupera après moi ». Le plan est donc écrit dans cet
 * ordre-là — le relais d'abord, l'argent ensuite — sinon le lecteur décroche à
 * la troisième ligne.
 *
 * ⚠️ POURQUOI LA 1re DATE NE DIT PLUS « il faut l'autorisation du juge », ET
 * SUR QUELS ARTICLES ELLE S'APPUIE MAINTENANT. « Autorisation du juge » comme
 * règle générale était faux, et cette erreur commandait tout l'ordre du plan.
 * L'article 935 du code civil ne dit qu'une chose, et une seule : une donation
 * faite à un majeur en tutelle est acceptée par son tuteur. Il ne parle ni de
 * charges, ni d'autorisation, ni de conseil de famille, ni de curatelle — et
 * son renvoi interne « conformément à l'article 463 » est un renvoi mort depuis
 * la réforme de 2007. L'exigence d'autorisation vient d'ailleurs : le décret
 * n° 2008-1484 du 22 décembre 2008 classe l'acceptation d'une donation grevée
 * de charges parmi les ACTES DE DISPOSITION, et c'est alors l'art. 505 du code
 * civil qui impose l'autorisation du conseil de famille ou, à défaut, du juge
 * en tutelle, et l'art. 467 l'assistance du curateur en curatelle. Le mot du
 * décret est « charge » : ajouter « ou d'une condition » élargissait le
 * déclencheur au-delà du texte et envoyait chez le juge des donations sous
 * condition qui n'imposent rien au donataire. Faire différer de plusieurs mois
 * une donation ouverte tout de suite serait le pire dommage que cette feuille
 * puisse causer.
 *
 * ⚠️ L'ART. 455 EST CITÉ AVEC SES DEUX CONDITIONS, pour la même raison. Il ne
 * joue qu'« en l'absence de subrogé curateur ou de subrogé tuteur » : le
 * lecteur qui a déjà un subrogé n'a aucune désignation à demander, et lui faire
 * saisir le juge serait exactement le retard qu'on veut lui épargner. Et ce
 * n'est pas le juge qui désigne d'office : c'est le tuteur ou le curateur qui
 * fait nommer. En curatelle, l'organe est un curateur ad hoc, pas un tuteur.
 *
 * ⚠️ LES SOURCES DE L'ABATTEMENT HANDICAP SONT À TROIS ENDROITS, pas un seul.
 * Le II de l'art. 779 du CGI s'arrête à « incapable de travailler dans des
 * conditions normales de rentabilité » puis renvoie à un décret en Conseil
 * d'État, codifié aux art. 293 et 294 de l'annexe II. La branche « moins de
 * dix-huit ans / instruction ou formation professionnelle d'un niveau normal »
 * est à l'art. 294 ; la date à laquelle l'infirmité doit exister — « au jour de
 * la donation ou de l'ouverture de la succession » — est à l'art. 293 ; le
 * régime de preuve, qui met la charge sur l'héritier, admet tous éléments et
 * nomme la décision de la CDAPH, est à l'art. 294. D'où la disparition du
 * « aucun texte n'impose une pièce » : le fond (preuve libre) tient, la formule
 * ne tenait pas — et c'est la phrase qui dit au lecteur quoi mettre dans son
 * classeur, donc celle qu'on lui opposera.
 *
 * ⚠️ CE PLAN EST CALIBRÉ POUR UN ENFANT. Le point 1 admet aussi les
 * petits-enfants, parce que l'abattement de l'art. 779 II vise « tout héritier,
 * légataire ou donataire » sans condition de lien. Mais l'abattement PERSONNEL,
 * lui, change du tout au tout, et tous les chiffres du point 6 sont écrits sur
 * les 100 000 € de l'art. 779 I. Le point 2 porte donc la mise en garde, dans
 * les mêmes termes que plan-veuf-veuve : 31 865 € en donation (art. 790 B),
 * 1 594 € au décès (art. 788, IV), sauf représentation (art. 779, I).
 *
 * ⚠️ LE POINT 2 NE FAIT PLUS DÉCOULER 38 194 € DE L'INACTION. L'abattement de
 * l'art. 779 II est un droit de l'héritier, réclamé sur la déclaration de
 * succession, et le notaire qui règle la succession l'applique. 38 194 € n'est
 * donc pas un effet de droit, c'est ce que coûte une pièce manquante le jour de
 * la déclaration. La prémisse est nommée telle quelle, et l'hypothèse chiffrée
 * (parent veuf, 600 000 €, deux enfants) est écrite dès le point 2 au lieu
 * d'attendre le point 6.
 *
 * ⚠️ AUCUN CONTRAT, AUCUNE COMPAGNIE, AUCUN PLACEMENT N'EST NOMMÉ. La
 * rente-survie et l'épargne-handicap sont citées comme catégories définies par
 * la loi, hors du paragraphe des trois dates et sans un mot de suitabilité :
 * l'article 199 septies porte une réduction d'impôt sur le REVENU, il n'a aucun
 * effet sur la transmission, et le placer à côté des art. 990 I et 757 B
 * laissait croire à un troisième régime de transmission. On ne demande pas non
 * plus au notaire « laquelle correspond à votre situation » : il n'est pas
 * intermédiaire en assurance (art. L. 511-1 du code des assurances).
 *
 * ⚠️ Le piège de l'aide sociale est formulé au conditionnel et renvoyé au
 * notaire. Les règles de récupération comportent des exceptions propres au
 * handicap : une affirmation tranchée ici ferait renoncer un lecteur à une
 * donation qui lui était pourtant ouverte. Et parce que ce piège est la
 * consigne la plus impérative de la feuille — « par écrit, AVANT de signer » —
 * il a désormais SA question au point 5, avec sa case et sa ligne de réponse.
 * Le point 5 est la seule partie qu'on emporte au rendez-vous : une consigne
 * qui n'y figure pas n'est jamais posée. D'où quatre questions et non trois,
 * comme plan-marie-1-enfant et plan-enfant-etranger.
 *
 * ⚠️ CETTE FEUILLE NE TIENT PAS SUR UNE PAGE, et c'est assumé : quatre à cinq
 * feuillets A4. La classe `eviter-coupure` est donc posée sur chaque bloc —
 * lignes des 3 dates, encadrés, questions, groupes de lignes à remplir — pour
 * que la coupure tombe ENTRE deux blocs et jamais au milieu de la colonne des
 * tranches du point 6, ni entre le libellé d'une ligne et son trait. Le
 * `break-inside: avoid` posé sur `.feuille` entière est inopérant dès que le
 * bloc dépasse une page : c'est écrit dans plan-entreprise et dans
 * grille-audit-assurance-vie, et c'est vrai ici aussi. Elle est posée bloc par
 * bloc et jamais sur un groupe entier : un bloc plus haut qu'un demi-feuillet
 * protégé en entier part en entier sur la feuille suivante et laisse un grand
 * blanc au milieu du classeur. D'où les paragraphes de la 1re date protégés un
 * par un, et les Champ du point 7 en deux groupes.
 *
 * ⚠️ « SITUATION 10 » DOIT RESTER LE RANG DE CETTE SITUATION SUR LA FEUILLE
 * « Quelle est ma situation ? », et il l'est : la grille fond désormais
 * concubins et pacsés en une seule case n° 5 et porte « Patrimoine supérieur à
 * 1 million » en 11, ce qui met l'enfant vulnérable en 10 des deux côtés. Le
 * lecteur coche la 10, écrit « Ma situation est la n° 10 » sur le Champ prévu,
 * et trouve cette feuille-là dans son classeur. Toucher à l'ordre de l'une des
 * deux listes sans l'autre casse ce chaînage en silence — rien ne plante, le
 * lecteur atterrit simplement sur le plan d'une autre famille, des mois plus
 * tard, sans rien pour rattraper l'erreur. Le point 1 donne donc le numéro ET
 * le libellé de la case : deux repères valent mieux qu'un sur une feuille qui
 * voyage seule.
 *
 * ⚠️ CONVENTION D'ARRONDI, et elle n'est pas cosmétique : centimes dans le
 * détail des tranches, arrondi à l'euro sur le seul total — comme
 * simulateur-papier, plan-veuf-veuve et plan-marie-1-enfant. Le lecteur de
 * 78 ans refait cette colonne au stylo, et c'est le seul endroit du document
 * qu'il refera. Arrondir chaque ligne faisait tomber la colonne APRÈS sur
 * 6 330 € quand le total annoncé était 6 329 €.
 */

const RECONNAISSANCE: string[] = [
  "L’un de vos enfants — ou petits-enfants — ne peut pas travailler dans des conditions normales à cause d’une infirmité physique ou mentale, de naissance ou survenue plus tard, quel que soit son âge aujourd’hui.",
  "Vous vous êtes déjà demandé, la nuit, qui prendra le relais le jour où vous ne serez plus là.",
  "Vous avez pensé « je vais lui laisser plus qu’aux autres » sans savoir si vous en aviez le droit, ni comment le faire sans lui nuire.",
];

/**
 * Chaque date porte plusieurs paragraphes et non un pavé unique : la 1re date
 * empile quatre sujets sans rapport de lecture (les montants, le compteur, le
 * conflit d'intérêts, la donation grevée). À 78 ans, quinze lignes d'un seul
 * tenant ne se lisent pas, elles se sautent.
 */
const DATES: { titre: string; paragraphes: string[] }[] = [
  {
    titre: "1re — le compteur des 15 ans, et il passe devant tout le reste",
    paragraphes: [
      "Chaque parent peut donner 100 000 € (art. 779 I du CGI) PLUS 159 325 € (art. 779 II du CGI) à cet enfant, soit 259 325 €. Les 159 325 € de l’article 779 II sont le plus élevé des abattements personnels du barème, et ils s’ajoutent à ceux de 100 000 €. Chaque donation a ensuite son propre compteur : elle cesse d’être rappelée quinze ans après sa date (art. 784 du CGI) — notez la date de chacune, il y a une ligne pour cela au point 7.",
      "Cette date passe en premier pour une raison qui n’est pourtant pas fiscale : deux situations, et deux seulement, peuvent retarder votre signature de plusieurs mois. Lisez les deux, puis demandez à votre notaire lequel des deux cas est le vôtre et combien de temps il prend, avant de fixer votre calendrier.",
      "PREMIER CAS — vous êtes vous-même tuteur ou curateur de votre enfant, c’est-à-dire que les décisions sont prises pour lui par un tiers désigné par le juge, et que ce tiers c’est vous. Vous ne pouvez pas signer des deux côtés. S’il n’y a pas de subrogé tuteur ou de subrogé curateur, vous faites nommer par le juge — ou par le conseil de famille s’il en a été constitué un, les proches que le juge réunit autour de la personne protégée — un tuteur ou un curateur ad hoc, c’est-à-dire quelqu’un d’autre, désigné uniquement pour cet acte-là, qui acceptera à sa place (art. 455 du code civil). Si un subrogé a déjà été nommé, c’est lui qui accepte et vous n’avez aucune désignation à demander.",
      "SECOND CAS — la donation est grevée d’une charge, c’est-à-dire que vous demandez quelque chose en échange. Son acceptation devient alors un acte de disposition (décret n° 2008-1484 du 22 décembre 2008), et il faut l’autorisation du conseil de famille ou, à défaut, du juge en tutelle (art. 505 du code civil), ou l’assistance du curateur en curatelle (art. 467 du code civil). Une donation SANS charge, elle, est simplement acceptée par le tuteur, sans autorisation à demander (art. 935 du code civil).",
    ],
  },
  {
    titre: "2e — le 70e anniversaire, avec une question que les autres ne se posent pas",
    paragraphes: [
      "Les sommes issues des versements faits AVANT vos 70 ans laissent 152 500 € à chaque bénéficiaire (art. 990 I du CGI) ; celles issues des versements faits APRÈS n’ouvrent plus que 30 500 € au total, tous contrats et tous bénéficiaires confondus (art. 757 B du CGI). Ce n’est donc pas le contrat qui bascule le jour de vos 70 ans, ce sont vos versements : un contrat ouvert à 60 ans et encore alimenté à 72 ans relève des deux régimes à la fois. S’ajoute ici la question du capital versé d’un coup : est-ce une bonne chose pour cet enfant-là ? C’est la clause bénéficiaire qui répond, et elle se relit.",
    ],
  },
  {
    titre: "3e — le 71e anniversaire, et seulement si le relais est organisé",
    paragraphes: [
      "La nue-propriété — la propriété sans le droit d’habiter ni de louer — est comptée à 60 % de la valeur du bien avant 71 ans, 70 % après (art. 669 du CGI). Ce levier vient en dernier dans votre cas : il rend l’enfant propriétaire d’un bien qu’il ne pourra peut-être ni gérer, ni vendre, ni louer seul. Excellent si quelqu’un a été désigné pour le faire à sa place. Dangereux si personne ne l’a été.",
    ],
  },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Piège 1 — attendre une carte ou un taux pour demander l’abattement",
    texte:
      "L’article 779 II du CGI ne parle ni de carte, ni de pourcentage. Il vise la personne qu’une infirmité physique ou mentale, congénitale ou acquise, empêche de travailler dans des conditions normales de rentabilité — et, si elle a moins de 18 ans, celle que cette infirmité empêche d’acquérir une instruction ou une formation professionnelle d’un niveau normal (CGI, annexe II, art. 294). Des familles entières ne demandent jamais les 159 325 € parce qu’elles croient ne pas cocher la bonne case. L’infirmité doit exister au jour de la donation ou de l’ouverture de la succession (CGI, annexe II, art. 293), et aucun texte n’impose une pièce déterminée : la preuve se fait par tous éléments — certificat médical circonstancié, attestation d’un établissement spécialisé, décision de la commission des droits et de l’autonomie des personnes handicapées (CGI, annexe II, art. 294). Réunissez le dossier maintenant : le jour venu, personne ne pourra le reconstituer à votre place, et il y a au point 7 une ligne pour écrire où vous l’aurez rangé.",
  },
  {
    titre: "Piège 2 — lui donner un capital « en direct », pour bien faire",
    texte:
      "Un capital reçu peut modifier ses droits à certaines aides — l’allocation aux adultes handicapés, par exemple, est attribuée sous condition de ressources (art. L. 821-3 du code de l’action sociale et des familles). Et certaines aides sociales se récupèrent sur la succession ou sur les donations de leur bénéficiaire, avec des exceptions propres au handicap (art. L. 132-8 et L. 344-5 du même code). Faites-vous dire par votre notaire, par écrit, laquelle de ces règles de récupération s’applique à votre enfant AVANT de signer : c’est la question 2 du point 5, et elle a sa ligne de réponse.",
  },
  {
    titre: "Piège 3 — croire que la famille « s’arrangera »",
    texte:
      "Sans écrit, c’est un juge qui désignera le tuteur, sans savoir qui vous auriez choisi. Le mandat de protection future pour autrui vous permet, vous, de désigner cette personne de votre vivant ; il se signe devant notaire et prend effet le jour où vous ne pouvez plus prendre soin de votre enfant vous-même, ou à votre décès (art. 477 du code civil). C’est la seule ligne de ce plan qui ne s’achète pas avec de l’argent.",
  },
];

/**
 * Quatre questions et non trois : la consigne « par écrit, AVANT de signer » du
 * piège 2 était la plus impérative du document et la seule à n'avoir ni case, ni
 * ligne de réponse, ni place dans la liste qu'on lit à voix haute au notaire.
 * « Tuteur ad hoc » est reglosé dans la question 4 : cette feuille voyage seule
 * jusqu'au rendez-vous, et le lexique du classeur ne contient pas le terme.
 */
const QUESTIONS: string[] = [
  "Mon enfant remplit-il la condition de l’article 779 II du CGI, et quel justificatif dois-je conserver dès aujourd’hui pour que l’abattement de 159 325 € puisse être demandé ?",
  "Ce que je lui donnerai change-t-il les aides qu’il perçoit, et laquelle des règles de récupération sur la succession ou sur les donations lui est applicable (art. L. 132-8 et L. 344-5 du code de l’action sociale et des familles) ? Je vous demande cette réponse par écrit avant de signer quoi que ce soit.",
  "Puis-je signer un mandat de protection future pour autrui à son bénéfice, qu’ai-je le droit d’y écrire sur les moyens laissés à la personne désignée, et quand prend-il effet ?",
  "Si je lui donne de mon vivant, quelle autorisation faut-il dans notre cas — un tuteur ou un curateur ad hoc, c’est-à-dire quelqu’un désigné uniquement pour cet acte-là, le juge, le conseil de famille — combien de temps prend-elle, et vaut-il mieux passer par une donation ou par un testament portant sur la quotité disponible ?",
];

export function PlanEnfantVulnerable() {
  return (
    <Feuille
      titre="Situation 10 — Un enfant vulnérable"
      sousTitre="Votre plan-type. Le plus élevé des abattements personnels du barème — et ce n'est pas le sujet principal."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="eviter-coupure space-y-1">
        {RECONNAISSANCE.map((r) => (
          <Case key={r}>{r}</Case>
        ))}
      </ul>
      {/* La 1re case est la seule qui décide : les deux autres ne font que dire
          que le lecteur y a déjà pensé. « Deux cases cochées » ne disait pas
          lesquelles, et le repli ne nommait aucune feuille de remplacement.
          ⚠️ Le renvoi donne le numéro ET le libellé de la case. Les deux listes
          sont alignées (voir l'en-tête), mais la feuille est lue seule des mois
          plus tard : si l'une des deux dérive un jour, le libellé rattrape le
          numéro et le lecteur ne repart pas avec le plan d'une autre famille. */}
      <p className="text-[0.93rem]">
        La première case cochée : ce plan est le vôtre — les deux autres disent seulement que vous y
        avez déjà pensé. Si elle ne l&apos;est pas, reprenez la feuille «&nbsp;Quelle est ma
        situation ?&nbsp;» et suivez le plan-type qu&apos;elle désigne. Sur cette grille, votre case
        est la n°&nbsp;10, celle qui dit «&nbsp;Un enfant vulnérable ou handicapé&nbsp;».
      </p>
      {/* Cette feuille sera relue des mois plus tard, peut-être par un frère ou une
          sœur qui n'a jamais vu le site : sans ce prénom, elle ne dit pas de qui
          elle parle. Même rôle que le « pays où vit mon enfant » de plan-enfant-etranger. */}
      <Champ label="L'enfant concerné" indice="prénom, et son âge aujourd'hui" />

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      {/* ⚠️ La prémisse est NOMMÉE, pas déduite de l'inaction : l'abattement de
          l'art. 779 II est un droit de l'héritier, que le notaire applique dès
          qu'il a la pièce. 38 194 € est le prix d'un dossier manquant le jour de
          la déclaration, pas une conséquence automatique de n'avoir rien fait. */}
      <div className="eviter-coupure">
        <p>
          La succession se partage à parts égales entre vos enfants (art. 735 du code civil). Si
          personne ne réclame l&apos;abattement de 159 325 € de l&apos;article 779 II — faute de
          dossier au moment de la déclaration de succession — l&apos;enfant vulnérable paie le plein
          tarif. Sur un patrimoine de 600 000 € laissé par un parent veuf à deux enfants, chacun
          recevant 300 000 €, il paie alors <strong>38 194 €</strong> au lieu de{" "}
          <strong>6 329 €</strong>. Le calcul complet est au point 6.
        </p>
        <p className="mt-2 text-[0.93rem]">
          Cet abattement est un droit de votre enfant, réclamé sur la déclaration de succession, et
          votre notaire l&apos;applique dès lors qu&apos;il sait. Ce qui manque le jour venu, ce
          n&apos;est jamais la règle : c&apos;est la pièce qui l&apos;établit (piège 1).
        </p>
      </div>
      <p>
        Et le jour venu, c&apos;est un juge qui choisira qui s&apos;occupe de lui — cela, en
        revanche, est bien la conséquence de n&apos;avoir rien écrit (piège 3).
      </p>
      {/* Sans cette ligne, un grand-parent qui a coché la 1re case du point 1
          reporterait les 100 000 € de l'art. 779 I sur une personne qui n'y a pas
          droit et referait le point 6 avec un abattement qui n'est pas le sien.
          Même mise en garde, mêmes articles que plan-veuf-veuve. */}
      <p className="text-[0.93rem]">
        Si la personne concernée est un <strong>petit-enfant</strong> et non un enfant, les chiffres
        de cette feuille ne sont pas les siens. L&apos;abattement de 159 325 € de l&apos;article 779
        II s&apos;applique de la même façon — il vise «&nbsp;tout héritier, légataire ou
        donataire&nbsp;», sans condition de lien. Mais l&apos;abattement personnel change : de votre
        vivant, 31 865 € (art. 790 B du CGI) ; à votre décès, il n&apos;a rien qui lui soit propre —
        1 594 € (art. 788, IV du CGI) — sauf s&apos;il vient à la place de son parent décédé avant
        vous, auquel cas il partage les 100 000 € de ce parent (art. 779, I du CGI). Refaites le
        point 6 avec le bon chiffre.
      </p>
      <p>
        Vous avez aussi le droit de lui laisser plus qu&apos;aux autres. Une part de votre
        patrimoine est librement attribuable, c&apos;est la quotité disponible : la moitié avec un
        enfant, le tiers avec deux, le quart avec trois ou plus (art. 913 du code civil).
      </p>
      <Source>
        Art. 779 I et II, 777, 784, 788 IV et 790 B du CGI. Art. 735 et 913 du code civil.
      </Source>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      <ol className="divide-y divide-black border-y border-black">
        {DATES.map((d) => (
          <li key={d.titre} className="py-2">
            {/* `eviter-coupure` est posé sur chaque paragraphe et non sur la date
                entière : la 1re date fait quatre paragraphes et déborderait d'un
                demi-feuillet, ce qui la renverrait en bloc sur la page suivante.
                Le titre reste collé à son premier paragraphe. */}
            {d.paragraphes.map((texte, i) => (
              <div key={i} className="eviter-coupure">
                {i === 0 && <p className="font-bold">{d.titre}</p>}
                <p className={i === 0 ? "text-[0.93rem]" : "mt-2 text-[0.93rem]"}>{texte}</p>
              </div>
            ))}
          </li>
        ))}
      </ol>
      {/* Hors des trois dates, et volontairement : l'art. 199 septies est une
          réduction d'impôt sur le revenu, sans effet sur la transmission. Énoncé
          descriptif, glosé en mots courants, sans un mot sur ce qu'il faudrait choisir. */}
      <p className="eviter-coupure text-[0.93rem]">
        Le code général des impôts définit par ailleurs deux contrats propres au handicap — la
        rente-survie, souscrite par les parents et qui versera une rente à l&apos;enfant après leur
        décès, et l&apos;épargne-handicap, souscrite par la personne handicapée elle-même pour
        constituer une épargne à son nom — et leur attache une réduction d&apos;impôt sur le revenu
        (art. 199 septies du CGI). C&apos;est un sujet distinct de la transmission, et il ne se
        traite pas chez le notaire : nous ne recommandons ni contrat, ni compagnie, ni catégorie de
        contrat.
      </p>
      <Source>
        Compteur des 15 ans : art. 779 et 784 du CGI. Acceptation de la donation et autorisations :
        art. 455, 467, 505 et 935 du code civil, décret n° 2008-1484 du 22 décembre 2008. 70e
        anniversaire, selon la date des versements : art. 990 I et 757 B du CGI. 71e anniversaire :
        art. 669 du CGI. Rente-survie et épargne-handicap, réduction d&apos;impôt sur le revenu :
        art. 199 septies du CGI.
      </Source>

      <Titre>4. Les 3 pièges de cette situation</Titre>
      <div className="space-y-2">
        {PIEGES.map((p) => (
          /* Un encadré coupé perd sa conclusion, et c'est toujours la conclusion
             qui porte la consigne. Protégés un par un, jamais en groupe. */
          <div key={p.titre} className="eviter-coupure">
            <Encadre titre={p.titre}>
              <p className="text-[0.93rem]">{p.texte}</p>
            </Encadre>
          </div>
        ))}
      </div>

      <Titre>5. Les 4 questions à poser à votre notaire</Titre>
      <ol className="divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          /* `eviter-coupure` sur chaque question, pas sur la liste : une question
             coupée de sa ligne d'écriture est inutilisable au rendez-vous. */
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

      <Titre>6. Ce que ça change, en euros</Titre>
      <p className="text-[0.93rem]">
        L&apos;hypothèse du point 2 : un parent veuf, 600 000 € de patrimoine, deux enfants dont
        l&apos;un est vulnérable. Chacun reçoit 300 000 €.
      </p>

      {/* Trois encadrés protégés un par un : c'est la colonne des tranches que le
          lecteur de 78 ans refait au stylo, et c'est le seul endroit du document
          qu'il refera. Coupée en deux au milieu d'une ligne, elle est perdue. */}
      <div className="eviter-coupure">
        <Encadre titre="AVANT — l'abattement de l'article 779 II n'est pas demandé">
          <p className="text-[0.93rem]">
            300 000 € − 100 000 € d&apos;abattement (art. 779 I) = 200 000 € imposables.
            <br />
            8 072 € à 5 % = 403,60 € · 4 037 € à 10 % = 403,70 € · 3 823 € à 15 % = 573,45 € · 184
            068 € à 20 % = 36 813,60 € → 38 194,35 €, soit 38 194 € arrondis.
            <br />
            <strong>
              L&apos;enfant vulnérable paie 38 194 €. Son frère aussi. Total famille : 76 388 €.
            </strong>
          </p>
        </Encadre>
      </div>

      <div className="eviter-coupure">
        <Encadre titre="APRÈS — l'abattement est demandé, justificatif à l'appui">
          <p className="text-[0.93rem]">
            300 000 € − 100 000 € (art. 779 I) − 159 325 € (art. 779 II) = 40 675 € imposables.
            <br />
            8 072 € à 5 % = 403,60 € · 4 037 € à 10 % = 403,70 € · 3 823 € à 15 % = 573,45 € · 24
            743 € à 20 % = 4 948,60 € → 6 329,35 €, soit 6 329 € arrondis.
            <br />
            <strong>
              L&apos;enfant vulnérable paie 6 329 €. Son frère paie toujours 38 194 €. Total famille
              : 44 523 €.
            </strong>
          </p>
        </Encadre>
      </div>

      <div className="eviter-coupure">
        <Encadre>
          <p className="text-[0.95rem]">
            <strong>Différence : 31 865 €</strong>, soit exactement 159 325 × 20 %. Le prix
            d&apos;un dossier constitué à temps et d&apos;une ligne demandée sur la déclaration. Et
            ce n&apos;est que la succession : les mêmes 259 325 € peuvent être donnés du vivant, par
            chaque parent, et chaque donation cesse d&apos;être rappelée quinze ans après sa propre
            date (art. 784 du CGI).
          </p>
        </Encadre>
      </div>
      <Source>
        Barème en ligne directe : art. 777 du CGI. Abattements : art. 779 I et II du CGI.
      </Source>

      {/* Un bloc non numéroté entre le 6 et le 7 faisait croire, sur papier, à une
          page sautée. Fusionné dans un point 7 numéroté, comme plan-marie-2-enfants. */}
      <Titre>7. Mon cas, et ma décision</Titre>
      {/* Deux montants à six chiffres ne rentrent pas sur une ligne de 44 px, écrits
          à la main : quatre Champ, comme plan-en-1-page pour ces mêmes chiffres. Et
          chaque indice nomme l'encadré d'où sort le nombre — le Simulateur est posé
          à côté sur la table, le lecteur ne doit pas avoir à deviner lequel lire. */}
      <div className="eviter-coupure grid gap-3">
        <Champ label="Le patrimoine à partager" indice="Simulateur, encadré C" />
        <Champ label="La part de mon enfant vulnérable" indice="Simulateur, encadré D" />
        <Champ label="Ce qu'il paierait aujourd'hui" indice="Simulateur, encadré F" />
        <Champ
          label="Ce qu'il paierait après ce plan"
          indice="à recalculer sur le modèle du point 6"
        />
      </div>

      {/* La 1re date ordonne « notez la date de chacune » et l'encadré du point 6
          répète que chaque donation cesse d'être rappelée quinze ans après la
          sienne : sans ces lignes, la feuille demandait d'écrire des dates et ne
          donnait rien sous le stylo. Mêmes lignes que plan-veuf-veuve. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Date de mon premier don déclaré"
          indice="le compteur des 15 ans part de ce jour-là"
        />
        <Champ label="Mon compteur recharge le" indice="cette date + 15 ans" />
        <Champ
          label="Mes 70 ans, puis mes 71 ans"
          indice="les deux dates, si elles ne sont pas encore passées"
        />
        {/* Le piège 3 dit que c'est « la seule ligne qui ne s'achète pas avec de
            l'argent » : elle avait besoin d'un endroit où s'écrire. */}
        <Champ
          label="La personne que je désigne pour prendre le relais"
          indice="nom, lien, téléphone"
        />
      </div>

      {/* Une case par action : le lecteur qui a fait l'une et pas l'autre ne pouvait
          ni cocher, ni ne pas cocher. Trois actions, trois cases, comme plan-veuf-veuve.
          ⚠️ La première case est libellée en euros et non en numéro d'article : un
          enfant qui ouvre le classeur après coup voit ce qui a été fait, pas un
          code. Et la ligne qui suit dit QUELLE pièce, et OÙ elle est rangée — sans
          quoi « le dossier réuni maintenant » du piège 1 reste introuvable. */}
      <div className="eviter-coupure">
        <ul className="space-y-1">
          <Case>Je réunis le justificatif qui ouvre l&apos;abattement de 159 325 €.</Case>
          <Case>Je demande à mon notaire le mandat de protection future pour autrui.</Case>
          <Case>Je fais relire ma clause bénéficiaire au regard du point 3.</Case>
        </ul>
        <div className="mt-2 grid gap-3">
          <Champ
            label="Le justificatif que j'ai réuni, et où il est rangé"
            indice="la pièce du piège 1, et l'endroit exact du classeur"
          />
          <Champ label="La première chose que je fais, et avant quelle date" />
          <Champ label="Décidé le" indice="signature" />
        </div>
      </div>

      <p className="text-[0.9rem]">
        Ce plan est un modèle général, à faire relire par votre notaire : il est la seule personne
        habilitée à vérifier qu&apos;il s&apos;applique à votre famille et à rédiger les actes.
      </p>
    </Feuille>
  );
}
