# Recette et lancement

État du 9 septembre 2026. Travail local, sans push ni déploiement. Ne pas confondre code intégré, test simulé et service en production.

## Contrôles automatisés

Commande : node scripts/test-refonte.mjs. 1 332 assertions sur les fonctions pures : prix stables, crédit réel, plafonds et ordre des packs, historique, remboursement, 625 profils, huit leçons, séquences et calculs sous hypothèses.
Commande : node scripts/build-sans-services.mjs. Compilation Next avec chargement des variables de service neutralisé. L’indication « .env.local » dans le journal est la détection du fichier ; __NEXT_PROCESSED_ENV empêche son application, les clés de services étant également vidées.
Types et lint contrôlés. Deux avertissements préexistants restent dans l’ancien composant OffreFlash, qui n’est plus rendu par les nouvelles pages.

## Recette navigateur locale

Environnement isolé sur 127.0.0.1:3311 ; clients en example.invalid ; base JSON redirigée vers .build-refonte/db-test.json ; réseau externe bloqué et clés Stripe/Resend/DB absentes. Ne jamais utiliser ces fixtures dans la base réelle.
Contrôles : pages publiques desktop et mobile 390 px ; option dossier non cochée, total 27/44 € ; membre méthode ; membre pack ; documents ; leçon ; module assurance-vie ; atelier ; crédit affiché 170 € ; achat simulé et accès résultant.
L’achat depuis une commande ancienne doit demander une nouvelle confirmation dans l’espace. Les achats membres créent une commande distincte : le cumul se vérifie par email, pas en gonflant l’ancienne commande.
Les captures et scripts de recette sont dans .build-refonte, ignoré par Git. Le résultat final de cette recette est consigné dans REFONTE-SUIVI.md.

## Fonds

Un PPTX éditable et dix PNG générés depuis le fichier final ; structure, import et géométrie vérifiés ; chaque fond examiné visuellement. Aucun test dans Canva ou PowerPoint desktop n’est revendiqué.

## À valider impérativement avant publication

- Relecture professionnelle des repères civils/fiscaux, des limites du simulateur, des CGV, des mentions, de la renonciation et de la garantie. Les anciens droits contractuels priment en cas de différence.
- Corriger la VSL reçue avec la fiche de montage. Valider également audio, incrustations et sous-titres. Activer sa diffusion seulement après cela.
- Tourner V1 à V3, monter et importer les identifiants V2 ; vérifier la bonne vidéo dans chaque emplacement. Tout le produit reste lisible sans ces vidéos.
- Répéter en préproduction Stripe : achat initial 27/44 ; chaque pack avec crédits ; achat AV avant/après préparation ; SCA ; refus ; double clic ; webhooks rejoués ; interruption après débit ; remboursement partiel/total ; deux achats complémentaires concurrents. Le test local ne prouve pas ces échanges réels.
- Risques hérités à auditer : absence de verrou global entre achats concurrents de SKU différents ; gestion manuelle des remboursements partiels ; webhook qui répond 200 même après certaines erreurs. Ne pas lancer à grande échelle sans trancher ces points.
- Appliquer les colonnes additives de profil et de consentement sur une copie de la base, puis vérifier conservation des droits et commandes historiques. Les ALTER TABLE idempotents sont dans le code mais aucune migration distante n’a été exécutée ici.
- Vérifier l’accord marketing facultatif, l’opposition, la rétention, les sous-traitants et les traceurs. Aucun ancien lead n’est réputé consentant par défaut.
- Tester délivrabilité, nom d’expéditeur, liens personnels, réponse support, arrêt à l’achat et désinscription. Ne pas annoncer un email reçu avant vérification de l’envoi.
- Les nouvelles campagnes de compléments, retours d’usage et suivi sont des textes prêts, pas des automatisations actives. Leur orchestration doit respecter la priorité du service client.
- Confirmer les informations de l’entreprise, l’adhésion au médiateur et le processus réel de remboursement/support. Aucun délai humain nouveau n’a été promis.
- Vérifier le dépôt, la branche, la cible Vercel et les variables sur une prévisualisation avant promotion. Aucun site parallèle n’a été créé.

## Plan d’amélioration après lancement

Observer d’abord les premiers parcours accompagnés : trouvent-ils où commencer, savent-ils ce qu’ils ont acheté, peuvent-ils formuler une question utile ?
Mesurer par cohorte à 30/60/90 jours : panier initial, contribution nette après frais/support/remboursements, activation à J+3, progression, satisfaction, désinscriptions et litiges.
Ne garder un test de conversion que s’il n’aggrave pas la compréhension ou les remboursements. Tester d’abord le titre, la clarté du contenu et la preuve d’usage autorisée ; ni peur exagérée ni urgence inventée.
LTV : satisfaction et utilisation avant répétition des offres. Aucun objectif commercial ne justifie une vente inadaptée.
