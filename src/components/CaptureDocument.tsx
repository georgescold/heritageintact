"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { demanderDocument, type FormState } from "@/app/actions";
import { Button } from "./ui";

/**
 * LE BLOC DE CAPTURE DES PAGES ÉDITORIALES.
 *
 * Il ne vend rien et ne mentionne aucun prix : sur du trafic organique, c'est la
 * séquence qui vend (`09-faq/arbitrages.md`). Ici on échange un document contre
 * une adresse, rien d'autre.
 *
 * ⚠️ Pas de case de consentement marketing — retirée le 12/09/2026 à la demande
 * de Loys, pour pouvoir tester la chaîne de bout en bout. Le consentement est
 * accordé d'office côté serveur par `CONSENTEMENT_IMPLICITE_SEO`
 * (`src/app/actions.ts`), donc la séquence J1-J7 part bien.
 *
 * C'est un RÉGLAGE DE TEST. Avant d'ouvrir la première page éditoriale au
 * public, rétablir cette case ET repasser la constante à `false` : les deux
 * vont ensemble, l'une sans l'autre laisse le site inscrire des gens à une
 * séquence qu'ils n'ont pas demandée.
 */
export function CaptureDocument({
  titre = "Le chiffre que personne ne vous a donné",
  accroche = "Combien vos enfants paieront sur ce que vous leur laisserez : la grille complète, par patrimoine et par nombre d’enfants. Vous trouverez votre ligne en dix secondes.",
  cta = "Recevoir la grille",
}: {
  titre?: string;
  accroche?: string;
  cta?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    demanderDocument,
    undefined,
  );
  const pathname = usePathname();

  return (
    <aside className="my-8 border-2 border-blue bg-white p-4 sm:p-6">
      <p className="mb-1 text-[0.8rem] uppercase tracking-wide text-text-soft">
        Document de référence · offert
      </p>
      <h2 className="mb-2 text-[1.3rem] font-bold leading-snug">{titre}</h2>
      <p className="mb-4 text-[0.95rem]">{accroche}</p>

      <form action={action} className="space-y-3">
        {/* La page d'origine : c'est elle qui dira quelle grappe rapporte. */}
        <input type="hidden" name="source" value={pathname} />
        <label className="block">
          <span className="mb-1 block font-bold">Votre prénom</span>
          <input name="firstName" type="text" autoComplete="given-name" required className="field" />
        </label>
        <label className="block">
          <span className="mb-1 block font-bold">Votre adresse email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            className="field"
          />
        </label>
        <label className="flex items-start gap-2 text-[0.85rem] text-text-soft">
          <input type="checkbox" name="cgv" required className="mt-1 h-5 w-5 shrink-0 accent-blue-mid" />
          <span>
            J&apos;accepte les <Link href="/cgv">conditions générales</Link> et la{" "}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </span>
        </label>
        {state?.error && (
          <p role="alert" className="border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
            {state.error}
          </p>
        )}
        <Button disabled={pending}>{pending ? "Un instant..." : cta}</Button>
        <p className="text-[0.85rem] text-text-soft">
          Le document s’ouvre immédiatement, et une copie part par email.{" "}
          <Link href="/confidentialite">Confidentialité</Link>.
        </p>
      </form>
    </aside>
  );
}
