import type { Metadata } from "next";

import { redirect } from "next/navigation";
import { FormulaireSituation } from "./Formulaire";
import { Header, Footer } from "@/components/Chrome";
import { Panel } from "@/components/ui";
import { getOrder } from "@/lib/db";


export const metadata: Metadata = { title: "Votre achat est confirmé — votre priorité", robots: { index: false, follow: false } };
/** La livraison technique reste immédiate ; le parcours visible pose les questions avant le panneau de remise. */
export default async function SituationPage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order || order.status !== "paid") redirect("/commande");
  return <><Header minimal /><main className="wrap max-w-[720px] flex-1 py-7">
    <p className="mb-4 text-sm font-bold text-orange-dark">1. Votre priorité → 2. Votre Méthode → 3. La suite adaptée</p>
    <Panel tone="green" title="Votre paiement est accepté">
      <p>Vous allez recevoir les 7 erreurs qui offrent votre héritage à l’État après avoir complété le questionnaire ci-dessous.</p>
    </Panel>
    <h1 className="mb-3 mt-6 text-[1.7rem]">Avant de découvrir les 7 erreurs nous aimerions comprendre profondément votre situation :</h1>
    <FormulaireSituation orderId={order.id} email={order.email} />
    <p className="mt-5 text-sm text-text-soft">Votre accès reste acquis dès le paiement. Les réponses ne valent jamais consentement aux emails de vente. En cas de difficulté, votre lien d’accès et l’assistance restent disponibles par email.</p>
  </main><Footer /></>;
}
