import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * SITUATION 8 — AVEC DE L'IMMOBILIER LOCATIF. Plan-type de l'étape « Le Plan familial ».
 *
 * ⚠️ Le locatif est le seul patrimoine qui rapporte de l'argent tous les mois
 * et qui, en même temps, ne peut pas être vendu en six mois. C'est de là que
 * vient la douleur réelle : les droits sont exigibles au dépôt de la
 * déclaration (art. 641 et 1701 du CGI) et l'immeuble, lui, met un an à
 * trouver preneur. Le plan sert à faire descendre la facture AVANT, pas à
 * organiser la vente APRÈS.
 *
 * ⚠️ Pourquoi le 71e anniversaire passe ICI en premier, devant le compteur des
 * 15 ans : dans cette situation, la donation ne peut pas être une donation en
 * pleine propriété — le lecteur vit de ses loyers et ne les lâchera pas. Le
 * seul montage qui donne la valeur sans donner les revenus est le
 * démembrement, et son prix est fixé par l'art. 669 du CGI, qui bascule de
 * 60 % à 70 % au 71e anniversaire. Cette date-là a un prix comptant et ne se
 * rattrape jamais. L'ordre des trois dates change avec le patrimoine : c'est
 * précisément ce que le lecteur achète.
 *
 * ⚠️ Pourquoi on écrit « la VEILLE du 71e anniversaire » et jamais « après » :
 * l'art. 669 raisonne en années RÉVOLUES. « Moins de 71 ans révolus » vaut
 * 60 % ; le jour même de l'anniversaire, l'usufruitier a 71 ans révolus et il
 * est déjà taxé à 70 %. Sur l'exemple de cette feuille, ce jour-là coûte
 * 8 000 €. À côté d'un champ « Mon 71e anniversaire tombe le », l'imprécision
 * d'un jour n'est pas une nuance de juriste : c'est le résultat du plan.
 *
 * ⚠️ La société civile est définie AVANT d'être discutée (point 4), et ses
 * pièges viennent seulement après : un lecteur de 78 ans ne peut pas se méfier
 * d'un outil qu'on ne lui a pas encore présenté. Le marché la vend comme une
 * solution fiscale ; elle n'en est pas une en elle-même — c'est la DONATION qui
 * fait baisser l'impôt, jamais la société. C'est pour cela que le calcul du
 * point 7 porte sur la donation de nue-propriété des murs, sans société : le
 * chiffre est exactement le même, et la feuille ne doit pas faire acheter une
 * structure pour obtenir un résultat qui ne vient pas d'elle.
 *
 * ⚠️ Aucun assureur, aucune banque, aucun produit n'est nommé, et aucune
 * épargne n'est orientée (contrainte CIF) : on décrit la règle des 70 ans, on
 * ne suggère jamais de vendre un bien pour loger le produit ailleurs — le
 * point 3 le dit d'ailleurs en toutes lettres. Aucun émolument n'est chiffré :
 * le barème du notaire est réglementé et révisé par arrêté — on fait poser la
 * question.
 *
 * ⚠️ ARRONDIS — ne jamais réécrire « arrondis tranche par tranche ». C'est faux
 * et vérifiable à la calculette : arrondir vraiment chaque tranche donne
 * 404 + 404 + 573 + 16 814 = 18 195 €, pas 18 194 €. Ce qui est imprimé, et ce
 * que la feuille annonce, c'est l'inverse : chaque tranche est calculée au
 * centime, et c'est le TOTAL PAR ENFANT qui est arrondi à l'euro le plus proche
 * (art. 1724 du CGI) — 18 194,35 → 18 194. Le total famille est ensuite la
 * somme des deux montants déjà arrondis (18 194 × 2 = 36 388, et non 36 389),
 * parce que les droits s'établissent héritier par héritier. Le lecteur refait
 * l'addition : un euro d'écart lui fait perdre confiance dans tout le reste.
 */

