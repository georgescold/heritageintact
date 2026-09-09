# Héritage Intact — où en est le projet

Dernière mise à jour : 9 septembre 2026.
Ce fichier est le point d'entrée pour reprendre le travail dans une nouvelle
conversation. Il dit ce qui marche, ce qui bloque, et ce qui reste à décider.

---

## Où vit quoi

| Quoi | Où |
|---|---|
| Le code, et le dépôt git | `PROJET-HERITAGE-INTACT/site/` (le `.git` est **ici**, pas au-dessus) |
| Dépôt distant | `github.com/georgescold/heritageintact` |
| Déploiement | Vercel, automatique à chaque push sur `main`. **API REST uniquement, jamais le CLI** (le token est scopé équipe, le CLI répond « User not found ») |
| En ligne | `https://www.heritageintact.fr` |
| Secrets | `site/.env.local` (Stripe, Vercel, Supabase, Resend, fal.ai) |

⚠️ **Ne jamais lancer une commande git en dehors de `site/`.** Le dossier parent
`Test infoproduit` est le dépôt Process-Valère, qui est le travail personnel de
Loys. Un `git stash pop` y a déjà écrasé six fichiers.

---

## Ce qui bloque une mise en vente réelle

1. **La clé Stripe de production n'a pas été vérifiée.** En local c'est
   `sk_test_`, donc les tests sont sans risque. En production, personne n'a lu
   la variable. **À faire avant de payer sur heritageintact.fr**, sinon le test
   débite réellement.
2. **Le webhook Stripe n'est pas enregistré** — `STRIPE_WEBHOOK_SECRET` est
   vide. La livraison passe quand même par `confirmCheckout`, mais le filet
   n'existe pas : qui ferme l'onglet pendant le 3-D Secure paie et ne reçoit
   rien.
3. **Aucune vidéo n'est tournée.** Les identifiants `NEXT_PUBLIC_*_VIDEO_ID`
   sont vides, donc la VSL et les vidéos d'upsell sont des emplacements vides.
   Neuf fiches de tournage sont prêtes (127 min).
4. **Six identifiants ont circulé en clair et n'ont jamais été renouvelés**
   (Stripe live et test, fal.ai, Resend, Vercel, Supabase).

---

## Ce qui marche, et qu'il faut se garder de « réparer »

- **Le tunnel entier** : bon de commande → `/situation` → upsells → `/merci`.
- **La livraison est doublée** : `livrer()` est appelée par `confirmCheckout`
  ET par le webhook. L'idempotence tient à une réservation atomique, jamais au
  statut de la commande.
- **33 documents imprimables** existent réellement, dont les 12 plans-types.
- **La qualification** : 4 questions posées sur `/situation`, APRÈS le paiement.
  Elles ne changent ni prix ni contenu — seulement quel écran de vente est
  montré, dans quel ordre, et sous quel titre.
- **`accroches.ts`** choisit le titre du premier écran selon les réponses.
  Sans réponse, le titre écrit à la main est rendu au caractère près.

### Trois invariants à ne pas casser

- **Un montant affiché est toujours celui qui sera débité.** Ce défaut est
  apparu deux fois (bon de commande, puis page d'upsell). `lib/prix.ts` est la
  source unique.
- **Aucune réponse de qualification ne transite par une URL.** Elles vivent en
  base, relues par l'identifiant de commande.
- **Aucune phrase ne recommande un placement.** Le site n'a pas le statut CIF :
  on écrit ce que la loi fait, jamais ce que le lecteur devrait faire de son
  argent.

---

## Décisions qui attendent Loys

- **Le format des fiches de tournage** n'a jamais été validé. C'est le seul
  livrable où une erreur coûte une journée de studio.
- **Trois mécaniques de rareté tournent en même temps** : le compteur de
  10 minutes, les 20 places fondatrices, et le palier dégressif. Retirer le
  compteur de places — c'est le plus faible, et le seul qui ne repose pas sur
  une date vérifiable.
- **Les pop-ups programmés sur les écrans d'upsell** (rappel du crédit qui
  expire) ont été demandés et ne sont pas construits.
- **`Lp.tsx` / `NotThis`** décrit La Méthode comme « un simulateur qui tient
  dans un navigateur » : c'est faux, c'est une feuille papier. Le composant
  n'est affiché nulle part — à corriger ou à supprimer.
- **Backends 2, 3 et 4** restent `disponible: false` : rien n'est produit.
