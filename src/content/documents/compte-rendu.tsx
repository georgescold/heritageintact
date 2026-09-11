import {
  Case,
  Champ,
  Encadre,
  Feuille,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";

/**
 * LE COMPTE-RENDU À TROUS, à remplir en sortant du rendez-vous.
 *
 * ⚠️ « Pour que le conjoint sache. » C'est la vraie fonction de cette feuille,
 * et elle est plus importante que la mémoire du lecteur lui-même : dans la
 * moitié des couples, une seule personne va chez le notaire, et l'autre
 * découvre tout au pire moment. Une page remplie dans la voiture règle ça.
 *
 * À remplir SUR PLACE ou juste après. Passé deux jours, plus personne ne se
 * souvient de ce qui a été dit exactement — et « exactement » est tout le
 * sujet.
 */
export function CompteRendu() {
  return (
    <Feuille
      titre="Mon compte-rendu de rendez-vous"
      sousTitre="À remplir en sortant, pas le lendemain. Puis rangé au classeur, à la vue du conjoint."
    >
      <div className="grid gap-3">
        <Champ label="Rendez-vous du" />
        <Champ label="Chez" indice="nom du notaire et de l'étude" />
        <Champ label="Étaient présents" />
      </div>

      <Titre>1. Ce qui a été confirmé</Titre>
      <Champ label="Mon régime matrimonial est" />
      <Champ label="Une donation au dernier vivant existe" indice="oui / non" />
      <Champ label="Les droits estimés aujourd'hui, par enfant" />
      <Champ label="Écart avec mon propre calcul, et pourquoi" />

      <Titre>2. Ce qui a été décidé</Titre>
      <TableauVierge
        colonnes={["La décision", "Qui s'en occupe", "Avant quelle date", "Coût annoncé"]}
        lignes={4}
      />

      <Titre>3. Ce qui a été écarté, et pour quelle raison</Titre>
      <TableauVierge colonnes={["Ce qui a été écarté", "La raison donnée"]} lignes={3} />
      <p className="text-[0.93rem]">
        Cette partie est celle qu&apos;on oublie de noter, et c&apos;est la plus utile dans deux ans
        : elle évite de reposer la même question et de recevoir une réponse différente.
      </p>

      <Titre>4. Ce que je dois fournir</Titre>
      <TableauVierge colonnes={["La pièce demandée", "Où je la trouve", "Envoyée le"]} lignes={4} />

      <Titre>5. La suite</Titre>
      <Champ label="Prochain rendez-vous" />
      <Champ label="Ce qui doit être signé, et quand" />

      <Encadre titre="POUR MON CONJOINT, OU POUR CELUI QUI LIRA CETTE FEUILLE">
        <p className="text-[0.95rem]">
          Voici ce qui a été dit, par qui, et ce qu&apos;il reste à faire. En cas de question, le
          nom et le téléphone de l&apos;étude sont en haut de cette feuille.
        </p>
      </Encadre>

      <Titre>Avant de ranger cette feuille</Titre>
      <ul className="space-y-1">
        <Case>Je l&apos;ai relue à voix haute avec mon conjoint.</Case>
        <Case>J&apos;ai reporté les dates décidées dans mon agenda et noté la prochaine action.</Case>
        <Case>J&apos;ai rangé la feuille au classeur, à sa place.</Case>
      </ul>

      <p className="text-[0.9rem]">
        Conservez ce compte-rendu avec les actes et courriers reçus de l&apos;étude : vous retrouverez
        ainsi, au même endroit, vos notes de préparation et les réponses formalisées.
      </p>
    </Feuille>
  );
}
