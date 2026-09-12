/**
 * LE DÉVERROUILLAGE, APRÈS LA DEMANDE DU DOCUMENT.
 *
 * Un temps d'attente volontaire : le lecteur vient de donner son adresse, et ce
 * court écran transforme une redirection en ouverture. C'est le moment où la
 * valeur perçue se fabrique.
 *
 * ⚠️ ENTIÈREMENT EN CSS, sans une ligne de JavaScript, et c'est délibéré. Un
 * voile qui se retire par script reste collé le jour où le script échoue — et
 * le lecteur se retrouve devant un écran bleu à la place du document qu'on
 * vient de lui promettre. Ici l'animation porte `forwards` : même sans JS, même
 * si l'hydratation ne se fait jamais, l'écran s'efface.
 *
 * ⚠️ `prefers-reduced-motion` est respecté — la cible a 60-80 ans, et une
 * animation qui balaie l'écran n'est pas neutre à cet âge. Durée réduite et
 * barre figée dans ce cas.
 */
const DUREE_S = 3.2;

export function AccesAutorise() {
  return (
    <>
      <style>{`
        @keyframes hi-acces-sortie {
          0%, 72%  { opacity: 1; visibility: visible; }
          100%     { opacity: 0; visibility: hidden; pointer-events: none; }
        }
        @keyframes hi-acces-barre { from { width: 0%; } to { width: 100%; } }
        @keyframes hi-acces-entree { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .hi-acces {
          position: fixed; inset: 0; z-index: 60;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 18px; padding: 28px; text-align: center;
          background: var(--color-blue, #12365e); color: #ffffff;
          animation: hi-acces-sortie ${DUREE_S}s ease-in forwards;
        }
        .hi-acces p { margin: 0; animation: hi-acces-entree .5s ease-out both; }
        .hi-acces .hi-acces-titre { font-size: 1.5rem; font-weight: bold; letter-spacing: .02em; }
        .hi-acces .hi-acces-sous { font-size: 1.02rem; max-width: 34ch; line-height: 1.5; animation-delay: .45s; }
        .hi-acces-piste {
          width: min(260px, 70vw); height: 6px; background: rgba(255,255,255,.25);
        }
        .hi-acces-barre {
          display: block; height: 100%; background: var(--color-orange, #e8730c);
          animation: hi-acces-barre ${DUREE_S - 0.9}s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .hi-acces { animation-duration: 1.4s; }
          .hi-acces p { animation: none; }
          .hi-acces-barre { animation: none; width: 100%; }
        }
        @media print { .hi-acces { display: none !important; } }
      `}</style>
      <div className="hi-acces" role="status" aria-live="polite">
        <p className="hi-acces-titre">Accès autorisé</p>
        <div className="hi-acces-piste" aria-hidden="true">
          <span className="hi-acces-barre" />
        </div>
        <p className="hi-acces-sous">
          Vous allez découvrir une page qui ne figure nulle part sur le site, ni dans les résultats
          de recherche.
        </p>
      </div>
    </>
  );
}
