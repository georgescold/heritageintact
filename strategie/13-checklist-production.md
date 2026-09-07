# 13 — Ta checklist de production, étape par étape, jusqu'au lancement des ads

> Coche au fur et à mesure. Chaque étape dit : **quoi**, **avec quoi**, **combien de temps**,
> **où est le contenu**.
> Hypothèse : tu es seul, ~5-6 h/jour. Le chemin critique reste **Facebook** : le warm-up impose son
> propre calendrier, tout le reste s'organise autour.

---

## ═══ CE QUI EST DÉJÀ FAIT ═══

- [x] **Nom de domaine** acheté
- [x] **Boîtes mail Zoho** configurées sur le domaine
- [x] **Entreprise créée** — SIRET 989 331 418 00016 (micro-entreprise, TVA non applicable art. 293 B)
- [x] **Page Facebook « Héritage Intact »** créée
- [x] **Le site entier est construit** : landing pages (3 variantes), VSL, bon de commande, bump,
      2 upsells, page de remerciement, module 1 en accès libre, pages légales.
      Next.js sur Vercel, dans `site/`. Il tourne en mode test.
- [x] **Identité légale** renseignée dans les pages légales du site

**Décision prise : pas de dépôt de marque à l'INPI tant que le funnel n'est pas rentable.** Bon
arbitrage. Conséquence : ne jamais écrire « marque déposée » ni ®. Le jour où c'est rentable, c'est
la première dépense (~250 €).

**Il te manque encore 3 informations légales** pour que le site soit publiable. Donne-les-moi et je
les intègre en deux minutes (`site/src/lib/config.ts`, objet `LEGAL`) :

1. Ton **nom et prénom** tels qu'ils figurent à l'INSEE
2. L'**adresse du siège** déclarée lors de la création
3. Le **médiateur de la consommation** auquel tu auras adhéré (obligatoire, 150 à 250 €/an,
   ex. CNPM-Médiation ou Médiation Solution)

---

## ═══ ÉTAPE 1 — Le chemin critique Facebook (à démarrer en premier) ═══

Le warm-up prend 7 à 10 jours pendant lesquels tu ne peux rien accélérer. Lance-le, puis va faire
autre chose.

- [ ] Navigateur anti-détection (Dolphin Anty ou Incogniton) + **3 proxys résidentiels dédiés**
- [ ] 3 profils : 2 admins + 1 employé
- [ ] Business Manager créé, puis **ne plus y toucher pendant 24 h**
- [ ] La Page reliée au BM depuis un profil indépendant
- [ ] **Warm-up : campagne Page Like à 5 €/jour pendant 7 à 10 jours**
- [ ] Moyen de paiement : néobanque ou ligne de crédit Facebook. **Pas de banque française
      traditionnelle**, elle bloque les prélèvements instantanés et tu finis en shadowban
- [ ] Vérifier manuellement que le premier paiement passe
- [ ] Pixel créé, domaine vérifié dans le BM (Brand Safety → Domaines)
- [ ] Vérifier si la France exige la vérification « annonceur de services financiers »
      (Meta Business Help). Si oui, la faire maintenant, pas au lancement

📖 `02-acquisition/setup-anti-ban.md`

---

## ═══ ÉTAPE 2 — Maîtriser le sujet (3 soirées, 9 h) ═══

**C'est le vrai blocage, et personne ne peut le faire à ta place.** Tu vas enregistrer 8 modules et
répondre à des gens qui ont 40 ans de patrimoine derrière eux. Si tu récites, ça s'entend.

- [ ] **Soirée 1** : les fondations (succession, réserve héréditaire, conjoint/PACS/concubinage)
- [ ] **Soirée 2** : les trois leviers (donation, assurance-vie, démembrement)
- [ ] **Soirée 3** : cas particuliers, notaire, puis le test à voix haute

📖 **`14-guide-etude.md`** — tout y est : les concepts vulgarisés avec leurs analogies, les sources
officielles, et le test final de 10 questions.

