# HÉRITAGE INTACT — Plan de route

> Projet : infoproduit **transmission de patrimoine / succession** pour les 60+ en France.
> Marque : **Héritage Intact**. Mécanisme nommé : **La Méthode des 3 Verrous**.
> Ce dossier applique `06-process/PROCESS-MAITRE.md` de A à Z. Chaque fichier = un livrable de phase.

---

## Le funnel en une image

```
META ADS (1:1, sous-titré, 12 créatives / 3 angles)
   │
   ▼
LANDING PAGE ── email ──► VSL FRONT (9 min)
                              │
                              ▼
                    BON DE COMMANDE  27 €   "Les 7 Erreurs"
                      + BUMP        17 €   "Le Dossier Notaire"  (pré-coché)
                              │
                              ▼
                    UPSELL 1       197 €   "Le Plan Transmission Complet"
                              │
                              ▼
                    UPSELL 2        97 €   "Le Kit Assurance-Vie"
                              │
                              ▼
                    THANK YOU PAGE  (vend le Générateur)
                              │
          ┌───────────────────┴─────────────────────┐
          ▼                                         ▼
 SÉQUENCE 7 JOURS (non-acheteurs)        SÉQUENCE ACHETEURS (J+10 → J+90)
 structure CEO, 1 mail/jour              un produit DIY toutes les 3 semaines :
                                         VSL 2  147 €  Générateur de Dossier Notaire
                                         VSL 3   97 €  Kit Dépendance
                                         VSL 4   67 €  Classeur prêt à imprimer
                                         VSL 5   47 €  Kit Testament & Clause
                                         100 % DIY, zéro délivrance humaine
```

**Objectif économique (funnel de funnel) :**
- Funnel 1 (27 € + bump + upsells) → break-even sur le CPA. Son job : acquérir des **acheteurs**.
- Funnel 2 (emailing → 4 produits backend + newsletter) → le profit. **Pas de high ticket, pas de live, pas de conseil** : rien qu'on ne puisse tenir seul. LTV visée ≈ 95-110 € par acheteur → le jeu, c'est volume + CPA.

---

## Les fichiers, dans l'ordre d'exécution

| # | Fichier | Phase du process | Ce que tu en fais |
|---|---|---|---|
| 01 | `01-strategie.md` | Phase 0 | Lis-le une fois. C'est la décision. |
| 02 | `02-avatar.md` | Phase 1.2 | Le socle. Colle-le dans ton GPT perso pour générer du contenu à la chaîne. |
| 03 | `03-offre-et-mecanisme.md` | Phase 1.3 / 1.4 | Big Idea, mécanisme, 8 composantes, pricing, value stacking. |
| 04 | `04-produit-mvp.md` | Phase 1.5 | Le plan module par module de chaque produit. **C'est ce que tu enregistres.** |
| 05 | `05-vsl-front.md` | Phase 2.2 / 2.3 | Headline + script complet de la VSL à 27 €. À lire au prompteur. |
| 06 | `06-pages-funnel.md` | Phase 2.6 | LP, bon de commande, bump, upsell 1, upsell 2, thank you page. Copy prêt à coller. |
| 07 | `07-vsl-backend.md` | Phase 2 (VSL 2-5) | Les 4 produits backend : le Générateur (VSL 2 complète) + les 3 autres (structure + pitch). |
| 08 | `08-creatives-ads.md` | Phase 4 | 10 hooks × 10 bodies × 10 closings, 3 scripts montés, ad copies 5/5/5. |
| 09 | `09-emails.md` | Phase 5 | Séquence 7 jours + panier abandonné + acheteurs → 4 mini-lancements backend. Écrits. |
| 10 | `10-technique-et-lancement.md` | Phase 3 / 4 / 6 | Déploiement du site, pixels, campagne, budget, KPIs cibles, tableau de suivi. |
| 11 | `11-legal-et-compliance.md` | Transverse | Ce que tu as le droit de dire, ce qui te fait bannir, ce qui te fait condamner. **Lis-le avant de publier quoi que ce soit.** |
| 12 | `12-chiffres-succession.md` | Référence | Barèmes, abattements, articles du CGI. Les chiffres que tu cites. **Vérifié le 5 septembre 2026** sur sources officielles. À repasser après le 30 septembre 2026 (sort du 790 A bis). |
| 13 | `13-checklist-production.md` | Exécution | **Ta to-do étape par étape** jusqu'au lancement des ads. Coche au fur et à mesure. |
| 14 | `14-guide-etude.md` | Prérequis | Maîtriser le sujet en 3 soirées : concepts vulgarisés, sources officielles, test final. |
| 15 | `15-identite-visuelle.md` | Transverse | Charte, images déclencheurs, prompts, les 8 posts, la Page Facebook. |
| 16 | `16-benchmark-marches.md` | Référence | Ce qui scale aux US, au UK et en France sur la même cible, décortiqué. **Le format d'annonce à tester en priorité.** |
| 17 | `17-swipe-my-estate-kit.md` | Référence | Le swipe file du concurrent le plus proche : ses 14 hooks + son annonce phare décortiquée bloc par bloc. |
| 19 | `19-ab-tests-et-angles.md` | Stock | Headlines et sous-titres à tester, 3 angles de LP complets, journal des versions et formulations écartées |
| 20 | `20-pricing-et-tam.md` | Arbitrage | Le TAM chiffré, l'équation du CPA, le prix de chaque produit et le test à 397 € |
| — | `site/` | Phase 3 | **Le site complet** (Next.js). Landing pages, VSL, commande, upsells, pages légales. |

