import Link from "next/link";
import type { EtatEspace, EtatEtape } from "@/lib/espace";

/**
 * LES 8 ÉTAPES, TOUTES VISIBLES, TOUJOURS.
 *
 * ⚠️ AUCUN ACCORDÉON, AUCUN ONGLET, AUCUN « voir plus ». Ce qu'il ne voit pas,
 * il croit qu'il ne l'a pas acheté — et il écrit au support pour demander où
 * sont les sept autres étapes. Une liste repliée sur cette cible n'est pas une
 * liste compacte, c'est une liste qui n'existe pas.
 *
 * ⚠️ AUCUNE ÉTAPE N'EST VERROUILLÉE. Il a tout payé, il prend les étapes dans
 * l'ordre qu'il veut. Un cadenas sur l'étape 4 n'ajouterait aucune valeur et
 * transformerait un protocole en parcours imposé.
 *
 * Les lignes font 64 px de haut et occupent toute la largeur : il lit sur
 * téléphone, souvent sans lunettes, avec un doigt qui tremble un peu. Un lien
 * de 25 px raté trois fois de suite, c'est un abandon.
 */
export function ListeEtapes({ etat }: { etat: EtatEspace }) {
  const { jeton } = etat.acces;

  return (
    <ul className="space-y-2">
      {etat.etapes.map((e) => (
        <li key={e.etape.cle}>
          <Link
            href={`/espace/${jeton}/etape/${e.etape.numero}`}
            className={`flex min-h-[64px] items-center gap-3 border px-4 py-3 no-underline ${
              e.faite ? "border-green/50 bg-green-bg" : "border-grey-line bg-white hover:bg-grey-bg"
            }`}
          >
            <Marqueur etat={e} />
            <span className="flex-1">
              <span className="block text-[1.1rem] font-bold leading-snug text-blue">
                Étape {e.etape.numero} — {e.etape.titre}
              </span>
              <span className="block text-[0.95rem] text-text-soft">
                {e.etape.minutes} minutes
                {e.faite ? " · terminée" : e.ouverte ? " · commencée" : ""}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * LE REPÈRE DE GAUCHE : ✔ terminée, ▸ commencée, rien sinon.
 *
 * Il occupe la même largeur dans les trois cas, y compris quand il est vide :
 * sans cela les titres se décalent d'une ligne à l'autre et la colonne devient
 * illisible dès qu'une étape est cochée. L'information est doublée en toutes
 * lettres sous le titre — un symbole seul ne se lit pas à voix haute par un
 * lecteur d'écran, et ne se distingue pas toujours à l'œil nu.
 */
function Marqueur({ etat }: { etat: EtatEtape }) {
  return (
    <span
      aria-hidden
      className={`flex h-8 w-8 shrink-0 items-center justify-center text-[1.5rem] font-bold ${
        etat.faite ? "text-green" : "text-orange"
      }`}
    >
      {etat.faite ? "✔" : etat.ouverte ? "▸" : ""}
    </span>
  );
}
