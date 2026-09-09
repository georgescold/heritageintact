import { droits, partNuePropriete, ABATTEMENTS } from "./simulateur/bareme";
/** Cas fictif choisi pour illustrer la headline, non représentatif et distinct de la VSL historique.
 * Comparaison du barème avant frais, déductions annexes et arrondis fiscaux.
 * Même parent, mêmes deux enfants et mêmes valeurs dans les deux scénarios. */
const enfants=2,maison=480_000,epargne=149_030,age=65;
const succession=2*droits((maison+epargne)/enfants-ABATTEMENTS.enfant).total;
const donation=2*droits(maison*partNuePropriete(age)/enfants-ABATTEMENTS.enfant).total;
export const EXEMPLE_HEADLINE={
 enfants,maison,epargne,age,succession,donation,
 ecart:Math.round(succession-donation),
 titre:"Et si vos enfants héritaient de 68 206 € de plus ?",
 hypotheses:"Un parent de 65 ans, sans conjoint, deux enfants recevant chacun la moitié ; maison de 480 000 € et épargne de 149 030 €. Aucune donation antérieure, abattement de 100 000 € disponible pour chaque enfant. Valeurs et règles supposées constantes.",
 scenarioA:"Sans opérations préparatoires : 314 515 € par enfant, moins 100 000 € d’abattement, soit 214 515 € soumis au barème par enfant.",
 scenarioB:"Avec donation de la nue-propriété à 65 ans : 60 % de 480 000 €, partagés entre les deux enfants ; 44 000 € taxables par enfant après abattement. L’épargne est placée avant 70 ans sur une assurance-vie récente, répartie à parts égales : 74 515 € par bénéficiaire, sous l’abattement de 152 500 €, sans autre contrat consommant cet abattement.",
 limites:"Comparaison pédagogique de droits, pas gain net : frais d’acte, frais du contrat, prélèvements sociaux, autres déductions et évolution du patrimoine exclus. Aucun rendement supposé. Donation régulière, pas de primes manifestement exagérées, pas d’autre succession taxable dans ce modèle. Les besoins du parent et les conséquences civiles doivent être examinés avant toute opération. Ce n’est pas une recommandation de donner ou placer cette épargne. Chaque famille doit faire vérifier ses propres hypothèses."
} as const;
