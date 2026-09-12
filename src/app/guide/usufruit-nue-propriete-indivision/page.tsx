import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { UsufruitIndivision } from "@/content/guide/usufruit-indivision";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/usufruit-nue-propriete-indivision";

export const metadata: Metadata = metadataPublique(
  CHEMIN,
  "Usufruit et nue-propriété en indivision : qui décide quoi",
  "Ce que vous créez en donnant la nue-propriété de votre maison à vos enfants : qui décide, qui paie les grosses réparations, et ce qui se passe à votre décès. Chaque règle avec son article du Code civil.",
);

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <UsufruitIndivision />
      </main>
      <Footer />
    </>
  );
}
