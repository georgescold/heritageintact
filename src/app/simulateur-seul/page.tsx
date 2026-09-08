import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpsellPage } from "@/components/UpsellPage";
import { PRODUCTS, euros } from "@/lib/config";
import { getOrder } from "@/lib/db";
import { appliquerPalier, palierDe } from "@/lib/palier";

export const metadata: Metadata = { title: PRODUCTS.backend1.name };

/**
 * LE REPLI — Le Simulateur Automatique seul, à qui vient de refuser Le Plan.
 *
 * ═══ Pourquoi un repli, et pourquoi celui-ci ═══
 *
 * Quelqu'un qui refuse 297 € ne refuse pas toujours le produit : il refuse
 * souvent le montant. Lui reproposer la même chose moins cher serait insultant
 * et créerait un précédent — il saurait qu'il suffit de dire non. Lui proposer
 * un SOUS-ENSEMBLE réel à son prix réel est autre chose : il n'a pas obtenu de
 * remise, il a choisi une portion.
 *
 * Le Simulateur est la pièce du Plan qui CALCULE. Celui qui ne veut pas des
 * douze situations familiales peut parfaitement vouloir le chiffre — et c'est
 * même le cas le plus fréquent, parce que le chiffre est ce que la vidéo de
 * vente a promis.
 *
 * ⚠️ AUCUNE INSISTANCE, AUCUN REPROCHE. Pas de « vous êtes sûr ? », pas de
 * « dernière chance ». Il vient de dire non une fois ; le seul ton acceptable
 * est celui d'une proposition différente, faite une fois, et abandonnée s'il
 * dit non de nouveau. Sur un homme de 74 ans, insister ne fait pas acheter :
 * ça fait fermer l'onglet et douter du premier achat.
 *
 * ⚠️ ET JAMAIS À QUI POSSÈDE DÉJÀ LE PLAN : le Simulateur y est compris
 * (`INCLUS_DANS`), le lui vendre 147 € serait lui refacturer ce qu'il vient de
 * payer. La garde est dans `chargeUpsell`, qui teste les composants.
 */
export default async function SimulateurSeulPage({
  searchParams,
}: {
  searchParams: Promise<{ o?: string; err?: string }>;
}) {
  const { o, err } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  const versMerci = `/merci?o=${order.id}`;
  if (!PRODUCTS.backend1.disponible) redirect(versMerci);
  // Il l'a déjà, dans le Plan ou dans un pack : on ne lui remontre rien.
  if (order.items.some((i) => ["upsell1", "pack1", "pack2", "pack3", "backend1"].includes(i.sku))) {
    redirect(versMerci);
  }

  const { remise } = palierDe(order.createdAt, Date.now());
  const prix = appliquerPalier(PRODUCTS.backend1.price, remise);

  return (
    <UpsellPage
      step={3}
      paymentFailed={err === "1"}
      orderId={order.id}
      sku="backend1"
      next={versMerci}
      prix={prix}
      visuel={{
        src: "/img/produits/simulateur.jpg",
        alt: "Un ordinateur portable ouvert à côté d'une feuille couverte de chiffres écrits à la main.",
      }}
      kicker="Très bien. Une dernière chose, différente."
      h1={
        <>
          Vous n&apos;avez peut-être pas besoin des 12 situations. Mais vous avez besoin de{" "}
          <em>votre</em> chiffre.
        </>
      }
      h2={`${PRODUCTS.backend1.name} : celui que vous venez de refuser le contenait. Voici cette pièce, seule.`}
      videoMinutes={2}
      rows={[
        { label: "Votre facture, par héritier, tranche par tranche", value: "97 €" },
        { label: "Vos 3 dates, calculées sur votre âge et vos donations", value: "47 €" },
        { label: "Les scénarios activables : ce que chaque décision ferait gagner", value: "67 €" },
        { label: "Votre Plan en 1 page, à imprimer", value: "37 €" },
      ]}
      declineText="Non merci, j'ai ce qu'il me faut"
    >
      <p className="mb-3 text-[1.05rem]">
        Le Plan que vous venez de refuser comprenait cet outil. Nous ne vous le représentons pas
        moins cher — nous vous proposons <strong>la pièce qui calcule</strong>, seule, à son prix.
        Vous n&apos;aurez pas les 12 situations familiales ni le calendrier sur 15 ans.
      </p>
      <p className="mb-3 text-[1.05rem]">
        Vous remplissez votre situation, il fait le barème à votre place, et il affiche
        l&apos;article du Code général des impôts en face de chaque ligne. Vous pouvez tout
        vérifier.
      </p>
      <p className="text-[1.02rem] text-text-soft">
        Ce que vous saisissez reste sur votre ordinateur. Rien n&apos;est envoyé, rien n&apos;est
        enregistré chez nous. Et si vous préférez en rester là, le Simulateur de Facture Invisible —
        la version à remplir au stylo — est déjà dans vos documents, sans supplément. Il donne le
        même chiffre, en une heure au lieu de dix minutes. Prix de cet outil&nbsp;:{" "}
        {euros(PRODUCTS.backend1.price)}.
      </p>
    </UpsellPage>
  );
}
