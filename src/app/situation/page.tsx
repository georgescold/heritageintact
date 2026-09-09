import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormulaireSituation } from "./Formulaire";
import { Header, Footer } from "@/components/Chrome";
import { Panel } from "@/components/ui";
import { PRODUCTS, euros, urlEspace } from "@/lib/config";
import { accesParEmail, getOrder } from "@/lib/db";
import { QUALIFICATION_ACTIVE } from "@/lib/qualification";

/**
 * LA PREMIÈRE PAGE APRÈS LE PAIEMENT. Elle fait trois choses, et l'ordre EST la
 * règle : elle confirme le paiement, elle livre, et seulement ensuite elle
 * demande. Aucune de ces trois étapes ne se déplace.
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
 * ═══ POURQUOI LE LIEN DE L'ESPACE EST ICI, AVANT LES OFFRES ═══
 *
 * Il n'y était pas. Le raisonnement de tunnel disait : ne pas poser de porte de
 * sortie avant d'avoir proposé les offres. Il est faux sur cette cible-là.
 *
 * Un homme de 74 ans qui a payé et qui ne VOIT rien arriver ne se dit pas
 * « je verrai après » : il se dit « je viens de donner ma carte à un site qui ne
 * me donne rien et qui me revend déjà autre chose ». À partir de cette seconde,
 * l'écran de vente suivant ne lit plus comme une offre mais comme la
 * confirmation d'une arnaque — et il ne cliquera ni sur oui, ni sur non : il
 * appellera sa banque.
 *
 * Livrer d'abord coûte quelques départs. Ne pas livrer coûte des oppositions de
 * paiement, et une opposition coûte le prix de la commande PLUS les frais PLUS
 * la réputation du compte Stripe. Ce n'est pas un arbitrage serré.
 *
 * ⚠️ ET LE LIEN NE MET PAS FIN AU PARCOURS. Il s'ouvre dans un ONGLET À PART
 * (`target="_blank"`), donc la page reste ouverte derrière : celui qui va
 * vérifier que sa Méthode existe revient sur cet écran, rassuré. C'est tout
 * l'intérêt du dispositif, et c'est aussi pourquoi le bouton est écrit en
 * secondaire : il rassure, il n'appelle pas au clic.
 *
 * ⚠️ La promesse faite ici doit rester vraie. Elle l'est parce que `livrer()`
 * s'exécute dans `confirmCheckout`, donc AVANT cette page, et une seconde fois
 * via le webhook Stripe en filet. `accesParEmail` renvoie `null` si, malgré
 * tout, aucun accès n'existe : dans ce cas on n'affiche RIEN plutôt qu'un lien
 * mort, et l'email reste le chemin annoncé.
 *
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
  // Créé par `livrer()` au moment du paiement, donc avant ce rendu — et
  // indépendamment de Resend : l'accès existe même si aucun email n'est parti.
  const acces = await accesParEmail(order.email);
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

          {/* ═══ 2. LA LIVRAISON, MONTRÉE. Avant la moindre offre. ═══ */}
          {acces && (
            <div className="mt-5 border-2 border-blue bg-white p-4">
              <p className="text-[1.08rem] font-bold text-blue">
                {PRODUCTS.front.name} est déjà en ligne. Vous pouvez la voir tout de suite.
              </p>
              <p className="mt-1 text-[1.05rem]">
                Rien à installer, aucun mot de passe à retenir : ce lien est le vôtre, il fonctionne
                aujourd&apos;hui et dans dix ans.
              </p>
              <a
                href={urlEspace(acces.jeton)}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex min-h-[52px] items-center border-2 border-blue px-4 text-[1.05rem] font-bold text-blue no-underline"
              >
                Ouvrir mon espace dans un nouvel onglet
              </a>
              {/* Dit en toutes lettres, parce que c'est la crainte exacte du
                  lecteur à cet instant : perdre sa place en cliquant. */}
              <p className="mt-2 text-[0.98rem] text-text-soft">
                Cette page reste ouverte derrière. Vous pouvez y revenir.
              </p>
            </div>
          )}

          {/* ═══ 3. SEULEMENT MAINTENANT, LES QUESTIONS. ═══ */}
          <div className="mt-6">
            <FormulaireSituation orderId={order.id} email={order.email} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
