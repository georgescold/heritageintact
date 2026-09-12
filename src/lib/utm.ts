/**
 * L'ORIGINE PUBLICITAIRE D'UN INSCRIT.
 *
 * Cinq paramètres collés à la fin de l'adresse d'arrivée. Meta les remplit tout
 * seul si la campagne porte, dans son champ « paramètres d'URL » :
 *
 *   utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}
 *   &utm_content={{ad.name}}&utm_id={{ad.id}}
 *
 * ⚠️ CE QUE CETTE MESURE NE SAIT PAS FAIRE, et qu'aucune ne sait faire : suivre
 * quelqu'un qui clique sur son téléphone, réfléchit trois jours, puis achète
 * depuis son ordinateur. Il arrivera sans origine et sera rangé dans « origine
 * inconnue ». Sur cet avatar — 67 ans, qui ne décide pas en deux minutes — ce
 * cas est plus fréquent que la moyenne. L'attribution par annonce est une aide
 * à la décision, jamais une comptabilité, et les écrans doivent le dire.
 *
 * ⚠️ AUCUNE DONNÉE PERSONNELLE ICI. Ce sont des noms de campagne et d'annonce,
 * écrits par nous dans le gestionnaire de publicités. Rien de ce qui transite
 * par ces champs ne décrit la personne — et rien ne doit jamais y être ajouté
 * qui la décrirait.
 */

export const CHAMPS_UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_id"] as const;

export type ChampUtm = (typeof CHAMPS_UTM)[number];
export type Utm = Partial<Record<ChampUtm, string>>;

/** Le cookie qui fait survivre l'origine à une navigation avant l'inscription. */
export const COOKIE_UTM = "hi_utm";

/**
 * Une valeur d'UTM est un nom de campagne, pas du texte libre d'utilisateur :
 * on la borne fermement. Tout ce qui n'est pas une lettre, un chiffre ou une
 * ponctuation de nom est retiré — un paramètre d'URL reste une entrée non
 * fiable, quelle que soit la confiance qu'on a dans la plateforme qui l'écrit.
 */
export function nettoyerUtm(valeur: unknown): string | undefined {
  if (typeof valeur !== "string") return undefined;
  const propre = valeur
    .trim()
    .replace(/[^\p{L}\p{N} ._|/-]/gu, "")
    .slice(0, 80)
    .trim();
  return propre || undefined;
}

/** Lit les cinq champs d'une source quelconque (URL, formulaire, cookie). */
export function lireUtm(acces: (cle: ChampUtm) => unknown): Utm {
  const sortie: Utm = {};
  for (const champ of CHAMPS_UTM) {
    const valeur = nettoyerUtm(acces(champ));
    if (valeur) sortie[champ] = valeur;
  }
  return sortie;
}

export const utmPresent = (utm: Utm): boolean => CHAMPS_UTM.some((c) => utm[c]);

/**
 * L'étiquette d'une annonce dans les écrans.
 *
 * L'identifiant Meta est préféré au nom quand il existe : un nom d'annonce se
 * renomme dans le gestionnaire, et tout l'historique d'une annonce renommée se
 * retrouverait alors coupé en deux lignes. L'identifiant, lui, ne change pas.
 */
export function cleAnnonce(utm: Utm): string {
  return utm.utm_id ?? utm.utm_content ?? utm.utm_campaign ?? "(origine inconnue)";
}
