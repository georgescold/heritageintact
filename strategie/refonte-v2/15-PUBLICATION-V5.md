# Version V5 remise pour test

Le 9 septembre 2026, Loys a demandé de pousser la version actuelle sur le dépôt et de la redéployer pour tester, avant le travail sur les nouveaux timers.

## Périmètre

- Version décrite dans [la livraison V5](13-LIVRAISON-V5.md), prix stables de la V2 inclus.
- Les nouveaux tarifs temporaires et timers personnalisés discutés ensuite ne sont pas implémentés dans cette version.
- Meta, les campagnes commerciales et la VSL non validée restent inactifs tant que leurs interrupteurs ne sont pas activés après recette.
- Le compte Stripe de production héberge actuellement une clé de test, vérifiée en lecture seule via l’API Vercel avant publication. Cela ne signifie pas que les emails ou la base sont isolés : utiliser uniquement ses propres coordonnées pour les essais. Les webhooks, remboursements et la délivrabilité restent à valider.

## Destination vérifiée

Dépôt : `georgescold/heritageintact`, branche `main`. Projet Vercel : `heritageintact`, associé à ce dépôt. Domaine de visite : https://www.heritageintact.fr ; alias également présent : https://heritageintact.vercel.app.

Consigne de Loys : **ne jamais redéployer via le CLI Vercel**. Utiliser le token serveur déjà configuré et l’API Vercel, sans afficher ni publier de secret. Vérifier la version Git réellement déployée, attendre READY et contrôler le domaine avant d’annoncer une publication réussie.

Les mentions « local, non publié » dans les audits antérieurs décrivent l’état lors de ces livraisons. Ce document consigne la demande de publication ; la confirmation effective, sa version et son URL doivent être vérifiées dans Vercel et dans le compte rendu de publication. Une mise en ligne pour test ne vaut pas validation d’un lancement publicitaire.

## Tes documents

1. [Checklist Loys](a-faire-loys/00-CHECKLIST.md) : actions manuelles et informations à fournir.
2. [Script V1 — première fiche](scripts/V1-PREMIERE-FICHE.md).
3. [Script V2 — propriété et transmission](scripts/V2-PROPRIETE-TRANSMISSION.md).
4. [Script V3 — assurance-vie](scripts/V3-ASSURANCE-VIE.md).
5. [Reprises de la VSL déjà tournée](scripts/VSL-REPRISES-CIBLEES.md).
6. [Fonds éditables PowerPoint](visuels/Fonds-formation-Heritage-Intact.pptx) et [consignes Canva/PNG](visuels/LIRE-AVANT-IMPORT-CANVA.md).

Pour découvrir le résultat sans déclencher d’envoi ni d’achat : accueil, `/methode` et `/apercu`. L’espace membre nécessite un accès personnel valide ; aucun lien de client ou fixture de test n’est ajouté à ce document public.
