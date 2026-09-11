"use client";

import { useState } from "react";
import { euros } from "@/lib/config";
import { BoutonAchat as Button } from "./BoutonAchat";

export function PlanCheckoutChoice({
  action,
  planPrice,
  bundlePrice,
}: {
  action: (formData: FormData) => void | Promise<void>;
  planPrice: number;
  bundlePrice?: number;
}) {
  const [testament, setTestament] = useState(false);
  const total = testament && bundlePrice != null ? bundlePrice : planPrice;

  return (
    <form action={action} className="mt-6">
      {bundlePrice != null && (
        <label className="mb-5 block cursor-pointer border-2 border-green bg-green-bg p-4">
          <span className="flex items-start gap-3">
            <input
              className="mt-1 h-5 w-5 shrink-0 accent-green"
              type="checkbox"
              name="ajouterTestament"
              value="oui"
              checked={testament}
              onChange={(event) => setTestament(event.target.checked)}
            />
            <span>
              <strong className="block text-[1.05rem] text-green">
                Ajouter le Dossier Testament à mon plan pour 29 € au lieu de 47 €
              </strong>
              <span className="mt-1 block leading-relaxed">
                Une volonté seulement dite peut être oubliée, mal comprise ou contredite par un
                acte existant. Ce dossier vous aide à clarifier personnes, biens et souhaits,
                puis à préparer leur vérification et leur formalisation par un notaire.
              </span>
              <small className="mt-2 block text-text-soft">
                Économie immédiate : 18 €. Vous préparez vos volontés et le notaire les traduit
                ensuite dans la forme adaptée à votre situation.
              </small>
            </span>
          </span>
        </label>
      )}
      <input type="hidden" name="montantAffiche" value={total} />
      <Button>{`Déverrouiller mon plan adapté · ${euros(total)}`}</Button>
      <p className="mt-3 text-sm text-text-soft">
        Paiement unique sur votre carte enregistrée, uniquement si vous confirmez. Garantie
        commerciale de 30 jours selon les CGV. Aucun abonnement.
      </p>
    </form>
  );
}
