import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { PrimesManifestementExagerees } from "@/content/guide/primes-manifestement-exagerees";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/primes-manifestement-exagerees";

export const metadata: Metadata = metadataPublique(CHEMIN, "Quand l’assurance-vie retombe dans la succession : les primes manifestement exagérées", "L’article L.132-13 est la seule porte par laquelle vos héritiers peuvent contester. Les quatre éléments que le juge examine, et ce qui se passe si l’exagération est retenue.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <PrimesManifestementExagerees />
      </main>
      <Footer />
    </>
  );
}
