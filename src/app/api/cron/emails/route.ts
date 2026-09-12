import { NextResponse } from "next/server";
import { DATE_ESPACE_EN_LIGNE } from "@/lib/config";
import {
  accesEnSequence,
  accesParEmail,
  leadsClientsRecents,
  profilParEmail,
  commandesSansAcces,
  leadsActifs,
  marquerEnvoye,
  progressionDe,
  reserverEnvoi,
} from "@/lib/db";
import { envoyerEtape, envoyerEtapeClient, etapeDue } from "@/lib/email";
import { envoyerComplement } from "@/lib/email";
import { possessions } from "@/lib/espace";
import { devisPour } from "@/lib/devis";
import { etapeLtvDue, offreLtv } from "@/lib/sequence-ltv";
import { verrouCron, libererCron } from "@/lib/mail-journal";
import { livrer } from "@/lib/livraison";
import { SEQUENCE_CLIENT, etapeClientDue } from "@/lib/sequence-client";
import { capaciteEmail, reserveComplements } from "@/lib/capacite-email";
import { purgerJournalMeta } from "@/lib/meta-conversions";

/**
 * Le passage quotidien des emails.
 *
 * Déclenché par le cron Vercel (voir `vercel.json`), une fois par jour à 7 h
 * UTC, soit 8 ou 9 h à Paris selon la saison — l'heure où notre lecteur ouvre
 * sa boîte. ⚠️ UN SEUL cron pour les trois passes : il n'y a pas d'entrée à
 * ajouter à `vercel.json`, et il ne faut pas en ajouter.
 *
 * TROIS PASSES, DANS CET ORDRE, ET L'ORDRE EST UNE DÉCISION :
 *
 *   1. LE RATTRAPAGE DE LIVRAISON — les commandes payées restées sans email
 *      d'accès. Quelqu'un qui a payé et qui n'a rien reçu passe avant tout le
 *      reste : c'est un remboursement en préparation, et sur cette cible c'est
 *      aussi un appel au support.
 *   2. LA SÉQUENCE DE RASSURANCE — les acheteurs qui ont leur lien mais qui
 *      n'ont rien ouvert. Ils ont payé eux aussi.
 *   3. LA SÉQUENCE PROSPECT — ceux qui n'ont encore rien payé.
 *
 * ⚠️ LES TROIS PARTAGENT LE MÊME BUDGET D'ENVOIS. Un afflux d'acheteurs peut
 * donc retarder la séquence prospect d'un jour. C'EST LE BON ARBITRAGE — un
 * client qui attend son produit passe avant un prospect — et c'est écrit ici
 * pour que personne ne remonte le plafond au lieu de comprendre. Le plafond
 * protège la montée en charge d'un domaine d'envoi encore jeune : le lever
 * abîme la réputation de tout le monde, prospects compris.
 *
 * Trois garde-fous, inchangés :
 *   1. Une seule étape par destinataire et par passage. Deux emails le même
 *      jour sur un domaine jeune, c'est le meilleur moyen de finir en
 *      indésirable.
 *   2. Un plafond par passage.
 *   3. On ne marque JAMAIS avant d'avoir un « ok » de Resend. Seule exception :
 *      la réservation atomique de l'email d'accès, qui est posée avant l'envoi
 *      parce qu'elle départage deux appelants concurrents — et qui est libérée
 *      si l'envoi échoue (voir `livraison.ts`).
 */
