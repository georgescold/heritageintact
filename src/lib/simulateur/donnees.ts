import type { Heritier, Saisie } from "./types";

export type DonneesSimulation = {
  inconnues?: string[];
  regime?: string;
  testament?: string;
  donationEpoux?: string;
  donationsMultiples?: string;
  residenceTotale?: number;
  quotePart?: number;
  recomposition?: string;
  international?: string;
  entreprise?: string;
  urgence?: string;
  intention?: string;
  descendantDecede?: string;
  demembrement?: string;
  repartition?: string;
  age: number;
  vie: string;
  residence: number;
  immobilier: number;
  epargne: number;
  titres: number;
  autres: number;
  dettes: number;
  enfants: number;
  petitsEnfants: number;
  fratrie: number;
  neveux: number;
  sansLien: number;
  beauxEnfants: number;
  handicap: number;
  avAvant: number;
  avApres: number;
  beneficiaires: number;
  donationAnnee: number;
  donationMontant: number;
  protectionSignee: "O" | "N" | "?";
  personneConfiance: "O" | "N" | "?";
  detentionResidence: "propre" | "couple" | "indivision" | "?";
  souhaitResidence: "rester" | "transmettre" | "vendre" | "?";
};

export type PointPreparation = {
  cle: "protection" | "famille" | "maison" | "assurance-vie" | "donation" | "dates";
  titre: string;
  constat: string;
  actions: string[];
  effetReel: string;
};

export const CLE_SIMULATION = "hi_simulation_plan_v1";

export const DONNEES_VIDES: DonneesSimulation = {
  age: 0,
  vie: "M",
  residence: 0,
  immobilier: 0,
  epargne: 0,
  titres: 0,
  autres: 0,
  dettes: 0,
  enfants: 0,
  petitsEnfants: 0,
  fratrie: 0,
  neveux: 0,
  sansLien: 0,
  beauxEnfants: 0,
  handicap: 0,
  avAvant: 0,
  avApres: 0,
  beneficiaires: 1,
  donationAnnee: 0,
  donationMontant: 0,
  protectionSignee: "?",
  personneConfiance: "?",
  detentionResidence: "?",
  souhaitResidence: "?",
};

function heritiers(d: DonneesSimulation): Heritier[] {
  const liste: Heritier[] = [];
  const ajouter = (
    n: number,
    lien: Heritier["lien"],
    prefixe: string,
    extra: Partial<Heritier> = {},
  ) => {
    for (let i = 0; i < Math.max(0, n); i++) {
      liste.push({ id: `${prefixe}-${i}`, prenom: `${prefixe} ${i + 1}`, lien, ...extra });
    }
  };
  ajouter(d.enfants, "enfant", "Enfant");
  ajouter(d.beauxEnfants, "enfant", "Enfant du conjoint", { duConjointNonAdopte: true });
  ajouter(d.petitsEnfants, "petit-enfant", "Petit-enfant");
  ajouter(d.fratrie, "fratrie", "Frère ou sœur");
  ajouter(d.neveux, "neveu", "Neveu ou nièce");
  ajouter(d.sansLien, "sans-lien", "Autre personne");
  for (let i = 0; i < Math.min(d.handicap, liste.length); i++) liste[i].handicap = true;
  return liste;
}

export function donneesVersSaisie(d: DonneesSimulation): Saisie {
  const biens = [
    ["Résidence principale", "residence", d.residence],
    ["Autres biens immobiliers", "immobilier", d.immobilier],
    ["Épargne", "liquide", d.epargne],
    ["Titres et placements", "titres", d.titres],
    ["Autres biens", "autre", d.autres],
  ]
    .filter(([, , valeur]) => Number(valeur) > 0)
    .map(([libelle, type, valeur], i) => ({
      id: `bien-${i}`,
      libelle: String(libelle),
      type: type as "residence" | "immobilier" | "liquide" | "titres" | "autre",
      valeur: Number(valeur),
    }));

  return {
    age: d.age,
    vie: d.vie,
    heritiers: heritiers(d),
    biens,
    dettes: d.dettes,
    contrats:
      d.avAvant || d.avApres
        ? [
            {
              id: "av-1",
              libelle: "Contrats déclarés",
              verseAvant70: d.avAvant,
              verseApres70: d.avApres,
              beneficiaires: Math.max(1, d.beneficiaires),
            },
          ]
        : [],
    donations: d.donationAnnee
      ? [
          {
            id: "don-1",
            annee: d.donationAnnee,
            montant: d.donationMontant,
            pour: "Bénéficiaires déclarés",
          },
        ]
      : [],
  };
}

