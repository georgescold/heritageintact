import { NextResponse } from "next/server";
import { desabonner } from "@/lib/db";

/**
 * Désinscription en un clic, appelée directement par Gmail et Yahoo.
 *
 * L'en-tête `List-Unsubscribe-Post` demande aux messageries d'envoyer un POST
 * ici quand l'abonné clique sur LEUR bouton « Se désabonner » — celui qui
 * s'affiche à côté du nom de l'expéditeur. C'est ce bouton-là qui évite le
 * bouton « Spam » juste à côté, et une plainte spam coûte infiniment plus cher
 * qu'une désinscription.
 */
export async function POST(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "identifiant manquant" }, { status: 400 });
  await desabonner(id);
  // On répond 200 même si l'inscrit est introuvable : la messagerie n'a pas à
  // savoir quels identifiants existent, et un 404 la ferait réessayer.
  return NextResponse.json({ ok: true });
}
