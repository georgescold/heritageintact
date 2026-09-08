import { randomBytes } from "crypto";

/**
 * Le jeton d'accès à l'espace membre.
 *
 * ═══ Pourquoi cet alphabet-là ═══
 *
 * 31 caractères : les 26 lettres minuscules moins `i`, `l` et `o`, plus les
 * chiffres 2 à 9. On retire donc `i` `l` `o` `0` `1`, les cinq caractères qui
 * se confondent à l'oral comme à l'écran.
 *
 * Deux exigences le commandent, et elles tirent dans des directions opposées.
 *
 *   1. INDEVINABLE. Ce jeton est la seule chose qui protège l'espace : il n'y
 *      a pas de mot de passe, donc pas de second facteur. 20 caractères sur un
 *      alphabet de 31 valent 20 × log2(31) ≈ 99 bits — hors de portée d'un
 *      balayage, aujourd'hui comme dans dix ans.
 *
 *   2. DICTABLE AU TÉLÉPHONE. Le client a 74 ans, il appelle le support parce
 *      qu'il ne retrouve plus son email, et il faut pouvoir lui lire son lien
 *      à voix haute sans qu'il tape un `1` pour un `l` ou un `0` pour un `o`.
 *      C'est cette contrainte, et elle seule, qui coûte les 5 caractères
 *      retirés — on les rachète en longueur, pas en sécurité.
 *
 * ⚠️ Ce n'est PAS un secret au sens fort : le jeton voyage dans l'historique
 * du navigateur, sur l'ordinateur familial, dans la capture d'écran envoyée au
 * support. C'est un lien « portant », et la contrepartie est assumée ailleurs —
 * deux clics et un écran de confirmation avant tout débit, plus un reçu
 * immédiat au propriétaire de la carte.
 */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** 20 caractères ≈ 99 bits. Voir le commentaire d'ALPHABET. */
const LONGUEUR = 20;

/**
 * Le plus grand multiple de 31 tenant dans un octet : 8 × 31 = 248.
 *
 * Un `octet % 31` naïf serait BIAISÉ : 256 n'est pas divisible par 31, donc
 * les 8 premières lettres sortiraient un peu plus souvent que les autres, et
 * l'entropie réelle tomberait sous les 99 bits annoncés. On rejette donc tout
 * octet ≥ 248 et on retire au lieu de le replier.
 */
const SEUIL = 248;

export function nouveauJeton(): string {
  let jeton = "";
  while (jeton.length < LONGUEUR) {
    // On tire large : les rejets sont rares (8 octets sur 256), mais boucler
    // octet par octet ferait autant d'appels système que de caractères.
    for (const octet of randomBytes(LONGUEUR)) {
      if (octet >= SEUIL) continue;
      jeton += ALPHABET[octet % ALPHABET.length];
      if (jeton.length === LONGUEUR) break;
    }
  }
  return jeton;
}

/**
 * Valide la FORME d'un jeton — longueur et alphabet, rien d'autre.
 *
 * Sert à rejeter une URL tronquée par un client mail ou recopiée de travers
 * sans même ouvrir une connexion à la base. Un jeton bien formé mais inconnu
 * n'est pas de son ressort : celui-là doit aboutir au formulaire de
 * récupération, jamais à une 404.
 */
export function estJetonValide(s: string): boolean {
  if (typeof s !== "string" || s.length !== LONGUEUR) return false;
  for (const c of s) if (!ALPHABET.includes(c)) return false;
  return true;
}
