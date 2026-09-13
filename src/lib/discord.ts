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

async function poster(contenu: string, pingTous = false): Promise<void> {
  if (!URL_WEBHOOK) return;
  try {
    await fetch(URL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(3000),
      body: JSON.stringify({
        content: contenu.slice(0, 1900),
        // @everyone n'est autorisé que sur un achat réel, jamais sur un lead.
        allowed_mentions: { parse: pingTous ? ["everyone"] : [] },
      }),
    });
  } catch {
    // Silence volontaire : la notification est un confort, pas une étape du parcours.
  }
}

const propre = (v: string | undefined) => (v ?? "").replace(/[`*_~|>]/g, "").trim() || "—";

export async function notifierNouveauLead(lead: {
  firstName: string;
  email: string;
  source?: string;
  utm?: { utm_source?: string; utm_campaign?: string; utm_content?: string };
}): Promise<void> {
  const pub = lead.utm?.utm_campaign || lead.utm?.utm_source;
  await poster(
    [
      `🟢 **Nouveau lead** — ${propre(lead.firstName)} · ${propre(lead.email)}`,
      `Page : ${propre(lead.source)}${pub ? ` · Pub : ${propre(pub)}${lead.utm?.utm_content ? ` / ${propre(lead.utm.utm_content)}` : ""}` : ""}`,
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
