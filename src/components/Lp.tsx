import type { ReactNode } from "react";

/**
 * Les deux habillages de section hérités de la première landing page.
 *
 * Les blocs de vente qui vivaient ici (hero, chiffre, ennemi, comparaison,
 * avant/après, échéance, peur, disqualification…) ont été remplacés par
 * `components/marketing/` au fil des refontes. Il ne reste que l'habillage,
 * encore utilisé par la page de désinscription.
 */

/* ─────────────────────────────────────────────────────────────────
   Une section de page, avec ses variantes de fond.
   ───────────────────────────────────────────────────────────── */
export function Section({
  children,
  tone = "white",
  id,
  wide = false,
}: {
  children: ReactNode;
  tone?: "white" | "grey" | "blue";
  id?: string;
  wide?: boolean;
}) {
  const bg = {
    white: "bg-white",
    grey: "bg-grey-bg border-y border-grey-line",
    blue: "band-blue",
  }[tone];
  return (
    <section id={id} className={`${bg} py-9 sm:py-14`}>
      <div className={wide ? "wrap-wide" : "wrap"}>{children}</div>
    </section>
  );
}

/** Titre de section : filet orange, puis le titre. */
export function SectionTitle({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <>
      <span className="rule-orange mb-4" />
      <h2
        className={`mb-5 text-[1.5rem] leading-tight sm:text-[2rem] ${light ? "text-white" : ""}`}
      >
        {children}
      </h2>
    </>
  );
}
