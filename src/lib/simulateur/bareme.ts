/**
 * LE DROIT, EN CONSTANTES NOMMÉES.
 *
 * ⚠️ Aucun nombre nu dans le moteur : tout vient d'ici, et chaque valeur porte
 * l'article qui la fonde. C'est ce qui rend une mise à jour de loi de finances
 * possible sans relire le calcul — on change une ligne, et l'article à côté dit
 * où aller vérifier.
 *
 * ⚠️ Ces montants sont ceux en vigueur au 8 septembre 2026. Une loi de finances
 * passe chaque décembre : `VERIFIE_LE` s'affiche sur chaque résultat, et il doit
 * être remonté à chaque vérification, même si rien n'a changé. Un chiffre juste
 * sans date de vérification vaut un chiffre faux le jour où on le conteste.
 */

export const VERIFIE_LE = "8 septembre 2026";

/** Une tranche du barème : jusqu'à `plafond`, on applique `taux`. */
export type Tranche = { plafond: number; taux: number };

/**
 * Barème en ligne directe — parent vers enfant, ou vers petit-enfant.
 * Article 777 du Code général des impôts.
 */
export const BAREME_LIGNE_DIRECTE: Tranche[] = [
  { plafond: 8_072, taux: 0.05 },
  { plafond: 12_109, taux: 0.1 },
  { plafond: 15_932, taux: 0.15 },
  { plafond: 552_324, taux: 0.2 },
  { plafond: 902_838, taux: 0.3 },
  { plafond: 1_805_677, taux: 0.4 },
  { plafond: Infinity, taux: 0.45 },
];

/** Barème entre frères et sœurs. Article 777. */
export const BAREME_FRATRIE: Tranche[] = [
  { plafond: 24_430, taux: 0.35 },
  { plafond: Infinity, taux: 0.45 },
];

/** Taux unique : neveux et nièces (55 %), puis sans lien de parenté (60 %). */
export const TAUX_NEVEU = 0.55;
export const TAUX_SANS_LIEN = 0.6;

/** Les abattements, par qualité de l'héritier. */
export const ABATTEMENTS = {
  /** Enfant, par parent. Article 779 I. */
  enfant: 100_000,
  /** Petit-enfant. Article 790 B. */
  petitEnfant: 31_865,
  /** Frère ou sœur. Article 779 IV. */
  fratrie: 15_932,
  /** Neveu ou nièce. Article 779 V. */
  neveu: 7_967,
  /** Toute autre personne. Article 788 IV. */
  sansLien: 1_594,
  /**
   * Abattement supplémentaire en cas de handicap. Article 779 II.
   * Il se CUMULE avec celui dû au lien de parenté — c'est ce cumul qui en fait
   * la disposition la plus généreuse du droit français, et la moins connue.
   */
  handicap: 159_325,
} as const;

/**
 * ASSURANCE-VIE — et c'est la PRIME VERSÉE qui compte, jamais la date
 * d'ouverture du contrat. L'erreur est fréquente et elle coûte cher : un contrat
 * ouvert à 40 ans n'est pas protégé pour autant si l'argent y est versé à 72.
 */
export const ASSURANCE_VIE = {
  /** Versements avant 70 ans : par bénéficiaire. Article 990 I. */
  avant70ParBeneficiaire: 152_500,
  /** Au-delà, prélèvement de 20 %, puis 31,25 % au-dessus du seuil ci-dessous. */
  avant70Taux1: 0.2,
  avant70Seuil2: 700_000,
  avant70Taux2: 0.3125,
  /**
   * Versements après 70 ans : 30 500 € AU TOTAL, tous contrats et tous
   * bénéficiaires confondus, puis le barème ordinaire. Article 757 B.
   * Un facteur cinq par rapport à la ligne du dessus, du jour au lendemain.
   */
  apres70Global: 30_500,
} as const;

/**
 * NUE-PROPRIÉTÉ : la part de la valeur retenue selon l'âge de l'usufruitier au
 * jour de la donation. Article 669 I.
 *
 * On ne garde que les bornes utiles à l'avatar. La règle : la nue-propriété vaut
 * 60 % de 61 à 70 ans révolus, et 70 % à partir de 71 ans — d'où la troisième
 * des 3 dates.
 */
export const NUE_PROPRIETE: { jusqua: number; part: number }[] = [
  { jusqua: 20, part: 0.1 },
  { jusqua: 30, part: 0.2 },
  { jusqua: 40, part: 0.3 },
  { jusqua: 50, part: 0.4 },
  { jusqua: 60, part: 0.5 },
  { jusqua: 70, part: 0.6 },
  { jusqua: 80, part: 0.7 },
  { jusqua: 90, part: 0.8 },
  { jusqua: Infinity, part: 0.9 },
];

/** La part de nue-propriété d'un bien, pour un usufruitier de cet âge. */
export function partNuePropriete(age: number): number {
  return (NUE_PROPRIETE.find((l) => age <= l.jusqua) ?? NUE_PROPRIETE[NUE_PROPRIETE.length - 1])
    .part;
}

/** Le compteur de rechargement d'un abattement, en années. Article 784. */
export const RECHARGEMENT_ANS = 15;

/**
 * Les droits dus sur une base taxable, tranche par tranche.
 *
 * Retourne le détail ET le total : le détail n'est pas décoratif, c'est ce qui
 * s'affiche à l'écran ligne à ligne. Un total seul se conteste ; un total dont
 * chaque tranche est visible se vérifie.
 */
export function droits(
  base: number,
  bareme: Tranche[] = BAREME_LIGNE_DIRECTE,
): { lignes: { de: number; a: number; taux: number; montant: number }[]; total: number } {
  const lignes: { de: number; a: number; taux: number; montant: number }[] = [];
  let total = 0;
  let bas = 0;
  for (const t of bareme) {
    if (base <= bas) break;
    const haut = Math.min(base, t.plafond);
    const montant = (haut - bas) * t.taux;
    lignes.push({ de: bas, a: haut, taux: t.taux, montant });
    total += montant;
    bas = t.plafond;
  }
  return { lignes, total };
}
