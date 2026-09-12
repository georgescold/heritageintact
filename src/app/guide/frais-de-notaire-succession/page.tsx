import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { FraisNotaireSuccession } from "@/content/guide/frais-notaire-succession";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/frais-de-notaire-succession";

export const metadata: Metadata = metadataPublique(CHEMIN, "Frais de notaire d’une succession : ce n’est pas l’impôt, et ça ne se calcule pas pareil", "Les émoluments sont réglementés et se calculent sur l’actif brut, l’impôt sur l’actif net. Les dettes réduisent donc l’un sans réduire l’autre.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <FraisNotaireSuccession />
      </main>
      <Footer />
    </>
  );
}
