# 06 — Les pages du funnel

> ## ⚠️ RÉORGANISATION DU 6 SEPTEMBRE 2026 — à lire avant le reste
>
> Le funnel était monté à l'envers. La **landing page** portait onze blocs de
> structure CEO et neuf appels à l'action ; la **page de vente**, elle, n'avait
> ni récit, ni personnage, ni escalier de projection.
>
> L'anatomie du funnel (`05-funnel/anatomie-funnel.md`) ne laisse pourtant aucune
> ambiguïté sur qui fait quoi :
>
> ```
> ADS → LANDING PAGE → PAGE DE VENTE → BON DE COMMANDE → UPSELLS → MERCI
>         (l'email)      (la vente)       (+ bump)         (OTO)
>              │                                              │
>              └────────── EMAIL CAPTURÉ ─────────────────────┘
>                                │
>                                ↓
>                    SÉQUENCE 7 JOURS + 4 BACKENDS
>                       (là où est le profit)
> ```
>
> ### Ce qui a bougé
>
> | | Avant | Après |
> |---|---|---|
> | Landing pages | **4** (`/`, `/lp-courte`, `/lp-questions`, `/lp-classique`) | **2** (`/`, `/lp-questions`) |
> | `/` | LP MAX, structure #6, 38 écrans mobile | structure #2, **4,5 écrans** |
> | Récit CEO | sur la landing page | sur `/methode`, sous la vidéo |
> | Boutons du récit | vers le formulaire d'opt-in | vers `/commande` |
> | Urgence du bon de commande | sous le formulaire | **au-dessus** |
>
> ### Pourquoi deux LP ont été retirées
>
> Le tableau de choix des six structures attribue la **LP MAX (#6) au high
> ticket**. On vend un produit à **27 €**. Les trois structures prévues pour le
> low ticket — #1 courte, #2 classique, #3 forms — prennent toutes l'email en
> haut de page, avant tout contenu long. Et le repère de conversion d'une
> landing page, **~50 %**, est hors d'atteinte pour une page de 3 000 mots.
>
> `/lp-courte` (#1) faisait doublon avec la classique. Il en reste deux, et
> c'est le bon nombre : départager deux variantes demande ~100 conversions
> chacune, soit ~300 € de budget par variante.
>
> **Rien n'a été jeté.** Le copywriting émotionnel est intégralement conservé,
> déplacé là où il vend.
>
> ### Correction du même jour : la page de vente était un doublon de la vidéo
>
> Les onze blocs CEO avaient été déplacés de la landing page vers `/methode`.
> C'était le bon sens du mouvement, mais pas la bonne destination pour tout :
> `05-vsl-front.md` organise le script de la VSL en `LEAD (20 %)` → `BODY (65 %)
> — structure CEO` → `CLOSING (15 %)`. **La structure CEO est le travail de la
> vidéo.** La page racontait la même histoire juste en dessous, sur 38 écrans.
>
> Le gabarit d'une page de vente tient en une ligne dans `anatomie-funnel.md` :
> `[H1][H2][VIDÉO][BOUTON][+ preuves / bonus / garantie / FAQ][CGV]`.
>
> `/methode` s'y conforme désormais — **38,6 écrans → 12,9**, 12 boutons → 5 :
>
> | Case du gabarit | Ce qui l'occupe |
> |---|---|
> | preuves | `TheNumber` (le calcul ligne par ligne), `BeforeAfter` |
> | bonus | le packaging et la pile de valeur |
> | urgence | `TheDeadline`, avant le dernier appel |
> | garantie | `TheGuarantee` |
> | FAQ | les six objections |
>
> **Rien n'est perdu.** Le récit retiré EST le script de la VSL, il vit dans
> `05-vsl-front.md`, et les composants restent dans `LpCeo.tsx` — de quoi tester
> une variante longue le jour où le volume le permettra.
>
> La H1 reprend la ligne qui portait l'ancienne page — qualification puis coût
> de l'inaction dans la proposition principale — et la H2 tient le format du
> gabarit : bénéfice, sans douleur, délai, puis l'appel à regarder la vidéo.
>
> ### Ce qui reste à faire
>
> - [ ] **Vendre sur la page de merci.** *« Il y a du trafic, donc il y a de la
>       vente. »* Elle ne propose rien aujourd'hui — mais le premier produit
>       backend (le Générateur, 147 €) n'a pas encore de page. À faire ensemble.
> - [ ] Les quatre pages backend : `/generateur`, `/dependance`, `/classeur`,
>       `/testament`.
 (Phase 2.6) — copy prêt à coller

> Ordre : Landing page → VSL (cf. `05`) → Bon de commande + bump → Upsell 1 → Upsell 2 → Thank you page.
> Exit pop-up : LP ✅ · VSL ✅ · Bon de commande ✅ · OTO ❌.
> Design : fond blanc, texte noir, **police 18-20 px minimum**, boutons larges, une colonne. L'avatar est sur mobile avec des lunettes de lecture.

---

## 1. LANDING PAGE (opt-in)

**Objectif : 40-50 % d'opt-in.** Une headline, un champ, un bouton. Rien d'autre au-dessus de la ligne de flottaison.

> ⭐ **Trois variantes sont construites et en ligne**, à tester l'une contre l'autre (un adset par URL,
> pour que Meta les compare directement). Structures issues de `05-funnel/landing-pages.md`.
>
> | URL | Structure | Quand elle gagne |
> |---|---|---|
> | `/` | **LP 6 MAX** ⭐ : qualification → autorité chiffrée → promesse + garantie → CTA → **disqualification** | La structure la plus complète, testée et approuvée. C'est la variante principale depuis le 5 septembre 2026. |
> | `/lp-courte` | **LP 1 courte + pop-up** : question + CTA, formulaire dans le pop-up | Quand la promesse chiffrée (82 194 €) porte à elle seule. Friction perçue minimale. |
> | `/lp-questions` | **LP 3 questionnaire** : 3 questions (règle des 3 oui) → opt-in | Engagement maximal. C'est la structure qui performe le mieux aux États-Unis. |
>
> Les 4 leviers sont appliqués aux trois : preuve sous le bouton (les articles du CGI, faute de
> témoignages pour l'instant), second call to action après la preuve, mention anti-spam,
> **texte de compliance Meta en pied de page** (son absence fait sauter des comptes publicitaires).
>
> ⚠️ Le questionnaire interpelle directement (« ce que vous avez construit », « vos enfants ») :
> c'est autorisé sur une page. Ces formulations ne partent **jamais** telles quelles dans une
> annonce — voir « Où s'arrête la règle Personal Attributes » plus bas.

### Variante A — la LP MAX (structure #6)

> Refondue le 5 septembre 2026. Elle remplace la LP 2 classique, qui n'exploitait ni la
> qualification en headline, ni la disqualification.

**Les cinq blocs de la structure MAX, et ce qu'ils sont devenus ici :**

| Bloc MAX | Chez nous |
|---|---|
| 1. Qualification | Le kicker et le H1. **Par le cas, jamais par un « vous » + attribut** (voir l'avertissement plus bas) |
| 2. Autorité + résultats chiffrés | Nous n'avons aucun résultat client. L'autorité est **empruntée au Code général des impôts** — et elle est plus forte : *« Ces chiffres ne sont pas les nôtres. »* |
| 3. Promesse + garantie | Le bloc « Ce que vous recevez, dans les deux minutes », juste avant le second formulaire |
| 4. Call to action + form | Deux fois : dans le hero, et en bas de page |
| 5. **Disqualification** ⭐ | *« Cette vidéo ne sert à rien dans trois cas »* — leads qualifiés, et Meta récompense la qualité des conversions |

**Mise à jour du 5 septembre 2026 : la page est montée sur la structure CEO**, les onze blocs de
`03-marketing-copy/structure-ceo.md`, dans l'ordre. Deux blocs manquaient complètement, et c'est
ce qui faisait que la page ne ressemblait pas à du Valère :

| Bloc manquant | Ce qui a été écrit |
|---|---|
| **1. RÊVE** — il doit être **en premier**, toujours | *« Il y a une phrase que vos enfants diront de vous. Vous pouvez encore choisir laquelle. »* En ouverture, sur la photo du grand-père et de l'enfant. On y vend le **désir profond** (être celui qui a protégé les siens, et le voir de son vivant), jamais le désir de surface (payer moins de droits). |
| **2. EXCUSER L'ÉCHEC** — « ce n'est pas votre faute » | *« Jean-Pierre a fait tout ce qu'il fallait. Ça n'a rien changé. »* Un prénom, 67 ans, Nantes, une histoire, une photo. Il a ouvert son assurance-vie en 2003, fait un testament en 2015, épargné 400 € par mois pendant quarante ans — et la facture tombe quand même. |

Ont aussi été ajoutés : le **doute confirmé** (*« Tout ça a l'air un peu trop beau. »* — on se met du
côté du sceptique et on lui donne de quoi vérifier avant de donner son email), le **mécanisme
enfin développé en 3 étapes** (les 3 Verrous, un après-midi), l'**escalier de l'imagination**
(ce soir → demain → une semaine → trois semaines → quinze ans → le jour venu), et la **garantie**
en bloc propre. L'ennemi a été polarisé : *« Il y a deux sortes de familles en France. »*

**L'enchaînement de la page**, dans l'ordre CEO :

```
HERO          Qualification + le chiffre étiqueté + FORMULAIRE

1. RÊVE       « Il y a une phrase que vos enfants diront de vous »   [photo]
2. ÉCHEC      Jean-Pierre, 67 ans : ce n'est pas votre faute         [photo]
3. PEUR       D'où sortent les 82 194 € · La facture tombe           [photo]
4. ENNEMI     Personne n'est payé pour vous prévenir
              « Il y a deux sortes de familles en France »
5. DOUTE      « Tout ça a l'air un peu trop beau » · Ni testament,
              ni notaire, ni placement · « Ils se débrouilleront bien »
6. PREUVE     L'écart que personne ne montre · Sans plan / Avec le plan
7. MÉCANISME  Les 3 Verrous : le compteur, le contrat, les murs
8. RÊVE FINAL L'escalier : ce soir → demain → 3 semaines → 15 ans
9. URGENCE    Les 3 portes + le 31 décembre 2026                     [photo]
10. GARANTIE  Ce que vous risquez : rien
11. CTA       Disqualification + FORMULAIRE + preuve
```

**Ce qui vient du benchmark** (`16-benchmark-marches.md`, `17-swipe-my-estate-kit.md`) :
un chiffre précis partout et jamais un pourcentage seul ; le mécanisme reformulé en une phrase
qui retourne le problème ; l'objection en titre de section ; la garantie retournée contre le
concurrent ; l'anti-technologie (*« pas de compte à créer, pas de mot de passe »*) ; l'effort en
unité simple (*« un après-midi »*) ; l'urgence honnête, datée, sans compteur.

### ⚠️ Où s'arrête la règle Personal Attributes

La qualification de la LP MAX s'écrit à la 2e personne, comme Valère l'enseigne :
*« Vous sortez d'une grossesse ? »*, *« Vous possédez une agence ? »*. Chez nous :
**« Vous avez une maison payée et des enfants ? »**

**Décision du 5 septembre 2026 : on la garde telle quelle sur la page.**
La politique Personal Attributes de Meta encadre le contenu des **annonces**, pas celui
de la page d'atterrissage. La page peut donc interpeller l'avatar directement — et elle doit,
sinon la structure MAX perd son premier bloc et la disqualification perd son mordant.

| Support | Règle |
|---|---|
| **Annonces Meta** (`08-creatives-ads.md`) | **Règle absolue, inchangée.** Jamais « vous » + un attribut. Tout en 1re personne (récit) ou en 3e (cas). C'est là que se joue le compte publicitaire. |
| **Landing pages** (`/`, `/lp-courte`, `/lp-questions`) | Qualification directe autorisée. Âge, patrimoine, statut familial, tout est permis dans la copy. |
| **VSL, bon de commande, upsells, emails** | Même liberté que la LP. |

> ⚠️ **Le seul vrai danger, c'est le copier-coller.** Une phrase de la LP recopiée dans une
> créative fait sauter le compte. Les deux registres ne se mélangent jamais : quand une
> accroche de page marche, elle se **réécrit** en 1re ou 3e personne avant de partir en annonce.

Un rappel est posé en tête de `site/src/components/Lp.tsx` et de `QuestionsOptin.tsx`.

**Une variante impersonnelle est écrite et disponible**, si un jour une annonce est refusée
à cause de la page :

| 2e personne (en ligne) | 3e personne (en réserve) |
|---|---|
| « Vous avez une maison payée et des enfants ? Voici ce que l'État prendra dessus. » | « Une maison de province. Les économies d'une vie. L'État en a pris 82 194 €. » |
| « Propriétaires de plus de 60 ans » | « Droits de succession · Le calcul que personne ne fait à temps » |
| « Vos enfants paieront. La question, c'est avec quel argent. » | « La facture tombe. La question, c'est avec quel argent. » |
| « Ne remplissez pas ce formulaire si… » | « Cette vidéo ne sert à rien dans trois cas… » |

C'est aussi une bonne matière d'A/B test : la version 3e personne raconte un fait divers,
la version 2e personne interpelle. Rien ne dit d'avance laquelle convertit le mieux.

**Exit pop-up LP :**
> *Avant de partir : laquelle des trois dates se ferme en premier ?* [prénom] [email] [Recevoir les 3 dates]

**Headlines à A/B tester ensuite :**
- *« L'héritier n°1 de la plupart des familles françaises, c'est l'État. Voici ce qui change ça. »* (déjà en ligne sur `/lp-courte`)
- *« Trois portes se ferment avec le temps sur une succession. Aucune ne se rouvre. »*
- *« 82 194 € ou 23 794 €. Le même patrimoine, deux décisions d'écart. »*

---

## 2. BON DE COMMANDE (+ BUMP)

Structure du repo : bénéfices · preuves · urgence · sécurité · bonus · remboursement · résumé · Q&A · témoignages.

**Bump pré-coché**, conformément à la méthode (`05-funnel/anatomie-funnel.md`, `06-process/PROCESS-MAITRE.md` § 2.6). Décision du 4 septembre 2026, cf. `11-legal-et-compliance.md` § 2.3.

```
┌──────────────────────────────────────────────────────────────────┐
│  Colonne gauche (60 %)                    Colonne droite (40 %)  │
│                                                                    │
│  H1  Votre accès immédiat aux 7 Erreurs   RÉSUMÉ DE VOTRE COMMANDE│
│      + la Méthode des 3 Verrous            ─────────────────────  │
│                                            Les 7 Erreurs ..... 27 €│
│  [ Prénom ] [ Email ]                      (au lieu de 67 €)      │
│  [ Carte bancaire — Stripe ]               ☑ Dossier Notaire  17 €│
│                                            ─────────────────────  │
│  ┌────────────────────────────────────┐    TOTAL ........... 44 € │
│  │ ☑ OUI, ajoutez le Dossier Notaire  │                            │
│  │   Prêt-à-Signer pour 17 € seulement│    Ce que vous recevez :   │
│  │   (au lieu de 47 €)                │    ✔ 8 modules vidéo       │
│  │   L'inventaire, la fiche famille,  │    ✔ Le Simulateur         │
│  │   la check-list des 12 pièces et   │    ✔ Le Calendrier 3 Dates │
│  │   le mail qui fait que le notaire  │    ✔ Le Plan en 1 Page     │
│  │   prépare VOTRE rendez-vous.       │    ✔ 5 bonus (valeur 135 €)│
│  │   Une heure de travail, faite.     │    ✔ Mises à jour à vie    │
│  └────────────────────────────────────┘    ✔ Garantie 30 jours     │
│                                                                    │
│  [   VALIDER MA COMMANDE — ACCÈS IMMÉDIAT   ]                      │
│  🔒 Paiement sécurisé · Visa · Mastercard · CB                     │
│  Une question ? contact@heritage-intact.fr — réponse sous 24 h     │
└──────────────────────────────────────────────────────────────────┘

(sous le formulaire)

GARANTIE 30 JOURS — en gros, encadrée
"Si vous n'identifiez pas au moins une erreur que vous étiez en train de commettre,
 un email suffit : remboursement intégral. Et vous gardez le simulateur."

POURQUOI 27 € ?
"Prix fondateur pour les 500 premiers membres — nous collectons vos retours pour la V2
 du simulateur. Compteur : [143] / 500. Ensuite : 67 €."

TÉMOIGNAGES (3, quand ils existent — prénom, âge, département, texte court)

QUESTIONS FRÉQUENTES
• "Est-ce que ça remplace le notaire ?" — Non. Ça vous permet d'y aller avec un dossier et des
  décisions, au lieu des mains vides. Le notaire acte ; vous décidez.
• "Ma situation est particulière." — La méthode commence par votre chiffre et vos dates. Le
  module 7 vous oriente selon votre situation familiale.
• "Et si la loi change ?" — La Règle de Mise à Jour est incluse, et les mises à jour du programme
  sont à vie.
• "Je ne suis pas à l'aise avec le paiement en ligne." — Le paiement passe par Stripe, le même
  système que des milliers de sites marchands. Nous ne voyons jamais votre numéro de carte.
  Et il y a une adresse email au-dessus, avec une vraie personne derrière.
• "Est-ce un conseil personnalisé ?" — Non : c'est un programme pédagogique. Pour un conseil
  sur votre situation, le Dossier Notaire vous prépare au rendez-vous avec votre notaire.

Footer : CGV · mentions légales · confidentialité
```

**Exit pop-up bon de commande :**
> *Vous hésitez ? C'est normal. Voici le module 1 en accès libre pendant 24 h — regardez-le, puis décidez.* [Voir le module 1] → page avec le module 1 + bouton retour BDC. (Tu donnes le module 1 : c'est le bump de confiance sur cet avatar.)

**Emails panier abandonné :** cf. `09-emails.md` § Séquence 2.

---

## 3. UPSELL 1 — Le Plan Transmission Complet (297 €)

> Page OTO. **Pas d'exit pop-up.** Vidéo de 4-5 min + texte. Un bouton OUI, un lien NON discret en bas.
> Ton : "vous venez de faire le premier pas — voici le raccourci."

```
[Barre de progression]  Étape 1 : Commande ✔   Étape 2 : Votre plan   Étape 3 : Accès

H1   Attendez — votre commande est validée. Avant d'accéder à votre espace, une seule question :
     dans VOTRE situation familiale, lequel des 3 verrous en premier ?

H2   Le Plan Transmission Complet : les 12 situations familiales, chacune avec son plan d'action
     dans l'ordre, ses 3 pièges, ses 3 questions au notaire — et le Simulateur Complet.

[VIDÉO 4 min]
```

**Script vidéo upsell 1 :**
> Félicitations — vous faites partie des rares familles qui ont décidé de savoir. Dans quelques minutes, vous aurez votre chiffre.
>
> Mais je vais être honnête avec vous : le chiffre, c'est le début. La question qui vient tout de suite après, c'est : *« Dans ma situation, je fais quoi, en premier ? »*
>
> Parce qu'un couple marié avec deux enfants ne prend pas les mêmes décisions qu'une veuve de 71 ans, qu'une famille recomposée, ou qu'un père dont le fils vit en couple sans être marié. Le bon levier pour l'un est un piège pour l'autre. *(exemple : la donation au dernier vivant, formidable en famille "classique", peut spolier les enfants d'un premier lit.)*
>
> C'est pour ça que j'ai écrit le Plan Transmission Complet : douze situations familiales, et pour chacune, **une page** — les trois verrous dans le bon ordre, les trois pièges à éviter, les trois questions à poser au notaire, et ce que ça change en euros sur un cas concret.
>
> Avec : le Simulateur Complet (plusieurs héritiers, plusieurs contrats, démembrement, donations passées), le Calendrier de Transmission sur 15 ans — quoi faire quelle année —, trois modèles de clause bénéficiaire commentés, et le tableau de bord familial.
>
> Séparément, c'est 497 euros. Sur cette page, une seule fois, parce que vous venez de rejoindre le programme : **197 euros**. Vous ne reverrez pas ce prix.
>
> Même garantie : 30 jours. Cliquez sur « Oui, je veux mon plan » — l'accès s'ajoute à votre espace, sans ressaisir votre carte.

```
CE QUE VOUS RECEVEZ                                             VALEUR
• 12 plans-types (1 page chacun)                                197 €
• Le Simulateur Complet                                         147 €
• Le Calendrier de Transmission sur 15 ans                       67 €
• 3 modèles de clause bénéficiaire commentés                     47 €
• Le tableau de bord familial                                    39 €
                                                     TOTAL      497 €
                                          AUJOURD'HUI SEULEMENT 297 €

[   OUI — J'AJOUTE LE PLAN TRANSMISSION COMPLET À MA COMMANDE (297 €)   ]
       Un seul clic. Garantie 30 jours.

(en petit, en bas)  Non merci, je préfère trouver seul le bon ordre pour ma situation.
```

⚠️ Si les 12 plans ne sont pas tous prêts au lancement : ajouter une ligne honnête *« 4 plans-types disponibles immédiatement (situations 1, 2, 4, 5), les 8 autres livrés dans votre espace sous 30 jours »*.

---

## 4. UPSELL 2 — Le Kit Assurance-Vie (97 €)

> Affiché que le client ait dit oui ou non à l'upsell 1. Vidéo 3 min.

```
H1   Dernière chose — votre assurance-vie. Celle de la banque, ouverte il y a 15 ou 20 ans.
     Trois questions, cinq minutes : 9 contrats sur 10 échouent.

H2   Le Kit Assurance-Vie : l'audit de votre contrat en 30 minutes, les 3 clauses bénéficiaires
     rédigées et commentées, et le tableau « avant / après 70 ans » pour décider quoi faire
     avec votre épargne avant votre prochain anniversaire.

[VIDÉO 3 min]
```

**Script vidéo upsell 2 :**
> Une dernière chose, et ensuite je vous laisse accéder à votre espace.
>
> L'assurance-vie est l'outil n°1 de la transmission en France. Et c'est aussi celui que presque tout le monde a — et que presque tout le monde a mal réglé. Trois questions suffisent pour le savoir : *quelle est votre clause bénéficiaire ? quand avez-vous versé — avant ou après 70 ans ? combien de frais ?*
>
> La clause standard — « mon conjoint, à défaut mes enfants » — est souvent la pire des trois options possibles. Les versements après 70 ans divisent l'avantage par cinq. Et 3 % de frais sur 20 ans, c'est une année d'épargne offerte à la banque.
>
> Le Kit Assurance-Vie, c'est l'audit de votre contrat en 30 minutes avec une grille notée sur 10, les trois clauses bénéficiaires rédigées et commentées ligne par ligne, le tableau de décision « j'ai 68 ans et 80 000 euros sur un livret : que faire avant mon anniversaire ? », et la lettre-type pour demander la modification à votre assureur.
>
> 197 euros normalement. Ici, **97 euros**, une seule fois. Même garantie. Cliquez sur oui.

```
[   OUI — J'AJOUTE LE KIT ASSURANCE-VIE (97 €)   ]
(bas)  Non merci, mon contrat est parfait tel qu'il est.
```

---

## 5. THANK YOU PAGE — elle vend aussi

```
H1   Bienvenue dans Héritage Intact, %FIRSTNAME%. Voici vos 3 prochaines étapes.

1.  Vos identifiants arrivent par email dans 2 minutes (vérifiez les indésirables ; ajoutez
    contact@heritage-intact.fr à vos contacts).
2.  Ce soir : Module 0 → votre chiffre. Prévoyez 30 minutes, vos relevés, et un café.
3.  Notez vos 3 dates sur le Calendrier. C'est la seule chose à faire aujourd'hui.

[  ACCÉDER À MON ESPACE  ]

────────────────────────────────────────────────────────────────

Et quand vous aurez votre chiffre…

…la question suivante sera : « et si je donne la maison ? et si j'attends 71 ans ? » Le Générateur
de Dossier Notaire répond en direct, et imprime votre dossier prêt pour le notaire. Vos chiffres
ne quittent pas votre ordinateur. Vous le retrouverez dans votre espace, onglet « Outils & Kits » —
et dans un email dans quelques jours, avec le prix membre.

[  DÉCOUVRIR LE GÉNÉRATEUR  ]  → VSL 2 (`07`)
```

---

## 6. Espace membre — rappels

- Onglet **« Outils & Kits »** visible dès J1 (vendre dans le produit) : les 4 produits backend au prix public, avec mention « prix membre par email ».
- Bandeau en haut de chaque module : *« Vous avez une question ? Répondez à n'importe quel email — je lis tout. »* (réponses = matière à témoignages + à FAQ).
- Sous chaque module : le PDF téléchargeable + « Imprimer cette fiche ».
- Pas de forum, pas de communauté au lancement : l'avatar ne s'en sert pas et c'est une charge.
