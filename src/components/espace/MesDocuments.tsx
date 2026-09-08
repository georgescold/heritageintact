import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import type { EtatEspace } from "@/lib/espace";

/**
 * LE RAYON PAPIER DE L'ESPACE MEMBRE.
 *
 * Une partie de ces acheteurs ne lira jamais à l'écran : ils impriment, ils
 * annotent au stylo, ils rangent dans un classeur — c'est exactement ce que
 * vend Le Classeur Héritage Intact. « Tout imprimer » n'est donc pas une
 * commodité posée en bas de page, c'est le livrable qu'ils attendent.
 *
 * ⚠️ AUCUN ACCORDÉON, AUCUN ONGLET : tout est déplié, une seule colonne. Une
 * liste repliée sur cette cible n'est pas une liste compacte, c'est une liste
 * qui n'existe pas.
 *
 * ⚠️ CE COMPOSANT N'HABILITE RIEN. `etat.documents` est déjà filtré sur ce que
 * le membre possède, et vidé si son accès est révoqué. Ne jamais s'appuyer sur
 * cette liste comme sur une protection : l'URL d'un document est devinable, et
 * la garde qui compte est celle de la page elle-même.
 */
export function MesDocuments({ etat }: { etat: EtatEspace }) {
  const { jeton } = etat.acces;
  const documents = etat.documents;

  if (documents.length === 0) {
    // Cas anormal (accès révoqué, ou catalogue de documents vide pour ce SKU) :
    // un bloc vide se lit comme une panne. Une phrase calme, et rien à faire.
    return (
      <section>
        <Titre />
        <p className="text-[1.05rem]">
          Vos documents à imprimer apparaîtront ici. Il n&apos;y a rien à faire de votre côté : ils
          s&apos;ajoutent tout seuls à mesure que vous avancez.
        </p>
      </section>
    );
  }

  return (
    <section>
      <Titre />

      <p className="mb-4 text-[1.05rem]">
        {documents.length} document{documents.length > 1 ? "s" : ""} à imprimer, à remplir au stylo,
        et à emporter chez votre notaire. Vous pouvez les imprimer un par un, ou tous ensemble.
      </p>

      {/* Le bouton est AVANT la liste : c'est l'action que ce lecteur cherche,
          et la faire descendre sous quatorze lignes revient à la cacher.
          Bleu et non orange — l'orange reste au bouton principal du hub, sinon
          la page n'a plus de premier geste évident. */}
      <div className="mb-6">
        <ButtonLink href={`/espace/${jeton}/imprimer`} variant="blue">
          Tout imprimer ({documents.length} document{documents.length > 1 ? "s" : ""})
        </ButtonLink>
      </div>

      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.cle}>
            <Link
              href={`/espace/${jeton}/document/${doc.cle}`}
              className="flex min-h-[56px] items-center border border-grey-line bg-white px-4 py-3 text-[1.1rem] font-bold no-underline hover:bg-grey-bg"
            >
              {doc.titre}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Le titre du rayon. Sorti pour être écrit une seule fois, y compris dans le cas vide. */
function Titre() {
  return <h2 className="mb-3 text-[1.35rem]">MES DOCUMENTS À IMPRIMER</h2>;
}
