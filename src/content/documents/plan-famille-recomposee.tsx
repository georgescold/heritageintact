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
 * SITUATION 3 — FAMILLE RECOMPOSÉE. Plan-type de situation (upsell 1).
 *
 * ⚠️ C'est la situation la plus douloureuse du sujet, et la raison est un seul
 * mot : le CGI ne connaît pas les « beaux-enfants ». L'enfant du conjoint qui
 * n'a pas été adopté est traité comme un inconnu — 1 594 € d'abattement puis
 * 60 % (art. 788 IV et 777). Le lecteur ne le sait presque jamais, et il le
 * découvre par ses enfants, après. Tout le plan tient à faire tomber ce chiffre
 * avant qu'il ne s'applique.
 *
 * ⚠️ POURQUOI LA CONDITION DE MARIAGE A SON PROPRE ENCADRÉ. L'art. 786 du CGI
 * n'écarte le lien d'adoption simple qu'au profit, en 1°, des « enfants issus
 * d'un premier mariage du conjoint de l'adoptant ». La doctrine l'étend au
 * précédent mariage, à l'enfant naturel reconnu et à l'enfant adopté
 * plénièrement par le conjoint — mais toujours à l'intérieur d'un mariage,
 * l'adoption devant être intervenue pendant celui-ci. Or cette feuille recrute
 * aussi des couples pacsés et en concubinage : un lecteur non marié qui
 * instruirait une adoption simple sur la foi de cette page resterait taxé à
 * 1 594 € puis 60 %.
 *
 * ⚠️ ET POURQUOI C'EST LE 3° BIS, JAMAIS LE 3°. Le 3° de l'art. 786 ne vise que
 * « d'adoptés MINEURS au moment du décès de l'adoptant ou d'adoptés mineurs au
 * moment de la donation ». Le bel-enfant du lecteur-type a quarante ans : sa
 * seule porte est le 3° bis, qui vise les adoptés MAJEURS, avec l'alternative
 * cinq ans dans la minorité / dix ans minorité et majorité réunies. Les deux
 * exigent des secours et des soins non interrompus « AU TITRE D'UNE PRISE EN
 * CHARGE CONTINUE ET PRINCIPALE » — et c'est cette mention, et non la durée,
 * qui ferme la porte à un beau-parent ayant vu grandir l'enfant à côté de ses
 * deux parents vivants. Écrire « seul le 3° » était doublement faux : mauvais
 * numéro, et l'article comporte aussi les 2°, 4°, 5°, 6° et 7°.
 *
 * ⚠️ Le piège 2 dit que le conjoint ou le partenaire ne paie rien, ET qu'il
 * faut encore qu'il hérite. Le PACS exonère (art. 796-0 bis) mais ne rend pas
 * héritier : ni le partenaire ni le concubin ne figure dans un ordre de la
 * dévolution (art. 731 et 734 du Code civil). Sans testament, l'exonération
 * s'applique à zéro euro — c'est le piège central de la feuille sœur
 * plan-concubins-pacs.tsx, et le point 1 recrute ici les mêmes lecteurs.
 *
 * ⚠️ Pourquoi le 70e anniversaire passe ICI devant le compteur des 15 ans :
 * dans les autres situations, la donation est le premier levier. Ici elle ne
 * répare rien pour l'enfant du conjoint — une donation lui serait taxée aux
 * mêmes 60 %. L'assurance-vie relevant de l'art. 990 I est le seul dispositif
 * qui l'atteigne à taux plein, et il se ferme au 70e anniversaire. L'ordre des
 * dates change donc avec la famille : c'est exactement ce que le lecteur achète.
 *
 * ⚠️ La réserve héréditaire est écrite dans le volet AVANT, et pas seulement en
 * note : le lecteur-type a ses propres enfants, donc son legs de 60 000 € est
 * plafonné par l'art. 913 du Code civil. L'assiette de la quotité disponible y
 * est écrite aussi (art. 922) : le lecteur de cette feuille a très souvent déjà
 * donné à ses propres enfants, et ces donations sont fictivement réunies. En
 * comptant sa seule fortune du jour, il surestime ce dont il peut disposer, et
 * le legs qu'il croit sécurisé est réductible.
 *
 * ⚠️ LE SOUS-TITRE NE PROMET PAS « UNE PAGE ». Huit sections, sept encadrés, un
 * tableau de six lignes, huit lignes à remplir au stylo (44 px chacune) et six
 * cases : à 12 pt sur les 178 mm utiles d'un A4, cette feuille sort sur trois à
 * quatre pages quoi qu'on fasse au texte. Le vrai une-page du classeur est
 * plan-en-1-page.tsx, huit fois plus court. Promettre une page sur un document
 * qui en sort trois, c'est la première réclamation ; ne rien promettre ne coûte
 * rien.
 *
 * ⚠️ `eviter-coupure` est posé sur CHAQUE élément, jamais sur le conteneur :
 * `break-inside: avoid` sur un bloc de 130 mm le renvoie en entier à la page
 * suivante et laisse une demi-page blanche — sur une cartouche à 30 €, c'est une
 * feuille perdue. Un item de 30 mm protégé, lui, ne coûte rien.
 *
 * ⚠️ Tous les séparateurs de milliers et tous les espaces devant € et % sont des
 * espaces fines insécables (U+202F). Sur une feuille annotée au stylo et relue
 * des mois plus tard, parfois par un enfant qui n'a jamais vu le site, un « 152 »
 * resté seul en fin de ligne n'est pas rattrapable.
 *
 * ⚠️ Aucun contrat, aucun assureur, aucune banque n'est nommé (contrainte CIF).
 * Le volet APRÈS est rédigé au constat (« SI la somme figure sur… »), jamais au
 * conseil (« vous la désignez… ») : on expose ce que la loi fait de deux voies,
 * on ne recommande pas un placement. Le chapeau du point 4 est au constat pour
 * la même raison. L'adoption simple est présentée comme une décision de justice
 * à instruire avec le notaire, jamais comme une recette.
 */

