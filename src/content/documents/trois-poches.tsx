import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";
export function TroisPoches() {
  return (
    <Feuille
      titre="Ma sécurité avant toute transmission"
      sousTitre="Un cadre de réflexion, pas un calcul du montant à donner."
    >
      <Titre>1. Vivre</Titre>
      <p>
        Notez vos dépenses et vos revenus. Un déficit annuel signale un besoin à financer. Un
        excédent ne signifie pas que toute votre épargne est disponible : inflation, durée de vie,
        santé et évolution des revenus restent incertaines.
      </p>
      <Champ label="Dépenses annuelles estimées" />
      <Champ label="Revenus annuels estimés" />
      <Titre>2. Préserver mes projets et mes imprévus</Titre>
      <p>
        Logement, travaux, aide à domicile, changement de lieu de vie, soutien familial : listez les
        besoins sans imposer une durée ou un pourcentage universel.
      </p>
      <TableauVierge
        colonnes={["Besoin", "Ordre de grandeur", "Ressource disponible"]}
        lignes={3}
      />
      <Titre>3. Envisager, sans m’engager</Titre>
      <p>
        Une maison a une valeur mais ne permet pas de payer une dépense tant qu’elle n’est pas
        mobilisable. Ne soustrayez pas deux budgets de votre patrimoine total pour en déduire une
        somme « à donner ».
      </p>
      <Encadre titre="Ce qui compte">
        <p>
          Une donation transfère réellement des droits. Garder l’usufruit ne préserve pas toute la
          liberté d’un plein propriétaire. Demandez une étude de vos besoins et des conséquences
          avant de signer.
        </p>
      </Encadre>
      <Champ label="Ce dont je veux garder la maîtrise" />
      <Champ label="Ce que je dois faire vérifier" />
    </Feuille>
  );
}
