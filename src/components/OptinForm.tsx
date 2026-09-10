"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { optin, type FormState } from "@/app/actions";
import { Button } from "./ui";

export function OptinForm({ cta = "Accéder à la présentation" }: { cta?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(optin, undefined);
  const pathname = usePathname();

  return (
    <form action={action} className="space-y-3">
      {/* La variante d'où vient le lead, pour pouvoir la suivre jusqu'à l'achat. */}
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
        <input
          type="checkbox"
          name="cgv"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-blue-mid"
        />
        <span>
          J&apos;accepte les <Link href="/cgv">conditions générales</Link> et la{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </span>
      </label>
      {/* Consentement commercial distinct de la demande du lien, jamais précoché. */}
      <label className="flex items-start gap-2 text-[0.85rem] text-text-soft">
        <input type="checkbox" name="marketingConsent" className="mt-1 h-5 w-5 shrink-0 accent-blue-mid" />
        <span>
          Je souhaite aussi recevoir la série de conseils et les offres Héritage Intact
          par email. Facultatif, désinscription à tout moment.
        </span>
      </label>

      {state?.error && (
        <p role="alert" className="border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
          {state.error}
        </p>
      )}
      <Button disabled={pending}>{pending ? "Un instant..." : cta}</Button>
      <p className="text-[0.85rem] text-text-soft">Votre email sert à envoyer le lien demandé.
      Sans cette case, vous ne recevez pas la séquence commerciale. <Link href="/confidentialite">Confidentialité</Link>.</p>
    </form>
  );
}
