# 19 — Le stock d'A/B tests : headlines, sous-titres, et 3 angles de LP

> Tout ce qui est prêt à être testé le jour où le volume le permettra, plus le
> journal de ce qui a déjà été écrit et pourquoi ça a changé. Rien ne se perd.
>
> Écrit le 6 septembre 2026. Ce fichier est un **stock**, pas une feuille de route :
> on y pioche, on n'exécute pas tout.

---

# ═══ 1. QUAND TESTER, ET COMMENT ═══

## L'arithmétique d'abord

Pour départager deux pages il faut **environ 100 conversions par variante**. À 3 € le
lead, c'est 300 € par variante. Trois variantes : 900 €, et deux semaines.

**Conséquence : à 5 €/jour de chauffe, il ne faut rien tester.** Un test sous-alimenté
produit du bruit, on conclut à l'envers, et on tue la meilleure page. Ne pas tester
est une décision, pas une lâcheté.

## L'ordre

| Phase | Volume | Ce qu'on fait |
|---|---|---|
| **1. Maintenant** | < 10 leads/jour | **Aucun test.** Une seule URL — la LP MAX. Tout le budget dessus. On prouve que le funnel convertit et on nourrit le pixel. |
| **2.** | 20-30 leads/jour | **Un seul test à la fois, et on commence par la headline.** C'est le levier le plus fort et le moins cher (`05-funnel/optimisation-checklist.md` § 2). |
| **3.** | 50+ leads/jour | Le sous-titre, puis l'image du hero. |
| **4.** | Volume stable | Les **angles complets** (§ 4 de ce fichier), qui demandent chacun leur propre créative. |

## L'outil

**Surtout pas un ad set par URL.** Les ad sets se chevauchent sur la même audience et
Meta n'optimise pas de la même façon dans chacun : on compare deux choses différentes.

**Ads Manager → Expériences → Test A/B.** Il découpe l'audience sans recoupement, il
est gratuit, il est fait pour ça.

## La métrique

**Jamais le taux d'opt-in seul.** Une page peut collecter plus d'emails et vendre
moins — le questionnaire fait typiquement monter l'opt-in et descendre l'intention.

La seule métrique qui décide : **le chiffre d'affaires par visiteur**. Chaque lead
enregistre sa page d'origine (champ `source` en base, depuis le 5 septembre 2026),
donc on peut remonter du lead jusqu'à l'achat.

---

# ═══ 1 bis. LA VARIANTE D — pourquoi elle existe (6 septembre 2026) ═══

Le tableau de choix de `05-funnel/landing-pages.md` attribue la **LP MAX (#6) au high
ticket**. Or `/` est une LP MAX et vend un produit à **27 €**. Les trois structures
prévues pour le low ticket — #1 courte, #2 classique, #3 forms — ont un point commun
que la MAX n'a pas : **elles prennent l'email en haut de page, avant tout contenu
long, et aucune ne montre la VSL avant.**

`/lp-classique` est la **structure #2, appliquée à la lettre** : headline (bénéfice en
question) → sub-headline (objection levée) → sub-sub-headline (mécanisme en deux
lignes) → formulaire → bouton. Plus les quatre améliorations, plus la disqualification
empruntée à la MAX, plus le pop-up de sortie. Aucune photo : la structure #2 est du
texte et un formulaire.

## Les quatre variantes en piste

| URL | Structure | Ce qu'elle parie |
|---|---|---|
| `/` | #6 MAX | La confiance avant l'email. Long, émotionnel, le formulaire après la preuve. |
| `/lp-courte` | #1 courte + pop-up | Le volume. Un bouton, le formulaire seulement dans le pop-up. |
| `/lp-questions` | #3 forms | La règle des 3 oui. Prévue pour le ciblage très large — c'est le nôtre. |
| `/lp-classique` | #2 classique | Le mécanisme posé en deux lignes, puis l'email tout de suite. |

## Le seuil qui décide, calculé à l'avance

Ce n'est pas le taux d'opt-in. Avec 100 visiteurs :