export const maxDuration = 300;
const PLAFOND_PAR_PASSAGE = capaciteEmail(process.env);

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;

  /**
   * ⚠️ EN PRODUCTION, LE SECRET EST OBLIGATOIRE.
   *
   * Le garde était conditionnel (`if (secret && …)`) : sans la variable, la
   * route était PUBLIQUE et n'importe qui pouvait vider la séquence de tous
   * les inscrits en la rejouant. Depuis que cette route touche aussi aux accès
   * membres et déclenche des livraisons, on refuse de servir plutôt que de
   * servir ouvert.
   *
   * 503 et non 401 : ce n'est pas un appelant mal authentifié, c'est le
   * déploiement qui est incomplet. `CRON_SECRET` doit figurer dans
   * `.env.example`, sans quoi un environnement reconstruit depuis l'exemple
   * repart sans secret.
   */
  if (!secret) {
    console.error("[cron] CRON_SECRET absent en production : route non servie");
    return NextResponse.json(
      { error: "CRON_SECRET absent : la route de cron n'est pas servie sans secret." },
      { status: 503 },
    );
  }
  // Vercel signe ses appels de cron avec ce secret.
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  // Pas d’envoi ni de faux succès dans un environnement incomplet.
  if (!process.env.RESEND_API_KEY || !(process.env.POSTGRES_URL || process.env.DATABASE_URL))
    return NextResponse.json({ error: "services email non configurés" }, { status: 503 });
  let lease: string | null = null;
  try {
    lease = await verrouCron();
    if (!lease) return NextResponse.json({ occupe: true }, { status: 409 });
    // La rétention continue même lorsque les transmissions publicitaires sont suspendues.
    try {
      await purgerJournalMeta();
    } catch {
      console.error("[meta] purge technique non confirmée");
    }
    const maintenant = Date.now();
    let budget = PLAFOND_PAR_PASSAGE;
    let livres = 0;
    let rassurances = 0;
    let envoyes = 0;
    let echecs = 0;

    /* ─── PASSE 1 — RATTRAPAGE DE LIVRAISON ───────────────────────────
     ⚠️ `DATE_ESPACE_EN_LIGNE` EST CE QUI EMPÊCHE LE PREMIER PASSAGE DE
     RÉVEILLER TOUT L'HISTORIQUE. Sans cette borne, toutes les commandes
     payées existantes — commandes de test comprises — recevraient l'email
     d'accès d'un coup. La constante doit être postérieure à la dernière
     commande de test présente en base. */
    const commandes = await commandesSansAcces(DATE_ESPACE_EN_LIGNE, budget);
    // Deux commandes d'un même acheteur ne valent qu'un seul email d'accès : la
    // seconde perdrait la réservation atomique, et compter le budget dessus
    // priverait un vrai destinataire de son envoi.
    const servis = new Set<string>();
    for (const commande of commandes) {
      if (budget <= 0 || Date.now() - maintenant > 240000) break;
      if (servis.has(commande.email)) continue;
      servis.add(commande.email);

      const acces = await livrer(commande);
      if (acces) livres++;
      else echecs++;
      budget--;
    }

    /* ─── PASSE 2 — SÉQUENCE DE RASSURANCE ────────────────────────────
     ⚠️ LA FENÊTRE D'EXAMEN NE SE TRIE PLUS SUR L'ANCIENNETÉ SEULE.
     `accesActifs(budget)` prenait les 150 accès les PLUS ANCIENS : ceux-là
     n'ont plus d'étape due, ils ne consommaient donc pas le budget d'envoi
     mais ils occupaient toutes les places de la fenêtre, tous les jours. À
     partir du 151ᵉ membre, plus personne ne recevait c1, c2 ni c3 — et le
     bilan affichait `rassurances: 0`, ce qui ressemble à une journée normale.
     `accesEnSequence` écarte en base les accès hors fenêtre et ceux qui ont
     déjà tout reçu. */
    const membres =
      budget > 0
        ? await accesEnSequence(
            SEQUENCE_CLIENT.map((e) => e.cle),
            budget,
          )
        : [];
    for (const acces of membres) {
      if (budget <= 0 || Date.now() - maintenant > 240000) break;
      if (!(await possessions(acces.email)).has("front")) continue;

      const progression = await progressionDe(acces.email);
      const etat = {
        // C'est l'OUVERTURE de l'étape 0 qui compte, pas son achèvement : c2
        // s'adresse à celui qui n'a jamais rien affiché.
        etape0Ouverte: progression.some((p) => p.etape === "e0"),
        nbFaites: progression.filter((p) => p.faiteLe).length,
      };

      const etape = etapeClientDue(acces, etat, maintenant);
      if (!etape || servis.has(acces.email)) continue;
      servis.add(acces.email);
      budget--;

      const r = await envoyerEtapeClient(acces, etape);
      if (r.ok) {
        // ⚠️ Ici la trace vient APRÈS l'envoi, contrairement à l'email d'accès.
        // Il n'y a pas deux appelants concurrents sur cette séquence, et on
        // préfère un doublon improbable à une étape perdue en silence.
        await reserverEnvoi(acces.email, etape.cle);
        rassurances++;
      } else {
        echecs++;
      }
    }

    /* ─── PASSE 3 — SÉQUENCE PROSPECT ─────────────────────────────────
     Inchangée. `leadsActifs()` exclut désormais les acheteurs : quelqu'un
     qui a acheté à J2 ne doit plus recevoir « l'offre à 27 € » à J6. */
    // Les interrupteurs EMAIL_MARKETING_ACTIVE / EMAIL_LTV_ACTIVE sont retirés
    // (demande de Loys, 12/09/2026) : le cron rattrape désormais toujours les
    // étapes dues. Le démarrage, lui, ne l'attend plus — la première étape part
    // à l'inscription et à l'achat. Ce passage ne sert donc qu'au rattrapage.
    const leads = await leadsActifs();
    const ltvActive = true;
    const reserveLtv = reserveComplements(budget, ltvActive);
    async function prospecter(reserve: number) {
      for (const lead of leads) {
        if (budget <= reserve || Date.now() - maintenant > 240000) break;
        const etape = etapeDue(lead, maintenant);
        if (!etape || servis.has(lead.email)) continue;
        servis.add(lead.email);
        budget--;
        const r = await envoyerEtape(lead, etape);
        if (r.ok) {
          await marquerEnvoye(lead.id, etape.cle);
          envoyes++;
        } else {
          echecs++;
        }
      }
    }
    // Livraison et accompagnement restent prioritaires. Les prospects ne consomment
    // pas tout le reliquat avant que les compléments éligibles aient été examinés.
    await prospecter(reserveLtv);

    // Compléments : un besoin déclaré, une première étape terminée, deux messages maximum.
    let complements = 0;
    if (budget > 0) {
      for (const lead of await leadsClientsRecents()) {
        if (budget <= 0 || Date.now() - maintenant > 240000) break;
        if (servis.has(lead.email)) continue;
        const acces = await accesParEmail(lead.email);
        if (!acces) continue;
        const progression = await progressionDe(lead.email);
        const cle = etapeLtvDue(lead, acces, progression, maintenant);
        if (!cle) continue;
        const sku = offreLtv(await profilParEmail(lead.email), await possessions(lead.email));
        if (!sku) continue;
        const devis = await devisPour(lead.email, sku);
        if (devis.dejaPossede || devis.montant <= 0) continue;
        // Le rappel ne suit pas un premier envoi rattrapé la veille.
        if (cle.endsWith("-2")) {
          const premier = acces.envoyes.find((k) => k.startsWith("ltv-v3-date:"));
          if (
            !premier ||
            maintenant - Date.parse(premier.slice("ltv-v3-date:".length)) < 7 * 86400000
          )
            continue;
        }
        servis.add(lead.email);
        budget--;
        const r = await envoyerComplement(lead, acces, sku, cle, devis.credit, devis.montant);
        if (r.ok) {
          await reserverEnvoi(lead.email, cle);
          if (cle.endsWith("-1"))
            await reserverEnvoi(lead.email, "ltv-v3-date:" + new Date(maintenant).toISOString());
          complements++;
        } else echecs++;
      }
    }
    // Une réserve inutilisée revient aux prospects, sans deuxième tentative le même jour.
    if (budget > 0) await prospecter(0);
    const bilan = {
      complements,
      livres,
      rassurances,
      inscrits: leads.length,
      envoyes,
      echecs,
      plafond: PLAFOND_PAR_PASSAGE,
      restant: budget,
      plafondAtteint: budget === 0,
      dureeLimiteAtteinte: Date.now() - maintenant > 240000,
      aVerifier:
        budget === 0
          ? "Examiner le retard des séquences et la réputation d’envoi avant tout relèvement du plafond."
          : null,
    };
    console.log("[cron] emails", bilan);
    return NextResponse.json(bilan);
  } catch {
    console.error("[cron] exécution non confirmée");
    return NextResponse.json({ error: "exécution non confirmée" }, { status: 503 });
  } finally {
    if (lease) {
      try {
        await libererCron(lease);
      } catch {
        console.error("[cron] bail non libéré");
      }
    }
  }
}
