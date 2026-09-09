import { timingSafeEqual } from "node:crypto";
import { commandesPourPilotage } from "@/lib/db";
import { syntheseCohortes } from "@/lib/pilotage";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const secret = process.env.PILOTAGE_SECRET;
  const fourni = req.headers.get("authorization") ?? "";
  const attendu = "Bearer " + secret;
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
  if (
    !secret ||
    secret.length < 32 ||
    Buffer.byteLength(fourni) !== Buffer.byteLength(attendu) ||
    !timingSafeEqual(Buffer.from(fourni), Buffer.from(attendu))
  )
    return Response.json({ erreur: "Non autorisé" }, { status: 401, headers });
  try {
    const { commandes, tronque } = await commandesPourPilotage();
    if (tronque)
      return Response.json(
        {
          erreur:
            "Volume dépassé : utiliser une agrégation SQL dédiée. Aucun total partiel n’est présenté.",
        },
        { status: 503, headers },
      );
    return Response.json(
      {
        observeLe: new Date().toISOString(),
        cohortes: [30, 60, 90].map((j) => syntheseCohortes(commandes, j)),
      },
      { headers },
    );
  } catch {
    return Response.json(
      { erreur: "Pilotage indisponible ; ne pas interpréter comme zéro vente." },
      { status: 503, headers },
    );
  }
}
