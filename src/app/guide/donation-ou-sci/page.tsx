import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { DonationOuSci } from "@/content/guide/donation-ou-sci";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/donation-ou-sci";

export const metadata: Metadata = metadataPublique(CHEMIN, "Donation ou SCI : pourquoi la réponse est souvent « ni l’un ni l’autre pour vous »", "La SCI ne résout qu’un problème, l’indivision. Pour une maison habitée et deux enfants proches, son coût et son formalisme sont rarement justifiés.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <DonationOuSci />
      </main>
      <Footer />
    </>
  );
}
