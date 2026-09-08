import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";
import { SchemaAvantApres70 } from "@/components/documents/Schemas";

/**
 * LE TABLEAU DE DÉCISION AVANT ET APRÈS 70 ANS (étape Assurance-vie).
 *
 * ⚠️ Ce document existe parce que la deuxième des trois dates est la seule qui
 * se rate définitivement. Un compteur de 15 ans se recharge, une donation se
 * refait ; un 70e anniversaire, non.
 *
 * ⚠️ Le document est écrit à DEUX entrées et non à une seule : « avant 70 ans »
 * et « après 70 ans ». Le lecteur de 73 ans est majoritaire dans l'avatar, et
 * la première chose qu'il croit, c'est qu'il a tout raté. C'est faux — il perd
 * un abattement sur quatre leviers — et lui laisser croire l'inverse le fait
 * refermer le classeur. D'où le second cas traité en clair, à égalité avec le
 * premier.
 *
 * ⚠️ DEUX `Feuille`, ET C'EST VOLONTAIRE, sur le modèle de
 * `plan-marie-2-enfants`. En un seul bloc le document faisait 2,5 pages, et le
 * tableau à six lignes en occupait une à lui seul : or
 * `.feuille { break-inside: avoid }` ne peut rien pour une boîte plus haute
 * qu'une page — elle déborde, et le tableau se coupe au milieu. Feuille 1 =
 * avant 70 ans ; feuille 2 = après 70 ans, plus les deux leviers ouverts à tout
 * âge. Le `overflow-x-auto` qui entourait le tableau a été retiré : plusieurs
 * moteurs d'impression rendent un conteneur de débordement en bloc unique et le
 * tronquent à la première page.
 *
 * ⚠️ LES SIX LIGNES NE S'EXCLUENT PAS, et la consigne ne dit donc pas « trouvez
 * votre ligne ». Un lecteur de 73 ans qui a des petits-enfants et un logement
 * relève de trois lignes à la fois. Les deux lignes additives sont sorties dans
 * leur propre bloc, « En plus, dans tous les cas », pour que celui qui coche sa
 * situation principale ne referme pas la feuille avant elles.
 *
 * ⚠️ LE PRÉLÈVEMENT DE L'ART. 990 I EST ÉCRIT, et pas seulement son abattement.
 * Écrire « 152 500 € par bénéficiaire » sans écrire « puis 20 %, puis 31,25 %
 * au-dessus de 700 000 € » fait conclure à une exonération sans plafond —
 * d'autant que le versant après 70 ans, lui, dit ce qui se passe au-delà de
 * 30 500 €. Cette feuille circule seule dans le classeur : l'asymétrie serait
 * un mensonge par omission.
 *
 * ⚠️ L'ABATTEMENT DE L'ART. 990 I EST INDIVIDUEL ET S'APPRÉCIE SUR CE QUI EST
 * DÛ À RAISON DU DÉCÈS — primes ET gains, pas les seuls versements. Toute
 * formule mutualisée (« 152 500 € × le nombre de bénéficiaires ») est un
 * chiffre faux que le lecteur écrit au stylo et emporte chez son notaire.
 *
 * ⚠️ AUCUN CONTRAT, AUCUN ASSUREUR, AUCUNE BANQUE N'EST NOMMÉ NI COMPARÉ ICI,
 * et aucun encadré ne tranche entre deux supports ni ne pose d'échéance
 * personnelle (« il vous reste deux ans pour le faire »). Montant + âge +
 * catégorie de produit financier + échéance, c'est la structure même de la
 * recommandation personnalisée visée par l'art. L. 541-1 du code monétaire et
 * financier, qui exige le statut CIF. On compare des RÉGIMES, on renvoie la
 * décision au notaire.
 */

type LigneDecision = { situation: string; possible: string; source: string };

/**
 * Les deux situations du lecteur qui n'a pas encore eu 70 ans. Elles
 * s'excluent, et le discriminant est écrit en tête de cellule et en capitales :
 * en impression la colonne fait environ 27 caractères de large, donc deux
 * cellules qui commencent par la même formule sont strictement identiques sur
 * la première ligne affichée.
 */
