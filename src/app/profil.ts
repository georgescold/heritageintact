"use server";
import { getOrder, enregistrerProfil, profilDeCommande, commencerPromotion } from "@/lib/db";
import { piste, sequence, urlEcran, type Reponses } from "@/lib/qualification";
import { profilComplet } from "@/lib/questionnaire";
export async function enregistrerReponses(orderId: string, _email: string, reponses: Reponses): Promise<{ok: true; destination: string} | {ok: false; error: string}> {
  void _email;
  if (!profilComplet(reponses)) return {ok:false,error:"Répondez à chaque question pour continuer."};
  try {
    const order = await getOrder(orderId);
    if (!order || order.status !== "paid") return {ok:false,error:"Votre commande réglée n’a pas été retrouvée."};
    const propres = {objectif:reponses.objectif, vie:reponses.vie, enfants:reponses.enfants, age:reponses.age, av:reponses.av, blocage:reponses.blocage};
    await enregistrerProfil({...propres, orderId, email:order.email, piste:piste(propres,{bumpPresent:order.items.some(i=>i.sku==="bump")})});
    const enregistre = await profilDeCommande(orderId);
    if (!profilComplet(enregistre) || Object.entries(propres).some(([k,v]) => enregistre?.[k as keyof Reponses] !== v)) throw Error("Profil non conservé");
    const prochain = sequence(propres,{bumpPresent:order.items.some(i=>i.sku==="bump")})[0];
    return {ok:true,destination:prochain?urlEcran(prochain,order.id,0):`/bienvenue?o=${encodeURIComponent(order.id)}`};
  } catch {
    return {ok:false,error:"Vos réponses n’ont pas pu être enregistrées. Elles restent affichées : réessayez. Votre achat reste acquis."};
  }
}

/** L'horloge commerciale du plan démarre lorsque l'aperçu détaillé est prêt, jamais pendant le questionnaire. */
export async function demarrerOffrePlan(orderId: string): Promise<{ok:true}|{ok:false;error:string}> {
  const order = await getOrder(orderId);
  if (!order || order.status !== "paid") return {ok:false,error:"Commande réglée introuvable."};
  if (!profilComplet(await profilDeCommande(orderId))) return {ok:false,error:"Terminez d’abord la qualification."};
  try {
    await commencerPromotion(order.email,"suite");
    return {ok:true};
  } catch {
    return {ok:false,error:"Votre aperçu est prêt, mais le prix n’a pas pu être sécurisé. Réessayez."};
  }
}