/**
 * Une ligne de calcul : le libellé à gauche, le montant à droite.
 *
 * ⚠️ Une tranche PAR LIGNE, jamais quatre tranches enfilées dans une phrase.
 * Gabarit repris de plan-entreprise.tsx : à l'impression, le lecteur coche au
 * stylo la ligne qu'il est en train de vérifier, et aucun calcul ne se coupe au
 * milieu d'une ligne de texte.
 */
type LigneCalcul = { ligne: string; montant: string };

const CALCUL_AVANT: LigneCalcul[] = [
  { ligne: "400 000 € ÷ 2 enfants", montant: "200 000 € chacun" },
  { ligne: "− abattement de 100 000 € (art. 779)", montant: "100 000 € taxables" },
  { ligne: "Tranche à 5 % — jusqu’à 8 072 €", montant: "403,60 €" },
  { ligne: "Tranche à 10 % — jusqu’à 12 109 €", montant: "403,70 €" },
  { ligne: "Tranche à 15 % — jusqu’à 15 932 €", montant: "573,45 €" },
  { ligne: "Tranche à 20 % — sur les 84 068 € restants", montant: "16 813,60 €" },
  { ligne: "TOTAL par enfant", montant: "18 194 €" },
  { ligne: "TOTAL pour la famille", montant: "36 388 €" },
];

const CALCUL_A_68_ANS: LigneCalcul[] = [
  { ligne: "400 000 € × 60 % (art. 669, avant 71 ans révolus)", montant: "240 000 €" },
  { ligne: "÷ 2 enfants", montant: "120 000 € chacun" },
  { ligne: "− abattement de 100 000 € (art. 779)", montant: "20 000 € taxables" },
  { ligne: "Tranche à 5 % — jusqu’à 8 072 €", montant: "403,60 €" },
  { ligne: "Tranche à 10 % — jusqu’à 12 109 €", montant: "403,70 €" },
  { ligne: "Tranche à 15 % — jusqu’à 15 932 €", montant: "573,45 €" },
  { ligne: "Tranche à 20 % — sur les 4 068 € restants", montant: "813,60 €" },
  { ligne: "TOTAL par enfant, payé le jour de la donation", montant: "2 194 €" },
  { ligne: "TOTAL pour la famille", montant: "4 388 €" },
];

/**
 * Le même calcul, un anniversaire plus tard. Il a son propre encadré et non une
 * phrase de conclusion : quatre montants enchaînés en prose, à comparer de tête
 * avec un encadré situé au-dessus, ne se suivent pas à 78 ans avec une
 * calculette. Trois encadrés, trois totaux, une seule soustraction à faire.
 */
const CALCUL_A_71_ANS: LigneCalcul[] = [
  { ligne: "400 000 € × 70 % (art. 669, à partir de 71 ans révolus)", montant: "280 000 €" },
  { ligne: "÷ 2 enfants", montant: "140 000 € chacun" },
  { ligne: "− abattement de 100 000 € (art. 779)", montant: "40 000 € taxables" },
  { ligne: "Tranche à 5 % — jusqu’à 8 072 €", montant: "403,60 €" },
  { ligne: "Tranche à 10 % — jusqu’à 12 109 €", montant: "403,70 €" },
  { ligne: "Tranche à 15 % — jusqu’à 15 932 €", montant: "573,45 €" },
  { ligne: "Tranche à 20 % — sur les 24 068 € restants", montant: "4 813,60 €" },
  { ligne: "TOTAL par enfant", montant: "6 194 €" },
  { ligne: "TOTAL pour la famille", montant: "12 388 €" },
];

/**
 * Les pièges sont écrits en PARAGRAPHES et non en un seul bloc : le piège 1
 * porte deux idées distinctes (vendre à sa société / lui apporter le bien), et
 * un lecteur de 78 ans ne retient pas deux idées dans un pavé de dix lignes. La
 * consigne n'est écrite qu'une fois, à la fin.
 */
