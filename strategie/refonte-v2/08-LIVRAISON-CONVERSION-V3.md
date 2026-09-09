# Conversion et expérience client — livraison V3
9 septembre 2026. Modifications locales non publiées. Ce document actualise l’audit 07, qui décrivait l’état avant cette passe.

## Décisions appliquées
1. Une question facultative avant vente : priorité immédiate, sans email obligatoire. La présentation adapte son ouverture ; le choix est repris après paiement pour éviter une question répétée.
2. Une preuve visible avant achat : aperçu du support, page publique avec véritable fiche et exemple rempli. Pas de classeur physique suggéré ni de résultat client inventé.
3. Une copie plus orientée vers l’usage : scène familiale, première action, objections précoces, distinction des étapes et rôle de l’éditeur.
4. Des packs présentés par changements concrets, puis par contenus. Motif contextualisé selon les réponses ; prix total, crédit réel et complément restent visibles avant confirmation.
5. Au checkout : option non précochée et aperçu du Dossier ouvrable sans perdre la commande.
6. Sur la page de vente : aide à l’hésitation ouverte sur demande ; sortie desktop après au moins 30 secondes et lecture partielle, une fois par session. Dialogue clavier et fermeture accessibles, sans fausse remise. Bouton fixe mobile après le premier CTA et avant le dernier.
7. Emails réécrits suivant les sept leviers CEO adaptés ; J7 est désormais au septième jour.
8. Compléments clients automatisables : deux messages maximum entre J10 et J35, usage initial et consentement requis, offre pertinente non détenue, rappel espacé de sept jours réels.
9. Compteurs locaux de vues/clics agrégés, sans identifiant visiteur ni réponse familiale. Lecture protégée par secret ; pas de taux de conversion unique ou d’attribution publicitaire prétendu.
10. Pixel Meta mis sous un interrupteur de validation explicite : ne pas le réactiver sans recette du consentement et des informations transmises.

## Fiabilité des emails ajoutée
- List-Unsubscribe pointe vers la route POST réellement disponible. Le lien humain affiche une confirmation pour éviter qu’un scanner d’email désinscrive le lecteur.
- Consentement et opposition relus avant envoi commercial ; exclusion des acheteurs de la séquence prospect.
- Absence de clé = échec explicite, pas de trace de faux envoi réussi.
- Identifiants stables pour séquence, accès initial et reçus de commande ; journal Postgres et clé d’idempotence fournisseur.
- Reprises ambiguës bornées à 23 h : au-delà, intervention nécessaire pour ne pas risquer un nouvel envoi après la fenêtre d’idempotence du fournisseur.
- Délai d’attente de 12 secondes par requête ; plafond d’essais et bail exclusif sur le cron. Le cron s’arrête progressivement avant quatre minutes.
- Réception signée des événements de rebond, plainte et suppression ; destinations inscrites en liste de suppression locale. Les événements ne sont pas configurés à distance.
- Pas de prénom non échappé injecté dans le HTML, pas de corps d’email ni de réponses familiales stockés dans le journal.
Attention : « accepté par Resend » n’est ni « reçu » ni « placé en boîte principale ». Le journal n’est pas un tableau de bord de délivrabilité.

## DNS public constaté
Contrôle en lecture seule : DKIM sur resend._domainkey.info.heritageintact.fr ; SPF et MX retour sur send.info.heritageintact.fr ; DMARC sur heritageintact.fr, politique p=none.
Cela ne valide ni le domaine réellement utilisé par EMAIL_FROM, ni l’alignement d’un message, ni les permissions de la clé. Aucun DNS n’a été modifié.

## Activation technique après recette
Le membre peut suspendre les relances commerciales de compléments depuis la boutique de son espace, sans perdre ses achats. Les [textes de suivi satisfaction](09-SUIVI-SATISFACTION.md) sont conservés, mais ne sont pas automatisés.

- Tester sur une copie de base la création additive de email_dispatch, email_suppressions et job_leases. Le schéma des compteurs est également additif.
- Configurer le webhook Resend /api/resend/webhook et RESEND_WEBHOOK_SECRET ; vérifier événements signés, rejoués et invalides.
- Vérifier les états du journal : accepte, refuse, reessayer, envoi. Une tentative ambiguë âgée de plus de 23 h ou un refus permanent ne repart pas automatiquement : réconcilier avec Resend avant reprise manuelle. Aucun bouton de purge automatique n’a été ajouté.
- Définir et mettre en œuvre les durées de rétention/purge du journal et les procédures de rectification des suppressions. Les empreintes d’adresses restent des données pseudonymisées.
- Tester avec des boîtes de réception de contrôle autorisées : SPF/DKIM/DMARC effectifs, expéditeur, réponse, liens, désinscription, rebond et plainte. Le double opt-in et l’anti-abus des formulaires restent à évaluer avant augmentation de volume.
- Activer EMAIL_MARKETING_ACTIVE seulement après validation de l’envoi et de la base ; EMAIL_LTV_ACTIVE séparément après validation des recommandations client.
- NEXT_PUBLIC_FUNNEL_METRICS_ACTIVE exige une reconstruction pour activer les compteurs. Ce sont des comptages par vue/clic, pas des visiteurs uniques ; ils peuvent contenir rechargements ou trafic automatisé.
- NEXT_PUBLIC_META_PIXEL_VALIDEE reste false jusqu’à validation effective du consentement et de la circulation des données.
- Conserver les prérequis précédents : VSL corrigée et validée, relecture professionnelle, cas Stripe/SCA/remboursement/concurrence et conservation des droits historiques.
Aucun push, déploiement, migration distante ou campagne réelle exécuté.

## Vérifications
Compilation Next de production et TypeScript réussis. Les 1 332 assertions précédentes passent ; 46 assertions supplémentaires couvrent orientation, séquence J1–J7, LTV et suspension des relances, exemple de signature Svix officiel, signature altérée/périmée, consentement, échappement, idempotence et erreurs de transport simulées.
Recette navigateur : 20 contrôles du parcours existant, puis 19 contrôles propres à la V3 (aperçus desktop/mobile, orientation conservée, dialogue/clavier, bouton fixe, option et protection des routes). Ces tests n’exécutent pas Postgres ou Resend réels. Le journal SQL, son verrou concurrent et son intégration au fournisseur restent à éprouver en préproduction.
Un contrôle navigateur supplémentaire valide la suspension des relances et sa persistance après rechargement, avec des achats fictifs conservés.
Les essais automatisés prouvent les comportements vérifiés, pas une hausse des ventes. Les comparaisons de variantes et la contribution nette doivent encore être mesurées sur du trafic réel.

## Références techniques consultées
[Idempotence Resend](https://resend.com/docs/dashboard/emails/idempotency-keys) ; [signature du webhook](https://resend.com/docs/webhooks/verify-webhooks-requests) et [protocole Svix](https://docs.svix.com/receiving/verifying-payloads/how-manual) ; [consignes Gmail](https://support.google.com/mail/answer/81126?hl=fr).
Références Valère locales relues : emailing, teardowns, checklist d’optimisation, structure CEO. Application des principes de bénéfices, preuve et progression ; pas de reprise des affirmations de performance comme garanties.
