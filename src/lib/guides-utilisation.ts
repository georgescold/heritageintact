import type { ProductSku } from "./config";
export type GuideUtilisation = { sku: "front"|"bump"|"upsell1"|"upsell2"; titre: string; resultat: string; seances: string[][] };
export const GUIDES_UTILISATION: GuideUtilisation[] = [
  {
    "sku": "front",
    "titre": "Le guide : comprendre et faire votre premier pas",
    "resultat": "Votre fiche de situation, vos questions et un plan de préparation en une page.",
    "seances": [
      [
        "1. Commencez par une seule priorité",
        "Ouvrez l’étape 1 et la fiche de situation. Écrivez ce que vous souhaitez préserver pour vous ou vos proches. Ajoutez un document retrouvé et une question à poser. Si vous hésitez entre plusieurs priorités, choisissez celle qui vous empêche le plus d’avancer aujourd’hui.",
        "Vous pouvez expliquer votre priorité en une phrase, sans parler de solution juridique.",
        "ma-situation"
      ],
      [
        "2. Suivez les notions à votre rythme",
        "Lisez les sept erreurs et leurs exemples. Chaque chapitre annonce ce que vous allez comprendre, explique l’essentiel et indique un prochain pas utile. Gardez les fiches nécessaires à votre situation : aucun test ni devoir à rendre.",
        "Vous distinguez un fait connu, un souhait et une vérification.",
        "questions-notaire"
      ],
      [
        "3. Gardez vos questions pour le rendez-vous",
        "Reportez sur le plan en une page votre objectif et vos trois questions principales. Prenez rendez-vous dès que cela vous est utile, sans attendre la fin du parcours en cas de délai ou de difficulté. Vous gardez votre feuille pour préparer l’échange et noter la prochaine action.",
        "Votre plan indique ce que vous voulez clarifier et le prochain interlocuteur.",
        "plan-en-1-page"
      ]
    ]
  },
  {
    "sku": "bump",
    "titre": "Le Dossier : ne plus chercher quoi préparer",
    "resultat": "Un inventaire organisé, une demande de rendez-vous et une trace des réponses.",
    "seances": [
      [
        "1. Reprenez l’exemple avant les cases vides",
        "Lisez le dossier fictif de Claire et Marc. Regardez comment ils distinguent ce qu’ils savent, ce qui manque et leurs questions. Ouvrez ensuite votre inventaire : une ligne par bien ou compte utile, avec la source et la date. Ne copiez pas leur situation ; reprenez seulement leur façon de classer.",
        "Chaque ligne renvoie à un document ou porte clairement « à retrouver ».",
        "exemple-dossier"
      ],
      [
        "2. Préparez l’envoi, sans tout transmettre",
        "Complétez la fiche famille puis utilisez la liste des pièces comme aide-mémoire. Dans le modèle de demande de rendez-vous, remplacez les champs par votre objectif et vos coordonnées. Demandez au cabinet ce dont il a réellement besoin, le coût éventuel et son canal sécurisé. Relisez avant tout envoi.",
        "Votre message dit pourquoi vous souhaitez un rendez-vous et demande les modalités.",
        "mail-rendez-vous"
      ],
      [
        "3. Donnez une suite à l’échange",
        "Utilisez le compte rendu pendant ou après le rendez-vous. Pour chaque sujet : notez ce qui a été confirmé, ce qui reste à étudier et la personne chargée de la suite. Choisissez une date de suivi réaliste. Une hypothèse discutée reste distincte d’une décision validée.",
        "Toute démarche en attente a un responsable et une prochaine date de suivi.",
        "compte-rendu"
      ]
    ]
  },
  {
    "sku": "upsell1",
    "titre": "Le pack Préparation : relier votre famille, vos pièces et vos scénarios",
    "resultat": "Une préparation approfondie reliée à vos particularités familiales, avec des hypothèses et un suivi explicites.",
    "seances": [
      [
        "1. Choisissez votre fiche principale",
        "Partez de la situation mise en avant dans Mon dossier. Lisez son objectif, les pièces utiles et les questions. Si plusieurs fiches vous concernent, gardez-en une principale et ajoutez seulement les questions nouvelles des autres. Les familles complexes demandent un professionnel : la fiche sert à préparer son intervention.",
        "Vous savez quelle particularité familiale vous voulez faire examiner en premier.",
        ""
      ],
      [
        "2. Reliez les faits à leurs sources",
        "Rassemblez l’inventaire, la fiche famille et l’historique des donations. Pour chaque donnée utile, indiquez d’où elle vient et si elle est confirmée. Ne remplissez pas un montant inconnu par zéro. Une estimation doit rester identifiée comme telle ; une situation non couverte n’est pas un cas à forcer dans le simulateur.",
        "Vous séparez les données connues, les estimations et les inconnues.",
        "calendrier-15-ans"
      ],
      [
        "3. Utilisez l’atelier pour poser une meilleure question",
        "Ouvrez Mes outils, puis l’atelier de simulation. Lisez son périmètre et ses hypothèses avant de saisir. Pour une situation couverte, comparez deux scénarios en identifiant ce qui change et ce qui reste constant. Notez les éléments non couverts. L’écart pédagogique ne constitue ni un gain acquis ni un choix recommandé.",
        "Vous pouvez expliquer les hypothèses du résultat et sa limite.",
        ""
      ],
      [
        "4. Faites votre tableau de suivi",
        "Rassemblez les questions de famille, les documents attendus et les points soulevés par l’atelier dans le tableau de bord. Choisissez une prochaine démarche par sujet et qui s’en charge. Après le rendez-vous, complétez les réponses confirmées : c’est un outil de suivi, pas un dossier certifié.",
        "Votre dossier indique les prochaines actions sans mélanger calcul, conseil et acte.",
        "tableau-bord-familial"
      ]
    ]
  },
  {
    "sku": "upsell2",
    "titre": "L’assurance-vie : passer du contrat rangé au suivi des vérifications",
    "resultat": "Une fiche par contrat, les documents demandés et les questions restant à faire expliquer.",
    "seances": [
      [
        "1. Un contrat, une grille",
        "Ouvrez la grille de lecture. Notez la référence sur votre exemplaire personnel, puis classez les pièces : relevé, historique, clause, avenants. Pour chaque pièce, écrivez « reçue » avec sa date ou « demandée » avec la date de la demande. La présence d’un relevé ne prouve pas que vous avez la clause à jour.",
        "Vous savez quelle pièce précise manque, sans donner une note de qualité au contrat.",
        "grille-audit-assurance-vie"
      ],
      [
        "2. Comprenez ce que vous devez demander",
        "Lisez les logiques de désignation. Dans vos mots, distinguez les personnes appelées en priorité, celles prévues à défaut et une éventuelle répartition. Si un terme est obscur, transformez-le en question au lieu de réécrire une clause. Relevez séparément les interrogations sur les dates des versements.",
        "Vous avez trois questions fondées sur vos documents et vos objectifs.",
        "trois-clauses-beneficiaires"
      ],
      [
        "3. Demandez et classez les réponses",
        "Adaptez le courrier de demande d’informations, puis utilisez le canal sécurisé habituel de l’assureur. Conservez une copie, notez la date et classez la réponse avec le contrat correspondant. Si une modification est envisagée, faites vérifier sa cohérence avec le professionnel compétent avant de décider.",
        "Vous distinguez la demande envoyée, la réponse reçue et les points encore ouverts.",
        "lettre-modification-clause"
      ]
    ]
  }
];
export const guidesPossedes = (possede: ReadonlySet<ProductSku>) => GUIDES_UTILISATION.filter(g => possede.has(g.sku));
