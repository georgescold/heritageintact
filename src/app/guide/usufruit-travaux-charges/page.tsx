import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { UsufruitTravauxCharges } from "@/content/guide/usufruit-travaux-charges";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/usufruit-travaux-charges";

export const metadata: Metadata = metadataPublique(
  CHEMIN,
  "Usufruit et nue-propriété : qui paie les travaux, la taxe foncière et les charges",
  "La répartition des articles 605, 606 et 608, ligne par ligne — et ce qu’elle produit le jour où la toiture est à refaire : la charge est écrite, l’obligation de l’exécuter ne l’est pas.",
);

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <UsufruitTravauxCharges />
      </main>
      <Footer />
    </>
  );
}
