import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * LE LAYOUT DE TOUT CE QUI PORTE UN JETON.
 *
 * Il n'ajoute aucun décor — chaque page pose son propre Header et son Footer,
 * parce que l'écran de secours et les feuilles à imprimer n'ont pas le même
 * habillage. Il n'existe que pour poser deux règles sur l'ensemble de la
 * branche, et pour qu'aucune page future ne puisse les oublier.
 *
 * ⚠️ `referrer: "no-referrer"` — SANS LUI, LE JETON FUIT. L'espace n'a pas de
 * mot de passe : l'URL est la clé. Un clic vers impots.gouv.fr, service-public
 * ou le lecteur vidéo emporterait l'adresse complète dans l'en-tête `Referer`,
 * et le jeton se retrouverait dans les journaux d'un serveur tiers. La même
 * règle est doublée en en-tête HTTP dans `next.config.ts` : la balise couvre le
 * document, l'en-tête couvre tout le reste.
 *
 * ⚠️ `force-dynamic` — AUCUNE PAGE À JETON N'EST MISE EN CACHE. Une page
 * d'espace servie depuis un cache est, au mieux, la progression de quelqu'un
 * d'autre affichée à un membre ; au pire, l'inverse.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function EspaceMembreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
