import { Champ,Encadre,Feuille,Titre } from "@/components/documents/Feuille";
export function LettreAuxEnfants(){return <Feuille titre="La lettre pour ouvrir le sujet avec vos enfants" sousTitre="Un modèle personnel à adapter : pas un acte, pas une annonce de partage.">
<Titre>Ouvrir le sujet sans prendre tout le monde de court</Titre>
<p>Un message permet à chacun de lire puis de choisir un moment. Gardez uniquement les phrases qui correspondent à votre situation. Vous n’avez pas à annoncer de montant ni à forcer une conversation.</p>
<Encadre titre="Votre brouillon">
<p>Mes chers [prénoms],</p>
<p>J’ai commencé à mettre mes informations en ordre. Ce qui compte pour moi, c’est que vous n’ayez pas un jour à chercher seuls les documents ou à deviner mes intentions.</p>
<p>Je souhaite d’abord préserver [ma priorité]. J’ai retrouvé certaines pièces et il reste des questions à faire vérifier. Je ne vous annonce pas aujourd’hui un partage ni une décision déjà prise.</p>
<p>J’aimerais vous expliquer ce que j’ai commencé et entendre vos questions. Seriez-vous disponibles [moment proposé] ? Si ce n’est pas le bon moment, nous pouvons en choisir un autre.</p>
<p>Je vous embrasse, [signature]</p>
</Encadre>
<Titre>Le fil de la conversation</Titre>
<ol><li>Expliquer votre intention, sans dramatiser.</li><li>Distinguer faits retrouvés, souhaits et réponses encore attendues.</li><li>Écouter et noter les questions sans promettre un résultat.</li><li>Choisir la prochaine démarche utile ; demander un accompagnement adapté si un conflit apparaît.</li></ol>
<Champ label="Message préparé ou envoyé le"/><Champ label="Prochaine conversation envisagée"/>
</Feuille>;}
