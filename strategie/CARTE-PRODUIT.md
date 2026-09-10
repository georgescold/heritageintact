# Carte produit — organisation active au 10 septembre 2026

> **Cette section est la source de vérité actuelle.** L’ancienne carte est conservée
> plus bas comme historique et ne décrit plus les offres vendues.

## La règle actuelle

Un produit répond à une seule question. Aucun produit actif n’est présenté comme
un pack et aucun achat antérieur n’est transformé en « crédit » commercial.

| Étape | Produit | Question du client | Prix |
|---|---|---|---|
| Produit 1 | **Les 7 erreurs qui offrent votre héritage à l’État** | « Quelles erreurs dois-je connaître à temps ? » | 52 € ; 26 € pendant 5 min à la première inscription |
| Option | **Mon Dossier notaire** | « Qu’est-ce que j’apporte au rendez-vous ? » | 17 €, facultatif et non précoché |
| Upsell 2 | **Mon simulateur + mon plan adapté** | « Que fait apparaître ma situation et dans quel ordre avancer ? » | 297 € ; 147 € pendant 10 min, puis 197 € pendant 5 min |
| Upsell 3 | **Faire le point sur mon assurance-vie** | « Que prévoit réellement mon contrat aujourd’hui ? » | 67 € |

### Produit 1 et option notaire

Le client reçoit le guide téléchargeable des 7 erreurs. Le Dossier notaire est une
option séparée au checkout : inventaire, fiche famille, pièces, demande de rendez-vous,
compte rendu et exemple rempli. Le guide reste utilisable sans cette option.

### Upsell 2 — Simulateur + plan adapté

Après l’achat, le client arrive directement dans le menu de son espace et peut ouvrir les 7 erreurs sans questionnaire préalable. Le menu présente le bouton **« Obtenir mon plan personnalisé »**. Ce bouton ouvre le questionnaire détaillé ; une fois celui-ci terminé, l’aperçu personnalisé et l’offre limitée apparaissent sur cette nouvelle page.
Le formulaire détaillé recueille l’âge, la situation de couple, les catégories de biens,
les dettes estimées, les personnes susceptibles de recevoir, l’assurance-vie et les
donations connues.

Une fois l’aperçu préparé, les premiers points sensibles apparaissent. L’estimation,
les hypothèses et l’ordre de préparation sont verrouillés jusqu’au paiement. Le compteur
démarre à cet instant : 147 € pendant 10 minutes, 197 € pendant les 5 minutes suivantes,
puis 297 €. Le départ est enregistré côté serveur et ne se réinitialise pas.

Ce produit inclut le simulateur ; il n’existe plus de vente autonome du simulateur.
Le résultat est un plan de préparation adapté aux réponses, pas un « plan parfait »,
un devis notarial ou un conseil fiscal individuel. Les limites et points à faire confirmer
restent visibles.

### Upsell 3 — Assurance-vie

Présenté après la décision sur le simulateur + plan lorsque le client a déclaré un contrat.
Il contient la grille de lecture, la demande d’informations à l’assureur, les repères sur
la clause et les versements, puis le suivi des réponses. Prix : 67 €.

### Ordre du funnel

1. Opt-in puis page de vente/VSL.
2. Achat du guide, avec Dossier notaire facultatif.
3. Six questions obligatoires.
4. Simulation détaillée et aperçu verrouillé.
5. Achat ou refus du Simulateur + plan adapté.
6. Achat ou refus de l’Assurance-vie si pertinent.
7. Livraison de tout ce qui a réellement été acheté.

Correspondance technique : `front`, `bump`, `upsell1`, `upsell2`. Les SKU `pack1`,
`pack2`, `pack3` et `pack4` sont désactivés et réservés à la compatibilité historique.

---

# Archive — ancienne carte produit (ne plus utiliser pour vendre)

