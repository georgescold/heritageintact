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
  /**
   * c1 arrive quelques heures après l'email d'accès, qui a déjà donné le lien,
   * la clé, l'emplacement des documents et la première action. Répéter tout ça
   * faisait de c1 un doublon — c'était son défaut jusqu'au 12/09/2026.
   *
   * Son travail propre est ailleurs, et il est psychologique : à ce moment
   * précis, le risque n'est pas que le client ne trouve pas son dossier, c'est
   * qu'il le range « pour ce week-end » après avoir évité le sujet des années
   * (`strategie/02-avatar.md` : « ne rien faire, c'est ce qu'il fait depuis
   * 10 ans »). Un produit jamais ouvert, c'est un remboursement et zéro LTV.
   *
   * Structure CEO : on excuse l'échec passé, on nomme le réflexe, on réduit la
   * peur de ne pas comprendre (objection n°1 de l'avatar), on ferme sur le rêve.
   * Aucune logistique, et rien à vendre — la séquence client ne vend jamais.
   */
  {
    cle: "c1",
    jour: 1,
    objet: () => "Ne le rangez pas pour ce week-end",
    corps: (p) => [
      `Bonjour ${p},`,
      "Vous venez de faire quelque chose que vous repoussiez peut-être depuis des années. Ce n’est pas rien, et ça n’a rien à voir avec un manque de volonté : ce dossier mélange l’argent, la famille et sa propre disparition. Peu de gens s’y mettent de bon cœur.",
      "Il va maintenant se passer une chose très prévisible. Vous allez vous dire : « je regarderai ça tranquillement ce week-end. » Et le week-end, il y aura les petits-enfants, une course à faire, un rendez-vous. C’est exactement comme ça que dix ans passent.",
      "Alors faisons l’inverse, tout de suite. <strong>Dix minutes, un seul document, le premier.</strong> Vous n’avez rien à décider, rien à signer, rien à calculer ce soir.",
      "Et si un mot vous arrête, c’est normal : le vocabulaire de la succession a été écrit pour les professionnels, pas pour ceux qui transmettent. Chaque terme est expliqué là où il apparaît. Vous n’avez pas à devenir expert, ni à tout retenir.",
      "Parce que ce que vous cherchez, au fond, ce n’est pas de comprendre la fiscalité. C’est de pouvoir dire, au prochain repas de famille : « je m’en suis occupé. Voilà ce qui est réglé, et voilà ce qu’il reste à faire vérifier. »",
      "Ce soir, un seul document. Le reste suivra tout seul.",
    ],
    bouton: { texte: "Ouvrir le premier document", chemin: (j) => `/espace/${j}` },
    ps: "Si quelque chose ne s’ouvre pas ou ne fonctionne pas comme prévu, répondez simplement à cet email.",
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
