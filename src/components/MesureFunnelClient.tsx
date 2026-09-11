"use client";

import { useEffect } from "react";

const noms = new Set(["vue_vente", "vue_commande", "vue_offre", "clic_apercu", "clic_commande"]);

/** Comptages agrégés : aucun identifiant, cookie de suivi, réponse, email ou URL envoyé. */
export function MesureFunnelClient({ evenement }: { evenement: "vue_vente" | "vue_commande" | "vue_offre" }) {
  useEffect(() => {
    const envoyer = (nom: string) => {
      if (noms.has(nom)) {
        void fetch("/api/mesure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ evenement: nom }),
          keepalive: true,
        }).catch(() => {});
      }
    };
    let vu = false;
    const visible = () => {
      if (!vu && document.visibilityState === "visible") {
        vu = true;
        envoyer(evenement);
      }
    };
    const clic = (event: MouseEvent) => {
      const element = (event.target as Element)?.closest<HTMLElement>("[data-mesure]");
      if (element?.dataset.mesure) envoyer(element.dataset.mesure);
    };
    visible();
    document.addEventListener("visibilitychange", visible);
    document.addEventListener("click", clic);
    return () => {
      document.removeEventListener("visibilitychange", visible);
      document.removeEventListener("click", clic);
    };
  }, [evenement]);
  return null;
}
