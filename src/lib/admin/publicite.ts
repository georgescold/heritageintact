import type { Lead, Order } from "../db";
import type { SemaineAds } from "../meta-ads";
import { commandeReelle } from "./agregats";

/**
 * LE TABLEAU DE BORD DE LA RENTABILITÉ, SEMAINE PAR SEMAINE.
 *
 * Il joint deux sources qui ne se connaissent pas : ce que la publicité a coûté
 * (Meta) et ce que le site a encaissé (notre base). La jointure se fait sur la
 * SEMAINE, pas sur la personne — c'est volontairement grossier, et c'est ce qui
 * la rend robuste : aucun cookie, aucun identifiant publicitaire, rien à casser
 * quand un navigateur bloque le suivi.
 *
 * ⚠️ CE QUE CETTE JOINTURE NE DIT PAS, et qu'il ne faut pas lui faire dire :
 *
 * - Elle ne prouve AUCUNE causalité. Un achat de la semaine 12 peut venir d'une
 *   publicité vue la semaine 9, ou du référencement naturel, ou d'un email. La
 *   ligne rapproche deux totaux de la même semaine, rien de plus.
 * - Elle ne sait pas quelle PUBLICITÉ a produit quel achat. Pour cela il
 *   faudrait capter les UTM à l'inscription et les conserver jusqu'à la
 *   commande. Tant que ce n'est pas fait, la colonne « meilleure publicité »
 *   d'un tableur ne peut pas être reproduite ici, et on ne l'invente pas.
 * - Le chiffre d'affaires est celui du site entier, publicité ou non. Sur une
 *   semaine où le référencement rapporte, le ROAS monte sans que la publicité
 *   y soit pour quoi que ce soit.
 *
 * ⚠️ TOUT CE QUI DÉPEND DE LA DÉPENSE VAUT `null` QUAND LA DÉPENSE EST INCONNUE.
 * Jamais zéro : une dépense inconnue traitée comme nulle donne un ROAS infini
 * et un bénéfice égal au chiffre d'affaires — exactement les deux nombres qui
 * feraient décider d'augmenter un budget.
 */

export type LigneCockpit = {
  debut: string;
  fin: string;
  /** Meta. `null` quand la connexion n'est pas configurée ou a échoué. */
  depense: number | null;
  clics: number | null;
  cpc: number | null;
  /** Notre base. Toujours connu. */
  ca: number;
  leads: number;
  conversions: number;
  /** Coût par inscrit. La première métrique d'une campagne qui démarre. */
  cpl: number | null;
  /** Coût par achat — le CPA du dossier, aussi appelé CAC. */
  cpa: number | null;
  /** Revenu par inscrit. À comparer au CPL : c'est lui qui dit si on peut scaler. */
  epl: number;
  roas: number | null;
  benefice: number | null;
};

const centimes = (n: number) => Math.round(n * 100);
const euros = (c: number) => Math.round(c) / 100;
const horodatage = (v: string | undefined) => {
  const t = Date.parse(v ?? "");
  return Number.isFinite(t) ? t : NaN;
};

/** Division qui rend `null` plutôt que l'infini. */
const rapport = (numerateur: number, denominateur: number): number | null =>
  denominateur > 0 ? Math.round((numerateur / denominateur) * 100) / 100 : null;

/**
 * Découpe notre propre historique en semaines de sept jours, en partant du
 * jour le plus récent et en remontant. Utilisé seulement quand Meta n'est pas
 * connecté : sinon ce sont les bornes de Meta qui font foi, pour que les
 * montants correspondent exactement à ceux du gestionnaire de publicités.
 */
export function semainesLocales(nombreSemaines: number, maintenant = Date.now()): SemaineAds[] {
  const jour = (t: number) => new Date(t).toISOString().slice(0, 10);
  const sortie: SemaineAds[] = [];
  for (let i = nombreSemaines - 1; i >= 0; i--) {
    const fin = maintenant - i * 7 * 86400000;
    sortie.push({
      debut: jour(fin - 6 * 86400000),
      fin: jour(fin),
      depense: 0,
      clics: 0,
      impressions: 0,
    });
  }
  return sortie;
}

