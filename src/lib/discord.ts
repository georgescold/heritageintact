import { PRODUCTS, euros, type ProductSku } from "./config";

/**
 * NOTIFICATIONS DISCORD — nouveau lead, nouvel achat, réachat.
 *
 * Les appels partent depuis `lib/db.ts`, au point où la base constate le fait :
 * la création réelle d'un lead (pas une réinscription), et le passage d'une
 * commande de « pending » à « paid ». C'est ce qui garantit une notification par
 * événement, quel que soit le chemin qui l'a produit — confirmation navigateur,
 * webhook Stripe ou cron de rattrapage appellent tous les mêmes fonctions.
 *
 * ⚠️ Ne lève jamais et ne bloque jamais plus de 3 s : Discord indisponible ne doit
 * ni faire échouer une inscription, ni retarder la livraison d'un achat payé.
 *
 * ⚠️ `allowed_mentions` vide : un prénom saisi « @everyone » dans un formulaire ne
 * doit pas pinger tout le serveur.
 */
const URL_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

async function poster(contenu: string, pingTous = false): Promise<boolean> {
  if (!URL_WEBHOOK) return false;
  try {
    const r = await fetch(URL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
      body: JSON.stringify({
        content: contenu.slice(0, 1900),
        // @everyone n'est autorisé que sur un achat réel, jamais sur un lead.
        allowed_mentions: { parse: pingTous ? ["everyone"] : [] },
      }),
    });
    return r.ok;
  } catch {
    // Silence volontaire : la notification est un confort, pas une étape du parcours.
    return false;
  }
}

/** Le résumé quotidien du parcours (lib/parcours.ts). Sans mention. */
export const posterResume = (texte: string) => poster(texte);

/**
 * UN VISITEUR VIENT DE SE BLOQUER AU PAIEMENT — et l'alerte doit suffire à
 * comprendre sans rien ouvrir (demande de Loys, 17/09/2026).
 *
 * Chaque étape a sa traduction : « carte » n'est pas un incident technique mais
 * un clic sur Valider sans carte saisie, tandis que « vérification » signale un
 * paiement peut-être abouti sans avoir été enregistré — à contrôler tout de
 * suite dans Stripe.
 */
const EXPLICATIONS: Record<string, string> = {
  carte: "Il a cliqué sur « Valider » sans que sa carte soit complète. Rien n'est parti en banque.",
  banque: "Sa banque a refusé le paiement ou l'authentification. Aucun montant débité.",
  commande: "Le bon de commande a refusé la demande avant la banque (montant actualisé, champ manquant).",
  verification:
    "⚠️ Le paiement est parti mais n'a pas pu être vérifié : à contrôler dans Stripe, le client peut avoir été débité.",
  technique: "La validation s'est interrompue (connexion coupée pendant l'envoi).",
};

export async function notifierBlocagePaiement(b: {
  prenom?: string;
  email?: string;
  phase: string;
  message: string;
  appareil: string;
  montant?: number;
  contexte?: {
    depuisMinutes: number | null;
    pagesVues: number;
    video: string | null;
    pub: string | null;
    variante: string | null;
    essais: number;
    arrivee: string | null;
  };
}): Promise<void> {
  const c = b.contexte;
  const qui = b.prenom ? sansMention(b.prenom) : "Visiteur non inscrit";
  const lignes = [
    `⚠️ **Blocage au paiement**${b.montant ? ` — panier de ${euros(b.montant)}` : ""}`,
    `${qui}${b.email ? ` · ${propre(b.email)}` : ""} · ${b.appareil}${c?.variante ? ` · version ${c.variante}` : ""}`,
  ];
  if (c) {
    const visite = [
      c.depuisMinutes !== null ? `sur le site depuis ${c.depuisMinutes} min` : null,
      c.pagesVues ? `${c.pagesVues} page${c.pagesVues > 1 ? "s" : ""} vue${c.pagesVues > 1 ? "s" : ""}` : null,
      c.video ? `vidéo ${c.video}` : "vidéo jamais lancée",
      c.essais > 1 ? `${c.essais} tentatives` : null,
    ].filter(Boolean);
    if (visite.length) lignes.push("Sa visite : " + visite.join(" · "));
    if (c.pub) lignes.push(`Venu de l'annonce ${propre(c.pub)}`);
  }
  lignes.push(`Message affiché : « ${sansMention(b.message)} »`);
  lignes.push(EXPLICATIONS[b.phase] ?? `Étape : ${propre(b.phase)}`);
  await poster(lignes.join("\n"));
}

/** Neutralise les « @ » d'un texte saisi par un visiteur : pas de mention involontaire. */
const sansMention = (v: string | undefined) => propre(v).replace(/@/g, "@\u200b");

const propre = (v: string | undefined) => (v ?? "").replace(/[`*_~|>]/g, "").trim() || "—";

export async function notifierNouveauLead(lead: {
  firstName: string;
  email: string;
  source?: string;
  utm?: { utm_source?: string; utm_campaign?: string; utm_content?: string };
}): Promise<void> {
  // Les paramètres d'URL de Meta portent des IDENTIFIANTS du gestionnaire de
  // publicités (campagne, annonce) : ils ne correspondent pas aux « ID de
  // bibliothèque » de la Bibliothèque publicitaire. On les nomme donc clairement.
  const u = lead.utm;
  const origine = [
    u?.utm_source && `Réseau : ${propre(u.utm_source)}`,
    u?.utm_campaign && `Campagne : ${propre(u.utm_campaign)}`,
    u?.utm_content && `Annonce : ${propre(u.utm_content)}`,
  ].filter(Boolean);
  await poster(
    [
      `🟢 **Nouveau lead** — ${propre(lead.firstName).replace(/@/g, "@​")} · ${propre(lead.email)}`,
      `Page : ${propre(lead.source)}`,
      ...(origine.length ? [origine.join(" · ")] : []),
    ].join("\n"),
  );
}

export async function notifierAchat(achat: {
  firstName: string;
  email: string;
  items: { sku: ProductSku; price: number }[];
  mode: "test" | "live";
  reachat: boolean;
}): Promise<void> {
  const total = achat.items.reduce((s, i) => s + i.price, 0);
  const produits = achat.items.map((i) => `${PRODUCTS[i.sku]?.short ?? i.sku} (${euros(i.price)})`).join(" + ");
  const titre = achat.reachat ? "🔁 **Réachat**" : "💰 **Nouvel achat**";
  const reel = achat.mode === "live";
  await poster(
    [
      `${reel ? "@everyone " : ""}${titre} — **${euros(total)}**${reel ? "" : " · ⚠️ TEST"}`,
      // Le prénom est saisi par l'acheteur : ses « @ » sont neutralisés pour
      // qu'il ne puisse pas déclencher de mention lui-même.
      `${propre(achat.firstName).replace(/@/g, "@​")} · ${propre(achat.email)}`,
      produits,
    ].join("\n"),
    reel,
  );
}

/** Une relance automatique vient de partir vers un paiement non abouti. */
export async function notifierRelancePaiement(r: {
  prenom: string;
  email: string;
  montant: number;
}): Promise<void> {
  await poster(
    [
      `📨 **Relance envoyée** — paiement non abouti de ${euros(r.montant)}`,
      `${propre(r.prenom).replace(/@/g, "@\u200b")} · ${propre(r.email)}`,
    ].join("\n"),
  );
}