---

## Calendrier réaliste (débutant, seul)

```
SEMAINE 1   Setup Facebook (BM, warm-up, proxy, paiement)  ← démarre AUJOURD'HUI, ça prend 2-3 sem.
            Lire 01 → 03. Vérifier les chiffres de 12 sur impots.gouv.
SEMAINE 2   Enregistrer le produit front (04) — 7 vidéos de 8-12 min + le simulateur.
            Enregistrer la VSL (05).
SEMAINE 3   Brancher Stripe/Supabase/Resend sur le site + déployer sur Vercel (06 + 10). Pixels. (contenu upsell 1
            peut être livré en "accès progressif" — cf. 04).
            Enregistrer 12 créatives (08).
SEMAINE 4   Charger les emails (09). Test complet du funnel avec une vraie CB.
            LANCEMENT — 50 €/jour, CBO, Broad France, 12 créatives. Ne touche à rien 48 h.
SEMAINE 5+  Phase 6 : tracker tous les jours, A/B headline → lead → créatives.
            Construire le Générateur (07) pendant que le front tourne, puis un produit backend / 3 semaines.
```

⚠️ Les produits backend n'ont **pas** besoin d'exister au lancement. Il faut d'abord des acheteurs à 27 €.
Tu les construis à partir de la semaine 5 avec les retours des premiers clients (feedback loop, `04-produit/philosophie-produit.md`). Détail jour par jour : `13-checklist-production.md`.

---

## Les 5 erreurs qui tueraient ce funnel précis

1. **Écrire "vous avez plus de 60 ans" ou "vous êtes propriétaire" dans une pub.** Attribut personnel → refus Meta. Tout en 1re ou 3e personne. Cf. `11`.
2. **Promettre "économisez 40 %".** Non substantiable. On dit *"jusqu'à 60 %"* (vrai pour les non-parents) ou on raconte un cas chiffré.
3. **Donner un conseil personnalisé.** Tu vends de la pédagogie et des outils. Le conseil, c'est le notaire du client. Cf. `18`.
4. **Lancer sans le bump pré-coché et les 2 upsells.** Le 27 € seul ne peut pas être rentable.
5. **Ne pas envoyer la séquence 7 jours.** 50-60 % du CA.

---

## Vocabulaire du projet (à utiliser partout, pour la cohérence)

| Terme | Usage |
|---|---|
| **Héritage Intact** | La marque. Nom de l'expéditeur email. Nom de la page Facebook. |
| **La Méthode des 3 Verrous** | Le mécanisme. Verrou 1 = Diagnostiquer, Verrou 2 = Réorganiser, Verrou 3 = Verrouiller. |
| **Le compteur des 15 ans** | Concept brandé : l'abattement de 100 000 € se recharge tous les 15 ans. Chaque année sans donation = une année perdue. |
| **Le silence** | L'ennemi commun : *"personne n'est payé pour vous prévenir"*. |
| **La facture invisible** | Les droits de succession — ce que vos enfants paieront et que vous ne verrez jamais. |
| **L'héritier n°1** | L'État. |
