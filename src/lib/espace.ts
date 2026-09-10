/**
 * L'ASSEMBLEUR DE L'ESPACE MEMBRE — la seule porte entre les pages et la base.
 *
 * ⚠️ AUCUNE PAGE DE L'ESPACE NE REQUÊTE LA BASE DIRECTEMENT. Elles appellent
 * toutes `chargerEspace`. Ce n'est pas une préférence d'architecture : trois
 * règles du produit ne tiennent que si elles sont écrites une seule fois.
 *
 *   1. Un article remboursé ne donne plus accès à rien.
 *   2. Posséder Le Plan (297 €), c'est posséder Le Simulateur personnalisé :
 *      on ne le refacture jamais 147 €.
 *   3. Aucune offre n'est montrée à qui n'a pas ouvert l'étape 0.
 *
 * Une page qui lirait `commandesPayeesParEmail` elle-même retrouverait les
 * trois à sa façon, et se tromperait sur au moins une.
 *
 * ⚠️ CE FICHIER NE FAIT QUE LIRE. `chargerEspace` ne pose ni `vu_le`, ni
 * l'ouverture d'une étape : ces écritures appartiennent aux pages et aux
 * server actions. Un lecteur pur peut être appelé deux fois dans un rendu
 * sans conséquence — un lecteur qui écrit, non.
 */
import { INCLUS_DANS, PRODUCTS, type ProductSku } from "./config";
import { accesParJeton, commandesPayeesParEmail, progressionDe, profilParEmail, type Profil, type Acces } from "./db";
import {
  DOCUMENTS,
  ETAPES,
  ETAPE_PRODUIT,
  type DocumentImprimable,
  type EtapeMethode,
} from "./methode";

export type EtatEtape = {
  etape: EtapeMethode;
  /** Le membre a AFFICHÉ l'étape au moins une fois. C'est ce signal qui compte. */
  ouverte: boolean;
  /** Le membre a coché « j'ai terminé cette étape ». */
  faite: boolean;
};

export type EtatEspace = {
  profil: Profil | null;
  acces: Acces;
  /** Habilitation globale : tous les achats de cette adresse, expansion comprise. */
  possede: Set<ProductSku>;
  etapes: EtatEtape[];
  /** L'étape 0 historique a été ouverte au moins une fois. Conservé pour les anciens parcours. */
  etape0Ouverte: boolean;
  nbFaites: number;
  /** La première étape non terminée : le bouton « Reprendre ». `null` si tout est fait. */
  reprendre: EtapeMethode | null;
  /** Ce que le membre peut imprimer, trié dans l'ordre du classeur. */
  documents: DocumentImprimable[];
  /** Les produits disponibles et non possédés, ordonnés pour la boutique membre. */
  boutique: ProductSku[];
  /**
   * ⚠️ CHAMP ADDITIF, hors du contrat minimal, et il ne coûte rien à ignorer.
   *
   * `boutique[0]` est déjà le produit épinglé quand il y en a un, mais le hub
   * a besoin de savoir POURQUOI pour écrire sa ligne de contexte — « Vous
   * venez de terminer l'étape sur l'assurance-vie. » Sans ce champ il devrait
   * refaire le calcul, donc le refaire différemment.
   */
  epingle: { sku: ProductSku; etape: EtapeMethode } | null;
};

/**
 * L'ORDRE DE LA BOUTIQUE, hors produit épinglé.
 *
 * Du plus cher au moins cher à l'intérieur de chaque famille, upsells avant
 * backends : le membre a déjà acheté au moins une fois, et l'offre qui porte
 * le plus de valeur pour lui est celle qui couvre le plus de terrain.
 *
 * ⚠️ `front` n'y figure pas, et c'est délibéré : on est dans l'espace parce
 * qu'on a acheté. Le proposer serait au mieux absurde, au pire une double
 * facturation du produit d'appel.
 */
/**
 * LA SEULE FEUILLE QU'UN ACCÈS FERMÉ CONSERVE.
 *
 * Les CGV (art. 6) et deux emails de la séquence prospect promettent que le
 * client garde le simulateur même après remboursement. Cette constante est le
 * seul endroit qui traduit cette promesse en code : la changer, c'est changer
 * le contrat.
 */
