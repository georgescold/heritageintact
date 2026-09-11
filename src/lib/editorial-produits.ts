import type { ProductSku } from "./config";
import type { Reponses } from "./qualification";

export type EntreeLexique = {
 terme: string;
 definition: string;
 impact: string;
 verifier: string;
};

export type ThemeLexique = {
 titre: string;
 question: string;
 entrees: readonly EntreeLexique[];
};

/** Les notions à reconnaître avant les sept erreurs. Les formulations restent générales et renvoient aux pièces et au professionnel. */
export const LEXIQUE_SUCCESSION: readonly ThemeLexique[] = [
 {
  titre: "Qui possède et qui reçoit ?",
  question: "Une propriété mal identifiée au départ peut rendre tous les calculs suivants inutiles. Séparez ce que vous possédez aujourd’hui de ce qui sera réellement transmis demain.",
  entrees: [
   {
    terme: "Patrimoine / succession",
    definition: "Votre patrimoine réunit vos biens, droits et dettes de votre vivant. La succession est ce qui devra être identifié et transmis à votre décès, après avoir tenu compte notamment de la propriété des biens, du régime du couple et des dettes.",
    impact: "Dire « notre maison vaut 480 000 € » ne signifie pas que 480 000 € entreront dans la succession d’un seul membre du couple. Si ce point est faux, les parts, les droits estimés et la protection imaginée pour le conjoint peuvent l’être aussi.",
    verifier: "Retrouvez le titre de propriété, le contrat de mariage éventuel et les derniers relevés des dettes encore dues."
   },
   {
    terme: "Héritier / légataire / bénéficiaire",
    definition: "L’héritier reçoit selon la loi ou un testament. Le légataire reçoit ce qu’un testament lui attribue. Le bénéficiaire d’une assurance-vie reçoit selon la clause du contrat : ce n’est pas automatiquement la même personne.",
    impact: "Nommer quelqu’un oralement ou dans une note personnelle ne lui donne pas le même statut dans chaque dispositif. Le jour où la famille découvre l’écart, la personne qui voulait expliquer son choix n’est souvent plus là pour le corriger.",
    verifier: "Distinguez trois preuves : la situation familiale, le testament éventuel et la clause bénéficiaire réellement enregistrée."
   },
   {
    terme: "Réserve héréditaire / quotité disponible",
    definition: "La réserve est la part que la loi protège pour certains héritiers, notamment les enfants. La quotité disponible est la part restante dont une personne peut disposer plus librement, par donation ou testament.",
    impact: "Un testament exprime une volonté, mais il ne permet pas toujours d’attribuer librement la totalité du patrimoine. Une rédaction incompatible avec les parts protégées peut déplacer le problème vers les héritiers et nourrir une contestation au pire moment.",
    verifier: "Notez le nombre d’enfants et faites examiner ensemble les donations déjà consenties et le testament."
   }
  ]
 },
 {
  titre: "Donner ne veut pas toujours dire la même chose",
  question: "Le virement qui paraissait anodin peut devenir des années plus tard la somme que chacun raconte différemment. Un cadeau, un don manuel et une donation n’ont ni les mêmes preuves ni les mêmes conséquences.",
  entrees: [
   {
    terme: "Donation / don manuel / présent d’usage",
    definition: "Une donation transmet un bien du vivant du donateur. Un don manuel porte sur un bien remis directement, comme une somme d’argent. Un présent d’usage est un cadeau lié à une occasion et raisonnable au regard des revenus et du patrimoine de celui qui l’offre.",
    impact: "Appeler une somme « cadeau » ne suffit pas à en faire juridiquement un présent d’usage. Sans date, déclaration ou preuve, une aide généreuse peut devenir une question fiscale et une source de soupçon entre ceux qui restent.",
    verifier: "Conservez la date, le montant, l’occasion, le bénéficiaire, le mode de remise et la déclaration lorsqu’elle est requise."
   },
   {
    terme: "Abattement / exonération",
    definition: "Un abattement retire une somme de la base taxable avant le calcul des droits. Une exonération écarte tout ou partie de l’impôt lorsque ses conditions précises sont remplies.",
    impact: "« Aucun droit à payer aujourd’hui » ne signifie ni « opération sans déclaration » ni « abattement intact demain ». Cette confusion peut faire promettre à un autre enfant une possibilité qui a déjà été partiellement consommée.",
    verifier: "Demandez quel dispositif est utilisé, son montant, ses conditions et la date à laquelle il pourra éventuellement être disponible de nouveau."
   },
   {
    terme: "Délai fiscal de quinze ans",
    definition: "Pour calculer les droits d’une nouvelle donation, l’administration tient compte de donations antérieures, notamment pour l’abattement et les tranches déjà utilisés, lorsqu’elles ont moins de quinze ans.",
    impact: "Quinze ans ne fait pas disparaître magiquement une donation de l’histoire familiale. Croire le dossier effacé peut conduire à cacher involontairement au professionnel le fait qui change l’analyse ou ravive un ancien déséquilibre.",
    verifier: "Dressez la chronologie de toutes les aides et donations, même anciennes, sans décider vous-même lesquelles peuvent être écartées."
   }
  ]
 },
 {
  titre: "Comprendre le calcul sans confondre les étages",
  question: "Un pourcentage appliqué au mauvais montant peut fabriquer une fausse économie ou une fausse sécurité. Valeur, part reçue, abattement et barème sont quatre étages différents.",
  entrees: [
   {
    terme: "Part transmise / part taxable / droits",
    definition: "La part transmise est la valeur attribuée à une personne. La part taxable est ce qui reste après les abattements applicables. Les droits sont l’impôt calculé ensuite avec le barème correspondant.",
    impact: "Appliquer un pourcentage directement à la maison peut produire un chiffre sans rapport avec la situation réelle. Décider à partir de ce montant, c’est risquer d’engager un acte ou de retarder une démarche pour une économie qui n’existe pas.",
    verifier: "Écrivez le calcul en ligne : valeur possédée, part de chacun, abattement disponible, base taxable, puis barème."
   },
   {
    terme: "Pleine propriété / usufruit / nue-propriété",
    definition: "La pleine propriété réunit l’usage, les revenus et le droit de disposer du bien. L’usufruit permet de l’utiliser ou d’en percevoir les revenus. La nue-propriété conserve le droit sur le bien sans sa jouissance immédiate.",
    impact: "Transmettre la nue-propriété n’équivaut ni à donner toute la maison ni à la quitter. Mais ignorer qui décide, qui paie et qui peut vendre peut transformer une solution rassurante sur le papier en blocage familial concret.",
    verifier: "Faites préciser qui pourra habiter, louer, vendre ou financer les grosses réparations, et dans quelles conditions."
   },
   {
    terme: "Indivision / quote-part",
    definition: "Il y a indivision lorsque plusieurs personnes ont des droits de même nature sur un même bien. La quote-part indique les droits de chacun, sans découper physiquement la maison ou le compte.",
    impact: "Recevoir « la moitié d’une maison » ne donne pas une moitié de chaque pièce. Une vente, des travaux ou l’occupation du logement peuvent alors devenir le conflit que personne n’avait anticipé.",
    verifier: "Identifiez les quote-parts et demandez quelles décisions seront individuelles, prises à la majorité ou à l’unanimité."
   }
  ]
 },
 {
  titre: "Les mots qui changent une assurance-vie",
  question: "Le capital du relevé rassure parce qu’il est visible. Pourtant, un nom ancien, une clause imprécise ou des versements mal datés peuvent produire un résultat très différent de celui raconté à la famille.",
  entrees: [
   {
    terme: "Souscripteur / assuré / bénéficiaire",
    definition: "Le souscripteur conclut le contrat. L’assuré est la personne dont le décès déclenche le versement. Le bénéficiaire est désigné pour recevoir le capital selon la clause en vigueur.",
    impact: "Ces rôles sont parfois tenus par la même personne, parfois non. Les confondre peut laisser dormir une anomalie derrière un relevé rassurant jusqu’au moment où le contrat doit réellement produire ses effets.",
    verifier: "Relevez les trois qualités telles qu’elles figurent dans le contrat, pas seulement les noms visibles sur le relevé annuel."
   },
   {
    terme: "Date d’ouverture / date et âge au versement",
    definition: "La date d’ouverture marque le début du contrat. Pour la fiscalité au décès, la date de chaque versement et l’âge de l’assuré au moment de ce versement peuvent également être déterminants.",
    impact: "Un contrat ouvert avant 70 ans peut contenir des sommes versées après 70 ans. Se fier uniquement à son ancienneté peut donc créer une attente fiscale qui s’effondrera lorsque l’historique sera enfin examiné.",
    verifier: "Demandez l’historique daté des versements et séparez ceux effectués avant et après le 70e anniversaire."
   },
   {
    terme: "Clause bénéficiaire / intention",
    definition: "La clause bénéficiaire est le texte enregistré qui désigne la ou les personnes appelées à recevoir le capital. Votre intention est ce que vous souhaitez réellement aujourd’hui.",
    impact: "Une intention expliquée à la famille ne corrige pas une clause ancienne ou devenue incohérente. Après le décès, il est trop tard pour demander au souscripteur ce qu’il voulait vraiment ou lui faire signer une correction.",
    verifier: "Obtenez la clause en vigueur par écrit, puis faites examiner ses effets avant toute modification."
   }
  ]
 }
] as const;

