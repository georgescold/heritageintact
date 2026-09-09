import type { ReactNode } from "react";

/**
 * « C'EST VALIDÉ, ET VOICI OÙ C'EST » — la confirmation d'un paiement réussi.
 *
 * ⚠️ CE COMPOSANT DIT DEUX CHOSES, ET LA SECONDE COMPTE PLUS QUE LA PREMIÈRE.
 *
 * « Votre commande est confirmée » tout seul laisse quelqu'un de 74 ans devant
 * un écran qui ressemble en tout point à celui d'avant, en train de chercher ce
 * qu'il vient de payer. C'est un email au support dans l'heure — et, sur une
 * garantie de 30 jours, un candidat au remboursement.
 *
 * Donc : ce qui est validé (`titre`), et OÙ LA CHOSE SE TROUVE (`children`).
 * Jamais l'un sans l'autre. Un appel qui n'a rien à mettre dans `children` est
 * le signe qu'on ne sait pas soi-même où l'acheteur doit aller.
 *
 * ⚠️ POURQUOI UNE ANIMATION, ALORS QUE RIEN D'AUTRE NE BOUGE SUR CE SITE.
 * Un bandeau vert immobile se range avec le décor : l'œil le saute. Le
 * mouvement ne décore pas, il DATE l'événement — il dit « ça vient de se
 * passer, maintenant ». Il joue une fois, ne boucle jamais, et disparaît de la
 * perception dès qu'il s'arrête.
 *
 * Tout s'annule sous `prefers-reduced-motion`, et l'état sans mouvement est
 * l'état FINAL : coche entière, bandeau en place. Voir `globals.css`.
 *
 * ⚠️ AUCUN "use client". Animations CSS pures, donc la confirmation est déjà
 * peinte au premier rendu serveur : elle ne dépend ni d'un bundle chargé, ni
 * d'une hydratation. Sur une connexion lente — et une part de cette cible est
 * en ADSL rural — c'est la différence entre voir la coche et voir une page
 * blanche pendant deux secondes.
 */
export function AchatValide({
  titre,
  children,
  ton = "vert",
}: {
  /** Ce qui vient d'être validé. Le nom du produit, ou « Votre commande ». */
  titre: string;
  /** Où la chose se trouve maintenant. Obligatoire : c'est la moitié utile. */
  children: ReactNode;
  /**
   * `vert` — l'achat est passé, c'est le cas normal.
   * `bleu` — l'accès est ouvert sans qu'un débit vienne d'avoir lieu (retour
   * sur un espace déjà livré). Le vert y serait faux : il annoncerait un
   * paiement que personne n'a fait à l'instant.
   */
  ton?: "vert" | "bleu";
}) {
  const couleurs =
    ton === "vert"
      ? { bord: "border-green", fond: "bg-green-bg", texte: "text-green", pastille: "bg-green" }
      : { bord: "border-blue", fond: "bg-grey-bg", texte: "text-blue", pastille: "bg-blue" };

  return (
    <section
      /* `status` et non `alert` : `alert` interrompt un lecteur d'écran au
         milieu de sa phrase, ce qui est agressif pour une bonne nouvelle. */
      role="status"
      className={`confirmation-entree flex items-start gap-4 border-2 ${couleurs.bord} ${couleurs.fond} p-4 sm:p-5`}
    >
      <span
        aria-hidden
        className={`confirmation-pastille flex size-12 shrink-0 items-center justify-center rounded-full ${couleurs.pastille} sm:size-14`}
      >
        <svg viewBox="0 0 24 24" className="size-7 sm:size-8" fill="none" aria-hidden>
          <path
            /* `pathLength={1}` normalise la longueur du tracé à 1, quelle que
               soit sa géométrie réelle : le `stroke-dasharray: 1` de la classe
               d'animation vaut alors exactement le tracé entier. Sans lui, il
               faudrait mesurer le chemin en JavaScript. */
            pathLength={1}
            className="confirmation-coche"
            d="M4.5 12.5 L10 18 L19.5 6.5"
            stroke="white"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className="min-w-0">
        <p className={`text-[1.2rem] font-bold leading-snug sm:text-[1.35rem] ${couleurs.texte}`}>
          {titre}
        </p>
        <div className="mt-1 text-[1.05rem] leading-snug">{children}</div>
      </div>
    </section>
  );
}
