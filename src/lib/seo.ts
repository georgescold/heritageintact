/**
 * INDEXATION : LISTE BLANCHE, JAMAIS LISTE NOIRE.
 *
 * Le site est un tunnel de vente. La très grande majorité des pages ne doit
 * jamais atteindre un index : pages de commande, d'offre, de remerciement,
 * espace client, et toutes les adresses qui contiennent un jeton.
 *
 * Le `layout.tsx` racine pose donc `noindex, nofollow` par défaut, et une page
 * ne devient indexable qu'en le déclarant ici **et** en appelant `robotsPage()`
 * dans son `metadata`. Conséquence voulue : une page ajoutée au site est muette
 * pour Google tant que personne ne l'a inscrite ici en connaissance de cause.
 *
 * ⚠️ N'ajoute jamais à cette liste une page qui affiche un prix, une remise, un
 * compte à rebours ou un contenu payant. Le contenu gratuit ne doit empiéter sur
 * aucun composant vendu (cf. `INCLUS_DANS` dans config.ts).
 */
import type { Metadata } from "next";
import { SITE_URL } from "./config";

/**
 * Les seules pages que Google a le droit d'indexer, chemin exact.
 *
 * `/cgv` en est volontairement absente : elle affiche la grille tarifaire
 * (`PRODUCTS`), et les prix du tunnel varient selon une date personnelle. Les
 * faire remonter dans un résultat de recherche contredirait l'affichage réel.
 */
export const CHEMINS_INDEXABLES = [
  "/mentions-legales",
  "/confidentialite",
  // Section éditoriale. Chaque page s'inscrit ici explicitement : une page en
  // cours d'écriture reste muette pour Google tant qu'elle n'y figure pas.
  "/guide/usufruit-nue-propriete-indivision",
] as const;

/**
 * Préfixes entièrement indexables — la future section éditoriale.
 * Vide tant qu'aucune page n'est publiée : on n'ouvre pas une section fantôme.
 */
export const PREFIXES_INDEXABLES: readonly string[] = [];

export function estIndexable(chemin: string): boolean {
  const c = chemin.replace(/\/+$/, "") || "/";
  if ((CHEMINS_INDEXABLES as readonly string[]).includes(c)) return true;
  return PREFIXES_INDEXABLES.some((p) => c === p || c.startsWith(`${p}/`));
}

/**
 * À placer dans le `metadata` d'une page publique. Renvoie un `robots` ouvert
 * seulement si le chemin est déclaré ci-dessus — sinon le refus par défaut est
 * conservé, même si l'appel est fait par erreur.
 */
export function robotsPage(chemin: string): Metadata["robots"] {
  return estIndexable(chemin)
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

/** Canonique absolue. Sans elle, les variantes ?o=, ?utm= créent des doublons. */
export function canonique(chemin: string): Metadata["alternates"] {
  return { canonical: new URL(chemin, SITE_URL).toString() };
}

/** Métadonnées complètes d'une page publique indexable. */
export function metadataPublique(
  chemin: string,
  titre: string,
  description: string,
): Metadata {
  return {
    title: titre,
    description,
    robots: robotsPage(chemin),
    alternates: canonique(chemin),
    openGraph: {
      type: "article",
      locale: "fr_FR",
      url: new URL(chemin, SITE_URL).toString(),
      title: titre,
      description,
    },
  };
}
