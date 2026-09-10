"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFlash } from "@/components/OffreFlash";
import { PRIX_APRES_FLASH, PRIX_RATTRAPAGE, REDUCTION_RATTRAPAGE, euros } from "@/lib/config";

/**
 * LE RATTRAPAGE — −30 % pour qui a laissé filer le compteur.
 *
 * Trois états, et le troisième est le plus important :
 *   "vierge"  — rien n'a été proposé ; au prochain clic, la fenêtre s'ouvre
 *   "accepte" — le prix devient PRIX_RATTRAPAGE, à l'écran ET chez Stripe
 *   "refuse"  — définitif. On ne repropose pas.
 *
 * C'est ce dernier état qui garde l'ensemble honnête. Un rattrapage reproposé
 * à chaque clic, c'est un prix de 62 € déguisé en faveur, et le compteur
 * devient un théâtre — exactement ce que l'art. L121-2 sanctionne. Proposé une
 * fois, refusable une fois, il reste ce qu'il prétend être : un geste.
 *
 * Comme le compteur, la décision vit dans un cookie que le serveur relit dans
 * `prepareCheckout` : l'écran et la facture ne peuvent pas diverger.
 */

const CLE = "hi_rattrapage";

export type EtatRattrapage = "vierge" | "accepte" | "refuse";

function lire(): EtatRattrapage {
  const m = document.cookie.match(/(?:^|;\s*)hi_rattrapage=(1|0)/);
  if (m) return m[1] === "1" ? "accepte" : "refuse";
  try {
    const v = localStorage.getItem(CLE);
    if (v === "1") return "accepte";
    if (v === "0") return "refuse";
  } catch {}
  return "vierge";
}

function ecrire(accepte: boolean) {
  const v = accepte ? "1" : "0";
  try {
    localStorage.setItem(CLE, v);
  } catch {}
  document.cookie = `${CLE}=${v}; path=/; max-age=31536000; samesite=lax`;
}

export function useRattrapage() {
  const [etat, setEtat] = useState<EtatRattrapage>("vierge");

  useEffect(() => {
    const relire = () => setEtat(lire());
    relire();
    window.addEventListener("storage", relire);
    return () => window.removeEventListener("storage", relire);
  }, []);

  const decider = useCallback((accepte: boolean) => {
    ecrire(accepte);
    setEtat(accepte ? "accepte" : "refuse");
  }, []);

  return { etat, decider };
}

const CLASSE_BOUTON =
  "flex min-h-[64px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-5 text-center text-[1.15rem] font-bold text-white no-underline hover:bg-orange-dark sm:text-[1.25rem]";

/**
 * LE BOUTON D'ACCÈS À LA MÉTHODE.
 *
 * Un lien, sauf dans un cas : le compteur est épuisé et le rattrapage n'a
 * jamais été proposé. Le clic ouvre alors la fenêtre au lieu de naviguer.
 *
 * Au rendu serveur c'est un lien ordinaire — donc il fonctionne même si le
 * JavaScript ne se charge pas, ce qui est la seule chose qu'un bouton d'achat
 * n'a pas le droit de rater.
 */
export function CtaMethode({ label, href = "/commander" }: { label: string; href?: string }) {
  const { etat: flash } = useFlash();
  const { etat: ratt, decider } = useRattrapage();
  const [ouvert, setOuvert] = useState(false);
  const fermerRef = useRef<HTMLAnchorElement>(null);

  const aProposer = flash === "expire" && ratt === "vierge";

  useEffect(() => {
    if (!ouvert) return;
    fermerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ouvert]);

  return (
    <>
      {aProposer ? (
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className={`${CLASSE_BOUTON} cursor-pointer`}
        >
          {label}
        </button>
      ) : (
        <Link href={href} className={CLASSE_BOUTON}>
          {label}
        </Link>
      )}

      {ouvert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rattrapage-titre"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            className="my-auto w-full max-w-lg border-2 border-blue bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-grey-line bg-grey-bg px-4 py-3">
              <h2 id="rattrapage-titre" className="text-[1.15rem]">
                Vous avez manqué la fin du compteur.
              </h2>
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              {/* On ne fait pas la leçon. Personne n'achète à quelqu'un qui
                  vient de lui rappeler qu'il a mal fait — et surtout pas
                  quelqu'un de 70 ans qu'on renvoie à sa lenteur. */}
              <p className="text-[1.05rem]">
                Ça arrive, et ce n&apos;est pas grave. Vous êtes resté sur cette page bien plus
                longtemps que la plupart des gens&nbsp;: c&apos;est plutôt bon signe.
              </p>

              <div className="border-2 border-red bg-red-bg p-4 text-center">
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-red">
                  Nous vous proposons
                </p>
                <p className="my-1 text-[3.4rem] font-bold leading-none text-red">
                  &minus;{REDUCTION_RATTRAPAGE}&nbsp;%
                </p>
                <p className="text-[1.15rem] leading-tight">
                  soit{" "}
                  <strong className="whitespace-nowrap text-[2rem] text-blue">
                    {euros(PRIX_RATTRAPAGE)}
                  </strong>{" "}
                  <span className="whitespace-nowrap text-text-soft line-through">
                    {euros(PRIX_APRES_FLASH)}
                  </span>
                </p>
              </div>

              <p className="text-[0.98rem]">
                C&apos;est la même Méthode complète, le même accès immédiat et la même garantie de
                30 jours. Cette proposition ne vous sera faite qu&apos;une fois.
              </p>

              <div className="space-y-2">
                <Link
                  ref={fermerRef}
                  href={href}
                  onClick={() => decider(true)}
                  className={CLASSE_BOUTON}
                >
                  Oui, j&apos;accepte les {REDUCTION_RATTRAPAGE}&nbsp;%
                </Link>
                <Link
                  href={href}
                  onClick={() => decider(false)}
                  className="flex min-h-[52px] w-full items-center justify-center border border-grey-line bg-white px-4 text-center text-[1rem] text-text-soft no-underline hover:bg-grey-bg"
                >
                  Non merci, je paie {euros(PRIX_APRES_FLASH)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Le bandeau qui confirme la remise, une fois acceptée. Il remplace le bloc
 * prix sur le bon de commande : sans lui, le visiteur vient d'accepter −30 %
 * et retombe sur un prix qui ne le dit nulle part.
 */
export function BandeauRattrapage() {
  const { etat } = useRattrapage();
  if (etat !== "accepte") return null;
  return (
    <div className="border-2 border-green bg-green-bg p-3 text-center">
      <p className="text-[1.05rem]">
        Votre remise de{" "}
        <strong className="text-[1.5rem] text-green">&minus;{REDUCTION_RATTRAPAGE}&nbsp;%</strong>{" "}
        est appliquée&nbsp;:{" "}
        <strong className="whitespace-nowrap text-[1.5rem] text-blue">
          {euros(PRIX_RATTRAPAGE)}
        </strong>{" "}
        <span className="whitespace-nowrap text-text-soft line-through">
          {euros(PRIX_APRES_FLASH)}
        </span>
      </p>
    </div>
  );
}
