"use client";
import { ExitPopup } from "./ExitPopup";
import { euros } from "@/lib/config";
import type { Palier } from "@/lib/promotions";
export function SortieOffre({produit,href,montant,promotion}:{produit:string;href:string;montant:number;promotion:Palier}) {
  const av=produit==="upsell2",front=produit==="front",dossier=produit==="bump";
  return <ExitPopup storageKey={"vente-v7-"+produit} title="Ce que vous risquez si vous fermez cette page">
    <p className="font-bold text-blue">{front?"Le sujet retournera-t-il encore dans la pile « plus tard » ?":av?"Vous avez choisi qui protéger. Votre contrat dit-il encore la même chose ?":dossier?"Le rendez-vous peut être pris. Le dossier, lui, sera-t-il prêt ?":"Vous vouliez leur laisser une maison. Pas toutes les questions qui vont avec."}</p>
    <p>{front?"Qui retrouvera les actes ? Qui saura ce que vous souhaitiez ? Quelles dates méritaient d’être regardées plus tôt ? Vous pouvez commencer à répondre pendant que vous êtes là pour en parler. Ouvrez les 7 erreurs et faites votre première fiche.":av?"Ce capital est versé hors succession, au plus tard un mois après la remise des pièces, aux personnes que la clause désigne. Si ce ne sont plus les bonnes, c’est à elles qu’il ira. Le guide vous aide à demander les bonnes informations et à conserver les réponses.":dossier?"Sans trame, il reste à décider quoi rassembler, comment demander le rendez-vous et où noter les réponses. Le Dossier prépare ces supports ; vous adaptez l’exemple au lieu de repartir d’une page blanche.":"Le jour venu, vos proches auront six mois pour payer les droits, et chaque mois de retard ensuite leur coûtera. Votre aperçu vient de révéler des points sensibles : ne refermez pas la page avant d’avoir déverrouillé l’estimation, les hypothèses et l’ordre de préparation adapté à vos réponses."}</p>
    {promotion.pourcent>0&&promotion.fin&&<p className="border-l-4 border-orange bg-yellow-bg p-3">Votre prix actuel de {euros(montant)} reste personnel et limité. Quitter la page ne prolonge pas le délai ; le prix sera revérifié avant confirmation.</p>}
    <a href={href} onClick={e=>{e.currentTarget.closest("dialog")?.close();}} className="inline-flex min-h-[52px] w-full items-center justify-center bg-orange p-4 text-center font-bold text-white">{front?"Commencer maintenant":"Revoir ma proposition"} · {euros(montant)}</a>
    <p className="text-sm text-text-soft">{front?"Paiement unique. Guide complet. Garantie commerciale 30 jours.":"Aucun achat sur ce clic. Votre premier achat reste acquis, même si vous refusez."} L’effet des règles fiscales dépend de votre situation.</p>
  </ExitPopup>;
}
