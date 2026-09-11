import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { calculer } from "./moteur";
import { accompagnementPoint, incoherencesReponses, questionsSituation } from "./accompagnement";
import {
  donneesVersSaisie,
  dossierProfessionnel,
  planPreparation,
  pointsPreparation,
  raisonsChiffrage,
  informationsARetrouver,
  type DonneesSimulation,
} from "./donnees";

const A4: [number, number] = [595.28, 841.89];
const BLEU = rgb(0.035, 0.19, 0.36);
const ORANGE = rgb(0.94, 0.38, 0.02);
const GRIS = rgb(0.31, 0.35, 0.39);
const CLAIR = rgb(0.95, 0.97, 0.98);
const VERT_CLAIR = rgb(0.91, 0.97, 0.92);

function compatiblePdf(texte: string) {
  return texte
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/€/g, "EUR")
    .replace(/\u00a0/g, " ");
}

function lignes(texte: string, police: PDFFont, taille: number, largeur: number) {
  const mots = compatiblePdf(texte).split(/\s+/);
  const resultat: string[] = [];
  let ligne = "";
  for (const mot of mots) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    if (police.widthOfTextAtSize(essai, taille) <= largeur || !ligne) ligne = essai;
    else {
      resultat.push(ligne);
      ligne = mot;
    }
  }
  if (ligne) resultat.push(ligne);
  return resultat;
}

function argent(n: number) {
  return `${Math.round(n).toLocaleString("fr-FR").replace(/\u202f/g, " ")} EUR`;
}

function situation(vie: string) {
  return ({ M: "Marié(e)", P: "Pacsé(e)", U: "En couple sans mariage ni PACS", V: "Veuf ou veuve", S: "Seul(e)" } as Record<string, string>)[vie] ?? vie;
}

function ouiNonInconnu(v: string) {
  return v === "O" ? "Oui" : v === "N" ? "Non" : "Non confirme";
}

function detention(v: DonneesSimulation["detentionResidence"]) {
  return ({
    propre: "Detenue par moi seul(e)",
    couple: "Avec mon conjoint ou partenaire",
    indivision: "En indivision",
    "?": "Non confirmee",
  } as const)[v];
}

function souhaitMaison(v: DonneesSimulation["souhaitResidence"]) {
  return ({
    rester: "Pouvoir y vivre aussi longtemps que possible",
    transmettre: "Permettre a un proche de la conserver",
    vendre: "Eviter qu'une vente eventuelle se bloque",
    "?": "Pas encore decide",
  } as const)[v];
}