const PIEGES: { titre: string; paragraphes: string[] }[] = [
  {
    titre: "Piège 1 — faire entrer dans la société un bien que vous possédez déjà",
    paragraphes: [
      // ⚠️ Ne jamais réécrire « créer la société puis lui faire acheter le bien
      // coûte moins cher » en tête de ce piège : le lecteur de cette feuille
      // POSSÈDE DÉJÀ ses murs (point 1). Lui faire racheter le bien par sa
      // propre société, c'est une vente à soi-même — l'option la PLUS chère des
      // deux dans son cas.
      "Vous détenez déjà vos murs. Les LUI VENDRE est l’option la plus chère : c’est une vente comme une autre, avec des droits de mutation à titre onéreux — la taxe due quand un bien change de mains contre de l’argent — calculés sur le prix (art. 683 bis et 1594 D du CGI), une plus-value éventuelle (art. 150 U du CGI), et le prix lui-même à sortir de la trésorerie de la société. Si le bien n’était pas encore acheté, créer la société d’abord et lui faire faire l’achat éviterait tout ce sujet ; ce n’est pas votre cas.",
      // ⚠️ art. 810, I et NON 810 bis. Depuis le 01/01/2019 (loi n° 2018-1317,
      // art. 26), l'art. 810 bis ne porte plus l'exonération : c'est l'art. 810,
      // I qui dit « Les apports sont enregistrés gratuitement ». Un notaire qui
      // ouvre 810 bis n'y trouve pas la règle annoncée, et la feuille perd sa
      // crédibilité sur le seul point qui compte dans ce piège.
      "Reste l’apport : vous remettez l’immeuble à la société et vous recevez des parts en échange. L’apport pur et simple — sans autre contrepartie — à la constitution d’une société civile est enregistré gratuitement (art. 810, I du CGI) ; la publicité foncière et les émoluments du notaire, eux, restent dus. Deux cas le renchérissent : la société reprend un prêt, l’apport est alors à titre onéreux et supporte les mêmes droits de mutation (art. 683 bis et 1594 D du CGI) ; ou la société est soumise à l’impôt sur les sociétés (art. 809, I, 3° du CGI). L’apport peut en outre faire naître une plus-value imposable — l’impôt sur le gain pris par le bien depuis son achat (art. 150 U du CGI). Un apport peut coûter plus cher que l’impôt qu’il devait éviter : faites chiffrer les deux voies AVANT de signer les statuts.",
    ],
  },
  {
    titre: "Piège 2 — croire que la société fait baisser l’impôt à elle seule",
    paragraphes: [
      // ⚠️ art. 758 et non 761 : l'art. 761 ne vise que les immeubles. Des parts
      // de société civile sont des biens meubles, portées à la succession par la
      // déclaration détaillée et estimative des parties (art. 758).
      "Elle ne le fait pas. Une société dont vous détenez encore 100 % des parts se transmet au même barème que l’immeuble (art. 777 du CGI), sur une valeur de parts assise sur celle de l’immeuble : ce sont vos parts qui sont déclarées et estimées, pas les murs (art. 758 du CGI), et la décote éventuelle est une question pour votre notaire. Ce qui fait tomber la facture, c’est la donation — celle des parts, ou celle de la nue-propriété des murs eux-mêmes. Jamais la société.",
    ],
  },
  {
    titre: "Piège 3 — oublier qui paie les travaux une fois la nue-propriété donnée",
    paragraphes: [
      // ⚠️ Ce sont les art. 582 (droit aux fruits) ET 584, al. 2 (les loyers sont
      // des fruits civils) qui portent la phrase, pas l'art. 578 qui définit
      // seulement l'usufruit. Et l'art. 605 a une exception : sans elle, la
      // feuille promet aux enfants une charge qui peut retomber sur le parent.
      "Vous gardez l’usufruit : vous encaissez les loyers, qui vous reviennent comme fruits civils — la loi les traite comme le revenu du bien, et ce revenu est à vous (art. 582 et 584, al. 2 du Code civil). Ce sont eux que vous déclarez en revenus fonciers (art. 14 du CGI). Mais la loi partage la charge : l’entretien courant reste à vous, les grosses réparations (murs, toiture, poutres) reviennent au nu-propriétaire (art. 605 et 606 du Code civil) — sauf si elles viennent d’un entretien que vous n’avez pas fait depuis le début de l’usufruit, auquel cas elles retombent sur vous (art. 605). Vos enfants doivent l’avoir entendu de votre bouche, pas le découvrir devant un devis de toiture.",
    ],
  },
];

