# V6 — restauration Direct Response et ordre du parcours

9 septembre 2026. Correction locale non publiée. La V5 publiée reste en ligne tant que cette passe n’est pas validée et publiée séparément. Aucun CLI Vercel utilisé.

## Ce qui change

Le produit 1 reste commun : même promesse, même contenu, même prix à 27 €, sans qualification avant sa vente. L’ancienne variante /lp-questions renvoie la même LP. Les anciens cookies d’objectif ne changent plus la page de vente.

Parcours visible :
LP avec prénom/email → présentation / VSL → commande (Dossier facultatif à 17 €) → questions facultatives → remise de la Méthode → proposition adaptée → espace membre.

La livraison technique est créée immédiatement après confirmation du paiement. Elle ne dépend pas du questionnaire ni de l’achat d’un complément. La page des questions conserve un lien de secours vers l’accès ; l’écran /bienvenue montre explicitement le produit acquis avant l’offre.

## Vente et hiérarchie des actions

- Formulaire de capture visible sur la LP, sans devoir ouvrir un accordéon. Consentement aux emails commerciaux distinct et non précoché.
- Accroche financière et familiale, projection dans ce que les enfants auront à retrouver, récits de Jean-Pierre et Martine restaurés avec les images existantes.
- Ces deux personnages étaient fictifs dans les sources d’origine : ils restent clairement identifiés comme récits illustratifs, pas comme avis clients.
- Emplacement VSL visible, puis CTA immédiat, avant l’argumentaire détaillé. Aucun faux bouton de lecture.
- Objection « je vais chez le notaire » traitée par la préparation du rendez-vous ; pas de comparaison tarifaire inventée.
- Valeur présentée en changements utiles, pas uniquement en nombre de fichiers.
- Coût du report expliqué avec les repères fiscaux, sans prétendre que l’achat fait économiser un montant déterminé.
- Une proposition recommandée, un seul formulaire de paiement sur l’upsell, placé avant les longs détails. Montant supplémentaire et déduction réels visibles.
- Sur la remise, le bouton principal propose la suite adaptée ; l’accès au produit reste clairement accessible en secondaire. Si le client veut seulement les bases, l’accès devient l’action principale.
- Pas de menus de packs concurrents affichés d’emblée. L’alternative assurance-vie reste dans un détail volontairement ouvert par le client.
- Refus simple et paiement explicite. Aucun ajout payant précoché.

## Qualification et recommandations

| Réponses | Suite immédiate |
|---|---|
| Comprendre les bases / passer les questions | Méthode, sans vente additionnelle immédiate |
| Priorité assurance-vie et contrat existant | Module assurance-vie |
| Préparation et assurance-vie existante | Pack Préparation avec assurance-vie |
| Autres cas | Pack Préparation |

Les accroches et raisons changent aussi selon famille recomposée, veuvage, PACS/union libre et absence d’enfant. Ces réponses orientent l’offre, elles ne constituent pas un diagnostic civil ou fiscal.

## Protection de la valeur du Dossier

/apercu ne charge plus MaSituation, ExempleDossier ni ExerciceGuide. Il ne contient que deux éléments fictifs de démonstration et une présentation des usages du Dossier. Aucun document complet masqué en CSS ou présent dans le HTML public.

Le lien du bon de commande annonce désormais un aperçu limité. L’email J4 est aligné et renvoie à la présentation de la Méthode, sans promettre les supports gratuits. Les documents complets restent derrière les contrôles d’accès de l’espace membre.

Attention indépendante : le dépôt georgescold/heritageintact a été vérifié public le 9 septembre. Ses sources contiennent les guides. La protection des routes du site ne protège pas les fichiers publiés sur GitHub. Passage en privé soumis à l’accord de Loys ; aucune modification de visibilité effectuée dans cette passe à ce stade. Cela n’effacerait pas d’éventuelles copies déjà faites.

## Ce qui est préservé

Huit étapes écrites, exercices, guides, fiches familiales, simulateur pédagogique inclus dans les packs, scripts de tournage et fonds visuels. Prix approuvés, déductions des achats effectivement payés et possessions historiques inchangés. Livraison, récupération d’accès, consentement, désinscription et mesure serveur conservés.

Le nom personnel n’apparaît pas dans l’argumentaire commercial. Les informations d’identification légales restent sur les pages légales.

## Application du process

Source : https://github.com/georgescold/Process-Valere, copie locale comparée à origin/main sans écart lors de cette passe.

Références mobilisées : PROCESS-MAITRE ; avatar-et-offre ; headline-hook-bigidea ; structure-ceo ; body-detaille ; 10-questions ; biais-cognitifs ; closing-copy ; vsl ; emailing ; anatomie-funnel ; landing-pages ; teardowns ; optimisation-checklist ; philosophie-produit ; formats-offre.

Traduction : rêve familial → obstacle concret → peurs contextualisées → objection du notaire → preuve d’usage → mécanisme en trois étapes → bénéfices → raison d’agir → garantie → CTA. Le formulaire LP et le CTA sous la présentation respectent l’architecture low ticket décrite.

Ce document décrit une application au projet, pas une approbation personnelle de Valère, ni une garantie de conversion. Les statistiques et exemples marketing du process ne sont pas des résultats mesurés sur Héritage Intact.

## Limites avant publication et trafic

- La VSL tournée n’a pas encore été fournie en fichier ou en lien exploitable. Son emplacement est visible, mais son playback ne peut pas être testé ni activé. Les reprises fiscales documentées restent nécessaires.
- Aucun nouveau timer personnel ni prix temporaire n’a été activé. Les prix restent stables. Pour annoncer une expiration commerciale, il faut que le tarif ou l’avantage expire réellement côté serveur, avec la règle prévue après expiration.
- Aucun nouveau témoignage authentique n’a été fourni.
- Les tests locaux n’attestent pas la délivrabilité réelle, Stripe live, les migrations ou la rentabilité publicitaire.
- Pas de nouveau push ni de déploiement pour cette correction avant présentation à Loys.

## Vérification
Résultat final : 1 656 contrôles automatisés (1 340 + 46 + 134 + 122 + 14), 169 contrôles navigateur V6 et 46 V5, soit 215 contrôles navigateur. Compilation Next/TypeScript réussie ; ESLint ciblé sans erreur. Aucun paiement réel, email client, migration distante ou publication déclenché.


Tests : scripts/test-refonte.mjs, test-conversion-v3.mjs, test-produit-v4.mjs, test-funnel-v5.mjs, test-restauration-v6.mjs.
Recettes : scripts/recette-restauration-v6.mjs et scripts/recette-funnel-v5.mjs, sur fixture fictive restaurée après chaque exécution, réseau tiers bloqué.
Compilation : scripts/build-sans-services.mjs --consent-ui (services désactivés ; seule l’interface de consentement est compilée pour la recette).

La recette V6 couvre LP commune malgré ancien cookie, email visible, consentement facultatif, VSL avant CTA, récits, aperçu limité, qualification post-achat réelle, remise avant offre, refus, unicité du paiement, protection des documents, huit exercices, guides et droits d’accès.
Captures locales dans .build-refonte/v6-*.png (non commitées).

## Pour Loys

La liste de travail manuel reste [a-faire-loys/00-CHECKLIST.md](a-faire-loys/00-CHECKLIST.md).
Les scripts se trouvent dans [scripts](scripts/).
Les fonds sont dans [visuels](visuels/).
Ne pas retourner toutes les vidéos : compléter les reprises VSL et les trois vidéos pédagogiques prévues.
