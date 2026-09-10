import type { Metadata } from "next";
import Link from "next/link";
import { LienInvalide } from "@/components/espace/LienInvalide";
import { SimulationPlan } from "@/components/simulateur/SimulationPlan";
import { chargerEspace } from "@/lib/espace";
import { estJetonValide } from "@/lib/jeton";

export const metadata: Metadata = { title: "Atelier de simulation pédagogique" };

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
  if (!etat || etat.acces.revoque) return <LienInvalide />;

  const aDroit = etat.possede.has("backend1") || etat.possede.has("upsell1") || etat.possede.has("pack1");

  if (!aDroit) {
    return (
      <div className="wrap py-12">
        <h1 className="mb-3 text-[1.5rem]">Atelier de simulation pédagogique</h1>
        <p className="mb-4 text-[1.05rem]">Cet outil est inclus dans « Mon simulateur + mon plan adapté ». Consultez votre espace pour retrouver cette offre.</p>
        <p className="mb-6 text-[1.05rem]">
          En attendant, la fiche de calcul pédagogique est dans vos documents :
          elle explique le barème sur un exemple fictif.
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
      <main className="wrap py-4"><SimulationPlan verrouille={false} /></main>
    </>
  );
}