const QUESTIONS: string[] = [
  "Dans mon cas précis, est-il moins cher de donner directement la nue-propriété de mes biens locatifs, ou de passer par une société civile ? Chiffrez-moi les deux, frais et droits compris.",
  "Si je fais entrer mon immeuble dans cette société, cet apport déclenche-t-il une plus-value imposable et des droits de mutation — oui ou non, et pour quel montant ?",
  "Les statuts que vous rédigez me laissent-ils la gérance et le pouvoir de décider seul d’une vente ou de travaux, tant que je suis vivant — oui ou non ?",
];

export function PlanImmobilierLocatif() {
  return (
    <Feuille
      titre="Situation 8 — Avec de l’immobilier locatif"
      sousTitre="Plan-type. Remplissez les lignes au stylo, emportez la feuille chez le notaire."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      {/* Section d'auto-diagnostic : le lecteur doit pouvoir se reconnaître au
          stylo, pas seulement lire. D'où les cases, comme chez les autres plans. */}
      <ul className="space-y-1">
        <Case>
          Vous possédez au moins un logement, un local ou un terrain qui n&apos;est pas votre
          résidence principale et qui vous rapporte un loyer.
        </Case>
        <Case>
          Vous comptez sur ces loyers : ils complètent votre retraite, et vous ne les lâcherez pas
          de votre vivant.
        </Case>
        <Case>
          Vos enfants n&apos;auraient pas de quoi payer les droits sans vendre le bien — et ils ne
          le vendraient pas au bon prix, parce qu&apos;ils seraient pressés.
        </Case>
      </ul>
      <p className="text-[0.93rem]">Les trois cases cochées : ce plan est le vôtre.</p>

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      {/* ⚠️ Ne pas réintroduire « valeur vénale réelle » : le mot n'est nulle part
          ailleurs dans le classeur et ne figure pas dans les 18 mots du lexique.
          Ne pas réintroduire non plus « sans aucun abattement propre » : à 78 ans,
          la phrase se lit « mon locatif n'a droit à aucun abattement », et le
          point 7 lui applique 100 000 € cinq pages plus loin. */}
      <p>
        Le bien locatif est compté pour le prix auquel il se vendrait au jour du décès (art. 761 du
        CGI). Il ne bénéficie d&apos;aucune réduction qui lui soit propre : l&apos;abattement de 20
        % réservé au logement de famille ne s&apos;applique qu&apos;à votre résidence principale, et
        seulement si votre conjoint survivant, votre partenaire de PACS, ou un enfant mineur ou
        majeur protégé l&apos;habite (art. 764 bis du CGI). Vos 100 000 € par enfant, eux,
        s&apos;appliquent normalement (art. 779 du CGI). Sur 400 000 € de locatif, deux enfants,
        aucun conjoint survivant et aucune donation dans les 15 ans, la facture est de{" "}
        <strong>36 388 €</strong> — et elle est exigible au dépôt de la déclaration (art. 1701 du
        CGI), dans les six mois du décès survenu en France métropolitaine, un an dans tous les
        autres cas (art. 641 du CGI). Tout autre bien dans la succession fait monter ce chiffre,
        parce qu&apos;il consomme le même abattement. Et un appartement ne se vend pas en six mois.
        Un étalement du paiement peut être demandé (art. 1717 du CGI) : il n&apos;est pas de droit,
        l&apos;administration l&apos;accorde contre des garanties, et il coûte des intérêts.
      </p>
      <Source>
        Articles 641, 761, 764 bis, 1701 et 1717 du Code général des impôts. Barème en ligne directe
        : art. 777 du CGI. Abattement de 100 000 € : art. 779 du CGI.
      </Source>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      <ol className="list-decimal space-y-1 pl-5">
        <li>
          <strong>Le 71e anniversaire — en premier ici.</strong> Vous ne donnerez pas les murs :
          vous donnerez la nue-propriété — la propriété sans le droit d&apos;habiter ni de louer —
          et vous garderez l&apos;usufruit, c&apos;est-à-dire le droit de garder l&apos;usage du
          bien et d&apos;encaisser les loyers jusqu&apos;à la fin de votre vie. Or la nue-propriété
          est comptée à 60 % de la valeur tant que vous n&apos;avez pas 71 ans révolus, et à 70 %
          ensuite (art. 669 du CGI). La dernière signature au tarif de 60 % est donc celle de la{" "}
          <strong>veille</strong> de votre 71e anniversaire, pas celle du jour même. Trois ans de
          retard sur un patrimoine locatif se chiffrent en milliers d&apos;euros, et rien ne les
          rattrape.
        </li>
        <li>
          <strong>Le compteur des 15 ans — ensuite.</strong> Un patrimoine locatif dépasse presque
          toujours 100 000 € par enfant. L&apos;abattement se reconstitue tous les 15 ans (art. 779
          et 784 du CGI) : il faut donc deux vagues, et la première doit partir maintenant pour que
          la seconde ait lieu.
        </li>
        {/* ⚠️ CIF : cette date ne doit JAMAIS se lire comme une invitation à vendre
            un bien pour verser sur un contrat avant l'anniversaire. La dernière
            phrase ferme la porte explicitement — ne pas la retirer. */}
        <li>
          <strong>Le 70e anniversaire — en dernier ici.</strong> Vos murs, détenus en direct, ne se
          logent pas dans un contrat d&apos;assurance-vie. Si vous détenez déjà un contrat, la règle
          des 70 ans s&apos;applique aux primes que vous y versez : avant, 152 500 € par
          bénéficiaire (art. 990 I du CGI) ; après, 30 500 € au total, tous contrats et tous
          bénéficiaires confondus (art. 757 B du CGI). Cette date ne concerne que les contrats que
          vous détenez déjà et les versements que vous y feriez : elle ne commande de vendre aucun
          bien. Faites vérifier par votre notaire ce qu&apos;elle change chez vous.
        </li>
      </ol>
      {/* Les deux dates que le lecteur doit REPARTIR avec, écrites de sa main. Sans
          la seconde ligne, la « première vague » du point 2 ci-dessus n'a aucune
          date de départ, et le compteur des 15 ans ne part de rien. */}
      <Champ
        label="Mon 71e anniversaire tombe le"
        indice="la signature doit être antérieure à cette date, pas le jour même"
      />
      <Champ
        label="Date de mon premier don déclaré"
        indice="le compteur des 15 ans part de ce jour-là"
      />

      <Titre>4. La société civile, en clair</Titre>
      <p>
        Une société civile, ici, est une société qui ne fait rien d&apos;autre que détenir vos murs
        : elle devient propriétaire des biens, et c&apos;est vous qui détenez les parts de cette
        société. Elle apparaît dans votre situation pour une seule raison : un mur ne se découpe pas
        en tranches de 100 000 €, des parts oui. Vous en donnez la valeur d&apos;un abattement, puis
        d&apos;un autre quinze ans plus tard, sans jamais vendre ni diviser l&apos;immeuble. Voilà
        ce qu&apos;elle est. Voici maintenant ce qu&apos;elle n&apos;est pas.
      </p>

      <div className="eviter-coupure">
        <Encadre titre="CE QU’ELLE NE RÉSOUT PAS, ET QU’ON LUI PRÊTE À TORT">
          <ul className="list-disc space-y-1 pl-5 text-[0.93rem]">
            <li>
              Elle ne supprime pas l&apos;impôt sur vos loyers : tant qu&apos;elle n&apos;est pas
              soumise à l&apos;impôt sur les sociétés, ses revenus restent imposés entre vos mains,
              chaque année, à proportion de vos parts (art. 8 du CGI).
            </li>
            <li>
              Elle ne vous permet pas de déshériter : la part réservée à chaque enfant reste due
              (art. 912 et 913 du Code civil), et les donations sont rapportées à la succession pour
              le partage (art. 843 du Code civil). Fiscalement, les donations de moins de 15 ans se
              recomptent (art. 784 du CGI) ; au-delà, non.
            </li>
            {/* Trois obligations annoncées, trois fondements écrits : la feuille en
                porte partout ailleurs, et c'est cette puce qu'un enfant relira pour
                savoir ce que la société coûte en temps chaque année. */}
            <li>
              Elle n&apos;est pas un classeur qu&apos;on range : c&apos;est une société. Le gérant
              rend compte de sa gestion au moins une fois par an, par un rapport écrit (art. 1855 et
              1856 du Code civil), et la société dépose chaque année sa déclaration de résultats —
              l&apos;imprimé n° 2072 tant qu&apos;elle n&apos;est pas à l&apos;impôt sur les
              sociétés (art. 172 bis du CGI). Une société qui ne vit pas est une société qu&apos;on
              vous reprochera.
            </li>
            <li>
              Elle n&apos;est pas l&apos;outil si vous louez en meublé : la location meublée est une
              activité commerciale (art. 35, I, 5° bis du CGI), et elle peut faire basculer la
              société civile à l&apos;impôt sur les sociétés (art. 206, 2 du CGI), aux conséquences
              lourdes et difficiles à défaire — sauf si cette location reste accessoire, ce que
              l&apos;administration admet dans certaines limites. Posez la question avant, pas
              après.
            </li>
          </ul>
        </Encadre>
      </div>

      <p className="text-[0.93rem]">
        Ce qu&apos;elle fait vraiment, et qu&apos;aucun autre outil ne fait : elle transforme un mur
        indivisible en parts que l&apos;on donne par tranches, pile à hauteur de l&apos;abattement ;
        et ses statuts vous laissent la gérance, donc la main sur les décisions, après avoir donné
        la valeur (art. 1846 et suivants du Code civil).
      </p>
      <Source>
        Articles 8, 35 I 5° bis, 172 bis, 206, 2 et 784 du Code général des impôts. Articles 843,
        912, 913, 1846 et suivants, 1855 et 1856 du Code civil.
      </Source>

      <Titre>5. Les 3 pièges de cette situation</Titre>
      <div className="space-y-2">
        {PIEGES.map((p) => (
          // `eviter-coupure` : un piège coupé en deux feuilles perd sa conclusion,
          // qui est justement la consigne. Voir globals.css, bloc @media print.
          <div key={p.titre} className="eviter-coupure">
            <Encadre titre={p.titre}>
              <div className="space-y-2">
                {p.paragraphes.map((texte) => (
                  <p key={texte} className="text-[0.93rem]">
                    {texte}
                  </p>
                ))}
              </div>
            </Encadre>
          </div>
        ))}
      </div>

      <Titre>6. Les 3 questions à poser à votre notaire</Titre>
      <ol className="divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          /* `eviter-coupure` est posé sur chaque question, pas sur la liste :
             une question coupée de sa ligne d'écriture est inutilisable au
             rendez-vous, mais protéger le bloc entier renverrait les trois
             questions en bloc sur la feuille suivante, en laissant un blanc. */
          <li key={q} className="eviter-coupure py-2">
            {/* Le carré de 18 px vient de questions-notaire.tsx : c'est la feuille
                qu'on emporte au rendez-vous, et on coche pendant qu'on parle. */}
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
      <p className="text-[0.93rem]">
        Deux enfants, aucun conjoint survivant, aucune donation dans les 15 ans. 400 000 € de biens
        locatifs, et rien d&apos;autre dans la succession. Vous avez 68 ans et vous voulez continuer
        à toucher les loyers. Chaque tranche est calculée au centime ; c&apos;est le total par
        enfant qui est arrondi à l&apos;euro le plus proche, comme le veut l&apos;art. 1724 du CGI,
        et le total famille est la somme des deux montants arrondis. Vous pouvez refaire
        l&apos;addition.
      </p>

      <div className="eviter-coupure">
        <Encadre titre="AVANT — vous ne faites rien, la succession s’ouvre">
          <ul className="space-y-1 text-[0.93rem]">
            {CALCUL_AVANT.map((l) => (
              <li key={l.ligne} className="flex flex-wrap justify-between gap-x-4">
                <span>{l.ligne}</span>
                <span className="font-bold">{l.montant}</span>
              </li>
            ))}
          </ul>
        </Encadre>
      </div>

      <div className="eviter-coupure">
        <Encadre titre="APRÈS — vous donnez la nue-propriété à 68 ans, vous gardez les loyers">
          <ul className="space-y-1 text-[0.93rem]">
            {CALCUL_A_68_ANS.map((l) => (
              <li key={l.ligne} className="flex flex-wrap justify-between gap-x-4">
                <span>{l.ligne}</span>
                <span className="font-bold">{l.montant}</span>
              </li>
            ))}
          </ul>
          {/* ⚠️ L'art. 751 pose une présomption SIMPLE, et son dernier alinéa impute
              les droits déjà payés. L'écrire comme un couperet automatique, c'est
              faire paniquer une famille qui a signé quatre-vingts jours avant. La
              consigne pratique, elle, ne change pas : signer bien plus tôt. */}
          <p className="mt-2 text-[0.93rem]">
            À votre décès, l&apos;usufruit s&apos;éteint et rien de plus n&apos;est dû sur ce bien
            (art. 1133 du CGI) — <strong>à condition</strong> que la donation ait été passée devant
            notaire plus de trois mois avant le décès. Sinon, l&apos;administration peut réintégrer
            le bien en pleine propriété dans la succession : c&apos;est une présomption, qui se
            combat par la preuve contraire, et les droits déjà payés sur la donation viennent alors
            en déduction (art. 751 du CGI). Raison de plus pour signer sans attendre.
          </p>
        </Encadre>
      </div>

      <div className="eviter-coupure">
        <Encadre titre="SI VOUS ATTENDEZ VOTRE 71e ANNIVERSAIRE — même bien, même famille">
          <ul className="space-y-1 text-[0.93rem]">
            {CALCUL_A_71_ANS.map((l) => (
              <li key={l.ligne} className="flex flex-wrap justify-between gap-x-4">
                <span>{l.ligne}</span>
                <span className="font-bold">{l.montant}</span>
              </li>
            ))}
          </ul>
        </Encadre>
      </div>

      {/* Sans cette phrase, le lecteur attribue les 32 000 € à la société civile —
          exactement ce que le piège 2 vient de démentir. Le chiffre vient de
          l'art. 669, pas des statuts. */}
      <p className="text-[0.93rem]">
        Ce calcul ne suppose aucune société : il porte sur la donation de la nue-propriété des murs
        eux-mêmes. Passer par une société civile donnerait le même résultat, parce que c&apos;est le
        même art. 669 qui s&apos;applique. Elle ne sert qu&apos;à donner par tranches quand la
        valeur dépasse les abattements.
      </p>

      <p>
        <strong>Différence sur les seuls droits : 32 000 €</strong> entre le premier encadré et le
        deuxième. Puis <strong>8 000 € de plus</strong> entre le deuxième et le troisième, pour
        trois ans d&apos;attente — ou pour un seul jour de trop. Les frais d&apos;acte et, si vous
        passez par une société, les frais de constitution viennent en déduction de ce gain :
        c&apos;est la question 1 ci-dessus.
      </p>
      <Source>
        Articles 669, 751, 777, 779, 784, 1133 et 1724 du Code général des impôts. À ces droits
        s&apos;ajoutent les émoluments du notaire et, le cas échéant, les frais de constitution de
        la société, que nous ne chiffrons pas ici : le barème est réglementé et révisé par arrêté —
        c&apos;est la question 1 ci-dessus.
      </Source>

      <Titre>8. Ma décision</Titre>
      {/* Les deux lignes de l'écart : le point 7 fabrique les deux chiffres, et
          c'est leur différence — et elle seule — que le lecteur ira montrer à son
          notaire et à ses enfants. Sans ces deux champs, la feuille se lit au lieu
          de se travailler, et l'acheteur a un stylo à la main. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Ce que mes enfants paieraient aujourd’hui"
          indice="le calcul du point 7, avec mes chiffres"
        />
        <Champ
          label="Ce qu’ils paieraient après la donation de nue-propriété"
          indice="le deuxième encadré du point 7, avec mes chiffres"
        />
      </div>

      {/* ⚠️ Deux colonnes UNIQUEMENT pour les libellés courts sans indice, comme
          dans calendrier-15-ans.tsx. Sur une demi-colonne A4 (~87 mm), un libellé
          gras suivi d'un indice occupe les 44 px du champ et il ne reste plus un
          millimètre pour écrire le montant au stylo. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Champ label="Valeur de mes biens locatifs" />
        <Champ label="Nombre d’enfants" />
      </div>
      <Champ label="Crédit restant dû" indice="hors assurance emprunteur" />
      <Champ label="Loyers nets par an" indice="ce que l’usufruit vous garde" />
      {/* Une dette ne se déduit pas d'office de l'assiette d'une donation : l'art.
          776 bis pose des conditions strictes. Sans cette phrase, le lecteur
          soustrait son crédit au stylo, sur une base fausse — d'où le paragraphe
          plutôt qu'un indice, qui n'aurait plus laissé de place pour écrire. */}
      <p className="text-[0.9rem]">
        Un crédit en cours ne vient pas d&apos;office en déduction de la valeur que vous donnez :
        l&apos;art. 776 bis du CGI y met des conditions strictes — prêt affecté au bien, mis à la
        charge de vos enfants dans l&apos;acte lui-même, contracté auprès d&apos;un établissement de
        crédit. À faire vérifier avant d&apos;écrire un chiffre net sur cette feuille.
      </p>

      {/* Le bloc qu'on signe : cases d'action, dates visées, mention notaire. Il ne
          doit pas se couper entre deux feuilles du classeur — d'où `eviter-coupure`
          ici, et non sur le point 8 entier, qui ferait un pavé de plus d'une
          demi-page insécable. */}
      <div className="eviter-coupure">
        <ul className="space-y-1">
          <Case>
            Je fais chiffrer les deux voies, avec et sans société, frais et droits compris.
          </Case>
          <Case>
            Je fixe avec mon notaire la date de la donation de nue-propriété, avant mon 71e
            anniversaire.
          </Case>
          <Case>Je démarre le compteur des 15 ans par un premier don déclaré.</Case>
        </ul>
        {/* La date VISÉE, et pas seulement la date limite du point 3 : c'est l'action
            centrale de la feuille, celle que le point 7 chiffre à 8 000 €. */}
        <div className="mt-3 grid gap-3">
          <Champ
            label="Donation de nue-propriété : signature visée le"
            indice="avant la date écrite au point 3"
          />
          <Champ
            label="Mon compteur recharge le"
            indice="mon premier don déclaré, au point 3, + 15 ans"
          />
          <Champ label="Décidé le" indice="et prochain point dans un an" />
        </div>

        <p className="mt-3 text-[0.9rem]">
          Les statuts, l&apos;acte de donation et la clause de gérance sont des actes notariés :{" "}
          <strong>à faire relire par votre notaire</strong> avant toute signature.
        </p>
      </div>
    </Feuille>
  );
}