| | Opt-in | Leads | Lead → acheteur | Acheteurs |
|---|---|---|---|---|
| `/` (page longue) | 20 % | 20 | 5,2 % | **1,04** |
| Page courte | 45 % | 45 | **X** | 45 × X |

Égalité à **X = 2,31 %**. Autrement dit : **la page courte gagne tant que ses leads
convertissent à plus de 2,31 %**, c'est-à-dire tant que la qualité ne chute pas de plus
de 55 %. C'est le nombre à surveiller, et le champ `source` en base permet de le
calculer lead par lead.

## Le repère mobile, mesuré

> *Si le bouton est atteignable sans scroller sur mobile, tu gagnes en conversion.*

| Écran | Bas du bouton | Visible sans scroll |
|---|---|---|
| 375 × 812 (iPhone 11 Pro, 12 mini) | 885 px | non — manque 73 px |
| 390 × 844 (iPhone 14, 15) | 885 px | non — manque 41 px |
| 412 × 915 (Android courant) | 853 px | **oui** |

Les deux champs et la case CGV sont au-dessus de la ligne de flottaison sur les trois.
Sous un bandeau d'urgence de 92 px et un en-tête de 61 px, deux champs à gros
caractères, une case CGV et un bouton font **309 px irréductibles** : aller plus loin
reviendrait à réduire le corps du texte pour un lecteur de 67 ans, ce qui est le
mauvais échange.

**C'est précisément le compromis que la structure #1 résout autrement** : bouton sur la
page, formulaire dans le pop-up. D'où l'intérêt de faire tourner `/lp-courte` contre
`/lp-classique` — le test met un prix sur ce compromis.

---

# ═══ 2. LES HEADLINES À TESTER ═══

> Toutes sont écrites pour la page, pas pour l'annonce. Sur une **créative Meta**,
> il faut les repasser en 1re ou 3e personne (`08-creatives-ads.md`).

## En ligne aujourd'hui — le témoin

> **Vous avez une maison payée et des enfants ?**
> **Si vous ne faites rien, l'État en prendra une part à votre mort.**

Angle : la facture. Qualification + coût de l'inaction dans la proposition principale.
C'est le témoin, on mesure tout contre lui.

## Les challengers

| # | Headline | Angle | Hypothèse |
|---|---|---|---|
| **H1** | *Une maison de province. Les économies d'une vie. L'État en a pris 82 194 €.* | Le fait divers | Le chiffre en premier, sans « vous ». Attaque de brève. Devrait gagner sur trafic froid, où l'interpellation directe met sur la défensive. |
| **H2** | *Votre banque le sait. Votre notaire le sait. Personne ne vous écrira pour vous le dire.* | L'ennemi | Attaque l'ennemi dès la première ligne, au lieu du septième écran. Devrait gagner sur un avatar méfiant de l'institution. |
| **H3** | *Il y a trois dates dans votre vie où votre succession change de prix. Deux sont des anniversaires.* | La curiosité pure | Aucune peur, que du manque. Devrait gagner sur les gens déjà conscients du problème (retargeting). |
| **H4** | *Ce n'est pas l'argent qui fâche les familles. C'est de devoir décider à trois, en six mois, sans savoir ce que vous vouliez.* | Le conflit familial | La peur n°1 de l'avatar féminin (`02-avatar.md`, Martine). Devrait gagner sur audience femmes 65+. |
| **H5** | *Jusqu'au 31 décembre 2026, vous pouvez donner 100 000 € à votre enfant sans un centime de droits. Après, non.* | La date | Urgence pure, format actualité. Devrait gagner sur le dernier trimestre 2026, et mourir le 1er janvier. |
| **H6** | *L'héritier n°1 de la plupart des familles françaises, c'est l'État.* | Le contrariant | Déjà en ligne sur `/lp-courte`. Impersonnel, donc transposable tel quel en annonce. |
| **H7** | *Vos enfants paieront la facture. La question, c'est avec quel argent.* | La question sans issue | Ferme les échappatoires au lieu d'annoncer un montant. |
| **H8** | *Un testament dit qui reçoit quoi. Il ne fait pas baisser la facture d'un centime.* | Le malentendu | Frappe ceux qui croient avoir déjà réglé la question. Le plus gros segment « faussement rassuré ». |

