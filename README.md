# Héritage Intact : site & funnel

Next.js 16 (App Router) · Tailwind 4 · déployé sur Vercel.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Sans variables d'environnement, le site tourne en **mode test** : paiement simulé, vidéos de
remplacement, pixel inactif, données dans `data/db.json`. Voir `.env.example`.

## Pages du funnel

| Route | Rôle |
|---|---|
| `/` | Landing page, variante A : classique (structure LP 2) |
| `/lp-courte` | Landing page, variante B : courte avec pop-up (structure LP 1) |
| `/lp-questions` | Landing page, variante C : questionnaire, règle des 3 oui (structure LP 3) |
| `/methode` | VSL |
| `/commande` | Bon de commande + bump |
| `/plan-complet` | Upsell 1 |
| `/kit-assurance-vie` | Upsell 2 |
| `/merci` | Thank you page |
| `/module-1` | Module 1 en accès libre (cible des pop-ups de sortie) |
| `/espace` | Espace membre (à construire) |
| `/mentions-legales` · `/cgv` · `/confidentialite` | Pages légales : champs `[À COMPLÉTER]` |

Le contenu marketing vient du dossier parent (`05-vsl-front.md`, `06-pages-funnel.md`).
