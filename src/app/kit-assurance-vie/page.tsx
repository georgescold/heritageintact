import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpsellPage } from "@/components/UpsellPage";
import { getOrder } from "@/lib/db";
import { PRODUCTS, VIDEO } from "@/lib/config";
import { appliquerPalier, palierDe } from "@/lib/palier";
import { etapeTunnel } from "@/lib/tunnel";

/**
 * ⚠️ AUCUN NOM DE PRODUIT EN DUR — même motif que /plan-complet. Cette page
 * disait « Le Kit Assurance-Vie » alors que le catalogue, le reçu, /merci et
 * la boutique disent « Votre assurance-vie, vérifiée en 30 minutes ».
 */
export const metadata: Metadata = { title: PRODUCTS.upsell2.name };

export default async function Upsell2Page({
  searchParams,
}: {
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { o, err } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  // C'est le tunnel qui decide : cet ecran a-t-il sa place dans le parcours de
  // CET acheteur, et qu'y a-t-il apres lui. Quelqu'un qui a declare ne pas avoir
  // d'assurance-vie ne voit jamais cette page — lui proposer l'audit d'un
  // contrat inexistant serait un remboursement annonce, et la seule offre
  // possible pour lui serait d'en ouvrir un, c'est-a-dire une recommandation de
  // placement, interdite hors statut CIF.
  const etape = await etapeTunnel("assurance-vie", order.id, {
    bumpPresent: order.items.some((i) => i.sku === "bump"),
  });
  // L'échec de paiement d'un upsell précédent doit survivre à la redirection :
  // sans lui, le client repart vers /merci sans jamais savoir que son second
  // achat n'est pas passé.
  if (!etape.afficher) {
    redirect(
      etape.versOu + (err === "1" ? (etape.versOu.includes("?") ? "&" : "?") + "err=1" : ""),
    );
  }

  // Le prix affiché doit être celui que `chargeUpsell` débitera : il applique
  // le même palier, calculé sur la même date en base.
  const { remise } = palierDe(order.createdAt, Date.now());
  const prix = appliquerPalier(PRODUCTS.upsell2.price, remise);

  return (
    <UpsellPage
      step={3}
      paymentFailed={err === "1"}
      orderId={order.id}
      sku="upsell2"
      prix={prix}
      visuel={{
        src: "/img/produits/assurance-vie.jpg",
        alt: "Un contrat d’assurance-vie ouvert à côté de la grille d’audit à remplir.",
      }}
      next={etape.suivant}
      motifSecond={etape.accroche?.h2}
      kicker={etape.accroche?.chapeau ?? "Une dernière proposition, et c'est tout."}
      h1={
        etape.accroche?.h1 ?? (
          <>
            Votre assurance-vie. Celle de la banque, ouverte il y a 15 ou 20 ans. Trois questions,
            cinq minutes&nbsp;: 9 contrats sur 10 échouent.
          </>
        )
      }
      h2={`${PRODUCTS.upsell2.name} : l'audit de votre contrat, les 3 clauses bénéficiaires rédigées et commentées, et le tableau « avant / après 70 ans » pour décider quoi faire avec votre épargne avant votre prochain anniversaire.`}
      videoId={VIDEO.upsell2}
      videoMinutes={3}
      rows={[
        { label: "L'audit de votre contrat en 30 minutes : la grille notée sur 10", value: "67 €" },
        {
          label: "Les 3 clauses bénéficiaires rédigées et commentées ligne par ligne",
          value: "47 €",
        },
        { label: "Le tableau de décision « avant / après 70 ans »", value: "37 €" },
        { label: "La lettre-type pour demander la modification à votre assureur", value: "27 €" },
        {
          label: "Le comparatif des frais : ce que 3 % sur 20 ans coûte réellement",
          value: "19 €",
        },
      ]}
      declineText="Non merci, mon contrat est parfait tel qu'il est."
    >
      <p>
        L&apos;assurance-vie est l&apos;outil n°1 de la transmission en France. C&apos;est aussi
        celui que presque tout le monde a, et que presque tout le monde a mal réglé. Trois questions
        suffisent pour le savoir&nbsp;:{" "}
        <em>
          quelle est votre clause bénéficiaire ? quand avez-vous versé, avant ou après 70 ans ?
          combien de frais ?
        </em>
      </p>
      <p>
        La clause standard, « mon conjoint, à défaut mes enfants », est souvent la pire des trois
        options possibles. Les versements après 70 ans divisent l&apos;avantage par cinq. Et 3 % de
        frais sur 20 ans, c&apos;est une année d&apos;épargne offerte à la banque.
      </p>
      <p className="text-[0.95rem] text-text-soft">
        Aucun assureur ni contrat n&apos;est nommé : {PRODUCTS.upsell2.name} vous apprend à lire et
        auditer <em>le vôtre</em>.
      </p>
    </UpsellPage>
  );
}
