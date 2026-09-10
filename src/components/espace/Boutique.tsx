import Link from "next/link";
import { suspendreComplements } from "@/app/espace/preferences";
import { conseilOffre } from "@/lib/positionnement";
import { PRODUCTS, PRESENTATION, euros, type ProductSku } from "@/lib/config";
import { devisPour } from "@/lib/devis";
import type { EtatEspace } from "@/lib/espace";
import { motifEtape } from "@/lib/complements";
import { commandesPayeesParEmail } from "@/lib/db";
export const resumeProduit = (sku: ProductSku) =>
  PRESENTATION[sku]?.promesse ?? "Support pédagogique de préparation.";
export const avantagesProduit = (sku: ProductSku) => PRESENTATION[sku]?.contenu ?? [];
export async function Boutique({ etat }: { etat: EtatEspace }) {
  const offres = etat.boutique
    .filter((s) => !(etat.profil?.av !== "O" && (s === "upsell2" || s === "pack1")))
    .slice(0, 1);
  if (!offres.length) return null;
  const commandes = await commandesPayeesParEmail(etat.acces.email);
  const commandeGuide = [...commandes].reverse().find(c => c.items.some(i => i.sku === "front" && !i.rembourse));
  return (
    <section>
      <h2 className="mb-3 text-[1.4rem]">Passez maintenant de la lecture à votre situation</h2>
      <p className="mb-4 border-l-4 border-orange bg-grey-bg p-4">
        {conseilOffre(etat.profil).raison}
      </p>
      <p className="mb-4">
        Votre achat actuel reste utilisable seul. Chaque proposition ci-dessous correspond à un produit distinct.
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
            return (
              <article key={sku} className="border border-grey-line p-5">
                <h3 className="text-[1.25rem]">{PRODUCTS[sku].name}</h3>
                {motif && <p className="my-3 border-l-4 border-orange bg-grey-bg p-3">{motif}</p>}
                <p className="my-3">{resumeProduit(sku)}</p>
                <p className="font-bold">{sku === "upsell1" ? "Le questionnaire est gratuit. Votre résultat complet sera proposé après votre aperçu." : `Complément : ${euros(d.montant)}`}</p>
                {d.remise>0 && <p className="mt-2 font-bold text-orange-dark">Avantage en cours : −{euros(d.remise)} sur le complément.</p>}
                <p className="my-3 text-text-soft">Paiement unique · aucun abonnement</p>
                <Link
                  className="flex min-h-[52px] items-center justify-center bg-blue p-3 text-center font-bold text-white no-underline"
                  href={sku === "upsell1" && commandeGuide ? `/plan-complet?o=${encodeURIComponent(commandeGuide.id)}` : `/espace/${etat.acces.jeton}/ajouter/${sku}`}
                >
                  {sku === "upsell1" ? "Obtenir mon plan personnalisé" : "Voir le contenu et confirmer"}
                </Link>
              </article>
            );
          }),
        )}
      </div>
    </section>
  );
}
