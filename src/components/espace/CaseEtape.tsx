import { basculerEtape } from "@/app/espace/actions";

/**
 * « J'AI TERMINÉ CETTE ÉTAPE » — LA MÉMOIRE EXTERNE DU MEMBRE.
 *
 * Il fera une étape le mardi, la suivante le dimanche d'après, et entre les
 * deux il aura oublié où il en était. Cette case est ce qui lui rend cette
 * information sans qu'il ait à s'en souvenir ; c'est aussi ce qui fait avancer
 * le compteur du hub, et ce qui décide du produit mis en tête de boutique.
 *
 * ⚠️ ET C'EST SON GESTE. On ne coche jamais à sa place : l'ouverture de la page
 * dit qu'il a regardé, la coche dit qu'il a FAIT. Confondre les deux vide le
 * compteur de son sens, et le seul repère de sa progression avec.
 *
 * ⚠️ UN `<form>` ET UNE SERVER ACTION, PAS UNE CASE À COCHER JAVASCRIPT. Deux
 * raisons, et chacune suffirait :
 *   — une `<input type="checkbox">` fait 13 px de côté, ce qui est hors de
 *     portée d'un doigt de 75 ans sur un téléphone ; ici la cible fait 64 px de
 *     haut sur toute la largeur, et la coche 28 px ;
 *   — ce public bloque parfois les scripts, et une case qui ne coche rien sans
 *     JavaScript serait une panne invisible. Un formulaire, lui, fonctionne
 *     toujours.
 *
 * La valeur cible est portée par le bouton (`!faite`), donc un double envoi
 * donne le même résultat qu'un seul.
 */
export function CaseEtape({
  jeton,
  numero,
  faite,
}: {
  jeton: string;
  numero: number;
  faite: boolean;
}) {
  const basculer = basculerEtape.bind(null, jeton, numero, !faite);

  return (
    <form action={basculer}>
      <button
        type="submit"
        aria-pressed={faite}
        className={`flex w-full cursor-pointer items-center gap-4 border-2 px-4 py-3 text-left min-h-[64px] ${
          faite
            ? "border-green bg-green-bg text-green"
            : "border-blue bg-white text-blue hover:bg-grey-bg"
        }`}
      >
        <span
          aria-hidden
          className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center border-2 text-[1.3rem] font-bold leading-none ${
            faite ? "border-green bg-white" : "border-blue bg-white"
          }`}
        >
          {faite ? "✔" : ""}
        </span>
        <span className="text-[1.15rem] font-bold leading-snug">
          {faite ? "Étape terminée — cliquez pour la décocher" : "J'ai terminé cette étape"}
        </span>
      </button>
    </form>
  );
}
