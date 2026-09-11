import type { ProductSku } from "./config";
import { LECONS } from "./lecons";

/**
 * LE QUESTIONNAIRE D'AVIS DE L'ESPACE MEMBRE.
 *
 * Les questions dépendent de ce que le client possède et du temps écoulé depuis
 * son achat : on ne demande pas à quelqu'un qui a acheté hier si le guide lui a
 * fait repérer une erreur, ni à un client sans plan ce que son plan lui a apporté.
 *
 * ⚠️ AUCUNE RÉPONSE NE CONDITIONNE L'ACCÈS À TRUSTPILOT. Le lien public est
 * proposé à tous, quelle que soit la note : Trustpilot interdit de n'inviter
 * que les clients satisfaits, et le trier ici en ferait un faux avis collectif.
 *
 * Module pur, sans base ni réseau : il est testé tel quel (scripts/test-avis.mjs).
 */

export type QuestionAvis = {
  cle: string;
  libelle: string;
  options: readonly string[];
  /** Porte sur un résultat obtenu : masquée tant que le client n'a pas pu se servir du produit. */
  apresUsage?: boolean;
};
export type SectionAvis = { cle: string; titre: string; questions: QuestionAvis[] };
export type ContexteAvis = {
  possede: ReadonlySet<ProductSku>;
  assuranceVieDeclaree: boolean;
  joursDepuisAchat: number;
};
export type AvisSaisi = { note: number; reponses: Record<string, string>; message: string; publication: boolean };

export const MESSAGE_MAX = 2000;
/** En dessous, le client découvre encore : on lui demande ses premières impressions, pas ses résultats. */
export const DELAI_USAGE_JOURS = 3;

/** Les 7 erreurs telles que le guide les nomme, sans leur numéro. Suivent le guide si ses titres changent. */
const ERREURS = LECONS.filter((l) => l.cle !== "e0").map((l) => l.titre.replace(/^Erreur \d+\s*-\s*/, ""));

/** L'état du membre, réduit à ce qui décide des questions. */
export function contexteAvis(
  e: { possede: ReadonlySet<ProductSku>; profil: { av?: string } | null; acces: { createdAt: string } },
  maintenant = Date.now(),
): ContexteAvis {
  const jours = Math.floor((maintenant - Date.parse(e.acces.createdAt)) / 86_400_000);
  return {
    possede: e.possede,
    assuranceVieDeclaree: e.profil?.av === "O",
    joursDepuisAchat: Number.isFinite(jours) ? Math.max(0, jours) : 0,
  };
}

