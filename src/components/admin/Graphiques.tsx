/**
 * Deux graphiques, en SVG écrit à la main.
 *
 * Aucune librairie : le dépôt n'a aucune dépendance d'interface, et deux
 * courbes ne justifient pas d'en introduire une — avec sa taille de bundle, ses
 * mises à jour et sa surface de sécurité. Le SVG est rendu côté serveur, donc
 * sans aucun JavaScript envoyé au navigateur.
 *
 * ⚠️ Une valeur inconnue (`null`) INTERROMPT la courbe au lieu d'être tracée à
 * zéro. Une dépense manquante dessinée comme une dépense nulle ferait plonger
 * la ligne vers le bas, ce qui se lit exactement comme une bonne nouvelle.
 */

type Serie = { nom: string; couleur: string; valeurs: (number | null)[] };

const CADRE = { l: 44, r: 8, h: 8, b: 22 };

function echelle(series: Serie[]) {
  const toutes = series.flatMap((s) => s.valeurs).filter((v): v is number => v !== null);
  const max = Math.max(1, ...toutes);
  // Un maximum arrondi vers le haut donne des graduations lisibles.
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / magnitude) * magnitude;
}

export function Courbes({
  etiquettes,
  series,
  hauteur = 190,
  format = (n: number) => String(n),
}: {
  etiquettes: string[];
  series: Serie[];
  hauteur?: number;
  format?: (n: number) => string;
}) {
  const largeur = 560;
  const max = echelle(series);
  const zoneL = largeur - CADRE.l - CADRE.r;
  const zoneH = hauteur - CADRE.h - CADRE.b;
  const n = Math.max(1, etiquettes.length - 1);
  const x = (i: number) => CADRE.l + (zoneL * i) / n;
  const y = (v: number) => CADRE.h + zoneH - (zoneH * v) / max;

  /** Un trou dans les données coupe le tracé en deux segments distincts. */
  const segments = (valeurs: (number | null)[]) => {
    const sortie: string[] = [];
    let courant: string[] = [];
    valeurs.forEach((v, i) => {
      if (v === null) {
        if (courant.length > 1) sortie.push(courant.join(" "));
        courant = [];
        return;
      }
      courant.push(`${courant.length ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    });
    if (courant.length > 1) sortie.push(courant.join(" "));
    return sortie;
  };

  return (
    <figure className="border border-grey-line bg-white p-3">
      <figcaption className="mb-2 flex flex-wrap gap-3 text-[0.82rem]">
        {series.map((s) => (
          <span key={s.nom} className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-2.5 w-4" style={{ background: s.couleur }} />
            {s.nom}
          </span>
        ))}
      </figcaption>
      <svg
        viewBox={`0 0 ${largeur} ${hauteur}`}
        className="h-auto w-full"
        role="img"
        aria-label={series.map((s) => s.nom).join(" et ")}
      >
        {[0, 0.5, 1].map((p) => (
          <g key={p}>
            <line
              x1={CADRE.l}
              x2={largeur - CADRE.r}
              y1={y(max * p)}
              y2={y(max * p)}
              stroke="#d5dae1"
              strokeWidth="1"
            />
            <text x={0} y={y(max * p) + 4} fontSize="10" fill="#6b7480">
              {format(Math.round(max * p))}
            </text>
          </g>
        ))}
        {series.map((s) =>
          segments(s.valeurs).map((d, i) => (
            <path key={s.nom + i} d={d} fill="none" stroke={s.couleur} strokeWidth="2.5" />
          )),
        )}
        {series.map((s) =>
          s.valeurs.map((v, i) =>
            v === null ? null : (
              <circle key={s.nom + i} cx={x(i)} cy={y(v)} r="3" fill={s.couleur} />
            ),
          ),
        )}
        {etiquettes.map((e, i) => (
          <text
            key={e + i}
            x={x(i)}
            y={hauteur - 6}
            fontSize="10"
            fill="#6b7480"
            textAnchor={i === 0 ? "start" : i === etiquettes.length - 1 ? "end" : "middle"}
          >
            {e}
          </text>
        ))}
      </svg>
    </figure>
  );
}

export function Colonnes({
  etiquettes,
  valeurs,
  couleur = "#1d3f73",
  titre,
  format = (n: number) => String(n),
}: {
  etiquettes: string[];
  valeurs: (number | null)[];
  couleur?: string;
  titre: string;
  format?: (n: number) => string;
}) {
  const hauteur = 150;
  const largeur = 560;
  const max = echelle([{ nom: titre, couleur, valeurs }]);
  const zoneL = largeur - CADRE.l - CADRE.r;
  const zoneH = hauteur - CADRE.h - CADRE.b;
  const pas = zoneL / Math.max(1, valeurs.length);

  return (
    <figure className="border border-grey-line bg-white p-3">
      <figcaption className="mb-2 text-[0.85rem] font-bold">{titre}</figcaption>
      <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="h-auto w-full" role="img" aria-label={titre}>
        {[0, 0.5, 1].map((p) => (
          <g key={p}>
            <line
              x1={CADRE.l}
              x2={largeur - CADRE.r}
              y1={CADRE.h + zoneH - zoneH * p}
              y2={CADRE.h + zoneH - zoneH * p}
              stroke="#d5dae1"
            />
            <text x={0} y={CADRE.h + zoneH - zoneH * p + 4} fontSize="10" fill="#6b7480">
              {format(Math.round(max * p))}
            </text>
          </g>
        ))}
        {valeurs.map((v, i) =>
          v === null ? null : (
            <rect
              key={i}
              x={CADRE.l + i * pas + pas * 0.18}
              y={CADRE.h + zoneH - (zoneH * v) / max}
              width={pas * 0.64}
              height={Math.max(0, (zoneH * v) / max)}
              fill={couleur}
            />
          ),
        )}
        {etiquettes.map((e, i) => (
          <text
            key={e + i}
            x={CADRE.l + i * pas + pas / 2}
            y={hauteur - 6}
            fontSize="10"
            fill="#6b7480"
            textAnchor="middle"
          >
            {e}
          </text>
        ))}
      </svg>
    </figure>
  );
}
