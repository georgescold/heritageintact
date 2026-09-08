/**
 * LA TABLE DE ROUTAGE DU TUNNEL — module pur, sans base, sans React, sans effet
 * de bord.
 *
 * Quatre questions facultatives posées au bon de commande décident QUELS écrans
 * de vente sont montrés après le paiement, et DANS QUEL ORDRE. Ce fichier ne
 * décide que de cela. Le titre du premier écran est dans `accroches.ts`, le prix
 * est calculé côté serveur ailleurs, et les réponses elles-mêmes sont lues par
 * un autre lot dans une table dédiée.
 *
 * ═══ POURQUOI CE MODULE EST PUR ═══
 *
 * Le routage est appelé par une page serveur, par la barre de progression et par
 * la mesure. Trois appelants, un seul verdict : s'ils recalculaient chacun leur
 * séquence, ils divergeraient, et un acheteur verrait une barre « écran 2 sur 2 »
 * sur un parcours qui en compte un seul. Une fonction sans état est aussi la
 * seule qui se relise entièrement à l'œil, ce qui est le vrai critère ici :
 * 1 200 états ne se testent pas à la main.
 *
 * ═══ PREUVE DE COMPLÉTUDE ═══
 *
 *   V1 « vous vivez »    : M · P · U · V · S · (X ou absent)  →  6 valeurs
 *   V2 « vos enfants »   : 1 · 2 · R · 0 · (X ou absent)      →  5 valeurs
 *   V3 « assurance-vie » : O · N · ? · (X ou absent)          →  4 valeurs
 *   V4 « âge »           : a · b · c · d · (X ou absent)      →  5 valeurs
 *   V5 bump (déjà en base, pas une question) : présent · absent → 2 valeurs
 *
 *   6 × 5 × 4 × 5 × 2 = 1 200 états.
 *
 *   Règle 1 « plan-seul »  : V3 = N                    → 6×5×1×5×2 =  300
 *   Règle 2 « pack »       : V3 = O ET S1 ET bump      → 13×1×5×1  =   65
 *   Règle 3 « av-dabord »  : V4 = b ET V3 ∈ {O,?}      → 120 − 13  =  107
 *   Règle 4 « defaut »     : tout le reste             →              728
 *                                                        ─────────────────
 *                                                                    1 200
 *
 * Chaque état tombe dans exactement une règle : la règle 1 teste V3 seul, la
 * règle 2 exige V3 = O et retire ses états du reste, la règle 3 teste (V4, V3)
 * sur ce qui subsiste, la règle 4 est un attrape-tout sans condition.
 *
 * ═══ LE DÉFAUT EST LE TUNNEL D'AUJOURD'HUI ═══
 *
 * `sequence(null, { bumpPresent: true })` rend ["plan", "assurance-vie"], soit
 * exactement l'ordre actuel. C'est la propriété qui rend le retour en arrière
 * gratuit : à `QUALIFICATION_ACTIVE = false` personne ne répond, l'absence de
 * réponse EST le comportement d'aujourd'hui, et il n'y a rien à défaire.
 *
 * ⚠️ CE FICHIER N'IMPORTE RIEN, ET C'EST VOULU. Pas de base, pas de React, pas
 * même le catalogue : la table de routage doit pouvoir se relire seule, et rien
 * de ce qu'elle décide ne dépend d'un prix ou d'un drapeau. La correspondance
 * écran → SKU, le retrait des produits indisponibles ou déjà possédés et le
 * calcul du prix appartiennent à l'appelant, qui a la base sous la main.
 */

/**
 * DRAPEAU DE MISE EN SERVICE. Il ne passe à `true` que le jour où, dans la
 * MÊME livraison :
 *   1. les feuilles des deux upsells sont déclarées dans `DOCUMENTS` ;
 *   2. la case pré-cochée de « Quelle est ma situation ? » et la date surlignée
 *      du « Calendrier des 3 dates » fonctionnent ;
 *   3. `PRODUCTS.upsell1.disponible` et `PRODUCTS.upsell2.disponible` sont
 *      passés à `true` à la main.
 *
 * ⚠️ L'ORDRE N'EST PAS NÉGOCIABLE. Les deux pages s'auto-sautent tant que leur
 * drapeau `disponible` est à `false` : activer les questions avant le point 3,
 * c'est poser quatre questions pour router vers un écran qui se saute — de la
 * friction pure, à rendement mathématiquement nul. Et activer les questions
 * avant le point 2, c'est promettre que les réponses changent quelque chose
 * alors que rien ne change : l'écran devient un péage et abîme la confiance
 * qu'on venait d'acheter à 27 €.
 *
 * À `false`, tout le dispositif se comporte comme le tunnel actuel.
 */
