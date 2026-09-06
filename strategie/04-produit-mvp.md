# 04 — Le produit, module par module (Phase 1.5 — MVP)

> Règle du repo : **1 pain point → 1 mécanisme → 1 résultat.** Le strict minimum qui tient la promesse.
> On enregistre le FRONT et le BUMP avant le lancement. Les upsells se finissent et les 4 produits
> backend se construisent pendant que le front tourne (accès progressif annoncé honnêtement).
>
> ⚠️ Tout le contenu est **pédagogique et général**. Aucun conseil personnalisé. Cf. `11`.
> ✅ Tous les chiffres viennent de `12-chiffres-succession.md`, **vérifié le 5 septembre 2026** sur impots.gouv.fr, service-public.gouv.fr, legifrance.gouv.fr et le BOFiP. Chaque section de la fiche porte son statut. Ne jamais citer un chiffre qui n'y figure pas.

---

## Format de production (adapté à l'avatar)

- **Vidéo face caméra ou voix-off + slides très lisibles** (police ≥ 28 pt, fond clair, un chiffre par slide).
- **8 à 12 minutes par module.** Pas plus : l'avatar décroche et il veut "le concret".
- **Chaque module = 1 erreur + 1 correction + 1 action à faire ce soir.** Structure fixe :
  ```
  0:00  L'erreur en une phrase + ce qu'elle coûte (chiffre)
  1:00  Le cas concret (Jean-Pierre / Martine)
  3:00  Pourquoi personne ne vous l'a dit (ennemi commun, 30 s max)
  4:00  La correction, pas à pas
  8:00  "Ce soir, faites ceci" (action unique)
  9:00  Pont vers le module suivant (open loop)
  ```
- **PDF imprimable de 40 pages** qui reprend tout : l'avatar imprime. Il faut que ça existe.
- Espace membre intégré au site (Next.js). **Onglet "Outils & Kits" visible dès le jour 1** (vendre dans le produit — les 4 backend au prix public).
- Sous-titres sur toutes les vidéos.

---

# ═══ PRODUIT FRONT — 27 € ═══
# « Les 7 Erreurs qui Offrent Votre Héritage à l'État »

## Module 0 — Bienvenue + Votre Facture Invisible (VERROU 1)  — 12 min

**Objectif :** que le client ait **son chiffre** avant la fin de la première vidéo. C'est la preuve par la démonstration. C'est aussi ce qui le fera regarder la suite.

Contenu :
1. Qui parle, pourquoi (le narrateur, 45 s — pas plus).
2. Comment marche une succession en France en 3 phrases : *actif − passif = masse ; on partage selon la loi ou le testament ; chaque héritier paie des droits sur SA part après SON abattement.*
3. **Le Simulateur de Facture Invisible** — démonstration à l'écran avec le cas Jean-Pierre :
   - Patrimoine 520 000 € (maison 380 k€ + épargne 140 k€), 1 enfant, veuf.
   - Part taxable : 520 000 − 100 000 = 420 000 €.
   - Barème par tranches → **82 194 €**. Détail des tranches à l'écran.
4. Le client fait le sien (20 min, fichier fourni : patrimoine, situation matrimoniale, nombre d'enfants, contrats d'assurance-vie avec date des versements).
5. **Le Calendrier des 3 Dates** : le client note ses trois échéances (âge 70, âge 71, date de la dernière donation + 15 ans).
6. Open loop : *"Dans le module suivant, la première erreur — celle qui coûte le plus et qui ne coûte rien à corriger."*

Livrables : Simulateur (Google Sheet + version Excel + version papier), Calendrier des 3 Dates (PDF 1 page).

## Module 1 — Erreur n°1 : « Je verrai ça plus tard » (le compteur des 15 ans) — 10 min

- L'abattement de 100 000 € par parent et par enfant se **recharge tous les 15 ans**. Une donation à 62 ans + une seconde à 77 ans = 200 000 € par enfant transmis sans droits, contre 100 000 € si on attend le décès.
- Cas : Jean-Pierre, 2 enfants. Donation de 100 000 € à chacun à 67 ans → 200 000 € sortis de la succession, 0 € de droits. Compteur rechargé à 82 ans.
- Le don familial de sommes d'argent (31 865 € par donateur < 80 ans, à chaque enfant/petit-enfant majeur), **cumulable** avec les 100 000 €.
- Ce que coûte "attendre un an" : chiffrer sur le cas.
- Action ce soir : reporter la date de sa dernière donation (ou "jamais") sur le Calendrier.
- Objection traitée : *"et si j'en ai besoin ?"* → on ne donne que ce dont on est sûr de ne pas avoir besoin ; le module 4 montre comment transmettre **sans se déposséder**.

