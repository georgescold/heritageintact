import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * LA LETTRE POUR MODIFIER VOTRE CLAUSE BÉNÉFICIAIRE (upsell 2).
 *
 * ⚠️ Ce document existe parce que la clause bénéficiaire est le levier de
 * transmission qui se corrige le plus vite : un écrit signé de votre main
 * suffit, sans acte, sans frais et sans délai d'attente (art. L. 132-8 du code
 * des assurances). C'est aussi le seul qui ne se corrige QUE par écrit — un
 * appel téléphonique ne laisse aucune trace opposable le jour où il faudra
 * prouver ce qui a été demandé, et à quelle date. La feuille est donc construite
 * autour d'un seul objet : une lettre que le lecteur recopie et poste.
 *
 * ⚠️ CE QUI A ÉTÉ REDRESSÉ EN DROIT, et qu'il ne faut pas réintroduire :
 *   1. Ce n'est PAS le nom écrit dans la clause qui déclenche l'art. 990 I
 *      plutôt que l'art. 757 B : c'est la DATE de chaque versement par rapport
 *      au 70e anniversaire. `decision-70-ans` porte la même règle, en titre
 *      d'encadré. Deux feuilles du même classeur ne peuvent pas se contredire.
 *      Le nom, lui, décide du NOMBRE DE FOIS que l'abattement se compte.
 *   2. Les deux assiettes ne sont pas la même. L'art. 990 I frappe ce qui est dû
 *      au bénéficiaire à raison du décès — versements ET gains ; l'art. 757 B ne
 *      compte que les versements postérieurs à 70 ans, les gains restant hors
 *      droits de succession.
 *   3. L'abattement de 152 500 € se compte par bénéficiaire, TOUS CONTRATS
 *      CONFONDUS, et il est suivi de 20 % puis 31,25 % au-delà de 700 000 €.
 *      L'écrire sans son plafond fait conclure à une exonération sans limite.
 *   4. Aucune exigence de forme n'est inventée. Aucun texte n'impose de forme à
 *      la demande, ni n'oblige l'assureur à délivrer un avenant : on demande
 *      l'avenant dans la lettre, on ne le présente pas comme un dû.
 *
 * ⚠️ AUCUN ASSUREUR, AUCUN CONTRAT, AUCUN SUPPORT N'EST NOMMÉ ICI, aucune clause
 * n'est recommandée, et les deux questions de frais qui figuraient dans le
 * courrier en ont été retirées : elles font double emploi avec la grille d'audit
 * et invitaient à comparer des contrats, ce qui est du conseil en investissement
 * réservé au statut CIF (art. L. 541-1 du code monétaire et financier). Effet
 * pratique en plus : un recommandé ne porte plus qu'un seul objet, il n'est donc
 * pas éclaté entre deux services. On donne le véhicule — la lettre — pas la
 * destination.
 *
 * ⚠️ QUATRE `Feuille`, ET C'EST VOLONTAIRE, sur le modèle de
 * `trois-clauses-beneficiaires` et de `grille-audit-assurance-vie`. En un seul
 * bloc le document dépassait trois pages A4 (12 pt imposé par `globals.css`,
 * environ 261 mm de hauteur imprimable) et le modèle de lettre en occupait une à
 * lui seul : or `.feuille { break-inside: avoid }` ne peut rien pour une boîte
 * plus haute qu'une page — la coupure tombait au hasard, le plus souvent au
 * milieu des lignes où le lecteur recopie sa clause. Feuille 1 = ce qu'on
 * vérifie avant d'écrire ; feuille 2 = la lettre seule, la page qu'il pose sur
 * la table pour recopier ; feuille 3 = le mode d'emploi, qui remplit une page à
 * lui seul ; feuille 4 = le suivi, la seule qui se range remplie. Chaque bloc
 * porte en plus `eviter-coupure`, parce qu'aucune des quatre ne tient au
 * millimètre près et que le découpage seul ne suffit pas.
 *
 * ⚠️ POURQUOI LA ZONE DE RECOPIE DE LA CLAUSE FAIT HUIT LIGNES, et pas quatre.
 * La consigne qui la suit exige, pour CHAQUE personne désignée, nom, prénom,
 * date et lieu de naissance et adresse : avec deux enfants, c'est déjà huit à
 * dix lignes manuscrites. Quatre lignes produisaient exactement la clause
 * ambiguë que le document dit vouloir éviter. Ces huit lignes coûtent 76 mm,
 * soit près de la moitié de la hauteur utile d'une page — c'est la raison
 * principale pour laquelle la lettre a besoin de sa propre feuille.
 *
 * ⚠️ LE LECTEUR NE POSTE PAS CETTE FEUILLE. Elle porte l'en-tête de la marque et
 * l'avertissement de bas de page ; l'assureur recevrait donc un document
 * pédagogique, consignes de remplissage comprises. Le sous-titre et la première
 * étape du mode d'emploi le disent en toutes lettres : remplir ici, recopier à
 * la main, poster la feuille blanche.
 *
 * ⚠️ Les mots d'assureur sont expliqués sur place, à leur première occurrence,
 * et sur CHAQUE feuille qui les emploie : avenant, récépissé, souscripteur. Le
 * lexique n'en définit aucun, et les feuilles voyagent séparées, parfois lues
 * par un enfant qui n'a jamais vu le site.
 *
 * ⚠️ CE COMPOSANT N'EST PAS ENCORE DÉCLARÉ dans `src/lib/methode.ts`, et c'est
 * conforme à la règle « rien avant le contenu » posée en tête de ce fichier-là :
 * l'étape Assurance-vie (upsell2) n'a pas encore de feuille publiée. Au moment
 * de livrer le lot : importer `LettreModificationClause`, ajouter l'entrée dans
 * `DOCUMENTS` avec sa clé stable, son `sku` upsell2 et son `ordre` de classeur,
 * juste après « Trois clauses bénéficiaires » — c'est cette feuille-là qui donne
 * la clause à recopier ici.
 */

