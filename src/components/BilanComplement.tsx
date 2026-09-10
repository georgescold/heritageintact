import { bilanSupports } from "@/lib/complements";
import { euros, type ProductSku } from "@/lib/config";
import type { devisPour } from "@/lib/devis";

export function BilanComplement({
  sku,
  possede,
  montant,
}: {
  sku: ProductSku;
  possede: Set<ProductSku>;
  montant: Awaited<ReturnType<typeof devisPour>>;
}) {
  const bilan = bilanSupports(sku, possede);
  return (
    <section
      className="my-7 overflow-hidden border-2 border-blue"
      aria-label="Ce que vous gardez, ce que vous ajoutez et le prix"
    >
      <div className="grid sm:grid-cols-2">
        <div className="bg-grey-bg p-5">
          <h2 className="mb-3 text-[1.2rem]">Vous conservez</h2>
          {bilan.acquis.length ? (
            <ul className="list-disc space-y-2 pl-5">
              {bilan.acquis.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : (
            <p>Vos achats actuels restent accessibles.</p>
          )}
        </div>
        <div className="p-5">
          <h2 className="mb-3 text-[1.2rem]">Vous ajoutez</h2>
          <ul className="list-disc space-y-2 pl-5">
            {bilan.ajoutes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-grey-line p-5">
        <dl className="space-y-3">
          <div className="flex justify-between gap-4">
            <dt>Prix habituel de ce produit</dt>
            <dd>{euros(montant.total)}</dd>
          </div>
          {montant.remise>0 && <div className="flex justify-between gap-4 text-base text-orange-dark"><dt>Avantage personnel en cours</dt><dd>− {euros(montant.remise)}</dd></div>}
          <div className="flex flex-wrap justify-between gap-3 text-[1.4rem] font-bold">
            <dt>À payer si vous confirmez</dt>
            <dd>{euros(montant.montant)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-text-soft">
          Ce produit est facturé séparément. Le prix est recalculé avant paiement ; aucun abonnement.
        </p>
      </div>
    </section>
  );
}
