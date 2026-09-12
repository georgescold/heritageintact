import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { DroitsSuccessionPlusValue } from "@/content/guide/droits-succession-plus-value";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/droits-de-succession-et-plus-value";

export const metadata: Metadata = metadataPublique(CHEMIN, "Revendre un bien hérité : les droits déjà payés viennent en déduction", "L’article 150 VB permet d’ajouter au prix d’acquisition les droits de succession et frais d’acte réellement supportés. Encore faut-il avoir conservé les justificatifs.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <DroitsSuccessionPlusValue />
      </main>
      <Footer />
    </>
  );
}
