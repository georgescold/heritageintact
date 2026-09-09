"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { enregistrerReponses } from "@/app/profil";
import { QualificationBloc } from "@/components/QualificationBloc";
import { Button } from "@/components/ui";
import type { Reponses } from "@/lib/qualification";

/**
 * LES QUATRE QUESTIONS, UNE SECONDE APRÈS LE PAIEMENT.
 *
 * ═══ POURQUOI ELLES ONT DÉMÉNAGÉ DU BON DE COMMANDE ═══
 *
 * Sur le bon de commande, elles étaient placées entre un homme de 74 ans et sa
 * carte bancaire. Facultatives, sans astérisque, sans blocage — et malgré tout
 * quatre blocs de texte à traverser avant de payer. Chaque point de friction à
 * cet endroit-là se paie sur 100 % du revenu : un acheteur perdu au bon de
 * commande ne coûte pas le prix de La Méthode, il coûte La Méthode PLUS son
 * upsell PLUS son backend.
 *
 * Ici, elles ne coûtent plus rien du tout : il a payé, il ne peut plus être
 * perdu. Et elles gagnent ce qu'elles n'avaient pas — elles RASSURENT.
 * L'instant qui suit un paiement en ligne est le plus anxieux de tout le
 * parcours : « est-ce que c'est passé, est-ce que j'ai été prélevé, est-ce que
 * je vais recevoir quelque chose ». Une page qui répond aux trois questions
 * puis s'occupe de lui vaut mieux que n'importe quelle page de remerciement.
 *
 * ⚠️ ET C'EST POUR ÇA QUE LES QUESTIONS SONT SOUS LA CONFIRMATION, JAMAIS
 * AU-DESSUS. On ne demande rien à quelqu'un tant qu'on ne lui a pas dit que son
 * paiement est passé. L'ordre de cette page n'est pas une mise en page, c'est
 * la règle.
 *
 * ═══ POURQUOI LES DEUX BOUTONS MÈNENT AU MÊME ENDROIT ═══
 *
 * `/plan-complet` est l'entrée du tunnel, et le tunnel se redirige lui-même
 * vers le bon premier écran (`etapeTunnel`). Écrire ici la destination calculée
 * serait la recalculer une seconde fois, à un second endroit — et deux calculs
 * de routage finissent toujours par diverger. La destination reste donc
 * littéralement celle d'avant ce fichier.
 *
 * Corollaire de sécurité : aucune réponse ne transite par l'URL. Elles partent
 * par une server action, sont écrites en base sous l'identifiant de commande,
 * et relues à l'arrivée. Une URL finit dans les journaux du serveur, dans le
 * `Referer` envoyé à des tiers, et dans l'historique de l'ordinateur familial —
 * celui-là même où les enfants dont il est question ici lisent leurs mails.
 *
 * ═══ POURQUOI « PASSER » EST UN VRAI BOUTON ═══
 *
 * Il est écrit en clair, au même endroit, sans grisé et sans culpabilisation.
 * Un bouton d'échappement visible fait répondre PLUS de monde qu'un formulaire
 * qui paraît obligatoire : le lecteur qui sait qu'il peut sortir prend le temps
 * de lire. Et il ne perd rien — sans réponse, il suit le parcours par défaut.
 */
export function FormulaireSituation({ orderId, email }: { orderId: string; email: string }) {
  const router = useRouter();
  const [reponses, setReponses] = useState<Reponses>({});
  const [pending, setPending] = useState(false);

  const suite = `/plan-complet?o=${encodeURIComponent(orderId)}`;
  const aRepondu = Boolean(reponses.vie || reponses.enfants || reponses.av || reponses.age);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      if (aRepondu) await enregistrerReponses(orderId, email, reponses);
    } catch {
      // Silence volontaire, et il est de même nature qu'au bon de commande :
      // ces réponses sont un confort de routage. Aucune d'elles ne vaut de
      // laisser un homme qui vient de payer devant un message d'erreur rouge.
    } finally {
      // Volontairement HORS du `catch` : qu'on ait écrit ou non, il continue.
      router.push(suite);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <QualificationBloc valeurs={reponses} onChange={setReponses} />

      <div className="mt-5 space-y-3">
        <Button type="submit" disabled={pending} variant="green" className="w-full">
          {pending ? "Un instant..." : aRepondu ? "Continuer" : "Continuer sans répondre"}
        </Button>

        {/* Le lien de sortie est un vrai lien, pas un bouton fantôme : il doit
            rester utilisable si le JavaScript de la page n'a pas démarré — ce
            qui arrive, sur de vieilles machines et des connexions lentes. */}
        <p className="text-center">
          <a href={suite} className="text-[1.02rem] text-text-soft underline">
            Passer cette étape
          </a>
        </p>
      </div>
    </form>
  );
}
