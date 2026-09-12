import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

/**
 * La boutique et la vente d'un guide à l'unité, éprouvées sans base, sans
 * réseau et sans Stripe. Ce qui est vérifié ici touche à l'argent : quels
 * produits sont vendables seuls, et à quel prix.
 */
const require = createRequire(import.meta.url);
const ts = require("typescript");
const cache = new Map();
function mod(rel) {
  const file = path.resolve(process.cwd(), rel);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(
    js,
    {
      exports,
      process: { env: { PRIX_SECRET: "secret-de-test-assez-long" } },
      Buffer,
      require: (p) =>
        p.startsWith("node:")
          ? require(p)
          : mod(
              path.relative(process.cwd(), path.resolve(path.dirname(file), p.replace(/^@\//, "src/"))) +
                ".ts",
            ),
    },
    { filename: file },
  );
  return exports;
}

let n = 0;
const ok = (v, m) => { assert.ok(v, m); n++; };
const eq = (a, b, m) => { assert.equal(a, b, m); n++; };

const { guideVendable, GUIDES_A_LA_CARTE } = mod("src/lib/guides-vente.ts");
const { PRODUCTS, SKU_TUNNEL_UNIQUEMENT } = mod("src/lib/config.ts");

// Les quatre guides vendables a l'unite, et eux seuls.
for (const sku of ["upsell1", "upsell2", "backend4", "bump"]) ok(guideVendable(sku), sku + " vendable");

// ⚠️ LE PRODUIT D'APPEL N'EST PAS VENDABLE ICI. Il garde /commande et sa
// fenetre de prix : un second bon de commande sans promotion ferait exister
// deux tarifs du meme produit selon le lien emprunte.
ok(!guideVendable("front"), "LE GUIDE D'ENTREE GARDE SON PROPRE BON DE COMMANDE");

// Aucun pack : ils n'existent que dans le tunnel et contiennent des composants
// deja vendus ailleurs.
for (const sku of SKU_TUNNEL_UNIQUEMENT) ok(!guideVendable(sku), sku + " reste hors vente a l'unite");
ok(!guideVendable("pirate"), "un sku inconnu est refuse");
ok(!guideVendable(""), "une chaine vide est refusee");

// Un produit retire du catalogue ne doit plus se vendre.
for (const sku of GUIDES_A_LA_CARTE) {
  eq(PRODUCTS[sku].disponible, true, sku + " est disponible au catalogue");
  ok(PRODUCTS[sku].price > 0, sku + " a un prix");
}

// La boutique ne propose que des produits reels, et chaque fiche est complete.
const { BOUTIQUE, ORDRE_BOUTIQUE } = mod("src/content/boutique.ts");
eq(ORDRE_BOUTIQUE.length, 5, "cinq fiches");
eq(ORDRE_BOUTIQUE[0], "front", "le produit d'appel en premier");
for (const sku of ORDRE_BOUTIQUE) {
  const f = BOUTIQUE[sku];
  ok(f, "fiche presente : " + sku);
  ok(PRODUCTS[sku], "produit reel : " + sku);
  ok(f.resultat.length > 20, sku + " : le titre est un resultat");
  ok(f.changements.length >= 3, sku + " : au moins trois changements");
  ok(f.perte.length > 40, sku + " : le cout de l'inaction est ecrit");
  ok(!("limite" in f), sku + " : plus de ligne « ce qu'il ne fait pas »");
  // Vocabulaire proscrit par 05-funnel/teardowns.md (correction n°6).
  const texte = [f.resultat, ...f.changements, f.perte].join(" ").toLowerCase();
  ok(!texte.includes("offert"), sku + " : pas de « offert »");
  ok(!texte.includes("payez-moi"), sku + " : pas de « payez-moi »");
}

// ⚠️ Sauf le produit d'appel, toute fiche affichee doit etre achetable.
for (const sku of ORDRE_BOUTIQUE) {
  if (sku === "front") continue;
  ok(guideVendable(sku), "aucun bouton mort sur la boutique : " + sku);
}


// L'ordre du copy sur la page : le cout de l'inaction vient APRES les
// changements. Ouvrir par la douleur fait fuir (principes-premiers.md).
const page = fs.readFileSync("src/app/nos-guides/page.tsx", "utf8");

// Le nom du guide est le titre de la fiche, le resultat son sous-titre.
// Une inversion renverrait le nom en petites lettres grises, ou ferait
// disparaitre la phrase qui dit ce que le guide fait.
ok(
  page.indexOf("{produit.name}") < page.indexOf("{fiche.resultat}"),
  "LE NOM DU GUIDE EST LE TITRE, LE RESULTAT LE SOUS-TITRE",
);
ok(page.includes("<h2"), "le nom est bien un titre de niveau 2");
ok(
  page.indexOf("Ce qui change pour vous") < page.indexOf("Si vous ne le faites pas"),
  "LE REVE AVANT LA PEUR, JAMAIS L'INVERSE",
);

// L'ancrage est pose avant le premier prix de la page.
ok(page.includes("86 389"), "l'ancrage cite un montant de droits verifiable");
ok(page.indexOf("86 389") < page.indexOf("euros(produit.price)"), "l'ancrage precede les tarifs");

// La page reste hors index : elle affiche des prix.
const seo = fs.readFileSync("src/lib/seo.ts", "utf8");
ok(!seo.includes('"/nos-guides"'), "la boutique n'est pas indexable");
ok(!seo.includes('"/commander'), "les bons de commande ne sont pas indexables");

// Le bon de commande a l'unite ne refait pas le tunnel : il reutilise la
// creation de commande et la confirmation deja en service.
const action = fs.readFileSync("src/app/commande-guide.ts", "utf8");
ok(action.includes("creerCommandeEspace"), "reutilise la creation de commande existante");
ok(action.includes("markOrderPaid"), "le mode simule marque la commande payee, sinon rien n'est livre");
ok(action.includes("montantAffiche !== prix"), "refus si l'ecran et le serveur divergent");
// La vente a l unite a SA fenetre (fenetre-guide.ts), pas celle du tunnel :
// les paliers a montant fixe du tunnel valent 147 et 197 EUR, ce qui n aurait
// aucun sens sur un guide a 47 EUR.
ok(!action.includes("promotionParEmail"), "pas de fenetre du tunnel sur la vente a l unite");
ok(action.includes("fenetreGuide("), "la vente a l unite a sa propre fenetre");
const formulaire = fs.readFileSync("src/components/CommandeGuide.tsx", "utf8");
ok(formulaire.includes("confirmCheckout"), "la confirmation reste celle du tunnel");
ok(formulaire.includes("useStripe()"), "les hooks Stripe existent");
ok(
  formulaire.indexOf("function AvecStripe") > formulaire.indexOf("<Elements"),
  "les hooks Stripe ne sont appeles que sous <Elements>",
);

// ⚠️ LES DEUX setup_future_usage DOIVENT CONCORDER. Le serveur cree l'intention
// avec off_session ; si Elements ne le declare pas aussi, Stripe refuse la
// confirmation par « The provided setup_future_usage (off_session) does not
// match the expected setup_future_usage (null) » -- en anglais, en rouge, sous
// la carte deja saisie de l'acheteur.
ok(formulaire.includes('setupFutureUsage: "off_session"'), "Elements declare setup_future_usage");
ok(action.includes('setup_future_usage: "off_session"'), "le PaymentIntent porte setup_future_usage");

// Link reclame un numero de portable au nom d'une marque tierce, au moment ou
// l'acheteur saisit sa carte. Coupe, comme dans le tunnel.
ok(formulaire.includes('wallets: { link: "never" }'), "Link est coupe sur le bon de commande");

/* ── Le complement sur le bon de commande ──────────────────────────── */
const { bumpPour } = mod("src/lib/guides-vente.ts");

// Toujours le dossier notaire : le moins cher, il complete les autres sans
// les recouper, et c'est deja celui du tunnel.
for (const sku of ["upsell1", "upsell2", "backend4"]) eq(bumpPour(sku), "bump", sku + " : complement = dossier notaire");

// ⚠️ UN PRODUIT NE SE PROPOSE JAMAIS LUI-MEME EN COMPLEMENT.
eq(bumpPour("bump"), null, "LE DOSSIER NOTAIRE NE SE PROPOSE PAS A LUI-MEME");

// Le total suit la case, cote ecran comme cote banque.
ok(formulaire.includes("elements.update({ amount"), "Stripe suit le total quand la case change");
ok(action.includes("addItem(order.id, complement)"), "le complement entre dans la commande");
ok(
  action.includes("const tarif = prixGuide(sku, palier, complement);") &&
    action.includes("const prix = tarif.total;"),
  "un seul calcul du prix, pour la ligne de commande comme pour la banque",
);

// ⚠️ JAMAIS PRE-COCHEE. Une case cochee d'avance fait payer un produit que
// personne n'a demande, et cela se decouvre sur un releve bancaire.
ok(formulaire.includes("useState(false)"), "la case du complement n'est pas pre-cochee");

/* ── La page de remerciement ───────────────────────────────────────── */
const merci = fs.readFileSync("src/app/merci/page.tsx", "utf8");

// Le montant ne se rappelle plus dans la confirmation : le rappeler juste
// avant de proposer un complement supprime ce complement.
ok(merci.includes('titre="Votre commande est confirmée"'), "aucun montant dans la confirmation");

// Mais il n'a pas disparu du site : le recapitulatif detaille reste plus bas,
// apres l'offre, et fait office de recu.
ok(merci.includes("Récapitulatif de votre commande"), "le recapitulatif detaille subsiste");
ok(
  merci.indexOf("très fortement") < merci.indexOf("Récapitulatif de votre commande"),
  "l'offre passe AVANT le rappel du montant",
);

// ⚠️ L'OFFRE PASSE AVANT LE LIEN D'ACCES. Une fois dans son espace,
// l'acheteur ne revient pas sur cette page.
ok(
  merci.indexOf("très fortement") < merci.indexOf("Votre lien personnel"),
  "L'OFFRE PASSE AVANT LE LIEN D'ACCES",
);

// ⚠️ AUCUN DEBIT DEPUIS UNE PAGE DE REMERCIEMENT : le bouton mene a l'ecran
// d'ajout, qui affiche le prix et demande confirmation.
ok(merci.includes("/ajouter/${complement}"), "le bouton mene a l'ecran d'ajout, pas a un debit");
ok(!merci.includes("chargeUpsell") && !merci.includes("prepareCheckout"), "aucun paiement declenche ici");


/* ── La fenetre de prix des guides ───────────────────────────────────── */
const F = mod("src/lib/fenetre-guide.ts");
const T0 = Date.parse("2026-01-01T12:00:00.000Z");
const min = (n) => T0 + n * 60_000;

// Degressive : -30 % pendant vingt minutes, -20 % pendant dix de plus, puis rien.
eq(F.fenetreGuide(T0, min(0)).pourcent, 30, "a l'ouverture : -30 %");
eq(F.fenetreGuide(T0, min(19)).pourcent, 30, "encore -30 % a 19 minutes");
eq(F.fenetreGuide(T0, min(19)).suivant, 20, "le palier suivant est annonce");
eq(F.fenetreGuide(T0, min(20)).pourcent, 20, "a 20 minutes : -20 %");
eq(F.fenetreGuide(T0, min(29)).pourcent, 20, "encore -20 % a 29 minutes");
eq(F.fenetreGuide(T0, min(30)).pourcent, 0, "a 30 minutes : plus de remise");
eq(F.fenetreGuide(T0, min(30)).fin, null, "aucune echeance quand la fenetre est fermee");

// ⚠️ AUCUNE FENETRE SANS DEPART VALIDE. Un cookie absent, illisible ou falsifie
// rend le prix du catalogue -- jamais une remise qu'on ne saurait pas verifier.
eq(F.fenetreGuide(null).pourcent, 0, "sans cookie : prix catalogue");
eq(F.fenetreGuide(null).fin, null);

// Le prix : la remise porte sur le guide, jamais sur le complement.
const palier30 = F.fenetreGuide(T0, min(1));
const tarif = F.prixGuide("upsell2", palier30, "bump");
eq(tarif.base, 67, "la base reste le prix catalogue");
eq(tarif.guide, 46.9, "67 moins 30 % = 46,90");
eq(tarif.complement, 17, "LE COMPLEMENT RESTE AU PRIX CATALOGUE");
eq(tarif.total, 63.9, "total = guide remise + complement plein tarif");

const sansRemise = F.prixGuide("upsell2", F.fenetreGuide(null), "bump");
eq(sansRemise.guide, 67, "sans fenetre, le guide est au catalogue");
eq(sansRemise.total, 84);

// Le palier transmis a la couche de donnees est un POURCENTAGE, jamais un
// montant : c'est ce qui preserve la regle « le prix ne vient jamais de
// l'appelant » de creerCommandeEspace.
ok(action.includes("remisePourcent: palier.pourcent"), "le serveur transmet le palier, pas le montant");
const donnees = fs.readFileSync("src/lib/db.ts", "utf8");
ok(donnees.includes("remisePourcent?: number"), "creerCommandeEspace prend un pourcentage");
ok(
  donnees.includes("const pourcent = reduction.pourcent || input.remisePourcent || 0;"),
  "la reduction du tunnel prime, et les deux ne se cumulent jamais",
);

// La fenetre s'ouvre au CLIC vers la commande, pas pendant la lecture, et ne se
// relance pas si elle est deja ouverte.
const route = fs.readFileSync("src/app/commander/route.ts", "utf8");
ok(route.includes("request.cookies.get(COOKIE_FENETRE)"), "une fenetre ouverte n'est pas relancee");
ok(route.includes("guideVendable(guide)"), "seul un guide vendable ouvre une fenetre");

// Le prix barre n'apparait que s'il y a une remise reelle.
ok(formulaire.includes("prix < base &&"), "aucun prix barre sans remise en cours");

/* ── L annonce de promotion sur la boutique ─────────────────────────── */

// ⚠️ ON N ANNONCE UNE PROMOTION QUE SI LE SITE SAIT L APPLIQUER. Sans secret,
// aucune fenetre ne s ouvre au clic : annoncer la remise ferait une promesse
// dementie dix secondes plus tard, sur l ecran ou le lecteur sort sa carte.
ok(page.includes("fenetreDisponible()"), "l annonce depend de la disponibilite reelle de la fenetre");
ok(page.includes("Voir la promotion"), "le CTA annonce la promotion");
ok(page.includes("En promotion"), "le bandeau annonce la promotion");

// ⚠️ LE PRODUIT D APPEL N EST PAS CONCERNE : sa fenetre depend d une adresse
// email deja connue, donc l annoncer a tout le monde serait faux.
ok(page.includes("promotion && !entree"), "le produit d appel garde son propre libelle");

// ⚠️ RENDU A CHAQUE REQUETE. Prerendu, l etat de la promotion serait fige a la
// compilation : poser le secret en production ne changerait rien, et la
// boutique afficherait le prix sec pendant que la commande applique la remise.
ok(page.includes("export const dynamic = \"force-dynamic\""), "la boutique n est pas prerendue");

console.log(
  n +
    " controles boutique reussis : perimetre de vente, produit d appel preserve, fiches completes, reve avant peur, ancrage avant tarif, hors index, complement jamais pre-coche, et fenetre de prix degressive dont la remise ne porte que sur le guide. Aucun reseau ni base.",
);
