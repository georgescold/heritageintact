import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { Section, SectionTitle } from "@/components/Lp";
import { desabonner, getLead } from "@/lib/db";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Désinscription", robots: { index: false } };

/**
 * Désinscription en un clic depuis le lien du pied d'email.
 *
 * Le GET affiche une confirmation : un scanner de liens ne désinscrit pas. Le POST API reste en un clic, sans case à
 * cocher. Une désinscription qui demande un effort finit en signalement de
 * spam, et un signalement coûte infiniment plus cher qu'un désabonné.
 */
export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const lead = id ? await getLead(id) : null;
  async function confirmer() {
    "use server";
    if (id) await desabonner(id);
    const { redirect } = await import("next/navigation");
    redirect("/desinscription?id=" + encodeURIComponent(id ?? ""));
  }

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <Section tone="grey">
          {lead ? (
            <>
              <SectionTitle>{lead.desabonne ? "Votre désinscription commerciale est enregistrée." : "Ne plus recevoir les conseils et offres"}</SectionTitle>
              <div className="space-y-4 text-[1.06rem]">
                {!lead.desabonne && <form action={confirmer}><button className="min-h-[48px] bg-blue p-4 font-bold text-white">Confirmer ma désinscription</button></form>}
                <p>
                  {lead.desabonne ? "Vous ne recevrez plus de messages commerciaux. Les emails nécessaires à vos achats et à votre accès restent distincts." : "Confirmez votre choix ci-dessous. Cela n’annule aucun achat et ne ferme pas votre espace."}
                </p>
                <p>
                  Si c&apos;était une erreur, écrivez-nous simplement à{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> et nous vous remettrons
                  sur la liste.
                </p>
                <p className="border-l-4 border-blue bg-white p-4">
                  La présentation reste accessible. Vous n&apos;avez pas besoin d&apos;être inscrit
                  pour la lire&nbsp;: <Link href="/methode">la lire maintenant</Link>.
                </p>
              </div>
            </>
          ) : (
            <>
              <SectionTitle>Ce lien de désinscription n&apos;est plus valable</SectionTitle>
              <div className="space-y-4 text-[1.06rem]">
                <p>
                  Il est peut-être incomplet, ou la désinscription a déjà été faite. Dans le doute,
                  écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> avec le mot
                  «&nbsp;stop&nbsp;» : nous traiterons votre demande.
                </p>
                <p>
                  <Link href="/">Retour à l&apos;accueil</Link>
                </p>
              </div>
            </>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
