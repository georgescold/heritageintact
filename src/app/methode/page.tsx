import type { Metadata } from "next";
import { PageVente } from "@/components/PageVente";

export const metadata: Metadata = { title: "Les 7 erreurs qui offrent votre héritage à l’État" };

/** Retour au gabarit pré-refonte : la vente uniquement, jamais un retour arrière du produit. */
export default function VslPage() {
  return <PageVente />;
}
