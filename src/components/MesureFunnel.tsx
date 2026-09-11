import { MesureFunnelClient } from "./MesureFunnelClient";

const ACTIF = process.env.NEXT_PUBLIC_FUNNEL_METRICS_ACTIVE === "true";

/** N’envoie le composant client au navigateur que lorsque la mesure est réellement activée. */
export function MesureFunnel({ evenement }: { evenement: "vue_vente" | "vue_commande" | "vue_offre" }) {
  return ACTIF ? <MesureFunnelClient evenement={evenement} /> : null;
}
