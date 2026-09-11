import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { acheterDepuisEspace } from "@/app/espace/achat";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { avantagesProduit, resumeProduit } from "@/components/espace/Boutique";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { Check, Panel } from "@/components/ui";
import { BoutonAchat as Button } from "@/components/BoutonAchat";
import { PRODUCTS, SKU_TUNNEL_UNIQUEMENT, euros, type ProductSku } from "@/lib/config";
import { commandeAvecCarte } from "@/lib/db";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { devisPour } from "@/lib/devis";
import { stripe } from "@/lib/stripe";
import { BilanComplement } from "@/components/BilanComplement";
import { DemonstrationPack } from "@/components/DemonstrationPack";
import { AvantageDemarrage } from "@/components/AvantageDemarrage";
import { SortieOffre } from "@/components/SortieOffre";
import { ObjectionsComplement } from "@/components/ObjectionsComplement";
import { conseilOffre } from "@/lib/positionnement";
import { ValeurComplement } from "@/components/ValeurComplement";

export const metadata: Metadata = {
  title: "Ajouter à mon espace",
  // Le jeton est dans l'URL : cette page ne doit jamais être indexée, ni
  // laisser fuir son adresse dans un en-tête Referer.
  robots: { index: false, follow: false },
};

/**
 * L'ÉCRAN DE CONFIRMATION D'UN ACHAT DEPUIS L'ESPACE.
 *
 * ⚠️ DEUX CLICS, JAMAIS UN SEUL, ET C'EST UNE DÉCISION DE FOND.
 *
 * Le clic unique du tunnel se justifie trois secondes après que le client a
 * saisi sa carte : il est encore en train de payer, le geste est continu. Ici,
 * on est trois semaines ou trois mois plus tard. Un débit de 297 € qui part
 * d'un seul clic à ce moment-là n'est pas une vente, c'est un appel à la
 * banque, une opposition, et un litige — sur quelqu'un de 74 ans qui n'aura
 * pas compris ce qu'il venait de faire.
 *
 * Donc : un écran qui dit le nom complet, ce qu'on reçoit, le prix en gros, la
 * garantie, et la carte qui sera débitée. Puis DEUX cibles seulement, un OUI
 * et un NON, et rien entre les deux.
 *
 * ⚠️ LES QUATRE GARDES SONT ICI ET AUSSI DANS LA SERVER ACTION. Cette URL est
 * devinable : masquer la ligne dans le rendu de la boutique ne protège rien.
 */
