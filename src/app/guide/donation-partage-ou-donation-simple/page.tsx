import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { DonationPartageOuSimple } from "@/content/guide/donation-partage-ou-simple";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/donation-partage-ou-donation-simple";

export const metadata: Metadata = metadataPublique(CHEMIN, "Donation-partage ou donation simple : celle qui évite la dispute", "Toute la différence tient à la date d’évaluation : au jour du partage pour la donation simple (art. 860), au jour de l’acte pour la donation-partage (art. 1078).");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <DonationPartageOuSimple />
      </main>
      <Footer />
    </>
  );
}
