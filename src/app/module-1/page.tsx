import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ButtonLink, Guarantee } from "@/components/ui";
import { PRODUCTS, VIDEO, euros } from "@/lib/config";

export const metadata: Metadata = { title: "Module 1, en accès libre" };

/** Cible des fenêtres de sortie : on donne le module 1, puis on ramène au bon de commande. */
export default function FreeModulePage() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-6 sm:py-10">
          <p className="mb-2 font-bold text-orange-dark">
            Module 1, en accès libre pendant 24 heures
          </p>
          <h1 className="mb-3 text-[1.5rem] sm:text-[1.9rem]">
            Erreur n°1 : « Je verrai ça plus tard », le compteur des 15 ans
          </h1>
          <p className="mb-5 text-text-soft">
            L&apos;abattement de 100 000 € par parent et par enfant se recharge tous les 15 ans,
            mais seulement si on l&apos;a utilisé. Chaque année sans donation est une année perdue.
            Elle ne revient pas.
          </p>

          <VideoEmbed id={VIDEO.module1} title="Module 1 : le compteur des 15 ans" minutes={10} />

          <div className="mt-6 space-y-4">
            <p>
              Si ce module vous a parlé, les six autres erreurs sont dans le programme complet, avec
              le Simulateur pour connaître <strong>votre</strong> chiffre ce soir.
            </p>
            <ButtonLink href="/commande">
              Accéder au programme complet : {euros(PRODUCTS.front.price)}
            </ButtonLink>
          </div>

          <div className="mt-8">
            <Guarantee />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
