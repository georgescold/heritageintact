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
        {minimal ? (
          <span className="text-[0.85rem] text-text-soft">
            <span aria-hidden>🔒</span> Site sécurisé
          </span>
        ) : (
          <span className="hidden text-[0.9rem] text-text-soft md:block">
            La succession expliquée en français simple
          </span>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-grey-line bg-grey-bg">
      <div className="wrap-wide py-7 text-[0.85rem] leading-relaxed text-text-soft">
        <p className="mb-4">
          <strong className="text-text">{BRAND}</strong> est un programme pédagogique d&apos;information
          générale sur la transmission de patrimoine en France. Il ne constitue ni une consultation
          juridique, ni un conseil fiscal, financier ou en investissement personnalisé, et ne se substitue
          pas à l&apos;intervention d&apos;un notaire, d&apos;un avocat ou d&apos;un conseiller habilité. Les
          exemples chiffrés sont illustratifs. La législation évolue : vérifiez les montants en vigueur sur
          impots.gouv.fr avant toute décision.
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
      <span className="rounded border border-grey-line bg-white px-2 py-0.5 font-bold text-blue">CB</span>
      <span className="rounded border border-grey-line bg-white px-2 py-0.5 font-bold text-blue">Visa</span>
      <span className="rounded border border-grey-line bg-white px-2 py-0.5 font-bold text-blue">
        Mastercard
      </span>
      <span>Garantie 30 jours</span>
    </div>
  );
}