export function planPreparation(d: DonneesSimulation): string[] {
  const specifiques = pointsPreparation(d).flatMap((point) => point.actions.slice(0, 1));
  return [
    ...(d.urgence && d.urgence !== "non" ? ["Appelez d’abord votre notaire : indiquez la succession ouverte, la signature prévue ou le désaccord signalé. Demandez la prochaine démarche et les pièces nécessaires. Notez sa réponse et la date convenue."] : []),
    ...(d.intention === "maison" ? ["Retrouvez le titre de propriété de votre logement. Notez les propriétaires et leurs parts. Si le document manque, demandez une copie à l’étude qui a signé l’achat. Vous avez fini lorsque le document ou la demande de copie est classé."] : []),
    ...(d.intention === "conjoint" || d.vie === "M" ? ["Réunissez votre livret de famille et votre contrat de mariage s’il existe. Demandez à votre étude quels actes sont déjà enregistrés pour protéger votre conjoint. Notez les réponses manquantes."] : []),
    ...(d.testament === "O" ? ["Retrouvez votre testament et son lieu de conservation. Notez les changements familiaux intervenus depuis sa rédaction pour les signaler au rendez-vous."] : []),
    ...(d.international === "O" ? ["Listez les pays concernés et les biens ou résidences qui s’y trouvent. Signalez-les dès la prise de rendez-vous pour que l’étude oriente votre dossier."] : []),
    ...(d.entreprise === "O" ? ["Réunissez les statuts et le dernier relevé de vos parts. Demandez à votre comptable la liste des pièces utiles à l’étude de leur transmission."] : []),
    ...(d.descendantDecede === "O" ? ["Notez les liens entre l’enfant décédé et ses descendants. Apportez cette liste au notaire pour identifier les personnes et les parts à retenir."] : []),
    ...(d.demembrement === "O" ? ["Retrouvez l’acte qui distingue usufruit et nue-propriété. Relevez les titulaires de chaque droit et demandez quelle valeur doit être retenue dans votre situation."] : []),
    ...(d.repartition === "N" ? ["Écrivez la répartition que vous souhaitez, sans lui donner vous-même une valeur juridique. Demandez au notaire de la confronter aux droits des personnes concernées."] : []),
    ...(d.inconnues?.length ? ["Consultez les informations à retrouver dans ce plan. Pour chacune, notez le document ou l’interlocuteur indiqué. Une demande envoyée est déjà une action terminée."] : []),
    "Rassemblez dans une seule chemise vos titres de propriété, vos relevés et vos actes familiaux. Sur la première page, notez la question que vous voulez résoudre au rendez-vous.",
    ...specifiques,
    d.donationAnnee
      ? "Retrouver les actes et déclarations de donations avant de considérer un abattement comme disponible."
      : "Faire vérifier les abattements disponibles avant toute opération.",
    d.avAvant + d.avApres > 0
      ? "Obtenir la clause bénéficiaire actuellement enregistrée et l’historique des versements."
      : "Décider si l’assurance-vie fait partie des sujets à examiner.",
    "Comparer les scénarios utiles avec le professionnel avant toute décision irréversible.",
  ].filter((etape, index, liste) => liste.indexOf(etape) === index);
}

