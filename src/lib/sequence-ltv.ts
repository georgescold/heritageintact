import type { Acces, Lead, Progression } from "./db";
import { sequence, type Reponses } from "./qualification";
import type { ProductSku } from "./config";
export function offreLtv(profil: Reponses | null, possede: Set<ProductSku>): ProductSku | null {
  if(possede.has("upsell1") && profil?.av==="O" && !possede.has("upsell2"))return "upsell2";
  const e=sequence(profil,{bumpPresent:possede.has("bump")})[0];
  const sku=e==="plan"?"upsell1":e==="assurance-vie"?"upsell2":null;
  return sku && !possede.has(sku) ? sku : null;
}
export function etapeLtvDue(lead: Lead, acces: Acces, progression: Progression[], maintenant=Date.now()) {
  const jours=(maintenant-Date.parse(acces.createdAt))/86400000;
  if(!lead.marketingConsent || lead.desabonne || acces.revoque || !Number.isFinite(jours) || jours<10 || jours>35 || !progression.some(p=>p.etape==="e0"&&p.faiteLe))return null;
  const cles=acces.envoyes ?? [];
  if(cles.includes("ltv-pause"))return null;
  if(!cles.includes("ltv-v3-1"))return "ltv-v3-1";
  if(jours>=17 && !cles.includes("ltv-v3-2"))return "ltv-v3-2";
  return null;
}
