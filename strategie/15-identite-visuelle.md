# 15 — Identité visuelle & Page Facebook

> **Décision du 4 septembre 2026 : aucun visage, ni le tien, ni un acteur, ni une IA.**
> Héritage Intact est une marque **éditoriale et documentaire**, pas une marque personnelle.
>
> C'est un meilleur positionnement qu'il n'y paraît. Un avatar de 60+ fait davantage confiance à
> une source qui ressemble à un magazine ou à un service public qu'à un individu qui se met en
> avant. Ça élimine aussi le cliché de la photo de banque d'images et le malaise de l'IA.
> → `11-legal-et-compliance.md` pour le volet juridique.
>
> ⚠️ **Pas de dépôt de marque à l'INPI tant que le funnel n'est pas rentable.** Ne jamais écrire
> « marque déposée » ni ®.

---

## Le principe directeur : l'image déclencheur

**Personne ne like une plaque d'entreprise.** Mais on n'a pas besoin d'un visage pour déclencher
une émotion. Ce qui arrête le pouce d'un homme de 60 ans, c'est une **scène qu'il reconnaît** :

```
❌ Une affiche : fond uni, une phrase centrée, un logo
✅ Une scène qui raconte la peur ou le rêve, sans un mot, + le chiffre posé dessous
```

Les cinq scènes qui portent tout le projet :

| Scène | Ce qu'elle déclenche | Sert à |
|---|---|---|
| **Une maison de famille avec un panneau À VENDRE** | La peur centrale : les enfants obligés de vendre | Le visuel n°1 du projet |
| **Des mains âgées tenant des clés** | La transmission, la main qui passe le relais | Le rêve, les donations |
| **Une lettre officielle et des lunettes sur une table** | Le courrier du notaire, la facture qui tombe | Les 38 389 €, l'ouverture |
| **Une chaise vide à une table de famille** | L'absence, ce qui reste après | La succession, l'urgence |
| **Un calendrier avec une date entourée** | Le compte à rebours, les 3 dates | Le compteur des 15 ans, les 70 ans |

Aucune ne montre de visage. Toutes racontent quelque chose. C'est le langage visuel du direct
response classique, et c'est celui qui marche le mieux sur cette cible.

### La règle « sans visage » ne veut pas dire « sans personne »

Mise au point du 5 septembre 2026. Deux photos du site montrent maintenant des gens : Jean-Pierre
de dos à sa table, un grand-père et un enfant de dos dans un jardin. **Vus de dos, jamais de
face.** On garde la présence humaine, qui est ce qui déclenche l'émotion, sans jamais fabriquer un
visage.

> ⚠️ **Le modèle ignore régulièrement la consigne « pas de visage ».** La première version
> de Martine, demandée « vue de dos », est revenue de face, tête baissée, visage entièrement
> lisible. Il a fallu imposer le point de vue plutôt que l'absence : *« shot STRICTLY FROM
> BEHIND, the camera stands directly behind her chair »*, puis énumérer ce qui ne doit pas
> apparaître — ni profil, ni joue, ni œil, ni nez, ni bouche, ni menton. **Toujours regarder
> l'image avant de la mettre en ligne.**

**La ligne à ne pas franchir n'est pas le visage, c'est la légende.** Une photo légendée
« Jean-Pierre, 67 ans » comme *cas type* est du récit, et c'est du direct response classique. La
même photo légendée avec des guillemets et cinq étoiles serait un faux avis client : trompeur au
sens de l'article L121-2 du code de la consommation, et le genre de chose qui se retourne
publiquement contre une marque. Chaque photo de personne porte donc sa mention
« cas type, reconstitué ».

Le jour où les 10 testeurs du programme bêta (`03-offre-et-mecanisme.md` § 4 bis) auront donné
leur accord écrit, on remplace : vrais prénoms, vrais âges, vrais départements, vraies photos.
Ce bloc sera alors deux fois plus fort — et il sera vrai.

---

# ═══ 1. PRODUIRE LES IMAGES ═══

