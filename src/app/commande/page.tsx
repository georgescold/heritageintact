import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Header, Footer, TestModeBanner } from "@/components/Chrome";
import { CheckoutForm } from "@/components/CheckoutForm";
import { ExitPopup } from "@/components/ExitPopup";
import { PixelEvent } from "@/components/MetaPixel";
import { ButtonLink, Guarantee, FAQ, Panel } from "@/components/ui";
import { FoundersCounter } from "@/components/FoundersCounter";
import { BandeauRattrapage } from "@/components/Rattrapage";
import { UrgencyUnderButton } from "@/components/Urgency";
import { isTestMode, stripeEnModeTest } from "@/lib/config";
import { prixFront } from "@/lib/prix";

export const metadata: Metadata = { title: "Votre accès immédiat" };

export default async function CheckoutPage() {
  const jar = await cookies();
  let defaults: { firstName?: string; email?: string } = {};
  try {
    const raw = jar.get("hi_lead")?.value;
    if (raw) defaults = JSON.parse(raw);
  } catch {}

  // Même source que `prepareCheckout` : le prix affiché ne peut pas
  // diverger du prix débité.
  const prix = prixFront(jar.get("hi_flash")?.value, jar.get("hi_rattrapage")?.value);

  return (
    <>
      <PixelEvent name="InitiateCheckout" params={{ value: 27, currency: "EUR" }} />
      {(isTestMode || stripeEnModeTest) && <TestModeBanner stripeReel={stripeEnModeTest} />}
      <Header minimal />
      <main className="flex-1">
        <div className="wrap-wide py-6 sm:py-8">
          <h1 className="mb-1 text-[1.5rem] sm:text-[1.9rem]">
            Votre accès immédiat à la Méthode Héritage Intact
          </h1>
          <p className="mb-4 text-text-soft">
            Les 8 étapes qui évitent les 7 erreurs. Deux minutes pour y accéder, et ce soir vous
            avez votre chiffre.
          </p>

          {/*
            L'urgence AVANT le formulaire, pas après.
            La checklist du bon de commande (`05-funnel/optimisation-checklist.md`
            § 5) demande « urgence / rareté ». Les deux existaient sur cette page
            mais vivaient sous le formulaire, dans la colonne secondaire : à cet
            endroit elles ne pèsent sur aucune décision, puisque la décision est
            déjà prise ou déjà perdue. Les deux compteurs sont réels — les 500
            places sont en base, le 31 décembre est voté.
          */}
          {/* Quelqu'un qui vient d'accepter les −30 % doit retrouver sa
              remise ici, en haut, avant le formulaire. Sinon il arrive sur un
              prix qui ne dit nulle part ce qu'il vient de décider. */}
          <div className="mb-5 space-y-3">
            <BandeauRattrapage />
            <FoundersCounter />
            <UrgencyUnderButton />
          </div>

          <CheckoutForm defaults={defaults} testMode={isTestMode} prixFront={prix} />

          <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
            <div className="space-y-6">
              <Guarantee />
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
                      a: "Non : c'est une méthode pédagogique. Pour un conseil sur votre situation, le Dossier Notaire vous prépare au rendez-vous avec votre notaire.",
                    },
                    {
                      q: "Je ne suis pas à l'aise avec le paiement en ligne.",
                      // La mention Stripe vit deja sous les champs de carte, au moment ou
                      // on la saisit — c'est la qu'elle rassure. La repeter ici ne fait
                      // que consommer de la place. Cette reponse traite donc ce que la
                      // mention ne traite pas : la peur elle-meme.
                      a: "Vous n'avez pas à nous croire sur parole. Vous avez trente jours pour demander le remboursement, sans avoir à vous justifier, par un simple email. Et l'adresse de contact a une vraie personne derrière : écrivez-lui avant d'acheter si vous voulez vous en assurer.",
                    },
                    {
                      q: "Et si la loi change ?",
                      a: "La Règle de Mise à Jour est incluse, et les mises à jour de la Méthode sont à vie.",
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

      <ExitPopup storageKey="bdc" title="Ce que vous risquez si vous fermez cette page">
        <ul className="space-y-2 text-[1.03rem]">
          {[
            "Vous êtes à deux minutes de connaître votre chiffre. En fermant, vous repartez sans.",
            "Le prix affiché est celui de votre compteur. Il ne se rouvre pas.",
            "Rien n'est engagé : garantie 30 jours, un email suffit.",
          ].map((t) => (
            <li key={t} className="flex gap-2 border-l-4 border-red bg-red-bg p-3">
              <span aria-hidden className="shrink-0 font-bold text-red">
                ✕
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <ButtonLink href="/commande" variant="blue">
          Reprendre ma commande
        </ButtonLink>
      </ExitPopup>
    </>
  );
}
