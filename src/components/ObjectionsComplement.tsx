import { FAQ } from "./ui";
export function ObjectionsComplement({av=false}:{av?:boolean}){
 return <section className="my-7"><h2 className="mb-4 text-[1.5rem]">Ce qui peut encore vous faire hésiter</h2><FAQ items={[
 {q:"« Je viens déjà d’acheter les 7 erreurs. Pourquoi aller plus loin ? »",a:av?"Le guide de base vous apprend quoi repérer. Ici, vous avez les trames pour demander à l’assureur ce qui est effectivement enregistré, comparer les réponses à votre intention et suivre les points non résolus.":"Le guide de base vous apprend quoi repérer. Le pack ajoute les fiches propres aux situations familiales, les trames de rendez-vous et l’atelier de comparaison. Vous passez de « je comprends le sujet » à « j’ai organisé mes éléments pour en parler »."},
 {q:"« Le notaire ou l’assureur ne peut-il pas s’en charger ? »",a:"Il reste l’interlocuteur pour vérifier et conseiller. Ce complément vous aide à retrouver vos informations, formuler vos priorités et conserver les réponses chez vous. Prenez rendez-vous dès maintenant si nécessaire : n’attendez pas d’avoir rempli tous les supports."},
 {q:"« Je ne veux pas des dizaines de fichiers à comprendre seul. »",a:"Le guide PDF commence par un mode d’emploi : un point de départ, un exemple et une action. Les supports sont regroupés. Vous n’avez ni vidéo à attendre ni dossier parfait à constituer avant de commencer."},
 {q:"« Vais-je payer deux fois ce que j’ai déjà ? »",a:"Non. Le récapitulatif sépare le prix de l’offre, vos achats inclus réellement payés, l’éventuelle réduction en cours et le complément à payer. Aucun abonnement. Vous conservez votre premier achat si vous refusez."},
 {q:"« Et si ce complément ne m’aide pas ? »",a:"La garantie commerciale de 30 jours s’applique selon les CGV. Écrivez à l’assistance depuis votre espace. Ce complément prépare vos échanges ; il ne promet ni économie fiscale garantie ni validation individuelle."}
 ]}/></section>;
}