> **Mise à jour du 5 septembre 2026.** Les images ne sont plus générées à la main dans Affinity
> mais par un script, avec **fal.ai**. Trois raisons : c'est reproductible à l'identique, les
> prompts sont versionnés avec le reste du projet, et une régénération complète prend deux
> minutes au lieu d'une soirée.
>
> **Mise à jour du 6 septembre 2026 — changement de modèle.** On passe de `flux-pro/v1.1-ultra`
> à **`fal-ai/flux-2-pro`**. À prompt égal il rend des intérieurs nettement plus crédibles
> (matière des tissus, désordre plausible d'une table, lumière de fenêtre) et il tient beaucoup
> mieux une contrainte de cadrage — ce qui est vital ici, où la moitié des prompts exige qu'aucun
> visage ne soit visible. Il ne prend pas `aspect_ratio` mais `image_size: {width, height}` ;
> le script traduit les ratios en pixels, grand côté à 1536 px.
>
> Les images déjà validées n'ont pas été régénérées : **seule `martine.jpg` a été refaite** avec
> le nouveau modèle. Tout ce qui sera produit à partir d'ici l'est avec `flux-2-pro`.

## Le script

`assets/generer-visuels.py` — un dictionnaire de prompts, un appel par visuel, deux copies
enregistrées : le master dans `assets/`, la version web redimensionnée dans `site/public/img/`.

```bash
cd PROJET-HERITAGE-INTACT/assets
python generer-visuels.py                  # tout
python generer-visuels.py lettre-notaire   # un seul
```

La clé `FAL_KEY` est lue dans `site/.env.local`, jamais écrite en dur, jamais commitée.
Sans argument, le script ne génère **que ce qui manque** : régénérer un visuel déjà validé se
demande par son nom. Un lancement distrait coûtait douze images et en changeait une que le
client avait approuvée.

### Les deux queues de mots

Chaque prompt se termine par `PROPRE` — `no text, no letters, no numbers, no logos, no
watermark` — qui évite les textes illisibles gravés dans l'image.

Les prompts où quelqu'un est présent ajoutent `SANS_VISAGE`. Et c'est là qu'est la leçon la
plus chère du projet : **demander « pas de visage » ne marche pas**, le modèle entend
« visage » et en dessine un. Ce qui marche, c'est d'imposer la position de la caméra —
« the camera stands directly behind her chair » — *puis* d'énumérer ce qui ne doit pas
apparaître (profil, joue, œil, reflet). Les prompts sont écrits comme ça, il faut le garder.

### Deuxième leçon : décrire chaque personne, une par une

Le prompt du bloc RÊVE disait « an elderly man … holding the hand of a small child ». Le modèle
a produit **deux vieux messieurs** et un enfant. Rien dans la phrase ne l'en empêchait : une
seule personne était décrite, il l'a dupliquée pour remplir la scène.

Le prompt nomme désormais le couple explicitement — *« an elderly married couple in their
seventies — a man in a pale short-sleeved shirt on the left and his wife in a light summer
blouse on the right »* — avec la place de chacun dans le cadre. **Une personne = une
description = une place.**

### Troisième leçon : cadrer pour le texte qui viendra dessus

Trois des visuels portent un titre par-dessus. Le prompt doit donc réserver la place : *« the
three figures are placed to the right of centre; the left third of the frame is open garden and
shadow »*. Sans cette phrase, le modèle centre le sujet et la phrase se pose sur un visage.

## Les douze visuels du projet

| Fichier | Scène | Où il sert |
|---|---|---|
| `lettre-notaire.jpg` | Une lettre officielle, des lunettes, un stylo sur bois sombre | **Le hero de la LP.** La zone de papier vierge accueille le texte |
| `maison-a-vendre.jpg` | Le pavillon aux volets fermés, panneau planté devant | La peur centrale, bandeau pleine largeur |
| `avant-desordre.jpg` | La table couverte de courriers en désordre | Le volet « sans plan » de l'avant/après |
| `apres-classeur.jpg` | La même table, un classeur bleu marine fermé | Le volet « avec un plan ». La couverture vierge sert aussi de mockup produit |
| `mains-cles.jpg` | Des mains âgées transmettant un trousseau | Le rêve, la transmission |
| `calendrier.jpg` | Un calendrier mural, une date entourée au stylo rouge | Les 3 dates, et le bandeau du 31 décembre 2026 |
| `chaise-vide.jpg` | Une chaise vide au bout d'une table de famille | Le hero de la variante `/lp-courte` |
| `boite-aux-lettres.jpg` | Une boîte aux lettres débordant de prospectus | Le bloc ENNEMI — quarante ans de courrier, pas une ligne d'avertissement |
| `enfant-qui-gere.jpg` | Une personne de dos, au téléphone, la nuit, devant une pile | « Ils se débrouilleront bien » — le seul endroit où le lecteur voit la scène du côté de ses enfants |
| `martine.jpg` | Une femme âgée de dos, droite et immobile, la main posée à plat sur un dossier de succession ouvert | **Le coût de l'inaction** — Martine, 71 ans |
| `jean-pierre.jpg` | Un homme âgé de dos, seul à sa table, une lettre ouverte | **Le bloc « ce n'est pas votre faute »** — le personnage a un prénom, un âge, une ville |
| `grand-pere-petits-enfants.jpg` | Un couple âgé et leur petit-enfant de dos, main dans la main, marchant vers la maison à l'heure dorée | **Le bloc RÊVE**, en ouverture de page |

## Le voile : directionnel, jamais uniforme

Une photo qui porte du texte a besoin d'un voile sombre derrière la phrase. Le premier voile du
site (`.scrim`) était **uniforme, à 72–90 % d'opacité** sur toute la surface. Résultat : le bloc
RÊVE, photographié à l'heure dorée, arrivait à l'écran comme une scène de nuit. On payait une
image pour son émotion et on l'éteignait en CSS.

`.scrim-left` assombrit **seulement la moitié où le texte se pose** et rend la droite à la
photo. Au-dessus de 640 px seulement : sur téléphone le titre occupe toute la largeur, donc le
voile y reste uniforme — mais allégé à 66–86 %.

`.text-on-photo` ajoute une ombre portée sous le titre. Elle ne se voit pas ; elle sert au cas
où le recadrage fait glisser la phrase sur une chemise claire.

> À faire : les cinq autres bannières photo du site utilisent encore `.scrim`. Le même
> traitement leur profiterait, chacune est à vérifier séparément.

## Le texte se pose toujours par-dessus, jamais dans le prompt

Le panneau « À VENDRE » de `maison-a-vendre.jpg` est **gravé après coup**, en Python, sur le
panneau laissé vierge par le modèle. C'est fait dans le master, pas en CSS : une superposition
CSS se décale dès que la photo est recadrée, alors qu'une image gravée survit à tous les cadrages.
Même principe pour les créatives : le chiffre et la phrase se posent dans Affinity.

---

# ═══ 2. LE SYSTÈME VISUEL ═══

## La charte

| Élément | Valeur |
|---|---|
| Bleu foncé | `#12365E` — titres, bandeaux, logo |
| Orange | `#E8730C` — accent, chiffres, boutons |
| Gris de fond | `#F0F3F6` |
| Texte | `#222222` |
| Police | **Arial**, partout, sans exception |

Trois règles non négociables sur cet avatar : **gros caractères**, **contraste fort**, **zéro
fioriture**. Pas de dégradé, pas d'ombre portée, pas de police fantaisie.

## Le gabarit des visuels carrés (posts et créas)

```
┌──────────────────────────────┐
│                              │
│   L'IMAGE DÉCLENCHEUR        │  ← 70 % de la hauteur
│   en plein cadre             │
│                              │
├──────────────────────────────┤  ← filet orange, 8 px
│  LE CHIFFRE, énorme, blanc   │
│  sur bandeau bleu marine     │  ← 40 %
│  la phrase, plus petite      │
│  HÉRITAGE INTACT ─ petit     │
└──────────────────────────────┘
```

Variante quand la photo a du vide sur un côté : le texte se pose **directement sur la photo**, dans
la zone vide, en blanc avec un voile sombre derrière pour la lisibilité. C'est le format qui
performe le mieux sur cette tranche d'âge, parce que c'est celui qu'ils consomment toute la journée.

## Le logo

**Dessiné en SVG**, pas généré : un logo doit rester net à 24 px dans un onglet comme à 400 px sur
une couverture, et les modèles d'images écrivent mal. Source : `site/src/components/Logo.tsx`,
plus `site/src/app/icon.svg` pour l'onglet du navigateur.

**Le symbole** : un toit posé sur trois barres — les 3 Verrous qui protègent la maison. La barre
du milieu est orange, c'est le seul accent de la marque. Il se lit encore à 16 px, ce qui était
la contrainte.

**Le nom** : HÉRITAGE en blanc (ou bleu marine sur fond clair), filet orange, INTACT en orange.
Trois variantes exportées par le composant : `Mark` (symbole seul, pour les favicons et les coins
de créative), `Logo` (fond clair), `LogoInverse` (fond sombre).

Sans visage, c'est le logo qui porte toute la reconnaissance de la marque : il doit être partout,
toujours identique, jamais retouché.

## La photo de couverture (1640 × 624)

L'image « mains et clés » sur la moitié droite, bandeau bleu marine sur la gauche avec le logo et
la phrase :

> **Transmettre intact ce que vous avez construit.**
> La succession expliquée en français simple.

⚠️ Facebook rogne fortement sur mobile : tout ce qui compte doit tenir dans le tiers central.

---

# ═══ 3. LES 8 POSTS AVANT LA PREMIÈRE PUB ═══

Le robot Meta regarde la Page avant d'approuver les publicités. Une page vide est un signal de
compte jetable. **Un post par jour jusqu'au lancement.**

Chaque post = une image déclencheur + le chiffre + la phrase. L'image tourne parmi les cinq scènes, jamais deux fois de suite la même.

| # | Le chiffre | La phrase | La légende |
|---|---|---|---|
| 1 | **100 000 €** | par parent et par enfant, tous les 15 ans | Ce que la loi permet de transmettre sans impôt, et que la plupart des familles n'utilisent qu'une seule fois. |
| 2 | **60 %** | de droits entre concubins | Trente ans de vie commune sans mariage ni PACS. Au décès de l'un, l'autre paie 60 % sur sa part. Un PACS et un testament coûtent quelques centaines d'euros. |
| 3 | **70 ans** | la date qui change tout en assurance-vie | Avant cet anniversaire : 152 500 € par bénéficiaire sans droits. Après : 30 500 € pour tous réunis. La même somme, le même contrat. |
| 4 | **15 932 €** | et on passe déjà à 20 % | Le seuil, au-dessus de la franchise, où le barème atteint 20 %. Une maison de province suffit à le dépasser. |
| 5 | **2012** | l'année où les abattements ont cessé d'être revalorisés | Depuis, le prix des maisons a beaucoup augmenté. Les familles qui se croyaient « moyennes » basculent dans les tranches hautes. |
| 6 | **6 mois** | pour payer les droits de succession | Le délai légal après le décès. C'est ce qui oblige certaines familles à vendre la maison dans l'urgence. |
| 7 | **60 % ou 70 %** | selon que vous avez 69 ou 71 ans | La valeur retenue quand on transmet les murs d'une maison en gardant le droit d'y vivre. Dix points d'écart, pour un anniversaire. |
| 8 | **31 865 €** | par grand-parent et par petit-enfant | La franchise dont presque personne ne parle. De quoi participer à un premier appartement, et le voir de son vivant. |

Signature commune sous chaque légende :

> Héritage Intact. La succession expliquée en français simple.
> Source : impots.gouv.fr

⚠️ **Vérifie chaque chiffre avant de publier** (`14-guide-etude.md`). Un chiffre faux sur la Page,
c'est ta crédibilité, et sur cette niche les commentaires te corrigent en public.

⚠️ **Aucun post ne s'adresse à un attribut personnel.** On énonce un fait général, jamais « vous
avez plus de 60 ans » ni « vous êtes propriétaire » (`11-legal-et-compliance.md`).

---

# ═══ 4. LA CAMPAGNE DE CHAUFFE ═══

**L'ordre à respecter, sans exception :**

```
1. Photo de profil + couverture          ← la Page ne doit pas être vide
2. 3 ou 4 posts publiés
3. SEULEMENT ENSUITE : chauffe à 5 €/jour, objectif Mentions J'aime
```

Créative de chauffe : **l'image « mains et clés »** avec une phrase simple posée dessus, du type
« La succession expliquée en français simple ». Aucune promesse, aucun chiffre, aucun attribut
personnel : sur un compte neuf, la créative de chauffe doit être inattaquable. Son seul travail est
de dépenser proprement et de construire de l'historique.

C'est la plus chaleureuse des cinq scènes, et la seule qui évoque le rêve plutôt que la peur. C'est
celle qui fait liker.

---

# ═══ 5. LES INFORMATIONS DE LA PAGE ═══

| Champ | Quoi mettre |
|---|---|
| Nom | Héritage Intact |
| Catégorie | **Site web éducatif** (surtout pas « Service financier » : ça déclenche la vérification annonceur de Meta) |
| Bio | Transmettre intact ce que vous avez construit. La succession expliquée en français simple. |
| Site web | https://heritageintact.fr |
| Email | contact@heritageintact.fr |
| À propos | Héritage Intact explique, en français simple et avec les articles de loi à l'appui, comment les familles transmettent ce qu'elles ont construit. Contenu pédagogique, qui ne constitue pas un conseil personnalisé. |

---

# ═══ 6. LES PDF (gabarit établi) ═══

Le premier document est fait : **Le Lexique en 1 page** (`assets/Heritage-Intact-Lexique.pdf`).
Il fixe le gabarit de tous les autres.

```
Bandeau bleu marine en haut, coins droits
  ├─ HÉRITAGE INTACT      Arial Bold 13 pt, orange
  └─ Titre du document    Arial Bold 40 pt, blanc
Filet orange de 16 px
Chapô                     Arial 12 pt, gris
Contenu                   Arial 10,5 pt. Termes en Arial Bold bleu.
Pied de page              Arial 8 pt, gris : le disclaimer + heritageintact.fr
A4, 300 dpi, marges 180 px, export « PDF (pour impression) »
```

Les autres suivront **une fois les chiffres vérifiés** : les 12 questions au notaire, la lettre aux
enfants, la règle de mise à jour, la fiche « combien garder pour soi », le Calendrier des 3 Dates,
le Plan en 1 Page.
