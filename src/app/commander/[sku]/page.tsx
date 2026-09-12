import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, TestModeBanner } from "@/components/Chrome";
import { CommandeGuide } from "@/components/CommandeGuide";
import { Guarantee } from "@/components/ui";
import { bumpPour, guideVendable } from "@/lib/guides-vente";
import { BOUTIQUE } from "@/content/boutique";
import { PRESENTATION, PRODUCTS, isTestMode, stripeEnModeTest } from "@/lib/config";

export const metadata: Metadata = { title: "Votre commande" };

/**
 * LE BON DE COMMANDE D'UN GUIDE À L'UNITÉ.
 *
 * ⚠️ Hors index, comme tout ce qui affiche un prix : la page n'est pas déclarée
 * dans `CHEMINS_INDEXABLES`, donc le `noindex` du layout racine s'applique.
 *
 * ⚠️ Le guide d'entrée n'a PAS de page ici. Il garde `/commande`, qui porte sa
 * fenêtre de prix : lui ouvrir un second bon de commande sans promotion ferait
 * exister deux tarifs pour le même produit selon le lien emprunté.
 */
export default async function CommanderGuide({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  if (!guideVendable(sku)) notFound();

  const produit = PRODUCTS[sku as keyof typeof PRODUCTS];
  const fiche = BOUTIQUE[sku as keyof typeof BOUTIQUE];
  const presentation = PRESENTATION[sku as keyof typeof PRESENTATION];

  // Le prénom et l'email déjà connus évitent une ressaisie à quelqu'un qui
  // vient de laisser son adresse pour le document gratuit.
  let defauts: { firstName?: string; email?: string } = {};
  try {
    const brut = (await cookies()).get("hi_lead")?.value;
    if (brut) defauts = JSON.parse(brut) as { firstName?: string; email?: string };
  } catch {}

  return (
    <>
      {(isTestMode || stripeEnModeTest) && <TestModeBanner stripeReel={stripeEnModeTest} />}
      <Header minimal />
      <main className="wrap flex-1 py-8">
        <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-orange">
          Guide officiel
        </p>
        {/* Même hiérarchie que la boutique : le nom identifie, la phrase de
            résultat dit ce que le guide fait. Quelqu'un qui arrive ici depuis
            une fiche doit retrouver le même titre, au même endroit. */}
        <h1 className="mb-2 text-[1.6rem] leading-tight sm:text-[2rem]">{produit.name}</h1>
        {fiche && <p className="mb-3 text-[1.15rem] font-bold text-blue">{fiche.resultat}</p>}
        {fiche && <p className="mb-6 text-[1.02rem]">{fiche.pourQui}</p>}

        <CommandeGuide
          sku={sku}
          nom={produit.name}
          prix={produit.price}
          complement={bumpPour(sku)}
          defaults={defauts}
        />

        {presentation && (
          <section className="mt-8 border border-grey-line bg-grey-bg p-5">
            <h2 className="mb-3 text-[1.1rem]">Ce que contient ce guide</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-[0.98rem]">
              {presentation.contenu.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        )}


        <div className="mt-8">
          <Guarantee product="ce guide" />
        </div>

        <p className="mt-6 text-[0.95rem] text-text-soft">
          <Link href="/nos-guides">← Revenir à tous les guides</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
