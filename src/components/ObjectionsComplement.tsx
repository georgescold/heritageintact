import { FAQ } from "./ui";
export function ObjectionsComplement({av=false,dossier=false}:{av?:boolean;dossier?:boolean}){
 const items=[
 {q:"« Je viens déjà d’acheter les 7 erreurs. Pourquoi aller plus loin ? »",a:av?"Le guide de base vous apprend quoi repérer. Ici, vous avez les trames pour demander à l’assureur ce qui est effectivement enregistré, comparer les réponses à votre intention et suivre les points non résolus.":"Le guide vous apprend quoi repérer. Mon plan adapté à ma situation est généré à partir de vos réponses pour estimer le cas modélisé, révéler ses hypothèses et ordonner les vérifications propres à votre situation."},
 {q:"« Le notaire ou l’assureur ne peut-il pas s’en charger ? »",a:"Il reste l’interlocuteur pour vérifier et conseiller. Ce complément vous aide à retrouver vos informations, formuler vos priorités et conserver les réponses chez vous. Prenez rendez-vous dès maintenant si nécessaire : n’attendez pas d’avoir rempli tous les supports."},
 {q:"« Je ne veux pas des dizaines de fichiers à comprendre seul. »",a:"Le guide PDF commence par un mode d’emploi : un point de départ, un exemple et une action. Les supports sont regroupés. Vous n’avez ni vidéo à attendre ni dossier parfait à constituer avant de commencer."},
 {q:"« Vais-je payer deux fois ce que j’ai déjà ? »",a:"Non. Chaque produit est distinct : le guide explique les erreurs, le Dossier prépare le rendez-vous, le simulateur + plan traite vos réponses et le guide assurance-vie organise la vérification des contrats. Aucun abonnement."},
 {q:"« Et si ce complément ne m’aide pas ? »",a:"La garantie commerciale de 30 jours s’applique selon les CGV. Écrivez à l’assistance depuis votre espace. Ce complément prépare vos échanges ; il ne promet ni économie fiscale garantie ni validation individuelle."}
 ];
 if(dossier)items.splice(2,0,{q:"« Un rendez-vous supplémentaire peut-il coûter plus cher ? »",a:"Pas automatiquement. Les échanges liés à un acte tarifé peuvent être inclus. Selon l’étude, une consultation distincte, des recherches, un écrit ou un rendez-vous supplémentaire peuvent toutefois être facturés. Demandez avant le premier échange ce qui est inclus et dans quel cas un devis sera établi."});
 return <section className="my-7"><h2 className="mb-4 text-[1.5rem]">Ce qui peut encore vous faire hésiter</h2><FAQ items={items}/></section>;
}
