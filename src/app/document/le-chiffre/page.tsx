import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { GrilleDroitsEnfants } from "@/content/gratuit/grille-droits-enfants";
import { AccesAutorise } from "@/components/AccesAutorise";

/**
 * L'adresse est publique mais reste hors index : si Google la classait, l'email
 * n'aurait plus de raison d'être demandé — et c'est l'email qui monétise la page
 * SEO, pas la page elle-même. Le `noindex` vient du layout racine : ne rien
 * déclarer ici, c'est le conserver.
 */
export const metadata: Metadata = {
  title: "Le chiffre que personne ne vous a donné",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string }>;
}) {
  // Le document s'ouvre tout de suite après la demande : faire patienter le
  // lecteur devant un « vérifiez votre boîte mail » ajoute une friction pour
  // rien, alors qu'il vient de donner son adresse pour lire CE document.
  const { envoye } = await searchParams;
  const vientDeDemander = envoye === "1";
  return (
    <>
      {/*
        Le déverrouillage ne s'affiche qu'au retour du formulaire. Quelqu'un qui
        revient plus tard par le lien de son email retrouve son document
        directement : l'effet sert la première fois, il agace les suivantes.
      */}
      {vientDeDemander && <AccesAutorise />}
      <Header minimal />
      <main className="flex-1">
        {vientDeDemander && (
          <p
            role="status"
            className="mx-auto mt-6 max-w-3xl border-2 border-blue bg-white px-4 py-3 text-[0.95rem]"
          >
            <strong>C’est envoyé.</strong> Une copie de ce document vient de partir vers votre
            adresse, pour que vous puissiez le retrouver plus tard. Vous pouvez le lire
            maintenant, ci-dessous.
          </p>
        )}
        <GrilleDroitsEnfants />
      </main>
      <Footer />
    </>
  );
}
