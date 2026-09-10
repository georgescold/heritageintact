"use client";

import { useState } from "react";
import { CLE_SIMULATION } from "@/lib/simulateur/donnees";

export function TelechargerPlanPersonnalise({ jeton }: { jeton: string }) {
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");

  async function telecharger() {
    if (attente) return;
    setErreur("");
    let donnees: string | null = null;
    try {
      donnees = localStorage.getItem(CLE_SIMULATION);
    } catch {}
    if (!donnees) {
      setErreur("Aucune simulation n’est enregistrée sur cet appareil. Ouvrez le simulateur, complétez-le, puis revenez télécharger votre plan.");
      return;
    }
    setAttente(true);
    try {
      const reponse = await fetch(`/espace/${jeton}/pdf/plan-personnalise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: donnees,
      });
      if (!reponse.ok) {
        setErreur(await reponse.text());
        return;
      }
      const blob = await reponse.blob();
      const url = URL.createObjectURL(blob);
      const lien = document.createElement("a");
      lien.href = url;
      lien.download = "mon-plan-personnalise.pdf";
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErreur("Le téléchargement a été interrompu. Réessayez dans quelques instants.");
    } finally {
      setAttente(false);
    }
  }

  return (
    <li className="border-2 border-blue bg-grey-bg p-5">
      <p className="mb-2 text-[1.1rem] font-bold text-blue">Mon plan personnalisé</p>
      <p className="mb-3 text-sm">PDF généré à partir de la dernière simulation enregistrée sur cet appareil.</p>
      <button
        type="button"
        onClick={telecharger}
        disabled={attente}
        className="inline-flex min-h-[50px] w-full items-center justify-center bg-orange px-4 py-3 text-center font-bold text-white disabled:opacity-60 sm:w-auto"
      >
        {attente ? "Génération du PDF…" : "Télécharger mon plan personnalisé PDF"}
      </button>
      {erreur && <p role="alert" className="mt-3 border-l-4 border-red bg-red-bg p-3 text-sm">{erreur}</p>}
    </li>
  );
}
