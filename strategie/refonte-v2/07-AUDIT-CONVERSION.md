# Audit honnête de la conversion — état de la V2
**Historique avant la passe V3.** Les points implémentés depuis cet audit sont détaillés dans [la livraison V3](08-LIVRAISON-CONVERSION-V3.md). Ne pas lire le tableau ci-dessous comme l’état actuel.

9 septembre 2026. Inspection du code local ; aucune mesure de trafic réel, aucun test A/B exécuté. Ce document ne revendique pas un taux maximal ni une hausse déjà démontrée.

## Références Valère relues
Dans la bibliothèque locale : 05-funnel/optimisation-checklist.md, 05-funnel/anatomie-funnel.md, 03-marketing-copy/structure-ceo.md, 03-marketing-copy/biais-cognitifs.md ; passages funnel et mesure du PROCESS-MAITRE.
Ces documents constituent le cadre de travail demandé, pas des preuves indépendantes des gains annoncés. Leur principe de mesure et d’itération est conservé. Les recettes de pression ou les chiffres de performance ne sont pas tenus pour universels.

## Ce qui est réellement intégré
| Axe | État vérifié | Limite |
|---|---|---|
| Promesse et objections | Bénéfice de préparation, sécurité personnelle, contenu et limites, FAQ, garantie | Plus explicite et cohérent ; efficacité commerciale non mesurée |
| Bump | Dossier 17 € au checkout, non coché, total 27/44 € | Pas de test de présentation ou d’aperçu du dossier |
| Upsell | Une proposition après paiement et qualification, avant la remise visible du guide | Choix d’architecture, pas preuve qu’une seule offre maximise le revenu |
| Packs | 197/247 €, crédit réel affiché, simulateur inclus | Présentation surtout textuelle, pas de démonstration visuelle des packs |
| Qualification | Quatre questions facultatives après achat | Pas de personnalisation avant la première vente |
| Routage commercial | Objectif et présence d’AV déterminent l’offre ; « comprendre » ne déclenche pas d’upsell | Situation familiale et enfants orientent les fiches, pas un argumentaire commercial entièrement personnalisé |
| Espace membre | Navigation, progression et documents pertinents ; compléments après première étape | Pas d’expérimentation de moment ou de présentation de l’offre |
| Emails | Sept textes de prospection intégrés, accompagnement existant | Campagnes LTV supplémentaires écrites mais non automatisées |
| Visuel | Hiérarchie, contrastes, boutons et lecture mobile contrôlés | Ce n’est pas une refonte commerciale visuelle exhaustive |
| Pop-ups et bouton fixe | Anciens composants présents dans le dépôt mais non montés sur les nouvelles pages examinées | Ni pop-up d’aide contextuelle ni test de bouton fixe actif |
| Preuve | Contenus réels et exemple rempli existent dans le produit | Aperçus visibles avant achat et présentation de l’éditeur à renforcer ; pas de témoignages vérifiés ajoutés |
| Mesure | Événements Meta historiques au checkout et sur merci | Pas de mesure complète et fiable du parcours/upsells ; consentement, timing et déduplication à auditer |

Fichiers vérifiés : src/app/page.tsx, methode/page.tsx, commande/page.tsx, situation/page.tsx ; src/components/OffrePreparation.tsx, QualificationBloc.tsx, espace/Boutique.tsx, ExitPopup.tsx, MetaPixel.tsx ; src/lib/qualification.ts et documents-pertinents.ts.
Le PixelEvent actuel dépend de la disponibilité du script et s’exécute au montage : ne pas présenter ces compteurs comme une attribution fiable avant recette. Les montants réellement réglés côté serveur doivent servir de référence.

## Application des mécanismes de persuasion
- Désir : préparer sa transmission et une discussion familiale, sans garantie fiscale.
- Réduction des peurs : conserver sa maîtrise, commencer à son rythme, prix et garantie visibles.
- Simplicité : un résultat concret de départ ; une offre complémentaire adaptée.
- Cadrage du prix : total du pack et crédit réellement payé, pas de valeur barrée fictive.
- Progression : première fiche et étapes confirmées par le membre.
- Preuve : montrer ce que le client utilisera ; c’est encore insuffisamment matérialisé sur les pages commerciales.
L’émotion, les démonstrations et la différenciation restent à renforcer. Une copie prudente n’est pas automatiquement une copie convaincante.