const AVANT_70: LigneDecision[] = [
  {
    situation: "MOINS DE 70 ANS — le plafond de 152 500 € n'est pas atteint.",
    possible:
      "Vous pouvez verser jusqu'à ce plafond, qui s'apprécie bénéficiaire par bénéficiaire. Au-delà de 152 500 €, la part de chaque bénéficiaire subit 20 %, puis 31,25 % au-dessus de 700 000 €.",
    source: "Art. 990 I du CGI.",
  },
  {
    situation: "MOINS DE 70 ANS — le plafond de 152 500 € est atteint.",
    possible:
      "Le levier suivant est la donation : 100 000 € par parent et par enfant, rechargeable 15 ans après le premier don déclaré — chaque donation sortant du compte à sa propre date. Et 31 865 € de plus, en argent, à un enfant ou un petit-enfant MAJEUR, tant que vous avez moins de 80 ans.",
    source: "Art. 779 et 784 du CGI. Don de somme d'argent : art. 790 G du CGI.",
  },
];

/** Les deux situations du lecteur qui a déjà eu 70 ans. Elles s'excluent aussi. */
const APRES_70: LigneDecision[] = [
  {
    situation: "70 ANS PASSÉS — je n'ai rien versé depuis mon anniversaire.",
    possible:
      "Il vous reste 30 500 € d'abattement, un seul, tous contrats et tous bénéficiaires confondus. Au-delà, seules les sommes versées entrent dans la succession — et elles y gardent l'abattement de 100 000 € de l'art. 779 s'il n'est pas déjà consommé. Les intérêts qu'elles produisent ne paient aucun droit de succession, sans plafond ; les prélèvements sociaux, eux, restent dus.",
    source: "Art. 757 B du CGI. Abattement de succession : art. 779 du CGI.",
  },
  {
    situation: "70 ANS PASSÉS — les 30 500 € sont déjà utilisés.",
    possible:
      "Verser reste possible : les gains produits ne paient aucun droit de succession. Mais le levier principal devient la donation tous les 15 ans, et la donation de la nue-propriété.",
    source: "Art. 757 B, art. 779 et 784, art. 669 du CGI.",
  },
];

/**
 * Les deux lignes qui S'AJOUTENT aux précédentes au lieu de s'y substituer.
 * Elles sont dans un bloc séparé parce que c'est exactement ce que rate le
 * lecteur à qui on dit de ne lire qu'une ligne.
 */
const TOUT_AGE: LigneDecision[] = [
  {
    situation: "UN LOGEMENT — quel que soit mon âge.",
    possible:
      "Donner la nue-propriété reste ouvert : vous donnez le bien, vous en gardez l'usage et les loyers jusqu'à la fin. Entre 71 et 80 ans, elle est comptée à 70 % de la valeur du bien, contre 60 % avant 71 ans.",
    source: "Art. 669 du CGI.",
  },
  {
    situation: "DES PETITS-ENFANTS — quel que soit mon âge.",
    possible:
      "Chacun peut recevoir 31 865 € de votre part sans droits, PAR DONATION DE VOTRE VIVANT : cet abattement ne joue pas dans une succession. Il s'ajoute à ce que reçoivent vos enfants et se recharge tous les 15 ans, sans limite d'âge.",
    source: "Art. 790 B du CGI. Délai de 15 ans : art. 784 du CGI.",
  },
];

/**
 * Les gestes à poser. Volontairement au nombre de quatre — et aucun mot
 * d'assureur n'y est laissé nu : « avis d'opération » est décrit avant d'être
 * nommé, sinon on demande au lecteur de conserver un courrier qu'il ne sait pas
 * reconnaître.
 */
const GESTES: { texte: string; ligneAEcrire: boolean }[] = [
  {
    texte:
      "Demander à mon assureur le relevé de mes versements AVEC LEURS DATES : c'est la date de chaque versement qui décide de son régime, pas la date d'ouverture du contrat.",
    ligneAEcrire: true,
  },
  {
    texte:
      "Compter les personnes nommées dans ma clause bénéficiaire : l'abattement se compte par bénéficiaire, jamais par contrat.",
    ligneAEcrire: true,
  },
  {
    texte:
      "Relire ma clause bénéficiaire et la faire corriger si un nom, un décès ou une naissance manque.",
    ligneAEcrire: false,
  },
  {
    texte:
      "Conserver le courrier de confirmation que l'assureur envoie après chaque versement (il s'appelle l'avis d'opération), dans ce classeur, à cette page.",
    ligneAEcrire: false,
  },
];

