import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { PixelEvent } from "@/components/MetaPixel";
import { ButtonLink, Panel } from "@/components/ui";
import { accesParEmail, getOrder, orderTotal } from "@/lib/db";
import { CONTACT_EMAIL, PRODUCTS, SITE_URL, euros, urlEspace } from "@/lib/config";
import { etapeParNumero } from "@/lib/methode";

export const metadata: Metadata = { title: "Bienvenue" };

/** Page de remerciement : elle vend aussi (Le Simulateur Automatique, produit backend n°1). */
export default async function ThankYouPage({
  searchParams,
}: {
  /**
   * ⚠️ `err` N'ÉTAIT PAS LU, ET /merci EST LE DERNIER MAILLON DE LA CHAÎNE.
   *
   * `acceptUpsell` redirige un upsell REFUSÉ vers `${next}&err=1`, et pour
   * l'upsell 2 ce `next` est /merci. Le refus de 97 € arrivait donc sur une
   * page qui affichait « Votre commande est confirmée » sans un mot : le
   * lecteur croyait avoir acheté, attendait le document, et écrivait pour
   * réclamer un produit qu'il n'avait jamais payé.
   */
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { o, err } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");
  const total = orderTotal(order);

  /**
   * L'accès a été créé par `livrer()` au moment du paiement, donc AVANT que
   * Resend soit sollicité : il existe ici même si aucun email n'est parti.
   * C'est toute la raison d'être de l'encadré ci-dessous.
   */
  const acces = await accesParEmail(order.email);

  return (
    <>
      <PixelEvent name="Purchase" params={{ value: total, currency: "EUR" }} />
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-8 sm:py-12">
          {/* Le refus de l'offre précédente, dit calmement et AVANT la
              confirmation : sans lui, le lecteur croit avoir acheté ce qu'il
              n'a pas payé. Aucun mot « erreur », aucun code. */}
          {err === "1" && (
            <p
              role="alert"
              className="mb-5 border-2 border-orange bg-yellow-bg px-4 py-3 text-[1.05rem]"
            >
              L&apos;offre précédente n&apos;a pas pu être ajoutée : votre banque n&apos;a pas
              accepté ce second paiement. <strong>Rien n&apos;a été débité pour celle-ci</strong>,
              et votre commande initiale reste bien enregistrée.
              {PRODUCTS.upsell2.disponible && acces ? (
                <>
                  {" "}
                  Vous la retrouverez dans votre espace, si vous la voulez encore&nbsp;:{" "}
                  <a href={`/espace/${acces.jeton}/ajouter/upsell2`}>{PRODUCTS.upsell2.name}</a>.
                </>
              ) : null}
            </p>
          )}

          <div className="mb-5 border border-green/40 bg-green-bg px-4 py-3 font-bold text-green">
            ✔ Votre commande est confirmée.
          </div>
          <h1 className="mb-5 text-[1.6rem] sm:text-[2rem]">
            Bienvenue dans Héritage Intact, {order.firstName}. Voici vos 3 prochaines étapes.
          </h1>

          <ol className="space-y-4 text-[1.05rem]">
            <Step n={1}>
              Votre lien personnel vient d&apos;être envoyé à <strong>{order.email}</strong>.
              Vérifiez les indésirables, et ajoutez {CONTACT_EMAIL} à vos contacts. Vous pouvez
              aussi ouvrir votre espace tout de suite, ci-dessous.
            </Step>
            {/* ⚠️ La durée se DÉRIVE du catalogue de contenu, elle ne s'écrit
                pas. Cette ligne annonçait 30 minutes pendant que l'email
                d'accès, le hub, la liste des étapes et la page de l'étape
                annonçaient 12 : trois écrans vus dans le même quart d'heure,
                deux chiffres pour la même chose. */}
            <Step n={2}>
              Ce soir : <strong>l&apos;étape 0, votre chiffre.</strong> Prévoyez{" "}
              {etapeParNumero(0)?.minutes ?? 12} minutes, vos relevés, et un café.
            </Step>
            <Step n={3}>
              Notez vos 3 dates sur le Calendrier. C&apos;est la seule chose à faire
              aujourd&apos;hui.
            </Step>
          </ol>

          {/*
            ⚠️ L'ENCADRÉ LE PLUS IMPORTANT DU SITE. NE JAMAIS LE RETIRER.

            /merci est le seul instant du parcours où l'on est CERTAIN que
            l'acheteur est devant son écran. Sans `RESEND_API_KEY`, `envoyer()`
            renvoie { ok: true } sans rien expédier et sans qu'aucun log ne
            s'en plaigne : ce jour-là, ce lien écrit en toutes lettres est le
            seul chemin qui reste entre un client débité et ce qu'il a acheté.

            Écrit en dur ici, volontairement : le hub a son propre encadré, et
            deux pages qui doivent survivre séparément ne partagent pas un
            composant qu'un seul lot maintient.
          */}
          {acces ? (
            <div className="mt-7 border-2 border-grey-line bg-grey-bg p-4 sm:p-5">
              <p className="mb-2 text-[1.1rem] font-bold text-blue">Votre lien personnel</p>
              <p className="mb-3 break-all text-[1.25rem] leading-snug font-bold sm:text-[1.45rem]">
                {urlEspace(acces.jeton)}
              </p>
              <p className="mb-4 text-[1.05rem]">
                Notez-le, ou mettez cette page dans vos favoris.{" "}
                <strong>Il n&apos;y a pas de mot de passe.</strong> Ce lien est votre clé, et il ne
                s&apos;arrêtera jamais de fonctionner.
              </p>
              <ButtonLink href={urlEspace(acces.jeton)} variant="blue">
                Ouvrir mon espace
              </ButtonLink>
            </div>
          ) : (
            /*
              Cas anormal (l'accès n'a pas pu être créé). On n'affiche ni erreur
              ni 404 : on montre le chemin de récupération, qui refabrique
              l'accès depuis la commande payée.
            */
            <div className="mt-7 border-2 border-grey-line bg-grey-bg p-4 sm:p-5">
              <p className="mb-2 text-[1.1rem] font-bold text-blue">Votre espace</p>
              <p className="mb-4 text-[1.05rem]">
                Rendez-vous sur <strong>{SITE_URL.replace(/^https?:\/\//, "")}/espace</strong> et
                indiquez l&apos;adresse <strong>{order.email}</strong> : votre lien personnel vous
                sera envoyé aussitôt. Il n&apos;y a pas de mot de passe.
              </p>
              <ButtonLink href="/espace" variant="blue">
                Ouvrir mon espace
              </ButtonLink>
            </div>
          )}

          <div className="mt-6">
            <Panel title="Récapitulatif de votre commande">
              <ul>
                {order.items.map((it) => (
                  <li
                    key={it.sku}
                    className="flex justify-between gap-3 border-b border-grey-line-soft py-2"
                  >
                    <span>{PRODUCTS[it.sku].name}</span>
                    <span className="whitespace-nowrap">{euros(it.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex justify-between border-t-2 border-blue pt-2 font-bold">
                <span>Total</span>
                <span>{euros(total)}</span>
              </p>
              <p className="mt-2 text-[0.9rem] text-text-soft">
                Un reçu vous est envoyé par email. Libellé sur votre relevé bancaire : HERITAGE
                INTACT.
              </p>
            </Panel>
          </div>

          {/*
            ⚠️ /merci EST LE QUATRIÈME ENDROIT QUE `disponible` DOIT PROTÉGER,
            APRÈS LA BOUTIQUE, LA SERVER ACTION D'ACHAT ET LES CGV.
            Ce bloc faisait la promotion du Simulateur Automatique — qui porte
            `disponible: false` — puis annonçait « et dans un email dans
            quelques jours ». Les deux moitiés étaient fausses : la boutique de
            l'espace filtre sur `disponible`, donc il n'y apparaîtra jamais, et
            `SEQUENCE_CLIENT` ne contient aucune offre. La phrase sur l'email a
            disparu pour de bon : elle engage une séquence qui n'est pas écrite.
          */}
          {PRODUCTS.backend1.disponible && (
            <>
              <hr className="my-10 border-grey-line" />

              <h2 className="mb-3 text-[1.4rem]">Et quand vous aurez votre chiffre...</h2>
              <p className="mb-3">
                ...la question suivante sera :{" "}
                <em>« et si je donne la maison ? et si j&apos;attends 71 ans ? »</em>{" "}
                {PRODUCTS.backend1.name} répond en direct, et imprime votre dossier prêt pour le
                notaire. Vos chiffres ne quittent pas votre ordinateur.
              </p>
              <p className="text-text-soft">
                Vous le retrouverez dans votre espace, sur la même page que le reste.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue text-[1.1rem] font-bold text-white">
        {n}
      </span>
      <span className="pt-1">{children}</span>
    </li>
  );
}
