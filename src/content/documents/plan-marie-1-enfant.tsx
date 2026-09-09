import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";
import { SchemaDemembrement } from "@/components/documents/Schemas";

/**
 * SITUATION 1 — MARIÉ, 1 ENFANT. Le premier des douze plans-types.
 *
 * ⚠️ C'est la situation la plus fréquente de l'avatar, et c'est aussi la plus
 * trompeuse : au premier décès il ne se passe rien — le conjoint survivant est
 * exonéré (art. 796-0 bis CGI) — et cette absence de facture est lue comme la
 * preuve que tout va bien. La facture arrive au SECOND décès, entière, sur un
 * enfant unique qui n'a qu'un seul abattement. Le document doit donc d'abord
 * défaire le faux soulagement, avant de proposer quoi que ce soit.
 *
 * ⚠️ LE CAS EST CELUI D'UNE COMMUNAUTÉ UNIVERSELLE AVEC ATTRIBUTION INTÉGRALE,
 * et c'est écrit noir sur blanc dans le bloc 1 et dans le bloc 2. Sans cette
 * clause, la totalité des 520 000 € ne se retrouve PAS sur la tête du survivant :
 * sous le régime légal, le conjoint opte entre l'usufruit de la totalité et le
 * quart en pleine propriété (art. 757 du Code civil), l'enfant reçoit dès le
 * premier décès et y consomme son abattement — la facture finale est très
 * inférieure. Un lecteur en communauté réduite aux acquêts qui s'attribuerait
 * les 82 194 € les porterait chez son notaire, qui les démentirait : c'est la
 * crédibilité du classeur entier qui tomberait sur ce seul mot manquant.
 *
 * ⚠️ Ne pas confondre la donation au dernier vivant (art. 1094-1 du Code civil)
 * avec la communauté universelle. La première est plafonnée par la réserve de
 * l'enfant (art. 913) et ne peut jamais tout donner en pleine propriété ; c'est
 * la seconde, un régime matrimonial, qui réunit tout sur une seule tête.
 *
 * ⚠️ L'ordre des trois dates n'est PAS l'ordre chronologique ici, et c'est le
 * cœur de ce que le lecteur achète : avec un patrimoine dominé par la
 * résidence, c'est le 71e anniversaire qui commande, parce que c'est la seule
 * échéance qui fait perdre dix points de base taxable en une nuit, sans retour
 * possible. Le compteur des 15 ans vient en dernier parce qu'avec un seul
 * enfant il n'a rien à recharger : il n'a pas démarré, et c'est la donation de
 * nue-propriété elle-même qui le met en route.
 *
 * ⚠️ LE CANON EST 82 194 € → 13 988 €, ÉCART 68 206 €. Il a été corrigé le
 * 8 septembre 2026, en même temps, dans Lp.tsx, app/page.tsx (titre et H1),
 * app/methode/page.tsx, simulateur-papier.tsx, strategie/12-chiffres-succession.md
 * et strategie/04-produit-mvp.md. S'ils divergent d'un euro, le lecteur qui a
 * rempli sa feuille au stylo le voit, et c'est toute la crédibilité du classeur
 * qui tombe. Ne recalculer ici qu'en recalculant partout.
 *
 * ⚠️ Pourquoi 13 988 € et non 13 989 €. Chaque parent consent une mutation à
 * titre gratuit distincte : elle porte son propre abattement, son propre barème,
 * et elle est arrondie à l'euro séparément (art. 1724 du CGI, qui arrondit la
 * base ET le montant de l'imposition). 6 994,35 € par parent donnent donc
 * 6 994 € par acte, et 6 994 × 2 = 13 988 €. L'ancien 13 989 € venait d'un
 * arrondi de la SOMME (13 988,70), qui ne correspond à aucune liquidation
 * réelle : le lecteur au stylo posait « 6 994 × 2 » et trouvait une faute.
 * Le tableau est donc écrit à l'euro, et le centime est expliqué SOUS le
 * tableau, avec son article — pas caché.
 *
 * ⚠️ Cette feuille sort sur QUATRE pages A4, et c'est assumé : le sous-titre ne
 * promet plus « une page ». Les blocs qui ne doivent pas se couper au milieu
 * portent `eviter-coupure` (globals.css) — sans quoi un encadré à bordure noire
 * se retrouve à cheval sur deux feuilles du classeur.
 */

