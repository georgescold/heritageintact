import type { Acces, Lead, Order, Profil, Progression } from "../db";

/**
 * TOUS LES CALCULS DU PANEL, ET RIEN D'AUTRE.
 *
 * Fonctions pures : elles prennent des tableaux et rendent des nombres. Aucune
 * ne lit la base, aucune ne lit l'heure sans qu'on la lui passe. C'est ce qui
 * permet à `scripts/test-admin.mjs` de les éprouver sur des jeux de données
 * fabriqués, sans Postgres et sans serveur — la même discipline que le reste
 * des tests du dépôt.
 *
 * ⚠️ DEUX RÈGLES DE COMPTAGE, TENUES PARTOUT.
 *
 * 1. L'ARGENT SE COMPTE EN CENTIMES, converti en euros au dernier moment.
 *    `0.1 + 0.2 !== 0.3` : sur un cumul de plusieurs centaines de lignes,
 *    l'écart devient visible à l'euro, et un chiffre d'affaires faux de trois
 *    euros fait perdre confiance dans tout l'écran.
 * 2. UN REMBOURSEMENT SE LIT DANS LA LIGNE, JAMAIS DANS LE STATUT. C'est le
 *    contrat écrit sur `OrderItem.rembourse` (db.ts) : `status` ne vaut jamais
 *    "refunded", et compter les remboursements au niveau de la commande
 *    donnerait un net systématiquement faux.
 */

export const PERIODES = {
  "7j": 7,
  "30j": 30,
  "90j": 90,
  tout: null,
} as const;

export type Periode = keyof typeof PERIODES;

export function periodeValide(v: unknown): Periode {
  return typeof v === "string" && v in PERIODES ? (v as Periode) : "30j";
}

/** Début de la fenêtre en millisecondes. `null` = pas de borne basse. */
export function debutPeriode(periode: Periode, maintenant = Date.now()): number | null {
  const jours = PERIODES[periode];
  return jours === null ? null : maintenant - jours * 86400000;
}

const horodatage = (v: string | undefined): number => {
  const t = Date.parse(v ?? "");
  return Number.isFinite(t) ? t : NaN;
};

export function dansPeriode(date: string | undefined, debut: number | null): boolean {
  const t = horodatage(date);
  if (!Number.isFinite(t)) return false;
  return debut === null || t >= debut;
}

const centimes = (n: number) => Math.round(n * 100);
const euros = (c: number) => Math.round(c) / 100;

/* ═══════════════════════════ L'ARGENT ═══════════════════════════ */

/**
 * Une commande ne compte dans le chiffre d'affaires que payée ET en mode
 * "live". Les commandes `test` sont des paiements simulés : les inclure ferait
 * apparaître un chiffre d'affaires qui n'a jamais existé sur un compte
 * bancaire. C'est le même filtre que `syntheseCohortes` (lib/pilotage.ts).
 */
export const commandeReelle = (c: Order) => c.status === "paid" && c.mode === "live";

export type Recettes = {
  brut: number;
  rembourse: number;
  net: number;
  lignes: number;
  commandes: number;
};

export function recettes(commandes: Order[]): Recettes {
  let brut = 0,
    rembourse = 0,
    lignes = 0,
    nb = 0;
  for (const c of commandes) {
    if (!commandeReelle(c)) continue;
    nb++;
    for (const i of c.items) {
      if (!Number.isFinite(i.price) || i.price < 0) continue;
      const montant = centimes(i.price);
      brut += montant;
      lignes++;
      if (i.rembourse) rembourse += montant;
    }
  }
  return {
    brut: euros(brut),
    rembourse: euros(rembourse),
    net: euros(brut - rembourse),
    lignes,
    commandes: nb,
  };
}

export type LigneProduit = {
  sku: string;
  ventes: number;
  remboursees: number;
  brut: number;
  net: number;
};

