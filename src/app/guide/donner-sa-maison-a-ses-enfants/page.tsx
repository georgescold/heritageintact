import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { DonnerSaMaison } from "@/content/guide/donner-sa-maison";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/donner-sa-maison-a-ses-enfants";

export const metadata: Metadata = metadataPublique(CHEMIN, "Donner sa maison à ses enfants de son vivant : ce qu’on ne pourra plus défaire", "La donation est irrévocable (art. 894). Ce que la réserve d’usufruit permet de garder, ce qu’elle ne garde pas, et pourquoi donner la maison ne garantit pas qu’elle reste dans la famille.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <DonnerSaMaison />
      </main>
      <Footer />
    </>
  );
}