## Module 2 — Erreur n°2 : Ne pas être marié (ou l'être mal) — 9 min

- Conjoint marié ou pacsé : **0 € de droits**. Concubin : abattement 1 594 €, puis **60 %**.
- Cas Martine (variante) : une amie en concubinage depuis 30 ans hérite de la moitié de la maison → 60 % de droits → obligée de vendre.
- Le PACS + testament : la solution à 200 € qui évite 60 %.
- Les régimes matrimoniaux en 2 minutes : communauté / séparation, et pourquoi la **donation au dernier vivant** change la vie du conjoint survivant.
- Thomas (le fils en couple non marié) : ce que ça implique pour la transmission du studio si Jean-Pierre le lui donne.
- Action : vérifier son régime + l'existence d'une donation au dernier vivant.

## Module 3 — Erreur n°3 : L'assurance-vie "de la banque" jamais relue — 11 min

- Pourquoi l'assurance-vie est **hors succession** (art. L132-12 code des assurances) — l'outil n°1.
- **Avant 70 ans** : 152 500 € par bénéficiaire sans droits (art. 990 I CGI). **Après 70 ans** : 30 500 € pour tous les bénéficiaires confondus (art. 757 B). *La même somme, placée avant ou après l'anniversaire, ne subit pas le même traitement.*
- La clause bénéficiaire standard ("mon conjoint, à défaut mes enfants") : pourquoi elle est souvent sous-optimale ; l'idée de la clause démembrée (mention, sans détailler → upsell 2).
- Les frais : 0,6 % vs 3 % sur 20 ans, chiffré.
- **Le Test des 3 Questions** (5 min) : *Quelle est ma clause ? Quand ai-je versé ? Combien de frais ?* → orienté vers le Kit Assurance-Vie.
- Action : sortir ses contrats, faire le test.

## Module 4 — Erreur n°4 : Garder sa maison "en pleine propriété" jusqu'au bout — 12 min