export function pointsPreparation(d: DonneesSimulation): PointPreparation[] {
  const points: PointPreparation[] = [];
  if (d.protectionSignee !== "O" || d.personneConfiance !== "O") {
    points.push({
      cle: "protection",
      titre: "Votre protection si vous ne pouviez plus décider reste à formaliser",
      constat:
        d.protectionSignee === "O"
          ? "Vous indiquez qu’un dispositif existe, mais l’acceptation de la personne envisagée ou une solution de remplacement reste à confirmer."
          : "Une personne de confiance connue de la famille ne reçoit aucun pouvoir juridique par cette seule intention.",
      actions: [
        "Identifier une personne principale et un remplaçant, puis leur demander s’ils acceptent réellement cette responsabilité.",
        "Lister les décisions personnelles et patrimoniales que vous voudriez pouvoir confier.",
        "Apporter la fiche Protection future au notaire ou à l’avocat pour choisir et établir le dispositif approprié.",
      ],
      effetReel:
        "Le pouvoir d’agir viendra uniquement d’un dispositif officiel valablement établi et, le moment venu, régulièrement mis en œuvre.",
    });
  }
  if (d.beauxEnfants > 0 || d.recomposition === "O" || d.vie === "P" || d.vie === "U") {
    points.push({
      cle: "famille",
      titre: "Votre intention familiale peut différer des droits réellement applicables",
      constat:
        d.beauxEnfants > 0
          ? "Un enfant du conjoint non adopté n’est pas automatiquement traité comme votre propre enfant."
          : d.recomposition === "O" ? "Vous indiquez des enfants d’une précédente union : leurs liens et les droits du conjoint doivent être examinés ensemble." : "Partager une vie ou être pacsé ne suffit pas à déterminer ce que le partenaire recevra.",
      actions: [
        "Dessiner les liens de filiation et distinguer clairement vos enfants de ceux de votre conjoint.",
        "Retrouver le régime matrimonial, la convention de PACS, le testament et les actes déjà signés.",
        "Demander au notaire de comparer votre intention au résultat produit par les actes existants.",
      ],
      effetReel:
        "Seuls les droits établis par la loi et les actes valablement formalisés détermineront la transmission.",
    });
  }
  const destinataires =
    d.enfants + d.petitsEnfants + d.fratrie + d.neveux + d.sansLien + d.beauxEnfants;
  if (
    d.residence > 0 &&
    (destinataires > 1 || d.detentionResidence === "indivision" || d.souhaitResidence !== "?")
  ) {
    points.push({
      cle: "maison",
      titre: "La maison nécessite une décision plus précise qu’« ils la garderont »",
      constat:
        d.detentionResidence === "?"
          ? "Le mode de détention du logement n’est pas confirmé, alors qu’il conditionne la part réellement concernée."
          : "Plusieurs personnes ou plusieurs intentions autour du logement peuvent rendre l’occupation, les charges ou la vente difficiles à organiser.",
      actions: [
        "Faire confirmer le propriétaire, les quotes-parts, l’emprunt et les droits déjà existants sur le logement.",
        "Comparer au moins trois scénarios : occupation, conservation ou rachat d’une part, et vente.",
        "Noter ce que la famille a compris puis faire formaliser la solution réellement retenue.",
      ],
      effetReel:
        "Cette simulation ne crée aucun droit d’occupation, de partage ou de vente : l’acte approprié doit être établi par le professionnel.",
    });
  }
  if (d.avAvant + d.avApres > 0) {
    points.push({
      cle: "assurance-vie",
      titre: "Le montant de l’assurance-vie ne révèle pas la clause enregistrée",
      constat:
        "Le simulateur utilise vos montants et le nombre de bénéficiaires déclaré, mais il ne peut pas lire le contrat détenu par l’assureur.",
      actions: [
        "Demander la clause bénéficiaire actuellement enregistrée et l’historique des versements.",
        "Comparer la clause obtenue à votre intention actuelle avant toute demande de modification.",
      ],
      effetReel: "Seule la clause effectivement enregistrée auprès de l’assureur produit ses effets.",
    });
  }
  if (d.donationAnnee > 0 || d.donationsMultiples === "O") {
    points.push({
      cle: "donation",
      titre: "Une donation passée doit être retrouvée avant tout nouveau calcul",
      constat:
        "Une année et un montant approximatifs ne permettent pas de connaître seuls les effets civils et fiscaux encore applicables.",
      actions: [
        "Retrouver l’acte, la déclaration et l’identité exacte du donateur et du bénéficiaire.",
        "Faire confirmer séparément le rappel fiscal, le rapport civil et les abattements disponibles.",
      ],
      effetReel: "Les actes et déclarations conservés, pas le souvenir du montant, permettront la vérification.",
    });
  }
  if (d.age >= 69) {
    points.push({
      cle: "dates",
      titre: "Vos repères de 70 et 71 ans méritent une vérification datée",
      constat:
        "L’âge seul signale un point à examiner ; il ne démontre ni une urgence juridique ni l’intérêt d’une opération.",
      actions: [
        "Faire dater les versements d’assurance-vie et tout projet de démembrement avant de comparer les conséquences.",
      ],
      effetReel: "Une décision ne doit être prise qu’après vérification de votre situation et des règles en vigueur.",
    });
  }
  return points;
}

