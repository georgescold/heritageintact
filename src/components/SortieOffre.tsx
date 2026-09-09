"use client";
import { ExitPopup } from "./ExitPopup";
import { euros } from "@/lib/config";
import type { Palier } from "@/lib/promotions";
export function SortieOffre({produit,href,montant,promotion}:{produit:string;href:string;montant:number;promotion:Palier}) {
  const av=produit==="upsell2",front=produit==="front",dossier=produit==="bump";
  return <ExitPopup storageKey={"vente-v7-"+produit} title="Ce que vous risquez si vous fermez cette page">
    <p className="font-bold text-blue">{front?"Le sujet retournera-t-il encore dans la pile « plus tard » ?":av?"Vous avez choisi qui protéger. Votre contrat dit-il encore la même chose ?":dossier?"Le rendez-vous peut être pris. Le dossier, lui, sera-t-il prêt ?":"Vous vouliez leur laisser une maison. Pas toutes les questions qui vont avec."}</p>
    <p>{front?"Qui retrouvera les actes ? Qui saura ce que vous souhaitiez ? Quelles dates méritaient d’être regardées plus tôt ? Vous pouvez commencer à répondre pendant que vous êtes là pour en parler. Ouvrez les 7 erreurs et faites votre première fiche.":av?"Une clause introuvable ou un historique incomplet ne se clarifie pas tout seul. Le guide vous aide à demander les bonnes informations et à conserver les réponses.":dossier?"Sans trame, il reste à décider quoi rassembler, comment demander le rendez-vous et où noter les réponses. Le Dossier prépare ces supports ; vous adaptez l’exemple au lieu de repartir d’une page blanche.":"Ne laissez pas votre premier élan redevenir « on verra plus tard ». Le pack relie les pièces, les particularités familiales et les prochaines questions, pour préparer un échange concret avec le professionnel."}</p>
    {promotion.pourcent>0&&promotion.fin&&<p className="border-l-4 border-orange bg-yellow-bg p-3">Votre palier de −{promotion.pourcent}% se termine le {new Date(promotion.fin).toLocaleString("fr-FR",{timeZone:"Europe/Paris",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})} (Paris). Quitter la page ne le prolonge pas. Le prix sera revérifié avant confirmation.</p>}
    <a href={href} onClick={e=>{e.currentTarget.closest("dialog")?.close();}} className="inline-flex min-h-[52px] w-full items-center justify-center bg-orange p-4 text-center font-bold text-white">{front?"Commencer maintenant":"Revoir ma proposition"} · {euros(montant)}</a>
    <p className="text-sm text-text-soft">{front?"Paiement unique. Guide complet. Garantie commerciale 30 jours.":"Aucun achat sur ce clic. Votre premier achat reste acquis, même si vous refusez."} L’effet des règles fiscales dépend de votre situation.</p>
  </ExitPopup>;
}
