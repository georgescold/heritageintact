import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Header, Footer, TestModeBanner } from "@/components/Chrome";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ExitPopup } from "@/components/ExitPopup";
import { PixelEvent } from "@/components/MetaPixel";
import { ButtonLink, Guarantee, FAQ, Panel } from "@/components/ui";
import { FoundersCounter } from "@/components/FoundersCounter";
import { isTestMode } from "@/lib/config";

export const metadata: Metadata = { title: "Votre accès immédiat" };

export default async function CheckoutPage() {
  const jar = await cookies();
  let defaults: { firstName?: string; email?: string } = {};
  try {
    const raw = jar.get("hi_lead")?.value;
    if (raw) defaults = JSON.parse(raw);
  } catch {}

  return (
    <>
      <PixelEvent name="InitiateCheckout" params={{ value: 27, currency: "EUR" }} />
      {isTestMode && <TestModeBanner />}
      <Header minimal />
      <main className="flex-1">
        <div className="wrap-wide py-6 sm:py-8">
          <h1 className="mb-1 text-[1.5rem] sm:text-[1.9rem]">
            Votre accès immédiat aux 7 Erreurs et à la Méthode des 3 Verrous
          </h1>
          <p className="mb-6 text-text-soft">Deux minutes. Ce soir, vous avez votre chiffre.</p>

          <CheckoutForm defaults={defaults} testMode={isTestMode} />

          <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <div className="space-y-6">
              <Guarantee />
              <FoundersCounter />
              <div>
                <h2 className="mb-3 text-[1.3rem]">Questions fréquentes</h2>
                <FAQ
                  items={[
                    {
                      q: "Est-ce que ça remplace le notaire ?",
                      a: "Non. Ça vous permet d'y aller avec un dossier et des décisions, au lieu des mains vides. Le notaire acte ; vous décidez.",
                    },
                    {
                      q: "Est-ce un conseil personnalisé ?",
                      a: "Non : c'est un programme pédagogique. Pour un conseil sur votre situation, le Dossier Notaire vous prépare au rendez-vous avec votre notaire.",
                    },
                    {
                      q: "Je ne suis pas à l'aise avec le paiement en ligne.",
                      a: "Le paiement passe par Stripe, le même système que des milliers de sites marchands. Nous ne voyons jamais votre numéro de carte. Et l'adresse email ci-dessus a une vraie personne derrière.",
                    },
                    {
                      q: "Et si la loi change ?",
                      a: "La Règle de Mise à Jour est incluse, et les mises à jour du programme sont à vie.",
                    },
                  ]}
                />
              </div>
            </div>
            <Panel title="Ils ont fait leur simulation">
              <p className="text-[0.95rem] text-text-soft">
                Les premiers retours de membres seront affichés ici, avec leur accord : prénom, âge,
                département. Aucun témoignage n&apos;est publié avant d&apos;exister.
              </p>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />

      <ExitPopup
        storageKey="bdc"
        title="Vous hésitez ? C'est normal. Voici le module 1 en accès libre."
      >
        <p>Regardez « Je verrai ça plus tard », le compteur des 15 ans, puis décidez.</p>
        <ButtonLink href="/module-1" variant="blue">
          Voir le module 1
        </ButtonLink>
      </ExitPopup>
    </>
  );
}
