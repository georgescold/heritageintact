import { LECONS } from "./lecons";
import { ExempleDossier } from "@/content/documents/exemple-dossier";

import type { ReactNode } from "react";
import type { ProductSku } from "./config";
import { AbattementsDeChacun } from "@/content/documents/abattements-de-chacun";
import { Calendrier15Ans } from "@/content/documents/calendrier-15-ans";
import { CalendrierTroisDates } from "@/content/documents/calendrier-3-dates";
import { CompteRendu } from "@/content/documents/compte-rendu";
import { Decision70Ans } from "@/content/documents/decision-70-ans";
import { FicheFamille } from "@/content/documents/fiche-famille";
import { GrilleAuditAssuranceVie } from "@/content/documents/grille-audit-assurance-vie";
import { Inventaire } from "@/content/documents/inventaire";
import { LettreAuxEnfants } from "@/content/documents/lettre-aux-enfants";
import { LettreModificationClause } from "@/content/documents/lettre-modification-clause";
import { Lexique } from "@/content/documents/lexique";
import { MaSituation } from "@/content/documents/ma-situation";
import { MailRendezVous } from "@/content/documents/mail-rendez-vous";
import { PiecesAApporter } from "@/content/documents/pieces-a-apporter";
import { PlanConcubinsPacs } from "@/content/documents/plan-concubins-pacs";
import { PlanDonationsDejaFaites } from "@/content/documents/plan-donations-deja-faites";
import { PlanEnUnePage } from "@/content/documents/plan-en-1-page";
import { PlanEnfantEtranger } from "@/content/documents/plan-enfant-etranger";
import { PlanEnfantVulnerable } from "@/content/documents/plan-enfant-vulnerable";
import { PlanEntreprise } from "@/content/documents/plan-entreprise";
import { PlanFamilleRecomposee } from "@/content/documents/plan-famille-recomposee";
import { PlanImmobilierLocatif } from "@/content/documents/plan-immobilier-locatif";
import { PlanMarie1Enfant } from "@/content/documents/plan-marie-1-enfant";
import { PlanMarie2Enfants } from "@/content/documents/plan-marie-2-enfants";
import { PlanPatrimoineImportant } from "@/content/documents/plan-patrimoine-important";
import { PlanSansEnfant } from "@/content/documents/plan-sans-enfant";
import { PlanVeufVeuve } from "@/content/documents/plan-veuf-veuve";
import { QuestionsNotaire } from "@/content/documents/questions-notaire";
import { RegleMiseAJour } from "@/content/documents/regle-mise-a-jour";
import { SimulateurPapier } from "@/content/documents/simulateur-papier";
import { TableauBordFamilial } from "@/content/documents/tableau-bord-familial";
import { TroisClausesBeneficiaires } from "@/content/documents/trois-clauses-beneficiaires";
import { TroisPoches } from "@/content/documents/trois-poches";

export type EtapeMethode = {
  cle: string;
  numero: number;
  titre: string;
  minutes: number;

  resume: string;

  aFaire: string;

  siNonConcerne?: string;

  acquis: string[];

  videoIndex: number;

  documents: string[];
};

export type ProfilDocument = {
  vie?: string;
  enfants?: string;
  av?: string;
  age?: string;
};

export type DocumentImprimable = {
  cle: string;
  titre: string;

  sku: ProductSku;

  ordre: number;

  corps: (props: { profil?: ProfilDocument }) => ReactNode;
};

export const ETAPES: EtapeMethode[] = LECONS;

export const ETAPE_PRODUIT: Record<string, ProductSku | undefined> = {
  e3: "upsell2",
  e4: "upsell1",
  e7: "bump",
};