export function dossierProfessionnel(d: DonneesSimulation): string[] {
  const pieces = [
    "Titres de propriété, régime matrimonial ou convention de PACS et dernier relevé des dettes.",
    "Liste factuelle des personnes concernées et actes familiaux déjà signés.",
    d.donationAnnee
      ? "Actes et déclarations correspondant aux donations passées."
      : "Confirmation qu’aucune donation passée n’a été oubliée.",
    d.avAvant + d.avApres > 0
      ? "Clause bénéficiaire en vigueur et historique des versements d’assurance-vie."
      : "Liste des contrats à vérifier, même lorsque leur montant est encore inconnu.",
  ];
  if (pointsPreparation(d).some((point) => point.cle === "protection"))
    pieces.push("Fiche Protection future : personnes envisagées, pouvoirs souhaités et solution de remplacement.");
  if (pointsPreparation(d).some((point) => point.cle === "maison"))
    pieces.push("Fiche Maison : mode de détention, charges, souhaits et scénarios à comparer.");
  return pieces;
}

const CLES_MONTANTS = [
  "residence",
  "immobilier",
  "epargne",
  "titres",
  "autres",
  "dettes",
  "avAvant",
  "avApres",
  "donationMontant",
] as const;
const CLES_NOMBRES = [
  "enfants",
  "petitsEnfants",
  "fratrie",
  "neveux",
  "sansLien",
  "beauxEnfants",
  "handicap",
  "beneficiaires",
] as const;

