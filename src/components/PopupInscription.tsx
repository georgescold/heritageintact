"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { optin, type FormState } from "@/app/actions";
import { suivre } from "@/lib/parcours-client";
import { ChampsUtm } from "./ChampsUtm";
import { Button } from "./ui";

/**
 * LA FENÊTRE QUI DÉVERROUILLE LA PAGE DE VENTE, SUR /lp.
 *
 * Voulue « très très simple » par Loys (14/09/2026) : 2 champs, 1 bouton, rien
 * d'autre. Elle ne se ferme pas : c'est elle qui ouvre la page.
 *
 * L'acceptation des conditions est portée par le clic (mention sous le bouton) :
 * `optin` exige le champ `cgv`, transmis ici en champ caché. Après l'inscription,
 * `optin` redirige vers /methode?inscrit=1 — la même page, déverrouillée, et
 * c'est là que part l'événement Lead du Pixel Meta.
 */
export function PopupInscription() {
  const [state, action, pending] = useActionState<FormState, FormData>(optin, undefined);

  // La page derrière ne défile pas tant que la fenêtre est ouverte.
  useEffect(() => {
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, []);

  useEffect(() => {
    if (state?.error) suivre("inscription_erreur", { message: state.error, fenetre: true });
  }, [state]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-inscription-titre"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#12365e]/60 p-4 backdrop-blur-[6px]"
    >
      <div className="w-full max-w-[420px] border-2 border-blue bg-white p-5 shadow-2xl sm:p-6">
        <p className="mb-1 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-orange">
          Vidéo gratuite · 5 minutes
        </p>
        <h2 id="popup-inscription-titre" className="mb-2 text-[1.4rem] leading-tight">
          Débloquez la présentation
        </h2>
        <p className="mb-4 text-[1rem] leading-snug">
          Indiquez votre prénom et votre email : la vidéo s’ouvre tout de suite.
        </p>
        <form action={action} className="space-y-3">
          <input type="hidden" name="source" value="/lp" />
          <input type="hidden" name="cgv" value="on" />
          <ChampsUtm />
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Votre prénom"
            aria-label="Votre prénom"
            className="field"
          />
          <input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="Votre adresse email"
            aria-label="Votre adresse email"
            className="field"
          />
          {state?.error && (
            <p role="alert" className="border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
              {state.error}
            </p>
          )}
          <Button disabled={pending}>{pending ? "Un instant..." : "Débloquer la vidéo"}</Button>
          <p className="text-center text-[0.78rem] leading-snug text-text-soft">
            En continuant, vous acceptez les <Link href="/cgv">conditions générales</Link> et la{" "}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
