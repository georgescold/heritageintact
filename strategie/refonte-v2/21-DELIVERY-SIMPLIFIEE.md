# Delivery simplifiée — bilan de mise en œuvre

## Ce qui est préservé

Les titres, arguments d’urgence, histoires, pain points et boutons des pages de vente sont conservés. Les prix, remises, durées des offres, order bumps et chemins de paiement ne sont pas modifiés. Les ajouts de prise en main précèdent les propositions commerciales, sans les remplacer.

## Parcours client

- Mon parcours propose une première action selon les produits possédés, un document et un résultat attendu. Exemple : ouvrir la fiche famille du Dossier Notaire, noter les informations connues et celles à retrouver.
- Mon dossier reste l’inventaire des produits acquis, avec leurs téléchargements. Les fiches en ligne sont accessibles dans un volet propre à chaque produit.
- Le plan personnel reste distinct de la bibliothèque des douze situations. Les réponses enregistrées permettent de suggérer les fiches utiles ; les autres restent disponibles sans imposer leur lecture.
- La fin de chaque PDF valorise la préparation obtenue avant la transition commerciale existante.

## Questionnaire et résultat

Le questionnaire conserve une question à la fois. Les compléments portent sur le régime matrimonial, les dispositions signées, les quotes-parts, les enfants de différentes unions et la descendance, la répartition souhaitée, l’usufruit/nue-propriété, l’international, l’entreprise, les donations multiples, l’urgence et la priorité personnelle.

Une réponse inconnue ne devient pas un zéro. Les réponses numériques nécessitent une saisie, un choix explicite « Aucun / zéro » ou « Je ne sais pas ». Les informations manquantes donnent lieu à des indications pour les retrouver.

Le plan donne une première action, les vérifications, les pièces et les questions adaptées aux réponses. Un montant n’est affiché comme scénario personnel que dans le périmètre modélisable ; les situations qui nécessitent une étude particulière donnent les éléments à préciser. Ce travail n’étend pas le moteur à tous les cas successoraux possibles.

## Sauvegarde et accès

- Sauvegarde serveur avant passage à la question suivante, copie locale de reprise et récupération dans un autre navigateur.
- Fiches modifiables en ligne, bouton d’enregistrement et impression/PDF.
- Contrôle des produits possédés côté serveur, y compris pour les téléchargements et la sauvegarde des fiches.
- PDF personnel réservé aux détenteurs du Plan.
- Versionnement des enregistrements : une fiche ouverte sur deux appareils ne peut pas écraser silencieusement la dernière version.
- Nouvelle table PostgreSQL `delivery_documents`, créée à la première utilisation avec sécurité par ligne activée. Le serveur applicatif assure l’accès par email et produit ; aucune politique publique d’accès n’est créée.
- Les champs de santé de l’ancien questionnaire ne sont pas persistés par le nouveau point de sauvegarde. Les fiches rappellent de conserver les données sensibles dans les documents personnels.
- La politique de confidentialité décrit la nouvelle conservation des réponses et des fiches, plutôt que l’ancien traitement temporaire.

Les liens privés restent des clés d’accès : ils ne sont pas incorporés aux PDF partageables. Les liens des PDF renvoient vers la récupération sécurisée de l’espace par email, avec une consigne explicite. Les URL de sources officielles existantes n’ont pas fait l’objet d’une nouvelle validation juridique exhaustive.

## Emails — cohérence avec le processus CEO de Valère

Sources relues : `03-marketing-copy/emailing.md` et `03-marketing-copy/structure-ceo.md`.

- Séquence prospect J1–J7 : structure CEO existante conservée (rêve, excuse, peurs, doutes, ennemi, closing). Pas de nouvelle échéance artificielle ni de changement des arguments de vente.
- Email d’accès : consigne de téléchargement et point de départ réel, suppression de l’ancienne « fiche de situation » comme première étape.
- Trois emails de service : progression vers le guide et Mon dossier ; suppression des liens vers l’étape 0 et du bouton Reprendre qui n’existait plus. Ces emails ne deviennent pas des promotions.
- Reçus : lien Mon dossier pour les compléments ; le reçu transmis à Trustpilot reste sans clé privée.
- Relances commerciales existantes : angle et bénéfice propres au produit, pas de présomption que le client a rempli une fiche. Consentement et pause commerciale préservés. Suppression de la dépendance à l’ancienne étape 0, devenue inaccessible depuis le parcours courant. Calendrier J10/J17 inchangé.

## PDF

Les six fichiers sont régénérés depuis les sources : guide des 7 erreurs, Dossier Notaire, bibliothèque familiale, Assurance-vie, Dossier Testament et lexique offert. Total : 89 pages.

Les cinq produits ont un sommaire avec pages et liens internes, une consigne de prise en main propre au produit et un résultat attendu avant la suite commerciale. Le lexique explique comment rechercher une notion et ne contient pas les modèles et fiches des produits payants.

Des références résiduelles à un « plan en une page » absent du Dossier Notaire ont été remplacées par la liste de questions et l’agenda du client.

## Vérifications

- Compilation Next.js de production sans services externes.
- Tests isolés `test-delivery.mjs` : validation, inconnus, droits, révocation, conflits, origine et séquences.
- 170 contrôles `test-funnel-v7.mjs` : prix, remises, expirations, non-redébit et droits PDF.
- 45 contrôles `test-urgence-v10.mjs` : échéances et absence de réinitialisation.
- Génération d’un PDF personnel fictif.
- Recette Chrome locale avec comptes fictifs : questionnaire, seconde session sans localStorage, téléchargement payé seulement, fiche enregistrée puis récupérée dans un autre navigateur et absence de débordement global à 390 px.
- Contrôle des marges des 89 pages et inspection des planches de rendu PDF.

Les tests historiques ont été réalignés sur le nom actuel de la bibliothèque et le libellé actuel du cas chiffré, sans changer ces éléments dans les pages de vente.

## État de livraison

Modifications locales, non publiées dans cette intervention. Aucun email client, débit, changement de commande ni modification de base de production n’a été effectué. La migration PostgreSQL et le fonctionnement dans l’environnement hébergé restent à confirmer lors de la mise en ligne. Ce bilan ne remplace pas une séance d’utilisation par une personne novice réelle.
