import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { CaptureDocument } from "@/components/CaptureDocument";
import { ARTICLES } from "@/content/guide/articles";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/guide";

export const metadata: Metadata = metadataPublique(
  CHEMIN,
  "Le guide de la transmission : comprendre avant de décider",
  "Nos explications de fond sur la succession et la transmission, une règle à la fois, avec l’article du Code en face de chaque affirmation.",
);

const dateLisible = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/**
 * LE SOMMAIRE DE LA SECTION EDITORIALE.
 *
 * Les articles sont écrits ailleurs — chacun a sa route sous `/guide/<slug>` et
 * son propre contenu dans `content/guide/`. Cette page ne fait que les lister,
 * à partir de `content/guide/articles.ts`.
 *
 * ⚠️ Elle n'affiche aucun prix : elle est indexée, et la règle de `lib/seo.ts`
 * l'interdit. Sur du trafic organique, c'est la séquence email qui vend, pas la
 * page — d'où le bloc de capture en bas plutôt qu'une offre.
 */
export default function SommaireGuide() {
  return (
    <>
      <Header nav />
      <main className="flex-1">
        <div className="wrap py-8 sm:py-11">
          <h1 className="text-[1.7rem] leading-tight sm:text-[2.1rem]">
            Comprendre avant de décider
          </h1>
          <p className="mt-3 max-w-[60ch] text-[1.05rem]">
            Une règle expliquée à la fois, en français simple, avec l’article du Code en face de
            chaque affirmation. Rien ici ne remplace votre notaire : tout est fait pour que vous
            arriviez devant lui en sachant quoi lui demander.
          </p>

          {ARTICLES.length > 0 ? (
            <ul className="mt-7 space-y-5">
              {ARTICLES.map((a) => (
                <li key={a.slug} className="border-b border-grey-line pb-5 last:border-b-0">
                  <h2 className="text-[1.25rem] leading-snug sm:text-[1.4rem]">
                    <Link href={`/guide/${a.slug}`}>{a.titre}</Link>
                  </h2>
                  <p className="mt-2 text-[1rem] leading-snug">{a.chapo}</p>
                  <p className="mt-2 text-[0.85rem] text-text-soft">
                    <time dateTime={a.date}>Publié le {dateLisible(a.date)}</time>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            /* Un sommaire vide ne doit jamais mentir sur ce qui existe. */
            <p className="mt-7 border border-grey-line bg-grey-bg p-5 text-[1.02rem]">
              Les premiers articles sont en cours d’écriture. En attendant, la grille des droits
              ci-dessous répond déjà à la question la plus fréquente.
            </p>
          )}

          <CaptureDocument />
        </div>
      </main>
      <Footer />
    </>
  );
}