- **Le démembrement** en français : vous donnez les murs (nue-propriété), vous gardez l'usage à vie (usufruit). Vous restez chez vous. Vous pouvez même la louer.
- Le barème de l'art. 669 CGI : la loi raisonne en « moins de X ans révolus », donc **la bascule tombe le jour de l'anniversaire**. Tant qu'on n'a pas 71 ans, la nue-propriété vaut **60 %** ; à partir de 71 ans, **70 %**. → *"Tant que vous n'avez pas 71 ans, on transmet sur 60 %. Le jour de vos 71 ans, c'est 70 %. Dix points de patrimoine, pour un anniversaire."*
- Cas Jean-Pierre : donation de la nue-propriété de la maison (380 k€) à 67 ans, aux 2 enfants → base 228 000 €, soit 114 000 € par enfant, sous l'abattement à 14 000 € près → droits quasi nuls. Au décès, l'usufruit s'éteint **sans droits**.
- Avant/après complet sur le cas : **82 194 € → 23 794 €** (avec l'assurance-vie du module 3). Le détail à l'écran.
- Objection EHPAD : l'usufruitier peut louer ; on peut garder l'épargne en pleine propriété ; on peut prévoir une **clause de retour** et une **interdiction d'aliéner**.
- Action : noter la valeur de sa maison et son âge → lire sa ligne du barème.

## Module 5 — Erreur n°5 : Le don « de la main à la main » — 8 min

- Le don manuel non déclaré : le risque du rappel fiscal (15 ans), la découverte au décès, le redressement et **les conflits entre héritiers** ("papa t'a donné 30 000 € en 2015, on le déduit de ta part").
- Le formulaire 2735 : déclarer coûte 0 € quand on est sous abattement, et **fait démarrer le compteur des 15 ans**.
- La **donation-partage** : figer les valeurs au jour de la donation, éviter la guerre à l'ouverture de la succession. Cas Sophie/Thomas.
- Action : lister tous les dons faits depuis 15 ans.

## Module 6 — Erreur n°6 : Oublier une génération (les petits-enfants) — 8 min

- Abattement propre aux petits-enfants en donation : **31 865 €** par grand-parent et par petit-enfant, tous les 15 ans + don familial d'argent cumulable.
- "Sauter une génération" : ce que Sophie et Thomas paieraient s'ils re-transmettent plus tard vs. donner directement aux 3 petits-enfants.
- Le rêve : payer les études / le premier appartement **et le voir**.
- Les mineurs : compte ouvert au nom de l'enfant, administration légale — les points d'attention.
- Action : noter les 3 petits-enfants et ce qu'on voudrait pour chacun.

## Module 7 — Erreur n°7 : Aller chez le notaire les mains vides (VERROU 3) — 10 min

- Le notaire est payé à l'acte. Il **acte ce que vous demandez**. Sans dossier, il pose 3 questions et vous ressortez avec "revenez quand vous saurez".
- Ce qu'il faut apporter : inventaire, valeurs, contrats, situation familiale, **vos choix déjà faits** (verrou 2).
- Les 12 questions à lui poser (bonus). Les 3 à ne jamais poser (*"vous me conseillez quoi ?"* sans dossier).
- Combien coûte un acte de donation (émoluments — ordre de grandeur) vs ce qu'il économise.
- **La grille "Quelle est ma situation ?"** → 12 cases (marié 1 enfant, marié 2+, recomposée, veuf/veuve, concubin, sans enfant, avec entreprise, avec immobilier locatif, enfant à l'étranger, enfant vulnérable, patrimoine > 1 M€, déjà des donations faites) → *"Votre plan-type détaillé est dans le Plan Transmission Complet"* (pont upsell 1).
- **Le Plan en 1 Page** : le client remplit ses 3 Verrous.
- Fin : *"Vous avez maintenant ce que 9 familles sur 10 n'ont jamais : votre chiffre, vos dates, votre plan. Et quand vous voudrez tester « et si je donne la maison ? et si j'attends 71 ans ? » sans refaire trois tableurs — le Générateur le fait en direct et imprime votre dossier. Onglet Outils & Kits."*

## Bonus (PDF, dans l'espace membre)
- B1. Le Lexique en 1 page (15 mots)
- B2. Les 12 questions à poser à votre notaire (+ les 3 à ne pas poser)
- B3. La lettre pour ouvrir le sujet avec vos enfants (texte à trous) + le script de la conversation
- B4. La Règle de Mise à Jour ("si la loi change, voici ce qui bouge et ce qui ne bouge pas")
- B5. La fiche "Combien garder pour soi" (la règle des 3 poches : vivre / imprévu / transmettre)

**Temps de production estimé : 8 vidéos ≈ 2 jours d'enregistrement + 2 jours de slides/PDF.**

---

# ═══ BUMP — 17 € ═══
# « Le Dossier Notaire Prêt-à-Signer »

*Décision facile. Pré-coché. Ce que le client n'a PAS envie de faire : préparer le dossier.*

- **L'inventaire patrimonial** à remplir (tableau : bien / valeur / mode de détention / date d'acquisition / dettes) — version tableur + version papier
- **La fiche famille** (arbre, régimes, donations passées)
- **La check-list des pièces** à apporter au notaire (12 documents)
- **Le mail-type de prise de rendez-vous** qui fait que le notaire prépare le RDV (et vous prend au sérieux)
- **Le compte-rendu à trous** à remplir après le RDV (pour que le conjoint sache)
- Vidéo de 6 min : "comment remplir tout ça en une heure"

**Production : 1 demi-journée.**

---

# ═══ UPSELL 1 — 197 € ═══
# « Le Plan Transmission Complet — les 12 situations familiales »

*Le nouveau problème du client après le front : "dans MA situation, quoi, dans quel ordre ?"*

Une vidéo de 15-20 min + un plan-type écrit **par situation** (12) :

| # | Situation | Le levier prioritaire du plan-type |
|---|---|---|
| 1 | Marié, 1 enfant | Donation au dernier vivant + démembrement |
| 2 | Marié, 2 enfants ou + | Donation-partage + rechargement 15 ans |
| 3 | Famille recomposée | Le piège de l'enfant du conjoint (60 %) ; adoption simple ; assurance-vie ciblée |
| 4 | Veuf / veuve | Après 70 ans : quoi faire encore ; le testament ; les petits-enfants |
| 5 | Concubins / PACS | PACS + testament ; assurance-vie croisée |
| 6 | Sans enfant | Neveux (55 %) vs assurance-vie ; legs ; le conjoint |
| 7 | Avec une entreprise ou des parts | Le pacte Dutreil (75 % d'exonération) — principe et conditions, avant d'aller voir l'expert |
| 8 | Avec immobilier locatif | La SCI familiale : quand oui, quand non ; démembrement de parts |
| 9 | Un enfant à l'étranger | Résidence fiscale, conventions — les questions à poser |
| 10 | Un enfant vulnérable / handicapé | Abattement spécifique, contrat rente-survie, épargne handicap, le mandat de protection future |
| 11 | Patrimoine > 1 M€ | L'ordre des leviers change ; combinaison AV + démembrement + donation-partage ; quand un CGP devient indispensable |
| 12 | Déjà des donations faites | Recalculer le compteur ; le rapport à succession ; rééquilibrer |

Chaque plan-type = **une page** : la situation → les 3 verrous dans l'ordre → les 3 pièges → les 3 questions au notaire → "ce que ça change en euros" (exemple chiffré).

Outils inclus :
- **Le Simulateur Complet** (multi-héritiers, multi-contrats, démembrement, donations passées)
- **Le Calendrier de Transmission sur 15 ans** (quoi faire, quelle année)
- **3 modèles de clause bénéficiaire** commentés (standard / à options / démembrée) — *à faire valider par le notaire*
- **Le tableau de bord familial** (qui reçoit quoi, quand, à quel coût)

**Production : 3 jours. Peut être livré en "accès progressif" : 4 plans-types au lancement (n°1, 2, 4, 5 — les plus fréquents), les 8 autres livrés sous 30 jours. À dire clairement sur la page d'upsell.**

---

# ═══ UPSELL 2 — 97 € ═══
# « Le Kit Assurance-Vie »

*Le levier n°1, celui que tout l'avatar possède et que 90 % ont mal réglé.*

- Vidéo 12 min : **lire son contrat** (frais, support, clause, date des versements) — l'audit en 30 min
- **La grille d'audit** (score sur 10)
- **Les 3 clauses bénéficiaires** rédigées et commentées, ligne par ligne
- Avant/après 70 ans : **le tableau de décision** ("j'ai 68 ans et 80 000 € sur un livret : que faire avant mon anniversaire ?")
- Le multi-contrats : pourquoi ouvrir un second contrat plutôt qu'alimenter le premier
- La lettre-type pour demander à son assureur la modification de clause
- Comparatif frais : contrat bancaire vs contrat en ligne (**sans nommer de produit**, cf. `11`)

**Production : 1,5 jour.**

---

# ═══ LES 4 PRODUITS BACKEND (vendus par email aux acheteurs) ═══

> Aucun ne demande de délivrance humaine ni de conseil personnalisé. Aucun n'a besoin d'exister au lancement.
> Ordre de construction = ordre de vente : Générateur (semaine 5-6) → Dépendance (sem. 8) → Classeur (sem. 10) → Testament (sem. 12).
> Détail des pages de vente : `07-vsl-backend.md`.

## BACKEND 1 — 147 € — « Le Générateur de Dossier Notaire » (VSL 2, J+10)

*Le simulateur complet, interactif, qui produit le dossier tout seul. Le "gros" produit.*

**Ce que c'est :** une petite application web (à construire avec Claude Code, hébergée sur Vercel, accès par code livré après achat). **Les données restent dans le navigateur du client** (localStorage) — rien n'est envoyé nulle part. Argument n°1 sur cet avatar + zéro problème RGPD.

**Entrées :** âge, situation matrimoniale et régime, enfants (nombre, situation de chacun), petits-enfants, patrimoine bien par bien (type, valeur, mode de détention), contrats d'assurance-vie (montant, versements avant/après 70 ans, bénéficiaires), donations passées (date, montant, bénéficiaire).

**Sorties :**
1. **La Facture Invisible aujourd'hui** — par héritier, tranche par tranche, avec l'article du CGI en face de chaque ligne.
2. **Les 3 Dates** du client, en clair.
3. **Les scénarios** — donation / assurance-vie / démembrement, activables un par un, avant/après en direct.
4. **Le Plan en 1 Page** — PDF à imprimer.
5. **Le Dossier Notaire pré-rempli** — inventaire, fiche famille, donations, pièces à apporter, PDF.
6. **La liste des questions** au notaire selon la situation détectée (parmi les 12).
7. Disclaimer intégré (`11` § 2.1) + « chiffres vérifiés le … ».

**Value stacking :** chiffrage par héritier (297 €) + scénarios (197 €) + dossier PDF (147 €) + questions (37 €) = 678 € → **147 €**. Garantie 30 jours.
**Production :** 3-4 jours avec Claude Code (formulaire, moteur de calcul depuis `12`, génération PDF, page d'accès). Tester avec les 3 cas types.

## BACKEND 2 — 97 € — « Le Kit Dépendance » (VSL 3, J+31)

*Le problème voisin que tout l'avatar a en tête et que personne ne traite : "et si je perds mon autonomie avant ?"*

Modules vidéo (5 × 8-10 min) + PDF :
1. Le mandat de protection future — décider soi-même qui gérera, avant qu'un juge ne le fasse
2. L'habilitation familiale vs la tutelle — ce qui se passe si on n'a rien prévu
3. L'EHPAD et le patrimoine — obligation alimentaire des enfants, aide sociale à l'hébergement et **récupération sur succession** (le piège que personne n'explique)
4. Protéger ce qui a été transmis — donation avec charges, clause d'interdiction d'aliéner, usufruit et location
5. Les directives anticipées et la personne de confiance — une page, un après-midi
+ Modèles : mandat de protection future (formulaire Cerfa commenté), directives anticipées, lettre à la personne de confiance.
**Production : 2 jours.**

## BACKEND 3 — 67 € — « Le Classeur Héritage Intact » (VSL 4, J+52)

*Papier, mais imprimé par le client. Les 60+ veulent du papier, et le classeur "dans le tiroir du bureau" est littéralement le rêve de l'avatar ("tout est là"). On lui livre le contenu, il fournit le classeur — celui qu'il a déjà, ou 4 € au supermarché.*

> **Zéro produit physique (décision du 6 septembre 2026).** Ce produit était prévu imprimé et expédié. Il devient un PDF prêt à imprimer. Ce qu'on perd : l'objet qui arrive tout fait. Ce qu'on gagne : la marge passe de 45 € à 67 €, il n'y a plus de délai de livraison à tenir, plus de retours à gérer, et le droit de rétractation redevient renonçable.

Contenu : le guide des 7 Erreurs (40 p.) + les fiches à remplir (inventaire, famille, 3 dates, plan en 1 page) + les 12 plans-types en fiches + les questions au notaire + **6 intercalaires à imprimer et découper** (Titres de propriété / Assurance-vie / Donations / Testament / Notaire / Divers) + une page de garde "Pour [prénom du conjoint] — tout est là", personnalisable avant impression.

**La mise en page est le produit.** Un PDF vendu 67 € doit être imprimable sans réfléchir : format A4, recto simple, marges qui survivent à une imprimante domestique, aucun aplat de couleur qui vide une cartouche, numérotation claire pour reprendre une page ratée. Prévoir une page 1 « Comment imprimer ce classeur » en trois lignes, et une variante « à donner à l'imprimeur du coin » (≈ 8 € en boutique).
**Production :** mise en page (Canva ou Affinity, 3 jours — un jour de plus qu'avant, parce que la qualité d'impression n'est plus assurée par un imprimeur professionnel). Coût marginal : 0 €. **Marge : 67 €.**

## BACKEND 4 — 47 € — « Le Kit Testament » (VSL 5, J+73)

Modules vidéo (3 × 8 min) + PDF :
1. Testament olographe — les 4 conditions de validité, ce qui l'annule, où le déposer (fichier central FCDDV)
2. Ce qu'on peut décider et ce qu'on ne peut pas — réserve héréditaire, quotité disponible, legs
3. La donation au dernier vivant et le testament pour concubins/pacsés
+ Modèles commentés : testament simple, testament avec legs, testament du concubin — « à faire relire par votre notaire ».
**Production : 1 jour.**

---

## Après les 4 backends — la newsletter fait le reste

Jeudi 17 h, chaque semaine : un cas, un chiffre, un conseil, **un CTA** vers l'un des 4 produits en rotation (un client n'ayant pas acheté le Générateur le revoit toutes les 4 semaines, avec un angle différent). Chaque décembre : la loi de finances → un email "ce qui change" → réactivation de toute la base.

**Option phase 2, sans délivrance (mois 4+) :** apporteur d'affaires vers un CGP / notaire — un acheteur avec dossier prêt vaut 100-300 €. Cadre : `11` § 2.1. Seulement quand le front tourne.
