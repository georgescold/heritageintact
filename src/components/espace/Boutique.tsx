import { PRODUCTS, euros, type ProductSku } from "@/lib/config";
import type { EtatEspace } from "@/lib/espace";
import { DOCUMENTS } from "@/lib/methode";
import { ButtonLink } from "@/components/ui";

/**
 * « CE QUE JE N'AI PAS ENCORE » — le rayon permanent de l'espace membre.
 *
 * C'est le bloc le plus rentable du projet, et il ne ressemble pourtant à
 * aucune page de vente. La raison tient en une phrase : le membre revient dix
 * à quinze fois pendant qu'il suit La Méthode, et à chaque passage il descend
 * jusqu'ici, SOUS ses propres cases cochées. Ce n'est pas une campagne qu'il
 * n'ouvrira pas — c'est un rayon qu'il traverse chaque fois qu'il vient
 * travailler, de lui-même.
 *
 * ⚠️ CE COMPOSANT N'HABILITE RIEN ET NE PROTÈGE RIEN. `etat.boutique` est déjà
 * filtré (produits disponibles, non possédés, vide tant que l'étape 0 n'est
 * pas ouverte), mais l'URL /espace/{jeton}/ajouter/{sku} est devinable :
 * masquer une ligne ici n'empêche personne d'y aller. Les gardes qui comptent
 * sont celles de la page de confirmation et celles de la server action.
 *
 * ⚠️ AUCUN COMPTE À REBOURS, AUCUNE FAUSSE RARETÉ, AUCUN « plus que 2 places ».
 * Les deux seules urgences du projet — le compteur réel de places fondatrices
 * et le 31 décembre 2026 — n'ont rien à faire ici : elles s'adressent à
 * quelqu'un qui n'a pas encore acheté. Sur un client déjà payant, une pression
 * inventée ne fait pas vendre, elle fait douter de ce qu'il a déjà acheté
 * (et l'art. L121-2 du code de la consommation sanctionne le reste).
 */