/** Les lignes du barème de l'art. 777 sur 420 000 € — la part taxable de l'enfant si rien n'est fait. */
const TRANCHES_SANS_RIEN: { ligne: string; montant: string }[] = [
  { ligne: "8 072 € à 5 %", montant: "403,60 €" },
  { ligne: "4 037 € à 10 %", montant: "403,70 €" },
  { ligne: "3 823 € à 15 %", montant: "573,45 €" },
  { ligne: "404 068 € à 20 %", montant: "80 813,60 €" },
];

/** Les mêmes tranches sur 44 000 € — la part taxable côté d'UN parent après donation de la nue-propriété. */
const TRANCHES_APRES: { ligne: string; montant: string }[] = [
  { ligne: "8 072 € à 5 %", montant: "403,60 €" },
  { ligne: "4 037 € à 10 %", montant: "403,70 €" },
  { ligne: "3 823 € à 15 %", montant: "573,45 €" },
  { ligne: "28 068 € à 20 %", montant: "5 613,60 €" },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Piège 1 — Croire que la donation au dernier vivant suffit",
    texte:
      "La donation au dernier vivant — l’acte entre époux qui élargit les droits du survivant — protège votre conjoint, et c’est indispensable. Mais en présence d’un enfant elle ne peut pas tout lui donner en pleine propriété : elle ouvre trois options, plafonnées par la réserve de votre enfant (art. 1094-1 du Code civil). Ce qui réunit vraiment tout sur une seule tête, c’est la communauté universelle avec attribution intégrale — un régime matrimonial, pas une donation — et c’est elle qui fait tomber la facture entière au second décès, sur un seul abattement de 100 000 € (art. 779 du Code général des impôts).",
  },
  {
    titre: "Piège 2 — Ne donner que d’un seul côté",
    texte:
      "Si la maison est un bien commun — achetée pendant le mariage, et vous n’avez pas signé de contrat de séparation de biens —, chacun des deux parents en possède la moitié et dispose de son propre abattement de 100 000 € (art. 779 du Code général des impôts). Une donation faite par un seul parent en laisse un entier inutilisé.",
  },
  {
    titre: "Piège 3 — Attendre « d’être sûr »",
    texte:
      "Le jour du 71e anniversaire, la nue-propriété cesse d’être comptée 60 % de la valeur du bien et passe à 70 % (art. 669 du Code général des impôts). Même maison, même enfant, dix points de base taxable en plus — du jour au lendemain, et sans retour possible.",
  },
];

const QUESTIONS: string[] = [
  "Sous quel régime matrimonial sommes-nous exactement mariés, et avons-nous une donation au dernier vivant ? Qu’est-ce que chacune de ces deux choses change pour notre enfant au second décès ?",
  "Notre maison est-elle un bien commun ? Si oui, pouvons-nous en donner la nue-propriété tous les deux, chacun pour sa moitié, à notre enfant ?",
  "À nos âges — pour chacun de nous deux —, à quel pourcentage la nue-propriété serait-elle comptée aujourd’hui, et jusqu’à quelle date exactement ce pourcentage tient-il ?",
  "Faut-il prévoir une réversion d’usufruit au profit du survivant, et une clause de retour ? Après la donation, pourrons-nous encore vendre ou louer si l’un de nous doit entrer en maison de retraite ?",
];