- [x] ~~**Vérifier chaque chiffre de `12-chiffres-succession.md`** sur impots.gouv et service-public.~~ **Fait le 5 septembre 2026.** 3 corrections : Dutreil 4 → 6 ans, assiette des frais de notaire, nouvel abattement beaux-enfants.
- [ ] **Re-vérifier le sort du dispositif 790 A bis après le 30 septembre 2026** (rapport d'évaluation au Parlement). C'est la date qui décide de l'urgence utilisée en pub.
      En priorité le § 5 (fenêtre fiscale temporaire, expire fin 2026 si toujours en vigueur).
      Noter la source et la date de consultation en face de chaque ligne. *(2 h)*

⚠️ Tant que ce n'est pas fait, tu ne peux rien enregistrer. Tout le produit repose sur ces chiffres.

---

## ═══ ÉTAPE 2 bis — Les 10 testeurs et la caution professionnelle ═══

À lancer **en parallèle de l'étude**, parce que les deux prennent du temps calendaire.

### Le programme bêta (ta seule source de témoignages légaux)
- [ ] Lister **10 personnes de 60 ans et plus** dans ton entourage
- [ ] Leur donner le produit gratuitement dès qu'il est enregistré, en annonçant que c'est une
      version de test et que tu veux un avis franc
- [ ] Leur demander : faire la simulation, noter le chiffre avant/après, dire ce qu'ils n'ont pas compris
- [ ] Obtenir l'accord **écrit** pour citer prénom, âge, département
- [ ] Afficher la mention « testeurs ayant reçu le produit gratuitement » à côté des avis

### La caution professionnelle (le plus gros manque du projet)
- [ ] Contacter des **notaires, avocats fiscalistes ou juristes retraités** — le statut retraité
      lève l'essentiel des freins déontologiques et le coût
- [ ] Où chercher : annuaire des notaires honoraires, LinkedIn en filtrant « retraité », les
      chambres départementales, ton propre notaire à qui tu demandes une mise en relation
- [ ] La demande : relire le contenu, corriger ce qui est faux, et **accepter d'être cité par son
      nom et ses années d'exercice**
- [ ] Contrepartie : rémunération de relecture, ou simple citation. Beaucoup acceptent par intérêt
      pour le sujet
- [ ] Objectif : *« Contenu relu par [Nom], notaire honoraire, 32 ans d'exercice »* sur la page de
      vente et au générique des modules

📖 Détail et arguments : `03-offre-et-mecanisme.md` § 4 et 4 bis · `16-benchmark-marches.md` § 8

---

## ═══ ÉTAPE 3 — La Page Facebook vivante (1 h, puis 10 min/jour) ═══

Le robot Meta regarde ta Page avant d'approuver tes pubs. Une page vide est un signal de compte
jetable.

- [ ] Photo de profil + photo de couverture *(30 min dans Canva)*
- [ ] Compléter les informations de la Page (catégorie **Site web éducatif**, bio, site, email)
- [ ] **Un post par jour jusqu'au lancement** — les 8 posts sont écrits, il n'y a qu'à les mettre en
      forme et les publier

📖 **`15-identite-visuelle.md`** — charte, prompts pour les images, les 8 posts rédigés.

---

## ═══ ÉTAPE 4 — Produire le produit front (5 jours) ═══

### Le Simulateur de Facture Invisible *(je peux te le construire)*
- [ ] Feuille de calcul : onglet Saisie, onglet Calcul (abattements, barème par tranches,
      assurance-vie avant/après 70 ans), onglet Résultat (facture par héritier + les 3 dates)
- [ ] Test de validation : avec le cas Jean-Pierre, tu dois retrouver **38 389 €** exactement
- [ ] Décliner en version Excel + version papier (PDF une page, à remplir à la main)

### Les slides des 8 modules *(2 jours)*
- [ ] Un jeu de slides par module (`04-produit-mvp.md`), police ≥ 28 pt, un chiffre par slide,
      l'article du CGI en bas de chaque slide chiffrée
- [ ] Les 5 bonus PDF : lexique, 12 questions au notaire, lettre aux enfants, règle de mise à jour,
      fiche « combien garder pour soi »

### L'enregistrement *(2 jours)*
- [ ] Micro-cravate à 20 € (le son compte plus que l'image), lumière de face, fond neutre
- [ ] 8 modules, 8 à 12 min chacun, **vitesse normale**, une prise par module
- [ ] Montage CapCut : couper les blancs, **sous-titres gros**, export 1080p
- [ ] Upload sur Vimeo ou Wistia, récupérer les identifiants de vidéo

### Le bump *(demi-journée)*
- [ ] Dossier Notaire : inventaire, fiche famille, liste des 12 pièces, mail-type de prise de RDV,
      compte-rendu à trous, + une vidéo de 6 min

---

## ═══ ÉTAPE 5 — La VSL et les upsells (3 jours) ═══

- [ ] Relire le script de `05-vsl-front.md` à voix haute, chrono en main. Cible : 9-10 min
- [ ] Personnaliser le bloc 4 avec **ton histoire** (vraie, ou présentée comme illustrative)
- [ ] Préparer les incrustations : le calcul 38 389 → 0 ligne par ligne, les articles du CGI
- [ ] Enregistrer au prompteur, débit lent. Monter, sous-titrer, uploader
- [ ] Vidéos upsell 1 (4 min) et upsell 2 (3 min) — scripts dans `06-pages-funnel.md`
- [ ] Écrire les **4 premiers plans-types** de l'upsell 1 (situations 1, 2, 4, 5)
- [ ] Contenu de l'upsell 2 : Kit Assurance-Vie. **Aucun nom d'assureur ni de contrat**

---

## ═══ ÉTAPE 6 — Brancher le site et le déployer (2 jours) ═══

Le site est écrit. Il reste à lui donner ses clés et à le mettre en ligne.

### Les comptes à créer *(1 h)*
- [ ] **Stripe** (commence en mode test, ça suffit pour tout vérifier)
- [ ] **Supabase** — nouveau projet dédié, pour remplacer le fichier local
- [ ] **Resend** — pour l'envoi des emails
- [ ] **Vimeo Pro** ou Wistia — pour héberger les vidéos

### Ce que je code ensuite *(je m'en occupe)*
- [ ] Paiement Stripe réel, avec carte enregistrée pour les upsells en un clic
- [ ] Base Supabase à la place du fichier JSON local
- [ ] Espace membre : connexion par lien envoyé par email, **sans mot de passe à retenir**
- [ ] Moteur d'emails : les 3 séquences de `09-emails.md`, avec les exclusions
- [ ] API Conversions Meta côté serveur (récupère 20 à 30 % d'événements que le pixel seul perd)
- [ ] Tableau de bord admin avec les KPIs du jour

### Le déploiement *(30 min)*
- [ ] `vercel deploy`, brancher le domaine, forcer le HTTPS
- [ ] Variables d'environnement dans Vercel (les clés Stripe, Supabase, Resend, le pixel, les vidéos)
- [ ] DNS pour Resend — **fait le 6 septembre 2026**, voir « Délivrabilité » ci-dessous

### Délivrabilité — état au 6 septembre 2026

Le DNS est chez Vercel (`ns1.vercel-dns.com`), les emails partent par Resend en région
`eu-west-1`, et le courrier humain reste chez Zoho.

**Le sous-domaine d'envoi.** `info.heritageintact.fr` est configuré et complet : SPF, DKIM,
DMARC et MX de retour, tous vérifiés. C'est de là que doivent partir les séquences. L'intérêt
n'est pas cosmétique : si une campagne prend des plaintes, c'est la réputation de `info.` qui
s'abîme, et le courrier de `contact@heritageintact.fr` continue d'arriver.

> ⚠️ L'ancienne consigne « un seul enregistrement SPF contenant Zoho et Resend » ne vaut plus.
> Avec un sous-domaine, les deux SPF vivent à des endroits différents et ne se marchent jamais
> dessus : Resend sur `send.info.heritageintact.fr`, Zoho sur la racine.

**Ce qui bloque encore.** Resend refuse d'envoyer depuis le sous-domaine :
`This API key is not authorized to send emails from info.heritageintact.fr`. Le message est le
même quand un domaine n'est pas vérifié et quand la clé est restreinte — donc dans l'ordre :

- [ ] Resend → **Domains** → `info.heritageintact.fr` doit être **Verified**. Si « Pending »,
      cliquer « Verify DNS Records ».
- [ ] Resend → **API Keys** → regarder la colonne domaine de la clé. Si elle est restreinte à
      `heritageintact.fr`, c'est la cause : la restriction se choisit à la création et **ne se
      modifie pas**. Créer une clé *Sending access* sur **All domains**, la coller dans
      `RESEND_API_KEY` (local **et** Vercel).
- [ ] Puis basculer `EMAIL_FROM` sur `loys@info.heritageintact.fr` (la ligne est déjà écrite en
      commentaire dans `.env.local`).

En attendant, les emails partent de la racine — qui fonctionne. **Ne pas laisser `EMAIL_FROM` sur
le sous-domaine tant que la commande ci-dessous n'est pas verte** : chaque envoi échouerait, et
l'inscrit n'aurait jamais sa vidéo.

```bash
pnpm emails:verifier
```

Elle contrôle le DNS des deux domaines, la permission réelle de la clé (via l'adresse simulateur
`delivered@resend.dev`, personne ne reçoit rien) et sort en erreur si l'expéditeur configuré est
refusé.

**Le DMARC du domaine racine — fait le 6 septembre 2026.** `_dmarc.heritageintact.fr` porte
`v=DMARC1; p=none; rua=mailto:contact@heritageintact.fr`, comme le sous-domaine. Gmail et Yahoo
l'exigent des expéditeurs en volume depuis février 2024, et il protège la marque contre
l'usurpation.

`p=none` observe sans rien rejeter — le bon réglage pour commencer.

- [ ] Après quelques semaines de rapports propres, durcir en `p=quarantine`. **Pas avant** :
      passer trop tôt fait tomber ses propres emails.

Les rapports agrégés (XML, quotidiens, envoyés par Google, Microsoft, Yahoo) arrivent sur
`contact@heritageintact.fr`. L'adresse étant sur le même domaine que l'enregistrement, aucune
autorisation supplémentaire n'est requise — elle l'aurait été en pointant vers une boîte Gmail.

La racine n'a pas non plus de SPF ni de DKIM pour **Zoho**. Ça ne gêne pas les séquences (elles
partent par Resend, qui signe avec son propre DKIM), mais les emails que tu écris à la main
depuis `contact@heritageintact.fr` n'ont aucune authentification. À faire quand tu passeras du
temps dans Zoho.

### Les tests *(3 h)*
- [ ] Achat complet avec une vraie carte : 4 accès reçus, 4 lignes Stripe, 1 événement Purchase avec
      la bonne valeur (vérifier avec Meta Pixel Helper)
- [ ] Achat front seul → séquence acheteurs déclenchée, séquence prospects stoppée
- [ ] Opt-in sans achat → séquence 7 jours déclenchée
- [ ] Panier abandonné → séquence de relance déclenchée, puis stoppée en cas d'achat
- [ ] Remboursement test → accès révoqué, exclu des séquences de vente
- [ ] ⭐ **Test avec 2 ou 3 personnes de 60 ans et plus**, sur leur propre téléphone, sans aide,
      pendant que tu regardes. Note chaque hésitation. **C'est le test le plus rentable de la liste.**

---

## ═══ ÉTAPE 7 — Les créatives (2 jours) ═══

- [ ] Enregistrer les segments **séparément** : 10 hooks, 10 bodies, 10 closings
      (dossiers `hooks/`, `bodies/`, `closings/`)
- [ ] Monter les 12 combinaisons du tableau de `08-creatives-ads.md`
- [ ] Format **1:1**, sous-titres gros, **vitesse normale**, 45 à 60 secondes
- [ ] Pour les 3 créatives en récit à la première personne : acteur senior (Fiverr, Malt) ou avatar
      IA, avec la mention **« récit reconstitué »** à l'écran
- [ ] Une pub image sobre pour la campagne à 2 €/jour permanente
- [ ] Nommer les fichiers `A1-H1-B1-C1.mp4` pour pouvoir lire les statistiques ensuite

---

## ═══ ÉTAPE 8 — Compliance, puis lancement ═══

### Le passage compliance *(3 h, à ne pas sauter)*
- [ ] Chaque page et chaque créative contre la check-list de `11-legal-et-compliance.md` § 4
- [ ] Zéro « vous êtes / vous avez [attribut] » nulle part
- [ ] Case CGV sur les landing pages ✅ (déjà en place), case rétractation sur le bon de commande ✅
- [ ] Texte d'indépendance vis-à-vis de Meta en pied de page ✅ (déjà en place)
- [ ] Bump **pré-coché** ✅ (déjà en place, cf. `18` § C1)
- [ ] Compteur branché sur les vraies ventes ✅
- [ ] Faire relire CGV, mentions et disclaimer par un avocat *(300 à 600 €, une fois)*

### Le lancement
- [ ] Campagne **Ventes**, **CBO**, 50 €/jour, adset **Broad France**, Dynamic creative activé
- [ ] Événement : **Lead** au démarrage (escalade du pixel, cf. `10-technique-et-lancement.md`)
- [ ] Placements : Facebook Feed, Facebook Reels, Instagram Feed
- [ ] Les 12 créatives dans le même adset
- [ ] **Publier, puis ne toucher à rien pendant 48 h**
- [ ] Créer le tableau de suivi et le remplir 15 min chaque matin

---

## ═══ APRÈS LE LANCEMENT ═══

| Quand | Quoi |
|---|---|
| J+2 | Premier regard : CPM, taux de clic, coût par lead. Rien d'autre. |
| J+7 | A/B test de la **headline de la VSL**. Ajouter 3 créatives. Premiers témoignages par email. |
| J+14 | Bilan à 1 000 € dépensés : **GO ou NO-GO** sur l'EPC et le CPA. Si GO : 100 €/jour, passage à InitiateCheckout, campagne Contrôle. |
| J+14 → J+18 | Construire le **Générateur de Dossier Notaire** (je peux le coder) + sa page de vente |
| J+21 | A/B test du **lead de la VSL**. Les 8 plans-types manquants. |
| J+28 → J+63 | Un produit backend toutes les 3 semaines, puis la newsletter hebdomadaire |

---

## Ce que je peux faire pour toi, à la demande

| Livrable | Quand |
|---|---|
| Le **Simulateur** (feuille de calcul avec toutes les formules) | Dès que tes chiffres sont vérifiés |
| Le contenu **slide par slide** des 8 modules | Après le simulateur |
| Les **5 bonus PDF**, mis en page et brandés | Après la validation des chiffres |
| Le branchement **Stripe, Supabase, Resend** et l'espace membre | Dès que tu as créé les comptes |
| Le **Générateur** (l'application web) | J+14 |