export function parProduit(commandes: Order[]): LigneProduit[] {
  const table = new Map<string, { ventes: number; remboursees: number; brut: number; net: number }>();
  for (const c of commandes) {
    if (!commandeReelle(c)) continue;
    for (const i of c.items) {
      if (!Number.isFinite(i.price) || i.price < 0) continue;
      const montant = centimes(i.price);
      const ligne = table.get(i.sku) ?? { ventes: 0, remboursees: 0, brut: 0, net: 0 };
      ligne.ventes++;
      ligne.brut += montant;
      if (i.rembourse) ligne.remboursees++;
      else ligne.net += montant;
      table.set(i.sku, ligne);
    }
  }
  return [...table.entries()]
    .map(([sku, l]) => ({ sku, ventes: l.ventes, remboursees: l.remboursees, brut: euros(l.brut), net: euros(l.net) }))
    .sort((a, b) => b.net - a.net);
}

/* ═══════════════════════════ LES GENS ═══════════════════════════ */

const normal = (email: string) => email.trim().toLowerCase();

/** Les adresses ayant au moins une commande réellement payée. */
export function acheteurs(commandes: Order[]): Set<string> {
  const set = new Set<string>();
  for (const c of commandes) if (commandeReelle(c)) set.add(normal(c.email));
  return set;
}

export type Kpi = {
  leads: number;
  desabonnes: number;
  acheteurs: number;
  commandesPayees: number;
  commandesEnAttente: number;
  recettes: Recettes;
  panierMoyen: number;
  tauxConversion: number;
  accesActifs: number;
  accesRevoques: number;
};

/**
 * Le tableau de bord en un objet.
 *
 * ⚠️ `tauxConversion` rapporte les acheteurs de la période aux inscrits de la
 * période. Ce n'est PAS un taux de conversion par cohorte : quelqu'un inscrit
 * en janvier et qui achète en mars compte au numérateur de mars et au
 * dénominateur de janvier. Le vrai suivi par cohorte existe déjà ailleurs
 * (`syntheseCohortes`), et l'écran le présente à part plutôt que de laisser
 * croire que ces deux chiffres disent la même chose.
 */
export function kpi(input: {
  leads: Lead[];
  commandes: Order[];
  acces: Acces[];
}): Kpi {
  const payees = input.commandes.filter(commandeReelle);
  const r = recettes(input.commandes);
  const nbAcheteurs = acheteurs(input.commandes).size;
  return {
    leads: input.leads.length,
    desabonnes: input.leads.filter((l) => l.desabonne).length,
    acheteurs: nbAcheteurs,
    commandesPayees: payees.length,
    commandesEnAttente: input.commandes.filter((c) => c.status === "pending").length,
    recettes: r,
    panierMoyen: nbAcheteurs ? euros(centimes(r.net) / nbAcheteurs) : 0,
    tauxConversion: input.leads.length ? nbAcheteurs / input.leads.length : 0,
    accesActifs: input.acces.filter((a) => !a.revoque).length,
    accesRevoques: input.acces.filter((a) => a.revoque).length,
  };
}

/* ═══════════════════════ L'ATTRIBUTION ═══════════════════════ */

export type LigneSource = {
  source: string;
  leads: number;
  acheteurs: number;
  net: number;
  /** Revenu par inscrit. La seule mesure qui compare deux pages honnêtement. */
  epl: number;
  taux: number;
};

/**
 * D'OÙ VIENNENT LES GENS, ET CE QUE ÇA RAPPORTE.
 *
 * `Lead.source` contient le chemin de la page d'arrivée ("/", "/lp",
 * "/guide/…"). C'est la seule attribution dont dispose le site, et elle est
 * fiable parce qu'elle est posée côté serveur au moment de l'inscription.
 *
 * ⚠️ Le rapprochement inscrit → achat se fait par EMAIL. Quelqu'un qui
 * s'inscrit avec une adresse et paie avec une autre n'est pas rattaché : ce
 * n'est pas un bug, c'est la limite de la méthode, et l'écran l'écrit.
 */
