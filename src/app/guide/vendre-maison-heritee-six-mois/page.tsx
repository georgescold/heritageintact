import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { VendreMaisonHeritee } from "@/content/guide/vendre-maison-heritee";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/vendre-maison-heritee-six-mois";

export const metadata: Metadata = metadataPublique(CHEMIN, "Six mois pour payer : faut-il vraiment vendre la maison ?", "Le délai, le coût du retard, et surtout les deux dispositifs faits pour éviter la vente forcée : le paiement fractionné et le paiement différé, qui se demandent avec la déclaration.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <VendreMaisonHeritee />
      </main>
      <Footer />
    </>
  );
}
