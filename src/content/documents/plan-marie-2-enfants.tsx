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
 * SITUATION 2 — MARIÉ, 2 ENFANTS OU PLUS (plan-type de l'étape « Le Plan familial »).
 *
 * ⚠️ CE DOCUMENT A ÉTÉ REDRESSÉ SUR UNE PRÉMISSE FAUSSE, ET ELLE PORTAIT TOUT
 * LE RESTE. Une version antérieure affirmait qu'au premier décès « l'abattement
 * de 100 000 € du parent décédé disparaît » et qu'il « n'en reste que deux sur
 * quatre ». C'est faux sous le régime légal — la communauté réduite aux
 * acquêts, celui de la grande majorité des couples. Les enfants sont
 * réservataires (art. 912 et 913 du Code civil) : ils héritent DÈS le premier
 * décès, le plus souvent de la nue-propriété quand le conjoint prend la
 * totalité en usufruit (art. 757 du Code civil), et ils y appliquent
 * l'abattement du parent décédé (art. 779 du CGI). Au second décès, l'usufruit
 * s'éteint sans aucun droit (art. 1133 du CGI). Le scénario « tout est taxé au
 * second décès sous un seul abattement » n'existe que sous communauté
 * universelle avec clause d'attribution intégrale (art. 1524 du Code civil).
 *
 * ⚠️ L'ARGUMENT DE VENTE N'EST PAS PERDU, IL EST DÉPLACÉ — et il est plus vrai.
 * L'abattement du parent décédé n'est pas perdu au premier décès : il est
 * CONSOMMÉ ce jour-là, à hauteur seulement de ce que l'enfant recueille, et ce
 * qui n'a pas servi ne se reporte pas. Ce que le lecteur perd en attendant,
 * c'est le second tour : une donation déclarée aujourd'hui utilise l'abattement
 * une première fois, et le compteur de quinze ans le rend entier pour la
 * succession (art. 784 du CGI). Ne rien faire, c'est ne l'utiliser qu'une fois.
 *
 * ⚠️ Le second fait, civil celui-là : une donation ordinaire est recomptée au
 * jour du partage, à la valeur d'alors (art. 860 du Code civil). Une
 * donation-partage fige les valeurs au jour de l'acte (art. 1078 du Code
 * civil). Avec deux enfants ou plus, c'est exactement là que naît la querelle
 * — l'un a reçu un appartement qui a doublé, l'autre des liquidités qui n'ont
 * pas bougé. Le mot « donation-partage » n'est donc pas un détail de notaire :
 * c'est le cœur du plan.
 *
 * ═══ SIX `Feuille`, ET NON DEUX ═══
 *
 * La version précédente annonçait « feuille 1 sur 2 » et sortait sur environ
 * six pages A4. Or l'en-tête (marque + titre) et le pied de page (« ne
 * constitue ni une consultation juridique… ») ne sont rendus qu'UNE fois par
 * `Feuille` : quatre pages sur six tombaient de l'imprimante sans marque, sans
 * titre et sans mention légale — exactement le voyage vers le classeur que le
 * docblock de `Feuille` dit vouloir empêcher. Découper un bloc de six pages en
 * deux ne fait pas deux pages, ça déplace un saut de page.
 *
 * Le document est donc découpé selon ce qu'il fait réellement, une chose par
 * feuille : le diagnostic · les dates · les pièges · les questions et la
 * facture actuelle · l'effet du plan · la décision. Aux conditions
 * d'impression du projet (A4, marges 18/16 mm, 12 pt, `leading-relaxed`), une
 * page tient environ 30 lignes, soit ~2 300 caractères de texte courant : le
 * texte a été resserré feuille par feuille pour s'en approcher. Ce qui déborde
 * encore de quelques lignes est protégé par `eviter-coupure`, qui empêche au
 * moins qu'un encadré, un groupe de `Champ` ou une question soit tranché en
 * deux par le saut de page.
 *
 * ═══ LES CHIFFRES ═══
 *
 * ⚠️ LES TRANCHES PORTENT LEURS CENTIMES, ET L'ARRONDI NE SE FAIT QU'UNE FOIS.
 * L'administration arrondit à l'euro la base ET le montant de l'impôt, une
 * seule fois, à la fin (art. 1724 du CGI). Additionner des tranches déjà
 * arrondies donnait 2 695 € au lieu de 2 694 € et 13 195 € au lieu de 13 194 €,
 * donc 31 780 € au lieu de 31 776 € pour la famille : le lecteur posait
 * 31 780 € sur le bureau du notaire et s'entendait donner un autre chiffre.
 * Les tableaux affichent la LARGEUR de chaque tranche, pas son plafond — un
 * lecteur qui multiplie 12 109 par 10 % et trouve 1 211 au lieu de 404 conclut
 * que le document se trompe, et il a raison de le conclure.
 *
 * ⚠️ AUCUN MILLÉSIME QUI VIEILLIT DANS L'EXEMPLE DU COMPTEUR. « Un don de 2012
 * est sorti du rappel » était faux dès la première impression : le rappel de
 * l'art. 784 est de quinze ans, un don de 2012 en sort en 2027. Le lecteur qui
 * avait donné en 2012 se croyait rechargé, redonnait, et découvrait l'addition.
 * La formule est donc relative — « il y a plus de quinze ans » — et ne peut
 * plus pourrir sur l'étagère.
 *
 * ═══ CE QU'ON N'ÉCRIT PAS ═══
 *
 * ⚠️ AUCUNE AFFIRMATION DE PLACEMENT. Le document disait de l'assurance-vie
 * qu'elle était « le seul canal qui permette d'équilibrer entre les enfants »
 * — superlatif sans article, et faux : équilibrer entre les enfants est
 * précisément ce que fait la donation-partage, sujet central de cette feuille
 * (art. 1078 du Code civil). Il ne reste que le fait vérifiable et sourcé : le
 * capital ne fait pas partie de la succession (art. L. 132-12 du Code des
 * assurances), avec sa limite (primes manifestement exagérées, art. L. 132-13),
 * et il a son propre abattement (art. 990 I du CGI). Aucun assureur, aucun
 * contrat, aucun « premier levier ».
 *
 * ⚠️ TROIS ARTICLES « 757 » COHABITENT ICI, et chaque renvoi porte donc son
 * objet : « art. 757 du Code civil — option du conjoint survivant »,
 * « art. 757 B du CGI — primes versées après 70 ans », « art. 757 du CGI —
 * dons manuels révélés ». Sans cela, le lecteur qui vérifie sur legifrance —
 * ou l'enfant qui reprend le classeur sans avoir jamais vu le site — ouvre le
 * mauvais texte, et la vérifiabilité que ce produit promet se retourne contre
 * lui.
 *
 * ⚠️ RENVOIS INTERNES EN « POINT N », pas en « bloc N » : c'est le mot employé
 * par la majorité des plans-types frères (veuf-veuve, sans-enfant,
 * patrimoine-important, immobilier-locatif, famille-recomposée). Reste
 * plan-marie-1-enfant.tsx, qui dit encore « bloc » : à aligner, le lecteur a
 * souvent les deux feuilles côte à côte.
 */

