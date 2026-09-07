# 11 — Légal & compliance

> Ce fichier n'est pas de la prudence excessive. Sur cette niche (argent + avatar âgé), c'est ce qui sépare un funnel qui tourne 3 ans d'un compte pub banni à J+4 et d'un Stripe coupé à J+30.
> Trois couches : **Meta** (ce qui fait bannir), **le droit français** (ce qui fait condamner), **le paiement** (ce qui coupe le robinet).
>
> Je ne suis pas avocat. Ce fichier te donne le cadre et les réflexes ; fais relire CGV, mentions et disclaimers par un avocat (300-600 €, une fois) avant le lancement.

---

## 1. META — ce qui fait refuser une pub ou bannir un compte

### 1.1 Personal Attributes (le risque n°1 sur cet avatar)

Meta refuse toute pub qui **affirme ou implique** connaître un attribut personnel de la personne : âge, état de santé, situation financière, statut familial, religion, etc. Le déclencheur, c'est la **2e personne + attribut**.

| ❌ Interdit | ✅ Autorisé |
|---|---|
| « Vous avez plus de 60 ans » | « Il y a trois anniversaires qui coûtent cher à une famille » |
| « Vous êtes propriétaire » | « Une maison de 380 000 € » (cas) |
| « Vous êtes veuve » | « Quand mon mari est mort, j'ai découvert… » (1re personne, récit reconstitué) |
| « Votre patrimoine de 500 000 € » | « Une famille avec 410 000 € de patrimoine » |
| « Vous allez mourir » / « votre fin approche » | « Le jour où il a enterré son père » |
| « Vous êtes riche / vous avez de l'épargne » | « Ce que vous laisserez » (action/objet, pas attribut) |
| « Si vous avez un enfant handicapé » | « Un enfant vulnérable : la situation n°10 » (en page produit, pas en pub) |

**Ciblage par âge** dans l'adset : autorisé. C'est le **texte** qui est interdit, pas le ciblage.

**Check-list par créative et par page (LP, VSL) :**
- [ ] Zéro "vous êtes / vous avez [attribut]"
- [ ] Zéro référence à l'âge de la personne qui regarde
- [ ] Zéro référence à sa santé, sa mort, sa maladie
- [ ] Les récits à la 1re personne sont soit vrais, soit marqués « récit reconstitué »
- [ ] Les visuels : pas de "avant/après" de patrimoine, pas de liasse de billets, pas de cercueil

### 1.2 Allégations trompeuses / résultats

