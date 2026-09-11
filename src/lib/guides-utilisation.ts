import type { ProductSku } from "./config";
export type GuideUtilisation = { sku: "front"|"bump"|"upsell1"|"upsell2"; titre: string; resultat: string; seances: string[][] };
export const GUIDES_UTILISATION: GuideUtilisation[] = [
  {
    "sku": "front",
    "titre": "Les 7 erreurs : comprendre avant qu’il ne soit trop tard",
    "resultat": "Les trois dates, les quatre pièges invisibles et les actions concrètes à mener.",
    "seances": [
      [
        "1. Commencez par les trois dates",
        "Lisez le compteur des quinze ans, le 70e anniversaire et le 71e anniversaire. Pour chacune, repérez l’information qui manque dans votre dossier : date d’un don, historique des versements ou âge au prochain palier de nue-propriété.",
        "Vous savez quelle date mérite d’être vérifiée en premier.",
        ""
      ],
      [
        "2. Vérifiez les quatre erreurs invisibles",
        "Lisez ensuite la protection du couple, les dons sans trace, les règles des petits-enfants et la préparation du rendez-vous. Ne retenez pas tout : notez uniquement les erreurs qui correspondent réellement à votre famille.",
        "Vous distinguez ce qui est déjà confirmé de ce qui repose encore sur une supposition.",
        ""
      ],
      [
        "3. Passez des erreurs aux questions",
        "Pour chaque erreur qui vous concerne, reprenez la section « Comment l’appliquer à votre situation ». Retrouvez le premier document demandé et transformez l’incertitude principale en question à faire confirmer.",
        "Vous avez une liste courte de documents et de questions, sans montage choisi à l’aveugle.",
        ""
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
    "titre": "Mon plan adapté à ma situation : relier les hypothèses et les prochaines vérifications",
    "resultat": "Une estimation expliquée, des alertes personnelles et un dossier qui distingue vos intentions des actes restant à formaliser.",
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
        "Retrouvez le dossier correspondant dans Mon dossier. Lisez son périmètre et ses hypothèses avant de reprendre votre simulation. Pour une situation couverte, comparez deux scénarios en identifiant ce qui change et ce qui reste constant. Notez les éléments non couverts. L’écart pédagogique ne constitue ni un gain acquis ni un choix recommandé.",
        "Vous pouvez expliquer les hypothèses du résultat et sa limite.",
        ""
      ],
      [
        "4. Préparez ce qui ne se résume pas à un calcul",
        "Si le résultat signale votre capacité future de décider, ouvrez la fiche Protection future : elle ne désigne personne à votre place et ne crée aucun mandat. Si une maison concentre le patrimoine ou plusieurs volontés, ouvrez la fiche Maison et comparez les scénarios. Dans les deux cas, notez séparément votre souhait, la question à vérifier et l’acte finalement retenu.",
        "Vous arrivez chez le professionnel avec vos décisions personnelles déjà clarifiées, sans les prendre pour des droits acquis.",
        "protection-future"
      ],
      [
        "5. Faites votre tableau de suivi",
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
