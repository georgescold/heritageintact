# 21 — État du funnel au 6 septembre 2026

> Le seul document à ouvrir pour savoir **où on en est**. Il répond à une seule
> question : est-ce qu'on peut envoyer du trafic payant aujourd'hui ?
>
> **Réponse : non.** Un bloqueur, un seul, et il est décrit au § 1.

---

# ═══ 1. LE BLOQUEUR — la base de données ═══

Les leads et les commandes vivent dans un fichier JSON (`src/lib/db.ts`). En
local, c'est `./data/db.json` et tout fonctionne. **Sur Vercel, le disque est en
lecture seule sauf `/tmp` — et `/tmp` est éphémère et propre à chaque instance.**

En production, sans base :

| Ce qui se passe | Conséquence |
|---|---|
| Un inscrit est écrit sur l'instance A | L'instance B ne le connaît pas |
| Le cron des emails lit `/tmp` | Il ne voit presque personne |
| Après paiement, la commande n'est pas retrouvée | `/plan-complet` redirige : **la chaîne d'upsells casse** |

**Rien ne plante. Rien ne s'affiche en erreur. Les données disparaissent en
silence.** C'est la pire catégorie de bug — d'où la bannière rouge posée le
6 septembre sur toutes les pages, qui s'éteindra toute seule dès que
`NEXT_PUBLIC_SUPABASE_URL` sera renseignée.

> **Tant que ce point n'est pas réglé, chaque euro de publicité est perdu.**

## ✅ Le code est écrit (6 septembre, fin de journée)

`db.ts` a désormais **deux implémentations derrière les mêmes signatures** :

```
POSTGRES_URL renseignée  →  Postgres      (production)
sinon                    →  data/db.json  (développement local)
```

C'est du **SQL standard**, pas des appels propres à un hébergeur : la même
couche marche avec le Postgres de Vercel, Supabase, Neon, Railway ou une base
auto-hébergée. Les tables se créent toutes seules à la première écriture.

Les huit fonctions ont été testées une par une : création d'inscrit,
idempotence sur l'email, création de commande, ajout d'article idempotent,
passage en payé avec mémorisation de la carte, compteur de fondateurs,
désinscription. Le mode Postgres corrige au passage deux courses que le mode
fichier avait : le get-or-create est atomique, et l'ajout d'un article ne peut
plus doubler sur un double clic.

## ⚠️ Ce qu'il reste — et ça ne prend que deux minutes

**Créer la base.** Je ne peux pas le faire : le token Vercel fourni est
restreint au projet (403 sur les intégrations), et le Postgres first-party de
Vercel est retiré (`410 gone`) — le stockage passe maintenant par le
Marketplace.

1. Vercel → le projet `heritageintact` → onglet **Storage** → **Create Database**
2. Choisir **Neon** (Postgres, offre gratuite) ou **Supabase**
3. Le connecter au projet : `POSTGRES_URL` est injectée automatiquement
4. Redéployer

À la première inscription, les tables se créent seules et la bannière rouge
s'éteint. **Aucun code à toucher.**

---

# ═══ 2. CE QUI EST FAIT ET VÉRIFIÉ ═══

## Le parcours, dans l'ordre

```
ADS → /  (landing page, structure #2)          l'email
   → /methode  (page de vente + récit CEO)     la vente
   → /commande  (front 27 € + bump 17 €)       le paiement
   → /plan-complet  (upsell 1, 297 €)          un clic, sans ressaisir la carte
   → /kit-assurance-vie  (upsell 2, 97 €)      un clic
   → /merci
        │
        └→ séquence 7 jours, puis 4 backends par email
```

| Étape | État | Vérifié comment |
|---|---|---|
| Landing page `/` | ✅ | 4,5 écrans mobile, bouton à 885 px, 2 formulaires |
| Variante `/lp-questions` | ✅ | structure #3, la seule challenger conservée |
| Page de vente `/methode` | ✅ | 11 blocs CEO dans l'ordre, 12 boutons vers `/commande`, 0 lien mort |
| Bon de commande | ✅ | bump pré-coché, urgence au-dessus du formulaire, garantie, FAQ, pop-up de sortie |
| Paiement Stripe | ✅ | testé sur l'API réelle, clés de test |
| Chaîne d'upsells | ✅ | accepter **et** refuser mènent tous deux à l'étape suivante |
| Emails (Resend) | ✅ | `pnpm emails:verifier` passe au vert sur le domaine racine |
| DNS délivrabilité | ✅ | SPF, DKIM, DMARC, MX de retour sur les deux domaines |
| Pages légales | ✅ | CGV, confidentialité, mentions — les prix sont lus depuis `config.ts` |
| Désinscription | ✅ | un clic, sans bouton, en-têtes `List-Unsubscribe` |

## Les prix

| | Prix | Ancrage | Note |
|---|---|---|---|
| Front | 27 € | 67 € | Ne bouge pas — voir `20-pricing-et-tam.md` § 5 bis |
| Bump | 17 € | 47 € | Pré-coché. À tester à 27 € **après** l'upsell 1 |
| Upsell 1 | **297 €** | 497 € | Test de prix en cours (197 → 297) |
| Upsell 2 | 97 € | 197 € | Décroissant, conforme |

---

# ═══ 3. CE QUI MANQUE, PAR ORDRE D'URGENCE ═══

## Bloquant — rien ne peut être lancé avant

