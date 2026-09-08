"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  FLASH_MINUTES,
  PRIX_APRES_FLASH,
  PRIX_RATTRAPAGE,
  PRODUCTS,
  REDUCTION_RATTRAPAGE,
  euros,
} from "@/lib/config";

/**
 * L'offre à durée limitée de la page de vente.
 *
 * La règle : l'offre à 27 € court pendant FLASH_MINUTES minutes, et le
 * compte à rebours démarre au moment où le visiteur QUITTE la vidéo — c'est-à-
 * dire quand le lecteur sort de l'écran, donc quand il descend lire la page.
 * Avant ça, rien ne tourne : quelqu'un qui regarde la VSL en entier ne perd
 * pas sa remise pendant qu'il la regarde.
 *
 * ⚠️ Ce compteur n'est PAS décoratif, et c'est ce qui le rend licite
 * (art. L121-2 du code de la consommation, cf. `11-legal-et-compliance.md`) :
 *   — l'échéance est écrite dans un cookie `hi_flash` ET dans localStorage.
 *     Recharger la page, changer d'onglet ou revenir demain ne la remet pas
 *     à zéro. Un compteur qui se réinitialise est une pratique trompeuse.
 *   — le serveur relit ce cookie dans `prepareCheckout` : une fois l'échéance
 *     passée, le paiement est réellement de PRIX_APRES_FLASH. L'affichage et
 *     la facture disent la même chose — et ce prix-là est un prix qu'on
 *     pratique vraiment, ce que les 429 € du packaging ne sont pas.
 *   — tant que le compteur n'a jamais démarré (cookie absent), l'offre
 *     reste due : on ne retire rien qu'on n'ait pas promis.
 *   — une fois le compteur épuisé, un rattrapage à −30 % est proposé UNE
 *     seule fois (cf. `useRattrapage`). Un refus est définitif, sinon
 *     l'annonce « passé ce délai, la Méthode repasse à 89 € » serait fausse.
 */

const CLE = "hi_flash";
const DUREE = FLASH_MINUTES * 60 * 1000;

type Etat = "attente" | "encours" | "expire";

function lireEcheance(): number | null {
  try {
    const v = localStorage.getItem(CLE);
    if (v) return Number(v) || null;
  } catch {}
  const m = document.cookie.match(/(?:^|;\s*)hi_flash=(\d+)/);
  return m ? Number(m[1]) : null;
}

