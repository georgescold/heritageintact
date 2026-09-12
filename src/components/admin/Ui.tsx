import Link from "next/link";
import type { ReactNode } from "react";
import { PERIODES, type Periode } from "@/lib/admin/agregats";

/**
 * Les briques d'affichage du panel. Volontairement pauvres : pas de librairie
 * de graphiques, pas de canevas, pas de dépendance. Des barres en CSS suffisent
 * à comparer des ordres de grandeur, qui est la seule chose qu'on demande à ce
 * panel — la précision, elle, se lit dans les tableaux juste en dessous.
 */

export const ONGLETS = [
  { href: "/admin", t: "Vue d’ensemble" },
  { href: "/admin/acquisition", t: "Acquisition" },
  { href: "/admin/ventes", t: "Ventes" },
  { href: "/admin/publicite", t: "Publicité" },
  { href: "/admin/membres", t: "Membres" },
  { href: "/admin/emails", t: "Emails" },
  { href: "/admin/client", t: "Fiche client" },
] as const;

export function NavAdmin({ actif, periode }: { actif: string; periode: Periode }) {
  return (
    <nav aria-label="Sections" className="flex flex-wrap gap-1 border-b border-grey-line pb-2">
      {ONGLETS.map((o) => (
        <Link
          key={o.href}
          href={`${o.href}?p=${periode}`}
          aria-current={o.href === actif ? "page" : undefined}
          className={`flex min-h-[40px] items-center px-3 text-[0.95rem] no-underline ${
            o.href === actif ? "bg-blue font-bold text-white" : "bg-grey-bg"
          }`}
        >
          {o.t}
        </Link>
      ))}
    </nav>
  );
}

export function FiltrePeriode({ actif, base }: { actif: Periode; base: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[0.85rem] text-text-soft">Période :</span>
      {(Object.keys(PERIODES) as Periode[]).map((p) => (
        <Link
          key={p}
          href={`${base}?p=${p}`}
          aria-current={p === actif ? "true" : undefined}
          className={`flex min-h-[36px] items-center border px-3 text-[0.9rem] no-underline ${
            p === actif ? "border-blue bg-blue font-bold text-white" : "border-grey-line bg-white"
          }`}
        >
          {p === "tout" ? "Tout" : p}
        </Link>
      ))}
    </div>
  );
}

export function Carte({
  titre,
  valeur,
  precision,
  accent,
}: {
  titre: string;
  valeur: string;
  precision?: string;
  accent?: "vert" | "orange" | "rouge";
}) {
  const couleur =
    accent === "vert" ? "text-green" : accent === "orange" ? "text-orange" : accent === "rouge" ? "text-red" : "text-blue";
  return (
    <div className="border border-grey-line bg-white p-4">
      <p className="text-[0.8rem] uppercase tracking-wide text-text-soft">{titre}</p>
      <p className={`mt-1 text-[1.6rem] font-bold leading-tight ${couleur}`}>{valeur}</p>
      {precision && <p className="mt-1 text-[0.82rem] leading-snug text-text-soft">{precision}</p>}
    </div>
  );
}

export function Grille({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function Section({ titre, aide, children }: { titre: string; aide?: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-[1.2rem]">{titre}</h2>
      {aide && <p className="mb-3 mt-1 max-w-[80ch] text-[0.88rem] text-text-soft">{aide}</p>}
      <div className={aide ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

/** Tableau générique. `colonnes` donne l'entête, `lignes` les cellules déjà formatées. */
export function Tableau({
  colonnes,
  lignes,
  vide = "Aucune donnée sur cette période.",
}: {
  colonnes: string[];
  lignes: ReactNode[][];
  vide?: string;
}) {
  if (!lignes.length) return <p className="border border-grey-line bg-grey-bg p-4 text-[0.95rem]">{vide}</p>;
  return (
    <div className="overflow-x-auto border border-grey-line">
      <table className="w-full border-collapse text-[0.92rem]">
        <thead>
          <tr className="bg-grey-bg text-left">
            {colonnes.map((c) => (
              <th key={c} className="whitespace-nowrap px-3 py-2 font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i} className="border-t border-grey-line">
              {l.map((cellule, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  {cellule}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Barres horizontales proportionnelles au maximum de la série. */
export function Barres({ points }: { points: { label: string; valeur: number; note?: string }[] }) {
  const max = Math.max(1, ...points.map((p) => p.valeur));
  if (!points.length) return <p className="border border-grey-line bg-grey-bg p-4 text-[0.95rem]">Aucune donnée.</p>;
  return (
    <div className="space-y-1.5">
      {points.map((p) => (
        <div key={p.label} className="flex items-center gap-3">
          <span className="w-[36%] shrink-0 truncate text-[0.88rem]" title={p.label}>
            {p.label}
          </span>
          <span className="flex h-5 flex-1 items-center bg-grey-bg">
            <span
              className="h-5 bg-blue"
              style={{ width: `${Math.round((p.valeur / max) * 100)}%` }}
              aria-hidden
            />
          </span>
          <span className="w-[22%] shrink-0 text-right text-[0.85rem] tabular-nums">
            {p.note ?? p.valeur}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * L'avertissement qui rend le panel honnête.
 *
 * Deux cas, et ils ne se confondent pas : une base injoignable n'est pas un
 * commerce sans vente, et une lecture plafonnée n'est pas un total.
 */
export function Avertissements({ tronque, indisponible }: { tronque: boolean; indisponible: boolean }) {
  if (!tronque && !indisponible) return null;
  return (
    <div className="my-4 border-2 border-red bg-red-bg p-4">
      {indisponible && (
        <p className="font-bold text-red">
          Base de données injoignable. Les écrans sont vides : ne pas lire ces zéros comme une
          absence de vente.
        </p>
      )}
      {tronque && (
        <p className="font-bold text-red">
          Volume au-delà du plafond de lecture : les totaux affichés seraient partiels. Passer à une
          agrégation SQL dédiée avant de s’en servir pour décider.
        </p>
      )}
    </div>
  );
}

export const eur = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
export const pourcent = (n: number) => (n * 100).toFixed(1).replace(".", ",") + " %";
export const jourCourt = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
export const dateHeure = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
