import type { ReactNode } from "react";
import { sortir } from "@/app/admin/actions";
import type { Periode } from "@/lib/admin/agregats";
import { Avertissements, FiltrePeriode, NavAdmin } from "./Ui";

/** L'ossature commune : titre, navigation, filtre de période, sortie. */
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.5rem]">{titre}</h1>
        <form action={sortir}>
          <button className="flex min-h-[36px] items-center border border-grey-line bg-white px-3 text-[0.9rem]">
            Fermer la session
          </button>
        </form>
      </div>
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
