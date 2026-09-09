import Link from "next/link";
import { MesureFunnel } from "./MesureFunnel";
import { AvantageDemarrage } from "./AvantageDemarrage";
import { SortieOffre } from "./SortieOffre";
import { ObjectionsComplement } from "./ObjectionsComplement";
import { ApercuProduit } from "./ApercuProduit";
import { ValeurComplement } from "./ValeurComplement";
import { BilanComplement } from "./BilanComplement";
import { DemonstrationPack } from "./DemonstrationPack";
import { possessions } from "@/lib/espace";
import { alternativeAv } from "@/lib/complements";
import { MesurerAchat } from "./MetaPixel";
import { CHANGEMENTS, conseilOffre } from "@/lib/positionnement";
import { profilDeCommande } from "@/lib/db";
import { profilComplet } from "@/lib/questionnaire";
import { redirect } from "next/navigation";
import { acceptUpsell } from "@/app/actions";
import { Header, Footer } from "./Chrome";
import { BoutonAchat as Button } from "./BoutonAchat";
import { getOrder, accesParEmail } from "@/lib/db";
import { devisPour } from "@/lib/devis";
import { PRODUCTS, PRESENTATION, euros, type ProductSku } from "@/lib/config";
import { etapeTunnel } from "@/lib/tunnel";
import type { Ecran } from "@/lib/qualification";
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
  if (!profilComplet(profil)) redirect(`/situation?o=${encodeURIComponent(order.id)}`);
  const etape = await etapeTunnel(ecran, order.id, {
    bumpPresent: order.items.some((i) => i.sku === "bump"),
  });
  const possede = await possessions(order.email);
  const alternativeAutorisee =
    alternative &&
    sku === "upsell2" &&
    alternativeAv(profil, "pack1", possede);
  if (!etape.afficher && !alternativeAutorisee) redirect(etape.versOu);
  const contexte = conseilOffre(
    alternativeAutorisee ? { ...profil, objectif: "assurance-vie" } : profil,
  );
  const d = await devisPour(order.email, sku);
  const acces = await accesParEmail(order.email);
  const fin = `/merci?o=${encodeURIComponent(order.id)}`;
  if (d.dejaPossede) redirect(fin);
  const produit = PRODUCTS[sku],
    texte = PRESENTATION[sku];
  const autreDevis =
    !alternative && alternativeAv(profil, sku, possede)
      ? await devisPour(order.email, "upsell2")
      : null;
  const action = acceptUpsell.bind(null, order.id, sku, fin);
  return (
    <>
      <MesureFunnel evenement="vue_offre" />
      <MesurerAchat id={order.id} />
      <Header minimal />
      <main className="wrap flex-1 py-10">
        <p className="mb-5 border-l-4 border-green bg-green-bg p-4">
          Votre achat est confirmé.{" "}
          {acces && (
            <Link href={`/espace/${acces.jeton}`}>Vous pouvez ouvrir votre espace maintenant.</Link>
          )}
        </p>
        <p className="font-bold text-orange-dark">
          La suite recommandée pour votre priorité
        </p>
        <h1 className="my-4 text-[2rem] leading-tight">{contexte.titre}</h1>
        <p className="mb-3 text-[1.1rem] font-bold text-blue">{produit.name}</p>
        <p className="mb-6 border-l-4 border-orange bg-grey-bg p-4">{contexte.raison}</p>
        <p className="text-[1.2rem]">{texte?.promesse}</p>
        <section id="decision-complement" className="my-6 border-2 border-blue bg-grey-bg p-5">
          <h2 className="mb-3 text-[1.3rem]">{sku === "upsell2" ? "Ne laissez pas le contrat décider à votre place sans l’avoir relu." : "Le premier pas est payé. Donnez maintenant un fil à toute votre préparation."}</h2>
          <p className="mb-4">{sku === "upsell2" ? "Vous souhaitez protéger quelqu’un, pas simplement posséder un contrat. Retrouvez la clause, préparez la demande à l’assureur et gardez une trace des réponses. Les mots pour commencer sont déjà préparés." : "Vous savez désormais par où commencer. Le risque, maintenant, c’est de remettre la suite dans le même tiroir. Le pack ajoute l’exemple, les trames, les fiches de votre famille et l’atelier : une préparation que vous pouvez reprendre et apporter au rendez-vous."}</p>
          <p>Total de l’offre : {euros(d.total)} · Achats inclus déduits : {euros(d.credit)}.</p>
          {d.remise>0 && <p className="mt-2 font-bold text-orange-dark">Avantage de démarrage : −{euros(d.remise)} sur le complément restant.</p>}
          <AvantageDemarrage promotion={d.promotion} base={d.avantRemise}/>
          <p className="mt-2 text-[1.25rem] font-bold">À payer maintenant si vous confirmez : {euros(d.montant)}.</p>
        <form action={action} className="mt-6">
          <input type="hidden" name="montantAffiche" value={d.montant} />
          <Button>
            {d.montant === 0
              ? "Activer ce complément sans paiement"
              : `Oui, préparer la suite maintenant · ${euros(d.montant)}`}
          </Button>
          <p className="mt-3 text-sm text-text-soft">
            {d.montant === 0
              ? "Aucun débit."
              : "Paiement unique sur votre carte enregistrée, uniquement si vous confirmez."}{" "}
            Garantie commerciale de 30 jours selon les CGV. Aucun abonnement. En validant, vous
            demandez l’accès immédiat au contenu numérique et reconnaissez renoncer au droit de
            rétractation applicable à cette exécution immédiate.
          </p>
        </form>
          <p className="mt-4 text-sm"><Link href={fin}>Non merci, conserver mon achat actuel</Link></p>
        </section>
        <ValeurComplement av={sku === "upsell2"} complet={sku === "pack1"} />
        <ObjectionsComplement av={sku==="upsell2"} />
        <ApercuProduit pack={sku !== "upsell2"} av={sku === "upsell2"} />
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
        {sku === "pack1" && (
          <p className="mb-6 border-l-4 border-blue bg-grey-bg p-4">
            <strong>Votre assurance-vie est également prise en compte.</strong> Le module vous aide
            à retrouver les contrats, préparer la demande à l’assureur et classer ses réponses. Pas
            une recommandation d’ouvrir un contrat.
          </p>
        )}
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
        <p className="mb-4 font-bold">
          Vous complétez votre préparation. Vous ne repayez pas les contenus inclus déjà achetés.
        </p>
        <BilanComplement sku={sku} possede={possede} montant={d} />
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
            espace après la première étape, avec vos achats inclus déduits.
          </p>
        </details>
        <p className="mt-6">
          <Link href={fin}>Commencer avec mon achat actuel</Link>
        </p>
        {autreDevis && (
          <details className="mt-6 border-t border-grey-line py-4">
            <summary className="cursor-pointer font-bold">
              Le pack est trop large pour mon besoin actuel
            </summary>
            <p className="my-3">
              Vous avez indiqué avoir une assurance-vie. Si c’est votre seul sujet maintenant, vous
              pouvez examiner le module pour {euros(autreDevis.montant)} supplémentaires, sans
              ajouter le pack de préparation familiale. Votre Méthode reste accessible.
            </p>
            <Link href={`/kit-assurance-vie?o=${encodeURIComponent(order.id)}&alternative=1`}>
              Voir uniquement le module assurance-vie, sans acheter
            </Link>
          </details>
        )}
      </main>
      <Footer />
      <SortieOffre produit={sku} href="#decision-complement" montant={d.montant} promotion={d.promotion}/>
    </>
  );
}