- [ ] **Créer la base** (§ 1). Trois clics dans Vercel → Storage. Le code est prêt.
- [ ] **Révoquer les cinq clés exposées** : Stripe live, Stripe test, fal.ai,
      Resend, et le token Vercel. Elles ont toutes transité par une conversation.
- [x] ~~Variables d'environnement Vercel~~ — **fait le 6 septembre.**
      `RESEND_API_KEY`, `EMAIL_FROM` et `CRON_SECRET` posées ; et
      `NEXT_PUBLIC_SITE_URL`, qui existait avec une valeur **vide**, corrigée.
      Elle méritait mieux qu'une case à cocher : `??` ne rattrape que
      `undefined`, donc `SITE_URL` valait `""` en production et **tous les
      liens des emails partaient en relatif**, inutilisables dans une boîte de
      réception. Le code utilise maintenant `||`.
- [ ] Les clés **Stripe** restent à poser, après rotation. Sans elles le site
      reste en paiement simulé — ce qui est l'état sûr tant qu'il n'ouvre pas.
- [ ] **Le webhook Stripe** : créer l'endpoint et coller `STRIPE_WEBHOOK_SECRET`.

## Le contenu qui manque

- [ ] **La VSL.** Un cadre de remplacement s'affiche à sa place (bouton lecture,
      titre, durée, mention « vidéo à intégrer »). Le funnel se parcourt
      entièrement sans elle, mais **il ne vendra pas** : c'est elle qui vend.
      Script prêt dans `05-vsl-front.md`.
- [ ] Les 4 VSL backend (`07-vsl-backend.md`), et leurs pages `/generateur`,
      `/dependance`, `/classeur`, `/testament`.
- [ ] Le produit lui-même : 8 modules, simulateur, calendrier
      (`04-produit-mvp.md`).
- [ ] **Les 12 créatives** (`08-creatives-ads.md`).

## La preuve sociale — le plus gros manque marketing

Aucun témoignage réel. Le concurrent qui scale le plus fort affiche une caution
professionnelle nommée ; nous n'avons rien. Deux chantiers :

- [ ] Le programme bêta à 10 testeurs, avec accord écrit
- [ ] Un notaire ou juriste retraité, nommé, qui accepte de cautionner

## Une fois ouvert

- [ ] **Vendre sur `/merci`.** *« Il y a du trafic, donc il y a de la vente. »*
      Elle ne propose rien — mais le premier backend n'a pas encore de page.
- [ ] Sous-domaine d'envoi `info.heritageintact.fr` : le DNS est complet, il
      manque une clé Resend autorisée sur tous les domaines.
- [ ] DMARC racine à durcir en `p=quarantine` après quelques semaines.
- [ ] Re-vérifier l'article 790 A bis **après le 30 septembre 2026** : un
      rapport au Parlement décide de la prorogation. Si le dispositif tombe, le
      compteur du bandeau devient faux.

---

# ═══ 4. LE JOURNAL DES DÉCISIONS ═══

| Date | Décision | Où c'est écrit |
|---|---|---|
| 4 sept. | Marque éditoriale, pas de gourou. Jamais de « je » biographique | `01-strategie.md` |
| 4 sept. | Pas de high ticket : on ne vend pas ce qu'on ne peut pas délivrer | `01-strategie.md` § 0.4 |
| 5 sept. | Registre visuel emprunté à l'administration, jamais son identité | `15-identite-visuelle.md` |
| 5 sept. | Copy en 2ᵉ personne sur la LP, 3ᵉ personne sur les créatives Meta | `11-legal-et-compliance.md` |
| 6 sept. | Dutreil 4 → 6 ans, frais de notaire, art. 788 III bis | `12-chiffres-succession.md` |
| 6 sept. | `fal-ai/flux-2-pro` pour toutes les images | `15-identite-visuelle.md` |
| 6 sept. | **Aucun produit physique.** Le Classeur devient un PDF prêt à imprimer | `16-benchmark-marches.md` § 6 |
| 6 sept. | **Le funnel remis dans l'ordre** : la LP prend l'email, la page de vente vend | `06-pages-funnel.md` |
| 6 sept. | 4 landing pages → 2 | `06-pages-funnel.md` |
| 6 sept. | **Upsell 1 : 197 → 297 €.** Front et bump ne suivent pas | `20-pricing-et-tam.md` § 5 bis |
| 6 sept. | Ordre des tests : upsell 1, puis bump, puis front. Une variable à la fois | `20-pricing-et-tam.md` § 5 bis |

---

# ═══ 5. LES COMMANDES UTILES ═══

```bash
pnpm dev                  # le site en local
pnpm run build            # vérifie que tout compile
pnpm run lint             # eslint
pnpm format:check         # prettier, largeur 100
pnpm emails:verifier      # DNS + permission réelle de la clé Resend
python strategie/assets/generer-visuels.py martine   # refaire une image
```

---

# ═══ 6. LA RÉPONSE COURTE ═══

**Le funnel est complet et se parcourt de bout en bout. Il n'est pas ouvrable.**

Il manque deux choses, et une seule est technique :

1. **La base de données.** Une demi-journée. Sans elle, les leads se perdent.
2. **La VSL.** C'est elle qui vend ; tout le reste ne fait que l'amener.

Le jour où ces deux-là sont là, le reste de la liste devient de
l'optimisation — c'est-à-dire du travail sans fin, mais du travail rentable.
