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
              La succession enfin expliquée clairement
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
      <div className="wrap-wide py-3 text-[0.72rem] leading-snug text-text-soft">
        <p className="mb-1.5">
          <strong className="text-text">{BRAND}</strong> fournit une information pédagogique générale, pas un conseil juridique, fiscal ou financier personnalisé. Les exemples sont illustratifs ; vérifiez les règles en vigueur avec le professionnel compétent avant toute décision.
        </p>
        <div className="mb-1">
          <MetaDisclaimer />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4">
        <nav className="flex flex-wrap items-center gap-x-3">
          {[
            { href: "/mentions-legales", t: "Mentions légales" },
            { href: "/cgv", t: "Conditions générales de vente" },
            { href: "/confidentialite", t: "Confidentialité" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="flex min-h-[32px] items-center">
              {l.t}
            </Link>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex min-h-[32px] items-center">
            Nous contacter
          </a>
        </nav>
        <p>
          © {new Date().getFullYear()} {BRAND}. Tous droits réservés.
        </p>
        </div>
      </div>
    </footer>
  );
}

export function TestModeBanner({ stripeReel = false }: { stripeReel?: boolean }) {
  return (
    <div className="border-b border-yellow-line bg-yellow-bg px-4 py-2 text-center text-[0.85rem] font-bold text-text">
      {stripeReel ? (
        <>
          Mode test Stripe : le paiement fonctionne vraiment, mais aucun euro ne peut être débité.
          Carte de test&nbsp;: 4242 4242 4242 4242, n&apos;importe quelle date future,
          n&apos;importe quel CVC.
        </>
      ) : (
        <>
          Mode simulé : aucun paiement n&apos;est effectué. Stripe sera branché avant le lancement.
        </>
      )}
    </div>
  );
}

/**
 * Bannière de non-mise-en-ligne.
 *
 * Elle s'affiche sur TOUTES les pages tant que le site tourne sur Vercel sans
 * base de données. Son but n'est pas d'informer le visiteur — il n'y en a pas
 * encore — mais d'empêcher d'envoyer du trafic payant dans un funnel qui perd
 * ses leads en silence. Elle s'éteint seule dès que Supabase est branché.
 */
export function EphemeralStorageBanner() {
  return (
    <div className="border-b-2 border-[#8d1f1f] bg-red px-4 py-2 text-center text-[0.85rem] font-bold text-white">
      Site non ouvert au public — les inscriptions ne sont pas encore conservées. Ne pas envoyer de
      trafic publicitaire tant que la base de données n&apos;est pas branchée.
    </div>
  );
}

/**
 * Ligne de réassurance paiement.
 *
 * Les marques sont dessinées en SVG plutôt qu'écrites en toutes lettres :
 * un lecteur de 70 ans ne lit pas « Mastercard », il **reconnaît** les deux
 * disques rouge et orange. C'est un repère visuel, pas une information, et
 * c'est exactement ce qui rassure sur un site qu'on ne connaît pas.
 * Tout est tracé en local : aucune image externe, rien à charger.
 */
function CarteVisa() {
  return (
    <svg viewBox="0 0 48 30" className="h-[26px] w-auto" role="img" aria-label="Visa">
      <rect width="48" height="30" rx="3" fill="#fff" stroke="#d5dae1" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fontStyle="italic"
        fontWeight="bold"
        fill="#1a1f71"
      >
        VISA
      </text>
    </svg>
  );
}

function CarteMastercard() {
  return (
    <svg viewBox="0 0 48 30" className="h-[26px] w-auto" role="img" aria-label="Mastercard">
      <rect width="48" height="30" rx="3" fill="#fff" stroke="#d5dae1" />
      <circle cx="20" cy="15" r="8.5" fill="#eb001b" />
      <circle cx="28" cy="15" r="8.5" fill="#f79e1b" fillOpacity="0.9" />
      <path d="M24 8.7a8.5 8.5 0 0 0 0 12.6 8.5 8.5 0 0 0 0-12.6Z" fill="#ff5f00" />
    </svg>
  );
}

function CarteCb() {
  return (
    <svg viewBox="0 0 48 30" className="h-[26px] w-auto" role="img" aria-label="Carte Bancaire">
      <rect width="48" height="30" rx="3" fill="#fff" stroke="#d5dae1" />
      <rect x="5" y="7" width="38" height="16" rx="2" fill="#0b4ea2" />
      <text
        x="24"
        y="19"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11"
        fontWeight="bold"
        fill="#fff"
      >
        CB
      </text>
    </svg>
  );
}

function Cadenas() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" aria-hidden focusable="false">
      <path
        d="M7 10V7.5a5 5 0 0 1 10 0V10"
        fill="none"
        stroke="#1a7f4b"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="4" y="10" width="16" height="11" rx="2" fill="#1a7f4b" />
      <circle cx="12" cy="15" r="1.7" fill="#fff" />
      <rect x="11.2" y="15" width="1.6" height="3.4" fill="#fff" />
    </svg>
  );
}

export function TrustRow() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="flex items-center gap-2 text-[1.02rem] font-bold text-green">
        <Cadenas />
        Paiement 100&nbsp;% sécurisé
      </p>
      <div className="flex items-center gap-2">
        <CarteCb />
        <CarteVisa />
        <CarteMastercard />
      </div>
      <p className="text-center text-[0.88rem] text-text-soft">
        Paiement traité par Stripe. Nous ne voyons jamais votre numéro de carte.
        <br />
        Garantie 30 jours, sans justification.
      </p>
    </div>
  );
}
