"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { confirmCheckout, prepareCheckout } from "@/app/actions";
import { CONTACT_EMAIL, PRESENTATION, PRODUCTS, SITE_URL, euros } from "@/lib/config";
import { TrustRow } from "./Chrome";
import { Button, Panel } from "./ui";

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PK ? loadStripe(PK) : null;

export function CheckoutForm({
  defaults,
  testMode,
  prixFront,
}: {
  defaults: { firstName?: string; email?: string };
  testMode: boolean;
  /**
   * Le prix du guide pour CE visiteur, calculé par le serveur à partir
   * de ses cookies (`lib/prix.ts`). Il valait `PRODUCTS.front.price` en dur :
   * le bouton annonçait alors un autre montant que celui que Stripe allait débiter.
   * Un montant affiché qui n'est pas celui débité n'est pas un détail
   * d'affichage, c'est une information tarifaire fausse.
   */
  prixFront: number;
}) {
  const [bump, setBump] = useState(false);
  const total = prixFront + (bump ? PRODUCTS.bump.price : 0);

  // Sans clé publique, on garde le parcours simulé : aucun appel à Stripe.
  // Inner ne doit alors appeler AUCUN hook Stripe, d'où le passage par props.
  if (!stripePromise) {
    return (
      <Inner
        defaults={defaults}
        testMode={testMode}
        bump={bump}
        setBump={setBump}
        total={total}
        prixFront={prixFront}
        stripe={null}
        elements={null}
      />
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Math.round(total * 100),
        currency: "eur",
        setupFutureUsage: "off_session",
        locale: "fr",
        // Carte uniquement. Klarna et consorts ajoutent de la friction et de la
        // méfiance sur un avatar de 60-78 ans, et le paiement différé n'a aucun
        // sens sur ce produit. C'est aussi la seule démarche qui permet
        // de débiter les upsells en un clic.
        paymentMethodTypes: ["card"],
        appearance: {
          variables: {
            colorPrimary: "#12365E",
            colorText: "#222222",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSizeBase: "17px",
            borderRadius: "4px",
          },
        },
      }}
    >
      <WithStripe
        defaults={defaults}
        testMode={testMode}
        bump={bump}
        setBump={setBump}
        total={total}
        prixFront={prixFront}
      />
    </Elements>
  );
}

/**
 * useStripe et useElements lèvent une exception hors d'un <Elements>. Ce composant
 * est le seul endroit où on les appelle, et il n'est rendu que sous le fournisseur.
 * Sans lui, la page de commande renvoie une 500 dès que la clé publique manque au
 * moment du build — c'est exactement ce qui est arrivé au premier déploiement.
 */
