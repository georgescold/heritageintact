import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * SITUATION 11 — PATRIMOINE SUPÉRIEUR À 1 MILLION. Plan-type de l'étape
 * « Le Plan familial ».
 *
 * ⚠️ Pourquoi cette situation a son propre plan : en dessous du million, un
 * seul levier suffit presque toujours — l'abattement de 100 000 € (art. 779)
 * couvre l'essentiel, et l'assurance-vie absorbe le reste. Au-dessus, plus
 * aucun levier ne suffit seul : l'abattement est fixe, le plafond de
 * l'assurance-vie est fixe et par bénéficiaire (art. 990 I), et tout ce qui
 * dépasse tombe dans la tranche à 20 %, puis 30, 40 et 45 % (art. 777 — le
 * barème en ligne directe ne s'arrête PAS à 30 %, et la feuille n'a pas de
 * borne haute : un lecteur à 2 M€ avec un enfant unique touche le 45 %). Ce
 * qui change n'est donc pas la liste des leviers, c'est leur ORDRE : ici le
 * temps devient la ressource rare, et le compteur des 15 ans passe devant les
 * deux anniversaires.
 *
 * ⚠️ LE RAPPEL FISCAL NE SE CONTENTE PAS DE REPRENDRE L'ABATTEMENT. L'article
 * 784 a deux temps, et c'est le second qu'on oublie : on ajoute à la succession
 * la valeur des biens déjà donnés, et l'on considère « ceux de ces biens dont
 * la transmission n'a pas encore été assujettie au droit de mutation à titre
 * gratuit comme inclus dans les tranches les plus ÉLEVÉES de l'actif imposable »
 * (art. 784, al. 2). Attention au sens de la phrase : le texte range en haut du
 * barème les biens NON ENCORE TAXÉS, ce qui revient exactement à laisser les
 * biens déjà donnés occuper les tranches basses. C'est cet effet-là, et non la
 * lettre du texte, que le point 6 imprime — sans guillemets, précisément parce
 * que c'est une paraphrase. Les tranches à 5, 10 et 15 % ayant déjà été
 * consommées par la donation-partage, elles ne peuvent pas resservir : tant que
 * les quinze ans ne sont pas écoulés, la part successorale reste entièrement
 * dans la tranche à 20 %. Une version antérieure de cette feuille refaisait
 * partir le barème à 5 % et sous-estimait la facture de 1 806 € par enfant. Le
 * scénario « quinze ans franchis », lui, repart bien à 5 % — la donation est
 * alors entièrement sortie du rappel, et c'est cette asymétrie qui trahissait
 * l'erreur.
 *
 * ⚠️ « LE COMPTEUR DES 15 ANS » N'EST PAS UN COMPTEUR UNIQUE qui démarrerait au
 * premier don, même modeste. Le délai court donation par donation, et chaque
 * donation ne libère que le montant d'abattement qu'elle avait consommé (art.
 * 784). Le don de somme d'argent de l'art. 790 G a son PROPRE abattement, ne
 * consomme pas les 100 000 € de l'art. 779 et reste hors du rappel : il ne
 * démarre rigoureusement rien pour ces 100 000 €. Dans l'exemple ci-dessous,
 * c'est le geste 3 qui consomme l'abattement, et c'est de la date du geste 3
 * que partent les quinze ans. Un lecteur qui croirait lancer son compteur avec
 * un petit don d'argent perdrait plusieurs années.
 *
 * ⚠️ Pourquoi l'exemple chiffré fait apparaître 16 388 € de droits PAYÉS
 * aujourd'hui : au-dessus du million, une donation qui reste entièrement sous
 * l'abattement n'existe pas. Faire croire au « zéro droit » serait faux, et le
 * notaire le démentirait au premier rendez-vous. On montre le vrai arbitrage —
 * payer 16 388 € maintenant pour en économiser 102 746 €, et davantage si les
 * 15 ans sont franchis.
 *
 * ⚠️ Aucun contrat, aucun assureur, aucune banque, aucune société de gestion
 * n'est nommé (contrainte CIF) : ce document dit à partir de quel moment on ne
 * décide plus seul, jamais quoi acheter. Le geste 2 porte d'ailleurs sur les
 * contrats DÉJÀ souscrits — on fait vérifier, on ne fait pas placer. Aucun
 * montant d'émoluments non plus, leur barème étant réglementé et révisé par
 * arrêté.
 *
 * ⚠️ Les encadrés du point 6 sont scindés et portent `eviter-coupure`
 * (globals.css) : d'un seul tenant, le bloc dépassait la demi-page et se
 * coupait en travers du calcul, bordure ouverte en bas d'une page et rouverte
 * en haut de la suivante. La même protection est posée sur les cases du point 1,
 * sur CHAQUE puce du point 3 — le § du compteur des 15 ans fait à lui seul une
 * douzaine de lignes imprimées — et sur les blocs du point 7. Elle y est posée
 * par groupes de quelques lignes et jamais sur l'ensemble : un `eviter-coupure`
 * plus haut qu'une demi-page ne protège plus rien, il pousse simplement un
 * grand blanc en bas de la page précédente.
 *
 * ⚠️ Les montants des encadrés de calcul portent une espace fine insécable,
 * écrite `&#8239;` et non tapée en clair, pour rester visible à la relecture.
 * Sans elle, le navigateur coupe « 484 068 € » entre 484 et 068 en fin de
 * ligne : un lecteur qui recopie ce chiffre au stylo, dans un classeur, ne
 * peut plus le lire. Les constantes en haut de fichier sont des chaînes TS,
 * où l'entité ne serait pas décodée : elles n'en portent pas.
 */

