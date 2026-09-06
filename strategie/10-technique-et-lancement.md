# 10 — Technique, lancement & optimisation (Phases 3, 4, 6)

---

## Phase 3.1 — Setup Facebook (À DÉMARRER MAINTENANT — 2 à 3 semaines)

Suivre `02-acquisition/setup-anti-ban.md` à la lettre. Check-list minimale :

- [ ] Navigateur anti-détection (Dolphin Anty / Incogniton) + proxy résidentiel dédié par profil
- [ ] 3 profils : 2 admins + 1 employé
- [ ] Business Manager créé → **attendre 24 h** avant toute action
- [ ] Page Facebook **« Héritage Intact »** créée depuis un profil indépendant. Photo de profil sobre, bannière : la phrase « Transmettre intact ce que vous avez construit ». **5 à 10 posts de contenu** avant la première pub (un chiffre + une phrase, style presse senior). Le robot regarde la page.
- [ ] Warm-up : campagne Page Like à 5 €/jour pendant 7-10 jours
- [ ] Vérifier manuellement le premier paiement
- [ ] Ad account (agence de préférence). Moyen de paiement : néobanque / ligne de crédit — pas de banque FR traditionnelle
- [ ] Pixel créé
- [ ] Domaine vérifié dans le BM (Brand Safety → Domaines) — obligatoire pour les événements
- [ ] Une pub image "clean" prête (visuel sobre, texte neutre) pour tourner à 2 €/jour en permanence

⚠️ Sur cette niche, le robot Meta scanne aussi la **landing page** (le "pixel" te trahit). LP et VSL doivent passer la même check-list que les pubs (`11`).

---

## Phase 3.2 — Le site (Next.js sur Vercel) — DÉJÀ CONSTRUIT

**Nom de domaine :** `heritage-intact.fr` (vérifier dispo + INPI, cf. `11`). Sous-domaines : `go.` pour le funnel, `app.` pour l'espace membre. Email d'envoi : `prenom@heritage-intact.fr` (jamais un gmail).

