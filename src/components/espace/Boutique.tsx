import Link from "next/link";
import { PRODUCTS, PRESENTATION, type ProductSku } from "@/lib/config";
import type { EtatEspace } from "@/lib/espace";
import { commandesPayeesParEmail } from "@/lib/db";

export const resumeProduit = (sku: ProductSku) =>
  PRESENTATION[sku]?.promesse ?? "Support pédagogique de préparation.";
export const avantagesProduit = (sku: ProductSku) => PRESENTATION[sku]?.contenu ?? [];

const VITRINE: Partial<Record<ProductSku, {
  badge: string;
  alerteTitre: string;
  alerteTexte: string;
  resultatTitre: string;
  resultatTexte: string;
  points: string[];
  bouton: string;
}>> = {
  upsell1: {
    badge: "L’étape la plus importante",
    alerteTitre: "Ne restez pas avec des règles générales et aucun ordre pour agir.",
    alerteTexte: "Sans relier les sept erreurs à votre âge, votre famille, vos biens et vos donations, vous risquez de surveiller le mauvais point, de repousser la bonne vérification ou de commencer par une démarche secondaire.",
    resultatTitre: "À la fin de votre simulation, votre situation devient lisible.",
    resultatTexte: "Vos réponses génèrent votre estimation, vos points de vigilance et votre plan détaillé. Le résultat sépare clairement vos intentions, les questions à faire vérifier et les actes qui pourront produire un effet réel.",
    points: [
      "Votre estimation et les hypothèses qui l’expliquent",
      "Les alertes concernant votre famille, votre maison et votre capacité future de décider",
      "Votre plan détaillé et votre dossier à remettre au professionnel",
    ],
    bouton: "Simuler entièrement ma situation",
  },
  bump: {
    badge: "Avant votre rendez-vous",
    alerteTitre: "Le notaire ne peut pas examiner ce que vous avez oublié de lui signaler.",
    alerteTexte: "Une donation ancienne mal retracée, une clause absente ou un acte resté dans un tiroir peut laisser une question importante sans réponse. Vous risquez alors de repartir dans le flou, de chercher les pièces après le rendez-vous et de devoir reprendre les échanges.",
    resultatTitre: "Arrivez préparé et repartez avec des réponses exploitables.",
    resultatTexte: "Le Dossier Notaire rassemble tout au même endroit pour présenter clairement votre famille, vos biens, vos donations et les questions que vous ne voulez pas oublier.",
    points: [
      "La liste des pièces à réunir avant le rendez-vous",
      "Les questions à poser pour ne pas repartir dans le flou",
      "Le compte rendu pour conserver les réponses obtenues",
    ],
    bouton: "Découvrir le Dossier Notaire",
  },
  upsell2: {
    badge: "Indispensable pour les détenteurs d’une assurance-vie",
    alerteTitre: "Votre contrat peut ne plus transmettre comme vous l’imaginez.",
    alerteTexte: "Le montant visible sur votre relevé ne dit pas qui recevra le capital. Une clause jamais relue, un bénéficiaire mal désigné ou des versements dont les dates sont inconnues peuvent créer une mauvaise surprise lorsque votre famille ne pourra plus vous demander ce que vous vouliez.",
    resultatTitre: "Sachez enfin ce qui est écrit — et ce qui manque encore.",
    resultatTexte: "Vous apprenez à retrouver la clause réellement enregistrée, à reconstituer les dates utiles et à demander les informations manquantes à l’assureur avant d’envisager une modification.",
    points: [
      "La grille pour relire chacun de vos contrats",
      "Le courrier pour obtenir les informations manquantes",
      "Les points à faire vérifier avant toute modification",
    ],
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
                <div className="my-4 border-l-4 border-red bg-red-bg p-4 leading-relaxed">
                  <p className="mb-1 font-bold">{fiche.alerteTitre}</p>
                  <p>{sku === "upsell2" && etat.profil?.av === "O" ? "Vous nous avez indiqué détenir une assurance-vie. " : ""}{fiche.alerteTexte}</p>
                </div>
                <div className="mb-4 text-[1.05rem] leading-relaxed">
                  <p className="mb-1 font-bold text-blue">{fiche.resultatTitre}</p>
                  <p>{fiche.resultatTexte}</p>
                </div>
                <ul className="mb-5 space-y-2">
                  {fiche.points.map((avantage) => (
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
