import { CONTACT_EMAIL, PRODUCTS, SITE_URL, euros, urlEspace, type ProductSku } from "./config";
import type { Acces, Lead } from "./db";
import { SEQUENCE, lien, type Etape } from "./sequence";
import type { EtapeClient } from "./sequence-client";

/**
 * Envoi d'emails via Resend.
 *
 * Pas de SDK : l'API tient en un POST, et une dépendance de moins est une
 * dépendance qui ne casse pas au prochain build.
 *
 * ⚠️ La clé est une clé « sending only » : elle peut envoyer, elle ne peut ni
 * lire les domaines ni créer d'autres clés. C'est le bon réglage, on le garde.
 */
const API = "https://api.resend.com/emails";

/** Sans clé (développement local), on n'envoie rien et on ne casse rien. */
const CLE = process.env.RESEND_API_KEY;

/**
 * L'expéditeur.
 *
 * Le nom affiché est « un prénom — une marque », comme tranché dans
 * `09-emails.md` : les emails sont écrits à la première personne, un expéditeur
 * impersonnel les contredirait, et l'expéditeur pèse autant que l'objet dans la
 * décision d'ouvrir.
 *
 * Les réponses partent ailleurs : `reply_to` pointe sur CONTACT_EMAIL, la boîte
 * réellement relevée (Zoho).
 *
 * ⚠️ L'adresse devrait être sur le **sous-domaine d'envoi**
 * `info.heritageintact.fr` : une séquence qui prend des plaintes abîmerait alors
 * la réputation de `info.` seulement, et le courrier humain de la racine
 * continuerait d'arriver. Le DNS du sous-domaine est complet et vérifié, mais
 * Resend refuse encore d'y envoyer (403). Le détail du diagnostic et la marche à
 * suivre sont dans `.env.local`, et `pnpm emails:verifier` dit où on en est.
 */
export const EXPEDITEUR =
  process.env.EMAIL_FROM ?? "Loys — Héritage Intact <loys@heritageintact.fr>";

/** Lien de désinscription propre à chaque inscrit. L'identifiant suffit : il est aléatoire. */
export const lienDesinscription = (leadId: string) => `${SITE_URL}/desinscription?id=${leadId}`;

/** L'adresse du site telle qu'on l'écrit à un lecteur : sans le protocole. */
const adresseLisible = SITE_URL.replace(/^https?:\/\//, "");

type Envoi = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /**
   * Sert au lien de désinscription en un clic. Absent pour un email
   * transactionnel : le destinataire n'est plus un inscrit, c'est un client,
   * et il n'existe aucune ligne `leads` derrière lui.
   */
  leadId?: string;
  /**
   * ⚠️ « marketing » par défaut, donc les deux appelants historiques
   * (`envoyerLivraison`, `envoyerEtape`) ne changent pas d'un iota.
   *
   * « transactionnel » = ses accès, son reçu, sa rassurance post-achat. On ne
   * propose à personne de se désabonner de ce qu'il vient de payer, et le
   * drapeau `desabonne` d'un lead ne bloque JAMAIS ce type d'envoi.
   */
  type?: "marketing" | "transactionnel";
};

/**
 * Envoie un email. Ne lève jamais : un incident chez Resend ne doit pas faire
 * échouer une inscription, ni annuler une livraison, ni interrompre le passage
 * du cron.
 */
