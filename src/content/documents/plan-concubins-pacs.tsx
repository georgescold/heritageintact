import { Case, Champ, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * SITUATION 5 — CONCUBINS OU PACSÉS. Plan-type de situation (upsell 1).
 *
 * ⚠️ C'est la seule des douze situations où le geste le plus rentable est aussi
 * le plus simple, et c'est tout l'intérêt de la feuille. Le concubin est traité
 * par le fisc comme un inconnu : 1 594 € d'abattement EN SUCCESSION (art. 788
 * IV du CGI, qui vise « chaque part successorale ») puis 60 % (art. 777). Le
 * partenaire de PACS, lui, ne paie rien (art. 796-0 bis). Entre les deux, il y
 * a une convention enregistrée. Le lecteur doit voir l'écart en euros avant de
 * voir le mot « PACS », sinon il classe la feuille.
 *
 * ⚠️ EN DONATION, ENTRE CONCUBINS, IL N'Y A AUCUN ABATTEMENT : 60 % dès le
 * premier euro. L'abattement de 1 594 € ne joue qu'en succession — le texte de
 * l'art. 788 IV le dit lui-même. Écrire « 60 % au-delà de 1 594 € » pour une
 * donation est faux, et c'est l'erreur que cette feuille faisait.
 *
 * ⚠️ Le piège central n'est pas fiscal, il est civil : le PACS exonère mais ne
 * rend pas héritier. Un couple pacsé sans testament, c'est une exonération de
 * 60 % appliquée à zéro euro. Les deux gestes vont ensemble, et la feuille ne
 * les sépare jamais.
 *
 * ⚠️ Pourquoi le 70e anniversaire passe devant le compteur des 15 ans ici :
 * le compteur de l'art. 779 ne concerne que la ligne directe, il ne sert donc
 * pas le couple, seulement les enfants. L'assurance-vie de l'art. 990 I, elle,
 * atteint n'importe quel bénéficiaire nommé quel que soit le lien — et elle se
 * ferme au 70e anniversaire (art. 757 B). L'ordre des dates change avec la
 * situation : c'est exactement ce que le lecteur achète.
 *
 * ⚠️ LES DEUX DATES DE L'ASSURANCE-VIE NE SONT PAS DES CONDITIONS D'ACCÈS, CE
 * SONT DES DATES D'ENTRÉE EN VIGUEUR, ET ELLES JOUENT EN FAVEUR DES VIEUX
 * CONTRATS. L'art. 757 B ne vise que les contrats souscrits à compter du
 * 20 novembre 1991 : un contrat plus ancien y échappe entièrement, primes
 * versées après 70 ans comprises. L'art. 990 I, lui, ne se déclenche pas sur la
 * date de souscription mais sur celle de chaque VERSEMENT — les sommes
 * correspondant aux primes versées avant le 13 octobre 1998 échappent à tout
 * prélèvement. Sur une cible de 65 à 85 ans, qui détient massivement des
 * contrats des années 1980-1990, présenter 1991 comme une condition d'accès
 * faisait abandonner son meilleur levier au lecteur que la loi traite le mieux.
 *
 * ⚠️ POURQUOI DEUX <Feuille>, ET POURQUOI LE SOUS-TITRE NE PROMET PAS « UNE
 * PAGE ». Quinze lignes à remplir au stylo (44 px chacune, soit 175 mm à elles
 * seules) et six cases (36 px) : à 12 pt, sur les 261 mm de hauteur utile d'un
 * A4 (297 − 2 × 18 mm de marge au @page), dont l'en-tête et le pied de feuille
 * prennent déjà une quarantaine de millimètres, ce plan sort sur deux à trois
 * pages quoi qu'on fasse au texte. On peut resserrer la prose, on ne peut pas
 * supprimer les lignes à remplir — elles SONT le produit. D'où la coupure après
 * le point 4, à l'endroit exact où plan-marie-2-enfants.tsx coupe : `.feuille`
 * porte un `break-before: page` en `@media print`, donc chaque <Feuille> repart
 * en tête de page avec son en-tête, son titre et sa mention légale. Une seule
 * <Feuille> ne les imprimait qu'en page 1 — et les pages 2 et 3, séparées et
 * rangées dans un classeur, en partaient sans.
 *
 * ⚠️ LE GABARIT DE CALCUL DU POINT 6 NE VAUT QUE POUR UN CONCUBIN. Le titre
 * annonce deux publics, le calcul n'en sert qu'un : un lecteur pacsé qui remplit
 * A, B et C au stylo sort avec un montant de droits qu'il ne doit pas (art.
 * 796-0 bis), sur la feuille même qui devait le rassurer, et il l'emporte chez
 * le notaire. D'où l'étiquette « si vous n'êtes PAS pacsé », le chapeau et la
 * ligne pour l'autre moitié du public, tous les trois DANS le bloc protégé : la
 * bifurcation doit être là où le stylo est, pas trois pages plus haut.
 *
 * ⚠️ Les blocs qui ne doivent surtout pas être coupés par la césure portent
 * `eviter-coupure` : `break-inside: avoid` posé sur `.feuille` entière est
 * inopérant dès que le bloc dépasse une page, et la coupure tomberait alors au
 * milieu d'une ligne à remplir ou d'un gabarit de calcul.
 *
 * ⚠️ Tous les séparateurs de milliers et tous les espaces devant € et % sont
 * des espaces fines insécables (U+202F). Sur une feuille annotée au stylo et
 * relue des mois plus tard, parfois par un enfant qui n'a jamais vu le site, un
 * « 152 » resté seul en fin de ligne n'est pas rattrapable.
 *
 * ⚠️ Les points 2 et 3 restent séparés, malgré l'apparence de doublon sur le
 * chiffre de 60 %. Ils ne parlent pas de la même chose : le point 2 traite la
 * SUCCESSION (1 594 € puis 60 %), la date n° 2 traite la DONATION (aucun
 * abattement, 60 % dès le premier euro). Les fondre ferait exactement l'erreur
 * que cette feuille vient de corriger.
 *
 * ⚠️ Hors du scénario chiffré du point 6 (Monsieur / Madame, qui est un exemple
 * nommé), rien n'est genré : la lectrice de 72 ans est aussi souvent
 * l'acheteuse que le survivant, et elle doit pouvoir remplir sa feuille.
 *
 * ⚠️ Aucun contrat, aucun assureur, aucune banque n'est nommé (contrainte CIF).
 * On explique quoi vérifier dans un contrat DÉJÀ EN PLACE, jamais lequel
 * souscrire. La colonne du tableau du point 6 s'intitule pour cette raison « Ce
 * qui existe au jour du décès » et non « Ce qui est signé » : sous l'ancien
 * en-tête, la ligne 4 — pourtant rédigée en lecture de contrat existant — se
 * lisait comme une option à souscrire. C'était le seul point d'entrée d'une
 * réclamation de toute la feuille.
 */

