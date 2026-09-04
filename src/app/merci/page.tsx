import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { PixelEvent } from "@/components/MetaPixel";
import { ButtonLink, Panel } from "@/components/ui";
import { getOrder, orderTotal } from "@/lib/db";
import { CONTACT_EMAIL, PRODUCTS, euros } from "@/lib/config";

export const metadata: Metadata = { title: "Bienvenue" };

/** Page de remerciement : elle vend aussi (le Générateur, produit backend n°1). */
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ o?: string }>;
}) {
  const { o } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");
  const total = orderTotal(order);

  return (
    <>
      <PixelEvent name="Purchase" params={{ value: total, currency: "EUR" }} />
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-8 sm:py-12">
          <div className="mb-5 rounded border border-green/40 bg-green-bg px-4 py-3 font-bold text-green">
            ✔ Votre commande est confirmée.
          </div>
          <h1 className="mb-5 text-[1.6rem] sm:text-[2rem]">
            Bienvenue dans Héritage Intact, {order.firstName}. Voici vos 3 prochaines étapes.
          </h1>

          <ol className="space-y-4 text-[1.05rem]">
            <Step n={1}>
              Vos identifiants arrivent par email dans 2 minutes à <strong>{order.email}</strong>. Vérifiez
              les indésirables et ajoutez {CONTACT_EMAIL} à vos contacts.
            </Step>
            <Step n={2}>
              Ce soir : <strong>Module 0, votre chiffre.</strong> Prévoyez 30 minutes, vos relevés, et un
              café.
            </Step>
            <Step n={3}>
              Notez vos 3 dates sur le Calendrier. C&apos;est la seule chose à faire aujourd&apos;hui.
            </Step>
          </ol>

          <div className="mt-6">
            <ButtonLink href="/espace" variant="blue">
              Accéder à mon espace
            </ButtonLink>
          </div>

          <div className="mt-6">
            <Panel title="Récapitulatif de votre commande">
              <ul>
                {order.items.map((it) => (
                  <li key={it.sku} className="flex justify-between gap-3 border-b border-grey-line-soft py-2">
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
                Un reçu vous est envoyé par email. Libellé sur votre relevé bancaire : HERITAGE INTACT.
              </p>
            </Panel>
          </div>

          <hr className="my-10 border-grey-line" />

          <h2 className="mb-3 text-[1.4rem]">Et quand vous aurez votre chiffre...</h2>
          <p className="mb-3">
            ...la question suivante sera : <em>« et si je donne la maison ? et si j&apos;attends 71 ans ? »</em>{" "}
            Le Générateur de Dossier Notaire répond en direct, et imprime votre dossier prêt pour le
            notaire. Vos chiffres ne quittent pas votre ordinateur.
          </p>
          <p className="text-text-soft">
            Vous le retrouverez dans votre espace, onglet « Outils et Kits », et dans un email dans
            quelques jours, avec le prix membre.
          </p>
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