/*
 * ACTIVÉ le 8 septembre 2026. Les trois conditions ci-dessus sont remplies,
 * et vérifiées une par une :
 *   1. les 19 feuilles des deux upsells sont déclarées dans `DOCUMENTS` ;
 *   2. `profilParEmail` alimente bien les feuilles — la case pré-cochée de
 *      « Quelle est ma situation ? » et la date surlignée du « Calendrier des
 *      3 dates » reçoivent le profil, dans la page document comme dans la
 *      page d'impression ;
 *   3. `upsell1`, `upsell2` et `pack1` sont à `disponible: true`.
 *
 * Pour revenir en arrière : `false`. Rien d'autre à défaire — l'absence de
 * réponse EST le tunnel d'avant, et les lignes déjà écrites dans `profils`
 * cessent simplement d'être lues.
 */
export const QUALIFICATION_ACTIVE = true;

/**
 * Les quatre réponses, telles qu'elles sortent de la table `profils`.
 *
 * Le type est `string` et non une union de littéraux, délibérément : ces valeurs
 * viennent de la base, pas du compilateur. Une union donnerait l'illusion qu'un
 * code inconnu est impossible, alors qu'une vieille ligne ou une faute de frappe
 * en produirait un. Ici, un code inconnu se comporte comme une absence de
 * réponse — c'est-à-dire comme le tunnel d'aujourd'hui.
 *
 *   vie     : M marié(e) · P pacsé(e) · U en couple sans mariage ni PACS
 *             V veuf ou veuve · S seul(e) aujourd'hui
 *   enfants : 1 un enfant · 2 deux ou plus
 *             R des enfants dont au moins un d'une autre union · 0 pas d'enfant
 *   av      : O oui · N non · ? je ne sais plus
 *   age     : a moins de 65 · b de 65 à 69 · c 70 ans · d 71 ans ou plus
 *
 * `X` (« Je préfère ne pas répondre ») et l'absence de réponse sont STRICTEMENT
 * équivalents partout dans le routage : voir `codeUtile`.
 */
export type Reponses = {
  vie?: string;
  enfants?: string;
  av?: string;
  age?: string;
};

/** Les trois écrans de vente possibles après le paiement du front. */
export type Ecran = "plan" | "assurance-vie" | "pack";

/**
 * LE CODE S'IL PORTE UNE INFORMATION, `undefined` SINON. Point d'entrée unique
 * de la règle « X ≡ absent », et il n'y en a pas d'autre dans le projet.
 *
 * `X` est le libellé « Je préfère ne pas répondre ». Il sert aussi de bouton
 * d'annulation : sur une cible de 74 ans, un radio coché par erreur et
 * impossible à décocher est une raison de fermer l'onglet. Une fois ce rôle
 * assumé, `X` ne peut plus rien signifier d'autre qu'une absence — sans quoi le
 * lecteur qui se ravise se retrouverait dans un segment qu'il n'a pas choisi.
 *
 * La chaîne vide est traitée pareil : une colonne texte revenue vide de la base
 * n'est pas une réponse.
 */
export function codeUtile(code: string | undefined): string | undefined {
  if (code === undefined) return undefined;
  const c = code.trim();
  return c === "" || c === "X" ? undefined : c;
}

/**
 * « AU MOINS UN HÉRITIER VISÉ SORT DU BARÈME DE LA LIGNE DIRECTE. »
 *
 * C'est la condition de fond du pack à 347 € : pour ces situations,
 * l'assurance-vie cesse d'être un complément du Plan. C'est le seul contrat qui
 * transmet hors succession, donc le seul outil qui atteigne un partenaire taxé à
 * 60 % ou des neveux à 55 %. Les deux produits ne sont pas voisins, l'un est le
 * mode d'emploi de l'autre.
 *
 * ⚠️ EXIGE LES DEUX RÉPONSES. Un profil incomplet n'est JAMAIS S1 : on ne met
 * pas un assemblage à 347 € devant quelqu'un dont on ne sait rien. Les
 * 10 couples incomplets tombent donc au défaut.
 *
 * ⚠️ DEUX EXCLUSIONS QUI SONT DES FAITS DE DROIT, PAS DES ARBITRAGES :
 *
 *   · LE VEUVAGE SEUL N'EST PAS S1. Le décès d'un époux ne casse pas la ligne
 *     directe : les enfants d'une veuve gardent leur abattement de 100 000 €
 *     par parent. Les compter comme héritiers hors barème serait fiscalement
 *     faux, et le pack deviendrait un argument de façade — exactement ce que ce
 *     projet s'interdit. `V` n'entre donc dans S1 que par l'autre porte :
 *     enfants d'une autre union (`R`), ou pas d'enfant (`0`).
 *
 *   · « SEUL(E) » + FAMILLE RECOMPOSÉE (S×R) N'EST PAS S1. Sans conjoint
 *     actuel, il n'y a pas d'enfant du conjoint à qui le taux de 60 %
 *     s'appliquerait : le risque qui justifie le pack ne joue pas. S×0 (seul,
 *     sans enfant) reste S1, lui, parce que la dévolution part alors vers les
 *     frères, neveux et collatéraux — 55 % et 60 %.
 *
 * Les 13 couples S1 : P×1 P×2 P×R P×0 · U×1 U×2 U×R U×0 · M×R M×0 · V×R V×0 · S×0
 * Les 7 couples complets non-S1 : M×1 M×2 · V×1 V×2 · S×1 S×2 · S×R
 */
