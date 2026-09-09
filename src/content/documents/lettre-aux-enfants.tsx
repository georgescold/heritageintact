import { Case, Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/**
 * LA LETTRE POUR OUVRIR LE SUJET AVEC SES ENFANTS (bonus B3).
 *
 * ⚠️ Le blocage n'est pas fiscal, il est familial : le lecteur a peur que ses
 * enfants entendent « je vais mourir » ou « je compte mes sous ». Le texte à
 * trous existe pour qu'il n'ait pas à trouver les mots lui-même — et pour que
 * la conversation ait lieu une fois, au lieu d'être reportée dix ans.
 *
 * Le modèle est une lettre privée, pas un acte : rien à faire relire par un
 * notaire ici, puisqu'elle n'engage rien.
 */
export function LettreAuxEnfants() {
  return (
    <Feuille
      titre="La lettre pour ouvrir le sujet avec vos enfants"
      sousTitre="Un texte à trous, à recopier ou à envoyer tel quel. Et le déroulé de la conversation."
    >
      <Titre>Pourquoi une lettre plutôt qu&apos;un dîner</Titre>
      <p>
        Annoncé de vive voix au dessert, le sujet prend tout le monde de court et quelqu&apos;un
        finit par pleurer. Écrite, la lettre se lit seul, se relit, et laisse à chacun le temps
        d&apos;arriver préparé. C&apos;est le seul point de méthode de cette feuille.
      </p>

      <Titre>Le modèle</Titre>
      <Encadre>
        <div className="space-y-3 text-[0.97rem]">
          <p>
            <span className="border-b border-black px-8">&nbsp;</span>, le{" "}
            <span className="border-b border-black px-8">&nbsp;</span>
          </p>
          <p>
            Mes chers <span className="border-b border-black px-12">&nbsp;</span>,
          </p>
          <p>
            Je vous écris pour une raison qui n&apos;a rien d&apos;inquiétant, et je préfère le dire
            tout de suite : je vais bien.
          </p>
          <p>
            J&apos;ai pris le temps, ces dernières semaines, de regarder précisément ce qui se
            passerait pour vous le jour où je ne serai plus là. J&apos;ai fait le calcul. Le
            résultat m&apos;a surpris, et j&apos;ai découvert que plusieurs choses pouvaient être
            décidées maintenant, tranquillement, plutôt que dans l&apos;urgence et le chagrin.
          </p>
          <p>
            Je n&apos;ai pas envie que vous ayez à vendre{" "}
            <span className="border-b border-black px-16">&nbsp;</span> pour payer un impôt que nous
            pouvions éviter en nous y prenant à temps.
          </p>
          <p>
            Je voudrais donc qu&apos;on en parle une fois, tous ensemble, le{" "}
            <span className="border-b border-black px-10">&nbsp;</span>. Une heure suffira. Je
            n&apos;attends aucune réponse de votre part avant : j&apos;ai juste besoin que vous
            sachiez de quoi il s&apos;agit en arrivant.
          </p>
          <p>
            Ce n&apos;est pas une conversation triste. C&apos;est le contraire : c&apos;est ce
            qu&apos;on fait quand on a encore tout le temps devant soi.
          </p>
          <p>
            Je vous embrasse,
            <br />
            <span className="border-b border-black px-16">&nbsp;</span>
          </p>
        </div>
      </Encadre>

      <Titre>Le déroulé de la conversation, en cinq temps</Titre>
      <ol className="list-decimal space-y-1 pl-5">
        <li>Redire que vous allez bien, et que rien n&apos;est décidé contre personne.</li>
        <li>
          Donner votre chiffre — celui de La Facture Invisible. C&apos;est lui qui fait comprendre.
        </li>
        <li>Dire ce que vous voulez, vous, avant de demander ce qu&apos;ils veulent, eux.</li>
        <li>Écouter les inquiétudes sans y répondre tout de suite. Notez-les.</li>
        <li>Fixer la seule chose à décider ce jour-là : la date du rendez-vous chez le notaire.</li>
      </ol>

      <Titre>Trois phrases à éviter</Titre>
      <ul className="space-y-1">
        <Case>« De toute façon, quand je serai mort… » — la salle se ferme.</Case>
        <Case>
          « J&apos;ai déjà tout décidé. » — la conversation n&apos;a plus lieu d&apos;être.
        </Case>
        <Case>
          « Ne vous inquiétez pas, il n&apos;y a pas grand-chose. » — c&apos;est presque toujours
          faux, et ça ne rassure personne.
        </Case>
      </ul>

      <Champ label="Lettre envoyée le" />
      <Champ label="Conversation prévue le" />
    </Feuille>
  );
}
