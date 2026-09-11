"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function DocumentEditable({ jeton, cle, children }: { jeton: string; cle: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const version = useRef(0);
  const [status, setStatus] = useState("Chargement de votre fiche…");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const endpoint = `/espace/${jeton}/sauvegarde/${cle}`;
  useEffect(() => {
    let active = true;
    root.current?.querySelectorAll<HTMLElement>("span.border-b").forEach((element, i) => {
      if (!element.textContent?.trim()) { element.dataset.aRemplir = `Texte à compléter ${i + 1}`; element.style.padding = "0 6px"; element.style.display = "inline-block"; }
    });
    const elements = [...(root.current?.querySelectorAll<HTMLElement>("[data-a-remplir]") ?? [])];
    async function load() {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Votre fiche n’a pas pu être chargée. Rechargez la page pour réessayer.");
        const saved = await response.json();
        if (!active) return;
        version.current = saved?.version ?? 0;
        elements.forEach((element, i) => {
          element.contentEditable = "plaintext-only";
          element.setAttribute("role", "textbox");
          element.setAttribute("aria-label", element.dataset.aRemplir || `Votre réponse ${i + 1}`);
          element.setAttribute("tabindex", "0");
          element.style.minWidth = "40px";
          element.style.whiteSpace = "pre-wrap";
          element.style.overflowWrap = "anywhere";
          element.textContent = saved?.value?.[String(i)] ?? "";
        });
        setReady(true); setStatus(saved ? "Votre fiche enregistrée est ouverte. Cliquez dans une zone pour écrire." : "Cliquez dans les zones à compléter. Écrivez « à retrouver » si une information manque.");
      } catch (error) { if (active) setStatus((error as Error).message); }
    }
    void load();
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (root.current?.dataset.dirty === "oui") event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => { active = false; window.removeEventListener("beforeunload", beforeUnload); };
  }, [endpoint]);
  async function save() {
    setBusy(true);
    const value = Object.fromEntries([...(root.current?.querySelectorAll<HTMLElement>("[data-a-remplir]") ?? [])].map((element, i) => [String(i), element.innerText]));
    try {
      const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value, version: version.current }) });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.error);
      version.current = saved.version;
      const current = Object.fromEntries([...(root.current?.querySelectorAll<HTMLElement>("[data-a-remplir]") ?? [])].map((element, i) => [String(i), element.innerText]));
      const unchanged = JSON.stringify(current) === JSON.stringify(value);
      if (root.current) root.current.dataset.dirty = unchanged ? "non" : "oui";
      setStatus(unchanged ? "Fiche enregistrée. Vous pouvez la retrouver dans votre espace sur un autre appareil." : "Les premières modifications sont enregistrées. Enregistrez aussi les dernières modifications.");
    } catch (error) { setStatus((error as Error).message); }
    finally { setBusy(false); }
  }
  return <>
    <section className="no-print wrap mb-6 border border-blue bg-grey-bg p-5">
      <h2 className="text-xl">À votre choix : remplir ici, imprimer ou conserver en PDF</h2>
      <p className="my-3">Vous pouvez écrire dans les zones de la fiche, puis enregistrer dans votre espace. Pour garder une copie sur votre appareil, choisissez « Imprimer / PDF », puis « Enregistrer au format PDF » dans la fenêtre d’impression.</p>
      <p className="mb-3 text-sm">Votre lien personnel donne accès à vos fiches enregistrées. N’y inscrivez pas de données de santé, de coordonnées bancaires ou de pièces d’identité ; conservez ces détails dans vos documents personnels.</p>
      <div className="flex flex-wrap gap-3"><button disabled={!ready || busy} onClick={() => void save()} className="min-h-[48px] bg-blue px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Enregistrement…" : "Enregistrer ma fiche"}</button><button onClick={() => window.print()} className="min-h-[48px] border border-blue px-5 py-3">Imprimer / PDF</button></div>
      <p role="status" className="mt-3">{status}</p>
    </section>
    <div ref={root} onInput={() => { if (root.current) root.current.dataset.dirty = "oui"; setStatus("Modifications en cours : pensez à enregistrer votre fiche."); }}>{children}</div>
  </>;
}
