import type { ReactNode } from "react";
import type { Periode } from "@/lib/admin/agregats";
import { Avertissements, FiltrePeriode, NavAdmin } from "./Ui";

/**
 * L'ossature commune : titre, navigation, filtre de période.
 *
 * ⚠️ Ni bandeau d'avertissement sur la force du mot de passe, ni bouton de
 * déconnexion : retirés le 12/09/2026 à la demande de Loys. Ce qui protège
 * réellement reste en place et n'est pas cosmétique — en production, un
 * ADMIN_PASSWORD de moins de seize caractères fait répondre 404 à la garde, et
 * la session expire d'elle-même au bout de douze heures.
 */
export function Cadre({
  titre,
  chemin,
  periode,
  tronque = false,
  indisponible = false,
  avecPeriode = true,
  children,
}: {
  titre: string;
  chemin: string;
  periode: Periode;
  tronque?: boolean;
  indisponible?: boolean;
  avecPeriode?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-[1200px] p-4 sm:p-6">
      <h1 className="mb-4 text-[1.5rem]">{titre}</h1>
      <NavAdmin actif={chemin} periode={periode} />
      {avecPeriode && (
        <div className="mt-4">
          <FiltrePeriode actif={periode} base={chemin} />
        </div>
      )}
      <Avertissements tronque={tronque} indisponible={indisponible} />
      {children}
    </main>
  );
}
