"use client";

import type { Reponses } from "@/lib/qualification";
import { Panel } from "./ui";

/**
 * LES QUATRE QUESTIONS, POSÉES JUSTE APRÈS LE PAIEMENT.
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
 * ═══ POURQUOI RIEN N'EST OBLIGATOIRE ═══
 *
 * Le lecteur a entre 65 et 85 ans, il est méfiant, et il vient de payer. Il ne
 * peut plus être perdu au bon de commande — c’est précisément pourquoi ce bloc a
 * quitté le bon de commande — mais il peut parfaitement fermer l’onglet avant
 * le premier écran de vente, et emporter avec lui son upsell ET son backend.
 * Donc : aucun `required`, aucun
 * message d'erreur, aucun rouge, aucun astérisque, aucun bouton grisé. Le bouton
 * de paiement reste actif dès la première seconde, et il l'est même si ce bloc
 * n'est jamais regardé.
 *
 * ═══ POURQUOI « JE PRÉFÈRE NE PAS RÉPONDRE » EST UNE RÉPONSE À PART ENTIÈRE ═══
 *
 * Un groupe de boutons radio ne se décoche pas. Sur cette cible, un choix coché
 * par erreur et impossible à défaire est une raison de fermer l'onglet, pas un
 * désagrément. `X` est donc offert au MÊME format que les autres — jamais en
 * petit en dessous — et sert de bouton d'annulation. Côté routage, `X` et
 * l'absence de réponse sont strictement équivalents (`codeUtile`).
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

/** Le libellé d'annulation, identique aux quatre questions. */
const PAS_DE_REPONSE = { code: "X", libelle: "Je préfère ne pas répondre" };

/**
 * ⚠️ LES CODES SONT UN CONTRAT AVEC LA BASE ET AVEC LA TABLE DE ROUTAGE.
 * `M P U V S`, `1 2 R 0`, `O N ?`, `a b c d` sont recopiés à l'identique dans la
 * liste blanche de `app/profil.ts` et dans les règles de `lib/qualification.ts`.
 * En renommer un ici ne casserait rien de visible : le code inconnu serait
 * simplement ignoré à l'écriture, et l'acheteur retomberait silencieusement dans
 * le tunnel par défaut. C'est le genre de panne qui ne fait aucun bruit.
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
      PAS_DE_REPONSE,
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
      PAS_DE_REPONSE,
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
      { code: "?", libelle: "Je ne sais plus" },
      PAS_DE_REPONSE,
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
      PAS_DE_REPONSE,
    ],
  },
];

/**
 * Le chapeau, dans cet ordre : ce qui change, ce qui ne change pas, et la
 * permission de ne rien répondre. Les trois lignes forment un tout — retirer la
 * troisième transformerait le bloc en péage.
 */
const CHAPEAU = [
  "Votre Méthode est la même pour tout le monde, et elle est déjà à vous. Ce que nous allons vous montrer ensuite, non : selon votre situation, ce n’est pas la même date qui se referme en premier.",
  "Ces réponses ne changent rien à ce que vous venez de payer, et rien au contenu de votre Méthode. Elles servent uniquement à choisir ce que nous vous montrons ensuite.",
  "Si vous préférez ne pas répondre, passez directement à la suite en bas de page : rien ne sera bloqué, et vous ne perdez rien.",
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

export function QualificationBloc({
  valeurs,
  onChange,
}: {
  valeurs: Reponses;
  onChange: (valeurs: Reponses) => void;
}) {
  return (
    // Ni « Votre profil » ni « Questionnaire » : le premier annonce un fichage,
    // le second annonce du travail. Le titre dit à quoi les réponses servent.
    <Panel title="Pour que la suite vous concerne">
      <div className="space-y-2 text-[1rem] text-text-soft">
        {CHAPEAU.map((ligne) => (
          <p key={ligne}>{ligne}</p>
        ))}
      </div>

      <div className="mt-5 space-y-5">
        {QUESTIONS.map((q) => (
          <fieldset key={q.champ} className="m-0 border-0 p-0">
            <legend className="mb-2 p-0 text-[1.05rem] font-bold text-blue">
              {q.legende}
              {q.precision && (
                <span className="font-normal text-[0.95rem] text-text-soft"> {q.precision}</span>
              )}
            </legend>

            {q.justification && (
              <p className="mb-2 text-[1rem] text-text-soft">{q.justification}</p>
            )}

            {/* Une seule colonne, toujours. Deux colonnes sur grand écran
                feraient sauter une réponse sur deux à la lecture, et les
                réponses ne sont pas interchangeables : « Veuf ou veuve » et
                « Seul(e) aujourd'hui » ne mènent pas au même écran. */}
            <div className="space-y-1.5">
              {q.reponses.map((r) => {
                const coche = valeurs[q.champ] === r.code;
                return (
                  <label
                    key={r.code}
                    // Le libellé entier est la cible, pas seulement le rond :
                    // 44 px de haut au minimum, pleine largeur. C'est la seule
                    // dimension de ce fichier qui ne se négocie pas — sur un
                    // écran de 375 px tenu à bout de bras, une cible plus
                    // petite se rate, et une réponse ratée est une réponse
                    // fausse envoyée au routage.
                    className={`flex min-h-[44px] w-full cursor-pointer items-center gap-3 border-2 px-3 py-2 text-[1.05rem] ${
                      coche
                        ? "border-orange bg-yellow-bg font-bold text-blue"
                        : "border-grey-line bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`reponse-${q.champ}`}
                      value={r.code}
                      checked={coche}
                      onChange={() => onChange(avecReponse(valeurs, q.champ, r.code))}
                      className="h-6 w-6 shrink-0 accent-orange"
                    />
                    <span>{r.libelle}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </Panel>
  );
}
