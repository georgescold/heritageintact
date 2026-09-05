import Stripe from "stripe";

/**
 * Client Stripe côté serveur.
 * Null tant que STRIPE_SECRET_KEY est vide : le site tourne alors en mode test simulé,
 * sans aucun appel réseau et sans débit.
 */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null;

/** Stripe travaille en centimes. */
export const toCents = (euros: number): number => Math.round(euros * 100);
