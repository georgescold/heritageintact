# 20 — Pricing & TAM : ce que valent nos produits, et pourquoi

> Arbitrage du 6 septembre 2026. Complète `01-strategie.md` § 0.4 (l'échelle de prix) et
> `09-faq/arbitrages.md` § Offre & Pricing (la doctrine).
>
> Question posée : *« à combien peut-on vendre chacun de nos produits par rapport aux avatars,
> et qu'aurait fait Valère ? »*

---

## ═══ 1. LE TAM — et pourquoi ce n'est pas la bonne question ═══

### Le calcul

Deux méthodes indépendantes, parce qu'une seule ne prouve rien.

**Par le stock.** Ménages français dont la personne de référence a 60-79 ans : de l'ordre de
9 millions. Environ **70 % sont propriétaires** de leur résidence principale
([INSEE](https://www.insee.fr/fr/statistiques/7941429?sommaire=7941491), début 2021 : 70,2 % chez
les 65 ans et plus) → ~6,3 M de foyers propriétaires. Parmi eux, la part dont la succession sera
**effectivement taxée en ligne directe est de 24 %**
([Cour des comptes](https://www.ccomptes.fr/sites/default/files/2024-09/20240925-Droits-de-succession%C2%A0_1.pdf))
→ **~1,5 M de foyers.**

**Par le flux.** ~834 000 successions par an en France, dont ~80 % en ligne directe, dont 24 %
taxées → **~160 000 successions taxées par an** entre parents et enfants. Si la fenêtre où l'on
peut encore agir couvre une vingtaine d'années (60-80 ans), le stock de vivants concernés est de
160 000 × 20 ≈ **3,2 M.**

> **TAM ≈ 1,5 à 3 millions de foyers.** Les deux méthodes divergent d'un facteur 2, ce qui est
> normal pour ce genre d'estimation. L'ordre de grandeur, lui, est solide.

### Ce que ça implique

À une LTV de ~100 € par acheteur :

| Part du TAM captée | Acheteurs | CA |
|---|---|---|
| 0,01 % | 150 | 15 000 € |
| 0,1 % | 1 500 | 150 000 € |
| 1 % | 15 000 | 1 500 000 € |

**Le TAM n'est pas la contrainte.** À 0,1 % de pénétration on est déjà à 150 000 € de CA, et
0,1 % n'est pas un objectif ambitieux — c'est un arrondi. Personne dans cette niche ne butera sur
la taille du marché avant plusieurs années.

Le plafond réel est ailleurs : **l'audience joignable sur Meta à un CPA acceptable.** C'est cette
équation-là qui fixe les prix, pas le TAM.

---

## ═══ 2. LA VRAIE CONTRAINTE : l'équation du CPA ═══

Loi n°2 du repo : **LTV ↑, CPA ↓.** Tout le pricing en découle.

### L'équation à tenir

```
Revenu immédiat par acheteur  ≥  CPA
```

Le front doit être **break-even seul** (`01-strategie.md` § 0.4). Ce n'est pas une préférence,
c'est la condition de survie d'un funnel low ticket : si le premier achat ne rembourse pas la
pub, on finance la croissance sur sa trésorerie et on meurt en scalant.

### Le calcul, avec l'échelle actuelle

⚠️ Les taux ci-dessous sont des **hypothèses de travail**, à remplacer par les chiffres réels dès
les 200 premières ventes. C'est la structure du calcul qui compte, pas les valeurs.

| Ligne | Prix | Taux de prise | Revenu / acheteur |
|---|---|---|---|
| Front | 27 € | 100 % | 27,00 € |
| Bump | 17 € | 35 % | 5,95 € |
| Upsell 1 | 197 € | 7 % | 13,79 € |
| Upsell 2 | 97 € | 12 % | 11,64 € |
| **Immédiat** | | | **58,38 €** |
| Backend (4 produits, par email) | 147/97/67/47 € | ~8-10 % chacun | ~31,70 € |
| **LTV** | | | **~90 €** |

Cohérent avec les 95-110 € annoncés dans `01-strategie.md`.

### Les deux nombres à retenir par cœur

```
CPA maximum absolu     ≈  90 €   (au-delà, on perd de l'argent)
CPA cible              ≈  58 €   (le front est break-even le jour même)
```

Avec un coût par lead de 3 € sur une audience 60+ en France, il faut donc convertir
**5,2 % des inscrits en acheteurs** pour tenir le break-even. C'est exigeant mais atteignable
avec la séquence de 7 jours.

> **Le prix du front n'est pas fixé par ce que l'avatar peut payer. Il est fixé par cette
> équation.** C'est la seule ligne de l'échelle où la règle « s'il ne bronche pas, c'est trop
> bas » ne s'applique pas.

---

## ═══ 3. LES RÈGLES DE VALÈRE, APPLIQUÉES ═══

### La seule question qui compte

> **Si je double le prix, est-ce que j'ai deux fois moins de conversions ?**
> Si non → augmente. Et la métrique de décision est l'**EPC**, jamais le taux de conversion seul.

### Le prix se détermine par (`04-produit/formats-offre.md`)

| Critère | Notre cas |
|---|---|
| 1. Le format | Tout DIY → tire les prix vers le bas |
| 2. Le **besoin** du client, pas ton coût | 82 194 € en jeu → tire violemment vers le haut |
| 3. Le **revenu** du client | 650 000 € de patrimoine, 400-600 €/mois d'épargne → peut payer |
| 4. Les concurrents (± 10 %) | 29-76 £ au Royaume-Uni → tire vers le bas |
| 5. Le **ROI** du client | 82 194 € / 197 € = **417×** → tire vers le haut |

Trois critères sur cinq disent « monte ». Deux disent « reste bas ». **Et ce ne sont pas les mêmes
produits qui sont concernés** — c'est tout l'objet de la section suivante.

### Le mid ticket est un piège — en front seulement

```
LOW TICKET     <  100 €
MID TICKET     100 € – 1 000 €     ⚠️ le piège
HIGH TICKET    >  1 000 €
```

Le piège du mid ticket, c'est de le mettre **en front** : trop cher pour l'impulsion, pas assez
pour justifier un appel. La doctrine prescrit exactement notre structure : *« produit d'appel
low ticket (7-27 €) → le 297 € en upsell 1 »*. Notre upsell 1 à 197 € est donc **au bon endroit**,
mais peut-être **au mauvais prix** : la doctrine dit 297, pas 197.

---

## ═══ 4. PRODUIT PAR PRODUIT — le verdict ═══

| Produit | Aujourd'hui | Verdict | Raison |
|---|---|---|---|
| **Front** | 27 € | **Garder** | Fixé par le CPA, pas par la valeur. Aligné sur le seul concurrent qui scale (29 £). |
| **Bump** | 17 € | **Garder** | 63 % du front, dans la norme (30-60 %). Rôle = no-brainer, pas marge. |
| **Upsell 1** | 197 € | ⚠️ **À TESTER À 397 €** | Le test le plus rentable du funnel. Voir § 5. |
| **Upsell 2** | 97 € | **Garder** | Décroissant après l'upsell 1, conforme à la doctrine. |
| **Backend 1** — Générateur de Dossier Notaire | 147 € | ⚠️ **Incohérent** | Appelé « le gros produit » mais moins cher que l'upsell 1. Soit il monte à 297 €, soit il **devient** l'upsell 1. |
| **Backend 2** — Kit Dépendance | 97 € | Garder | |
| **Backend 3** — Classeur | 67 € | **Garder à 67 €** | Devenu un PDF prêt à imprimer. La marge passe de 45 € à 67 €. Voir § 6. |
| **Backend 4** — Kit Testament | 47 € | Garder | |

---

## ═══ 5. LE TEST LE PLUS RENTABLE DU FUNNEL ═══

**Upsell 1 : 197 € contre 397 €.**

C'est la ligne qui porte le plus de revenu par point de taux de prise. Appliquons la question de
Valère :

| Prix | Taux de prise | Revenu / acheteur |
|---|---|---|
| 197 € | 7 % (référence) | 13,79 € |
| 397 € | 3,5 % (**exactement moitié moins**) | 13,90 € — neutre |
| 397 € | 5 % | **19,85 € — +44 %** |
| 397 € | 4 % | 15,88 € — +15 % |

**Le prix double ne coûte que s'il divise le taux par plus de deux.** Et il y a de bonnes raisons
de penser qu'il ne le fera pas :

- L'acheteur vient de payer. C'est le moment de sa plus faible résistance au prix.
- Il a **650 000 €** en jeu et **82 194 €** de facture à éviter.
- Il épargne 400-600 €/mois : 397 € est **moins d'un mois d'épargne**.
- La doctrine le dit elle-même : *« tu t'adresses à quelqu'un prêt à payer 300 € — donc prêt à
  payer 500 ou 800. »*

> **+44 % de revenu immédiat par acheteur, c'est +44 % de CPA supportable.** C'est-à-dire la
> possibilité d'acheter du trafic que les concurrents ne peuvent pas se payer. Aucune autre
> optimisation du funnel n'a ce levier.

⚠️ Se juger sur l'**EPC**, pas sur le taux de prise. Un taux qui baisse pendant que l'EPC monte
est une bonne nouvelle — et en prime, moins de clients à gérer.

---

## ═══ 6. CE QUE VALÈRE AURAIT VU ET QU'ON A RATÉ ═══

### Le besoin de papier est réel — mais on ne vendra rien de physique

> **Décision du 6 septembre 2026 : aucun produit physique.** Ni stock, ni impression à la
> demande, ni expédition. Elle annule la piste « front à 47 € avec classeur posté » qui figurait
> ici dans la première version de ce document.

Le constat de départ reste vrai : l'avatar a 67 ans, **aime le papier**, et le classeur « dans le
tiroir du bureau » est littéralement son rêve (`02-avatar.md`). Ce qui change, c'est la façon de
le satisfaire.

**Le concurrent qui scale le plus fort est déjà 100 % numérique.** My Estate Kit vend 29-76 £ en
PDF et traite la question de front en FAQ : *« Is it a physical product you post to me? »* →
*« Nothing to install, nothing to wait for in the post. »* L'absence d'expédition devient un
argument de **vitesse** (`16-benchmark-marches.md`). C'est exactement le mouvement à faire.

**Le Classeur (backend 3) devient donc un PDF prêt à imprimer, au même prix de 67 €.** Le bilan
est favorable sur tous les axes :

| | Avant (imprimé, expédié) | Après (prêt à imprimer) |
|---|---|---|
| Marge unitaire | ~45 € | **67 €** |
| Délai annoncé | 7-10 jours | **ce soir** |
| Droit de rétractation | 14 jours **non** renonçable | renonçable, comme le reste du catalogue |
| CGV | clauses de livraison et de retour | aucune |
| Logistique | impression, stock, retours | néant |

À 12 % de taux de prise, les 22 € de marge gagnés valent **+2,6 € de profit par acheteur** sur
l'ensemble du funnel. Ce n'est pas énorme, mais c'est gagné sans rien vendre de plus.

**La contrepartie, à ne pas se cacher :** on transfère l'effort d'impression à un homme de 67 ans.
C'est une friction réelle, et elle se paie en mise en page, pas en logistique. Le PDF doit être
imprimable sans réfléchir : A4, recto simple, marges qui survivent à une imprimante domestique,
aucun aplat de couleur qui vide une cartouche, une page 1 « comment imprimer ce classeur » en
trois lignes. **La qualité d'impression est devenue une partie du produit.**

**Une option qui reste ouverte, et qui ne vend rien de physique :** fournir dans le PDF un lien
pré-configuré vers un imprimeur en ligne, pour le client qui préfère payer 8 € plutôt que
d'imprimer. On ne vend pas, on ne stocke pas, on n'expédie pas — on retire une objection. Si le
partenaire verse une commission, c'est de l'affiliation, pas une vente de marchandise.

### Le high ticket est fermé — et c'est la bonne décision

Valère pousserait pour un high ticket : *« funnel 1 = break-even, funnel 2 = l'argent »*. Mais
deux règles du repo l'interdisent ici :

1. **« High ticket avec LP → le numéro de téléphone est obligatoire »** — et le closing
   téléphonique est refusé.
2. Un produit qu'on ne peut pas délivrer se retourne contre soi. Décision assumée de
   septembre 2026.

**L'équivalent sans délivrance existe déjà et il est écrit :** l'**apporteur d'affaires** vers un
CGP ou un notaire (`01-strategie.md` § 0.4, cadre juridique en `11` § 2.1). Un acheteur avec un
dossier prêt vaut 100-300 € à un CGP.

À 10 % des acheteurs transmis à 150 € : **+15 € de LTV par acheteur, sans produire une ligne de
contenu.** C'est le plus gros levier de LTV disponible, et le seul qui ne demande aucune
délivrance. À activer dès que le front tourne.

---

## ═══ 7. CE QU'IL FAUT RETENIR ═══

1. **Le TAM (1,5 à 3 M de foyers) n'est pas la contrainte.** 0,1 % de pénétration = 150 000 € de
   CA. On ne butera pas dessus avant des années.
2. **La contrainte, c'est le CPA.** Deux nombres : 58 € (break-even jour 1), 90 € (LTV totale).
3. **Le front reste à 27 €** — son prix est fixé par le CPA, pas par ce que l'avatar peut payer.
4. **L'upsell 1 doit être testé à 397 €.** C'est le seul test qui peut donner +44 % de CPA
   supportable.
5. **Une incohérence à corriger** : le backend 1 (147 €) est moins cher que l'upsell 1 (197 €)
   alors qu'il est présenté comme le produit majeur. Soit il monte à 297 €, soit il **devient**
   l'upsell 1.
5 bis. **Zéro produit physique** (décision du 6 septembre 2026). Le Classeur devient un PDF prêt
   à imprimer, au même prix : +22 € de marge, aucune logistique, et le délai passe de dix jours à
   ce soir.
6. **Pas de high ticket, mais l'apporteur d'affaires** est son équivalent sans délivrance.

> **Et la règle qui prime sur tout ce document :** aucun de ces prix ne se décide sur un tableur.
> On les tranche à l'EPC, sur les 200 premières ventes.
