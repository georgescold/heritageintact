/**
 * LA LECTURE DES DÉPENSES PUBLICITAIRES, DEPUIS LE BUSINESS MANAGER.
 *
 * ⚠️ CE N'EST PAS LE MÊME ACCÈS QUE LA CAPI. `META_CAPI_TOKEN` sert à ENVOYER
 * des événements au pixel ; lire les dépenses demande la permission `ads_read`
 * sur le compte publicitaire. Deux jetons, deux portées, et on ne réutilise pas
 * l'un pour l'autre : un jeton d'écriture d'événements qui pourrait aussi lire
 * le compte publicitaire est un jeton qu'on ne veut pas voir traîner dans les
 * variables d'un site web.
 *
 * ⚠️ LECTURE SEULE, ET SEULEMENT DES AGRÉGATS. Rien ici ne crée, ne modifie ni
 * n'arrête une campagne. Le panel montre ce que la publicité a coûté ; les
 * décisions se prennent dans le gestionnaire de publicités.
 *
 * ⚠️ UNE PANNE N'EST JAMAIS UN ZÉRO. Si Meta ne répond pas, la fonction rend une
 * erreur et l'écran le dit. Afficher « 0 € de dépense » parce qu'une requête a
 * échoué ferait apparaître un ROAS infini le jour où on regarde s'il faut
 * couper une campagne.
 */

export type SemaineAds = {
  /** Premier jour de la fenêtre, au format AAAA-MM-JJ. */
  debut: string;
  fin: string;
  depense: number;
  clics: number;
  impressions: number;
};

export type ResultatAds =
  | { etat: "ok"; semaines: SemaineAds[] }
  | { etat: "absent" }
  | { etat: "erreur"; message: string };

const env = () => process.env;

/** Les deux valeurs à fournir, et leur forme attendue. */
export function adsConfigure(): boolean {
  const e = env();
  return (
    Boolean(e.META_ADS_TOKEN) &&
    /^\d{5,30}$/.test((e.META_AD_ACCOUNT_ID ?? "").replace(/^act_/, "")) &&
    /^v\d{1,3}\.\d{1,2}$/.test(e.META_GRAPH_VERSION ?? "")
  );
}

const nombre = (v: unknown): number => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : Number.NaN;
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

/**
 * Les dépenses découpées par tranches de sept jours.
 *
 * `time_increment=7` fait faire le découpage par Meta plutôt que par nous :
 * c'est la même API qui décide des bornes et des montants, donc aucun risque de
 * recoller des jours à côté de la façon dont le gestionnaire les compte.
 *
 * @param jours profondeur d'historique. Meta refuse les fenêtres très longues
 *              sur certains comptes ; 90 jours passe partout.
 */