function ecrireEcheance(t: number) {
  try {
    localStorage.setItem(CLE, String(t));
  } catch {}
  // Le cookie est ce que le serveur lit au moment de facturer. Il vit un an :
  // une échéance passée doit rester connue, sinon l'expiration s'oublierait.
  document.cookie = `hi_flash=${t}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * L'état du compteur, partagé par tous les blocs de la page. Pas de contexte :
 * chaque bloc relit la même échéance persistée, et le battement à la seconde
 * suffit à les garder synchronisés.
 */
export function useFlash() {
  const [reste, setReste] = useState<number | null>(null);
  const [etat, setEtat] = useState<Etat>("attente");

  useEffect(() => {
    const battre = () => {
      const t = lireEcheance();
      if (!t) {
        setEtat("attente");
        setReste(null);
        return;
      }
      const r = t - Date.now();
      setEtat(r > 0 ? "encours" : "expire");
      setReste(Math.max(0, r));
    };
    battre();
    const id = setInterval(battre, 1000);
    // Un autre onglet peut avoir démarré le compteur.
    window.addEventListener("storage", battre);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", battre);
    };
  }, []);

  const demarrer = useCallback(() => {
    if (lireEcheance()) return; // jamais deux fois : le compteur ne se relance pas
    ecrireEcheance(Date.now() + DUREE);
  }, []);

  return { etat, reste, demarrer };
}

const mmss = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/* ═══════════════════════════════════════════════════════════════════
   LE DÉCLENCHEUR — il enveloppe la vidéo
   ═══════════════════════════════════════════════════════════════════
   On observe le lecteur. Tant qu'il est à l'écran, le visiteur regarde :
   on ne lance rien. Dès qu'il sort du champ — la vidéo est finie, ou il
   descend lire la page — les dix minutes commencent. */
export function FlashTrigger({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { demarrer } = useFlash();
  const vue = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let vivant = true;
    const arreter = () => {
      vivant = false;
      obs.disconnect();
      window.removeEventListener("scroll", auDefilement);
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!vivant) return;
        if (e.isIntersecting) {
          vue.current = true;
          return;
        }
        if (vue.current) {
          demarrer();
          arreter();
        }
      },
      { threshold: 0.35 },
    );

    /* Filet de sécurité. L'IntersectionObserver échantillonne : un défilement
       rapide qui passe la vidéo et revient peut ne produire aucune notification
       de sortie, et le compteur ne partirait jamais. On regarde donc aussi la
       position brute — la vidéo est entièrement au-dessus de l'écran, donc le
       visiteur est passé à la suite. */
    const auDefilement = () => {
      if (!vivant) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) {
        demarrer();
        arreter();
      }
    };

    obs.observe(el);
    window.addEventListener("scroll", auDefilement, { passive: true });
    /* Et on regarde tout de suite : le navigateur restaure la position de
       défilement quand on revient sur la page. Si elle est déjà sous la
       vidéo, aucun événement ne viendra jamais, et le compteur resterait
       bloqué à l'arrêt. */
    auDefilement();
    return arreter;
  }, [demarrer]);

  return <div ref={ref}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════════
   LE BANDEAU COLLANT — le compteur toujours visible
   ═══════════════════════════════════════════════════════════════════
   `sticky` et non `fixed` : le bandeau apparaît en cours de lecture, et un
   bandeau fixé se serait posé par-dessus l'en-tête au lieu de pousser la
   page. En sticky il prend sa place dans le flux, puis colle en haut. */
export function FlashBar() {
  const { etat, reste } = useFlash();
  if (etat === "attente" || reste === null) return null;

  if (etat === "expire") {
    return (
      <div className="sticky top-0 z-40 border-b-[3px] border-[#3f3f3f] bg-[#5b5b5b] text-white">
        <p className="wrap-wide py-2 text-center text-[0.95rem] font-bold sm:text-[1.05rem]">
          Offre terminée. La Méthode reste accessible à{" "}
          <span className="whitespace-nowrap">{euros(PRIX_APRES_FLASH)}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 border-b-[3px] border-[#8d1f1f] bg-red text-white">
      <div className="wrap-wide flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2">
        <p className="text-center text-[0.95rem] font-bold leading-snug sm:text-[1.08rem]">
          La Méthode à <span className="whitespace-nowrap">{euros(PRODUCTS.front.price)}</span> au
          lieu de <span className="whitespace-nowrap">{euros(PRIX_APRES_FLASH)}</span> — il vous
          reste
        </p>
        <span
          role="timer"
          aria-live="off"
          className="border border-white/40 bg-black/30 px-3 py-1 text-[1.35rem] font-bold leading-none tabular-nums sm:text-[1.6rem]"
        >
          {mmss(reste)}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LE BLOC PRIX — juste au-dessus du bouton
   ═══════════════════════════════════════════════════════════════════ */
export function FlashPrice() {
  const { etat, reste } = useFlash();

  if (etat === "expire") {
    return (
      <div className="border-2 border-grey-line bg-grey-bg p-4 text-center">
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-text-soft">
          Offre terminée
        </p>
        <p className="mt-1 text-[1.1rem] font-bold text-blue">
          La Méthode reste accessible, au prix habituel.
        </p>
        <p className="mt-1 text-[1.9rem] font-bold tabular-nums text-blue">
          {euros(PRIX_APRES_FLASH)}
        </p>
        <p className="mt-1 text-[0.95rem] text-text-soft">
          Les {FLASH_MINUTES} minutes sont passées — ça arrive, et vous n&apos;avez rien perdu
          d&apos;essentiel. Tout le reste est identique : même Méthode complète, même accès
          immédiat, même garantie de 30 jours.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-red bg-red-bg p-4 text-center">
      <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-red">
        Votre accès à la Méthode
      </p>
      {/* La phrase entière, en une seule fois : ce qu'on donne, à quel prix,
          pendant combien de temps. Un chiffre isolé au-dessus d'un compteur
          laisse le lecteur deviner le lien entre les deux — or c'est
          précisément ce lien qui fait décider. */}
      <p className="mt-1 text-[1.18rem] leading-snug">
        Nous vous ouvrons la Méthode complète pour{" "}
        <strong className="whitespace-nowrap text-[1.5rem] text-blue">
          {euros(PRODUCTS.front.price)}
        </strong>{" "}
        seulement — au lieu de{" "}
        <span className="whitespace-nowrap line-through">{euros(PRIX_APRES_FLASH)}</span> —{" "}
        {etat === "encours" ? "pendant encore" : `pendant ${FLASH_MINUTES} minutes`}
      </p>
      {etat === "encours" && reste !== null && (
        <p
          role="timer"
          aria-live="off"
          className="my-1 text-[3rem] font-bold leading-none tabular-nums text-red"
        >
          {mmss(reste)}
        </p>
      )}
      <p className="mt-2 text-[0.95rem]">
        Passé ce délai, la Méthode repasse à{" "}
        <strong className="whitespace-nowrap">{euros(PRIX_APRES_FLASH)}</strong>. Ce compteur ne se
        remet pas à zéro si vous rechargez la page.
      </p>
    </div>
  );
}

/** Le prix affiché en ligne, dans une phrase. Il suit le compteur. */
export function FlashInlinePrice() {
  const { etat } = useFlash();
  return (
    <span className="whitespace-nowrap font-bold">
      {euros(etat === "expire" ? PRIX_APRES_FLASH : PRODUCTS.front.price)}
    </span>
  );
}

/**
 * LE PRIX DU JOUR, dans le tableau de valeur.
 *
 * Il suit le compteur ET le rattrapage. Sans lui, la ligne « Aujourd'hui »
 * affichait 27 € en dur, y compris à quelqu'un dont le bandeau venait
 * d'annoncer que l'offre était terminée. Deux prix différents sur le même
 * écran, et le lecteur ne sait plus lequel il paiera.
 */
export function PrixDuJour() {
  const { etat } = useFlash();
  const [rattrapage, setRattrapage] = useState(false);

  useEffect(() => {
    const relire = () => setRattrapage(/(?:^|;\s*)hi_rattrapage=1/.test(document.cookie));
    relire();
    const id = setInterval(relire, 1000);
    return () => clearInterval(id);
  }, []);

  if (etat !== "expire") return <>{euros(PRODUCTS.front.price)}</>;
  return <>{euros(rattrapage ? PRIX_RATTRAPAGE : PRIX_APRES_FLASH)}</>;
}

/**
 * La phrase qui explique l'échelle des trois nombres, adaptée à l'état du
 * compteur. « et 27 € tant que votre compteur tourne » n'a aucun sens à
 * lire quand le compteur est à zéro depuis dix minutes.
 */
export function EchelleDesPrix() {
  const { etat } = useFlash();
  return (
    <p className="mt-2 text-[0.95rem] text-text-soft">
      Les {euros(PRODUCTS.front.anchor)} sont la valeur des pièces achetées séparément, pas un prix
      de vente.{" "}
      {etat === "expire" ? (
        <>
          La Méthode se vend{" "}
          <strong className="whitespace-nowrap">{euros(PRIX_APRES_FLASH)}</strong>.
        </>
      ) : (
        <>
          La Méthode se vend{" "}
          <strong className="whitespace-nowrap">{euros(PRIX_APRES_FLASH)}</strong> — et{" "}
          <strong className="whitespace-nowrap">{euros(PRODUCTS.front.price)}</strong> tant que
          votre compteur tourne.
        </>
      )}
    </p>
  );
}
