import { FOUNDERS_CAP, PRIX_APRES_FONDATEURS, PRODUCTS, euros } from "@/lib/config";
import { countFounders } from "@/lib/db";

/** Le triangle d'avertissement, tracé au trait. Décoratif : le texte dit tout. */
function TriangleAvertissement({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 3 1.8 20.5h20.4L12 3Z" />
      <path d="M12 9.5v5" />
      <path d="M12 17.6h.01" />
    </svg>
  );
}

/**
 * Le compteur de places, en encadré d'avertissement.
 *
 * ═══ La forme ═══
 *
 * Filet épais à gauche, fond crème, triangle au trait, titre en gras, corps en
 * dessous. C'est le registre des encadrés « Attention » de l'administration
 * française — celui que l'avatar a déjà lu cent fois sur impots.gouv.fr, et
 * qu'il associe à une information qui l'engage.
 *
 * ⚠️ On emprunte le **registre**, jamais l'identité : ni Marianne, ni logo, ni
 * signature institutionnelle. Ces éléments sont réservés aux acteurs de l'État
 * (`15-identite-visuelle.md`). Un encadré jaune à filet gauche avec un triangle
 * est un motif d'interface universel ; ce qui serait interdit, c'est de laisser
 * croire qu'on émane d'un service public.
 *
 * ═══ Écrit pour un lecteur de 67 ans ═══
 *
 * Le nombre est énorme et seul dans sa phrase : il doit se lire à un mètre de
 * l'écran, sans lunettes. « Membres fondateurs » a sauté — c'est du vocabulaire
 * de lancement de startup, ça ne dit rien à quelqu'un qui vient de lire une
 * page sur sa succession. Ne reste que ce qui engage : combien il reste, à quel
 * prix, et ce que ça devient ensuite.
 *
 * La pulsation est lente et de faible amplitude, et elle se coupe si le système
 * demande moins d'animation — réglage fréquent chez les personnes sujettes au
 * vertige, c'est-à-dire exactement notre public.
 *
 * ═══ Le nombre est vrai ═══
 *
 * Il lit la base à chaque affichage et descend à chaque vente. Un compteur qui
 * descendrait tout seul sur un minuteur serait une fausse rareté, que l'article
 * L121-4 du code de la consommation range parmi les pratiques réputées
 * trompeuses — et qu'un simple rechargement de page démasque.
 */
export async function FoundersCounter() {
  const count = await countFounders();
  const left = Math.max(0, FOUNDERS_CAP - count);
  const critique = left <= 10;

  return (
    <div
      className={`pulse-urgence border-l-[6px] p-4 sm:p-5 ${
        critique ? "border-red bg-red-bg" : "border-orange bg-yellow-bg"
      }`}
    >
      <TriangleAvertissement className={critique ? "text-red" : "text-orange-dark"} />

      <p className="mt-2 text-[1.3rem] font-bold leading-tight text-blue sm:text-[1.5rem]">
        Il ne reste que{" "}
        <span className={critique ? "text-red" : "text-orange-dark"}>
          {left} {left > 1 ? "places" : "place"}
        </span>{" "}
        à {euros(PRODUCTS.front.price)}
      </p>

      <p className="mt-1.5 text-[1.02rem] leading-snug">
        Ensuite, le prix passe à <strong>{euros(PRIX_APRES_FONDATEURS)}</strong> et n&apos;en
        redescend plus. Les places déjà prises ne se rouvrent pas.
        {count > 0 ? (
          <>
            {" "}
            <strong>
              {count} sur {FOUNDERS_CAP}
            </strong>{" "}
            {count > 1 ? "sont déjà parties" : "est déjà partie"}.
          </>
        ) : null}
      </p>
    </div>
  );
}