/**
 * Les pièges sont des tableaux de paragraphes et non un bloc unique : un pavé
 * de 800 signes à 0,93 rem n'est pas lisible d'un trait à 78 ans, sur du papier.
 * La condition de mariage, elle, est sortie du piège 3 dans son propre encadré —
 * c'est la seule ligne de la feuille qui peut coûter 60 % au lecteur non marié.
 */
const PIEGES: { titre: string; paragraphes: string[] }[] = [
  {
    titre: "Piège 1 — croire que l’enfant de votre conjoint est votre enfant",
    paragraphes: [
      "Vous l’avez élevé, il vous appelle peut-être par votre prénom depuis trente ans : le fisc, lui, ne voit aucun lien. Abattement 1 594 € (art. 788 IV du CGI), puis 60 % sur tout le reste (art. 777). Le mot « beau-fils » n’existe nulle part dans le Code général des impôts.",
    ],
  },
  {
    titre: "Piège 2 — tout laisser au conjoint en pensant qu’il transmettra ensuite",
    paragraphes: [
      "Votre conjoint marié ou votre partenaire de PACS ne paie rien (art. 796-0 bis du CGI) — encore faut-il qu’il hérite. Ni le partenaire de PACS ni le concubin ne figure parmi les héritiers désignés par la loi (art. 731 et 734 du Code civil) : sans testament, cette exonération s’applique à zéro euro. Le testament et le PACS vont ensemble, jamais l’un sans l’autre.",
      "Si vous vivez en concubinage sans mariage ni PACS, votre compagnon est en outre traité comme une personne non parente — 1 594 € puis 60 % (art. 788 IV et 777 du CGI), exactement comme au piège 1.",
      "Et à son décès, ce qu’il détient part vers SES enfants à lui (art. 731 et 734 du Code civil) : vos enfants d’un premier lit n’y ont aucun droit, et ce qu’il voudrait leur laisser repasserait à 60 %. Le détour par le conjoint ne reporte pas l’impôt, il le crée.",
      "Si vous êtes marié, votre contrat de mariage peut attribuer à votre conjoint plus que sa part de communauté : c’est un avantage matrimonial. Vos enfants qui ne sont pas les siens peuvent en demander le retranchement — c’est-à-dire faire rogner ce qui dépasse (art. 1527, al. 2 du Code civil). C’est la question 3 du point 6.",
    ],
  },
  {
    titre: "Piège 3 — signer une adoption simple sans avoir compté ce qu’elle déplace",
    paragraphes: [
      "Elle donne bien le régime de la ligne directe à l’enfant du conjoint — 100 000 € d’abattement et le barème 5 à 45 % (art. 786, 779 et 777 du CGI).",
      "Mais elle en fait aussi un héritier réservataire dans VOTRE succession : la part garantie de vos enfants diminue d’autant, et ce sont eux qui découvriront le chiffre.",
      "Et elle ne se défait que sur décision de justice, et seulement pour motifs graves (art. 370 du Code civil). Considérez-la comme définitive.",
    ],
  },
];

