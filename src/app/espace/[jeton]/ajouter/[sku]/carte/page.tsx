import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { confirmCheckout } from "@/app/actions";
import { confirmerAchatEspace } from "@/app/espace/achat";
import { Footer, Header } from "@/components/Chrome";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { PaiementEspace } from "@/components/espace/PaiementEspace";
import { PRODUCTS, euros, type ProductSku } from "@/lib/config";
import { getOrder, orderTotal } from "@/lib/db";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";

export const metadata: Metadata = {
  title: "Confirmer votre paiement",
  robots: { index: false, follow: false },
};

/**
 * LE REPLI DSP2 — ET CE N'EST PAS UN RAFFINEMENT.
 *
 * Trois semaines ou trois mois après le paiement initial, une banque
 * européenne peut exiger une authentification forte même sur une carte
 * enregistrée : Stripe renvoie alors `authentication_required`, et c'est
 * fréquent, pas exceptionnel. Sans cette page, le membre lit « paiement
 * refusé » et n'achète jamais. Renvoyer quelqu'un de 75 ans écrire un email au
 * support pour pouvoir payer 297 €, c'est la vente perdue.
 *
 * ⚠️ LE TON EST TOUT. Il ne s'est rien passé de grave : sa banque demande une
 * confirmation, c'est une minute, et sa commande précédente est intacte. Aucun
 * mot « erreur », aucun code, aucune alarme.
 */
export default async function CartePage({
  params,
  searchParams,
}: {
  params: Promise<{ jeton: string; sku: string }>;
  /**
   * `payment_intent` et `redirect_status` sont posés par Stripe au RETOUR DE LA
   * BANQUE, quand l'authentification forte a exigé une redirection complète.
   * C'est le seul chemin par lequel la confirmation peut encore avoir lieu :
   * le navigateur a quitté le formulaire, et le code qui suivait n'a jamais
   * tourné.
   */
  searchParams: Promise<{ o?: string; payment_intent?: string; redirect_status?: string }>;
}) {
  const { jeton, sku } = await params;
  const { o, payment_intent: intentDeRetour, redirect_status: statutDeRetour } = await searchParams;

  if (!estJetonValide(jeton)) return <LienInvalide />;

  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;
  if (etat.acces.revoque) return <LienInvalide revoque />;

  const hub = `/espace/${jeton}`;

  // Les mêmes gardes que l'écran de confirmation : cette URL est devinable
  // elle aussi, et elle mène à un formulaire de carte.
  if (!estSkuConnu(sku)) redirect(hub);
  const produit = PRODUCTS[sku];
  if (!etat.possede.has("front")) redirect(hub);
  if (!produit.disponible) redirect(hub);
  if (etat.possede.has(sku)) redirect(hub);

  const commande = o ? await getOrder(o) : null;

  /**
   * ⚠️ LA COMMANDE DOIT APPARTENIR À L'ADRESSE DE CET ACCÈS.
   *
   * `?o=` est un paramètre d'URL, donc du texte fourni par le visiteur.
   * Afficher un formulaire de paiement sur la commande de quelqu'un d'autre
   * ferait payer le mauvais membre — et lui montrerait au passage le montant
   * d'un tiers. Sans commande valable, on repart de l'écran de confirmation,
   * qui recréera proprement une commande.
   */
  const retourAchat = `${hub}/ajouter/${sku}`;
  if (!commande) redirect(retourAchat);
  if (commande.email.trim().toLowerCase() !== etat.acces.email.trim().toLowerCase()) {
    redirect(retourAchat);
  }
  if (!commande.items.some((i) => i.sku === sku)) redirect(retourAchat);

  /**
   * ⚠️ LE RETOUR DE LA BANQUE, ET IL EST LE SEUL À POUVOIR CONFIRMER.
   *
   * Quand la 3-D Secure impose une redirection complète, le navigateur a quitté
   * le formulaire : `confirmCheckout` n'a jamais été appelé, et la commande est
   * restée « pending » alors que l'argent est encaissé. Sans ce bloc, le membre
   * revenait sur un bandeau vert et ne trouvait rien dans ses documents — et
   * seul le webhook pouvait le rattraper, à condition qu'il soit configuré.
   *
   * On confirme côté serveur (statut réel chez Stripe + identifiant de commande
   * concordant), puis on envoie le reçu, puis on l'emmène à son produit.
   */
  if (intentDeRetour && statutDeRetour !== "failed") {
    const fait = await confirmCheckout(commande.id, intentDeRetour);
    if (fait.ok) {
      await confirmerAchatEspace(jeton, sku, commande.id);
      redirect(`${hub}?ajoute=${sku}`);
    }
    // Sinon on retombe sur le formulaire ci-dessous : sa banque a refusé, il
    // ressaisit. Aucun mot « erreur », aucun code — l'écran dit déjà tout.
  }

  // Déjà réglée : le membre a rouvert un vieil onglet, ou la confirmation est
  // passée entre-temps. On ne lui redemande surtout pas sa carte.
  if (commande.status === "paid") redirect(`${hub}?ajoute=${sku}`);

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-8">
          <h1 className="mb-4 text-[1.5rem] leading-snug sm:text-[1.8rem]">
            Votre banque demande une confirmation
          </h1>

          <p className="mb-4 text-[1.15rem]">
            Saisissez votre carte une dernière fois, cela ne prend pas une minute. C&apos;est une
            sécurité demandée par votre banque, et elle est normale.
          </p>

          <p className="mb-6 border-l-4 border-green bg-green-bg px-4 py-3 text-[1.1rem]">
            <strong>Votre commande précédente reste bien enregistrée.</strong> Rien n&apos;a été
            débité pour l&apos;instant, et vous ne risquez pas de payer deux fois.
          </p>

          <p className="mb-6 text-[1.15rem]">
            Vous ajoutez <strong>{produit.name}</strong>, pour{" "}
            <strong>{euros(orderTotal(commande))}</strong>.
          </p>

          <PaiementEspace
            orderId={commande.id}
            jeton={jeton}
            sku={sku}
            montant={orderTotal(commande)}
          />

          <p className="mt-6 text-center text-[1.05rem]">
            <Link href={hub} className="text-text-soft">
              Non, revenir à mon espace
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Le SKU vient de l'URL : le type ne le valide pas à l'exécution. */
function estSkuConnu(v: string): v is ProductSku {
  return Object.prototype.hasOwnProperty.call(PRODUCTS, v);
}
