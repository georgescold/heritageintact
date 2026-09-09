import type { Promotion } from "./db";
export const PROMOTIONS_ACTIVES = process.env.OFFRES_TEMPORAIRES_ACTIVES !== "false";
export type Palier = {pourcent:number;fin:string|null;suivant:number;serveurMaintenant:number;gamme:"front"|"suite"};
/** Horloge serveur et dates persistées. Réduction sur le prix hors remise ou le complément dû, jamais sur les achats passés. */
export function palier(p:Promotion|null,maintenant=Date.now()):Palier {
  const base={pourcent:0,fin:null,suivant:0,serveurMaintenant:maintenant,gamme:p?.gamme??"front"} as Palier;
  if(!p || !PROMOTIONS_ACTIVES)return base;
  const debut=Date.parse(p.commenceLe);
  if(!Number.isFinite(debut)||debut>maintenant)return base;
  const premiereFin=debut+20*60*1000, derniereFin=debut+(p.gamme==="front"?7*86400000:48*3600000);
  const fort=p.gamme==="front"?20:25;
  if(maintenant<premiereFin)return {...base,pourcent:fort,fin:new Date(premiereFin).toISOString(),suivant:10};
  if(maintenant<derniereFin)return {...base,pourcent:10,fin:new Date(derniereFin).toISOString(),suivant:0};
  return base;
}
export function appliquerRemise(montant:number,pourcent:number) {
  if(!Number.isFinite(montant)||montant<0||![0,10,20,25].includes(pourcent))throw Error("Tarif promotionnel invalide");
  return Math.round(Math.round(montant*100)*(100-pourcent)/100)/100;
}
