"use server";

/**
 * L'ÉCRITURE DES QUATRE RÉPONSES DU BON DE COMMANDE. Une seule fonction, et
 * elle ne fait qu'une chose : écrire une ligne dans `profils`.
 *
 * ═══ POURQUOI UNE SERVER ACTION, ET POURQUOI À CET INSTANT-LÀ ═══
 *
 * Elle est appelée depuis le navigateur juste après `prepareCheckout` et AVANT
 * `stripe.confirmPayment` : c'est le seul moment où l'identifiant de commande
 * existe et où le paiement n'est pas encore parti. Trois conséquences, et ce
 * sont elles qui justifient tout le reste du dispositif :
 *
 *   · les réponses ne passent JAMAIS par la chaîne de requête. Une URL finit
 *     dans les journaux du serveur, dans l'en-tête `Referer` envoyé à des tiers,
 *     et dans l'historique d'un ordinateur familial — celui-là même où les
 *     enfants dont il est question dans les questions viennent lire leurs
 *     mails ;
 *   · le retour de 3-D Secure ne perd rien : `return_url` n'est pas touché, et
 *     les trois endroits qui écrivent `/plan-complet?o=` en dur ne changent pas ;
 *   · rien n'est ajouté sur le chemin critique du paiement — aucun écran
 *     supplémentaire, aucune seconde prise sur la fenêtre de 30 minutes du débit
 *     en un clic.
 *
 * ═══ CE QU'ELLE NE FAIT PAS, ET C'EST DÉLIBÉRÉ ═══
 *
 * Elle ne renvoie rien, ne redirige jamais, et n'échoue jamais visiblement.
 * Elle est atteignable depuis le navigateur avec un identifiant de commande :
 * elle ne doit donc RIEN renvoyer de la commande (ni email, ni montant, ni
 * articles), et n'écrire nulle part ailleurs que dans `profils`. Un échec ne
 * laisse aucune ligne, donc aucune réponse, donc le tunnel par défaut — le pire
 * cas du dispositif reste l'existant.
 */

import { getOrder, enregistrerProfil } from "@/lib/db";
import { piste, type Reponses } from "@/lib/qualification";

/**
 * LES LISTES BLANCHES, ET ELLES SONT LA SEULE DÉFENSE DE LA TABLE.
 *
 * Cette action vient du navigateur : le corps de l'appel est ce que l'appelant
 * veut bien y mettre. Sans filtre, `profils` deviendrait un champ de texte libre
 * ouvert à tous — exactement ce que la page de confidentialité promet qu'elle
 * n'est pas. Un code inconnu est IGNORÉ, jamais stocké : il se comporte alors
 * comme une absence de réponse, c'est-à-dire comme le tunnel d'aujourd'hui.
 *
 * `X` (« Je préfère ne pas répondre ») est admis et stocké tel quel : il est
 * traité partout comme une absence par `codeUtile` (qualification.ts), mais le
 * conserver distingue « il a refusé de répondre » de « il n'a rien vu » — et
 * c'est cette différence, et elle seule, qui dira si le bloc de questions fait
 * peur. En dessous de 40 % de réponses, on le réécrit ou on le retire.
 */
const CODES = {
  vie: ["M", "P", "U", "V", "S", "X"],
  enfants: ["1", "2", "R", "0", "X"],
  av: ["O", "N", "?", "X"],
  age: ["a", "b", "c", "d", "X"],
} as const;

/** Le code s'il figure dans sa liste blanche, `undefined` sinon. */
function valider(code: string | undefined, admis: readonly string[]): string | undefined {
  if (typeof code !== "string") return undefined;
  const c = code.trim();
  return admis.includes(c) ? c : undefined;
}

export async function enregistrerReponses(
  orderId: string,
  email: string,
  reponses: { vie?: string; enfants?: string; av?: string; age?: string },
): Promise<void> {
  try {
    const propres: Reponses = {
      vie: valider(reponses.vie, CODES.vie),
      enfants: valider(reponses.enfants, CODES.enfants),
      av: valider(reponses.av, CODES.av),
      age: valider(reponses.age, CODES.age),
    };

    // Aucune réponse retenue : on n'écrit AUCUNE ligne. Une commande sans
    // réponse doit rester strictement indiscernable d'une commande d'avant le
    // dispositif — c'est ce qui rend le retour en arrière gratuit, et c'est
    // aussi ce qui rend le premier chiffre de mesure honnête (la proportion de
    // commandes portant au moins une réponse se lit par le simple nombre de
    // lignes de la table).
    if (!propres.vie && !propres.enfants && !propres.av && !propres.age) return;

    // La commande est relue en base pour deux raisons, et aucune n'est du
    // confort :
    //   · le bump est un FAIT déjà enregistré, pas une réponse. Le lire ici
    //     évite que le navigateur puisse s'en déclarer porteur et se faire
    //     montrer l'écran du pack à 347 € sans avoir payé les 17 € ;
    //   · l'email vient de la commande, jamais du navigateur. Sinon n'importe
    //     qui écrirait une situation familiale sous l'adresse d'un autre — et
    //     cette adresse est ce que la purge à la désinscription compare.
    // Commande introuvable = rien à décrire : on n'écrit pas. C'est aussi ce
    // qui empêche un curieux de remplir la table avec des identifiants inventés.
    const order = await getOrder(orderId);
    if (!order) return;

    const bumpPresent = order.items.some((i) => i.sku === "bump");

    // La piste est FIGÉE À L'ÉCRITURE, jamais recalculée à la lecture : elle
    // sert la mesure, et la mesure doit dire ce que l'acheteur a réellement vu,
    // pas ce que la table de routage rendrait aujourd'hui.
    await enregistrerProfil({
      orderId,
      // `email` reste dans la signature comme repli : l'appelant l'a sous la
      // main, et une commande sans email n'existe pas.
      email: order.email || email,
      ...propres,
      piste: piste(propres, { bumpPresent }),
    });
  } catch (e) {
    // Journalisé, jamais propagé. Cette fonction s'exécute entre la création de
    // la commande et le débit : une exception qui remonte au navigateur à cette
    // seconde-là coûterait un paiement pour une information de confort.
    console.error("[profil] enregistrement des réponses impossible", e);
  }
}
