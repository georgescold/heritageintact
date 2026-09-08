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
 * PLAN-TYPE — SITUATION 6 : SANS ENFANT.
 *
 * ⚠️ C'est la situation où l'ordre des trois dates change. Chez un parent, le
 * compteur des 15 ans commande tout : 100 000 € par enfant, rechargeables. Ici
 * les abattements sont dix fois plus petits (15 932 € pour un frère, 7 967 €
 * pour un neveu), et le taux part à 35 % puis 45 % pour un frère ou une sœur,
 * 55 % pour un neveu, 60 % pour une personne sans lien de parenté (art. 777,
 * tableau III, du CGI). C'est donc le 70e anniversaire qui passe en premier,
 * parce que c'est l'assurance-vie qui creuse le plus grand écart : 20 % au lieu
 * de 55 %. Le lecteur doit comprendre ce basculement AVANT de lire le reste.
 *
 * ⚠️ On n'écrit nulle part que l'assurance-vie serait le SEUL outil. C'est
 * faux (l'adoption simple d'un neveu élevé cinq ans dans sa minorité fait
 * basculer en ligne directe, art. 786 2° du CGI ; le démembrement et le don
 * étalé réduisent aussi l'assiette) et une exclusivité ne se source pas. On
 * écrit l'écart chiffré, article à l'appui, et on s'arrête là.
 *
 * ⚠️ Ce sont souvent les patrimoines les plus élevés du fichier, et les
 * lecteurs les plus seuls : personne autour d'eux ne leur a jamais dit que leur
 * neveu paierait 55 % dès le premier euro. On montre donc le calcul en entier,
 * avant et après, plutôt qu'un pourcentage abstrait.
 *
 * ⚠️ Pourquoi DEUX encadrés chiffrés au point 6, et pas un. La cible a 65 à
 * 85 ans : la moitié des lecteurs a déjà passé 70 ans le jour où elle imprime
 * cette feuille. Un document qui ne chiffre que l'avant-70 les renvoie à une
 * seule phrase de consolation et à zéro geste. Le second encadré leur redonne
 * un calcul qui est le leur et ce qui reste ouvert — à commencer par le plus
 * rentable de tous, et le seul gratuit : retrouver la date des versements déjà
 * faits.
 *
 * ⚠️ Aucun contrat, aucun assureur, aucune banque n'est nommé — ce serait du
 * conseil en investissement financier, réglementé. Et on ne dit pas non plus
 * quel montant affecter à quel produit : on énonce la règle et le calendrier
 * (quelle date ouvre quel abattement), on fait vérifier les contrats existants.
 * Jamais quoi acheter.
 */

const DATES: { titre: string; texte: string; source: string }[] = [
  {
    titre: "1er — votre 70e anniversaire",
    texte:
      "C’est la date qui commande tout dans votre cas. Les primes — c’est-à-dire les sommes que vous versez sur un contrat d’assurance-vie — versées avant votre 70e anniversaire ouvrent, pour chaque bénéficiaire que vous désignez, un abattement de 152 500 € sur le capital que l’assureur lui versera ; au-delà, ce capital supporte 20 % jusqu’à 700 000 € par bénéficiaire, et 31,25 % ensuite. Les primes versées après 70 ans n’ouvrent plus qu’un abattement de 30 500 €, tous contrats et tous bénéficiaires confondus — étant précisé que seules ces primes entrent dans ce calcul : les gains qu’elles produisent restent exonérés. La date compte plus que le contrat : reprenez sur chacun de vos contrats existants la date de chaque versement et le nom exact de chaque bénéficiaire.",
    source: "Art. 990 I du CGI avant 70 ans ; art. 757 B du CGI après 70 ans.",
  },
  {
    titre: "2e — le compteur des 15 ans",
    texte:
      "Il rapporte peu ici : 15 932 € par frère ou sœur, 7 967 € par neveu ou nièce, rechargeables tous les 15 ans à compter du premier don déclaré. Un geste vaut mieux que ce compteur : le don d’une somme d’argent de 31 865 € à un neveu ou une nièce majeur (ou mineur émancipé, c’est-à-dire autorisé par un juge à gérer ses affaires) — possible justement parce que vous n’avez pas de descendance, et tant que vous n’avez pas 80 ans. Il doit être déclaré par celui qui reçoit, dans le mois, au service des impôts de son domicile (formulaire 2735) : sans cette déclaration, l’exonération est perdue.",
    source: "Art. 779 IV et V, art. 784 et art. 790 G du CGI.",
  },
  {
    titre: "3e — votre 71e anniversaire",
    texte:
      "Dernier, sauf si votre patrimoine est surtout immobilier. Donner la nue-propriété d’un bien — vous en gardez l’usage et les loyers jusqu’à votre décès — fait calculer les droits de donation sur 60 % de la valeur du bien avant votre 71e anniversaire, et sur 70 % après (art. 669 du CGI). Au jour de votre décès, l’usufruit rejoint la nue-propriété sans aucun droit à payer (art. 1133 du CGI) : c’est là qu’est le gain. Cette date-là ne se ferme jamais : elle coûte seulement un peu plus cher à chaque marche.",
    source: "Art. 669 et art. 1133 du CGI.",
  },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "1. Le double décès, si vous êtes marié",
    texte:
      "Votre conjoint ne paie aucun droit (art. 796-0 bis du CGI) et, si vos père et mère sont décédés, il recueille toute la succession (art. 757-2 du Code civil ; s’ils sont vivants, il en recueille la moitié ou les trois quarts, art. 757-1). Mais à son décès à lui, ce qui reste ira à SA famille : vos frères, vos neveux n’auront rien. Sans testament, rien ne corrige cela — le droit de retour de vos frères et sœurs, c’est-à-dire leur droit de reprendre certains biens, ne porte que sur la moitié des biens qui vous venaient de vos parents ou de vos grands-parents, et seulement si ces biens existent encore, tels quels, dans la succession (art. 757-3 du Code civil).",
  },
  {
    titre: "2. La clause bénéficiaire vide ou périmée",
    texte:
      "Un contrat sans bénéficiaire désigné retombe dans la succession (art. L. 132-11 du Code des assurances) : l’abattement de 152 500 € de l’article 990 I du CGI est perdu, et le capital est taxé à 55 ou 60 % comme le reste. Reprenez la clause de chaque contrat, nom par nom, date de naissance par date de naissance — le tableau du point 7 est fait exactement pour ça.",
  },
  {
    titre: "3. Le concubin, le filleul, l’ami : 60 %",
    texte:
      "Une personne sans lien de parenté avec vous a 1 594 € d’abattement, puis paie 60 % (art. 788 IV et art. 777, tableau III, du CGI). Sur 100 000 € reçus, il lui reste 40 956 €. L’assurance-vie alimentée avant vos 70 ans ouvre 152 500 € d’abattement par bénéficiaire désigné, puis ramène le taux à 20 % sur les 700 000 € suivants, et 31,25 % au-delà (art. 990 I du CGI).",
  },
];

