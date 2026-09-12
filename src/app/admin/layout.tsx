import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/config";

/**
 * LE PANEL N'EST PAS UNE PAGE DU SITE.
 *
 * Ni Header, ni Footer, ni pixel, ni mesure : rien de la chrome publique n'a sa
 * place ici. C'est aussi une précaution concrète — `MetaPixel` et `MesureFunnel`
 * ne doivent jamais s'exécuter sur un écran qui affiche des adresses email en
 * clair.
 *
 * ⚠️ `noindex, nofollow` est posé ici ET `/admin` est refusé dans robots.ts. Les
 * deux, parce qu'ils ne protègent pas de la même chose : le robots.txt évite
 * l'exploration, la balise évite l'indexation d'une adresse découverte par un
 * lien. Celle qui fait foi est la balise.
 */
export const metadata: Metadata = {
  title: `Pilotage — ${BRAND}`,
  robots: { index: false, follow: false, nocache: true },
};

/** Aucune page du panel ne doit être servie depuis un cache. */
export const dynamic = "force-dynamic";

export default function LayoutAdmin({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-grey-bg">{children}</div>;
}
