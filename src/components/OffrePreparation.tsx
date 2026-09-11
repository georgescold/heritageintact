import Link from "next/link";
import { MesureFunnel } from "./MesureFunnel";
import { AvantageDemarrage } from "./AvantageDemarrage";
import { SortieOffre } from "./SortieOffre";
import { ObjectionsComplement } from "./ObjectionsComplement";
import { ApercuProduit } from "./ApercuProduit";
import { ValeurComplement } from "./ValeurComplement";
import { DemonstrationPack } from "./DemonstrationPack";
import { MesurerAchat } from "./MetaPixel";
import { CHANGEMENTS, conseilOffre } from "@/lib/positionnement";
import { profilDeCommande } from "@/lib/db";
import { redirect } from "next/navigation";
import { acceptUpsell } from "@/app/actions";
import { Header, Footer } from "./Chrome";
import { BoutonAchat as Button } from "./BoutonAchat";
import { getOrder } from "@/lib/db";
import { devisPour } from "@/lib/devis";
import { PRODUCTS, PRESENTATION, euros, type ProductSku } from "@/lib/config";
import { etapeTunnel } from "@/lib/tunnel";
import type { Ecran } from "@/lib/qualification";
import { SimulationPlan } from "./simulateur/SimulationPlan";
import { demarrerOffrePlan } from "@/app/profil";
export async function OffrePreparation({
  id,
  sku,
  ecran,
  alternative = false,
}: {
  id?: string;
  sku: ProductSku;
  ecran: Ecran;
  alternative?: boolean;
}) {
  const order = id ? await getOrder(id) : null;
  if (!order || order.status !== "paid") redirect("/commande");
  const profil = await profilDeCommande(order.id);
  const etape = await etapeTunnel(ecran, order.id, {
    bumpPresent: order.items.some((i) => i.sku === "bump"),
  });
  void alternative;
  if (!etape.afficher) redirect(etape.versOu);
  const contexte = conseilOffre(profil);
  const d = await devisPour(order.email, sku);
  const fin = sku === "upsell1" ? `/bienvenue?o=${encodeURIComponent(order.id)}&retour=1` : etape.suivant;
  if (d.dejaPossede) redirect(fin);
  const produit = PRODUCTS[sku],
    texte = PRESENTATION[sku];
  const apresAchat = sku === "upsell1" ? `/resultat-plan?o=${encodeURIComponent(order.id)}` : fin;
  const action = acceptUpsell.bind(null, order.id, sku, apresAchat);
  const demarrer = demarrerOffrePlan.bind(null, order.id);
  const decision = <section id="decision-complement" className="my-6 border-2 border-blue bg-grey-bg p-5">
    <p className="text-sm font-bold uppercase text-orange-dark">{sku === "upsell1" ? "Votre simulation est prête à être déverrouillée" : "Dernière étape de votre parcours"}</p>
    <h2 className="mb-3 mt-2 text-[1.45rem]">{produit.name}</h2>
    <p className="mb-4">{sku === "upsell2" ? "Votre relevé peut afficher le bon capital tout en cachant le mauvais nom. Obtenez la clause que l’assureur exécutera, reconstruisez les versements et préparez sa vérification tant qu’une correction reste possible." : "Vos réponses ont déjà révélé les premiers points sensibles. Ne repartez pas avec un aperçu impossible à hiérarchiser : déverrouillez le résultat expliqué, les hypothèses capables de le changer et l’ordre précis des vérifications."}</p>
    {sku === "upsell1" && (d.montant < d.total ? <p className="mb-2"><span className="line-through">Prix habituel : {euros(d.total)}</span> · <strong className="text-red">Votre prix actuel : {euros(d.montant)}</strong></p> : <p className="mb-2 font-bold">Paiement unique : {euros(d.montant)}</p>)}
    {sku === "upsell2" && <p className="mb-2 font-bold">Paiement unique : {euros(d.montant)}</p>}
    <AvantageDemarrage promotion={d.promotion} base={d.total}/>
    <form action={action} className="mt-6">
      <input type="hidden" name="montantAffiche" value={d.montant} />
      <Button>{sku === "upsell1" ? `Déverrouiller mon simulateur et mon plan · ${euros(d.montant)}` : `Vérifier mon assurance-vie · ${euros(d.montant)}`}</Button>
      <p className="mt-3 text-sm text-text-soft">Paiement unique sur votre carte enregistrée, uniquement si vous confirmez. Garantie commerciale de 30 jours selon les CGV. Aucun abonnement.</p>
    </form>
    <p className="mt-4 text-sm"><Link href={fin}>Non merci, continuer sans ce produit</Link></p>
  </section>;
  return (
    <>
      <MesureFunnel evenement="vue_offre" />
      <MesurerAchat id={order.id} />
      <Header minimal />
      <main className="wrap flex-1 py-10">
        <p className="mb-5 border-l-4 border-green bg-green-bg p-4">Votre guide est bien acquis. Voici maintenant la prochaine décision, clairement séparée de votre premier achat.</p>
        <p className="font-bold text-orange-dark">
          Ce que vous devez absolument avoir également
        </p>
        <h1 className="my-4 text-[2rem] leading-tight">{sku === "upsell1" ? "Vous pouvez tout préparer avec sérieux… et commencer par ce qui compte le moins." : "Votre assurance-vie peut transmettre exactement comme le contrat l’indique — et pas comme vous l’avez expliqué à votre famille."}</h1>
        <p className="mb-3 text-[1.1rem] font-bold text-blue">{produit.name}</p>
        <p className="mb-6 border-l-4 border-orange bg-grey-bg p-4">{sku === "upsell1" ? "Votre famille, vos biens, les aides passées et les dates forment un seul problème d’ordre. Tant qu’ils restent séparés, le point le plus urgent peut rester invisible derrière la démarche la plus facile." : contexte.raison}</p>
        <p className="text-[1.2rem]">{texte?.promesse}</p>
        {sku === "upsell1" ? <SimulationPlan verrouille demarrerOffre={demarrer}>{decision}</SimulationPlan> : decision}
        <ValeurComplement av={sku === "upsell2"} />
        <ObjectionsComplement av={sku==="upsell2"} />
        <ApercuProduit plan={sku !== "upsell2"} av={sku === "upsell2"} />
        {sku !== "upsell2" && <DemonstrationPack />}
        <h2 className="mb-4 text-[1.5rem]">Ce que vous pourrez préparer, concrètement</h2>
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {(sku === "upsell2"
            ? [
                [
                  "Retrouver la bonne version",
                  "Relever les informations du contrat et demander la clause actuellement enregistrée.",
                ],
                [
                  "Préparer un échange utile",
                  "Utiliser la grille, la demande à l’assureur et le suivi pour distinguer réponse confirmée et point en suspens.",
                ],
              ]
            : CHANGEMENTS
          ).map(([t, c]) => (
            <article key={t} className="border border-grey-line p-5">
              <h3 className="mb-2">{t}</h3>
              <p className="text-[1rem]">{c}</p>
            </article>
          ))}
        </div>
        <h2 className="mb-3 mt-8 text-[1.4rem]">Tout ce qui est compris</h2>
        <ul className="list-disc space-y-3 pl-6">
          {texte?.contenu.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="my-6 text-text-soft">
          Les explications sont écrites, avec des modèles à utiliser à votre rythme. Les supports
          orientent votre préparation ; ils ne remplacent pas une consultation individuelle.
        </p>
        <p className="mb-4 font-bold">Ce produit est distinct de votre guide et du Dossier notaire : un prix unique, sans calcul de crédit à comprendre.</p>
        <div className="mt-6 border border-green bg-green-bg p-4">
          <h2 className="mb-2 text-[1.15rem]">Votre premier achat reste acquis</h2>
          <p>
            Vous pouvez le terminer sans ce complément. En choisissant cette offre, vous retrouvez
            les nouveaux supports et leur mode d’emploi dans le même espace.
          </p>
        </div>
        <p className="mt-6"><a href="#decision-complement" className="inline-flex min-h-[48px] items-center font-bold">Revenir à la proposition et au montant à payer ↑</a></p>
        <details className="mt-6 border-y border-grey-line py-4">
          <summary className="cursor-pointer font-bold">Et si je préfère attendre ?</summary>
          <p className="mt-3">
            Commencez avec votre achat actuel. Vous pourrez retrouver les compléments dans votre
            espace après la première étape, à son tarif affiché au moment de votre décision.
          </p>
        </details>
        <p className="mt-6">
          <Link href={fin}>Commencer avec mon achat actuel</Link>
        </p>
      </main>
      <Footer />
      <SortieOffre produit={sku} href="#decision-complement" montant={d.montant} promotion={d.promotion}/>
    </>
  );
}
