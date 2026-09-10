import type { Reponses } from "./qualification";
export const QUESTIONS = [
  { champ: "objectif", titre: "Qu’est-ce qui vous inquiète le plus aujourd’hui ?", choix: [["maison", "Que mes enfants doivent vendre la maison pour payer les droits"], ["facture", "Ne pas savoir quelle part l’État pourrait prendre"], ["date", "Découvrir trop tard que j’ai laissé passer une date importante"], ["documents", "Que mes proches ne retrouvent pas les documents et les réponses"], ["assurance-vie", "Que mon assurance-vie ne protège pas la bonne personne"]] },
  { champ: "vie", titre: "Quelle est votre situation aujourd’hui ?", choix: [["M", "Marié(e)"], ["P", "Pacsé(e)"], ["U", "En couple sans mariage ni PACS"], ["V", "Veuf ou veuve"], ["S", "Seul(e)"], ["?", "Ma situation reste à préciser"]] },
  { champ: "enfants", titre: "Avez-vous des enfants ?", choix: [["1", "Un enfant"], ["2", "Deux enfants ou plus"], ["R", "Au moins un enfant d’une autre union"], ["0", "Pas d’enfant"], ["?", "Ma situation familiale reste à préciser"]] },
  { champ: "age", titre: "Dans quelle tranche d’âge vous situez-vous ?", choix: [["a", "Moins de 60 ans"], ["b", "De 60 à 64 ans"], ["c", "De 65 à 69 ans"], ["d", "70 ans"], ["e", "71 ans ou plus"], ["X", "Je préfère ne pas répondre"]] },
  { champ: "av", titre: "Possédez-vous une assurance-vie ?", choix: [["O", "Oui"], ["N", "Non"], ["?", "Je ne sais pas"]] },
  { champ: "blocage", titre: "Qu’est-ce qui vous empêche surtout d’avancer aujourd’hui ?", choix: [["ordre", "Je ne sais pas quoi faire en premier"], ["securite", "J’ai peur de me déposséder ou de manquer plus tard"], ["complexite", "Les démarches et les mots sont trop compliqués"], ["documents", "Je ne sais pas quels documents réunir ni quoi demander"], ["delegation", "Je pensais que mon notaire ou ma banque s’en occupait"], ["pret", "Rien : je veux agir maintenant"]] },
] as const;
export function profilComplet(r: Reponses | null | undefined): boolean {
  return Boolean(r && QUESTIONS.every(q => q.choix.some(([code]) => code === r[q.champ])));
}
