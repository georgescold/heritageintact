# Livraison produit et funnel — V7, complétée par la V8 marketing

9 septembre 2026. Version locale non publiée. [Audit copywriting et corrections V8](18-AUDIT-COPY-VALERE-BRUNSON.md). [Checklist Loys](a-faire-loys/00-CHECKLIST.md).

## Ce qui est livré

| Demande | Réalisation |
|---|---|
| Produit 1 commun | Les 7 erreurs qui offrent votre héritage à l’État : départ + sept erreurs, huit exercices, neuf fiches. |
| Qualification obligatoire | Six réponses validées côté serveur après paiement ; aucune option « passer ». Réponse incertaine ou refus de tranche d’âge acceptés ; email du client non falsifiable par le formulaire. |
| Livraison cohérente | Accès créé au paiement, présentation du produit acheté avant la proposition ; droits conservés même en cas de refus d’un complément. |
| Aucun tournage pédagogique | Quatre PDF et les mêmes contenus à l’écran. VSL de vente distincte, fichier manquant. |
| Upsells ciblés | Une offre principale ; AV ciblée, pack familial, variante avec AV. Une autre entrée après la première fiche et aux étapes pertinentes. |
| Timers | Départ durable par email, horloge serveur, 20 min puis palier secondaire ; pas de réinitialisation à la visite. |
| Prix | Déduction des achats réellement payés avant remise ; contrôle du montant affiché avant tout débit. |
| Popups | Titre demandé, argument adapté au produit, une fois par session et fermeture clavier. |
| Emails | Sept étapes CEO ; consentement distinct, exclusion acheteurs/désinscrits, prix calculé à l’envoi et lien personnel. |
| Confidentialité | Quatre routes PDF protégées par possessions ; aucun PDF public sous public/. |
| Docs Loys | Checklist réécrite : plus de trois vidéos à tourner ; anciens scripts archivés sans suppression. |

## Guides prêts à lire

- Les 7 erreurs : 34 pages, huit leçons et exercices, neuf fiches, exemples et sources.
- Dossier pour le rendez-vous : 14 pages et six fiches, avec exemple rempli.
- Préparation familiale : 22 pages et quinze fiches ; l’atelier interactif reste dans l’espace.
- Assurance-vie : 10 pages, six repères expliqués et quatre fiches.

80 pages réparties en quatre PDF ; il est possible d’imprimer seulement la fiche utile. Les PDF ne se mettent pas à jour une fois téléchargés. La vérification visuelle corrige les débordements et les pages orphelines ; le contenu n’est pas une consultation individuelle.

## Prix appliqués

Tarifs catalogue : 52 / 17 / 197 / 247 / 67 €. Pas de vente autonome du simulateur.

Guide : aucun timer sur la vente ; 26 € pendant 2 minutes au clic vers la commande, 36,40 € pendant les 8 minutes suivantes, puis 52 €.
Compléments : 25 % pendant 20 minutes après qualification, 10 % jusqu’à 48 h, puis fin de réduction.
Dossier : 17 €, facultatif, non précoché, sans timer de réduction.

Exemple d’achats réellement payés : guide 26 € + Dossier 17 € = 43 € déduits.
Préparation : 197 − 43 = 154 € avant remise ; au premier palier, 115,50 € à ajouter.
Pack AV : 247 − 43 = 204 € avant remise ; au premier palier, 153 € à ajouter.

Un palier expiré ne vaut pas accord pour payer davantage : affichage actualisé puis nouvelle confirmation. Une réduction n’est jamais comptée comme de l’argent déjà payé. L’ancienne possession et le crédit réel ne disparaissent pas à la fin du timer.

## Contrôles reproductibles

Tests locaux : 1 826 assertions (1 340 refonte, 46 V3, 134 produit, 122 V5, 14 V6, 131 V7, 39 copy V8). Ils couvrent calculs, inclusions, profils, remises aux limites, erreurs d’écriture, absence de redébit simulé et droits PDF. Le message d’échec d’écriture dans test-funnel-v7 est volontaire : il vérifie le blocage du formulaire, pas une panne de production.

Compilation Next / TypeScript réussie sans services. Recette navigateur dans scripts/recette-funnel-v7.mjs, incluant la copy V8 : téléphone 390 px, bureau 1440 px, questionnaire réel sur fixture, offres, parcours, PDF, compteur et paiement fictif. 210 contrôles navigateur réussis, sans aucun appel aux services externes. Les 80 pages des PDF ont été rendues et inspectées ; le contrôle automatique ne détecte aucun débordement de marge.

Aucun paiement réel, email client, campagne ou migration distante. Une base fictive est isolée ; les appels réseau externes sont bloqués. Ces tests ne valident pas les services distants ni les courses concurrentes de production.

## Avant publication

1. VSL jointe, corrigée et validée ; les chiffres de la headline ne doivent pas être attribués à l’ancien scénario non comparable.
2. Relecture civile/fiscale et commerciale, notamment affichage des réductions/prix de référence, consentements, garantie et rétractation.
3. Décision sur la confidentialité du dépôt public avant de pousser les PDF payants.
4. Recette Postgres, Stripe/SCA/webhooks/remboursements/concurrence, Resend/DNS/boîtes réelles et Meta consenti.
5. Validation de prévisualisation puis publication autorisée par Git / API Vercel, jamais via CLI Vercel.

La dernière version publiée pour test est la V5. La V7/V8 est locale, non commitée et non publiée. La rentabilité, la conversion et la LTV restent à mesurer.
