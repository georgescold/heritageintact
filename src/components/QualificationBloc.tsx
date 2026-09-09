"use client";

import { useState } from "react";
import type { Reponses } from "@/lib/qualification";
import { Panel } from "./ui";

/**
 * LES QUATRE QUESTIONS, UNE PAR ÉCRAN, JUSTE APRÈS LE PAIEMENT.
 *
 * ═══ CE QUE CE BLOC EST, ET CE QU'IL N'EST PAS ═══
 *
 * Il ne qualifie pas un prospect et il ne personnalise aucun produit : la
 * Méthode livrée est rigoureusement la même pour tout le monde. Ces réponses ne
 * décident QUE de l'écran de vente montré juste après le paiement, de son ordre
 * et de son titre. C'est exactement ce que dit la deuxième ligne du chapeau, et
 * cette ligne doit rester littéralement vraie : le jour où une réponse
 * changerait le prix ou le contenu, c'est elle qui deviendrait le problème.
 *
 * D'où l'interdiction, dans tout ce fichier, du moindre mot promettant un
 * « plan sur mesure » ou une « analyse de votre situation ».
 *
 * ═══ REFONTE DU 9 SEPTEMBRE 2026 : UNE QUESTION À LA FOIS, ET OBLIGATOIRE ═══
 *
 * Les quatre questions étaient empilées sur un seul écran, avec vingt et une
 * réponses visibles d'un coup, un chapeau de trois paragraphes et deux boutons
 * de sortie. C'est beaucoup à traverser pour quelqu'un de 74 ans qui vient de
 * saisir sa carte : la page paraissait longue, donc elle paraissait être du
 * travail, et un formulaire qui paraît être du travail ne se remplit pas.
 *
 * Une question à l'écran, quatre réponses, rien d'autre. Il n'y a jamais qu'une
 * décision à prendre, et elle tient sans faire défiler.
 *
 * ⚠️ ET C'EST CE QUI REND L'OBLIGATION TENABLE. Rendre obligatoire un
 * formulaire de vingt et une lignes, ce serait poser un péage. Rendre
 * obligatoires quatre clics de trois secondes, ce n'en est pas un — à condition
 * que les trois garanties ci-dessous tiennent toutes les trois.
 *
 * ═══ LES TROIS GARANTIES QUI RENDENT L'OBLIGATION ACCEPTABLE ═══
 *
 * 1. IL A DÉJÀ SON PRODUIT. `livrer()` s'exécute dans `confirmCheckout`, donc
 *    avant que cette page s'affiche. Le lien de son espace est écrit au-dessus,
 *    en clair, et l'email est parti. Quelqu'un qui ferme l'onglet ici ne perd
 *    RIEN de ce qu'il a payé — il ne verra simplement pas les offres suivantes.
 *    Cette page ne garde jamais un produit en otage, et c'est ce qui distingue
 *    une question obligatoire d'un péage.
 *
 * 2. IL PEUT REVENIR EN ARRIÈRE. C'est la contrepartie indispensable de la
 *    suppression de « Je préfère ne pas répondre ». Cette réponse-là servait de
 *    bouton d'annulation : un groupe de boutons radio ne se décoche pas, et sur
 *    cette cible un choix coché par erreur et impossible à défaire est une
 *    raison de fermer l'onglet. En la retirant SANS offrir de retour, on
 *    rendrait chaque clic accidentel définitif — c'est-à-dire qu'on
 *    remplacerait une réponse honnête (« je ne veux pas dire ») par une réponse
 *    fausse envoyée au routage. Le retour est donc visible dès la question 2.
 *
 * 3. AUCUNE QUESTION N'EST INTRUSIVE, et celle qui pourrait l'être est en
 *    dernier avec sa justification écrite au-dessus des réponses.
 *
 * ═══ POURQUOI DES BOUTONS ET PLUS DES BOUTONS RADIO ═══
 *
 * Parce que l'écran avance tout seul au choix. Avec des radios, un utilisateur
 * au clavier qui parcourt les options avec les flèches coche chaque option au
 * passage — il déclencherait l'avance avant d'avoir atteint la sienne. Un
 * `<button>` ne se déclenche qu'à l'activation volontaire : c'est la sémantique
 * exacte de « je choisis, et ça passe à la suite ».
 *
 * ═══ POURQUOI L'ÂGE EST EN QUATRIÈME ═══
 *
 * C'est la seule question qui peut être vécue comme une intrusion, voire comme
 * un rappel de mortalité, chez quelqu'un qui vient d'acheter un produit sur sa
 * propre succession. Un abandon sur la dernière question coûte le moins cher :
 * les trois premières sont déjà répondues. L'ordre ne se change pas.
 *
 * ═══ CE QU'ON NE DEMANDE PAS, ET C'EST DÉLIBÉRÉ ═══
 *
 *   · le RÉGIME MATRIMONIAL : une personne mariée sur deux ignore le sien, et la
 *     question la bloque. Personne, en revanche, n'ignore s'il est marié ;
 *   · l'ENFANT VULNÉRABLE OU HANDICAPÉ, alors que c'est bien l'une des douze
 *     situations de la feuille papier : c'est une donnée de santé relative à un
 *     tiers qui n'a consenti à rien (RGPD art. 9). Elle reste sur la feuille
 *     papier, qui ne quitte pas le salon ;
 *   · la DATE DE LA DERNIÈRE DONATION, malgré son intérêt réel : elle ne change
 *     aucun écran. Une question qui ne change aucun écran ne se pose pas.
 */

