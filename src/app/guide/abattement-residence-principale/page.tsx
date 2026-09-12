import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { AbattementResidencePrincipale } from "@/content/guide/abattement-residence-principale";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide/abattement-residence-principale";

export const metadata: Metadata = metadataPublique(CHEMIN, "L’abattement de 20 % sur la résidence principale : à qui il profite vraiment", "L’article 764 bis n’est pas attaché à la maison mais à la personne qui y habite encore au jour du décès. Une maison vide n’y a pas droit, et c’est le cas le plus fréquent.");

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <AbattementResidencePrincipale />
      </main>
      <Footer />
    </>
  );
}
