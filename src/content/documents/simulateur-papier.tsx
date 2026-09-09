import { Feuille, Titre, Champ, Encadre, Source } from "@/components/documents/Feuille";
export function SimulateurPapier() {
  return (
    <Feuille
      titre="Ma fiche de calcul pédagogique"
      sousTitre="Un exemple fictif pour comprendre, pas votre facture personnelle."
    >
      <Encadre titre="Le cadre de cet exemple">
        <p>
          Un seul parent transmet à un enfant une part nette de 520 000 €. Abattement entièrement
          disponible de 100 000 €, aucune donation antérieure fiscalement rappelable, aucun régime
          particulier. Hors assurance-vie, frais et règles de partage civil.
        </p>
      </Encadre>
      <Titre>Le calcul</Titre>
      <p>
        520 000 − 100 000 = 420 000 € de base taxable. Le barème s’applique par tranches, pas à un
        taux unique sur toute la somme.
      </p>
      <p>
        8 072 × 5 % = 403,60 € ; 4 037 × 10 % = 403,70 € ; 3 823 × 15 % = 573,45 € ; 404 068 × 20 %
        = 80 813,60 €. Total illustratif avant arrondi fiscal final : 82 194,35 €.
      </p>
      <Encadre titre="Ce que ce chiffre ne dit pas">
        <p>
          Il ne représente pas automatiquement les successions de deux parents possédant ensemble
          une maison. La propriété, les droits du conjoint, les donations et les parts civiles
          doivent être établis avant le calcul.
        </p>
      </Encadre>
      <Titre>Ce que je dois demander</Titre>
      <Champ label="Quelle part serait réellement transmise par le parent concerné ?" />
      <Champ label="Quels abattements et donations passées faut-il prendre en compte ?" />
      <Champ label="Quel serait le coût total, frais compris ?" />
      <Source>
        Repères du 9 septembre 2026.{" "}
        <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">
          Barème et abattements : impots.gouv.fr
        </a>
        .
      </Source>
    </Feuille>
  );
}
