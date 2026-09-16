import { commandesAbandonnees, orderTotal } from "./db";
import { notifierRelancePaiement } from "./discord";
import { envoyerRelancePaiement } from "./email";
import { enregistrerEtape } from "./parcours";

/**
 * LA RELANCE AUTOMATIQUE DES PAIEMENTS QUI N'ONT PAS ABOUTI.
 *
 * Demandée par Loys le 16/09/2026. Le cas qui l'a déclenchée : une commande de
 * 69 € refusée par la banque à l'authentification, un acheteur décidé, et
 * personne pour le rappeler. Un email part désormais tout seul.
 *
 * ⚠️ QUI EST RELANCÉ. Une commande « pending » en paiement réel, créée il y a
 * plus de 2 h (le temps de laisser l'acheteur réessayer seul) et moins de 3
 * jours (au-delà, un email sur un paiement oublié est une relance commerciale
 * déguisée). Jamais quelqu'un qui a fini par payer, ni quelqu'un qui a déjà un
 * accès : `commandesAbandonnees` écarte les deux en base.
 *
 * ⚠️ UNE SEULE FOIS PAR COMMANDE, garanti par la clé d'envoi
 * (`relance-paiement-v1/<commande>`) : les trois passages quotidiens du cron ne
 * peuvent pas en faire trois emails.
 *
 * ⚠️ NE LÈVE JAMAIS : un incident ici ne doit pas empêcher le reste du cron
 * (livraisons, séquences) de passer.
 */
const DELAI_MINIMUM_H = 2;
const DELAI_MAXIMUM_H = 72;
const PLAFOND = 20;

export async function relancerPaiementsEchoues(): Promise<{ relances: number; echecs: number }> {
  let relances = 0;
  let echecs = 0;
  try {
    const maintenant = Date.now();
    const commandes = await commandesAbandonnees(
      new Date(maintenant - DELAI_MAXIMUM_H * 3_600_000).toISOString(),
      new Date(maintenant - DELAI_MINIMUM_H * 3_600_000).toISOString(),
      PLAFOND,
    );
    for (const commande of commandes) {
      const r = await envoyerRelancePaiement(commande);
      if (!r.ok) {
        echecs++;
        continue;
      }
      // Sans identifiant fournisseur, l'envoi n'a pas eu lieu : le journal
      // (`reserverEmail`) a reconnu une relance déjà partie. On ne notifie ni ne
      // compte une seconde fois — c'est ce qui rend le passage répétable.
      if (!r.id) continue;
      relances++;
      await enregistrerEtape({
        etape: "relance_paiement",
        email: commande.email,
        visiteur: null,
        detail: { commande: commande.id, montant: orderTotal(commande) },
      });
      await notifierRelancePaiement({
        prenom: commande.firstName,
        email: commande.email,
        montant: orderTotal(commande),
      });
    }
  } catch {
    console.error("[relance] passage non confirmé");
  }
  if (relances || echecs) console.log("[relance] paiements non aboutis", { relances, echecs });
  return { relances, echecs };
}
