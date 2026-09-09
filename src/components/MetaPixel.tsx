"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { mesurerAchatConfirme } from "@/app/publicite";
import { TEXTE_CONSENTEMENT } from "@/lib/texte-consentement";
const ACTIF = process.env.NEXT_PUBLIC_META_SERVER_MEASUREMENT === "true";

/** Nom historique conservé : aucun SDK ou traceur Meta n'est chargé dans le navigateur. */
export function MetaPixel() {
  const [choix, setChoix] = useState("inconnu");
  const [ouvert, setOuvert] = useState(false);
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");
  const bouton = useRef<HTMLButtonElement>(null);
  const verrou = useRef(false);
  useEffect(() => {
    if (!ACTIF) return;
    const abort = new AbortController();
    void fetch("/api/confidentialite/preferences", { cache: "no-store", signal: abort.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const p = await r.json();
        if (!abort.signal.aborted) {
          setChoix(p.choix);
          setOuvert(p.choix === "inconnu");
        }
      })
      .catch(() => {
        if (!abort.signal.aborted) setOuvert(true);
      });
    return () => abort.abort();
  }, []);
  function fermer() {
    setOuvert(false);
    bouton.current?.focus();
  }
  async function choisir(accord: boolean) {
    if (verrou.current) return;
    verrou.current = true;
    setAttente(true);
    setErreur("");
    try {
      const r = await fetch("/api/confidentialite/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accord }),
      });
      if (!r.ok) throw new Error();
      const p = await r.json();
      setChoix(p.choix);
      fermer();
      window.dispatchEvent(new Event("hi-mesure-preference"));
    } catch {
      setChoix("inconnu");
      setErreur(
        "Votre choix n’a pas pu être enregistré. Aucune nouvelle autorisation n’est retenue. Vous pouvez continuer votre visite.",
      );
    } finally {
      setAttente(false);
      verrou.current = false;
    }
  }
  if (!ACTIF) return null;
  return (
    <aside
      aria-label="Préférences publicitaires"
      className="border-t border-grey-line px-5 py-3 text-center text-sm"
    >
      <button
        ref={bouton}
        type="button"
        onClick={() => setOuvert(!ouvert)}
        aria-expanded={ouvert}
        className="min-h-[44px] underline"
      >
        Mes préférences publicitaires
        {choix === "oui" ? " : autorisées" : choix === "non" ? " : refusées" : ""}
      </button>
      {ouvert && (
        <section
          aria-labelledby="consentement-titre"
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[70dvh] max-w-[850px] overflow-y-auto border-2 border-blue bg-white p-5 text-left text-base shadow-xl sm:p-6"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="consentement-titre" className="text-[1.2rem]">
              Votre choix pour la mesure publicitaire
            </h2>
            <button
              type="button"
              disabled={attente}
              onClick={fermer}
              aria-label="Fermer sans donner d’accord"
              className="min-h-[44px] min-w-[44px] border border-grey-line"
            >
              ×
            </button>
          </div>
          <p>{TEXTE_CONSENTEMENT}</p>
          <p className="mt-3 text-sm">
            Ce choix est distinct des emails commerciaux, mémorisé 180 jours dans ce navigateur et
            modifiable ici.{" "}
            <a href="/confidentialite#mesure-publicitaire" className="underline">
              Détails et retrait du consentement
            </a>
            .
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={attente}
              onClick={() => void choisir(false)}
              className="min-h-[48px] border-2 border-blue bg-white px-4 py-2 font-bold text-blue disabled:opacity-60"
            >
              Refuser
            </button>
            <button
              type="button"
              disabled={attente}
              onClick={() => void choisir(true)}
              className="min-h-[48px] border-2 border-blue bg-white px-4 py-2 font-bold text-blue disabled:opacity-60"
            >
              Autoriser
            </button>
          </div>
          {erreur && (
            <p role="alert" className="mt-3">
              {erreur}
            </p>
          )}
        </section>
      )}
    </aside>
  );
}
/** Les anciens événements navigateur sont neutralisés, y compris Purchase. */
export function PixelEvent(_props: {
  name: "Lead" | "InitiateCheckout" | "Purchase" | "ViewContent";
  params?: Record<string, string | number>;
}) {
  void _props;
  return null;
}
export function MesurerAchat({ id, membre = false }: { id: string; membre?: boolean }) {
  const [, transition] = useTransition();
  useEffect(() => {
    if (!ACTIF) return;
    const mesurer = () =>
      transition(async () => {
        await mesurerAchatConfirme(id, membre);
      });
    mesurer();
    window.addEventListener("hi-mesure-preference", mesurer);
    return () => window.removeEventListener("hi-mesure-preference", mesurer);
  }, [id, membre]);
  return null;
}