type LigneBareme = { ligne: string; montant: string };

/** Barème de l'art. 777 sur 22 500 € — la part taxable d'un enfant au premier décès. */
const TRANCHES_1ER_DECES: LigneBareme[] = [
  { ligne: "8 072 € à 5 %", montant: "403,60 €" },
  { ligne: "4 037 € à 10 %", montant: "403,70 €" },
  { ligne: "3 823 € à 15 %", montant: "573,45 €" },
  { ligne: "6 568 € à 20 %", montant: "1 313,60 €" },
];

/** Les mêmes tranches sur 75 000 € — la part taxable d'un enfant au second décès. */
const TRANCHES_2E_DECES: LigneBareme[] = [
  { ligne: "8 072 € à 5 %", montant: "403,60 €" },
  { ligne: "4 037 € à 10 %", montant: "403,70 €" },
  { ligne: "3 823 € à 15 %", montant: "573,45 €" },
  { ligne: "59 068 € à 20 %", montant: "11 813,60 €" },
];

const RECONNAISSANCE: string[] = [
  "Vous êtes marié, et vous avez deux enfants ou plus, du même couple.",
  "Vous êtes propriétaires de votre logement, et vous avez de l’épargne à côté.",
  "Vous n’avez encore rien donné, ou vous avez aidé un enfant sans le déclarer.",
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Piège 1 — Donner, mais pas en donation-partage",
    texte:
      "Un don simple est recompté, au moment du partage, à la valeur que le bien a CE jour-là — pas à celle du jour du don (art. 860 du Code civil). L’enfant qui a reçu l’appartement qui a doublé doit compenser les autres, trente ans plus tard. La donation-partage, elle, fige les valeurs au jour de l’acte (art. 1078 du Code civil) — à trois conditions : que chaque enfant reçoive sa part, décrite dans l’acte, qu’il l’accepte expressément dans l’acte, et qu’aucune réserve d’usufruit ne porte sur une somme d’argent. Faites vérifier ce dernier point si votre donation-partage comprend des liquidités.",
  },
  {
    titre: "Piège 2 — Attendre le premier décès",
    texte:
      "Au premier décès, l’abattement de 100 000 € du parent qui s’en va n’est pas perdu : il est consommé ce jour-là, à hauteur seulement de ce que l’enfant recueille — et ce qui n’a pas servi ne se reporte pas, il est perdu (art. 779 du CGI). Vous n’aurez choisi ni le moment, ni les biens, ni la valeur. En donnant de votre vivant, vous l’utilisez sur les biens que vous désignez, à la valeur d’aujourd’hui — et il redevient entier quinze ans plus tard (art. 784 du CGI). Attendre, ce n’est pas perdre un abattement : c’est n’en avoir qu’un au lieu de deux.",
  },
  {
    titre: "Piège 3 — Le virement non déclaré",
    texte:
      "Le compteur ne part que du jour où le don est déclaré ou révélé à l’administration (art. 757 du CGI — dons manuels révélés) : un virement dont rien ne prouve la date ne fait tourner aucun compteur. Une fois révélé, le don doit être déclaré dans le mois qui suit — formulaire 2735 (art. 635 A du CGI) — même s’il n’y a aucun droit à payer. Chaque année d’attente est une année de compteur qui ne tourne pas : déclarez tout de suite.",
  },
];