/** La porte du 3° bis, sortie du piège 3 : trois lignes courtes, une idée par ligne. */
const CONDITION_MARIAGE: string[] = [
  "Le régime de la ligne directe n’est acquis que si vous êtes marié avec le père ou la mère de cet enfant, et si l’adoption est intervenue pendant ce mariage (art. 786, 1° du CGI).",
  "À défaut de mariage, la porte qui reste est le 3° bis du même article, s’il est majeur : il faut qu’il ait reçu de vous des secours et des soins non interrompus, AU TITRE D’UNE PRISE EN CHARGE CONTINUE ET PRINCIPALE, soit cinq ans au moins dans sa minorité, soit dix ans minorité et majorité réunies (art. 786, 3° bis du CGI). Le 3°, lui, ne vise que l’adopté encore mineur à votre décès.",
  "« Prise en charge continue et principale » veut dire que c’est vous qui l’avez élevé à titre principal — pas que vous l’avez vu grandir : c’est le point à faire trancher par votre notaire avant d’engager quoi que ce soit.",
];

const QUESTIONS: string[] = [
  "Dans ma succession telle qu’elle est aujourd’hui, l’enfant de mon conjoint est-il taxé à 60 % au-delà de 1 594 € — oui ou non ?",
  "Si je fais une adoption simple : suis-je bien marié avec son père ou sa mère, comme l’exige l’art. 786, 1° du CGI — et de combien la part réservée à mes propres enfants diminue-t-elle, en euros ?",
  "Mes enfants qui ne sont pas ceux de mon conjoint peuvent-ils faire réduire l’avantage que mon contrat de mariage donne à mon conjoint, et sur quels biens (art. 1527, al. 2 du Code civil) ?",
];

