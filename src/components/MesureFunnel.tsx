"use client";
import { useEffect } from "react";
const ACTIF=process.env.NEXT_PUBLIC_FUNNEL_METRICS_ACTIVE==="true";
const noms=new Set(["vue_vente","vue_commande","vue_offre","clic_apercu","clic_commande"]);
/** Comptages agrégés : aucun identifiant, cookie de suivi, réponse, email ou URL envoyé. */
export function MesureFunnel({ evenement }: { evenement: "vue_vente" | "vue_commande" | "vue_offre" }) {
  useEffect(()=>{
    if(!ACTIF)return;
    const envoyer=(nom:string)=>{if(noms.has(nom))void fetch("/api/mesure",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({evenement:nom}),keepalive:true}).catch(()=>{});};
    let vu=false;
    const visible=()=>{if(!vu && document.visibilityState==="visible"){vu=true;envoyer(evenement);}};
    const clic=(e:MouseEvent)=>{const el=(e.target as Element)?.closest<HTMLElement>("[data-mesure]");if(el?.dataset.mesure)envoyer(el.dataset.mesure);};
    visible(); document.addEventListener("visibilitychange",visible);document.addEventListener("click",clic);
    return()=>{document.removeEventListener("visibilitychange",visible);document.removeEventListener("click",clic);};
  },[evenement]);
  return null;
}
