import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Votre espace" };

/** Espace membre : à construire (connexion par lien envoyé par email, sans mot de passe). */
export default function MemberAreaPlaceholder() {
  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-12">
          <h1 className="mb-4 text-[1.6rem]">Votre espace membre</h1>
          <p className="mb-3">
            L&apos;espace membre est en construction. Vos accès vous seront envoyés par email : un lien à
            cliquer, aucun mot de passe à retenir.
          </p>
          <p className="text-text-soft">
            Une question ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