export function cockpit(
  semaines: SemaineAds[],
  leads: Lead[],
  commandes: Order[],
  /** Faux quand Meta n'est pas connecté : la dépense est alors inconnue, pas nulle. */
  depenseConnue: boolean,
): LigneCockpit[] {
  return semaines.map((s) => {
    // Bornes inclusives : Meta rend `date_stop` sur le dernier jour compté.
    const debut = Date.parse(s.debut + "T00:00:00.000Z");
    const fin = Date.parse(s.fin + "T23:59:59.999Z");
    const dans = (iso: string | undefined) => {
      const t = horodatage(iso);
      return Number.isFinite(t) && t >= debut && t <= fin;
    };

    const leadsSemaine = leads.filter((l) => dans(l.createdAt)).length;
    const commandesSemaine = commandes.filter((c) => commandeReelle(c) && dans(c.createdAt));

    let net = 0;
    for (const c of commandesSemaine) {
      for (const i of c.items) {
        if (!Number.isFinite(i.price) || i.price < 0 || i.rembourse) continue;
        net += centimes(i.price);
      }
    }
    const ca = euros(net);
    const conversions = commandesSemaine.length;

    const depense = depenseConnue ? s.depense : null;
    const clics = depenseConnue ? s.clics : null;

    return {
      debut: s.debut,
      fin: s.fin,
      depense,
      clics,
      cpc: depense !== null && clics !== null ? rapport(depense, clics) : null,
      ca,
      leads: leadsSemaine,
      conversions,
      cpl: depense !== null ? rapport(depense, leadsSemaine) : null,
      cpa: depense !== null ? rapport(depense, conversions) : null,
      epl: rapport(ca, leadsSemaine) ?? 0,
      roas: depense !== null ? rapport(ca, depense) : null,
      benefice: depense !== null ? euros(net - centimes(depense)) : null,
    };
  });
}

export type LigneAnnonce = {
  cle: string;
  nom: string;
  campagne: string;
  depense: number | null;
  leads: number;
  acheteurs: number;
  ca: number;
  cpl: number | null;
  cpa: number | null;
  roas: number | null;
  benefice: number | null;
};

/**
 * L'ATTRIBUTION PAR ANNONCE — la colonne « meilleure publicité ».
 *
 * Elle joint trois choses : ce que Meta dit avoir dépensé par annonce, l'origine
 * publicitaire enregistrée sur l'inscrit, et ce que cet inscrit a acheté.
 *
 * ⚠️ LE RATTACHEMENT SE FAIT SUR L'IDENTIFIANT D'ANNONCE (`utm_id`), pas sur son
 * nom : un nom se renomme dans le gestionnaire, et l'historique d'une annonce
 * renommée se couperait en deux lignes. Le nom ne sert qu'à l'affichage.
 *
 * ⚠️ UNE LIGNE « ORIGINE INCONNUE » EXISTE TOUJOURS, ET ELLE EST IMPORTANTE.
 * Elle rassemble les inscrits arrivés sans origine : référencement, bouche à
 * oreille, et surtout celui qui a cliqué sur son téléphone puis acheté depuis
 * son ordinateur. La masquer ferait croire que tout le chiffre d'affaires est
 * attribué, et gonflerait mécaniquement le ROAS de chaque annonce.
 */
