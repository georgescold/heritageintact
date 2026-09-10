import type { Metadata } from "next";
import { MesureFunnel } from "@/components/MesureFunnel";
import { cookies } from "next/headers";
import { Header, Footer, TestModeBanner } from "@/components/Chrome";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PixelEvent } from "@/components/MetaPixel";
import { Guarantee } from "@/components/ui";
import { isTestMode, stripeEnModeTest } from "@/lib/config";
import { devisFront } from "@/lib/prix-front";
import { AvantageDemarrage } from "@/components/AvantageDemarrage";
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
      <PixelEvent name="InitiateCheckout" params={{ value: prix, currency: "EUR" }} />
      {(isTestMode || stripeEnModeTest) && <TestModeBanner stripeReel={stripeEnModeTest} />}
      <Header minimal />
      <main className="wrap-wide flex-1 py-8">
        <h1 className="mb-3 text-[1.9rem]">Les 7 erreurs qui offrent votre héritage à l’État</h1>
        <p className="mb-6 text-[1.1rem]">
          Votre guide et ses explications, en paiement unique. Le dossier ci-dessous est facultatif. Le total
          se met à jour avant votre validation.
        </p>
        <AvantageDemarrage promotion={d.promotion} base={d.total} />
        <CheckoutForm defaults={defaults} testMode={isTestMode} prixFront={prix} />
        <div className="mt-8">
          <Guarantee />
        </div>
        <p className="mt-5 text-text-soft">
          Après le paiement : quatre questions obligatoires pour orienter votre parcours, puis votre guide prêt à ouvrir et une proposition complémentaire adaptée. « Je ne sais pas » est une réponse acceptée. Aucun complément payant n’est obligatoire.
        </p>
      </main>
      <Footer />
    </>
  );
}