export function Boutique({ etat }: { etat: EtatEspace }) {
  /**
   * ⚠️ LA RÈGLE DE FOND, ET ELLE EST ÉCRITE EN PREMIER : on ne propose JAMAIS
   * un produit supplémentaire à quelqu'un qui n'a pas ouvert l'étape 0.
   *
   * Il vient de payer, il n'a rien lu, il n'a pas encore son chiffre. Lui
   * vendre la suite à cet instant transforme un acheteur satisfait en demande
   * de remboursement — et à 27 € avec une garantie de 30 jours, un
   * remboursement coûte plus cher que la vente ratée.
   */
  if (!etat.etape0Ouverte) return null;
  if (etat.boutique.length === 0) return null;

  const epingle = etat.epingle;

  return (
    <section>
      <h2 className="mb-3 text-[1.35rem]">CE QUE JE N&apos;AI PAS ENCORE</h2>

      <p className="mb-5 text-[1.05rem]">
        Vous avez déjà {PRODUCTS.front.name}. Ce qui suit existe si vous en avez besoin, et
        seulement dans ce cas. Rien ne presse&nbsp;: ces compléments restent disponibles, au même
        prix, aussi longtemps que vous le souhaitez.
      </p>

      <ul className="space-y-5">
        {etat.boutique.map((sku) => (
          <li key={sku}>
            {/* La ligne de contexte du produit épinglé. Elle ne s'affiche que
                pour lui, et elle dit une chose vraie et vérifiable par le
                lecteur : l'étape qu'il vient lui-même de cocher. C'est le seul
                moment où cette offre-là lui parle. */}
            {epingle?.sku === sku && (
              <p className="mb-2 border-l-4 border-orange bg-yellow-bg px-3 py-2 text-[1.02rem]">
                Vous venez de terminer l&apos;étape {epingle.etape.numero} —{" "}
                <em>{epingle.etape.titre}</em>.
              </p>
            )}
            <LigneProduit sku={sku} jeton={etat.acces.jeton} />
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[0.95rem] text-text-soft">
        Chaque achat est couvert par la même garantie de 30 jours, sans justification à fournir.
      </p>
    </section>
  );
}

/**
 * UNE LIGNE DU RAYON.
 *
 * ⚠️ Le nom et le prix se lisent dans `PRODUCTS`, jamais recopiés. Deux noms
 * pour un même produit — ou pire, deux prix — sur un site que le lecteur
 * découvre, c'est un acheteur qui referme l'onglet. Le seul texte écrit ici
 * est la phrase de présentation, qui appartient à la boutique et à rien
 * d'autre.
 */
function LigneProduit({ sku, jeton }: { sku: ProductSku; jeton: string }) {
  const produit = PRODUCTS[sku];

  return (
    <div className="border border-grey-line bg-white p-4">
      <h3 className="text-[1.2rem] leading-snug text-blue">{produit.name}</h3>
      <p className="mt-2 text-[1.05rem]">{RESUME[sku]}</p>
      <p className="mt-3 text-[1.6rem] font-bold text-blue">{euros(produit.price)}</p>
      <div className="mt-3">
        {/* 60 px de haut, pleine largeur, un seul geste possible. « Voir » est
            complété du nom court : quand trois lignes se suivent, trois boutons
            marqués « Voir » ne se distinguent plus une fois qu'on a le doigt
            dessus et l'écran à moitié caché par la main. */}
        <ButtonLink href={`/espace/${jeton}/ajouter/${sku}`} variant="blue">
          Voir {produit.short}
        </ButtonLink>
      </div>
    </div>
  );
}

/**
 * LA PHRASE DE PRÉSENTATION DE CHAQUE PRODUIT.
 *
 * Elle vit ici et non dans `config.ts` parce que c'est du texte de vente, pas
 * une donnée de catalogue : `config.ts` sait ce qu'un produit coûte et s'il
 * est vendable, il n'a pas à savoir comment on en parle. `short` y sert
 * d'étiquette de récapitulatif, pas de description.
 *
 * ⚠️ Les quatre backends y figurent alors qu'ils ne sont pas encore vendables.
 * Ce n'est pas une contradiction : ce qui les empêche d'être vendus est le
 * drapeau `disponible`, jamais l'absence d'une phrase. L'inverse aurait été
 * dangereux — le jour où l'un d'eux passe à `true`, il se serait affiché avec
 * une ligne vide.
 */
const RESUME: Record<ProductSku, string> = {
  front:
    "La Méthode elle-même : les 8 étapes, le Simulateur de Facture Invisible et le Calendrier des 3 dates.",
  bump: "Les cinq feuilles à remplir au stylo avant votre rendez-vous, pour que le notaire travaille sur votre dossier au lieu de vous poser des questions.",
  upsell1:
    "Votre situation familiale traitée à part : le plan qui correspond à votre configuration, le calendrier des 15 prochaines années, et Le Simulateur Automatique compris.",
  upsell2:
    "Votre contrat relu en trente minutes : la clause bénéficiaire, la date de vos versements et les frais réels, avec la lettre à envoyer à votre assureur.",
  backend1:
    "La version automatique du simulateur : plusieurs héritiers, plusieurs contrats, une donation déjà faite — le calcul est fait pour vous.",
  backend2:
    "Décider aujourd'hui de ce qui se passera si vous ne pouvez plus décider vous-même : mandat de protection future, directives, et à qui en parler.",
  backend3:
    "L'ensemble de vos feuilles mises en page pour être imprimées d'un bloc, avec les intercalaires à découper et la page de garde à personnaliser.",
  backend4:
    "Le testament écrit de votre main sans qu'une formule mal tournée le rende contestable : la trame, les mots exacts, et les erreurs qui l'annulent.",
  // Le pack ne se vend QUE dans le tunnel d'après-paiement, jamais depuis
  // l'espace : sa remise se justifie par une seule saisie de carte et par
  // les 3 modèles de clause livrés une fois au lieu de deux. Trois mois plus
  // tard, cette justification ne tient plus. Il figure ici parce que le type
  // l'exige, et `disponible: false` l'empêche de s'afficher.
  pack1:
    "Le Plan adapté à votre famille et l'audit de votre assurance-vie, ensemble : les 3 modèles de clause bénéficiaire, communs aux deux, ne sont comptés qu'une fois.",
};

/**
 * CE QUE L'ACHETEUR REÇOIT, LIGNE À LIGNE — affiché sur l'écran de
 * confirmation d'achat.
 *
 * ⚠️ Les produits dont les documents sont DÉCLARÉS ne figurent pas ici : leur
 * liste est dérivée de `DOCUMENTS` par `avantages()` ci-dessous, et ne peut
 * donc pas diverger de ce qui sera réellement livré dans « MES DOCUMENTS ».
 * Une liste recopiée à la main aurait fini par promettre une feuille de plus
 * que le produit n'en contient, et c'est exactement le genre d'écart qui
 * déclenche une demande de remboursement sur cette cible.
 *
 * Les entrées écrites ici sont donc celles dont le contenu n'est pas encore
 * déclaré dans `methode.ts` — les deux upsells. Elles disparaîtront le jour où
 * leurs documents y entreront.
 */
const AVANTAGES: Partial<Record<ProductSku, string[]>> = {
  upsell1: [
    "12 plans-types : celui qui correspond à votre situation familiale, en une page",
    "Le Simulateur Automatique, compris — plusieurs héritiers, plusieurs contrats, démembrement, donations passées",
    "Le Calendrier de Transmission sur 15 ans : quoi faire, et quelle année",
    "3 modèles de clause bénéficiaire, commentés ligne par ligne",
    "Le tableau de bord familial : qui reçoit quoi, quand, et à quel coût",
  ],
  upsell2: [
    "L'audit de votre contrat en 30 minutes : la grille, notée sur 10",
    "Les 3 clauses bénéficiaires rédigées et commentées ligne par ligne",
    "Le tableau de décision « avant / après 70 ans »",
    "La lettre-type pour demander la modification à votre assureur",
    "Le comparatif des frais : ce que 3 % sur 20 ans coûte réellement",
  ],
};

/** La phrase de présentation d'un produit. Exportée pour l'écran d'achat. */
export function resumeProduit(sku: ProductSku): string {
  return RESUME[sku];
}

/**
 * CE QUE CONTIENT UN PRODUIT, pour l'écran de confirmation d'achat.
 *
 * Les titres des documents réellement déclarés d'abord — ils sont la vérité,
 * puisque ce sont eux qui apparaîtront dans « MES DOCUMENTS » — et la liste
 * écrite à la main seulement à défaut.
 */
export function avantagesProduit(sku: ProductSku): string[] {
  const feuilles = DOCUMENTS.filter((d) => d.sku === sku)
    .sort((a, b) => a.ordre - b.ordre)
    .map((d) => d.titre);
  if (feuilles.length > 0) return feuilles;
  return AVANTAGES[sku] ?? [];
}
