"use client";

/**
 * LE BOUTON D'IMPRESSION — et les trois phrases qui l'entourent.
 *
 * ⚠️ AUCUNE IMPRESSION AUTOMATIQUE AU CHARGEMENT, jamais, sous aucun prétexte.
 * Une boîte de dialogue système qui surgit sans avoir été demandée ne se lit
 * pas comme un service à 75 ans : elle se lit comme un incident. Le réflexe
 * est de fermer l'onglet, et personne ne revient. C'est une règle, pas une
 * préférence d'ergonomie.
 *
 * ═══ Pourquoi les phrases sont dans le composant, et pas dans les pages ═══
 *
 * Elles répondent aux trois seules questions que ce lecteur se pose devant un
 * bouton « Imprimer », et elles doivent être identiques partout :
 *
 *   1. « Je n'ai pas d'imprimante » — il ignore le plus souvent que la liste
 *      des imprimantes contient « Enregistrer au format PDF ». C'est la
 *      phrase qui transforme un abandon en fichier conservé.
 *   2. « J'ai cliqué et rien ne se passe » — un bloqueur de fenêtres, un
 *      navigateur ancien. Le menu du navigateur marche toujours.
 *   3. L'adresse imprimée en pied de page. Le lien personnel est la clé de
 *      l'espace, et le classeur, lui, se prête. La règle CSS `a[href]::after`
 *      efface les adresses du CONTENU, mais elle ne peut rien contre l'en-tête
 *      que le navigateur ajoute lui-même : cette case-là, seul le lecteur peut
 *      la décocher. D'où la troisième phrase, écrite en clair.
 */
export function BoutonImprimer({ libelle = "Imprimer ce document" }: { libelle?: string }) {
  return (
    <div className="no-print">
      <p className="mb-3 text-[1.05rem]">
        Si vous n&apos;avez pas d&apos;imprimante, choisissez «&nbsp;Enregistrer au format
        PDF&nbsp;» dans la liste des imprimantes : le document sera conservé sur votre ordinateur.
      </p>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-[60px] w-full cursor-pointer items-center justify-center border-b-4 border-orange-dark bg-orange px-5 text-center text-[1.1rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.2rem]"
      >
        {libelle}
      </button>

      <p className="mt-3 text-[1.05rem]">
        Si rien ne se passe, utilisez le menu de votre navigateur, puis «&nbsp;Imprimer&nbsp;».
      </p>

      <p className="mt-2 text-[0.95rem] text-text-soft">
        Dans la fenêtre d&apos;impression, si vous voyez une case «&nbsp;En-têtes et pieds de
        page&nbsp;», décochez-la : l&apos;adresse de votre lien personnel ne sera alors pas imprimée
        sur vos feuilles.
      </p>
    </div>
  );
}
