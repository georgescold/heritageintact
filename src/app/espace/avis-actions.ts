"use server";

import { revalidatePath } from "next/cache";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { contexteAvis, lireSaisie, questionnaireAvis } from "@/lib/avis-questions";
import { enregistrerAvis, lireAvis } from "@/lib/avis-store";
import { envoyerAvisInterne } from "@/lib/email";

export type EtatAvis = { ok: boolean; message: string } | undefined;

/**
 * LE DÉPÔT D'UN AVIS DEPUIS L'ESPACE.
 *
 * ⚠️ UNE SERVER ACTION EST UNE URL : le jeton est revalidé ici, et le
 * questionnaire est recalculé à partir de l'état réel du membre — jamais à
 * partir de ce que le formulaire prétend lui avoir montré.
 */
export async function envoyerAvis(jeton: string, _prev: EtatAvis, formData: FormData): Promise<EtatAvis> {
  if (!estJetonValide(jeton)) return { ok: false, message: "Ce lien d’espace n’est pas valide." };
  const etat = await chargerEspace(jeton);
  if (!etat || etat.acces.revoque)
    return { ok: false, message: "Votre espace n’est plus accessible. Écrivez-nous si vous souhaitez nous laisser un avis." };

  const sections = questionnaireAvis(contexteAvis(etat));
  const lu = lireSaisie(sections, formData);
  if (!lu.ok) return { ok: false, message: lu.erreur };

  try {
    const precedent = await lireAvis(etat.acces.email);
    const avis = await enregistrerAvis(etat.acces.email, etat.acces.firstName, [...etat.possede], lu.avis);
    // La notification ne doit jamais faire échouer le dépôt : envoyer() ne lève pas.
    await envoyerAvisInterne({
      prenom: avis.prenom,
      email: avis.email,
      note: avis.note,
      lignes: sections.flatMap((s) => s.questions.flatMap((q) => (avis.reponses[q.cle] ? [[q.libelle, avis.reponses[q.cle]] as [string, string]] : []))),
      message: avis.message,
      publication: avis.publication,
      modification: Boolean(precedent),
    });
  } catch (e) {
    console.error("[avis] enregistrement impossible", e);
    return { ok: false, message: "Votre avis n’a pas pu être enregistré. Réessayez dans un instant." };
  }

  revalidatePath(`/espace/${jeton}`);
  return { ok: true, message: "Merci ! Votre avis est bien enregistré. Vous pouvez le modifier à tout moment." };
}
