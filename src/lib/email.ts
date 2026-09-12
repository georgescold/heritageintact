import { empreinte, reserverEmail, terminerEmail } from "./mail-journal";
import { accesParEmail, getLead, promotionParEmail } from "./db";
import { palier, appliquerRemise } from "./promotions";
import { CONTACT_EMAIL, PRODUCTS, SITE_URL, TRUSTPILOT_INVITE_BCC, euros, urlEspace, type ProductSku } from "./config";
import type { Acces, Lead } from "./db";
import { SEQUENCE, lien, type Etape } from "./sequence";
import type { EtapeClient } from "./sequence-client";

/** L’acceptation fournisseur ne prouve pas le placement en boîte de réception. */
const API = "https://api.resend.com/emails";

/** Sans clé (développement local), on n'envoie rien et on ne casse rien. */
const CLE = process.env.RESEND_API_KEY;

/** L’acceptation fournisseur ne prouve pas le placement en boîte de réception. */
export const EXPEDITEUR =
  process.env.EMAIL_FROM ?? "Héritage Intact <contact@heritageintact.fr>";

/** Lien de désinscription propre à chaque inscrit. L'identifiant suffit : il est aléatoire. */
export const lienDesinscription = (leadId: string) => `${SITE_URL}/desinscription?id=${leadId}`;