**Pages à monter (dans l'ordre du funnel) :**

| # | Page | URL | Contenu | Pixel |
|---|---|---|---|---|
| 1 | Landing page, variante A (classique) | `/` | `06` § 1 | PageView |
| 1b | Landing page, variante B (courte + pop-up) | `/lp-courte` | `06` § 1 | PageView |
| 1c | Landing page, variante C (questionnaire) | `/lp-questions` | `06` § 1 | PageView |
| 2 | VSL | `/methode` | `05` — vidéo Wistia/Vimeo, sous-titrée | Lead (à l'arrivée) |
| 3 | Bon de commande | `/commande` | `06` § 2 + bump | InitiateCheckout |
| 4 | Upsell 1 | `/plan-complet` | `06` § 3 | — |
| 5 | Upsell 2 | `/kit-assurance-vie` | `06` § 4 | — |
| 6 | Thank you | `/merci` | `06` § 5 | **Purchase** (valeur = montant total du panier) |
| 7 | VSL 2-5 backend (à partir de la semaine 5) | `/generateur`, `/dependance`, `/classeur`, `/testament` | `07` — une page membre (prix membre, lien email) + une page publique (prix barré) chacune | ViewContent (custom) |
| 8 | Commandes backend | `/…/commande` | 147 / 97 / 67 / 47 € | InitiateCheckout |
| 9 | Thank you backend | `/…/merci` | accès immédiat — aucun produit n'est expédié | Purchase |
| 10 | Espace membre | `app.` | modules `04` + onglet « Outils & Kits » | — |
| 11 | Mentions légales / CGV / Confidentialité | `/legal` … | `11` | — |
| 12 | Module 1 en libre (pop-up sortie BDC) | `/module-1` | vidéo + bouton retour BDC | — |

**Réglages :**
- [ ] Vidéos sur **Wistia ou Vimeo** (jamais YouTube). Autoplay off (l'avatar veut cliquer play), sous-titres activés par défaut.
- [x] Aucune watermark : le site nous appartient.
- [x] Bump : **case pré-cochée** (`18` § C1). Visible, décochable en un clic, reprise dans le récapitulatif.
- [ ] Case droit de rétractation sur le BDC (`11` § 2.4).
- [ ] Paiement Stripe. Libellé sur relevé bancaire : **HERITAGE INTACT** + email de contact.
- [ ] Reçu email automatique clair (l'avatar vérifie son relevé — un libellé obscur = chargeback).
- [ ] Exit pop-up : LP ✅ VSL ✅ BDC ✅ OTO ❌.
- [ ] Espace membre : identifiants envoyés par email + rappel sur la thank you page. **Mot de passe simple à réinitialiser** (l'avatar perd ses mots de passe — prévoir le bouton "mot de passe oublié" bien visible).
- [ ] Police ≥ 18 px partout. Boutons ≥ 56 px de haut. Contraste fort. Test sur un téléphone Android à 150 % de zoom système (réglage courant chez les 60+).

**Tests avant lancement (avec une vraie carte) :**
- [ ] Achat complet front + bump + U1 + U2 → 4 accès reçus, 4 lignes sur Stripe, 1 événement Purchase avec la bonne valeur (Meta Pixel Helper + Events Manager)
- [ ] Achat front seul → séquence 3 déclenchée, séquence 1 **stoppée**
- [ ] Opt-in sans achat → séquence 1 déclenchée
- [ ] Arrivée BDC sans achat → séquence 2 déclenchée ; achat ensuite → séquence 2 stoppée
- [ ] Remboursement test → accès révoqué, tag "remboursé", exclu des séquences de vente
- [ ] Tous les liens de tous les emails cliqués une fois

---

## Phase 3.3 — Pixels & tracking

```
/decouvrir     → PageView
/methode       → Lead
/commande      → InitiateCheckout
/merci         → Purchase (value = total, currency = EUR)
```
- [x] Code pixel injecté sur toutes les pages via le composant `MetaPixel` (inactif tant que `NEXT_PUBLIC_META_PIXEL_ID` est vide)
- [ ] API Conversions (CAPI) : route serveur à écrire, envoi côté serveur des événements — sur cet avatar (iOS + Safari + bloqueurs rares mais navigateurs anciens), la CAPI récupère 20-30 % d'événements
- [ ] Vérifié avec Meta Pixel Helper page par page
- [ ] UTM sur toutes les URLs de pub : `?utm_source=meta&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`
- [ ] Emailing : DNS (SPF, DKIM, DMARC) sur `heritage-intact.fr` — sans ça, 30 % des mails partent en spam et le funnel 2 n'existe pas

---

## Phase 4.4 — Configuration de la campagne

| Niveau | Réglage |
|---|---|
| Campagne | Normale · Objectif **Ventes** · **CBO** · pas d'A/B test |
| Adset | **Broad — France uniquement** · Dynamic creative **ON** · placements : Facebook Feed, Facebook Reels, Instagram Feed (désactiver Audience Network, Messenger, Marketplace si possible) · exclusions : Taïwan, Hong Kong |
| Événement | **Escalade du pixel** (voir ci-dessous), en commençant par **Lead** |
| Créatives | 12 (`08`), 3 angles, toutes dans le même adset |
| Pub image clean | 2 €/jour, campagne séparée, en permanence |

**Pas de ciblage par âge au lancement.** Si après 7 jours pleins le CPL est > 6 €, dupliquer l'adset avec 55+ à côté (jamais de centres d'intérêt stackés).

### L'escalade du pixel (on descend l'événement dans le funnel)

Plutôt que de figer un événement, on le déplace au fur et à mesure que la data arrive
(`02-acquisition/facebook-vs-youtube.md` § stratégie de pixel progressive). ⚠️ **On ne touche jamais au budget pendant
l'escalade** : une seule variable à la fois.

| Étape | Événement | On y passe quand | Ce qu'on optimise |
|---|---|---|---|
| 1 | **Lead** (sur `/methode`) | Au lancement | Le coût par lead. On veut du volume dans la base. |
| 2 | **InitiateCheckout** | 20 à 50 checkouts par semaine atteints | Les gens qui regardent la VSL **et** sont intéressés |
| 3 | **Purchase** | 20 à 50 achats par semaine atteints (en pratique : 100-150 €/jour) | Le CPA |

Sur un produit à 27 €, l'étape 1 arrive vite. Ne saute pas l'étape 2 : c'est elle qui apprend à
l'algorithme à reconnaître un acheteur avant que tu aies assez d'achats pour l'optimiser directement.

---

## Phase 4.5 — Budget & règles de décision

**Budget de test : 1 000 €** (produit à 27 €, budget "confortable" du repo). À 50 €/jour = 20 jours. Ne pas descendre sous 30 €/jour.

**Règles :**
- 48 h sans toucher à rien. Puis on regarde.
- On ne cut pas les créatives "qui ne performent pas" avant 7 jours (funnel d'ads).
- Décision GO / NO-GO à 1 000 € dépensés, sur l'**EPC** et le **CPA vs panier moyen**, jamais sur le taux de conversion seul.

---

## Les KPIs — cibles et seuils d'alerte

| Métrique | Cible | Alerte si | Levier si alerte |
|---|---|---|---|
| CPM (France, 60+) | 8-15 € | > 20 € | Créatives (hook), campagne contrôle |
| CTR (lien) | ≥ 1,5 % | < 0,8 % | Hook + texte primaire |
| CPC | 0,50-1,20 € | > 2 € | Créatives |
| **Taux d'opt-in LP** | 35-50 % | < 25 % | Headline LP (A/B n°1), simplifier |
| **Coût par lead** | 2-4 € | > 6 € | LP + créatives |
| VSL → BDC (Lead → InitiateCheckout) | 8-15 % | < 5 % | Headline VSL, puis lead de la VSL |
| BDC → achat | 25-40 % | < 15 % | Réassurance paiement, garantie, exit pop-up module 1, emails abandon |
| **Opt-in → achat (global)** | 3-6 % | < 2 % | Tout ce qui précède, dans l'ordre |
| Prise du bump | 30-45 % | < 20 % | Copy du bump (sans pré-cochage) |
| Prise upsell 1 | 8-15 % | < 5 % | Vidéo U1, prix (tester 147 €) |
| Prise upsell 2 | 8-12 % | < 4 % | Vidéo U2 |
| **Panier moyen (AOV)** | ≥ 60 € | < 45 € | Bump + upsells |
| **CPA (coût par acheteur front)** | ≤ AOV (break-even) | > 1,5 × AOV | Créatives → headline → lead |
| **EPC** (revenu / clic) | ≥ CPC | < CPC | La métrique de décision |
| Remboursements | < 8 % | > 15 % | Produit (module 0 doit livrer le chiffre vite), attentes créées par les pubs |
| Chargebacks | < 0,5 % | > 0,75 % | Libellé bancaire, contact visible, reçus clairs — **Stripe coupe à ~1 %** |
| Ouverture emails | ≥ 35 % | < 20 % | Délivrabilité (DNS), objets, expéditeur |
| Clic emails | ≥ 4 % | < 2 % | CTA bouton, longueur |
| Acheteurs → Générateur (J10-J18) | 8-12 % | < 4 % | VSL 2 (démo), preuve, prix (tester 97 €) |
| Acheteurs → chaque autre backend | 8-12 % | < 4 % | Objets, lead, angle |
| **LTV à 90 jours** | ≥ 95 € | < 75 € | Séquence 3, newsletter |

**La formule qui décide :**
```
CPA = CPL / taux opt-in→achat
   ex. 3 € / 5 % = 60 €  → break-even si AOV ≥ 60 €
Revenu par lead (funnel 1) = AOV × taux d'achat = 66 × 5 % = 3,30 € → EPL
Revenu par lead (funnel 1 + 2) = LTV × taux d'achat = 101 × 5 % ≈ 5,05 €
→ tant que le CPL est sous 5 €, le système est rentable à 90 jours.
→ SANS high ticket, le front DOIT être break-even seul : CPA ≤ AOV est la condition de survie, pas un objectif.
```

---

## Tableau de suivi quotidien (Google Sheet — une ligne par jour)

```
Date | Spend | Impr. | CPM | Clics | CTR | CPC | Leads | CPL | Opt-in % | IC | VSL→IC % | Achats | BDC→achat % |
CPA | Bump % | U1 % | U2 % | CA front | AOV | EPC | EPL | Remb. | HT ventes | CA HT | CA total | ROAS | Note du jour
```
**Rituel (`06-process` 6.1) :** chaque matin, 15 min. Remplir. Entourer la métrique la plus faible. Une hypothèse. Un test à la fois.

---

## Phase 6 — Ordre d'optimisation (ne pas inverser)

0. **Structure de LP** — les 3 variantes existent (`/`, `/lp-courte`, `/lp-questions`). Un adset par
   URL, même créatives, 7 jours. On compare le **coût par lead**, puis le **coût par acheteur** (une LP
   qui fait beaucoup de leads mais peu d'acheteurs est une mauvaise LP).
1. **Headline VSL** — A/B les 3 variantes de `05` (30 s de travail, plus gros levier)
2. **Lead VSL** — Narrative vs Problem-Solution (`05` § variante)
3. **Créatives** — décliner les 2 meilleurs hooks × 3, ajouter 6 créatives/semaine
4. **Bump** — copy, position, prix (17 → 27 €)
5. **Upsell 1** — 197 vs 147 €, vidéo 4 min vs texte seul
6. **Séquence 7 jours** — objets (ouverture), puis CTA (clic)
7. **Backend** — construire le Générateur dès 30 ventes front ; tester 147 vs 97 €
8. Le reste (advertorial, LP directe vs VSL directe, 5-4-3-2-1, front à 37 €)

---

## Calendrier de lancement (rappel de `00`)

```
J-21  Setup FB démarré · domaine · Zoho · Stripe · DNS email
J-14  Produit front enregistré (8 vidéos) · bump · simulateur testé par 3 personnes de 60+ (ta famille)
J-10  VSL enregistrée · pages montées · pixels vérifiés
J-7   12 créatives montées · ad copies · emails chargés · tests CB
J-3   Relecture `11` de TOUTES les pages et pubs · pub image clean lancée à 2 €/j
J0    Campagne live 50 €/j · ne rien toucher 48 h
J+7   Premier bilan · A/B headline VSL
J+14  Bilan 1 000 € · GO/NO-GO · si GO : 100 €/j + campagne contrôle + passage Purchase
J+21  Premiers témoignages · Générateur construit (3-4 jours) · VSL 2 + mini-lancement 1 en ligne
J+35  Kit Dépendance · VSL 3 · mini-lancement 2
J+49  Classeur (mise en page + test d'impression sur imprimante domestique) · VSL 4
J+63  Kit Testament · VSL 5 · newsletter hebdo démarrée
```
