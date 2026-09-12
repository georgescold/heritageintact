/**
 * LE PIXEL META DU NAVIGATEUR.
 *
 * ⚠️ LE PIXEL ENVOIE À META L'ADRESSE COMPLÈTE DE LA PAGE. Sur ce site, plusieurs
 * adresses SONT des clés : le lien de l'espace client, le `?o=` du tunnel (qui
 * autorise un débit sur la carte enregistrée), le lien de désinscription. Le
 * pixel n'est donc jamais chargé sur ces chemins. Et il ne suit ni les
 * navigations internes tout seul (`disablePushState`), ni les clics
 * (`autoConfig` coupé) : sans cela, une page publique qui mène vers l'espace
 * enverrait le jeton à Meta. Les navigations internes sont comptées par
 * `SuiviPagesMeta`, qui applique la même liste.
 *
 * ⚠️ Chargé sans recueil de consentement, à la demande de Loys (11 septembre
 * 2026) : le bandeau viendra ensuite. La politique de confidentialité le décrit.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "3751904564985082";

/** Les chemins dont l'adresse porte une clé ou un identifiant de commande. */
const CHEMINS_PRIVES =
  "^/(espace|reprendre|offre|plan-complet|kit-assurance-vie|dossier-complet|situation|bienvenue|merci|resultat-plan|simulateur-seul|desinscription|derniere-chance|commande/confirmation)(/|$)";

export const cheminSansPixel = (chemin: string) => new RegExp(CHEMINS_PRIVES).test(chemin);

/** Le code de base fourni par Meta, précédé du garde des chemins privés. */
export function scriptPixelMeta(): string {
  const id = JSON.stringify(META_PIXEL_ID);
  return `(function(){if(new RegExp(${JSON.stringify(CHEMINS_PRIVES)}).test(location.pathname))return;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq.disablePushState=true;fbq('set','autoConfig',false,${id});fbq('init',${id});fbq('track','PageView');})();`;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Un achat mesurable : le montant réellement débité, et l'identifiant partagé avec l'envoi serveur. */
export type MesureAchat = { eventId: string; valeur: number };

/** Un événement standard du parcours. Sans pixel chargé (page privée), rien ne part. */
export function evenementPixel(nom: "ViewContent" | "Lead" | "InitiateCheckout"): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", nom);
}

/**
 * L'ACHAT.
 *
 * Déclenché depuis la page de commande, dont l'adresse est publique : les pages
 * qui suivent le paiement portent l'identifiant de commande et n'ont pas de pixel.
 * L'`eventID` est celui de l'envoi serveur (lib/meta-conversions.ts) : le jour où
 * les deux fonctionneront ensemble, Meta ne comptera l'achat qu'une fois.
 */
export function achatPixel(mesure?: MesureAchat | null): void {
  if (!mesure || typeof window === "undefined") return;
  window.fbq?.("track", "Purchase", { value: mesure.valeur, currency: "EUR" }, { eventID: mesure.eventId });
}
