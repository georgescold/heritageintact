"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { confirmCheckout } from "@/app/actions";
import { preparerCommandeGuide } from "@/app/commande-guide";
import { SITE_URL, euros } from "@/lib/config";
import { Button } from "./ui";

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PK ? loadStripe(PK) : null;

/**
 * LE BON DE COMMANDE D'UN GUIDE À L'UNITÉ.
 *
 * Il reprend pas à pas la séquence de `CheckoutForm` — validation de la carte,
 * préparation serveur, confirmation, vérification serveur — parce que c'est
 * celle qui est éprouvée. Ce qu'il n'a pas : le bump, la fenêtre de prix et le
 * récapitulatif à plusieurs lignes. Un seul produit, un seul montant.
 *
 * ⚠️ La confirmation passe par `confirmCheckout`, le MÊME que le tunnel : c'est
 * lui qui revérifie le paiement auprès de Stripe, marque la commande payée et
 * livre l'accès. Rien de tout cela n'est réécrit ici.
 */
export function CommandeGuide({
  sku,
  nom,
  prix,
  defaults,
}: {
  sku: string;
  nom: string;
  prix: number;
  defaults: { firstName?: string; email?: string };
}) {
  // ⚠️ LES HOOKS STRIPE EXIGENT LE FOURNISSEUR <Elements>, MÊME POUR RENDRE
  // NULL. Sans clé publique — le mode simulé, et toute la recette — appeler
  // useStripe() hors du fournisseur lève « Could not find Elements context » et
  // la page entière répond 500. On ne rend donc jamais le même composant dans
  // les deux cas : celui d'en bas appelle les hooks, l'autre non.
  if (!stripePromise) {
    return <Formulaire sku={sku} nom={nom} prix={prix} defaults={defaults} stripe={null} elements={null} />;
  }
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Math.round(prix * 100),
        currency: "eur",
        /**
         * ⚠️ IL DOIT ÊTRE ICI AUSSI, ET PAS SEULEMENT CÔTÉ SERVEUR.
         *
         * Le PaymentIntent est créé avec `setup_future_usage: "off_session"`.
         * En mode différé, Elements compare ce qu'il a déclaré à ce que porte
         * l'intention : sans cette ligne il annonce `null`, et Stripe refuse la
         * confirmation par « The provided setup_future_usage (off_session) does
         * not match the expected setup_future_usage (null) ». L'acheteur voit ce
         * message anglais, en rouge, sous sa carte déjà saisie.
         *
         * Les deux valeurs se règlent donc ensemble. C'est aussi ce que fait
         * `CheckoutForm`, pour la même raison.
         */
        setupFutureUsage: "off_session",
        // Carte uniquement : Klarna et consorts ajoutent de la friction et de la
        // méfiance sur un avatar de 60-78 ans, et c'est la seule démarche qui
        // permette de débiter un ajout ultérieur en un clic.
        paymentMethodTypes: ["card"],
        locale: "fr",
        appearance: {
          variables: {
            colorPrimary: "#12365E",
            colorText: "#222222",
            fontFamily: "Arial, Helvetica, sans-serif",
          },
        },
      }}
    >
      <AvecStripe sku={sku} nom={nom} prix={prix} defaults={defaults} />
    </Elements>
  );
}

/** Le seul endroit qui appelle les hooks : il est toujours sous <Elements>. */
function AvecStripe(props: {
  sku: string;
  nom: string;
  prix: number;
  defaults: { firstName?: string; email?: string };
}) {
  const stripe = useStripe();
  const elements = useElements();
  return <Formulaire {...props} stripe={stripe} elements={elements} />;
}

