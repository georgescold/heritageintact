import { Case,Champ,Encadre,Feuille,Titre } from "@/components/documents/Feuille";
export function RegleMiseAJour(){return <Feuille titre="La règle de mise à jour" sousTitre="Un dossier daté, des informations à revoir, une prochaine action.">
<Titre>Votre dossier décrit un moment, pas une vérité définitive</Titre>
<p>Votre famille, vos biens, vos besoins et les règles peuvent évoluer. Une revue annuelle est un rendez-vous utile, mais ne suffit pas lorsqu’un changement ou une échéance survient en cours d’année.</p>
<Encadre titre="Le bon réflexe"><p>Avant tout acte, faites vérifier les règles applicables à sa date, les droits de chacun et les pièces manquantes. Une ancienne simulation ne valide pas une nouvelle opération.</p></Encadre>
<Titre>Les quatre gestes de votre revue</Titre>
<ul><Case>Je date les estimations et je distingue toujours propriété actuelle, succession et fiscalité.</Case><Case>Je retrouve l’historique des dons par donateur et bénéficiaire, sans remettre tous les compteurs familiaux à zéro.</Case><Case>Je vérifie les documents des contrats et les informations attendues, sans modifier seul une clause.</Case><Case>Je consulte les sources officielles et note les questions à faire confirmer avant un projet.</Case></ul>
<Titre>Ce qui mérite une revue sans attendre</Titre>
<p>Mariage, PACS, séparation, naissance, décès, changement de résidence, achat ou vente, donation, besoin de financement ou échéance liée à un projet. Si un délai court déjà, contactez le professionnel directement.</p>
<Champ label="Dernière revue et sources consultées"/><Champ label="La nouvelle information à faire confirmer"/><Champ label="Prochaine démarche : à qui et quand"/>
<p>Les dates d’entrée en vigueur des textes varient. Ne supposez ni que les règles changent seulement en janvier ni qu’un montant ancien reste applicable.</p>
</Feuille>;}