const QUESTIONS: string[] = [
  "Compte tenu de notre régime matrimonial, qu’est-ce qui nous appartient à tous les deux et qu’est-ce qui appartient à chacun en propre ? Pouvons-nous faire une seule donation-partage portant sur l’ensemble ?",
  "Si nous donnons ensemble la nue-propriété de notre logement, à quel pourcentage la moitié de chacun de nous serait-elle comptée aujourd’hui, et jusqu’à quelle date exactement ce pourcentage tient-il ?",
  "Si les parts de nos enfants ne sont pas de même nature — un appartement pour l’un, des liquidités pour l’autre — les valeurs sont-elles quand même figées au jour de l’acte, et que faut-il écrire pour cela ?",
];

/** Le barème imprimé, tranche par tranche. Deux colonnes : la largeur, puis l'euro. */
function TableauBareme({
  lignes,
  libelleTotal,
  total,
}: {
  lignes: LigneBareme[];
  libelleTotal: string;
  total: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[16rem] border-collapse text-left text-[0.92rem]">
        <tbody>
          {lignes.map((t) => (
            <tr key={t.ligne}>
              <td className="border border-black px-2 py-1.5">{t.ligne}</td>
              <td className="border border-black px-2 py-1.5 text-right">{t.montant}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">{libelleTotal}</td>
            <td className="border border-black px-2 py-1.5 text-right font-bold">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PlanMarie2Enfants() {
  return (
    <>
      <Feuille
        titre="Situation 2 — Marié, 2 enfants ou plus (feuille 1 sur 6)"
        sousTitre="Plan-type. Levier prioritaire : la donation-partage. Remplissez-la au stylo."
      >
        <Titre>1. Vous êtes dans ce cas si…</Titre>
        <ul className="eviter-coupure space-y-1">
          {RECONNAISSANCE.map((r) => (
            <Case key={r}>{r}</Case>
          ))}
        </ul>
        <p className="text-[0.9rem]">
          Les trois cases cochées : ce plan est le vôtre. Une seule, ou deux : lisez-le quand même,
          puis allez voir la situation qui vous ressemble le plus.
        </p>

        <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
        {/* Ce paragraphe décide si tout le reste s'applique au lecteur : il était
            en 0,9 rem — 10,8 pt à l'impression — coincé après l'encadré du
            mécanisme. Il passe en corps plein, dans un encadré, et AVANT le
            calcul qu'il conditionne. */}
        <div className="eviter-coupure">
          <Encadre titre="AVANT TOUT — SOUS QUEL RÉGIME ÊTES-VOUS MARIÉS ?">
            <p>
              Tout ce qui suit vaut sous le régime légal, la communauté réduite aux acquêts — celui
              des couples mariés sans contrat. Sous une communauté universelle avec clause
              d&apos;attribution intégrale au survivant (art. 1524 du Code civil), vos enfants
              n&apos;héritent qu&apos;au second décès et le calcul est tout autre. Demandez à votre
              notaire lequel des deux est le vôtre : c&apos;est la première question à lui poser.
            </p>
          </Encadre>
        </div>
        <p>
          Au premier décès, le conjoint survivant ne paie aucun droit : il en est exonéré (art.
          796-0 bis du CGI). Cette absence de facture rassure, et c&apos;est elle qui coûte cher.
        </p>
        <p>
          Vos enfants, eux, sont héritiers réservataires (art. 912 et 913 du Code civil) : ils
          héritent <strong>dès le premier décès</strong> — le plus souvent de la nue-propriété, la
          propriété du logement sans le droit d&apos;y habiter ni de le louer, si le conjoint prend
          la totalité en usufruit, c&apos;est-à-dire le droit de continuer à y habiter ou d&apos;en
          toucher les loyers (art. 757 du Code civil — option du conjoint survivant, ou art. 1094-1
          s&apos;il existe une donation au dernier vivant). L&apos;abattement de 100 000 € du parent
          décédé n&apos;est donc pas perdu : il est <em>consommé</em> ce jour-là, à hauteur de ce
          que la succession contient et à la valeur de ce jour-là. Vous n&apos;aurez choisi ni le
          moment, ni les biens, ni la valeur.
        </p>
        <p>Ce que vous perdez en attendant, c&apos;est le second tour.</p>
        <div className="eviter-coupure">
          <Encadre titre="LE MÉCANISME, EN UNE LIGNE">
            <p className="text-[0.93rem]">
              Deux parents, deux enfants : <strong>4 × 100 000 € d&apos;abattements</strong>{" "}
              utilisables aujourd&apos;hui — puis la même série de nouveau disponible quinze ans
              après chaque donation déclarée (art. 779 et 784 du CGI). En attendant, vos enfants
              n&apos;en utilisent qu&apos;une seule série, et pas sur les biens que vous auriez
              choisis.
            </p>
          </Encadre>
        </div>
        <Source>
          Réserve des enfants : art. 912 et 913 du Code civil. Option du conjoint survivant : art.
          757 du Code civil, art. 1094-1 en présence d&apos;une donation au dernier vivant.
          Communauté universelle : art. 1524 du Code civil. Exonération du conjoint : art. 796-0 bis
          du CGI. Abattement de 100 000 € par parent et par enfant : art. 779 du CGI. Rappel des
          donations de moins de quinze ans : art. 784 du CGI. Trois textes portent ici le numéro
          757, et ce ne sont pas les mêmes : l&apos;art. 757 du Code civil (option du conjoint
          survivant), l&apos;art. 757 B du CGI (primes d&apos;assurance-vie versées après 70 ans) et
          l&apos;art. 757 du CGI (dons manuels révélés). Chaque renvoi de ces feuilles porte donc
          son objet.
        </Source>
      </Feuille>

      <Feuille
        titre="Situation 2 — Marié, 2 enfants ou plus (feuille 2 sur 6)"
        sousTitre="Les 3 dates, dans votre ordre. Écrivez-les au stylo : ce sont les vôtres."
      >
        <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
        <p className="text-[0.95rem]">
          <strong>1re — Le compteur des 15 ans.</strong> Il passe devant tout le reste ici, parce
          qu&apos;il est le seul des trois à pouvoir jouer deux fois. Chaque donation déclarée ouvre
          son propre compteur : quinze ans après, l&apos;abattement de 100 000 € de ce parent-là,
          pour cet enfant-là, est de nouveau entier. Chaque année d&apos;attente est une année qui
          ne reviendra pas. <em>Art. 779 et 784 du CGI.</em>
        </p>
        <p className="text-[0.95rem]">
          <strong>2e — Les 71es anniversaires.</strong> Un bien commun ne se donne qu&apos;à deux
          (art. 1422 du Code civil) ; l&apos;administration retient alors que chacun de vous donne
          sa moitié, et chaque moitié est valorisée d&apos;après l&apos;âge de celui qui la donne
          (art. 669 du CGI) — faites confirmer cette ventilation par votre notaire. La nue-propriété
          vaut 60 % de la valeur du bien tant que son donateur n&apos;a pas 71 ans, et 70 % après.{" "}
          <strong>Ce sont deux dates, pas une</strong> — inscrivez les deux. La marche suivante
          tombe au 81e anniversaire : la nue-propriété est alors comptée à 80 % (art. 669 du CGI).
        </p>
        <p className="text-[0.95rem]">
          <strong>3e — Le 70e anniversaire</strong>, pour l&apos;assurance-vie : 152 500 € par
          bénéficiaire pour les versements faits avant (art. 990 I du CGI), 30 500 € au total — tous
          contrats et tous bénéficiaires confondus — pour ceux faits après (art. 757 B du CGI —
          primes versées après 70 ans). Elle vient en troisième non parce qu&apos;elle compte moins,
          mais parce qu&apos;elle n&apos;entame pas les 100 000 € de l&apos;art. 779 : le capital
          d&apos;une assurance-vie ne fait pas partie de la succession (art. L. 132-12 du Code des
          assurances), il est versé au bénéficiaire désigné sans attendre le règlement de la
          succession, et il a son propre abattement.
        </p>
        <p className="text-[0.93rem]">
          <strong>Une limite :</strong> des primes manifestement exagérées au regard de vos moyens
          peuvent être réintégrées à la succession à la demande d&apos;un héritier (art. L. 132-13
          du Code des assurances). Demandez à votre notaire où se situe la vôtre.
        </p>
        <p className="text-[0.93rem]">
          <strong>Attention :</strong> ce qui est versé <strong>après</strong> 70 ans et dépasse 30
          500 € est <strong>taxé comme s&apos;il</strong> faisait partie de la succession, et vient
          manger l&apos;abattement de 100 000 € de vos enfants (art. 757 B du CGI — primes versées
          après 70 ans) — même si le capital, lui, reste versé directement au bénéficiaire. Nous ne
          recommandons ni contrat, ni compagnie : nous vous apprenons à lire celui que vous avez
          déjà.
        </p>
        <p className="text-[0.9rem]">
          <strong>Pourquoi cet ordre n&apos;est pas celui de tout le monde :</strong> chez un veuf
          ou une veuve, l&apos;abattement du conjoint a déjà servi au premier décès ; un couple sans
          enfant n&apos;a aucun abattement de 100 000 €, et l&apos;assurance-vie y est le seul
          encore ouvert. L&apos;ordre dépend des abattements encore ouverts, pas de l&apos;âge.
        </p>
        {/* Quatre dates, quatre lignes. « Nos 70 ans, le mien puis celui de mon
            conjoint » demandait deux dates sur un seul trait de 44 px, trois
            lignes après avoir écrit en gras « Ce sont deux dates, pas une ». */}
        <div className="eviter-coupure grid gap-3">
          <Champ
            label="Le 71e anniversaire du plus âgé de nous deux"
            indice="jour / mois / année"
          />
          <Champ
            label="Le 71e anniversaire du plus jeune"
            indice="l’autre moitié du bien bascule ce jour-là — art. 669 du CGI"
          />
          <Champ label="Mon 70e anniversaire" indice="jour / mois / année" />
          <Champ label="Le 70e anniversaire de mon conjoint" indice="jour / mois / année" />
        </div>
        <Source>
          Compteur des 15 ans : art. 779 et 784 du CGI. Barème de l&apos;usufruit et de la
          nue-propriété : art. 669 du CGI. Consentement des deux époux pour donner un bien commun :
          art. 1422 du Code civil. Assurance-vie : art. 990 I du CGI, art. 757 B du CGI — primes
          versées après 70 ans, art. L. 132-12 et L. 132-13 du Code des assurances.
        </Source>
      </Feuille>

      <Feuille
        titre="Situation 2 — Marié, 2 enfants ou plus (feuille 3 sur 6)"
        sousTitre="Les 3 pièges de cette situation. Ce sont ceux que l’on ne voit qu’après."
      >
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
        <Source>
          Rapport des donations à la succession : art. 860 du Code civil. Donation-partage et gel
          des valeurs : art. 1078 du Code civil. Abattement et rappel des quinze ans : art. 779 et
          784 du CGI. Dons manuels révélés à l&apos;administration : art. 757 du CGI — dons manuels
          révélés. Déclaration dans le mois qui suit la révélation, formulaire 2735 : art. 635 A du
          CGI.
        </Source>
      </Feuille>

      <Feuille
        titre="Situation 2 — Marié, 2 enfants ou plus (feuille 4 sur 6)"
        sousTitre="Les questions à poser, et ce que vos enfants paieraient si rien n’était fait."
      >
        <Titre>5. Les 3 questions à poser à votre notaire</Titre>
        <ol className="divide-y divide-black border-y border-black">
          {QUESTIONS.map((q, i) => (
            /* `eviter-coupure` est posé sur chaque question, pas sur la liste :
               une question séparée de sa ligne de réponse est inutilisable au
               rendez-vous, mais protéger le bloc entier le renverrait en entier
               sur la feuille suivante. */
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

        <Titre>6. Ce que ça change, en euros</Titre>
        <p className="text-[0.93rem]">
          Un couple marié sous le régime légal, deux enfants, 700 000 € de patrimoine commun — donc
          350 000 € à chacun. Le conjoint survivant a 75 ans au premier décès et prend la totalité
          en usufruit (art. 757 du Code civil — option du conjoint survivant).
        </p>

        <div className="eviter-coupure space-y-2">
          <Encadre titre="SANS RIEN FAIRE — au premier décès">
            <p className="text-[0.93rem]">
              Succession du parent qui s&apos;en va : 350 000 €. Les enfants recueillent la
              nue-propriété, comptée 70 % à 75 ans (art. 669 du CGI) : 245 000 €, soit{" "}
              <strong>122 500 € par enfant</strong>. Moins l&apos;abattement de 100 000 € (art. 779
              du CGI) : <strong>22 500 € taxés</strong>.
            </p>
          </Encadre>
          <TableauBareme
            lignes={TRANCHES_1ER_DECES}
            libelleTotal="Par enfant, au premier décès"
            total="2 694 €"
          />
        </div>

        <div className="eviter-coupure space-y-2">
          <Encadre titre="SANS RIEN FAIRE — au second décès">
            <p className="text-[0.93rem]">
              L&apos;usufruit s&apos;éteint tout seul, sans aucun droit à payer (art. 1133 du CGI).
              Les enfants recueillent les 350 000 € du survivant :{" "}
              <strong>175 000 € par enfant</strong>, moins 100 000 € ={" "}
              <strong>75 000 € taxés</strong>.
            </p>
          </Encadre>
          <TableauBareme
            lignes={TRANCHES_2E_DECES}
            libelleTotal="Par enfant, au second décès"
            total="13 194 €"
          />
          <p className="text-[0.93rem]">
            <strong>15 888 € par enfant, soit 31 776 € pour la famille.</strong>
          </p>
          <p className="text-[0.9rem]">
            Les tranches portent leurs centimes pour que vous puissiez refaire l&apos;addition, et
            le résultat n&apos;est arrondi qu&apos;une fois, à la fin, comme le fait
            l&apos;administration (art. 1724 du CGI) : 2 694,35 € donnent 2 694 €, et 13 194,35 €
            donnent 13 194 €.
          </p>
        </div>
      </Feuille>

      <Feuille
        titre="Situation 2 — Marié, 2 enfants ou plus (feuille 5 sur 6)"
        sousTitre="Ce que change une donation-partage signée aujourd’hui — et ce que le calcul ne comprend pas."
      >
        <Titre>6. Ce que ça change, en euros (suite)</Titre>
        <div className="eviter-coupure">
          <Encadre titre="AVEC LE PLAN — une donation-partage aujourd’hui, à deux">
            <ul className="space-y-1 text-[0.93rem]">
              <li>
                Donation-partage des deux parents ensemble : 100 000 € par parent et par enfant,
                soit 4 × 100 000 € = <strong>400 000 € transmis, 0 € de droits</strong> (art. 779 du
                CGI).
              </li>
              <li>Reste 300 000 € de patrimoine commun, soit 150 000 € à chacun.</li>
              <li>
                Premier décès, plus de quinze ans après le don : le compteur est rechargé (art. 784
                du CGI). Nue-propriété comptée 70 % de 150 000 € = 105 000 €, soit 52 500 € par
                enfant — sous l&apos;abattement : <strong>0 €</strong>.
              </li>
              <li>
                Second décès : l&apos;usufruit s&apos;éteint sans droits (art. 1133 du CGI), et les
                150 000 € du survivant font 75 000 € par enfant — sous l&apos;abattement :{" "}
                <strong>0 €</strong>.
              </li>
              <li>
                <strong>0 € pour la famille, dans cet exemple.</strong> Les vôtres donneront un
                autre chiffre : c&apos;est le mécanisme qu&apos;il faut retenir, pas le montant.
              </li>
              <li>
                Exemple calculé en <strong>pleine propriété</strong>. En nue-propriété, ces 400 000
                € d&apos;abattements couvrent un bien d&apos;environ 667 000 € tant qu&apos;aucun de
                vous deux n&apos;a 71 ans, contre 571 000 € une fois que vous les avez tous les deux
                passés. Entre les deux, chaque moitié se compte séparément (art. 669 du CGI) — votre
                notaire fera le calcul exact. Et vous gardez l&apos;usage du logement.
              </li>
            </ul>
          </Encadre>
        </div>

        <div className="eviter-coupure">
          <Encadre>
            <p className="text-center text-[1.05rem] font-bold">31 776 € &rarr; 0 €</p>
            <p className="mt-1 text-[0.93rem]">
              <strong>Écart : 31 776 €</strong>, pour un acte signé une seule fois. Si l&apos;un de
              vous deux décède moins de quinze ans après la donation, les 400 000 € déjà donnés se
              rajoutent au calcul de sa succession (art. 784 du CGI) : l&apos;économie est alors
              plus faible, mais elle n&apos;est jamais négative. Ce calcul ne comprend ni les frais
              de l&apos;acte, ni la taxe versée à l&apos;État pour son enregistrement — ce que le
              notaire appelle la publicité foncière. Demandez-lui ce qu&apos;ils représentent dans
              votre cas, et comparez avant de décider.
            </p>
          </Encadre>
        </div>
        <Source>
          Abattement : art. 779 du CGI. Rappel des donations de moins de quinze ans : art. 784 du
          CGI. Tarif en ligne directe : art. 777 du CGI. Arrondi à l&apos;euro de la base et du
          montant de l&apos;impôt : art. 1724 du CGI. Barème de la nue-propriété : art. 669 du CGI.
          Exonération du conjoint : art. 796-0 bis du CGI. Extinction de l&apos;usufruit sans impôt
          : art. 1133 du CGI. Option du conjoint survivant : art. 757 du Code civil — et non
          l&apos;art. 757 du CGI, ni l&apos;art. 757 B.
        </Source>
        <p className="text-[0.9rem]">
          Ces chiffres sont ceux d&apos;un exemple : 700 000 € de patrimoine commun, régime légal,
          deux enfants, un conjoint survivant de 75 ans qui prend la totalité en usufruit, ni frais
          d&apos;acte, ni assurance-vie, ni bien à l&apos;étranger. Refaites le calcul avec les
          vôtres avant d&apos;en parler. Votre notaire le refera sur vos chiffres.
        </p>
      </Feuille>

      <Feuille
        titre="Situation 2 — Marié, 2 enfants ou plus (feuille 6 sur 6)"
        sousTitre="Vos chiffres et votre décision. Remplissez-la au stylo, puis emportez-la chez le notaire."
      >
        <Titre>7. Nos chiffres, et notre décision</Titre>
        {/* L'encadré F de la Feuille s'intitule « VOTRE FACTURE
            INVISIBLE, PAR ENFANT » : la case qui le recopie doit donc être au
            singulier, et la multiplication demandée sur sa propre ligne. */}
        <div className="eviter-coupure grid gap-3">
          <Champ label="Notre patrimoine commun, estimé" />
          <Champ
            label="Nos abattements encore ouverts"
            indice="2 parents × nombre d’enfants × 100 000 € — art. 779 du CGI"
          />
          <Champ label="Ce que paierait chaque enfant aujourd’hui" indice="Feuille, encadré F" />
          <Champ label="× notre nombre d’enfants = pour la famille" />
          <Champ label="Ce que paierait chaque enfant après la donation-partage" />
          <Champ
            label="Le bien que nous comptons donner en donation-partage"
            indice="et sa valeur estimée"
          />
        </div>
        <p className="text-[0.9rem]">
          Un compteur de quinze ans <strong>par don</strong>, pas un seul pour tous (art. 784 du
          CGI). Un don déclaré il y a plus de quinze ans est sorti du rappel ; un don de 2022 y
          reste jusqu&apos;en 2037.
        </p>
        <TableauVierge
          colonnes={["Date du don déclaré", "À quel enfant", "Compteur rechargé le (+ 15 ans)"]}
          lignes={3}
        />
        <ul className="eviter-coupure space-y-1">
          <Case>Nous avons écrit nos dates au point 3 et entouré celle qui tombe en premier.</Case>
          <Case>Nous avons refait le calcul du point 6 avec nos chiffres.</Case>
          <Case>
            Nous demandons à notre notaire un rendez-vous <strong>« donation-partage »</strong> — ce
            mot-là, pas « une donation ».
          </Case>
        </ul>
        <div className="eviter-coupure grid gap-3">
          <Champ label="Rendez-vous pris pour le" />
          <Champ label="Décidé le" />
          <Champ label="À relire le" indice="dans un an, et à chaque changement de loi" />
        </div>

        <p className="text-[0.9rem]">
          L&apos;acte de donation-partage envisagé ici est à faire relire par votre notaire avant
          signature : lui seul peut le rédiger et le chiffrer.
        </p>
      </Feuille>
    </>
  );
}
