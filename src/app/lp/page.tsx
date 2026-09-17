import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AvantageDemarrage } from "@/components/AvantageDemarrage";
import { CheckoutForm } from "@/components/CheckoutForm";
import { EvenementPixel } from "@/components/EvenementPixel";
import { PageVente } from "@/components/PageVente";
import { TestModeBanner } from "@/components/Chrome";
import { COOKIE_AB, varianteValide } from "@/lib/ab";
import { isTestMode, stripeEnModeTest } from "@/lib/config";
import { COOKIE_FENETRE_LP } from "@/lib/fenetre-lp";
import { leadDuCookie } from "@/lib/parcours";
import { devisFront } from "@/lib/prix-front";

export const metadata: Metadata = { title: "Les 7 erreurs qui offrent votre héritage à l’État" };

/**
 * PAGE D'ATTERRISSAGE PUBLICITAIRE — pub → vidéo → paiement, sur une seule page.
 *
 * Décision de Loys, 16/09/2026 : plus aucune capture d'email avant la vidéo. Les
 * visiteurs cliquaient sur les annonces sans laisser leur adresse, donc
 * n'atteignaient jamais la présentation. On vend directement, et l'email est
 * demandé au moment de payer.
 *
 * TEST A/B, un visiteur sur deux (tiré par `proxy.ts`, conservé 30 jours) :
 *   A — la vidéo, et le bon de commande juste en dessous ;
 *   B — pas de vidéo, le bon de commande d'entrée.
 * Le reste du texte de vente est identique dans les deux versions.
 *
 * Le prix vient du serveur, jamais de l'écran : la fenêtre à −50 % démarre à
 * l'arrivée (cookie signé, `fenetre-lp.ts`) et `prepareCheckout` la relit avant
 * de commander quoi que ce soit à la banque.
 *
 * ⚠️ Page hors index, comme avant : absente de la liste blanche de `lib/seo.ts`.
 */
export default async function AtterrissagePublicitaire() {
  const jar = await cookies();
  const variante = varianteValide(jar.get(COOKIE_AB)?.value) ?? "A";
  const devis = await devisFront(
    jar.get("hi_offre")?.value,
    undefined,
    jar.get(COOKIE_FENETRE_LP)?.value,
  );
  // Un acheteur déjà connu retrouve ses coordonnées pré-remplies.
  const lead = leadDuCookie(jar.get("hi_lead")?.value);

  const paywall = (
    <>
      <EvenementPixel nom="InitiateCheckout" />
      {(isTestMode || stripeEnModeTest) && <TestModeBanner stripeReel={stripeEnModeTest} />}
      <div className="border-2 border-blue bg-white p-4 sm:p-6">
        <h2 className="mb-1 text-[1.35rem] leading-tight sm:text-[1.6rem]">
          Obtenez le guide des 7 erreurs à ne pas faire sur sa succession
        </h2>
        <p className="mb-3 text-[1.02rem] text-text-soft">
          Accès immédiat après paiement, en ligne et en téléchargement. Garantie 30 jours.
        </p>
        {/* ⚠️ TROIS PREUVES AVANT LE CHAMP CARTE (17/09/2026). Mesuré sur 278
            visiteurs : la vidéo n'était lancée que 5 fois, et la version B
            présentait le bon de commande AVANT le moindre argument — on demandait
            une carte bancaire à quelqu'un à qui l'on n'avait encore rien démontré.
            Ces trois lignes tiennent en un écran et portent le cas chiffré, les
            sources et la garantie. */}
        <ul className="mb-4 space-y-2 text-[1rem]">
          {[
            "Les 7 erreurs expliquées à l’écrit, avec les articles du Code général des impôts pour les vérifier.",
            "Le cas chiffré du guide : 82 194 € de droits ramenés à 13 988 €, sans vendre ni quitter la maison.",
            "Remboursé sous 30 jours si cela ne vous sert pas, sans justification à donner.",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden className="shrink-0 font-bold text-green">
                ✔
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <AvantageDemarrage promotion={devis.promotion} base={devis.total} />
        <CheckoutForm
          defaults={{ firstName: lead?.prenom, email: lead?.email }}
          testMode={isTestMode}
          prixFront={devis.montant}
        />
      </div>
    </>
  );

  return <PageVente paywall={paywall} sansVideo={variante === "B"} />;
}
