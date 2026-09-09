import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { OrientationAvant } from "@/components/OrientationAvant";
import { ApercuProduit } from "@/components/ApercuProduit";
import { OptinForm } from "@/components/OptinForm";
export const metadata: Metadata = {
  title: "Préparer votre transmission, sans vous déposséder à l’aveugle",
  description:
    "Comprendre les repères utiles à votre famille et préparer vos questions au notaire.",
};
export default function Page() {
  return (
    <>
      <Header />
      <main className="wrap flex-1 py-10 sm:py-16">
        <p className="mb-4 font-bold text-orange-dark">
          Héritage Intact · Comprendre avant de décider
        </p>
        <h1 className="mb-5 text-[2rem] leading-tight sm:text-[2.8rem]">
          Vous voulez protéger vos enfants. Mais par où commencer pour préparer votre transmission ?
        </h1>
        <p className="mb-6 text-[1.2rem]">
          La maison, les économies, l’assurance-vie… Découvrez les repères à vérifier, dans un ordre
          simple : votre sécurité d’abord, les besoins de votre famille ensuite, la fiscalité avec
          les bonnes hypothèses.
        </p>
        <OrientationAvant />
        <ApercuProduit />
        <details className="border border-grey-line bg-grey-bg p-5 sm:p-7"><summary className="cursor-pointer font-bold">Recevoir aussi la présentation par email</summary><div className="mt-5">
          <h2 className="mb-3 text-[1.4rem]">Recevoir le lien vers la présentation</h2>
          <OptinForm cta="Recevoir la présentation" />
          <p className="mt-4 text-sm">
            Vous préférez ne pas donner votre email ?{" "}
            <Link href="/methode">Lire directement la présentation</Link>.
          </p>
        </div></details>
        <section className="my-8">
          <h2 className="mb-3 text-[1.4rem]">Trois questions pour commencer</h2>
          <ol className="list-decimal space-y-3 pl-6">
            <li>De quoi devez-vous garder la maîtrise pour vivre sereinement ?</li>
            <li>Qui possède quoi aujourd’hui, et qui pourrait recevoir quoi demain ?</li>
            <li>Quelles informations manque-t-il pour poser les bonnes questions au notaire ?</li>
          </ol>
        </section>
        <p className="text-text-soft">
          Formation pédagogique centrée sur des situations françaises. Pas de promesse d’économie,
          de diagnostic personnel ni de remplacement du notaire. Pour une succession ouverte, un
          conflit ou une situation internationale, consultez directement un professionnel.
        </p>
      </main>
      <Footer />
    </>
  );
}
