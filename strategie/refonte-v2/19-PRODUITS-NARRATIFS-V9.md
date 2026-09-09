# Produits narratifs V9 — version de test à publier

9 septembre 2026. Cette version remplace les consignes pédagogiques V7 : aucun quiz ni devoir à rendre. Le statut de publication est à vérifier sur le commit main et le déploiement Vercel correspondant.

## Structure appliquée

1. Une scène qui parle au lecteur, rappelle sa préoccupation et explique la raison du guide.
2. Trois apprentissages précis par guide ; deux repères annoncés par chapitre.
3. L'explication utile, sans cours scolaire parallèle.
4. Des fiches pratiques réservées aux besoins réels : inventaire, demande, questions, suivi.
5. Une transition qui relie l'acquis au besoin suivant, sans rendre le premier achat artificiellement inutilisable.

Les quatre guides et les 34 fiches ont une ouverture dédiée. Les huit doubles blocs de gestes, question, correction et auto-évaluation ont été retirés du PDF et de l'espace. Les anciens fichiers d'exercices restent des archives non importées dans le parcours actif.

## Contenus

| Guide | Pages | Supports |
|---|---:|---|
| Les 7 erreurs | 25 | Départ + sept erreurs, neuf fiches, exemples chiffrés et sources |
| Dossier pour le rendez-vous | 13 | Six fiches, dont exemple rempli et compte rendu |
| Préparation familiale | 20 | Quinze fiches ; atelier interactif dans l'espace |
| Assurance-vie | 9 | Six repères expliqués et quatre fiches |

67 pages au total, contre 80 auparavant. Les introductions sont communes entre PDF et espace. Les fiches web restent imprimables sans encarts commerciaux sur le papier.

## Moments de transition

- Après le premier point de situation : proposition familiale ; module AV prioritaire à l'entrée du guide si cet objectif est déclaré.
- Après la lecture du contrat : module AV uniquement en présence d'un contrat déclaré et non déjà possédé.
- Après la maison et la préparation du rendez-vous : pack familial ou pack avec AV, selon les réponses et les achats.
- Dans les fiches clés : plan en une page, compte rendu, grille AV, tableau familial, demande à l'assureur.
- En fin de parcours déjà possédé : pas de nouvelle vente ; demande, rendez-vous et suivi dans la vie réelle.

Une seule proposition par emplacement. Les PDF communs ne connaissent ni le client ni ses achats : leurs liens rejoignent l'espace, qui filtre les offres et les contenus inclus. Aucun prix périmé ni timer figé dans un PDF. Les horloges déjà enregistrées ne sont pas relancées par la lecture.

## Process utilisé

Process Valère : structure CEO, biais cognitifs, closing. Rêve et scène familière ; déculpabilisation du report ; soulagement par un mécanisme clair ; contraste entre repérer et organiser ; coût du report ; un CTA explicite. La règle de sobriété du closing est respectée : ne pas empiler tous les leviers dans chaque fiche.

Les besoins sont réels et les limites restent explicites. Aucun faux témoignage, aucune perte d'argent certaine causée par un refus, aucun conseil de signer ou donner sous pression. Même le dernier pack ne remplace pas un professionnel.

## Contrôles

- 2 051 assertions locales au total, dont 265 contrôles éditoriaux V9.
- 218 contrôles navigateur : mobile et ordinateur, quatre réponses obligatoires, achat simulé, contenus sans quiz, droits PDF et offres.
- Compilation Next/TypeScript réussie ; vérification visuelle des PDF avant push.
- Aucun paiement réel ni campagne activée pour cette recette.

## Publication autorisée

Loys a demandé le push et le redéploiement et a explicitement confirmé le maintien du dépôt public, y compris les guides. Cette décision rend les PDF récupérables depuis GitHub malgré la protection des téléchargements dans l'application. Aucun secret, .env.local, fixture client ou dossier de contrôle ne doit être poussé.

Cible : georgescold/heritageintact, main ; projet Vercel heritageintact ; Git et API Vercel uniquement, jamais le CLI Vercel. La VSL reste à joindre et valider ; la mise en ligne pour test ne vaut pas validation du lancement publicitaire.
