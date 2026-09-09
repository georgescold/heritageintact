"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enregistrerReponses } from "@/app/profil";
import { QualificationBloc } from "@/components/QualificationBloc";
import type { Reponses } from "@/lib/qualification";

/**
 * LES QUATRE QUESTIONS, UNE SECONDE APRÈS LE PAIEMENT.
 *
 * ═══ POURQUOI ELLES ONT DÉMÉNAGÉ DU BON DE COMMANDE ═══
 *
 * Sur le bon de commande, elles étaient placées entre un homme de 74 ans et sa
 * carte bancaire. Chaque point de friction à cet endroit-là se paie sur 100 %
 * du revenu : un acheteur perdu au bon de commande ne coûte pas le prix de La
 * Méthode, il coûte La Méthode PLUS son upsell PLUS son backend.
 *
 * Ici, elles ne coûtent plus cela : il a payé, et il a déjà reçu ce qu'il a
 * payé. Et elles gagnent ce qu'elles n'avaient pas — elles RASSURENT.
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
 * ═══ REFONTE DU 9 SEPTEMBRE 2026 : PLUS DE BOUTON DE SORTIE ═══
 *
 * Il y avait ici deux échappatoires — un bouton « Continuer sans répondre » et
 * un lien « Passer cette étape ». Elles ont été retirées : les quatre questions
 * sont maintenant obligatoires pour atteindre les écrans suivants.
 *
 * ⚠️ CE QUI REND CETTE OBLIGATION TENABLE, ET IL FAUT QUE ÇA LE RESTE :
 * l'acheteur a DÉJÀ son produit quand il arrive ici. `livrer()` s'exécute dans
 * `confirmCheckout`, donc avant le rendu de cette page ; le lien de son espace
 * est écrit au-dessus de ce formulaire, en clair, et il s'ouvre dans un onglet
 * à part ; l'email est parti. Quelqu'un qui ferme l'onglet à cet instant ne
 * perd rien de ce qu'il a payé — il ne verra simplement pas les offres.
 *
 * Le jour où l'un de ces trois filets tombe, l'obligation devient un péage sur
 * un produit déjà payé, et ce n'est plus la même page. Ne pas rendre ces
 * questions obligatoires AVANT le bloc de livraison, ni sur un écran où
 * l'accès ne serait pas déjà donné.
 *
 * ═══ POURQUOI IL N'Y A PLUS DE BOUTON « CONTINUER » DU TOUT ═══
 *
 * L'écran avance au choix, et la dernière réponse déclenche l'envoi. Un bouton
 * de validation en plus des quatre réponses, ce serait un cinquième clic qui
 * n'apporte aucune information — et sur cette cible, un bouton qui ne sert à
 * rien est un bouton devant lequel on hésite.
 *
 * ═══ AUCUNE RÉPONSE NE TRANSITE PAR L'URL ═══
 *
 * Elles partent par une server action, sont écrites en base sous l'identifiant
 * de commande, et relues à l'arrivée. Une URL finit dans les journaux du
 * serveur, dans le `Referer` envoyé à des tiers, et dans l'historique de
 * l'ordinateur familial — celui-là même où les enfants dont il est question ici
 * lisent leurs mails.
 *
 * `/plan-complet` est l'entrée du tunnel, et le tunnel se redirige lui-même
 * vers le bon premier écran (`etapeTunnel`). Écrire ici la destination calculée
 * serait la recalculer une seconde fois, à un second endroit — et deux calculs
 * de routage finissent toujours par diverger.
 */
export function FormulaireSituation({ orderId, email }: { orderId: string; email: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const suite = `/plan-complet?o=${encodeURIComponent(orderId)}`;

  async function onTermine(reponses: Reponses) {
    setPending(true);
    try {
      await enregistrerReponses(orderId, email, reponses);
    } catch {
      // Silence volontaire : ces réponses sont un confort de routage. Aucune
      // d'elles ne vaut de laisser un homme qui vient de payer devant un
      // message d'erreur rouge — il conclurait que son paiement a échoué.
    } finally {
      // Volontairement HORS du `catch` : qu'on ait écrit ou non, il continue.
      // Une panne d'écriture ne doit jamais l'enfermer sur cet écran.
      router.push(suite);
    }
  }

  // L'écran d'attente remplace le bloc plutôt que de s'y ajouter : voir
  // apparaître un message SOUS quatre questions déjà répondues donne
  // l'impression qu'il en reste à faire.
  if (pending) {
    return (
      <p
        role="status"
        className="border-2 border-blue bg-grey-bg px-4 py-5 text-center text-[1.15rem] font-bold text-blue"
      >
        Merci. Nous préparons la suite…
      </p>
    );
  }

  return <QualificationBloc onTermine={onTermine} />;
}
