import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { BOUTIQUE, ORDRE_BOUTIQUE, type FicheBoutique } from "@/content/boutique";
import { BRAND, PRESENTATION, PRODUCTS, euros } from "@/lib/config";
import { DUREE_PREMIER_PALIER, REMISE_MAX, fenetreDisponible } from "@/lib/fenetre-guide";
import { guideVendable } from "@/lib/guides-vente";

/**
 * LA BOUTIQUE — « Nos guides ».
 *
 * ⚠️ ELLE N'EST PAS INDEXÉE, ET C'EST OBLIGATOIRE. Elle affiche des prix, et la
 * règle de `lib/seo.ts` l'interdit à ce titre : les prix du tunnel varient selon
 * la fenêtre ouverte pour chaque personne, donc un montant remonté dans un
 * résultat de recherche contredirait celui que le visiteur voit réellement.
 *
 * ⚠️ CHAQUE FICHE A SON BOUTON D'ACHAT, MAIS PAS LE MÊME CHEMIN. Le guide
 * d'entrée garde `/commande`, qui porte sa fenêtre de prix. Les quatre autres
 * passent par `/commander/<sku>`, ouvert pour eux — lui donner aussi le guide
 * d'entrée ferait exister deux tarifs du même produit selon le lien emprunté.
 * Un guide qui ne serait pas vendable à l'unité retombe sur l'espace plutôt que
 * d'afficher un bouton mort : une boutique dont un bouton ne répond pas détruit
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
 * ⚠️ RENDU À CHAQUE REQUÊTE, ET CE N'EST PAS UN CONFORT.
 *
 * Cette page décide d'annoncer ou non une promotion à partir d'une variable
 * d'environnement. Prérendue, elle figeait cette décision au moment de la
 * compilation : poser `PRIX_SECRET` en production ne changeait rien, et la
 * boutique continuait d'afficher le prix sec pendant que la page de commande
 * appliquait bien la remise. Deux écrans du même parcours, deux vérités.
 *
 * Le coût est nul : la page n'est pas indexée et affiche des prix, donc elle
 * n'a aucune raison d'être servie depuis un cache.
 */
export const dynamic = "force-dynamic";

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

  /**
   * ⚠️ ON N'ANNONCE UNE PROMOTION QUE SI LE SITE SAIT L'APPLIQUER.
   *
   * Sans secret de signature configuré, aucune fenêtre ne s'ouvre au clic et la
   * page de commande affiche le prix du catalogue. Annoncer « en promotion »
   * dans ce cas ferait une promesse démentie dix secondes plus tard, sur l'écran
   * même où le lecteur sort sa carte.
   *
   * ⚠️ La mention ne porte QUE sur les guides vendus à l'unité. La fenêtre du
   * produit d'appel dépend d'une adresse email déjà connue : l'annoncer à tout
   * le monde serait faux pour la plupart des visiteurs.
   */
  const promotion = fenetreDisponible();

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
            {/* L'ANCRAGE, ET POURQUOI IL EST FAIT AINSI.
                « La première information vue sert de référence pour évaluer tout
                le reste » (03-marketing-copy/biais-cognitifs.md § 2). Le premier
                nombre de la page doit donc être l'enjeu, pas le tarif : lu après
                86 389 €, un guide à 52 € ne se compare plus à un livre.

                ⚠️ AUCUN PRIX BARRÉ. Un « 97 € → 52 € » serait une annonce de
                réduction sans prix antérieur réel : c'est interdit, et sur ce
                public la moindre fausse promotion coûte plus qu'elle ne
                rapporte. On ancre sur un chiffre VÉRIFIABLE, tiré du barème en
                ligne directe (art. 777 et 779 CGI) — le même que celui du
                document gratuit. C'est aussi ce que dit la règle de pricing du
                dossier : le prix se justifie par le besoin du client, jamais par
                le produit. */}
            <div className="mt-5 border-2 border-blue bg-grey-bg p-5">
              <p className="text-[1.02rem]">
                Sur un patrimoine de 650 000 €, deux enfants paient aujourd’hui{" "}
                <strong className="whitespace-nowrap">86 389 €</strong> de droits de succession.
                Trois enfants, 64 583 €. Un seul, 108 194 €.
              </p>
              <p className="mt-2 text-[1.02rem] font-bold text-blue">
                C’est ce chiffre-là que nos guides servent à comprendre, puis à faire vérifier. Le
                premier coûte {euros(PRODUCTS.front.price)}.
              </p>
              <p className="mt-2 text-[0.85rem] text-text-soft">
                Barème en ligne directe après l’abattement de 100 000 € par enfant (art. 777 et 779
                du Code général des impôts). Montants de référence, hors frais et hors situation
                particulière.
              </p>
            </div>

            <p className="mt-4 border-l-4 border-blue bg-grey-bg p-4 text-[1rem]">
              <strong>Commencez par le premier.</strong> Les quatre autres s’achètent séparément, ou
              s’ajoutent depuis votre espace quand votre situation le justifie.
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
                      {promotion && !entree && guideVendable(sku)
                        ? `En promotion · −${REMISE_MAX} %`
                        : rang === 0
                          ? "À commencer par là"
                          : `Étape ${rang + 1}`}
                    </p>
                  </div>

                  <div className="p-5 sm:p-6">
                    {/* LE NOM D'ABORD, LE RÉSULTAT JUSTE DESSOUS.
                        Sur une boutique, le lecteur cherche d'abord à savoir CE
                        QU'IL ACHÈTE : un nom en petites lettres grises sous une
                        longue phrase se saute. Le nom porte donc le titre, et la
                        phrase de résultat devient le sous-titre — elle dit en une
                        ligne ce que le guide fait, sans que rien ne se perde.
                        La règle « on vend un résultat, jamais un produit » est
                        tenue : le résultat reste au-dessus du pli de la fiche, en
                        gras et dans la couleur du guide. */}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 className={`text-[1.5rem] font-bold leading-tight sm:text-[1.8rem] ${couleur.titre}`}>
                        {produit.name}
                      </h2>
                      <p className="text-[1.35rem] font-bold text-blue">{euros(produit.price)}</p>
                    </div>
                    <p className="mt-1.5 text-[1.08rem] font-bold leading-snug">{fiche.resultat}</p>

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
                          {promotion && guideVendable(sku) && (
                            <p className="mb-3 border-2 border-red bg-red-bg p-3 text-[1rem] font-bold text-red">
                              En ce moment : −{REMISE_MAX} % sur ce guide, pendant{" "}
                              {DUREE_PREMIER_PALIER} minutes à partir de l’ouverture de votre
                              commande.
                            </p>
                          )}
                          <Link
                            // La fenêtre de prix s ouvre sur /commander, au clic, et jamais pendant la lecture.
                            href={guideVendable(sku) ? `/commander?g=${sku}` : "/connexion"}
                            className={`flex min-h-[54px] w-full items-center justify-center border-b-4 px-5 py-3 text-center text-[1.08rem] font-bold text-white no-underline sm:w-auto sm:px-8 ${couleur.badge} ${couleur.cadre} hover:brightness-90`}
                          >
                            {!guideVendable(sku)
                              ? "L’ajouter depuis mon espace"
                              : promotion
                                ? "Voir la promotion"
                                : `Commander ce guide — ${euros(produit.price)}`}
                          </Link>
                          <p className="mt-2 text-[0.92rem] text-text-soft">
                            Paiement sécurisé, garantie 30 jours.{" "}
                            <Link href="/connexion">Déjà client ? Ajoutez-le depuis votre espace</Link>
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
