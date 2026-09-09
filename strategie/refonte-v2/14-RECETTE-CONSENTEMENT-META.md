# Consentement et mesure Meta — mise en service contrôlée

9 septembre 2026. Code préparé avec l’accord explicite de Loys. Aucun envoi réel réalisé. Ce document décrit les vérifications restantes, pas des validations acquises.

## Ce qui matérialise le choix

Le bandeau affiche le destinataire Meta, les données transmises, la finalité et la liberté de refuser. Autoriser et Refuser ont la même visibilité. La fermeture n’autorise rien. Le lien « Mes préférences publicitaires » permet de revenir sur le choix.

Le cookie `hi_publicite` contient seulement un jeton aléatoire : HttpOnly, SameSite=Lax, Secure en HTTPS, durée 180 jours. La base conserve son empreinte, la décision, sa date, la version et le texte présenté, l’expiration et le retrait éventuel. Changer de choix retire l’ancienne preuve active avant de créer la nouvelle. Sans stockage disponible, aucun nouvel accord n’est considéré enregistré ; une erreur est affichée et le cookie est supprimé sur réponse d’échec.

La préférence est propre au navigateur. Effacer le cookie, changer de navigateur ou perdre l’accès réseau ne permet pas de retirer automatiquement une preuve sur tous les appareils. Le retrait empêche les nouveaux envois quand il est pris en compte ; il ne rappelle pas un événement déjà transmis. Les demandes relatives aux données déjà transmises passent par les coordonnées de la politique de confidentialité. Une requête déjà partie ne peut pas être annulée rétroactivement.

Les preuves et journaux techniques sont bornés à 13 mois par le code de purge. La purge est raccordée au cron email existant, y compris lorsque Meta est coupé : elle exige donc ce cron opérationnel, sa base et sa configuration de services. Contrôler son exécution et ses erreurs ; si le cron est arrêté, organiser une purge dédiée avant l’échéance. La durée retenue et l’information du client doivent être validées avec le conseil compétent.

## Flux autorisé

Un achat confirmé affiché sur les pages de retour ou dans l’espace membre déclenche une vérification serveur. Il faut un consentement courant, un accès valide, une commande payée et un paiement confirmé par Stripe avec le bon client, montant, mode et devise. Paiements remboursés, partiellement remboursés ou litigieux déjà signalés par Stripe sont exclus avant envoi.

Meta reçoit seulement : événement Purchase, identifiant stable dérivé du paiement, date réelle du paiement, URL publique normalisée `/merci`, origine website, devise EUR, montant réellement payé et SHA-256 de l’email normalisé. Pas d’email en clair, questionnaire, nom, identifiant Stripe en clair, lien membre, adresse IP du client, user-agent, fbc ou fbp ajoutés au payload. L’empreinte email reste une donnée personnelle pouvant être rapprochée d’un compte Meta.

Un paiement partagé entre plusieurs lignes n’est envoyé qu’une fois pour leur somme. Le journal réserve l’envoi, limite les reprises et empêche les nouveaux envois après acceptation connue. Les reprises ambiguës réutilisent le même identifiant ; un seul journal local ne prouve pas à lui seul la déduplication côté Meta.

Limites assumées : aucun worker ni webhook publicitaire autonome ; sans retour navigateur, certains achats ne seront pas mesurés. Trois commandes/paiements récents au maximum par boucle, seulement dans la fenêtre acceptée de sept jours. Les reprises sont bornées à 23 heures et nécessitent une nouvelle visite ; un événement marqué retiré ou refusé n’est pas automatiquement relancé même après un nouvel accord. Les remboursements ultérieurs ne corrigent pas rétroactivement la conversion. Aucun événement Lead ou InitiateCheckout Meta n’est actif. La qualité d’appariement et l’attribution restent à mesurer, pas à présumer.

## 1. Préparer une préproduction séparée — technicien

