import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpsellPage } from "@/components/UpsellPage";
import { getOrder } from "@/lib/db";
import { PRODUCTS, VIDEO } from "@/lib/config";
import { appliquerPalier, palierDe } from "@/lib/palier";
import { etapeTunnel } from "@/lib/tunnel";

/**
 * ⚠️ AUCUN NOM DE PRODUIT N'EST ÉCRIT EN DUR ICI.
 *
 * Cette page appelait le produit « Le Plan Transmission Complet » (titre, h2,
 * corps), le bouton juste en dessous l'appelait « Le Plan familial », et tout
 * l'aval — /merci, le reçu, la boutique de l'espace, les CGV — « Le Plan adapté
 * à votre famille ». Trois noms pour la même chose, dont deux sur le même
 * écran. Sur un homme de 74 ans qui vérifie son relevé bancaire ligne à ligne,
 * un nom qui change entre l'achat et la facture est la définition d'une
 * arnaque : c'est un appel à la banque avant d'être un email au support.
 */
export const metadata: Metadata = { title: PRODUCTS.upsell1.name };

export default async function Upsell1Page({
  searchParams,
}: {
  searchParams: Promise<{ o?: string }>;
}) {
  const { o } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  /**
   * ⚠️ C'EST LE TUNNEL QUI DÉCIDE, PAS CETTE PAGE.
   *
   * `etapeTunnel` répond à deux questions d'un coup : cet écran a-t-il sa place
   * dans le parcours de CET acheteur, et qu'est-ce qui vient après lui. Il tient
   * compte des réponses de qualification quand elles existent, et du drapeau
   * `disponible` toujours — un produit qui ne livre rien ne peut pas rester en
   * vente, et un clic sur le bouton vert n'afficherait qu'un bandeau d'échec.
   *
   * Quand l'écran est sauté, le client ne voit pas une offre cassée : il voit
   * l'étape suivante.
   */
  const etape = await etapeTunnel("plan", order.id, {
    bumpPresent: order.items.some((i) => i.sku === "bump"),
  });
  if (!etape.afficher) redirect(etape.versOu);

  // Le prix affiché doit être celui que `chargeUpsell` débitera : il applique
  // le même palier, calculé sur la même date en base.
  const { remise } = palierDe(order.createdAt, Date.now());
  const prix = appliquerPalier(PRODUCTS.upsell1.price, remise);

  return (
    <UpsellPage
      step={2}
      orderId={order.id}
      sku="upsell1"
      prix={prix}
      visuel={{
        src: "/img/produits/plan-familial.jpg",
        alt: "Les 12 plans-types imprimés, posés sur une table.",
      }}
      next={etape.suivant}
      motifSecond={etape.accroche?.h2}
      kicker={etape.accroche?.chapeau ?? "Attendez : votre commande est validée."}
      h1={
        etape.accroche?.h1 ?? (
          <>
            Avant d&apos;accéder à votre espace, une seule question : dans <em>votre</em> situation
            familiale, laquelle de vos 3 dates en premier&nbsp;?
          </>
        )
      }
      h2={`${PRODUCTS.upsell1.name} : les 12 situations familiales, chacune avec son plan d'action dans l'ordre, ses 3 pièges, ses 3 questions au notaire, et ${PRODUCTS.backend1.name}.`}
      videoId={VIDEO.upsell1}
      videoMinutes={4}
      rows={[
        { label: "12 plans-types, une page par situation familiale", value: "197 €" },
        {
          label:
            "Le Simulateur personnalisé : votre Facture Invisible, calculée toute seule (plusieurs héritiers, plusieurs contrats, démembrement, donations passées)",
          value: "147 €",
        },
        {
          label: "Le Calendrier de Transmission sur 15 ans : quoi faire, quelle année",
          value: "67 €",
        },
        { label: "3 modèles de clause bénéficiaire commentés", value: "47 €" },
        {
          label: "Le tableau de bord familial : qui reçoit quoi, quand, à quel coût",
          value: "39 €",
        },
      ]}
      declineText="Non merci, je préfère trouver seul le bon ordre pour ma situation."
    >
      <p>
        Félicitations : vous faites partie des rares familles qui ont décidé de savoir. Dans
        quelques minutes, vous aurez votre chiffre.
      </p>
      <p>
        Mais soyons honnêtes : le chiffre, c&apos;est le début. La question qui vient tout de suite
        après, c&apos;est&nbsp;: <em>« Dans ma situation, je fais quoi, en premier ? »</em>
      </p>
      <p>
        Un couple marié avec deux enfants ne prend pas les mêmes décisions qu&apos;une veuve de 71
        ans, qu&apos;une famille recomposée, ou qu&apos;un père dont le fils vit en couple sans être
        marié. Le bon levier pour l&apos;un est un piège pour l&apos;autre : la donation au dernier
        vivant, formidable en famille « classique », peut spolier les enfants d&apos;un premier lit.
      </p>
      <p>
        C&apos;est pour ça que {PRODUCTS.upsell1.name} existe : douze situations familiales, et pour
        chacune, <strong>une page</strong>. Les 3 dates dans le bon ordre, les trois pièges à
        éviter, les trois questions à poser au notaire, et ce que ça change en euros sur un cas
        concret.
      </p>
      {/* ⚠️ DEUX OUTILS, DEUX NOMS QUI NE PARTAGENT PAS UN MOT.
          La Méthode à 27 € contient déjà de quoi calculer sa facture : La Facture Invisible, qu'on remplit au stylo. Tant que les deux
          s'appelaient « Simulateur », vendre le second quinze secondes après
          l'achat du premier ne s'entendait que d'une façon : on me refacture ce
          que je viens d'acheter. Sur un acheteur de 74 ans, ce soupçon-là ne se
          dissipe pas, il devient une demande de remboursement.

          Les noms font désormais le travail à eux seuls — La Facture Invisible
          d'un côté, Le Simulateur personnalisé de l'autre — et ce paragraphe
          n'a plus qu'à le confirmer. Il reste quand même, parce qu'il prouve deux choses
          d'un coup : que le produit à 27 € tenait sa promesse, et que celui-ci
          fait autre chose. */}
      <p>
        Un mot pour qu&apos;il n&apos;y ait aucune ambiguïté : vous avez déjà{" "}
        <strong>La Facture Invisible</strong> dans votre Méthode, celle qu&apos;on remplit au stylo.
        Gardez-la, elle donne le bon chiffre. Ce que vous ajoutez ici, c&apos;est{" "}
        <strong>Le Simulateur personnalisé</strong> : la même chose, mais remplie toute seule, en
        dix minutes au lieu d&apos;une heure — et il sait traiter ce que la feuille papier ne sait
        pas : plusieurs héritiers, plusieurs contrats, un démembrement, des donations déjà faites.
      </p>
    </UpsellPage>
  );
}
