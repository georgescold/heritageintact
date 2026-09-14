import { timingSafeEqual } from "node:crypto";
import { construireResume } from "@/lib/parcours";
import { posterResume } from "@/lib/discord";

export const dynamic = "force-dynamic";

/**
 * LE RÉSUMÉ À LA DEMANDE — pour le relire ou le renvoyer sans relancer le cron
 * des emails (qui, lui, enverrait aussi les étapes dues de la séquence).
 *
 *   GET /api/parcours/resume?jour=2026-09-14            → le texte, rien n'est envoyé
 *   GET /api/parcours/resume?jour=2026-09-14&envoyer=1  → posté sur Discord
 *
 * Protégé par CRON_SECRET, en en-tête `Authorization: Bearer …`.
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
