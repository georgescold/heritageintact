/**
 * LE PALIER DE LANCEMENT — une remise qui décroît, et qui ne triche pas.
 *
 * ═══ CE QUI REND CE MÉCANISME LICITE, ET CE QUI LE RENDRAIT ILLICITE ═══
 *
 * Une remise dégressive est une pratique commerciale normale. Elle devient une
 * pratique trompeuse (art. L121-2 et L121-4 du code de la consommation) dans
 * deux cas précis, et le code les ferme tous les deux :
 *
 * 1. SI ELLE SE RÉINITIALISE. Un compteur qui repart à −50 % quand on recharge
 *    la page annonce une urgence qui n'existe pas. Ici le palier se calcule sur
 *    `order.createdAt`, une date écrite en base au moment du paiement : ni un
 *    rechargement, ni un nouvel onglet, ni un cookie effacé, ni un autre
 *    appareil ne la déplacent. C'est plus solide que le compteur de la page de
 *    vente, qui vit dans un cookie.
 *
 * 2. SI LE PRIX DE RÉFÉRENCE N'EST JAMAIS PRATIQUÉ. Annoncer « −50 % » sur un
 *    prix que personne ne paie jamais, c'est inventer la remise. Ici le prix
 *    plein EST pratiqué : les mêmes produits se vendent à 297 € et 97 € depuis
 *    la boutique de l'espace membre, en permanence, et c'est ce que paiera tout
 *    acheteur qui revient plus tard. La remise du tunnel est une remise de
 *    lancement, mesurée par rapport à un prix réel.
 *
 * ═══ POURQUOI DEUX PALIERS ET PAS TROIS ═══
 *
 * Le troisième palier demandé (−10 %) n'a pas d'endroit où exister : au-delà de
 * 30 minutes, `FENETRE_UPSELL_MS` ferme le débit en un clic — la carte reste
 * enregistrée mais on refuse de s'en servir sans écran de confirmation, pour
 * qu'un lien rouvert trois mois plus tard dans l'historique d'un ordinateur
 * familial ne débite personne. Il n'y a donc plus de mécanisme pour encaisser
 * un −10 % : l'acheteur passe par l'espace, en deux clics, au prix plein.
 *
 * Ajouter un troisième palier reviendrait soit à rouvrir cette fenêtre — c'est
 * le seul vrai risque de fraude du funnel — soit à afficher une remise qu'on ne
 * peut pas débiter. Les deux sont pires que de s'arrêter à deux.
 *
 * ═══ LA PROPRIÉTÉ QUI DOIT SURVIVRE ═══
 *
 * ⚠️ Le palier s'applique À TOUS LES CHEMINS, jamais au seul pack. Sans cela,
 * 297 + 50 = 347 et pack = 347 deviendraient 297 + 50 = 347 et pack = 173 :
 * celui qui prend les deux produits l'un après l'autre paierait le double de
 * son voisin pour la même chose. C'est exactement la faille que la règle des
 * 47 € prétendait fermer.
 */

/** Les bornes, en millisecondes depuis la création de la commande. */
export const PALIERS: { jusqua: number; remise: number; nom: string }[] = [
  { jusqua: 10 * 60 * 1000, remise: 0.5, nom: "lancement" },
  { jusqua: 30 * 60 * 1000, remise: 0.3, nom: "prolonge" },
];

export type Palier = {
  /** La remise en fraction : 0,5 pour −50 %. 0 hors tunnel. */
  remise: number;
  /** Le nom court, pour la mesure. */
  nom: string;
  /** Millisecondes avant le palier suivant, ou null s'il n'y en a plus. */
  resteMs: number | null;
  /** La remise du palier suivant, pour l'annoncer honnêtement. */
  remiseSuivante: number | null;
};

/**
 * Le palier applicable à cette commande, maintenant.
 *
 * `maintenant` est un paramètre et non `Date.now()` : c'est ce qui rend cette
 * fonction vérifiable, et c'est la même discipline que le moteur du simulateur.
 */