> Écrit le 9 septembre 2026. **C'est la source de vérité de l'architecture produit.**
> Tout écran, tout script, tout email qui décrit un produit se règle sur cette page.
> Les prix et la disponibilité restent dans `src/lib/config.ts` ; ici on décide ce que
> chaque produit EST, et ce qu'il n'est pas.

---

## Le problème que cette page résout

Neuf produits étaient vendables, et trois d'entre eux portaient le mot « Dossier ».
Un client qui venait d'acheter **Le Dossier à apporter chez votre notaire** (17 €) et
qui voyait ensuite **Le Dossier complet** (347 €) croyait acheter la version complète
de son dossier. C'est faux : « Le Dossier complet » ne contenait pas le Dossier
notaire — c'était Le Plan et l'Assurance-vie.

Un nom qui trompe sur un catalogue de neuf références n'est pas un détail de style :
c'est la raison pour laquelle personne ne s'y retrouvait.

---

## LA RÈGLE — un produit = une question que le client se pose

Un produit n'existe que s'il répond à une question **que les autres ne traitent pas**.
S'il n'a pas sa question, il n'est pas un produit : c'est une redite payante, et sur
une garantie de 30 jours, une redite payante est un remboursement.

| # | Produit | La question du client, dans ses mots | Prix |
|---|---|---|---|
| 1 | **La Méthode Héritage Intact** | « Combien, et quand ? » | 27 € |
| 2 | **Le Dossier à apporter chez votre notaire** | « Qu'est-ce que j'apporte au rendez-vous ? » | 17 € |
| 3 | **Le Plan adapté à votre famille** | « Dans MA situation, dans quel ordre ? » | 297 € |
| 4 | **Votre assurance-vie, vérifiée en 30 minutes** | « Qu'est-ce qu'il y a dans mon contrat ? » | 97 € |
| 5 | **Le Simulateur personnalisé** | « Et si je fais autrement ? » | 147 € |

Cinq questions. Cinq produits. Aucune ne recouvre l'autre.

Un client peut poser les cinq — dans cet ordre, et jamais dans un autre, parce que
chaque question ne se pose qu'une fois la précédente réglée. C'est ça, l'échelle de
valeur : pas une gamme de tailles, une suite de questions.

---

## Ce que chaque produit est le SEUL à contenir

C'est le test. Si une ligne apparaît deux fois dans ce tableau, un des deux produits
la perd.

### 1 · La Méthode — 27 €
**Elle donne le chiffre, et les trois dates.**
- Le Simulateur de Facture Invisible (papier) → le montant, calculé à la main
- Le Calendrier des 3 dates → les trois échéances personnelles
- Les 8 vidéos : les 7 erreurs et comment chacune se corrige
- Le lexique, les 3 poches, la lettre aux enfants, les 12 questions au notaire,
  le plan en une page, la règle de mise à jour

**Elle est la seule à expliquer les mécanismes.** Abattement, barème, compteur des
15 ans, démembrement, 70 ans, rapport des donations. Tout le vocabulaire du projet
s'installe ici, et nulle part ailleurs.

### 2 · Le Dossier notaire — 17 €
**Il donne les feuilles du rendez-vous.**
- L'inventaire patrimonial (6 rubriques)
- La fiche famille (7 rubriques)
- La check-list des 12 pièces
- Le message de prise de rendez-vous (mail + téléphone)
- Le compte-rendu à remplir en sortant

**Il n'explique aucun mécanisme.** Il explique où écrire. Les deux seules règles qu'il
énonce (les 70 ans, le compteur des 15 ans) le sont parce qu'elles changent ce qu'on
écrit dans une case — jamais pour enseigner.

⚠️ Une partie de ses acheteurs n'a pas La Méthode : c'est un bump. Il ne peut donc
jamais dire « comme on l'a vu ».

### 3 · Le Plan adapté à votre famille — 297 €
**Il donne l'ordre.**
- 12 plans-types, un par situation familiale
- Le tableau de bord familial — qui reçoit quoi, quand, à quel coût
- Les abattements de chacun — la feuille de référence à garder ouverte
- Le calendrier de transmission sur 15 ans
- **Le Simulateur personnalisé, compris** (voir § Le cas du Simulateur)

