import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_PUBLICITE,
  DUREE_CHOIX,
  enregistrerChoixPublicitaire,
  lireChoixPublicitaire,
} from "@/lib/consentement-publicitaire";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
export async function GET(req: NextRequest) {
  try {
    const choix = await lireChoixPublicitaire(req.cookies.get(COOKIE_PUBLICITE)?.value);
    return NextResponse.json(
      { choix: choix ? (choix.accord ? "oui" : "non") : "inconnu" },
      { headers },
    );
  } catch {
    return NextResponse.json({ erreur: "Préférence indisponible" }, { status: 503, headers });
  }
}
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return new NextResponse(null, { status: 403, headers });
  const taille = Number(req.headers.get("content-length") ?? 0);
  if (taille > 100) return new NextResponse(null, { status: 413, headers });
  const raw = await req.text();
  if (raw.length > 100) return new NextResponse(null, { status: 413, headers });
  let accord: unknown;
  try {
    accord = JSON.parse(raw).accord;
  } catch {
    return new NextResponse(null, { status: 400, headers });
  }
  if (typeof accord !== "boolean") return new NextResponse(null, { status: 400, headers });
  try {
    const jeton = await enregistrerChoixPublicitaire(
      accord,
      req.cookies.get(COOKIE_PUBLICITE)?.value,
    );
    const reponse = NextResponse.json({ choix: accord ? "oui" : "non" }, { headers });
    reponse.cookies.set(COOKIE_PUBLICITE, jeton, {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: DUREE_CHOIX,
    });
    return reponse;
  } catch {
    // Un retrait doit aussi couper le cookie local si la base est indisponible.
    const reponse = NextResponse.json(
      { erreur: "Choix non enregistré. Aucun nouvel accord n’est retenu." },
      { status: 503, headers },
    );
    reponse.cookies.set(COOKIE_PUBLICITE, "", {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return reponse;
  }
}
