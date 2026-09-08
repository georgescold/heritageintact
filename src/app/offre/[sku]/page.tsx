import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ChoixOffre } from "@/components/ChoixOffre";
import { UpsellPage } from "@/components/UpsellPage";
import { PRODUCTS, VIDEO, euros, type ProductSku } from "@/lib/config";
import { getOrder } from "@/lib/db";
import { appliquerPalier, creditDe, palierDe, resteEnClair } from "@/lib/palier";
import { etapeTunnel } from "@/lib/tunnel";
import type { Ecran } from "@/lib/qualification";

/**
 * LES TROIS PACKS « NOTAIRE », SUR UNE SEULE PAGE.
 *
 * Ils ne diffèrent que par leur contenu et leur pile de valeur : les écrire en
 * trois fichiers presque identiques garantissait qu'ils divergent — un prix
 * corrigé ici et pas là, une mention légale mise à jour deux fois sur trois.
 * Une seule page, une table de données, et la divergence devient impossible.
 *
 * ⚠️ Le pack1 garde sa page propre (/dossier-complet) : c'est le seul dont le
 * texte argumente une remise que le lecteur doit vérifier ligne à ligne, et
 * cette démonstration ne se paramètre pas.
 */

const OFFRES: Record<
  string,
  { ecran: Ecran; h1: string; contenu: string[]; visuel: string; seul: ProductSku }