function Formulaire({
  sku,
  nom,
  prix,
  defaults,
  stripe,
  elements,
}: {
  sku: string;
  nom: string;
  prix: number;
  defaults: { firstName?: string; email?: string };
  stripe: ReturnType<typeof useStripe>;
  elements: ReturnType<typeof useElements>;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(defaults.firstName ?? "");
  const [email, setEmail] = useState(defaults.email ?? "");
  const [consent, setConsent] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [attente, setAttente] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    setAttente(true);
    try {
      const demande = { sku, firstName, email, consent, montantAffiche: prix };

      // Mode simulé : aucune clé Stripe, aucun débit.
      if (!stripe || !elements) {
        const prep = await preparerCommandeGuide(demande);
        if (!prep.ok) return setErreur(prep.error);
        router.push(`/merci?o=${prep.orderId}`);
        return;
      }

      // 1. Stripe valide la carte avant tout appel serveur.
      const { error: saisie } = await elements.submit();
      if (saisie) return setErreur(saisie.message ?? "Vérifiez les informations de votre carte.");

      // 2. Le serveur crée la commande et le PaymentIntent.
      const prep = await preparerCommandeGuide(demande);
      if (!prep.ok) return setErreur(prep.error);

      // 3. Confirmation, sans redirection quand la banque n'exige pas
      //    d'authentification forte.
      const { error: paiement, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: prep.clientSecret,
        confirmParams: {
          return_url: `${SITE_URL}/commande/confirmation?o=${prep.orderId}`,
          receipt_email: email,
        },
        redirect: "if_required",
      });
      if (paiement) {
        return setErreur(
          paiement.message ?? "Le paiement a été refusé. Aucun montant n’a été débité.",
        );
      }

      // 4. Le serveur revérifie auprès de Stripe, puis livre.
      if (paymentIntent?.id) {
        const fait = await confirmCheckout(prep.orderId, paymentIntent.id);
        if (!fait.ok) return setErreur(fait.error ?? "Le paiement n’a pas pu être vérifié.");
      }
      router.push(`/merci?o=${prep.orderId}`);
    } catch {
      setErreur("Une erreur est survenue. Aucun montant n’a été débité.");
    } finally {
      setAttente(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="border-2 border-blue bg-grey-bg p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-bold">{nom}</span>
          <span className="text-[1.3rem] font-bold text-blue">{euros(prix)}</span>
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block font-bold">Votre prénom</span>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          autoComplete="given-name"
          required
          className="field"
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-bold">Votre adresse email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          className="field"
        />
        <span className="mt-1 block text-[0.88rem] text-text-soft">
          C’est à cette adresse que votre lien d’accès est envoyé.
        </span>
      </label>

      {stripe && (
        <div className="border border-grey-line bg-white p-4">
          <PaymentElement
            options={{
              layout: "tabs",
              /**
               * LINK EST COUPÉ, PAS REPLIÉ — même décision que `CheckoutForm`,
               * où le raisonnement complet est écrit.
               *
               * Stripe insérait ici « Enregistrer mes informations pour un
               * paiement plus rapide » : un second formulaire réclamant un
               * NUMÉRO DE PORTABLE au nom d'une marque tierce, avec ses propres
               * conditions, à la seconde où l'acheteur saisit sa carte. Sur un
               * acheteur de 74 ans, ce bloc pose la question qui tue.
               *
               * Et il n'apporte rien : nos paiements suivants sont déjà en un
               * clic, parce que `setup_future_usage` conserve la carte côté
               * Stripe.
               */
              wallets: { link: "never" },
            }}
          />
        </div>
      )}

      <label className="flex items-start gap-2 text-[0.92rem]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-1 h-5 w-5 shrink-0 accent-blue-mid"
        />
        <span>
          Je demande l’accès immédiat au contenu et je reconnais perdre mon droit de rétractation
          une fois la totalité du contenu délivrée.
        </span>
      </label>

      {erreur && (
        <p role="alert" className="border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
          {erreur}
        </p>
      )}

      <Button disabled={attente}>
        {attente ? "Validation en cours…" : `Valider ma commande — ${euros(prix)}`}
      </Button>
    </form>
  );
}