/**
 * Les questions sont écrites en phrases courtes et en mots de tous les jours :
 * c'est le lecteur qui devra les dire à voix haute, en face d'un notaire, et un
 * mot qu'il ne comprend pas est un mot qu'il ne prononcera pas. Quand un terme
 * technique est inévitable (« par représentation »), il est défini sur place.
 */
const QUESTIONS: string[] = [
  "Mon frère ou ma sœur vit chez moi depuis plus de cinq ans, il a plus de 50 ans, il n’est pas marié : peut-il hériter sans payer de droits (art. 796-0 ter du CGI) ? Un PACS, ou une séparation sans jugement, le lui feraient-ils perdre ?",
  "Si mon frère meurt avant moi, ses enfants prennent-ils sa place — on dit « par représentation » ? Paieraient-ils alors au taux des frères et sœurs, ou 55 % (art. 777, tableau III, du CGI) ?",
  "Je n’ai pas d’enfant : puis-je tout laisser par testament à qui je veux ? Que faut-il garder pour mon conjoint (art. 914-1 du Code civil) ?",
  // Un lecteur de 80 ans peut détenir un contrat entièrement hors du champ de
  // l'art. 990 I, donc mieux traité que les 152 500 € : la date de SOUSCRIPTION
  // compte autant que celle des versements, et personne ne la lui demande jamais.
  "Mon contrat a été souscrit avant le 20 novembre 1991 : les primes que j’y ai versées avant le 13 octobre 1998 échappent-elles à l’article 990 I du CGI ?",
];

