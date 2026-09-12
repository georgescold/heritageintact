"use client";

import { useActionState } from "react";
import { entrer, type EtatConnexion } from "@/app/admin/actions";

export function FormulaireConnexion() {
  const [etat, action, attente] = useActionState<EtatConnexion, FormData>(entrer, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block font-bold">Mot de passe</span>
        <input
          name="motDePasse"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="block min-h-[48px] w-full border border-grey-line bg-white p-3"
        />
      </label>
      {etat.erreur && (
        <p role="alert" className="border border-red bg-red-bg px-3 py-2 text-[0.95rem] text-red">
          {etat.erreur}
        </p>
      )}
      <button
        disabled={attente}
        className="min-h-[48px] w-full bg-blue px-5 py-3 font-bold text-white disabled:opacity-60"
      >
        {attente ? "Vérification…" : "Entrer"}
      </button>
    </form>
  );
}
