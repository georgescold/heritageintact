import type { Reponses } from "./qualification";
export const QUESTIONS = [
  { champ: "objectif", titre: "Que voulez-vous préparer en premier ?", choix: [["comprendre", "Repérer les erreurs qui peuvent concerner ma famille"], ["preparer", "Préparer mon rendez-vous"], ["assurance-vie", "Faire le point sur mon assurance-vie"]] },
  { champ: "vie", titre: "Quelle est votre situation aujourd’hui ?", choix: [["M", "Marié(e)"], ["P", "Pacsé(e)"], ["U", "En couple sans mariage ni PACS"], ["V", "Veuf ou veuve"], ["S", "Seul(e)"], ["?", "Ma situation reste à préciser"]] },
  { champ: "enfants", titre: "Avez-vous des enfants ?", choix: [["1", "Un enfant"], ["2", "Deux enfants ou plus"], ["R", "Au moins un enfant d’une autre union"], ["0", "Pas d’enfant"], ["?", "Ma situation familiale reste à préciser"]] },
  { champ: "av", titre: "Possédez-vous une assurance-vie ?", choix: [["O", "Oui"], ["N", "Non"], ["?", "Je ne sais pas"]] },
] as const;
export function profilComplet(r: Reponses | null | undefined): boolean {
  return Boolean(r && QUESTIONS.every(q => q.choix.some(([code]) => code === r[q.champ])));
}