- ❌ « Économisez 40 % » / « Divisez par 3 » en promesse → ✅ « jusqu'à 60 % » (taux légal réel non-parents) ou un **cas chiffré** présenté comme tel (« sur ce cas, 38 389 → 0 »)
- ❌ « Zéro impôt sur votre succession » → ✅ « transmettre intact ce que vous avez construit »
- ❌ Faux compteur, fausse deadline, faux témoignage → refus + risque pénal (voir § 2)
- ✅ Chaque chiffre cité renvoie à un article de loi (à l'écran dans la VSL, en note sur les pages)

### 1.3 Cohérence pub → landing page
Meta scanne la LP. Le message de la pub doit s'y retrouver (même promesse, même ton). Pas de redirection différente selon la source. **Le cloaking et le "glitch A/B test" décrits dans le repo sont des violations explicites** ; sur une niche argent + avatar âgé, ce sont exactement les signaux que Meta et Stripe chassent. On ne les utilise pas. Ce n'est pas nécessaire : le copy fait le travail.

### 1.4 Catégorie "services financiers"
Meta impose dans certains pays une vérification des annonceurs de services financiers. **Vérifier avant lancement si la France est concernée** (Meta Business Help → "Financial services advertiser verification"). Un infoproduit pédagogique n'est pas un produit financier, mais le robot classe parfois "succession / assurance-vie" en finance. Si le compte est flagué : compléter la vérification plutôt que contourner.

### 1.5 Tonalité
Le repo dit « Peur > Rêve ». Vrai — mais sur cet avatar, une pub perçue comme **anxiogène ou sensationnaliste** est refusée (politique "Sensational content") et, surtout, elle **ne convertit pas** : un 67 ans qu'on brusque ferme la vidéo. La peur se raconte (le cas Jean-Pierre), elle ne se crie pas.

---

## 2. DROIT FRANÇAIS — ce que tu as le droit de vendre, et comment

### 2.1 Pédagogie OUI, conseil personnalisé NON

| Activité | Statut | Toi |
|---|---|---|
| Expliquer le fonctionnement des droits de succession, des abattements, du démembrement, de l'assurance-vie, avec des cas types | **Information / pédagogie** — libre | ✅ C'est ton produit |
| Dire à une personne précise ce qu'**elle** doit faire de **son** patrimoine | **Consultation juridique** (loi 71-1130 du 31/12/1971, art. 54 s.) — réservée aux avocats, notaires, et professionnels habilités | ❌ Jamais. Ni en email, ni en commentaire, ni au "mur des questions" |
| Recommander un placement, un contrat, un support | **Conseil en investissements financiers** (CIF — AMF/ORIAS) | ❌ |
| Recommander / comparer / distribuer des contrats d'assurance-vie précis, toucher une commission | **Intermédiation en assurance** (ORIAS) | ❌ — le Kit Assurance-Vie ne nomme **aucun** assureur ni contrat |
| Rédiger un acte (testament, clause, donation) pour quelqu'un | Réservé | ❌ — on fournit des **modèles commentés « à faire valider par votre notaire »** |
| Mettre en relation avec un professionnel, sans conseil | **Apporteur d'affaires / indicateur** — possible, à formaliser par contrat, sans immixtion dans le conseil | ✅ Option phase 2 (mois 4+), pas au lancement |

**Les réflexes d'écriture qui te gardent du bon côté :**
- « Dans une situation de ce type, les familles regardent généralement… » plutôt que « vous devriez… »
- Toute question personnelle (email, commentaire) reçoit : *« Je ne peux pas me prononcer sur votre situation — c'est le rôle de votre notaire. Ce que je peux vous dire, c'est comment ça fonctionne en général : … »*
- Le **Générateur** calcule et pré-remplit ; il ne recommande pas. Ses sorties disent « scénario » et « à faire valider par votre notaire », jamais « nous vous conseillons ». Les modèles (clauses, testaments, mandat) sont **commentés et à faire relire**, pas rédigés pour quelqu'un.
- Le **Classeur** (PDF prêt à imprimer) : mentions légales de l'éditeur sur la page de garde, pas d'ISBN nécessaire, mais une date d'édition et la mention « mis à jour selon la loi de finances [année] » — elle est ce qui justifie de le racheter l'année suivante.

**Disclaimer à mettre partout (pied de page des pages de vente, début de chaque module, CGV, emails de la séquence acheteurs) :**
> *Héritage Intact est un programme pédagogique d'information générale sur la transmission de patrimoine en France. Il ne constitue ni une consultation juridique, ni un conseil fiscal, financier ou en investissement personnalisé, et ne se substitue pas à l'intervention d'un notaire, d'un avocat ou d'un conseiller habilité. Les exemples chiffrés sont illustratifs. La législation évolue : vérifiez les montants en vigueur sur impots.gouv.fr avant toute décision. Contenu mis à jour le [DATE].*

### 2.2 Pratiques commerciales trompeuses (code de la consommation, art. L121-2 s.)
Sanction : jusqu'à 2 ans d'emprisonnement et 300 000 € d'amende (ou 10 % du CA). La DGCCRF surveille activement les funnels visant les seniors.

| ❌ Interdit | ✅ Règle |
|---|---|
| Faux compteur « 143/500 » | Compteur **réel**, branché sur les ventes. Quand 500 est atteint, **le prix change vraiment**. |
| Fausse deadline (« ce soir minuit » qui revient chaque jour) | Une deadline par personne = une vraie fermeture pour cette personne (segmentation). Réouverture ≥ 30 jours plus tard. |
| Faux témoignages, photos de banque d'images « clients », UGC acteur présenté comme client | Témoignages **réels**, avec accord écrit, prénom + âge + département. UGC acteur = mention « récit reconstitué » à l'écran. Avis : indiquer s'ils sont vérifiés (directive Omnibus). |
| Prix barré fictif (67 € jamais pratiqué) | Le 67 € doit être le prix pratiqué **réellement** après les 500 (ou annoncé comme prix futur, pas comme "ancien prix"). Formulation sûre : « Prix fondateur 27 € — 67 € à partir du 501e membre ». |
| « Garanti sans risque », « 100 % légal » (superlatifs absolus) | « Écrit dans le Code général des impôts, article X » |
| Cacher le total sur les upsells | Total récapitulé à chaque étape, montant débité explicite |

### 2.3 Options payantes pré-cochées — arbitré le 4 septembre 2026
**Décision : le bump EST pré-coché**, conformément à la méthode.

Le cadre, pour mémoire : l'art. 22 de la directive 2011/83/UE prévoit qu'un consommateur ayant payé un supplément via une option cochée par défaut peut en demander le remboursement. La garantie 30 jours sans justification couvre ce cas en pratique.

Ce qui est en place pour que la présentation reste défendable : case mise en évidence, décochable en un clic, ligne dédiée dans le récapitulatif, total mis à jour en direct et repris sur le bouton de validation.

### 2.4 Vente à distance — obligations
- [ ] **Mentions légales** (LCEN) : identité, SIREN, adresse, hébergeur, contact
- [ ] **CGV** : prix TTC, modalités d'accès, garantie contractuelle 30 jours et ses conditions, remboursement, médiation. **Aucune clause de livraison n'est nécessaire : rien n'est expédié** (décision « zéro produit physique » du 6 septembre 2026).
- [ ] **Droit de rétractation 14 jours** : pour un contenu numérique, on peut y renoncer si le client **consent expressément** à l'accès immédiat et **reconnaît** perdre son droit (L221-28 13°). → case à cocher (non pré-cochée) sur le BDC : *« Je demande l'accès immédiat au contenu et reconnais renoncer à mon droit de rétractation de 14 jours. »* Ta garantie 30 jours couvre au-delà de toute façon — mais la case protège les CGV.
- [ ] **Médiateur de la consommation** désigné et mentionné (obligatoire)
- [ ] **RGPD** : politique de confidentialité, finalité, consentement newsletter distinct de l'achat, lien de désinscription dans chaque email, registre des traitements, DPA avec Vercel/Supabase/Stripe/Resend
- [ ] ~~**Produit physique (Classeur)** : droit de rétractation 14 jours non renonçable~~ — **sans objet.** Le Classeur est devenu un contenu numérique : il relève de la case de renonciation ci-dessus, comme tout le reste du catalogue. Un régime unique pour tous les produits, c'est une CGV plus courte et une source d'erreur en moins.
- [ ] Facture / reçu automatique à chaque paiement

### 2.5 Public vulnérable — abus de faiblesse
Art. 223-15-2 du code pénal et L121-8 s. du code de la consommation visent explicitement la vulnérabilité liée à l'**âge**. Ce qui protège :
- **Zéro pression téléphonique** (tu n'en as pas — c'est un atout juridique, pas seulement une préférence)
- Remboursements **honorés vite et sans discussion** (7 jours, pas 30)
- Contact humain visible (email, réponse < 24 h) ; un numéro de téléphone *entrant* est un plus
- Aucune relance après un refus explicite (« ne m'écrivez plus » = désinscription immédiate)
- Prix affichés clairement, pas de dark patterns, pas de "non merci, je préfère perdre de l'argent" agressif sur les OTO (le "non" du repo est reformulé sobre dans `06`)
- Si un proche (enfant) écrit pour un parent : rembourser, point.

### 2.6 Marque
Vérifier **« Héritage Intact »** à l'INPI (classes 35, 41, 36) et la disponibilité du domaine avant d'imprimer quoi que ce soit. Déposer la marque (~250 €) une fois le funnel validé.

### 2.7 Exactitude du contenu
- Chaque chiffre de `12` vérifié sur impots.gouv.fr / bofip avant enregistrement, **date de vérification notée**
- Mention « mis à jour le … » sur chaque module
- Veille : loi de finances chaque décembre → mise à jour du simulateur et de la Règle de Mise à Jour (c'est un bonus vendu, il doit être honoré)

---

## 3. PAIEMENT — Stripe ne doit jamais te couper

- Catégorie Stripe : **contenu éducatif / e-learning**. Pas "conseil financier".
- Libellé bancaire : `HERITAGE INTACT` + URL. L'avatar regarde son relevé : un libellé inconnu = un chargeback.
- **Chargebacks < 0,5 %.** À 0,75-1 %, Stripe passe en surveillance ; au-delà, coupure. Leviers : reçu clair, contact visible, remboursement rapide sur simple demande (un remboursement coûte 27 €, un chargeback coûte le compte).
- Réserve : garder 10 % du CA en trésorerie non engagée les 3 premiers mois (Stripe peut imposer une réserve).
- Le site "vu par Stripe" est le vrai site. Pas de version "propre" séparée.
- Pas d'abonnement caché, pas de trial converti — modèle one-shot + 3× lisible.

---

## 4. Check-list finale avant mise en ligne (à cocher page par page)

- [ ] Pubs (12) : § 1.1 + § 1.2 passées une par une
- [ ] LP, VSL, BDC, OTO 1, OTO 2, TY, VSL 2 : § 1.1 + § 2.2
- [ ] Disclaimer § 2.1 présent sur toutes les pages de vente + espace membre
- [ ] Mentions légales, CGV, confidentialité, médiateur : en ligne, liens en footer
- [ ] Case rétractation sur le BDC · bump pré-coché, visible et décochable en un clic
- [ ] Compteur branché sur des ventes réelles
- [ ] Aucun témoignage tant qu'il n'y en a pas de vrai ; UGC acteur marqué « reconstitué »
- [ ] Zéro nom d'assureur, de contrat, de banque dans les modules et le Kit
- [ ] Réponse-type "je ne peux pas me prononcer sur votre situation" prête pour les commentaires et emails
- [ ] Relecture avocat des CGV / mentions / disclaimer faite
- [ ] Vérification "financial services advertiser" Meta faite pour la France
- [ ] INPI + domaine vérifiés
