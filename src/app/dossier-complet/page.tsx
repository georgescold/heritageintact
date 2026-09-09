import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpsellPage } from "@/components/UpsellPage";
import { PRODUCTS, VIDEO, euros } from "@/lib/config";
import { getOrder } from "@/lib/db";
import { appliquerPalier, palierDe } from "@/lib/palier";
import { etapeTunnel } from "@/lib/tunnel";

export const metadata: Metadata = { title: PRODUCTS.pack1.name };

/**
 * LE DOSSIER COMPLET — un seul écran, un seul débit, pour ceux dont les deux
 * produits sont individuellement urgents.
 *
 * ═══ Pourquoi cet écran existe, et pourquoi il ne s'affiche presque jamais
 *
 * Le routage ne l'ouvre qu'à trois conditions cumulatives : un contrat déclaré
 * « oui » — jamais « je ne sais plus », on ne met pas 347 € devant quelqu'un
 * qui n'est pas certain de posséder l'objet audité ; au moins un héritier hors
 * du barème de la ligne directe ; et le bump conservé au bon de commande. Cela
 * représente environ 5 % des acheteurs, et chacun d'eux a réellement besoin des
 * deux produits.
 *
 * ⚠️ LE VEUVAGE N'EN FAIT PAS PARTIE, et c'est une correction de droit, pas de
 * prudence : les enfants d'une veuve conservent leurs 100 000 € par parent. Les
 * compter comme « hors ligne directe » aurait déclenché 347 € sur une prémisse
 * fausse.
 *
 * ═══ Pourquoi la remise se justifie ligne à ligne
 *
 * Les « 3 modèles de clause bénéficiaire » sont facturés 47 € dans LES DEUX
 * piles de valeur. Vendus ensemble, ils ne sont livrés qu'une fois — donc
 * facturés une fois. 394 − 47 = 347. La raison est écrite sous le récapitulatif
 * pour que l'acheteur la vérifie lui-même, et c'est ce qui distingue cette
 * remise d'un ancrage de façade.
 *
 * Et elle ne punit aucun chemin : 297 + 50 = 347, 97 + 250 = 347, pack = 347.
 * Quel que soit l'ordre dans lequel on lui présente les produits, celui qui
 * prend les deux paie la même chose.
 */
export default async function PackPage({
  searchParams,
}: {
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { o, err } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  const etape = await etapeTunnel("pack", order.id, {
    bumpPresent: order.items.some((i) => i.sku === "bump"),
  });
  if (!etape.afficher) {
    redirect(
      etape.versOu + (err === "1" ? (etape.versOu.includes("?") ? "&" : "?") + "err=1" : ""),
    );
  }

  // Le prix affiché doit être celui que `chargeUpsell` débitera : il applique
  // le même palier, calculé sur la même date en base.
  const { remise } = palierDe(order.createdAt, Date.now());
  const prix = appliquerPalier(PRODUCTS.pack1.price, remise);

  return (
    <UpsellPage
      step={2}
      paymentFailed={err === "1"}
      orderId={order.id}
      sku="pack1"
      prix={prix}
      visuel={{
        src: "/img/produits/dossier-complet.jpg",
        alt: "Les deux ensembles de feuilles, réunis par un bandeau.",
      }}
      next={etape.suivant}
      kicker="Attendez : votre commande est validée."
      h1={
        <>
          Dans votre situation, deux choses pressent en même temps&nbsp;: la ligne de vos héritiers,
          et la date de vos versements.
        </>
      }
      h2={`${PRODUCTS.pack1.name} : ${PRODUCTS.upsell1.name} et ${PRODUCTS.upsell2.name}, ensemble et en une seule fois.`}
      videoId={VIDEO.upsell1}
      videoMinutes={4}
      rows={[
        { label: "12 plans-types, une page par situation familiale", value: "197 €" },
        {
          label:
            "Le Calcul Automatique : votre Feuille de Facture Invisible, remplie toute seule (plusieurs héritiers, plusieurs contrats, démembrement, donations passées)",
          value: "147 €",
        },
        {
          label: "Le Calendrier de Transmission sur 15 ans : quoi faire, quelle année",
          value: "67 €",
        },
        {
          label: "Le tableau de bord familial : qui reçoit quoi, quand, à quel coût",
          value: "39 €",
        },
        { label: "L'audit de votre contrat en 30 minutes : la grille notée sur 10", value: "67 €" },
        { label: "Le tableau de décision « avant / après 70 ans »", value: "37 €" },
        { label: "La lettre-type pour demander la modification à votre assureur", value: "27 €" },
        {
          label: "Le comparatif des frais : ce que 3 % sur 20 ans coûte réellement",
          value: "19 €",
        },
        {
          label: "3 modèles de clause bénéficiaire commentés — comptés une seule fois",
          value: "47 €",
        },
      ]}
      declineText="Non merci, je continue sans"
    >
      <p className="mb-3 text-[1.05rem]">
        Ces deux ensembles se vendent séparément {euros(PRODUCTS.upsell1.price)} et{" "}
        {euros(PRODUCTS.upsell2.price)}, soit{" "}
        {euros(PRODUCTS.upsell1.price + PRODUCTS.upsell2.price)}. Ensemble, ils sont à{" "}
        <strong>{euros(PRODUCTS.pack1.price)}</strong>.
      </p>
      <p className="mb-3 text-[1.05rem]">
        <strong>Et voici pourquoi, exactement.</strong> Vous voyez la ligne « 3 modèles de clause
        bénéficiaire », à 47 €. Elle figure dans les deux : dans le plan de votre situation
        familiale, et dans l&apos;audit de votre contrat. Achetés ensemble, ces trois modèles ne
        vous sont livrés qu&apos;une fois — ils ne vous sont donc facturés qu&apos;une fois. 394 €
        moins 47 €, cela fait 347 €. Il n&apos;y a pas d&apos;autre remise, et il n&apos;y en a pas
        besoin.
      </p>
      <p className="text-[1.05rem]">
        Vous pouvez aussi les prendre l&apos;un après l&apos;autre : le second vous sera alors
        proposé sans les modèles que vous aurez déjà. Le total est identique, à l&apos;euro près.
        Nous ne pénalisons pas ceux qui préfèrent avancer un pas à la fois.
      </p>
    </UpsellPage>
  );
}
