import type { Order } from "./db";
const centimes = (n: number) => Math.round(n * 100);
/**
 * État commercial des cohortes, pas un grand livre comptable.
 * On groupe les clients en interne ; aucune identité ne sort du résultat.
 * Les anciens upsells peuvent être des lignes de la commande initiale :
 * createdAt n'est donc PAS une date d'encaissement de chaque complément.
 */
export function syntheseCohortes(commandes: Order[], jours = 30, maintenant = Date.now()) {
  const clients = new Map<string, Order[]>();
  for (const c of commandes) {
    if (c.mode !== "live" || c.status !== "paid") continue;
    if (!Number.isFinite(Date.parse(c.createdAt)) || Date.parse(c.createdAt) > maintenant) continue;
    const email = c.email.trim().toLowerCase();
    if (!email) continue;
    clients.set(email, [...(clients.get(email) ?? []), c]);
  }
  let acheteurs = 0,
    brut = 0,
    rembourse = 0,
    commandesPayees = 0,
    clientsAvecComplement = 0;
  const parProduit: Record<
    string,
    { lignes: number; brutCentimes: number; rembourseCentimes: number }
  > = {};
  for (const achats of clients.values()) {
    const entrees = achats.filter((c) => c.items.some((i) => i.sku === "front"));
    if (!entrees.length) continue;
    const debut = Math.min(...entrees.map((c) => Date.parse(c.createdAt)));
    if (debut < maintenant - jours * 86400000) continue;
    acheteurs++;
    let complement = false;
    for (const c of achats) {
      commandesPayees++;
      for (const i of c.items) {
        if (!Number.isFinite(i.price) || i.price < 0) continue;
        const montant = centimes(i.price);
        brut += montant;
        if (i.rembourse) rembourse += montant;
        if (i.sku !== "front" && i.sku !== "bump" && montant > 0 && !i.rembourse) complement = true;
        const p = parProduit[i.sku] ?? { lignes: 0, brutCentimes: 0, rembourseCentimes: 0 };
        p.lignes++;
        p.brutCentimes += montant;
        if (i.rembourse) p.rembourseCentimes += montant;
        parProduit[i.sku] = p;
      }
    }
    if (complement) clientsAvecComplement++;
  }
  const net = brut - rembourse;
  return {
    joursAcquisition: jours,
    acheteurs,
    commandesPayees,
    clientsAvecComplement,
    recettesBrutes: brut / 100,
    remboursementsEnregistres: rembourse / 100,
    recettesApresRemboursementsEnregistres: net / 100,
    recettesMoyennesParAcheteur: acheteurs ? Math.round(net / acheteurs) / 100 : 0,
    parProduit,
    limites: [
      "Cohortes acquises durant les derniers jours indiqués, observées aujourd’hui : ce n’est pas une LTV à maturité identique.",
      "Les montants sont ceux des commandes live payées en base, pas les événements du navigateur.",
      "Les remboursements partiels non enregistrés ligne par ligne, litiges, frais, TVA et dépenses publicitaires exigent une réconciliation Stripe/comptable.",
      "Les anciennes commandes peuvent avoir été étiquetées live malgré une clé Stripe de test : vérifier l’historique avant de considérer ces cohortes comme réelles. Les nouvelles commandes corrigent cette distinction.",
      "Aucune attribution Meta ou date précise de chaque encaissement n’est déduite de createdAt.",
    ],
  };
}

/** Hypothèses explicites pour raisonner sur le plafond de publicité, jamais un bénéfice certifié. */
export function margeDisponible(p: {
  recettes: number;
  remboursements: number;
  fraisPaiement: number;
  support: number;
  tva: number;
  cotisations: number;
  fraisFixes: number;
  publicite: number;
  clients: number;
}) {
  if (
    Object.values(p).some((n) => !Number.isFinite(n) || n < 0) ||
    p.tva > 1 ||
    p.cotisations > 1 ||
    p.remboursements > p.recettes
  )
    throw new Error("Hypothèses invalides");
  const revenu = (p.recettes - p.remboursements) / (1 + p.tva);
  const avantPublicite = revenu * (1 - p.cotisations) - p.fraisPaiement - p.support - p.fraisFixes;
  return {
    avantPublicite,
    apresPublicite: avantPublicite - p.publicite,
    plafondAcquisition: p.clients ? avantPublicite / p.clients : null,
    limite:
      "Simulation avant impôt sur le revenu/bénéfice ; taux et assiettes à faire confirmer. Les taxes publicitaires non récupérables doivent être comprises dans publicite.",
  };
}