const CLE_SIMULATEUR = "simulateur-papier";

const ORDRE_BOUTIQUE: ProductSku[] = [
  "upsell1",
  "bump",
  "upsell2",
  "pack1",
  "backend1",
  "backend2",
  "backend3",
  "backend4",
];

/**
 * LES SKU RÉELLEMENT POSSÉDÉS PAR UNE ADRESSE.
 *
 * Trois traitements, dans cet ordre, et aucun n'est optionnel :
 *
 *   1. Toutes les commandes payées de l'adresse, et pas seulement la dernière.
 *      `addItem` dédoublonne par commande ; un achat fait depuis l'espace crée
 *      une commande ADDITIONNELLE. Raisonner sur une seule commande laisserait
 *      donc invisible tout ce qui a été acheté après le tunnel.
 *   2. Les articles marqués `rembourse` sont écartés. Le remboursement se note
 *      dans l'article, jamais dans le statut de la commande — introduire un
 *      statut 'refunded' casserait le compteur de places fondatrices, qui
 *      filtre sur `status <> 'pending'` et compterait un remboursement comme
 *      une vente, sur un chiffre affiché en page de vente.
 *   3. L'expansion `INCLUS_DANS` : Le Plan à 297 € contient Le Simulateur
 *      Automatique. Elle est faite ICI, au calcul, donc partout à la fois —
 *      et pas au moment d'afficher la boutique. L'URL d'achat est devinable :
 *      une règle qui ne vivrait que dans le rendu ne protégerait rien.
 */
export async function possessions(email: string): Promise<Set<ProductSku>> {
  const commandes = await commandesPayeesParEmail(email);

  const acquis = new Set<ProductSku>();
  for (const commande of commandes) {
    for (const item of commande.items) {
      if (item.rembourse) continue;
      acquis.add(item.sku);
    }
  }

  // Clôture transitive plutôt qu'une seule passe : le jour où un produit
  // inclus en inclut lui-même un autre, la règle continue de tenir sans qu'on
  // ait à s'en souvenir. La boucle termine, le catalogue est fini et un SKU
  // déjà présent n'est jamais réexaminé.
  let aExaminer = [...acquis];
  while (aExaminer.length > 0) {
    const suivants: ProductSku[] = [];
    for (const sku of aExaminer) {
      for (const inclus of INCLUS_DANS[sku] ?? []) {
        if (acquis.has(inclus)) continue;
        acquis.add(inclus);
        suivants.push(inclus);
      }
    }
    aExaminer = suivants;
  }

  return acquis;
}

/**
 * TOUT L'ÉTAT D'UN MEMBRE, EN TROIS REQUÊTES.
 *
 * `null` signifie « jeton inconnu » — et il ne signifie jamais autre chose.
 * L'appelant rend alors `<LienInvalide />`, jamais une 404 : sur quelqu'un qui
 * a payé et qui doute déjà, un écran d'erreur brut est la confirmation qu'il
 * s'est fait avoir.
 *
 * ⚠️ UN ACCÈS RÉVOQUÉ EST RENVOYÉ, PAS ÉCARTÉ : la page a besoin de la date
 * pour l'écrire poliment. L'appelant DOIT donc tester `etat.acces.revoque`
 * avant de rendre quoi que ce soit. Par sécurité, un état révoqué revient déjà
 * vidé de sa boutique et réduit à la seule feuille du simulateur — un appelant
 * distrait ne peut ni vendre ni livrer autre chose à quelqu'un dont l'accès est
 * fermé.
 */