export async function genererPlanPersonnalisePdf(d: DonneesSimulation, date = new Date()) {
  const document = await PDFDocument.create();
  const normal = await document.embedFont(StandardFonts.Helvetica);
  const gras = await document.embedFont(StandardFonts.HelveticaBold);
  const saisie = donneesVersSaisie(d);
  const resultat = calculer(saisie, date.getFullYear());
  const raisons = raisonsChiffrage(d);
  const montant = (cle: keyof DonneesSimulation, n: number) => d.inconnues?.includes(cle) ? "A retrouver" : argent(n);
  const marge = 48;
  const largeur = A4[0] - marge * 2;
  let page!: PDFPage;
  let y = 0;
  let numero = 0;

  const nouvellePage = () => {
    page = document.addPage();
    page.setSize(A4[0], A4[1]);
    numero += 1;
    page.drawRectangle({ x: 0, y: A4[1] - 16, width: A4[0], height: 16, color: BLEU });
    page.drawText("HERITAGE INTACT", { x: marge, y: A4[1] - 42, size: 9, font: gras, color: BLEU });
    page.drawText(`Plan personnalise - page ${numero}`, { x: A4[0] - 175, y: 25, size: 8, font: normal, color: GRIS });
    y = A4[1] - 68;
  };
  const verifierPlace = (hauteur: number) => {
    if (y - hauteur < 72) nouvellePage();
  };
  const paragraphe = (texte: string, options: { taille?: number; police?: PDFFont; couleur?: ReturnType<typeof rgb>; espace?: number } = {}) => {
    const taille = options.taille ?? 11;
    const police = options.police ?? normal;
    const hauteur = taille * 1.55;
    const ls = lignes(texte, police, taille, largeur);
    verifierPlace(ls.length * hauteur + (options.espace ?? 8));
    for (const ligne of ls) {
      verifierPlace(hauteur);
      page.drawText(ligne, { x: marge, y, size: taille, font: police, color: options.couleur ?? GRIS });
      y -= hauteur;
    }
    y -= options.espace ?? 8;
  };
  const titre = (texte: string) => {
    const ls = lignes(texte, gras, 16, largeur - 18);
    verifierPlace(95 + ls.length * 22);
    y -= 18;
    page.drawRectangle({ x: marge, y: y - 4, width: 5, height: 24, color: ORANGE });
    for (const ligne of ls) { page.drawText(ligne, { x: marge + 14, y, size: 16, font: gras, color: BLEU }); y -= 22; }
    y -= 16;
  };
  const valeur = (libelle: string, contenu: string) => {
    const gauche = lignes(libelle, normal, 10, 212);
    const droite = lignes(contenu, gras, 10, largeur - 230);
    const hauteur = Math.max(gauche.length, droite.length) * 16 + 12;
    verifierPlace(hauteur);
    gauche.forEach((ligne, i) => page.drawText(ligne, { x: marge, y: y - i * 16, size: 10, font: normal, color: GRIS }));
    droite.forEach((ligne, i) => page.drawText(ligne, { x: marge + 230, y: y - i * 16, size: 10, font: gras, color: BLEU }));
    y -= hauteur;
  };

  nouvellePage();
  page.drawRectangle({ x: marge, y: y - 145, width: largeur, height: 145, color: CLAIR });
  page.drawText("MON PLAN PERSONNALISE", { x: marge + 24, y: y - 42, size: 24, font: gras, color: BLEU });
  page.drawText("Votre simulation et votre ordre de preparation", { x: marge + 24, y: y - 72, size: 13, font: normal, color: ORANGE });
  page.drawText("Vos réponses, vos priorités et les prochaines vérifications", { x: marge + 24, y: y - 108, size: 10, font: normal, color: GRIS });
  y -= 175;
  paragraphe("Ce document fige les informations que vous avez saisies et le résultat indicatif correspondant. Conservez-le pour préparer vos questions et comparer les éléments à faire confirmer.", { taille: 11, couleur: BLEU, espace: 18 });
  verifierPlace(82);
  page.drawRectangle({ x: marge, y: y - 62, width: largeur, height: 70, color: CLAIR, borderColor: ORANGE, borderWidth: 1.5 });
  page.drawText("COMMENT UTILISER CE PLAN", { x: marge + 16, y: y - 20, size: 11, font: gras, color: BLEU });
  page.drawText("Apportez vos priorites et vos pieces au rendez-vous.", { x: marge + 16, y: y - 41, size: 9, font: normal, color: GRIS });
  page.drawText("Le professionnel pourra confirmer et formaliser la solution adaptee.", { x: marge + 16, y: y - 54, size: 9, font: normal, color: GRIS });
  y -= 88;

  titre("Votre premiere action");
  paragraphe(planPreparation(d)[0], { police: gras, couleur: BLEU, taille: 11 });
  paragraphe("Votre préparation est prête lorsque vous avez réuni les informations connues, les pièces disponibles et les questions restantes. Il n’est pas nécessaire de tout savoir pour prendre rendez-vous.");
  paragraphe("Un point de vigilance n’est ni une perte constatée, ni une obligation de signer un acte. Pour chacun, ce plan vous donne une démarche et un résultat à obtenir. Avancez un sujet à la fois.", { couleur: BLEU });
  if (incoherencesReponses(d, date.getFullYear()).length) {
    titre("Des réponses à rapprocher");
    incoherencesReponses(d, date.getFullYear()).forEach(x => paragraphe(x));
    paragraphe("Vos réponses sont conservées telles quelles. Corrigez-les depuis votre espace lorsque vous aurez retrouvé les pièces ; aucun montant n’est corrigé automatiquement à votre place.");
  }
  if (informationsARetrouver(d).length) titre("Vos informations a retrouver");
  informationsARetrouver(d).forEach(info => paragraphe(info));

  nouvellePage();
  titre("Votre situation saisie");
  valeur("Age", `${d.age} ans`);
  valeur("Situation", situation(d.vie));
  valeur("Part de residence saisie", d.inconnues?.some(k => ["residenceTotale", "quotePart"].includes(k)) ? "A retrouver" : montant("residence", d.residence));
  valeur("Parts des autres biens saisies", montant("immobilier", d.immobilier));
  valeur("Epargne", montant("epargne", d.epargne));
  valeur("Titres", montant("titres", d.titres));
  valeur("Autres biens", montant("autres", d.autres));
  valeur("Dettes indiquees", montant("dettes", d.dettes));
  if (!raisons.length) valeur("Masse nette modelisee", argent(resultat.masse));
  valeur("Personnes modelisees", String(resultat.parts.length));
  valeur("Assurance-vie avant / apres 70 ans", `${montant("avAvant", d.avAvant)} / ${montant("avApres", d.avApres)}`);
  valeur("Derniere donation declaree", d.inconnues?.includes("donationAnnee") ? "Date a retrouver" : d.donationAnnee ? `${d.donationAnnee} - ${montant("donationMontant", d.donationMontant)}` : "Aucune indiquee");
  valeur("Protection deja formalisee", ouiNonInconnu(d.protectionSignee));
  valeur("Personne de confiance informee", ouiNonInconnu(d.personneConfiance));
  if (d.residence > 0) {
    valeur("Detention de la residence", detention(d.detentionResidence));
    valeur("Souhait principal pour la maison", souhaitMaison(d.souhaitResidence));
  }
  const choix = (v?: string) => ({ O: "Oui", N: "Non", "?": "À confirmer", communaute: "Communauté", separation: "Séparation de biens", autre: "Autre régime", non: "Préparation sans urgence signalée", succession: "Succession ouverte", signature: "Signature prévue", conflit: "Désaccord", maison: "Préserver le logement", conjoint: "Protéger le conjoint", famille: "Préparer pour la famille", ordre: "Savoir par quoi commencer" }[v ?? "?"] ?? "À confirmer");
  valeur("Votre objectif", choix(d.intention));
  valeur("Contexte de la démarche", choix(d.urgence));
  if(d.vie === "M") { valeur("Régime matrimonial", choix(d.regime)); valeur("Donation entre époux", choix(d.donationEpoux)); }
  for (const [label, key] of [["Testament existant", "testament"], ["Enfants d'une précédente union", "recomposition"], ["Descendants d'un enfant décédé", "descendantDecede"], ["Situation internationale", "international"], ["Entreprise ou parts sociales", "entreprise"], ["Plusieurs donations", "donationsMultiples"], ["Répartition égale souhaitée", "repartition"]] as const) valeur(label, choix(d[key]));
  if (d.residence + d.immobilier > 0) valeur("Démembrement déclaré", choix(d.demembrement));
  for (const [label, key] of [["Enfants en vie", "enfants"], ["Enfants du conjoint non adoptés", "beauxEnfants"], ["Petits-enfants", "petitsEnfants"], ["Frères et soeurs", "fratrie"], ["Neveux et nièces", "neveux"], ["Autres personnes", "sansLien"]] as const) valeur(label, d.inconnues?.includes(key) ? "À retrouver" : String(d[key]));

  if (raisons.length) {
    titre("Pour etablir votre chiffrage personnel");
    paragraphe("Votre plan tient compte des réponses disponibles. Les éléments ci-dessous doivent être précisés pour établir un montant personnel : une information manquante n’est pas remplacée par zéro.");
    raisons.forEach(raison => paragraphe(`- ${raison}`));
  } else {
  titre("Votre estimation indicative");
  verifierPlace(88);
  page.drawRectangle({ x: marge, y: y - 62, width: largeur, height: 70, color: VERT_CLAIR });
  page.drawText("Estimation totale du cas modelise", { x: marge + 18, y: y - 18, size: 11, font: normal, color: BLEU });
  page.drawText(argent(resultat.total), { x: marge + 18, y: y - 48, size: 22, font: gras, color: BLEU });
  y -= 88;
  paragraphe("Cette estimation relie vos réponses aux hypothèses affichées plus loin. Utilisez-la pour comprendre le calcul, préparer les pièces utiles et demander au professionnel un chiffrage confirmé.", { taille: 9 });

  if (resultat.parts.length) {
    titre("Detail du scenario modelise");
    resultat.parts.forEach((part, index) => {
      verifierPlace(112);
      page.drawRectangle({ x: marge, y: y - 88, width: largeur, height: 96, color: index % 2 ? CLAIR : rgb(1, 1, 1), borderColor: rgb(0.78, 0.82, 0.86), borderWidth: 0.7 });
      page.drawText(compatiblePdf(part.heritier.prenom), { x: marge + 12, y: y - 18, size: 11, font: gras, color: BLEU });
      page.drawText(`Part modelisee : ${argent(part.part)}`, { x: marge + 12, y: y - 38, size: 9, font: normal, color: GRIS });
      page.drawText(`Abattement : ${argent(part.abattement)} (${compatiblePdf(part.abattementArticle)})`, { x: marge + 12, y: y - 55, size: 9, font: normal, color: GRIS });
      page.drawText(`Base taxable : ${argent(part.base)}`, { x: marge + 12, y: y - 72, size: 9, font: normal, color: GRIS });
      page.drawText(`Droits modelises : ${argent(part.droits + part.droitsAssuranceVie)}`, { x: marge + 280, y: y - 72, size: 9, font: gras, color: BLEU });
      y -= 106;
    });
  }

  }
  titre("Vos points de vigilance personnels");
  paragraphe("Ces points servent à organiser vos vérifications, pas à annoncer qu’un problème va nécessairement se produire. Le résultat attendu vous permet de savoir quand passer à la suite.");
  const points = pointsPreparation(d);
  if (!points.length) {
    paragraphe("Aucun point complémentaire n'a été déclenché par ces réponses. Les pièces et les droits restent néanmoins à faire confirmer.");
  }
  for (const point of points) {
    verifierPlace(290);
    const aide = accompagnementPoint(point);
    paragraphe(point.titre, { police: gras, couleur: BLEU, taille: 11, espace: 4 });
    paragraphe(point.constat, { taille: 10, espace: 8 });
    paragraphe(aide.rassurance, { couleur: BLEU, taille: 10 });
    point.actions.forEach((action) => paragraphe(`- ${action}`, { taille: 10, espace: 7 }));
    paragraphe(`Question à poser : ${aide.question}`, { taille: 10 });
    paragraphe(`Vous aurez avancé lorsque : ${aide.resultatAttendu}`, { police: gras, taille: 10 });
    paragraphe(`Formalisation : ${point.effetReel}`, { taille: 9, espace: 20 });
  }

  titre("Vos reperes de temps");
  paragraphe("Ces repères ne sont pas des délais imposés pour agir. L’âge et l’année saisis ne donnent pas le jour exact : faites confirmer la date pertinente avant une opération. Un délai fiscal ne règle pas à lui seul les effets civils d’une donation.");
  for (const repere of resultat.dates) {
    const delai = repere.moisRestants === null
      ? "A calculer selon les informations disponibles"
      : repere.moisRestants < 0
        ? `Repere passe depuis environ ${Math.abs(repere.moisRestants)} mois`
        : repere.moisRestants === 0
          ? "Repere atteint cette annee"
          : `Environ ${repere.moisRestants} mois restants`;
    paragraphe(`${repere.libelle.replace(/Votre abattement (?:revient|redevient) plein/, "Renouvellement possible de l'abattement")} - ${delai}. Reference : ${repere.article}.`, { police: gras, couleur: BLEU, espace: 4 });
    if (repere.note) paragraphe(repere.note, { taille: 9, espace: 10 });
  }

  titre("Votre ordre de preparation");
  planPreparation(d).forEach((etape, index) => paragraphe(`${index + 1}. ${etape}`, { police: index === 0 ? gras : normal, couleur: BLEU, espace: 9 }));

  titre("Votre dossier pour le professionnel");
  dossierProfessionnel(d).forEach((piece) => paragraphe(`- ${piece}`, { taille: 9, espace: 6 }));

  nouvellePage();
  titre("Vos questions pour obtenir une réponse utile");
  paragraphe("Apportez cette liste au rendez-vous. Pour chaque question, demandez une réponse liée à vos actes et notez la pièce qui la confirme. Vous n’avez pas besoin de maîtriser les termes juridiques pour commencer.");
  questionsSituation(d).forEach((question, index) => {
    verifierPlace(110);
    paragraphe(`${index + 1}. ${question}`, { police: gras, couleur: BLEU });
    paragraphe("Réponse / pièce à obtenir : ................................................................................", { taille: 9, espace: 16 });
  });
  titre("Comparer avant de choisir");
  paragraphe("Demandez au professionnel de comparer le maintien de la situation actuelle et les solutions qu’il juge adaptées. Ne retenez pas une option uniquement pour un gain fiscal annoncé.");
  for (const question of ["Qui conserve la propriété, l’usage et le pouvoir de décider ?", "Quels frais immédiats, obligations et conséquences pour les autres personnes ?", "Qu’est-ce qui reste modifiable, et qu’est-ce qui devient irréversible ?", "Quelle pièce ou quel acte donnera effet à la solution retenue ?"]) paragraphe(`- ${question}`);

  nouvellePage();
  titre("Votre suivi après le rendez-vous");
  paragraphe("Reprenez vos trois premières démarches ci-dessous. Si une réponse manque, notez qui la fournira. Une demande envoyée et une réponse confirmée sont deux étapes différentes.");
  planPreparation(d).slice(0, 3).forEach((action, index) => {
    verifierPlace(175);
    paragraphe(`Démarche ${index + 1} - ${action}`, { police: gras, couleur: BLEU });
    paragraphe("Interlocuteur / pièce demandée : ...................................................................", { taille: 9 });
    paragraphe("À demander / demandé / reçu / vérifié : ........................................................", { taille: 9 });
    paragraphe("Prochaine étape convenue : ...........................................................................", { taille: 9, espace: 20 });
  });
  paragraphe("Actualisez votre plan après un changement familial, patrimonial ou contractuel important. Conservez l’ancienne version pour distinguer ce qui a changé ; ne partagez votre lien personnel d’accès avec personne.");

  nouvellePage();
  titre("Hypotheses et limites");
  if (resultat.hypotheses.length) resultat.hypotheses.forEach((hypothese) => paragraphe(`- ${hypothese}`, { taille: 9, espace: 7 }));
  else paragraphe("Aucune hypothèse complémentaire n'a été ajoutée au calcul.");
  paragraphe("Avant toute décision ou opération, faites vérifier votre situation, les actes existants, le régime matrimonial et les règles en vigueur par le professionnel compétent.", { police: gras, couleur: BLEU, espace: 0 });
  paragraphe("Références officielles à vérifier au moment de la démarche : service-public.fr/particuliers/vosdroits/F16670 (protection future) et service-public.fr/particuliers/vosdroits/F1296 (indivision successorale).", { taille: 8, espace: 0 });
  paragraphe("Pour les droits du partenaire de PACS : www.service-public.gouv.fr/particuliers/vosdroits/F1621. Les références permettent de retrouver le cadre général ; l’analyse de vos actes reste nécessaire.", { taille: 9, espace: 14 });
  verifierPlace(170);
  y -= 20;
  paragraphe("INFORMATIONS IMPORTANTES", { police: gras, taille: 9 });
  paragraphe("Ce document est un outil d’information générale et de préparation établi à partir de vos déclarations. Il ne constitue ni un conseil en investissement, ni une recommandation personnalisée d’achat ou de vente d’un instrument financier, ni une consultation juridique, fiscale ou patrimoniale individualisée. Les estimations reposent sur les hypothèses indiquées ; elles ne garantissent ni une économie, ni un résultat fiscal ou successoral. Ce plan n’établit aucun acte juridique et ne remplace pas l’examen de votre situation par un notaire, un avocat ou un autre professionnel habilité. Avant toute signature, placement, donation ou modification de contrat, faites confirmer les règles en vigueur, les données et les conséquences de l’opération. En cas d’échéance urgente, contactez directement le professionnel compétent.", { taille: 8.5, espace: 10 });

  document.setTitle("Mon plan personnalisé - Héritage Intact");
  document.setAuthor("Héritage Intact");
  document.setSubject("Résultat personnalisé de simulation indicative");
  return document.save();
}
