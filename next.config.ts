import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * L'ÉTANCHÉITÉ DU JETON, POSÉE AU NIVEAU DE LA RÉPONSE HTTP.
   *
   * L'espace membre n'a pas de mot de passe : l'URL EST la clé. Tout ce qui
   * recopie une URL quelque part est donc une fuite d'accès, et trois de ces
   * recopieurs sont hors de portée du code applicatif — le navigateur qui
   * envoie un `Referer` au site suivant, le CDN qui met une page en cache, le
   * moteur qui indexe ce qu'il trouve. Ils n'obéissent qu'à des en-têtes.
   *
   * ⚠️ Ces trois lignes DOUBLENT ce que fait déjà le layout `/espace/[jeton]`
   * (`referrer: "no-referrer"`, `robots: noindex`, `force-dynamic`), et le
   * doublon est volontaire : la balise `<meta>` ne vaut que pour un document
   * HTML rendu par React, alors que l'en-tête couvre aussi ce qui sort de
   * l'espace sans passer par lui — une redirection, une réponse d'action, une
   * page servie depuis le cache de bordure avant même d'atteindre le rendu.
   */
  async headers() {
    return [
      {
        source: "/espace/:path*",
        headers: [
          // Sans ceci, le jeton du membre part dans l'en-tête `Referer` de
          // CHAQUE lien sortant — impots.gouv.fr, service-public.fr, le lecteur
          // vidéo — et se retrouve dans les journaux de serveurs tiers.
          { key: "Referrer-Policy", value: "no-referrer" },
          // Le CDN de Vercel ne doit JAMAIS servir la page d'un membre à un
          // autre. `private` interdit tout cache partagé, `no-store` interdit
          // aussi le disque du navigateur sur un ordinateur familial.
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          // Un jeton qui finit dans un index public est un accès public.
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      /**
       * LE TUNNEL D'UPSELLS PORTE LUI AUSSI UN IDENTIFIANT QUI VAUT UN DÉBIT.
       *
       * `?o=<orderId>` autorise un débit sur la carte enregistrée. Ces trois
       * pages embarquent un lecteur vidéo tiers, et chaque requête sortante
       * emportait l'URL complète — identifiant de commande compris — dans son
       * en-tête `Referer`, jusque dans les journaux d'un serveur qui n'est pas
       * le nôtre. La règle existait pour /espace et s'arrêtait là.
       *
       * `noindex` avec : une page de commande dans un index public est une
       * page de commande offerte à qui la cherche.
       */
      {
        source: "/:chemin(plan-complet|kit-assurance-vie|merci)",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },

  /**
   * LE DERNIER FILET CONTRE LA 404 GÉNÉRIQUE, SOUS /espace.
   *
   * `not-found.tsx` ne couvre que les segments RECONNUS — c'est-à-dire un
   * `notFound()` appelé depuis une page qui existe. Une URL abîmée en chemin
   * (« …/espace/a7f3k9…/etape/0 » recopiée avec un morceau de la signature du
   * mail collé derrière) ne correspond à aucune route : elle tombe directement
   * sur la 404 par défaut de Next, celle qui affiche « 404 » en gros.
   *
   * Sur quelqu'un qui a payé et qui doute déjà d'avoir bien fait, cet écran-là
   * ne se lit pas comme un incident technique mais comme la confirmation qu'il
   * s'est fait avoir — et il part en demande de remboursement le jour même.
   *
   * ⚠️ `fallback` et non `afterFiles` : ces règles ne sont examinées QU'APRÈS
   * toutes les routes réelles, juste avant le rendu de la 404. Aucune page
   * existante de l'espace ne peut donc être interceptée par erreur.
   *
   * ⚠️ Contrepartie assumée : une future route de l'espace mal orthographiée
   * n'affichera pas une 404 en développement, mais le formulaire de
   * récupération. C'est déroutant dix secondes pour nous, et c'est un client
   * sauvé.
   */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: "/espace/:chemin*", destination: "/espace" }],
    };
  },
};

export default nextConfig;
