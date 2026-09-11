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
    alerteTitre: "Le plus grand risque maintenant : agir sérieusement dans le mauvais ordre.",
    alerteTexte: "Une règle générale ne sait rien de votre couple, de vos donations ni de la propriété réelle de votre maison. Sans relier ces faits, vous pouvez consacrer des semaines au sujet le plus rassurant pendant qu’une date ou une protection plus fragile continue d’attendre.",
    resultatTitre: "Vous saurez quoi vérifier d’abord — et pourquoi.",
    resultatTexte: "Vos réponses génèrent une estimation expliquée, révèlent les données capables de la faire changer et produisent votre plan détaillé. Vous ne repartez plus avec une liste : vous repartez avec un ordre.",
    points: [
      "Votre estimation et les hypothèses qui l’expliquent",
      "Les alertes concernant votre famille, votre maison et votre capacité future de décider",
      "Votre plan détaillé et votre dossier à remettre au professionnel",
    ],
    bouton: "Construire mon plan adapté",
  },
  bump: {
    badge: "Avant votre rendez-vous",
    alerteTitre: "Une heure de rendez-vous ne rattrape pas le document resté dans un tiroir.",
    alerteTexte: "Le notaire ne peut pas analyser ce que vous oubliez de signaler. Une date approximative ou un acte introuvable peut repousser la seule réponse recherchée et vous imposer de reprendre l’échange depuis le début.",
    resultatTitre: "Faites apparaître les manques avant qu’ils ne bloquent le rendez-vous.",
    resultatTexte: "Le Dossier Notaire transforme vos papiers et souvenirs en inventaire, questions et compte rendu. Il vous aide aussi à demander avant le rendez-vous ce qui est inclus, ce qui sera facturé et dans quel cas un devis est nécessaire.",
    points: [
      "La liste des pièces à réunir avant le rendez-vous",
      "Les questions à poser pour ne pas repartir dans le flou",
      "Le compte rendu pour conserver les réponses obtenues",
    ],
    bouton: "Découvrir le Dossier Notaire",
  },
  upsell2: {
    badge: "Indispensable pour les détenteurs d’une assurance-vie",
    alerteTitre: "L’assureur exécutera le contrat, pas la promesse faite à votre famille.",
    alerteTexte: "Le capital affiché peut être exact alors que la clause ne l’est plus pour votre vie actuelle. Si l’écart est découvert après votre décès, vous ne pourrez plus expliquer un ancien nom, une répartition imprécise ou faire signer la correction que vous pensiez encore possible.",
    resultatTitre: "Passez du relevé rassurant à la preuve écrite.",
    resultatTexte: "Vous obtenez la clause réellement enregistrée, reconstruisez les versements utiles et préparez une demande précise. Vous saurez ce qui est confirmé, ce qui manque et ce qui doit être vérifié avant toute modification.",
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
          Tous vos documents seront disponibles dans l’onglet « Mon dossier ».
        </p>
      </div>

      <div className="space-y-5">
        {offres.map((sku) => {
          const fiche = VITRINE[sku];
          if (!fiche) return null;
          const plan = sku === "upsell1";
          const assurance = sku === "upsell2";
          const href = plan && commandeGuide
            ? `/plan-complet?o=${encodeURIComponent(commandeGuide.id)}`
            : `/espace/${etat.acces.jeton}/ajouter/${sku}`;

          return (
            <article
              key={sku}
              className={`overflow-hidden border-2 bg-white shadow-[0_6px_18px_rgba(9,55,96,0.10)] ${plan ? "border-orange" : assurance ? "border-green" : "border-grey-line"}`}
            >
              <p className={`px-5 py-2 text-sm font-bold uppercase tracking-wide text-white ${plan ? "bg-orange" : assurance ? "bg-green" : "bg-blue"}`}>
                {fiche.badge}
              </p>
              <div className="p-5 sm:p-6">
                <h3 className={`text-[1.35rem] leading-snug ${assurance ? "text-green" : "text-blue"}`}>{PRODUCTS[sku].name}</h3>
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
                {sku === "bump" && (
                  <details className="mb-5 border border-grey-line bg-grey-bg p-3 text-[0.95rem]">
                    <summary className="cursor-pointer font-bold text-blue">
                      Un rendez-vous supplémentaire peut-il coûter plus cher ?
                    </summary>
                    <p className="mt-2 leading-relaxed">
                      Pas automatiquement. Les échanges liés à un acte tarifé peuvent être inclus.
                      Une consultation distincte, des recherches, un écrit ou un nouvel échange peuvent
                      cependant être facturés selon l’étude. Demandez ce qui est inclus et si un devis
                      sera nécessaire.
                    </p>
                  </details>
                )}
                <Link
                  className={`flex min-h-[54px] items-center justify-center px-4 py-3 text-center font-bold text-white no-underline ${plan ? "bg-orange" : assurance ? "bg-green" : "bg-blue"}`}
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
