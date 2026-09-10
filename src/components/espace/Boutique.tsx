import Link from "next/link";
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
  const presentePlan = offres[0] === "upsell1";
  return (
    <section className={presentePlan ? "border-2 border-orange bg-[#fff8ed] p-5 shadow-[0_8px_24px_rgba(9,55,96,0.12)] sm:p-7" : ""}>
      {presentePlan ? (
        <>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-orange-dark">
            Votre prochaine étape
          </p>
          <h2 className="mb-4 text-[1.65rem] leading-tight sm:text-[2rem]">
            Passez maintenant à l’étape la plus importante :
          </h2>
          <p className="mb-4 text-[1.15rem] font-bold leading-relaxed text-blue sm:text-[1.3rem]">
            Simulez entièrement votre situation et ressortez avec ce que vous devez faire vérifier,
            dans quel ordre agir et quels documents retrouver pour préparer votre famille.
          </p>
          <p className="mb-5 border-l-4 border-orange bg-white p-4 text-[1.05rem] leading-relaxed">
            Ne restez pas avec sept erreurs générales en tête : reliez-les maintenant à votre âge,
            votre famille, votre maison, vos donations et votre assurance-vie. {conseilOffre(etat.profil).raison}
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-3 text-[1.4rem]">Le complément qui correspond à votre situation</h2>
          <p className="mb-4 border-l-4 border-orange bg-grey-bg p-4">
            {conseilOffre(etat.profil).raison}
          </p>
        </>
      )}
      <div className="space-y-4">
        {await Promise.all(
          offres.map(async (sku) => {
            const d = await devisPour(etat.acces.email, sku);
            const motif =
              etat.epingle?.sku === sku ? motifEtape(sku, etat.epingle.etape.cle) : null;
            return (
              <article key={sku} className={presentePlan ? "border-2 border-blue bg-white p-5 sm:p-6" : "border border-grey-line p-5"}>
                <h3 className="text-[1.25rem]">{PRODUCTS[sku].name}</h3>
                {motif && <p className="my-3 border-l-4 border-orange bg-grey-bg p-3">{motif}</p>}
                <p className="my-3">{resumeProduit(sku)}</p>
                {sku !== "upsell1" && <p className="font-bold">Complément : {euros(d.montant)}</p>}
                {d.remise>0 && <p className="mt-2 font-bold text-orange-dark">Avantage en cours : −{euros(d.remise)} sur le complément.</p>}
                {sku !== "upsell1" && <p className="my-3 text-text-soft">Paiement unique · aucun abonnement</p>}
                <Link
                  className="flex min-h-[52px] items-center justify-center bg-blue p-3 text-center font-bold text-white no-underline"
                  href={sku === "upsell1" && commandeGuide ? `/plan-complet?o=${encodeURIComponent(commandeGuide.id)}` : `/espace/${etat.acces.jeton}/ajouter/${sku}`}
                >
                  {sku === "upsell1" ? "Simuler entièrement ma situation" : "Voir le contenu et confirmer"}
                </Link>
              </article>
            );
          }),
        )}
      </div>
    </section>
  );
}