export function PlanSansEnfant() {
  return (
    <Feuille
      titre="Situation 6 — Sans enfant"
      sousTitre="Le plan-type de votre situation. À remplir au stylo, puis à emporter chez le notaire."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="space-y-1">
        <Case>Vous n&apos;avez ni enfant, ni petit-enfant.</Case>
        <Case>
          Ceux à qui vous voulez transmettre sont vos frères et sœurs, vos neveux et nièces, un
          filleul, un ami, une association.
        </Case>
        {/* L'incise sur le mot « abattement » n'est pas du remplissage : le lexique
            du classeur le définit par « 100 000 € par parent et par enfant », et le
            lecteur sans enfant y trouve un chiffre qui n'est pas le sien. */}
        <Case>
          Votre patrimoine dépasse de loin les abattements qui les concernent — l&apos;abattement
          étant la somme retirée avant tout calcul d&apos;impôt, et le vôtre n&apos;est pas celui
          des enfants : 15 932 € pour un frère ou une sœur, 7 967 € pour un neveu ou une nièce, 1
          594 € pour une personne sans lien de parenté avec vous.
        </Case>
      </ul>
      <Source>Art. 779 IV et V, art. 788 IV du CGI.</Source>

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      <p className="text-[0.95rem]">
        Vos héritiers n&apos;ont droit ni aux 100 000 € des enfants, ni au barème de la ligne
        directe, qui ne dépasse pas 20 % jusqu&apos;à 552 324 € par enfant (art. 777, tableau I, du
        CGI). Un frère ou une sœur paie 35 % jusqu&apos;à 24 430 € au-delà de son abattement, puis
        45 %. Un neveu paie 55 % dès le premier euro au-delà de 7 967 €. Une personne sans lien de
        parenté paie 60 % au-delà de 1 594 €.
      </p>
      <div className="eviter-coupure space-y-4">
        <Encadre titre="EXEMPLE : 400 000 €, UN NEVEU, RIEN DE PRÉPARÉ">
          <p className="text-[0.93rem]">
            400 000 € − 7 967 € d&apos;abattement = 392 033 € taxables.
            <br />
            392 033 € × 55 % = <strong>215 618 € de droits.</strong>
            <br />
            Votre neveu reçoit 184 382 € sur 400 000 €.
          </p>
        </Encadre>
        {/* Le paragraphe ci-dessus avance quatre chiffres de droit (les 100 000 €
            de la ligne directe, le barème de la ligne directe, le 55 % du neveu,
            le 60 % de la personne sans lien) : la Source doit porter les articles
            des QUATRE, sinon l'enfant qui lira cette page seule ne peut rien
            vérifier. */}
        <Source>
          Art. 779 I, IV et V, et art. 788 IV du CGI pour les abattements ; art. 777, tableaux I et
          III, du CGI pour les taux. Exemple calculé à patrimoine constant.
        </Source>
      </div>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      {/* `eviter-coupure` : les trois dates sont le squelette du document. Coupées
          entre deux feuilles, le lecteur qui range son classeur en perd une.
          La classe est posée par DATE et non sur la liste entière : le bloc des
          trois fait ~178 mm sur les 261 mm imprimables d'un A4, et forcerait
          jusqu'à deux tiers de feuille blanche avant lui — sur une imprimante
          dont la cartouche coûte plus cher que La Méthode. */}
      <ol className="divide-y divide-black border-y border-black">
        {DATES.map((d) => (
          <li key={d.titre} className="eviter-coupure py-2">
            <p className="font-bold">{d.titre}</p>
            <p className="text-[0.93rem]">{d.texte}</p>
            <Source>{d.source}</Source>
          </li>
        ))}
      </ol>
      <p className="text-[0.9rem]">
        Chez un parent, le compteur des 15 ans passe en premier : 100 000 € par enfant,
        rechargeables (art. 779 I du CGI). Chez vous, les abattements sont dix fois plus petits —
        c&apos;est donc le 70e anniversaire qui commande le calendrier.
      </p>

      <Titre>4. Les 3 pièges de cette situation</Titre>
      {/* Un piège coupé en deux feuilles perd sa conclusion, qui est justement la
          consigne : le piège n° 1 finirait par « vos frères, vos neveux n'auront
          rien » seul au dos d'une page, sans son titre. Chaque piège est donc un
          bloc autonome protégé par `eviter-coupure`, comme dans les onze autres
          plans du classeur. */}
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
      {/* Bloc repris tel quel des « 12 questions à poser à votre notaire » : le
          sous-titre promet une feuille à emporter, et sans carré à cocher le
          lecteur assis en face du notaire ne sait plus où il en est de ses
          questions. `eviter-coupure` par question, pour qu'aucune ne soit
          séparée de sa ligne de réponse. */}
      <ol className="divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          <li key={q} className="eviter-coupure py-2">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
              />
              <p className="text-[0.93rem]">
                <strong>{i + 1}.</strong> {q}
              </p>
            </div>
            <div className="ml-[30px] mt-1 min-h-[36px] border-b border-black" />
          </li>
        ))}
      </ol>
      <Source>
        Art. 796-0 ter, art. 777 et art. 990 I du CGI ; art. 914-1 du Code civil. Tout modèle
        d&apos;acte ou de clause est à faire relire par votre notaire.
      </Source>

      <Titre>6. Ce que ça change, en euros</Titre>
      {/* ⚠️ CES DEUX ENCADRÉS SONT ÉCRITS EN OBSERVATION, JAMAIS EN GESTE. Écrire
          « versez 152 500 € avant vos 70 ans » serait dire quel montant affecter
          à quel produit, c'est-à-dire du conseil en investissement financier, et
          ce fichier se l'interdit en tête. On énonce donc la règle sous condition
          — « si une prime a été versée avant, alors l'abattement couvre » — et le
          lecteur en tire lui-même sa décision, avec son notaire. Même raison pour
          le « Dans cet exemple » : un exemple à 400 000 € écrit à la deuxième
          personne se lit comme un résultat promis, quel que soit le patrimoine. */}
      <div className="eviter-coupure space-y-4">
        <Encadre titre="MÊME PATRIMOINE DE 400 000 €, MÊME NEVEU — CE QUE CHANGENT DEUX DATES">
          <p className="text-[0.93rem]">
            <strong>Avant le 70e anniversaire.</strong> Si une prime — une somme versée sur un
            contrat d&apos;assurance-vie — de 152 500 € a été versée avant ce 70e anniversaire et
            que le neveu est seul bénéficiaire désigné, l&apos;abattement de l&apos;article 990 I du
            CGI couvre cette somme au décès : elle est versée par l&apos;assureur sans droits,
            intérêts compris. Dans cet exemple, calculé sans revalorisation du contrat, la fraction
            qui dépasserait 152 500 € au jour du décès supporterait un prélèvement de 20 %.
          </p>
          <p className="mt-2 text-[0.93rem]">
            <strong>Avant le 80e anniversaire.</strong> Si 31 865 € ont été donnés en somme
            d&apos;argent à un neveu majeur, le donateur ayant{" "}
            <strong>moins de 80 ans le jour du don</strong>, et si le don est déclaré dans le mois :
            0 € de droits (art. 790 G du CGI).
          </p>
          <p className="mt-2 text-[0.93rem]">
            <strong>Reste dans la succession :</strong> 400 000 − 152 500 − 31 865 = 215 635 €,
            moins 7 967 € d&apos;abattement = 207 668 € × 55 % ={" "}
            <strong>114 217 € de droits.</strong>
          </p>
          <p className="mt-2 text-[0.95rem]">
            Dans cet exemple, le neveu reçoit 285 783 € au lieu de 184 382 € :{" "}
            <strong>101 401 € d&apos;écart, entre deux dates.</strong>
          </p>
          <p className="mt-2 text-[0.93rem]">
            Vos chiffres ne sont pas ceux-ci : refaites le calcul au point 7.
          </p>
        </Encadre>
        <Source>
          Art. 990 I, 790 G, 779 V et 777 du CGI. Exemple calculé à patrimoine constant, sans
          revalorisation des contrats, et hors émoluments du notaire : leur barème est réglementé et
          révisé par arrêté — demandez-lui le coût complet de l&apos;acte, et sur quelle valeur il
          est calculé.
        </Source>
      </div>

      {/* Le lecteur médian de cette feuille a plus de 70 ans. Il ne doit pas
          arriver au bas de la page sans un calcul qui soit le sien et un geste
          qu'il puisse encore faire. La formulation de l'art. 757 B est reprise
          mot pour mot de plan-veuf-veuve.tsx : les primes, pas les gains. */}
      <div className="eviter-coupure space-y-4">
        <Encadre titre="SI VOUS AVEZ DÉJÀ PASSÉ 70 ANS — CE QUI RESTE OUVERT">
          <p className="text-[0.93rem]">
            <strong>1. Retrouvez la date de vos versements — avant tout le reste.</strong> Ce que
            vous avez versé avant vos 70 ans, s&apos;il y en a, garde son abattement de 152 500 €
            par bénéficiaire désigné (art. 990 I du CGI). C&apos;est le geste le plus rentable de
            cette feuille, et il est gratuit : il consiste à lire vos contrats.
          </p>
          <p className="mt-2 text-[0.93rem]">
            <strong>2. Le don de 31 865 € reste ouvert</strong> tant que vous n&apos;avez pas 80
            ans, à un neveu ou une nièce majeur, déclaré dans le mois : 0 € de droits (art. 790 G du
            CGI).
          </p>
          <p className="mt-2 text-[0.93rem]">
            <strong>3. Après 70 ans, l&apos;assurance-vie garde une part d&apos;avantage.</strong>{" "}
            Sur les sommes versées après cet anniversaire, seule la fraction des primes qui dépasse
            30 500 €, tous contrats et tous bénéficiaires confondus, est soumise aux droits ; les
            gains produits ne le sont pas (art. 757 B du CGI). C&apos;est un abattement unique, pas
            un abattement par contrat ni par bénéficiaire.
          </p>
          {/* L'hypothèse qui protège ce calcul n'est pas « aucun versement AVANT
              70 ans » mais « aucune prime déjà versée APRÈS 70 ans » : l'abattement
              de l'art. 757 B est global, et le lecteur type de cet encadré — plus de
              70 ans, un contrat alimenté depuis des années — l'a souvent déjà
              entamé. Et le « − 30 500 » doit avoir une origine visible sur la
              feuille, sinon celui qui refait le calcul au stylo cherche le geste
              correspondant, ne le trouve pas, et repose son stylo. D'où la forme
              conditionnelle : on énonce ce que la règle produit, on ne prescrit
              aucun versement. */}
          <p className="mt-2 text-[0.93rem]">
            <strong>Le calcul,</strong> pour un lecteur qui n&apos;a jamais versé après ses 70 ans,
            et dont l&apos;abattement de 30 500 € est donc intact : si 30 500 € de primes sont
            versées après cet anniversaire, l&apos;article 757 B les couvre en entier ; avec le don
            de 31 865 €, il reste 400 000 − 31 865 − 30 500 = 337 635 € dans la succession, moins 7
            967 € = 329 668 € × 55 % = <strong>181 317 € de droits.</strong>
          </p>
          <p className="mt-2 text-[0.95rem]">
            Dans cet exemple, le neveu reçoit 218 683 € au lieu de 184 382 € :{" "}
            <strong>34 301 € d&apos;écart, après 70 ans.</strong>
          </p>
          <p className="mt-2 text-[0.93rem]">
            Si vous avez déjà versé après 70 ans, ces 30 500 € sont entamés d&apos;autant : seul le
            don de 31 865 € reste entier, soit 17 526 € de droits en moins (art. 757 B et 790 G du
            CGI). Vos chiffres ne sont pas ceux-ci : refaites le calcul au point 7.
          </p>
        </Encadre>
        <Source>
          Art. 990 I, 757 B, 790 G, 779 V et 777 du CGI. Exemple calculé à patrimoine constant, sans
          revalorisation des contrats.
        </Source>
      </div>

      <p className="text-[0.9rem]">
        Passé 70 ans, l&apos;écart se réduit — il ne disparaît pas. Et la 3e date, elle, ne se ferme
        jamais : la nue-propriété se donne à tout âge, seule la fraction comptée monte (art. 669 du
        CGI). Le testament aussi reste ouvert jusqu&apos;au dernier jour : sans enfant, c&apos;est
        lui qui décide qui reçoit.
      </p>

      {/* Le document s'appelle « les 3 dates » : il doit faire ÉCRIRE ces dates.
          Et le tableau exécute sur la feuille l'ordre donné au piège n° 2 —
          sans lui, la consigne « reprenez chaque clause » n'a nulle part où
          atterrir et le lecteur repose son stylo.

          ⚠️ `eviter-coupure` est posé SOUS-BLOC PAR SOUS-BLOC, jamais sur la
          section entière. Mesurée au gabarit d'impression, la section 7 fait
          ~290 mm pour 261 mm de hauteur imprimable : `break-inside: avoid` posé
          sur un bloc plus haut qu'une page est purement ignoré par le moteur, et
          la coupure retombe alors au milieu du tableau des contrats ou entre un
          carré à cocher et sa phrase. Chaque sous-bloc fait 40 à 65 mm et tient
          réellement. */}
      <Titre>7. Ma décision</Titre>
      <div className="eviter-coupure grid gap-3">
        <Champ label="Mon patrimoine estimé" indice="tous biens, tous comptes" />
        <Champ label="Qui doit recevoir, et quoi" indice="nom par nom" />
      </div>

      {/* ⚠️ AUCUN RENVOI AU SIMULATEUR ICI. Le Simulateur de Facture Invisible est
          bâti exclusivement en ligne directe : « la part de chaque enfant », un
          abattement de 100 000 €, le barème de l'art. 777 tableau I. Y envoyer le
          lecteur sans enfant — celui à qui le point 2 vient précisément
          d'expliquer qu'il n'a droit à rien de tout cela — lui fait écrire
          58 194 € là où cette feuille calcule 215 618 € douze lignes plus haut :
          157 424 € d'écart, dans le sens rassurant, sur le chiffre qui EST la
          promesse de La Méthode. Le calcul est donc refait sur place, sur le
          modèle de plan-concubins-pacs.tsx. */}
      <p className="text-[0.93rem]">
        Le Simulateur de Facture Invisible est calculé pour des enfants : il retire un abattement de
        100 000 € à l&apos;étape 5, puis applique à l&apos;étape 6 le barème de la ligne directe
        (art. 777, tableau I, du CGI). Ce ne sont pas vos chiffres. Faites le calcul ci-dessous, une
        fois par personne que vous voulez nommer.
      </p>
      <div className="eviter-coupure grid gap-3">
        <Champ label="A. Ce que je veux lui laisser" />
        <Champ
          label="B. A − mon abattement ="
          indice="15 932 € frère ou sœur · 7 967 € neveu ou nièce · 1 594 € sans lien de parenté (art. 779 IV et V, art. 788 IV du CGI)"
        />
        <Champ
          label="C. B × mon taux ="
          indice="55 % neveu ou nièce · 60 % sans lien de parenté (art. 777, tableau III, du CGI) — c’est ce que ma famille paierait aujourd’hui"
        />
        <Champ label="A − C =" indice="ce qu’il ou elle garde vraiment" />
        <Champ
          label="Ce qu’il ou elle garderait après mon plan"
          indice="à recalculer une fois les décisions prises"
        />
      </div>
      {/* Le frère ou la sœur est le seul cas à deux tranches : sans cette ligne,
          le lecteur multiplie par un taux unique et se trompe dans les deux sens. */}
      <Source>
        Pour un frère ou une sœur, le taux change en cours de route : 35 % sur les 24 430 premiers
        euros de B, puis 45 % au-delà (art. 777, tableau III, du CGI).
      </Source>

      <div className="eviter-coupure grid gap-3">
        <Champ label="Mon 70e anniversaire" indice="passé ou à venir — écrivez la date" />
        <Champ
          label="Mon 71e anniversaire"
          indice="la nue-propriété comptée à 60 % de la valeur du bien avant, 70 % après (art. 669 du CGI)"
        />
        {/* ⚠️ Le jour de ses 80 ans, le donateur A 80 ans : l'art. 790 G I 1° exige
            qu'il en ait MOINS au jour de la transmission, donc le dernier jour
            utile est la veille. Sur une feuille dont toute la fonction est de
            faire écrire une date au stylo, puis de la relire des mois plus tard,
            un jour d'erreur coûte 17 526 € de droits (31 865 × 55 %). */}
        <Champ
          label="La veille de mes 80 ans, c’est-à-dire le"
          indice="dernier jour pour le don de 31 865 € — le donateur doit avoir moins de 80 ans (art. 790 G du CGI)"
        />
        {/* Cette date-là ouvre le délai d'un mois ET démarre le compteur des
            15 ans : elle est citée quatre fois dans la feuille et n'avait nulle
            part où être écrite. */}
        <Champ label="Don fait le" indice="déclaration à déposer dans le mois — formulaire 2735" />
      </div>

      <p className="text-[0.93rem]">
        Une ligne par contrat d&apos;assurance-vie. C&apos;est le piège n° 2, fait sur cette
        feuille. Les deux colonnes de dates sont les plus précieuses : la souscription dit quel
        régime s&apos;applique au contrat, les versements disent lesquels gardent leur abattement de
        152 500 € (art. 990 I du CGI).
      </p>
      <div className="eviter-coupure">
        <TableauVierge
          colonnes={[
            "Le contrat",
            "Souscrit le",
            "Versements avant mes 70 ans (dates, montants)",
            "Le bénéficiaire inscrit aujourd’hui",
            "Le nom à y mettre",
          ]}
          lignes={4}
        />
      </div>

      <ul className="eviter-coupure space-y-1">
        <Case>
          J&apos;ai vérifié la clause bénéficiaire de chacun de mes contrats, nom par nom, et noté
          la date de souscription ainsi que celle de chaque versement.
        </Case>
        <Case>
          J&apos;ai écrit mon testament, ou pris rendez-vous pour le faire — sans lui, le piège n° 1
          se produit.
        </Case>
        <Case>J&apos;ai fait le don de 31 865 €, et je l&apos;ai fait déclarer dans le mois.</Case>
        <Case>
          J&apos;ai posé les quatre questions du point 5 à mon notaire, et noté ses réponses.
        </Case>
        <Case>J&apos;ai refait le calcul du point 6 avec mes propres chiffres.</Case>
      </ul>
      {/* C'est la feuille du lecteur le plus isolé du fichier — personne autour de
          lui ne lui a jamais rien expliqué — et le rendez-vous chez le notaire est
          la seule action qui débloque toutes les autres. Elle mérite ses deux
          lignes, comme dans plan-en-1-page.tsx et plan-marie-1-enfant.tsx. */}
      <div className="eviter-coupure grid gap-3">
        <Champ label="Mon notaire" indice="nom, étude, téléphone" />
        <Champ label="Rendez-vous pris pour le" />
        <Champ label="Décidé le" indice="jour / mois / année" />
      </div>

      {/* Cette feuille est imprimée, séparée du lot, rangée dans un classeur et
          relue des mois plus tard — parfois par un enfant qui n'a jamais vu le
          site. L'avertissement doit être sur la DERNIÈRE feuille, pas seulement
          au milieu du document. */}
      <p className="text-[0.9rem]">
        Ce plan est un plan de travail, pas un acte. Aucune de ces opérations n&apos;existe tant
        qu&apos;elle n&apos;est pas passée devant notaire, et aucun modèle de clause bénéficiaire
        n&apos;a de valeur tant qu&apos;il n&apos;a pas été relu : à faire relire par votre notaire
        avant toute signature.
      </p>
    </Feuille>
  );
}
