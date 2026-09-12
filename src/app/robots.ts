import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/**
 * Le `noindex` des pages reste la barrière qui fait foi : il s'applique même
 * quand une adresse est découverte par un lien externe, ce qu'un `Disallow`
 * ne sait pas faire. Ce fichier n'est là que pour éviter de faire explorer
 * inutilement le tunnel et l'espace client.
 *
 * ⚠️ Ne jamais y bloquer une adresse qu'on veut désindexer : un robot qui ne
 * peut pas lire la page ne peut pas lire son `noindex` non plus.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/espace/",
          "/reprendre/",
          "/commande",
          "/commander",
          "/offre/",
          "/merci",
          "/bienvenue",
          "/situation",
          "/resultat-plan",
          "/desinscription",
          "/connexion",
          "/api/",
        ],
      },
    ],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: new URL(SITE_URL).host,
  };
}
