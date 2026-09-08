"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { confirmCheckout, prepareCheckout } from "@/app/actions";
import { enregistrerReponses } from "@/app/profil";
import { CONTACT_EMAIL, PRODUCTS, SITE_URL, euros } from "@/lib/config";
import { QUALIFICATION_ACTIVE, type Reponses } from "@/lib/qualification";
import { TrustRow } from "./Chrome";
import { QualificationBloc } from "./QualificationBloc";
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
   * Le prix de la Méthode pour CE visiteur, calculé par le serveur à partir
   * de ses cookies (`lib/prix.ts`). Il valait `PRODUCTS.front.price` en dur :
   * le bouton annonçait alors 27 € à quelqu'un que Stripe allait débiter de
   * 89 €. Un montant affiché qui n'est pas celui débité n'est pas un détail
   * d'affichage, c'est une information tarifaire fausse.
   */
  prixFront: number;
}) {
  const [bump, setBump] = useState(true);
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
        // sens sur un produit à 27 €. C'est aussi la seule méthode qui permet
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

  /**
   * Les quatre réponses facultatives. Elles ne participent NI au montant, NI à
   * la validation du formulaire : `total` ne les regarde pas et rien ici ne
   * conditionne l'activation du bouton. Elles ne servent qu'à choisir l'écran
   * de vente montré après le paiement.
   */
  const [reponses, setReponses] = useState<Reponses>({});

  // Le montant du PaymentIntent suit la case du bump, en direct.
  useEffect(() => {
    if (elements) elements.update({ amount: Math.round(total * 100) });
  }, [elements, total]);

  const label = useMemo(
    () => (pending ? "Validation en cours..." : `Valider ma commande : ${euros(total)}`),
    [pending, total],
  );

  /**
   * ÉCRIT LES QUATRE RÉPONSES DANS `profils`. Un seul appelant possible : le
   * point du parcours situé juste APRÈS `prepareCheckout` et AVANT
   * `stripe.confirmPayment`.
   *
   * ⚠️ CET INSTANT-LÀ, ET AUCUN AUTRE. C'est le premier où l'identifiant de
   * commande existe, et le dernier où l'état React est encore vivant :
   *   · écrire APRÈS `confirmPayment` perdrait les réponses de tous les
   *     paiements authentifiés par 3-D Secure — la banque redirige le
   *     navigateur, et au retour ce composant a été remonté à vide ;
   *   · écrire au moment de la redirection les perdrait aussi : la fonction est
   *     coupée dès qu'elle répond une redirection ;
   *   · passer par la chaîne de requête est exclu — une URL finit dans les
   *     journaux, dans l'en-tête `Referer` et dans l'historique d'un ordinateur
   *     familial, celui-là même où les enfants dont il est question dans les
   *     questions viennent lire leurs mails. C'est aussi pourquoi les trois
   *     lignes qui écrivent `/plan-complet?o=` en dur restent intactes : le
   *     routage se fait à l'arrivée, à partir de la base.
   *
   * Elle n'échoue jamais visiblement. Une information de confort ne fait pas
   * perdre un paiement : sans ligne écrite, l'acheteur suit le tunnel par
   * défaut, c'est-à-dire exactement celui d'aujourd'hui.
   */
  async function memoriserReponses(orderId: string) {
    // Deux gardes qui évitent un aller-retour serveur inutile sur le chemin
    // critique du paiement : drapeau fermé (le bloc n'est pas affiché, il n'y a
    // rien à écrire) ou aucune case cochée (la server action n'écrirait aucune
    // ligne de toute façon).
    if (!QUALIFICATION_ACTIVE) return;
    if (!reponses.vie && !reponses.enfants && !reponses.av && !reponses.age) return;
    try {
      await enregistrerReponses(orderId, email, reponses);
    } catch {
      // Silence volontaire. Voir ci-dessus : le paiement prime.
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      // Mode simulé : pas de Stripe, on crée simplement la commande.
      if (!stripe || !elements) {
        const prep = await prepareCheckout({ firstName, email, withBump: bump, consent });
        if (!prep.ok) {
          setError(prep.error);
          return;
        }
        await memoriserReponses(prep.orderId);
        router.push(`/plan-complet?o=${prep.orderId}`);
        return;
      }

      // 1. Stripe valide la saisie de la carte avant tout appel serveur.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message ?? "Vérifiez les informations de votre carte.");
        return;
      }

      // 2. Le serveur crée la commande, le client Stripe et le PaymentIntent.
      const prep = await prepareCheckout({ firstName, email, withBump: bump, consent });
      if (!prep.ok) {
        setError(prep.error);
        return;
      }

      // 2 bis. Les réponses, tant que l'état React existe encore : la
      // confirmation qui suit peut partir chez la banque et ne jamais revenir
      // dans ce composant.
      await memoriserReponses(prep.orderId);

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
      router.push(`/plan-complet?o=${prep.orderId}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
      {/* Colonne gauche */}
      <div className="space-y-5">
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

        {/*
          LES QUATRE QUESTIONS, ENTRE LES COORDONNÉES ET LA CARTE.
          Ici et pas ailleurs : après le paiement, l'acheteur a déjà la tête au
          « c'est fait », et un écran de questions posé à cet instant se lit
          comme un péage supplémentaire. Avant les coordonnées, il se lirait
          comme un formulaire d'accès. Entre les deux, il est ce qu'il est :
          quatre cases facultatives au milieu d'un bon de commande.

          ⚠️ Le bloc n'est PAS numéroté « 1 bis » ni « 2 » : les deux étapes
          numérotées du bon de commande sont celles qui conditionnent le
          paiement. Numéroter ce bloc en ferait une étape obligatoire à l'œil,
          ce que le chapeau passe trois lignes à démentir.

          À `QUALIFICATION_ACTIVE = false`, la page est strictement identique à
          celle d'aujourd'hui : rien n'est rendu, aucune réponse n'existe, donc
          aucun routage ne change. C'est ce qui rend le retour en arrière
          gratuit — il n'y a rien à défaire.
        */}
        {QUALIFICATION_ACTIVE && <QualificationBloc valeurs={reponses} onChange={setReponses} />}

        <Panel title="2. Paiement sécurisé">
          {stripe ? (
            <PaymentElement options={{ layout: "tabs" }} />
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

        {/* Le bump : case pré-cochée, mise en évidence pour rester décochable sans effort */}
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
                OUI, ajoutez {PRODUCTS.bump.name} pour {euros(PRODUCTS.bump.price)} seulement{" "}
                <span className="font-normal text-text-soft line-through">
                  (au lieu de {euros(PRODUCTS.bump.anchor)})
                </span>
              </span>
              <span className="mt-1 block text-[0.95rem]">
                L&apos;inventaire patrimonial, la fiche famille, la liste des 12 pièces à apporter
                et le mail qui fait que le notaire prépare votre rendez-vous. Une heure de travail,
                déjà faite. Une vidéo de 6 minutes vous montre comment tout remplir.
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
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> (réponse sous 24 h).
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
              // « Module » est interdit sur les PAGES DE VENTE : ici on vend une
              // méthode, et une méthode se suit par étapes. Le mot est en revanche
              // parfaitement admis à l'intérieur du produit, où le client sait déjà
              // ce qu'il a acheté. Le mot
              // change ce que l'acheteur croit avoir acheté.
              "8 étapes vidéo, accès immédiat et à vie",
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
