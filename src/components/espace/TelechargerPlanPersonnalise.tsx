"use client";

import { useState } from "react";
import Link from "next/link";
import type { DonneesSimulation } from "@/lib/simulateur/donnees";

export function TelechargerPlanPersonnalise({ jeton, donnees }: { jeton: string; donnees?: DonneesSimulation }) {
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");

  async function telecharger() {
    if (attente) return;
    setErreur("");
    setAttente(true);
    try {
      const reponse = await fetch(`/espace/${jeton}/pdf/plan-personnalise`, {
        // Exporter exactement le résultat affiché ; le serveur vérifie toujours l'achat.
        method: donnees ? "POST" : "GET",
        ...(donnees ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(donnees) } : {}),
        cache: "no-store",
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
      // Laisser le navigateur démarrer le téléchargement, notamment sur mobile.
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch {
      setErreur("Le téléchargement a été interrompu. Réessayez dans quelques instants.");
    } finally {
      setAttente(false);
    }
  }

  return (
    <li className="border-2 border-blue bg-grey-bg p-5">
      <p className="mb-1 text-sm font-bold uppercase tracking-wide text-orange-dark">Votre résultat principal</p>
      <p className="mb-2 text-[1.1rem] font-bold text-blue">Mon plan personnalisé</p>
      <p className="mb-3 text-sm">Vos réponses, vos priorités et vos prochaines démarches. Retrouvez votre dernière préparation enregistrée, depuis votre téléphone ou votre ordinateur.</p>
      <button
        type="button"
        onClick={telecharger}
        disabled={attente}
        className="inline-flex min-h-[50px] w-full items-center justify-center bg-orange px-4 py-3 text-center font-bold text-white disabled:opacity-60 sm:w-auto"
      >
        {attente ? "Génération du PDF…" : "Télécharger mon plan personnalisé PDF"}
      </button>
      {!donnees && <p className="mt-3"><Link className="inline-flex min-h-[48px] items-center underline" href={`/espace/${jeton}/simulateur`}>Reprendre ou modifier mes réponses</Link></p>}
      {erreur && <p role="alert" className="mt-3 border-l-4 border-red bg-red-bg p-3 text-sm">{erreur}</p>}
    </li>
  );
}
