import {
  accesPourAdmin,
  commandesPourAdmin,
  leadsPourAdmin,
  profilsPourAdmin,
  progressionPourAdmin,
  type Acces,
  type Lead,
  type Order,
  type Profil,
  type Progression,
} from "../db";
import { dansPeriode, debutPeriode, type Periode } from "./agregats";

/**
 * LE CHARGEMENT UNIQUE DU PANEL.
 *
 * Toutes les pages lisent les mêmes cinq tables. Les charger ici, une fois, en
 * parallèle, évite qu'un écran affiche des inscrits d'une seconde et un chiffre
 * d'affaires d'une autre — deux nombres pris à deux instants ne sont pas
 * comparables, et personne ne s'en aperçoit sur un tableau de bord.
 *
 * ⚠️ LE DRAPEAU `tronque` REMONTE JUSQU'À L'ÉCRAN, et l'écran refuse alors
 * d'afficher des totaux. C'est la règle déjà posée par `/api/pilotage` :
 * « aucun total partiel n'est présenté ». Un chiffre d'affaires amputé de
 * moitié, affiché sans mention, est plus dangereux qu'une page en erreur.
 */
export type DonneesAdmin = {
  /** Tout l'historique, sans borne de date. Nécessaire pour rattacher un achat
   *  à un inscrit plus ancien que la fenêtre affichée. */
  tous: {
    leads: Lead[];
    commandes: Order[];
    acces: Acces[];
    progression: Progression[];
    profils: Profil[];
  };
  /** La fenêtre demandée. C'est ce que les écrans comptent. */
  periode: {
    leads: Lead[];
    commandes: Order[];
    acces: Acces[];
    progression: Progression[];
  };
  tronque: boolean;
  /** Vrai quand la base est le fichier JSON local, donc éphémère en production. */
  indisponible: boolean;
};

export async function chargerAdmin(
  periode: Periode,
  maintenant = Date.now(),
): Promise<DonneesAdmin> {
  const vide: DonneesAdmin = {
    tous: { leads: [], commandes: [], acces: [], progression: [], profils: [] },
    periode: { leads: [], commandes: [], acces: [], progression: [] },
    tronque: false,
    indisponible: true,
  };

  try {
    const [l, c, a, p, pf] = await Promise.all([
      leadsPourAdmin(),
      commandesPourAdmin(),
      accesPourAdmin(),
      progressionPourAdmin(),
      profilsPourAdmin(),
    ]);

    const debut = debutPeriode(periode, maintenant);
    return {
      tous: {
        leads: l.leads,
        commandes: c.commandes,
        acces: a.acces,
        progression: p.progression,
        profils: pf.profils,
      },
      periode: {
        leads: l.leads.filter((x) => dansPeriode(x.createdAt, debut)),
        commandes: c.commandes.filter((x) => dansPeriode(x.createdAt, debut)),
        acces: a.acces.filter((x) => dansPeriode(x.createdAt, debut)),
        progression: p.progression.filter((x) => dansPeriode(x.ouverteLe, debut)),
      },
      tronque: l.tronque || c.tronque || a.tronque || p.tronque || pf.tronque,
      indisponible: false,
    };
  } catch {
    // Une base injoignable ne doit jamais s'afficher comme « zéro vente ».
    return vide;
  }
}