export async function depensesHebdomadaires(jours = 84): Promise<ResultatAds> {
  if (!adsConfigure()) return { etat: "absent" };
  const e = env();
  const compte = "act_" + (e.META_AD_ACCOUNT_ID ?? "").replace(/^act_/, "");

  const fin = new Date();
  const debut = new Date(fin.getTime() - jours * 86400000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const url = new URL(`https://graph.facebook.com/${e.META_GRAPH_VERSION}/${compte}/insights`);
  url.searchParams.set("fields", "spend,clicks,impressions");
  url.searchParams.set("time_increment", "7");
  url.searchParams.set("level", "account");
  url.searchParams.set(
    "time_range",
    JSON.stringify({ since: iso(debut), until: iso(fin) }),
  );
  url.searchParams.set("limit", "100");

  try {
    const reponse = await fetch(url, {
      // Le jeton voyage en en-tête, jamais en paramètre d'URL : une URL finit
      // dans les journaux, un en-tête non.
      headers: { Authorization: `Bearer ${e.META_ADS_TOKEN}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!reponse.ok) {
      // Le corps d'erreur de Meta peut contenir le jeton ou l'identifiant du
      // compte : on ne remonte que le code, jamais le message brut.
      return {
        etat: "erreur",
        message:
          reponse.status === 401 || reponse.status === 403
            ? "Meta refuse l’accès (jeton expiré, ou permission ads_read absente)."
            : `Meta a répondu ${reponse.status}.`,
      };
    }

    const corps = (await reponse.json()) as { data?: unknown };
    if (!Array.isArray(corps.data)) return { etat: "erreur", message: "Réponse Meta inattendue." };

    const semaines = corps.data
      .map((ligne) => {
        const l = ligne as Record<string, unknown>;
        const debutLigne = typeof l.date_start === "string" ? l.date_start : "";
        const finLigne = typeof l.date_stop === "string" ? l.date_stop : "";
        if (!debutLigne || !finLigne) return null;
        return {
          debut: debutLigne,
          fin: finLigne,
          depense: nombre(l.spend),
          clics: nombre(l.clicks),
          impressions: nombre(l.impressions),
        };
      })
      .filter((s): s is SemaineAds => s !== null)
      .sort((a, b) => a.debut.localeCompare(b.debut));

    return { etat: "ok", semaines };
  } catch {
    return { etat: "erreur", message: "Meta injoignable (délai dépassé ou réseau)." };
  }
}

export type AnnonceAds = {
  /** Identifiant Meta de l'annonce. C'est la clé de jointure préférée. */
  id: string;
  nom: string;
  campagne: string;
  depense: number;
  clics: number;
  impressions: number;
};

export type ResultatAnnonces =
  | { etat: "ok"; annonces: AnnonceAds[] }
  | { etat: "absent" }
  | { etat: "erreur"; message: string };

/**
 * La dépense annonce par annonce, cumulée sur la période.
 *
 * ⚠️ JOINTURE PAR IDENTIFIANT, PAS PAR NOM. Un nom d'annonce se renomme dans le
 * gestionnaire, et l'historique d'une annonce renommée se retrouverait coupé en
 * deux lignes qui ne se rejoindraient jamais. L'identifiant ne change pas :
 * c'est lui que `utm_id={{ad.id}}` doit porter.
 */
export async function depensesParAnnonce(jours = 84): Promise<ResultatAnnonces> {
  if (!adsConfigure()) return { etat: "absent" };
  const e = env();
  const compte = "act_" + (e.META_AD_ACCOUNT_ID ?? "").replace(/^act_/, "");

  const fin = new Date();
  const debut = new Date(fin.getTime() - jours * 86400000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const url = new URL(`https://graph.facebook.com/${e.META_GRAPH_VERSION}/${compte}/insights`);
  url.searchParams.set("fields", "ad_id,ad_name,campaign_name,spend,clicks,impressions");
  url.searchParams.set("level", "ad");
  url.searchParams.set("time_range", JSON.stringify({ since: iso(debut), until: iso(fin) }));
  url.searchParams.set("limit", "500");

  try {
    const reponse = await fetch(url, {
      headers: { Authorization: `Bearer ${e.META_ADS_TOKEN}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!reponse.ok) {
      return {
        etat: "erreur",
        message:
          reponse.status === 401 || reponse.status === 403
            ? "Meta refuse l’accès (jeton expiré, ou permission ads_read absente)."
            : `Meta a répondu ${reponse.status}.`,
      };
    }
    const corps = (await reponse.json()) as { data?: unknown };
    if (!Array.isArray(corps.data)) return { etat: "erreur", message: "Réponse Meta inattendue." };

    const annonces = corps.data
      .map((ligne) => {
        const l = ligne as Record<string, unknown>;
        const id = typeof l.ad_id === "string" ? l.ad_id : "";
        if (!id) return null;
        return {
          id,
          nom: typeof l.ad_name === "string" ? l.ad_name : id,
          campagne: typeof l.campaign_name === "string" ? l.campaign_name : "",
          depense: nombre(l.spend),
          clics: nombre(l.clicks),
          impressions: nombre(l.impressions),
        };
      })
      .filter((a): a is AnnonceAds => a !== null)
      .sort((a, b) => b.depense - a.depense);

    return { etat: "ok", annonces };
  } catch {
    return { etat: "erreur", message: "Meta injoignable (délai dépassé ou réseau)." };
  }
}
