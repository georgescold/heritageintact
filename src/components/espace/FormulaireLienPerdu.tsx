"use client";

import { useActionState } from "react";
import { renvoyerLien } from "@/app/espace/actions";
import { Button } from "@/components/ui";

type Reponse = { message: string } | undefined;

/**
 * « J'AI PERDU MON LIEN » — UN CHAMP, UN BOUTON, ET RIEN D'AUTRE.
 *
 * C'est la porte de secours de tout le dispositif, et elle sert plus souvent
 * qu'on ne le croit : l'email est supprimé par mégarde, le favori disparaît
 * avec le vieil ordinateur, le lien est recopié à la main avec un caractère de
 * moins. Aucun de ces cas n'est un incident — ce sont des mardis ordinaires.
 *
 * ⚠️ PAS DE PRÉNOM, PAS DE CASE À COCHER, PAS DE MOT DE PASSE. Le seul
 * renseignement demandé est celui qu'il connaît par cœur. Chaque champ
 * supplémentaire est une occasion d'échouer et de renoncer.
 *
 * ⚠️ Le message de retour ne dit JAMAIS si l'adresse correspond à un achat :
 * la règle est portée par la server action, ce composant ne fait que
 * l'afficher tel quel. Ne jamais y ajouter de « adresse inconnue ».
 */
export function FormulaireLienPerdu() {
  const [reponse, action, pending] = useActionState<Reponse, FormData>(renvoyerLien, undefined);

  return (
    <form action={action} noValidate>
      <label className="block">
        <span className="mb-2 block text-[1.15rem] font-bold">
          Votre adresse email, celle de votre commande
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="prenom.nom@orange.fr"
          className="field text-[1.1rem]"
        />
      </label>

      <div className="mt-4">
        <Button disabled={pending}>{pending ? "Un instant..." : "Recevoir mon lien"}</Button>
      </div>

      {/* `role="status"` et non `role="alert"` : ce n'est pas une alarme, c'est
          une confirmation. Un lecteur d'écran l'annonce sans interrompre. */}
      {reponse && (
        <p
          role="status"
          className="mt-4 border-2 border-blue bg-grey-bg px-4 py-3 text-[1.1rem] font-bold text-blue"
        >
          {reponse.message}
        </p>
      )}

      <p className="mt-4 text-[0.95rem] text-text-soft">
        L&apos;email arrive en général en moins d&apos;une minute. S&apos;il ne vient pas, regardez
        dans vos courriers indésirables&nbsp;: il s&apos;y range parfois tout seul.
      </p>
    </form>
  );
}