export function parAnnonce(
  annonces: { id: string; nom: string; campagne: string; depense: number }[] | null,
  leads: Lead[],
  commandes: Order[],
): LigneAnnonce[] {
  const normal = (e: string) => e.trim().toLowerCase();

  const netParEmail = new Map<string, number>();
  for (const c of commandes) {
    if (!commandeReelle(c)) continue;
    let net = 0;
    for (const i of c.items) {
      if (!Number.isFinite(i.price) || i.price < 0 || i.rembourse) continue;
      net += centimes(i.price);
    }
    const email = normal(c.email);
    netParEmail.set(email, (netParEmail.get(email) ?? 0) + net);
  }

  const table = new Map<string, { leads: number; acheteurs: number; net: number; nom: string; campagne: string }>();
  const parId = new Map((annonces ?? []).map((a) => [a.id, a]));

  for (const l of leads) {
    const id = l.utm?.utm_id;
    const cle = id ?? l.utm?.utm_content ?? "(origine inconnue)";
    const meta = id ? parId.get(id) : undefined;
    const ligne = table.get(cle) ?? {
      leads: 0,
      acheteurs: 0,
      net: 0,
      nom: meta?.nom ?? l.utm?.utm_content ?? "Hors publicité ou origine perdue",
      campagne: meta?.campagne ?? l.utm?.utm_campaign ?? "",
    };
    ligne.leads++;
    const net = netParEmail.get(normal(l.email));
    if (net !== undefined) {
      ligne.acheteurs++;
      ligne.net += net;
    }
    table.set(cle, ligne);
  }

  // Une annonce qui a coûté sans produire un seul inscrit doit apparaître :
  // c'est exactement celle qu'on veut couper, et elle serait invisible si on
  // ne partait que des inscrits.
  for (const a of annonces ?? []) {
    if (!table.has(a.id)) {
      table.set(a.id, { leads: 0, acheteurs: 0, net: 0, nom: a.nom, campagne: a.campagne });
    }
  }

  return [...table.entries()]
    .map(([cle, l]) => {
      const meta = parId.get(cle);
      const depense = meta ? meta.depense : null;
      const ca = euros(l.net);
      return {
        cle,
        nom: l.nom,
        campagne: l.campagne,
        depense,
        leads: l.leads,
        acheteurs: l.acheteurs,
        ca,
        cpl: depense !== null ? rapport(depense, l.leads) : null,
        cpa: depense !== null ? rapport(depense, l.acheteurs) : null,
        roas: depense !== null ? rapport(ca, depense) : null,
        benefice: depense !== null ? euros(l.net - centimes(depense)) : null,
      };
    })
    .sort((a, b) => (b.benefice ?? b.ca) - (a.benefice ?? a.ca));
}

export type Sante = {
  /** `null` quand la dépense est inconnue : on ne conclut pas sans elle. */
  scalable: boolean | null;
  message: string;
};

/**
 * LA LECTURE DE LA SANTÉ DU FUNNEL, EN UNE PHRASE.
 *
 * La règle du dossier est unique : LTV ↑, CPA ↓. Sa traduction quotidienne est
 * la comparaison du revenu par inscrit (EPL) au coût par inscrit (CPL). Tant
 * que l'EPL dépasse le CPL, chaque euro dépensé revient — c'est la condition du
 * « scaling à break-even », où l'on accepte de ne rien gagner à J+1 en pariant
 * sur la LTV à 30-60 jours.
 *
 * ⚠️ Se juge sur plusieurs semaines cumulées, jamais sur une seule : une semaine
 * porte trop peu d'achats pour qu'un écart y soit autre chose que du hasard.
 */
export function sante(lignes: LigneCockpit[]): Sante {
  const avecDepense = lignes.filter((l) => l.depense !== null);
  if (!avecDepense.length) {
    return {
      scalable: null,
      message:
        "Dépense publicitaire inconnue : impossible de dire si le funnel est rentable. Rien ici ne doit être lu comme une absence de coût.",
    };
  }

  const depense = avecDepense.reduce((n, l) => n + (l.depense ?? 0), 0);
  const ca = avecDepense.reduce((n, l) => n + l.ca, 0);
  const leads = avecDepense.reduce((n, l) => n + l.leads, 0);

  if (depense === 0) {
    return { scalable: null, message: "Aucune dépense publicitaire sur la période." };
  }
  if (!leads) {
    return {
      scalable: false,
      message: `${depense.toFixed(2)} € dépensés sans un seul inscrit. Le problème est en amont du funnel : la publicité ou la page d’arrivée.`,
    };
  }

  const cpl = depense / leads;
  const epl = ca / leads;
  const roas = ca / depense;

  return {
    scalable: epl >= cpl,
    message:
      epl >= cpl
        ? `Chaque inscrit rapporte ${epl.toFixed(2)} € et en coûte ${cpl.toFixed(2)} € : le funnel se paie (ROAS ${roas.toFixed(2)}). C’est la condition pour augmenter le budget.`
        : `Chaque inscrit rapporte ${epl.toFixed(2)} € mais en coûte ${cpl.toFixed(2)} € : chaque euro dépensé en perd une partie (ROAS ${roas.toFixed(2)}). Optimiser avant d’augmenter le budget — la LTV à 30-60 jours peut encore renverser ce calcul, pas le budget.`,
  };
}