export default async function AjouterPage({
  params,
  searchParams,
}: {
  params: Promise<{ jeton: string; sku: string }>;
  searchParams: Promise<{ err?: string }>;
}) {
  const { jeton, sku } = await params;
  const { err } = await searchParams;

  // La forme du jeton se vérifie sans ouvrir la base : une URL tronquée par un
  // client mail est le scénario nominal, pas l'exception.
  if (!estJetonValide(jeton)) return <LienInvalide />;

  // GARDE 1 — jeton connu, accès ouvert. Jamais une 404 : sur quelqu'un qui a
  // payé, un écran d'erreur se lit comme la confirmation qu'il s'est fait
  // avoir.
  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;
  if (etat.acces.revoque) return <LienInvalide revoque />;

  const hub = `/espace/${jeton}`;

  // Un SKU inventé se traite comme les trois refus suivants : retour silencieux
  // au hub. Ni 404, ni « accès refusé » — le second apprendrait surtout au
  // visiteur que l'URL devinée était bonne.
  if (!estSkuConnu(sku)) redirect(hub);
  const produit = PRODUCTS[sku];

  // GARDE 2 — la boutique est réservée aux clients du guide principal.
  // Le guide est désormais téléchargé : son ancienne « étape 0 » en ligne
  // n'est donc plus un signal d'éligibilité fiable.
  if (!etat.possede.has("front")) redirect(hub);

  // GARDE 3 — on ne vend jamais un produit dont le contenu n'existe pas.
  if (!produit.disponible) redirect(hub);

  // GARDE 4 — habilitation GLOBALE, expansion `INCLUS_DANS` comprise : qui a
  // payé 297 € pour Le Plan possède déjà Le Simulateur personnalisé, et on ne
  // le lui refacture jamais 147 €.
  if (etat.possede.has(sku)) redirect(hub);

  // GARDE 5 — les SKU réservés au tunnel. Le Dossier complet ne se justifie
  // que par le clic unique, trois secondes après la saisie de la carte ;
  // trois mois plus tard, il proposerait 347 € à quelqu'un qui possède
  // peut-être déjà la moitié du contenu. La garde 4 ne le voit pas : elle ne
  // teste que `pack1` lui-même, jamais ses deux composants.
  if (SKU_TUNNEL_UNIQUEMENT.includes(sku)) redirect(hub);

  const carte = await carteEnregistree(etat.acces.email);
  const acheter = acheterDepuisEspace.bind(null, jeton, sku);
  const avantages = avantagesProduit(sku);

  /**
   * ⚠️ LE PRIX AFFICHÉ EST CELUI QUI SERA DÉBITÉ, ET IL SORT DE LA MÊME
   * FONCTION SERVEUR QUE LE DÉBIT.
   *
   * `PRODUCTS[sku].price` affichait 97 € là où `acheterDepuisEspace` débite
   * 50 € : la ligne « 3 clauses bénéficiaires commentées » est dans les deux
   * piles de valeur et n'est encaissée qu'une fois. Deux chemins qui calculent
   * le même nombre finissent toujours par diverger — un écran qui annonce un
   * montant et une banque qui en prélève un autre, sur un lecteur de 74 ans,
   * c'est un appel à l'agence avant d'être un email au support.
   *
   * `etat.possede` vient de la base (`possessions`), jamais de l'URL.
   */
  const devis = await devisPour(etat.acces.email, sku);
  const prix = devis.montant;

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap py-8">
          <p className="mb-5">
            <Link href={hub}>← Revenir à mon espace</Link>
          </p>

          {err && <BandeauEchec motif={err} />}

          <h1 className="mb-3 text-[1.5rem] leading-snug sm:text-[1.8rem]">{sku==="bump"?"Arrivez avec vos questions. Repartez avec une trace des réponses.":conseilOffre(sku==="upsell2"?{...etat.profil,objectif:"assurance-vie",av:"O"}:etat.profil).titre}</h1>
          <p className="mb-3 font-bold text-orange-dark">{produit.name}</p>
          <p className="mb-6 text-[1.15rem]">{resumeProduit(sku)}</p>

          {avantages.length > 0 && (
            <div className="mb-6">
              <Panel title="Ce que vous recevez">
                <ul className="space-y-2 text-[1.05rem]">
                  {avantages.map((a) => (
                    <Check key={a}>{a}</Check>
                  ))}
                </ul>
                <p className="mt-3 text-[0.95rem] text-text-soft">
                  Tout est disponible immédiatement dans votre espace, sur cette même page. Il
                  n&apos;y a ni mot de passe, ni compte à créer.
                </p>
              </Panel>
            </div>
          )}

          {sku!=="bump"&&<ValeurComplement av={sku==="upsell2"} complet={sku==="pack1"}/>}
          {(sku === "upsell1" || sku === "pack1") && <DemonstrationPack />}
          <BilanComplement sku={sku} possede={etat.possede} montant={devis} />
          <AvantageDemarrage promotion={devis.promotion} base={devis.avantRemise}/>
          <ObjectionsComplement av={sku==="upsell2"} dossier={sku==="bump"}/>

          {/* ⚠️ La garantie est réécrite ici plutôt que reprise de `Guarantee` :
              le texte partagé parle de la simulation et du simulateur, ce qui
              est vrai du guide et faux de tout ce qui se vend depuis
              l'espace. Une garantie qui décrit un autre produit ne rassure
              pas, elle fait douter qu'elle s'applique. */}
          <div className="mb-6">
            <Panel tone="green" title="Garantie 30 jours : satisfait ou remboursé">
              <p className="text-[1.05rem]">
                Vous avez 30 jours pour regarder. Si cela ne vous sert pas, écrivez-nous&nbsp;: un
                message suffit, sans justification à fournir, et vous êtes remboursé intégralement.
                Votre accès à {PRODUCTS.front.name} n&apos;est pas concerné.
              </p>
            </Panel>
          </div>

          {/* LA CARTE, ÉCRITE AVANT LE BOUTON. Le membre doit savoir ce qui va
              être débité, et sur quoi, AVANT de poser le doigt — pas après. */}
          <Panel title="Votre carte">
            <p className="text-[1.1rem]">
              {carte ? (
                <>
                  Votre carte enregistrée&nbsp;: <strong>{carte.marque}</strong> se terminant par{" "}
                  <strong>{carte.fin}</strong>.
                </>
              ) : (
                <>
                  Le débit sera fait sur <strong>votre carte enregistrée</strong>, celle de votre
                  commande précédente.
                </>
              )}
            </p>
            <p className="mt-2 text-[0.95rem] text-text-soft">
              Vous n&apos;avez rien à ressaisir. Si votre banque demande une confirmation, un écran
              vous la proposera juste après, et votre commande précédente reste bien enregistrée
              dans tous les cas.
            </p>
          </Panel>

          {/* DEUX CIBLES, ET RIEN D'AUTRE. */}
          <form id="decision-membre" action={acheter} className="mt-6">
            <input type="hidden" name="montantAffiche" value={prix}/>
            <Button variant="green">
              {prix === 0 ? "Activer sans paiement" : `Confirmer mon achat : ${euros(prix)}`}
            </Button>
          </form>

          <p className="mt-5 text-center text-[1.05rem]">
            <Link href={hub} className="text-text-soft">
              Non, revenir à mon espace
            </Link>
          </p>

          <div className="mt-8">
            <TrustRow />
          </div>

          <p className="mt-6 text-[0.9rem] text-text-soft">
            En validant, vous demandez l&apos;accès immédiat à ce contenu numérique et renoncez à
            votre droit de rétractation de 14 jours. La garantie contractuelle de 30 jours «
            satisfait ou remboursé » s&apos;applique intégralement.
          </p>
        </div>
      </main>
      <Footer />
      <SortieOffre produit={sku} href="#decision-membre" montant={devis.montant} promotion={devis.promotion}/>
    </>
  );
}

