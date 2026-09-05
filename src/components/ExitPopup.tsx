"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Fenêtre de sortie : s'ouvre quand la souris quitte la page par le haut (ordinateur).
 * Une seule fois par session et par page. Jamais sur les pages d'upsell.
 */
export function ExitPopup({
 storageKey,
 title,
 children,
}: {
 storageKey: string;
 title: string;
 children: ReactNode;
}) {
 const [open, setOpen] = useState(false);

 useEffect(() => {
 const key = `hi_exit_${storageKey}`;
 let shown = false;
 try {
 shown = sessionStorage.getItem(key) === "1";
    } catch {}
 if (shown) return;

 const onLeave = (e: MouseEvent) => {
 if (e.clientY > 0) return;
 try {
 sessionStorage.setItem(key, "1");
      } catch {}
 setOpen(true);
 document.removeEventListener("mouseout", onLeave);
    };
 document.addEventListener("mouseout", onLeave);
 return () => document.removeEventListener("mouseout", onLeave);
  }, [storageKey]);

 if (!open) return null;

 return (
    <div
 role="dialog"
 aria-modal="true"
 aria-labelledby="exit-title"
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
 onClick={() => setOpen(false)}
    >
      <div
 className="w-full max-w-lg border-2 border-blue bg-white"
 onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-grey-line bg-grey-bg px-4 py-3">
          <h2 id="exit-title" className="text-[1.15rem]">
            {title}
          </h2>
          <button
 type="button"
 onClick={() => setOpen(false)}
 aria-label="Fermer"
 className="shrink-0 text-[1.4rem] leading-none text-text-soft"
          >
            ×
          </button>
        </div>
        <div className="space-y-4 p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