/** Les quatre champs de la table `profils`, et rien d'autre. */
type Champ = keyof Reponses;

type Question = {
  champ: Champ;
  legende: string;
  /** Précision au fil du libellé, en plus petit. Q3 uniquement. */
  precision?: string;
  /** Justification affichée AVANT les réponses. Q4 uniquement. */
  justification?: string;
  reponses: { code: string; libelle: string }[];
};

/**
 * ⚠️ LES CODES SONT UN CONTRAT AVEC LA BASE ET AVEC LA TABLE DE ROUTAGE.
 * `M P U V S`, `1 2 R 0`, `O N ?`, `a b c d` sont recopiés à l'identique dans la
 * liste blanche de `app/profil.ts` et dans les règles de `lib/qualification.ts`.
 * En renommer un ici ne casserait rien de visible : le code inconnu serait
 * simplement ignoré à l'écriture, et l'acheteur retomberait silencieusement dans
 * le tunnel par défaut. C'est le genre de panne qui ne fait aucun bruit.
 *
 * ⚠️ « X » (Je préfère ne pas répondre) N'EST PLUS PROPOSÉ. Le code reste
 * accepté en lecture — `codeUtile` le traite comme une absence, et des réponses
 * « X » existent déjà en base : les documents imprimables des acheteurs
 * d'avant cette refonte doivent continuer de se rendre correctement.
 */
const QUESTIONS: Question[] = [
  {
    champ: "vie",
    legende: "Aujourd'hui, vous vivez…",
    reponses: [
      { code: "M", libelle: "Marié(e)" },
      { code: "P", libelle: "Pacsé(e)" },
      { code: "U", libelle: "En couple, sans mariage ni PACS" },
      { code: "V", libelle: "Veuf ou veuve" },
      { code: "S", libelle: "Seul(e) aujourd'hui (célibataire ou divorcé(e))" },
    ],
  },
  {
    champ: "enfants",
    legende: "Vos enfants",
    reponses: [
      { code: "1", libelle: "Un enfant" },
      { code: "2", libelle: "Deux enfants ou plus" },
      {
        code: "R",
        // Quatre réponses et non trois : la feuille des 12 situations sépare
        // « Marié, un enfant » de « Marié, deux enfants ou plus », et l'angle
        // « chaque enfant a son propre abattement de 100 000 € » ne s'écrit pas
        // sans le nombre.
        libelle:
          "Des enfants, dont au moins un d'une autre union — la vôtre ou celle de votre conjoint",
      },
      { code: "0", libelle: "Pas d'enfant" },
    ],
  },
  {
    champ: "av",
    // C'est la seule question qui SUPPRIME un écran de vente. « Non » retire
    // définitivement l'écran à 97 € du parcours : à quelqu'un sans contrat, la
    // seule offre possible serait d'en ouvrir un, c'est-à-dire une
    // recommandation de placement — interdite sans statut CIF.
    legende: "Avez-vous une assurance-vie ?",
    precision: "(même ancienne, même petite, même ouverte à votre banque)",
    reponses: [
      { code: "O", libelle: "Oui" },
      { code: "N", libelle: "Non" },
      // « Je ne sais plus » reste, et ce n'est pas un contournement : c'est un
      // fait fréquent et exploitable. Il route vers l'écran qui apprend à
      // retrouver un contrat, là où « Non » le supprime.
      { code: "?", libelle: "Je ne sais plus" },
    ],
  },
  {
    champ: "age",
    legende: "Quel âge avez-vous ?",
    // La justification est écrite AVANT les réponses, et en toutes lettres. On
    // ne demande pas son âge à un homme de 74 ans qui vient de payer sans lui
    // dire, dans la même seconde, à quoi la réponse va servir. Les quatre bandes
    // ne sont pas démographiques : ce sont quatre portes fiscales.
    justification:
      "Deux avantages fiscaux se ferment à un anniversaire précis. C'est la seule raison pour laquelle nous vous le demandons.",
    reponses: [
      { code: "a", libelle: "Moins de 65 ans" },
      { code: "b", libelle: "De 65 à 69 ans" },
      { code: "c", libelle: "70 ans" },
      { code: "d", libelle: "71 ans ou plus" },
    ],
  },
];

