import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { BOUTIQUE, ORDRE_BOUTIQUE } from "@/content/boutique";
import { BRAND, PRESENTATION, PRODUCTS, euros } from "@/lib/config";

/**
 * LA BOUTIQUE — « Nos guides ».
 *
 * ⚠️ ELLE N'EST PAS INDEXÉE, ET C'EST OBLIGATOIRE. Elle affiche des prix, et la
 * règle de `lib/seo.ts` l'interdit à ce titre : les prix du tunnel varient selon
 * la fenêtre ouverte pour chaque personne, donc un montant remonté dans un
 * résultat de recherche contredirait celui que le visiteur voit réellement.
 * Elle n'est donc pas déclarée dans CHEMINS_INDEXABLES — le `noindex` du layout
 * racine s'applique — et le lecteur y arrive par le header, jamais par Google.
 *
 * ⚠️ UN SEUL PRODUIT EST ACHETABLE DIRECTEMENT : le guide d'entrée. Les quatre
 * autres ne disposent aujourd'hui d'aucun bon de commande pour un visiteur qui
 * n'est pas encore client — ils s'ajoutent depuis l'espace, après le premier
 * achat. Leur fiche l'écrit noir sur blanc plutôt que d'afficher un bouton qui
 * mènerait nulle part : une boutique dont un bouton sur cinq ne fonctionne pas
 * détruit plus de confiance qu'elle n'en crée.
 *
 * COPY — `05-funnel/teardowns.md`, correction n°4 : le value stacking liste des
 * CHANGEMENTS, pas des livrables. D'où deux blocs par fiche, dans cet ordre :
 * « ce qui change pour vous » en tête, « ce qu'il contient » ensuite et en plus
 * petit. Le titre de chaque fiche est le RÉSULTAT, jamais le nom du produit —
 * on vend un résultat, jamais un produit (loi 4 du dossier).
 */
export const metadata: Metadata = { title: `Nos guides — ${BRAND}` };

export default function NosGuides() {
  const fiches = ORDRE_BOUTIQUE.filter((sku) => BOUTIQUE[sku] && PRODUCTS[sku]);

  return (
    <>
      <Header nav />
      <main className="flex-1">
        <section className="border-b border-grey-line bg-white">
          <div className="wrap py-8 sm:py-11">
            <p className="mb-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-orange">
              Guides officiels {BRAND}
            </p>
            <h1 className="text-[1.7rem] leading-[1.15] sm:text-[2.2rem]">
              Chaque guide règle une question précise, dans l’ordre où elle se pose
            </h1>
            <p className="mt-3 max-w-[70ch] text-[1.05rem]">
              Tous partent du même principe : vous donner les repères et les questions, pour que le
              professionnel compétent consacre son temps à décider plutôt qu’à vous expliquer ce que
              vous auriez pu lire. Aucun ne remplace votre notaire, et aucun ne décide à votre place.
            </p>
            <p className="mt-4 border-l-4 border-blue bg-grey-bg p-4 text-[1rem]">
              <strong>Commencez par le premier.</strong> Les quatre autres s’ajoutent ensuite depuis
              votre espace, quand votre situation le justifie — jamais avant.
            </p>
          </div>
        </section>

        <div className="wrap py-8 sm:py-11">
          <div className="space-y-8">
            {fiches.map((sku, rang) => {
              const produit = PRODUCTS[sku];
              const fiche = BOUTIQUE[sku]!;
              const presentation = PRESENTATION[sku];
              const entree = sku === "front";

              return (
                <article
                  key={sku}
                  id={sku}
                  className={`scroll-mt-4 border-2 p-5 sm:p-6 ${entree ? "border-blue bg-white" : "border-grey-line bg-white"}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-[0.76rem] font-bold uppercase tracking-[0.14em] text-orange">
                      Guide officiel · {rang === 0 ? "à commencer par là" : `étape ${rang + 1}`}
                    </p>
                    <p className="text-[1.35rem] font-bold text-blue">{euros(produit.price)}</p>
                  </div>

                  <h2 className="mt-2 text-[1.35rem] leading-snug sm:text-[1.6rem]">
                    {fiche.resultat}
                  </h2>
                  <p className="mt-1 text-[0.95rem] text-text-soft">{produit.name}</p>

                  <p className="mt-4 text-[1.02rem]">{fiche.pourQui}</p>

                  <h3 className="mb-2 mt-5 text-[1.05rem] font-bold">Ce qui change pour vous</h3>
                  <ul className="space-y-2">
                    {fiche.changements.map((c) => (
                      <li key={c} className="flex gap-2 text-[1.02rem] leading-snug">
                        <span aria-hidden className="mt-0.5 shrink-0 font-bold text-green">
                          ✔
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>

                  {presentation && (
                    <details className="mt-4 border border-grey-line bg-grey-bg p-4">
                      <summary className="cursor-pointer font-bold">Ce qu’il contient</summary>
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem]">
                        {presentation.contenu.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <p className="mt-4 border-l-4 border-grey-line pl-3 text-[0.95rem] text-text-soft">
                    <strong>Ce qu’il ne fait pas :</strong> {fiche.limite}
                  </p>

                  <div className="mt-5">
                    {entree ? (
                      <>
                        <a
                          href="/commander"
                          className="flex min-h-[54px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-5 py-3 text-center text-[1.08rem] font-bold text-white no-underline hover:bg-orange-dark sm:w-auto sm:px-8"
                        >
                          Accéder au guide
                        </a>
                        <p className="mt-2 text-[0.9rem] text-text-soft">
                          Paiement sécurisé. Garantie 30 jours, sans justification.
                        </p>
                      </>
                    ) : (
                      <div className="border border-grey-line bg-grey-bg p-4">
                        <p className="text-[0.98rem]">
                          Ce guide s’ajoute depuis votre espace, après le guide d’entrée — c’est là
                          qu’il prend son sens, une fois votre situation connue.
                        </p>
                        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.98rem]">
                          <a href="#front" className="font-bold">
                            Commencer par le guide d’entrée →
                          </a>
                          <Link href="/connexion">Déjà client ? Ouvrir mon espace</Link>
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border-t border-grey-line pt-8">
            <TrustRow />
          </div>

          <p className="mt-8 text-center text-[0.95rem] text-text-soft">
            Une question avant d’acheter ? Les réponses les plus fréquentes sont{" "}
            <Link href="/#questions">en bas de la page d’accueil</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