/** Texte commun aux guides PDF et à l'espace. Aucune promesse de résultat patrimonial. */
export const EDITORIAL_PRODUITS = {
 front: {
  ouverture: "Le jour où vos enfants chercheront les réponses, vous ne pourrez plus les leur donner.",
  histoire: [
   "Imaginez vos enfants assis devant le notaire. Ils viennent de perdre un parent et découvrent, au même moment, une facture, une date dépassée ou un document que personne ne retrouve. Ils ne se demanderont pas si vous les aimiez. Ils se demanderont simplement ce que vous aviez prévu et pourquoi personne ne leur en a parlé.",
   "Vous avez travaillé, payé la maison et voulu rester libre jusqu’au bout. Votre rêve n’est pas de devenir fiscaliste : c’est de garder votre sécurité aujourd’hui et de transmettre demain sans laisser une énigme à votre famille. Ce guide existe pour vous montrer les sept erreurs à connaître avant qu’une décision utile ne devienne plus coûteuse, plus complexe ou impossible à reprendre."
  ],
  apprendre: ["Identifier les trois dates qui avancent même lorsque vous ne faites rien : quinze ans, 70 ans et 71 ans.", "Reconnaître quatre erreurs familiales ou documentaires qui peuvent fausser un calcul ou retarder une décision.", "Savoir exactement quels documents retrouver et quelles questions poser pour votre propre situation."],
  adresse: ["Vous avez généralement 60 ans ou plus et vous voulez protéger votre autonomie autant que vos proches.", "Vous possédez un logement, de l’épargne ou une assurance-vie et vous ne savez pas si tout est réellement préparé.", "Vous êtes parent ou grand-parent, marié, pacsé, seul, ou votre famille comprend plusieurs unions.", "Vous avez déjà aidé un proche, ou vous hésitez à le faire, et vous voulez comprendre avant de décider."],
  essentiel: "Commencez par les trois dates promises dans la présentation, puis lisez les quatre erreurs qui ne se voient pas sur un relevé bancaire. Chaque chapitre va droit au but : ce que les gens ignorent, ce qu’il faut comprendre, un cas concret et les actions à mener.",
  limite: "Comprendre les règles ne suffit pas à établir les droits de votre famille. Ce guide prépare vos premières questions ; les pièces, les choix et leurs conséquences restent à examiner avec le professionnel.",
  acquis: "Vous savez désormais quoi regarder et quoi demander. Votre inquiétude a un point de départ concret.",
  sortieLabel: "APRÈS LES 7 ERREURS",
  sortieTitre: "Vous connaissez maintenant les pièges. Savez-vous lesquels pèsent réellement sur votre situation ?",
  suiteLabel: "Si vous vous arrêtez ici, il reste une décision dangereuse : choisir par quoi commencer au hasard.",
  suite: "Une règle comprise n’indique pas automatiquement votre priorité. Sans relier votre âge, votre famille, vos biens, vos donations et vos contrats, vous pouvez surveiller la mauvaise date ou préparer une démarche secondaire pendant qu’un point plus important continue d’avancer.",
  suiteResultat: "Mon plan adapté à ma situation est généré à partir de vos réponses : il explique votre estimation, fait ressortir vos points de vigilance et ordonne précisément les vérifications à préparer.",
  suiteCta: "Obtenir mon plan adapté"
 },
 bump: {
  ouverture: "Le rendez-vous peut durer une heure. Le regret d’avoir oublié la seule information décisive peut durer des années.",
  histoire: [
   "Madeleine arrive avec une chemise gonflée de papiers et trois questions retenues de mémoire. À la troisième minute, le rendez-vous s’arrête sur ce qui manque : la date exacte d’une donation, le dernier avenant du contrat et l’acte qui précise la propriété de la maison. Le sujet qu’elle voulait absolument régler n’est même pas abordé. Elle repart avec une nouvelle liste et un second rendez-vous à organiser. Selon l’étude et la nature du travail demandé, ce nouvel échange, les recherches ou une consultation écrite peuvent aussi entraîner des honoraires supplémentaires.",
   "Le problème n’est ni son sérieux ni la compétence du notaire. Un professionnel ne peut pas analyser le fait qu’on oublie de lui signaler. Le Dossier Notaire transforme la pile et les souvenirs en inventaire, questions et compte rendu : vous voyez ce qui manque avant le rendez-vous, quand il est encore temps de le retrouver."
  ],
  apprendreTitre: "Ce que vous refuserez désormais de laisser au hasard",
  apprendre: ["Voir avant le rendez-vous la pièce absente qui aurait pu bloquer l’échange.", "Présenter votre famille, vos biens et les aides passées sans laisser votre mémoire décider de ce qui sera examiné.", "Conserver les réponses, le responsable et la prochaine date pour éviter que le rendez-vous disparaisse dans des notes inutilisables."],
  adresseTitre: "Ce dossier est fait pour vous si le rendez-vous vous inquiète déjà",
  adresse: ["Vos documents sont répartis entre plusieurs tiroirs, classeurs ou membres de la famille.", "Vous avez peur de payer un rendez-vous sans réussir à poser toutes vos questions.", "Vous ne voulez plus terminer un échange important avec des notes illisibles et aucune prochaine étape."],
  essentielTitre: "Votre raccourci : ne préparez pas tout, préparez ce qui sera demandé",
  essentiel: "Commencez par l’exemple de Claire et Marc, une famille fictive. Reprenez leur logique de classement, jamais leurs réponses. Écrivez « à retrouver » plutôt que d’inventer une date : un vide visible avant le rendez-vous est moins dangereux qu’un souvenir présenté comme un fait. Demandez aussi dès la prise de rendez-vous ce qui est inclus, ce qui pourrait être facturé et si un écrit ou un échange supplémentaire nécessite un devis.",
  parcoursTitre: "Les supports qui empêchent votre rendez-vous de tourner à la chasse aux papiers",
  limite: "Ranger vos pièces ne suffit pas à choisir ce qui convient à votre famille. Le Dossier organise l’échange ; il ne tranche ni les droits ni les options.",
  acquis: "Vous n’arrivez plus avec « tous vos papiers ». Vous arrivez avec les faits qui comptent, les absences identifiées, les questions que le stress ne pourra plus vous faire oublier et le cadre tarifaire annoncé par l’étude.",
  sortieLabel: "APRÈS LE DOSSIER NOTAIRE",
  sortieTitre: "Votre rendez-vous est préparé. Reste une question que le dossier ne peut pas trancher.",
  suiteLabel: "Le risque d’un dossier parfaitement rangé : croire que classement signifie priorité.",
  suite: "Même parfaitement rempli, ce dossier ne vous dit pas quelle vérification mérite de passer en premier. Vous pouvez apporter chaque pièce demandée et consacrer le rendez-vous au sujet le plus rassurant pendant qu’une date, une propriété ou une protection plus fragile continue d’attendre.",
  suiteResultat: "Mon plan adapté à ma situation relie les informations du dossier, révèle les hypothèses qui changent le résultat et vous donne l’ordre à préparer avant de décider.",
  suiteCta: "Obtenir l’ordre adapté à ma situation"
 },
 upsell1: {
  ouverture: "Vous pouvez faire toutes les démarches avec sérieux… et découvrir trop tard que vous les avez faites dans le mauvais ordre.",
  histoire: [
   "Alain veut avancer vite. Il relit le contrat le plus facile à retrouver, appelle son assureur et classe les réponses. Trois semaines plus tard, une donation ancienne et la propriété réelle de la maison font apparaître une question bien plus urgente. Il n’a pas été inactif : il a dépensé son énergie sur le sujet qui le rassurait pendant que le point décisif restait invisible.",
   "C’est la forme d’échec la plus frustrante : travailler, prendre des rendez-vous et déplacer des papiers, puis apprendre que l’ordre était mauvais. Le simulateur relie les faits que vous déclarez, rend chaque hypothèse visible et génère le plan détaillé : ce qui mérite votre attention d’abord, ce qui peut attendre et ce qui doit être confirmé avant toute décision."
  ],
  apprendreTitre: "Ce que les règles générales ne peuvent pas décider à votre place",
  apprendre: ["Séparer vos faits des hypothèses du calcul pour ne plus prendre une estimation conditionnelle pour une certitude.", "Faire ressortir le point familial, immobilier ou temporel qui peut bouleverser l’ordre imaginé.", "Obtenir un plan généré à partir de vos réponses : première vérification, documents utiles, questions et éléments qui devront encore être formalisés."],
  adresseTitre: "Ce produit est fait pour vous si vous avez compris les règles mais hésitez encore sur l’ordre",
  adresse: ["Plusieurs sujets semblent importants et vous ne savez pas lequel traiter en premier.", "Votre couple, vos donations ou les personnes que vous souhaitez protéger ne ressemblent pas au cas simple présenté dans un article.", "Vous voulez conserver une estimation expliquée et un plan détaillé généré à partir de vos réponses."],
  essentielTitre: "Commencez par les faits, pas par la solution que vous imaginez déjà",
  essentiel: "Répondez avec les informations que vous pouvez prouver et marquez les autres comme incertaines. Lisez toujours les hypothèses avant le montant : un résultat précis fondé sur une mauvaise donnée reste une erreur précise. Distinguez ensuite votre intention, la vérification et l’acte qui pourra lui donner un effet réel.",
  parcoursTitre: "De vos réponses au plan : ce que le moteur relie pour vous",
  limite: "Votre dossier prépare l’étude de votre situation ; il ne remplace pas les actes ni le conseil du professionnel. Une urgence juridique n’attend pas la fin de la lecture.",
  acquis: "Vous ne repartez plus avec dix urgences concurrentes. Vous voyez le résultat, ce qui peut le faire changer, la première vérification à mener et le dossier précis à remettre au professionnel.",
  sortieLabel: "APRÈS VOTRE PLAN",
  sortieTitre: "Votre plan donne l’ordre. Un contrat d’assurance-vie peut encore cacher une intention différente.",
  suiteLabel: "Le point aveugle du simulateur : il ne peut pas ouvrir le contrat détenu par votre assureur.",
  suite: "Le moteur utilise les montants et dates que vous déclarez. Il ne peut pas ouvrir les archives de l’assureur, retrouver la clause réellement enregistrée ni détecter le nom resté là après un changement de vie. S’arrêter au plan peut laisser intact le contrat qui exécutera exactement son texte — et non la promesse faite à votre famille.",
  suiteResultat: "Si vous détenez une assurance-vie, le guide dédié vous aide à demander la clause en vigueur, reconstituer les versements et faire vérifier les conséquences avant qu’une mauvaise surprise ne devienne irréversible.",
  suiteCta: "Vérifier maintenant mon assurance-vie"
 },
 upsell2: {
  ouverture: "Le danger n’est pas que votre assurance-vie soit vide. C’est qu’elle soit pleine d’une intention que le contrat n’a jamais enregistrée.",
  histoire: [
   "Bernard regarde chaque année le capital de son relevé et se croit rassuré. Il a dit plusieurs fois qui il voulait protéger. Pourtant, la seule copie de clause retrouvée précède un bouleversement de sa vie familiale. Le montant est à jour ; personne ne sait si les noms le sont. Le document le plus rassurant masque ainsi la question la plus dangereuse.",
   "Découvert après son décès, cet écart ne laisserait plus aucune place à son explication ni à sa signature. L’assureur appliquerait le contrat détenu, pas le souvenir de la conversation familiale. Ce guide vous aide à obtenir la clause en vigueur, reconstruire les versements et conserver une réponse écrite avant d’envisager la moindre modification."
  ],
  apprendreTitre: "Ce que votre relevé annuel peut laisser parfaitement invisible",
  apprendre: ["Distinguer le capital affiché de la clause bénéficiaire que l’assureur exécutera réellement.", "Reconstruire la chronologie des versements, car la date d’ouverture ne suffit pas à raconter leur traitement.", "Obtenir une preuve écrite de l’assureur et préparer les conséquences à faire vérifier avant qu’une correction ne soit plus possible."],
  adresseTitre: "Ce guide est indispensable si vous détenez un contrat sans pouvoir réciter sa clause actuelle",
  adresse: ["Vous connaissez approximativement le capital mais pas le texte exact enregistré par l’assureur.", "Votre vie familiale a changé depuis la souscription ou la dernière mise à jour dont vous vous souvenez.", "Vous voulez éviter que vos proches découvrent trop tard des bénéficiaires, formulations ou dates que vous n’aviez jamais vérifiés."],
  essentielTitre: "Ne commencez surtout pas par recopier une clause trouvée sur Internet",
  essentiel: "Prenez un seul contrat. Ne recopiez surtout pas une clause trouvée sur Internet. Demandez d’abord le texte en vigueur et l’historique des versements avec le courrier fourni. Une correction prématurée peut créer une nouvelle erreur ; la preuve vient avant la modification.",
  parcoursTitre: "Du relevé rassurant à la preuve écrite : les vérifications qui comptent",
  limite: "Une réponse reçue ne suffit pas à valider une modification. Faites examiner les conséquences et la cohérence familiale avant de changer une clause ou un placement.",
  acquis: "Vous ne confondez plus capital visible et transmission préparée. Vous savez quel texte demander, quelles dates reconstruire et quelle réponse conserver tant que vous pouvez encore agir.",
  sortieLabel: "VOTRE ÉCOSYSTÈME",
  sortieTitre: "Une assurance-vie clarifiée ne prépare pas, à elle seule, le reste de votre transmission.",
  suiteLabel: "Le dernier piège : croire qu’un maillon sécurisé protège toute la chaîne.",
  suite: "Votre clause peut être claire alors que la maison, les donations passées ou le prochain rendez-vous restent sans ordre ni dossier. Si l’un de ces maillons manque encore, vos proches pourront toujours se retrouver face à des informations dispersées et des décisions jamais reliées entre elles.",
  suiteResultat: "Votre espace retire automatiquement les produits déjà achetés et vous montre uniquement ce qui manque encore : le plan adapté, le Dossier Notaire ou aucun complément si votre préparation est complète.",
  suiteCta: "Vérifier ce qu’il me reste à préparer"
 },
 backend4: {
  ouverture: "Le pire conflit n’est pas toujours causé par l’argent. Il peut commencer par quatre proches certains d’avoir entendu quatre versions différentes de votre volonté.",
  histoire: [
   "Élise a toujours dit que sa nièce garderait un objet de famille et qu’une part aiderait une association. Ses enfants connaissent l’idée générale, mais aucun ne sait si elle concernait un bien précis, une somme ou seulement un souhait symbolique. Un ancien testament existe peut-être dans un tiroir. Une assurance-vie désigne encore une autre personne. Tant qu’Élise peut expliquer, tout semble clair ; le jour où elle ne le pourra plus, chaque souvenir sincère pourra contredire le suivant.",
   "Le Dossier Testament ne vous vend pas une formule magique à recopier. Il vous aide à séparer vos volontés, les faits qui les entourent, les documents déjà signés et les questions que seul un professionnel peut trancher. Vous arrivez ainsi au rendez-vous avec un projet compréhensible, prêt à être vérifié puis formalisé dans une forme réellement valable."
  ],
  apprendreTitre: "Ce qu’une conversation familiale ne peut pas sécuriser",
  apprendre: ["Identifier ce que la loi organiserait en l’absence de disposition valable et les personnes dont les droits doivent être protégés.", "Distinguer une volonté personnelle, une clause d’assurance-vie, une donation et une disposition testamentaire afin de ne pas croire que l’une corrige automatiquement l’autre.", "Préparer un brief complet, les questions de validité, le lieu de conservation et les événements qui imposeront une mise à jour."],
  adresseTitre: "Ce dossier est utile dès qu’une volonté importante mérite mieux qu’un souvenir",
  adresse: ["Vous souhaitez protéger une personne, attribuer un bien précis ou soutenir une association.", "Votre famille est recomposée, sans enfant, vulnérable ou marquée par une relation difficile.", "Un ancien testament, une donation ou une clause d’assurance-vie existe déjà et vous ne savez pas si l’ensemble reste cohérent.", "Vous voulez préparer le rendez-vous sans acheter un faux modèle juridique prêt à signer."],
  essentielTitre: "N’écrivez pas le droit : préparez les faits que le droit devra traduire",
  essentiel: "Commencez par le diagnostic, puis écrivez vos intentions en langage courant. Reliez chaque souhait aux personnes, aux biens et aux documents existants. Utilisez ensuite le brief et les questions pour demander au notaire ce qui est possible, quelle forme est adaptée, quel coût sera facturé et où la version valable sera conservée.",
  parcoursTitre: "De la volonté racontée au projet prêt à faire formaliser",
  limite: "Aucune feuille de ce dossier n’est un testament. Ne recopiez ni ne signez ces pages comme tel. La rédaction, la validité, la capacité, les droits réservataires et les effets doivent être vérifiés par un notaire ou, selon la situation, un avocat.",
  acquis: "Vous savez ce que vous voulez protéger, quels documents peuvent contredire cette volonté, quelles questions poser et comment suivre la version finalement formalisée.",
  sortieLabel: "APRÈS LE DOSSIER TESTAMENT",
  sortieTitre: "Vos volontés sont clarifiées. Il reste à vérifier qu’elles s’accordent avec toute votre transmission.",
  suiteLabel: "Le piège d’un testament préparé isolément : oublier le contrat ou la donation qui suit une autre logique.",
  suite: "Un testament n’ouvre pas votre contrat d’assurance-vie, ne reconstitue pas vos donations passées et ne décide pas l’ordre de toutes vos démarches. Une volonté claire peut donc encore rester en contradiction avec un document distinct.",
  suiteResultat: "Revenez dans votre espace : il masque ce que vous possédez déjà et vous montre uniquement le prochain maillon utile à votre situation.",
  suiteCta: "Vérifier la cohérence de ma préparation"
 }
} as const;

