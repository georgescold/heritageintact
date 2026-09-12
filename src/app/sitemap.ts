import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { CHEMINS_INDEXABLES, PREFIXES_INDEXABLES, estIndexable } from "@/lib/seo";

/**
 * Le plan de site se déduit de la liste blanche de `lib/seo.ts` : une seule
 * source de vérité pour « cette page est publique ». Impossible d'annoncer à
 * Google une page qu'on a laissée en `noindex`, ni l'inverse.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = [...CHEMINS_INDEXABLES, ...PREFIXES_INDEXABLES].filter(estIndexable);
  const maintenant = new Date();
  return chemins.map((chemin) => ({
    url: new URL(chemin, SITE_URL).toString(),
    lastModified: maintenant,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
}