export function validerDonneesSimulation(valeur: unknown): DonneesSimulation | null {
  if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) return null;
  const source = valeur as Record<string, unknown>;
  const d = {} as DonneesSimulation;
  const entier = (cle: string, min: number, max: number) => {
    const n = Number(source[cle]);
    return Number.isInteger(n) && n >= min && n <= max ? n : null;
  };
  const age = entier("age", 18, 120);
  const donationAnnee = entier("donationAnnee", 0, new Date().getFullYear());
  if (age === null || donationAnnee === null || (donationAnnee > 0 && donationAnnee < 1900)) {
    return null;
  }
  if (!new Set(["M", "P", "U", "V", "S"]).has(String(source.vie))) return null;
  d.age = age;
  d.vie = String(source.vie);
  d.donationAnnee = donationAnnee;
  for (const cle of CLES_MONTANTS) {
    const n = Number(source[cle]);
    if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) return null;
    d[cle] = n;
  }
  for (const cle of CLES_NOMBRES) {
    const n = entier(cle, 0, 30);
    if (n === null) return null;
    d[cle] = n;
  }
  const total = d.enfants + d.petitsEnfants + d.fratrie + d.neveux + d.sansLien + d.beauxEnfants;
  if (d.handicap > total) return null;
  const choix = <T extends string>(cle: string, permis: readonly T[]): T | null => {
    const valeur = String(source[cle] ?? "?") as T;
    return permis.includes(valeur) ? valeur : null;
  };
  const protectionSignee = choix("protectionSignee", ["O", "N", "?"] as const);
  const personneConfiance = choix("personneConfiance", ["O", "N", "?"] as const);
  const detentionResidence = choix(
    "detentionResidence",
    ["propre", "couple", "indivision", "?"] as const,
  );
  const souhaitResidence = choix(
    "souhaitResidence",
    ["rester", "transmettre", "vendre", "?"] as const,
  );
  if (!protectionSignee || !personneConfiance || !detentionResidence || !souhaitResidence)
    return null;
  d.protectionSignee = protectionSignee;
  d.personneConfiance = personneConfiance;
  d.detentionResidence = detentionResidence;
  d.souhaitResidence = souhaitResidence;
  d.inconnues = Array.isArray(source.inconnues) ? source.inconnues.filter((v): v is string => typeof v === "string" && /^[a-zA-Z]{1,40}$/.test(v)).slice(0, 60) : [];
  const valeursPermises = { regime: ["communaute", "separation", "autre", "?"], testament: ["O", "N", "?"], donationEpoux: ["O", "N", "?"], donationsMultiples: ["O", "N", "?"], recomposition: ["O", "N", "?"], international: ["O", "N", "?"], entreprise: ["O", "N", "?"], urgence: ["succession", "signature", "conflit", "non"], intention: ["maison", "conjoint", "famille", "ordre"], descendantDecede: ["O", "N", "?"], demembrement: ["O", "N", "?"], repartition: ["O", "N", "?"] };
  for (const key of Object.keys(valeursPermises) as (keyof typeof valeursPermises)[]) {
    if (source[key] != null) {
      if (typeof source[key] !== "string" || !valeursPermises[key].includes(source[key])) return null;
      d[key] = source[key];
      if (source[key] === "?" && !d.inconnues.includes(key)) d.inconnues.push(key);
    }
  }
  for (const key of ["residenceTotale", "quotePart"] as const) {
    if (source[key] != null) {
      const n = Number(source[key]);
      if (!Number.isFinite(n) || n < 0 || n > (key === "quotePart" ? 100 : 1_000_000_000)) return null;
      d[key] = n;
    }
  }
  return d;
}

/** Pas de montant présenté comme une estimation personnelle avec une assiette inconnue. */
export function raisonsChiffrage(d: DonneesSimulation): string[] {
  const raisons: string[] = [];
  if (d.inconnues?.length) raisons.push("Des informations restent à retrouver : votre plan indique comment les obtenir.");
  if (d.vie === "M") raisons.push("La part du conjoint et le régime matrimonial doivent être déterminés avant le chiffrage de votre succession.");
  if (d.testament === "O" || d.donationEpoux === "O") raisons.push("Les dispositions déjà signées doivent être rapprochées des droits des bénéficiaires.");
  if (d.donationAnnee || d.donationsMultiples === "O") raisons.push("Les donations antérieures doivent être attribuées à leurs bénéficiaires avant le calcul des abattements restants.");
  if (d.international === "O" || d.entreprise === "O") raisons.push("Les biens professionnels ou les éléments internationaux nécessitent une étude spécifique.");
  if (d.petitsEnfants + d.fratrie + d.neveux + d.sansLien + d.beauxEnfants > 0 || !d.enfants) raisons.push("Les personnes à protéger et la répartition applicable doivent être confirmées.");
  if (d.avAvant + d.avApres > 0) raisons.push("La valeur des contrats, leurs dates et les clauses doivent être confirmées pour chiffrer la transmission de l’assurance-vie.");
  if (!d.regime && d.vie === "M" || !d.testament || !d.international || !d.donationsMultiples) raisons.push("Complétez les nouvelles questions pour actualiser votre préparation.");
  if (d.recomposition === "O" || d.intention === "conjoint" || d.intention === "maison") raisons.push("Votre objectif demande de confirmer les droits et la répartition avant d’afficher un montant personnel.");
  if (d.descendantDecede !== "N") raisons.push("L’existence de descendants d’un enfant décédé doit être précisée pour déterminer les personnes et les parts à retenir.");
  if (d.residence + d.immobilier > 0 && d.demembrement !== "N") raisons.push("Les droits de propriété, d’usufruit ou de nue-propriété doivent être distingués pour retenir la bonne valeur.");
  if (d.enfants > 0 && d.repartition !== "O") raisons.push("Précisez la répartition souhaitée : le scénario chiffré disponible compare des parts égales entre enfants.");
  return raisons;
}

