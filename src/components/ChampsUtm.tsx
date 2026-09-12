"use client";

import { useEffect, useState } from "react";
import { CHAMPS_UTM, COOKIE_UTM, lireUtm, utmPresent, type Utm } from "@/lib/utm";

/**
 * LES CHAMPS CACHÉS QUI PORTENT L'ORIGINE PUBLICITAIRE JUSQU'AU FORMULAIRE.
 *
 * Deux chemins, dans cet ordre :
 *
 *   1. L'ADRESSE D'ARRIVÉE. C'est le cas normal : la publicité pointe vers /lp
 *      et le formulaire est sur /lp.
 *   2. LE COOKIE. C'est le rattrapage : quelqu'un arrive par une publicité, lit
 *      deux pages du guide, puis s'inscrit. La requête n'a plus de paramètres,
 *      mais l'origine a été déposée à l'arrivée et survit trente jours.
 *
 * ⚠️ LECTURE DANS UN EFFET, PAS PENDANT LE RENDU. `window` n'existe pas au
 * rendu serveur, et lire l'adresse pendant le rendu produirait un HTML côté
 * serveur différent de celui du navigateur — React démonterait le formulaire.
 * Les champs partent donc vides au premier rendu et se remplissent aussitôt.
 *
 * ⚠️ On n'utilise PAS `useSearchParams` : sur une page statique, ce hook force
 * tout l'arbre en rendu côté client. La racine et les pages du guide sont
 * statiques, et doivent le rester.
 */
export function ChampsUtm() {
  const [utm, setUtm] = useState<Utm>({});

  useEffect(() => {
    const depuisUrl = lireUtm((cle) => new URLSearchParams(window.location.search).get(cle));

    if (utmPresent(depuisUrl)) {
      setUtm(depuisUrl);
      // Déposé pour survivre à une navigation avant l'inscription. Aucune donnée
      // personnelle : des noms de campagne que nous avons écrits nous-mêmes.
      try {
        document.cookie = `${COOKIE_UTM}=${encodeURIComponent(JSON.stringify(depuisUrl))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      } catch {
        // Un navigateur qui refuse les cookies ne doit pas casser le formulaire.
      }
      return;
    }

    try {
      const brut = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${COOKIE_UTM}=`))
        ?.slice(COOKIE_UTM.length + 1);
      if (!brut) return;
      const stocke = JSON.parse(decodeURIComponent(brut)) as Record<string, unknown>;
      setUtm(lireUtm((cle) => stocke[cle]));
    } catch {
      // Cookie illisible : on continue sans origine plutôt que d'échouer.
    }
  }, []);

  return (
    <>
      {CHAMPS_UTM.map((champ) => (
        <input key={champ} type="hidden" name={champ} value={utm[champ] ?? ""} readOnly />
      ))}
    </>
  );
}