/** Les trois cases du point 1. La quatrième n'est pas une variante : c'est
 *  l'hypothèse qui porte tout le chiffrage — un seul détenteur, donc un seul
 *  jeu d'abattements. C'est pourquoi elle énonce la RÈGLE (un abattement par
 *  parent et par enfant) et non un nombre : un couple avec trois enfants en a
 *  six, pas quatre, et un chiffre calé en dur sur l'exemple à deux enfants
 *  serait faux pour lui dès la case de reconnaissance. */
const RECONNAISSANCE: string[] = [
  "En additionnant vos biens, vos placements et vos contrats, vous dépassez le million d’euros — même si l’essentiel est en immobilier et ne rapporte rien chaque mois.",
  "Une grande part de ce patrimoine tient dans un ou deux biens qui ne se coupent pas en deux.",
  "Vous avez déjà compris qu’un seul geste ne suffira pas, et vous ne savez pas par lequel commencer.",
  "Vous êtes seul détenteur de ce patrimoine — veuf, divorcé ou célibataire. Si vous êtes en couple, lisez d’abord la situation 2 : vous disposez d’un abattement de 100 000 € par parent ET par enfant, donc du double de ce que compte cette feuille, qui est calculée sur un seul détenteur. Tous les chiffres sont à refaire.",
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Tout faire reposer sur l’assurance-vie",
    texte:
      "C’est le réflexe, et il plafonne. L’abattement est de 152 500 € PAR BÉNÉFICIAIRE sur le capital transmis au titre des versements faits avant 70 ans — primes et gains compris — et il ne se recharge jamais (art. 990 I du CGI). Au-delà, la part taxable de chaque bénéficiaire subit 20 %, puis 31,25 % au-dessus de 700 000 €. Avec deux enfants, la franchise totale est donc de 305 000 € — à comparer à votre patrimoine. Sur 1 200 000 €, elle en couvre le quart.",
  },
  {
    titre: "Donner en pleine propriété ce qui pouvait être démembré",
    texte:
      "Donner un bien de 500 000 € en pleine propriété, c’est payer des droits sur 500 000 €. Donner la seule nue-propriété — la propriété du bien sans le droit de l’occuper ni d’en toucher les loyers — avant votre 71e anniversaire, c’est payer sur 60 % de cette valeur, soit 300 000 € (art. 669 du CGI), et garder l’usage du bien et ses loyers jusqu’au bout : c’est ce que donne l’usufruit que vous vous réservez, qui vous laisse l’usage du bien et vous en fait percevoir les fruits, dont les loyers (art. 578 et 582 du Code civil). À votre décès, l’usufruit s’éteint sans aucun droit à payer (art. 1133 du CGI).",
  },
  {
    titre: "Donner beaucoup, mais sans donation-partage",
    texte:
      "Une donation simple est rapportée à la succession et réévaluée au jour du partage, d’après l’état du bien au jour de la donation (art. 843 et 860 du Code civil). Le décès ouvre la succession, il ne fige pas cette valeur : entre les deux il peut s’écouler des années, et l’enfant qui a reçu le bien ayant le plus monté doit compenser les autres. Sur des sommes de cet ordre, c’est le procès de famille. La donation-partage, elle, fige la valeur au jour de l’acte pour le calcul des parts (art. 1078 du Code civil) — à trois conditions : que tous les héritiers réservataires vivants ou représentés au décès aient reçu un lot et l’aient expressément accepté ; que chacun reçoive une part décrite dans l’acte ; et que l’acte ne prévoie pas de réserve d’usufruit portant sur une somme d’argent. Un acte qui laisse simplement les enfants en indivision sur un même bien — le bien appartient à tous ensemble, et aucun ne peut décider seul — n’est pas une donation-partage : il est requalifié en donation simple, et l’art. 1078 ne fige plus rien. La Cour de cassation l’a jugé en 2013, et durci en 2025 : un acte qui mêle des lots divis et des quotités indivises est requalifié dans son intégralité (références en bas de feuille).",
  },
];

