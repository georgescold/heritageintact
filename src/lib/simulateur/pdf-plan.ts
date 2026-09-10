import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { calculer } from "./moteur";
import { donneesVersSaisie, planPreparation, type DonneesSimulation } from "./donnees";

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

export async function genererPlanPersonnalisePdf(d: DonneesSimulation, date = new Date()) {
  const document = await PDFDocument.create();
  const normal = await document.embedFont(StandardFonts.Helvetica);
  const gras = await document.embedFont(StandardFonts.HelveticaBold);
  const saisie = donneesVersSaisie(d);
  const resultat = calculer(saisie, date.getFullYear());
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
    const taille = options.taille ?? 10;
    const police = options.police ?? normal;
    const hauteur = taille * 1.35;
    const ls = lignes(texte, police, taille, largeur);
    verifierPlace(ls.length * hauteur + (options.espace ?? 8));
    for (const ligne of ls) {
      page.drawText(ligne, { x: marge, y, size: taille, font: police, color: options.couleur ?? GRIS });
      y -= hauteur;
    }
    y -= options.espace ?? 8;
  };
  const titre = (texte: string) => {
    verifierPlace(155);
    y -= 6;
    page.drawRectangle({ x: marge, y: y - 4, width: 5, height: 24, color: ORANGE });
    page.drawText(compatiblePdf(texte), { x: marge + 14, y, size: 16, font: gras, color: BLEU });
    y -= 34;
  };
  const valeur = (libelle: string, contenu: string) => {
    verifierPlace(24);
    page.drawText(compatiblePdf(libelle), { x: marge, y, size: 9, font: normal, color: GRIS });
    page.drawText(compatiblePdf(contenu), { x: marge + 240, y, size: 10, font: gras, color: BLEU });
    y -= 20;
  };

  nouvellePage();
  page.drawRectangle({ x: marge, y: y - 145, width: largeur, height: 145, color: CLAIR });
  page.drawText("MON PLAN PERSONNALISE", { x: marge + 24, y: y - 42, size: 24, font: gras, color: BLEU });
  page.drawText("Votre simulation et votre ordre de preparation", { x: marge + 24, y: y - 72, size: 13, font: normal, color: ORANGE });
  page.drawText(`Genere le ${date.toLocaleDateString("fr-FR")}`, { x: marge + 24, y: y - 108, size: 10, font: normal, color: GRIS });
  y -= 175;
  paragraphe("Ce document fige les informations que vous avez saisies et le résultat pédagogique correspondant. Conservez-le pour préparer vos questions et comparer les éléments à faire confirmer.", { taille: 11, couleur: BLEU, espace: 18 });

  titre("1. Votre situation saisie");
  valeur("Age", `${d.age} ans`);
  valeur("Situation", situation(d.vie));
  valeur("Residence principale", argent(d.residence));
  valeur("Autres biens immobiliers", argent(d.immobilier));
  valeur("Epargne, titres et autres biens", argent(d.epargne + d.titres + d.autres));
  valeur("Dettes indiquees", argent(d.dettes));
  valeur("Masse nette modelisee", argent(resultat.masse));
  valeur("Personnes modelisees", String(resultat.parts.length));
  valeur("Assurance-vie avant / apres 70 ans", `${argent(d.avAvant)} / ${argent(d.avApres)}`);
  valeur("Derniere donation declaree", d.donationAnnee ? `${d.donationAnnee} - ${argent(d.donationMontant)}` : "Aucune indiquee");

  titre("2. Votre estimation pedagogique");
  verifierPlace(88);
  page.drawRectangle({ x: marge, y: y - 62, width: largeur, height: 70, color: VERT_CLAIR });
  page.drawText("Estimation totale du cas modelise", { x: marge + 18, y: y - 18, size: 11, font: normal, color: BLEU });
  page.drawText(argent(resultat.total), { x: marge + 18, y: y - 48, size: 22, font: gras, color: BLEU });
  y -= 88;
  paragraphe("Cette estimation dépend exclusivement de vos réponses et des hypothèses affichées plus loin. Elle ne constitue ni un devis notarial, ni une économie promise, ni un conseil fiscal personnalisé.", { taille: 9 });

  if (resultat.parts.length) {
    titre("3. Detail par beneficiaire modelise");
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

  titre("4. Vos reperes de temps");
  for (const repere of resultat.dates) {
    const delai = repere.moisRestants === null
      ? "A calculer selon les informations disponibles"
      : repere.moisRestants < 0
        ? `Repere passe depuis environ ${Math.abs(repere.moisRestants)} mois`
        : repere.moisRestants === 0
          ? "Repere atteint cette annee"
          : `Environ ${repere.moisRestants} mois restants`;
    paragraphe(`${repere.libelle} - ${delai}. Reference : ${repere.article}.`, { police: gras, couleur: BLEU, espace: 4 });
    if (repere.note) paragraphe(repere.note, { taille: 9, espace: 10 });
  }

  titre("5. Votre ordre de preparation");
  planPreparation(d).forEach((etape, index) => paragraphe(`${index + 1}. ${etape}`, { police: index === 0 ? gras : normal, couleur: BLEU, espace: 9 }));

  titre("6. Hypotheses et limites");
  if (resultat.hypotheses.length) resultat.hypotheses.forEach((hypothese) => paragraphe(`- ${hypothese}`, { taille: 9, espace: 7 }));
  else paragraphe("Aucune hypothèse complémentaire n'a été ajoutée au calcul.");
  paragraphe("Avant toute décision ou opération, faites vérifier votre situation, les actes existants, le régime matrimonial et les règles en vigueur par le professionnel compétent.", { police: gras, couleur: BLEU, espace: 0 });

  document.setTitle("Mon plan personnalisé - Héritage Intact");
  document.setAuthor("Héritage Intact");
  document.setSubject("Résultat personnalisé de simulation pédagogique");
  document.setCreationDate(date);
  return document.save();
}
