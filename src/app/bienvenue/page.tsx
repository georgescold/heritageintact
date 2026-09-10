import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { MesurerAchat } from "@/components/MetaPixel";
import { ButtonLink, Panel } from "@/components/ui";
import { accesParEmail, getOrder } from "@/lib/db";
import { PRODUCTS, euros, urlEspace } from "@/lib/config";
import { etapeParNumero } from "@/lib/methode";
export const metadata: Metadata = { title: "Votre guide est prêt", robots: { index: false, follow: false } };

/** Remise explicite du produit 1 après la décision concernant l'offre recommandée. */
export default async function Page({ searchParams }: { searchParams: Promise<{ o?: string; err?: string; retour?: string }> }) {
  const { o, err, retour } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order || order.status !== "paid") redirect("/commande");
  const acces = await accesParEmail(order.email);
  // Après le paiement du guide, le client rejoint son menu sans questionnaire intermédiaire.
  // La qualification commerciale se fait uniquement s'il demande son plan personnalisé.
  if (acces) ouvrirEspace(acces.jeton, retour !== "1");
  const total = order.items.reduce((s, i) => s + i.price, 0);
  return <><MesurerAchat id={order.id} /><Header minimal /><main className="wrap flex-1 py-8">
    {err === "1" && <p role="alert" className="mb-5 border-2 border-orange bg-yellow-bg p-4">Le complément n’a pas pu être ajouté. Aucun montant supplémentaire n’a été débité et votre guide reste bien acquis.</p>}
    <p className="mb-3 text-sm font-bold text-orange-dark">Votre achat est prêt</p>
    <h1 className="mb-4 text-[1.9rem]">Votre premier pas est fait. Voici votre guide.</h1>
    <p className="mb-5">Vous n’avez pas à résoudre toute votre transmission aujourd’hui. Commencez par ce que vous souhaitez protéger, puis notez ce qu’il faut retrouver et faire vérifier.</p>
    <section id="livraison-produit" className="mb-6 border-2 border-blue bg-grey-bg p-5">
      <h2 className="mb-3 text-[1.4rem]">{PRODUCTS.front.name}</h2>
      <p className="mb-3">Votre introduction, puis les sept erreurs expliquées dans l’ordre. Le contenu acheté est identique pour tous et lisible directement dans votre espace.</p>
      <p className="mb-4"><strong>Commencez ici :</strong> l’introduction, environ {etapeParNumero(0)?.minutes ?? 12} minutes, puis découvrez chaque erreur à connaître à temps.</p>
      {acces ? <>
        <ButtonLink href={urlEspace(acces.jeton)} variant="blue">Ouvrir le guide</ButtonLink>
        <p className="mt-4 break-all text-sm">Votre lien personnel : {urlEspace(acces.jeton)}</p>
        <p className="mt-2 text-sm">Conservez-le dans vos favoris. Pas de mot de passe ; ne partagez pas ce lien.</p>
      </> : <><p className="mb-3">Utilisez l’adresse de votre commande pour retrouver votre lien personnel.</p><ButtonLink href="/espace">Retrouver mon accès</ButtonLink></>}
      {order.items.some(i => i.sku === "bump") && <p className="mt-4 font-bold">Votre Dossier est également inclus dans votre espace.</p>}
      <p className="mt-4 text-sm">Adresse d’accès : <strong className="break-words">{order.email}</strong>. Si l’email tarde, votre lien reste accessible ici.</p>
    </section>
    <Panel title={`Votre commande · ${euros(total)} payés`}><p>Aucun nouvel achat n’est nécessaire pour utiliser ce que vous avez commandé.</p></Panel>
  </main><Footer /></>;
}

function ouvrirEspace(jeton: string, nouveau: boolean): void {
  redirect(`${urlEspace(jeton)}${nouveau ? "?nouveau=1" : ""}`);
}
