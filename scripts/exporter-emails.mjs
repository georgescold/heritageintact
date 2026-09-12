// Exporte en lecture TOUS les emails du site, rendus par les vrais gabarits de src/lib/email.ts.
// Rien n'est envoyé : l'appel au fournisseur est intercepté et la base est simulée.
// Usage, depuis site/ : node scripts/exporter-emails.mjs [dossier de sortie]
// Sortie par défaut : Heritage Intact/EMAILS, à côté de CREATIVES-PUBLICITAIRES.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sortie = path.resolve(process.argv[2] ?? path.join(site, "..", "..", "EMAILS"));

/* ── Un lecteur fictif. Seuls le prénom, les liens personnels et une remise éventuelle changent à l'envoi. ── */
const PRENOM = "[Prénom]";
const maintenant = new Date().toISOString();
const LEAD = { id: "ID-INSCRIT", email: "lecteur@exemple.fr", firstName: PRENOM, marketingConsent: true, desabonne: false, createdAt: maintenant, envoyes: [] };
const ACCES = { email: LEAD.email, firstName: PRENOM, jeton: "VOTRE-LIEN-PERSONNEL", createdAt: maintenant, envoyes: [], revoque: false };
/** La séquence prospect s'arrête dès qu'un achat existe : on bascule ce drapeau pour les emails client. */
let clientAvecAcces = false;

const bouchons = {
  "./db": { getLead: async () => LEAD, accesParEmail: async () => (clientAvecAcces ? ACCES : null), promotionParEmail: async () => null },
  "./mail-journal": { empreinte: (v) => crypto.createHash("sha256").update(v).digest("hex"), reserverEmail: async () => "envoyer", terminerEmail: async () => {} },
};

let dernier = null;
const fetch = async (_url, init) => {
  dernier = JSON.parse(init.body);
  return { ok: true, status: 200, json: async () => ({ id: "lecture" }) };
};
const env = { RESEND_API_KEY: "export-lecture", NEXT_PUBLIC_SITE_URL: "https://www.heritageintact.fr" };

