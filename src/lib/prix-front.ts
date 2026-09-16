import { promotionParId } from "./db";
import { PRODUCTS } from "./config";
import { palier, appliquerRemise } from "./promotions";
import { palierLp } from "./fenetre-lp";
/**
 * ⚠️ DEUX FENÊTRES POSSIBLES, ET LA MEILLEURE GAGNE.
 *
 * `token` : la fenêtre du tunnel, ancrée par email dans `promotions` (clic vers
 * /commander, ou relance d'un email). `fenetreLp` : le cookie signé posé à
 * l'arrivée sur /lp, où l'on ne connaît aucune adresse (voir fenetre-lp.ts).
 * L'acheteur ne doit jamais payer plus cher parce qu'il est passé par les deux.
 */
export async function devisFront(token?:string,email?:string,fenetreLp?:string) {
  const p=token?await promotionParId(token):null;
  const admissible=p?.gamme==="front"&&(!email||p.email===email.trim().toLowerCase())?p:null;
  const duTunnel=palier(admissible);
  const deLp=palierLp(fenetreLp);
  const promotion=deLp.pourcent>duTunnel.pourcent?deLp:duTunnel;
  return {montant:appliquerRemise(PRODUCTS.front.price,promotion.pourcent),total:PRODUCTS.front.price,promotion,admissible:!p||Boolean(admissible)};
}
