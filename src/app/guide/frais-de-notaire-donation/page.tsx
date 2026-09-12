import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { FraisNotaireDonation } from "@/content/guide/frais-notaire-donation";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/frais-de-notaire-donation";

export const metadata: Metadata = metadataPublique(CHEMIN, "Ce que coûte vraiment une donation chez le notaire", "L’essentiel des « frais de notaire » est un impôt, pas une rémunération. Et le donateur peut payer les droits à la place du bénéficiaire sans que ce paiement soit taxé (art. 1712).");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <FraisNotaireDonation />
      </main>
      <Footer />
    </>
  );
}
