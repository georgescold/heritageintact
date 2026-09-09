"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { enregistrerReponses } from "@/app/profil";
import { QualificationBloc } from "@/components/QualificationBloc";
import type { Reponses } from "@/lib/qualification";
/** Qualification obligatoire dans le funnel. Aucun paiement supplémentaire ici. */
export function FormulaireSituation({orderId,email}:{orderId:string;email:string}) {
  const router=useRouter(), verrou=useRef(false);
  const [pending,setPending]=useState(false),[erreur,setErreur]=useState("");
  async function onTermine(r:Reponses) {
    if(verrou.current)return;
    verrou.current=true; setPending(true); setErreur("");
    try {
      const resultat=await enregistrerReponses(orderId,email,r);
      if(resultat.ok)router.push(`/bienvenue?o=${encodeURIComponent(orderId)}`);
      else setErreur(resultat.error || "Réessayez l’enregistrement.");
    } catch { setErreur("La connexion a été interrompue. Réessayez, votre achat reste acquis."); }
    finally { verrou.current=false;setPending(false); }
  }
  return <><fieldset disabled={pending} className="min-w-0"><QualificationBloc onTermine={onTermine}/></fieldset>{pending&&<p role="status" className="mt-3">Nous préparons votre suite…</p>}{erreur&&<p role="alert" className="mt-3 border border-red bg-red-bg p-3">{erreur}</p>}</>;
}