/** Les trois dates dans l'ordre propre à cette situation, motif des feuilles sœurs. */
const DATES: { titre: string; texte: string; source: string }[] = [
  {
    titre: "1re — votre 70e anniversaire",
    texte:
      "Le seul levier qui ne demande, en principe, l’accord de personne — sauf si le bénéficiaire actuel a accepté le bénéfice du contrat : la clause ne peut alors plus être changée sans lui, vérifiez-le auprès de votre assureur. Avant 70 ans : 152 500 € sans droits par bénéficiaire nommé, quel que soit son lien avec vous, et pour l’ensemble de vos contrats — pas par contrat ; au-delà, 20 % sur la fraction taxable jusqu’à 700 000 € par bénéficiaire, puis 31,25 %. Après 70 ans : seules les primes versées comptent, sous un abattement global de 30 500 €, tous contrats et tous bénéficiaires confondus ; la part qui dépasse est taxée selon le lien — 60 % pour un concubin. Les intérêts produits par ces primes restent exonérés. Ce qui compte n’est pas seulement la date d’ouverture du contrat, c’est la date de chaque versement : les sommes correspondant aux primes versées avant le 13 octobre 1998 échappent à tout prélèvement (art. 990 I). Et si votre contrat a été souscrit avant le 20 novembre 1991, l’article 757 B ne s’y applique pas — même les primes versées après vos 70 ans n’y sont pas soumises. Demandez à votre assureur, par écrit, la date de souscription et le détail des versements.",
    source:
      "Art. 990 I du CGI avant 70 ans — il ne vise que les sommes correspondant aux primes versées à compter du 13 octobre 1998. Art. 757 B du CGI après 70 ans — il ne vise que les contrats souscrits à compter du 20 novembre 1991. Acceptation du bénéficiaire : art. L. 132-9 du Code des assurances.",
  },
  {
    titre: "2e — le compteur des 15 ans",
    texte:
      "Il ne sert pas votre couple : les 100 000 € rechargeables tous les quinze ans ne valent qu’entre parent et enfant. Entre concubins, donner de son vivant coûte 60 % dès le premier euro : il n’existe aucun abattement en donation, l’abattement de 1 594 € ne jouant qu’en succession. Entre partenaires de PACS, une donation a 80 724 € d’abattement, mais reste taxée au-delà — alors que la succession, elle, ne l’est pas. Ce compteur sert vos enfants, pas votre couple.",
    source:
      "Art. 779 et 784 du CGI. Donation entre concubins : aucun abattement, art. 777 du CGI — l’art. 788 IV ne vise que « chaque part successorale ». Donation entre partenaires de PACS : art. 790 F du CGI.",
  },
  {
    titre: "3e — votre 71e anniversaire",
    texte:
      "Elle ne concerne le couple que s’il y a de l’immobilier et des enfants : la nue-propriété — un bien dont on n’a ni l’usage ni les loyers — compte pour 60 % de sa valeur avant 71 ans, 70 % de 71 à 80 ans, 80 % de 81 à 90 ans. Si vos enfants doivent hériter d’un logement, cette date remonte en 2e.",
    source: "Art. 669 du CGI, dont le barème avance par tranches de dix ans.",
  },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "1. Croire que le PACS suffit",
    texte:
      "Il supprime l’impôt (art. 796-0 bis du CGI) ; il ne rend pas héritier. Sans testament, une exonération totale s’applique à zéro euro.",
  },
  {
    titre: "2. La clause bénéficiaire qui dit « mon conjoint » ou « mes héritiers »",
    texte:
      "« Mon conjoint » veut dire l’époux : un concubin, même après trente ans, n’en est pas un. « Mes héritiers » renvoie à ceux qui recueilleront votre succession, en proportion de leurs parts — c’est un terme que le juge doit interpréter après votre mort, et une interprétation, ce n’est pas une certitude. La loi demande que le bénéficiaire soit « suffisamment défini […] pour pouvoir être identifié » (art. L. 132-8 du Code des assurances) : il faut les quatre lignes du point 1, écrites en toutes lettres.",
  },
  {
    titre: "3. Laisser par testament plus qu’on ne peut",
    texte:
      "Si vous avez des enfants, une part leur revient de droit : la réserve (art. 913 du Code civil). Un testament qui la dépasse est réduit. L’assurance-vie, elle, est hors succession — l’argent va directement au bénéficiaire nommé, il ne passe pas par le partage (art. L. 132-12 du Code des assurances) — et elle n’est soumise ni au rapport, ni à la réduction pour atteinte à la réserve (art. L. 132-13 al. 1), sauf primes manifestement exagérées eu égard à vos facultés (art. L. 132-13 al. 2).",
  },
];

