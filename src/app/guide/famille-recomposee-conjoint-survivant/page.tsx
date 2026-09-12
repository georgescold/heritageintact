import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { FamilleRecomposeeConjoint } from "@/content/guide/famille-recomposee-conjoint";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/famille-recomposee-conjoint-survivant";

export const metadata: Metadata = metadataPublique(CHEMIN, "Famille recomposée : la règle qui change tout pour le conjoint survivant", "Un seul enfant non commun supprime l’option de l’article 757 : plus d’usufruit total, un quart en pleine propriété. Et l’exception de l’article 786 pour l’adoption simple du bel-enfant.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <FamilleRecomposeeConjoint />
      </main>
      <Footer />
    </>
  );
}
