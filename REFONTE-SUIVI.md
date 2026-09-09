# Héritage Intact — livraison locale de la refonte
[Publication V5 pour test demandée par Loys](strategie/refonte-v2/15-PUBLICATION-V5.md). Les états de non-publication ci-dessous sont historiques ; vérifier la confirmation de publication et la version dans Vercel. Les nouveaux timers ne font pas partie de cette livraison. Aucun redéploiement via le CLI Vercel : API uniquement.

Dernière passe : [V5 — compléments, consentement et pilotage](strategie/refonte-v2/13-LIVRAISON-V5.md), après la [conversion V3](strategie/refonte-v2/08-LIVRAISON-CONVERSION-V3.md) et les [guides V4](strategie/refonte-v2/10-GUIDES-ET-VALEUR-V4.md). Offres acquises/ajoutées, déductions réelles, actualisation de la priorité, capacité email, mesure serveur consentie et agrégats privés sont intégrés localement. Campagnes et Meta restent désactivés par défaut ; aucun gain commercial n’est encore mesuré. [Recette de mise en service Meta](strategie/refonte-v2/14-RECETTE-CONSENTEMENT-META.md).

9 septembre 2026. Les tarifs et inclusions sont ceux approuvés par Loys. La VSL reçue a été analysée ; aucun fichier vidéo n’a été fourni ou modifié.

## Commencer ici
[Dossier de livraison](strategie/refonte-v2/00-LIRE-EN-PREMIER.md) : stratégie avatar / process Valère, parcours, produit, documents, emails, tournage et recette.
[Reprises ciblées de la VSL](strategie/refonte-v2/scripts/VSL-REPRISES-CIBLEES.md).
[Fonds éditables](strategie/refonte-v2/visuels/Fonds-formation-Heritage-Intact.pptx) : dix diapositives et leurs PNG dans le même dossier.

## Réalisé
- Offre autonome à 27 €, dossier facultatif non précoché à 17 €, packs plafonnés à 197 € / 247 €, module assurance-vie à 67 € ; achats inclus effectivement payés déduits et droits historiques préservés.
- Simulateur inclus dans les packs, sans vente séparée. Atelier pédagogique limité à des hypothèses explicites, pas de diagnostic fiscal individuel.
- Pages et espace membre réorganisés ; une recommandation après qualification, accès livré avant proposition complémentaire.
- Huit étapes intégralement écrites, dossiers pratiques, exemple rempli, douze parcours familiaux.
- Trois scripts de formation et dix fonds visuels éditables, créés et vérifiés avec le skill Presentations. Import Canva non testé dans un compte.
- Sept emails de prospection intégrés au code ; consentement marketing facultatif et exclusion des anciens leads sans consentement enregistré. Campagnes LTV supplémentaires écrites mais non activées.
- VSL conservable par reprises ciblées : comparaisons chiffrées non comparables et promesses absolues à corriger. Sa diffusion reste désactivée tant que VSL_VALIDEE n’est pas true.

## Vérifications
- 1 641 assertions réussies (1 340 refonte + 46 V3 + 133 produit V4 + 122 V5), dont 625 combinaisons de qualification. Services simulés, sans réseau réel.
- Compilation de production Next réussie, TypeScript validé.
- ESLint : zéro erreur ; deux avertissements préexistants dans l’ancien composant OffreFlash.
- Recette V5 : 46 contrôles navigateur réussis, desktop et mobile 390 px ; choix/refus/retrait, offres, déductions, alternative volontaire, actualisation de priorité et cas de panne du consentement. Les contrôles initiaux de prix, accès et produit sont documentés dans les livraisons précédentes.
- Régression produit V4 rejouée après V5 : 84 contrôles navigateur réussis sur la compilation finale, mesure Meta désactivée. Total navigateur de cette passe : 130 contrôles.
- Dix fonds examinés visuellement après réimport du PPTX final ; structure et géométrie validées.
- Les contrôles utilisent uniquement des clients fictifs et une base isolée ; aucun paiement réel ni email client envoyé. Ces essais ne valident pas Stripe, Resend ou les migrations en production.
- Scripts de contrôle reproductibles : scripts/test-refonte.mjs et scripts/build-sans-services.mjs. Fixtures et captures locales dans .build-refonte, ignoré par Git.

## Dépôt et publication
Dépôt local : C:/Users/loysc/Desktop/Heritage Intact/PROJET-HERITAGE-INTACT/site.
Remote vérifié : https://github.com/georgescold/heritageintact.git ; branche main.
Les modifications sont locales et non commitées. Aucun push, déploiement Vercel, migration distante ou envoi de campagne n’a été effectué.

## Ce qui reste avant publication
Voir [la liste de lancement](strategie/refonte-v2/06-RECETTE-ET-LANCEMENT.md).
Le tournage n’est pas l’unique prérequis : corriger et faire valider la VSL ; faire relire le périmètre civil/fiscal et les conditions ; tester Stripe/SCA/remboursements/webhooks et achats concurrents en préproduction ; vérifier migration additive, délivrabilité et consentement ; confirmer la cible Vercel.
Les risques hérités de concurrence entre achats, remboursements partiels et réponses de webhooks sont consignés dans la recette, pas déclarés résolus.
Aucune hausse de ventes ou de LTV n’est démontrée à ce stade : elle devra être mesurée avec activation, satisfaction et remboursements.
