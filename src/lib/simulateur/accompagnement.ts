import type { DonneesSimulation, PointPreparation } from "./donnees";

/** Le constat signale un sujet à vérifier, pas un dommage déjà subi. */
export function accompagnementPoint(point: PointPreparation) {
  const contenus = {
    protection: ["Vous pouvez commencer par une conversation et un inventaire de vos besoins ; vous n’avez pas à choisir seul un dispositif juridique.", "Quels pouvoirs le dispositif existant couvre-t-il, et qui pourra prendre le relais ?", "Vous avez identifié les personnes disponibles et obtenu une réponse sur les pouvoirs à formaliser."],
    famille: ["Un écart entre vos souhaits et les actes se repère en mettant les deux côte à côte. Ce point ne signifie pas que votre intention est impossible.", "Avec mes actes actuels, qui reçoit quoi, et quelle différence avec mon souhait ?", "Vous disposez de deux listes distinctes : vos intentions et les droits confirmés par le professionnel."],
    maison: ["Vous n’avez pas à décider immédiatement de vendre ou de transmettre. Commencez par distinguer propriété, occupation et financement des charges.", "Pour chacun des scénarios, qui pourrait occuper le logement, payer les charges et décider d’une vente ?", "Les propriétaires, leurs parts et les contraintes de chaque scénario sont identifiés."],
    "assurance-vie": ["La première démarche est documentaire : obtenir la version enregistrée. Il n’est pas nécessaire de modifier le contrat pour faire cette vérification.", "Pouvez-vous confirmer par écrit la clause actuelle et les dates des versements ?", "Vous avez reçu les documents et repéré les écarts éventuels avec vos intentions."],
    donation: ["Une donation passée n’est pas forcément un problème. Retrouver les pièces permet de distinguer ce qui reste à prendre en compte.", "Quels effets de chaque donation faut-il encore retenir, séparément sur le plan civil et fiscal ?", "Chaque donation est reliée à une date, un donateur, un bénéficiaire et une pièce."],
    dates: ["Un seuil d’âge n’est pas une obligation d’agir. Il sert à poser une question précise avant de décider, sans précipitation.", "Ce repère change-t-il concrètement mon projet, et quelle date exacte faut-il retenir ?", "Vous savez si une échéance vous concerne réellement, et sur quelle information elle repose."],
  };
  const [rassurance, question, resultatAttendu] = contenus[point.cle];
  return { rassurance, question, resultatAttendu };
}

export function incoherencesReponses(d: DonneesSimulation, annee = new Date().getFullYear()): string[] {
  return [
    ...(d.age < 70 && d.avApres > 0 ? ["Vous avez indiqué moins de 70 ans et des versements après 70 ans. Vérifiez l’âge du souscripteur concerné et la ventilation des versements ; ne déplacez pas les montants au hasard."] : []),
    ...(d.donationAnnee > annee || d.donationAnnee > 0 && d.donationAnnee < annee - d.age - 1 ? ["L’année de donation ne concorde pas avec votre âge ou l’année actuelle. Vérifiez la date et l’identité du donateur dans l’acte."] : []),
    ...(d.residenceTotale != null && d.quotePart != null && Math.abs(d.residence - Math.round(d.residenceTotale * d.quotePart / 100)) > 1 ? ["La part de résidence ne concorde pas avec la valeur totale et la quote-part. Reprenez ces trois informations dans votre titre de propriété."] : []),
  ];
}

export function questionsSituation(d: DonneesSimulation): string[] {
  const questions = ["Quels éléments de mon dossier sont confirmés, et lesquels empêchent encore de décider ?"];
  if (d.vie === "M") questions.push("Que possède déjà mon conjoint au titre de notre régime matrimonial, avant de parler de succession ?");
  if (["P", "U"].includes(d.vie)) questions.push("Quels droits mon partenaire a-t-il aujourd’hui, et quels actes faut-il examiner pour mon objectif ?");
  if (d.vie === "V") questions.push("La succession précédente est-elle entièrement réglée et mes droits sur les biens sont-ils établis ?");
  if (!d.enfants || d.beauxEnfants || d.petitsEnfants || d.fratrie || d.neveux || d.sansLien || d.recomposition === "O") questions.push("Parmi les personnes que je souhaite protéger, lesquelles ont des droits successoraux et lesquelles nécessitent une disposition particulière ?");
  if (d.descendantDecede !== "N") questions.push("Quels descendants faut-il prendre en compte et comment confirmer leurs liens de filiation ?");
  if (d.testament !== "N" || d.donationEpoux === "O") questions.push("Mes dispositions existantes sont-elles cohérentes entre elles et avec ma situation familiale actuelle ?");
  if (d.demembrement !== "N" && d.residence + d.immobilier > 0) questions.push("Quels biens sont détenus en pleine propriété, en usufruit ou en nue-propriété, et quelles valeurs faut-il distinguer ?");
  if (d.international !== "N") questions.push("Quels pays, résidences et biens doivent être examinés avant de déterminer les règles applicables ?");
  if (d.entreprise !== "N") questions.push("Quels statuts, accords ou engagements peuvent encadrer la transmission de mes parts ?");
  if (d.repartition === "N") questions.push("La répartition que je souhaite est-elle possible compte tenu des droits à respecter ?");
  if (d.dettes > 0) questions.push("Quelles dettes sont justifiées, à qui incombent-elles et lesquelles peuvent être retenues dans le calcul ?");
  if (d.urgence && d.urgence !== "non") questions.unshift("Quelle démarche doit être traitée en premier dans ma situation urgente, avec quel délai confirmé ?");
  return questions;
}
