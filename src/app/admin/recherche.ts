"use server";

import { commandeReelle, fiche, recettes, type EvenementFiche } from "@/lib/admin/agregats";
import { chargerAdmin } from "@/lib/admin/donnees";
import { adminConfigure, sessionAdminOuverte } from "@/lib/admin/session";

export type ResultatFiche = {
  erreur?: string;
  email?: string;
  trouve?: boolean;
  inscritLe?: string;
  source?: string;
  desabonne?: boolean;
  commandesPayees?: number;
  commandesTotal?: number;
  net?: number;
  rembourse?: number;
  acces?: "actif" | "révoqué" | "aucun";
  vuLe?: string;
  envoyes?: string[];
  profil?: [string, string][];
  evenements?: EvenementFiche[];
};

/**
 * LA RECHERCHE SE FAIT EN POST, ET C'EST LA RAISON D'ÊTRE DE CE FICHIER.
 *
 * Une recherche en GET met l'adresse email du client dans l'URL. Elle part
 * alors dans l'historique du navigateur, dans l'en-tête `Referer` de la moindre
 * ressource externe, dans les journaux du serveur et dans tout outil de mesure
 * qui lit `location.href`. Pour une adresse email de client, aucune de ces
 * destinations n'est acceptable.
 *
 * ⚠️ La garde est refaite ICI. Une action serveur est une route à part entière :
 * elle est appelable directement, sans passer par la page qui l'affiche. La
 * protéger par la garde de la page reviendrait à ne pas la protéger du tout.
 */
export async function chercherClient(
  _etat: ResultatFiche,
  form: FormData,
): Promise<ResultatFiche> {
  if (!adminConfigure() || !(await sessionAdminOuverte())) return { erreur: "Session expirée." };

  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { erreur: "Indiquez une adresse email." };

  const d = await chargerAdmin("tout");
  if (d.indisponible) return { erreur: "Base de données injoignable." };

  const memeAdresse = (v: string) => v.trim().toLowerCase() === email;
  const lead = d.tous.leads.find((l) => memeAdresse(l.email));
  const acces = d.tous.acces.find((a) => memeAdresse(a.email));
  const profil = d.tous.profils.find((p) => memeAdresse(p.email));
  const commandes = d.tous.commandes.filter((c) => memeAdresse(c.email));

  if (!lead && !acces && !commandes.length) return { email, trouve: false };

  const r = recettes(commandes);
  return {
    email,
    trouve: true,
    inscritLe: lead?.createdAt,
    source: lead?.source,
    desabonne: lead?.desabonne === true,
    commandesPayees: commandes.filter(commandeReelle).length,
    commandesTotal: commandes.length,
    net: r.net,
    rembourse: r.rembourse,
    acces: acces ? (acces.revoque ? "révoqué" : "actif") : "aucun",
    vuLe: acces?.vuLe,
    envoyes: [...(acces?.envoyes ?? []), ...(lead?.envoyes ?? [])],
    profil: profil
      ? (["objectif", "vie", "enfants", "age", "av", "blocage"] as const).map((c) => [
          c,
          profil[c] ?? "—",
        ])
      : undefined,
    // `fiche` n'émet jamais le jeton d'accès : voir son commentaire.
    evenements: fiche(email, d.tous),
  };
}
