import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormulaireSituation } from "./Formulaire";
import { Header, Footer } from "@/components/Chrome";
import { Panel } from "@/components/ui";
import { PRODUCTS, euros } from "@/lib/config";
import { getOrder } from "@/lib/db";
import { QUALIFICATION_ACTIVE } from "@/lib/qualification";

/**
 * LA PREMIÈRE PAGE APRÈS LE PAIEMENT. Elle fait deux choses, dans cet ordre :
 * elle rassure, puis elle demande.
 *
 * ═══ CE QUE VOIT QUELQU'UN QUI VIENT DE DONNER SA CARTE ═══
 *
 * Il a 74 ans, il vient de saisir seize chiffres sur un site qu'il ne
 * connaissait pas il y a vingt minutes, et il se pose trois questions dans la
 * seconde : est-ce que c'est passé, combien ai-je été débité, et qu'est-ce que
 * je reçois. Les trois réponses sont en haut de cette page, chiffrées et
 * nommées, avant qu'on lui demande quoi que ce soit.
 *
 * ⚠️ LE MONTANT EST RELU EN BASE, JAMAIS RECALCULÉ. C'est la somme des articles
 * réellement enregistrés sur sa commande. Un montant reconstitué à l'affichage
 * finirait tôt ou tard par différer d'un euro de son relevé bancaire — et sur
 * cette cible, un écart d'un euro entre l'écran et la banque n'est pas un bug
 * d'arrondi, c'est un appel au conseiller.
 *
 * ═══ CE QUI N'EST PAS SUR CETTE PAGE, ET C'EST DÉLIBÉRÉ ═══
 *
 * Le lien vers l'espace membre. Il est dans l'email qui vient de partir — donc
 * l'acheteur n'est jamais captif, et la phrase « votre accès vous attend » est
 * littéralement vraie. Mais l'afficher ICI, en gros, à l'entrée du tunnel,
 * reviendrait à poser une porte de sortie avant les offres. La page /merci le
 * donne, en fin de parcours, et c'est sa place.
 *
 * ⚠️ La promesse faite ici doit rester vraie. Elle l'est parce que `livrer()`
 * s'exécute dans `confirmCheckout`, donc AVANT cette page, et une seconde fois
 * via le webhook Stripe en filet. Le jour où la livraison redeviendrait
 * asynchrone, c'est cette phrase qu'il faudrait corriger en premier.
 */
export const metadata: Metadata = {
  title: "Votre commande est validée",
  // Aucune page du tunnel ne doit finir dans un index : elle porte un
  // identifiant de commande.
  robots: { index: false, follow: false },
};

export default async function SituationPage({
  searchParams,
}: {
  searchParams: Promise<{ o?: string }>;
}) {
  const { o } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order) redirect("/commande");

  const suite = `/plan-complet?o=${encodeURIComponent(order.id)}`;

  // Interrupteur général : à `false`, cette page n'existe pas pour l'acheteur.
  // Il va droit au tunnel, exactement comme avant le dispositif — c'est ce qui
  // rend le retour en arrière gratuit, et vérifiable en une ligne.
  if (!QUALIFICATION_ACTIVE) redirect(suite);

  const paye = order.items.reduce((somme, article) => somme + article.price, 0);
  const bumpPresent = order.items.some((i) => i.sku === "bump");

  return (
    <>
      {/* Le même en-tête minimal que les écrans de vente : ni menu, ni lien de
          sortie. Le bandeau complet remettrait sous les yeux d’un acheteur qui
          vient de payer les boutons d’achat de la page de vente. */}
      <Header minimal />
      <main className="flex-1">
        <div className="wrap max-w-[720px] py-6 sm:py-8">
          {/* ═══ 1. LA CONFIRMATION. Avant toute question, sans exception. ═══ */}
          <Panel tone="green" title="C'est réglé.">
            <p className="text-[1.15rem] font-bold text-blue">
              Votre paiement de {euros(paye)} est accepté.
            </p>
            <p className="mt-2 text-[1.05rem]">
              {PRODUCTS.front.name} est à vous
              {bumpPresent && <>, avec {PRODUCTS.bump.name}</>}. Un email vient de partir à{" "}
              <strong className="break-words">{order.email}</strong> : il contient votre lien
              d&apos;accès personnel, et il ne périme pas.
            </p>
            {/* ⚠️ RIEN ICI SUR LE LIBELLÉ DU RELEVÉ BANCAIRE, ET C'EST VOLONTAIRE.
                Le nom qui s'affichera sur le relevé est le `statement descriptor`
                du compte Stripe : il n'est fixé nulle part dans ce dépôt, donc
                l'annoncer serait deviner. Sur cette cible, un libellé promis ici
                et différent sur le relevé produit exactement ce qu'on cherche à
                éviter — un appel au conseiller bancaire, puis une opposition.
                Le jour où le descripteur est réglé dans Stripe, cette phrase
                vaut la peine d'être écrite : elle supprime un motif de litige. */}
            <p className="mt-2 text-[1.02rem] text-text-soft">
              Si vous ne voyez pas l&apos;email d&apos;ici quelques minutes, regardez dans vos
              courriers indésirables — c&apos;est là qu&apos;il se met le plus souvent.
            </p>
          </Panel>

          {/* ═══ 2. SEULEMENT MAINTENANT, LES QUESTIONS. ═══ */}
          <div className="mt-6">
            <FormulaireSituation orderId={order.id} email={order.email} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
