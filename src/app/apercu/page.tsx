import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { ButtonLink } from "@/components/ui";
import { MaSituation } from "@/content/documents/ma-situation";
import { ExempleDossier } from "@/content/documents/exemple-dossier";
import { ExerciceGuide } from "@/components/ExerciceGuide";
import { DemonstrationPack } from "@/components/DemonstrationPack";
export const metadata: Metadata = { title: "Voir les supports avant de choisir" };
export default function Page() {
  return <><Header/><main className="wrap-wide flex-1 py-8">
    <h1 className="mb-4 text-[2rem]">Regardez ce que vous allez réellement utiliser.</h1>
    <p className="mb-6">Voici la fiche de situation comprise dans la Méthode à 27 €, puis l’exemple rempli du Dossier facultatif à 17 €, également inclus dans les packs. Ces démonstrations sont accessibles sans inscription.</p>
    <section className="mb-8 overflow-hidden border border-grey-line"><h2 className="bg-blue p-4 text-white">1. Votre point de départ — inclus dans la Méthode</h2><MaSituation/></section>
    <ExerciceGuide cle="e0" />
    <section className="mb-8 overflow-hidden border border-grey-line"><h2 className="bg-blue p-4 text-white">2. Un exemple rempli — inclus dans le Dossier et les packs</h2><ExempleDossier/></section>
    <DemonstrationPack />
    <ButtonLink href="/methode">Voir le parcours et choisir mon point de départ</ButtonLink>
    <p className="mt-4 text-center text-text-soft">Tout le produit est numérique. Les exemples sont fictifs.</p>
  </main><Footer/></>;
}
