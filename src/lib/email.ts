import { CONTACT_EMAIL, SITE_URL } from "./config";

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

export const EXPEDITEUR = process.env.EMAIL_FROM ?? `Héritage Intact <contact@heritageintact.fr>`;

type Envoi = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Envoie un email. Ne lève jamais : un incident chez Resend ne doit pas faire
 * échouer une inscription. On journalise et on continue.
 */
export async function envoyer(e: Envoi): Promise<{ ok: boolean; id?: string }> {
  if (!CLE) {
    console.log(`[email] pas de clé, envoi simulé vers ${e.to} — « ${e.subject} »`);
    return { ok: true };
  }
  try {
    const r = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EXPEDITEUR,
        to: [e.to],
        reply_to: CONTACT_EMAIL,
        subject: e.subject,
        html: e.html,
        text: e.text,
        headers: {
          // Exigé par Gmail et Yahoo dès 5 000 envois par jour, et bon pour la
          // réputation bien avant ce seuil : un lien de désinscription lisible
          // par la messagerie elle-même vaut mieux qu'un signalement en spam.
          "List-Unsubscribe": `<mailto:${CONTACT_EMAIL}?subject=Desinscription>`,
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
  corps,
  bouton,
  ps,
}: {
  titre: string;
  corps: string;
  bouton: { texte: string; lien: string };
  ps?: string;
}): string {
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
${ps ? `<p style="margin:22px 0 0;padding-top:16px;border-top:1px solid #e1e6ec;font:15px/1.6 Arial,Helvetica,sans-serif;color:#555555;">${ps}</p>` : ""}
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f0f3f6;font:13px/1.6 Arial,Helvetica,sans-serif;color:#555555;">
      Vous recevez ce message parce que vous avez demandé la vidéo sur heritageintact.fr.<br>
      Pour ne plus rien recevoir, répondez simplement « stop » à cet email&nbsp;:
      <a href="mailto:${CONTACT_EMAIL}?subject=Desinscription" style="color:#0b5aa8;">${CONTACT_EMAIL}</a>.<br><br>
      Héritage Intact est un programme pédagogique d'information générale. Il ne constitue ni une
      consultation juridique, ni un conseil fiscal personnalisé.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

/* ─────────────────────────────────────────────────────────────────
   J0 — la livraison. Part à la seconde où le lead s'inscrit.
   Texte repris de `09-emails.md` § J0, signé au nom de la marque et
   non d'une personne (décision éditoriale, cf. 15-identite-visuelle.md).
   ───────────────────────────────────────────────────────────── */
export async function envoyerLivraison(prenom: string, email: string) {
  const lien = `${SITE_URL}/methode`;
  const p = prenom.trim() || "Bonjour";

  const corps = `
      <p style="margin:0 0 16px;">Bonjour ${p},</p>
      <p style="margin:0 0 16px;">Voici votre lien vers la présentation de 9 minutes. Elle est accessible tout de suite, et elle le restera.</p>
      <p style="margin:0 0 16px;">Elle montre les trois décisions que les familles averties prennent de leur vivant pour transmettre intact ce qu'elles ont construit — et pourquoi personne ne vous les a jamais expliquées.</p>
      <p style="margin:0 0 16px;">Un conseil&nbsp;: regardez-la ce soir, avec votre conjoint si possible. Elle contient un chiffre, <strong>82&nbsp;194&nbsp;€</strong>, et trois dates. L'une des trois vous concerne plus que les deux autres. Vous saurez laquelle à la fin.</p>`;

  const ps = `<strong>P.-S.</strong> Ajoutez cette adresse à vos contacts. Les prochains messages contiennent les trois dates, et sans ça ils finissent parfois dans les indésirables.`;

  const text = `Bonjour ${p},

Voici votre lien vers la présentation de 9 minutes :
${lien}

Elle montre les trois décisions que les familles averties prennent de leur vivant pour transmettre intact ce qu'elles ont construit — et pourquoi personne ne vous les a jamais expliquées.

Un conseil : regardez-la ce soir, avec votre conjoint si possible. Elle contient un chiffre, 82 194 €, et trois dates. L'une des trois vous concerne plus que les deux autres. Vous saurez laquelle à la fin.

P.-S. Ajoutez cette adresse à vos contacts. Les prochains messages contiennent les trois dates, et sans ça ils finissent parfois dans les indésirables.

--
Vous recevez ce message parce que vous avez demandé la vidéo sur heritageintact.fr.
Pour ne plus rien recevoir, répondez « stop » à cet email : ${CONTACT_EMAIL}`;

  return envoyer({
    to: email,
    subject: `Votre accès à la vidéo, ${p}`,
    html: gabarit({
      titre: "Votre accès à la vidéo",
      corps,
      bouton: { texte: "Regarder la vidéo de 9 minutes", lien },
      ps,
    }),
    text,
  });
}