export function PlanMarie1Enfant() {
  return (
    <Feuille
      titre="Situation 1 — Marié, 1 enfant"
      sousTitre="Plan-type. Le levier prioritaire : le 71e anniversaire. Remplissez-le au stylo, puis emportez-le chez le notaire."
    >
      <SchemaDemembrement />
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="space-y-1">
        <Case>Vous êtes marié, et votre conjoint est vivant.</Case>
        <Case>Vous avez un enfant, un seul, et il est de vous deux.</Case>
        <Case>Votre logement représente la plus grosse part de ce que vous laisserez.</Case>
        <Case>
          Vous êtes mariés sous communauté universelle avec clause d’attribution intégrale au
          survivant — autrement dit, tout votre patrimoine ira au survivant.
        </Case>
      </ul>
      <p>
        Les quatre cases cochées : ce plan est le vôtre. La quatrième ne l’est pas, ou vous
        l’ignorez : lisez la suite, mais le chiffre du bloc 2 n’est pas le vôtre — faites-vous
        confirmer votre régime matrimonial avant de l’utiliser. Une autre case manque : allez voir
        le plan-type correspondant avant d’appliquer celui-ci.
      </p>

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      <p>
        Ce calcul suppose que tout revient au survivant. Sous le régime légal — la communauté
        réduite aux acquêts, celle de la plupart des couples —, votre conjoint choisit entre
        l’usufruit de la totalité et le quart en pleine propriété (art. 757 du Code civil) : votre
        enfant reçoit alors sa part dès le premier décès et y utilise son abattement, et le total
        est plus faible. Vérifiez votre régime avant d’utiliser ce chiffre.
      </p>
      <p>
        Au premier décès, il ne se passe rien : le conjoint survivant marié ne paie aucun droit de
        succession. C’est cette absence de facture qui rassure, et c’est elle qui coûte cher. Tout
        le patrimoine se retrouve sur une seule tête. Au second décès, il arrive d’un bloc à votre
        enfant, qui retire son abattement de 100 000 € — une fois, une seule — puis paie le barème
        par tranches.
      </p>
      <Source>
        Exonération du conjoint survivant : art. 796-0 bis du Code général des impôts. Abattement de
        100 000 € par parent et par enfant : art. 779 du même code. Barème en ligne directe : art.
        777 du même code. L’addition des quatre tranches donne 82 194,35 € : les droits
        s’arrondissent à l’euro le plus proche (art. 1724 du même code). Options du conjoint
        survivant : art. 757 du Code civil (à ne pas confondre avec l’art. 757 B du Code général des
        impôts, cité au bloc 3).
      </Source>
      <p>
        Exemple. Maison 480 000 € + épargne 40 000 € = 520 000 €. Part taxable de l’enfant : 520 000
        − 100 000 = <strong>420 000 €</strong>.
      </p>
      <div className="eviter-coupure overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left text-[0.93rem]">
          <tbody>
            {TRANCHES_SANS_RIEN.map((t) => (
              <tr key={t.ligne}>
                <td className="border border-black px-2 py-1.5">{t.ligne}</td>
                <td className="border border-black px-2 py-1.5 text-right">{t.montant}</td>
              </tr>
            ))}
            <tr>
              <td className="border border-black px-2 py-1.5 font-bold">À payer par l’enfant</td>
              <td className="border border-black px-2 py-1.5 text-right font-bold">82 194 €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        En argent, au dépôt de la déclaration — six mois après le décès s’il a lieu en France
        métropolitaine, douze mois dans les autres cas (art. 641 et 1701 du Code général des
        impôts). Le paiement peut être étalé, sur un an, ou sur trois ans quand la succession est
        surtout immobilière, avec intérêts (art. 1717 du même code) : demandez-le à votre notaire.
        Reste qu’un enfant sans trésorerie finit le plus souvent par vendre.
      </p>
      <Champ label="Ce que paierait mon enfant aujourd’hui" indice="Facture Invisible, encadré F" />

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      <ol className="eviter-coupure space-y-2">
        <li>
          <strong>1er — Le 71e anniversaire.</strong> Celui du plus âgé des deux d’abord : c’est la
          première échéance. Tant qu’il n’est pas atteint, la nue-propriété — les murs, sans l’usage
          — est comptée 60 % de la valeur du bien ; à partir de ce jour-là, 70 % (art. 669 du Code
          général des impôts). Mais chaque moitié est comptée à l’âge de celui qui la donne : si
          l’un de vous n’a pas encore 71 ans, sa moitié reste à 60 % jusqu’à son propre
          anniversaire. Notez les deux dates. Comme votre logement pèse le plus lourd, c’est cette
          échéance-là qui commande le reste.
        </li>
        <li>
          <strong>2e — Le 70e anniversaire.</strong> Ce qui compte, c’est votre âge au jour de
          chaque versement, pas la date d’ouverture du contrat. Les sommes versées avant 70 ans
          gardent leur abattement de 152 500 € par bénéficiaire (art. 990 I du Code général des
          impôts). Celles versées après ne sont taxées que pour la part des versements qui dépasse
          30 500 €, tous contrats et tous bénéficiaires confondus — les intérêts qu’elles
          produisent, eux, restent hors droits (art. 757 B du même code). C’est la date qui décide
          du sort de votre épargne, pas de votre maison.
        </li>
        <li>
          <strong>3e — Le compteur des 15 ans.</strong> Ici, il n’y a rien à recharger : le compteur
          n’a pas encore démarré. C’est la donation de nue-propriété elle-même qui le met en route,
          et il rendra l’abattement de 100 000 € par parent de nouveau disponible quinze ans plus
          tard (art. 779 et 784 du Code général des impôts). Il repart ensuite à chaque donation
          déclarée : au moment de transmettre, on rappelle celles des quinze dernières années.
          Entre-temps l’abattement est consommé — si le décès survient avant les quinze ans, il ne
          protège plus ce qui reste à transmettre.
        </li>
      </ol>
      <p>
        Cet ordre n’est pas le même pour tout le monde : il suit la composition de votre patrimoine,
        pas votre âge. Si votre épargne dépasse votre immobilier, le 70e anniversaire passe devant
        le 71e.
      </p>
      <Champ
        label="Le 71e anniversaire du plus âgé de nous deux"
        indice="jour / mois / année — même s’il est passé"
      />
      <Champ label="Mon 70e anniversaire" indice="jour / mois / année" />
      <Champ label="Le 70e anniversaire de mon conjoint" indice="jour / mois / année" />
      <Champ label="Ma dernière donation déclarée" indice="ou « jamais »" />
      <Champ label="Cette date + 15 ans" indice="le jour où l’abattement redevient disponible" />

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
      <div className="eviter-coupure">
        <Encadre titre="CE QUE LA DONATION VOUS COÛTE, ET COMMENT LE BORDER">
          <p className="text-[0.93rem]">
            Après la donation, vous ne détenez plus que l’usufruit : vendre la maison exige
            désormais l’accord de votre enfant, car vous ne pouvez vendre seul que votre propre
            usufruit (art. 621 du Code civil). Un départ en maison de retraite financé par la vente
            ne se décide plus à deux, mais à trois.
          </p>
          <p className="mt-2 text-[0.93rem]">
            Et chaque parent ne se réserve l’usufruit que de SA moitié : au premier décès, cette
            moitié-là s’éteint et votre enfant devient plein propriétaire de la moitié de la maison,
            le survivant n’ayant plus l’usage que de l’autre. Pour que rien ne change pour lui, il
            faut une clause de réversion d’usufruit à son profit — exonérée entre époux (art. 796-0
            quater, qui renvoie à l’art. 796-0 bis du Code général des impôts). Sans cette clause,
            la promesse « personne n’a déménagé » n’est pas tenue.
          </p>
        </Encadre>
      </div>

      <Titre>5. Les 4 questions à poser à votre notaire</Titre>
      <ol className="eviter-coupure divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          <li key={q} className="py-2">
            <p>
              <strong>{i + 1}.</strong> {q}
            </p>
            <div className="mt-1 min-h-[36px] border-b border-black" />
          </li>
        ))}
      </ol>

      <Titre>6. Ce que ça change, en euros</Titre>
      <p>
        Même famille, mêmes 520 000 €, mais les deux parents ont 65 ans et agissent. Ils donnent
        ensemble la nue-propriété de la maison, chacun sa moitié. À 65 ans, elle est comptée 60 %
        (art. 669 du Code général des impôts) : 480 000 × 60 % = <strong>288 000 €</strong>, soit
        144 000 € donnés par chaque parent. Chacun retire son abattement de 100 000 € (art. 779) :
        il reste <strong>44 000 € taxables de chaque côté</strong>.
      </p>
      <div className="eviter-coupure overflow-x-auto">
        <table className="w-full min-w-[16rem] border-collapse text-left text-[0.93rem]">
          <tbody>
            {TRANCHES_APRES.map((t) => (
              <tr key={t.ligne}>
                <td className="border border-black px-2 py-1.5">{t.ligne}</td>
                <td className="border border-black px-2 py-1.5 text-right">{t.montant}</td>
              </tr>
            ))}
            <tr>
              <td className="border border-black px-2 py-1.5">
                Droits calculés sur la part donnée par chaque parent
              </td>
              <td className="border border-black px-2 py-1.5 text-right">6 994 €</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1.5 font-bold">
                Total, les deux parents (6 994 × 2)
              </td>
              <td className="border border-black px-2 py-1.5 text-right font-bold">13 988 €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        L’addition des quatre tranches donne 6 994,35 €. Chacun de vous deux consent une donation
        distincte : elle est liquidée et arrondie à l’euro séparément (art. 1724 du Code général des
        impôts). D’où 6 994 € par parent, et 13 988 € en tout — et non 13 988,70 €.
      </p>
      <p>
        Ces droits sont légalement dus par votre enfant (art. 1712 du Code général des impôts). Vous
        pouvez choisir de les payer à sa place, sans que cela compte comme un don supplémentaire —
        dites-le au notaire, c’est une clause de l’acte. Et ils sont payés le jour de l’acte, avant
        enregistrement (art. 1701 du même code) : pas dans vingt ans. C’est le prix de la
        différence.
      </p>
      <p>
        Si cette épargne de 40 000 € se trouve sur un contrat d’assurance-vie et qu’elle y a été
        versée avant les 70 ans du souscripteur, elle reste sous l’abattement de 152 500 € par
        bénéficiaire : aucun droit (art. 990 I du Code général des impôts). Ce document explique
        comment lire un contrat, il ne recommande ni contrat ni établissement — c’est à voir avec
        votre notaire ou votre conseiller.
      </p>
      <p>
        Et au décès des parents, l’usufruit — le droit d’habiter ou de louer, celui que vous gardez
        — s’éteint tout seul : l’enfant devient plein propriétaire sans aucun droit supplémentaire à
        payer (art. 1133 du même code). À une condition : que la donation ait été faite plus de
        trois mois avant le décès. En deçà, le fisc réintègre le bien entier dans la succession
        (art. 751 du même code). C’est la raison pour laquelle cette décision se prend en bonne
        santé, pas à la fin.
      </p>
      <Source>
        Art. 669 du Code général des impôts (barème de l’usufruit et de la nue-propriété). Art. 779
        et 777 (abattement et barème). Art. 990 I (assurance-vie, versements avant 70 ans). Art.
        1133 (l’extinction de l’usufruit ne donne ouverture à aucun impôt). Art. 751 (présomption de
        propriété sur le bien démembré). Art. 1712 (qui supporte les droits), 1701 (paiement avant
        enregistrement) et 1724 (arrondi à l’euro de la base et du montant de l’impôt).
      </Source>
      <div className="eviter-coupure">
        <Encadre>
          <p className="text-center text-[1.05rem] font-bold">
            Sur cet exemple : 82 194 € &rarr; 13 988 €
          </p>
          <p className="mt-1 text-center text-[0.93rem]">
            68 206 € de moins. Près de six fois moins. Personne n’a vendu, personne n’a déménagé.
          </p>
        </Encadre>
      </div>
      <Champ
        label="Ce que paierait mon enfant après ce plan"
        indice="à recalculer avec vos chiffres, puis à reporter sur Mon plan en une page"
      />
      <p>
        Ces chiffres sont ceux d’un exemple : 480 000 € de logement, 40 000 € d’épargne, deux
        parents de 65 ans mariés sous communauté universelle, un enfant. Ils supposent aussi que les
        valeurs ne bougent pas, qu’aucune autre donation n’a été faite dans les quinze années qui
        précèdent ni ne le sera dans les quinze qui suivent (art. 784 du Code général des impôts),
        que l’épargne est réellement disponible, et qu’aucun abattement de résidence principale ne
        s’applique au second décès — il suppose un logement occupé par le conjoint survivant ou par
        un enfant mineur ou protégé, ce qui n’est pas le cas ici (art. 764 bis du même code).
      </p>
      <p>
        Ce calcul ne compte que les droits. La donation passe par acte notarié (art. 931 du Code
        civil) : elle a ses propres frais, calculés sur la valeur en pleine propriété du bien, plus
        la contribution de sécurité immobilière. Ils réduisent l’écart. Seul votre notaire peut les
        chiffrer — c’est la question 11 de la feuille des 12 questions.
      </p>
      <p>
        Refaites le calcul avec les vôtres avant d’en parler. Et faites relire l’acte envisagé par
        votre notaire : lui seul peut le rédiger et le chiffrer.
      </p>

      <Titre>7. Ce que je décide aujourd’hui</Titre>
      <ul className="space-y-1">
        <Case>J’ai fait confirmer notre régime matrimonial.</Case>
        <Case>J’ai vérifié si nous avons une donation au dernier vivant.</Case>
        <Case>J’ai écrit mes dates au bloc 3 et entouré celle qui tombe en premier.</Case>
        <Case>J’ai pris rendez-vous chez le notaire, cette feuille à la main.</Case>
      </ul>
      <Champ label="Rendez-vous pris pour le" />
      <Champ label="Décidé le" />
      <Champ label="À relire le" indice="dans un an, et à chaque changement de loi" />
    </Feuille>
  );
}