const QUESTIONS: string[] = [
  "Sur mon patrimoine tel qu’il est aujourd’hui, quelle part reviendrait à chaque enfant, et quelle fraction de cette part tomberait dans la tranche à 20 %, puis à 30 %, puis dans les tranches à 40 % et à 45 % ?",
  "Une donation-partage avec réserve d’usufruit (je garde l’usage et les loyers) est-elle possible sur ces biens précis, à quelle valeur la nue-propriété serait-elle comptée à mon âge, et quel serait le coût complet de l’acte ?",
  "Sur ce bien précis, l’attribution peut-elle être divise — un lot par enfant, au besoin avec une soulte, la somme que celui qui reçoit le bien verse à l’autre pour égaliser les parts ? Si elle ne peut pas, l’acte reste-t-il une donation-partage au sens de l’article 1078 du Code civil ?",
  "Compte tenu des donations que j’ai déjà déclarées et de leurs dates, combien de fois mon abattement de 100 000 € peut-il encore se reconstituer avant mon 85e anniversaire ?",
];

export function PlanPatrimoineImportant() {
  return (
    <Feuille
      titre="Situation 11 — Patrimoine supérieur à 1 million"
      sousTitre="Trois leviers au lieu d'un, et un ordre qui n'est pas celui de tout le monde."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="eviter-coupure space-y-1">
        {RECONNAISSANCE.map((r) => (
          <Case key={r}>{r}</Case>
        ))}
      </ul>
      {/* Trois cases sur quatre ne suffisent pas ici : la 4e n'est pas une nuance,
          c'est l'hypothèse qui porte le chiffrage. Un lecteur marié qui recopie
          196 388 € et 102 746 € au stylo n'a pas le site sous les yeux pour se
          rattraper — la feuille doit donc l'arrêter elle-même. */}
      <p className="text-[0.9rem]">
        La case 4 doit être cochée, sinon arrêtez ici : allez à la situation 2 (ou à la situation 1
        si vous n&apos;avez qu&apos;un enfant), tous les chiffres de cette feuille y changent. Les
        trois autres cochées : ce plan est le vôtre.
      </p>

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      <p>
        L&apos;abattement de 100 000 € par parent et par enfant ne bouge pas quand le patrimoine
        monte (art. 779 du CGI) : à 200 000 € de part il en couvre la moitié, à 600 000 € il en
        couvre un sixième. L&apos;essentiel du reste part dans la tranche à 20 %, qui court
        jusqu&apos;à 552 324 €. Et le barème ne s&apos;arrête pas là : 30 % jusqu&apos;à 902 838 €,
        40 % jusqu&apos;à 1 805 677 €, puis 45 % au-delà (art. 777 du CGI). Au-dessus de deux
        millions, avec un enfant unique, ce sont les deux dernières tranches qui décident de la
        facture.
      </p>
      <p className="text-[0.9rem]">
        Exemple construit sur un donateur seul, sans conjoint survivant, sans passif, à valeurs
        inchangées et si la loi ne change pas. Votre notaire refera le calcul sur votre situation
        réelle.
      </p>
      <div className="eviter-coupure">
        <Encadre titre="EXEMPLE — 1 200 000 € de patrimoine, deux enfants, rien n’a été fait">
          <p className="text-[0.93rem]">
            Chaque enfant reçoit 600&#8239;000&#8239;€, moins 100&#8239;000&#8239;€
            d&apos;abattement : il reste 500&#8239;000&#8239;€ taxables.
          </p>
          <p className="mt-1 text-[0.93rem]">
            8&#8239;072&#8239;€ à 5 % = 403,60&#8239;€ · 4&#8239;037&#8239;€ à 10 % = 403,70&#8239;€
            · 3&#8239;823&#8239;€ à 15 % = 573,45&#8239;€ · 484&#8239;068&#8239;€ à 20 % =
            96&#8239;813,60&#8239;€
          </p>
          <p className="mt-1 text-[0.93rem]">
            <strong>
              = 98&#8239;194&#8239;€ par enfant, soit 196&#8239;388&#8239;€ pour la famille.
            </strong>{" "}
            Vos enfants ont six mois pour les payer, et le bien qui les porte ne se vend pas en six
            mois.
          </p>
          {/* Sans cette phrase, la feuille se fait contredire au premier rendez-vous :
              le crédit de paiement existe précisément pour le cas décrit ici. On le
              nomme, et on dit ce qu'il fait — étaler, jamais réduire. L'argument tient
              toujours, et il devient vérifiable. */}
          <p className="mt-1 text-[0.93rem]">
            Un crédit de paiement fractionné — jusqu&apos;à sept versements sur trois ans quand la
            succession comporte au moins la moitié de biens non liquides — ou différé, pour ce qui
            est recueilli en nue-propriété, existe (art. 396, 397 et 404 A à 404 GD de l&apos;annexe
            III au CGI). Il se demande, il se garantit et il porte intérêts : il étale la facture,
            il ne la réduit pas.
          </p>
        </Encadre>
      </div>
      <Source>
        Abattement : art. 779 du CGI. Barème en ligne directe : art. 777 du CGI. Délai de dépôt de
        la déclaration de succession et de paiement des droits : six mois lorsque le décès survient
        en France métropolitaine, douze mois dans les autres cas (art. 641 du CGI) ; les droits sont
        payés au dépôt de la déclaration (art. 1701 du CGI). Crédit de paiement fractionné ou
        différé : art. 396, 397 et 404 A à 404 GD de l&apos;annexe III au CGI.
      </Source>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      {/* `eviter-coupure` sur chaque puce et non sur la liste entière : la liste
          complète dépasse la demi-page, et la protéger d'un bloc pousserait un
          grand blanc en bas de la page précédente. Le § 1 fait à lui seul une
          douzaine de lignes imprimées — c'est la date la plus importante du plan,
          elle ne peut pas se couper en deux pages. */}
      <ol className="list-decimal space-y-1 pl-5">
        <li className="eviter-coupure">
          <strong>Le compteur des 15 ans</strong> — votre date n° 1, et de loin. C&apos;est le
          principal levier qui se recharge, donc le seul de cette taille qui puisse servir deux fois
          : 200 000 € d&apos;abattement pour deux enfants aujourd&apos;hui, 200 000 € de nouveau
          quinze ans plus tard (art. 779 et 784 du CGI). Attention à la mécanique exacte :{" "}
          <strong>chaque donation a sa propre date d&apos;anniversaire</strong>, et quinze ans après
          elle, l&apos;abattement se reconstitue à hauteur de ce que cette donation-là avait
          consommé. Il n&apos;existe pas un compteur unique que lancerait un premier don symbolique.
          À votre niveau de patrimoine, la ressource rare n&apos;est pas l&apos;argent, c&apos;est
          le temps : la date de la donation qui consommera vos 100 000 € est la décision la plus
          chère de cette feuille.
        </li>
        <li className="eviter-coupure">
          <strong>Le 71e anniversaire</strong> — il passe devant le 70e chez vous, alors que
          c&apos;est l&apos;inverse pour la plupart des familles. Raison : votre masse est
          immobilière. La nue-propriété — la propriété du bien sans le droit de l&apos;occuper ni
          d&apos;en toucher les loyers — est comptée à 60 % de la valeur avant cet anniversaire, à
          70 % après (art. 669 du CGI). Sur 500 000 € de biens, ces dix points font 50 000 € de
          valeur taxable en plus, soit environ 10 000 € de droits dans la tranche à 20 % (art. 777
          du CGI), pour un seul anniversaire laissé passer.
        </li>
        <li className="eviter-coupure">
          <strong>Le 70e anniversaire</strong> — il arrive avant l&apos;autre au calendrier, mais il
          vient en troisième dans vos priorités : non parce qu&apos;il rapporte peu, mais parce
          qu&apos;il est plafonné. 152 500 € par bénéficiaire sur les versements faits avant (art.
          990 I) ; 30 500 € au total, tous contrats et tous bénéficiaires confondus, sur ceux faits
          après (art. 757 B). Ce plafond ne grandit pas avec votre patrimoine.
        </li>
      </ol>
      <p className="text-[0.9rem]">
        Pour un patrimoine de 400 000 €, l&apos;ordre serait inverse : l&apos;assurance-vie et
        l&apos;abattement suffisent à tout absorber, et on ne touche pas à l&apos;immobilier. Chez
        vous, aucun levier ne suffit seul — c&apos;est leur combinaison, et leur ordre, qui font le
        résultat.
      </p>

      <Titre>4. Les 3 pièges de cette situation</Titre>
      <div className="space-y-2">
        {PIEGES.map((p) => (
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
          <li key={q} className="eviter-coupure py-2">
            {/* Le carré de 18 px vient de questions-notaire.tsx : cette feuille se lit
                en face du notaire, et une question posée se coche pendant qu'on parle. */}
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
      <p className="text-[0.95rem]">
        Même famille : 1 200 000 €, deux enfants majeurs, vous avez 68 ans. Le patrimoine se
        répartit en 800 000 € d&apos;immobilier, 250 000 € déjà placés sur vos contrats
        d&apos;assurance-vie et 150 000 € de liquidités.
      </p>
      {/* Le point 3 et le point 6 ne classent pas la même chose, et sans ce raccord
          le lecteur croit lire deux ordres contradictoires. Le point 7 reprend
          ensuite la numérotation des gestes, pour qu'il n'y ait qu'un ordre à
          suivre dans toute la feuille. */}
      <p className="text-[0.95rem]">
        Les trois dates du point 3 sont classées par ce qu&apos;elles rapportent. Les trois gestes
        ci-dessous sont classés par le calendrier : on commence par le plus simple, et c&apos;est le
        geste 3 qui démarre votre date n° 1. Le point 7 reprend les mêmes numéros, dans le même
        ordre.
      </p>
      <p className="text-[0.9rem]">
        Mêmes hypothèses qu&apos;au point 2 : un donateur seul, sans conjoint survivant, sans
        passif, à valeurs inchangées et si la loi ne change pas, hors frais d&apos;acte. En couple,
        doublez les abattements avant de refaire le calcul.
      </p>

      <div className="eviter-coupure">
        <Encadre titre="APRÈS — gestes 1 et 2">
          <p className="text-[0.93rem]">
            <strong>Geste 1 — le don d&apos;argent, sous son propre abattement.</strong>{" "}
            31&#8239;865&#8239;€ à chaque enfant, soit 63&#8239;730&#8239;€. Droits : 0&#8239;€. Cet
            abattement-là est distinct : il ne consomme pas vos 100&#8239;000&#8239;€, et il se
            recharge lui aussi tous les quinze ans, sur son propre plafond (art. 790 G du CGI, à
            condition d&apos;avoir moins de 80 ans le jour du don, que l&apos;enfant soit majeur, et
            que le don soit déclaré dans le mois — formulaire 2735). Puisqu&apos;il ne touche pas à
            l&apos;abattement de l&apos;art. 779,{" "}
            <strong>il ne fait courir aucun délai pour vos 100 000 €</strong> : ce n&apos;est pas
            lui qui démarre le compteur des 15 ans.
          </p>
          <p className="mt-2 text-[0.93rem]">
            <strong>
              Geste 2 — vos contrats existants : vérifier la date des versements et la clause
              bénéficiaire, avant le 70e anniversaire.
            </strong>{" "}
            Les 250&#8239;000&#8239;€ déjà versés sur vos contrats avant vos 70 ans, avec une clause
            désignant vos deux enfants, relèvent de l&apos;abattement de 152&#8239;500&#8239;€ par
            bénéficiaire (art. 990 I du CGI) — soit 305&#8239;000&#8239;€ de franchise pour vos deux
            enfants, le plafond exposé au piège n° 1. Attention à ce qui se compare à ce plafond :
            c&apos;est le capital versé aux bénéficiaires au jour du décès — primes ET intérêts — et
            non ce que vous avez versé. Vérifiez donc la valeur actuelle de vos contrats, pas
            seulement le total de vos versements. Ce capital ne fait pas partie de la succession
            (art. L. 132-12 du Code des assurances) — sauf primes manifestement exagérées au regard
            de vos facultés, qui redeviennent rapportables (art. L. 132-13 du même code) —, et le
            prélèvement de l&apos;art. 990 I n&apos;est pas un droit de succession : il ne figure
            pas dans les totaux ci-dessous.
          </p>
        </Encadre>
      </div>

      <div className="eviter-coupure">
        <Encadre titre="APRÈS — geste 3, la donation-partage">
          <p className="text-[0.93rem]">
            <strong>Geste 3 — la donation-partage de la nue-propriété, avant le 71e.</strong> Vous
            donnez la nue-propriété d&apos;un bien valant 500&#8239;000&#8239;€ et vous en gardez
            l&apos;usage et les loyers. À 68 ans, elle est comptée à 60 %, soit
            300&#8239;000&#8239;€, donc 150&#8239;000&#8239;€ par enfant ; moins l&apos;abattement
            de 100&#8239;000&#8239;€, il reste 50&#8239;000&#8239;€ taxables par enfant.
            403,60&#8239;€ + 403,70&#8239;€ + 573,45&#8239;€ + (34&#8239;068&#8239;€ à 20 % =
            6&#8239;813,60&#8239;€) ={" "}
            <strong>
              8&#8239;194&#8239;€ par enfant, soit 16&#8239;388&#8239;€ de droits payés
              aujourd&apos;hui
            </strong>{" "}
            (art. 669, 779 et 777 du CGI). À votre décès, l&apos;usufruit s&apos;éteint et les
            enfants deviennent pleins propriétaires sans rien payer de plus (art. 1133 du CGI).
          </p>
          <p className="mt-2 text-[0.93rem]">
            <strong>Le point à régler avec le notaire avant de signer.</strong> Ici, un seul bien
            est donné à deux enfants : s&apos;ils sont laissés en indivision sur la nue-propriété,
            l&apos;acte n&apos;est plus une donation-partage mais une donation simple, et les
            valeurs ne sont plus figées au jour de l&apos;acte (art. 1078 du Code civil). La Cour de
            cassation l&apos;a jugé en 2013, et durci sa position en 2025 : un acte qui mêle des
            lots divis et des quotités indivises est requalifié dans son intégralité (références en
            bas de feuille). Le piège n° 3 vous retombe alors dessus. Demandez donc si
            l&apos;attribution peut être <strong>divise</strong> — un lot par enfant, au besoin avec
            une soulte — ou si la donation-partage doit porter sur deux biens plutôt que sur un. Le
            chiffrage fiscal ci-dessus ne change pas ; ce qui change, c&apos;est la paix de famille
            dans quinze ans.
          </p>
        </Encadre>
      </div>

      <div className="eviter-coupure">
        <Encadre titre="APRÈS — ce que la succession coûte alors">
          <p className="text-[0.93rem]">
            <strong>Reste dans la succession :</strong> 1&#8239;200&#8239;000 − 63&#8239;730 −
            250&#8239;000 − 500&#8239;000 = 386&#8239;270&#8239;€, soit 193&#8239;135&#8239;€ par
            enfant.
          </p>
          <p className="mt-2 text-[0.93rem]">
            L&apos;abattement a été entièrement consommé par la donation-partage. Tant que les
            quinze ans ne sont pas écoulés, cette donation est rappelée : on ajoute sa valeur à la
            succession, et les biens déjà donnés sont réputés occuper les tranches les plus basses
            du barème (art. 784 du CGI). Les tranches à 5 %, 10 % et 15 % ayant déjà servi le jour
            de la donation, elles ne servent pas deux fois : la part successorale reste entièrement
            dans la tranche à 20 %.
          </p>
          <p className="mt-1 text-[0.93rem]">
            193&#8239;135&#8239;€ × 20 % ={" "}
            <strong>
              38&#8239;627&#8239;€ par enfant, soit 77&#8239;254&#8239;€ pour la famille
            </strong>
            , plus les 16&#8239;388&#8239;€ déjà payés ={" "}
            <strong>93&#8239;642&#8239;€ au total.</strong>
          </p>
          <p className="mt-2 text-[0.95rem]">
            <strong>
              196&#8239;388&#8239;€ − 93&#8239;642&#8239;€ = 102&#8239;746&#8239;€ qui restent dans
              la famille.
            </strong>{" "}
            Et quinze ans après la donation-partage, celle-ci sort entièrement du rappel :
            l&apos;abattement redevient entier et les tranches basses redeviennent disponibles. La
            facture tombe alors à 50&#8239;030&#8239;€ et l&apos;écart passe à 146&#8239;358&#8239;€
            — sans compter la seconde donation que ce rechargement rend possible.
          </p>
        </Encadre>
      </div>
      <Source>
        Art. 777, 779, 784, 790 G, 669, 990 I, 757 B et 1133 du CGI ; art. 396, 397 et 404 A à 404
        GD de l&apos;annexe III au CGI. Code civil : rapport des donations à la succession, art. 843
        ; valeur retenue au jour du partage, d&apos;après l&apos;état du bien au jour de la
        donation, art. 860 ; donation-partage et gel des valeurs, art. 1078 ; contenu de
        l&apos;usufruit — usage du bien et perception des fruits, dont les loyers —, art. 578 et 582
        ; irrévocabilité de la donation, art. 894, et ses exceptions, art. 953 à 958. Code des
        assurances : art. L. 132-12, et primes manifestement exagérées, art. L. 132-13. Cour de
        cassation, 1re chambre civile, 20 novembre 2013, n° 12-25.681 — un acte qui laisse les
        gratifiés en indivision n&apos;est pas une donation-partage ; 2 juillet 2025, n° 23-16.329 —
        un acte mêlant lots divis et quotités indivises est requalifié dans son intégralité.
        Chiffres arrondis à l&apos;euro. Les émoluments du notaire ne sont pas comptés ici : leur
        barème est réglementé et révisé par arrêté — demandez-lui le coût complet de l&apos;acte, et
        sur quelle valeur il est calculé.
      </Source>

      <div className="eviter-coupure">
        <Encadre titre="LE MOMENT OÙ VOUS NE DEVEZ PLUS DÉCIDER SEUL">
          <p className="text-[0.93rem]">
            Votre notaire rédige et sécurise les actes ; il ne pilote pas l&apos;ordre des
            opérations sur quinze ans. Au-dessus du million, faites-vous accompagner en plus par un
            professionnel du patrimoine dès qu&apos;un de ces trois signaux est allumé : plus de la
            moitié de votre patrimoine tient dans un seul bien qui ne se partage pas ; des biens
            sont détenus par une société, ou un héritier réside à l&apos;étranger ; ce que vous
            voulez transmettre à quelqu&apos;un ne correspond pas à ce que la loi lui réserve. Une
            erreur d&apos;ordre à ce niveau se compte en dizaines de milliers d&apos;euros, et elle
            ne se rattrape pas : une donation est en principe irrévocable (art. 894 du Code civil) —
            elle ne se défait que dans les cas étroits prévus par la loi, inexécution des charges ou
            ingratitude (art. 953 à 958 du Code civil). Autrement dit : ne comptez pas dessus.
          </p>
          <p className="mt-2 text-[0.93rem]">
            Cette feuille ne vous dit pas quoi acheter, ni chez qui. Elle vous dit à partir de quel
            moment décider seul coûte plus cher que se faire aider.
          </p>
        </Encadre>
      </div>

      <Titre>7. Ma décision</Titre>
      {/* Une case par geste du point 6, dans le même ordre et avec le même numéro :
          trois cases pour trois gestes. L'ancienne version en avait trois pour deux
          — les deux premières décrivaient la même donation-partage — et le don de
          somme d'argent, le seul geste immédiat, n'avait aucune case alors que
          l'exemple chiffré retire ses 63 730 € de la succession. */}
      <ul className="eviter-coupure space-y-1">
        <Case>
          <strong>Geste 1</strong> — je fais le don de somme d&apos;argent, 31 865 € par enfant, et
          je le fais déclarer dans le mois (formulaire 2735).
        </Case>
        <Case>
          <strong>Geste 2</strong> — je vérifie mes clauses bénéficiaires, la date des versements et
          la valeur actuelle de mes contrats.
        </Case>
        <Case>
          <strong>Geste 3</strong> — je fais chiffrer la donation-partage de la nue-propriété avant
          mon 71e anniversaire, en demandant si l&apos;attribution peut être divise — un lot par
          enfant —, et j&apos;en fixe la date : c&apos;est d&apos;elle que partent mes 15 ans.
        </Case>
      </ul>
      {/* Les trois chiffres du plan. La 1re case du point 1 demande au lecteur
          d'additionner ses biens, ses placements et ses contrats : sans ligne pour
          poser le total, il n'a nulle part où l'écrire. Et le Plan en une page
          attend de lui les deux suivants — le point 2 fabrique l'un, le point 6
          l'autre. Modèle : plan-veuf-veuve. */}
      <div className="eviter-coupure grid gap-3">
        <Champ label="Mon patrimoine estimé" indice="biens, placements et contrats additionnés" />
        <Champ
          label="Ce que mes enfants paieraient aujourd’hui"
          indice="le calcul du point 2, avec mes chiffres"
        />
        <Champ label="Ce qu’ils paieraient après ce plan" indice="le calcul du point 6" />
      </div>
      {/* « Démembrer » n'est jamais expliqué dans cette feuille : on reprend donc les
          mots du point 6, que le lecteur vient de lire, comme dans plan-veuf-veuve.
          La valeur des contrats a sa ligne parce que le geste 2 la réclame deux fois :
          c'est elle qui se compare aux 152 500 €, pas le total des versements. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Le bien dont je compte donner la nue-propriété en premier"
          indice="en gardant l’usage et les loyers — et sa valeur estimée"
        />
        <Champ
          label="Valeur actuelle de mes contrats, au"
          indice="ce qui compte face aux 152 500 € — pas le total de mes versements"
        />
      </div>
      {/* Sans ces lignes, la case du geste 3 n'a nulle part où atterrir : la feuille
          dit que cette date est la décision la plus chère du document. Groupées à
          part des précédentes — un `eviter-coupure` de plus d'une demi-page ne
          protège plus rien, il pousse un blanc en bas de la page d'avant. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="La donation qui consommera mon abattement, prévue le"
          indice="c’est de cette date-là que partent mes 15 ans — art. 784 du CGI"
        />
        <Champ label="Mon abattement redevient donc entier le" indice="cette date + 15 ans" />
        <Champ label="Mon 70e anniversaire tombe le" indice="il commande le geste 2" />
        <Champ
          label="Mon 71e anniversaire tombe le"
          indice="il commande le geste 3 — après, la nue-propriété passe de 60 % à 70 %"
        />
        <Champ label="Décidé le" indice="et prochain point dans un an" />
      </div>

      <p className="text-[0.9rem]">
        Ce plan est un plan de travail, pas un acte. Aucune de ces opérations n&apos;existe tant
        qu&apos;elle n&apos;est pas passée devant notaire : à faire relire par votre notaire avant
        toute signature.
      </p>
    </Feuille>
  );
}
