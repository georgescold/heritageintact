import { PRODUCTS, type ProductSku } from "./config";
import { profilDeCommande } from "./db";
import { ROUTE, sequence, urlEcran, type Ecran } from "./qualification";
import type { Accroche } from "./accroches";
const SKU: Record<Ecran, ProductSku> = {
  plan: "upsell1",
  "assurance-vie": "upsell2",
  pack: "pack1",
  "plan-notaire": "pack2",
  "pack-notaire": "pack3",
  "assurance-vie-notaire": "pack4",
  simulateur: "backend1",
};
export type EtapeTunnel =
  | { afficher: true; suivant: string; position: number; total: number; accroche?: Accroche }
  | { afficher: false; versOu: string };
export async function etapeTunnel(
  ecran: Ecran,
  orderId: string,
  opts: { bumpPresent: boolean },
): Promise<EtapeTunnel> {
  const profil = await profilDeCommande(orderId);
  const seq = sequence(profil, opts).filter((e) => PRODUCTS[SKU[e]].disponible);
  const livraison = `/bienvenue?o=${encodeURIComponent(orderId)}`;
  if (!seq.includes(ecran))
    return { afficher: false, versOu: seq.length ? urlEcran(seq[0], orderId, 1) : livraison };
  return { afficher: true, suivant: livraison, position: 1, total: 1 };
}
export const CHEMIN_ECRAN = ROUTE;