/** L'adresse du site telle qu'on l'écrit à un lecteur : sans le protocole. */
const adresseLisible = SITE_URL.replace(/^https?:\/\//, "");

type Envoi = {
  to: string;
  /** Réservé à l’invitation Trustpilot déclenchée par un achat réel. */
  bcc?: string;
  cle?: string;
  subject: string;
  html: string;
  text: string;
  /**
   * Sert au lien de désinscription en un clic. Absent pour un email
   * transactionnel : le destinataire n'est plus un inscrit, c'est un client,
   * et il n'existe aucune ligne `leads` derrière lui.
   */
  leadId?: string;
  /** L’acceptation fournisseur ne prouve pas le placement en boîte de réception. */
  type?: "marketing" | "transactionnel";
};

/**
 * Envoie un email. Ne lève jamais : un incident chez Resend ne doit pas faire
 * échouer une inscription, ni annuler une livraison, ni interrompre le passage
 * du cron.
 */
export async function envoyer(e: Envoi): Promise<{ ok: boolean; id?: string; simule?: boolean }> {
  // Une absence de configuration ne doit jamais être consignée comme un envoi réussi.
  if (!CLE) {
    console.info("[email] envoi non effectué : service absent");
    return { ok: false, simule: !process.env.VERCEL && process.env.NODE_ENV !== "production" };
  }
  const marketing = e.type !== "transactionnel";
  try {
  if (marketing) {
    if (!e.leadId) return { ok: false };
    const actuel = await getLead(e.leadId);
    if (!actuel || actuel.desabonne || actuel.marketingConsent !== true || actuel.email !== e.to) return { ok: false };
  }
  } catch { return {ok:false}; }
  const headers = marketing && e.leadId ? {
    "List-Unsubscribe": `<${SITE_URL}/api/desinscription?id=${encodeURIComponent(e.leadId)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  } : undefined;
  const body = JSON.stringify({ from: EXPEDITEUR, to: [e.to], ...(e.bcc ? {bcc:[e.bcc]} : {}), reply_to: CONTACT_EMAIL,
    subject: e.subject, html: e.html, text: e.text, ...(headers ? {headers} : {}) });
  const cle = empreinte(e.cle ?? `demande/${Math.floor(Date.now()/120000)}/${body}`);
  try {
    const reservation = await reserverEmail(cle, e.to, body, marketing);
    if (reservation === "deja") return {ok:true};
    if (reservation !== "envoyer") return {ok:false};
    const r = await fetch(API, {
      method:"POST", signal: AbortSignal.timeout(12000),
      headers:{ Authorization:`Bearer ${CLE}`, "Content-Type":"application/json", "Idempotency-Key":cle },
      body,
    });
    const data = await r.json();
    if (!r.ok || typeof data.id !== "string") {
      await terminerEmail(cle, r.status === 429 || r.status >= 500 ? "reessayer" : "refuse");
      console.error("[email] refus fournisseur", {status:r.status, cle});
      return {ok:false};
    }
    await terminerEmail(cle,"accepte",data.id);
    return {ok:true,id:data.id};
  } catch {
    // Résultat ambigu : même clé et même corps au prochain essai ; arrêt après 23 h.
    try { await terminerEmail(cle,"reessayer"); } catch {}
    console.error("[email] envoi non confirmé", {cle});
    return {ok:false};
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

function echapper(v: string) { return v.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]!)); }
function gabarit(o: Contenu): string {
  const { titre, paragraphes, bouton, ps } = o;
  const corps = paragraphes.map((t) => `      <p style="margin:0 0 16px;">${t}</p>`).join("\n");
  const provenance =
    o.pied === "prospect"
      ? `Vous recevez ce message après votre demande sur ${adresseLisible}.<br>
      <a href="${lienDesinscription(o.leadId)}" style="color:#0b5aa8;">Me désinscrire en un clic</a> — c'est immédiat et définitif.`
      : "Ce message concerne votre achat Héritage Intact et son utilisation.";

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
      Héritage Intact est un guide pédagogique d'information générale. Il ne constitue ni une
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
          `Vous recevez ce message après votre demande sur ${adresseLisible}.`,
          `Me désinscrire : ${lienDesinscription(o.leadId)}`,
        ]
      : ["Ce message concerne votre achat Héritage Intact et son utilisation."];
  return [
    ...o.paragraphes.map(nettoyer),
    `${o.bouton.texte} :\n${o.bouton.lien}`,
    ...(o.ps ? [nettoyer(o.ps)] : []),
    "--",
    ...provenance,
    "Héritage Intact est un guide pédagogique d'information générale. Il ne constitue ni une consultation juridique, ni un conseil fiscal personnalisé.",
  ].join("\n\n");
}

/* ─────────────────────────────────────────────────────────────────
   J0 — la livraison. Part à la seconde où l'inscription est faite.
   ───────────────────────────────────────────────────────────── */
export async function envoyerLivraison(lead: Lead) {
  const p = echapper(lead.firstName.trim()) || "";
  const offre = await promotionParEmail(lead.email,"front");
  const bouton = { texte: "Ouvrir la présentation", lien: offre ? lien("/reprendre/"+offre.id) : lien("/methode") };
  const paragraphes = [
    `Bonjour ${p},`,
    "Voici votre lien vers la présentation. Elle est accessible tout de suite, et elle le restera.",
    "Vous y trouverez le parcours proposé, ses contenus, ses limites et son prix. Vous pouvez lire la présentation à votre rythme.",
    "Commencez par votre objectif : protéger votre sécurité, clarifier les informations de votre famille ou préparer un rendez-vous.",
  ];
  const ps =
    "La série de conseils et d’offres est envoyée uniquement si vous avez coché la case facultative. Vous pouvez vous désinscrire à tout moment.";

  const contenu: Contenu = {
    titre: "Votre présentation Héritage Intact",
    paragraphes,
    bouton,
    ps,
    pied: "prospect",
    leadId: lead.id,
  };

  return envoyer({
    to: lead.email,
    leadId: lead.id,
    type: "transactionnel",
    cle: `presentation-v3/${lead.id}`,
    subject: `Votre présentation, ${p}`,
    html: gabarit(contenu),
    text: versionTexte(contenu),
  });
}

/* ─────────────────────────────────────────────────────────────────
   J1 à J7 — une étape de la séquence.
   ───────────────────────────────────────────────────────────── */
export async function envoyerEtape(lead: Lead, etape: Etape) {
  if (lead.marketingConsent !== true || lead.desabonne || await accesParEmail(lead.email)) return { ok: false };
  const p = echapper(lead.firstName.trim()) || "";
  const offre = await promotionParEmail(lead.email,"front");
  const tarif = palier(offre);
  const prix = appliquerRemise(PRODUCTS.front.price,tarif.pourcent);
  const bouton = { texte: "Commencer les 7 erreurs maintenant · "+euros(prix), lien: offre ? lien("/reprendre/"+offre.id+(etape.bouton.chemin==="/commander"?"?destination=commande":"")) : lien(etape.bouton.chemin) };
  const paragraphes = etape.corps(p);
  paragraphes.push(tarif.pourcent && tarif.fin
    ? "Votre avantage au moment de cet envoi : −"+tarif.pourcent+"% sur le prix catalogue de "+euros(PRODUCTS.front.price)+", soit "+euros(prix)+". Ce palier prend fin le "+new Date(tarif.fin).toLocaleString("fr-FR",{timeZone:"Europe/Paris",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})+" (Paris). Le lien conserve votre date de départ ; le récapitulatif affichera le montant à jour avant tout paiement."
    : "Votre accès au guide complet : "+euros(PRODUCTS.front.price)+", en paiement unique, sans abonnement. Garantie commerciale de 30 jours selon les CGV. Cliquez pour ouvrir votre première fiche aujourd’hui.");

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
    cle: `prospect-v3/${lead.id}/${etape.cle}`,
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
  if (!Number.isFinite(jours) || jours < 0 || jours > 21) return null;
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
    cle?: string;
    paragraphes: string[];
    bouton: { texte: string; lien: string };
    ps?: string;
    inviterAvis?: boolean;
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
    bcc: o.inviterAvis ? TRUSTPILOT_INVITE_BCC : undefined,
    type: "transactionnel",
    cle: o.cle,
    subject: o.objet,
    html: gabarit(contenu),
    text: versionTexte(contenu),
  });
}

