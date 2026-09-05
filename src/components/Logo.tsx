/**
 * Logo Héritage Intact.
 *
 * Dessiné en SVG, pas généré : un logo doit rester net à 24 px dans un onglet
 * comme à 400 px sur une couverture, et les modèles d'images écrivent mal.
 *
 * Le symbole : un toit posé sur trois barres — les 3 Verrous qui protègent la
 * maison. La barre du milieu est orange, c'est le seul accent de la marque.
 * Aucun visage, aucune photo : la marque est éditoriale (cf. 15-identite-visuelle.md).
 */
export function Mark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Héritage Intact"
      focusable="false"
    >
      <rect width="48" height="48" rx="5" fill="var(--color-blue)" />
      {/* Le toit */}
      <path
        d="M10 22.5 24 11l14 11.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinejoin="miter"
      />
      {/* Les trois verrous */}
      <rect x="13" y="26" width="22" height="3.2" fill="#ffffff" />
      <rect x="13" y="31.4" width="22" height="3.2" fill="var(--color-orange)" />
      <rect x="13" y="36.8" width="22" height="3.2" fill="#ffffff" />
    </svg>
  );
}

/** Le logo complet : symbole + nom. C'est lui qui va dans l'en-tête. */
export function Logo({ size = 38, stacked = false }: { size?: number; stacked?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${stacked ? "flex-col gap-2" : ""}`}>
      <Mark size={size} />
      <span className="leading-none">
        <span
          className="block font-bold tracking-[0.14em] text-blue"
          style={{ fontSize: size * 0.42 }}
        >
          HÉRITAGE
        </span>
        <span
          className="mt-[0.18em] block font-bold tracking-[0.14em] text-orange"
          style={{ fontSize: size * 0.42 }}
        >
          INTACT
        </span>
      </span>
    </span>
  );
}

/** Version sur fond sombre (pied de page, bandeaux bleus, image de couverture). */
export function LogoInverse({ size = 38 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label="Héritage Intact">
        <rect width="48" height="48" rx="5" fill="#ffffff" />
        <path d="M10 22.5 24 11l14 11.5" fill="none" stroke="var(--color-blue)" strokeWidth="3.4" />
        <rect x="13" y="26" width="22" height="3.2" fill="var(--color-blue)" />
        <rect x="13" y="31.4" width="22" height="3.2" fill="var(--color-orange)" />
        <rect x="13" y="36.8" width="22" height="3.2" fill="var(--color-blue)" />
      </svg>
      <span className="leading-none">
        <span
          className="block font-bold tracking-[0.14em] text-white"
          style={{ fontSize: size * 0.42 }}
        >
          HÉRITAGE
        </span>
        <span
          className="mt-[0.18em] block font-bold tracking-[0.14em] text-orange"
          style={{ fontSize: size * 0.42 }}
        >
          INTACT
        </span>
      </span>
    </span>
  );
}