/**
 * Les deux largeurs de blanc. Elles sont en `padding` et non en largeur fixe :
 * un blanc de 18 rem posé en `inline-block` déborde la feuille sur un téléphone
 * étroit, où la largeur utile dans un `Encadre` tombe sous 250 px. C'est
 * l'idiome des deux autres lettres du classeur (`lettre-aux-enfants`,
 * `mail-rendez-vous`), qui ne déborde jamais et qui a une vraie hauteur de
 * ligne.
 *
 * ⚠️ Aucune largeur en dessous de `moyen` : une date manuscrite ne tient pas sur
 * les 21 mm que donnait l'ancienne taille « court », et c'est précisément ce que
 * la lettre demande d'écrire trois fois.
 */
const BLANCS = {
  moyen: "px-12",
  large: "px-16",
} as const;

/**
 * Un blanc à remplir AU MILIEU d'une phrase. `Champ` ne convient pas ici : dans
 * une lettre, le trou est dans le texte, pas au bout d'une étiquette en gras.
 *
 * ⚠️ `taille` est obligatoire, sans valeur par défaut : le choix de la largeur
 * doit être fait à chaque blanc ajouté, faute de quoi une date se retrouve sur
 * 20 mm et ne s'écrit pas à la main.
 */
function Blanc({ taille }: { taille: keyof typeof BLANCS }) {
  return <span className={"border-b border-black " + BLANCS[taille]}>&nbsp;</span>;
}

/** Une ligne vierge de la lettre, à la hauteur d'écriture du gabarit. */
function LigneAEcrire() {
  return <div className="min-h-[36px] border-b border-black" />;
}

/**
 * Les deux demandes glissées dans le courrier. Elles portent toutes les deux sur
 * la clause : les deux questions de frais qui figuraient ici sont retournées à
 * la grille d'audit, qui les traite déjà et sans inviter à comparer.
 */
const DEMANDES: { demande: string; pourquoi: string }[] = [
  {
    demande: "un avenant constatant par écrit l'enregistrement de cette nouvelle clause",
    pourquoi:
      "L'avenant est l'écrit qui prouvera, des années plus tard, que la clause a bien été enregistrée. Aucun texte n'oblige l'assureur à vous l'adresser : c'est précisément pour cela qu'on le demande dans la lettre.",
  },
  {
    demande: "le texte exact de la clause bénéficiaire enregistrée à ce jour dans vos livres",
    pourquoi:
      "C'est la seule façon de savoir ce qui est réellement écrit chez l'assureur — souvent ce n'est pas ce que vous croyez avoir signé il y a vingt ans.",
  },
];

/**
 * Le mode d'emploi. Il commence à l'étape 0 — remplir, recopier, poster la
 * feuille blanche — parce que sans elle le lecteur poste la feuille imprimée,
 * consignes comprises.
 */
