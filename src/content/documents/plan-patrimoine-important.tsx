import { ParcoursFamilial } from "@/components/documents/ParcoursFamilial";
export function PlanPatrimoineImportant() {
  return (
    <ParcoursFamilial
      {...{
        titre: "Patrimoine important ou diversifié",
        objectif: "Rendre les informations cohérentes entre tous vos conseils.",
        pieces:
          "Inventaire daté, détentions directes et sociétés, contrats, dettes, donations, résidences fiscales.",
        questions:
          "Les hypothèses de chacun sont-elles les mêmes ? Quels besoins de liquidité ? Quels risques et coûts à court et long terme ?",
        vigilance:
          "L’optimisation isolée d’un impôt peut dégrader la protection, la liquidité ou le traitement d’un autre actif. Le total brut ne suffit pas.",
        action:
          "Nommer un interlocuteur de coordination et demander une synthèse écrite des hypothèses et arbitrages.",
      }}
    />
  );
}
