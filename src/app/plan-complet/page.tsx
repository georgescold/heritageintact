import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpsellPage } from "@/components/UpsellPage";
import { getOrder } from "@/lib/db";
import { VIDEO } from "@/lib/config";

export const metadata: Metadata = { title: "Le Plan Transmission Complet" };

export default async function Upsell1Page({
  searchParams,
}: {
  searchParams: Promise<{ o?: string }>;
}) {
  const { o } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  return (
    <UpsellPage
      step={2}
      orderId={order.id}
      sku="upsell1"
      next={`/kit-assurance-vie?o=${order.id}`}
      kicker="Attendez : votre commande est validée."
      h1={
        <>
          Avant d&apos;accéder à votre espace, une seule question : dans <em>votre</em> situation
          familiale, laquelle de vos 3 dates en premier&nbsp;?
        </>
      }
      h2="Le Plan Transmission Complet : les 12 situations familiales, chacune avec son plan d'action dans l'ordre, ses 3 pièges, ses 3 questions au notaire, et le Simulateur Complet."
      videoId={VIDEO.upsell1}
      videoMinutes={4}
      rows={[
        { label: "12 plans-types, une page par situation familiale", value: "197 €" },
        {
          label:
            "Le Simulateur Automatique (plusieurs héritiers, plusieurs contrats, démembrement, donations passées)",
          value: "147 €",
        },
        {
          label: "Le Calendrier de Transmission sur 15 ans : quoi faire, quelle année",
          value: "67 €",
        },
        { label: "3 modèles de clause bénéficiaire commentés", value: "47 €" },
        {
          label: "Le tableau de bord familial : qui reçoit quoi, quand, à quel coût",
          value: "39 €",
        },
      ]}
      declineText="Non merci, je préfère trouver seul le bon ordre pour ma situation."
    >
      <p>
        Félicitations : vous faites partie des rares familles qui ont décidé de savoir. Dans
        quelques minutes, vous aurez votre chiffre.
      </p>
      <p>
        Mais soyons honnêtes : le chiffre, c&apos;est le début. La question qui vient tout de suite
        après, c&apos;est&nbsp;: <em>« Dans ma situation, je fais quoi, en premier ? »</em>
      </p>
      <p>
        Un couple marié avec deux enfants ne prend pas les mêmes décisions qu&apos;une veuve de 71
        ans, qu&apos;une famille recomposée, ou qu&apos;un père dont le fils vit en couple sans être
        marié. Le bon levier pour l&apos;un est un piège pour l&apos;autre : la donation au dernier
        vivant, formidable en famille « classique », peut spolier les enfants d&apos;un premier lit.
      </p>
      <p>
        C&apos;est pour ça que le Plan Transmission Complet existe : douze situations familiales, et
        pour chacune, <strong>une page</strong>. Les 3 dates dans le bon ordre, les trois pièges à
        éviter, les trois questions à poser au notaire, et ce que ça change en euros sur un cas
        concret.
      </p>
      <p className="text-[0.95rem] text-text-soft">
        Quatre plans-types sont disponibles immédiatement (situations 1, 2, 4 et 5, les plus
        fréquentes). Les huit autres sont livrés dans votre espace sous 30 jours.
      </p>
    </UpsellPage>
  );
}
