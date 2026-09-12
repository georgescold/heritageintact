import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { GrilleDroitsEnfants } from "@/content/gratuit/grille-droits-enfants";

/**
 * L'adresse est publique mais reste hors index : si Google la classait, l'email
 * n'aurait plus de raison d'être demandé — et c'est l'email qui monétise la page
 * SEO, pas la page elle-même. Le `noindex` vient du layout racine : ne rien
 * déclarer ici, c'est le conserver.
 */
export const metadata: Metadata = {
  title: "Ce que vos enfants paieront",
};

export default function Page() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <GrilleDroitsEnfants />
      </main>
      <Footer />
    </>
  );
}
