import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { AssuranceVieHorsSuccession } from "@/content/guide/assurance-vie-hors-succession";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/assurance-vie-et-succession";

export const metadata: Metadata = metadataPublique(CHEMIN, "Assurance-vie et succession : ce qui compte, c’est la date du versement", "Le capital sort de la succession (L.132-12), mais c’est votre âge au jour du versement qui décide du régime : 152 500 € par bénéficiaire avant 70 ans, 30 500 € au total après.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <AssuranceVieHorsSuccession />
      </main>
      <Footer />
    </>
  );
}
