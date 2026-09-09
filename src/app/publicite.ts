"use server";
import { cookies } from "next/headers";
import { getOrder, commandesPayeesParEmail, accesParJeton } from "@/lib/db";
import { mesurerCommandeMeta, configurationMeta } from "@/lib/meta-conversions";
import { COOKIE_PUBLICITE, lireChoixPublicitaire } from "@/lib/consentement-publicitaire";
import { estJetonValide } from "@/lib/jeton";

export async function mesurerAchatConfirme(id: string, membre = false) {
  if (!configurationMeta(process.env).valide || typeof id !== "string" || id.length > 100) return;
  const jeton = (await cookies()).get(COOKIE_PUBLICITE)?.value;
  try {
    if (!(await lireChoixPublicitaire(jeton))?.accord) return;
    const fin = Date.now() + 25000;
    if (membre) {
      if (!estJetonValide(id)) return;
      const acces = await accesParJeton(id);
      if (!acces || acces.revoque) return;
      const commandes = await commandesPayeesParEmail(acces.email);
      for (const order of commandes.slice(-3).reverse()) {
        if (Date.now() >= fin) break;
        await mesurerCommandeMeta(order, jeton, fin);
      }
    } else {
      const order = await getOrder(id);
      if (order) await mesurerCommandeMeta(order, jeton, fin);
    }
  } catch {
    console.error("[meta] mesure non confirmée ; vérifier le journal technique");
  }
}
