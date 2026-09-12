import type { Metadata } from "next";
import { MesureFunnel } from "@/components/MesureFunnel";
import { cookies } from "next/headers";
import { Header, Footer, TestModeBanner } from "@/components/Chrome";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Guarantee } from "@/components/ui";
import { isTestMode, stripeEnModeTest } from "@/lib/config";
import { devisFront } from "@/lib/prix-front";
import { AvantageDemarrage } from "@/components/AvantageDemarrage";
import { EvenementPixel } from "@/components/EvenementPixel";
export const metadata: Metadata = { title: "Votre commande · Les 7 erreurs" };
export default async function Page() {
  const jar = await cookies();
  let defaults: { firstName?: string; email?: string } = {};
  try {
    const raw = jar.get("hi_lead")?.value;
    if (raw) defaults = JSON.parse(raw);
  } catch {}
  const d = await devisFront(jar.get("hi_offre")?.value);
  const prix = d.montant;
  return (
    <>
      <MesureFunnel evenement="vue_commande" />
      <EvenementPixel nom="InitiateCheckout" />
      {(isTestMode || stripeEnModeTest) && <TestModeBanner stripeReel={stripeEnModeTest} />}
      <Header minimal />
      <main className="wrap-wide flex-1 py-8">
        <h1 className="mb-3 text-[1.9rem]">Obtenez le guide qui vous évitera de commettre les 7 erreurs qui offrent votre héritage à l’État sans le savoir</h1>
        <p className="mb-6 text-[1.1rem] font-bold text-red">
          Et préparez votre succession en toute tranquillité en comprenant parfaitement ce que vous faites.
        </p>
        <AvantageDemarrage promotion={d.promotion} base={d.total} />
        <CheckoutForm defaults={defaults} testMode={isTestMode} prixFront={prix} />
        <div className="mt-8">
          <Guarantee />
        </div>
      </main>
      <Footer />
    </>
  );
}
