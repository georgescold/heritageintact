import type { ProductSku } from "./config";
import type { Reponses } from "./qualification";

/** Texte commun aux guides PDF et à l'espace. Aucune promesse de résultat patrimonial. */
export const EDITORIAL_PRODUITS = {
 front: {
  ouverture: "Vous avez payé la maison. Il reste à préparer ce qu’ils ne devront pas deviner.",
  histoire: [
   "Imaginez un dimanche chez vous. Les enfants repartent, la maison retrouve son calme. Vous regardez ces murs que vous avez mis des années à payer. Vous voulez leur laisser un appui, pas des questions qu’ils devront porter seuls.",
   "Si vous avez repoussé ce sujet, vous n’êtes pas un mauvais parent. Entre les termes inconnus et la peur de vous démunir, il est facile de refermer le dossier. Ce guide vous donne un ordre clair pour comprendre ce qui mérite votre attention, sans vous précipiter dans une donation."
  ],
  apprendre: ["Reconnaître les sept confusions qui peuvent laisser votre transmission mal préparée.", "Comprendre les repères de temps, de famille et de contrat qui méritent une vérification.", "Arriver à votre prochain échange avec vos priorités et des questions précises."],
  essentiel: "Lisez les sept erreurs, puis gardez les fiches dont vous avez besoin. Pas de questionnaire de connaissances ni de devoir à rendre : une seule priorité suffit pour commencer.",
  limite: "Comprendre les règles ne suffit pas à établir les droits de votre famille. Ce guide prépare vos premières questions ; les pièces, les choix et leurs conséquences restent à examiner avec le professionnel.",
  acquis: "Vous savez désormais quoi regarder et quoi demander. Votre inquiétude a un point de départ concret.",
  suite: "Mais repérer les erreurs n’organise pas encore les réponses propres à votre famille. Le pack Préparation relie les pièces, les situations familiales et le suivi du rendez-vous. Ne laissez pas votre première avancée retourner dans le tiroir."
 },
 bump: {
  ouverture: "Le rendez-vous approche. Votre inquiétude mérite mieux qu’une pile de papiers.",
  histoire: [
   "Imaginez-vous devant le notaire. Vous aviez tant de choses à demander… et au moment de parler, la question la plus importante vous échappe. Ce dossier existe pour vous éviter de tout porter dans votre tête.",
   "Vous n’avez pas à inventer l’organisation : partez de l’exemple rempli, rassemblez les pièces utiles et gardez une trace des réponses. Une pièce manque ? Vous saurez laquelle demander, sans repousser tout le rendez-vous."
  ],
  apprendre: ["Distinguer ce que vous savez de ce qui reste à retrouver.", "Préparer votre demande de rendez-vous et les documents utiles.", "Conserver les réponses, les responsables et les prochaines démarches."],
  essentiel: "Commencez par l’exemple de Claire et Marc, une famille fictive. Reprenez leur façon de classer, pas leur situation. Remplissez uniquement les rubriques utiles à votre prochain échange.",
  limite: "Ranger vos pièces ne suffit pas à choisir ce qui convient à votre famille. Le Dossier organise l’échange ; il ne tranche ni les droits ni les options.",
  acquis: "Vos pièces, votre demande et votre compte rendu ont maintenant une place. Vous n’avez plus à repartir d’une page blanche.",
  suite: "Ce qui reste à relier, ce sont les particularités de votre famille : conjoint, enfants d’une autre union, donations passées. Le pack Préparation ajoute ce fil. Regardez la suite maintenant, pendant que vos questions sont encore claires."
 },
 upsell1: {
  ouverture: "Votre famille ne tient pas dans un exemple trouvé sur Internet.",
  histoire: [
   "Vous avez lu une règle qui semblait simple. Puis vous avez pensé à votre conjoint, à une aide déjà donnée, à un enfant qui vit loin… et le doute est revenu. Ce n’est pas un manque d’attention : plusieurs histoires peuvent se croiser dans une même famille.",
   "Ce guide les remet dans le bon ordre. Vous choisissez votre situation, reliez les pièces aux questions et préparez un suivi. L’objectif : pouvoir expliquer ce qui compte pour chacun sans improviser une solution."
  ],
  apprendre: ["Repérer les questions spécifiques à votre famille, sans remplir les douze situations.", "Comprendre ce qu’une comparaison chiffrée suppose et ce qu’elle ne dit pas.", "Relier vos souhaits, vos documents et les démarches à faire confirmer."],
  essentiel: "Ouvrez votre fiche principale. Consultez les autres seulement si elles ajoutent une question utile. L’atelier est un outil de compréhension, pas un passage obligé avant le rendez-vous.",
  limite: "Votre dossier prépare l’étude de votre situation ; il ne remplace pas les actes ni le conseil du professionnel. Une urgence juridique n’attend pas la fin de la lecture.",
  acquis: "Vous disposez du parcours de préparation familiale : vos situations, vos pièces, vos hypothèses et votre suivi.",
  suite: "Si vous avez une assurance-vie, sa clause et son historique demandent une lecture distincte. Le guide dédié vous aide à préparer cette demande. S’il est déjà inclus dans votre achat, ouvrez-le dans votre espace : vous n’avez rien à racheter."
 },
 upsell2: {
  ouverture: "Vous connaissez le montant. Savez-vous ce que le contrat prévoit pour eux ?",
  histoire: [
   "Imaginez ouvrir le contrat que vous aviez soigneusement rangé. Vous reconnaissez le montant, mais la clause bénéficiaire vous laisse hésitant : est-ce bien la version actuelle ? C’est ce doute que ce guide vous aide à transformer en demande précise.",
   "Vous n’avez pas à devenir spécialiste ni à modifier quoi que ce soit à l’aveugle. Retrouvez les documents, comprenez les points à demander et conservez la réponse de l’assureur. Votre intention mérite d’être confrontée à ce qui est réellement écrit."
  ],
  apprendre: ["Distinguer le relevé, la clause en vigueur et l’historique des versements.", "Comprendre les principales logiques de désignation et les questions liées aux dates.", "Adresser une demande claire à l’assureur et suivre sa réponse."],
  essentiel: "Choisissez un contrat, lisez les six repères, puis utilisez le courrier. Pas de note à donner au contrat, pas de clause type à recopier : vous cherchez des informations confirmées.",
  limite: "Une réponse reçue ne suffit pas à valider une modification. Faites examiner les conséquences et la cohérence familiale avant de changer une clause ou un placement.",
  acquis: "Vous savez quelle version demander, quelles questions poser et où conserver les réponses. Vous avez les supports prévus pour ce travail.",
  suite: "Si votre préparation familiale est déjà faite, la suite n’est pas un autre achat : adressez votre demande et faites examiner la réponse. Sinon, votre espace peut vous orienter vers la préparation de la famille et de la maison."
 }
} as const;

