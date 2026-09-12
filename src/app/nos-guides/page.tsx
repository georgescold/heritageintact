import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { BOUTIQUE, ORDRE_BOUTIQUE, type FicheBoutique } from "@/content/boutique";
import { BRAND, PRESENTATION, PRODUCTS, euros } from "@/lib/config";

/**
 * LA BOUTIQUE — « Nos guides ».
 *
 * ⚠️ ELLE N'EST PAS INDEXÉE, ET C'EST OBLIGATOIRE. Elle affiche des prix, et la
 * règle de `lib/seo.ts` l'interdit à ce titre : les prix du tunnel varient selon
 * la fenêtre ouverte pour chaque personne, donc un montant remonté dans un
 * résultat de recherche contredirait celui que le visiteur voit réellement.
 *
 * ⚠️ CHAQUE FICHE A SON BOUTON, MAIS PAS LE MÊME. Un seul guide dispose d'un
 * bon de commande pour qui n'est pas encore client : /commande ne vend que le
 * guide d'entrée, et /offre/[sku] exige un identifiant de commande. Les quatre
 * autres s'ajoutent depuis l'espace. Leur bouton mène donc là où ils s'obtiennent
 * réellement, et un second lien sert le client déjà inscrit. Aucun bouton ne
 * mène nulle part : une boutique dont un bouton sur cinq ne répond pas détruit
 * plus de confiance qu'elle n'en crée.
 *
 * COPY — trois règles du dossier, tenues dans cet ordre sur chaque fiche :
 *   1. On vend un RÉSULTAT, jamais un produit (loi 4). Le titre est le
 *      résultat ; le nom commercial vient en dessous, en petit.
 *   2. Le value stacking liste des CHANGEMENTS, pas des livrables
 *      (`teardowns.md` n°4). « Ce qui change pour vous » d'abord, la liste de
 *      ce qu'on reçoit repliée ensuite.
 *   3. RÊVE D'ABORD, PEUR ENSUITE (`principes-premiers.md` § Peur > Rêve). Le
 *      coût de l'inaction arrive après les changements, jamais avant : ouvrir
 *      par la douleur fait fuir, la placer après fait décider.
 */
export const metadata: Metadata = { title: `Nos guides — ${BRAND}` };

/**
 * Les teintes, reprises de l'espace membre pour qu'un client retrouve après
 * l'achat la couleur qu'il a vue avant. Écrites en toutes lettres : Tailwind
 * lit les classes dans le source, une classe construite par concaténation ne
 * serait jamais générée.
 */
const TEINTES: Record<
  FicheBoutique["teinte"],
  { cadre: string; badge: string; titre: string; puce: string }
> = {
  blue: { cadre: "border-blue", badge: "bg-blue text-white", titre: "text-blue", puce: "text-blue" },
  orange: {
    cadre: "border-orange",
    badge: "bg-orange text-white",
    titre: "text-orange-dark",
    puce: "text-orange",
  },
  green: {
    cadre: "border-green",
    badge: "bg-green text-white",
    titre: "text-green",
    puce: "text-green",
  },
  brown: {
    cadre: "border-brown",
    badge: "bg-brown text-white",
    titre: "text-brown",
    puce: "text-brown",
  },
  "blue-mid": {
    cadre: "border-blue-mid",
    badge: "bg-blue-mid text-white",
    titre: "text-blue-mid",
    puce: "text-blue-mid",
  },
};

export default function NosGuides() {
  const fiches = ORDRE_BOUTIQUE.filter((sku) => BOUTIQUE[sku] && PRODUCTS[sku]);

  return (
    <>
      <Header nav />
      <main className="flex-1">
        <section className="border-b border-grey-line bg-white">
          <div className="wrap py-8 sm:py-11">
            <p className="mb-3 inline-block bg-blue px-3 py-1 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white">
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
              const couleur = TEINTES[fiche.teinte];
              const entree = sku === "front";

              return (
                <article
                  key={sku}
                  id={sku}
                  className={`scroll-mt-4 border-2 bg-white ${couleur.cadre}`}
                >
                  {/* Le bandeau coloré porte le badge : il donne sa couleur à la
                      fiche et rend « Guide officiel » lisible d'un coup d'œil,
                      là où une ligne de petites majuscules se perdait. */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-2 sm:px-6 ${couleur.badge}`}
                  >
                    <p className="text-[0.85rem] font-bold uppercase tracking-[0.14em]">
                      Guide officiel
                    </p>
                    <p className="text-[0.85rem] font-bold uppercase tracking-wide opacity-90">
                      {rang === 0 ? "À commencer par là" : `Étape ${rang + 1}`}
                    </p>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 className={`text-[1.35rem] leading-snug sm:text-[1.6rem] ${couleur.titre}`}>
                        {fiche.resultat}
                      </h2>
                      <p className="text-[1.35rem] font-bold text-blue">{euros(produit.price)}</p>
                    </div>
                    <p className="mt-1 text-[0.95rem] text-text-soft">{produit.name}</p>

                    <p className="mt-4 text-[1.02rem]">{fiche.pourQui}</p>

                    <h3 className="mb-2 mt-5 text-[1.05rem] font-bold">Ce qui change pour vous</h3>
                    <ul className="space-y-2">
                      {fiche.changements.map((c) => (
                        <li key={c} className="flex gap-2 text-[1.02rem] leading-snug">
                          <span aria-hidden className={`mt-0.5 shrink-0 font-bold ${couleur.puce}`}>
                            ✔
                          </span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>

                    {/* La peur APRÈS le rêve, jamais avant. */}
                    <p className="mt-5 border-l-4 border-red bg-red-bg p-4 text-[1.02rem] leading-snug">
                      <strong className="text-red">Si vous ne le faites pas :</strong>{" "}
                      {fiche.perte}
                    </p>

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
                            Accéder au guide — {euros(produit.price)}
                          </a>
                          <p className="mt-2 text-[0.9rem] text-text-soft">
                            Paiement sécurisé. Garantie 30 jours, sans justification.
                          </p>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/connexion"
                            className={`flex min-h-[54px] w-full items-center justify-center border-b-4 px-5 py-3 text-center text-[1.08rem] font-bold text-white no-underline sm:w-auto sm:px-8 ${couleur.badge} ${couleur.cadre} brightness-100 hover:brightness-90`}
                          >
                            L’ajouter depuis mon espace
                          </Link>
                          <p className="mt-2 text-[0.92rem] text-text-soft">
                            Réservé aux membres.{" "}
                            <a href="#front" className="font-bold">
                              Pas encore le guide d’entrée ? Commencez ici →
                            </a>
                          </p>
                        </>
                      )}
                    </div>
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