const cache = new Map();
function charger(fichier) {
  if (cache.has(fichier)) return cache.get(fichier).exports;
  const module = { exports: {} };
  cache.set(fichier, module);
  const code = ts.transpileModule(fs.readFileSync(fichier, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const req = (p) => bouchons[p] ?? (p.startsWith(".") ? charger(path.resolve(path.dirname(fichier), p + ".ts")) : require(p));
  vm.runInNewContext(code, { module, exports: module.exports, require: req, process: { env }, console, fetch, AbortSignal, URL }, { filename: fichier });
  return module.exports;
}

const lib = (f) => path.join(site, "src", "lib", f);
const email = charger(lib("email.ts"));
const { SEQUENCE } = charger(lib("sequence.ts"));
const { SEQUENCE_CLIENT } = charger(lib("sequence-client.ts"));
const { PRODUCTS } = charger(lib("config.ts"));

async function rendre(appel) {
  dernier = null;
  const r = await appel();
  if (!dernier) throw new Error("Aucun email produit : " + JSON.stringify(r));
  return dernier;
}

/* ── Les emails, dans l'ordre du parcours ── */
const MARKETING_PROSPECT = "Envoyée à tout inscrit non désinscrit, tant qu’il n’a rien acheté : un achat arrête la séquence. Le consentement marketing n’est exigé nulle part ; seule la désinscription arrête les envois. Un seul email par jour, rien au-delà de 21 jours.";
const groupes = [];

groupes.push({
  fichier: "1-inscription.md",
  titre: "1. À l’inscription",
  intro: "Envoyé à la seconde où quelqu’un laisse son prénom et son email sur la page d’accueil.",
  emails: [{
    cle: "j0-presentation", nom: "J0 — Le lien vers la présentation",
    quand: "Immédiatement après l’inscription.",
    conditions: "Email de service : il part toujours, c’est ce qui a été demandé.",
    rendu: await rendre(() => email.envoyerLivraison(LEAD)),
  }],
});

const prospect = [];
for (const etape of SEQUENCE) {
  prospect.push({
    cle: "prospect-" + etape.cle, nom: `${etape.cle.toUpperCase()} — ${etape.levier}`,
    quand: `${etape.jour} jour${etape.jour > 1 ? "s" : ""} après l’inscription.`,
    conditions: MARKETING_PROSPECT,
    rendu: await rendre(() => email.envoyerEtape(LEAD, etape)),
  });
}
groupes.push({
  fichier: "2-sequence-prospect-J1-J7.md",
  titre: "2. Séquence prospect — J1 à J7",
  intro: "La vente du guide « Les 7 erreurs », étalée sur 7 jours selon la structure CEO (rêve, échecs, peurs, doutes, ennemi, puis deux emails de closing). Le dernier paragraphe de chaque email est ajouté à l’envoi : il affiche le prix catalogue, ou la remise encore active pour la personne avec sa date de fin.",
  emails: prospect,
});

clientAvecAcces = true;
groupes.push({
  fichier: "3-apres-achat.md",
  titre: "3. Juste après un achat",
  intro: "Emails de service liés au paiement. Ils partent toujours, même pour quelqu’un qui s’est désinscrit des offres : ce sont ses accès et son reçu.",
  emails: [
    {
      cle: "acces", nom: "L’accès à l’espace",
      quand: "Immédiatement après le premier paiement, et à chaque demande de renvoi du lien.",
      conditions: "Toujours envoyé. C’est le seul email qui contient le lien personnel de l’espace.",
      rendu: await rendre(() => email.envoyerAcces(ACCES)),
    },
    {
      cle: "recu", nom: "Le reçu d’achat (exemple : le guide)",
      quand: "Immédiatement après chaque achat. Le nom du produit et le montant changent selon l’achat.",
      conditions: "Toujours envoyé. Pour le premier achat du guide, une copie cachée part vers Trustpilot pour l’invitation à laisser un avis.",
      rendu: await rendre(() => email.envoyerRecuAchat(ACCES, "front", PRODUCTS.front.price, "exemple")),
    },
  ],
});

const client = [];
for (const etape of SEQUENCE_CLIENT) {
  client.push({
    cle: "client-" + etape.cle, nom: `${etape.cle.toUpperCase()} — ${etape.objet(PRENOM)}`,
    quand: `${etape.jour} jour${etape.jour > 1 ? "s" : ""} après l’ouverture de l’espace.`,
    conditions: "Email de service : il part sans consentement marketing et ne vend rien.",
    rendu: await rendre(() => email.envoyerEtapeClient(ACCES, etape)),
  });
}
groupes.push({
  fichier: "4-prise-en-main-client.md",
  titre: "4. Prise en main du client — J1, J3, J7",
  intro: "Aider l’acheteur à ouvrir son guide et à faire une première action. Aucune proposition commerciale.",
  emails: client,
});

const complements = [];
for (const [sku, declenche] of [["upsell1", true], ["upsell2", true], ["bump", false], ["backend4", false]]) {
  complements.push({
    cle: "complement-" + sku, nom: `Complément — ${PRODUCTS[sku].name}${declenche ? "" : " (écrit, jamais déclenché aujourd’hui)"}`,
    quand: declenche ? "À partir de 10 jours après l’ouverture de l’espace." : "Jamais : le déclencheur actuel ne propose que le plan adapté ou l’assurance-vie.",
    conditions: "Un seul produit proposé, choisi selon les réponses au questionnaire et les produits déjà possédés. Le consentement marketing n’est exigé nulle part. Arrêt à 35 jours.",
    rendu: await rendre(() => email.envoyerComplement(LEAD, ACCES, sku, "ltv-v3-1", 0, PRODUCTS[sku].price)),
  });
}
complements.push({
  cle: "complement-rappel", nom: "Complément — le rappel (exemple : plan adapté)",
  quand: "À partir de 17 jours après l’ouverture de l’espace, et au moins 7 jours après le premier email de complément.",
  conditions: "Même produit que le premier email. Deux envois maximum, puis plus rien.",
  rendu: await rendre(() => email.envoyerComplement(LEAD, ACCES, "upsell1", "ltv-v3-2", 0, PRODUCTS.upsell1.price)),
});
groupes.push({
  fichier: "5-complements-J10-J17.md",
  titre: "5. Proposition d’un complément — J10 et J17",
  intro: "Après la prise en main, une proposition du produit suivant, montant calculé au moment de l’envoi (les achats déjà inclus sont déduits). Cliquer ne débite rien : la page de confirmation réaffiche le montant.",
  emails: complements,
});

/* ── Mise en forme ── */
const decoder = (h) => h
  .replace(/<br\s*\/?>/g, "  \n")
  .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&")
  .trim();

function lire(html) {
  const paragraphes = [...html.matchAll(/<p style="margin:0 0 16px;">([\s\S]*?)<\/p>/g)].map((m) => decoder(m[1]));
  const bouton = html.match(/<a href="([^"]+)" style="display:block[^"]*">([\s\S]*?)<\/a>/);
  const ps = html.match(/<p style="margin:22px[^"]*">([\s\S]*?)<\/p>/);
  return { paragraphes, bouton: bouton && { lien: bouton[1], texte: decoder(bouton[2]) }, ps: ps && decoder(ps[1]), prospect: html.includes("Me désinscrire") };
}

const expediteur = (from) => from.replace(/\s*<([^>]+)>/, " — $1");
const ancre = (cle) => cle;

function blocEmail(e) {
  const l = lire(e.rendu.html);
  return [
    `<a id="${ancre(e.cle)}"></a>`,
    `## ${e.nom}`,
    "",
    "| | |",
    "|---|---|",
    `| **Quand** | ${e.quand} |`,
    `| **Conditions** | ${e.conditions} |`,
    `| **Objet** | ${e.rendu.subject} |`,
    `| **Expéditeur** | ${expediteur(e.rendu.from)} |`,
    `| **Version illustrée** | [ouvrir l’email tel qu’il s’affiche](apercu-html/${e.cle}.html) |`,
    "",
    ...l.paragraphes.flatMap((p) => [p, ""]),
    l.bouton ? `**▶ Bouton : « ${l.bouton.texte} »** → ${l.bouton.lien}` : "",
    "",
    l.ps ? `_En bas du message :_  \n${l.ps}\n` : "",
    `_Pied de page : ${l.prospect ? "rappel de l’inscription + lien de désinscription" : "« Ce message concerne votre achat »"}, puis l’avertissement « guide pédagogique, ni consultation juridique, ni conseil fiscal ». Voir le README._`,
    "",
    "---",
    "",
  ].join("\n");
}

const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "long", timeStyle: "short" });
const avertissement = `> Généré le ${date} depuis le code du site (\`src/lib/email.ts\`, \`sequence.ts\`, \`sequence-client.ts\`). Ne modifiez pas ce fichier : modifiez le code, puis relancez l’export (voir le README).`;

