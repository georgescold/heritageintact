import { avantagePack, bilanSupports } from "@/lib/complements";
import { euros, PRODUCTS, type ProductSku } from "@/lib/config";
import type { devis } from "@/lib/prix";

export function BilanComplement({
  sku,
  possede,
  montant,
}: {
  sku: ProductSku;
  possede: Set<ProductSku>;
  montant: ReturnType<typeof devis>;
}) {
  const bilan = bilanSupports(sku, possede);
  const pack = avantagePack();
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
        {montant.credit > 0 && (
          <p className="mb-3 font-bold text-blue">
            {euros(montant.credit)} d’achats inclus déjà payés sont déduits automatiquement.
          </p>
        )}
        <dl className="space-y-3">
          <div className="flex justify-between gap-4">
            <dt>Total de l’offre</dt>
            <dd>{euros(montant.total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Achats inclus déduits</dt>
            <dd>− {euros(montant.credit)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-3 text-[1.4rem] font-bold">
            <dt>À payer si vous confirmez</dt>
            <dd>{euros(montant.montant)}</dd>
          </div>
        </dl>
        {sku === "pack1" && pack.difference > 0 && (
          <p className="mt-4 border-l-4 border-orange bg-grey-bg p-3">
            <strong>L’avantage du pack : {euros(pack.difference)} de moins.</strong> Préparation (
            {euros(PRODUCTS.upsell1.price)}) + assurance-vie ({euros(PRODUCTS.upsell2.price)})
            représentent {euros(pack.separes)} aux tarifs catalogue séparés ; réunies,{" "}
            {euros(pack.ensemble)} au total, avant déduction de vos achats inclus.
          </p>
        )}
        <p className="mt-4 text-sm text-text-soft">
          Cette déduction provient de vos achats inclus, pas d’un solde à réclamer. Elle ne
          disparaît pas ce soir. Le devis est recalculé avant paiement ; aucun abonnement.
        </p>
      </div>
    </section>
  );
}