## Comment lire un résultat

Une headline ne gagne pas « en général » : elle gagne **sur une audience et à un
moment**. H5 sera imbattable en novembre 2026 et nulle en février 2027. H3 gagnera
en retargeting et perdra en froid. Noter l'audience à côté du résultat, toujours.

---

# ═══ 3. LES SOUS-TITRES À TESTER ═══

## En ligne aujourd'hui

> Sur une maison de province et les économies d'une vie, cette part est de **82 194 €**.
> Trois décisions, **prises dès maintenant et de votre vivant**, la ramènent à
> **0 €** — sans que vous vous sépariez de quoi que ce soit.

Structure : le chiffre, le contre-chiffre, l'objection majeure levée.

## Les challengers

| # | Sous-titre | Ce qu'il privilégie |
|---|---|---|
| **S1** | *82 194 € ou 0 €. Le même patrimoine, la même famille, la même loi. La seule différence tient à trois décisions, et au moment où on les prend.* | Le contraste pur. Plus court, plus frappant, mais ne lève aucune objection. |
| **S2** | *Vous ne donnez rien, vous ne vendez rien, vous ne quittez pas votre maison. Vous décidez simplement, de votre vivant, de ce qui se passera après.* | L'objection d'abord. Pour une audience qui décroche sur « donation = je me dépouille ». |
| **S3** | *Trois décisions, écrites dans le Code général des impôts, que les familles averties prennent de leur vivant. Une vidéo de 9 minutes vous dit lesquelles.* | L'autorité et la promesse. Le plus sobre, le plus « service public ». |
| **S4** | *Ce n'est pas la loi qui coûte cher. C'est de la découvrir six mois après le décès, quand plus rien n'est possible.* | Le coût du moment. Reprend la thèse de la page en une ligne. |

---

# ═══ 4. TROIS ANGLES DE LP COMPLETS ═══

> Chacun est un **funnel entier**, pas un habillage : sa propre headline, son propre
> avatar dominant, sa propre image déclencheur, ses propres créatives. On n'en lance
> un que quand le précédent a un CPA connu.
>
> Le squelette CEO ne change jamais (`03-marketing-copy/structure-ceo.md`). Ce qui
> change, c'est **quel bloc devient dominant**.

---

## ▸ ANGLE B — « LA TABLE » (le conflit familial)

**En une phrase :** ce n'est pas l'État le problème, ce sont vos trois enfants autour
d'une table, en six mois, sans instructions.

**À qui :** l'avatar **Martine** (`02-avatar.md`, avatar secondaire). Femmes 65-78,
veuves ou mariées, plusieurs enfants, souvent une famille recomposée ou un enfant
divorcé. Sa peur n°1 n'est pas le fisc, c'est le conflit.

**URL :** `/famille`

**Headline**
> Ce n'est pas l'argent qui fâche les familles.
> C'est de devoir décider à trois, en six mois, sans savoir ce que vous vouliez.

**Sous-titre**
> La maison de vacances, le studio, le contrat de la banque : ce qui se règle en une
> après-midi de votre vivant se règle en dix-huit mois et trois avocats après.

**Le hook du hero :** pas un montant. **Une durée et un nombre de personnes.**
*« 3 enfants. 6 mois. 1 seule maison de vacances. »*

**Ce qui devient dominant :** le bloc PEUR et le bloc RÊVE. Le calcul fiscal passe au
second plan — il reste, mais il n'ouvre plus la page.

**L'image déclencheur :** la table de famille avec une chaise vide (`chaise-vide.jpg`),
puis deux jeux de clés posés côte à côte sur une table — à produire.

**Le mécanisme reformulé :** au lieu de « trois décisions qui divisent la facture »,
**« trois décisions qui font qu'il n'y a plus rien à décider »**.

**Quand il devrait gagner :** audience femmes, et toutes les familles recomposées
(l'abattement beaux-enfants du § 2 de `12-chiffres-succession.md` donne un chiffre
choc à cet angle : 50 440 € contre 0 €).

