import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { DonnerAUnTiers } from "@/content/guide/donner-a-un-tiers";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/donner-a-un-tiers-sans-lien-de-parente";

export const metadata: Metadata = metadataPublique(CHEMIN, "Donner à un ami, un filleul, un voisin : les deux murs que personne n’annonce", "Le taux de 60 % après 1 594 € d’abattement, et surtout la réserve héréditaire : un don excessif peut être réduit après votre décès, et le bénéficiaire devra rendre.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <DonnerAUnTiers />
      </main>
      <Footer />
    </>
  );
}
