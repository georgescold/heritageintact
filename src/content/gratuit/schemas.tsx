/**
 * LES DEUX SCHÉMAS DU DOCUMENT OFFERT.
 *
 * ⚠️ Règle absolue : ces schémas ne montrent QUE des chiffres déjà établis et
 * vérifiables dans le document — les droits de la grille, et leur division par
 * les six mois légaux. Aucune courbe estimée, aucune tendance dessinée « à peu
 * près ». Une page qui demande au lecteur d'aller contester chaque montant sur
 * impots.gouv.fr ne peut pas se permettre un graphique approximatif : ce serait
 * le seul élément indéfendable de l'ensemble.
 *
 * ⚠️ LISIBILITÉ MOBILE, et c'est ce qui dicte tout le dessin. Un SVG se met à
 * l'échelle du conteneur : avec un cadre large, le texte tombait à 7-8 px réels
 * sur un téléphone. Illisible pour n'importe qui, disqualifiant pour un lecteur
 * de 67 ans. D'où deux règles tenues ici :
 *   1. cadre étroit (380 unités) — l'échelle reste proche de 1 sur mobile ;
 *   2. peu de texte, et jamais répété — l'ancienne version écrivait six fois le
 *      même montant, ce qui forçait des colonnes minuscules.
 * Toute modification doit être revérifiée à 375 px avant d'être publiée.
 *
 * SVG en ligne et non image : net à toutes les tailles, propre à l'impression,
 * aucun fichier à charger, et le texte reste du texte pour un lecteur d'écran.
 */

const NAVY = "var(--color-blue, #12365e)";
const ORANGE = "var(--color-orange, #e8730c)";
const GRIS = "#c8d0da";
const POLICE = "Arial, Helvetica, sans-serif";

/** Cadre volontairement étroit : voir la note de lisibilité ci-dessus. */
const L = 380;

const eur = (n: number) => n.toLocaleString("fr-FR") + " €";

/**
 * LES SIX MOIS. Le compte à rebours légal, et la somme à réunir sur chacun.
 * C'est la dimensionnalisation du bloc PEUR : un montant global reste abstrait,
 * le même montant divisé par six devient une échéance.
 */
export function SchemaSixMois({
  total = 86_389,
  parMois = 14_398,
}: {
  total?: number;
  parMois?: number;
}) {
  const marge = 4;
  const utile = L - marge * 2;
  const l = utile / 6;
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${L} 132`}
        className="w-full"
        role="img"
        aria-labelledby="schema-six-mois-titre schema-six-mois-desc"
      >
        <title id="schema-six-mois-titre">
          Les six mois pour payer {eur(total)} de droits de succession
        </title>
        <desc id="schema-six-mois-desc">
          Six mois consécutifs, {eur(parMois)} à réunir chaque mois, puis la date limite au-delà de
          laquelle les intérêts de retard courent.
        </desc>

        <text x={marge} y={13} fontSize={13} fill={NAVY} fontFamily={POLICE}>
          {eur(total)} à réunir, en liquide
        </text>

        {[1, 2, 3, 4, 5, 6].map((m, i) => (
          <g key={m}>
            <rect
              x={marge + i * l + 2}
              y={24}
              width={l - 4}
              height={30}
              fill="#ffffff"
              stroke={NAVY}
              strokeWidth={1.5}
            />
            <text
              x={marge + i * l + l / 2}
              y={44}
              textAnchor="middle"
              fontSize={15}
              fill={NAVY}
              fontFamily={POLICE}
            >
              {m}
            </text>
          </g>
        ))}

        {/* Le montant est écrit UNE fois, en grand : le répéter six fois obligeait
            à des colonnes illisibles sur téléphone. */}
        <text
          x={marge}
          y={82}
          fontSize={21}
          fontWeight="bold"
          fill={NAVY}
          fontFamily={POLICE}
        >
          {eur(parMois)}
        </text>
        <text x={marge} y={100} fontSize={14} fill={NAVY} fontFamily={POLICE}>
          chaque mois, pendant six mois
        </text>

        {/* La ligne d'échéance : c'est elle qui rend la contrainte visible. */}
        <line x1={L - marge} y1={20} x2={L - marge} y2={58} stroke={ORANGE} strokeWidth={3} />
        <text
          x={L - marge}
          y={120}
          textAnchor="end"
          fontSize={14}
          fontWeight="bold"
          fill={ORANGE}
          fontFamily={POLICE}
        >
          ensuite, les intérêts courent
        </text>
      </svg>
      <figcaption className="mt-1 text-[0.85rem] text-text-soft">
        Exemple d’un patrimoine de {eur(650_000)} transmis à deux enfants. Le montant vient de la
        grille plus bas ; la division par six est la vôtre à refaire.
      </figcaption>
    </figure>
  );
}

/**
 * LE NOMBRE D'ENFANTS. Deux barres, même patrimoine, écart total. C'est la
 * démonstration visuelle du fait le plus contre-intuitif du document : la loi ne
 * taxe pas seulement ce que vous laissez, elle taxe le nombre de parts.
 */
export function SchemaNombreEnfants({
  patrimoine = 300_000,
  unEnfant = 38_194,
}: {
  patrimoine?: number;
  unEnfant?: number;
}) {
  const xBarre = 74;
  const pleine = 214;
  const part = Math.max(2, Math.round((unEnfant / patrimoine) * pleine));
  const lignes = [
    { y: 10, libelle: "1 enfant", du: unEnfant },
    { y: 58, libelle: "3 enfants", du: 0 },
  ];
  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${L} 106`}
        className="w-full"
        role="img"
        aria-labelledby="schema-enfants-titre schema-enfants-desc"
      >
        <title id="schema-enfants-titre">
          Sur {eur(patrimoine)}, l’impôt selon le nombre d’enfants
        </title>
        <desc id="schema-enfants-desc">
          Avec un seul enfant, {eur(unEnfant)} de droits. Avec trois enfants, aucun droit à payer.
        </desc>

        {lignes.map((ligne) => (
          <g key={ligne.libelle}>
            <text x={0} y={ligne.y + 24} fontSize={15} fill={NAVY} fontFamily={POLICE}>
              {ligne.libelle}
            </text>
            <rect
              x={xBarre}
              y={ligne.y + 8}
              width={pleine}
              height={24}
              fill="#ffffff"
              stroke={GRIS}
              strokeWidth={1.5}
            />
            {ligne.du > 0 && (
              <rect x={xBarre} y={ligne.y + 8} width={part} height={24} fill={ORANGE} />
            )}
            <text
              x={xBarre + pleine + 8}
              y={ligne.y + 26}
              fontSize={16}
              fontWeight="bold"
              fill={ligne.du > 0 ? ORANGE : NAVY}
              fontFamily={POLICE}
            >
              {ligne.du > 0 ? eur(ligne.du) : "0 €"}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-[0.85rem] text-text-soft">
        Même patrimoine de {eur(patrimoine)}, même maison. La part orange est ce que prend l’État.
      </figcaption>
    </figure>
  );
}
