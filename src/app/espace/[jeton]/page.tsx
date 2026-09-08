import type { Metadata } from "next";
import { Footer, Header } from "@/components/Chrome";
import Link from "next/link";
import { Boutique } from "@/components/espace/Boutique";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { ListeEtapes } from "@/components/espace/ListeEtapes";
import { MesDocuments } from "@/components/espace/MesDocuments";
import { MonLien } from "@/components/espace/MonLien";
import { ButtonLink } from "@/components/ui";
import { PRODUCTS, type ProductSku } from "@/lib/config";
import { marquerVu } from "@/lib/db";
import { chargerEspace, type EtatEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";
import { ETAPES } from "@/lib/methode";

export const metadata: Metadata = { title: "Mon espace" };

/**
 * LE HUB — LA SEULE DESTINATION DU MEMBRE.
 *
 * Une page, une colonne, tout déplié, la même à chaque visite. Il reviendra dix
 * ou quinze fois pendant qu'il suit La Méthode, et il ne doit jamais avoir à
 * réapprendre où sont les choses : c'est toujours le même ordre, du haut vers
 * le bas, et le seul geste demandé est de faire défiler.
 *
 * ⚠️ L'ORDRE DES BLOCS N'EST PAS UNE MISE EN PAGE, C'EST UNE RÉPONSE. La seule
 * question qu'il se pose en arrivant est « qu'est-ce que je fais maintenant ».
 * Elle est traitée en premier, par UN bouton, et pas par un choix à faire :
 *
 *   1. son prénom             — il est au bon endroit, c'est bien chez lui
 *   2. UN gros bouton orange  — la seule action, jamais une liste d'options
 *   3. ses 8 étapes           — où il en est
 *   4. ses documents          — ce qu'il a payé, sous forme de papier
 *   5. ce qu'il n'a pas       — le rayon, et jamais avant d'avoir ouvert l'étape 0
 *   6. son lien personnel     — le garde-fou, écrit en clair
 *
 * ⚠️ AUCUN `<details>`, AUCUN ONGLET, AUCUN MENU. Ne jamais utiliser le
 * composant `FAQ` de `ui.tsx` sur cette page : il repose sur `<details>`, donc
 * sur un contenu fermé. Un menu fermé est une porte fermée, et ce qu'il ne voit
 * pas, il croit qu'il ne l'a pas acheté.
 */
export default async function HubPage({
  params,
  searchParams,
}: {
  params: Promise<{ jeton: string }>;
  searchParams: Promise<{ ajoute?: string }>;
}) {
  const { jeton } = await params;
  const { ajoute } = await searchParams;

  // La forme du jeton se vérifie sans ouvrir la base : une URL tronquée par un
  // client mail est le scénario nominal, pas l'exception.
  if (!estJetonValide(jeton)) return <LienInvalide />;

  const etat = await chargerEspace(jeton);

  // ⚠️ JAMAIS UNE 404, JAMAIS LE MOT « ERREUR », JAMAIS UN CODE TECHNIQUE.
  // `LienInvalide` porte le formulaire de récupération : c'est la seule chose
  // utile à montrer à quelqu'un dont le lien ne fonctionne pas.
  if (!etat) return <LienInvalide />;

  // Accès fermé : l'écran poli, et le seul document que le contrat lui laisse
  // (CGV art. 6 — « le client conserve l'accès au simulateur »). `documents`
  // est déjà réduit à cette feuille par `chargerEspace`.
  if (etat.acces.revoque) {
    const feuille = etat.documents[0];
    return (
      <LienInvalide
        revoque
        simulateur={feuille ? `/espace/${jeton}/document/${feuille.cle}` : undefined}
      />
    );
  }

  // La visite, notée sans bloquer le rendu : `vu_le` ne sert qu'au support et à
  // la relance, il ne vaut pas une milliseconde d'attente — ni, surtout, une
  // page en panne si la base tousse au mauvais moment.
  void marquerVu(jeton).catch((e) => console.error("[espace] marquerVu", e));

  const { firstName } = etat.acces;

  return (
    <>
      <Header minimal />
      <main className="flex-1">
        <div className="wrap space-y-10 py-8">
          {ajoute && <BandeauAjout sku={ajoute} />}

          <section>
            <h1 className="mb-2 text-[1.6rem] sm:text-[1.9rem]">
              Bonjour {firstName || "et bienvenue"}.
            </h1>
            <p className="text-[1.1rem]">
              Vous êtes chez vous. Tout ce que vous avez acheté est sur cette page, et cette page ne
              change jamais d&apos;adresse.
            </p>
          </section>

          <ProchaineAction etat={etat} />

          <section>
            <h2 className="mb-2 text-[1.35rem]">MES ÉTAPES</h2>
            {/* ⚠️ Un compte en clair, jamais un pourcentage et jamais une barre
                seule. « 37 % » ne dit rien à qui veut savoir combien il lui
                reste de soirées de travail ; « 3 étapes sur 8 » le dit. */}
            <p className="mb-4 text-[1.15rem] font-bold text-blue">
              {etat.nbFaites} étape{etat.nbFaites > 1 ? "s" : ""} sur {ETAPES.length}
            </p>
            <ListeEtapes etat={etat} />
          </section>

          {/* LE SIMULATEUR AUTOMATIQUE, quand il est possédé.
              Il ne vit pas dans « MES DOCUMENTS » : ce n'est pas une feuille à
              imprimer mais un outil qui calcule, et le confondre avec le
              Simulateur de Facture Invisible — celui qu'on remplit au stylo —
              ferait croire au client qu'il l'a déjà vu. */}
          {(etat.possede.has("backend1") ||
            etat.possede.has("upsell1") ||
            etat.possede.has("pack1")) && (
            <section>
              <h2 className="mb-3 text-[1.3rem] text-blue">Le Simulateur Automatique</h2>
              <p className="mb-3 text-[1.05rem]">
                Il fait le calcul à votre place, et il refait les 3 dates à chaque changement. Ce
                que vous y saisissez reste sur votre ordinateur.
              </p>
              <Link
                href={`/espace/${jeton}/simulateur`}
                className="flex min-h-[56px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-5 text-[1.1rem] font-bold text-white no-underline sm:w-auto sm:px-8"
              >
                Ouvrir le Simulateur
              </Link>
            </section>
          )}

          <MesDocuments etat={etat} />

          {/* ⚠️ La boutique se conditionne toute seule : elle ne rend rien tant
              que l'étape 0 n'a pas été ouverte. On ne double pas cette règle
              ici — on écrit seulement ce qui prend sa place à l'écran, parce
              qu'un blanc en bas de page se lit comme une page inachevée. */}
          <Boutique etat={etat} />
          {!etat.etape0Ouverte && (
            <p className="text-[1.1rem] text-text-soft">
              Commencez par l&apos;étape 0. Le reste viendra après.
            </p>
          )}

          <MonLien jeton={jeton} email={etat.acces.email} />

          <p className="text-[0.95rem] text-text-soft">
            {PRODUCTS.front.name} est un contenu pédagogique d&apos;information générale. Elle ne
            constitue pas un conseil personnalisé et ne remplace pas votre notaire.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

/**
 * LE SEUL GROS BOUTON DE LA PAGE, ET IL N'Y EN A QU'UN.
 *
 * ⚠️ Une action à exécuter, jamais un choix à faire. « Par où commencer » est
 * exactement la question qu'on ne veut pas lui poser : il a payé pour un
 * protocole, des étapes dans l'ordre, sans rien à improviser. Le bouton dit
 * quelle étape, ce qu'elle contient, et combien de temps elle prend — les trois
 * informations qui décident s'il s'y met ce soir ou jamais.
 *
 * C'est aussi le seul orange de la page : le jour où un second bouton orange
 * apparaît ici, il n'y a plus de premier geste évident.
 */
function ProchaineAction({ etat }: { etat: EtatEspace }) {
  const suivante = etat.reprendre;

  // Les 8 étapes sont terminées. On ne fabrique pas une action de plus : on le
  // dit, et on le renvoie vers ce qui reste à faire dans la vraie vie.
  if (!suivante) {
    return (
      <section className="border-2 border-green bg-green-bg p-5">
        <h2 className="mb-2 text-[1.35rem] text-green">Vous avez terminé les 8 étapes.</h2>
        <p className="text-[1.1rem]">
          Il vous reste le plus important, et il ne se passe pas sur cet écran : imprimez vos
          documents, remplissez-les au stylo, et prenez rendez-vous chez votre notaire. Vos étapes
          restent ici, vous pouvez les revoir autant de fois que vous voulez.
        </p>
      </section>
    );
  }

  // « COMMENCER » tant qu'il n'a ouvert aucune étape, « REPRENDRE » ensuite.
  // C'est l'OUVERTURE qui fait la différence, pas la coche : quelqu'un qui a
  // regardé l'étape 0 sans la cocher n'est plus en train de commencer.
  const rienOuvert = etat.etapes.every((e) => !e.ouverte);

  return (
    <section>
      <ButtonLink href={`/espace/${etat.acces.jeton}/etape/${suivante.numero}`}>
        {rienOuvert ? "COMMENCER" : "REPRENDRE"} — Étape {suivante.numero} : {suivante.titre} (
        {suivante.minutes} minutes)
      </ButtonLink>
      <p className="mt-3 text-[1.05rem] text-text-soft">{suivante.resume}</p>
    </section>
  );
}

/**
 * LE BANDEAU VERT DU RETOUR D'ACHAT.
 *
 * ⚠️ Il dit OÙ EST LA CHOSE ACHETÉE, pas seulement qu'elle est achetée. « C'est
 * ajouté » tout seul laisse quelqu'un de 74 ans devant un écran qui ressemble
 * en tout point à celui d'avant, en train de chercher ce qu'il vient de payer —
 * et c'est un email au support dans l'heure.
 *
 * Le SKU vient de l'URL : il est vérifié avant d'être lu dans le catalogue, un
 * paramètre inventé n'affiche simplement rien.
 */
function BandeauAjout({ sku }: { sku: string }) {
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, sku)) return null;
  const produit = PRODUCTS[sku as ProductSku];

  return (
    <p
      role="status"
      className="border-2 border-green bg-green-bg px-4 py-3 text-[1.1rem] font-bold text-green"
    >
      ✔ C&apos;est ajouté : {produit.name}. Vous le trouverez dans vos documents, plus bas.
    </p>
  );
}
