"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { confirmCheckout } from "@/app/actions";
import { confirmerAchatEspace, preparerPaiementEspace } from "@/app/espace/achat";
import { CONTACT_EMAIL, PRODUCTS, SITE_URL, euros, type ProductSku } from "@/lib/config";
import { TrustRow } from "@/components/Chrome";
import { Button, Panel } from "@/components/ui";

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PK ? loadStripe(PK) : null;

type Props = { orderId: string; jeton: string; sku: ProductSku; montant: number };

/**
 * LE FORMULAIRE DE CARTE DU REPLI DSP2.
 *
 * Il est dérivé de `CheckoutForm`, et volontairement dépouillé de tout ce qui
 * n'est pas la carte : ni bump, ni récapitulatif, ni coordonnées. Le membre a
 * déjà tout donné il y a trois semaines ; ce qu'on lui demande ici, c'est un
 * seul geste, et il doit avoir l'air d'un seul geste.
 *
 * ⚠️ LA STRUCTURE EN DEUX COMPOSANTS N'EST PAS DÉCORATIVE. `useStripe` et
 * `useElements` lèvent hors d'un `<Elements>`. Sans le repli ci-dessous, une
 * clé publique absente au moment du build renvoie une 500 — c'est exactement
 * ce qui est arrivé au premier déploiement du site.
 */
export function PaiementEspace(props: Props) {
  if (!stripePromise) return <SansStripe {...props} />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Math.round(props.montant * 100),
        currency: "eur",
        // La carte confirmée ici remplace celle qui vient d'échouer, pour tous
        // les achats suivants : sinon le membre repasse par ce formulaire à
        // chaque fois.
        setupFutureUsage: "off_session",
        locale: "fr",
        // Carte uniquement, identique au serveur. Un écart entre les deux fait
        // refuser la confirmation par Stripe sans message exploitable.
        paymentMethodTypes: ["card"],
        appearance: {
          variables: {
            colorPrimary: "#12365E",
            colorText: "#222222",
            fontFamily: "Arial, Helvetica, sans-serif",
            // 18 px et non 17 : sur cette page, le lecteur saisit 16 chiffres
            // sans ses lunettes, et il n'a pas le droit de se tromper.
            fontSizeBase: "18px",
            borderRadius: "4px",
          },
        },
      }}
    >
      <AvecStripe {...props} />
    </Elements>
  );
}

/** Le seul endroit où les hooks Stripe sont appelés, et il est sous `<Elements>`. */
function AvecStripe(props: Props) {
  const stripe = useStripe();
  const elements = useElements();
  return <Formulaire {...props} stripe={stripe} elements={elements} />;
}