> = {
  pack2: {
    ecran: "plan-notaire",
    visuel: "plan-familial",
    seul: "upsell1",
    h1: "Le plan de votre situation, et de quoi vous en servir dès demain.",
    contenu: [
      "12 plans-types, une page par situation familiale|197 €",
      "Le Simulateur Automatique (plusieurs héritiers, plusieurs contrats, démembrement)|147 €",
      "Le Calendrier de Transmission sur 15 ans : quoi faire, quelle année|67 €",
      "3 modèles de clause bénéficiaire commentés|47 €",
      "Le tableau de bord familial : qui reçoit quoi, quand, à quel coût|39 €",
      "Le Dossier à apporter chez votre notaire — offert|47 €",
    ],
  },
  pack3: {
    ecran: "pack-notaire",
    visuel: "dossier-complet",
    seul: "pack1",
    h1: "Vos deux urgences traitées ensemble, et de quoi vous en servir dès demain.",
    contenu: [
      "12 plans-types, une page par situation familiale|197 €",
      "Le Simulateur Automatique (plusieurs héritiers, plusieurs contrats, démembrement)|147 €",
      "Le Calendrier de Transmission sur 15 ans : quoi faire, quelle année|67 €",
      "Le tableau de bord familial : qui reçoit quoi, quand, à quel coût|39 €",
      "L'audit de votre contrat en 30 minutes : la grille notée sur 10|67 €",
      "Le tableau de décision « avant / après 70 ans »|37 €",
      "La lettre-type pour demander la modification à votre assureur|27 €",
      "Le comparatif des frais : ce que 3 % sur 20 ans coûte réellement|19 €",
      "3 modèles de clause bénéficiaire commentés — comptés une seule fois|47 €",
      "Le Dossier à apporter chez votre notaire — offert|47 €",
    ],
  },
  pack4: {
    ecran: "assurance-vie-notaire",
    visuel: "assurance-vie",
    seul: "upsell2",
    h1: "Votre contrat relu, et de quoi préparer le rendez-vous qui suivra.",
    contenu: [
      "L'audit de votre contrat en 30 minutes : la grille notée sur 10|67 €",
      "Les 3 clauses bénéficiaires rédigées et commentées ligne par ligne|47 €",
      "Le tableau de décision « avant / après 70 ans »|37 €",
      "La lettre-type pour demander la modification à votre assureur|27 €",
      "Le comparatif des frais : ce que 3 % sur 20 ans coûte réellement|19 €",
      "Le Dossier à apporter chez votre notaire — offert|47 €",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const p = PRODUCTS[sku as ProductSku];
  return { title: p ? p.name : "Votre offre" };
}

export default async function OffrePage({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { sku } = await params;
  const { o, err } = await searchParams;
  const offre = OFFRES[sku];
  if (!offre) notFound();

  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  const etape = await etapeTunnel(offre.ecran, order.id, {
    bumpPresent: order.items.some((i) => i.sku === "bump"),
  });
  if (!etape.afficher) {
    redirect(
      etape.versOu + (err === "1" ? (etape.versOu.includes("?") ? "&" : "?") + "err=1" : ""),
    );
  }

  const produit = PRODUCTS[sku as ProductSku];
  const palier = palierDe(order.createdAt, Date.now());
  const credit = creditDe(produit.price, palier.remise);
  const reste = resteEnClair(palier.resteMs);

  return (
    <UpsellPage
      step={2}
      paymentFailed={err === "1"}
      orderId={order.id}
      sku={sku as ProductSku}
      next={etape.suivant}
      kicker="Attendez : votre commande est validée."
      h1={offre.h1}
      h2={produit.name}
      videoId={VIDEO.upsell1}
      videoMinutes={4}
      rows={offre.contenu.map((l) => {
        const [label, value] = l.split("|");
        return { label, value };
      })}
      prix={produit.price - credit}
      visuel={{
        src: `/img/produits/${offre.visuel}.jpg`,
        alt: "Les feuilles de cette offre, imprimées et posées sur une table.",
      }}
      declineText="Non merci, je continue sans"
    >
      {/* LE CHOIX À DEUX LIGNES, en tête : c'est lui qui produit le déclic.
          La ligne du haut contient moins et coûte plus — le lecteur relit,
          cherche l'erreur, ne la trouve pas, et coche celle du bas. */}
      <div className="mb-5">
        <ChoixOffre
          options={[
            {
              sku: offre.seul,
              titre: `${PRODUCTS[offre.seul].name} seul`,
              contenu: "Sans les cinq feuilles à remplir avant votre rendez-vous chez le notaire.",
              prix: appliquerPalier(PRODUCTS[offre.seul].price, palier.remise),
              visuel: offre.visuel,
              href: `/offre/${sku}?o=${encodeURIComponent(order.id)}`,
            },
            {
              sku: sku as ProductSku,
              titre: produit.name,
              contenu:
                "Tout ce qui précède, plus les cinq feuilles à remplir au stylo avant votre rendez-vous.",
              prix: produit.price - credit,
              visuel: offre.visuel,
              recommandee: true,
              href: `/offre/${sku}?o=${encodeURIComponent(order.id)}`,
            },
          ]}
          pourquoi="Sans ces feuilles, vous ne vous servez pas de ce que vous venez d'acheter : vous ressortez avec des documents et aucun rendez-vous préparé. Cela finit en remboursement, et un remboursement nous coûte bien davantage que ces quelques euros. L'écart achète la probabilité que vous vous en serviez — c'est un calcul, pas une faveur."
        />
      </div>

      {credit > 0 && (
        <div className="mb-4 border-2 border-green bg-green-bg p-4">
          <p className="text-[1.08rem] font-bold text-blue">
            Votre achat de La Méthode vous ouvre un crédit de {euros(credit)} sur cette offre.
          </p>
          <p className="mt-1 text-[1.05rem]">
            Vous payez {euros(produit.price - credit)} au lieu de {euros(produit.price)}.
            {reste && <> Ce crédit vaut encore {reste}.</>}
            {palier.remiseSuivante !== null && palier.remiseSuivante > 0 && (
              <> Ensuite il tombera à {Math.round(palier.remiseSuivante * 100)} % du prix.</>
            )}
          </p>
          {/* ⚠️ La cause est écrite, et elle est vraie : c'est l'achat qui ouvre
              le crédit. Sans cette phrase, « vous avez X € » ressemblerait à un
              avantage tombé du ciel — et un avantage sans cause est exactement
              ce qu'un lecteur méfiant traite comme une manipulation. */}
          <p className="mt-2 text-[0.92rem] text-text-soft">
            Les mêmes documents restent disponibles à {euros(produit.price)} depuis votre espace
            membre, en permanence. Ce crédit est une réduction de lancement, pas une remise sur un
            prix que personne ne paie.
          </p>
        </div>
      )}
      <p className="text-[1.05rem]">
        Le Dossier à apporter chez votre notaire est <strong>offert</strong> avec cette offre. Vous
        l&apos;aviez décoché au moment de payer — c&apos;est le mode d&apos;emploi de tout le reste,
        et sans lui ces documents restent dans un tiroir.
      </p>
    </UpsellPage>
  );
}