export const OUVERTURES_CHAPITRES: Record<string,string> = {
 e0: "Vous n’avez rien à signer ici. Vous allez comprendre les erreurs avant de décider ce qui mérite une vérification.",
 e1: "Une date de donation oubliée peut changer ce qu’il reste réellement de l’abattement. Le temps passe même lorsque le dossier reste fermé.",
 e2: "Un contrat ouvert depuis vingt ans peut contenir des versements qui n’obéissent pas tous aux mêmes règles. Le 70e anniversaire sépare deux lectures très différentes.",
 e3: "À valeur de maison identique, le barème de la nue-propriété change au passage de 71 ans. Comprenez la marche avant d’en parler avec le notaire.",
 e4: "« Nous avons toujours tout partagé » raconte votre vie. Cette phrase ne dit pas encore qui possède, qui hérite et qui paie.",
 e5: "Vous vous souvenez d’avoir aidé un enfant. Lui aussi. Sans date ni preuve, ce souvenir peut devenir une question fiscale et familiale.",
 e6: "Vous voulez aider vos petits-enfants sans désavantager leurs parents ni fragiliser votre sécurité. Donation et succession ne répondent pas aux mêmes règles.",
 e7: "Le notaire peut sécuriser les décisions, mais il ne peut pas deviner les faits absents. Préparez l’histoire qu’il doit réellement étudier."
};