- [ ] Confirmer le dépôt, le projet hébergeur et les domaines ; ne pas utiliser la base clients pour une recette.
- [ ] Prévoir une base Postgres de préproduction et vérifier les créations additives `ad_consent` et `meta_dispatch`, droits, index implicites de clés primaires, sauvegarde et purge sur données fictives.
- [ ] Configurer Stripe test et des webhooks pointant uniquement vers cette préproduction. Vérifier qu’aucune livraison réelle ou campagne historique ne peut partir.
- [ ] Confirmer le dataset/pixel Meta autorisé, le token à permissions nécessaires, la version Graph supportée et le code Test Events. Stocker les secrets côté serveur chez l’hébergeur, jamais dans Git, les captures ou le chat.
- [ ] Faire relire le texte du bandeau, la politique, les relations contractuelles et transferts de données applicables. Le consentement publicitaire n’est pas celui de la prospection email.

## 2. Activer uniquement la recette

Dans l’environnement isolé : `NEXT_PUBLIC_META_SERVER_MEASUREMENT=true`, `META_CAPI_VALIDEE=true`, `META_CAPI_MODE=test`, `META_PIXEL_ID`, `META_GRAPH_VERSION`, `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE`, `NEXT_PUBLIC_SITE_URL` public HTTPS exact et services de préproduction. La variable NEXT_PUBLIC est intégrée lors de la compilation : reconstruire. Ne jamais passer en live pour résoudre une erreur de test.

Les événements de test sont malgré tout transmis à Meta. Utiliser uniquement des paiements Stripe test et des identités de test autorisées. Les tests locaux livrés n’effectuent pas ces transmissions.

- [ ] Sans choix, en refusant ou en fermant : aucun appel Meta, achat et accès restent possibles.
- [ ] Autoriser : preuve réelle en base, cookie sécurisé, un achat test à la bonne valeur et à la bonne date dans Test Events.
- [ ] Cas 27 €, 44 €, complément 170/153 €, pack combiné et extension à 50 € : vérifier les montants réellement débités, pas le prix total théorique à chaque événement.
- [ ] Rechargement, double onglet, retour membre, latence et erreur 429 : pas de double achat compté ; contrôler localement et dans Meta.
- [ ] Retrait puis achat ; préférence expirée ; panne de base ; paiement échoué, SCA, remboursement, client/montant différents : aucun envoi non éligible.
- [ ] Inspecter le payload réellement sortant dans un environnement sécurisé : aucun champ privé ajouté par un proxy, une autre intégration, un tag manager ou un ancien Pixel.
- [ ] Vérifier téléphone, clavier, choix de même visibilité, retrait simple, panne réseau et réponse d’erreur honnête.
- [ ] Vérifier les protections d’infrastructure contre l’abus de la route de préférence ; ne pas rendre le refus plus difficile que l’accord.
- [ ] Vérifier le cron, sa purge effective sur données fictives anciennes et l’alerte d’échec ; conserver une preuve de recette expurgée de secrets.

## 3. Mise en production — après validation et publication autorisée

Confirmer un compte Stripe live, la base et le dataset de production ; choisir `META_CAPI_MODE=live`, garder le token serveur privé, retirer le code Test Events inutile en live. N’activer `META_CAPI_VALIDEE=true` qu’après recette et feu vert. Vérifier le bandeau compilé et l’absence d’autres traceurs non consentis sur le domaine. Surveiller les premiers événements consentis et réconcilier avec Stripe ; ne pas interpréter une sous-mesure comme une absence de ventes.

Pour arrêter les nouveaux envois : passer `META_CAPI_VALIDEE=false` dans l’environnement réellement utilisé et redéployer si l’hébergeur l’exige. Garder l’interface de préférence disponible pour le retrait et maintenir la purge. Ne pas effacer les preuves ni désactiver la livraison du produit. Aucun interrupteur n’annule un événement déjà en transit ou accepté par Meta.

## Références documentaires consultées

[CNIL — FAQ cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ), [CNIL — règles applicables](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi). Champs techniques examinés dans les sources officielles du SDK Meta : [Event](https://raw.githubusercontent.com/facebook/facebook-python-business-sdk/main/facebook_business/adobjects/serverside/event.py), [EventRequest](https://raw.githubusercontent.com/facebook/facebook-python-business-sdk/main/facebook_business/adobjects/serverside/event_request.py), [UserData](https://raw.githubusercontent.com/facebook/facebook-python-business-sdk/main/facebook_business/adobjects/serverside/user_data.py). Cette consultation ne vaut ni certification juridique ni succès d’un appel API réel.
