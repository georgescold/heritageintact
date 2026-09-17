"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { confirmCheckout, prepareCheckout } from "@/app/actions";
import { CONTACT_EMAIL, PRESENTATION, PRODUCTS, SITE_URL, euros } from "@/lib/config";
import { TrustRow } from "./Chrome";
import { Button, Panel } from "./ui";
import { achatPixel } from "@/lib/meta-pixel";
import { suivre } from "@/lib/parcours-client";

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
  /**
   * ⚠️ LE CHAMP QUI BLOQUE, ET OÙ IL EST.
   *
   * Trois acheteurs de suite ont cliqué sur « Valider ma commande » sans avoir
   * saisi leur carte, ont vu « Votre numéro de carte est incomplet » en bas du
   * formulaire — à près de 2 000 px du champ concerné — et sont partis dans la
   * seconde (15, 16 et 17/09/2026). Le message ne suffit pas : on remonte
   * l'écran sur le champ fautif et on l'entoure de rouge.
   */
  const refIdentite = useRef<HTMLDivElement>(null);
  const refCarte = useRef<HTMLDivElement>(null);
  const refConsentement = useRef<HTMLLabelElement>(null);
  const [champFautif, setChampFautif] = useState<"identite" | "carte" | "consentement" | null>(null);
  /**
   * ⚠️ APPLE PAY / GOOGLE PAY — LE RACCOURCI QUI SUPPRIME LA SAISIE.
   *
   * Trois visiteurs de suite ont cliqué sur « Valider » sans avoir tapé leur
   * carte, puis sont partis (15, 16 et 17/09/2026). Notre acheteur a entre 60 et
   * 80 ans et vient à 90 % d'un téléphone : taper 16 chiffres, une date et un
   * cryptogramme y est la marche la plus haute du parcours. Avec le portefeuille
   * du téléphone, il n'y a plus rien à taper — empreinte ou visage, c'est payé.
   *
   * Le bloc ne s'affiche QUE si l'appareil en propose un (`onReady` le dit) :
   * sinon un intitulé « ou payez par carte » flotterait au-dessus de rien.
   */
  const [portefeuilles, setPortefeuilles] = useState(false);
  const identiteConnue =
    firstName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Le montant du PaymentIntent suit la case du bump, en direct.
  useEffect(() => {
    if (elements) elements.update({ amount: Math.round(total * 100) });
  }, [elements, total]);

  const label = pending ? "Validation en cours..." : "Valider ma commande";

  // Chaque message d'erreur affiché est aussi enregistré, avec l'étape où il
  // tombe : c'est la seule façon de savoir où un acheteur décroche (lib/parcours.ts).
  const echec = (phase: string, message: string) => {
    setError(message);
    suivre("paiement_erreur", { phase, message, montant: total, bump });
    const cible =
      phase === "carte" || phase === "banque"
        ? "carte"
        : /rétractation/i.test(message)
          ? "consentement"
          : /prénom|adresse email/i.test(message)
            ? "identite"
            : null;
    setChampFautif(cible);
    const noeud =
      cible === "carte"
        ? refCarte.current
        : cible === "identite"
          ? refIdentite.current
          : cible === "consentement"
            ? refConsentement.current
            : null;
    // ⚠️ Saut immédiat, pas de défilement animé : l'animation dépend des images
    // par seconde, que le téléphone suspend dès que l'onglet passe en arrière-plan
    // ou qu'il économise la batterie — l'acheteur restait alors devant un écran
    // inchangé, avec son message d'erreur à 1 500 px plus bas (vérifié le 17/09).
    if (noeud) {
      // « start » et non « center » : le bloc de paiement fait 900 px de haut, et
      // le centrer laissait le champ carte au-dessus de l'écran, message compris.
      // Les 72 px rendus laissent voir le titre du bloc juste au-dessus.
      noeud.scrollIntoView({ behavior: "auto", block: "start" });
      window.scrollBy(0, -72);
    }
  };

  async function payerAvecPortefeuille(evenement: {
    billingDetails?: { name?: string | null; email?: string | null } | null;
  }) {
    setError(null);
    setChampFautif(null);
    setPending(true);
    suivre("paiement_clic", { montant: total, bump, portefeuille: true });
    try {
      if (!stripe || !elements) return;
      const { error: submitError } = await elements.submit();
      if (submitError) {
        echec("carte", submitError.message ?? "Le paiement n’a pas pu être préparé.");
        return;
      }
      // Le portefeuille fournit le nom et l'adresse email : l'acheteur n'a donc
      // rien saisi, et c'est tout l'intérêt. On retombe sur les champs du
      // formulaire s'il les avait déjà remplis.
      const nom = (evenement.billingDetails?.name || firstName || "Client").trim();
      const adresse = (evenement.billingDetails?.email || email).trim();
      const prep = await prepareCheckout({
        firstName: nom,
        email: adresse,
        withBump: bump,
        // Le renoncement au délai de rétractation est affiché juste au-dessus du
        // bouton du portefeuille : payer vaut acceptation, comme sur la case.
        consent: true,
        montantAffiche: prixFront,
      });
      if (!prep.ok) {
        echec("commande", prep.error);
        if (prep.actualiser) router.refresh();
        return;
      }
      const { error: payError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: prep.clientSecret,
        confirmParams: {
          return_url: `${SITE_URL}/commande/confirmation?o=${prep.orderId}`,
          receipt_email: adresse,
        },
        redirect: "if_required",
      });
      if (payError) {
        echec("banque", payError.message ?? "Le paiement a été refusé. Aucun montant n'a été débité.");
        return;
      }
      if (paymentIntent?.id) {
        const done = await confirmCheckout(prep.orderId, paymentIntent.id);
        if (!done.ok) {
          echec("verification", done.error ?? "Le paiement n'a pas pu être vérifié.");
          return;
        }
        achatPixel(done.mesure);
      }
      suivre("paiement_reussi", { montant: total, portefeuille: true });
      router.push(`/bienvenue?o=${prep.orderId}`);
    } catch {
      echec(
        "technique",
        "La validation n’a pas pu aboutir. Vérifiez votre connexion puis réessayez. Si vous recevez un email de confirmation, votre commande est bien enregistrée.",
      );
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setChampFautif(null);
    setPending(true);
    suivre("paiement_clic", { montant: total, bump });

    try {
      // Mode simulé : pas de Stripe, on crée simplement la commande.
      if (!stripe || !elements) {
        const prep = await prepareCheckout({ firstName, email, withBump: bump, consent, montantAffiche: prixFront });
        if (!prep.ok) {
          echec("commande", prep.error);
          if (prep.actualiser) router.refresh();
          return;
        }
        suivre("paiement_reussi", { montant: total, simule: true });
        router.push(`/bienvenue?o=${prep.orderId}`);
        return;
      }

      // 1. Stripe valide la saisie de la carte avant tout appel serveur.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        echec("carte", submitError.message ?? "Vérifiez les informations de votre carte.");
        return;
      }

      // 2. Le serveur crée la commande, le client Stripe et le PaymentIntent.
      const prep = await prepareCheckout({ firstName, email, withBump: bump, consent, montantAffiche: prixFront });
      if (!prep.ok) {
        echec("commande", prep.error);
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
        echec("banque", payError.message ?? "Le paiement a été refusé. Aucun montant n'a été débité.");
        return;
      }

      // 4. Le serveur revérifie le statut auprès de Stripe avant de valider.
      if (paymentIntent?.id) {
        const done = await confirmCheckout(prep.orderId, paymentIntent.id);
        if (!done.ok) {
          echec("verification", done.error ?? "Le paiement n'a pas pu être vérifié.");
          return;
        }
        // L'achat est signalé ICI, sur une adresse publique : les pages qui suivent
        // portent l'identifiant de commande et n'ont pas de pixel (lib/meta-pixel.ts).
        achatPixel(done.mesure);
      }
      suivre("paiement_reussi", { montant: total });
      router.push(`/bienvenue?o=${prep.orderId}`);
    } catch {
      // Une coupure réseau au milieu de la validation laissait le bouton se
      // réactiver sans aucun message : l'acheteur ne savait pas quoi faire.
      echec(
        "technique",
        "La validation n’a pas pu aboutir. Vérifiez votre connexion puis réessayez. Si vous recevez un email de confirmation, votre commande est bien enregistrée.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
      {/* Colonne gauche */}
      <div className="space-y-5">
        {stripe && elements && (
          <div className={portefeuilles ? "space-y-2" : "sr-only"}>
            {portefeuilles && (
              <p className="text-center text-[0.95rem] font-bold text-blue">
                Payez en une seule fois, sans rien saisir :
              </p>
            )}
            <ExpressCheckoutElement
              options={{
                buttonHeight: 52,
                paymentMethods: {
                  applePay: "auto",
                  googlePay: "auto",
                  link: "never",
                  paypal: "never",
                  amazonPay: "never",
                  klarna: "never",
                },
              }}
              onReady={(evenement) => setPortefeuilles((evenement.availablePaymentMethods ?? undefined) !== undefined)}
              onClick={({ resolve }) => resolve({ emailRequired: true })}
              onConfirm={payerAvecPortefeuille}
            />
            {portefeuilles && (
              <>
                <p className="text-center text-[0.8rem] leading-snug text-text-soft">
                  En payant, vous demandez l’accès immédiat et renoncez au droit de rétractation de
                  14 jours. La garantie « satisfait ou remboursé » de 30 jours s’applique.
                </p>
                <p className="border-t border-grey-line pt-3 text-center font-bold">
                  ou payez par carte ci-dessous
                </p>
              </>
            )}
          </div>
        )}

        {!identiteConnue && (
          <div
            ref={refIdentite}
            className={champFautif === "identite" ? "outline outline-[3px] outline-offset-2 outline-red" : undefined}
          >
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
          </div>
        )}

        <div
          ref={refCarte}
          className={champFautif === "carte" ? "outline outline-[3px] outline-offset-2 outline-red" : undefined}
        >
        <Panel title={identiteConnue ? "Paiement sécurisé" : "2. Paiement sécurisé"}>
          {/* Le message se lit AVANT le champ : placé après, il tombait 887 px
              plus bas que le cadre de saisie sur un téléphone de 320 px, donc hors
              de l'écran au moment même où l'acheteur y était renvoyé (17/09/2026). */}
          {champFautif === "carte" && error && (
            <p role="alert" className="mb-3 border border-red bg-red-bg px-3 py-2 text-[0.95rem] font-bold text-red">
              {error}
            </p>
          )}
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
        </div>

        {/* ⚠️ FORMULAIRE RACCOURCI (17/09/2026) : il fallait descendre jusqu'à
            2 377 px pour atteindre le bouton, en traversant trois pavés de texte.
            L'option et la case tiennent désormais chacune sur une ligne. Le nom du
            produit se lit dans PRODUCTS, jamais en dur. */}
        <label className="block cursor-pointer border-2 border-orange bg-yellow-bg p-3">
          <span className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={bump}
              onChange={(e) => setBump(e.target.checked)}
              className="mt-0.5 h-6 w-6 shrink-0 accent-orange"
            />
            <span>
              <span className="block font-bold text-blue">
                Ajouter {PRODUCTS.bump.name} · {euros(PRODUCTS.bump.price)}
              </span>
              <span className="block text-[0.95rem]">
                Les documents et les questions à préparer avant votre rendez-vous.
              </span>
            </span>
          </span>
        </label>
        <label
          ref={refConsentement}
          className={
            "flex items-start gap-3 text-[0.9rem] text-text-soft" +
            (champFautif === "consentement" ? " outline outline-[3px] outline-offset-2 outline-red" : "")
          }
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-blue-mid"
          />
          <span>
            J&apos;accède au contenu immédiatement et renonce au droit de rétractation de 14 jours.
            La garantie « satisfait ou remboursé » de 30 jours s&apos;applique.
          </span>
        </label>

        {error && champFautif !== "carte" && (
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