function ligneCassee(r: Reponses | null): boolean {
  const vie = codeUtile(r?.vie);
  const enfants = codeUtile(r?.enfants);
  if (vie === undefined || enfants === undefined) return false;
  if (vie === "P" || vie === "U") return true;
  if (enfants === "0") return true;
  return enfants === "R" && (vie === "M" || vie === "P" || vie === "U" || vie === "V");
}

/**
 * LA SÉQUENCE D'ÉCRANS DE VENTE POUR CET ACHETEUR. 1 ou 2 écrans, jamais 3.
 *
 * Quatre règles ordonnées, la première applicable gagne, la dernière est un
 * attrape-tout sans condition. Cette fonction ne connaît ni les prix, ni la
 * disponibilité des SKU, ni ce que l'acheteur possède déjà : l'appelant retire
 * de la séquence ce qui n'est pas `disponible` et ce qui est déjà possédé, et
 * redirige sur /merci si elle devient vide.
 *
 * @param opts.bumpPresent le Dossier notaire à 17 € figure dans `order.items`.
 *   Ce n'est pas une réponse à une question, c'est un fait déjà en base.
 */
export function sequence(r: Reponses | null, opts: { bumpPresent: boolean }): Ecran[] {
  const av = codeUtile(r?.av);
  const age = codeUtile(r?.age);

  /**
   * RÈGLE 1 — PAS D'ASSURANCE-VIE : L'ÉCRAN À 97 € EST SUPPRIMÉ DU PARCOURS.
   *
   * Proposer l'audit d'un contrat inexistant à quelqu'un qui vient de payer,
   * c'est le remboursement annoncé. C'est aussi la seule sortie propre côté
   * statut CIF : à quelqu'un sans contrat, la seule offre possible serait d'en
   * ouvrir un, c'est-à-dire une recommandation de placement — interdite.
   *
   * C'est la ligne la plus rentable du dispositif, et pour une raison qui n'a
   * rien de technique : c'est la première fois qu'on RETIRE quelque chose à cet
   * acheteur au lieu de lui en vendre.
   */
  if (av === "N") return ["plan"];

  /**
   * RÈGLE 2 — LE PACK À 347 € EN UN SEUL DÉBIT.
   *
   * Trois conditions cumulatives, et chacune retire un risque précis :
   *   · `av === "O"` strictement, jamais « je ne sais plus » : on ne met pas
   *     347 € devant quelqu'un qui n'est pas certain de posséder l'objet audité.
   *     C'est le remboursement annoncé, à nouveau.
   *   · `ligneCassee` : sans héritier hors barème, le pack n'a pas de raison de
   *     fond, seulement une remise — et une remise sans raison est un ancrage.
   *   · `bumpPresent` : un écran à 347 € devant quelqu'un qui vient de décocher
   *     17 € est un refus annoncé. Celui-là part en séquence, et reçoit le
   *     Dossier notaire sans supplément avec son premier achat.
   *
   * L'assurance-vie reste en second : si l'acheteur refuse le pack, l'écran à
   * 97 € l'attend, comme dans le tunnel actuel.
   */
  if (av === "O" && opts.bumpPresent && ligneCassee(r)) return ["pack", "assurance-vie"];

  /**
   * RÈGLE 3 — LA SEULE INVERSION DE TOUT LE DISPOSITIF.
   *
   * Entre 65 et 69 ans, la date de l'article 990 I est à cinq ans au plus :
   * sur les primes versées avant 70 ans, chaque bénéficiaire dispose de
   * 152 500 € hors succession ; sur celles versées après, d'un abattement unique
   * de 30 500 € partagé entre tous. C'est la seule bande d'âge où l'urgence est
   * datée du côté de l'assurance-vie.
   *
   * Partout ailleurs, montrer 97 € avant 297 € cannibalise le grand panier sans
   * raison datée.
   *
   * ⚠️ `av` doit valoir « O » ou « ? » : ni « X », ni absent. On ne réordonne
   * pas le tunnel de quelqu'un qui n'a pas répondu — le défaut ne doit jamais
   * faire pire que l'existant.
   */
  if (age === "b" && (av === "O" || av === "?")) return ["assurance-vie", "plan"];

  /**
   * RÈGLE 4 — LE DÉFAUT, QUI EST L'ORDRE DU TUNNEL ACTUEL À LA VIRGULE PRÈS.
   *
   * 728 états sur 1 200, dont l'état « aucune réponse ». C'est ce qui garantit
   * que le pire cas du dispositif est l'existant, jamais moins.
   */
  return ["plan", "assurance-vie"];
}