const QUESTIONS: string[] = [
  "Si je décède demain en l’état, qu’est-ce que la personne nommée au point 1 reçoit exactement, et combien paie-t-il ou elle — en euros ?",
  "Peut-il ou elle rester dans le logement, et pendant combien de temps ? Que faut-il signer aujourd’hui pour que ce soit certain ?",
  "Mon testament est-il valable en l’état, respecte-t-il la part réservée à mes enfants, et le déposez-vous au fichier central des dernières volontés ?",
];

/**
 * Les quatre issues du même euro, dans l'ordre croissant de ce qui reste.
 *
 * ⚠️ Les lignes 3 et 4 donnent le même triplet, et c'est le cœur de la feuille :
 * ce sont DEUX routes différentes vers le même résultat. La 4e est étiquetée
 * « sans PACS » parce que c'est elle qui démontre la thèse — l'art. 990 I
 * atteint n'importe quel bénéficiaire nommé, quel que soit le lien. Non
 * étiquetée, elle se lisait comme une variante de la 3e et l'argument se
 * perdait.
 */
const COMPARATIF: { situation: string; recoit: string; paie: string; reste: string }[] = [
  { situation: "Rien de signé", recoit: "0 €", paie: "—", reste: "0 €" },
  {
    situation: "Concubinage — testament seul",
    recoit: "152 500 €",
    paie: "90 543,60 €",
    reste: "61 956,40 €",
  },
  { situation: "PACS + testament", recoit: "152 500 €", paie: "0 €", reste: "152 500 €" },
  {
    situation:
      "Concubinage, sans PACS — contrat d’assurance-vie déjà en place, primes versées avant 70 ans, clause à son nom",
    recoit: "152 500 €",
    paie: "0 €",
    reste: "152 500 €",
  },
];

