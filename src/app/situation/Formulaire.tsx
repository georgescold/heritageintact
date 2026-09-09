"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enregistrerReponses } from "@/app/profil";
import { QualificationBloc } from "@/components/QualificationBloc";
import type { Reponses } from "@/lib/qualification";
/** Complète l’orientation facultative après livraison ; aucun champ sur le chemin bancaire. */
export function FormulaireSituation({ orderId, email, objectif }: { orderId: string; email: string; objectif?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function onTermine(reponses: Reponses) {
    setPending(true);
    try { await enregistrerReponses(orderId, email, reponses); }
    finally { router.push(`/plan-complet?o=${encodeURIComponent(orderId)}`); }
  }
  if (pending) return <p role="status" className="border-2 border-blue bg-grey-bg p-5">Merci. Nous préparons la suite…</p>;
  return <QualificationBloc onTermine={onTermine} initial={objectif ? {objectif} : undefined}/>;
}
