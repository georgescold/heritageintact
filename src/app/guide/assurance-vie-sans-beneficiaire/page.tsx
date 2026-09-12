import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { AssuranceVieSansBeneficiaire } from "@/content/guide/assurance-vie-sans-beneficiaire";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/assurance-vie-sans-beneficiaire";

export const metadata: Metadata = metadataPublique(CHEMIN, "Une assurance-vie sans bénéficiaire : l’avantage disparaît en entier", "Sans désignation, le capital fait partie de la succession (L.132-11). Les quatre façons d’y arriver sans le vouloir, et ce que ça change selon qui vous vouliez avantager.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <AssuranceVieSansBeneficiaire />
      </main>
      <Footer />
    </>
  );
}
