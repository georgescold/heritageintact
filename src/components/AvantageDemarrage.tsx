"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Palier } from "@/lib/promotions";
import { euros } from "@/lib/config";
/** Affichage seulement : le serveur recalcule et vérifie le prix avant paiement. */
export function AvantageDemarrage({
  promotion,
  base,
  apresVsl = false,
}: {
  promotion: Palier;
  base: number;
  apresVsl?: boolean;
}) {
  const router = useRouter();
  const [reste, setReste] = useState(
    Math.max(0, Date.parse(promotion.fin ?? "") - promotion.serveurMaintenant) || 0,
  );
  const [vslTerminee, setVslTerminee] = useState(false);
  useEffect(() => {
    if (!apresVsl) {
      setVslTerminee(true);
      return;
    }
    const relire = () => {
      try {
        setVslTerminee(localStorage.getItem("hi_vsl_terminee") === "1");
      } catch {
        setVslTerminee(false);
      }
    };
    relire();
    window.addEventListener("hi:vsl-terminee", relire);
    return () => window.removeEventListener("hi:vsl-terminee", relire);
  }, [apresVsl]);
  useEffect(() => {
    const depart = performance.now();
    let rafraichi = false;
    function maj() {
      const duree =
        Math.max(
          0,
          Date.parse(promotion.fin ?? "") -
            promotion.serveurMaintenant -
            (performance.now() - depart),
        ) || 0;
      setReste(duree);
      if (promotion.fin && duree === 0 && !rafraichi) {
        rafraichi = true;
        router.refresh();
      }
    }
    maj();
    const interval = setInterval(maj, 1000);
    return () => clearInterval(interval);
  }, [promotion.fin, promotion.serveurMaintenant, router]);
  if ((apresVsl && !vslTerminee) || !promotion.pourcent || !promotion.fin || base <= 0) return null;
  const secondes = Math.ceil(reste / 1000);
  const temps = [Math.floor(secondes / 3600), Math.floor(secondes / 60) % 60, secondes % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  const apres = Math.round((base * 100 * (100 - promotion.suivant)) / 100) / 100;
  const maintenant = Math.round((base * 100 * (100 - promotion.pourcent)) / 100) / 100;
  if (apresVsl)
    return (
      <aside
        className="my-5 border-2 border-red bg-red-bg p-4 text-center shadow-md"
        aria-label="Votre offre limitée après la présentation"
      >
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-red">
          Offre réservée après cette présentation
        </p>
        <p className="mt-1 text-[1.18rem] leading-snug">
          Accédez maintenant à la Méthode complète pour{" "}
          <strong className="whitespace-nowrap text-[1.65rem] text-blue">
            {euros(maintenant)}
          </strong>{" "}
          au lieu de <span className="whitespace-nowrap line-through">{euros(base)}</span>.
        </p>
        <p
          role="timer"
          aria-live="off"
          className="my-2 text-[3rem] font-bold leading-none tabular-nums text-red"
          aria-label="Temps restant pour cette offre"
        >
          {reste > 0 ? temps : "Actualisation du prix…"}
        </p>
        <p className="text-[0.95rem]">
          À la fin de ce compteur, le prix passe à{" "}
          <strong className="whitespace-nowrap">{euros(apres)}</strong>. Le délai est personnel et
          ne repart pas à zéro si vous rechargez la page.
        </p>
      </aside>
    );
  return (
    <aside
      className="my-5 border-2 border-orange bg-yellow-bg p-4"
      aria-label="Conditions de votre avantage de démarrage"
    >
      <p className="font-bold text-orange-dark">
        Votre avantage de démarrage : −{promotion.pourcent}% sur {euros(base)}
      </p>
      <p className="mt-2 text-sm">
        Fin de ce palier :{" "}
        <time dateTime={promotion.fin}>
          {new Date(promotion.fin).toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>{" "}
        (heure de Paris).
      </p>
      <p className="my-3 text-[1.7rem] font-bold tabular-nums" aria-label="Temps restant">
        {reste > 0 ? temps : "Actualisation du prix…"}
      </p>
      <p>
        Au palier suivant :{" "}
        {promotion.suivant ? "−" + promotion.suivant + "%" : "fin de la réduction"}, soit{" "}
        {euros(apres)} pour la même composition d’achat.
      </p>
      <details className="mt-3 text-sm text-text-soft">
        <summary className="cursor-pointer font-bold">Comment fonctionne cet avantage ?</summary>
        <p className="mt-2">
          Délai personnel enregistré une seule fois. Un nouvel onglet ou une nouvelle visite ne le
          relance pas. Vos achats déjà payés restent acquis et déductibles lorsqu’ils sont inclus.{" "}
          <a href="/conditions-offres">Voir les conditions.</a>
        </p>
      </details>
    </aside>
  );
}
