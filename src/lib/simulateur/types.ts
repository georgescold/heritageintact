/**
 * CE QUE LE CLIENT SAISIT, ET CE QUE LE MOTEUR EN REND.
 *
 * ⚠️ Tout est optionnel côté saisie, et c'est délibéré : un formulaire qui
 * refuse d'avancer tant qu'une case n'est pas remplie perd un lecteur de 78 ans
 * au premier champ qu'il ne sait pas renseigner. Chaque manque est remplacé par
 * une hypothèse, affichée en clair à côté du résultat.
 */

export type Lien = "enfant" | "petit-enfant" | "fratrie" | "neveu" | "sans-lien";

export type Heritier = {
  id: string;
  prenom: string;
  lien: Lien;
  /** Enfant d'une autre union, ou enfant du conjoint non adopté : change tout. */
  duConjointNonAdopte?: boolean;
  handicap?: boolean;
};

export type TypeBien = "residence" | "immobilier" | "liquide" | "titres" | "autre";

export type Bien = {
  id: string;
  libelle: string;
  type: TypeBien;
  valeur: number;
  /** En commun avec le conjoint : seule la moitié entre dans la succession. */
  enCommun?: boolean;
};

export type Contrat = {
  id: string;
  libelle: string;
  /** Primes versées AVANT le 70e anniversaire. Article 990 I. */
  verseAvant70: number;
  /** Primes versées APRÈS. Article 757 B. Le facteur cinq se joue ici. */
  verseApres70: number;
  /** Combien de bénéficiaires se partagent ce contrat. */
  beneficiaires: number;
};

export type Donation = {
  id: string;
  /** Année de la déclaration, pas de l'intention : c'est elle qui fait courir les 15 ans. */
  annee: number;
  montant: number;
  pour: string;
};

export type Saisie = {
  age?: number;
  ageConjoint?: number;
  /** M marié · P pacsé · U en couple sans mariage ni PACS · V veuf · S seul */
  vie?: string;
  heritiers: Heritier[];
  biens: Bien[];
  contrats: Contrat[];
  donations: Donation[];
  /** Dettes justifiées saisies séparément des biens. */
  dettes?: number;
};

/** Le détail par héritier, tel qu'il s'affiche : chaque ligne se vérifie. */
export type PartHeritier = {
  heritier: Heritier;
  part: number;
  abattement: number;
  abattementArticle: string;
  base: number;
  lignes: { de: number; a: number; taux: number; montant: number }[];
  droits: number;
  /** Ce que l'assurance-vie ajoute pour cet héritier, hors succession. */
  droitsAssuranceVie: number;
};

export type DateButoir = {
  cle: "quinze-ans" | "soixante-dix" | "soixante-et-onze";
  libelle: string;
  article: string;
  /** Nombre de mois restants. Négatif si la date est passée. */
  moisRestants: number | null;
  /** Ce qu'on écrit quand l'information manque pour la calculer. */
  note?: string;
};

export type Resultat = {
  masse: number;
  parts: PartHeritier[];
  total: number;
  dates: DateButoir[];
  hypotheses: string[];
};
