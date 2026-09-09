import type { Metadata } from "next";
import { MesureFunnel } from "@/components/MesureFunnel";
import { cookies } from "next/headers";
import { Header, Footer, TestModeBanner } from "@/components/Chrome";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PixelEvent } from "@/components/MetaPixel";
import { Guarantee } from "@/components/ui";
import { isTestMode, stripeEnModeTest } from "@/lib/config";
import { prixFront } from "@/lib/prix";
export const metadata: Metadata = { title: "Votre commande · Comprendre ma transmission" };
export default async function Page() {
  const jar = await cookies();
  let defaults: { firstName?: string; email?: string } = {};
  try {
    const raw = jar.get("hi_lead")?.value;
    if (raw) defaults = JSON.parse(raw);
  } catch {}
  const prix = prixFront();
  return (
    <>
      <MesureFunnel evenement="vue_commande" />
      <PixelEvent name="InitiateCheckout" params={{ value: prix, currency: "EUR" }} />
      {(isTestMode || stripeEnModeTest) && <TestModeBanner stripeReel={stripeEnModeTest} />}
      <Header minimal />
      <main className="wrap-wide flex-1 py-8">
        <h1 className="mb-3 text-[1.9rem]">Comprendre ma transmission</h1>
        <p className="mb-6 text-[1.1rem]">
          Votre méthode à 27 €, en paiement unique. Le dossier ci-dessous est facultatif. Le total
          se met à jour avant votre validation.
        </p>
        <CheckoutForm defaults={defaults} testMode={isTestMode} prixFront={prix} />
        <div className="mt-8">
          <Guarantee />
        </div>
        <p className="mt-5 text-text-soft">
          Après le paiement : votre accès, puis quelques questions facultatives pour organiser votre
          parcours. Vous pouvez ignorer toute proposition complémentaire.
        </p>
      </main>
      <Footer />
    </>
  );
}