/**
 * ⚠️ Le SKU arrive d'une URL, pas du type. `PRODUCTS[sku]` sur une clé
 * inventée vaut `undefined`, et lire `.name` dessus rend une 500 à quelqu'un
 * qui a simplement recopié son lien de travers.
 */
function estSkuConnu(v: string): v is ProductSku {
  return Object.prototype.hasOwnProperty.call(PRODUCTS, v);
}

/**
 * LA CARTE MÉMORISÉE, LUE CHEZ STRIPE.
 *
 * « Visa se terminant par 4242 » est ce qui transforme un bouton inquiétant en
 * bouton compréhensible : le membre reconnaît sa propre carte, donc il sait
 * exactement ce qui va se passer.
 *
 * ⚠️ Ne lève jamais et ne bloque jamais l'achat. Sans clé Stripe, ou si
 * l'appel échoue, la page dit simplement « votre carte enregistrée » sans
 * détail — c'est moins bon, mais c'est vrai, et une page de paiement qui
 * tombe en panne pour un libellé serait absurde.
 */
async function carteEnregistree(email: string): Promise<{ marque: string; fin: string } | null> {
  if (!stripe) return null;

  const commande = await commandeAvecCarte(email);
  if (!commande?.stripePaymentMethodId) return null;

  try {
    const moyen = await stripe.paymentMethods.retrieve(commande.stripePaymentMethodId);
    const carte = moyen.card;
    if (!carte?.last4) return null;
    return { marque: marqueLisible(carte.brand), fin: carte.last4 };
  } catch (e) {
    console.error("[achat-espace] lecture du moyen de paiement", e);
    return null;
  }
}

/**
 * Le nom de la marque tel que le lecteur le voit sur sa propre carte.
 *
 * Stripe rend « visa », « cartes_bancaires », « mastercard ». Aucun de ces
 * trois n'est écrit sur le morceau de plastique que le membre a dans son
 * portefeuille, et c'est là qu'il va vérifier.
 */
function marqueLisible(brand: string): string {
  const connues: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    cartes_bancaires: "Carte Bancaire",
  };
  return connues[brand] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}

/**
 * LE BANDEAU D'ÉCHEC, ET IL EST CALME.
 *
 * ⚠️ Aucun code, aucun terme technique, aucun mot « erreur ». Et surtout, la
 * phrase qui compte est répétée dans les deux cas : la commande précédente
 * reste bien enregistrée. C'est la seule question que se pose vraiment
 * quelqu'un qui vient de voir un paiement échouer sur un site qu'il connaît
 * depuis trois semaines — « est-ce que j'ai perdu ce que j'avais déjà payé ».
 */
function BandeauEchec({ motif }: { motif: string }) {
  return (
    <p role="alert" className="mb-6 border-2 border-red bg-red-bg px-4 py-3 text-[1.05rem]">
      {motif === "prix" ? (
        <>
          Le montant ou votre commande en attente doit être revérifié. Actualisez cette page
          avant de confirmer. Si le message persiste, contactez-nous depuis votre espace.
          Votre commande précédente reste enregistrée.
        </>
      ) : motif === "sca" ? (
        <>
          Votre banque demande une confirmation pour ce paiement. Rien n&apos;a été débité.{" "}
          <strong>Votre commande précédente reste bien enregistrée</strong>, et vous pouvez
          reprendre ci-dessous.
        </>
      ) : (
        <>
          Votre banque n&apos;a pas accepté ce paiement, et rien n&apos;a été débité. Cela arrive
          souvent pour un plafond de carte, et cela se règle par un appel à votre agence.{" "}
          <strong>Votre commande précédente reste bien enregistrée</strong>&nbsp;: vous ne perdez
          rien de ce que vous avez déjà.
        </>
      )}
    </p>
  );
}
