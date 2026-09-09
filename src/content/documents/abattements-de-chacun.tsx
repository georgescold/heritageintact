import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";

export function AbattementsDeChacun() {
  return (
    <Feuille
      titre="Mes abattements à faire confirmer"
      sousTitre="L’opération et le lien de parenté comptent autant que le montant."
    >
      <p>
        Ne recopiez pas un abattement de donation dans un calcul de succession sans vérifier. Ne
        comptez pas non plus un abattement entier lorsqu’une donation antérieure l’a déjà consommé.
      </p>
      <Titre>Trois distinctions utiles</Titre>
      <p>
        Pour un enfant, les donations antérieures peuvent affecter la disponibilité de l’abattement
        parent-enfant. Pour un petit-enfant, donation et succession ne suivent pas les mêmes règles
        générales d’abattement. Pour un conjoint ou un partenaire, exonération d’impôt et droit de
        recevoir ne sont pas synonymes.
      </p>
      <TableauVierge
        colonnes={[
          "Relation et opération",
          "Historique à examiner",
          "Abattement confirmé",
          "Source et date",
        ]}
        lignes={4}
      />
      <Champ label="Situation particulière à signaler au professionnel" />
      <Encadre titre="Ne pas remplir au hasard">
        <p>
          Si un cas ne figure pas dans l’atelier pédagogique, cela ne signifie pas que l’impôt est
          nul. Cela signifie que le modèle ne le traite pas.
        </p>
      </Encadre>
    </Feuille>
  );
}
