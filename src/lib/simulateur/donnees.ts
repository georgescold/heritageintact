import type { Heritier, Saisie } from "./types";

export type DonneesSimulation = {
  age: number;
  vie: string;
  residence: number;
  immobilier: number;
  epargne: number;
  titres: number;
  autres: number;
  dettes: number;
  enfants: number;
  petitsEnfants: number;
  fratrie: number;
  neveux: number;
  sansLien: number;
  beauxEnfants: number;
  handicap: number;
  avAvant: number;
  avApres: number;
  beneficiaires: number;
  donationAnnee: number;
  donationMontant: number;
};

export const CLE_SIMULATION = "hi_simulation_plan_v1";

export const DONNEES_VIDES: DonneesSimulation = {
  age: 65,
  vie: "M",
  residence: 0,
  immobilier: 0,
  epargne: 0,
  titres: 0,
  autres: 0,
  dettes: 0,
  enfants: 1,
  petitsEnfants: 0,
  fratrie: 0,
  neveux: 0,
  sansLien: 0,
  beauxEnfants: 0,
  handicap: 0,
  avAvant: 0,
  avApres: 0,
  beneficiaires: 1,
  donationAnnee: 0,
  donationMontant: 0,
};

function heritiers(d: DonneesSimulation): Heritier[] {
  const liste: Heritier[] = [];
  const ajouter = (
    n: number,
    lien: Heritier["lien"],
    prefixe: string,
    extra: Partial<Heritier> = {},
  ) => {
    for (let i = 0; i < Math.max(0, n); i++) {
      liste.push({ id: `${prefixe}-${i}`, prenom: `${prefixe} ${i + 1}`, lien, ...extra });
    }
  };
  ajouter(d.enfants, "enfant", "Enfant");
  ajouter(d.beauxEnfants, "enfant", "Enfant du conjoint", { duConjointNonAdopte: true });
  ajouter(d.petitsEnfants, "petit-enfant", "Petit-enfant");
  ajouter(d.fratrie, "fratrie", "Frère ou sœur");
  ajouter(d.neveux, "neveu", "Neveu ou nièce");
  ajouter(d.sansLien, "sans-lien", "Autre personne");
  for (let i = 0; i < Math.min(d.handicap, liste.length); i++) liste[i].handicap = true;
  return liste;
}

export function donneesVersSaisie(d: DonneesSimulation): Saisie {
  const biens = [
    ["Résidence principale", "residence", d.residence],
    ["Autres biens immobiliers", "immobilier", d.immobilier],
    ["Épargne", "liquide", d.epargne],
    ["Titres et placements", "titres", d.titres],
    ["Autres biens", "autre", d.autres],
  ]
    .filter(([, , valeur]) => Number(valeur) > 0)
    .map(([libelle, type, valeur], i) => ({
      id: `bien-${i}`,
      libelle: String(libelle),
      type: type as "residence" | "immobilier" | "liquide" | "titres" | "autre",
      valeur: Number(valeur),
    }));

  return {
    age: d.age,
    vie: d.vie,
    heritiers: heritiers(d),
    biens,
    dettes: d.dettes,
    contrats:
      d.avAvant || d.avApres
        ? [
            {
              id: "av-1",
              libelle: "Contrats déclarés",
              verseAvant70: d.avAvant,
              verseApres70: d.avApres,
              beneficiaires: Math.max(1, d.beneficiaires),
            },
          ]
        : [],
    donations: d.donationAnnee
      ? [
          {
            id: "don-1",
            annee: d.donationAnnee,
            montant: d.donationMontant,
            pour: "Bénéficiaires déclarés",
          },
        ]
      : [],
  };
}

export function planPreparation(d: DonneesSimulation): string[] {
  return [
    "Faire confirmer la propriété réelle des biens, les dettes déductibles et les personnes appelées à recevoir.",
    d.donationAnnee
      ? "Retrouver les actes et déclarations de donations avant de considérer un abattement comme disponible."
      : "Faire vérifier les abattements disponibles avant toute opération.",
    d.avAvant + d.avApres > 0
      ? "Obtenir la clause bénéficiaire actuellement enregistrée et l’historique des versements."
      : "Décider si l’assurance-vie fait partie des sujets à examiner.",
    "Comparer les scénarios utiles avec le professionnel avant toute décision irréversible.",
  ];
}

const CLES_MONTANTS = [
  "residence",
  "immobilier",
  "epargne",
  "titres",
  "autres",
  "dettes",
  "avAvant",
  "avApres",
  "donationMontant",
] as const;
const CLES_NOMBRES = [
  "enfants",
  "petitsEnfants",
  "fratrie",
  "neveux",
  "sansLien",
  "beauxEnfants",
  "handicap",
  "beneficiaires",
] as const;

export function validerDonneesSimulation(valeur: unknown): DonneesSimulation | null {
  if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) return null;
  const source = valeur as Record<string, unknown>;
  const d = {} as DonneesSimulation;
  const entier = (cle: string, min: number, max: number) => {
    const n = Number(source[cle]);
    return Number.isInteger(n) && n >= min && n <= max ? n : null;
  };
  const age = entier("age", 18, 120);
  const donationAnnee = entier("donationAnnee", 0, new Date().getFullYear());
  if (age === null || donationAnnee === null || (donationAnnee > 0 && donationAnnee < 1900)) {
    return null;
  }
  if (!new Set(["M", "P", "U", "V", "S"]).has(String(source.vie))) return null;
  d.age = age;
  d.vie = String(source.vie);
  d.donationAnnee = donationAnnee;
  for (const cle of CLES_MONTANTS) {
    const n = Number(source[cle]);
    if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) return null;
    d[cle] = n;
  }
  for (const cle of CLES_NOMBRES) {
    const n = entier(cle, 0, 30);
    if (n === null) return null;
    d[cle] = n;
  }
  const total = d.enfants + d.petitsEnfants + d.fratrie + d.neveux + d.sansLien + d.beauxEnfants;
  if (total < 1 || d.handicap > total) return null;
  return d;
}