function WithStripe(props: {
  defaults: { firstName?: string; email?: string };
  testMode: boolean;
  bump: boolean;
  setBump: (v: boolean) => void;
  total: number;
  prixFront: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  return <Inner {...props} stripe={stripe} elements={elements} />;
}

function Inner({
  defaults,
  testMode,
  bump,
  setBump,
  total,
  prixFront,
  stripe,
  elements,
}: {
  defaults: { firstName?: string; email?: string };
  testMode: boolean;
  bump: boolean;
  setBump: (v: boolean) => void;
  total: number;
  prixFront: number;
  stripe: ReturnType<typeof useStripe>;
  elements: ReturnType<typeof useElements>;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(defaults.firstName ?? "");
  const [email, setEmail] = useState(defaults.email ?? "");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const identiteConnue =
    firstName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Le montant du PaymentIntent suit la case du bump, en direct.
  useEffect(() => {
    if (elements) elements.update({ amount: Math.round(total * 100) });
  }, [elements, total]);

  const label = pending ? "Validation en cours..." : "Valider ma commande";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      // Mode simulé : pas de Stripe, on crée simplement la commande.
      if (!stripe || !elements) {
        const prep = await prepareCheckout({ firstName, email, withBump: bump, consent, montantAffiche: prixFront });
        if (!prep.ok) {
          setError(prep.error);
          if (prep.actualiser) router.refresh();
          return;
        }
        router.push(`/bienvenue?o=${prep.orderId}`);
        return;
      }

      // 1. Stripe valide la saisie de la carte avant tout appel serveur.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Vérifiez les informations de votre carte.");
        return;
      }

      // 2. Le serveur crée la commande, le client Stripe et le PaymentIntent.
      const prep = await prepareCheckout({ firstName, email, withBump: bump, consent, montantAffiche: prixFront });
      if (!prep.ok) {
        setError(prep.error);
        if (prep.actualiser) router.refresh();
        return;
      }

      // 3. Confirmation. `if_required` évite une redirection quand la banque
      // ne demande pas d'authentification forte.
      const { error: payError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: prep.clientSecret,
        confirmParams: {
          return_url: `${SITE_URL}/commande/confirmation?o=${prep.orderId}`,
          receipt_email: email,
        },
        redirect: "if_required",
      });

      if (payError) {
        setError(payError.message ?? "Le paiement a été refusé. Aucun montant n'a été débité.");
        return;
      }

      // 4. Le serveur revérifie le statut auprès de Stripe avant de valider.
      if (paymentIntent?.id) {
        const done = await confirmCheckout(prep.orderId, paymentIntent.id);
        if (!done.ok) {
          setError(done.error ?? "Le paiement n'a pas pu être vérifié.");
          return;
        }
      }
      router.push(`/bienvenue?o=${prep.orderId}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
      {/* Colonne gauche */}
      <div className="space-y-5">
        {!identiteConnue && (
          <Panel title="1. Vos coordonnées">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block font-bold">Prénom</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-bold">Adresse email</span>
                <span className="mb-1 block text-[0.85rem] text-text-soft">
                  Vos accès y seront envoyés.
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className="field"
                />
              </label>
            </div>
          </Panel>
        )}

        <Panel title={identiteConnue ? "Paiement sécurisé" : "2. Paiement sécurisé"}>
          {stripe ? (
            <PaymentElement
              options={{
                layout: "tabs",
                /**
                 * ═══ LINK EST COUPÉ, PAS REPLIÉ ═══
                 *
                 * Stripe insérait ici « Enregistrer mes informations pour un
                 * paiement plus rapide » : un second formulaire, réclamant un
                 * NUMÉRO DE TÉLÉPHONE PORTABLE, au nom d’une marque tierce que
                 * l’acheteur n’a jamais vue, avec ses propres conditions
                 * d’utilisation et sa propre politique de confidentialité — le
                 * tout à la seconde où il saisit sa carte.
                 *
                 * Sur un acheteur de 74 ans, ce bloc pose la question qui tue :
                 * « pourquoi ce site veut-il mon numéro de portable, et qui est
                 * ce Link à qui je crée un compte ? »
                 *
                 * Et il ne nous apporte RIEN. Link sert à accélérer un futur
                 * paiement ; les nôtres sont déjà en un clic, parce que
                 * `setup_future_usage: "off_session"` conserve la carte côté
                 * Stripe et que `chargeUpsell` débite sans ressaisie. Un
                 * dispositif qui coûte de la confiance sans rien rendre se
                 * retire ; le replier laisserait une décision de plus à prendre
                 * sur l’écran où chaque décision se paie le plus cher.
                 */
                wallets: { link: "never" },
              }}
            />
          ) : (
            <div className="border border-dashed border-grey-line bg-grey-bg p-3 text-[0.95rem] text-text-soft">
              <p className="font-bold text-text">Emplacement du formulaire de carte bancaire.</p>
              <p>
                En mode test, cliquez simplement sur le bouton : aucun débit n&apos;est effectué.
              </p>
            </div>
          )}
          <div className="mt-3">
            <TrustRow />
          </div>
          <p className="mt-2 text-[0.85rem] text-text-soft">
            Le paiement est traité par Stripe. Nous ne voyons jamais votre numéro de carte.
          </p>
        </Panel>

        {/* Option payante uniquement sur choix explicite. */}
        <label className="block cursor-pointer border-2 border-orange bg-yellow-bg p-3 sm:p-4">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={bump}
              onChange={(e) => setBump(e.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 accent-orange"
            />
            <span>
              {/* Le nom se lit dans PRODUCTS, jamais en dur : « Dossier Notaire
                  Prêt-à-Signer » traînait encore ici alors que le produit a été
                  renommé, et deux noms pour une seule chose sur le bon de
                  commande, c'est un acheteur qui doute au moment de payer. */}
              <span className="block text-[1.05rem] font-bold text-blue">
                Ajouter {PRODUCTS.bump.name}
              </span>
              <span className="mt-1 block text-[0.95rem]">
                Une donation oubliée, une date imprécise ou une pièce manquante peut laisser votre
                rendez-vous sans réponse et vous obliger à recommencer. Le Dossier Notaire réunit
                l’inventaire, les documents et les questions à apporter.
              </span>
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-[0.9rem] text-text-soft">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-blue-mid"
          />
          <span>
            Je demande l&apos;accès immédiat au contenu numérique et reconnais renoncer à mon droit
            de rétractation de 14 jours. La garantie contractuelle de 30 jours « satisfait ou
            remboursé » s&apos;applique intégralement.
          </span>
        </label>

        {error && (
          <p role="alert" className="border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
            {error}
          </p>
        )}

        <Button variant="green" disabled={pending}>
          {label}
        </Button>
        <p className="text-center text-[0.9rem] text-text-soft">
          Accès immédiat après validation. Une question ?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>

      {/* Colonne droite : récapitulatif */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Panel title="Votre commande">
          {/* ⚠️ LE PRIX EFFECTIF, JAMAIS `PRODUCTS.front.price`. La ligne
              affichait « 429 € barré → 27 € » pendant que le total juste en
              dessous annonçait 89 € : deux nombres contradictoires dans le même
              encadré, et aucune ligne pour expliquer les 62 € d'écart. Le bump,
              lui, ne varie pas. */}
          <Line label={PRODUCTS.front.short} anchor={PRODUCTS.front.anchor} price={prixFront} />
          {bump && (
            <Line
              label={PRODUCTS.bump.short}
              anchor={PRODUCTS.bump.anchor}
              price={PRODUCTS.bump.price}
            />
          )}
          <div className="mt-2 flex items-baseline justify-between border-t-2 border-blue pt-2">
            <span className="font-bold">Total à payer</span>
            <span className="text-[1.5rem] font-bold text-blue">{euros(total)}</span>
          </div>
          <ul className="mt-4 space-y-1 text-[0.95rem]">
            {[
              "Les 7 erreurs à connaître avant qu’il ne soit trop tard",
              "Les repères essentiels sur la maison, les donations et l’assurance-vie",
              "Une explication claire et accessible de chaque erreur",
              "Paiement unique, aucun abonnement",
              "Garantie 30 jours",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-green">✔</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          {bump && (
            <div className="mt-5 border-t border-grey-line pt-4">
              <p className="mb-2 font-bold text-blue">Votre dossier notaire contient également :</p>
              <ul className="space-y-1 text-[0.95rem]">
                {(PRESENTATION.bump?.contenu ?? []).map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-green">✔</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
        {testMode && (
          <p className="mt-3 text-[0.85rem] text-text-soft">
            Mode test : aucun débit n&apos;est effectué.
          </p>
        )}
      </div>
    </form>
  );
}

/**
 * Une ligne du récapitulatif. Elle reçoit un PRIX, jamais un `Product` : le
 * prix du produit d'appel dépend du visiteur (compteur, rattrapage), et une
 * ligne qui irait le relire dans le catalogue recommencerait à mentir.
 */
function Line({ label, anchor, price }: { label: string; anchor: number; price: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-grey-line-soft py-2">
      <span>{label}</span>
      <span className="whitespace-nowrap">
        {anchor > price && (
          <span className="mr-2 text-[0.85rem] text-text-soft line-through">{euros(anchor)}</span>
        )}
        <strong>{euros(price)}</strong>
      </span>
    </div>
  );
}