**Il ne ré-explique rien.** Les trois dates sont les mêmes pour tout le monde : ce
qu'il vend, c'est leur ORDRE, qui change d'une famille à l'autre. C'est la seule
chose qu'un client ne pouvait pas trouver seul.

### 4 · Votre assurance-vie, vérifiée en 30 minutes — 97 €
**Il donne la lecture du contrat.**
- La grille d'audit, notée sur 10
- Les 3 clauses bénéficiaires rédigées et commentées ligne par ligne
- Le tableau de décision « avant / après 70 ans »
- La lettre A (demande d'informations) et la lettre B (modification de clause)

**Il n'enseigne pas les 152 500 € — La Méthode l'a fait.** Il apprend à trouver
quatre informations dans SES papiers à lui : les deux taux de frais, les dates de
versement, et le texte exact de sa clause.

### 5 · Le Simulateur personnalisé — 147 €
**Il donne les scénarios.**
- Le calcul automatique : plusieurs héritiers, plusieurs contrats, donations passées
- Les hypothèses activables une par une, avant/après en direct
- Le dossier notaire pré-rempli, en PDF

**Il ne contient aucun contenu neuf.** Il contient du TEMPS : refaire trois tableurs
à la main pour tester « et si j'attends deux ans ? » est exactement ce qu'il évite.
C'est le seul produit du catalogue dont la valeur est un service, pas un savoir.

---

## Les deux simulateurs ne font PAS le même calcul

> Question posée le 9 septembre 2026 : *« si la Facture Invisible et le Simulateur
> font le même calcul, le client a déjà fait son cas tout seul — et on lui revend
> la même chose. »* La réponse est non, et il faut savoir pourquoi, parce que
> l'impression, elle, était fondée : **rien ne le disait nulle part.**

### Ce que la feuille papier calcule (incluse dans les 27 €)

Six lignes, au stylo, vingt minutes. `simulateur-papier.tsx`.

    A total des biens − B dettes = C la masse
    C ÷ nombre d'enfants = D
    D − 100 000 € = E
    barème ligne directe sur E, puis × nombre d'enfants

**UN seul abattement. UN seul barème.** C'est tout ce qu'elle sait faire — et
c'est juste, pour le cas le plus fréquent : des parents, et leurs enfants.

### Ce que le Simulateur personnalisé calcule en plus (147 €, ou compris dans Le Plan)

`src/lib/simulateur/moteur.ts`. Ce ne sont pas des options de confort : ce sont
des cas où **la feuille donne un chiffre faux**.

| Ce que le moteur traite | Ce que la feuille en fait |
|---|---|
| **Cinq types d'héritiers**, chacun avec son abattement et son barème : enfant 100 000 €, petit-enfant 31 865 €, frère/sœur 15 932 €, neveu 7 967 € puis 55 %, sans lien 1 594 € puis 60 % | Les compte tous comme des enfants |
| **L'enfant du conjoint non adopté** → régime sans lien : 1 594 € et 60 % | Le compte à 100 000 € et 20 % — **plus de 50 000 € d'écart sur une part de 100 000 €** |
| **Le handicap** → +159 325 €, cumulable | Ignore |
| **L'assurance-vie** : 990 I par bénéficiaire (20 % / 31,25 %) ET 757 B global 30 500 €, réinjectée dans l'assiette de chaque héritier | Ignore — la vidéo 0 demande explicitement de la laisser de côté |
| **Les biens en commun**, comptés en entier au second décès | Ignore la distinction |
| **Les trois dates butoir**, calculées depuis l'âge saisi | Le client les écrit à la main |
| **Les hypothèses du calcul**, affichées avec le résultat | Muette |
| **Chaque scénario rejoué instantanément** (« et si j'attends deux ans ? ») | 20 minutes de stylo par hypothèse |

### La conclusion, et ce qu'elle impose

La feuille et le moteur se recouvrent **sur le cas simple, et seulement sur lui**.
Le produit à 147 € ne revend pas le même calcul : il traite les cas où le calcul
simple est faux, et il rejoue les hypothèses.

**Mais l'impression du client était légitime, parce que la feuille ne disait
rien.** Elle rendait un chiffre sans annoncer ce qu'elle avait supposé — donc un
chiffre qu'on ne pouvait pas contredire, donc auquel on ne pouvait pas se fier.

Trois corrections en découlent, et elles sont faites :

1. **`simulateur-papier.tsx` porte désormais un encadré « avant de commencer :
   ce que cette feuille ne calcule pas »**, avec les quatre cas. Il est en tête,
   avant la première ligne à remplir — pas en bas, où il arriverait après vingt
   minutes de calcul faux.
2. **La vidéo 0 les énonce à voix haute**, juste avant que le client remplisse le
   sien. C'est une exigence de justesse, et elle est notée comme telle dans le
   script.
3. **On ne vend rien à cet endroit.** Le client vient de payer 27 €, il n'a rien
   lu. La règle du projet — `Boutique.tsx` — est qu'aucun produit supplémentaire
   n'est proposé avant que l'étape 0 soit ouverte. La vidéo 0 dit la limite et
   renvoie au notaire. Le Simulateur se vend plus tard, ou dans Le Plan.

> **La règle générale que ça pose : un outil qui rend un chiffre doit dire ce
> qu'il a supposé.** C'est déjà ce que fait le moteur — il empile ses hypothèses
> et les sort avec le résultat. Le papier ne le faisait pas ; il le fait
> maintenant.

---

## Le cas du Simulateur — la seule inclusion du catalogue

Le Simulateur personnalisé est vendu 147 €, et il est **compris dans Le Plan**
(297 €). Ce n'est pas une incohérence, c'est un arbitrage tranché :

- qui achète Le Plan l'obtient sans supplément (`INCLUS_DANS.upsell1 = ["backend1"]`) ;
- il ne se vend à 147 € qu'à ceux qui ont **refusé** Le Plan. C'est exactement sa
  fonction : rattraper une valeur sur quelqu'un qui n'a pas voulu payer 297 €.

⚠️ La garde 4 de `ajouter/[sku]/page.tsx` et `possessions()` s'en chargent : personne
ne peut le payer deux fois. **Ne jamais l'annoncer comme un produit à part dans une
page vue par un acheteur du Plan.**

---

## Les packs — offres de tunnel, jamais de catalogue

Quatre SKU n'existent que dans les trois secondes qui suivent la saisie de la carte.
`SKU_TUNNEL_UNIQUEMENT` les empêche d'apparaître dans l'espace membre, et c'est
volontaire : leur remise se justifie par une saisie de carte unique, pas trois mois
plus tard.

| SKU | Contenu | Nom |
|---|---|---|
| `pack1` | Le Plan + L'Assurance-vie | **Le Plan et l'Assurance-vie** |
| `pack2` | Le Plan + Le Dossier notaire | Le Plan, et le Dossier notaire offert |
| `pack3` | Le Plan + L'Assurance-vie + Le Dossier | Le Plan et l'Assurance-vie, avec le Dossier notaire offert |
| `pack4` | L'Assurance-vie + Le Dossier notaire | Votre assurance-vie, et le Dossier notaire offert |

### ⚠️ RENOMMAGE DU 9 SEPTEMBRE 2026 — pack1 et pack3

`pack1` s'appelait **« Le Dossier complet »**, `pack3` **« Le Dossier complet, et le
Dossier notaire offert »**.

Trois produits portaient donc le mot « Dossier », et deux d'entre eux ne contenaient
pas celui que le client venait d'acheter à 17 €. Les nouveaux noms nomment leurs
composants avec les mots que le client connaît déjà — « Le Plan », « l'Assurance-vie »
— et deviennent lisibles sans explication.

**Règle qui en découle, et qui vaut pour tout nom futur : un pack se nomme par ses
composants, jamais par un adjectif.** « Complet », « intégral », « premium » ne disent
rien de ce qu'il y a dedans, et laissent croire qu'ils contiennent le reste.

---

## La matrice anti-répétition

Chaque sujet a **un seul propriétaire**. Ailleurs, on y renvoie — on ne le réexplique
jamais. C'est ce qui fait qu'un client qui achète le quatrième produit apprend encore
quelque chose.

| Sujet | Propriétaire | Ce que les autres ont le droit d'en dire |
|---|---|---|
| Abattement, barème, calcul des droits | Méthode · vidéo 0 | « votre chiffre » — jamais le calcul |
| Le compteur des 15 ans | Méthode · vidéo 1 | « la ligne 1 de votre Calendrier » |
| Régimes matrimoniaux, PACS, 60 % | Méthode · vidéo 2 | le nom du régime, comme une donnée à recopier |
| Le mécanisme 152 500 / 30 500 | Méthode · vidéo 3 | Assurance-vie : où LIRE la date, pas la règle |
| Le démembrement, l'art. 669 | Méthode · vidéo 4 | Plan : à quel rang le faire |
| Le rapport des donations | Méthode · vidéo 5 | Dossier : « la date pèse plus lourd que le montant » |
| Les enveloppes petits-enfants | Méthode · vidéo 6 | Plan : dans quel ordre les ouvrir |
| Le rôle du notaire, les 12 questions | Méthode · vidéo 7 | Dossier : les feuilles, jamais le rôle |
| Remplir l'inventaire et la fiche famille | Dossier notaire | Méthode : « la feuille est dans Le Dossier » |
| L'ORDRE des trois dates par situation | Plan familial | — personne d'autre |
| Les 12 situations familiales | Plan familial | Méthode · vidéo 7 : la grille, sans les plans |
| Lire un contrat, trouver ses 4 infos | Assurance-vie | — personne d'autre |
| Les 3 clauses rédigées et commentées | Assurance-vie | Plan : les modèles, sans le commentaire ligne à ligne |
| Tester une hypothèse en direct | Simulateur | — personne d'autre |

⚠️ **La ligne « 3 clauses bénéficiaires » est la seule qui figure dans deux piles de
valeur** (Le Plan et l'Assurance-vie, à 47 € chacune). Elle n'est livrée qu'une fois,
donc elle n'est encaissée qu'une fois : `REMISE_LIGNE_DUPLIQUEE` dans `prix.ts`, et
c'est ce qui fait que 297 + 50 = 97 + 250 = 347. Aucun ordre d'achat n'est puni.

---

## L'ordre de présentation, et pourquoi il ne bouge pas

`ORDRE_BOUTIQUE` dans `src/lib/espace.ts`. Il suit l'ordre des questions, pas celui
des prix :

1. **Le Dossier notaire** — la question arrive dès l'étape 7 de La Méthode
2. **Le Plan adapté à votre famille** — la question arrive quand il a fini
3. **Votre assurance-vie** — seulement s'il a un contrat
4. **Le Simulateur personnalisé** — seulement s'il n'a pas Le Plan

Un produit épinglé passe devant : c'est celui dont l'étape vient d'être cochée. C'est
le seul moment où l'offre parle vraiment de ce qu'il vient de faire.

---

## Les quatre produits qui n'existent pas encore

`disponible: false`, et ce n'est pas un oubli — rien n'est produit.

| SKU | Nom | Prix |
|---|---|---|
| `backend2` | Perdre son autonomie : décider avant | 97 € |
| `backend3` | Le Classeur Héritage Intact | 67 € |
| `backend4` | Votre testament, écrit sans erreur | 47 € |

Chacun a sa question, et aucune n'est traitée ailleurs : « et si je ne peux plus
décider ? », « où est-ce que je range tout ça ? », « comment j'écris mon testament
sans qu'il soit annulé ? ». Ils entreront au catalogue le jour où ils seront produits,
pas avant.
