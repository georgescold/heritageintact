import { Case, Champ, Encadre, Feuille, Source, TableauVierge, Titre } from "@/components/documents/Feuille";

const Avertissement = () => (
  <Encadre titre="Document préparatoire — ne pas utiliser comme testament">
    Ces feuilles clarifient vos intentions et préparent un échange avec un notaire. Elles ne
    constituent pas un testament, ne produisent aucun effet juridique et ne doivent pas être
    recopiées ou signées comme tel. La forme, la rédaction, la validité et les conséquences doivent
    être vérifiées par le professionnel.
  </Encadre>
);

export function DiagnosticTestament() {
  return <Feuille titre="1. Mon diagnostic testament" sousTitre="Voir pourquoi le sujet mérite — ou non — un examen professionnel.">
    <Avertissement />
    <Titre>Une volonté importante existe-t-elle seulement à l’oral ?</Titre>
    <ul className="space-y-1">
      <Case>Je souhaite protéger une personne qui n’est peut-être pas héritière selon la loi.</Case>
      <Case>Je souhaite attribuer un bien précis plutôt que laisser seulement un partage général.</Case>
      <Case>Ma famille comprend plusieurs unions, un enfant vulnérable ou une relation rompue.</Case>
      <Case>Je souhaite soutenir une association ou transmettre à une personne sans lien de parenté.</Case>
      <Case>Un ancien testament, une donation ou une clause d’assurance-vie existe déjà.</Case>
      <Case>Personne ne sait où retrouver la dernière version valable.</Case>
    </ul>
    <Titre>Le point qui m’inquiète le plus</Titre>
    <Champ label="Si rien n’est clarifié, j’ai peur que…" />
    <Champ label="La personne ou le bien concerné est…" />
    <Champ label="Le document existant que je dois d’abord retrouver est…" />
    <Source>En l’absence de testament, la loi détermine les héritiers. Un testament reste soumis notamment aux droits des héritiers réservataires lorsqu’ils existent.</Source>
  </Feuille>;
}

export function CarteVolontesTestament() {
  return <Feuille titre="2. Ma carte des volontés" sousTitre="Séparer ce que vous voulez, pourquoi vous le voulez et ce qui doit encore être vérifié.">
    <Avertissement />
    <Titre>Les personnes ou organismes auxquels je pense</Titre>
    <TableauVierge colonnes={["Personne / organisme", "Lien avec moi", "Ce que je souhaite protéger", "Pourquoi"]} lignes={5} />
    <Titre>Les biens ou sujets particuliers</Titre>
    <TableauVierge colonnes={["Bien / sujet", "Propriétaire actuel", "Souhait exprimé", "Pièce qui le prouve"]} lignes={5} />
    <Titre>Ce qui n’est pas négociable pour moi</Titre>
    <Champ label="Ma priorité personnelle" />
    <Champ label="La situation que je veux absolument éviter" />
    <Source>Écrivez ici vos intentions en langage courant. Ne cherchez pas une formule juridique : c’est précisément ce que le rendez-vous doit transformer en question puis, si approprié, en acte valable.</Source>
  </Feuille>;
}

export function CoherenceTestament() {
  return <Feuille titre="3. Le contrôle de cohérence" sousTitre="Un testament ne vit pas seul : mettez les documents existants sur la même table.">
    <Avertissement />
    <Titre>Ce qui existe déjà</Titre>
    <TableauVierge colonnes={["Document / acte", "Date", "Lieu / détenteur", "Cohérent avec mon souhait ?"]} lignes={6} />
    <ul className="space-y-1">
      <Case>Contrat de mariage, PACS ou changement de situation familiale</Case>
      <Case>Donation entre époux, donations passées ou donation-partage</Case>
      <Case>Testament antérieur et éventuel dépôt chez un notaire</Case>
      <Case>Clause bénéficiaire de chaque assurance-vie</Case>
      <Case>Titre de propriété, statuts de société ou convention d’indivision</Case>
    </ul>
    <Titre>Les contradictions à faire examiner</Titre>
    <Champ label="Deux documents semblent prévoir des personnes différentes" />
    <Champ label="Un bien cité ne m’appartient peut-être pas entièrement" />
    <Champ label="Une donation passée peut modifier l’équilibre imaginé" />
    <Source>Une clause bénéficiaire d’assurance-vie et un testament sont deux mécanismes distincts. Ne supposez pas que l’un corrige automatiquement l’autre.</Source>
  </Feuille>;
}

