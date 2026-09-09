import { Feuille, Titre, Encadre, TableauVierge } from "@/components/documents/Feuille";

export function Calendrier15Ans() {
  return (
    <Feuille
      titre="Mon historique des donations et mon suivi"
      sousTitre="Une ligne par donation, pas une date unique pour la famille."
    >
      <p>
        Recensez les actes, déclarations, donateurs, bénéficiaires et dates. Faites confirmer la
        date fiscalement pertinente et les effets des donations précédentes. Le rappel fiscal et le
        traitement civil sont distincts.
      </p>
      <TableauVierge
        colonnes={[
          "Donateur → bénéficiaire",
          "Date / pièce",
          "Valeur et droits payés",
          "Date à faire confirmer",
        ]}
        lignes={4}
      />
      <Titre>Mes prochaines vérifications</Titre>
      <p>
        Une date de suivi n’oblige pas à donner. Choisissez-la pour retrouver une pièce, demander
        une explication ou revoir votre situation après un changement familial.
      </p>
      <TableauVierge
        colonnes={["Année / date", "Vérification", "Interlocuteur", "Réponse reçue"]}
        lignes={4}
      />
      <Encadre titre="Avant un nouveau calcul">
        <p>
          Un don précédent peut avoir utilisé l’abattement et des tranches du barème. Le simulateur
          simplifié de la formation n’intègre pas ce cas. Demandez un calcul adapté au
          professionnel.
        </p>
      </Encadre>
    </Feuille>
  );
}
