import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanMarie2Enfants() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Marié, deux enfants ou plus",
        objectif: "Organiser la transmission sans créer de malentendu sur l’équité.",
        pieces: "Titres, régime matrimonial, liste des enfants et des aides ou donations passées.",
        questions:
          "Comment protéger le conjoint ? Quelles parts civiles reviennent à chacun ? Comment les aides déjà reçues seront-elles prises en compte ?",
        vigilance:
          "Un partage égal en valeur n’est pas nécessairement simple lorsqu’une maison concentre le patrimoine. Une donation-partage n’est pas une case à cocher automatiquement.",
        action:
          "Noter ce que chaque enfant a déjà reçu, sans calculer vous-même ce qui devrait être compensé.",
      }}
    />
  );
}
