import type { Acces } from "./db";
export type EtatMembre = { etape0Ouverte: boolean; nbFaites: number };
export type EtapeClient = {
  cle: string;
  jour: number;
  objet: (prenom: string) => string;
  corps: (prenom: string, lien: string) => string[];
  bouton: { texte: string; chemin: (jeton: string) => string };
  ps?: string;
  condition?: (etat: EtatMembre) => boolean;
};
export const SEQUENCE_CLIENT: EtapeClient[] = [
  {
    cle: "c1",
    jour: 1,
    objet: () => "Votre accès et votre point de départ",
    corps: (p, lien) => [
      `Bonjour ${p},`,
      "Votre achat donne accès à un parcours lisible. Ouvrez « Mon parcours », puis la première étape : votre fiche de situation.",
      "Votre lien personnel fonctionne comme une clé : conservez-le dans vos favoris et ne le partagez pas.",
      `Votre espace : ${lien}`,
      "En cas de lien perdu, demandez son renvoi sur la page « Mon espace ». Aucun achat supplémentaire n’est nécessaire pour commencer.",
    ],
    bouton: { texte: "Ouvrir mon parcours", chemin: (j) => `/espace/${j}` },
  },
  {
    cle: "c2",
    jour: 3,
    condition: (e) => !e.etape0Ouverte,
    objet: () => "Dix minutes pour poser votre première question",
    corps: (p) => [
      `Bonjour ${p},`,
      "Si vous ne savez pas par où commencer, prenez simplement une feuille. Notez votre objectif, ce que vous savez déjà et une information manquante.",
      "La première étape vous guide à l’écrit. Vous pouvez vous arrêter après cette action et revenir plus tard.",
      "Ce n’est ni une déclaration fiscale ni une décision de donner : c’est un point de départ.",
    ],
    bouton: { texte: "Ouvrir la première étape", chemin: (j) => `/espace/${j}/etape/0` },
  },
  {
    cle: "c3",
    jour: 7,
    condition: (e) => e.nbFaites < 8,
    objet: () => "Reprendre sans tout recommencer",
    corps: (p) => [
      `Bonjour ${p},`,
      "Le bouton « Reprendre » de votre espace indique la première étape non terminée. Vos supports sont regroupés dans « Mon dossier ».",
      "Inutile de tout imprimer ou de tout finir cette semaine. Une question claire à faire valider vaut mieux qu’un dossier rempli à la hâte.",
      "Pour un problème d’accès ou une explication du parcours, répondez à cet email. Pour une décision juridique ou fiscale, adressez-vous au professionnel qui connaît votre situation.",
    ],
    bouton: { texte: "Reprendre mon parcours", chemin: (j) => `/espace/${j}` },
  },
];
export function etapeClientDue(
  acces: Acces,
  etat: EtatMembre,
  maintenant = Date.now(),
): EtapeClient | null {
  const jours = Math.floor((maintenant - new Date(acces.createdAt).getTime()) / 86400000);
  return (
    SEQUENCE_CLIENT.find(
      (e) => e.jour <= jours && !acces.envoyes.includes(e.cle) && (e.condition?.(etat) ?? true),
    ) ?? null
  );
}
