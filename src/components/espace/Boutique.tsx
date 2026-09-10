import Link from "next/link";
import { PRODUCTS, PRESENTATION, type ProductSku } from "@/lib/config";
import type { EtatEspace } from "@/lib/espace";
import { commandesPayeesParEmail } from "@/lib/db";

export const resumeProduit = (sku: ProductSku) =>
  PRESENTATION[sku]?.promesse ?? "Support pédagogique de préparation.";
export const avantagesProduit = (sku: ProductSku) => PRESENTATION[sku]?.contenu ?? [];

const VITRINE: Partial<Record<ProductSku, {
  badge: string;
  douleur: string;
  resultat: string;
  bouton: string;
}>> = {
  upsell1: {
    badge: "L’étape la plus importante",
    douleur: "Connaître les sept erreurs ne suffit pas encore à savoir lesquelles concernent réellement votre famille, ni dans quel ordre avancer.",
    resultat: "Le simulateur analyse vos réponses et génère votre estimation pédagogique, vos points de vigilance et votre plan détaillé : quoi faire vérifier, dans quel ordre et avec quels documents.",
    bouton: "Simuler entièrement ma situation",
  },
  bump: {
    badge: "Avant votre rendez-vous",
    douleur: "Une date oubliée, une donation mal retracée ou un document absent peut laisser une question importante sans réponse et vous obliger à recommencer la préparation.",
    resultat: "Le Dossier Notaire réunit l’inventaire, les pièces à retrouver, les questions à poser, la demande de rendez-vous et le compte rendu à conserver.",
    bouton: "Découvrir le Dossier Notaire",
  },
  upsell2: {
    badge: "Indispensable pour les détenteurs d’une assurance-vie",
    douleur: "Un relevé annuel ne suffit pas à savoir qui recevra réellement le capital. Une clause ancienne ou imprécise et des versements mal identifiés peuvent produire un résultat très différent de ce que vous aviez prévu.",
    resultat: "Retrouvez la clause en vigueur, les dates de versement et les informations manquantes, puis préparez la demande exacte à adresser à votre assureur avant toute modification.",
    bouton: "Faire le point sur mon assurance-vie",
  },
};

const ORDRE_VITRINE: ProductSku[] = ["upsell1", "bump", "upsell2"];

export async function Boutique({ etat }: { etat: EtatEspace }) {
  const offres = ORDRE_VITRINE.filter((sku) => etat.boutique.includes(sku));
  if (!offres.length) return null;

  const commandes = await commandesPayeesParEmail(etat.acces.email);
  const commandeGuide = [...commandes]
    .reverse()
    .find((commande) => commande.items.some((item) => item.sku === "front" && !item.rembourse));

  return (
    <section aria-labelledby="completer-preparation">
      <div className="mb-5 border-l-4 border-orange pl-4">
        <p className="mb-1 text-sm font-bold uppercase tracking-[0.08em] text-orange-dark">
          Pour aller plus loin
        </p>
        <h2 id="completer-preparation" className="text-[1.65rem] leading-tight sm:text-[2rem]">
          Complétez votre préparation
        </h2>
        <p className="mt-2 text-[1.05rem] text-text-soft">
          Retrouvez ici les produits que vous ne possédez pas encore. Chaque achat est ensuite ajouté dans Mon dossier.
        </p>
      </div>

      <div className="space-y-5">
        {offres.map((sku) => {
          const fiche = VITRINE[sku];
          if (!fiche) return null;
          const plan = sku === "upsell1";
          const href = plan && commandeGuide
            ? `/plan-complet?o=${encodeURIComponent(commandeGuide.id)}`
            : `/espace/${etat.acces.jeton}/ajouter/${sku}`;

          return (
            <article
              key={sku}
              className={`overflow-hidden border-2 bg-white shadow-[0_6px_18px_rgba(9,55,96,0.10)] ${plan ? "border-orange" : "border-grey-line"}`}
            >
              <p className={`px-5 py-2 text-sm font-bold uppercase tracking-wide text-white ${plan ? "bg-orange" : "bg-blue"}`}>
                {fiche.badge}
              </p>
              <div className="p-5 sm:p-6">
                <h3 className="text-[1.35rem] leading-snug text-blue">{PRODUCTS[sku].name}</h3>
                <p className="my-4 border-l-4 border-red bg-red-bg p-3 leading-relaxed">
                  <strong>Ce que vous risquez de laisser de côté :</strong> {fiche.douleur}
                </p>
                <p className="mb-4 text-[1.05rem] leading-relaxed">
                  <strong>Ce que ce produit vous permet d’obtenir :</strong> {fiche.resultat}
                </p>
                <ul className="mb-5 space-y-2">
                  {avantagesProduit(sku).slice(0, 3).map((avantage) => (
                    <li key={avantage} className="flex gap-2">
                      <span aria-hidden="true" className="font-bold text-green">✓</span>
                      <span>{avantage}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={`flex min-h-[54px] items-center justify-center px-4 py-3 text-center font-bold text-white no-underline ${plan ? "bg-orange" : "bg-blue"}`}
                  href={href}
                >
                  {fiche.bouton}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
