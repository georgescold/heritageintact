import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { RegleDes15Ans } from "@/content/guide/regle-des-15-ans";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/regle-des-15-ans";

export const metadata: Metadata = metadataPublique(CHEMIN, "La règle des 15 ans : ce que le fisc oublie, et ce que vos enfants n’oublieront pas", "Le rappel fiscal de l’article 784 se compte par couple donateur-bénéficiaire. Mais le rapport civil, lui, n’a aucun délai et se valorise au jour du partage.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <RegleDes15Ans />
      </main>
      <Footer />
    </>
  );
}
