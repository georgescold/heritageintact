/** Contenu écrit autonome. Repères généraux, cas fictifs, sans conseil individuel. */
export const LECONS = [
  {
    cle: "e0",
    numero: 0,
    titre: "Faire le point, sans rien décider",
    minutes: 10,
    resume:
      "Une fiche pour distinguer vos priorités, vos informations connues et ce qui reste à vérifier.",
    aFaire:
      "Remplissez votre fiche de situation. Une information manquante peut être notée « à vérifier ».",
    acquis: [
      "Une priorité formulée avec vos mots",
      "Les informations à retrouver avant de décider",
    ],
    videoIndex: -1,
    documents: ["ma-situation", "trois-poches"],
    blocs: [
      [
        "Votre premier résultat",
        "Vous n’avez pas besoin de connaître toutes les règles pour commencer. Notez d’abord ce que vous voulez protéger : le logement de votre conjoint, votre propre sécurité financière, l’équilibre entre les enfants ou une autre priorité. Préparer votre transmission ne vous engage à rien donner ni à signer quoi que ce soit.",
      ],
      [
        "Ce que vous savez, ce que vous ignorez",
        "Sur une feuille, écrivez votre situation familiale, les grandes catégories de biens et les documents retrouvés. Une estimation doit porter sa date. Ne devinez pas un régime matrimonial ou une clause : indiquez « à vérifier » et le document à demander. N’envoyez pas vos relevés ou les données de vos proches par email pour suivre cette étape.",
      ],
      [
        "Exemple fictif",
        "Jean-Pierre veut d’abord comprendre comment Françoise pourrait continuer à vivre dans leur maison. Il retrouve l’acte d’achat mais pas les dispositions de son mariage. Il inscrit donc une question : « Quels droits aurait mon épouse sur notre logement dans notre situation ? » Son premier progrès est une question précise, pas un montage déjà choisi.",
      ],
      [
        "Quand demander de l’aide tout de suite",
        "Une succession déjà ouverte, un délai fiscal ou judiciaire, une situation internationale ou un conflit important demandent un interlocuteur compétent. N’attendez pas d’avoir fini le parcours pour le contacter. Ce programme prépare les échanges ; il ne traite pas une urgence juridique.",
      ],
    ],
  },
  {
    cle: "e1",
    numero: 1,
    titre: "Erreur 1 - Attendre sans regarder vos besoins ni les dates",
    minutes: 10,
    resume:
      "Avant de penser à transmettre, clarifiez vos besoins et retrouvez les donations déjà effectuées.",
    aFaire: "Complétez la fiche de vos besoins. Notez séparément les donations passées à vérifier.",
    acquis: [
      "Préparer ne signifie pas donner",
      "Les donations antérieures demandent un historique par donateur et bénéficiaire",
    ],
    videoIndex: -1,
    documents: ["trois-poches", "calendrier-3-dates"],
    blocs: [
      [
        "Commencer par votre sécurité",
        "Le bon montant à transmettre ne se déduit pas du seul plafond fiscal. Vos dépenses, vos ressources, les travaux du logement et les besoins futurs comptent aussi. Faites la liste de vos dépenses courantes et des projets prévisibles. Une réserve de sécurité ne se résume pas à un nombre universel de mois.",
      ],
      [
        "Retrouver les dons antérieurs",
        "Pour chaque donation dont vous vous souvenez, notez qui a donné, à qui, quoi, quand, et quel justificatif existe. Une ligne par couple donateur-bénéficiaire évite de mélanger les situations. Si une déclaration ou une date est incertaine, demandez une vérification avant un nouveau don.",
      ],
      [
        "Le repère des quinze ans",
        "L’abattement ordinaire de donation entre parent et enfant est de 100 000 € par parent et par enfant, utilisable sur une période de quinze ans. Des donations antérieures peuvent en avoir consommé une partie. Ce repère ne signifie pas qu’il faut donner aujourd’hui ni que tout le compteur familial redémarre à une seule date.",
      ],
      [
        "Votre limite personnelle",
        "Écrivez ce que vous ne voulez pas compromettre : vos revenus, la possibilité de financer des soins, le logement ou une dépense importante. Apportez ces priorités au professionnel. Un avantage fiscal ne suffit pas à rendre une décision adaptée.",
      ],
    ],
  },
  {
    cle: "e2",
    numero: 2,
    titre: "Erreur 2 - Croire que tout revient automatiquement à l’autre",
    minutes: 12,
    resume: "Distinguer la propriété actuelle, les droits des proches et la fiscalité.",
    aFaire:
      "Rédigez une question sur les droits de votre conjoint ou des personnes que vous souhaitez protéger.",
    acquis: [
      "Exonération fiscale et droit d’hériter sont deux sujets distincts",
      "Votre situation familiale doit être examinée avant tout calcul",
    ],
    videoIndex: -1,
    documents: ["ma-situation", "lexique"],
    blocs: [
      [
        "Trois questions différentes",
        "Qui possède les biens aujourd’hui ? Qui pourrait recevoir quoi ? Quels droits seraient éventuellement dus ? Il faut les traiter dans cet ordre. Le total du patrimoine du couple n’est pas automatiquement le montant d’une succession.",
      ],
      [
        "Le conjoint",
        "L’exonération fiscale du conjoint survivant ne signifie pas qu’il reçoit toujours tout en pleine propriété. Ses droits dépendent notamment de la famille et des dispositions existantes. Par exemple, dans le cas ordinaire d’enfants tous communs au couple, il peut avoir une option entre l’usufruit de la totalité de la succession et un quart en pleine propriété. Cet exemple ne détermine pas votre cas.",
      ],
      [
        "PACS et concubinage",
        "Une exonération de droits n’attribue pas, à elle seule, la qualité d’héritier. Les couples non mariés doivent vérifier les dispositions existantes et les droits de chacun. Ne recopiez pas le testament ou la solution d’un autre couple.",
      ],
      [
        "Les documents utiles",
        "L’acte d’achat, les dispositions matrimoniales, les donations et les testaments connus aident à clarifier la situation. Un document introuvable devient une demande à faire, pas un échec. Le professionnel vérifiera les droits et les choix possibles avant de chiffrer une transmission.",
      ],
    ],
  },
  {
    cle: "e3",
    numero: 3,
    titre: "Erreur 3 - Croire qu’un contrat signé n’a plus besoin d’être vérifié",
    minutes: 10,
    resume: "Savoir ce qui est écrit dans vos contrats, sans modifier une clause à l’aveugle.",
    aFaire:
      "Retrouvez le dernier relevé et demandez une copie de la clause bénéficiaire actuellement en vigueur.",
    siNonConcerne:
      "Sans assurance-vie, passez à la suite. Vous n’avez aucun contrat à ouvrir pour suivre le parcours.",
    acquis: [
      "Le bénéficiaire d’un contrat n’est pas nécessairement un enfant",
      "Une information absente se demande à l’assureur",
    ],
    videoIndex: -1,
    documents: ["lexique"],
    blocs: [
      [
        "Un contrat à retrouver",
        "Identifiez l’assureur, la référence du contrat et les documents disponibles. Un relevé annuel n’indique pas toujours toutes les informations nécessaires. Pour la clause bénéficiaire, demandez la version effectivement enregistrée.",
      ],
      [
        "Quatre repères",
        "Quel est le contrat ? Qui sont les bénéficiaires désignés et selon quelle répartition ? Quel est l’historique des versements ? Quelles informations l’assureur peut-il confirmer par écrit ? Les règles fiscales varient notamment selon les dates du contrat et des versements, l’âge de l’assuré lors de ceux-ci et la situation du bénéficiaire.",
      ],
      [
        "Une demande, pas une modification à l’aveugle",
        "Demandez la clause bénéficiaire en vigueur, ses avenants et l’historique des versements par le canal habituel de votre assureur. Conservez sa réponse ; si vous envisagez un changement, faites d’abord examiner ses conséquences. Une grille remplie n’est pas un audit juridique.",
      ],
    ],
  },
  {
    cle: "e4",
    numero: 4,
    titre: "Erreur 4 - Confondre maison payée et transmission préparée",
    minutes: 10,
    resume:
      "Comprendre ce que les droits sur un logement permettent, avant d’envisager une donation.",
    aFaire:
      "Retrouvez l’acte de propriété et notez ce que vous voulez préserver concernant le logement.",
    acquis: [
      "Donner un droit sur un bien mérite une décision éclairée",
      "Un pourcentage fiscal ne décrit pas toute la conséquence d’une donation",
    ],
    videoIndex: -1,
    documents: ["lexique", "ma-situation"],
    blocs: [
      [
        "Partir de l’acte",
        "Le logement peut être détenu seul, à plusieurs, via une société ou avec des droits déjà partagés. L’acte et les dispositions existantes comptent davantage qu’un souvenir approximatif. Notez les titulaires et ce qui doit être confirmé.",
      ],
      [
        "Les mots à comprendre",
        "L’usufruit permet notamment d’utiliser le bien et d’en percevoir les revenus, selon les droits et obligations applicables. La nue-propriété est un autre droit sur le bien. La pleine propriété les réunit. Les répartir peut changer les possibilités de vente, les charges et les décisions futures.",
      ],
      [
        "Le repère fiscal",
        "Dans le barème fiscal de l’usufruit viager, la nue-propriété est notamment évaluée à 60 % entre 61 et 70 ans, puis à 70 % entre 71 et 80 ans. Cela ne veut pas dire que toute donation avant 71 ans porte automatiquement sur 60 %, ni qu’il devient impossible de donner après cet âge.",
      ],
      [
        "Avant de choisir",
        "Demandez qui pourrait habiter, louer, vendre, décider des travaux et supporter les dépenses. Demandez aussi ce qui se passerait en cas de décès ou de désaccord. Ne choisissez pas une donation uniquement pour changer une base de calcul.",
      ],
    ],
  },
  {
    cle: "e5",
    numero: 5,
    titre: "Erreur 5 - Oublier l’histoire des dons déjà faits",
    minutes: 10,
    resume: "Retrouver une histoire vérifiable, sans confondre tous les transferts familiaux.",
    aFaire:
      "Créez une ligne d’historique pour chaque donation connue et marquez les justificatifs manquants.",
    acquis: [
      "Un historique clair aide la vérification",
      "Vous pouvez avancer même si certains justificatifs manquent",
    ],
    videoIndex: -1,
    documents: ["calendrier-3-dates"],
    blocs: [
      [
        "Ce qu’il faut relever",
        "Donateur, bénéficiaire, date, nature du bien, montant ou valeur, justificatif et éventuelle déclaration. Si plusieurs personnes ont donné, séparez les lignes. Conservez les documents originaux sans les modifier.",
      ],
      [
        "Ne pas qualifier seul un ancien transfert",
        "Une aide, un présent, un prêt ou une donation ne sont pas interchangeables. Si vous ne savez pas comment un transfert a été traité, notez les faits et demandez une vérification. Ne reconstituez pas une déclaration en inventant une date.",
      ],
      [
        "Pourquoi le calcul peut changer",
        "Les donations antérieures peuvent avoir des conséquences fiscales et civiles différentes. Le délai fiscal de quinze ans n’efface pas nécessairement tous les effets d’une donation dans les rapports familiaux. C’est une raison de retrouver les pièces avant de simuler.",
      ],
      [
        "Une bonne question",
        "« Voici les transferts que j’ai retrouvés. Comment ont-ils été traités et quelles conséquences faut-il prendre en compte avant une nouvelle décision ? » Vous apportez des faits, le professionnel vérifie leur qualification.",
      ],
    ],
  },
  {
    cle: "e6",
    numero: 6,
    titre: "Erreur 6 - Confondre bonnes intentions et équilibre familial",
    minutes: 10,
    resume: "Exprimer vos souhaits sans annoncer trop tôt une répartition ou un résultat fiscal.",
    aFaire:
      "Écrivez ce que vous voulez expliquer à vos proches et une question sur l’équilibre entre eux.",
    acquis: [
      "Une intention familiale n’est pas encore un acte",
      "Il est possible d’ouvrir la conversation sans annoncer des montants",
    ],
    videoIndex: -1,
    documents: ["lettre-aux-enfants"],
    blocs: [
      [
        "Partir de votre intention",
        "Voulez-vous aider quelqu’un maintenant, préserver une équité, expliquer une différence de traitement ou simplement éviter des informations dispersées ? Écrivez une intention avant de parler de montants.",
      ],
      [
        "Égalité et équité",
        "Des situations différentes peuvent donner envie d’aider différemment. Les conséquences juridiques et familiales doivent néanmoins être examinées. Une bonne intention ne permet pas d’ignorer les droits des héritiers ou les effets d’une donation passée.",
      ],
      [
        "Petits-enfants",
        "Les dispositifs de donation aux petits-enfants ont leurs propres conditions. Un abattement applicable à une donation ne se transpose pas automatiquement à une succession. Demandez quel dispositif correspond réellement à l’opération envisagée.",
      ],
      [
        "Ouvrir le sujet",
        "Vous pouvez dire : « Je mets mes informations en ordre pour vous éviter de chercher plus tard. Je ne vous demande pas de décider aujourd’hui. J’aimerais commencer par vous expliquer où trouver les documents utiles. » Choisissez le moment et les informations que vous souhaitez partager.",
      ],
    ],
  },
  {
    cle: "e7",
    numero: 7,
    titre: "Erreur 7 - Arriver sans questions, repartir sans suivi",
    minutes: 15,
    resume: "Transformer vos notes en questions précises, puis conserver les réponses.",
    aFaire: "Choisissez trois questions prioritaires et préparez votre demande de rendez-vous.",
    acquis: [
      "Un rendez-vous peut être préparé sans dossier parfait",
      "Une réponse et une prochaine démarche peuvent être notées après l’échange",
    ],
    videoIndex: -1,
    documents: ["plan-en-1-page", "regle-mise-a-jour"],
    blocs: [
      [
        "Votre minimum utile",
        "Une fiche de situation, vos priorités, les pièces retrouvées et trois questions suffisent pour commencer à préparer un échange. Demandez au cabinet quels documents apporter et comment les transmettre de façon sûre.",
      ],
      [
        "Trois questions de départ",
        "« Quels sont les droits de mes proches dans notre situation ? » « Quelles informations vous manquent pour vérifier ? » « Quelles conséquences et quels coûts devons-nous comprendre avant toute décision ? » Ajoutez ce qui est spécifique à votre famille.",
      ],
      [
        "Demander le cadre",
        "Précisez l’objet du rendez-vous et demandez ses modalités, son coût éventuel et les documents utiles. Ce programme ne garantit pas un rendez-vous gratuit ni une disponibilité immédiate du cabinet.",
      ],
      [
        "Après le rendez-vous",
        "Notez les réponses, les documents encore attendus, qui s’occupe de chaque démarche et la prochaine date de suivi. Si une réponse reste floue, reformulez-la avant de signer. Une naissance, une séparation, un décès, un déménagement ou un changement important justifie de réexaminer le dossier.",
      ],
    ],
  },
];
