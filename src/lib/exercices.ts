/** Ateliers pédagogiques : aucun calcul ni diagnostic personnel. */
export type Exercice = { cle: string; titre: string; resultat: string; gestes: string[]; exemple: string; question: string; correction: string; siBloque: string };
export const EXERCICES: Exercice[] = [
  {
    "cle": "e0",
    "titre": "Votre première fiche utilisable",
    "resultat": "Une priorité, un fait documenté et une question : vous avez de quoi ouvrir la discussion.",
    "gestes": [
      "Écrivez une phrase qui commence par « Je souhaite préserver… ». Choisissez un seul sujet pour cette séance, même si vous en avez plusieurs.",
      "Dans « Je sais », notez seulement ce que vous pouvez relier à un document. Indiquez son nom et sa date ; gardez le document chez vous.",
      "Dans « À vérifier », formulez une question et notez auprès de qui chercher la réponse. Vous pouvez arrêter cette séance même si une pièce manque."
    ],
    "exemple": "Claire écrit : « Je souhaite comprendre comment Marc pourrait rester dans notre maison. » Elle a retrouvé l’acte d’achat. Elle n’a pas retrouvé les dispositions entre époux. Sa question devient : « Au vu de nos actes, quels droits chacun aurait-il sur le logement au premier décès ? »",
    "question": "Ma fiche dit-elle ce que je veux protéger, sur quoi je m’appuie et quelle réponse me manque ?",
    "correction": "Oui si ces trois éléments sont distincts. « Ma succession est réglée » n’est pas une conclusion de cet exercice. La fiche prépare une vérification, elle ne la remplace pas.",
    "siBloque": "Si vous ne retrouvez rien, commencez par votre priorité et le nom du document à demander. Une feuille ordinaire suffit."
  },
  {
    "cle": "e1",
    "titre": "Séparer vos besoins de votre envie d’aider",
    "resultat": "Une liste de besoins à préserver, indépendante d’un plafond fiscal.",
    "gestes": [
      "Faites trois colonnes : dépenses courantes, projets connus, imprévus à discuter. Inscrivez vos besoins, pas un montant que vous pensez devoir transmettre.",
      "En face de chaque projet, indiquez sa date envisagée et si son coût est connu ou reste à estimer. Distinguez une dépense ponctuelle d’une dépense mensuelle.",
      "Rédigez votre limite de départ : « Avant toute transmission, je veux vérifier que… ». Apportez-la au rendez-vous avec la liste des ressources et des engagements."
    ],
    "exemple": "Marc envisage d’aider sa fille. Il prévoit aussi des travaux de toiture, dont il n’a pas encore le devis. Il inscrit « obtenir le devis » avant de chercher un montant à donner. Il conserve séparément la trace d’une aide ancienne à son fils.",
    "question": "Un abattement disponible signifie-t-il que je peux transmettre ce montant sans difficulté pour moi ?",
    "correction": "Non. Un repère fiscal ne mesure ni vos besoins ni vos ressources futures. Le bon résultat ici est la liste des besoins et des informations à examiner, pas un montant automatiquement disponible.",
    "siBloque": "N’inventez pas un budget pour terminer. Marquez « coût à estimer », puis choisissez la première information à obtenir."
  },
  {
    "cle": "e2",
    "titre": "Dessiner votre famille et vos documents",
    "resultat": "Un schéma factuel pour ne plus mélanger liens familiaux et propriété.",
    "gestes": [
      "Dessinez les personnes utiles à la discussion et notez les liens : conjoint, partenaire, enfant de l’un ou de l’autre. N’attribuez pas de parts successorales vous-même.",
      "Pour chaque bien principal, notez le document qui pourrait établir la propriété. Si le nom ou la quote-part est incertain, écrivez-le comme une question.",
      "Choisissez une personne à protéger et formulez une question liée à un bien précis. Gardez séparés votre souhait et les droits à faire établir."
    ],
    "exemple": "Claire note « logement : acte d’achat retrouvé, quotes-parts à relire ». Sur une autre ligne : « souhait : que Marc puisse continuer à y vivre ». Elle ne transforme pas ce souhait en affirmation « Marc recevra toute la maison ».",
    "question": "Puis-je remplacer les documents par « nous avons toujours tout partagé » ?",
    "correction": "Non. Cette phrase exprime une pratique ou une intention. La vérification part des actes, de la situation familiale et des dispositions existantes.",
    "siBloque": "Si plusieurs histoires familiales se croisent, notez les faits sans chercher à résoudre les droits. Contactez le professionnel si la situation est complexe."
  },
  {
    "cle": "e3",
    "titre": "Préparer une demande sur un contrat",
    "resultat": "Le contrat identifié et les pièces manquantes nommées.",
    "gestes": [
      "Choisissez un seul contrat. Relevez sur le dernier document l’assureur, la référence et la date du relevé. Ne transmettez pas ces références dans le support de la formation.",
      "Cherchez la clause actuellement enregistrée et l’historique des versements. Une brochure générale ou un souvenir de rendez-vous ne remplit pas cette case.",
      "Par votre canal habituel, demandez : « Pouvez-vous me transmettre la clause bénéficiaire actuellement enregistrée, ses avenants et l’historique des versements de ce contrat ? Merci de m’indiquer la procédure sécurisée. » Adaptez la demande à ce qui manque."
    ],
    "exemple": "Marc possède un relevé annuel, mais pas la clause enregistrée. Sa fiche porte « relevé reçu / clause à demander », et non « clause incorrecte ». Il note la date de sa demande pour pouvoir la suivre.",
    "question": "Un document manquant signifie-t-il que le contrat est mauvais ?",
    "correction": "Non. Il indique une information à obtenir. Le fait d’avoir tous les documents ne prouve pas non plus que le contrat répond à vos objectifs.",
    "siBloque": "Sans contrat, cette action n’est pas nécessaire. Notez « non concerné » et poursuivez, sans ouvrir un produit financier pour terminer le parcours."
  },
  {
    "cle": "e4",
    "titre": "Transformer une inquiétude sur la maison en questions",
    "resultat": "Vos usages à préserver et les conséquences à faire expliquer.",
    "gestes": [
      "Listez ce que vous voulez pouvoir faire : habiter, louer si vous déménagez, financer des travaux, envisager une vente. Gardez les usages qui comptent réellement pour vous.",
      "Pour chaque usage, écrivez une question : « Si l’on envisage cette opération, qui pourra… ? Qui devra donner son accord ? Qui supportera la dépense ? »",
      "Rassemblez les références de l’acte et des dispositions connues. Présentez d’abord vos besoins ; demandez ensuite quelles options permettraient de les prendre en compte."
    ],
    "exemple": "Claire se projette dans un logement plus petit. Sa question n’est pas seulement « quel serait l’impôt ? », mais « si nous voulons vendre plus tard, quels accords, coûts et conséquences faut-il prévoir ? »",
    "question": "Conserver l’usage du logement revient-il à garder toute la liberté d’un plein propriétaire ?",
    "correction": "Il ne faut pas le supposer. Les droits, obligations et accords nécessaires dépendent de l’opération et des actes. La liste d’usages sert précisément à demander ces explications.",
    "siBloque": "Si vous n’avez pas de bien immobilier, passez à la suite. Si la propriété est incertaine, commencez par retrouver l’acte."
  },
  {
    "cle": "e5",
    "titre": "Reconstituer un historique sans inventer",
    "resultat": "Une ligne de faits par transfert, avec son justificatif ou sa question.",
    "gestes": [
      "Pour chaque transfert connu, notez qui a versé ou donné, à qui, la date certaine ou approximative, la nature et le montant connu. Ne regroupez pas deux donateurs sur une même ligne.",
      "Ajoutez le justificatif retrouvé : acte, déclaration, virement, correspondance. Une trace de virement décrit un mouvement ; elle ne suffit pas à en établir toute la qualification.",
      "Marquez ce que vous ignorez et préparez la question : « Comment ce transfert a-t-il été traité et que faut-il en tenir compte aujourd’hui ? »"
    ],
    "exemple": "Marc se rappelle une aide à sa fille au printemps 2018. Il a retrouvé un virement mais pas de déclaration. Il note « date exacte à relever sur le justificatif ; traitement à vérifier », sans décider seul qu’il s’agit d’un prêt ou d’une donation.",
    "question": "Faut-il inventer une date précise pour que le tableau soit complet ?",
    "correction": "Non. Une incertitude visible est plus utile qu’une précision fictive. Conservez les pièces telles qu’elles sont et demandez la vérification adaptée.",
    "siBloque": "Si vous ne savez pas si une aide doit figurer, notez les faits dans une liste de questions. Ne faites aucune régularisation uniquement pour remplir l’exercice."
  },
  {
    "cle": "e6",
    "titre": "Ouvrir une conversation sans annoncer un partage",
    "resultat": "Une invitation courte qui exprime votre intention.",
    "gestes": [
      "Écrivez pourquoi vous souhaitez en parler : faciliter la recherche de documents, expliquer une priorité ou écouter une inquiétude. Évitez de commencer par des sommes.",
      "Choisissez ce que vous êtes prêt à partager aujourd’hui et ce que vous préférez d’abord vérifier. Vous n’avez pas à transmettre vos relevés à toute la famille.",
      "Préparez une invitation simple et laissez une possibilité de choisir un autre moment. La réussite de l’exercice est une intention claire, pas l’accord immédiat de tous."
    ],
    "exemple": "Claire prépare : « Nous mettons nos informations en ordre. Nous aimerions vous expliquer où trouver les documents utiles et entendre vos questions. Ce n’est pas une annonce de partage. Quel moment vous conviendrait ? »",
    "question": "Si un enfant ne veut pas en parler maintenant, ai-je raté l’étape ?",
    "correction": "Non. Vous pouvez continuer votre préparation et proposer un autre moment. En cas de conflit, une discussion improvisée ne remplace pas un accompagnement adapté.",
    "siBloque": "Vous pouvez garder votre message comme brouillon. Ne forcez pas une conversation pour cocher une étape."
  },
  {
    "cle": "e7",
    "titre": "Partir du rendez-vous avec une suite claire",
    "resultat": "Trois questions prioritaires et une prochaine démarche attribuée.",
    "gestes": [
      "Sur votre plan en une page, rassemblez votre objectif, trois questions et les pièces retrouvées. Demandez au cabinet les modalités, le coût éventuel et les documents à apporter.",
      "Pendant l’échange, distinguez : réponse confirmée, hypothèse à étudier, document attendu. Reformulez ce que vous ne comprenez pas plutôt que de considérer toute piste comme décidée.",
      "Après l’échange, attribuez une personne et une date de suivi à chaque action. Rangez séparément vos notes, les réponses du professionnel et les actes définitifs."
    ],
    "exemple": "Après son rendez-vous, Marc note : « Document attendu : copie d’un acte. Action : le demander au cabinet. Responsable : Marc. Suivi : vendredi prochain. » Il ne note pas « transmission terminée » parce qu’une option a été évoquée.",
    "question": "Un rendez-vous est-il inutile s’il se termine par une demande de documents complémentaires ?",
    "correction": "Non. Vous savez désormais ce qui manque et qui doit le retrouver. La prochaine étape peut être une recherche de pièce ; elle ne doit pas nécessairement être une signature.",
    "siBloque": "Ne reportez pas un rendez-vous urgent pour avoir un dossier parfait. Prenez vos questions et demandez quelles pièces compléter ensuite."
  }
];
