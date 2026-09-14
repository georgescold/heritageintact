import { cookies } from "next/headers";
import { euros } from "./config";
import { posterResume } from "./discord";
import { COOKIE_VISITEUR, LIBELLES_ETAPES, visiteurValide, type Etape } from "./parcours-etapes";
import { sql, sqlActif } from "./sql";

/**
 * LE PARCOURS — chaque étape franchie par un visiteur, de la pub jusqu'à l'achat.
 *
 * Demandé par Loys le 14/09/2026, après un lead qui s'est arrêté sans qu'on
 * puisse dire où : « On doit tout pouvoir mesurer ».
 *
 * Une ligne par étape. Le visiteur est un identifiant aléatoire (cookie `hi_v`)
 * tant qu'il ne s'est pas inscrit ; dès qu'il l'est, ses étapes portent aussi son
 * email, et `parcoursDe` recolle les deux : on voit donc aussi ce qu'il a fait
 * AVANT de s'inscrire.
 *
 * ⚠️ AUCUNE DONNÉE DE CARTE, AUCUNE ADRESSE IP, AUCUNE CLÉ D'ACCÈS : les chemins
 * sont nettoyés par `normaliserChemin` avant d'arriver ici.
 *
 * ⚠️ `enregistrerEtape` NE LÈVE JAMAIS : une mesure en panne ne doit ni faire
 * échouer une inscription, ni retarder la livraison d'un achat.
 */

type Detail = Record<string, string | number | boolean>;

let schemaPret: Promise<void> | null = null;
function schema(): Promise<void> {
  schemaPret ??= (async () => {
    const s = sql();
    await s`create table if not exists parcours_evenements (
      id          bigserial primary key,
      created_at  timestamptz not null default now(),
      etape       text not null,
      visiteur    text,
      email       text,
      chemin      text,
      detail      jsonb not null default '{}'::jsonb,
      appareil    text
    )`;
    await s`create index if not exists parcours_evenements_date on parcours_evenements (created_at)`;
    await s`create index if not exists parcours_evenements_email on parcours_evenements (email)`;
    await s`create index if not exists parcours_evenements_visiteur on parcours_evenements (visiteur)`;
    await s`create table if not exists parcours_resumes (
      jour       date primary key,
      envoye_le  timestamptz not null default now()
    )`;
  })().catch((e) => {
    schemaPret = null;
    throw e;
  });
  return schemaPret;
}

export function leadDuCookie(brut: string | undefined): { email: string; prenom?: string } | null {
  try {
    const l = JSON.parse(brut ?? "{}") as { email?: string; firstName?: string };
    const email = l.email?.trim().toLowerCase();
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { email, prenom: l.firstName } : null;
  } catch {
    return null;
  }
}

/**
 * `visiteur` / `email` laissés à `undefined` : lus dans les cookies de la requête
 * en cours quand il y en a une (action serveur, route). `null` : volontairement vide.
 */
export async function enregistrerEtape(e: {
  etape: Etape;
  email?: string | null;
  visiteur?: string | null;
  chemin?: string | null;
  detail?: Detail;
  appareil?: string | null;
}): Promise<void> {
  if (!sqlActif) return;
  try {
    let { visiteur, email } = e;
    if (visiteur === undefined || email === undefined) {
      try {
        const jar = await cookies();
        if (visiteur === undefined) visiteur = visiteurValide(jar.get(COOKIE_VISITEUR)?.value);
        if (email === undefined) email = leadDuCookie(jar.get("hi_lead")?.value)?.email ?? null;
      } catch {
        // Hors requête (cron) : rien à lire.
      }
    }
    await schema();
    const s = sql();
    await s`
      insert into parcours_evenements (etape, visiteur, email, chemin, detail, appareil)
      values (${e.etape}, ${visiteur ?? null}, ${email?.trim().toLowerCase() || null},
              ${e.chemin ?? null}, ${s.json(e.detail ?? {})}, ${e.appareil ?? null})
    `;
  } catch {
    console.error("[parcours] étape non enregistrée :", e.etape);
  }
}

/** Nombre d'erreurs de paiement du même visiteur ces 10 dernières minutes (anti-rafale Discord). */
export async function erreursRecentes(visiteur: string | null, email: string | null): Promise<number> {
  if (!sqlActif || (!visiteur && !email)) return 0;
  try {
    const [r] = await sql()<{ n: number }[]>`
      select count(*)::int as n from parcours_evenements
      where etape = 'paiement_erreur' and created_at > now() - interval '10 minutes'
        and (visiteur = ${visiteur ?? ""} or email = ${email ?? ""})
    `;
    return r?.n ?? 0;
  } catch {
    return 0;
  }
}

