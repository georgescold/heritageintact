import { droits, partNuePropriete } from "./bareme";
export type Scenario = {
  valeur: number;
  enfants: number;
  parents: number;
  age: number;
  mode: "succession" | "nue-propriete";
  confirme: boolean;
};
export type CalculAtelier =
  | { ok: false; raison: string }
  | {
      ok: true;
      valeurFiscale: number;
      partParRelation: number;
      baseParRelation: number;
      droitsParRelation: number;
      total: number;
      lignes: ReturnType<typeof droits>["lignes"];
      relations: number;
    };
export function calculerAtelier(s: Scenario): CalculAtelier {
  if (!s.confirme)
    return { ok: false, raison: "Confirmez les hypothèses avant d’afficher un montant." };
  if (!Number.isFinite(s.valeur) || s.valeur < 0 || s.valeur > 1e10)
    return { ok: false, raison: "Indiquez une valeur comprise entre 0 et 10 milliards d’euros." };
  if (!Number.isInteger(s.enfants) || s.enfants < 1 || s.enfants > 20)
    return { ok: false, raison: "Indiquez de 1 à 20 enfants." };
  if (!Number.isInteger(s.parents) || s.parents < 1 || s.parents > 2)
    return { ok: false, raison: "Choisissez un ou deux donateurs." };
  if (s.mode !== "succession" && s.mode !== "nue-propriete")
    return { ok: false, raison: "Mode inconnu." };
  if (s.mode === "succession" && s.parents !== 1)
    return { ok: false, raison: "Une seule succession à la fois : ne cumulez pas deux parents." };
  if (s.mode === "nue-propriete" && (!Number.isInteger(s.age) || s.age < 18 || s.age > 120))
    return { ok: false, raison: "Indiquez un âge entier entre 18 et 120 ans." };
  const valeurFiscale = s.valeur * (s.mode === "nue-propriete" ? partNuePropriete(s.age) : 1);
  const relations = s.parents * s.enfants;
  const partParRelation = valeurFiscale / relations;
  const baseParRelation = Math.max(0, partParRelation - 100000);
  const d = droits(baseParRelation);
  return {
    ok: true,
    valeurFiscale,
    partParRelation,
    baseParRelation,
    droitsParRelation: d.total,
    total: d.total * relations,
    lignes: d.lignes,
    relations,
  };
}
