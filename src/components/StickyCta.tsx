"use client";

import { useEffect, useState } from "react";

/**
 * Barre d'action fixe, mobile uniquement.
 *
 * Sur un téléphone, le hero fait 1 200 px : le formulaire ne peut pas tenir
 * au-dessus de la ligne de flottaison sans vider le hero de ce qui donne envie
 * de le remplir. La barre règle le problème autrement — le bouton reste
 * atteignable en permanence, sans toucher au contenu.
 *
 * Elle n'apparaît qu'une fois le premier formulaire dépassé, pour ne pas
 * doubler un bouton déjà à l'écran.
 */
export function StickyCta({ href = "#acces", label }: { href?: string; label: string }) {
 const [visible, setVisible] = useState(false);

 useEffect(() => {
 const onScroll = () => {
 const bas = window.scrollY + window.innerHeight;
 const finDePage = document.body.scrollHeight - 900;
 setVisible(window.scrollY > 700 && bas < finDePage);
    };
 onScroll();
 window.addEventListener("scroll", onScroll, { passive: true });
 return () => window.removeEventListener("scroll", onScroll);
  }, []);

 return (
    <div
 className={`fixed inset-x-0 bottom-0 z-40 border-t-2 border-blue bg-white p-2.5 shadow-[0_-3px_10px_rgba(0,0,0,0.16)] transition-transform lg:hidden ${
 visible ? "translate-y-0" : "translate-y-full"
      }`}
 aria-hidden={!visible}
    >
      <a
 href={href}
 tabIndex={visible ? undefined : -1}
 className="flex min-h-[54px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 text-center text-[1.05rem] font-bold leading-tight text-white no-underline"
      >
        {label}
      </a>
    </div>
  );
}
