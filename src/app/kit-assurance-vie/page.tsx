import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpsellPage } from "@/components/UpsellPage";
import { getOrder } from "@/lib/db";
import { VIDEO } from "@/lib/config";

export const metadata: Metadata = { title: "Le Kit Assurance-Vie" };

export default async function Upsell2Page({
  searchParams,
}: {
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { o, err } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  return (
    <UpsellPage
      step={3}
      paymentFailed={err === "1"}
      orderId={order.id}
      sku="upsell2"
      next={`/merci?o=${order.id}`}
      kicker="Dernière chose avant votre espace."
      h1={
        <>
          Votre assurance-vie. Celle de la banque, ouverte il y a 15 ou 20 ans. Trois questions, cinq
          minutes&nbsp;: 9 contrats sur 10 échouent.
        </>
      }
      h2="Le Kit Assurance-Vie : l'audit de votre contrat en 30 minutes, les 3 clauses bénéficiaires rédigées et commentées, et le tableau « avant / après 70 ans » pour décider quoi faire avec votre épargne avant votre prochain anniversaire."
      videoId={VIDEO.upsell2}
      videoMinutes={3}
      rows={[
        { label: "L'audit de votre contrat en 30 minutes : la grille notée sur 10", value: "67 €" },
        { label: "Les 3 clauses bénéficiaires rédigées et commentées ligne par ligne", value: "47 €" },
        { label: "Le tableau de décision « avant / après 70 ans »", value: "37 €" },
        { label: "La lettre-type pour demander la modification à votre assureur", value: "27 €" },
        { label: "Le comparatif des frais : ce que 3 % sur 20 ans coûte réellement", value: "19 €" },
      ]}
      declineText="Non merci, mon contrat est parfait tel qu'il est."
    >
      <p>
        L&apos;assurance-vie est l&apos;outil n°1 de la transmission en France. C&apos;est aussi celui que
        presque tout le monde a, et que presque tout le monde a mal réglé. Trois questions suffisent pour
        le savoir&nbsp;: <em>quelle est votre clause bénéficiaire ? quand avez-vous versé, avant ou après
        70 ans ? combien de frais ?</em>
      </p>
      <p>
        La clause standard, « mon conjoint, à défaut mes enfants », est souvent la pire des trois options
        possibles. Les versements après 70 ans divisent l&apos;avantage par cinq. Et 3 % de frais sur 20
        ans, c&apos;est une année d&apos;épargne offerte à la banque.
      </p>
      <p className="text-[0.95rem] text-text-soft">
        Aucun assureur ni contrat n&apos;est nommé : le Kit vous apprend à lire et auditer <em>le vôtre</em>.
      </p>
    </UpsellPage>
  );
}
