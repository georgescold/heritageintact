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
      "Votre guide vous attend dans « Mon dossier ». Téléchargez-le, ouvrez la première erreur et notez un point qui concerne votre situation. Vous n’avez pas besoin de lire tous les documents aujourd’hui.",
      "Votre lien personnel fonctionne comme une clé : conservez-le dans vos favoris et ne le partagez pas.",
      `Votre espace : ${lien}`,
      "En cas de lien perdu, demandez son renvoi sur la page « Mon espace ». Aucun achat supplémentaire n’est nécessaire pour commencer.",
    ],
    bouton: { texte: "Ouvrir mon parcours", chemin: (j) => `/espace/${j}` },
  },
  {
    cle: "c2",
    jour: 3,
    objet: () => "Dix minutes pour poser votre première question",
    corps: (p) => [
      `Bonjour ${p},`,
      "Si vous ne savez pas par où commencer, prenez simplement une feuille. Notez votre objectif, ce que vous savez déjà et une information manquante.",
      "Reprenez la première erreur du guide. Notez ce qui vous concerne et écrivez « à retrouver » lorsqu’une information manque. Gardez cette note avec le guide : vous saurez exactement où reprendre.",
      "Ce n’est ni une déclaration fiscale ni une décision de donner : c’est un point de départ.",
    ],
    bouton: { texte: "Retrouver mon guide", chemin: (j) => `/espace/${j}?vue=dossier` },
  },
  {
    cle: "c3",
    jour: 7,
    objet: () => "Reprendre sans tout recommencer",
    corps: (p) => [
      `Bonjour ${p},`,
      "Tous vos documents sont regroupés dans « Mon dossier ». Retrouvez le produit concerné, puis son bouton de téléchargement. Si votre produit comporte des fiches, vous pouvez aussi les remplir en ligne et les enregistrer.",
      "Inutile de tout imprimer ou de tout finir cette semaine. Une question claire à faire valider vaut mieux qu’un dossier rempli à la hâte.",
      "Votre avis nous aide à améliorer les guides : dans votre espace, l’onglet « Mon avis » vous prend deux minutes. Vous pouvez aussi publier un avis public sur Trustpilot.",
      "Pour un problème d’accès ou une explication du parcours, répondez à cet email. Pour une décision juridique ou fiscale, adressez-vous au professionnel qui connaît votre situation.",
    ],
    bouton: { texte: "Retrouver mes documents", chemin: (j) => `/espace/${j}?vue=dossier` },
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
