import type { ProductSku } from "./config";
import type { Reponses } from "./qualification";

/** Texte commun aux guides PDF et à l'espace. Aucune promesse de résultat patrimonial. */
export const EDITORIAL_PRODUITS = {
 front: {
  ouverture: "Le jour où vos enfants chercheront les réponses, vous ne pourrez plus les leur donner.",
  histoire: [
   "Imaginez vos enfants assis devant le notaire. Ils viennent de perdre un parent et découvrent, au même moment, une facture, une date dépassée ou un document que personne ne retrouve. Ils ne se demanderont pas si vous les aimiez. Ils se demanderont simplement ce que vous aviez prévu et pourquoi personne ne leur en a parlé.",
   "Vous avez travaillé, payé la maison et voulu rester libre jusqu’au bout. Votre rêve n’est pas de devenir fiscaliste : c’est de garder votre sécurité aujourd’hui et de transmettre demain sans laisser une énigme à votre famille. Ce guide existe pour vous montrer les sept erreurs à connaître avant qu’une décision utile ne devienne plus coûteuse, plus complexe ou impossible à reprendre."
  ],
  apprendre: ["Identifier les trois dates qui avancent même lorsque vous ne faites rien : quinze ans, 70 ans et 71 ans.", "Reconnaître quatre erreurs familiales ou documentaires qui peuvent fausser un calcul ou retarder une décision.", "Savoir exactement quels documents retrouver et quelles questions poser pour votre propre situation."],
  adresse: ["Vous avez généralement 60 ans ou plus et vous voulez protéger votre autonomie autant que vos proches.", "Vous possédez un logement, de l’épargne ou une assurance-vie et vous ne savez pas si tout est réellement préparé.", "Vous êtes parent ou grand-parent, marié, pacsé, seul, ou votre famille comprend plusieurs unions.", "Vous avez déjà aidé un proche, ou vous hésitez à le faire, et vous voulez comprendre avant de décider."],
  essentiel: "Commencez par les trois dates promises dans la présentation, puis lisez les quatre erreurs qui ne se voient pas sur un relevé bancaire. Chaque chapitre va droit au but : ce que les gens ignorent, ce qu’il faut comprendre, un cas concret et les actions à mener.",
  limite: "Comprendre les règles ne suffit pas à établir les droits de votre famille. Ce guide prépare vos premières questions ; les pièces, les choix et leurs conséquences restent à examiner avec le professionnel.",
  acquis: "Vous savez désormais quoi regarder et quoi demander. Votre inquiétude a un point de départ concret.",
  suite: "Mais repérer les erreurs ne calcule pas encore votre cas. Le simulateur et le plan adapté relient vos réponses, les hypothèses et l’ordre des vérifications. Ne laissez pas votre première avancée retourner dans le tiroir."
 },
 bump: {
  ouverture: "Le rendez-vous approche. Votre inquiétude mérite mieux qu’une pile de papiers.",
  histoire: [
   "Imaginez-vous devant le notaire. Vous aviez tant de choses à demander… et au moment de parler, la question la plus importante vous échappe. Ce dossier existe pour vous éviter de tout porter dans votre tête.",
   "Vous n’avez pas à inventer l’organisation : partez de l’exemple rempli, rassemblez les pièces utiles et gardez une trace des réponses. Une pièce manque ? Vous saurez laquelle demander, sans repousser tout le rendez-vous."
  ],
  apprendre: ["Distinguer ce que vous savez de ce qui reste à retrouver.", "Préparer votre demande de rendez-vous et les documents utiles.", "Conserver les réponses, les responsables et les prochaines démarches."],
  adresse: ["Vous voulez prendre rendez-vous sans arriver avec une pile de papiers désordonnée.", "Vous craignez d’oublier une question importante ou de ne pas savoir quoi demander.", "Vous voulez garder une trace claire des réponses et des prochaines démarches."],
  essentiel: "Commencez par l’exemple de Claire et Marc, une famille fictive. Reprenez leur façon de classer, pas leur situation. Remplissez uniquement les rubriques utiles à votre prochain échange.",
  limite: "Ranger vos pièces ne suffit pas à choisir ce qui convient à votre famille. Le Dossier organise l’échange ; il ne tranche ni les droits ni les options.",
  acquis: "Vos pièces, votre demande et votre compte rendu ont maintenant une place. Vous n’avez plus à repartir d’une page blanche.",
  suite: "Ce qui reste à relier, ce sont les particularités de votre famille : conjoint, enfants d’une autre union, donations passées. Le simulateur et le plan adapté ajoutent ce fil. Regardez la suite maintenant, pendant que vos questions sont encore claires."
 },
 upsell1: {
  ouverture: "Votre famille ne tient pas dans un exemple trouvé sur Internet.",
  histoire: [
   "Vous avez lu une règle qui semblait simple. Puis vous avez pensé à votre conjoint, à une aide déjà donnée, à un enfant qui vit loin… et le doute est revenu. Ce n’est pas un manque d’attention : plusieurs histoires peuvent se croiser dans une même famille.",
   "Ce guide les remet dans le bon ordre. Vous choisissez votre situation, reliez les pièces aux questions et préparez un suivi. L’objectif : pouvoir expliquer ce qui compte pour chacun sans improviser une solution."
  ],
  apprendre: ["Repérer les questions spécifiques à votre famille, sans remplir les douze situations.", "Comprendre ce qu’une comparaison chiffrée suppose et ce qu’elle ne dit pas.", "Relier vos souhaits, vos documents et les démarches à faire confirmer."],
  adresse: ["Vous ne voulez plus raisonner à partir d’un exemple général.", "Votre famille, vos donations ou vos contrats rendent votre situation difficile à relier.", "Vous voulez une estimation pédagogique, des alertes et un ordre de préparation conservable en PDF."],
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
  adresse: ["Vous possédez au moins un contrat d’assurance-vie.", "Vous n’avez pas relu récemment la clause bénéficiaire ou l’historique des versements.", "Vous voulez vérifier ce qui est réellement enregistré avant d’envisager une modification."],
  essentiel: "Choisissez un contrat, lisez les six repères, puis utilisez le courrier. Pas de note à donner au contrat, pas de clause type à recopier : vous cherchez des informations confirmées.",
  limite: "Une réponse reçue ne suffit pas à valider une modification. Faites examiner les conséquences et la cohérence familiale avant de changer une clause ou un placement.",
  acquis: "Vous savez quelle version demander, quelles questions poser et où conserver les réponses. Vous avez les supports prévus pour ce travail.",
  suite: "Si votre préparation familiale est déjà faite, la suite n’est pas un autre achat : adressez votre demande et faites examiner la réponse. Sinon, votre espace peut vous orienter vers la préparation de la famille et de la maison."
 }
} as const;

