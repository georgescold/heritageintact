"use client";

/**
 * « Imprimer ou enregistrer en PDF », sur les documents offerts.
 *
 * Le navigateur fait les deux depuis la même boîte de dialogue : sur ordinateur
 * comme sur téléphone, « Enregistrer au format PDF » y est une destination
 * d'impression. Pas de bibliothèque, pas de fichier à régénérer à chaque loi de
 * finances — et le lecteur repart avec une copie qu'il peut poser sur la table.
 *
 * Le bouton disparaît à l'impression (`print:hidden`), sinon il figure sur la
 * feuille.
 */
export function BoutonImprimer({ libelle = "Imprimer ou enregistrer en PDF" }: { libelle?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden border-2 border-blue px-4 py-2 text-[0.92rem] font-bold text-blue"
    >
      {libelle}
    </button>
  );
}
