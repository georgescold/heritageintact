import { Feuille, Titre, Champ, Encadre, TableauVierge } from "@/components/documents/Feuille";
export function ParcoursFamilial({
  titre,
  objectif,
  pieces,
  questions,
  vigilance,
  action,
}: {
  titre: string;
  objectif: string;
  pieces: string;
  questions: string;
  vigilance: string;
  action: string;
}) {
  return (
    <Feuille titre={titre} sousTitre="Fiche de préparation · Pas un montage à appliquer">
      <p>{objectif}</p>
      <Titre>Rassembler</Titre>
      <p>{pieces}</p>
      <Titre>Poser les bonnes questions</Titre>
      <p>{questions}</p>
      <Encadre titre="Le point à ne pas confondre">
        <p>{vigilance}</p>
      </Encadre>
      <Titre>Votre prochaine action</Titre>
      <p>{action}</p>
      <Champ label="Ce que je souhaite protéger en priorité" />
      <Champ label="Le document qui me manque" />
      <TableauVierge
        colonnes={["Question prioritaire", "Réponse du professionnel", "Suite et date"]}
        lignes={3}
      />
      <p className="text-sm">
        Plusieurs fiches peuvent vous concerner. La fiche mise en avant est une aide à
        l’organisation, pas un diagnostic. Faites confirmer les droits, les frais et les
        conséquences avant toute signature.
      </p>
    </Feuille>
  );
}