## Ce qui n’a pas été appliqué littéralement
Pas de supplément précoché, de compte à rebours inventé, de notifications d’achats fictifs, ni d’upsell présenté comme indispensable pour obtenir le résultat de l’achat initial.
L’absence d’une cascade d’offres et le placement après qualification sont des hypothèses compatibles avec la priorité donnée à la compréhension. Elles pourront être comparées à des alternatives cohérentes, avec mesure des remboursements et de l’usage.
Une offre réellement datée ne pourra être préparée qu’après décision explicite sur ses conditions. Les tarifs actuellement approuvés restent inchangés.

## Prochain travail commercial proposé — non implémenté dans cet audit
1. Preuve visuelle : aperçus issus du vrai dossier et du vrai espace, exemple rempli fictif signalé, vignette de l’atelier et comparaison lisible des inclusions. Ne pas suggérer la livraison d’un classeur physique.
2. Argumentaire des packs : associer chaque contenu à une tâche concrète ; expliciter pourquoi cette offre suit la réponse donnée ; faire voir la différence avec les 27 € déjà payés.
3. Qualification en amont : comparer le parcours actuel à une orientation courte avant vente, avec bénéfice immédiat et possibilité de passer. Ne pas déplacer quatre questions d’un bloc sans vérifier l’effet sur l’achat initial.
4. Aide à l’hésitation : tester un aperçu ou une réponse à une objection en sortie desktop, une seule fois, fermeture évidente et accessible. Pas pendant la saisie bancaire ; pas de remise automatique. Sur mobile, tester séparément un bouton fixe qui ne masque aucun contenu.
5. Relation et preuve : présentation authentique de l’éditeur, démonstration de la première action, retours réels autorisés si disponibles.
6. Mesure : événements d’exposition, achat, bump et complément séparés ; achat compté une fois depuis le paiement confirmé ; pas de coordonnées, réponses familiales ou jetons d’accès transmis aux plateformes publicitaires.
7. LTV : orchestration des textes déjà préparés à partir du besoin déclaré et des possessions, en respectant les préférences marketing ; ne pas multiplier les relances avant vérification d’usage.

## Ordre des tests, après résolution des points de lancement
| Priorité | Comparaison | Indicateur principal | Garde-fous |
|---|---|---|---|
| 1 | Page actuelle / même page avec démonstration réelle | Achat payé par visiteur exposé | Remboursements, compréhension, temps de chargement |
| 2 | Deux titres, reste identique | Revenu net par visiteur exposé | Activation, satisfaction |
| 3 | Bump textuel / aperçu du dossier | Revenu net du funnel par visiteur checkout | Achat initial, ajout involontaire déclaré |
| 4 | Upsell actuel / bénéfices contextualisés et aperçu | Revenu net complémentaire par acheteur éligible exposé | Refus bancaire, remboursement, usage |
| 5 | Qualification après / avant vente | Revenu net global par visiteur assigné | Abandon questionnaire, taux d’achat initial, données collectées |
| 6 | Sans / avec aide contextuelle | Revenu net global par visiteur assigné | Fermeture, gêne, accessibilité |
| 7 | Sans / avec campagne complémentaire éligible | Contribution nette par client assigné à 60/90 jours | Désinscriptions, plaintes, satisfaction |

Une variable principale à la fois ; affectation stable des variantes ; durée et taille d’échantillon fixées d’après le trafic et le taux observé avant conclusion. Pas d’arrêt opportuniste après quelques ventes. Ne pas déclarer gagnant sur le seul taux de clic.
L’objectif est la contribution nette et la satisfaction dans la durée, pas un taux d’acceptation isolé qui pourrait augmenter avec une offre moins rentable.
