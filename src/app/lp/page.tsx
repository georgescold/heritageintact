import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PageVente } from "@/components/PageVente";
import { leadDuCookie } from "@/lib/parcours";

export const metadata: Metadata = { title: "Les 7 erreurs qui offrent votre héritage à l’État" };

/**
 * PAGE D'ATTERRISSAGE PUBLICITAIRE — l'adresse visée par les annonces.
 *
 * Depuis le 14/09/2026 (demande de Loys) : la page de vente elle-même, verrouillée
 * par une fenêtre prénom + email. Les visiteurs des pubs cliquaient mais ne
 * remplissaient pas la page de capture seule, qui reste en ligne sur /lp-email.
 *
 * Un visiteur déjà inscrit (cookie `hi_lead`) voit la page sans fenêtre.
 *
 * ⚠️ Toujours hors index : absente de la liste blanche de `lib/seo.ts`.
 * ⚠️ En changeant cette adresse, mettre à jour les annonces.
 */
export default async function AtterrissagePublicitaire() {
  const inscrit = leadDuCookie((await cookies()).get("hi_lead")?.value);
  return <PageVente verrouillee={!inscrit} />;
}