export function questionnaireAvis(c: ContexteAvis): SectionAvis[] {
  const sections: SectionAvis[] = [];

  if (c.possede.has("front"))
    sections.push({
      cle: "guide",
      titre: "Le guide « Les 7 erreurs »",
      questions: [
        { cle: "guide_lecture", libelle: "Où en êtes-vous dans le guide ?", options: ["Je ne l’ai pas encore commencé", "J’en ai lu une partie", "Je l’ai lu en entier"] },
        { cle: "guide_clarte", libelle: "Les explications étaient-elles faciles à comprendre ?", options: ["Très claires", "Plutôt claires", "Parfois difficiles", "Trop compliquées"] },
        { cle: "guide_erreur", libelle: "Le guide vous a-t-il fait repérer au moins une erreur qui vous concernait ?", options: ["Oui, au moins une", "Pas encore, je n’ai pas fini", "Non"], apresUsage: true },
        { cle: "guide_erreur_marquante", libelle: "Quelle erreur vous a le plus parlé ?", options: [...ERREURS, "Aucune en particulier"], apresUsage: true },
      ],
    });

  if (c.possede.has("bump"))
    sections.push({
      cle: "notaire",
      titre: "Mon Dossier notaire",
      questions: [
        { cle: "notaire_rdv", libelle: "Avez-vous utilisé votre Dossier notaire pour un rendez-vous ?", options: ["Oui, le rendez-vous a eu lieu", "Le rendez-vous est pris", "Pas encore"] },
        { cle: "notaire_utile", libelle: "Quelle partie vous a le plus servi ?", options: ["L’inventaire du patrimoine", "La fiche famille", "La liste des pièces à réunir", "Les questions à poser", "Le compte rendu", "Je ne l’ai pas encore utilisé"], apresUsage: true },
      ],
    });

  if (c.possede.has("upsell1"))
    sections.push({
      cle: "plan",
      titre: "Mon plan adapté à ma situation",
      questions: [
        { cle: "plan_ordre", libelle: "Votre plan vous a-t-il aidé à savoir par quoi commencer ?", options: ["Oui, clairement", "En partie", "Non"], apresUsage: true },
        { cle: "plan_estimation", libelle: "L’estimation et ses hypothèses étaient-elles compréhensibles ?", options: ["Oui", "En partie", "Non", "Je n’ai pas encore terminé le questionnaire"] },
      ],
    });
  else if (c.possede.has("front"))
    // Le seul endroit où l'on apprend pourquoi l'offre principale n'a pas été prise.
    sections.push({
      cle: "plan-non-pris",
      titre: "Mon plan adapté à ma situation",
      questions: [
        { cle: "plan_frein", libelle: "Vous n’avez pas choisi « Mon plan adapté à ma situation ». Qu’est-ce qui vous a retenu ?", options: ["Le prix", "Je n’en ai pas besoin pour l’instant", "Je n’ai pas compris ce qu’il contenait", "Je préfère voir directement mon notaire", "Je le prendrai peut-être plus tard", "Une autre raison"] },
      ],
    });

  if (c.possede.has("upsell2"))
    sections.push({
      cle: "assurance-vie",
      titre: "Faire le point sur mon assurance-vie",
      questions: [
        { cle: "av_clause", libelle: "Avez-vous demandé la clause en vigueur à votre assureur ?", options: ["Oui, j’ai reçu la réponse", "Oui, j’attends la réponse", "Pas encore"] },
        { cle: "av_point", libelle: "Avez-vous repéré un point à faire vérifier dans votre contrat ?", options: ["Oui", "Non", "Je ne sais pas encore"], apresUsage: true },
      ],
    });
  else if (c.assuranceVieDeclaree)
    sections.push({
      cle: "assurance-vie-declaree",
      titre: "Votre assurance-vie",
      questions: [
        { cle: "av_verifiee", libelle: "Vous nous avez indiqué détenir une assurance-vie. Avez-vous déjà vérifié la clause bénéficiaire en vigueur ?", options: ["Oui", "Non", "Je ne sais pas"] },
      ],
    });

  if (c.possede.has("backend4"))
    sections.push({
      cle: "testament",
      titre: "Mon Dossier Testament",
      questions: [
        { cle: "testament_clarte", libelle: "Le Dossier Testament vous a-t-il aidé à clarifier vos volontés ?", options: ["Oui", "En partie", "Pas encore utilisé"], apresUsage: true },
        { cle: "testament_rdv", libelle: "Avez-vous pris rendez-vous pour les faire formaliser ?", options: ["Oui", "Pas encore", "Ce n’est pas prévu"] },
      ],
    });

  sections.push({
    cle: "general",
    titre: "Pour finir",
    questions: [
      { cle: "recommander", libelle: "Recommanderiez-vous Héritage Intact à un proche dans votre situation ?", options: ["Oui, sans hésiter", "Probablement", "Je ne sais pas", "Non"] },
    ],
  });

  const recent = c.joursDepuisAchat < DELAI_USAGE_JOURS;
  return sections
    .map((s) => ({ ...s, questions: s.questions.filter((q) => !(recent && q.apresUsage)) }))
    .filter((s) => s.questions.length > 0);
}

/**
 * Lit un formulaire envoyé. Seule la note est obligatoire ; une réponse n'est
 * gardée que si la question fait partie du questionnaire de CE membre et que
 * l'option existe. Le formulaire est une URL : on ne fait confiance à rien.
 */
export function lireSaisie(
  sections: SectionAvis[],
  form: { get(cle: string): unknown },
): { ok: true; avis: AvisSaisi } | { ok: false; erreur: string } {
  const note = Number(form.get("note"));
  if (!Number.isInteger(note) || note < 1 || note > 5)
    return { ok: false, erreur: "Choisissez une note de 1 à 5 étoiles avant d’envoyer votre avis." };

  const reponses: Record<string, string> = {};
  for (const s of sections)
    for (const q of s.questions) {
      const v = form.get(q.cle);
      if (typeof v === "string" && q.options.includes(v)) reponses[q.cle] = v;
    }

  const brut = form.get("message");
  const message = typeof brut === "string" ? brut.trim().slice(0, MESSAGE_MAX) : "";
  // Un accord de publication sans message ne publierait rien : on ne le garde pas.
  const publication = form.get("publication") === "oui" && message.length > 0;
  return { ok: true, avis: { note, reponses, message, publication } };
}