export async function chargerEspace(jeton: string): Promise<EtatEspace | null> {
  const acces = await accesParJeton(jeton);
  if (!acces) return null;

  const [possede, progression, profil] = await Promise.all([
    possessions(acces.email),
    progressionDe(acces.email),
    profilParEmail(acces.email),
  ]);

  const parEtape = new Map(progression.map((p) => [p.etape, p]));

  const etapes: EtatEtape[] = (possede.has("front") ? ETAPES : []).map((etape) => {
    const ligne = parEtape.get(etape.cle);
    return { etape, ouverte: Boolean(ligne), faite: Boolean(ligne?.faiteLe) };
  });

  // ⚠️ L'OUVERTURE, ET NON LA CASE COCHÉE. Quelqu'un qui a regardé l'étape 0
  // sans cocher a son chiffre : c'est le seul moment où une offre a du sens
  // pour lui, et le lui cacher parce qu'il n'a pas coché une case serait
  // absurde. La coche mesure l'avancement, l'ouverture mesure l'engagement.
  const etape0Ouverte = parEtape.has("e0");

  const nbFaites = etapes.filter((e) => e.faite).length;
  const reprendre = etapes.find((e) => !e.faite)?.etape ?? null;

  /**
   * ⚠️ UN ACCÈS FERMÉ GARDE LE SIMULATEUR, ET C'EST CONTRACTUEL.
   *
   * L'article 6 des CGV écrit noir sur blanc « le client conserve l'accès au
   * simulateur », et les emails de la séquence prospect le répètent deux fois
   * (« vous gardez le simulateur, vous ne pouvez pas y perdre »). Vider
   * `documents` en entier faisait disparaître Le Simulateur de Facture
   * Invisible avec le reste : sur un document contractuel, l'écart est
   * opposable, et il se découvre exactement le jour où le client est déjà
   * mécontent.
   *
   * Une seule feuille survit donc, et rien d'autre : ni les étapes, ni les
   * autres documents, ni la boutique.
   */
  const documents = acces.revoque
    ? DOCUMENTS.filter((d) => d.cle === CLE_SIMULATEUR)
    : DOCUMENTS.filter((d) => possede.has(d.sku)).sort((a, b) => a.ordre - b.ordre);

  const epingle = acces.revoque ? null : produitEpingle(progression, possede);

  const boutique =
    acces.revoque
      ? []
      : [
          ...(epingle ? [epingle.sku] : []),
          ...ORDRE_BOUTIQUE.filter(
            (sku) => PRODUCTS[sku].disponible && !possede.has(sku) && sku !== epingle?.sku
              && !(sku === "pack1" && possede.has("upsell1")),
          ),
        ];

  return {
    acces,
    profil,
    possede,
    etapes,
    etape0Ouverte,
    nbFaites,
    reprendre,
    documents,
    boutique,
    epingle,
  };
}

/**
 * LE PRODUIT ÉPINGLÉ EN TÊTE DE BOUTIQUE.
 *
 * Celui de la DERNIÈRE étape terminée, au sens du temps et non du numéro :
 * quelqu'un qui revient faire l'étape 3 après avoir fait la 4 vient de penser
 * à son assurance-vie, pas à sa maison. C'est `faite_le` qui le dit.
 *
 * ⚠️ Trois raisons de ne rien épingler, et toutes sont normales : l'étape
 * terminée n'a pas de produit associé, le produit n'est pas encore disponible,
 * ou le membre le possède déjà. Dans ces cas la boutique reste ordonnée par
 * défaut — on ne va pas chercher plus loin dans l'historique, un produit
 * épinglé pour une étape terminée il y a trois semaines ne dit plus rien.
 */
function produitEpingle(
  progression: { etape: string; faiteLe?: string }[],
  possede: Set<ProductSku>,
): { sku: ProductSku; etape: EtapeMethode } | null {
  let plusRecente: { etape: string; faiteLe: string } | null = null;
  for (const p of progression) {
    if (!p.faiteLe) continue;
    if (!plusRecente || p.faiteLe > plusRecente.faiteLe) {
      plusRecente = { etape: p.etape, faiteLe: p.faiteLe };
    }
  }
  if (!plusRecente) return null;

  // Sorti du `let` avant toute fermeture : une variable réassignable capturée
  // dans une callback perd son affinement de type, et le code se met à mentir.
  const cle = plusRecente.etape;

  const sku = ETAPE_PRODUIT[cle];
  if (!sku || !PRODUCTS[sku].disponible || possede.has(sku)) return null;

  const etape = ETAPES.find((e) => e.cle === cle);
  return etape ? { sku, etape } : null;
}
