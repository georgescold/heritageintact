import Link from "next/link";
import type { EtatEspace } from "@/lib/espace";

export function PremiereAction({ etat }: { etat: EtatEspace }) {
  if (!( ["front", "upsell1", "bump", "upsell2", "backend4"] as const).some(sku => etat.possede.has(sku))) return null;
  const hub = `/espace/${etat.acces.jeton}`;
  const action = etat.possede.has("upsell1")
    ? { titre: "Retrouvez votre prochaine action dans votre plan", texte: "Ouvrez votre résultat. Commencez uniquement par la première action et rassemblez la pièce indiquée. Vous pourrez ensuite passer à la suivante.", href: hub + "/simulateur", bouton: "Ouvrir ou reprendre mon plan", fini: "Vous avez identifié votre première démarche et le document à retrouver." }
    : etat.possede.has("bump")
    ? { titre: "Commencez votre Dossier Notaire par votre fiche famille", texte: "Prenez votre livret de famille. Complétez les informations que vous connaissez ; écrivez « à retrouver » pour le reste. Gardez les détails sensibles sur votre copie personnelle.", href: hub + "/document/fiche-famille", bouton: "Remplir ma fiche famille", fini: "Vos liens familiaux sont notés et vos informations manquantes sont repérées." }
    : etat.possede.has("upsell2")
    ? { titre: "Prenez un seul contrat d’assurance-vie pour commencer", texte: "Retrouvez le nom de l’assureur et votre référence de contrat. Complétez ensuite la demande d’informations fournie.", href: hub + "/document/lettre-modification-clause", bouton: "Préparer ma demande à l’assureur", fini: "Votre demande est prête à envoyer par le canal habituel de votre assureur." }
    : etat.possede.has("backend4")
    ? { titre: "Commencez par la volonté qui compte le plus pour vous", texte: "Ouvrez le diagnostic et notez ce que vous voulez protéger, avec vos propres mots.", href: hub + "/document/diagnostic-testament", bouton: "Ouvrir mon diagnostic", fini: "Vous avez formulé votre priorité et repéré le premier document à retrouver." }
    : { titre: "Votre premier pas : la première erreur du guide", texte: "Téléchargez le guide ci-dessus. Lisez la première erreur, puis notez sur une feuille si vous avez déjà effectué une donation. Si vous hésitez, écrivez « à retrouver ».", href: hub + "/pdf/les-7-erreurs", bouton: "Télécharger et commencer mon guide", fini: "Vous avez noté une information connue ou une question précise à éclaircir." };
  return <section className="my-6 border-l-4 border-green bg-green-bg p-5"><p className="mb-2 font-bold text-green">Pour utiliser ce que vous avez déjà</p><h2 className="text-xl">{action.titre}</h2><p className="my-3">{action.texte}</p><Link className="inline-flex min-h-[48px] items-center bg-blue px-5 py-3 font-bold text-white no-underline" href={action.href}>{action.bouton}</Link><p className="mt-3"><strong>Cette étape est faite lorsque :</strong> {action.fini}</p></section>;
}
