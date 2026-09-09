import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex w-full items-center justify-center px-5 text-center font-bold leading-tight no-underline min-h-[60px] text-[1.1rem] sm:text-[1.2rem] border-b-4";

const variants = {
  primary: "bg-orange text-white border-orange-dark hover:bg-orange-dark",
  blue: "bg-blue-mid text-white border-blue hover:bg-blue",
  green: "bg-green text-white border-[#155c2b] hover:bg-[#176a32]",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  /**
   * Réservé aux boutons qui n'envoient pas de formulaire — le « Réessayer » de
   * l'écran de secours de l'espace. Tout le reste du site poste un `<form>`,
   * et c'est délibéré : une action qui dépend de JavaScript est une action de
   * moins pour qui navigue sur un vieux navigateur.
   */
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} cursor-pointer disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {children}
    </button>
  );
}

/** Encadré avec bandeau de titre gris, comme sur les sites de banque. */
export function Panel({
  title,
  children,
  tone = "grey",
}: {
  title?: ReactNode;
  children: ReactNode;
  tone?: "grey" | "yellow" | "green";
}) {
  const head = {
    grey: "bg-grey-bg text-blue",
    yellow: "bg-yellow-bg text-text",
    green: "bg-green-bg text-green",
  }[tone];
  const border = {
    grey: "border-grey-line",
    yellow: "border-yellow-line",
    green: "border-green/40",
  }[tone];
  return (
    <div className={`border ${border} bg-white`}>
      {title && (
        <div className={`border-b ${border} px-4 py-2 text-[1.05rem] font-bold ${head}`}>
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Guarantee({ product = "la Méthode" }: { product?: string }) {
  return (
    <Panel tone="green" title="Garantie 30 jours : satisfait ou remboursé">
      <p>
        Découvrez {product} à votre rythme. Si vous n&apos;êtes pas satisfait, demandez
        votre remboursement par email dans les 30 jours suivant votre achat, sans justification.
        Consultez les <Link href="/cgv">conditions de la garantie</Link>. La fiche de calcul
        pédagogique reste accessible après remboursement ; l&apos;application des packs est distincte.
      </p>
    </Panel>
  );
}

export function FAQ({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="border border-grey-line">
      {items.map((it, i) => (
        <details key={it.q} className={`group ${i > 0 ? "border-t border-grey-line" : ""}`}>
          <summary className="cursor-pointer list-none px-4 py-3 font-bold text-link marker:content-none">
            <span aria-hidden className="mr-2 inline-block text-[0.8rem] group-open:rotate-90">
              ▶
            </span>
            {it.q}
          </summary>
          <div className="border-t border-grey-line-soft bg-grey-bg px-4 py-3">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

export function ValueStack({
  rows,
  total,
  today,
  todayLabel = "Aujourd'hui",
}: {
  rows: { label: string; value: string }[];
  total: string;
  /**
   * Un nœud, et non une chaîne : le prix du jour dépend du compteur du
   * visiteur, donc il doit être rendu côté client. Il valait
   * `euros(PRODUCTS.front.price)` en dur, et le tableau annonçait donc
   * « Aujourd'hui : 27 € » à quelqu'un dont le bandeau venait de dire
   * « offre terminée, la Méthode reste accessible à 89 € ».
   */
  today: ReactNode;
  todayLabel?: string;
}) {
  return (
    <div className="overflow-x-auto border border-grey-line">
      <table className="w-full min-w-[18rem] text-left text-[0.95rem] sm:text-[1rem]">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-grey-line-soft">
              <td className="px-3 py-2 align-top">{r.label}</td>
              <td className="whitespace-nowrap px-3 py-2 text-right align-top text-text-soft">
                {r.value}
              </td>
            </tr>
          ))}
          <tr className="border-b border-grey-line bg-grey-bg">
            <td className="px-3 py-2 font-bold">Total si acheté à l&apos;unité</td>
            <td className="whitespace-nowrap px-3 py-2 text-right font-bold line-through">
              {total}
            </td>
          </tr>
          <tr className="bg-yellow-bg">
            <td className="px-3 py-3 text-[1.1rem] font-bold text-blue">{todayLabel}</td>
            <td className="whitespace-nowrap px-3 py-3 text-right text-[1.5rem] font-bold text-red">
              {today}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="shrink-0 font-bold text-green">
        ✔
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Le jumeau négatif de Check : ce qu'on écarte, pas ce qu'on obtient. */
export function Cross({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="shrink-0 font-bold text-red">
        ✕
      </span>
      <span>{children}</span>
    </li>
  );
}
