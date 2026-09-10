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
    await commencerPromotion(order.email, "suite");
    const prochain = sequence(propres,{bumpPresent:order.items.some(i=>i.sku==="bump")})[0];
    return {ok:true,destination:prochain?urlEcran(prochain,order.id,0):`/bienvenue?o=${encodeURIComponent(order.id)}`};
  } catch {
    return {ok:false,error:"Vos réponses n’ont pas pu être enregistrées. Elles restent affichées : réessayez. Votre achat reste acquis."};
  }
}
