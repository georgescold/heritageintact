import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";
export function CalendrierTroisDates() {
  return (
    <Feuille
      titre="Mes repères et vérifications"
      sousTitre="Des points de contrôle, pas trois ordres de donner."
    >
      <Titre>Donations : un historique par relation</Titre>
      <p>
        Recensez chaque donateur, bénéficiaire, date et déclaration. Il n’existe pas une date unique
        qui remet tous les abattements de la famille à zéro. Faites confirmer les dates et le rappel
        fiscal.
      </p>
      <TableauVierge
        colonnes={["Donateur → bénéficiaire", "Date et pièce", "Vérification à demander"]}
        lignes={3}
      />
      <Titre>Assurance-vie : l’historique des versements</Titre>
      <p>
        Votre âge lors des versements, les dates du contrat et les bénéficiaires comptent. Le 70e
        anniversaire ne rend pas automatiquement une opération utile ou inutile.
      </p>
      <Champ label="Contrat et historique à retrouver" />
      <Titre>Nue-propriété : la tranche d’âge concernée</Titre>
      <p>
        Pour un usufruit viager, la valeur fiscale de la nue-propriété est notamment de 60 % de 61 à
        70 ans inclus, puis de 70 % de 71 à 80 ans inclus. Ce pourcentage n’est ni une réduction
        directe de l’impôt ni un motif suffisant pour donner.
      </p>
      <Champ label="Question sur mon logement, mes revenus ou une vente future" />
      <Encadre titre="Ma priorité">
        <p>
          Choisissez d’abord selon vos besoins de sécurité et les informations manquantes. Un
          anniversaire proche peut justifier un rendez-vous, jamais une signature précipitée.
        </p>
      </Encadre>
      <Champ label="Prochaine vérification et date choisie" />
    </Feuille>
  );
}
