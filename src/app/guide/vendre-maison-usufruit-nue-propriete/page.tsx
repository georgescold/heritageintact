import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { VendreBienDemembre } from "@/content/guide/vendre-bien-demembre";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/vendre-maison-usufruit-nue-propriete";

export const metadata: Metadata = metadataPublique(
  CHEMIN,
  "Vendre une maison en usufruit et nue-propriété : qui peut, et qui touche l’argent",
  "Après une donation avec réserve d’usufruit, qui doit être d’accord pour vendre, comment le prix se répartit (art. 621), et les deux façons de reporter l’usufruit au lieu de l’encaisser.",
);

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <VendreBienDemembre />
      </main>
      <Footer />
    </>
  );
}
