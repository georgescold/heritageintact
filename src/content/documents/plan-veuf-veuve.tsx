import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanVeufVeuve() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Veuf ou veuve",
        objectif: "Comprendre ce qui vous appartient depuis la succession précédente.",
        pieces:
          "Acte de notoriété, déclaration de succession, attestation immobilière, partage et options exercées.",
        questions:
          "Suis-je plein propriétaire, usufruitier ou indivisaire ? Qui doit consentir à une vente ? Quelles donations passées me concernent personnellement ?",
        vigilance:
          "Ne repartez pas de la valeur entière de la maison si une partie appartient déjà aux enfants. Les droits reçus auparavant doivent être identifiés.",
        action:
          "Retrouver les actes de la première succession et demander une lecture de la propriété actuelle.",
      }}
    />
  );
}