export const DOCUMENTS: DocumentImprimable[] = [
  {
    cle: "exemple-dossier",
    titre: "Un exemple de dossier rempli",
    sku: "bump",
    ordre: 14.5,
    corps: ExempleDossier,
  },
  {
    cle: "simulateur-papier",
    titre: "Ma fiche de calcul pédagogique",
    sku: "front",
    ordre: 1,
    corps: SimulateurPapier,
  },
  {
    cle: "calendrier-3-dates",
    titre: "Mes repères et vérifications",
    sku: "front",
    ordre: 2,
    corps: CalendrierTroisDates,
  },
  { cle: "lexique", titre: "Le lexique en une page", sku: "front", ordre: 3, corps: Lexique },
  {
    cle: "trois-poches",
    titre: "Combien garder pour soi : la règle des 3 poches",
    sku: "front",
    ordre: 4,
    corps: TroisPoches,
  },
  {
    cle: "lettre-aux-enfants",
    titre: "La lettre pour ouvrir le sujet avec vos enfants",
    sku: "front",
    ordre: 5,
    corps: LettreAuxEnfants,
  },
  {
    cle: "ma-situation",
    titre: "Quelle est ma situation ?",
    sku: "front",
    ordre: 6,
    corps: MaSituation,
  },
  {
    cle: "questions-notaire",
    titre: "Les 12 questions à poser à votre notaire",
    sku: "front",
    ordre: 7,
    corps: QuestionsNotaire,
  },
  {
    cle: "plan-en-1-page",
    titre: "Mon plan en une page",
    sku: "front",
    ordre: 8,
    corps: PlanEnUnePage,
  },
  {
    cle: "regle-mise-a-jour",
    titre: "La règle de mise à jour",
    sku: "front",
    ordre: 9,
    corps: RegleMiseAJour,
  },

  {
    cle: "inventaire",
    titre: "Mon inventaire patrimonial",
    sku: "bump",
    ordre: 10,
    corps: Inventaire,
  },
  { cle: "fiche-famille", titre: "Ma fiche famille", sku: "bump", ordre: 11, corps: FicheFamille },
  {
    cle: "pieces-a-apporter",
    titre: "Les 12 pièces à apporter chez votre notaire",
    sku: "bump",
    ordre: 12,
    corps: PiecesAApporter,
  },
  {
    cle: "mail-rendez-vous",
    titre: "Le message de prise de rendez-vous",
    sku: "bump",
    ordre: 13,
    corps: MailRendezVous,
  },
  {
    cle: "compte-rendu",
    titre: "Mon compte-rendu de rendez-vous",
    sku: "bump",
    ordre: 14,
    corps: CompteRendu,
  },

  {
    cle: "plan-marie-1-enfant",
    titre: "Situation 1 — Marié, 1 enfant",
    sku: "upsell1",
    ordre: 15,
    corps: PlanMarie1Enfant,
  },
  {
    cle: "plan-marie-2-enfants",
    titre: "Situation 2 — Marié, 2 enfants ou plus",
    sku: "upsell1",
    ordre: 16,
    corps: PlanMarie2Enfants,
  },
  {
    cle: "plan-famille-recomposee",
    titre: "Situation 3 — Famille recomposée",
    sku: "upsell1",
    ordre: 17,
    corps: PlanFamilleRecomposee,
  },
  {
    cle: "plan-veuf-veuve",
    titre: "Situation 4 — Veuf ou veuve",
    sku: "upsell1",
    ordre: 18,
    corps: PlanVeufVeuve,
  },
  {
    cle: "plan-concubins-pacs",
    titre: "Situation 5 — Concubins ou pacsés",
    sku: "upsell1",
    ordre: 19,
    corps: PlanConcubinsPacs,
  },
  {
    cle: "plan-sans-enfant",
    titre: "Situation 6 — Sans enfant",
    sku: "upsell1",
    ordre: 20,
    corps: PlanSansEnfant,
  },
  {
    cle: "plan-entreprise",
    titre: "Situation 7 — Avec une entreprise ou des parts",
    sku: "upsell1",
    ordre: 21,
    corps: PlanEntreprise,
  },
  {
    cle: "plan-immobilier-locatif",
    titre: "Situation 8 — Avec de l’immobilier locatif",
    sku: "upsell1",
    ordre: 22,
    corps: PlanImmobilierLocatif,
  },
  {
    cle: "plan-enfant-etranger",
    titre: "Situation 9 — Un enfant à l’étranger",
    sku: "upsell1",
    ordre: 23,
    corps: PlanEnfantEtranger,
  },
  {
    cle: "plan-enfant-vulnerable",
    titre: "Situation 10 — Un enfant vulnérable",
    sku: "upsell1",
    ordre: 24,
    corps: PlanEnfantVulnerable,
  },
  {
    cle: "plan-patrimoine-important",
    titre: "Situation 11 — Patrimoine supérieur à 1 million",
    sku: "upsell1",
    ordre: 25,
    corps: PlanPatrimoineImportant,
  },
  {
    cle: "plan-donations-deja-faites",
    titre: "Situation 12 — Des donations déjà faites",
    sku: "upsell1",
    ordre: 26,
    corps: PlanDonationsDejaFaites,
  },

  {
    cle: "tableau-bord-familial",
    titre: "Le tableau de bord familial",
    sku: "upsell1",
    ordre: 27,
    corps: TableauBordFamilial,
  },
  {
    cle: "abattements-de-chacun",
    titre: "Mes abattements à faire confirmer",
    sku: "upsell1",
    ordre: 28,
    corps: AbattementsDeChacun,
  },
  {
    cle: "calendrier-15-ans",
    titre: "Mon historique des donations et mon suivi",
    sku: "upsell1",
    ordre: 29,
    corps: Calendrier15Ans,
  },

  {
    cle: "grille-audit-assurance-vie",
    titre: "Ma grille de lecture assurance-vie",
    sku: "upsell2",
    ordre: 30,
    corps: GrilleAuditAssuranceVie,
  },
  {
    cle: "trois-clauses-beneficiaires",
    titre: "Comprendre trois logiques de désignation",
    sku: "upsell2",
    ordre: 31,
    corps: TroisClausesBeneficiaires,
  },
  {
    cle: "decision-70-ans",
    titre: "Assurance-vie : mes questions avant et après 70 ans",
    sku: "upsell2",
    ordre: 32,
    corps: Decision70Ans,
  },
  {
    cle: "lettre-modification-clause",
    titre: "Mon courrier de demande d’informations à l’assureur",
    sku: "upsell2",
    ordre: 33,
    corps: LettreModificationClause,
  },
];

export function etapeParNumero(n: number): EtapeMethode | null {
  return ETAPES.find((e) => e.numero === n) ?? null;
}

export function etapeParCle(cle: string): EtapeMethode | null {
  return ETAPES.find((e) => e.cle === cle) ?? null;
}

export function documentParCle(cle: string): DocumentImprimable | null {
  return DOCUMENTS.find((d) => d.cle === cle) ?? null;
}
