import { notFound, redirect } from "next/navigation";
import { FormulaireConnexion } from "@/components/admin/FormulaireConnexion";
import { adminConfigure, sessionAdminOuverte } from "@/lib/admin/session";

export default async function ConnexionAdmin() {
  // Panel non installé sur ce serveur : l'adresse doit se comporter comme une
  // adresse inexistante, sans jamais révéler qu'un panel pourrait exister.
  if (!adminConfigure()) notFound();
  if (await sessionAdminOuverte()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-[380px] border border-grey-line bg-white p-6">
        <h1 className="mb-1 text-[1.3rem]">Pilotage</h1>
        <p className="mb-5 text-[0.9rem] text-text-soft">Accès réservé.</p>
        <FormulaireConnexion />
      </div>
    </main>
  );
}
