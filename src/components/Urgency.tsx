"use client";

import { useSyncExternalStore } from "react";

/**
 * L'urgence du projet, rendue visible.
 *
 * Le compte à rebours est honnête, et c'est ce qui fait sa force : le dispositif
 * de l'article 790 A bis du CGI s'arrête le 31 décembre 2026, la date est votée,
 * elle est vérifiable sur legifrance.gouv.fr, et elle ne se réinitialise jamais
 * au rechargement de la page. Aucun faux compteur (cf. 12-chiffres-succession.md § 5).
 *
 * ⚠️ À revoir après le 30 septembre 2026 : un rapport d'évaluation doit être
 * remis au Parlement, et c'est lui qui décidera d'une prorogation. Si le
 * dispositif est prolongé, changer la date ici. S'il expire, le compteur tombe
 * à zéro tout seul et le bandeau devient un rappel des 3 dates.
 */
const FIN = new Date("2026-12-31T23:59:59+01:00");

/**
 * Le compteur bat à la seconde. On renvoie un entier de secondes : la valeur
 * est stable à l'intérieur d'une seconde, donc React ne re-rend pas en boucle.
 */
const battre = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const secondesRestantes = () => Math.max(0, Math.floor((FIN.getTime() - Date.now()) / 1000));

/**
 * Le rendu serveur renvoie null : la page est prérendue, une valeur figée au
 * build serait fausse dès le lendemain, et un écart d'hydratation ferait
 * clignoter le compteur au chargement.
 */
function useCompteur() {
  const s = useSyncExternalStore(battre, secondesRestantes, () => null);
  if (s === null) return null;
  return {
    j: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const deuxChiffres = (n: number) => String(n).padStart(2, "0");

/** Une case du compteur : le nombre, et son unité dessous. */
function Case({ n, u, large = false }: { n: string; u: string; large?: boolean }) {
  return (
    <span className="flex min-w-[2.7rem] flex-col items-center border border-white/35 bg-black/25 px-1.5 py-1 leading-none">
      <span
        className={`font-bold tabular-nums ${
          large ? "text-[1.35rem] sm:text-[1.6rem]" : "text-[1.15rem] sm:text-[1.35rem]"
        }`}
      >
        {n}
      </span>
      <span className="mt-0.5 text-[0.62rem] uppercase tracking-wider text-white/75">{u}</span>
    </span>
  );
}

/** Les quatre cases, avec un gabarit stable avant l'hydratation. */
function Cases({ c }: { c: ReturnType<typeof useCompteur> }) {
  return (
    <>
      <Case n={c ? String(c.j) : "—"} u="jours" large />
      <Case n={c ? deuxChiffres(c.h) : "—"} u="h" />
      <Case n={c ? deuxChiffres(c.m) : "—"} u="min" />
      <Case n={c ? deuxChiffres(c.s) : "—"} u="sec" />
    </>
  );
}

/** Bandeau haut de page, au-dessus de l'en-tête. Visible dès la première seconde. */
export function UrgencyBar() {
  const c = useCompteur();

  return (
    <div className="border-b-2 border-[#8d1f1f] bg-red text-white">
      <div className="wrap-wide flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-2">
        <p className="text-center text-[0.9rem] font-bold leading-snug sm:text-left sm:text-[1rem]">
          Le dispositif qui permet de donner{" "}
          <span className="whitespace-nowrap">100 000 € exonérés</span> se termine
          <span className="hidden sm:inline"> le 31 décembre 2026</span>
          <span className="block text-[0.78rem] font-normal text-white/80 sm:text-[0.85rem]">
            Art. 790 A bis du CGI, date votée au Parlement. Non prorogé à ce jour.
          </span>
        </p>
        <span className="flex items-center gap-1.5">
          <Cases c={c} />
        </span>
      </div>
    </div>
  );
}

/**
 * Ligne d'urgence sous un bouton. Levier n°2 des landing pages
 * (05-funnel/landing-pages.md § Les 4 améliorations).
 */
export function UrgencyUnderButton() {
  const c = useCompteur();
  return (
    <p className="border-l-4 border-orange bg-yellow-bg px-3 py-2 text-[0.92rem]">
      <strong className="text-orange-dark">Pourquoi ce soir plutôt que dans six mois&nbsp;:</strong>{" "}
      la fenêtre des 100 000 € exonérés ferme le 31 décembre 2026
      {c && <> — il reste {c.j} jours</>}, et une donation met quinze ans à s&apos;effacer
      fiscalement. Ces deux compteurs tournent déjà.
    </p>
  );
}

/** Le compteur en grand, pour le pop-up de sortie. */
export function UrgencyCountdown() {
  const c = useCompteur();
  return (
    <div className="border-2 border-red bg-red text-white">
      <p className="border-b border-white/25 px-3 py-1.5 text-center text-[0.75rem] font-bold uppercase tracking-[0.12em]">
        Fin du dispositif à 100 000 € · 31 décembre 2026
      </p>
      <div className="flex items-center justify-center gap-2 px-3 py-3">
        <Cases c={c} />
      </div>
    </div>
  );
}