/**
 * Le chapeau, montré à la PREMIÈRE question seulement.
 *
 * ⚠️ Il en reste deux lignes sur trois. La troisième disait « si vous préférez
 * ne pas répondre, passez directement à la suite » : elle est devenue fausse le
 * jour où les questions sont devenues obligatoires, et une réassurance fausse
 * est pire que pas de réassurance du tout.
 *
 * Ce qui la remplace ne promet pas de pouvoir sauter les questions — ce serait
 * mentir — mais dit la seule chose qui compte vraiment à cet instant : ce qu'il
 * a payé est déjà à lui, quoi qu'il fasse de cet écran.
 *
 * Et il disparaît dès la question 2 : le relire quatre fois n'ajoute rien, et
 * chaque ligne de texte au-dessus d'une question la fait paraître plus longue
 * à traiter qu'elle ne l'est.
 *
 * ⚠️ DEUX PHRASES, PAS DEUX PARAGRAPHES, ET C'EST MESURÉ SUR UN ÉCRAN DE
 * 375 px. La version longue poussait la première réponse SOUS la ligne de
 * flottaison : le lecteur arrivait sur un mur de texte et devait faire défiler
 * pour découvrir qu'il n'y avait qu'un clic à donner. Un écran qui oblige à
 * défiler avant de montrer ce qu'il attend paraît long, et ce qui paraît long
 * ne se commence pas.
 *
 * Toute ligne ajoutée ici doit être vérifiée en 375 px, la première réponse
 * visible sans défilement.
 */
const CHAPEAU = [
  "Votre Méthode est déjà à vous, et ces réponses n’y changent rien. Elles servent seulement à choisir ce que nous vous montrons ensuite : selon votre situation, ce n’est pas la même date qui se referme en premier.",
  "Quatre questions, une à la fois. Trente secondes.",
];

/**
 * Une copie des réponses où `champ` vaut `code`.
 *
 * Écrite en quatre branches et non avec une clé calculée : sous une clé de type
 * union, TypeScript produit une signature d'index et cesse de vérifier que les
 * quatre champs sont bien ceux de `Reponses`. Quatre lignes de plus contre une
 * faute de frappe qui passerait le compilateur, c'est le bon prix.
 */
function avecReponse(valeurs: Reponses, champ: Champ, code: string): Reponses {
  switch (champ) {
    case "vie":
      return { ...valeurs, vie: code };
    case "enfants":
      return { ...valeurs, enfants: code };
    case "av":
      return { ...valeurs, av: code };
    case "age":
      return { ...valeurs, age: code };
  }
}

/**
 * Le temps pendant lequel la réponse choisie reste visible, marquée, avant que
 * l'écran passe à la suivante.
 *
 * ⚠️ Ni zéro, ni une seconde. À zéro, l'écran change avant que l'œil ait
 * enregistré le clic : le lecteur ne sait pas si sa réponse a été prise, et il
 * revient en arrière pour vérifier. À une seconde, il croit que la page a
 * planté et il reclique. 400 ms, c'est le temps de voir le cadre orange se
 * poser, et rien de plus.
 */
const DELAI_AVANCE_MS = 400;

