"use client";

import { useSyncExternalStore } from "react";
import { FIN_EXONERATION_LOGEMENT, secondesExonerationRestantes } from "@/lib/urgence-fiscale";

// Échéance fiscale vérifiée le 9 septembre 2026. Ce compteur ne représente pas une promotion.
// Réexaminer la date uniquement si un texte légal modifie le dispositif.
const battre = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
function useCompteur() {
  const s = useSyncExternalStore(battre, secondesExonerationRestantes, () => null);
  if (s === null) return null;
  return { j: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, expire: s === 0 };
}
const deuxChiffres = (n: number) => String(n).padStart(2, "0");
function Case({ n, u }: { n: string; u: string }) {
  return <span className="flex w-[3.1rem] flex-col items-center justify-center border border-white/35 bg-black/25 py-1 leading-none sm:w-[3.6rem] sm:py-1.5">
    <span className="text-[1.2rem] font-bold tabular-nums sm:text-[1.45rem]">{n}</span>
    <span className="mt-1 text-[0.65rem] uppercase tracking-wide text-white/90">{u}</span>
  </span>;
}
function Cases({ c }: { c: ReturnType<typeof useCompteur> }) {
  return <span className="flex items-center justify-center gap-1.5" role="timer" aria-label="Temps restant jusqu’au 31 décembre 2026" aria-live="off" data-echeance-fiscale={FIN_EXONERATION_LOGEMENT}>
    <Case n={c ? String(c.j) : "—"} u="jours" />
    <Case n={c ? deuxChiffres(c.h) : "—"} u="h" />
    <Case n={c ? deuxChiffres(c.m) : "—"} u="min" />
    <Case n={c ? deuxChiffres(c.s) : "—"} u="sec" />
  </span>;
}
export function UrgencyBar() {
  const c = useCompteur();
  if (c?.expire) return <div className="bg-red px-4 py-3 text-center font-bold text-white" data-urgence-expiree>La fenêtre prévue jusqu’au 31 décembre 2026 est terminée. Vérifiez les règles applicables avant un don.</div>;
  return <div className="border-b-[3px] border-[#8d1f1f] bg-red text-white">
    <div className="wrap-wide py-2 sm:py-2.5">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <p className="text-center text-[0.95rem] font-bold leading-snug sm:text-[1.08rem]">Jusqu’à <span className="whitespace-nowrap">100 000 € exonérés</span> pour un don familial destiné au logement :<br />la fenêtre se ferme le <span className="whitespace-nowrap">31 décembre 2026.</span></p>
        <Cases c={c} />
      </div>
    </div>
  </div>;
}
export function UrgencyUnderButton() {
  return <div className="border-l-4 border-orange bg-yellow-bg px-4 py-3">
    <p className="font-bold text-orange-dark">Attendre deux ans, c’est aussi repousser de deux ans le compteur des 15 ans.</p>
    <p className="mt-2 text-[0.98rem]">Une donation à 67 ans : le repère des 15 ans arrive à 82 ans. La même donation à 69 ans : à 84 ans. Vous pouvez remettre la question à plus tard. Vous ne pourrez pas antidater la donation.</p>
    <p className="mt-2 text-sm text-text-soft">Le renouvellement de l’abattement dépend des donations antérieures. Acheter le guide ne lance pas ce délai : il vous aide à préparer les vérifications avant de décider.</p>
  </div>;
}
export function UrgencyCountdown() {
  const c = useCompteur();
  if (c?.expire) return <p className="font-bold text-red">L’échéance du dispositif temporaire était le 31 décembre 2026. Faites vérifier les règles actuelles.</p>;
  return <div className="border-2 border-red bg-red p-3 text-white">
    <p className="mb-3 text-center text-sm font-bold">Dons familiaux pour logement neuf ou rénovation énergétique : fin prévue le 31 décembre 2026.</p>
    <Cases c={c} />
    <p className="mt-3 text-center text-xs">Jusqu’à 100 000 € par donateur et bénéficiaire, sous conditions. Ce n’est pas la fin de l’abattement général.</p>
  </div>;
}
export function ConditionsExoneration() {
  return <details id="conditions-exoneration" className="my-6 border border-line bg-grey-bg p-4 scroll-mt-4">
    <summary className="cursor-pointer font-bold text-blue">Le compteur de décembre : quels dons sont concernés ?</summary>
    <div className="mt-3 space-y-3 text-sm">
      <p>L’article 790 A bis concerne certains dons familiaux de sommes d’argent versées du 15 février 2025 au 31 décembre 2026 : jusqu’à 100 000 € par donateur à un même bénéficiaire, et 300 000 € reçus au total par bénéficiaire.</p>
      <p>Les fonds doivent financer un logement neuf ou en VEFA, ou des travaux de rénovation énergétique éligibles, dans le délai prévu de six mois. Des conditions d’affectation ou de conservation pendant cinq ans s’appliquent. Le lien familial, le projet et les autres conditions doivent être vérifiés avant le don.</p>
      <p>Cette exonération temporaire est distincte de l’abattement parent-enfant de 100 000 € renouvelable selon le délai de 15 ans : cet abattement général ne se termine pas le 31 décembre 2026.</p>
      <p>Le compte à rebours indique une date fiscale, pas la durée du prix du guide. L’achat ne réserve aucun droit fiscal. <a href="https://www.impots.gouv.fr/particulier/dons-exoneres">Conditions officielles sur impots.gouv.fr</a>.</p>
    </div>
  </details>;
}
