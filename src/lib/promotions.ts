import type { Promotion } from "./db";
export const PROMOTIONS_ACTIVES = process.env.OFFRES_TEMPORAIRES_ACTIVES !== "false";
export type Palier = {pourcent:number;fin:string|null;suivant:number;serveurMaintenant:number;gamme:"front"|"suite";montantFixe:number|null;suivantFixe:number|null};
/**
 * La fenêtre de relance : 58 minutes, ouvertes une seule fois depuis le dernier
 * email de la séquence. Plus longue que les 5 minutes du site, et c'est voulu :
 * sur le site le visiteur est déjà en train de lire, tandis qu'un lecteur de
 * 67 ans qui ouvre son courrier sur un téléphone doit encore arriver sur la
 * page, la lire, et souvent en parler à son conjoint.
 */
export const RELANCE_MINUTES = 58;

/** Horloge serveur et dates persistées. Réduction sur le prix hors remise ou le complément dû, jamais sur les achats passés. */
export function palier(p:Promotion|null,maintenant=Date.now()):Palier {
  const base={pourcent:0,fin:null,suivant:0,serveurMaintenant:maintenant,gamme:p?.gamme??"front",montantFixe:null,suivantFixe:null} as Palier;
  if(!p || !PROMOTIONS_ACTIVES)return base;
  // La relance prime : c'est la fenêtre la plus récente, et la dernière.
  const relance=p.relanceLe?Date.parse(p.relanceLe):NaN;
  if(Number.isFinite(relance)&&relance<=maintenant){
    const fin=relance+RELANCE_MINUTES*60*1000;
    if(maintenant<fin)return {...base,pourcent:50,fin:new Date(fin).toISOString(),suivant:0};
    return base;
  }
  const debut=Date.parse(p.commenceLe);
  if(!Number.isFinite(debut)||debut>maintenant)return base;
  const front=p.gamme==="front";
  if(front){
    const fin=debut+5*60*1000;
    if(maintenant<fin)return {...base,pourcent:50,fin:new Date(fin).toISOString(),suivant:0};
    return base;
  }
  const premiereFin=debut+10*60*1000;
  const derniereFin=premiereFin+5*60*1000;
  if(maintenant<premiereFin)return {...base,pourcent:50,fin:new Date(premiereFin).toISOString(),suivant:34,montantFixe:147,suivantFixe:197};
  if(maintenant<derniereFin)return {...base,pourcent:34,fin:new Date(derniereFin).toISOString(),suivant:0,montantFixe:197,suivantFixe:297};
  return base;
}
export function appliquerRemise(montant:number,pourcent:number) {
  if(!Number.isFinite(montant)||montant<0||![0,10,20,25,30,50].includes(pourcent))throw Error("Tarif promotionnel invalide");
  return Math.round(Math.round(montant*100)*(100-pourcent)/100)/100;
}
