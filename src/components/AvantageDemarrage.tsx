"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Palier } from "@/lib/promotions";
import { euros } from "@/lib/config";
/** Affichage seulement : le serveur recalcule et vérifie le prix avant paiement. */
export function AvantageDemarrage({
  promotion,
  base,
}: {
  promotion: Palier;
  base: number;
}) {
  const router = useRouter();
  const [reste, setReste] = useState(
    Math.max(0, Date.parse(promotion.fin ?? "") - promotion.serveurMaintenant) || 0,
  );
  useEffect(() => {
    let rafraichi = false;
    function maj() {
      const duree =
        Math.max(
          0,
          Date.parse(promotion.fin ?? "") -
            Date.now(),
        ) || 0;
      setReste(duree);
      if (promotion.fin && duree === 0 && !rafraichi) {
        rafraichi = true;
        router.refresh();
      }
    }
    maj();
    const interval = setInterval(maj, 1000);
    window.addEventListener("pageshow", maj);
    document.addEventListener("visibilitychange", maj);
    return () => {
      clearInterval(interval);
      window.removeEventListener("pageshow", maj);
      document.removeEventListener("visibilitychange", maj);
    };
  }, [promotion.fin, promotion.serveurMaintenant, router]);
  if (!promotion.pourcent || !promotion.fin || base <= 0) return null;
  const secondes = Math.ceil(reste / 1000);
  const estFront = promotion.gamme === "front";
  const temps = (estFront
    ? [Math.floor(secondes / 60), secondes % 60]
    : [Math.floor(secondes / 3600), Math.floor(secondes / 60) % 60, secondes % 60])
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  if (estFront) {
    return (
      <aside
        className="my-6 border-4 border-red bg-red px-4 py-5 text-center text-white shadow-[0_8px_0_rgba(120,0,0,0.25)] sm:px-7"
        aria-label="Offre de première inscription à durée limitée"
      >
        <p className="text-[1.35rem] font-extrabold uppercase leading-tight sm:text-[1.65rem]">
          Nous offrons -50% pour votre première inscription
        </p>
        <p className="mt-2 font-bold">Cette offre disparaît dans :</p>
        <p
          className="mx-auto mt-3 w-fit min-w-40 border-2 border-white bg-[#760d13] px-5 py-2 text-[2.6rem] font-extrabold leading-none tabular-nums tracking-wider"
          aria-label="Temps restant"
        >
          {reste > 0 ? temps : "Actualisation…"}
        </p>
      </aside>
    );
  }
  if (typeof promotion.montantFixe === "number" && Number.isFinite(promotion.montantFixe)) {
    const derniereChance = promotion.montantFixe === 197;
    return (
      <aside className="my-6 border-4 border-red bg-red px-4 py-5 text-center text-white shadow-[0_8px_0_rgba(120,0,0,0.25)] sm:px-7" aria-label="Offre limitée sur Mon plan adapté à ma situation">
        <p className="text-[1.35rem] font-extrabold uppercase sm:text-[1.65rem]">
          {derniereChance ? "Dernière chance : -34%" : "Offre immédiate : plus de -50%"}
        </p>
        <p className="mt-2 text-[1.1rem]"><span className="line-through">{euros(base)}</span> <strong>→ {euros(promotion.montantFixe)}</strong></p>
        <p className="mt-2 font-bold">Ce prix disparaît dans :</p>
        <p className="mx-auto mt-3 w-fit min-w-40 border-2 border-white bg-[#760d13] px-5 py-2 text-[2.6rem] font-extrabold leading-none tabular-nums tracking-wider" aria-label="Temps restant">
          {reste > 0 ? [Math.floor(secondes / 60), secondes % 60].map(n=>String(n).padStart(2,"0")).join(":") : "Actualisation…"}
        </p>
        <p className="mt-3 text-sm font-bold">{derniereChance ? `Ensuite : retour au prix de ${euros(base)}.` : `Ensuite : dernière chance à ${euros(promotion.suivantFixe ?? 197)} pendant 5 minutes.`}</p>
      </aside>
    );
  }
  const apres = Math.round((base * 100 * (100 - promotion.suivant)) / 100) / 100;
  return (
    <aside
      className="my-5 border-2 border-orange bg-yellow-bg p-4"
      aria-label="Conditions de votre avantage de démarrage"
    >
      <p className="font-bold text-orange-dark">
        {promotion.gamme === "front" && promotion.pourcent === 30
          ? "Dernière chance"
          : "Votre avantage de démarrage"} : −{promotion.pourcent}% sur {euros(base)}
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
