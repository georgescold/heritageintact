import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { Section, SectionTitle } from "@/components/Lp";
import { desabonner } from "@/lib/db";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Désinscription", robots: { index: false } };

/**
 * Désinscription en un clic depuis le lien du pied d'email.
 *
 * Elle se fait à l'ouverture de la page, sans bouton à cliquer ni case à
 * cocher. Une désinscription qui demande un effort finit en signalement de
 * spam, et un signalement coûte infiniment plus cher qu'un désabonné.
 */
export default async function DesinscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const lead = id ? await desabonner(id) : null;

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <Section tone="grey">
          {lead ? (
            <>
              <SectionTitle>C&apos;est fait. Vous ne recevrez plus rien.</SectionTitle>
              <div className="space-y-4 text-[1.06rem]">
                <p>
                  L&apos;adresse <strong>{lead.email}</strong> est désinscrite. Aucun message ne
                  partira plus, et il n&apos;y a rien d&apos;autre à faire.
                </p>
                <p>
                  Si c&apos;était une erreur, écrivez-nous simplement à{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> et nous vous remettrons
                  sur la liste.
                </p>
                <p className="border-l-4 border-blue bg-white p-4">
                  La vidéo, elle, reste accessible. Vous n&apos;avez pas besoin d&apos;être inscrit
                  pour la revoir&nbsp;: <Link href="/methode">la revoir maintenant</Link>.
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
                  «&nbsp;stop&nbsp;» : nous nous en occupons le jour même.
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