export async function envoyer(e: Envoi): Promise<{ ok: boolean; id?: string }> {
  if (!CLE) {
    console.log(`[email] pas de clé, envoi simulé vers ${e.to} — « ${e.subject} »`);
    return { ok: true };
  }
  // Les deux en-têtes de désinscription vont ENSEMBLE, et seulement sur du
  // marketing. Sur un email transactionnel, ils proposeraient au client de se
  // couper de ses propres accès.
  const enTetes =
    e.type === "transactionnel" || !e.leadId
      ? undefined
      : {
          // Désinscription en un clic. Les deux en-têtes vont ensemble : sans
          // le -Post, Gmail affiche un lien ordinaire ; avec, il affiche son
          // propre bouton « Se désabonner » à côté de l'expéditeur. C'est le
          // meilleur rempart contre le bouton « Spam », qui lui coûte cher.
          // Exigé par Gmail et Yahoo dès 5 000 envois par jour.
          "List-Unsubscribe": `<${lienDesinscription(e.leadId)}>, <mailto:${CONTACT_EMAIL}?subject=Desinscription>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        };
  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${CLE}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: EXPEDITEUR,
        to: [e.to],
        reply_to: CONTACT_EMAIL,
        subject: e.subject,
        html: e.html,
        text: e.text,
        ...(enTetes ? { headers: enTetes } : {}),
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("[email] refus de Resend", data);
      return { ok: false };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] envoi impossible", err);
    return { ok: false };
  }
}

/* ─────────────────────────────────────────────────────────────────
   Le gabarit.

   Tableau, styles en ligne, gros caractères, un seul bouton. C'est ce
   qui passe partout, y compris dans les vieux Outlook et sur les
   téléphones de 2016 — et notre lecteur a 67 ans.
   ───────────────────────────────────────────────────────────── */

/**
 * Le pied de page, et il y en a deux.
 *
 * « prospect » : la provenance est l'inscription à la vidéo, et le lien de
 * désinscription est obligatoire.
 *
 * « client » : la provenance est un achat. Écrire à un acheteur « vous avez
 * demandé la vidéo » est faux, et lui proposer de se désinscrire de ses propres
 * accès est pire. L'avertissement juridique, lui, reste dans les DEUX cas : il
 * est obligatoire dans chaque email.
 *
 * Le `leadId` n'existe que dans la branche « prospect » — c'est le type qui
 * l'impose, pas une convention.
 */
type Pied = { pied: "prospect"; leadId: string } | { pied: "client" };

type Contenu = {
  titre: string;
  paragraphes: string[];
  bouton: { texte: string; lien: string };
  ps?: string;
} & Pied;

function gabarit(o: Contenu): string {
  const { titre, paragraphes, bouton, ps } = o;
  const corps = paragraphes.map((t) => `      <p style="margin:0 0 16px;">${t}</p>`).join("\n");
  const provenance =
    o.pied === "prospect"
      ? `Vous recevez ce message parce que vous avez demandé la vidéo sur ${adresseLisible}.<br>
      <a href="${lienDesinscription(o.leadId)}" style="color:#0b5aa8;">Me désinscrire en un clic</a> — c'est immédiat et définitif.`
      : "Vous recevez ce message parce que vous avez commandé La Méthode Héritage Intact.";

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${titre}</title></head>
<body style="margin:0;padding:0;background:#f0f3f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f6;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #c8d0da;">
    <tr><td style="background:#12365e;padding:16px 24px;">
      <span style="font:bold 17px Arial,Helvetica,sans-serif;color:#ffffff;letter-spacing:2px;">HÉRITAGE</span>
      <span style="font:bold 17px Arial,Helvetica,sans-serif;color:#e8730c;letter-spacing:2px;"> INTACT</span>
    </td></tr>
    <tr><td style="padding:28px 24px;font:17px/1.6 Arial,Helvetica,sans-serif;color:#222222;">
${corps}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;"><tr>
        <td style="background:#e8730c;border-bottom:4px solid #c25f06;">
          <a href="${bouton.lien}" style="display:block;padding:16px 28px;font:bold 17px Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;">${bouton.texte}</a>
        </td>
      </tr></table>
${ps ? `      <p style="margin:22px 0 0;padding-top:16px;border-top:1px solid #e1e6ec;font:15px/1.6 Arial,Helvetica,sans-serif;color:#555555;">${ps}</p>` : ""}
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f0f3f6;font:13px/1.6 Arial,Helvetica,sans-serif;color:#555555;">
      ${provenance}<br><br>
      Héritage Intact est une méthode pédagogique d'information générale. Elle ne constitue ni une
      consultation juridique, ni un conseil fiscal personnalisé.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

/** Même contenu, en texte brut. Un email sans partie texte part plus souvent en indésirable. */
function versionTexte(o: Contenu) {
  const nettoyer = (t: string) => t.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  const provenance =
    o.pied === "prospect"
      ? [
          `Vous recevez ce message parce que vous avez demandé la vidéo sur ${adresseLisible}.`,
          `Me désinscrire : ${lienDesinscription(o.leadId)}`,
        ]
      : ["Vous recevez ce message parce que vous avez commandé La Méthode Héritage Intact."];
  return [
    ...o.paragraphes.map(nettoyer),
    `${o.bouton.texte} :\n${o.bouton.lien}`,
    ...(o.ps ? [nettoyer(o.ps)] : []),
    "--",
    ...provenance,
    "Héritage Intact est une méthode pédagogique d'information générale. Elle ne constitue ni une consultation juridique, ni un conseil fiscal personnalisé.",
  ].join("\n\n");
}

/* ─────────────────────────────────────────────────────────────────
   J0 — la livraison. Part à la seconde où l'inscription est faite.
   ───────────────────────────────────────────────────────────── */
export async function envoyerLivraison(lead: Lead) {
  const p = lead.firstName.trim() || "Bonjour";
  const bouton = { texte: "Regarder la vidéo", lien: lien("/methode") };
  const paragraphes = [
    `Bonjour ${p},`,
    "Voici votre lien vers la présentation. Elle est accessible tout de suite, et elle le restera.",
    "Elle montre les trois décisions que les familles averties prennent de leur vivant pour transmettre intact ce qu'elles ont construit — et pourquoi personne ne vous les a jamais expliquées.",
    "Un conseil&nbsp;: regardez-la au calme, avec votre conjoint si possible. Elle contient un chiffre, <strong>82&nbsp;194&nbsp;€</strong>, et trois dates. L'une des trois vous concerne plus que les deux autres. Vous saurez laquelle à la fin.",
  ];
  const ps =
    "<strong>P.-S.</strong> Ajoutez cette adresse à vos contacts. Les prochains messages contiennent les trois dates, et sans ça ils finissent parfois dans les indésirables.";

  const contenu: Contenu = {
    titre: "Votre accès à la vidéo",
    paragraphes,
    bouton,
    ps,
    pied: "prospect",
    leadId: lead.id,
  };

  return envoyer({
    to: lead.email,
    leadId: lead.id,
    subject: `Votre accès à la vidéo, ${p}`,
    html: gabarit(contenu),
    text: versionTexte(contenu),
  });
}

/* ─────────────────────────────────────────────────────────────────
   J1 à J7 — une étape de la séquence.
   ───────────────────────────────────────────────────────────── */
export async function envoyerEtape(lead: Lead, etape: Etape) {
  const p = lead.firstName.trim() || "Bonjour";
  const bouton = { texte: etape.bouton.texte, lien: lien(etape.bouton.chemin) };
  const paragraphes = etape.corps(p);

  const contenu: Contenu = {
    titre: etape.objet(p),
    paragraphes,
    bouton,
    ps: etape.ps,
    pied: "prospect",
    leadId: lead.id,
  };

  return envoyer({
    to: lead.email,
    leadId: lead.id,
    subject: etape.objet(p),
    html: gabarit(contenu),
    text: versionTexte(contenu),
  });
}

/**
 * L'étape due pour cet inscrit aujourd'hui, s'il y en a une.
 * On n'en renvoie qu'UNE par passage : deux emails le même jour sur un
 * domaine jeune, c'est le meilleur moyen de finir en indésirable.
 */
export function etapeDue(lead: Lead, maintenant = Date.now()): Etape | null {
  const jours = Math.floor((maintenant - new Date(lead.createdAt).getTime()) / 86_400_000);
  const faites = new Set(lead.envoyes ?? []);
  return SEQUENCE.find((e) => e.jour <= jours && !faites.has(e.cle)) ?? null;
}

/* ═════════════════════════════════════════════════════════════════
   LES EMAILS DU CLIENT — transactionnels, tous sans exception

   ⚠️ `desabonne` NE BLOQUE JAMAIS AUCUN DE CES ENVOIS. Ce n'est pas un
   oubli à corriger : ce sont ses accès, son reçu et sa rassurance. Un
   client qui s'est désinscrit de la séquence prospect a le droit de
   recevoir le lien de ce qu'il a payé, et il est même exigible qu'il le
   reçoive (les CGV promettent l'accès par email).

   Structurellement, le désabonnement ne peut d'ailleurs pas s'appliquer :
   ces fonctions prennent un `Acces`, jamais un `Lead`, et `Acces` ne
   porte pas ce drapeau.
   ═══════════════════════════════════════════════════════════════ */

/** Le tronc commun des trois : même gabarit, même pied, même type d'envoi. */
async function envoyerAuClient(
  acces: Acces,
  o: {
    objet: string;
    paragraphes: string[];
    bouton: { texte: string; lien: string };
    ps?: string;
  },
): Promise<{ ok: boolean }> {
  const contenu: Contenu = {
    titre: o.objet,
    paragraphes: o.paragraphes,
    bouton: o.bouton,
    ps: o.ps,
    pied: "client",
  };
  return envoyer({
    to: acces.email,
    type: "transactionnel",
    subject: o.objet,
    html: gabarit(contenu),
    text: versionTexte(contenu),
  });
}

/**
 * L'EMAIL LE PLUS IMPORTANT DU PROJET.
 *
 * Un acheteur de 74 ans qui ne le reçoit pas, ou qui le reçoit et n'y comprend
 * rien, demande un remboursement le jour même. Trois décisions en découlent :
 *
 *   — un seul bouton, et rien d'autre à décider ;
 *   — le lien écrit AUSSI en toutes lettres, parce qu'il lit sur le téléphone
 *     et travaille sur l'ordinateur, et qu'il va le recopier à la main ;
 *   — la phrase « il n'y a pas de mot de passe » en gras, parce que c'est la
 *     première question qu'il se posera, et que la chercher le fera renoncer.
 *
 * ⚠️ Cet email n'est jamais le seul filet : le lien est également affiché en
 * clair sur /merci. Sans `RESEND_API_KEY`, `envoyer()` renvoie `{ ok: true }`
 * sans rien expédier — et c'est l'écran de /merci, lui seul, qui sauve alors
 * l'accès.
 */
export async function envoyerAcces(acces: Acces): Promise<{ ok: boolean }> {
  const p = acces.firstName.trim() || "Bonjour";
  const url = urlEspace(acces.jeton);
  const paragraphes = [
    `Bonjour ${p},`,
    "Votre espace est ouvert. Tout ce que vous avez commandé s'y trouve, sur une seule page, et vous pouvez y revenir autant de fois que vous le souhaitez.",
    "<strong>Il n'y a pas de mot de passe. Ce lien est votre clé, et il ne s'arrêtera jamais de fonctionner.</strong>",
    "Commencez par l'étape 0&nbsp;: votre facture invisible, en 12 minutes. Le reste viendra après, dans l'ordre.",
  ];
  // Le lien en toutes lettres est placé APRÈS le bouton, dans le bloc du bas :
  // c'est là que regarde quelqu'un pour qui le bouton n'a pas fonctionné.
  const ps = `Votre lien, écrit en toutes lettres, si le bouton ne fonctionne pas&nbsp;:<br><strong>${url}</strong><br><br><strong>P.-S.</strong> Si vous perdez cet email un jour, ce n'est pas grave&nbsp;: allez sur ${adresseLisible}/espace et indiquez votre adresse, le lien repart tout de suite.`;

  return envoyerAuClient(acces, {
    objet: `Votre accès, ${p} — gardez cet email`,
    paragraphes,
    bouton: { texte: "Ouvrir mon espace", lien: url },
    ps,
  });
}

/** Une étape de la séquence de rassurance post-achat. Ne vend rien, jamais. */
export async function envoyerEtapeClient(
  acces: Acces,
  etape: EtapeClient,
): Promise<{ ok: boolean }> {
  const p = acces.firstName.trim() || "Bonjour";
  return envoyerAuClient(acces, {
    objet: etape.objet(p),
    paragraphes: etape.corps(p, urlEspace(acces.jeton)),
    bouton: { texte: etape.bouton.texte, lien: lien(etape.bouton.chemin(acces.jeton)) },
    ps: etape.ps,
  });
}

/**
 * Le reçu d'un achat fait depuis l'espace. Part IMMÉDIATEMENT.
 *
 * ⚠️ Ce n'est pas une politesse comptable, c'est le filet anti-fraude du lien
 * portant. Le jeton fuit par des canaux que le code ne couvre pas — un
 * ordinateur familial, un email transféré à un enfant, une capture d'écran
 * envoyée au support. Si quelqu'un d'autre déclenche un débit, c'est le
 * propriétaire de la carte qui est prévenu dans la minute, et il peut dire
 * non tout de suite.
 */
export async function envoyerRecuAchat(
  acces: Acces,
  sku: ProductSku,
  montant: number,
): Promise<{ ok: boolean }> {
  const p = acces.firstName.trim() || "Bonjour";
  const produit = PRODUCTS[sku];
  const paragraphes = [
    `Bonjour ${p},`,
    `C'est ajouté à votre espace&nbsp;: <strong>${produit.name}</strong>, ${euros(montant)}.`,
    "Vous le retrouverez dans votre espace, plus bas sur la page, avec le reste de vos documents.",
    "Garantie 30 jours&nbsp;: si cela ne vous sert pas, un message suffit et vous êtes remboursé, sans justification à fournir.",
    "<strong>Vous n'êtes pas à l'origine de cet achat&nbsp;?</strong> Répondez simplement à ce message&nbsp;: nous l'annulons et nous vous remboursons, sans discussion.",
  ];

  return envoyerAuClient(acces, {
    objet: `Votre reçu — ${produit.name}`,
    paragraphes,
    bouton: { texte: "Ouvrir mon espace", lien: urlEspace(acces.jeton) },
  });
}

export const _SITE_URL = SITE_URL;
