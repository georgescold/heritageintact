import type { NextRequest } from "next/server";
import { notifierBlocagePaiement } from "@/lib/discord";
import {
  ancienneteVisiteur,
  contexteBlocage,
  enregistrerEtape,
  erreursRecentes,
  leadDuCookie,
} from "@/lib/parcours";
import { COOKIE_VISITEUR, estEtapeClient, normaliserChemin, visiteurValide } from "@/lib/parcours-etapes";
import { lireUtm } from "@/lib/utm";

/**
 * RÉCEPTION DES ÉTAPES DÉCLARÉES PAR LE NAVIGATEUR.
 *
 * Tout est borné : même origine, corps court, étape dans la liste fermée,
 * détail limité à quelques champs courts. Les robots (dont l'aperçu de lien de
 * Facebook, qui ouvre chaque annonce) sont ignorés pour ne pas gonfler les
 * visites.
 */
const ROBOTS = /bot|crawl|spider|slurp|facebookexternalhit|facebookcatalog|preview|headless|lighthouse|pingdom|curl|wget|python|node-fetch/i;

function nettoyerDetail(brut: unknown): Record<string, string | number | boolean> {
  const sortie: Record<string, string | number | boolean> = {};
  if (!brut || typeof brut !== "object") return sortie;
  for (const [k, v] of Object.entries(brut).slice(0, 6)) {
    if (!/^[a-z_]{1,24}$/.test(k)) continue;
    if (typeof v === "string") sortie[k] = v.replace(/\p{Cc}/gu, " ").slice(0, 240);
    else if (typeof v === "number" && Number.isFinite(v)) sortie[k] = v;
    else if (typeof v === "boolean") sortie[k] = v;
  }
  return sortie;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin) return new Response(null, { status: 403 });
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || ROBOTS.test(ua)) return new Response(null, { status: 204 });

  const brut = await req.text();
  if (brut.length > 2000) return new Response(null, { status: 413 });
  let corps: { etape?: unknown; chemin?: unknown; detail?: unknown; utm?: Record<string, unknown> };
  try {
    corps = JSON.parse(brut);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!estEtapeClient(corps.etape)) return new Response(null, { status: 400 });

  const visiteur = visiteurValide(req.cookies.get(COOKIE_VISITEUR)?.value);
  const lead = leadDuCookie(req.cookies.get("hi_lead")?.value);
  const detail = nettoyerDetail(corps.detail);
  if (corps.etape === "page_vue") {
    const utm = lireUtm((c) => corps.utm?.[c]);
    if (utm.utm_source) detail.utm_source = utm.utm_source;
    if (utm.utm_campaign) detail.utm_campaign = utm.utm_campaign;
    if (utm.utm_content) detail.utm_content = utm.utm_content;
  }
  const appareil = /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "ordinateur";

  await enregistrerEtape({
    etape: corps.etape,
    visiteur,
    email: lead?.email ?? null,
    chemin: normaliserChemin(corps.chemin),
    detail,
    appareil,
  });

  // Un blocage au paiement, c'est un achat en train de se perdre : alerte immédiate,
  // une seule par visiteur toutes les 10 minutes.
  //
  // ⚠️ SAUF LE CLIC À VIDE D'UN ROBOT. « phase: carte » est une validation du
  // navigateur : personne n'a encore payé, Stripe a seulement constaté un champ
  // carte vide ou incomplet. Les crawlers publicitaires appuient sur le bouton
  // dans les secondes qui suivent l'affichage — deux alertes identiques le
  // 16/09/2026, dont une 4 secondes après l'arrivée. On n'alerte donc sur cette
  // phase que si le visiteur est là depuis au moins 1 minute. Tout ce qui touche
  // à la banque, à la commande ou à la vérification alerte toujours.
  //
  // ⚠️ NI SUR NOS PROPRES TESTS. Le cookie `hi_test` (posé à la main dans un
  // navigateur de vérification) coupe l'alerte sans rien changer au reste : nos
  // essais de la page de commande ont fait sonner Discord quatre fois le
  // 17/09/2026, et une alerte qu'on apprend à ignorer ne sert plus à rien.
  const test = req.cookies.get("hi_test")?.value === "1";
  const anciennete = corps.etape === "paiement_erreur" ? await ancienneteVisiteur(visiteur) : null;
  const clicSansSaisie = detail.phase === "carte" && (anciennete === null || anciennete < 60_000);
  if (corps.etape === "paiement_erreur" && !test && !clicSansSaisie && (await erreursRecentes(visiteur, lead?.email ?? null)) <= 1) {
    await notifierBlocagePaiement({
      prenom: lead?.prenom,
      email: lead?.email,
      phase: String(detail.phase ?? "?"),
      message: String(detail.message ?? ""),
      appareil,
      montant: typeof detail.montant === "number" ? detail.montant : undefined,
      contexte: await contexteBlocage(visiteur, lead?.email ?? null),
    });
  }
  return new Response(null, { status: 204 });
}
