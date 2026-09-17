import { cookies } from "next/headers";
import { euros } from "./config";
import { posterResume } from "./discord";
import { COOKIE_AB, varianteValide } from "./ab";
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
    let detail = e.detail;
    if (visiteur === undefined || email === undefined || !detail?.ab) {
      try {
        const jar = await cookies();
        if (visiteur === undefined) visiteur = visiteurValide(jar.get(COOKIE_VISITEUR)?.value);
        if (email === undefined) email = leadDuCookie(jar.get("hi_lead")?.value)?.email ?? null;
        // Un achat sans sa version de test ne se compare à rien.
        const ab = varianteValide(jar.get(COOKIE_AB)?.value);
        if (ab && !detail?.ab) detail = { ...detail, ab };
      } catch {
        // Hors requête (cron) : rien à lire.
      }
    }
    await schema();
    const s = sql();
    await s`
      insert into parcours_evenements (etape, visiteur, email, chemin, detail, appareil)
      values (${e.etape}, ${visiteur ?? null}, ${email?.trim().toLowerCase() || null},
              ${e.chemin ?? null}, ${s.json(detail ?? {})}, ${e.appareil ?? null})
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

/**
 * Depuis quand ce visiteur est-il sur le site, et combien d'étapes a-t-il déjà
 * franchies ? Sert à ne PAS alerter sur un clic de robot : les crawlers
 * publicitaires chargent la page et appuient sur le bouton principal dans la
 * foulée, sans jamais rien saisir (constaté le 16/09/2026 : clic 4 secondes
 * après l'affichage, avec un cookie visiteur différent de celui de la page).
 */
export async function ancienneteVisiteur(visiteur: string | null): Promise<number | null> {
  if (!sqlActif || !visiteur) return null;
  try {
    const [r] = await sql()<{ premier: Date | null }[]>`
      select min(created_at) as premier from parcours_evenements
      where visiteur = ${visiteur} and created_at > now() - interval '6 hours'
    `;
    return r?.premier ? Date.now() - r.premier.getTime() : null;
  } catch {
    return null;
  }
}

/**
 * TOUT CE QU'ON SAIT DU VISITEUR QUI VIENT DE SE BLOQUER.
 *
 * Demandé par Loys le 17/09/2026 : une alerte qui dit seulement « numéro de
 * carte incomplet » ne permet ni de comprendre, ni de décider. Celle-ci raconte
 * la visite — d'où il vient, depuis combien de temps il est là, ce qu'il a vu de
 * la vidéo, combien de fois il a essayé.
 */
export type ContexteBlocage = {
  depuisMinutes: number | null;
  pagesVues: number;
  video: string | null;
  pub: string | null;
  variante: string | null;
  essais: number;
  arrivee: string | null;
};

export async function contexteBlocage(
  visiteur: string | null,
  email: string | null,
): Promise<ContexteBlocage> {
  const vide: ContexteBlocage = {
    depuisMinutes: null,
    pagesVues: 0,
    video: null,
    pub: null,
    variante: null,
    essais: 0,
    arrivee: null,
  };
  if (!sqlActif || (!visiteur && !email)) return vide;
  try {
    const lignes = await sql()<
      { created_at: Date; etape: string; chemin: string | null; detail: Record<string, string> }[]
    >`
      select created_at, etape, chemin, detail from parcours_evenements
      where created_at > now() - interval '6 hours'
        and (visiteur = ${visiteur ?? ""} or email = ${email ?? ""})
      order by created_at
    `;
    if (!lignes.length) return vide;
    const premier = lignes[0];
    const jalons = ["vsl_100", "vsl_75", "vsl_50", "vsl_25", "vsl_lecture"];
    const atteint = jalons.find((j) => lignes.some((l) => l.etape === j));
    const libelles: Record<string, string> = {
      vsl_lecture: "lancée, sans aller jusqu'au quart",
      vsl_25: "vue au quart",
      vsl_50: "vue à la moitié",
      vsl_75: "vue aux trois quarts",
      vsl_100: "vue en entier",
    };
    const son = lignes.some((l) => l.etape === "vsl_son");
    return {
      depuisMinutes: Math.round((Date.now() - premier.created_at.getTime()) / 60000),
      pagesVues: lignes.filter((l) => l.etape === "page_vue").length,
      video: atteint ? libelles[atteint] + (son ? ", son activé" : ", sans le son") : null,
      pub: premier.detail?.utm_content ?? null,
      variante: premier.detail?.ab ?? null,
      essais: lignes.filter((l) => l.etape === "paiement_clic").length,
      arrivee: premier.chemin ?? null,
    };
  } catch {
    return vide;
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

/**
 * ⚠️ ENVOYÉ À 21 H (PARIS), JAMAIS AVANT — décision de Loys, 14/09/2026.
 *
 * Il couvre les 24 h qui se terminent à 21 h : de la veille 21 h au jour 21 h.
 * Une fenêtre « minuit → 21 h » laisserait les soirées hors de tout résumé ;
 * celle-ci ne perd rien et ne compte rien deux fois. La fin est FIXÉE à 21 h
 * pile, jamais à l'heure réelle d'exécution : un cron en retard ne décale pas
 * les chiffres.
 */
const HEURE_RESUME = 21;
/** Mise en ligne du suivi du parcours : avant, les étapes de visite n'existent pas. */
const DEBUT_SUIVI = new Date("2026-09-14T06:45:00Z");

type Item = { sku: string; price: number; rembourse?: boolean };
const net = (items: Item[]) => items.filter((i) => !i.rembourse).reduce((t, i) => t + i.price, 0);
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "—");
const nomPub = (cle: string) => (cle === "(sans pub)" ? "Sans pub" : `Pub …${cle.slice(-6)}`);

/** La fenêtre d'un jour : [veille 21 h, jour 21 h[, heure de Paris. Par défaut : aujourd'hui. */
async function fenetre(jourDemande?: string): Promise<{ jour: string; debut: Date; fin: Date }> {
  const heure = `${HEURE_RESUME}:00`;
  const [r] = await sql()<{ jour: string; debut: Date; fin: Date }[]>`
    with j as (select coalesce(${jourDemande ?? null}::date, (now() at time zone 'Europe/Paris')::date) as d)
    select to_char(d, 'YYYY-MM-DD') as jour,
           ((d + ${heure}::time) at time zone 'Europe/Paris') - interval '24 hours' as debut,
           ((d + ${heure}::time) at time zone 'Europe/Paris') as fin
    from j
  `;
  return r;
}

/** Le texte du résumé d'un jour (fenêtre ci-dessus). */
export async function construireResume(jourDemande?: string): Promise<{ jour: string; texte: string }> {
  await schema();
  const s = sql();
  const { jour, debut, fin } = await fenetre(jourDemande);

  const etapes = await s<{ etape: string; chemin: string | null; u: number }[]>`
    select etape, chemin, count(distinct coalesce(visiteur, email, id::text))::int as u
    from parcours_evenements
    where created_at >= ${debut} and created_at < ${fin}
    group by etape, chemin
  `;
  const u = (etape: string, chemin?: string) =>
    etapes.filter((e) => e.etape === etape && (chemin === undefined || e.chemin === chemin)).reduce((t, e) => t + e.u, 0);

  const [{ visiteurs }] = await s<{ visiteurs: number }[]>`
    select count(distinct coalesce(visiteur, id::text))::int as visiteurs from parcours_evenements
    where etape = 'page_vue' and created_at >= ${debut} and created_at < ${fin}
  `;
  const [{ leads }] = await s<{ leads: number }[]>`
    select count(*)::int as leads from leads where created_at >= ${debut} and created_at < ${fin}
  `;
  const erreurs = await s<{ phase: string | null; message: string | null; n: number }[]>`
    select detail->>'phase' as phase, detail->>'message' as message, count(*)::int as n
    from parcours_evenements
    where etape = 'paiement_erreur' and created_at >= ${debut} and created_at < ${fin}
    group by 1, 2 order by n desc limit 3
  `;
  const commandes = await s<{ id: string; items: Item[]; cle: string }[]>`
    select o.id, o.items, coalesce(l.utm_content, '(sans pub)') as cle
    from orders o left join leads l on l.email = o.email
    where o.mode = 'live' and o.status = 'paid' and o.created_at >= ${debut} and o.created_at < ${fin}
  `;
  const visiteursPub = await s<{ cle: string; n: number }[]>`
    select detail->>'utm_content' as cle, count(distinct coalesce(visiteur, id::text))::int as n
    from parcours_evenements
    where etape = 'page_vue' and detail->>'utm_content' is not null
      and created_at >= ${debut} and created_at < ${fin}
    group by 1
  `;
  const leadsPub = await s<{ cle: string; n: number }[]>`
    select coalesce(utm_content, '(sans pub)') as cle, count(*)::int as n from leads
    where created_at >= ${debut} and created_at < ${fin} group by 1
  `;
  const parVariante = await s<{ ab: string; visiteurs: number; clics: number; achats: number; ca: number }[]>`
    select coalesce(detail->>'ab', '(sans version)') as ab,
           count(distinct case when etape = 'page_vue' and chemin = '/lp' then coalesce(visiteur, id::text) end)::int as visiteurs,
           count(distinct case when etape = 'paiement_clic' then coalesce(visiteur, email, id::text) end)::int as clics,
           count(*) filter (where etape = 'achat')::int as achats,
           coalesce(sum((detail->>'montant')::numeric) filter (where etape = 'achat'), 0)::float as ca
    from parcours_evenements
    where created_at >= ${debut} and created_at < ${fin}
    group by 1 order by 1
  `;
  const [semaine] = await s<{ leads: number }[]>`
    select count(*)::int as leads from leads
    where created_at >= ${fin}::timestamptz - interval '7 days' and created_at < ${fin}
  `;
  const commandesSemaine = await s<{ items: Item[] }[]>`
    select items from orders where mode = 'live' and status = 'paid'
      and created_at >= ${fin}::timestamptz - interval '7 days' and created_at < ${fin}
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
    `📊 **Résumé du ${libelleJour}** — de la veille 21 h à ${HEURE_RESUME} h`,
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
    "**Test A/B de /lp**",
    ...(parVariante.length
      ? parVariante.map(
          (v) =>
            `${v.ab === "A" ? "A (vidéo + commande)" : v.ab === "B" ? "B (commande seule)" : v.ab} : ${v.visiteurs} visiteurs · ${v.clics} clics « Valider » · ${v.achats} achats · ${euros(v.ca)}`,
        )
      : ["Aucune donnée"]),
    "",
    "**Par pub**",
    ...(lignesPubs.length ? lignesPubs : ["Aucune donnée"]),
    "",
    `**7 derniers jours** : ${semaine.leads} inscrits · ${commandesSemaine.length} achats · ${euros(commandesSemaine.reduce((t, c) => t + net(c.items), 0))}`,
    ...(debut < DEBUT_SUIVI
      ? ["", "⚠️ Suivi des étapes en ligne depuis le 14/09 au matin : les chiffres de visite de cette période sont partiels."]
      : []),
  ].join("\n");

  return { jour, texte };
}

/**
 * Appelé par les deux crons du soir (19 h et 20 h UTC, voir vercel.json) : Vercel
 * ne connaît que l'heure UTC, et 21 h à Paris vaut 19 h UTC l'été, 20 h l'hiver.
 * Le passage d'avant 21 h (Paris) ne fait rien ; le premier à 21 h ou après
 * envoie ; le suivant trouve le jour déjà réservé.
 */
export async function envoyerResumeQuotidien(): Promise<
  "envoye" | "trop_tot" | "deja_envoye" | "echec" | "indisponible"
> {
  if (!sqlActif) return "indisponible";
  await schema();
  const s = sql();
  const [{ h }] = await s<{ h: number }[]>`select extract(hour from now() at time zone 'Europe/Paris')::int as h`;
  if (h < HEURE_RESUME) return "trop_tot";
  const { jour, texte } = await construireResume();
  const [pris] = await s`insert into parcours_resumes (jour) values (${jour}::date) on conflict do nothing returning jour`;
  if (!pris) return "deja_envoye";
  const ok = await posterResume(texte);
  if (!ok) await s`delete from parcours_resumes where jour = ${jour}::date`;
  return ok ? "envoye" : "echec";
}
