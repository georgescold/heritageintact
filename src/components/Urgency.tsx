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
 * Le jour où le dispositif est né : loi de finances n° 2025-127 du 14 février
 * 2025, article 71 (`12-chiffres-succession.md`).
 *
 * Il sert à remplir la barre de progression **avec un chiffre vrai**. Au
 * 6 septembre 2026, plus de 80 % de la fenêtre est déjà consommée — une barre
 * presque pleine, sans qu'on ait eu à inventer quoi que ce soit. Une barre
 * pré-remplie « pour faire joli » serait une fausse indication ; celle-ci est
 * une date de Journal officiel divisée par une autre.
 */
const DEBUT = new Date("2025-02-15T00:00:00+01:00");

/** Durée totale de la fenêtre, en secondes. Constante, calculée une fois. */
const FENETRE_SECONDES = Math.round((FIN.getTime() - DEBUT.getTime()) / 1000);

/**
 * Part de la fenêtre déjà écoulée, de 0 à 100, **déduite du temps restant**.
 *
 * ⚠️ Surtout pas de `Date.now()` ici : appelé pendant le rendu, il rend le
 * composant impur — deux rendus successifs donneraient deux résultats, et la
 * règle `react-hooks/purity` le refuse à juste titre. Le temps restant vient
 * déjà du compteur, qui est la seule source d'horloge du composant.
 */
function partEcoulee(secondesRestantes: number): number {
  const ecoule = FENETRE_SECONDES - secondesRestantes;
  return Math.min(100, Math.max(0, Math.round((ecoule / FENETRE_SECONDES) * 100)));
}

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
    /** Part du délai légal déjà écoulée, pour la barre du bandeau. */
    part: partEcoulee(s),
  };
}

const deuxChiffres = (n: number) => String(n).padStart(2, "0");

/**
 * Une case du compteur.
 *
 * Largeur FIXE et identique pour les quatre : « 117 » prend une place et demie
 * de plus que « 02 », et des cases dimensionnées par leur contenu donnent une
 * rangée bancale, avec le nombre des jours collé à ses bordures. Elle est
 * calibrée sur trois chiffres, donc rien ne bouge quand le compte passera
 * sous les cent jours.
 */
function Case({ n, u }: { n: string; u: string }) {
  return (
    <span className="flex w-[3.1rem] flex-col items-center justify-center border border-white/35 bg-black/25 py-1 leading-none sm:w-[3.6rem] sm:py-1.5">
      <span className="text-[1.2rem] font-bold tabular-nums sm:text-[1.45rem]">{n}</span>
      <span className="mt-1 text-[0.6rem] uppercase tracking-wide text-white/75 sm:text-[0.66rem]">
        {u}
      </span>
    </span>
  );
}

/** Les quatre cases, avec un gabarit stable avant l'hydratation. */
function Cases({ c }: { c: ReturnType<typeof useCompteur> }) {
  return (
    <>
      <Case n={c ? String(c.j) : "—"} u="jours" />
      <Case n={c ? deuxChiffres(c.h) : "—"} u="h" />
      <Case n={c ? deuxChiffres(c.m) : "—"} u="min" />
      <Case n={c ? deuxChiffres(c.s) : "—"} u="sec" />
    </>
  );
}

/** Bandeau haut de page, au-dessus de l'en-tête. Visible dès la première seconde. */
export function UrgencyBar() {
  const c = useCompteur();
  // Avant l'hydratation on ne sait rien du temps : on affiche la barre à sa
  // valeur du jour de l'écriture plutôt qu'à zéro, pour éviter qu'elle saute
  // de vide à pleine sous les yeux du lecteur.
  const part = c ? c.part : 83;

  return (
    <div className="pulse-urgence border-b-[3px] border-[#8d1f1f] bg-red text-white">
      <div className="wrap-wide py-2 sm:py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
          <p className="text-center text-[0.95rem] font-bold leading-snug sm:text-left sm:text-[1.08rem]">
            <span className="sm:hidden">
              Fin du dispositif à <span className="whitespace-nowrap">100 000 € exonérés</span>
            </span>
            <span className="hidden sm:inline">
              Le dispositif qui permet de donner{" "}
              <span className="whitespace-nowrap">100 000 € exonérés</span> se termine le 31
              décembre 2026
            </span>
          </p>
          <span className="flex items-center gap-1.5">
            <Cases c={c} />
          </span>
        </div>

        {/* La barre : la part de la fenêtre déjà écoulée depuis la loi du
            14 février 2025. Elle arrive donc pleine à plus de 80 %, et c'est
            un fait, pas un effet. */}
        <div className="mx-auto mt-2 flex max-w-[46rem] items-center gap-2">
          <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-white/25">
            <div className="h-full bg-white" style={{ width: `${part}%` }} />
          </div>
          <span className="shrink-0 text-[0.82rem] font-bold text-white/90">
            {part} % du délai écoulé
          </span>
        </div>
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
      <strong className="text-orange-dark">
        Pourquoi maintenant plutôt que dans six mois&nbsp;:
      </strong>{" "}
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
