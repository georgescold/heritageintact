import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { confirmCheckout } from "@/app/actions";
import { Header, Footer } from "@/components/Chrome";
import { ButtonLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Confirmation du paiement" };

/**
 * Point de retour après une authentification forte (3-D Secure).
 * Stripe renvoie ici avec ?payment_intent=… &redirect_status=…
 * On revalide côté serveur, puis on remet le client dans le funnel.
 */
export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ o?: string; payment_intent?: string; redirect_status?: string }>;
}) {
  const { o, payment_intent, redirect_status } = await searchParams;

  if (o && payment_intent && redirect_status === "succeeded") {
    const done = await confirmCheckout(o, payment_intent);
    if (done.ok) redirect(`/plan-complet?o=${o}`);
  }

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-12">
          <h1 className="mb-4 text-[1.6rem]">Votre paiement n&apos;a pas pu être confirmé</h1>
          <p className="mb-3">
            Votre banque n&apos;a pas validé l&apos;authentification, ou l&apos;opération a été
            interrompue. <strong>Aucun montant n&apos;a été débité.</strong>
          </p>
          <p className="mb-6 text-text-soft">
            Vous pouvez réessayer. Si le problème persiste, écrivez-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : nous répondons sous 24 heures.
          </p>
          <ButtonLink href="/commande">Revenir au bon de commande</ButtonLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
