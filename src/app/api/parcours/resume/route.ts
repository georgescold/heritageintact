import { timingSafeEqual } from "node:crypto";
import { construireResume, envoyerResumeQuotidien } from "@/lib/parcours";
import { posterResume } from "@/lib/discord";
import { relancerPaiementsEchoues } from "@/lib/relance-paiement";

export const dynamic = "force-dynamic";

/**
 * LE RÉSUMÉ DU PARCOURS SUR DISCORD.
 *
 *   GET ?quotidien=1                     → l'envoi du soir, appelé par les crons de vercel.json
 *                                          (ne part qu'à partir de 21 h à Paris, une fois par jour)
 *   GET ?jour=2026-09-14                 → le texte d'un jour, rien n'est envoyé
 *   GET ?jour=2026-09-14&envoyer=1       → ce texte posté sur Discord
 *
 * Protégé par CRON_SECRET, en en-tête `Authorization: Bearer …` (Vercel l'envoie
 * de lui-même à ses crons).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const fourni = req.headers.get("authorization") ?? "";
  const attendu = "Bearer " + secret;
  if (
    !secret ||
    Buffer.byteLength(fourni) !== Buffer.byteLength(attendu) ||
    !timingSafeEqual(Buffer.from(fourni), Buffer.from(attendu))
  )
    return Response.json({ erreur: "non autorisé" }, { status: 401 });

  const params = new URL(req.url).searchParams;
  if (params.get("quotidien") === "1") {
    try {
      // Le passage du soir relance aussi les paiements non aboutis de la journée.
      await relancerPaiementsEchoues();
      const statut = await envoyerResumeQuotidien();
      console.log("[parcours] résumé du soir :", statut);
      return Response.json({ statut }, { status: statut === "echec" ? 503 : 200 });
    } catch {
      console.error("[parcours] résumé du soir non envoyé");
      return Response.json({ erreur: "résumé indisponible" }, { status: 503 });
    }
  }
  const jour = params.get("jour") ?? undefined;
  if (jour && !/^\d{4}-\d{2}-\d{2}$/.test(jour)) return Response.json({ erreur: "jour invalide" }, { status: 400 });
  try {
    const resume = await construireResume(jour);
    const envoye = params.get("envoyer") === "1" ? await posterResume(resume.texte) : false;
    return Response.json({ ...resume, envoye }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ erreur: "résumé indisponible" }, { status: 503 });
  }
}
