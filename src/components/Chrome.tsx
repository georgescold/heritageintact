import Link from "next/link";
import { BRAND, CONTACT_EMAIL } from "@/lib/config";
import { MetaDisclaimer } from "./LpExtras";
import { Logo } from "./Logo";

export function Header({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="border-b-4 border-blue bg-white">
      <div className="wrap-wide flex items-center justify-between gap-4 py-2.5">
        <Link href="/" aria-label={BRAND} className="no-underline">
          <Logo size={34} />
        </Link>
        <div className="flex items-center gap-4">
          {!minimal && (
            <span className="hidden text-[0.9rem] text-text-soft lg:block">
              La succession expliquée en français simple
            </span>
          )}
          {/* Le cadenas est visible partout, y compris sur la landing page :
              sur cet avatar, « est-ce que ce site est sérieux » se joue dans
              les deux premières secondes, en haut à droite. */}
          <span className="flex shrink-0 items-center gap-1.5 border border-green/50 bg-green-bg px-2.5 py-1 text-[0.82rem] font-bold text-green">
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden focusable="false">
              <path
                d="M4.4 7V4.8a3.6 3.6 0 0 1 7.2 0V7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect x="2.6" y="7" width="10.8" height="7.2" fill="currentColor" />
            </svg>
            Site sécurisé
          </span>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-grey-line bg-grey-bg">
      <div className="wrap-wide py-7 text-[0.85rem] leading-relaxed text-text-soft">
        <p className="mb-4">
          <strong className="text-text">{BRAND}</strong> est un programme pédagogique
          d&apos;information générale sur la transmission de patrimoine en France. Il ne constitue
          ni une consultation juridique, ni un conseil fiscal, financier ou en investissement
          personnalisé, et ne se substitue pas à l&apos;intervention d&apos;un notaire, d&apos;un
          avocat ou d&apos;un conseiller habilité. Les exemples chiffrés sont illustratifs. La
          législation évolue : vérifiez les montants en vigueur sur impots.gouv.fr avant toute
          décision.
        </p>
        <div className="mb-4">
          <MetaDisclaimer />
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/cgv">Conditions générales de vente</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Nous contacter</a>
        </nav>
        <p className="mt-4">
          © {new Date().getFullYear()} {BRAND}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export function TestModeBanner() {
  return (
    <div className="border-b border-yellow-line bg-yellow-bg px-4 py-2 text-center text-[0.85rem] font-bold text-text">
      Mode test : aucun paiement réel n&apos;est effectué. Stripe sera branché avant le lancement.
    </div>
  );
}

/** Ligne de réassurance paiement, style e-commerce classique. */
export function TrustRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.85rem] text-text-soft">
      <span>
        <span aria-hidden>🔒</span> Paiement sécurisé
      </span>
      <span className="border border-grey-line bg-white px-2 py-0.5 font-bold text-blue">CB</span>
      <span className="border border-grey-line bg-white px-2 py-0.5 font-bold text-blue">Visa</span>
      <span className="border border-grey-line bg-white px-2 py-0.5 font-bold text-blue">
        Mastercard
      </span>
      <span>Garantie 30 jours</span>
    </div>
  );
}
