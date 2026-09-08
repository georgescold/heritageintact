"use client";

import { Footer, Header } from "@/components/Chrome";
import { Button, Panel } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/config";

/**
 * LE PENDANT DE `[jeton]/error.tsx`, POUR LA PAGE DE RÉCUPÉRATION ELLE-MÊME.
 *
 * /espace est la porte de secours du dispositif : c'est là qu'arrive celui qui
 * n'a plus ni email, ni favori, ni ordinateur d'origine. Si elle tombe en
 * panne, il n'a plus aucun chemin — et l'écran par défaut de Next lui répondrait
 * en anglais avec un digest.
 *
 * ⚠️ ON N'Y MET PAS `FormulaireLienPerdu` : c'est précisément ce formulaire qui
 * vient d'échouer. Une adresse à écrire, et un bouton pour réessayer.
 */
export default function ErreurRecuperation({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[espace] page de récupération indisponible", error.digest ?? error.message);

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-10">
          <h1 className="mb-4 text-[1.6rem]">Cette page n&apos;a pas pu s&apos;afficher</h1>
          <p className="mb-6 text-[1.15rem]">
            Ce n&apos;est pas grave, et vous n&apos;avez rien perdu. Appuyez sur le bouton
            ci-dessous&nbsp;: la plupart du temps, cela suffit.
          </p>

          <div className="mb-8">
            <Button variant="green" type="button" onClick={reset}>
              Réessayer
            </Button>
          </div>

          <Panel title="Si cela recommence">
            <p className="text-[1.05rem]">
              Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> en indiquant
              l&apos;adresse email de votre commande. Nous vous renvoyons votre lien nous-mêmes,
              dans la journée. Il n&apos;y a pas de mot de passe, et il n&apos;y en aura jamais.
            </p>
          </Panel>
        </div>
      </main>
      <Footer />
    </>
  );
}