fs.mkdirSync(path.join(sortie, "apercu-html"), { recursive: true });
for (const f of fs.readdirSync(path.join(sortie, "apercu-html"))) if (f.endsWith(".html")) fs.rmSync(path.join(sortie, "apercu-html", f));

for (const g of groupes) {
  const sommaire = g.emails.map((e) => `- [${e.nom}](#${ancre(e.cle)}) — _${e.rendu.subject}_`).join("\n");
  fs.writeFileSync(path.join(sortie, g.fichier), [`# ${g.titre}`, "", avertissement, "", g.intro, "", sommaire, "", "---", "", ...g.emails.map(blocEmail)].join("\n"));
  for (const e of g.emails) fs.writeFileSync(path.join(sortie, "apercu-html", e.cle + ".html"), e.rendu.html);
}

const lignes = groupes.flatMap((g) => g.emails.map((e) => `| ${e.quand} | [${e.nom}](${g.fichier}#${ancre(e.cle)}) | ${e.rendu.subject} |`));
const total = groupes.reduce((n, g) => n + g.emails.length, 0);
fs.writeFileSync(path.join(sortie, "README.md"), `# Tous les emails d’Héritage Intact

${avertissement}

Ce dossier contient **les ${total} emails** que le site peut envoyer, rendus par les vrais gabarits d’envoi : même texte, mêmes objets, mêmes boutons. À l’envoi, seuls changent le prénom, les liens personnels et, dans J1 à J7, la ligne de prix.

## Les 5 fichiers, dans l’ordre du parcours

${groupes.map((g) => `- **[${g.titre}](${g.fichier})** — ${g.intro}`).join("\n")}

Chaque email a aussi sa **version illustrée** dans \`apercu-html/\` : ouvrez le fichier dans un navigateur pour le voir comme dans une boîte de réception.

## Toute la chronologie

| Quand | Email | Objet |
|---|---|---|
${lignes.join("\n")}

## Ce qui part vraiment

| Emails | Condition d’envoi dans le code |
|---|---|
| Présentation (J0), accès, reçu | Toujours, dès l’évènement (inscription, paiement). |
| Prise en main client (J1, J3, J7) | Toujours. C1 est remis à l’envoi dès l’achat, délivré 3 h plus tard dans la fenêtre 9 h - 20 h ; C2 et C3 au passage quotidien (7 h UTC). |
| Séquence prospect J1 à J7 | Toujours. J1 est remis à l’envoi dès l’inscription, délivré 3 h plus tard dans la fenêtre 9 h - 20 h ; J2 à J7 au passage quotidien. |
| Compléments J10 et J17 | Toujours, au passage quotidien. Les interrupteurs \`EMAIL_MARKETING_ACTIVE\` et \`EMAIL_LTV_ACTIVE\` ont été retirés du code le 12/09/2026. |

Tous partent de **Héritage Intact — contact@heritageintact.fr**, et les réponses arrivent sur la même adresse.

## Le pied de chaque email

- **Prospect** (J1 à J7, compléments) : « Vous recevez ce message après votre demande sur heritageintact.fr » + le lien « Me désinscrire en un clic ».
- **Client** (accès, reçu, prise en main) : « Ce message concerne votre achat Héritage Intact et son utilisation. »
- **Dans tous** : « Héritage Intact est un guide pédagogique d’information générale. Il ne constitue ni une consultation juridique, ni un conseil fiscal personnalisé. »

## Modifier un email

| Pour changer… | Fichier à modifier (dans \`PROJET-HERITAGE-INTACT/site/\`) |
|---|---|
| J1 à J7 | \`src/lib/sequence.ts\` |
| Prise en main client | \`src/lib/sequence-client.ts\` |
| Présentation J0, accès, reçu, compléments, ligne de prix | \`src/lib/email.ts\` |

Puis régénérez ce dossier, depuis \`PROJET-HERITAGE-INTACT/site/\` :

\`\`\`
node scripts/exporter-emails.mjs
\`\`\`
`);

console.log(`${total} emails exportés dans ${sortie}`);