export function PlanConcubinsPacs() {
  return (
    <>
      <Feuille
        titre="Situation 5 — Concubins ou pacsés (feuille 1 sur 2)"
        sousTitre="Votre plan-type. À remplir au stylo, puis à emporter chez le notaire."
      >
        <Titre>1. Vous êtes dans ce cas si…</Titre>
        <ul className="space-y-1">
          <Case>Nous vivons ensemble depuis des années, sans être mariés, et sans PACS.</Case>
          <Case>
            Nous sommes pacsés, depuis le
            {/* 11 rem ≈ 47 mm, la largeur « moyen » de lettre-modification-clause.tsx :
                c'est la place d'une date écrite à la main. Les 2 rem de `px-8` qui
                étaient ici n'en laissaient que 17, et c'était le seul blanc de la
                feuille à ne pas passer par `Champ` — donc le seul à ne pas avoir les
                44 px prévus pour une main de 75 ans. */}
            <span aria-hidden className="ml-1 inline-block w-[11rem] border-b border-black" />
          </Case>
        </ul>
        <p className="text-[0.93rem]">
          Une seule de ces deux cases est la vôtre — cochez-la. Dans les deux cas, ce plan est le
          vôtre, mais le calcul du point 6 ne se remplit que si vous n&apos;êtes pas pacsés.
        </p>
        {/* Le lien entre ces quatre lignes et la clause bénéficiaire était trente
            lignes plus bas, dans le piège n° 2. Or on remplit une feuille de haut
            en bas : sans cette phrase, le lecteur remplissait quatre cases à
            l'aveugle, et l'enfant qui ouvre le classeur six mois plus tard voyait
            quatre lignes d'état civil sans savoir à quoi elles servent. */}
        <p className="text-[0.93rem]">
          Ces quatre lignes sont le texte exact à faire écrire dans votre clause bénéficiaire et
          dans votre testament. Un prénom seul ne suffit pas : recopiez-les mot pour mot.
        </p>
        <div className="eviter-coupure grid gap-3">
          <Champ label="Son nom de naissance" />
          <Champ label="Ses prénoms" indice="dans l’ordre de l’acte de naissance" />
          <Champ label="Né ou née le" indice="jour, mois, année" />
          <Champ label="À" indice="commune et département" />
        </div>

        <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
        <div className="space-y-2">
          <p>
            Le concubinage n&apos;ouvre aucun droit dans une succession, et le temps n&apos;y change
            rien. Sans testament, la personne avec qui vous vivez ne reçoit rien : tout va aux
            héritiers légaux — vos enfants, à défaut vos père et mère, vos frères et sœurs ou leurs
            enfants (art. 734 et 738 du Code civil).
          </p>
          <p>
            Si vous êtes en concubinage et que le logement revient à vos héritiers, cette personne
            n&apos;a aucun titre pour y rester. Si vous êtes pacsés, elle dispose d&apos;un an de
            jouissance gratuite du logement et des meubles — le droit d&apos;y habiter et
            d&apos;utiliser les meubles sans rien payer — un an seulement, et vous pouvez même le
            lui retirer par testament. Au-delà, il faut un legs : une phrase de votre testament qui
            lui attribue nommément un bien ou une somme.
          </p>
          <p>
            Avec un testament, elle reçoit — mais au tarif d&apos;une personne sans lien de parenté
            : <strong>1 594 € d&apos;abattement, puis 60 % sur tout le reste.</strong> Sur 100 000 €
            laissés par testament, cela fait 59 043,60 € de droits, à payer dans les six mois du
            décès, en argent — sauf paiement fractionné accordé par l&apos;administration, à faire
            chiffrer par votre notaire. Le partenaire de PACS, lui, ne paie{" "}
            <strong>aucun droit de succession</strong>.
          </p>
        </div>
        <Source>
          Héritiers légaux : art. 734 et 738 du Code civil. Jouissance d&apos;un an du partenaire de
          PACS : art. 515-6 al. 3, renvoyant à l&apos;art. 763 du Code civil. Abattement de 1 594 €
          : art. 788 IV du CGI. Taux de 60 % entre personnes non parentes : art. 777. Partenaire de
          PACS exonéré : art. 796-0 bis. Délai de six mois si le décès survient en France
          métropolitaine, un an dans tous les autres cas : art. 641 du CGI. Paiement fractionné :
          art. 1717 du CGI et art. 396 de l&apos;annexe III ; paiement différé : art. 397 de la même
          annexe.
        </Source>

        <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
        <ol className="divide-y divide-black border-y border-black">
          {DATES.map((d) => (
            <li key={d.titre} className="eviter-coupure py-2">
              <p className="font-bold">{d.titre}</p>
              <p className="text-[0.93rem]">{d.texte}</p>
              <Source>{d.source}</Source>
            </li>
          ))}
        </ol>
        {/* Ces deux dates structurent toute la feuille : elles ne peuvent pas se
            retrouver à cheval sur la césure, comme les trois autres blocs de
            lignes à remplir. */}
        <div className="eviter-coupure grid gap-3">
          <Champ label="Mon 70e anniversaire tombe le" indice="jour, mois, année" />
          <Champ label="Le sien tombe le" indice="jour, mois, année" />
        </div>

        <Titre>4. Les 3 pièges de cette situation</Titre>
        <ul className="divide-y divide-black border-y border-black">
          {PIEGES.map((p) => (
            <li key={p.titre} className="eviter-coupure py-2">
              <p className="font-bold">{p.titre}</p>
              <p className="text-[0.93rem]">{p.texte}</p>
            </li>
          ))}
        </ul>
      </Feuille>

      <Feuille
        titre="Situation 5 — Concubins ou pacsés (feuille 2 sur 2)"
        sousTitre="Les questions, le chiffrage et la décision. Remplissez-la au stylo, puis emportez-la chez le notaire."
      >
        <Titre>5. Les 3 questions à poser à votre notaire</Titre>
        <ol className="divide-y divide-black border-y border-black">
          {QUESTIONS.map((q, i) => (
            /* `eviter-coupure` va sur chaque question, pas sur la liste : une
               question séparée de sa ligne de réponse est une réponse qu'on ne
               rattache plus à rien dans le classeur, mais protéger la liste
               entière la renverrait en bloc sur la page suivante. */
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

        <Titre>6. Ce que ça change, en euros</Titre>
        <p className="text-[0.95rem]">
          Monsieur a 68 ans et deux enfants d&apos;un premier mariage. Il vit avec Madame depuis
          vingt-cinq ans. Il veut qu&apos;elle reçoive <strong>152 500 €</strong> — de quoi rester
          chez elle et vivre.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-left text-[0.92rem]">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  Ce qui existe au jour du décès
                </th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">Reçoit</th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">Paie</th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  Il lui reste
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIF.map((l) => (
                <tr key={l.situation}>
                  <td className="border border-black px-2 py-1.5">{l.situation}</td>
                  <td className="whitespace-nowrap border border-black px-2 py-1.5">{l.recoit}</td>
                  <td className="whitespace-nowrap border border-black px-2 py-1.5">{l.paie}</td>
                  <td className="whitespace-nowrap border border-black px-2 py-1.5">{l.reste}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[0.93rem]">
          <strong>Le calcul de la 2e ligne :</strong> 152 500 € − 1 594 € = 150 906 € taxables ;
          × 60 % = <strong>90 543,60 €</strong> de droits. L&apos;écart avec les deux lignes
          suivantes — <strong>90 543,60 €</strong> — est ce que coûte le geste qui l&apos;efface :
          une convention enregistrée en mairie ou chez le notaire, et une feuille de papier écrite à
          la main, datée et signée.
        </p>
        <Source>
          Lignes 2 et 3 : ce qui est laissé par testament doit tenir dans la part dont Monsieur peut
          disposer librement, soit le tiers avec deux enfants (art. 913 du Code civil). Ligne 4 :
          l&apos;assurance-vie est hors succession (art. L. 132-12 du Code des assurances) et
          n&apos;est soumise ni au rapport, ni à la réduction pour atteinte à la réserve (art. L.
          132-13 al. 1), SAUF primes manifestement exagérées eu égard aux facultés du souscripteur
          (art. L. 132-13 al. 2) — à faire trancher par votre notaire au vu de votre patrimoine.
        </Source>
        {/* L'étiquette, le chapeau et la sortie « si vous êtes pacsé » sont DANS le
            bloc protégé, avec les quatre lignes : une condition restée en bas de la
            page précédente ne suit pas la feuille dans le classeur, et c'est
            exactement le lecteur pacsé qui remplirait alors A, B et C au stylo pour
            emporter chez son notaire un montant de droits qu'il ne doit pas. */}
        <div className="eviter-coupure grid gap-3">
          <p className="font-bold">
            Si vous n&apos;êtes PAS pacsé — le calcul de ce que ça lui coûte
          </p>
          <p className="text-[0.93rem]">
            Ce calcul ne vaut que si vous n&apos;êtes PAS pacsés. Entre partenaires de PACS, les
            droits de succession sont nuls (art. 796-0 bis du CGI) — la grille ci-dessous donne
            alors zéro.
          </p>
          <Champ label="A. Ce que je veux lui laisser par testament, si nous ne sommes pas pacsés" />
          <Champ label="B. A − 1 594 € =" indice="le montant taxable" />
          <Champ label="C. B × 60 % =" indice="les droits à payer" />
          <Champ label="D. A − C =" indice="ce qu’il ou elle garde vraiment" />
          <p className="text-[0.93rem]">
            <strong>Si vous êtes pacsé :</strong> C = 0 €, il ou elle garde tout — c&apos;est le
            testament qui reste à écrire.
          </p>
        </div>

        <Titre>7. Ma décision</Titre>
        <ul className="eviter-coupure space-y-1">
          <Case>
            Prendre rendez-vous en mairie ou chez le notaire pour faire enregistrer une convention
            de PACS (art. 515-3 du Code civil).
          </Case>
          <Case>
            Écrire mon testament entièrement à la main, le dater, le signer, et le faire déposer par
            mon notaire (testament olographe, art. 970 du Code civil).
          </Case>
          <Case>
            Relire la clause bénéficiaire de chaque contrat d&apos;assurance-vie déjà en place, et y
            faire écrire les quatre lignes du point 1.
          </Case>
          <Case>Refaire le calcul du point 6 avec mes propres chiffres.</Case>
        </ul>
        {/* Une case cochée sans champ en face, c'est un stylo qui reste en l'air :
            les deux premières lignes sont exactement ce que les cases ci-dessus
            demandent de retrouver, et ce qu'il faudra rouvrir dans le classeur six
            mois plus tard. */}
        <div className="eviter-coupure grid gap-3">
          <Champ
            label="Mes contrats d’assurance-vie"
            indice="compagnie, numéro, où est le contrat"
          />
          <Champ label="Rendez-vous mairie ou notaire le" indice="et avec qui" />
          <Champ label="Testament écrit et déposé le" indice="et où il est déposé" />
          <Champ label="Décidé le" indice="date, et signature" />
          <Champ label="Fait le" indice="quand les actes sont signés" />
        </div>

        <p className="text-[0.9rem]">
          Ce plan-type est un document de travail. Aucun modèle de testament ni de clause
          bénéficiaire n&apos;a de valeur tant qu&apos;il n&apos;a pas été relu par votre notaire.
        </p>
      </Feuille>
    </>
  );
}