export function palierDe(creeLe: Date | string | number, maintenant: number): Palier {
  const t0 = new Date(creeLe).getTime();
  const ecoule = maintenant - t0;

  for (let i = 0; i < PALIERS.length; i++) {
    const p = PALIERS[i];
    if (ecoule < p.jusqua) {
      const suivant = PALIERS[i + 1];
      return {
        remise: p.remise,
        nom: p.nom,
        resteMs: p.jusqua - ecoule,
        remiseSuivante: suivant ? suivant.remise : 0,
      };
    }
  }
  return { remise: 0, nom: "plein", resteMs: null, remiseSuivante: null };
}

/**
 * Le prix après remise, arrondi à l'euro INFÉRIEUR.
 *
 * ⚠️ Vers le bas, toujours. Quand on annonce « −50 % », l'arrondi doit aller
 * dans le sens du client : arrondir au plus proche donnerait parfois une remise
 * réelle inférieure au pourcentage affiché, et c'est précisément le détail
 * qu'un lecteur méfiant vérifie à la calculette.
 */
export function appliquerPalier(prix: number, remise: number): number {
  if (remise <= 0) return prix;
  return Math.floor(prix * (1 - remise));
}

/**
 * LE CRÉDIT — la même arithmétique, dite autrement, et dite VRAI.
 *
 * ═══ POURQUOI CE CADRE, ET OÙ EST LA LIGNE ═══
 *
 * « −50 % » et « il vous reste 174 € à utiliser » sont le même nombre, et ne
 * produisent pas le même effet : une remise, on la laisse passer ; un crédit
 * qu'on possède déjà, on ne le laisse pas expirer. C'est l'effet de dotation
 * doublé de l'aversion à la perte, et sur cette cible il y a un bonus — le
 * registre du crédit est celui d'une banque ou d'une administration, donc
 * celui d'une institution sérieuse, exactement l'inverse du bon de réduction.
 *
 * ⚠️ MAIS ON N'ANNONCE JAMAIS UN CRÉDIT QUI N'EXISTE PAS. Écrire « il vous
 * reste 2,49 € non réclamés » à quelqu'un à qui l'on n'a jamais rien accordé,
 * c'est créer l'impression fausse d'un avantage acquis — précisément ce que
 * l'article L121-2 du code de la consommation sanctionne, et précisément ce
 * qu'un lecteur de 74 ans qui vérifie tout finit par découvrir.
 *
 * Ce crédit-ci est réel, et il tient sur trois faits :
 *   · il a une CAUSE, qu'on écrit à l'écran : l'achat de La Méthode l'ouvre ;
 *   · il a un MONTANT calculé sur un prix RÉELLEMENT pratiqué — les mêmes
 *     produits se vendent 297 € et 97 € depuis l'espace, en permanence ;
 *   · il a une ÉCHÉANCE que le serveur fait respecter, adossée à
 *     `order.createdAt`, donc impossible à rouvrir en rechargeant.
 *
 * Le crédit n'est donc pas la remise déguisée : c'est la remise, rendue
 * vérifiable. Dire « nous vous offrons » serait faux — on ne donne rien, on
 * ouvre un droit à réduction daté. On dit « votre achat vous ouvre ».
 */
export function creditDe(prixPlein: number, remise: number): number {
  return prixPlein - appliquerPalier(prixPlein, remise);
}

/**
 * Le temps restant, en toutes lettres, pour l'afficher sans compteur qui
 * clignote. « 8 minutes » se lit d'un coup d'œil ; « 08:12 » demande de
 * comprendre un format.
 */
export function resteEnClair(resteMs: number | null): string | null {
  if (resteMs === null || resteMs <= 0) return null;
  const min = Math.ceil(resteMs / 60000);
  return min <= 1 ? "moins d'une minute" : `${min} minutes`;
}
