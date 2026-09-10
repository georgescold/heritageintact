# À faire par Loys — checklist unique V9

[Dernière passe marketing V8 : headline et copy réécrites](../18-AUDIT-COPY-VALERE-BRUNSON.md).

9 septembre 2026. Publication de test demandée. [Produits narratifs V9 et contrôles](../19-PRODUITS-NARRATIFS-V9.md).

## Ce qui est terminé pour toi

Le produit pédagogique est écrit : quatre guides PDF, sept erreurs sans quiz et 25 fiches réservées aux compléments, soit 54 pages. Les PDF sont téléchargeables dans l’espace selon l’achat. **Aucune vidéo pédagogique à tourner.** Les anciens scripts V1/V2/V3 et fonds Canva sont conservés comme archives, sans action attendue.

Les sept emails de vente et les compléments sont rédigés : [textes de production](../05-EMAILS.md). Tu n’as ni à écrire ces emails ni à manipuler les clés des services.

## 1. Fournir et faire finaliser la VSL de vente

La VSL n’est pas une vidéo de formation : elle reste à intégrer sur la page de vente.

- [ ] Fournir le fichier tourné ou un lien de téléchargement autorisé.
- [ ] Faire relire [les reprises ciblées](../scripts/VSL-REPRISES-CIBLEES.md), notamment les hypothèses des chiffres et les promesses absolues.
- [ ] Enregistrer uniquement les reprises nécessaires, si le montage ne suffit pas.
- [ ] Vérifier l’export et ses incrustations : même promesse que le produit écrit ; récits fictifs signalés ; pas de montant fiscal personnel certifié.
- [ ] Remettre l’export et les sous-titres validés.

L’activation de la vidéo sera une tâche technique. Aucun fichier vidéo n’a été reçu.

## 2. Obtenir la relecture professionnelle

- [ ] Transmettre [le brief](01-BRIEF-RELECTURE.md), les quatre PDF et la VSL à la personne compétente.
- [ ] Inclure les CGV, le questionnaire post-achat obligatoire, les consentements distincts et les nouvelles conditions de réduction : 20 % puis 10 % pour le guide ; 25 % puis 10 % pour les compléments.
- [ ] Faire vérifier la présentation des pourcentages et des prix de référence, la garantie, l’accès immédiat et la rétractation.
- [ ] Remettre des corrections écrites, avec la version et le périmètre relus.

Les sources officielles consultées et les tests techniques ne sont pas une validation juridique. Ne pas afficher de label « approuvé » sans autorisation.

## 3. Confirmer les éléments que toi seul peux attester

- [ ] Informations exactes de l’éditeur et de l’entreprise, coordonnées support, médiateur effectivement désigné.
- [ ] Personne chargée de répondre au support et d’honorer la garantie annoncée.
- [ ] Authentiques retours clients avec autorisation, si disponibles. Jean-Pierre et Martine restent des récits explicitement fictifs ; ils ne doivent pas être renommés « témoignages clients ».
- [x] Maintien du dépôt public confirmé par Loys, avec push des guides malgré leur accessibilité sur GitHub.
- [x] Push et redéploiement pour test autorisés par Loys.

Ton nom n’est pas utilisé dans l’argumentaire commercial. Les informations légales obligatoires restent un sujet distinct.

## 4. Tester simplement l’expérience

- [ ] Sur téléphone, essayer : email → page de vente → achat de test → six réponses → livraison → une proposition.
- [ ] Télécharger le guide acheté et suivre la première fiche sans explication de notre part.
- [ ] Vérifier un email d’accès et un email commercial de test dans tes boîtes ; tester aussi le lien de désinscription.
- [ ] Faire essayer le même parcours à quelques personnes représentatives et remonter leurs incompréhensions.

Il s’agit de tests utilisateurs, pas de témoignages ni de preuve statistique de conversion.

## Ce qui reste du côté technique — pas à rédiger ou coder par toi

- Intégrer la VSL après réception et validation.
- Ne jamais pousser les clés, fichiers d'environnement, données clients ou fixtures de recette.
- Vérifier la migration additive et l’unicité des horloges sur une copie Postgres.
- Tester Stripe/SCA, les webhooks, reprises, remboursements et achats concurrents en préproduction.
- Tester Resend sur boîtes réelles, les DNS SPF/DKIM/DMARC, suppressions et désinscriptions. Aucune délivrabilité « parfaite » ne peut être promise.
- Activer les campagnes seulement après recette ; pas d’envoi commercial sans consentement requis.
- Publier sur le dépôt et le projet Vercel vérifiés, **sans CLI Vercel**, puis contrôler le déploiement.

La version demandée pour publication de test est la V9. La VSL, les relectures et les essais de services ci-dessus restent distincts de la mise en ligne.
