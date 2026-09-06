/**
 * Vérifie que l'envoi d'emails est réellement branché.
 *
 *   pnpm emails:verifier
 *
 * Trois choses sont contrôlées, dans l'ordre où elles cassent :
 *
 *   1. le DNS du domaine d'envoi (SPF, DKIM, DMARC, MX de retour) ;
 *   2. la permission réelle de la clé Resend, en tentant un envoi vers
 *      l'adresse simulateur `delivered@resend.dev` — personne ne reçoit rien ;
 *   3. le DMARC du domaine racine, exigé par Gmail et Yahoo des expéditeurs
 *      en volume, et qui protège aussi la marque contre l'usurpation.
 *
 * Ne dépend de rien : ni SDK, ni dotenv. Lit `.env.local` à la main.
 */
import { readFileSync } from "node:fs";
import { resolveTxt, resolveMx } from "node:dns/promises";

const RACINE = "heritageintact.fr";
const SOUS_DOMAINE = `info.${RACINE}`;
const SIMULATEUR = "delivered@resend.dev";

const V = "✓";
const X = "✗";
const T = "!";

/* ── .env.local, sans dépendance ────────────────────────────────────── */
function env() {
  let brut;
  try {
    brut = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    console.error(`${X} .env.local introuvable.`);
    process.exit(1);
  }
  const out = {};
  for (const ligne of brut.split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(ligne.trim());
    if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
  }
  return out;
}

const txt = async (nom) => {
  try {
    return (await resolveTxt(nom)).map((morceaux) => morceaux.join(""));
  } catch {
    return [];
  }
};

const mx = async (nom) => {
  try {
    return (await resolveMx(nom)).map((r) => r.exchange);
  } catch {
    return [];
  }
};

/** Les quatre enregistrements que Resend pose sur un domaine d'envoi. */
async function dns(domaine) {
  const [spf, dkim, dmarc, retour] = await Promise.all([
    txt(`send.${domaine}`),
    txt(`resend._domainkey.${domaine}`),
    txt(`_dmarc.${domaine}`),
    mx(`send.${domaine}`),
  ]);
  const lignes = [
    [spf.some((s) => s.includes("amazonses.com")), "SPF", `send.${domaine}`],
    [dkim.some((s) => s.startsWith("p=")), "DKIM", `resend._domainkey.${domaine}`],
    [dmarc.some((s) => s.startsWith("v=DMARC1")), "DMARC", `_dmarc.${domaine}`],
    [retour.some((s) => s.includes("amazonses.com")), "MX retour", `send.${domaine}`],
  ];
  console.log(`\n  DNS de ${domaine}`);
  for (const [ok, nom, ou] of lignes) {
    console.log(`    ${ok ? V : X} ${nom.padEnd(10)} ${ou}`);
  }
  return lignes.every(([ok]) => ok);
}

/**
 * Tente un envoi réel vers l'adresse simulateur de Resend.
 * C'est le seul moyen de connaître la permission d'une clé « sending only » :
 * elle n'a pas le droit de lister les domaines.
 */
async function permission(cle, expediteur) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/json",
      // Sans User-Agent explicite, Cloudflare renvoie un 403 « error code: 1010 »
      // qui n'a rien à voir avec Resend et fait perdre un quart d'heure.
      "User-Agent": "heritage-intact/1.0 (+https://www.heritageintact.fr)",
    },
    body: JSON.stringify({
      from: expediteur,
      to: [SIMULATEUR],
      subject: "Controle technique",
      text: "Envoi de controle vers l'adresse simulateur de Resend.",
    }),
  });
  const corps = await r.text();
  return { ok: r.ok, code: r.status, corps: corps.slice(0, 200) };
}

const e = env();
const cle = e.RESEND_API_KEY;
const expediteur = e.EMAIL_FROM;

console.log("\n─── Contrôle de l'envoi d'emails ───────────────────────────");

if (!cle) {
  console.log(`\n  ${X} RESEND_API_KEY absente : aucun email ne partira.`);
  process.exit(1);
}
console.log(`\n  Expéditeur configuré : ${expediteur}`);

await dns(SOUS_DOMAINE);
await dns(RACINE);

const dmarcRacine = await txt(`_dmarc.${RACINE}`);
console.log(
  `\n  ${dmarcRacine.length ? V : T} DMARC du domaine racine ${
    dmarcRacine.length
      ? "présent"
      : `ABSENT — Gmail et Yahoo l'exigent des expéditeurs en volume.\n      À ajouter dans le DNS Vercel : TXT sur _dmarc.${RACINE}\n      valeur : v=DMARC1; p=none; rua=mailto:contact@${RACINE}`
  }`,
);

console.log("\n  Permission réelle de la clé (envoi vers le simulateur Resend) :");
for (const [nom, adresse] of [
  ["racine        ", `Controle <controle@${RACINE}>`],
  ["sous-domaine  ", `Controle <controle@${SOUS_DOMAINE}>`],
]) {
  const r = await permission(cle, adresse);
  console.log(`    ${r.ok ? V : X} ${nom} HTTP ${r.code}  ${r.ok ? "autorisé" : r.corps}`);
}

const config = await permission(cle, expediteur);
console.log(
  `\n  ${config.ok ? V : X} L'expéditeur configuré ${config.ok ? "fonctionne." : "EST REFUSÉ — aucun email ne partira."}`,
);
if (!config.ok) console.log(`      ${config.corps}`);
console.log("");
process.exit(config.ok ? 0 : 1);