export function parSource(leads: Lead[], commandes: Order[]): LigneSource[] {
  const netParEmail = new Map<string, number>();
  for (const c of commandes) {
    if (!commandeReelle(c)) continue;
    const email = normal(c.email);
    let net = 0;
    for (const i of c.items) {
      if (!Number.isFinite(i.price) || i.price < 0 || i.rembourse) continue;
      net += centimes(i.price);
    }
    netParEmail.set(email, (netParEmail.get(email) ?? 0) + net);
  }

  const table = new Map<string, { leads: number; acheteurs: number; net: number }>();
  for (const l of leads) {
    const cle = l.source?.trim() || "(inconnue)";
    const ligne = table.get(cle) ?? { leads: 0, acheteurs: 0, net: 0 };
    ligne.leads++;
    const net = netParEmail.get(normal(l.email));
    if (net !== undefined) {
      ligne.acheteurs++;
      ligne.net += net;
    }
    table.set(cle, ligne);
  }

  return [...table.entries()]
    .map(([source, l]) => ({
      source,
      leads: l.leads,
      acheteurs: l.acheteurs,
      net: euros(l.net),
      epl: l.leads ? euros(l.net / l.leads) : 0,
      taux: l.leads ? l.acheteurs / l.leads : 0,
    }))
    .sort((a, b) => b.net - a.net || b.leads - a.leads);
}

/* ═══════════════════════ LE TEMPS ═══════════════════════ */

export type PointJour = { jour: string; leads: number; commandes: number; net: number };

const jourDe = (iso: string) => new Date(horodatage(iso)).toISOString().slice(0, 10);

/**
 * Série quotidienne, trous compris.
 *
 * Les jours sans activité sont émis à zéro plutôt qu'omis : une courbe qui
 * saute les jours vides raccourcit visuellement les creux et fait paraître
 * réguliers des à-coups qui ne le sont pas.
 */
export function parJour(
  leads: Lead[],
  commandes: Order[],
  debut: number | null,
  maintenant = Date.now(),
): PointJour[] {
  const table = new Map<string, PointJour>();
  const noter = (iso: string): PointJour | null => {
    const t = horodatage(iso);
    if (!Number.isFinite(t)) return null;
    const jour = jourDe(iso);
    const p = table.get(jour) ?? { jour, leads: 0, commandes: 0, net: 0 };
    table.set(jour, p);
    return p;
  };

  for (const l of leads) {
    const p = noter(l.createdAt);
    if (p) p.leads++;
  }
  for (const c of commandes) {
    if (!commandeReelle(c)) continue;
    const p = noter(c.createdAt);
    if (!p) continue;
    p.commandes++;
    for (const i of c.items) {
      if (!Number.isFinite(i.price) || i.price < 0 || i.rembourse) continue;
      p.net += centimes(i.price);
    }
  }

  // Remplissage des jours vides, du début de fenêtre à aujourd'hui.
  const premier = debut ?? Math.min(...[...table.keys()].map((j) => Date.parse(j)), maintenant);
  for (let t = premier; t <= maintenant; t += 86400000) {
    const jour = new Date(t).toISOString().slice(0, 10);
    if (!table.has(jour)) table.set(jour, { jour, leads: 0, commandes: 0, net: 0 });
  }

  return [...table.values()]
    .map((p) => ({ ...p, net: euros(p.net) }))
    .sort((a, b) => a.jour.localeCompare(b.jour));
}

/* ═══════════════════════ LE PARCOURS MEMBRE ═══════════════════════ */

export type LigneEtape = { etape: string; ouvertes: number; faites: number; tauxAchevement: number };

/**
 * L'entonnoir de la méthode, étape par étape.
 *
 * On distingue OUVERTE (le membre a affiché l'étape) de FAITE (il a coché). La
 * distinction n'est pas cosmétique : `lib/espace.ts` la commente longuement —
 * l'ouverture mesure l'engagement, la coche mesure l'avancement, et confondre
 * les deux fait croire à un abandon là où il n'y a qu'une case non cochée.
 */
export function parEtape(progression: Progression[]): LigneEtape[] {
  const table = new Map<string, { ouvertes: number; faites: number }>();
  for (const p of progression) {
    const ligne = table.get(p.etape) ?? { ouvertes: 0, faites: 0 };
    ligne.ouvertes++;
    if (p.faiteLe) ligne.faites++;
    table.set(p.etape, ligne);
  }
  return [...table.entries()]
    .map(([etape, l]) => ({
      etape,
      ouvertes: l.ouvertes,
      faites: l.faites,
      tauxAchevement: l.ouvertes ? l.faites / l.ouvertes : 0,
    }))
    .sort((a, b) => a.etape.localeCompare(b.etape));
}