export type EtapeFiche = { date: string; etape: string; chemin: string; detail: string };

/** Tout le parcours d'une adresse, y compris ce que son navigateur a fait avant l'inscription. */
export async function parcoursDe(email: string): Promise<EtapeFiche[]> {
  if (!sqlActif) return [];
  try {
    await schema();
    const adresse = email.trim().toLowerCase();
    const lignes = await sql()<
      { created_at: Date; etape: Etape; chemin: string | null; detail: Detail; appareil: string | null }[]
    >`
      select created_at, etape, chemin, detail, appareil from parcours_evenements
      where email = ${adresse}
         or visiteur in (select distinct visiteur from parcours_evenements
                         where email = ${adresse} and visiteur is not null)
      order by created_at desc
      limit 400
    `;
    return lignes.map((l) => ({
      date: l.created_at.toISOString(),
      etape: LIBELLES_ETAPES[l.etape] ?? l.etape,
      chemin: l.chemin ?? "—",
      detail: [
        ...Object.entries(l.detail ?? {}).map(([k, v]) => `${k} : ${v}`),
        ...(l.appareil ? [l.appareil] : []),
      ].join(" · "),
    }));
  } catch {
    return [];
  }
}

/* ─── LE RÉSUMÉ QUOTIDIEN ─────────────────────────────────────────────── */

/** Le jour où le suivi du parcours a été mis en ligne. */
const DEBUT_SUIVI = "2026-09-14";

type Item = { sku: string; price: number; rembourse?: boolean };
const net = (items: Item[]) => items.filter((i) => !i.rembourse).reduce((t, i) => t + i.price, 0);
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "—");
const nomPub = (cle: string) => (cle === "(sans pub)" ? "Sans pub" : `Pub …${cle.slice(-6)}`);

