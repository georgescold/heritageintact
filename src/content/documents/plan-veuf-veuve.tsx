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
 * SITUATION 4 — VEUF OU VEUVE. Plan-type de l'étape « Le Plan familial ».
 *
 * ⚠️ Pourquoi cette situation a son propre plan : au premier décès, le
 * patrimoine se réunit sur une seule tête, et les enfants perdent un jeu entier
 * d'abattements. Les 100 000 € de l'article 779 se comptent par parent ET par
 * enfant : celui du parent décédé n'est pas transférable au survivant. Il sert
 * de son vivant, ou dans sa propre succession — les enfants sont héritiers
 * réservataires (art. 913 du Code civil) et l'appliquent au premier décès —
 * mais il ne rejoint jamais le survivant. Tout le plan découle de là, et c'est
 * aussi pourquoi l'ordre des trois dates n'est pas celui d'un couple de 65 ans.
 *
 * ⚠️ POURQUOI LA PORTE D'ENTRÉE NE PARLE QUE D'ENFANTS. Tous les chiffres de
 * cette feuille sont calculés sur les 100 000 € de l'art. 779, qui sont ceux
 * d'un enfant. Un petit-enfant n'a pas ce montant : 31 865 € en donation (art.
 * 790 B), et rien qui lui soit propre au décès — 1 594 € (art. 788, IV) — sauf
 * s'il vient par représentation de son parent décédé avant vous (art. 779, I).
 * Admettre le lecteur dont les héritiers sont des petits-enfants puis lui faire
 * lire « 0 € de droits » serait un chiffre faux : le point 1 restreint donc, et
 * le point 2 le redit en clair.
 *
 * ⚠️ Pourquoi l'exemple chiffré s'arrête à 29 546 € et pas à « zéro impôt » :
 * le rappel fiscal des 15 ans (art. 784) reconsomme l'abattement déjà utilisé
 * si le décès survient avant l'échéance. Annoncer une exonération totale serait
 * faux dans la majorité des cas — un lecteur de 74 ans mérite le chiffre vrai,
 * pas le chiffre vendeur, et c'est ce chiffre-là que son notaire confirmera.
 * C'est pourquoi le total se lit sur une seule base, celle d'aujourd'hui, et
 * que l'âge du scénario long est écrit noir sur blanc.
 *
 * ⚠️ POURQUOI `eviter-coupure` EST POSÉ BLOC PAR BLOC, ET JAMAIS SUR UN GROUPE
 * ENTIER. La feuille fait quatre pages : sans cette classe, un piège perd sa
 * conclusion sur la page suivante. Mais un bloc plus haut qu'un demi-feuillet
 * qu'on protège en entier est renvoyé en entier sur la feuille d'après, et
 * laisse un grand blanc au milieu du classeur. D'où les trois encadrés séparés
 * du point 6, protégés un par un, plutôt qu'un seul encadré de 0,8 page.
 *
 * ⚠️ Aucun contrat, aucun assureur, aucune banque n'est nommé (contrainte CIF),
 * et aucun montant d'émoluments n'est écrit : le barème est réglementé et
 * révisé par arrêté. Les deux sujets sont renvoyés au notaire.
 */

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Croire que l’abattement du conjoint décédé reste disponible",
    texte:
      "Les 100 000 € se comptent par parent et par enfant (art. 779 du CGI). Celui de votre conjoint ne vous rejoint pas : s’il n’a pas servi de son vivant ni dans sa succession, il est perdu. Le vôtre est désormais le seul, et il ne se recharge qu’au bout de 15 ans.",
  },
  {
    titre: "Croire que le décès remet le compteur des 15 ans à zéro",
    texte:
      "Il ne le remet pas. Une donation que vous aviez consentie il y a 12 ans est encore rappelée dans le calcul (art. 784 du CGI), et le compte court depuis la date de l’acte, pas depuis le décès. Vérifiez les dates avant de donner à nouveau.",
  },
  {
    titre: "Laisser votre conjoint désigné dans le testament et les clauses",
    texte:
      "Un contrat d’assurance-vie dont le seul bénéficiaire est décédé, sans mention « à défaut, mes enfants », voit son capital retomber dans la succession (art. L. 132-11 du Code des assurances) : il perd alors le régime propre de l’assurance-vie (art. 990 I et 757 B du CGI) et repasse au barème de l’art. 777. C’est la correction la plus rentable, et elle est gratuite.",
  },
];

