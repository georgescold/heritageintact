import type { Metadata } from "next";
import Link from "next/link";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { Simulateur } from "@/components/simulateur/Simulateur";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";

export const metadata: Metadata = { title: "Le Calcul Automatique de votre facture" };

/**
 * LE SIMULATEUR AUTOMATIQUE — la version qui calcule à la place du client.
 *
 * ⚠️ LA GARDE D'HABILITATION EST ICI, PAS DANS LA LISTE QUI Y MÈNE. L'URL est
 * courte et devinable : masquer le lien dans « MES DOCUMENTS » ne protège rien.
 * C'est `possede` qui protège, et il se vérifie à chaque affichage.
 *
 * Trois produits y donnent droit, et c'est voulu : le Simulateur se vend seul à
 * 147 €, mais il est aussi COMPRIS dans Le Plan à 297 € et dans le pack à
 * 347 €. Le refacturer à quelqu'un qui vient de l'acheter dans un lot serait un
 * remboursement annoncé.
 *
 * ⚠️ L'année de référence est calculée ICI, côté serveur, et passée au
 * composant. Le moteur ne lit jamais l'horloge lui-même : c'est ce qui le rend
 * vérifiable à la main, et c'est ce qui évite un écart entre le rendu serveur
 * et le rendu navigateur d'un client dont la machine est mal réglée.
 */
export default async function SimulateurPage({ params }: { params: Promise<{ jeton: string }> }) {
  const { jeton } = await params;

  if (!estJetonValide(jeton)) return <LienInvalide />;
  const etat = await chargerEspace(jeton);
  if (!etat) return <LienInvalide />;

  const aDroit =
    etat.possede.has("backend1") || etat.possede.has("upsell1") || etat.possede.has("pack1");

  if (!aDroit) {
    return (
      <div className="wrap py-12">
        <h1 className="mb-3 text-[1.5rem]">Le Calcul Automatique de votre facture</h1>
        <p className="mb-4 text-[1.05rem]">
          Cet outil ne fait pas partie de ce que vous avez. Vous le trouverez dans votre espace,
          avec son prix, si vous souhaitez l&apos;ajouter.
        </p>
        <p className="mb-6 text-[1.05rem]">
          En attendant, le <strong>Feuille de votre Facture Invisible</strong> est dans vos
          documents : il donne le même chiffre, rempli à la main.
        </p>
        <Link
          href={`/espace/${jeton}`}
          className="flex min-h-[52px] w-full max-w-sm items-center justify-center border-2 border-blue bg-white px-4 text-[1.05rem] font-bold text-blue"
        >
          Revenir à mon espace
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="wrap pt-6">
        <Link href={`/espace/${jeton}`} className="text-[1rem] underline">
          ← Mon espace
        </Link>
      </div>
      <Simulateur anneeCourante={new Date().getFullYear()} />
    </>
  );
}
