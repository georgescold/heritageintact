import Image from "next/image";
import { PRODUCTS, euros, type ProductSku } from "@/lib/config";

/**
 * LE CHOIX À DEUX OPTIONS — celui où ajouter un produit fait BAISSER le prix.
 *
 * ═══ Pourquoi ce mécanisme fonctionne, et pourquoi il est licite ═══
 *
 * Le lecteur voit deux lignes. La première contient moins et coûte plus. Il
 * relit. Il cherche l'erreur. Il ne la trouve pas, parce qu'il n'y en a pas —
 * et à ce moment précis il coche la seconde sans plus réfléchir au prix, parce
 * que la question qu'il se pose a changé : ce n'est plus « est-ce que je paie
 * 297 € ? », c'est « pourquoi paierais-je 18 € de plus pour moins ? ».
 *
 * ⚠️ CE N'EST PAS UN ANCRAGE DE FAÇADE, et la différence est nette. Un ancrage
 * de façade barre un prix que personne ne paie jamais (art. L121-4). Ici les
 * DEUX prix sont réels et honorés : celui qui coche la première ligne paie
 * 297 € et reçoit exactement ce qui y est écrit. C'est un prix d'appel
 * volontairement moins attractif, ce que fait n'importe quel commerçant qui
 * range le petit format à côté du grand.
 *
 * ⚠️ ET ON ÉCRIT POURQUOI, JUSTE EN DESSOUS. Un prix qui surprend et qu'on
 * n'explique pas se lit comme une erreur — et la tentation serait alors de
 * laisser croire à l'erreur, ce qui est exactement la pratique trompeuse que
 * l'on refuse. Expliqué, le même prix se lit comme une maison qui sait ce
 * qu'elle fait. Sur un lecteur de 75 ans qui se méfie de tout, le second effet
 * vaut mieux que le premier.
 */

export type Option = {
  sku: ProductSku;
  /** Le titre de la ligne, tel qu'il se lit. */
  titre: string;
  /** Ce que cette ligne contient, en une phrase. */
  contenu: string;
  /** Le prix réellement débité pour cette ligne, palier compris. */
  prix: number;
  /** Le visuel, sous /img/produits. */
  visuel?: string;
  /** La ligne recommandée : celle qui contient plus et coûte moins. */
  recommandee?: boolean;
  /** Le lien qui déclenche l'achat de cette option. */
  href: string;
};

export function ChoixOffre({
  options,
  pourquoi,
}: {
  options: Option[];
  /** L'explication du prix qui surprend. Obligatoire, jamais facultative. */
  pourquoi: string;
}) {
  return (
    <div className="space-y-3">
      {options.map((o) => (
        <a
          key={o.sku}
          href={o.href}
          className={`block border-2 no-underline ${
            o.recommandee ? "border-green bg-green-bg" : "border-grey-line bg-white"
          }`}
        >
          {o.recommandee && (
            <p className="bg-green px-4 py-1.5 text-[0.85rem] font-bold uppercase tracking-wide text-white">
              Le plus complet — et le moins cher
            </p>
          )}
          <div className="flex items-start gap-4 p-4">
            {o.visuel && (
              <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden border border-grey-line sm:block">
                <Image
                  src={`/img/produits/${o.visuel}.jpg`}
                  alt=""
                  fill
                  sizes="6rem"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[1.15rem] font-bold text-blue">{o.titre}</p>
              <p className="mt-1 text-[1rem]">{o.contenu}</p>
            </div>
            <p
              className={`shrink-0 whitespace-nowrap text-[1.6rem] font-bold tabular-nums ${
                o.recommandee ? "text-green" : "text-text-soft"
              }`}
            >
              {euros(o.prix)}
            </p>
          </div>
        </a>
      ))}

      {/* L'explication n'est pas une note de bas de page : elle est la moitié du
          dispositif. Sans elle, le prix qui surprend se lit comme une erreur. */}
      <p className="border-l-4 border-blue bg-grey-bg p-4 text-[1.02rem]">
        <strong className="block text-blue">
          Pourquoi la deuxième ligne contient plus et coûte moins ?
        </strong>
        {pourquoi}
      </p>
    </div>
  );
}

/** Les deux options d'un écran, construites depuis le catalogue. */
export function optionsNotaire(
  seul: ProductSku,
  avecDossier: ProductSku,
  prixSeul: number,
  prixAvec: number,
  orderId: string,
  visuel: string,
): Option[] {
  return [
    {
      sku: seul,
      titre: `${PRODUCTS[seul].name} seul`,
      contenu: "Sans les feuilles à remplir avant votre rendez-vous chez le notaire.",
      prix: prixSeul,
      visuel,
      href: `/offre/${avecDossier}?o=${encodeURIComponent(orderId)}&choix=${seul}`,
    },
    {
      sku: avecDossier,
      titre: PRODUCTS[avecDossier].name,
      contenu:
        "Tout ce qui précède, plus les cinq feuilles à remplir au stylo avant votre rendez-vous.",
      prix: prixAvec,
      visuel,
      recommandee: true,
      href: `/offre/${avecDossier}?o=${encodeURIComponent(orderId)}&choix=${avecDossier}`,
    },
  ];
}