/** Le texte du résumé d'un jour (heure de Paris). Par défaut : hier. */
export async function construireResume(jourDemande?: string): Promise<{ jour: string; texte: string }> {
  await schema();
  const s = sql();
  const jour =
    jourDemande ??
    (await s<{ j: string }[]>`select to_char((now() at time zone 'Europe/Paris')::date - 1, 'YYYY-MM-DD') as j`)[0].j;

  const etapes = await s<{ etape: string; chemin: string | null; u: number }[]>`
    select etape, chemin, count(distinct coalesce(visiteur, email, id::text))::int as u
    from parcours_evenements
    where (created_at at time zone 'Europe/Paris')::date = ${jour}::date
    group by etape, chemin
  `;
  const u = (etape: string, chemin?: string) =>
    etapes.filter((e) => e.etape === etape && (chemin === undefined || e.chemin === chemin)).reduce((t, e) => t + e.u, 0);

  const [{ visiteurs }] = await s<{ visiteurs: number }[]>`
    select count(distinct coalesce(visiteur, id::text))::int as visiteurs from parcours_evenements
    where etape = 'page_vue' and (created_at at time zone 'Europe/Paris')::date = ${jour}::date
  `;
  const [{ leads }] = await s<{ leads: number }[]>`
    select count(*)::int as leads from leads where (created_at at time zone 'Europe/Paris')::date = ${jour}::date
  `;
  const erreurs = await s<{ phase: string | null; message: string | null; n: number }[]>`
    select detail->>'phase' as phase, detail->>'message' as message, count(*)::int as n
    from parcours_evenements
    where etape = 'paiement_erreur' and (created_at at time zone 'Europe/Paris')::date = ${jour}::date
    group by 1, 2 order by n desc limit 3
  `;
  const commandes = await s<{ id: string; items: Item[]; cle: string }[]>`
    select o.id, o.items, coalesce(l.utm_content, '(sans pub)') as cle
    from orders o left join leads l on l.email = o.email
    where o.mode = 'live' and o.status = 'paid'
      and (o.created_at at time zone 'Europe/Paris')::date = ${jour}::date
  `;
  const visiteursPub = await s<{ cle: string; n: number }[]>`
    select detail->>'utm_content' as cle, count(distinct coalesce(visiteur, id::text))::int as n
    from parcours_evenements
    where etape = 'page_vue' and detail->>'utm_content' is not null
      and (created_at at time zone 'Europe/Paris')::date = ${jour}::date
    group by 1
  `;
  const leadsPub = await s<{ cle: string; n: number }[]>`
    select coalesce(utm_content, '(sans pub)') as cle, count(*)::int as n from leads
    where (created_at at time zone 'Europe/Paris')::date = ${jour}::date group by 1
  `;
  const [semaine] = await s<{ leads: number }[]>`
    select count(*)::int as leads from leads
    where (created_at at time zone 'Europe/Paris')::date between ${jour}::date - 6 and ${jour}::date
  `;
  const commandesSemaine = await s<{ items: Item[] }[]>`
    select items from orders where mode = 'live' and status = 'paid'
      and (created_at at time zone 'Europe/Paris')::date between ${jour}::date - 6 and ${jour}::date
  `;

  const ca = commandes.reduce((t, c) => t + net(c.items), 0);
  const caUpsells = commandes.reduce(
    (t, c) => t + net(c.items.filter((i) => i.sku !== "front" && i.sku !== "bump")),
    0,
  );
  const avecBump = commandes.filter((c) => c.items.some((i) => i.sku === "bump" && !i.rembourse)).length;

  const pubs = new Map<string, { visiteurs: number; leads: number; achats: number; ca: number }>();
  const pub = (cle: string) => {
    if (!pubs.has(cle)) pubs.set(cle, { visiteurs: 0, leads: 0, achats: 0, ca: 0 });
    return pubs.get(cle)!;
  };
  for (const v of visiteursPub) pub(v.cle).visiteurs += v.n;
  for (const l of leadsPub) pub(l.cle).leads += l.n;
  for (const c of commandes) {
    pub(c.cle).achats += 1;
    pub(c.cle).ca += net(c.items);
  }
  const lignesPubs = [...pubs.entries()]
    .sort((a, b) => b[1].ca - a[1].ca || b[1].leads - a[1].leads || b[1].visiteurs - a[1].visiteurs)
    .slice(0, 6)
    .map(([cle, p]) => `${nomPub(cle)} : ${p.visiteurs} visiteurs · ${p.leads} inscrits · ${p.achats} achats · ${euros(p.ca)}`);

  const lp = u("page_vue", "/lp");
  const methode = u("page_vue", "/methode");
  const libelleJour = new Date(`${jour}T12:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  });

  const texte = [
    `📊 **Résumé du ${libelleJour}**`,
    "",
    "**Acquisition**",
    `Visiteurs uniques : ${visiteurs} · sur /lp : ${lp}`,
    `Inscriptions : ${leads} (${pct(leads, lp)} des visiteurs de /lp)`,
    "",
    `**Vidéo** — ${methode} visiteurs de /methode`,
    `Lancée : ${u("vsl_lecture")} · 25 % : ${u("vsl_25")} · 50 % : ${u("vsl_50")} · 75 % : ${u("vsl_75")} · fin : ${u("vsl_100")}`,
    "",
    "**Commande**",
    `Clics vers la commande : ${u("clic_commande")} · page commande vue : ${u("page_vue", "/commande")} · clic « Valider » : ${u("paiement_clic")}`,
    `Blocages au paiement : ${u("paiement_erreur")}` +
      (erreurs.length
        ? "\n" + erreurs.map((e) => `  • ${e.phase ?? "?"} — « ${(e.message ?? "").slice(0, 90)} » ×${e.n}`).join("\n")
        : ""),
    "",
    "**Ventes**",
    `Achats : ${commandes.length} · CA : ${euros(ca)} · panier moyen : ${commandes.length ? euros(Math.round(ca / commandes.length)) : "—"}`,
    `Dossier notaire : ${avecBump}/${commandes.length} · upsells acceptés : ${u("upsell_accepte")} · refusés : ${u("upsell_refuse")} · CA upsells : ${euros(caUpsells)}`,
    `Conversion inscrit → achat : ${pct(commandes.length, leads)}`,
    "",
    "**Par pub**",
    ...(lignesPubs.length ? lignesPubs : ["Aucune donnée"]),
    "",
    `**7 derniers jours** : ${semaine.leads} inscrits · ${commandesSemaine.length} achats · ${euros(commandesSemaine.reduce((t, c) => t + net(c.items), 0))}`,
    ...(jour <= DEBUT_SUIVI
      ? ["", `⚠️ Suivi des étapes en ligne depuis le ${DEBUT_SUIVI.split("-").reverse().join("/")} : les chiffres de visite de ce jour sont partiels.`]
      : []),
  ].join("\n");

  return { jour, texte };
}

/** Appelé par le cron quotidien. Une seule fois par jour, même si le cron repasse. */
export async function envoyerResumeQuotidien(): Promise<boolean> {
  if (!sqlActif) return false;
  const { jour, texte } = await construireResume();
  const s = sql();
  const [pris] = await s`insert into parcours_resumes (jour) values (${jour}::date) on conflict do nothing returning jour`;
  if (!pris) return false;
  const ok = await posterResume(texte);
  if (!ok) await s`delete from parcours_resumes where jour = ${jour}::date`;
  return ok;
}