/**
 * Le tableau de décision. La troisième colonne porte le carré du gabarit :
 * c'était le seul bloc de la feuille où le lecteur ne pouvait rien marquer,
 * alors que c'est le bloc central. Pas de `overflow-x-auto` autour : voir
 * l'en-tête du fichier.
 */
function TableauDecision({ lignes }: { lignes: LigneDecision[] }) {
  return (
    <table className="w-full border-collapse text-left text-[0.92rem]">
      <thead>
        <tr>
          <th className="w-[34%] border border-black px-2 py-1.5 align-bottom font-bold">
            Ma situation
          </th>
          <th className="border border-black px-2 py-1.5 align-bottom font-bold">
            Ce que la loi me permet encore
          </th>
          <th className="w-[3.4rem] border border-black px-2 py-1.5 align-bottom font-bold">
            Je coche
          </th>
        </tr>
      </thead>
      <tbody>
        {lignes.map((l) => (
          <tr key={l.situation}>
            <td className="border border-black px-2 py-1.5 align-top font-bold">{l.situation}</td>
            <td className="border border-black px-2 py-1.5 align-top">
              {l.possible}
              <span className="mt-1 block text-[0.82rem]">{l.source}</span>
            </td>
            <td className="border border-black px-2 py-1.5 align-top">
              <span aria-hidden className="block h-[18px] w-[18px] border border-black" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Decision70Ans() {
  return (
    <>
      <Feuille
        titre="Le tableau de décision — avant 70 ans (feuille 1 sur 2)"
        sousTitre="Notez vos chiffres, puis cochez la ligne qui est la vôtre. Si vous avez déjà eu 70 ans, votre tableau est sur la feuille 2."
      >
        <SchemaAvantApres70 />
        <Encadre titre="LA DATE QUI COMPTE EST CELLE DU VERSEMENT, PAS CELLE DU CONTRAT">
          <p className="text-[0.93rem]">
            Votre 70e anniversaire coupe votre contrat en deux : ce qui a été versé avant garde son
            régime pour toujours, ce qui est versé après relève d&apos;un autre article. Un contrat
            ouvert en 2005 et alimenté après vos 70 ans a donc deux parties, avec deux règles
            différentes. Cela vaut pour les contrats souscrits depuis le 20 novembre 1991 et pour
            les versements faits depuis le 13 octobre 1998 ; les contrats plus anciens obéissent à
            d&apos;autres règles, à vérifier avec votre notaire. Aucun contrat, aucune banque et
            aucun assureur n&apos;est recommandé dans cette feuille : on vous dit ce que la loi
            permet, jamais quoi acheter.
          </p>
        </Encadre>
        <Source>Avant 70 ans : art. 990 I du CGI. Après 70 ans : art. 757 B du CGI.</Source>

        <Titre>1. Mes chiffres, avant de choisir</Titre>
        <div className="grid gap-3">
          <Champ label="Mon âge aujourd'hui" />
          <Champ label="La date de mes 70 ans" indice="jour, mois, année" />
          <Champ label="Versé AVANT mes 70 ans" indice="relevé de l'assureur, tous versements" />
          <Champ label="Versé APRÈS mes 70 ans" indice="0 € si vous n'avez rien versé depuis" />
          <Champ
            label="Bénéficiaires nommés dans ma clause"
            indice="combien de personnes, et lesquelles"
          />
        </div>

        <Titre>2. Si je n&apos;ai pas encore eu 70 ans</Titre>
        <p className="text-[0.9rem]">
          Ces deux lignes s&apos;excluent : une seule est la vôtre. Les deux leviers de la feuille
          2, eux, s&apos;ajoutent à celle-ci, quel que soit votre âge — cochez tout ce qui vous
          concerne, il y en a souvent trois.
        </p>
        <TableauDecision lignes={AVANT_70} />

        <Champ
          label="Pour CE bénéficiaire, ce qui reste disponible"
          indice="152 500 € − ce qu'il recevra (versements faits avant mes 70 ans + les gains qu'ils auront produits)"
        />
        <p className="text-[0.9rem]">
          Cet abattement est individuel : ce qui n&apos;est pas utilisé sur un bénéficiaire
          n&apos;est pas reportable sur un autre (art. 990 I du CGI). Refaites cette ligne pour
          chaque personne nommée dans votre clause, sur une feuille à part.
        </p>

        <Titre>3. La situation la plus fréquente avant 70 ans</Titre>
        <Encadre titre="SITUATION : 68 ANS, 80 000 € SUR UN LIVRET">
          <p className="text-[0.93rem]">
            Deux régimes, et c&apos;est tout ce qu&apos;il y a à en dire ici. Ces 80 000 € laissés
            sur un compte bancaire relèvent de la succession : abattement de 100 000 € par enfant
            (art. 779 du CGI), puis barème (art. 777). La tranche de 15 932 € à 552 324 € est à 20
            %, mais elle ne mord que si cet abattement de 100 000 € est déjà consommé par le reste
            de votre succession — sinon ces 80 000 € ne coûtent rien. Versées avant le 70e
            anniversaire sur un contrat d&apos;assurance-vie, les mêmes sommes relèvent de
            l&apos;art. 990 I : 152 500 € par bénéficiaire hors succession, puis 20 % au-delà.
            Comparez les deux régimes avec votre notaire avant de décider.
          </p>
        </Encadre>
      </Feuille>

      <Feuille
        titre="Le tableau de décision — après 70 ans (feuille 2 sur 2)"
        sousTitre="Ce qui reste ouvert après le 70e anniversaire, et les deux leviers ouverts à tout âge. Cochez toutes les lignes qui vous concernent."
      >
        <Titre>4. Si j&apos;ai déjà eu 70 ans</Titre>
        <p className="text-[0.9rem]">
          Ces deux lignes s&apos;excluent : une seule est la vôtre. Celles du paragraphe 5
          s&apos;ajoutent à elle.
        </p>
        <TableauDecision lignes={APRES_70} />

        <Champ
          label="Ce qu'il me reste sur les 30 500 €"
          indice="30 500 € en tout, moins ce que j'ai versé depuis mes 70 ans"
        />

        <Titre>5. En plus, dans tous les cas</Titre>
        <p className="text-[0.9rem]">
          Ces deux lignes ne remplacent aucune des précédentes : elles s&apos;y ajoutent, avant
          comme après 70 ans.
        </p>
        <TableauDecision lignes={TOUT_AGE} />

        <Titre>6. La situation la plus fréquente après 70 ans</Titre>
        <Encadre titre="SITUATION : 73 ANS, RIEN N'A ÉTÉ FAIT">
          <p className="text-[0.93rem]">
            Tout n&apos;est pas perdu. Mais ce qui change à 70 ans n&apos;est pas seulement un
            abattement : c&apos;est le régime. Avant, ce qui est dû à raison du décès échappe aux
            droits de succession et subit un prélèvement à part, après 152 500 € par bénéficiaire —
            20 %, puis 31,25 % au-dessus de 700 000 € (art. 990 I). Après, les versements entrent
            dans la succession au-delà de 30 500 €, au barème de l&apos;art. 777 et selon le lien de
            parenté : un enfant y garde son abattement de 100 000 € s&apos;il n&apos;est pas déjà
            consommé (art. 779). Restent ouverts et cumulables : les 30 500 € de l&apos;art. 757 B ;
            les intérêts de vos versements postérieurs à 70 ans, qui ne paient aucun droit de
            succession ; les 100 000 € par enfant tous les 15 ans ; les 31 865 € en argent
            jusqu&apos;à vos 80 ans ; les 31 865 € par petit-enfant, en donation de votre vivant ;
            et la nue-propriété comptée à 70 % de la valeur du bien. À 73 ans le calendrier
            n&apos;est pas fini : il est simplement plus court.
          </p>
        </Encadre>

        <Titre>7. Ce que je fais maintenant, quel que soit mon âge</Titre>
        <Champ label="Ma date limite" indice="mon 70e anniversaire, ou la date que je me fixe" />
        <ul className="mt-2 space-y-1">
          {GESTES.map((g) => (
            <Case key={g.texte}>
              {g.texte}
              {g.ligneAEcrire && <span className="mt-1 block min-h-[36px] border-b border-black" />}
            </Case>
          ))}
        </ul>

        <p className="text-[0.9rem]">
          Les montants ci-dessus sont ceux du Code général des impôts aux articles cités : vous
          pouvez les vérifier vous-même sur legifrance.gouv.fr, et votre notaire aussi. Faites
          relire toute clause bénéficiaire modifiée par votre notaire avant de la signer.
        </p>
      </Feuille>
    </>
  );
}
