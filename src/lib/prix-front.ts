import { promotionParId } from "./db";
import { PRODUCTS } from "./config";
import { palier, appliquerRemise } from "./promotions";
export async function devisFront(token?:string,email?:string) {
  const p=token?await promotionParId(token):null;
  const admissible=p?.gamme==="front"&&(!email||p.email===email.trim().toLowerCase())?p:null;
  const promotion=palier(admissible);
  return {montant:appliquerRemise(PRODUCTS.front.price,promotion.pourcent),total:PRODUCTS.front.price,promotion,admissible:!p||Boolean(admissible)};
}
