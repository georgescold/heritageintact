import type { Metadata } from "next";
import Link from "next/link";
import { Feuille } from "@/components/documents/Feuille";
import { BoutonImprimer } from "@/components/espace/BoutonImprimer";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { BRAND } from "@/lib/config";
import { profilParEmail } from "@/lib/db";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";

export const metadata: Metadata = { title: "Votre classeur" };

/**
 * « TOUT IMPRIMER » — LE CLASSEUR COMPLET, EN UN SEUL GESTE.
 *
 * Une page unique : la page de garde, puis chaque document possédé sur sa
 * propre feuille A4. Le lecteur lance UNE impression et récupère une pile
 * perforable telle quelle — ou un seul PDF s'il choisit « Enregistrer au
 * format PDF » dans la liste des imprimantes.
 *
 * ⚠️ AUCUN PDF N'EST FABRIQUÉ CÔTÉ SERVEUR, et aucune dépendance n'est ajoutée
 * pour cela. C'est le moteur d'impression du navigateur qui fait le travail :
 * le lecteur obtient la boîte de dialogue de son propre système, celle qu'il a
 * déjà utilisée. Un fichier PDF téléchargé, lui, se perd dans « Téléchargements »
 * et repart en demande d'assistance.
 *
 * ⚠️ LES FEUILLES DOIVENT RESTER DES ENFANTS DIRECTS DU MÊME CONTENEUR. Le saut
 * de page est porté par `.feuille { break-before: page }`, neutralisé sur
 * `.feuille:first-of-type` pour ne pas ouvrir le classeur sur une page blanche.
 * `:first-of-type` se calcule PAR PARENT : envelopper chaque document dans son
 * propre `div` ferait de chacun un premier de type, et les quatorze feuilles
 * sortiraient collées les unes aux autres.
 */
export default async function ImprimerPage({ params, searchParams }: { params: Promise<{ jeton: string }>; searchParams: Promise<{ cle?: string | string[] }> }) {
  const { jeton } = await params;

  if (!estJetonValide(jeton)) return <LienInvalide />;

  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;
  if (etat.acces.revoque) return <LienInvalide revoque />;

  const choix = (await searchParams).cle;
  const cles = new Set(Array.isArray(choix) ? choix : choix ? [choix] : []);
  // Les paramètres ne donnent aucun droit : intersection avec les documents acquis.
  const documents = etat.documents.filter(d => cles.has(d.cle));

  // Cas anormal, mais il ne doit surtout pas produire une page de garde suivie
  // de rien : une feuille blanche qui sort de l'imprimante se lit comme une
  // panne, et il n'y a personne à qui la montrer.
  if (documents.length === 0) return <RienAImprimer jeton={jeton} />;

  /**
   * LE PROFIL EST LU UNE FOIS POUR TOUTE LA PILE, ET SUR LA BASE.
   *
   * Une requête, quel que soit le nombre de feuilles : c'est la même personne
   * qui imprime tout son classeur d'un geste, et deux feuilles du même classeur
   * ne peuvent pas se contredire. `null` — le cas normal, celui de quelqu'un
   * qui n'a pas répondu — imprime exactement le classeur d'aujourd'hui.
   *
   * ⚠️ JAMAIS DEPUIS L'URL : ces quatre réponses sont des données personnelles,
   * et une case pré-cochée par paramètre d'adresse serait pré-cochable par
   * n'importe qui.
   */
  const profil = await profilParEmail(etat.acces.email);

  const aujourdhui = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <main className="flex-1">
      <div className="no-print wrap py-6">
        <p className="mb-4">
          <Link href={`/espace/${jeton}`}>← Revenir à mon espace</Link>
        </p>

        <p className="mb-3 text-[1.05rem]">
          Vous allez imprimer {documents.length} document{documents.length > 1 ? "s" : ""}, chacun
          sur sa propre feuille, précédé{documents.length > 1 ? "s" : ""} d&apos;une page de garde à
          votre nom.
        </p>

        <BoutonImprimer libelle="Imprimer ce document" />
      </div>

      {/* Un seul conteneur, des feuilles en enfants directs : voir l'en-tête. */}
      <div className="wrap-wide space-y-8 pb-10 print:space-y-0 print:pb-0">
        <Feuille
          titre={`Le classeur de ${etat.acces.firstName}`}
          sousTitre={`Imprimé le ${aujourdhui}`}
        >
          <p>
            Cette sélection réunit vos supports de préparation et vos fiches de référence.
            Complétez uniquement les champs utiles et notez les informations qui restent à vérifier.
          </p>

          <p className="font-bold">Ce que contient ce classeur :</p>
          {/* `eviter-coupure` : le sommaire ne se coupe pas en deux pages. */}
          <ol className="eviter-coupure list-decimal space-y-1 pl-6">
            {documents.map((doc) => (
              <li key={doc.cle}>{doc.titre}</li>
            ))}
          </ol>

          <p className="text-[0.9rem]">{BRAND} — heritageintact.fr</p>
        </Feuille>

        {documents.map((doc) => {
          // Le corps est un composant : il porte lui-même sa `Feuille`, donc son
          // avertissement pédagogique et son cadre A4. On ne le réenveloppe pas.
          const Corps = doc.corps;
          return <Corps key={doc.cle} profil={profil ?? undefined} />;
        })}
      </div>
    </main>
  );
}

/**
 * Aucun document à imprimer. Pas de bouton, pas de page de garde, aucun mot
 * qui ressemble à une panne : le seul chemin proposé est le retour au hub.
 */
function RienAImprimer({ jeton }: { jeton: string }) {
  return (
    <main className="flex-1">
      <div className="wrap py-10">
        <h1 className="mb-4 text-[1.6rem]">Vos documents à imprimer</h1>
        <p className="mb-6 text-[1.15rem]">
          Aucun document n&apos;est sélectionné. Revenez dans Mon dossier et cochez les supports utiles.
        </p>
        <p>
          <Link href={`/espace/${jeton}`}>← Revenir à mon espace</Link>
        </p>
      </div>
    </main>
  );
}
