"use client";
import { useEffect, useRef, useState } from "react";
export function AideDecision() {
  const dialog = useRef<HTMLDialogElement>(null);
  const declencheur = useRef<HTMLButtonElement>(null);
  const origine = useRef<HTMLElement | null>(null);
  const [barre, setBarre] = useState(false);
  function ouvrir() {
    origine.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
  }
  function fermer() { dialog.current?.close(); origine.current?.focus(); }
  useEffect(() => {
    const debut = Date.now();
    let vu = false;
    try { vu = sessionStorage.getItem("hi_aide_v3") === "1"; } catch {}
    const scroll = () => {
      const premier = document.querySelector("#premier-cta")?.getBoundingClientRect();
      const dernier = document.querySelector("#dernier-cta")?.getBoundingClientRect();
      const champ = document.activeElement?.matches("input,textarea,select");
      setBarre(Boolean(premier && premier.bottom < 0 && dernier && dernier.top > window.innerHeight && !champ));
    };
    const sortie = (e: MouseEvent) => {
      if (vu || e.relatedTarget !== null || e.clientY > 0 || Date.now() - debut < 30000 || window.scrollY < 350 || !window.matchMedia("(pointer: fine)").matches || document.querySelector("dialog[open]")) return;
      vu = true;
      try { sessionStorage.setItem("hi_aide_v3", "1"); } catch {}
      ouvrir();
    };
    document.addEventListener("mouseout", sortie);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => { document.removeEventListener("mouseout", sortie); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); };
  }, []);
  return <>
    <button ref={declencheur} type="button" onClick={ouvrir} className="min-h-[48px] underline">Une hésitation ? Regardez avant de choisir</button>
    {barre && <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-blue bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
      <a href="/commander" className="block bg-orange-dark px-4 py-3 text-center font-bold text-white no-underline">Commencer maintenant</a>
      <p className="mt-1 text-center text-xs">Paiement unique · Garantie 30 jours</p>
    </div>}
    <dialog ref={dialog} className="fixed inset-0 m-auto max-h-[85dvh] w-[min(92vw,560px)] overflow-auto border-2 border-blue bg-white p-6 text-text backdrop:bg-black/50" aria-labelledby="aide-titre" onClick={e => { if (e.target === dialog.current) fermer(); }}>
      <div className="flex items-start justify-between gap-3"><h2 id="aide-titre" className="text-[1.5rem]">Vous voulez savoir ce qu’il y a vraiment dedans ?</h2><button autoFocus type="button" onClick={fermer} aria-label="Fermer l’aide" className="min-h-[44px] min-w-[44px] border border-grey-line">×</button></div>
      <p className="my-4">C’est normal. Ouvrez la fiche et l’exemple rempli : vous pourrez juger si cette manière de préparer vous convient.</p>
      <a href="/apercu" className="my-4 block bg-blue p-4 text-center font-bold text-white no-underline">Voir les supports sans m’inscrire</a>
      <details className="border-t border-grey-line py-3"><summary className="cursor-pointer font-bold">Devrai-je acheter autre chose ensuite ?</summary><p className="mt-3">Non. Les 7 erreurs restent accessibles sans autre achat. Le simulateur avec plan adapté et le guide assurance-vie sont deux produits distincts, proposés séparément.</p></details>
      <button type="button" onClick={fermer} className="mt-3 min-h-[44px] underline">Continuer ma lecture</button>
    </dialog>
  </>;
}