export function informationsARetrouver(d: DonneesSimulation): string[] {
  return (d.inconnues ?? []).map(cle => {
    if (/av|beneficiaires/.test(cle)) return "Assurance-vie : demandez à votre assureur le relevé du contrat, la clause en vigueur et la ventilation des versements avant et après 70 ans.";
    if (/residence|quotePart|detention|immobilier/.test(cle)) return "Immobilier : consultez votre titre de propriété ; demandez une copie à l’étude qui a établi l’acte si vous ne le retrouvez pas.";
    if (/donation/.test(cle)) return "Donations : recherchez chaque acte ou déclaration, sa date, son montant et son bénéficiaire ; votre notaire pourra vous aider à reconstituer l’historique.";
    if (/regime|testament|recomposition/.test(cle)) return "Situation familiale : réunissez livret de famille et actes existants ; demandez au notaire de confirmer les dispositions enregistrées.";
    if (cle === "descendantDecede") return "Descendance : notez les liens familiaux et faites confirmer par le notaire les personnes qui doivent être représentées dans la transmission.";
    if (cle === "demembrement") return "Propriété : retrouvez sur l’acte les mentions pleine propriété, usufruit et nue-propriété ; ne déduisez pas ces droits du seul fait d’occuper le bien.";
    if (cle === "repartition") return "Répartition : notez votre intention avec vos propres mots, puis demandez au notaire de confirmer les parts applicables.";
    if (/epargne|titres|autres|dettes/.test(cle)) return "Montants : consultez vos derniers relevés et tableaux de remboursement. Séparez ce qui vous appartient de ce qui appartient à votre conjoint.";
    return "Question à préciser : " + ({ entreprise: "retrouvez les statuts et vos parts avec votre comptable", international: "notez les pays concernés avant de contacter le notaire", protectionSignee: "retrouvez le dispositif de protection déjà signé", personneConfiance: "prévoyez un échange avec la personne envisagée", enfants: "reprenez votre livret de famille", souhaitResidence: "notez ce que vous voulez préserver pour le logement" }[cle] ?? "reprenez cette réponse dans le questionnaire, ou notez-la pour votre rendez-vous");
  }).filter((v, i, all) => all.indexOf(v) === i);
}

/** Suggestions de lecture, pas attribution automatique de droits. */
export function fichesPourSituation(d: DonneesSimulation): string[] {
  const keys: string[] = [];
  if (d.vie === "M" && d.enfants > 0) keys.push(d.enfants === 1 ? "plan-marie-1-enfant" : "plan-marie-2-enfants");
  if (d.recomposition === "O" || d.beauxEnfants > 0) keys.push("plan-famille-recomposee");
  if (d.vie === "V") keys.push("plan-veuf-veuve");
  if (["P", "U"].includes(d.vie)) keys.push("plan-concubins-pacs");
  if (!d.enfants && !d.inconnues?.includes("enfants")) keys.push("plan-sans-enfant");
  if (d.entreprise === "O") keys.push("plan-entreprise");
  if (d.donationAnnee || d.donationsMultiples === "O") keys.push("plan-donations-deja-faites", "calendrier-15-ans");
  if (d.residence + d.immobilier + d.epargne + d.titres + d.autres > 1_000_000) keys.push("plan-patrimoine-important");
  if (d.protectionSignee !== "O") keys.push("protection-future");
  if (d.residence > 0) keys.push("maison-indivision");
  return keys;
}
