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
import { possessions } from "@/lib/espace";
import { redirect } from "next/navigation";
import { acceptUpsell } from "@/app/actions";
import { Header, Footer } from "./Chrome";
import { BoutonAchat as Button } from "./BoutonAchat";
import { getOrder, accesParEmail, assurerAcces } from "@/lib/db";
import { devisPour } from "@/lib/devis";
import { PRODUCTS, PRESENTATION, euros, type ProductSku } from "@/lib/config";
import { etapeTunnel } from "@/lib/tunnel";
import type { Ecran } from "@/lib/qualification";
import { SimulationPlan } from "./simulateur/SimulationPlan";
import { demarrerOffrePlan } from "@/app/profil";
import { ComparatifDecision } from "./ComparatifDecision";
import { PlanCheckoutChoice } from "./PlanCheckoutChoice";
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
  const [profil, accesExistant, etape] = await Promise.all([
    profilDeCommande(order.id),
    accesParEmail(order.email),
    etapeTunnel(ecran, order.id, { bumpPresent: order.items.some((i) => i.sku === "bump") }),
  ]);
  const acces = accesExistant ?? await assurerAcces({email:order.email,firstName:order.firstName});
  void alternative;
  if (!etape.afficher) redirect(etape.versOu);
  const contexte = conseilOffre(profil);
  const [d, acquis] = await Promise.all([
    devisPour(order.email, sku),
    sku === "upsell1" ? possessions(order.email) : Promise.resolve(null),
  ]);
  const dPackTestament = sku === "upsell1" && !acquis?.has("backend4")
    ? await devisPour(order.email, "pack5")
    : null;
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
    {sku === "upsell1" ? (
      <PlanCheckoutChoice action={action} planPrice={d.montant} bundlePrice={dPackTestament?.montant} />
    ) : (
      <form action={action} className="mt-6">
        <input type="hidden" name="montantAffiche" value={d.montant} />
        <Button>{`Vérifier mon assurance-vie · ${euros(d.montant)}`}</Button>
        <p className="mt-3 text-sm text-text-soft">Paiement unique sur votre carte enregistrée, uniquement si vous confirmez. Garantie commerciale de 30 jours selon les CGV. Aucun abonnement.</p>
      </form>
    )}
    <p className="mt-4 text-sm"><Link href={fin}>Non merci, continuer sans ce produit</Link></p>
  </section>;
  if (sku === "upsell1") return (
    <>
      <MesureFunnel evenement="vue_offre" />
      <MesurerAchat id={order.id} />
      <Header minimal />
      <main className="wrap flex-1 py-7 sm:py-10">
        <div className="mx-auto max-w-[840px]">
          <p className="font-bold uppercase tracking-wide text-orange-dark">Votre guide est acquis — passons à votre situation</p>
          <h1 className="my-3 text-[1.9rem] leading-tight sm:text-[2.35rem]">L’État appliquera les règles aux faits et aux actes réellement en place — pas à ce que vous pensiez avoir prévu.</h1>
          <p className="text-[1.08rem] leading-relaxed">Une donation oubliée, une mauvaise quote-part ou une clause non vérifiée peut déplacer fortement le résultat. Répondez à une question à la fois pour faire apparaître votre estimation, vos points de vigilance et l’ordre des vérifications à préparer.</p>
          <p className="mt-3 text-[1.08rem] leading-relaxed">Votre estimation fait aussi apparaître le montant que vos proches devraient réunir. Ils auraient six mois pour le payer ; au-delà, des intérêts de retard puis une majoration s’ajoutent. Mieux vaut connaître ce chiffre aujourd’hui, pendant que vous pouvez encore préparer de quoi le régler, que le leur laisser découvrir chez le notaire.</p>
          <SimulationPlan verrouille jeton={acces?.jeton} demarrerOffre={demarrer}>{decision}</SimulationPlan>
        </div>
      </main>
      <Footer />
      <SortieOffre produit={sku} href="#decision-complement" montant={d.montant} promotion={d.promotion}/>
    </>
  );
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
        <h1 className="my-4 text-[2rem] leading-tight">Votre assurance-vie peut transmettre exactement comme le contrat l’indique — et pas comme vous l’avez expliqué à votre famille.</h1>
        <p className="mb-3 text-[1.1rem] font-bold text-blue">{produit.name}</p>
        <p className="mb-6 border-l-4 border-orange bg-grey-bg p-4">{contexte.raison}</p>
        <p className="text-[1.2rem]">{texte?.promesse}</p>
        {sku === "upsell2" && (
          <section className="my-6 border-l-4 border-green bg-green-bg p-4">
            <h2 className="mb-2 text-[1.25rem]">Pendant que la succession se règle, votre contrat, lui, peut déjà verser.</h2>
            <p className="mb-2">Après un décès, les comptes sont bloqués, sauf pour certaines dépenses comme les obsèques, et les héritiers ont six mois pour payer les droits. Le capital d’une assurance-vie ne fait pas partie de la succession : l’assureur le verse directement aux bénéficiaires désignés, au plus tard un mois après avoir reçu les pièces demandées.</p>
            <p className="font-bold">Encore faut-il que la clause désigne les personnes que vous voulez protéger aujourd’hui. Sinon, il sera versé selon l’ancienne clause, pas selon votre volonté.</p>
            <p className="mt-2 text-sm text-text-soft">Articles L132-12 et L132-23-1 du Code des assurances. Ce rappel décrit ce que prévoit la loi ; ce n’est pas une recommandation de placement.</p>
          </section>
        )}
        <ComparatifDecision sku={sku} />
        {decision}
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
          Les explications sont écrites, avec des modèles à utiliser à votre rythme. Vous arrivez
          ainsi chez le professionnel avec vos informations classées et des questions précises.
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
