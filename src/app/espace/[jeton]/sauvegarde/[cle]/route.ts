import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { documentParCle } from "@/lib/methode";
import { readDelivery, writeDelivery } from "@/lib/delivery-store";
import { validerDonneesSimulation } from "@/lib/simulateur/donnees";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
type Context = { params: Promise<{ jeton: string; cle: string }> };
async function owner(context: Context) {
  const { jeton, cle } = await context.params;
  if (!estJetonValide(jeton)) return null;
  const etat = await chargerEspace(jeton);
  if (!etat || etat.acces.revoque) return null;
  const doc = documentParCle(cle);
  const allowed = cle === "simulation"
    ? etat.possede.has("front") || etat.possede.has("upsell1") || etat.possede.has("backend1")
    : doc && etat.possede.has(doc.sku);
  return allowed ? { email: etat.acces.email, cle } : null;
}
export async function GET(_request: Request, context: Context) {
  const access = await owner(context);
  if (!access) return Response.json({ error: "Accès indisponible." }, { status: 403, headers });
  try { return Response.json(await readDelivery(access.email, access.cle), { headers }); }
  catch { return Response.json({ error: "La sauvegarde est momentanément indisponible. Réessayez." }, { status: 503, headers }); }
}
export async function PUT(request: Request, context: Context) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  // Next peut reconstruire request.url avec localhost derrière le proxy.
  // Host reste la destination de la requête du navigateur, pas l'origine d'un site tiers.
  const expectedOrigin = `${request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0,-1)}://${request.headers.get("host") ?? url.host}`;
  if (origin && origin !== expectedOrigin) return Response.json({ error: "Origine invalide." }, { status: 403, headers });
  const access = await owner(context);
  if (!access) return Response.json({ error: "Accès indisponible." }, { status: 403, headers });
  if (Number(request.headers.get("content-length")) > 100_000) return Response.json({ error: "Document trop volumineux." }, { status: 413, headers });
  try {
    const text = await request.text();
    if (text.length > 100_000) return Response.json({ error: "Document trop volumineux." }, { status: 413, headers });
    const { value, version } = JSON.parse(text);
    let validated = value;
    if (!Number.isInteger(version) || version < 0 || !value || typeof value !== "object") throw new Error("invalid");
    if (access.cle === "simulation") {
      const donnees = validerDonneesSimulation(value.donnees);
      if (!donnees || !Number.isInteger(value.index) || value.index < 0 || value.index > 100 || typeof value.termine !== "boolean") throw new Error("invalid");
      const previous = await readDelivery(access.email, access.cle);
      const prior = previous?.value as { donnees?: unknown; termine?: boolean; dernierPlan?: unknown } | undefined;
      // Une modification ne doit pas supprimer le dernier plan terminé du dossier.
      const dernierPlan = value.termine ? donnees : prior?.termine ? prior.donnees : prior?.dernierPlan;
      validated = { donnees: { ...donnees, handicap: 0 }, index: value.index, termine: value.termine, ...(dernierPlan ? { dernierPlan } : {}) };
    } else if (Array.isArray(value) || Object.keys(value).length > 500 || Object.values(value).some(v => typeof v !== "string" || v.length > 5000)) throw new Error("invalid");
    const record = await writeDelivery(access.email, access.cle, validated, version);
    return record ? Response.json(record, { headers }) : Response.json({ error: "Ce document a changé sur un autre écran. Rechargez la page pour reprendre la dernière version." }, { status: 409, headers });
  } catch { return Response.json({ error: "La sauvegarde n’a pas abouti. Gardez cette page ouverte et réessayez." }, { status: 400, headers }); }
}
