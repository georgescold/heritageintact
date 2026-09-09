# V5 — compléments utiles, consentement et pilotage

9 septembre 2026. Livraison locale, non publiée. Aucun paiement, email client ou événement Meta réel déclenché. Les tarifs approuvés ne changent pas.

## Ce que le client voit

- Les offres distinguent « Vous conservez » et « Vous ajoutez ». Le total du pack, les achats inclus effectivement payés et le montant à ajouter sont séparés. Ce n’est ni un portefeuille fictif ni un crédit qui expire ce soir.
- Le pack à 247 € affiche son avantage réel de 17 € par rapport aux tarifs catalogue séparés de 197 € + 67 €. Cette comparaison est annoncée avant déductions ; le client déjà équipé ne doit pas croire obtenir deux fois la même économie.
- Une démonstration en trois étapes montre l’usage des supports : comprendre, préparer, conserver les réponses et organiser la suite. L’exemple est fictif, sans résultat fiscal garanti.
- Une seule recommandation principale subsiste. Si le pack est trop large, une alternative assurance-vie peut être ouverte volontairement lorsque les réponses la rendent pertinente. Le montant est recalculé selon les achats ; aucun paiement au clic d’un simple lien et aucune cascade automatique après refus.
- Après la première étape, le membre peut actualiser sa priorité sans acheter. Ses autres réponses sont conservées ; choisir l’objectif assurance-vie ne suffit pas à lui inventer un contrat.
- L’offre dans l’espace peut rappeler l’étape effectivement terminée qui la rend pertinente. Les contenus déjà acquis restent accessibles et la Méthode ne nécessite pas d’achat supplémentaire.
- Les emails de compléments mettent en avant les déductions réelles, sans faux avoir ni date limite fabriquée. Leur activation demeure distincte de la livraison du produit.

Ces décisions appliquent les principes utiles du process local Valère : offre compréhensible, preuve d’usage, faible effort, continuité et pertinence de la prochaine proposition. Elles ne constituent pas une approbation de Valère ni une promesse de conversion.

## Consentement publicitaire

Interface Autoriser / Refuser de même visibilité ; fermer ne vaut pas accord. Le choix est mémorisé 180 jours dans ce navigateur, avec preuve datée et texte présenté côté serveur. Un lien permanent permet de le modifier. Ce consentement est distinct des emails commerciaux.

La mesure Meta préparée est exclusivement serveur : achat confirmé, date, montant, empreinte SHA-256 de l’email et champs techniques indispensables. Aucun SDK Meta navigateur, réponse familiale ou lien privé n’est transmis. L’empreinte n’est pas présentée comme anonyme.

Le code vérifie le consentement et le paiement Stripe avant de tenter l’envoi, utilise un identifiant stable par paiement et tient un journal. Les interrupteurs restent désactivés. Lire [la recette d’activation et de retrait](14-RECETTE-CONSENTEMENT-META.md).

## Pilotage et capacité

L’API privée `/api/pilotage`, protégée par un secret distinct, fournit des agrégats de cohortes acquises sur les 30, 60 et 90 derniers jours, sans identité client dans sa réponse. Ce n’est pas un tableau de bord graphique ni une LTV à maturité constante. Elle ne mesure pas le coût publicitaire, ne certifie pas le bénéfice et refuse de présenter un total tronqué au-delà de sa capacité.

Les nouvelles commandes Stripe de test sont désormais étiquetées test même lorsqu’une clé Stripe est configurée. L’historique n’a pas été modifié : réconcilier ses anciennes lignes avec Stripe avant toute lecture financière. Les remboursements partiels, litiges, frais, taxes et dépenses publicitaires doivent aussi être rapprochés.

Le cron email garde la livraison et l’accompagnement prioritaires. Une réserve de 20 % du budget restant protège les compléments éligibles ; si elle n’est pas utilisée, elle revient aux prospects. Le plafond reste à 150 par défaut ; une augmentation au-delà exige une validation explicite de capacité, pas seulement une variable plus élevée. Le cron quotidien n’a pas été multiplié. Cela ne garantit pas l’arrivée en boîte principale.

## Vérifications locales

- 1 340 assertions refonte + 46 V3 + 133 produit V4 + 122 V5 : 1 641 réussies, sans réseau ni base réelle.
- TypeScript valide ; ESLint zéro erreur, deux avertissements préexistants dans OffreFlash ; contrôle de différences sans erreur d’espacement.
- Compilation Next de production réussie, services retirés de l’environnement de construction. L’interface de consentement a été activée uniquement dans une compilation de recette ; l’envoi Meta y est toujours coupé.
- 46 contrôles navigateur V5 réussis sur clients fictifs, en 390 et 1 440 px : choix/refus/retrait, comparaison, qualification modifiable, alternative, accès révoqué, indisponibilité du stockage. Captures consentement mobile et comparaison desktop examinées.
- Construction finale normale réussie, interface et Meta désactivés ; 84 contrôles navigateur produit V4 rejoués avec succès sur cette version (130 contrôles navigateur au total avec la recette V5).
- Consentement et Meta : tests unitaires avec stockage/Stripe/transport simulés, pas une validation d’acceptation par l’API Meta ou d’une migration Postgres réelle.

Commandes reproductibles : `node scripts/test-refonte.mjs`, `node scripts/test-conversion-v3.mjs`, `node scripts/test-produit-v4.mjs`, `node scripts/test-funnel-v5.mjs`, `node scripts/build-sans-services.mjs`. Recette interface : construire avec `--consent-ui`, puis `node scripts/recette-funnel-v5.mjs` avec les fixtures fictives isolées de `.build-refonte`. Ces fixtures locales ne sont pas publiées. Refaire ensuite une construction normale, interface inactive.

## Avant d’acheter du trafic

Le prévol local a détecté une configuration Stripe de test et des variables de base/email présentes ; les secrets des webhooks Stripe et Resend, le secret de pilotage et la configuration Meta sont absents de cette configuration locale. VSL et campagnes ne sont pas déclarées actives. Ce relevé ne vérifie ni la validité des clés ni l’environnement Vercel.

Restent indispensables : validation professionnelle des contenus et conditions, reprise de la VSL, recette des paiements et remboursements en préproduction isolée, réception réelle des emails, SPF/DKIM/DMARC et retours de rebonds/plaintes, consentement et purge réels, cible de publication confirmée. Le consentement Meta n’inscrit pas un acheteur à la prospection email : ne pas ajouter les acheteurs directs aux campagnes sans leur consentement marketing enregistré.

Aucun push ni redéploiement n’a été effectué. Les travaux manuels et techniques sont réunis dans [la checklist Loys](a-faire-loys/00-CHECKLIST.md). Ni la rentabilité ni la satisfaction ne peuvent être déclarées maximales avant observation de vrais utilisateurs.
