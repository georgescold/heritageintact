"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fenêtre déclenchée au clic sur un bouton (structure LP 1 : LP courte avec pop-up).
 * Le formulaire n'apparaît qu'une fois la décision prise, ce qui réduit la friction perçue.
 */
export function ModalTrigger({
 label,
 title,
 children,
}: {
 label: string;
 title: string;
 children: ReactNode;
}) {
 const [open, setOpen] = useState(false);
 const closeRef = useRef<HTMLButtonElement>(null);

 useEffect(() => {
 if (!open) return;
 closeRef.current?.focus();
 const onKey = (e: KeyboardEvent) => {
 if (e.key === "Escape") setOpen(false);
    };
 document.addEventListener("keydown", onKey);
 return () => document.removeEventListener("keydown", onKey);
  }, [open]);

 return (
    <>
      <button
 type="button"
 onClick={() => setOpen(true)}
 className="inline-flex min-h-[60px] w-full cursor-pointer items-center justify-center border-b-4 border-orange-dark bg-orange px-5 text-center text-[1.1rem] font-bold text-white no-underline hover:bg-orange-dark sm:text-[1.2rem]"
      >
        {label}
      </button>

      {open && (
        <div
 role="dialog"
 aria-modal="true"
 aria-labelledby="modal-title"
 className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
 onClick={() => setOpen(false)}
        >
          <div
 className="my-auto w-full max-w-md border-2 border-blue bg-white"
 onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-grey-line bg-grey-bg px-4 py-3">
              <h2 id="modal-title" className="text-[1.1rem]">
                {title}
              </h2>
              <button
 ref={closeRef}
 type="button"
 onClick={() => setOpen(false)}
 aria-label="Fermer"
 className="shrink-0 cursor-pointer text-[1.4rem] leading-none text-text-soft"
              >
                ×
              </button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
