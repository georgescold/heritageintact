import { Champ, Feuille, Source, TableauVierge, Titre } from "@/components/documents/Feuille";

/**
 * L'INVENTAIRE PATRIMONIAL (Le Dossier à apporter chez votre notaire).
 *
 * ⚠️ La colonne « mode de détention » est celle que tout le monde oublie et
 * c'est la plus importante : un même bien de 300 000 € ne se transmet pas de
 * la même façon selon qu'il est en propre, en communauté, en indivision ou
 * déjà démembré. Sans elle, le notaire refait l'inventaire lui-même.
 */
export function Inventaire() {
  return (
    <Feuille
      titre="Mon inventaire patrimonial"
      sousTitre="Bien par bien, compte par compte. C'est la première pièce que le notaire vous demandera."
    >
      <div className="grid gap-3">
        <Champ label="Établi par" />
        <Champ label="Le" />
      </div>

      <Titre>1. L&apos;immobilier</Titre>
      <TableauVierge
        colonnes={["Adresse du bien", "Valeur estimée", "Mode de détention", "Acquis en"]}
        lignes={4}
      />
      <Source>
        Mode de détention : bien propre, communauté, indivision (avec quelle quote-part),
        nue-propriété ou usufruit déjà séparés, parts de société.
      </Source>

      <Titre>2. Les comptes et l&apos;épargne</Titre>
      <TableauVierge
        colonnes={["Établissement", "Type de compte", "Solde approximatif", "Titulaire"]}
        lignes={5}
      />

      <Titre>3. Les contrats d&apos;assurance-vie</Titre>
      <TableauVierge
        colonnes={["Compagnie", "N° de contrat", "Montant", "Versé avant / après 70 ans"]}
        lignes={4}
      />
      <Source>
        La colonne de droite est celle qui décide du traitement fiscal du contrat : ne la laissez
        pas vide, même approximativement.
      </Source>

      <Titre>4. Le reste</Titre>
      <TableauVierge
        colonnes={["Nature", "Valeur estimée", "Où se trouve la pièce justificative"]}
        lignes={4}
      />
      <Source>
        Véhicules, parts de société, objets de valeur, prêts consentis à un proche, terrains, bois
        et forêts.
      </Source>

      <Titre>5. Ce que je dois</Titre>
      <TableauVierge
        colonnes={["Créancier", "Nature de la dette", "Capital restant dû"]}
        lignes={3}
      />

      <Titre>6. Les totaux</Titre>
      <Champ label="Total de ce que je possède" />
      <Champ label="Total de ce que je dois" />
      <Champ label="Masse à transmettre" indice="la différence des deux" />

      <p className="text-[0.9rem]">
        Les valeurs portées ici sont des estimations personnelles, sans valeur d&apos;expertise. Le
        notaire les fera confirmer pour les actes qui l&apos;exigent.
      </p>
    </Feuille>
  );
}
