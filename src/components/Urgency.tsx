"use client";

import { useSyncExternalStore } from "react";

/**
 * L'urgence du projet, rendue visible.
 *
 * Elle n'était nulle part au-dessus de la ligne de flottaison : les 3 portes
 * arrivaient au treizième écran. Une urgence qu'on découvre après quinze
 * sections ne fait pas acheter.
 *
 * Le compte à rebours est honnête et c'est ce qui fait sa force : le dispositif
 * de l'article 790 A bis du CGI s'arrête le 31 décembre 2026, la date est votée,
 * elle est vérifiable sur legifrance.gouv.fr, et elle ne se réinitialise pas
 * quand on recharge la page. Aucun faux compteur (cf. 12-chiffres-succession.md § 5).
 *
 * ⚠️ À revoir après le 30 septembre 2026 : un rapport d'évaluation doit être
 * remis au Parlement, et c'est lui qui décidera d'une prorogation. Si le
 * dispositif est prolongé, changer la date ici. S'il expire, ce bandeau devient
 * un rappel des 3 dates.
 */
const FIN = new Date("2026-12-31T23:59:59+01:00");

function joursRestants(): number {
  return Math.max(0, Math.ceil((FIN.getTime() - Date.now()) / 86_400_000));
}

/** Rien à surveiller : le nombre de jours ne bouge pas pendant une visite. */
const neRienEcouter = () => () => {};

/**
 * Le compte doit être calculé par le navigateur, jamais au build : la page est
 * prérendue, et une valeur figée serait fausse dès le lendemain. Le rendu
 * serveur renvoie donc null, ce qui évite tout décalage d'hydratation.
 */
function useJoursRestants(): number | null {
  return useSyncExternalStore(neRienEcouter, joursRestants, () => null);
}

/** Bandeau haut de page, au-dessus de l'en-tête. Visible dès la première seconde. */
export function UrgencyBar() {
  const jours = useJoursRestants();

  return (
    <div className="border-b-2 border-[#8d1f1f] bg-red text-white">
      <p className="wrap-wide py-2 text-center text-[0.92rem] font-bold leading-snug sm:text-[1rem]">
        <span aria-hidden className="mr-1.5">
          ⏳
        </span>
        Le dispositif qui permet de donner{" "}
        <span className="whitespace-nowrap">100 000 € exonérés</span> s&apos;arrête le{" "}
        <span className="whitespace-nowrap">31 décembre 2026</span>
        {jours !== null && <span className="whitespace-nowrap"> — il reste {jours} jours</span>}
        <span className="hidden font-normal text-white/85 sm:ml-2 sm:inline">
          Art. 790 A bis du CGI. Date votée au Parlement, non prorogée à ce jour.
        </span>
      </p>
    </div>
  );
}

/**
 * Ligne d'urgence sous un bouton. Levier n°2 des landing pages
 * (05-funnel/landing-pages.md § Les 4 améliorations).
 */
export function UrgencyUnderButton() {
  const jours = useJoursRestants();

  return (
    <p className="border-l-4 border-orange bg-yellow-bg px-3 py-2 text-[0.92rem]">
      <strong className="text-orange-dark">Pourquoi ce soir plutôt que dans six mois&nbsp;:</strong>{" "}
      la fenêtre des 100 000 € exonérés ferme le 31 décembre 2026
      {jours !== null && <> ({jours} jours)</>}, et une donation met quinze ans à s&apos;effacer
      fiscalement. Ces deux compteurs tournent déjà.
    </p>
  );
}