---

## ▸ ANGLE C — « LE SILENCE » (l'ennemi en headline)

**En une phrase :** tout est public, écrit, légal et gratuit à connaître — et
personne n'est payé pour vous le dire.

**À qui :** l'avatar **Jean-Pierre**, mais son côté méfiant plutôt que son côté
prévoyant. *« Les conseillers sont des vendeurs, les notaires sont chers et lents,
sur internet c'est des arnaques. »* On ne combat pas cette méfiance, on la retourne
contre les institutions.

**URL :** `/personne-ne-vous-le-dira`

**Headline**
> Votre banque le sait. Votre notaire le sait.
> Personne ne vous écrira pour vous le dire.

**Sous-titre**
> Les abattements, les donations, le démembrement : tout est public, écrit, légal, et
> gratuit à connaître. Simplement, aucune administration n'envoie de courrier pour
> prévenir qu'une date approche.

**Le hook du hero :** la **boîte aux lettres** (`boite-aux-lettres.jpg`) en plein
écran. *« Quarante ans de prospectus. Pas une ligne d'avertissement. »*

**Ce qui devient dominant :** le bloc ENNEMI, qui passe du septième écran au premier.
Et la polarisation : *« il y a deux sortes de familles en France »* devient la
promesse, pas une conclusion.

**Ce qui doit être renforcé :** la PREUVE, immédiatement. Un angle conspirationniste
sans preuve tombe dans le complotisme et fait fuir l'avatar. Les articles du CGI
doivent apparaître dans le premier écran.

⚠️ **Le risque de cet angle :** il est le plus facile à faire déraper. Aucune
formulation qui accuse une profession nommément. On dit « ils sont payés pour autre
chose », jamais « ils vous mentent ».

**Quand il devrait gagner :** trafic froid, audience masculine, et tous les gens qui
ont déjà eu une mauvaise expérience bancaire.

---

## ▸ ANGLE D — « LA FENÊTRE » (l'urgence datée)

**En une phrase :** un dispositif exceptionnel ferme le 31 décembre 2026, et presque
personne ne le sait.

**À qui :** tout le monde, mais surtout les parents dont un enfant achète ou rénove.
C'est le segment le plus étroit et le plus chaud.

**URL :** `/31-decembre`

**Headline**
> Jusqu'au 31 décembre 2026, vous pouvez donner 100 000 € à votre enfant sans un
> centime de droits.
> Après, non.

**Sous-titre**
> Le dispositif s'ajoute aux abattements habituels : pour un couple, 463 730 €
> transmissibles au même enfant, sans droits. Il n'a pas été prolongé, et il est
> réservé à un usage précis.

**Le hook du hero :** le **compte à rebours**, en grand, au centre. Pas en bandeau.

**Ce qui devient dominant :** le bloc URGENCE, qui devient la page entière. Format
**advertorial** plutôt que page de vente — le ton d'un article qui informe d'un
changement réglementaire.

**Ce qui change dans la structure :** le RÊVE et l'ÉCHEC se compriment à deux
paragraphes. On passe presque directement à la preuve et au mécanisme.

⚠️ **Cet angle a une date de péremption.** Il meurt le 1er janvier 2027, et il faut
l'assumer : c'est un angle de campagne, pas un angle de fond. Il faut prévoir de
l'éteindre, pas de le réécrire.

**Quand il devrait gagner :** octobre à décembre 2026, très fort. Zéro après.
→ Décision à prendre après le **30 septembre 2026** (rapport d'évaluation au
Parlement, cf. `12-chiffres-succession.md` § 5).

---

## ▸ ANGLE E — « LA FILLE QUI APPELLE » (à garder pour plus tard)

Repéré dans le benchmark américain (`16-benchmark-marches.md` § 3) : *Sarah K., 38 ans*
achète le produit **pour ses parents**.

**Ce n'est pas une variante de LP, c'est un autre avatar**, donc un autre funnel :
autre ciblage (45-55 ans), autre offre (elle achète un cadeau, pas un outil), autre
séquence email, autre objection principale (*« comment j'en parle à mon père sans le
vexer ? »*).

