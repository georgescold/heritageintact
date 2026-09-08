import { CONTACT_EMAIL, SITE_URL } from "./config";
import type { Lead } from "./db";
import { SEQUENCE, lien, type Etape } from "./sequence";

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

type Envoi = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Sert au lien de désinscription en un clic. */
  leadId: string;
};

/**
 * Envoie un email. Ne lève jamais : un incident chez Resend ne doit pas faire
 * échouer une inscription ni interrompre le passage du cron.
 */
export async function envoyer(e: Envoi): Promise<{ ok: boolean; id?: string }> {
  if (!CLE) {
    console.log(`[email] pas de clé, envoi simulé vers ${e.to} — « ${e.subject} »`);
    return { ok: true };
  }
  const url = lienDesinscription(e.leadId);
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
        headers: {
          // Désinscription en un clic. Les deux en-têtes vont ensemble : sans
          // le -Post, Gmail affiche un lien ordinaire ; avec, il affiche son
          // propre bouton « Se désabonner » à côté de l'expéditeur. C'est le
          // meilleur rempart contre le bouton « Spam », qui lui coûte cher.
          // Exigé par Gmail et Yahoo dès 5 000 envois par jour.
          "List-Unsubscribe": `<${url}>, <mailto:${CONTACT_EMAIL}?subject=Desinscription>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
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
function gabarit({
  titre,
  paragraphes,
  bouton,
  ps,
  leadId,
}: {
  titre: string;
  paragraphes: string[];
  bouton: { texte: string; lien: string };
  ps?: string;
  leadId: string;
}): string {
  const corps = paragraphes.map((t) => `      <p style="margin:0 0 16px;">${t}</p>`).join("\n");
  const desinscription = lienDesinscription(leadId);

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
      Vous recevez ce message parce que vous avez demandé la vidéo sur heritageintact.fr.<br>
      <a href="${desinscription}" style="color:#0b5aa8;">Me désinscrire en un clic</a> — c'est immédiat et définitif.<br><br>
      Héritage Intact est une méthode pédagogique d'information générale. Elle ne constitue ni une
      consultation juridique, ni un conseil fiscal personnalisé.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

/** Même contenu, en texte brut. Un email sans partie texte part plus souvent en indésirable. */
function versionTexte(
  paragraphes: string[],
  bouton: { texte: string; lien: string },
  ps: string | undefined,
  leadId: string,
) {
  const nettoyer = (t: string) => t.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  return [
    ...paragraphes.map(nettoyer),
    `${bouton.texte} :\n${bouton.lien}`,
    ...(ps ? [nettoyer(ps)] : []),
    "--",
    "Vous recevez ce message parce que vous avez demandé la vidéo sur heritageintact.fr.",
    `Me désinscrire : ${lienDesinscription(leadId)}`,
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

  return envoyer({
    to: lead.email,
    leadId: lead.id,
    subject: `Votre accès à la vidéo, ${p}`,
    html: gabarit({ titre: "Votre accès à la vidéo", paragraphes, bouton, ps, leadId: lead.id }),
    text: versionTexte(paragraphes, bouton, ps, lead.id),
  });
}

/* ─────────────────────────────────────────────────────────────────
   J1 à J7 — une étape de la séquence.
   ───────────────────────────────────────────────────────────── */
export async function envoyerEtape(lead: Lead, etape: Etape) {
  const p = lead.firstName.trim() || "Bonjour";
  const bouton = { texte: etape.bouton.texte, lien: lien(etape.bouton.chemin) };
  const paragraphes = etape.corps(p);

  return envoyer({
    to: lead.email,
    leadId: lead.id,
    subject: etape.objet(p),
    html: gabarit({
      titre: etape.objet(p),
      paragraphes,
      bouton,
      ps: etape.ps,
      leadId: lead.id,
    }),
    text: versionTexte(paragraphes, bouton, etape.ps, lead.id),
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

export const _SITE_URL = SITE_URL;