export const OUVERTURES_CHAPITRES: Record<string,string> = {
 e0: "Vous n’avez rien à signer ici. Vous allez comprendre les erreurs avant de décider ce qui mérite une vérification.",
 e1: "Une date de donation oubliée peut changer ce qu’il reste réellement de l’abattement. Le temps passe même lorsque le dossier reste fermé.",
 e2: "Un contrat ouvert depuis vingt ans peut contenir des versements qui n’obéissent pas tous aux mêmes règles. Le 70e anniversaire sépare deux lectures très différentes.",
 e3: "À valeur de maison identique, le barème de la nue-propriété change au passage de 71 ans. Comprenez la marche avant d’en parler avec le notaire.",
 e4: "« Nous avons toujours tout partagé » raconte votre vie. Cette phrase ne dit pas encore qui possède, qui hérite et qui paie.",
 e5: "Vous vous souvenez d’avoir aidé un enfant. Lui aussi. Sans date ni preuve, ce souvenir peut devenir une question fiscale et familiale.",
 e6: "Vous voulez aider vos petits-enfants sans désavantager leurs parents ni fragiliser votre sécurité. Donation et succession ne répondent pas aux mêmes règles.",
 e7: "Le notaire peut sécuriser les décisions, mais il ne peut pas deviner les faits absents. Préparez l’histoire qu’il doit réellement étudier."
};

export type SuiteProduit = { sku: "upsell1"|"upsell2"|"pack1"; titre:string; besoin:string; cta:string };
const AV: SuiteProduit = {sku:"upsell2",titre:"Vous avez retrouvé la question. Ne la laissez pas sans réponse.",besoin:"Le guide assurance-vie ajoute la grille de lecture, les repères et le courrier à adapter. Passez du contrat rangé à une demande précise, puis à une réponse conservée.",cta:"Préparer maintenant ma demande à l’assureur"};
const FAMILLE: SuiteProduit = {sku:"upsell1",titre:"Comprendre ne suffit pas à simuler votre situation.",besoin:"Le simulateur utilise vos réponses et le plan adapté ordonne les hypothèses, les dates et les vérifications à préparer.",cta:"Simuler pour ma situation"};
/** L'appelant fournit les droits dépliés par chargerEspace. Aucun produit déjà possédé, aucun achat de fin de parcours. */
export function suiteProduit(moment:string, possede:ReadonlySet<ProductSku>, profil?:Reponses|null):SuiteProduit|null {
 const famille=possede.has("upsell1"), assurance=possede.has("upsell2");
 if(famille && (assurance || profil?.av!=="O"))return null;
 if(moment==="e2" || moment==="grille-audit-assurance-vie")return profil?.av==="O"&&!assurance?AV:null;
 if(moment==="upsell1" || moment==="tableau-bord-familial")return profil?.av==="O"&&!assurance?AV:null;
 if(!["front","bump","upsell2","e0","e4","e7","plan-en-1-page","compte-rendu","lettre-modification-clause"].includes(moment))return null;
 if(moment==="front"&&!famille)return FAMILLE;
 if(!famille) {
  if(profil?.av==="O"&&!assurance)return FAMILLE;
  return FAMILLE;
 }
 return profil?.av==="O"&&!assurance?AV:null;
}
