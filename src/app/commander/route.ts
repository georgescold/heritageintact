import { NextRequest, NextResponse } from "next/server";
import { commencerPromotion } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Le délai commercial ne commence qu'au clic vers la commande, jamais sur la page de vente. */
export async function GET(request: NextRequest) {
  const destination = new URL("/commande", request.url);
  let email = "";
  try {
    const lead = JSON.parse(request.cookies.get("hi_lead")?.value ?? "{}") as { email?: string };
    email = lead.email?.trim().toLowerCase() ?? "";
  } catch {}

  const response = NextResponse.redirect(destination);
  if (!EMAIL_RE.test(email)) return response;

  const promotion = await commencerPromotion(email, "front");
  response.cookies.set("hi_offre", promotion.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });
  return response;
}
