"use client";

import { Footer, Header } from "@/components/Chrome";
import { FormulaireLienPerdu } from "@/components/espace/FormulaireLienPerdu";
import { Button, Panel } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/config";

/**
 * LE SEUL CHEMIN QUE `LienInvalide` N'INTERCEPTAIT PAS.
 *
 * Il n'existait AUCUN `error.tsx` dans le projet. Toute exception levée pendant
 * le rendu d'une page à jeton — le pooler Supabase qui refuse une connexion
 * trois secondes un samedi matin, un pic du cron, un redémarrage de
 * maintenance — remontait donc jusqu'à la page d'erreur par défaut de Next :
 * « Application error: a server-side exception has occurred », en anglais, avec
 * un digest hexadécimal.
 *
 * C'est exactement l'écran que tout l'espace membre est écrit pour éviter.
 * `chargerEspace` n'attrape rien, et `sql()` tourne avec `max: 1` et
 * `connect_timeout: 10` sur un pooler partagé : ce n'est pas une hypothèse.
 *
 * ⚠️ JAMAIS LE MOT « ERREUR », JAMAIS LE DIGEST, JAMAIS UN CODE. Le ton est
 * celui de `LienInvalide` : il ne s'est rien passé de grave, il n'a rien perdu,
 * et il y a un bouton à appuyer.
 */
export default function ErreurEspace({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Le détail part dans les journaux du serveur, jamais à l'écran.
  console.error("[espace] rendu impossible", error.digest ?? error.message);

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-10">
          <h1 className="mb-4 text-[1.6rem]">Votre espace n&apos;a pas pu s&apos;afficher</h1>
          <p className="mb-6 text-[1.15rem]">
            Ce n&apos;est pas grave, et vous n&apos;avez rien perdu. Votre lien reste le bon, et
            tout ce que vous avez acheté est toujours là. Appuyez simplement sur le bouton
            ci-dessous.
          </p>

          <div className="mb-8">
            <Button variant="green" type="button" onClick={reset}>
              Réessayer
            </Button>
          </div>

          <Panel title="Si cela recommence">
            <p className="mb-4 text-[1.05rem]">
              Indiquez votre adresse email : votre lien personnel vous est renvoyé tout de suite. Il
              n&apos;y a pas de mot de passe, et il n&apos;y en aura jamais.
            </p>
            <FormulaireLienPerdu />
          </Panel>

          <p className="mt-6 text-text-soft">
            Rien ne se passe ? Écrivez-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, nous nous en occupons
            nous-mêmes.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