export const OUVERTURES_CHAPITRES: Record<string,string> = {
 e0: "Vous pensez à votre conjoint, à vos enfants, à ce qu’ils trouveraient dans vos tiroirs. Tout semble important. Commencez par ce que vous voulez leur épargner : cette priorité donnera un sens à toute la lecture.",
 e1: "Vous voulez aider vos enfants sans devenir dépendant d’eux demain. Ce n’est pas égoïste : préserver vos besoins fait partie de leur protection. Regardez les dates, mais ne laissez pas un plafond fiscal décider à votre place.",
 e2: "« Nous avons toujours tout partagé. » Cette phrase raconte votre vie à deux. Elle ne dit pas encore quels droits chacun aurait si l’autre disparaissait. Ici, vous allez séparer votre souhait des règles à vérifier.",
 e3: "Le contrat est signé, le relevé arrive chaque année : vous pourriez croire le sujet clos. Pourtant, savoir combien il contient ne dit pas tout sur les personnes désignées. Retrouvez ce qui est écrit, aujourd’hui.",
 e4: "La dernière mensualité est payée. Ce soulagement, vous l’avez mérité. Mais protéger l’avenir de cette maison pose une autre question : quels droits voulez-vous garder et que pourraient recevoir vos proches ?",
 e5: "Vous vous souvenez d’avoir aidé un enfant. Lui aussi. Mais vous ne retrouvez plus la date ni le document. N’attendez pas que les souvenirs de chacun deviennent les seules pièces du dossier.",
 e6: "Vous voulez être juste. Vos enfants peuvent pourtant comprendre différemment une aide, un silence ou une intention. Quelques mots clairs aujourd’hui peuvent éviter de leur laisser tout à interpréter.",
 e7: "Imaginez sortir du rendez-vous en sachant ce qui a été confirmé et qui fait quoi ensuite. Ce dernier chapitre sert à cela : ne pas laisser une conversation importante redevenir un souvenir flou."
};

export type SuiteProduit = { sku: "upsell1"|"upsell2"|"pack1"; titre:string; besoin:string; cta:string };
const AV: SuiteProduit = {sku:"upsell2",titre:"Vous avez retrouvé la question. Ne la laissez pas sans réponse.",besoin:"Le guide assurance-vie ajoute la grille de lecture, les repères et le courrier à adapter. Passez du contrat rangé à une demande précise, puis à une réponse conservée.",cta:"Préparer maintenant ma demande à l’assureur"};
const FAMILLE: SuiteProduit = {sku:"upsell1",titre:"Comprendre ne suffit pas à relier toute l’histoire de votre famille.",besoin:"Le pack Préparation ajoute les fiches familiales, le Dossier, l’atelier et le suivi. Vos questions prennent place dans une préparation que vous pouvez apporter au rendez-vous.",cta:"Relier maintenant ma préparation familiale"};
/** L'appelant fournit les droits dépliés par chargerEspace. Aucun produit déjà possédé, aucun achat de fin de parcours. */
export function suiteProduit(moment:string, possede:ReadonlySet<ProductSku>, profil?:Reponses|null):SuiteProduit|null {
 const famille=possede.has("upsell1"), assurance=possede.has("upsell2");
 if(famille && (assurance || profil?.av!=="O"))return null;
 if(moment==="e3" || moment==="grille-audit-assurance-vie")return profil?.av==="O"&&!assurance?AV:null;
 if(moment==="upsell1" || moment==="tableau-bord-familial")return profil?.av==="O"&&!assurance?AV:null;
 if(!["front","bump","upsell2","e0","e4","e7","plan-en-1-page","compte-rendu","lettre-modification-clause"].includes(moment))return null;
 if(moment==="front"&&profil?.objectif==="assurance-vie"&&profil.av==="O"&&!assurance)return AV;
 if(!famille) {
  if(profil?.av==="O"&&!assurance)return {...FAMILLE,sku:"pack1",besoin:FAMILLE.besoin+" Les vérifications assurance-vie sont réunies dans le même pack."};
  return FAMILLE;
 }
 return profil?.av==="O"&&!assurance?AV:null;
}