const MODE_EMPLOI: string[] = [
  "Remplissez d'abord les blancs du modèle, sur la feuille 2, au stylo. Puis recopiez la lettre entière à la main sur une feuille blanche, et signez-la. C'est cette feuille blanche que vous postez : la feuille imprimée reste dans votre classeur.",
  "En haut de votre feuille blanche : vos nom, prénom et adresse. En dessous : votre assureur, service gestion des contrats, à l'adresse figurant sur votre contrat — pas votre agence, qui n'enregistre pas les clauses.",
  "Relisez ces six mentions avant de fermer l'enveloppe : le numéro de contrat, votre identité complète, la clause recopiée mot pour mot, le lieu, la date, et votre signature tracée à la main. Aucun texte n'impose de forme à votre demande, mais sans signature manuscrite et sans identification claire du contrat et des personnes désignées, votre volonté sera discutée le jour venu (art. L. 132-8 du code des assurances).",
  "Envoyez en lettre recommandée avec accusé de réception.",
  "Gardez ensemble : une photocopie de la lettre signée, le récépissé de dépôt — le ticket que la poste vous remet au guichet — et l'accusé de réception. Agrafez les trois et rangez-les dans le classeur. C'est votre preuve de la date.",
  "Comptez deux à quatre semaines pour recevoir l'avenant. C'est un délai d'usage, aucun texte ne l'impose : sans réponse au bout d'un mois, renvoyez la même lettre en recommandé avec la copie de la première, et notez la date de cette relance dans le suivi.",
  "À réception de l'avenant, vérifiez que la clause y est écrite mot pour mot comme dans votre lettre. L'avenant n'est pas ce qui rend votre demande valable — votre lettre signée et reçue par l'assureur suffit. Il est votre preuve : tant que vous ne l'avez pas, relancez.",
];

