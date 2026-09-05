import Link from "next/link";
import type { ReactNode } from "react";
import { acceptUpsell } from "@/app/actions";
import { PRODUCTS, euros, type ProductSku } from "@/lib/config";
import { Header, Footer } from "./Chrome";
import { VideoEmbed } from "./VideoEmbed";
import { Button, ValueStack } from "./ui";

/**
 * Page d'offre unique (après la commande). Pas de fenêtre de sortie ici.
 * Un bouton OUI, un lien NON discret.
 */
export function UpsellPage({
 step,
 orderId,
 sku,
 next,
 kicker,
 h1,
 h2,
 videoId,
 videoMinutes,
 children,
 rows,
 declineText,
 paymentFailed = false,
}: {
 step: 2 | 3;
 orderId: string;
 sku: ProductSku;
 next: string;
 kicker: string;
 h1: ReactNode;
 h2: ReactNode;
 videoId?: string;
 videoMinutes: number;
 children: ReactNode;
 rows: { label: string; value: string }[];
 declineText: string;
  /** Le débit de l'offre précédente a échoué : on prévient sans inquiéter. */
 paymentFailed?: boolean;
}) {
 const product = PRODUCTS[sku];
 const totalValue = rows.reduce((s, r) => s + Number(r.value.replace(/[^\d]/g, "")), 0);
 const accept = acceptUpsell.bind(null, orderId, sku, next);
 const declineHref = next.includes("?") ? next : `${next}?o=${orderId}`;

 return (
    <>
      <Header minimal />
      <main className="flex-1">
        <Progress step={step} />
        <div className="wrap py-6 sm:py-8">
          {paymentFailed && (
            <p
 role="alert"
 className="mb-5 border border-red bg-red-bg px-4 py-3 text-[0.95rem] text-red"
            >
              L&apos;offre précédente n&apos;a pas pu être ajoutée à votre commande : votre banque a
 refusé le second paiement. <strong>Votre commande initiale reste bien enregistrée</strong>{" "}
 et vos accès vous seront envoyés normalement.
            </p>
          )}
          <p className="mb-2 font-bold text-orange-dark">{kicker}</p>
          <h1 className="mb-3 text-[1.5rem] sm:text-[1.9rem]">{h1}</h1>
          <p className="mb-5 text-[1.05rem] text-text-soft">{h2}</p>

          <VideoEmbed id={videoId} title={product.name} minutes={videoMinutes} />

          <div className="mt-6 space-y-4">{children}</div>

          <h2 className="mb-3 mt-8 text-[1.3rem]">Ce que vous recevez</h2>
          <ValueStack
 rows={rows}
 total={euros(totalValue)}
 today={euros(product.price)}
 todayLabel="Aujourd'hui seulement"
          />

          <form action={accept} className="mt-6">
            <Button variant="green">
              OUI, j&apos;ajoute {product.short} à ma commande ({euros(product.price)})
            </Button>
            <p className="mt-2 text-center text-[0.9rem] text-text-soft">
              Un seul clic, sans ressaisir votre carte. Garantie 30 jours.
            </p>
          </form>

          <p className="mt-8 text-center text-[0.9rem]">
            <Link href={declineHref} className="text-text-soft">
              {declineText}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Progress({ step }: { step: 2 | 3 }) {
 const steps = ["Commande validée", "Votre plan", "Votre assurance-vie", "Accès"];
 return (
    <div className="border-b border-grey-line bg-grey-bg">
      <ol className="wrap flex flex-wrap gap-x-5 gap-y-1 py-2 text-[0.85rem] text-text-soft">
        {steps.map((s, i) => {
 const n = i + 1;
 const done = n < step;
 const current = n === step;
 return (
            <li key={s} className={current ? "font-bold text-blue" : done ? "text-green" : ""}>
              {done ? "✔" : `${n}.`} {s}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