export type SuiteProduit = { sku: "upsell1"|"upsell2"|"pack1"; titre:string; besoin:string; cta:string };
const AV: SuiteProduit = {sku:"upsell2",titre:"Vous avez retrouvé la question. Ne la laissez pas sans réponse.",besoin:"Le guide assurance-vie ajoute la grille de lecture, les repères et le courrier à adapter. Passez du contrat rangé à une demande précise, puis à une réponse conservée.",cta:"Préparer maintenant ma demande à l’assureur"};
const FAMILLE: SuiteProduit = {sku:"upsell1",titre:"Comprendre ne suffit pas à savoir par quoi commencer.",besoin:"Votre plan adapté à votre situation est généré à partir de vos réponses : il ordonne les hypothèses, les dates et les vérifications à préparer.",cta:"Obtenir mon plan adapté"};
/** L'appelant fournit les droits dépliés par chargerEspace. Aucun produit déjà possédé, aucun achat de fin de parcours. */
export function suiteProduit(moment:string, possede:ReadonlySet<ProductSku>, profil?:Reponses|null):SuiteProduit|null {
 const famille=possede.has("upsell1"), assurance=possede.has("upsell2");
 if(famille && (assurance || profil?.av!=="O"))return null;
 if(moment==="e2" || moment==="grille-audit-assurance-vie")return profil?.av==="O"&&!assurance?AV:null;
 if(moment==="upsell1" || moment==="tableau-bord-familial")return profil?.av==="O"&&!assurance?AV:null;
 if(!["front","bump","upsell2","e0","e4","e7","plan-en-1-page","compte-rendu","lettre-modification-clause"].includes(moment))return null;
 if(moment==="front"&&!famille)return FAMILLE;
 if(!famille) {
  if(profil?.av==="O"&&!assurance)return FAMILLE;
  return FAMILLE;
 }
 return profil?.av==="O"&&!assurance?AV:null;
}
