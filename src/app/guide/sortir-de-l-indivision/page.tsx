import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { SortirDeLIndivision } from "@/content/guide/sortir-de-l-indivision";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/sortir-de-l-indivision";

export const metadata: Metadata = metadataPublique(CHEMIN, "Sortir de l’indivision sur la maison de famille : quatre issues, et une qui la sauve", "Partage amiable, rachat de parts, cession à un tiers, partage judiciaire — et l’attribution préférentielle de l’article 831-2, qui permet à celui qui habite le bien de le garder.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <SortirDeLIndivision />
      </main>
      <Footer />
    </>
  );
}