**Headline pressentie**
> Vos parents ont une maison. Personne dans la famille n'a fait le calcul.
> Et ce n'est pas à eux de le faire — c'est à vous d'ouvrir le sujet.

À construire **après** que le funnel principal soit rentable. Noté ici pour ne pas
le perdre.

---

# ═══ 5. JOURNAL DES VERSIONS ═══

> Ce qui a été écrit, mis en ligne, puis changé. Pour ne rien réécrire deux fois et
> ne pas refaire les mêmes erreurs.

| Date | Ce qui a changé | Pourquoi |
|---|---|---|
| 5 sept. | LP 2 classique → **LP 6 MAX** | La structure la plus complète, avec disqualification. |
| 5 sept. | *« Une maison de province. Les économies d'une vie. L'État en a pris 82 194 € »* → **version 2e personne** | Conservée comme **H1** dans le § 2 : c'est le meilleur challenger. La règle Personal Attributes ne concerne que les annonces, pas la page (décision de Loys). |
| 5 sept. | Page remontée sur les **11 blocs CEO** | Le rêve n'était pas en premier et « ce n'est pas votre faute » était totalement absent. |
| 5 sept. | Palette : **une couleur, un rôle** | L'orange servait d'accent ET de bouton, ce qui diluait l'appel à l'action. |
| 6 sept. | **« Méthode des 3 Verrous » retirée de la page** | Un verrou ne veut rien dire sur une succession. ⚠️ Le nom vit encore dans la VSL, les modules, l'offre et les créatives : décision à prendre. |
| 6 sept. | « Les 3 décisions » et « les 3 dates » **fusionnées** | C'était le même trio, raconté deux fois à 3 000 px d'écart sous deux noms. |
| 6 sept. | La méthode **teasée au lieu d'être livrée** | La page donnait les trois décisions en entier : plus aucune raison de laisser une adresse. Une seule est offerte — celle de Martine — comme preuve précoce du bénéfice. |
| 6 sept. | **9 appels à l'action** au lieu de 2 | « Un seul CTA » figure dans l'anatomie d'une mauvaise page. |
| 6 sept. | Audit de cohérence | Deux allégations fausses en ligne : *« rien à payer, ni maintenant ni après »* et *« aucun produit à acheter »*. À relire à chaque refonte. |

## Formulations écartées, à ne pas ressortir

| Écarté | Pourquoi |
|---|---|
| *« Il n'y a rien à payer pour la voir, ni maintenant, ni après »* | Faux : un programme est vendu à la fin de la vidéo. |
| *« Aucun produit à acheter »* | Faux, même raison. Le sens voulu était « aucun produit **financier** ». |
| *« Calculer mon chiffre — gratuit »* | Le simulateur est dans le programme payant. La vidéo **apprend** le calcul. |
| *« Les 3 dates de votre situation, avec votre âge d'aujourd'hui »* | Une vidéo enregistrée ne connaît pas l'âge du spectateur. |
| *« Sophie et Thomas ne se sont pas fâchés »* | Prénoms tirés du dossier avatar, inconnus du lecteur à cet endroit de la page. |
| *« Donner à 69 ans coûte 10 points de moins qu'à 71 »* | Saute l'année des 70 ans. La bascule tombe au 71e anniversaire. |
| Barre de réassurance à 4 puces sous le hero | Générique, ressemble au bandeau de n'importe quelle boutique, occupe le meilleur emplacement sans rien prouver. |

---

## Ce qu'il faut avant tout ça

Un rappel, parce que c'est plus important que n'importe quelle headline de ce
fichier : **la page n'a aucune preuve sociale.** Ni avis, ni témoignage, ni caution
professionnelle. Le concurrent britannique tient sur 318 avis et un praticien
retraité qui met son nom sur la méthode.

Le programme des 10 testeurs (`03-offre-et-mecanisme.md` § 4 bis) et un notaire ou
juriste retraité qui accepte d'être cité valent **plus que les huit headlines
ci-dessus réunies**.