/** L’acceptation fournisseur ne prouve pas le placement en boîte de réception. */
export async function envoyerAcces(acces: Acces, demande?: string): Promise<{ ok: boolean }> {
  const p = echapper(acces.firstName.trim()) || "";
  const url = urlEspace(acces.jeton);
  const paragraphes = [
    `Bonjour ${p},`,
    "Votre espace est ouvert. Tout ce que vous avez commandé s'y trouve, sur une seule page, et vous pouvez y revenir autant de fois que vous le souhaitez.",
    "<strong>Votre lien personnel est votre clé d’accès : conservez-le sans le partager.</strong>",
    "Dans « Mon dossier », retrouvez les documents correspondant à vos produits. Si vous avez le guide des 7 erreurs, téléchargez-le et commencez par la première erreur. « Mon parcours » vous indique une première action concrète selon vos produits.",
  ];
  // Le lien en toutes lettres est placé APRÈS le bouton, dans le bloc du bas :
  // c'est là que regarde quelqu'un pour qui le bouton n'a pas fonctionné.
  const ps = `Votre lien, écrit en toutes lettres, si le bouton ne fonctionne pas&nbsp;:<br><strong>${url}</strong><br><br><strong>P.-S.</strong> Si vous perdez cet email un jour, ce n'est pas grave&nbsp;: allez sur ${adresseLisible}/espace et indiquez votre adresse, vous pourrez demander le renvoi de votre lien.`;

  return envoyerAuClient(acces, {
    cle: demande ?? `acces-v3/${acces.jeton}`,
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
  const p = echapper(acces.firstName.trim()) || "";
  return envoyerAuClient(acces, {
    cle: `service-v3/${acces.jeton}/${etape.cle}`,
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
  operation?: string,
  /** Les autres articles de la même commande (le Dossier notaire pris avec le guide). */
  complements: { sku: ProductSku; montant: number }[] = [],
): Promise<{ ok: boolean }> {
  const p = echapper(acces.firstName.trim()) || "";
  const produit = PRODUCTS[sku];
  const achats = [{ sku, montant }, ...complements].map((a) => `<strong>${PRODUCTS[a.sku].name}</strong>, ${euros(a.montant)}`);
  const ajout = achats.length > 1 ? `${achats.slice(0, -1).join(", ")} et ${achats[achats.length - 1]}` : achats[0];
  const paragraphes = [
    `Bonjour ${p},`,
    `C'est ajouté à votre espace&nbsp;: ${ajout}.`,
    "Retrouvez tous les dossiers correspondant à vos achats dans « Mon dossier ».",
    "Garantie 30 jours&nbsp;: si cela ne vous sert pas, un message suffit et vous êtes remboursé, sans justification à fournir.",
    "<strong>Vous n'êtes pas à l'origine de cet achat&nbsp;?</strong> Répondez simplement à ce message&nbsp;: nous l'annulons et nous vous remboursons, sans discussion.",
  ];

  return envoyerAuClient(acces, {
    cle: operation ? `recu-v3/${operation}/${sku}` : undefined,
    objet: `Votre reçu — ${produit.name}`,
    paragraphes,
    // Le reçu du guide part aussi vers le collecteur d’avis : il ne doit donc jamais
    // contenir le jeton privé de l’espace. L’email d’accès séparé reste le seul à le porter.
    bouton: { texte: "Retrouver mes documents", lien: sku === "front" ? `${SITE_URL}/espace` : urlEspace(acces.jeton) + "?vue=dossier" },
    // Une invitation par client : le reçu du produit d’entrée, jamais un renvoi d’accès
    // ni un achat complémentaire qui multiplierait les sollicitations.
    inviterAvis: sku === "front" && montant > 0,
  });
}

/**
 * NOTIFICATION INTERNE : un client vient de déposer ou de modifier son avis
 * dans l'espace. Part uniquement vers notre boîte, jamais vers le client.
 */
export async function envoyerAvisInterne(o: {
  prenom: string;
  email: string;
  note: number;
  lignes: [string, string][];
  message: string;
  publication: boolean;
  modification: boolean;
}): Promise<{ ok: boolean }> {
  const etoiles = "★".repeat(o.note) + "☆".repeat(5 - o.note);
  const qui = `${echapper(o.prenom.trim()) || "Un client"} (${echapper(o.email)})`;
  const action = o.modification ? "a modifié son avis" : "vient de déposer un avis";
  const tableau = o.lignes
    .map(([q, r]) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #e1e6ec;color:#555555;">${echapper(q)}</td><td style="padding:6px 8px;border-bottom:1px solid #e1e6ec;font-weight:bold;">${echapper(r)}</td></tr>`)
    .join("");
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="font:16px/1.5 Arial,Helvetica,sans-serif;color:#222222;">
<p>${qui} ${action} dans son espace.</p>
<p style="margin:8px 0;font-size:26px;color:#e8730c;">${etoiles} <span style="font-size:16px;color:#222222;">${o.note}/5</span></p>
${tableau ? `<table style="border-collapse:collapse;width:100%;max-width:640px;">${tableau}</table>` : ""}
<p><strong>Message libre :</strong><br>${o.message ? echapper(o.message).replace(/\n/g, "<br>") : "<em>aucun</em>"}</p>
<p><strong>Publication autorisée :</strong> ${o.publication ? "oui, avec son prénom et la date" : "non"}</p>
</body></html>`;
  const text = [
    `${o.prenom || "Un client"} (${o.email}) ${action} dans son espace.`,
    `Note : ${etoiles} ${o.note}/5`,
    ...o.lignes.map(([q, r]) => `- ${q} → ${r}`),
    `Message libre : ${o.message || "aucun"}`,
    `Publication autorisée : ${o.publication ? "oui" : "non"}`,
  ].join("\n\n");
  return envoyer({
    to: CONTACT_EMAIL,
    type: "transactionnel",
    cle: `avis-interne/${o.email}/${Date.now()}`,
    subject: `Avis client ${etoiles} — ${o.prenom || o.email}`,
    html,
    text,
  });
}

/** Campagne client distincte des emails d’accès. Montant indicatif recalculé au clic. */
export async function envoyerComplement(lead: Lead, acces: Acces, sku: ProductSku, cle: string, credit: number, montant: number) {
  const actuel = await accesParEmail(acces.email);
  if (!actuel || actuel.revoque || actuel.envoyes.includes("ltv-pause") || !lead.marketingConsent || lead.desabonne) return {ok:false};
  const p = echapper(acces.firstName.trim());
  const rappel = cle.endsWith("-2");
  const angles: Partial<Record<ProductSku, { sujet: string; histoire: string; resultat: string }>> = {
    upsell1: { sujet: "La règle qui compte est-elle celle qui vous concerne ?", histoire: "Vous connaissez les erreurs à surveiller. Mais votre âge, vos biens, votre famille et vos donations peuvent changer l’ordre des vérifications. Le risque, maintenant, est de consacrer votre énergie au mauvais point.", resultat: "Mon plan adapté à ma situation relie vos réponses à vos priorités : les points à vérifier, les informations à retrouver et les pièces à réunir. Un chiffrage est présenté lorsque les informations et le cas permettent de le modéliser ; sinon, les éléments à préciser sont clairement identifiés." },
    bump: { sujet: "Le rendez-vous approche. Vos questions sont-elles prêtes ?", histoire: "Vous ressortez d’un rendez-vous, puis la question importante vous revient dans la voiture. Ce n’est pas un manque de sérieux : sans notes, l’échange peut passer à côté de ce qui vous préoccupait vraiment.", resultat: "Le Dossier Notaire vous aide à rassembler votre inventaire, préparer votre message et conserver les réponses du rendez-vous. Vous arrivez avec vos questions, et repartez avec la suite à donner." },
    upsell2: { sujet: "Votre contrat dit-il encore ce que vous voulez ?", histoire: "Le montant du relevé rassure. Pourtant, il ne dit pas à lui seul qui recevra le capital. Une clause ancienne ou une information manquante peut laisser un écart entre votre intention et le contrat enregistré.", resultat: "Le dossier Assurance-vie vous donne une grille de relecture et un courrier pour demander les informations manquantes à l’assureur. Vous pourrez confronter votre intention à la clause réellement en vigueur avant d’envisager une modification." },
    backend4: { sujet: "Vos volontés sont-elles assez claires pour être préparées ?", histoire: "Avoir une volonté très claire dans sa tête ne signifie pas qu’elle sera comprise de la même façon par tous. Les personnes, les biens et les dispositions déjà prises doivent être mis en regard.", resultat: "Le Dossier Testament organise vos volontés et les points de contradiction à présenter au notaire. Vous préparez un échange précis pour faire formaliser la solution qui correspond à votre situation." },
  };
  const angle = angles[sku];
  if (!angle) return { ok: false };
  const contenu: Contenu = {
    titre: rappel ? "Une question en suspens mérite une prochaine action" : angle.sujet,
    paragraphes: [
      `Bonjour ${p},`,
      rappel ? "Vous n’avez pas besoin de devenir spécialiste pour avancer. Commencez par une question précise et les pièces qui permettent d’y répondre. Le vrai obstacle est souvent de laisser cette question en suspens, faute de savoir par quel bout la prendre." : angle.histoire,
      angle.resultat,
      `Le produit proposé est « ${PRODUCTS[sku].name} ». Le montant à ajouter, calculé aujourd’hui, est de ${euros(montant)}.`,
      "Votre guide déjà acheté reste acquis. Ce produit répond à une autre question et fait l’objet d’un paiement distinct.",
      "La page de confirmation affiche le montant à jour avant tout paiement. Cliquer dans cet email ne déclenche aucun débit.",
      "Vous n’avez pas besoin de devenir spécialiste ni de tout décider maintenant. Les guides PDF donnent le mode d’emploi, un exemple et les étapes. La garantie commerciale de 30 jours permet de découvrir cette préparation selon les CGV. Ouvrez votre proposition et choisissez votre prochaine avancée ; le guide de base reste autonome.",
    ],
    bouton: {texte:"Préparer la suite · "+euros(montant),lien:urlEspace(acces.jeton)+"/ajouter/"+sku},
    pied:"prospect",leadId:lead.id,
  };
  return envoyer({to:lead.email,leadId:lead.id,cle:`client-v3/${acces.jeton}/${cle}`,subject:contenu.titre,html:gabarit(contenu),text:versionTexte(contenu)});
}

/**
 * LIVRAISON DU LEAD MAGNET — le premier contact d'un visiteur venu de Google.
 *
 * Il ne vend rien. Sur du trafic organique, `09-faq/arbitrages.md` est explicite :
 * lead magnet -> email -> vente PAR la séquence. Un email de livraison qui vend
 * casse la promesse au moment précis où on demande la confiance.
 *
 * Structure CEO tenue en quatre paragraphes : rêve (ce qu'il cherche vraiment),
 * échec excusé (personne ne vous a donné le chiffre), ennemi (le silence), peur
 * (les six mois). Le document fait le reste.
 */
export async function envoyerGrilleDroits(lead: Lead): Promise<{ ok: boolean }> {
  if (lead.marketingConsent !== true || lead.desabonne) return { ok: false };
  const p = echapper(lead.firstName.trim()) || "";
  const url = lien("/document/ce-quils-paieront");
  const contenu: Contenu = {
    titre: "Votre grille est prête",
    paragraphes: [
      `Bonjour ${p},`,
      "Voici ce que vous avez demandé : <strong>la grille de ce que vos enfants paieront réellement sur ce que vous leur laisserez.</strong> Vous y trouverez votre ligne en dix secondes, selon votre patrimoine et leur nombre.",
      "Si ce dossier vous accompagne depuis des années sans jamais aboutir, ce n’est pas de la négligence. C’est qu’il vous manquait un chiffre. Tant qu’on n’a pas de chiffre, il n’y a rien à décider — seulement une inquiétude qu’on repousse.",
      "Et si personne ne vous l’a donné, il y a une raison simple : personne n’est payé pour vous prévenir. L’État encaisse au décès, votre banque est rémunérée sur les frais du contrat, votre notaire est payé à l’acte — et l’acte arrive au moment de la succession. Ils ne sont pas malhonnêtes. Ils ne sont pas payés pour ça.",
      "Un point vous surprendra sans doute : à 300 000 € avec trois enfants, l’État ne prend rien. Avec un seul enfant, sur le même patrimoine, il prend 38 194 €. Le nombre d’enfants pèse aussi lourd que le montant.",
    ],
    bouton: { texte: "Voir ma ligne dans la grille", lien: url },
    ps: `Le lien en toutes lettres, si le bouton ne fonctionne pas&nbsp;:<br><strong>${url}</strong><br><br><strong>P.-S.</strong> Gardez un chiffre en tête en le lisant&nbsp;: <strong>six mois</strong>. C’est le délai dont vos enfants disposeront pour payer ces droits, en euros, pas en parts de maison. Tout ce qui peut réduire cette facture se décide de votre vivant.`,
    pied: "prospect",
    leadId: lead.id,
  };
  return envoyer({
    to: lead.email,
    leadId: lead.id,
    cle: `magnet-grille-v1/${lead.id}`,
    subject: `${p ? p + ", v" : "V"}otre grille : ce que vos enfants paieront`,
    html: gabarit(contenu),
    text: versionTexte(contenu),
  });
}
