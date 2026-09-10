import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { ButtonLink } from "@/components/ui";
export const metadata: Metadata = { title: "Aperçu du Dossier — extraits de présentation" };
/** Présentation indépendante : aucun composant de document payant n’est importé ou masqué en CSS. */
export default function Page() {
  return <><Header minimal /><main className="wrap flex-1 py-8">
    <p className="mb-3 text-sm font-bold uppercase tracking-wide text-orange-dark">Aperçu commercial limité · Exemple fictif</p>
    <h1 className="mb-4 text-[2rem]">Le guide vous aide à comprendre.<br />Le Dossier vous évite de partir d’une page blanche.</h1>
    <p className="mb-6">Vous savez ce que vous voulez demander. Mais au moment de préparer le rendez-vous : où noter les réponses ? Quelles pièces réunir ? Comment écrire au notaire ? Le Dossier facultatif rassemble les trames pour passer à cette préparation.</p>
    <section id="dossier" className="mb-7 overflow-hidden border-2 border-blue bg-[#f5f2eb]">
      <h2 className="bg-blue p-4 text-[1.4rem] text-white">Le Dossier de préparation · 17 €</h2>
      <div className="p-5">
        <p className="mb-4 font-bold">Un aperçu de l’usage — pas le document complet</p>
        <div className="border border-grey-line bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-text-soft">Extrait de démonstration · Claire et Marc</p>
          <p className="mt-3"><strong>Notre priorité :</strong> comprendre comment chacun pourrait rester dans le logement.</p>
          <p className="mt-3"><strong>Un document à retrouver :</strong> notre contrat de mariage.</p>
        </div>
        <p className="mt-4 text-sm text-text-soft">Deux éléments illustratifs seulement. Les rubriques complètes, les trames à remplir, le modèle de message et le suivi des réponses ne sont pas affichés sur cette page.</p>
      </div>
    </section>
    <h2 className="mb-4 text-[1.5rem]">Ce que le Dossier vous aide à faire</h2>
    <ul className="mb-6 list-disc space-y-3 pl-6">
      <li><strong>Rassembler sans oublier où vous en êtes :</strong> un inventaire et une liste de pièces à réunir.</li>
      <li><strong>Écrire sans chercher chaque formulation :</strong> un modèle de message à adapter au rendez-vous.</li>
      <li><strong>Ne pas perdre les réponses :</strong> une trame de compte rendu et de suivi après l’échange.</li>
    </ul>
    <p className="mb-5">Supports numériques dans votre espace personnel après achat, à lire et à imprimer. Aucun dossier physique expédié. Pas de conseil juridique personnalisé.</p>
    <p className="mb-5 font-bold">Le guide reste complet sans ce Dossier. Vous choisissez cette option à 17 € sur le bon de commande ; elle n’est pas précochée.</p>
    <ButtonLink href="/commande">Revenir au bon de commande et choisir</ButtonLink>
    <p className="mt-3 text-center text-sm text-text-soft">Si cette page s’est ouverte dans un autre onglet, fermez-la pour retrouver votre commande inchangée.</p>
  </main><Footer /></>;
}
