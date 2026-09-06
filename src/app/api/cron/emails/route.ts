import { NextResponse } from "next/server";
import { leadsActifs, marquerEnvoye } from "@/lib/db";
import { envoyerEtape, etapeDue } from "@/lib/email";

/**
 * Le passage quotidien de la séquence email.
 *
 * Déclenché par le cron Vercel (voir `vercel.json`), une fois par jour à 7 h
 * UTC, soit 8 ou 9 h à Paris selon la saison — l'heure où notre lecteur ouvre
 * sa boîte.
 *
 * Trois garde-fous :
 *   1. Une seule étape par inscrit et par passage. Deux emails le même jour sur
 *      un domaine jeune, c'est le meilleur moyen de finir en indésirable.
 *   2. Un plafond par passage, pour qu'une arrivée massive de leads ne se
 *      transforme jamais en pic d'envoi (cf. montée en charge du domaine).
 *   3. L'étape n'est marquée envoyée QUE si Resend a accepté. En cas de panne,
 *      elle repart au passage suivant au lieu d'être perdue.
 */
const PLAFOND_PAR_PASSAGE = 150;

export async function GET(req: Request) {
  // Vercel signe ses appels de cron avec ce secret. Sans lui, la route est
  // ouverte à n'importe qui, et n'importe qui peut vider la séquence.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  const leads = await leadsActifs();
  const maintenant = Date.now();
  let envoyes = 0;
  let echecs = 0;

  for (const lead of leads) {
    if (envoyes >= PLAFOND_PAR_PASSAGE) break;
    const etape = etapeDue(lead, maintenant);
    if (!etape) continue;

    const r = await envoyerEtape(lead, etape);
    if (r.ok) {
      await marquerEnvoye(lead.id, etape.cle);
      envoyes++;
    } else {
      echecs++;
    }
  }

  const bilan = { inscrits: leads.length, envoyes, echecs, plafond: PLAFOND_PAR_PASSAGE };
  console.log("[cron] séquence email", bilan);
  return NextResponse.json(bilan);
}