/**
 * LE NOM COURT ET STABLE DE LA PISTE, pour la mesure et pour rien d'autre.
 *
 * Trois chiffres n'existent nulle part aujourd'hui et décident si le dispositif
 * gagne : la proportion de commandes portant au moins une réponse, la
 * répartition réelle entre les quatre pistes, et le revenu par commande
 * avant/après. Cette fonction fournit le deuxième.
 *
 * ⚠️ CES QUATRE CHAÎNES SONT DÉFINITIVES si elles sont écrites en base ou
 * agrégées dans un tableau de bord : les renommer ferait disparaître
 * l'historique sans lever la moindre erreur.
 *
 * Dérivée de `sequence`, jamais recalculée en parallèle : deux implémentations
 * de la même règle divergent toujours, et c'est la mesure qui ment en premier.
 */
export function piste(r: Reponses | null, opts: { bumpPresent: boolean }): string {
  const seq = sequence(r, opts);
  if (seq.length === 1) return "plan-seul";
  if (seq[0] === "pack") return "pack";
  if (seq[0] === "assurance-vie") return "av-dabord";
  return "defaut";
}

/** L'URL de chaque écran de vente. Le pack a sa page propre. */
export const ROUTE: Record<Ecran, string> = {
  plan: "/plan-complet",
  "assurance-vie": "/kit-assurance-vie",
  pack: "/dossier-complet",
};

/**
 * Le libellé de chaque écran dans la barre de progression.
 *
 * La barre doit compter les écrans RÉELLEMENT prévus, ni plus ni moins :
 * annoncer « étape 2 sur 4 » à quelqu'un dont le parcours en compte trois, c'est
 * lui promettre un écran qu'il ne verra pas — et sur cette cible, un compte qui
 * ne tombe pas juste est un motif de méfiance, pas une approximation.
 */
export const LIBELLE: Record<Ecran, string> = {
  plan: "Votre plan",
  "assurance-vie": "Votre assurance-vie",
  pack: "Votre dossier",
};

/**
 * L'URL D'UN ÉCRAN DE LA SÉQUENCE.
 *
 * ⚠️ AUCUNE RÉPONSE NE DOIT JAMAIS APPARAÎTRE DANS UNE URL. Une URL finit dans
 * les journaux du serveur, dans l'en-tête `Referer` envoyé à des tiers, et dans
 * l'historique d'un ordinateur familial — celui-là même où les enfants dont il
 * est question dans les questions viennent lire leurs mails. Les réponses vivent
 * en base, lues par l'identifiant de commande.
 *
 * @param position rang de l'écran dans la séquence, à partir de 1. C'est un
 *   entier de position, jamais une donnée personnelle : il dit « tu es le
 *   deuxième », pas « tu es veuf ». Il est indispensable — sans lui, une
 *   séquence [assurance-vie, plan] fait rebondir /plan-complet vers
 *   /kit-assurance-vie, qui renvoie vers /plan-complet, indéfiniment.
 *
 * `e` est omis quand la position vaut 1 : l'URL d'entrée du tunnel reste alors
 * littéralement celle d'aujourd'hui, et les trois endroits du code qui écrivent
 * `/plan-complet?o=` en dur n'ont rien à changer. La redirection d'entrée vise
 * toujours un écran de position 1, donc elle ne peut pas se redéclencher.
 */
export function urlEcran(ecran: Ecran, orderId: string, position: number): string {
  // encodeURIComponent est un no-op sur un identifiant de commande, mais il
  // garantit qu'aucun identifiant exotique ne puisse jamais injecter un
  // second paramètre dans la chaîne de requête.
  const base = `${ROUTE[ecran]}?o=${encodeURIComponent(orderId)}`;
  return position > 1 ? `${base}&e=${position}` : base;
}