export function QualificationBloc({ onTermine }: { onTermine: (r: Reponses) => void }) {
  const [index, setIndex] = useState(0);
  const [valeurs, setValeurs] = useState<Reponses>({});
  // Le choix qu'on vient de faire, le temps de le montrer marqué avant de
  // passer à la suite. Il sert UNIQUEMENT à l'affichage.
  const [choisi, setChoisi] = useState<string | null>(null);

  const q = QUESTIONS[index];
  const derniere = index === QUESTIONS.length - 1;

  function repondre(code: string) {
    // Un second clic pendant l'attente ne doit rien déclencher : sur un écran
    // tactile tenu à bout de bras, le double appui est fréquent, et il ferait
    // sauter une question entière.
    if (choisi) return;

    setChoisi(code);
    const suite = avecReponse(valeurs, q.champ, code);
    setValeurs(suite);

    window.setTimeout(() => {
      setChoisi(null);
      if (derniere) onTermine(suite);
      else setIndex((i) => i + 1);
    }, DELAI_AVANCE_MS);
  }

  function retour() {
    if (choisi || index === 0) return;
    setIndex((i) => i - 1);
  }

  return (
    <Panel title="Pour que la suite vous concerne">
      {index === 0 && (
        <div className="mb-5 space-y-2 text-[1rem] text-text-soft">
          {CHAPEAU.map((ligne) => (
            <p key={ligne}>{ligne}</p>
          ))}
        </div>
      )}

      {/* LA PROGRESSION, ET ELLE EST ÉCRITE EN CLAIR.
          « 2 sur 4 » dit combien il en reste ; une barre seule ne le dit pas.
          Sur quelqu'un qui hésite à commencer, savoir que c'est court EST la
          raison de commencer. La barre est là pour l'œil, le compte pour la
          décision — jamais l'un sans l'autre. */}
      <div className="mb-4">
        <p className="mb-1.5 text-[0.98rem] font-bold text-text-soft">
          Question {index + 1} sur {QUESTIONS.length}
        </p>
        <div className="h-1.5 w-full bg-grey-line-soft" aria-hidden>
          <div
            className="h-full bg-orange transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* `aria-live` : l'écran change sans que le focus bouge, donc un lecteur
          d'écran n'annoncerait rien du tout. La région polie fait lire la
          nouvelle question quand elle apparaît. */}
      <div aria-live="polite">
        <h3 className="mb-1 text-[1.2rem] font-bold text-blue">
          {q.legende}
          {q.precision && (
            <span className="block font-normal text-[0.95rem] text-text-soft">{q.precision}</span>
          )}
        </h3>

        {q.justification && <p className="mb-3 text-[1rem] text-text-soft">{q.justification}</p>}

        {/* Une seule colonne, toujours. Deux colonnes sur grand écran feraient
            sauter une réponse sur deux à la lecture, et les réponses ne sont pas
            interchangeables : « Veuf ou veuve » et « Seul(e) aujourd'hui » ne
            mènent pas au même écran. */}
        <div className="mt-3 space-y-2">
          {q.reponses.map((r) => {
            const marque = choisi === r.code;
            return (
              <button
                key={r.code}
                type="button"
                onClick={() => repondre(r.code)}
                // 56 px de haut, pleine largeur, le libellé entier cliquable.
                // C'est la seule dimension de ce fichier qui ne se négocie pas :
                // sur un écran de 375 px tenu à bout de bras, une cible plus
                // petite se rate, et une réponse ratée est une réponse fausse
                // envoyée au routage.
                className={`flex min-h-[56px] w-full cursor-pointer items-center gap-3 border-2 px-4 py-2 text-left text-[1.05rem] transition-colors motion-reduce:transition-none ${
                  marque
                    ? "border-orange bg-yellow-bg font-bold text-blue"
                    : "border-grey-line bg-white hover:bg-grey-bg"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-white ${
                    marque ? "border-orange bg-orange" : "border-grey-line"
                  }`}
                >
                  {marque ? "✔" : ""}
                </span>
                <span>{r.libelle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LE RETOUR. Voir la garantie n° 2 du chapeau de fichier : sans lui, un
          clic accidentel serait définitif, et le routage recevrait une réponse
          fausse au lieu d'une réponse honnête.
          Discret, mais jamais caché — et il ne s'affiche pas à la question 1,
          où il ne mènerait nulle part. */}
      {index > 0 && (
        <p className="mt-4">
          <button
            type="button"
            onClick={retour}
            className="min-h-[44px] cursor-pointer text-[1.02rem] text-text-soft underline"
          >
            ← Revenir à la question précédente
          </button>
        </p>
      )}
    </Panel>
  );
}