/** Combien de membres ont reçu chaque email, d'après les clés déjà envoyées. */
export function parEnvoi(acces: Acces[], leads: Lead[]): { cle: string; nombre: number }[] {
  const table = new Map<string, number>();
  const compter = (cles: string[] | undefined) => {
    for (const cle of cles ?? []) {
      // Les clés horodatées ("ltv-v3-date:2026-…") sont des marqueurs internes,
      // pas des envois : les compter gonflerait le total d'un email par jour.
      const nom = cle.split(":")[0];
      table.set(nom, (table.get(nom) ?? 0) + 1);
    }
  };
  for (const a of acces) compter(a.envoyes);
  for (const l of leads) compter(l.envoyes);
  return [...table.entries()]
    .map(([cle, nombre]) => ({ cle, nombre }))
    .sort((a, b) => b.nombre - a.nombre);
}

/** Répartition des réponses de qualification, champ par champ. */
export function parProfil(profils: Profil[]): Record<string, { valeur: string; nombre: number }[]> {
  const champs = ["objectif", "vie", "enfants", "age", "av", "blocage"] as const;
  const sortie: Record<string, { valeur: string; nombre: number }[]> = {};
  for (const champ of champs) {
    const table = new Map<string, number>();
    for (const p of profils) {
      const v = (p[champ] ?? "").trim() || "(non renseigné)";
      table.set(v, (table.get(v) ?? 0) + 1);
    }
    sortie[champ] = [...table.entries()]
      .map(([valeur, nombre]) => ({ valeur, nombre }))
      .sort((a, b) => b.nombre - a.nombre);
  }
  return sortie;
}

/* ═══════════════════════ LA FICHE D'UNE PERSONNE ═══════════════════════ */

export type EvenementFiche = { date: string; type: string; detail: string };

/**
 * TOUT CE QUE LE SITE SAIT D'UNE ADRESSE, EN UNE SEULE LIGNE DE TEMPS.
 *
 * C'est l'écran du support : quelqu'un écrit « je n'ai rien reçu », et la
 * réponse tient dans cette liste — inscrit tel jour, payé tel jour, accès
 * ouvert, emails partis, étapes ouvertes.
 *
 * ⚠️ Le jeton d'accès n'en fait jamais partie. Il ouvre l'espace d'un client
 * sans autre vérification : l'afficher dans un panel, c'est le copier dans un
 * presse-papier, une capture d'écran ou un ticket de support.
 */
export function fiche(
  email: string,
  source: { leads: Lead[]; commandes: Order[]; acces: Acces[]; progression: Progression[] },
): EvenementFiche[] {
  const cible = normal(email);
  const evenements: EvenementFiche[] = [];

  for (const l of source.leads) {
    if (normal(l.email) !== cible) continue;
    evenements.push({
      date: l.createdAt,
      type: "Inscription",
      detail: `depuis ${l.source || "origine inconnue"}${l.desabonne ? " · désinscrit depuis" : ""}`,
    });
  }
  for (const c of source.commandes) {
    if (normal(c.email) !== cible) continue;
    const articles = c.items
      .map((i) => `${i.sku}${i.rembourse ? " (remboursé)" : ""}`)
      .join(", ");
    evenements.push({
      date: c.createdAt,
      type: c.status === "paid" ? "Commande payée" : "Commande non payée",
      detail: `${articles || "aucun article"} · ${c.mode}`,
    });
  }
  for (const a of source.acces) {
    if (normal(a.email) !== cible) continue;
    evenements.push({
      date: a.createdAt,
      type: "Accès à l’espace",
      detail: a.revoque ? "révoqué" : `actif · ${a.envoyes.length} email(s) envoyé(s)`,
    });
  }
  for (const p of source.progression) {
    if (normal(p.email) !== cible) continue;
    evenements.push({ date: p.ouverteLe, type: "Étape ouverte", detail: p.etape });
    if (p.faiteLe) evenements.push({ date: p.faiteLe, type: "Étape terminée", detail: p.etape });
  }

  return evenements
    .filter((e) => Number.isFinite(horodatage(e.date)))
    .sort((a, b) => horodatage(b.date) - horodatage(a.date));
}
