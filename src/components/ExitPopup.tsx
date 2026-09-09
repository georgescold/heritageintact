"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
/** Sortie réelle sur ordinateur, une fois par session ; fermeture clavier et focus natifs. */
export function ExitPopup({ storageKey, title, children }: { storageKey: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const key = `hi_exit_${storageKey}`;
    try { if (sessionStorage.getItem(key) === "1") return; } catch {}
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget) return;
      // Ne pas superposer à un autre dialogue (consentement, par exemple).
      if (document.querySelector('dialog[open], [role="dialog"][aria-modal="true"], [aria-labelledby="consentement-titre"]')) return;
      try { sessionStorage.setItem(key, "1"); } catch {}
      setOpen(true);
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [storageKey]);
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  return <dialog ref={dialog} aria-labelledby={titleId} onClose={() => setOpen(false)}
    onCancel={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
    className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto border-2 border-blue bg-white p-0 text-text backdrop:bg-black/60">
    <div className="flex items-start justify-between gap-3 border-b border-grey-line bg-grey-bg px-4 py-3">
      <h2 id={titleId} className="text-[1.15rem]">{title}</h2>
      <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="min-h-[44px] min-w-[44px] shrink-0 text-[1.4rem] text-text-soft">×</button>
    </div>
    <div className="space-y-4 p-4 sm:p-5">{children}</div>
  </dialog>;
}
