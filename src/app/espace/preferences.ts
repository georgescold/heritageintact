"use server";
import { revalidatePath } from "next/cache";
import {
  accesParJeton,
  reserverEnvoi,
  profilParEmail,
  commandesPayeesParEmail,
  enregistrerProfil,
  progressionDe,
} from "@/lib/db";
import { estJetonValide } from "@/lib/jeton";
import { objectifValide } from "@/lib/positionnement";
export async function suspendreComplements(jeton: string) {
  if (!estJetonValide(jeton)) return;
  const acces = await accesParJeton(jeton);
  if (!acces || acces.revoque) return;
  await reserverEnvoi(acces.email, "ltv-pause");
  revalidatePath("/espace/" + jeton);
}

/** Le lien membre autorise seulement son propre profil. Ne modifie pas le consentement marketing. */
export async function actualiserPriorite(
  jeton: string,
  _etat: { message: string },
  form: FormData,
) {
  const refus = {
    message: "Modification impossible. Rechargez votre espace ou contactez le support.",
  };
  if (!estJetonValide(jeton)) return refus;
  const objectif = objectifValide(form.get("objectif"));
  if (!objectif) return { message: "Choisissez votre priorité avant de confirmer." };
  const acces = await accesParJeton(jeton);
  if (!acces || acces.revoque) return refus;
  const progression = await progressionDe(acces.email);
  if (!progression.some((p) => p.etape === "e0" && p.faiteLe)) return refus;
  const profil = await profilParEmail(acces.email);
  const commandes = await commandesPayeesParEmail(acces.email);
  const commande = commandes.find((c) => c.id === profil?.orderId) ?? commandes[0];
  if (!commande) return refus;
  // Une préférence AV ne vaut pas déclaration de détention d'un contrat.
  const avReponse = form.get("av");
  const av =
    objectif === "assurance-vie" && ["O", "N", "?", "X"].includes(String(avReponse))
      ? String(avReponse)
      : profil?.av;
  await enregistrerProfil({
    orderId: commande.id,
    email: acces.email,
    objectif,
    av,
    vie: profil?.vie,
    enfants: profil?.enfants,
    age: profil?.age,
    piste: profil?.piste, // L'exposition initiale reste inchangée.
  });
  const verifie = await profilParEmail(acces.email);
  if (verifie?.objectif !== objectif || verifie?.av !== av) return refus;
  revalidatePath("/espace/" + jeton);
  return {
    message:
      "Votre priorité a été actualisée. Vos achats et vos préférences email restent inchangés.",
  };
}
