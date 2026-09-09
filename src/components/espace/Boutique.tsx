import Link from "next/link";
import { suspendreComplements } from "@/app/espace/preferences";
import { conseilOffre } from "@/lib/positionnement";
import { PRODUCTS, PRESENTATION, euros, type ProductSku } from "@/lib/config";
import { devisPour } from "@/lib/devis";
import type { EtatEspace } from "@/lib/espace";
import { motifEtape, avantagePack } from "@/lib/complements";
export const resumeProduit = (sku: ProductSku) =>
  PRESENTATION[sku]?.promesse ?? "Support pédagogique de préparation.";
export const avantagesProduit = (sku: ProductSku) => PRESENTATION[sku]?.contenu ?? [];
export async function Boutique({ etat }: { etat: EtatEspace }) {
  const offres = etat.boutique
    .filter((s) => !(etat.profil?.av !== "O" && (s === "upsell2" || s === "pack1")))
    .slice(0, 1);
  if (!offres.length) return null;
  return (
    <section>
      <h2 className="mb-3 text-[1.4rem]">Pour aller plus loin, si vous en avez besoin</h2>
      <p className="mb-4 border-l-4 border-orange bg-grey-bg p-4">
        {conseilOffre(etat.profil).raison}
      </p>
      <p className="mb-4">
        Votre achat actuel reste utilisable seul. Les achats inclus déjà payés sont déduits du pack.
      </p>
      {etat.acces.envoyes.includes("ltv-pause") ? (
        <p className="mb-4 text-sm">
          Les relances par email sur les compléments sont suspendues. Vos offres restent
          consultables ici.
        </p>
      ) : (
        <form action={suspendreComplements.bind(null, etat.acces.jeton)} className="mb-4">
          <button className="min-h-[44px] text-sm underline">
            Ne pas me relancer par email sur les compléments
          </button>
        </form>
      )}
      <div className="space-y-4">
        {await Promise.all(
          offres.map(async (sku) => {
            const d = await devisPour(etat.acces.email, sku);
            const motif =
              etat.epingle?.sku === sku ? motifEtape(sku, etat.epingle.etape.cle) : null;
            const pack = avantagePack();
            return (
              <article key={sku} className="border border-grey-line p-5">
                <h3 className="text-[1.25rem]">{PRODUCTS[sku].name}</h3>
                {motif && <p className="my-3 border-l-4 border-orange bg-grey-bg p-3">{motif}</p>}
                <p className="my-3">{resumeProduit(sku)}</p>
                <p className="font-bold">Complément : {euros(d.montant)}</p>
                {d.remise>0 && <p className="mt-2 font-bold text-orange-dark">Avantage en cours : −{euros(d.remise)} sur le complément.</p>}
                {d.credit > 0 && (
                  <p className="mt-2 font-bold text-blue">
                    {euros(d.credit)} de vos achats inclus sont déjà déduits.
                  </p>
                )}
                {sku === "pack1" && (
                  <p className="mt-2 text-sm">
                    Réunis à {euros(pack.ensemble)} au total, contre {euros(pack.separes)} aux
                    tarifs catalogue séparés, avant déduction de vos achats inclus.
                  </p>
                )}
                <p className="my-3 text-text-soft">
                  Total {euros(d.total)} · achats inclus déduits {euros(d.credit)}
                </p>
                <Link
                  className="flex min-h-[52px] items-center justify-center bg-blue p-3 text-center font-bold text-white no-underline"
                  href={`/espace/${etat.acces.jeton}/ajouter/${sku}`}
                >
                  Voir le contenu et confirmer
                </Link>
              </article>
            );
          }),
        )}
      </div>
    </section>
  );
}
