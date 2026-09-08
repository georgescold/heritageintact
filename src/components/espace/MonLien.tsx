"use client";

import { useActionState } from "react";
import { renvoyerLien } from "@/app/espace/actions";
import { Button } from "@/components/ui";
import { urlEspace } from "@/lib/config";

type Reponse = { message: string } | undefined;

/**
 * LE LIEN PERSONNEL, ÉCRIT EN CLAIR, EN BAS DE CHAQUE VISITE.
 *
 * C'est le garde-fou de tout le dispositif. Sans `RESEND_API_KEY`, la fonction
 * d'envoi renvoie « c'est parti » sans rien expédier, et aucun journal ne s'en
 * plaint : dans ce scénario, le lien affiché à l'écran est LE SEUL chemin qui
 * survit. Il ne doit jamais être retiré de cette page, ni de /merci.
 *
 * ⚠️ AUCUN BOUTON « COPIER ». Il ne sert à rien ici : ce lecteur ne colle pas,
 * il met en favori, ou il recopie sur un papier. `select-all` fait le travail
 * pour ceux qui savent copier, sans ajouter de geste à comprendre pour les
 * autres.
 *
 * ⚠️ Le lien est écrit AVEC le domaine complet, la même chaîne exactement que
 * celle de l'email d'accès (`urlEspace`). Deux écritures différentes du même
 * lien, et le lecteur doute des deux.
 */
export function MonLien({ jeton, email }: { jeton: string; email: string }) {
  const [reponse, action, pending] = useActionState<Reponse, FormData>(renvoyerLien, undefined);
  const lien = urlEspace(jeton);

  return (
    <section>
      <h2 className="mb-3 text-[1.35rem]">VOTRE LIEN PERSONNEL</h2>

      <div className="border-2 border-grey-line bg-grey-bg p-4">
        <p className="mb-2 text-[1.05rem]">Voici l&apos;adresse de votre espace&nbsp;:</p>
        {/* `break-all` : vingt caractères sans espace débordent de l'écran d'un
            téléphone, et une adresse coupée par le bord est une adresse qu'on
            recopie fausse. */}
        <p className="mb-3 select-all break-all text-[1.15rem] font-bold text-blue sm:text-[1.3rem]">
          {lien}
        </p>
        <p className="text-[1.05rem]">
          <strong>Mettez cette page dans vos favoris.</strong> Il n&apos;y a pas de mot de passe :
          ce lien est votre clé, et il ne s&apos;arrête jamais de fonctionner.
        </p>
      </div>

      <form action={action} className="mt-4">
        {/* L'adresse du membre, déjà connue : il n'a rien à ressaisir. Le même
            garde anti-abus (un renvoi toutes les 2 minutes) s'applique. */}
        <input type="hidden" name="email" value={email} />
        <Button variant="blue" disabled={pending}>
          {pending ? "Un instant..." : "Me renvoyer ce lien par email"}
        </Button>
      </form>

      {reponse && (
        <p
          role="status"
          className="mt-3 border-2 border-blue bg-white px-4 py-3 text-[1.05rem] font-bold text-blue"
        >
          {reponse.message}
        </p>
      )}

      <p className="mt-4 text-[1.05rem] text-text-soft">
        Si un jour vous ne retrouvez plus rien, allez sur{" "}
        <strong className="select-all">heritageintact.fr/connexion</strong> et indiquez votre
        adresse email&nbsp;: votre lien repart aussitôt.
      </p>
    </section>
  );
}
