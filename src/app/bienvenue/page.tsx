import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/Chrome";
import { MesurerAchat } from "@/components/MetaPixel";
import { ButtonLink, Panel } from "@/components/ui";
import { accesParEmail, getOrder, profilDeCommande } from "@/lib/db";
import { PRODUCTS, euros, urlEspace } from "@/lib/config";
import { sequence, urlEcran } from "@/lib/qualification";
import { profilComplet } from "@/lib/questionnaire";
import { etapeParNumero } from "@/lib/methode";
export const metadata: Metadata = { title: "Votre Méthode est prête", robots: { index: false, follow: false } };

/** Remise explicite du produit 1 avant toute offre. Ni minuterie ni redirection automatique. */
export default async function Page({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  const order = o ? await getOrder(o) : null;
  if (!order || order.status !== "paid") redirect("/commande");
  const acces = await accesParEmail(order.email);
  const profil = await profilDeCommande(order.id);
  if (!profilComplet(profil)) redirect(`/situation?o=${encodeURIComponent(order.id)}`);
  const prochain = sequence(profil, { bumpPresent: order.items.some(i => i.sku === "bump") })[0];
  const total = order.items.reduce((s, i) => s + i.price, 0);
  return <><MesurerAchat id={order.id} /><Header minimal /><main className="wrap flex-1 py-8">
    <p className="mb-3 text-sm font-bold text-orange-dark">Votre achat est prêt · Avant toute offre complémentaire</p>
    <h1 className="mb-4 text-[1.9rem]">Votre premier pas est fait. Voici votre Méthode.</h1>
    <p className="mb-5">Vous n’avez pas à résoudre toute votre transmission aujourd’hui. Commencez par ce que vous souhaitez protéger, puis notez ce qu’il faut retrouver et faire vérifier.</p>
    <section id="livraison-produit" className="mb-6 border-2 border-blue bg-grey-bg p-5">
      <h2 className="mb-3 text-[1.4rem]">{PRODUCTS.front.name}</h2>
      <p className="mb-3">Votre première fiche, puis les sept erreurs. Le parcours complet de base est identique pour tous, lisible à l’écran et accompagné de supports imprimables.</p>
      <p className="mb-4"><strong>Commencez ici :</strong> votre fiche de situation, environ {etapeParNumero(0)?.minutes ?? 12} minutes. Une priorité et trois questions à préparer.</p>
      {acces ? <>
        {prochain ? <a href={urlEspace(acces.jeton)} className="inline-flex min-h-[48px] items-center border-2 border-blue px-4 font-bold text-blue">Ouvrir ma Méthode</a> : <ButtonLink href={urlEspace(acces.jeton)} variant="blue">Ouvrir ma Méthode</ButtonLink>}
        <p className="mt-4 break-all text-sm">Votre lien personnel : {urlEspace(acces.jeton)}</p>
        <p className="mt-2 text-sm">Conservez-le dans vos favoris. Pas de mot de passe ; ne partagez pas ce lien.</p>
      </> : <><p className="mb-3">Utilisez l’adresse de votre commande pour retrouver votre lien personnel.</p><ButtonLink href="/espace">Retrouver mon accès</ButtonLink></>}
      {order.items.some(i => i.sku === "bump") && <p className="mt-4 font-bold">Votre Dossier est également inclus dans votre espace.</p>}
      <p className="mt-4 text-sm">Adresse d’accès : <strong className="break-words">{order.email}</strong>. Si l’email tarde, votre lien reste accessible ici.</p>
    </section>
    <Panel title={`Votre commande · ${euros(total)} payés`}><p>Aucun nouvel achat n’est nécessaire pour utiliser ce que vous avez commandé.</p></Panel>
    {prochain ? <section id="suite-adaptee" className="mt-8 border-t border-grey-line pt-6">
      <h2 className="mb-3 text-[1.5rem]">{prochain === "assurance-vie" ? "Et si votre prochaine inquiétude concerne vos contrats ?" : "Vous voulez aussi préparer le rendez-vous, sans partir d’une page blanche ?"}</h2>
      <p className="mb-4">{prochain === "assurance-vie" ? "Vous avez indiqué vouloir faire le point sur votre assurance-vie. Un module complémentaire peut vous aider à retrouver les informations, écrire à l’assureur et suivre ses réponses." : "La Méthode vous aide à comprendre. Le pack Préparation ajoute des trames, des parcours familiaux et un atelier pédagogique pour approfondir la préparation de vos échanges."}</p>
      <ButtonLink href={urlEcran(prochain, order.id, 0)}>Découvrir maintenant ma préparation complémentaire</ButtonLink>
      <p className="mt-3 text-sm text-text-soft">Offre facultative. Vous verrez le montant supplémentaire, avec vos achats inclus déjà payés déduits, avant toute décision.</p>
    </section> : <p className="mt-6">Vous souhaitez commencer par les bases : votre Méthode suffit pour cette première étape. Vous retrouverez les compléments dans votre espace si votre besoin évolue.</p>}
  </main><Footer /></>;
}