export function PlanFamilleRecomposee() {
  return (
    <Feuille
      titre="Situation 3 — Famille recomposée"
      sousTitre="Votre plan-type. Remplissez-le au stylo, puis emportez-le chez le notaire."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="space-y-1">
        <Case>
          Vous êtes marié, pacsé ou en couple, et l&apos;un de vous au moins a un enfant né
          d&apos;une union précédente.
        </Case>
        <Case>
          Vous souhaitez laisser quelque chose à l&apos;enfant de votre conjoint, que vous
          n&apos;avez pas adopté.
        </Case>
        <Case>
          Vous voulez que vos propres enfants reçoivent leur part sans attendre le décès de votre
          conjoint.
        </Case>
      </ul>
      {/* Sans phrase de sortie, le lecteur qui ne coche qu'une case ne sait pas
          s'il doit continuer — et c'est la feuille où l'on peut cocher la
          première case sans être concerné par le piège 3 ni par le point 7. */}
      <p className="text-[0.93rem]">
        La première case suffit : ce plan est le vôtre. Les points 3 et 7, eux, ne valent que pour
        l&apos;enfant de votre conjoint que vous n&apos;avez PAS adopté.
      </p>
      {/* La ligne la plus importante de la feuille. Tout l'art. 786, 1° tient à
          ce fait, et il n'était écrit nulle part : un concubin pouvait traverser
          les huit points, cocher « j'instruis une adoption simple » au point 8,
          et arriver chez le notaire sans avoir jamais consigné ce qui invalide
          sa décision. */}
      <Champ
        label="Je suis marié avec le parent de cet enfant"
        indice="oui / non — si non, l’adoption simple ne donne la ligne directe que par le 3° bis de l’art. 786"
      />

      <Titre>2. Qui est qui, dans ma famille</Titre>
      <p className="text-[0.95rem]">
        Une ligne par enfant, le mien comme celui de mon conjoint. Dans la colonne « Adopté ? »,
        écrivez oui ou non.
      </p>
      {/* Six lignes et non quatre : c'est le seul document du classeur écrit pour
          les familles recomposées, où les miens + les siens + les nôtres passent
          couramment quatre. Un lecteur qui ne peut pas inscrire son cinquième
          enfant abandonne le tableau. */}
      <TableauVierge
        colonnes={["Prénom", "Enfant de qui", "Adopté ?", "Ce que je lui laisse"]}
        lignes={6}
      />

      <Titre>3. Ce qui se passe si vous ne faites rien</Titre>
      <p>
        Un enfant que vous n&apos;avez pas adopté n&apos;est, pour l&apos;impôt, lié à vous par
        rien. Il a droit à <strong>1 594 €</strong> d&apos;abattement (art. 788 IV du CGI), puis
        paie <strong>60 %</strong> sur tout le reste (art. 777 du CGI). C&apos;est le tarif
        d&apos;un inconnu, appliqué à quelqu&apos;un que vous avez élevé. Le calcul complet, en
        euros, est au point 7.
      </p>
      <Source>
        Art. 788 IV du CGI (abattement de 1 594 € à défaut d&apos;autre abattement) — art. 777 du
        CGI (tarif de 60 % entre personnes non parentes).
      </Source>

      <Titre>4. Les 3 dates, dans VOTRE ordre</Titre>
      {/* Au constat, et non au conseil : on dit ce que la loi fait de chaque
          enveloppe, on n'envoie pas le lecteur en ouvrir une. */}
      <p className="text-[0.95rem]">
        L&apos;ordre n&apos;est pas le même pour tout le monde : dans une famille non recomposée, on
        commence par donner. Ici, donner à l&apos;enfant du conjoint ne sert à rien — la donation
        serait taxée aux mêmes 60 %. Une seule enveloppe l&apos;atteint à taux plein, quel que soit
        le lien de parenté, et elle se ferme à une date fixe : c&apos;est donc elle qui commande
        votre calendrier.
      </p>
      {/* `list-decimal` : le préflight Tailwind supprime les puces des <ol>, et
          l'argument de vente de cette feuille est justement que l'ORDRE des
          dates change. Sans numéros, il ne repose plus que sur « D'abord /
          Ensuite / Enfin », noyés dans le gras. */}
      <ol className="list-decimal space-y-2 pl-5">
        <li className="eviter-coupure">
          <strong>D&apos;abord — votre 70e anniversaire.</strong> Les sommes versées sur un contrat
          d&apos;assurance-vie avant ce jour donnent{" "}
          <strong>152 500 € d&apos;abattement par bénéficiaire</strong>, quel que soit le lien de
          parenté — y compris quand il n&apos;y en a aucun, donc aussi pour l&apos;enfant de votre
          conjoint (art. 990 I du CGI). L&apos;abattement se calcule sur ce que le bénéficiaire
          touche au décès, primes et intérêts confondus, et non sur ce que vous versez
          aujourd&apos;hui. Après ce jour, les versements ne donnent plus que{" "}
          <strong>30 500 €</strong> au total, tous contrats et tous bénéficiaires confondus (art.
          757 B du CGI). C&apos;est la date la plus chère de votre situation. Un contrat souscrit
          avant le 20 novembre 1991 obéit à des règles distinctes : faites-le vérifier contrat par
          contrat.
        </li>
        <li className="eviter-coupure">
          <strong>Ensuite — le compteur des 15 ans.</strong> Pour vos propres enfants :{" "}
          <strong>100 000 € par parent et par enfant</strong> (art. 779 du CGI). Chaque don cesse
          d&apos;être recompté quinze ans après sa propre date (art. 784 du CGI) — c&apos;est donc
          un compteur par don, et non un compteur unique qui repartirait en bloc. Il sert à donner à
          vos enfants de votre vivant, sans les faire attendre le décès de votre conjoint.
        </li>
        <li className="eviter-coupure">
          <strong>Enfin — votre 71e anniversaire.</strong> Si vous donnez la nue-propriété d&apos;un
          bien en gardant l&apos;usage, elle est comptée à <strong>60 %</strong> de la valeur avant
          ce jour, <strong>70 %</strong> après (art. 669 du CGI).
        </li>
      </ol>
      <Champ label="Mes 70 ans, c’est le" indice="jour, mois, année" />
      <Champ label="Mon 71e anniversaire tombe le" indice="jour, mois, année" />
      <Champ label="Ma dernière donation déclarée" indice="ou « jamais » — puis + 15 ans" />

      <Titre>5. Les 3 pièges de cette situation</Titre>
      <div className="space-y-2">
        {PIEGES.map((p) => (
          /* La classe est sur chaque piège, pas sur le groupe : les trois
             encadrés font ensemble plus de la moitié d'une page, et protéger le
             groupe entier le renverrait en bloc sur la feuille suivante. */
          <div key={p.titre} className="eviter-coupure">
            <Encadre titre={p.titre}>
              {p.paragraphes.map((t, i) => (
                <p key={t} className={i === 0 ? "text-[0.93rem]" : "mt-2 text-[0.93rem]"}>
                  {t}
                </p>
              ))}
            </Encadre>
          </div>
        ))}
        <div className="eviter-coupure">
          <Encadre titre="LA CONDITION QUE PERSONNE NE VOUS DIRA : L’ADOPTION SIMPLE SUPPOSE UN MARIAGE">
            <ul className="list-disc space-y-1 pl-5 text-[0.93rem]">
              {CONDITION_MARIAGE.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Encadre>
        </div>
      </div>

      <Titre>6. Les 3 questions à poser à votre notaire</Titre>
      <ol className="divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          /* Le carré de 18 px vient de questions-notaire.tsx : c'est la feuille
             qu'on tient pendant le rendez-vous, et on coche pendant qu'on parle.
             Sans les cases, le lecteur perd le fil de ses trois questions. */
          <li key={q} className="eviter-coupure py-2">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
              />
              <p className="text-[0.95rem]">
                <strong>{i + 1}.</strong> {q}
              </p>
            </div>
            <div className="ml-[30px] mt-1 min-h-[36px] border-b border-black" />
          </li>
        ))}
      </ol>

      <Titre>7. Ce que ça change, en euros</Titre>
      <p className="text-[0.95rem]">
        Vous avez 68 ans. Vous voulez laisser <strong>60 000 €</strong> à la fille de votre épouse,
        que vous n&apos;avez pas adoptée. La loi ne traite pas ces deux voies de la même façon.
        Voici les deux chiffres, à faire vérifier par votre notaire avant toute décision.
      </p>
      <div className="eviter-coupure">
        <Encadre titre="AVANT — la somme lui est laissée par testament">
          <p className="text-[0.93rem]">
            60 000 € − 1 594 € d&apos;abattement = 58 406 € taxables. 58 406 × 60 % ={" "}
            <strong>35 044 € de droits</strong>. Elle reçoit <strong>24 956 €</strong> — et à
            condition que ce legs tienne dans la quotité disponible, c&apos;est-à-dire la part dont
            vous pouvez disposer librement : la moitié si vous avez un enfant, le tiers si vous en
            avez deux, le quart au-delà (art. 913 du Code civil). Au-delà de cette part, vos enfants
            peuvent faire réduire le legs, et il ne reste plus rien de ce calcul.
          </p>
          {/* L'assiette, et pas seulement la fraction : le lecteur de cette
              feuille a très souvent déjà donné à ses propres enfants, et ces
              donations sont fictivement réunies. En comptant sa seule fortune du
              jour, il croit sécurisé un legs qui est réductible. */}
          <p className="mt-2 text-[0.93rem]">
            <strong>Attention à l&apos;assiette :</strong> elle se calcule sur vos biens au jour du
            décès, moins vos dettes, PLUS tout ce que vous avez déjà donné de votre vivant (art. 922
            du Code civil). Si vous avez déjà donné à vos enfants, votre quotité disponible est plus
            petite que vous ne le croyez.
          </p>
        </Encadre>
      </div>
      <div className="eviter-coupure">
        <Encadre titre="APRÈS — SI la somme figure sur un contrat alimenté avant vos 70 ans">
          <p className="text-[0.93rem]">
            60 000 € versés avant votre 70e anniversaire, sous l&apos;abattement de 152 500 € par
            bénéficiaire : <strong>0 € de prélèvement</strong>, le capital ne faisant pas partie de
            la succession (art. L. 132-12 du Code des assurances). Elle reçoit{" "}
            <strong>60 000 €</strong>. <strong>Différence : 35 044 €.</strong> Cette voie-là échappe
            en outre au rapport et à la réduction — c&apos;est-à-dire au recalcul des parts entre
            vos enfants et à leur droit de faire rogner ce qui dépasse : la réserve de vos enfants
            ne l&apos;atteint pas (art. L. 132-13, al. 1 du Code des assurances), sauf primes
            manifestement exagérées (al. 2 du même article).
          </p>
        </Encadre>
      </div>
      <Source>
        Art. 990 I du CGI (152 500 € par bénéficiaire sur les versements faits avant 70 ans ; puis
        20 %, et 31,25 % au-dessus de 700 000 €, ce seuil s&apos;appréciant par bénéficiaire, après
        l&apos;abattement) — art. 757 B du CGI (30 500 € tous contrats et tous bénéficiaires
        confondus, sur les versements faits après 70 ans) — art. 786 du CGI (l&apos;enfant du
        conjoint qui a fait l&apos;objet d&apos;une adoption simple est taxé en ligne directe, sous
        l&apos;abattement de 100 000 € de l&apos;art. 779 et au barème de l&apos;art. 777) — art.
        913 et 922 du Code civil (quotité disponible et son assiette) — art. L. 132-12 et L. 132-13
        du Code des assurances.
      </Source>
      {/* Ces quatre mises en garde sont ce qui empêche le lecteur de compter sur
          le « 0 € » affiché en gras juste au-dessus. Elles étaient au plus petit
          corps de la feuille : elles passent en encadré, au corps des textes qui
          se lisent. */}
      <div className="eviter-coupure">
        <Encadre titre="AVANT DE COMPTER SUR CE 0 €">
          <p className="text-[0.95rem]">
            <strong>Exemple chiffré, à recalculer sur votre situation.</strong> Quatre points sont à
            faire vérifier par votre notaire.
          </p>
          <p className="mt-2 text-[0.95rem]">
            <strong>1.</strong> L&apos;abattement de 152 500 € se compte une seule fois par
            bénéficiaire et par assuré, tous vos contrats confondus : si vous l&apos;avez déjà
            désignée ailleurs, il n&apos;y a pas 152 500 € neufs.
          </p>
          <p className="mt-2 text-[0.95rem]">
            <strong>2.</strong> Le bénéficiaire reçoit le capital du contrat au jour du décès, et
            non la somme versée. Sur un contrat en unités de compte — c&apos;est-à-dire investi en
            bourse, donc dont la valeur monte et descend — ce capital varie, les gains supportant
            les prélèvements sociaux.
          </p>
          <p className="mt-2 text-[0.95rem]">
            <strong>3.</strong> Les sommes versées ne doivent pas être{" "}
            <em>manifestement exagérées</em> eu égard à vos facultés — hors de proportion avec ce
            que vous possédez : votre âge, votre patrimoine, vos revenus, votre situation de famille
            et l&apos;utilité que ce contrat a pour vous (art. L. 132-13, al. 2 du Code des
            assurances). C&apos;est le seul angle par lequel vos enfants peuvent attaquer ce
            capital. Faites-le apprécier par votre notaire, avec vos vrais chiffres.
          </p>
          <p className="mt-2 text-[0.95rem]">
            <strong>4.</strong> La clause doit désigner cette personne sans ambiguïté — son nom, son
            prénom, sa date de naissance : la rédaction de cette clause est{" "}
            <strong>à faire relire par votre notaire</strong> avant signature.
          </p>
        </Encadre>
      </div>

      <Titre>8. Ma décision</Titre>
      <ul className="space-y-1">
        <Case>
          J&apos;ai vérifié la clause bénéficiaire de chacun de mes contrats, nom par nom.
        </Case>
        <Case>
          J&apos;ai posé les trois questions ci-dessus à mon notaire, et noté ses réponses.
        </Case>
        <Case>
          J&apos;ai décidé, oui ou non, d&apos;instruire une adoption simple — après avoir vérifié
          que la condition de mariage est remplie, et chiffré ce qu&apos;elle retire à mes propres
          enfants.
        </Case>
      </ul>
      {/* Le point 7 donne un exemple à 68 ans sur 60 000 € et dit « à recalculer
          sur votre situation » : sans ces lignes, il n'y a nulle part où écrire
          ses propres chiffres, et la feuille se lit au lieu de se travailler. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Ce que je veux laisser à l’enfant de mon conjoint"
          indice="un montant, ou le bien"
        />
        <Champ
          label="Ce qu’il recevrait aujourd’hui, après 60 %"
          indice="le calcul du point 7, avec mes chiffres"
        />
        <Champ label="Le contrat concerné" indice="numéro, compagnie, où est le contrat" />
        <Champ label="Décidé le" indice="date, et signature" />
      </div>

      <p className="text-[0.9rem]">
        Ce plan est un plan de travail, pas un acte. Il n&apos;a aucune valeur juridique tant que
        les actes correspondants n&apos;ont pas été passés devant notaire : faites-le relire au
        premier rendez-vous.
      </p>
    </Feuille>
  );
}