export function LettreModificationClause() {
  return (
    <>
      <Feuille
        titre="La lettre pour modifier votre clause bénéficiaire (feuille 1 sur 4)"
        sousTitre="Avant d'écrire : deux vérifications, et ce que le nom écrit dans la clause décide en euros."
      >
        <p>
          Votre droit de changer de bénéficiaire jusqu&apos;à votre décès ne dépend de personne
          (art. L. 132-8 du code des assurances). Mais il ne se prouve que par un écrit signé de
          votre main : un appel téléphonique ne laisse aucune trace opposable. Un avenant — le
          papier par lequel l&apos;assureur acte le changement — signé au guichet vaut aussi, le
          même article prévoyant la substitution de bénéficiaire par voie d&apos;avenant, à
          condition que vous en repartiez avec une copie signée. Le recommandé reste la voie la plus
          simple à prouver des années plus tard, par quelqu&apos;un d&apos;autre que vous.
        </p>

        <div className="eviter-coupure">
          <Encadre titre="DEUX VÉRIFICATIONS AVANT D'ÉCRIRE">
            <ul className="space-y-1 text-[0.93rem]">
              <Case>
                <strong>Un bénéficiaire a-t-il accepté sa désignation ?</strong> S&apos;il l&apos;a
                acceptée, la clause ne se modifie plus qu&apos;avec sa renonciation ou sa signature.
                Depuis 2007, un bénéficiaire ne peut accepter qu&apos;avec la vôtre (art. L. 132-9
                du code des assurances) : si vous n&apos;avez jamais signé un tel document, la voie
                est libre. Pour les contrats plus anciens, posez la question à l&apos;assureur avant
                d&apos;écrire.
              </Case>
              <Case>
                <strong>Avez-vous déjà désigné quelqu&apos;un par testament ?</strong> La
                désignation peut se faire par testament aussi (art. L. 132-8 du code des
                assurances). Si c&apos;est votre cas, dites-le dans la lettre, sinon deux textes se
                contredisent le jour venu.
              </Case>
            </ul>

            <div className="mt-3 grid gap-3">
              <Champ label="Question posée à l'assureur le" />
              <Champ
                label="Réponse : un bénéficiaire a-t-il accepté ?"
                indice="oui / non, et à quelle date"
              />
            </div>

            <Source>
              Acceptation du bénéficiaire : art. L. 132-9 du code des assurances. Désignation et
              changement de bénéficiaire, y compris par testament : art. L. 132-8 du même code.
            </Source>
          </Encadre>
        </div>

        <Titre>Ce que la clause décide en euros</Titre>
        <div className="eviter-coupure space-y-2 text-[0.93rem]">
          <p>
            C&apos;est la date de chaque versement, avant ou après votre 70e anniversaire, qui
            décide duquel de ces deux régimes il relève (art. 990 I et 757 B du CGI). C&apos;est la
            deuxième des 3 dates. Le nom écrit dans la clause décide, lui, du nombre de fois que
            l&apos;abattement de 152 500 € se compte — et, si aucun bénéficiaire n&apos;est
            identifiable, le capital retombe dans la succession et cet abattement ne joue plus du
            tout (art. L. 132-11 du code des assurances).
          </p>
          <p>
            Pour les versements faits avant votre 70e anniversaire, l&apos;abattement de 152 500 €
            se calcule sur ce que le bénéficiaire reçoit à raison du décès — les versements ET les
            gains qu&apos;ils ont produits. Il se compte 152 500 € par bénéficiaire, tous vos
            contrats confondus : ouvrir un second contrat ne double pas cet abattement. Au-delà, la
            part de chaque bénéficiaire subit un prélèvement de 20 %, porté à 31,25 % au-delà de 700
            000 € (art. 990 I du CGI).
          </p>
          <p>
            Après 70 ans, seuls les versements eux-mêmes sont comptés, au-delà de 30 500 € au total,
            tous contrats et tous bénéficiaires confondus ; les gains qu&apos;ils produisent ne
            paient aucun droit de succession (art. 757 B du CGI). Ce qui dépasse ces 30 500 € entre
            dans la succession et suit le barème de l&apos;art. 777 du CGI selon le lien de parenté
            — un enfant y garde son abattement de 100 000 € s&apos;il n&apos;est pas déjà consommé
            (art. 779 du CGI).
          </p>
          <p>
            Si le bénéficiaire est votre conjoint ou votre partenaire de PACS, il ne paie rien dans
            aucun des deux cas (art. 796-0 bis du CGI) : ces deux abattements ne concernent que les
            autres personnes que vous nommez.
          </p>
        </div>
        <Source>
          Versements avant 70 ans : art. 990 I du CGI. Versements après 70 ans : art. 757 B du CGI.
          Barème en ligne directe : art. 777 du CGI. Cela vaut pour les contrats souscrits depuis le
          20 novembre 1991 et pour les versements faits depuis le 13 octobre 1998 ; les contrats
          plus anciens obéissent à d&apos;autres règles, à vérifier avec votre notaire.
        </Source>
      </Feuille>

      <Feuille
        titre="La lettre pour modifier votre clause bénéficiaire — le modèle (feuille 2 sur 4)"
        sousTitre="Remplissez les blancs ici au stylo, puis recopiez la lettre entière à la main sur une feuille blanche."
      >
        <p>
          Remplissez d&apos;abord les blancs de ce modèle, ici. Puis recopiez la lettre entière à la
          main sur une feuille blanche, et signez-la : c&apos;est cette feuille blanche que vous
          postez, celle-ci reste dans votre classeur.
        </p>
        <p className="text-[0.93rem]">
          La clause à recopier ici est celle que vous avez cochée sur la feuille{" "}
          <em>Trois clauses bénéficiaires, commentées ligne par ligne</em>. La lettre demande deux
          choses à votre assureur : qu&apos;il enregistre cette nouvelle clause, et qu&apos;il vous
          en donne la preuve par un avenant — le papier par lequel il acte le changement par écrit.
        </p>

        <Encadre>
          <div className="space-y-3 text-[0.95rem]">
            <div className="eviter-coupure">
              <p className="text-[0.9rem]">Vos nom, prénom et adresse :</p>
              <LigneAEcrire />
              <LigneAEcrire />
            </div>

            <div className="eviter-coupure">
              <p className="text-[0.9rem]">
                Votre assureur — service gestion des contrats, à l&apos;adresse figurant sur le
                contrat :
              </p>
              <LigneAEcrire />
              <LigneAEcrire />
            </div>

            <div className="eviter-coupure">
              <p>
                <strong>
                  Objet : modification de la clause bénéficiaire — contrat n°
                  <Blanc taille="moyen" />
                </strong>
                <br />
                Lettre recommandée avec accusé de réception
              </p>
            </div>

            <p>Madame, Monsieur,</p>

            <p className="eviter-coupure">
              Je soussigné(e)
              <Blanc taille="large" />, né(e) le
              <Blanc taille="large" /> à
              <Blanc taille="moyen" />, demeurant
              <Blanc taille="large" />
              <Blanc taille="large" />, titulaire du contrat d&apos;assurance-vie n°
              <Blanc taille="moyen" /> souscrit auprès de vos services,
            </p>

            <p>
              vous demande de modifier la clause bénéficiaire de ce contrat et de la remplacer par
              la clause suivante, qui annule et remplace toute désignation antérieure :
            </p>

            <div className="eviter-coupure">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <LigneAEcrire key={n} />
              ))}
              <p className="mt-1 text-[0.85rem]">
                Si la place manque, continuez au dos et écrivez ici : <em>suite au dos</em>.
              </p>
            </div>

            <p>Je vous remercie de m&apos;adresser les deux documents suivants :</p>

            <ol className="ml-5 list-decimal space-y-1">
              {DEMANDES.map((d, i) => (
                <li key={d.demande}>
                  {d.demande}
                  {i === DEMANDES.length - 1 ? "." : " ;"}
                </li>
              ))}
            </ol>

            <p>
              Veuillez agréer, Madame, Monsieur, l&apos;expression de mes salutations distinguées.
            </p>

            <p>
              Fait à
              <Blanc taille="moyen" />, le
              <Blanc taille="large" />
            </p>

            <div className="eviter-coupure">
              <p>Signature manuscrite du souscripteur (c&apos;est vous) :</p>
              <div className="mt-1 min-h-[56px] border-b border-black" />
            </div>
          </div>
        </Encadre>

        <p className="eviter-coupure text-[0.9rem]">
          Recopiez la clause retenue mot pour mot, à l&apos;emplacement prévu ci-dessus. Chaque
          personne désignée doit être identifiable sans hésitation : nom, prénom, date et lieu de
          naissance, adresse. Un prénom seul ne suffit pas — les bénéficiaires doivent être
          suffisamment définis pour pouvoir être identifiés le jour venu (art. L. 132-8 du code des
          assurances), c&apos;est-à-dire retrouvés dans trente ans.
        </p>

        <p className="text-[0.9rem]">
          Modèle à faire relire par votre notaire, en particulier la clause que vous recopierez :
          une désignation ambiguë se règle après votre décès, entre vos héritiers, et coûte bien
          plus que le rendez-vous.
        </p>
      </Feuille>

      <Feuille
        titre="La lettre pour modifier votre clause bénéficiaire — le mode d'emploi (feuille 3 sur 4)"
        sousTitre="Ce que vous faites de la lettre une fois qu'elle est recopiée et signée. Cochez au fur et à mesure."
      >
        <ul className="space-y-1">
          {MODE_EMPLOI.map((etape) => (
            <Case key={etape}>
              <span className="eviter-coupure block text-[0.93rem]">{etape}</span>
            </Case>
          ))}
        </ul>
      </Feuille>

      <Feuille
        titre="La lettre pour modifier votre clause bénéficiaire — le suivi (feuille 4 sur 4)"
        sousTitre="La trace de ce que vous avez envoyé, et de ce qui vous est revenu. Gardez cette feuille remplie."
      >
        <Titre>Pourquoi ces deux demandes, et pas d&apos;autres</Titre>
        <ul className="space-y-1 text-[0.9rem]">
          {DEMANDES.map((d, i) => (
            <li key={d.pourquoi} className="eviter-coupure">
              <strong>{i + 1}.</strong> {d.pourquoi}
            </li>
          ))}
        </ul>
        <p className="text-[0.9rem]">
          Les frais de votre contrat ne se demandent pas dans ce courrier-ci : ils se notent sur la
          feuille <em>La grille d&apos;audit de votre assurance-vie</em>, qui leur réserve deux
          lignes. Un recommandé qui ne porte qu&apos;un seul objet n&apos;est pas éclaté entre deux
          services.
        </p>

        <Titre>Le suivi — à remplir au stylo</Titre>
        <Champ label="N° du contrat concerné" />
        <Champ label="Lettre envoyée le" indice="date du récépissé de dépôt" />
        <Champ label="N° du recommandé" />
        <Champ label="Accusé de réception signé le" />
        <Champ label="Relance envoyée le" indice="un mois sans réponse" />
        <Champ label="Avenant reçu le" indice="sans cet avenant, rien n'est prouvé : relancez" />
        <Champ label="Avenant rangé dans le classeur le" />
      </Feuille>
    </>
  );
}
