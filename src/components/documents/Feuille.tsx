import type { ReactNode } from "react";
import { BRAND } from "@/lib/config";

/**
 * LE GABARIT A4 COMMUN À TOUS LES DOCUMENTS IMPRIMABLES.
 *
 * ⚠️ La classe racine est `feuille`, et ce n'est pas décoratif : le lot
 * Impression pose dessus un `break-before: page` en `@media print`. La changer
 * fait sortir tout le classeur sur une seule feuille interminable.
 *
 * ═══ Pourquoi ce document est en noir et blanc, sans une seule teinte ═══
 *
 * L'acheteur a 70 ans et imprime chez lui, sur une imprimante à jet d'encre
 * dont la cartouche coûte 30 € — soit plus que Le guide. Un aplat de couleur
 * sur quatorze pages, c'est une cartouche vidée, et c'est le premier email de
 * réclamation. Bordures 1 px, texte noir, fond blanc : le document est aussi
 * lisible photocopié qu'à l'écran.
 *
 * ═══ Pourquoi l'avertissement est répété sur CHAQUE feuille ═══
 *
 * Les feuilles sont imprimées, séparées, glissées dans un classeur et lues des
 * mois plus tard, parfois par un enfant qui n'a jamais vu le site. Une mention
 * légale posée une seule fois en page de garde ne survit pas à ce voyage.
 */
export function Feuille({
  titre,
  sousTitre,
  children,
}: {
  titre: string;
  sousTitre?: string;
  children: ReactNode;
}) {
  return (
    <article className="feuille mx-auto w-full max-w-[190mm] border border-black bg-white p-6 text-black sm:p-8">
      <header className="mb-5 border-b-2 border-black pb-3">
        <p className="mb-1 text-[0.8rem] uppercase tracking-wide">{BRAND}</p>
        <h2 className="text-[1.4rem] font-bold leading-tight text-black">{titre}</h2>
        {sousTitre && <p className="mt-1 text-[1rem] leading-snug">{sousTitre}</p>}
      </header>

      <div className="space-y-4 text-[1rem] leading-relaxed">{children}</div>

      <footer className="mt-6 border-t border-black pt-3 text-[0.78rem] leading-snug">
        Ce support organise vos informations et prépare vos questions. Le professionnel pourra
        ensuite confirmer la solution adaptée à partir de vos pièces et de votre situation.
      </footer>
    </article>
  );
}

/**
 * Un intertitre de document. Séparé de `h3` parce que la feuille impose sa
 * propre échelle : les titres du site sont bleus, ceux du papier sont noirs.
 */
export function Titre({ children }: { children: ReactNode }) {
  return <h3 className="mt-5 text-[1.1rem] font-bold text-black">{children}</h3>;
}

/**
 * Une ligne à remplir au stylo.
 *
 * ⚠️ La hauteur minimale de 44 px n'est pas un réflexe d'interface tactile
 * recopié par erreur : c'est la place qu'il faut pour écrire un montant à la
 * main, sur du papier, avec une main de 75 ans.
 */
export function Champ({ label, indice }: { label: string; indice?: string }) {
  return (
    <div className="flex min-h-[44px] flex-wrap items-end gap-x-3 border-b border-black pb-1">
      <span className="font-bold">{label}</span>
      {indice && <span className="text-[0.85rem]">{indice}</span>}
    </div>
  );
}

/** Une case à cocher au stylo, avec sa consigne. */
export function Case({ children }: { children: ReactNode }) {
  return (
    <li className="flex min-h-[36px] items-start gap-3">
      <span aria-hidden className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black" />
      <span>{children}</span>
    </li>
  );
}

/**
 * Un tableau vierge à remplir. `lignes` compte les lignes VIDES : le nombre
 * doit tenir sur la feuille sans déborder en page 2, sinon le classeur se
 * remplit de demi-pages.
 */
export function TableauVierge({ colonnes, lignes }: { colonnes: string[]; lignes: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[16rem] border-collapse text-left text-[0.92rem]">
        <thead>
          <tr>
            {colonnes.map((c) => (
              <th key={c} className="border border-black px-2 py-1.5 align-bottom font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: lignes }, (_, i) => (
            <tr key={i}>
              {colonnes.map((c) => (
                <td key={c} className="h-[36px] border border-black px-2 py-1.5" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** L'encadré « à retenir ». Bordure épaisse, aucun fond : voir plus haut. */
export function Encadre({ titre, children }: { titre?: string; children: ReactNode }) {
  return (
    <div className="border-2 border-black p-3">
      {titre && <p className="mb-1 font-bold">{titre}</p>}
      {children}
    </div>
  );
}

/**
 * L'article du CGI qui porte le chiffre affiché juste au-dessus.
 *
 * ⚠️ Aucun chiffre ne s'écrit sans sa source dans ce produit. C'est ce qui
 * sépare une démarche pédagogique d'un conseil : le lecteur peut vérifier
 * lui-même sur legifrance.gouv.fr, et son notaire aussi.
 */
export function Source({ children }: { children: ReactNode }) {
  return <p className="text-[0.82rem]">{children}</p>;
}
