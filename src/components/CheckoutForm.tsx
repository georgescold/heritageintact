"use client";

import { useActionState, useState } from "react";
import { checkout, type FormState } from "@/app/actions";
import { CONTACT_EMAIL, PRODUCTS, euros, type Product } from "@/lib/config";
import { TrustRow } from "./Chrome";
import { Button, Panel } from "./ui";

export function CheckoutForm({
  defaults,
  testMode,
}: {
  defaults: { firstName?: string; email?: string };
  testMode: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(checkout, undefined);
  const [bump, setBump] = useState(false);
  const total = PRODUCTS.front.price + (bump ? PRODUCTS.bump.price : 0);

  return (
    <form action={action} noValidate className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
      {/* Colonne gauche : formulaire */}
      <div className="space-y-5">
        <Panel title="1. Vos coordonnées">
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block font-bold">Prénom</span>
              <input
                name="firstName"
                defaultValue={defaults.firstName}
                autoComplete="given-name"
                required
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-bold">Adresse email</span>
              <span className="mb-1 block text-[0.85rem] text-text-soft">Vos accès y seront envoyés.</span>
              <input
                name="email"
                type="email"
                defaultValue={defaults.email}
                autoComplete="email"
                inputMode="email"
                required
                className="field"
              />
            </label>
          </div>
        </Panel>

        <Panel title="2. Paiement sécurisé">
          {testMode ? (
            <div className="rounded border border-dashed border-grey-line bg-grey-bg p-3 text-[0.95rem] text-text-soft">
              <p className="font-bold text-text">Emplacement du formulaire de carte bancaire (Stripe).</p>
              <p>En mode test, cliquez simplement sur le bouton : aucun débit n&apos;est effectué.</p>
            </div>
          ) : (
            <div id="stripe-payment-element" className="rounded border border-grey-line bg-white p-3">
              {/* Stripe Payment Element sera monté ici */}
            </div>
          )}
          <div className="mt-3">
            <TrustRow />
          </div>
          <p className="mt-2 text-[0.85rem] text-text-soft">
            Le paiement est traité par Stripe. Nous ne voyons jamais votre numéro de carte.
          </p>
        </Panel>

        {/* Le bump : case NON pré-cochée (obligation légale en France) */}
        <label className="block cursor-pointer rounded border-2 border-orange bg-yellow-bg p-3 sm:p-4">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              name="bump"
              checked={bump}
              onChange={(e) => setBump(e.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 accent-orange"
            />
            <span>
              <span className="block text-[1.05rem] font-bold text-blue">
                OUI, ajoutez le Dossier Notaire Prêt-à-Signer pour {euros(PRODUCTS.bump.price)} seulement{" "}
                <span className="font-normal text-text-soft line-through">(au lieu de {euros(PRODUCTS.bump.anchor)})</span>
              </span>
              <span className="mt-1 block text-[0.95rem]">
                L&apos;inventaire patrimonial, la fiche famille, la liste des 12 pièces à apporter et le mail
                qui fait que le notaire prépare votre rendez-vous. Une heure de travail, déjà faite. Une
                vidéo de 6 minutes vous montre comment tout remplir.
              </span>
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 text-[0.9rem] text-text-soft">
          <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-blue-mid" />
          <span>
            Je demande l&apos;accès immédiat au contenu numérique et reconnais renoncer à mon droit de
            rétractation de 14 jours. La garantie contractuelle de 30 jours « satisfait ou remboursé »
            s&apos;applique intégralement.
          </span>
        </label>

        {state?.error && (
          <p role="alert" className="rounded border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
            {state.error}
          </p>
        )}

        <Button variant="green" disabled={pending}>
          {pending ? "Validation en cours..." : `Valider ma commande : ${euros(total)}`}
        </Button>
        <p className="text-center text-[0.9rem] text-text-soft">
          Accès immédiat après validation. Une question ?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> (réponse sous 24 h).
        </p>
      </div>

      {/* Colonne droite : récapitulatif */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Panel title="Votre commande">
          <Line product={PRODUCTS.front} />
          {bump && <Line product={PRODUCTS.bump} />}
          <div className="mt-2 flex items-baseline justify-between border-t-2 border-blue pt-2">
            <span className="font-bold">Total à payer</span>
            <span className="text-[1.5rem] font-bold text-blue">{euros(total)}</span>
          </div>
          <ul className="mt-4 space-y-1 text-[0.95rem]">
            {[
              "8 modules vidéo, accès immédiat et à vie",
              "Le Simulateur de Facture Invisible",
              "Le Calendrier de vos 3 Dates",
              "Le Plan en 1 Page",
              "5 bonus (valeur 135 €)",
              "Mises à jour à vie",
              "Garantie 30 jours",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-green">✔</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </form>
  );
}

function Line({ product }: { product: Product }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-grey-line-soft py-2">
      <span>{product.short}</span>
      <span className="whitespace-nowrap">
        <span className="mr-2 text-[0.85rem] text-text-soft line-through">{euros(product.anchor)}</span>
        <strong>{euros(product.price)}</strong>
      </span>
    </div>
  );
}