export function BriefNotaireTestament() {
  return <Feuille titre="4. Mon brief pour le notaire" sousTitre="Une page pour expliquer le projet sans improviser une rédaction juridique.">
    <Avertissement />
    <Champ label="Mon état civil et ma situation de couple" />
    <Champ label="Mes enfants et autres personnes à protéger" />
    <Champ label="Mon objectif principal en une phrase" />
    <Titre>Les trois volontés à examiner</Titre>
    <Champ label="1. Je souhaiterais… parce que…" />
    <Champ label="2. Je souhaiterais… parce que…" />
    <Champ label="3. Je souhaiterais… parce que…" />
    <Titre>Les faits qui peuvent changer la réponse</Titre>
    <Champ label="Donation, contrat, famille recomposée, bien à l’étranger…" />
    <Champ label="Ce que je ne sais pas encore ou ne peux pas prouver" />
    <Titre>Ma demande au professionnel</Titre>
    <p>Je souhaite comprendre ce que la loi prévoit sans nouvelle disposition, ce qui peut être organisé, les limites applicables, la forme recommandée, le coût annoncé et la manière de conserver puis mettre à jour l’acte.</p>
  </Feuille>;
}

export function QuestionsTestament() {
  return <Feuille titre="5. Les questions qui empêchent une fausse sécurité" sousTitre="Obtenir des réponses vérifiables avant de considérer le sujet comme réglé.">
    <Avertissement />
    <ul className="space-y-1">
      <Case>Qui hériterait aujourd’hui si aucun testament valable n’était retrouvé ?</Case>
      <Case>Quels héritiers disposent d’une part protégée dans ma situation ?</Case>
      <Case>Mon souhait porte-t-il sur un bien que je possède réellement et entièrement ?</Case>
      <Case>Une donation ou un acte antérieur limite-t-il ce que j’imagine pouvoir prévoir ?</Case>
      <Case>Faut-il révoquer, coordonner ou conserver un testament antérieur ?</Case>
      <Case>Quelle forme est adaptée : olographe, authentique ou autre solution ?</Case>
      <Case>Comment éviter une formulation ambiguë ou impossible à exécuter ?</Case>
      <Case>Qui conservera l’original et l’existence sera-t-elle inscrite au FCDDV ?</Case>
      <Case>Quel sera le coût total annoncé pour la consultation, la rédaction et la conservation ?</Case>
      <Case>Quel événement devra déclencher une nouvelle vérification ?</Case>
    </ul>
    <Titre>Réponses et décisions</Titre>
    <TableauVierge colonnes={["Question", "Réponse confirmée", "Action / responsable", "Échéance"]} lignes={5} />
  </Feuille>;
}

export function SuiviTestament() {
  return <Feuille titre="6. Conservation et mise à jour" sousTitre="Savoir quelle version compte et quand rouvrir le dossier.">
    <Avertissement />
    <Titre>La version formalisée</Titre>
    <Champ label="Date de l’acte ou de la vérification" />
    <Champ label="Professionnel et coordonnées" />
    <Champ label="Lieu de conservation de l’original" />
    <Champ label="Inscription au FCDDV confirmée le" />
    <Source>Le FCDDV permet, sous conditions, de savoir qu’un testament existe et auprès de quel notaire il est déposé ; il n’en révèle pas le contenu.</Source>
    <Titre>Je refais vérifier après…</Titre>
    <ul className="space-y-1">
      <Case>Mariage, PACS, séparation, divorce ou décès d’un proche concerné</Case>
      <Case>Naissance, adoption, recomposition familiale ou vulnérabilité nouvelle</Case>
      <Case>Vente, achat ou changement important de propriété d’un bien cité</Case>
      <Case>Donation importante, nouvelle assurance-vie ou modification d’une clause</Case>
      <Case>Déménagement à l’étranger ou présence d’un bien hors de France</Case>
      <Case>Changement profond de volonté ou difficulté à retrouver l’original</Case>
    </ul>
    <Champ label="Ma prochaine date de revue" />
  </Feuille>;
}