const QUESTIONS: string[] = [
  "Dans la succession de mon conjoint, qu’ai-je recueilli en pleine propriété, et que n’ai-je recueilli qu’en usufruit ?",
  "Quelles donations ont déjà été déclarées, à quelle date, et de qui à qui ? Lesquelles seront encore rappelées à mon décès ?",
  "Mon testament et mes clauses bénéficiaires désignent-ils encore mon conjoint décédé ? Que se passe-t-il si je n’y touche pas ?",
];

export function PlanVeufVeuve() {
  return (
    <Feuille
      titre="Situation 4 — Veuf ou veuve"
      sousTitre="Votre plan-type. Un seul jeu d'abattements, une seule tête. Remplissez-le au stylo, puis emportez-le chez le notaire."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="eviter-coupure space-y-1">
        <Case>
          Votre conjoint ou partenaire est décédé, et la succession est réglée ou en cours.
        </Case>
        {/* La glose de l'usufruit est en ligne, et pas renvoyée au lexique : c'est
            la case qui décide si ce plan est le bon, et la feuille est lue seule,
            des mois plus tard. Un lecteur qui ne comprend pas le mot coche au
            hasard et travaille quatre pages qui ne le concernent pas. */}
        <Case>
          Vous détenez aujourd&apos;hui seul, en votre nom, la plus grande partie du patrimoine du
          ménage <strong>en PLEINE PROPRIÉTÉ</strong> (si vous n&apos;avez recueilli que
          l&apos;usufruit — c&apos;est-à-dire le droit d&apos;habiter le bien ou d&apos;en toucher
          les loyers sans en être propriétaire — vos enfants en sont déjà nus-propriétaires et le
          calcul ci-dessous ne vous concerne pas : option du conjoint survivant, art. 757 du Code
          civil ; à votre décès l&apos;usufruit s&apos;éteint sans droit à payer, art. 1133 du CGI.
          Posez d&apos;abord la question 1 du point 5).
        </Case>
        <Case>
          Vos héritiers sont vos enfants — ou vos petits-enfants venant par représentation d&apos;un
          enfant décédé avant vous (art. 779, I du CGI).
        </Case>
      </ul>
      <p className="text-[0.93rem]">Les trois cases cochées : ce plan est le vôtre.</p>

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      <p>
        Tout est réuni sur votre tête, et vos enfants n&apos;ont plus qu&apos;un seul abattement de
        100 000 € chacun au lieu de deux (art. 779 du CGI). Au-delà, ils paient au barème de la
        ligne directe (art. 777 du CGI).
      </p>
      {/* Sans cette ligne, un lecteur qui donne à un petit-enfant reporterait les
          100 000 € de l'art. 779 sur une personne qui n'y a pas droit, et lirait
          « 0 € de droits » là où il y en a. */}
      <p className="text-[0.93rem]">
        Si vous transmettez à un petit-enfant, ces chiffres ne sont pas les siens : de votre vivant
        il a son propre abattement de 31 865 € (art. 790 B du CGI) ; à votre décès il n&apos;a rien
        qui lui soit propre — 1 594 € (art. 788, IV du CGI) — sauf s&apos;il vient à la place de son
        parent décédé avant vous, auquel cas il partage les 100 000 € de ce parent (art. 779, I du
        CGI). Les calculs de cette feuille sont écrits pour des enfants : refaites-les avec le bon
        abattement.
      </p>
      <div className="eviter-coupure space-y-4">
        <Encadre titre="EXEMPLE — 500 000 € de patrimoine, deux enfants, aucune donation faite">
          <p className="text-[0.93rem]">
            Chaque enfant reçoit 250 000 €, moins 100 000 € d&apos;abattement : il reste 150 000 €
            taxables.
          </p>
          <p className="mt-1 text-[0.93rem]">
            8 072 € à 5 % = 403,60 € · 4 037 € à 10 % = 403,70 € · 3 823 € à 15 % = 573,45 € · 134
            068 € à 20 % = 26 813,60 €
          </p>
          <p className="mt-1 text-[0.93rem]">
            <strong>= 28 194 € par enfant, soit 56 388 € pour la famille.</strong>
          </p>
        </Encadre>
        <Source>Abattement : art. 779 du CGI. Barème en ligne directe : art. 777 du CGI.</Source>
      </div>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      <ol className="eviter-coupure list-decimal space-y-1 pl-5">
        <li>
          <strong>Le compteur des 15 ans — en premier ici.</strong> C&apos;est la seule des trois
          dates qui se recharge, et elle ne démarre qu&apos;au premier don déclaré — et chaque don
          ouvre ensuite son propre délai de quinze ans, compté à partir de sa propre date (art. 784
          du CGI). Tant que vous n&apos;avez rien donné, le compte n&apos;a pas commencé : chaque
          année d&apos;attente est une année perdue, pas une année gagnée (art. 779 du CGI).
        </li>
        <li>
          <strong>Le 71e anniversaire — ensuite.</strong> S&apos;il est passé, la nue-propriété (le
          bien sans son usage, que vous gardez jusqu&apos;au bout) que vous donnez est comptée à 70
          % de la valeur du bien au lieu de 60 % (art. 669 du CGI). La marche suivante tombe à votre
          81e anniversaire : elle passe alors à 80 %.
        </li>
        <li>
          <strong>Le 70e anniversaire — en dernier, souvent derrière vous.</strong> Après cet
          anniversaire, seule la fraction des sommes versées qui dépasse 30 500 €, tous contrats et
          tous bénéficiaires confondus, est soumise aux droits ; les gains produits ne le sont pas
          (art. 757 B du CGI). Ce que vous avez versé avant vos 70 ans garde ses 152 500 € par
          bénéficiaire (art. 990 I du CGI). Ces deux règles ne visent que les contrats souscrits à
          compter du 20 novembre 1991 (art. 757 B) et les sommes versées à compter du 13 octobre
          1998 (art. 990 I) : un contrat plus ancien obéit à des règles distinctes, faites-le
          vérifier contrat par contrat.
        </li>
      </ol>
      {/* Trois dates lues, trois dates à écrire. Le 81e anniversaire est la plus
          proche pour un lecteur de 78 ans, et c'est la seule qui coûte 10 points
          de valeur taxable : il lui faut une ligne, pas une note de bas de page. */}
      <div className="eviter-coupure grid gap-3">
        <Champ label="Mon 71e anniversaire" indice="passé ? oui / non — entourez" />
        <Champ
          label="Mon 81e anniversaire tombe le"
          indice="la nue-propriété passe alors de 70 à 80 %"
        />
        <Champ label="Mes 70 ans, c’était le" indice="jour, mois, année" />
      </div>
      <p className="text-[0.9rem]">
        Pour un couple de 65 ans, l&apos;ordre est exactement inverse : les anniversaires arrivent
        avant que les 15 ans ne soient un sujet. Vous, vous êtes passé de l&apos;autre côté.
      </p>

      <Titre>4. Les 3 pièges de cette situation</Titre>
      <div className="eviter-coupure space-y-2">
        {PIEGES.map((p) => (
          <Encadre key={p.titre} titre={p.titre}>
            <p className="text-[0.93rem]">{p.texte}</p>
          </Encadre>
        ))}
      </div>

      <Titre>5. Les 3 questions à poser à votre notaire</Titre>
      <ol className="divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          /* `eviter-coupure` est posé sur chaque question, pas sur la liste :
             une question coupée de sa ligne d'écriture est inutilisable au
             rendez-vous, mais protéger le bloc entier le renverrait en entier
             sur la feuille suivante. */
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

      <Titre>6. Ce que ça change, en euros</Titre>
      <p className="text-[0.95rem]">
        Même famille : 500 000 €, deux enfants majeurs, vous avez 74 ans. Vous faites deux choses.
      </p>
      {/* Trois encadrés séparés plutôt qu'un seul : le lecteur annote geste par
          geste, et chaque bloc tient dans un reste de page. */}
      <div className="eviter-coupure">
        <Encadre titre="GESTE 1 — le don d’argent">
          <p className="text-[0.93rem]">
            31 865 € en argent à chaque enfant, soit 63 730 €. Droits : 0 €. Ce don-là n&apos;est
            pas un abattement, c&apos;est une exonération à part : il ne consomme pas vos 100 000 €
            et il n&apos;est pas recompté à votre décès (art. 790 G du CGI ; le rappel de
            l&apos;art. 784 ne vise pas cet article). Trois conditions : avoir moins de 80 ans le
            jour du don, que l&apos;enfant soit majeur, et que l&apos;enfant déclare le don dans le
            mois au service des impôts de son domicile — formulaire 2735.
          </p>
          {/* Le vrai risque n'est pas sur la ligne « 0 € », qui reste vraie :
              l'abattement de 100 000 € couvre le don. Il est en aval — le don
              cesse d'être hors compteur, donc il mange l'abattement et il est
              rappelé au décès. Écrire l'inverse fait peur au mauvais endroit. */}
          <p className="mt-2 text-[0.93rem]">
            Sans cette déclaration dans le mois, l&apos;exonération de l&apos;article 790 G est
            perdue. Les droits sur ce don restent de 0 €, votre abattement de 100 000 € le couvrant
            — mais le don cesse d&apos;être à part : il consomme 31 865 € de ces 100 000 € (art.
            779) et il sera rappelé à votre décès (art. 784). Le calcul du geste 2 et les 2 000 €
            d&apos;abattement qui restent plus bas sont alors à refaire, et le total de cette page
            n&apos;est plus le bon.
          </p>
        </Encadre>
      </div>
      <div className="eviter-coupure">
        <Encadre titre="GESTE 2 — la nue-propriété">
          <p className="text-[0.93rem]">
            Vous donnez la nue-propriété d&apos;un bien valant 280 000 €, et vous en gardez
            l&apos;usage jusqu&apos;au bout. À 74 ans, elle est comptée à 70 %, soit 196 000 €, donc
            98 000 € par enfant : sous les 100 000 €, donc 0 € de droits (art. 669 et 779 du CGI). À
            votre décès, l&apos;usufruit s&apos;éteint et les enfants deviennent pleins
            propriétaires sans droits de succession à payer sur ce bien (art. 1133 du CGI). La
            donation doit être passée devant notaire plus de trois mois avant le décès, sinon le
            bien est réputé revenir en pleine propriété dans la succession (art. 751 du CGI).
            C&apos;est une raison de plus de ne pas attendre.
          </p>
        </Encadre>
      </div>
      <div className="eviter-coupure">
        <Encadre titre="LE TOTAL">
          <p className="text-[0.93rem]">
            <strong>Reste dans la succession :</strong> 500 000 − 63 730 − 280 000 = 156 270 €, soit
            78 135 € par enfant. Il ne reste que 2 000 € d&apos;abattement, les 98 000 € ayant été
            consommés et rappelés (art. 784) : 76 135 € taxables.
          </p>
          <p className="mt-1 text-[0.93rem]">
            403,60 € + 403,70 € + 573,45 € + (60 203 € à 20 % = 12 040,60 €) ={" "}
            <strong>13 421 € par enfant, soit 26 842 € pour la famille.</strong>
          </p>
          {/* Un seul chiffre à reporter, et l'âge du scénario long écrit : posés
              côte à côte sans cette hiérarchie, 29 546 € et 56 388 € s'additionnent
              dans la tête du lecteur et donnent plus que la facture entière. */}
          <p className="mt-2 text-[0.95rem]">
            <strong>
              56 388 € − 26 842 € = 29 546 € qui restent dans la famille dès aujourd&apos;hui.
            </strong>{" "}
            Et si vous êtes encore là quinze ans après la donation — à 89 ans dans cet exemple —
            l&apos;abattement se recharge : les 78 135 € par enfant repassent sous les 100 000 € et
            les 26 842 € restants tombent à leur tour, à patrimoine inchangé et sous réserve du
            calcul de votre notaire le jour venu. Ce second chiffre n&apos;est pas acquis ; le
            premier, lui, l&apos;est.
          </p>
        </Encadre>
      </div>
      <Source>
        Art. 779, 784, 790 G, 669, 751, 1133 et 777 du CGI. Chiffres arrondis à l&apos;euro. Les
        émoluments du notaire ne sont pas comptés ici : leur barème est réglementé et révisé par
        arrêté — demandez-lui le coût complet de l&apos;acte, sur quelle valeur il est calculé.
      </Source>

      <Titre>7. Ma décision</Titre>
      <ul className="eviter-coupure space-y-1">
        <Case>
          Je fais relire mes clauses bénéficiaires et mon testament, et je remplace le nom de mon
          conjoint.
        </Case>
        <Case>Je demande à mon notaire les trois questions du point 5, avec mes chiffres.</Case>
        <Case>Je démarre le compteur des 15 ans par un premier don déclaré.</Case>
      </ul>
      {/* Tout le calcul de la feuille dépend de ce qui a été recueilli en pleine
          propriété et de ce qui ne l'a été qu'en usufruit : c'est la condition de
          la case 2 du point 1 et la question 1 au notaire. Sans ligne pour
          l'écrire, la distinction se perd entre la lecture et le rendez-vous. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Ce que j’ai recueilli en pleine propriété"
          indice="succession de mon conjoint"
        />
        <Champ
          label="Ce que je n’ai recueilli qu’en usufruit"
          indice="mes enfants en sont déjà nus-propriétaires"
        />
        <Champ label="Mon patrimoine estimé" indice="tous biens, tous comptes" />
      </div>
      {/* Les trois lignes de l'écart : le point 2 fabrique le premier chiffre, le
          point 6 le second, et c'est la différence — et elle seule — que le lecteur
          ira montrer à son notaire et à ses enfants. */}
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Ce que mes enfants paieraient aujourd’hui"
          indice="le calcul du point 2, avec mes chiffres"
        />
        <Champ
          label="Ce qu’ils paieraient après mon plan"
          indice="le calcul du point 6, avec mes chiffres"
        />
        <Champ label="L’écart, en euros" indice="la différence entre les deux lignes ci-dessus" />
      </div>
      {/* « Démembrer » est du jargon : on reprend les mots du point 6, que le lecteur
          vient de lire. Le lexique du classeur définit le terme, la feuille l'évite. */}
      <Champ
        label="Le bien dont je compte donner la nue-propriété"
        indice="en gardant l’usage jusqu’au bout — et sa valeur estimée"
      />
      {/* Un tableau et non une ligne : le point 3 le dit lui-même, chaque don ouvre
          son propre délai de quinze ans. Un veuf de 78 ans a presque toujours
          plusieurs donations consenties du vivant du conjoint, qui courent encore
          et seront rappelées (art. 784) — c'est sa question 2 au notaire. */}
      <div className="eviter-coupure space-y-2">
        <p className="text-[0.93rem]">
          Les donations déjà déclarées. Chacune a son propre délai de quinze ans, compté depuis sa
          propre date (art. 784 du CGI) : la dernière colonne, c&apos;est la date du don + 15 ans.
        </p>
        <TableauVierge
          colonnes={["Date du don", "À qui", "Montant déclaré", "Rappelé jusqu’au"]}
          lignes={4}
        />
      </div>
      <Champ label="Décidé le" indice="et prochain point dans un an" />

      <p className="text-[0.9rem]">
        Ce plan est un plan de travail, pas un acte. Aucune de ces opérations n&apos;existe tant
        qu&apos;elle n&apos;est pas passée devant notaire : à faire relire par votre notaire avant
        toute signature.
      </p>
    </Feuille>
  );
}
