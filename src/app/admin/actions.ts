"use server";

import { redirect } from "next/navigation";
import {
  adminConfigure,
  fermerSessionAdmin,
  motDePasseValide,
  ouvrirSessionAdmin,
} from "@/lib/admin/session";

export type EtatConnexion = { erreur?: string };

/**
 * ⚠️ UN SEUL MESSAGE D'ERREUR, QUELLE QUE SOIT LA CAUSE.
 *
 * Mot de passe faux, champ vide, secret absent du serveur : la réponse est la
 * même. Distinguer « mot de passe incorrect » de « panel non configuré »
 * apprendrait à un visiteur que l'installation existe et qu'il ne lui manque
 * que le mot de passe.
 *
 * ⚠️ Aucune tentative n'est journalisée avec sa valeur : un mot de passe tapé
 * de travers dans un journal reste un mot de passe.
 */
export async function entrer(_etat: EtatConnexion, form: FormData): Promise<EtatConnexion> {
  const refus = { erreur: "Accès refusé." };
  if (!adminConfigure()) return refus;
  const fourni = form.get("motDePasse");
  if (typeof fourni !== "string" || !motDePasseValide(fourni)) return refus;
  await ouvrirSessionAdmin();
  redirect("/admin");
}

export async function sortir(): Promise<void> {
  await fermerSessionAdmin();
  redirect("/admin/connexion");
}