function Formulaire({
  orderId,
  jeton,
  sku,
  montant,
  stripe,
  elements,
}: Props & {
  stripe: ReturnType<typeof useStripe>;
  elements: ReturnType<typeof useElements>;
}) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  const retour = `/espace/${jeton}?ajoute=${sku}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    setEnCours(true);

    try {
      if (!stripe || !elements) {
        setErreur("Le formulaire de carte n'a pas fini de se charger. Attendez un instant.");
        return;
      }

      // 1. Stripe valide la saisie AVANT tout appel serveur : inutile de créer
      // un PaymentIntent pour une carte à laquelle il manque un chiffre.
      const { error: erreurSaisie } = await elements.submit();
      if (erreurSaisie) {
        setErreur(erreurSaisie.message ?? "Vérifiez les informations de votre carte.");
        return;
      }

      // 2. Le serveur prépare un paiement ON-session sur la commande existante.
      // Il revérifie le jeton, la propriété de la commande et le produit :
      // cette action est une URL, elle s'appelle sans passer par cet écran.
      const prep = await preparerPaiementEspace(jeton, orderId, sku);
      if (!prep.ok) {
        setErreur(prep.error);
        return;
      }

      /**
       * 3. Confirmation.
       *
       * ⚠️ `return_url` POINTE SUR UNE PAGE QUI RECONFIRME, ET C'EST TOUT LE
       * SUJET. `if_required` n'évite la redirection que si la banque n'en
       * demande pas ; quand elle en impose une — cas nominal chez plusieurs
       * banques françaises — le navigateur QUITTE cette page et rien de ce qui
       * suit ne s'exécute. L'ancienne URL renvoyait droit au hub avec son
       * bandeau vert : le membre était débité, la commande restait « pending »,
       * et il ne trouvait rien dans ses documents. La page /carte lit désormais
       * `payment_intent` au retour et appelle `confirmCheckout` elle-même.
       */
      const retourBanque = `${SITE_URL}/espace/${jeton}/ajouter/${sku}/carte?o=${orderId}`;

      const { error: erreurPaiement, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: prep.clientSecret,
        confirmParams: { return_url: retourBanque },
        redirect: "if_required",
      });

      if (erreurPaiement) {
        setErreur(
          erreurPaiement.message ??
            "Votre banque n'a pas accepté ce paiement. Rien n'a été débité, et votre commande précédente reste bien enregistrée.",
        );
        return;
      }

      // 4. Le serveur revérifie le statut auprès de Stripe : on ne fait jamais
      // confiance au navigateur sur un statut de paiement. `confirmCheckout`
      // exige aussi que le PaymentIntent porte le bon identifiant de commande.
      if (paymentIntent?.id) {
        const fait = await confirmCheckout(orderId, paymentIntent.id);
        if (!fait.ok) {
          setErreur(fait.error ?? "Le paiement n'a pas pu être vérifié.");
          return;
        }

        // ⚠️ LE REÇU, ET IL EST LE FILET ANTI-FRAUDE DU LIEN PORTANT.
        // `confirmCheckout` n'envoie que l'email d'ACCÈS, dont la clé est déjà
        // posée depuis le premier achat : sans cet appel, RIEN ne partait sur
        // le chemin où une carte vient pourtant d'être resaisie. L'envoi est
        // fait côté serveur, après revérification du jeton.
        await confirmerAchatEspace(jeton, sku, orderId);
      }

      router.push(retour);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Panel title="Votre carte bancaire">
        {stripe ? (
          <PaymentElement options={{ layout: "tabs" }} />
        ) : (
          <p className="text-[1.05rem] text-text-soft">Chargement du formulaire de carte…</p>
        )}
        <div className="mt-4">
          <TrustRow />
        </div>
      </Panel>

      {erreur && (
        <p role="alert" className="border-2 border-red bg-red-bg px-4 py-3 text-[1.05rem]">
          {erreur}
        </p>
      )}

      <Button variant="green" disabled={enCours}>
        {enCours ? "Validation en cours…" : `Confirmer et payer ${euros(montant)}`}
      </Button>

      <p className="text-center text-[0.95rem] text-text-soft">
        {PRODUCTS[sku].name} — {euros(montant)}, une seule fois. Garantie 30 jours.
      </p>
    </form>
  );
}

/**
 * SANS CLÉ PUBLIQUE STRIPE : aucun hook, aucun `<Elements>`, aucune 500.
 *
 * Le membre voit une phrase et une adresse, pas un écran cassé. C'est un cas
 * de configuration, jamais un cas nominal — mais il ne doit pas se solder par
 * une page blanche chez quelqu'un qui essaie de nous donner de l'argent.
 */
function SansStripe({ jeton, sku, montant }: Props) {
  return (
    <Panel title="Paiement momentanément indisponible">
      <p className="text-[1.1rem]">
        Le paiement par carte n&apos;est pas disponible sur cette page pour le moment. Rien n&apos;a
        été débité et votre commande précédente reste bien enregistrée.
      </p>
      <p className="mt-3 text-[1.05rem]">
        Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> en indiquant{" "}
        <strong>{PRODUCTS[sku].name}</strong> ({euros(montant)})&nbsp;: nous nous en occupons
        nous-mêmes.
      </p>
      <p className="mt-3 text-[1.05rem]">
        <a href={`/espace/${jeton}`}>← Revenir à mon espace</a>
      </p>
    </Panel>
  );
}
