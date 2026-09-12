"use client";
import { useActionState, useState } from "react";
import { actualiserPriorite } from "@/app/espace/preferences";
import { OBJECTIFS, type Objectif } from "@/lib/positionnement";
/**
 * Les sept objectifs dans le registre de l’intention. Le questionnaire les formule en
 * inquiétudes (« Que mes enfants doivent vendre la maison… »), ce qui ne se lit pas sous
 * « Ce que je souhaite maintenant ». Le Record force la couverture : ajouter un objectif à
 * OBJECTIFS sans son libellé ne compile pas, et le client ne peut pas tomber devant une liste
 * où sa propre priorité manque.
 */
const LIBELLES: Record<Objectif, string> = {
  comprendre: "Continuer à comprendre les bases",
  preparer: "Préparer mon rendez-vous et mon dossier",
  maison: "Protéger la maison familiale",
  facture: "Savoir ce que la succession coûterait à mes proches",
  date: "Ne pas laisser passer une date importante",
  documents: "Rassembler les documents que mes proches devront retrouver",
  "assurance-vie": "Faire le point sur mes contrats d’assurance-vie",
};
export function PrioriteActuelle({
  jeton,
  objectif,
  av,
}: {
  jeton: string;
  objectif?: string;
  av?: string;
}) {
  const [choix, setChoix] = useState(objectif ?? "");
  const [etat, action, attente] = useActionState(actualiserPriorite.bind(null, jeton), {
    message: "",
  });
  return (
    <details className="my-6 border border-grey-line p-5">
      <summary className="cursor-pointer font-bold">
        Votre besoin a évolué ? Actualiser ma priorité
      </summary>
      <p className="my-3">
        Après vos premiers repères, vous pouvez adapter les propositions de votre espace. Cela
        n’achète rien et ne vous inscrit pas aux emails commerciaux.
      </p>
      <form action={action} className="space-y-4">
        <label className="block">
          Ce que je souhaite maintenant
          <select
            name="objectif"
            required
            value={choix}
            onChange={(e) => setChoix(e.target.value)}
            className="mt-2 block min-h-[48px] w-full border border-grey-line bg-white p-3"
          >
            <option value="" disabled>
              Choisir ma priorité
            </option>
            {OBJECTIFS.map((code) => (
              <option key={code} value={code}>
                {LIBELLES[code]}
              </option>
            ))}
          </select>
        </label>
        {choix === "assurance-vie" && (
          <label className="block">
            Avez-vous un contrat d’assurance-vie ?
            <select
              name="av"
              defaultValue={av ?? "X"}
              className="mt-2 block min-h-[48px] w-full border border-grey-line bg-white p-3"
            >
              <option value="O">Oui</option>
              <option value="N">Non</option>
              <option value="?">Je ne sais plus</option>
              <option value="X">Je préfère ne pas répondre</option>
            </select>
          </label>
        )}
        <button
          disabled={attente}
          className="min-h-[48px] bg-blue px-5 py-3 font-bold text-white disabled:opacity-60"
        >
          {attente ? "Enregistrement…" : "Actualiser sans rien acheter"}
        </button>
        <p role="status" className="text-sm">
          {etat.message}
        </p>
      </form>
    </details>
  );
}
