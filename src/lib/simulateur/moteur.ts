import {
  ABATTEMENTS,
  ASSURANCE_VIE,
  BAREME_FRATRIE,
  BAREME_LIGNE_DIRECTE,
  RECHARGEMENT_ANS,
  TAUX_NEVEU,
  TAUX_SANS_LIEN,
  droits,
} from "./bareme";
import type { DateButoir, Heritier, PartHeritier, Resultat, Saisie } from "./types";

/**
 * LE MOTEUR. Module pur : aucune dépendance à React, aucun effet de bord,
 * aucune lecture d'horloge cachée — l'année de référence est un paramètre.
 * C'est ce qui permet de le vérifier à la main, et c'est vérifié plus bas.
 *
 * ═══ Les hypothèses, et pourquoi elles sont affichées
 *
 * Un simulateur qui rend un chiffre sans dire ce qu'il a supposé est un
 * simulateur qu'on ne peut pas contredire — donc auquel on ne peut pas se fier.
 * Chaque simplification est empilée dans `hypotheses` et sort avec le résultat.
 *
 * ═══ Ce que ce moteur ne fait PAS, délibérément
 *
 * Il calcule la succession au SECOND décès, celui qui coûte. Entre époux et
 * partenaires de PACS il n'y a aucun droit (art. 796-0 bis) : le premier décès
 * ne produit pas de facture, il concentre le patrimoine sur une seule tête. Le
 * chiffre qui compte est donc celui d'après, et c'est celui qu'on rend.
 */

const ARTICLE: Record<Heritier["lien"], string> = {
  enfant: "art. 779 I",
  "petit-enfant": "art. 790 B",
  fratrie: "art. 779 IV",
  neveu: "art. 779 V",
  "sans-lien": "art. 788 IV",
};

function abattementDe(h: Heritier): { montant: number; article: string } {
  // L'enfant du conjoint non adopté n'est PAS un héritier en ligne directe :
  // il relève du régime des personnes sans lien de parenté. C'est la situation
  // la plus douloureuse du sujet, et celle qu'un simulateur ne doit surtout pas
  // lisser — un bel-enfant compté comme un enfant afficherait un chiffre faux
  // de plusieurs dizaines de milliers d'euros, dans le sens rassurant.
  const base = h.duConjointNonAdopte
    ? { montant: ABATTEMENTS.sansLien, article: "art. 788 IV" }
    : { montant: ABATTEMENTS[cle(h.lien)], article: ARTICLE[h.lien] };
  if (!h.handicap) return base;
  return {
    montant: base.montant + ABATTEMENTS.handicap,
    article: `${base.article} et art. 779 II`,
  };
}

const cle = (l: Heritier["lien"]) =>
  l === "petit-enfant" ? "petitEnfant" : l === "sans-lien" ? "sansLien" : l;

function baremeDe(h: Heritier) {
  if (h.duConjointNonAdopte) return null; // taux unique de 60 %
  if (h.lien === "enfant" || h.lien === "petit-enfant") return BAREME_LIGNE_DIRECTE;
  if (h.lien === "fratrie") return BAREME_FRATRIE;
  return null; // neveu et sans-lien : taux unique
}

function tauxUniqueDe(h: Heritier): number {
  if (h.duConjointNonAdopte) return TAUX_SANS_LIEN;
  return h.lien === "neveu" ? TAUX_NEVEU : TAUX_SANS_LIEN;
}

export function calculer(s: Saisie, anneeCourante: number): Resultat {
  const hypotheses: string[] = [];

  // ── LA MASSE ────────────────────────────────────────────────────
  /**
   * ⚠️ UN BIEN COMMUN COMPTE EN ENTIER, et c'est contre-intuitif.
   *
   * On serait tenté de n'en retenir que la moitié — l'autre appartenant au
   * conjoint. C'est juste au PREMIER décès. Or ce moteur calcule le SECOND,
   * celui qui produit la facture : entre-temps le survivant a recueilli la
   * moitié de l'autre sans payer un euro (art. 796-0 bis), et le bien entier
   * se trouve alors sur une seule tête.
   *
   * Diviser par deux ici afficherait un chiffre deux fois trop bas, dans le
   * sens rassurant — exactement le sens qui coûte cher : le lecteur conclurait
   * qu'il n'est pas concerné, et découvrirait l'inverse le jour où il ne peut
   * plus rien changer.
   *
   * ⚠️ Le cas nommé ci-dessous en test — 380 000 € + 120 000 € — n'est PAS le
   * cas canonique du projet. Celui-ci est 480 000 € de maison + 40 000 €
   * d'épargne = 520 000 €, et il donne 82 194 € : c'est lui qu'emploient la
   * page de vente, le Simulateur papier et les huit vidéos. Le jeu à
   * 500 000 € ne sert qu'à éprouver le barème sur une seconde valeur.
   */
  const brut = s.biens.reduce((n, b) => n + b.valeur, 0);
  const dettes = Number.isFinite(s.dettes) ? Math.max(0, s.dettes ?? 0) : 0;
  const masse = Math.max(0, brut - dettes);
  if (dettes > 0) {
    hypotheses.push(
      "Les dettes saisies sont retranchées à titre indicatif. Leur déductibilité et leur montant au décès doivent être confirmés.",
    );
  }
  if (s.biens.some((b) => b.enCommun)) {
    hypotheses.push(
      "Les biens détenus en commun sont comptés en entier : le calcul porte sur le second décès, celui où tout se retrouve sur une seule tête. Votre régime matrimonial exact peut modifier ce partage — votre notaire est seul à pouvoir le trancher.",
    );
  }

  const heritiers = s.heritiers.length ? s.heritiers : [];
  if (!heritiers.length) {
    return { masse, parts: [], total: 0, dates: datesButoir(s, anneeCourante), hypotheses };
  }

  // ── LE PARTAGE ──────────────────────────────────────────────────
  // À parts égales. La réserve héréditaire et la quotité disponible peuvent
  // modifier ce partage : on le dit, on ne le devine pas.
  const part = masse / heritiers.length;
  if (heritiers.length > 1) {
    hypotheses.push(
      "Le partage est calculé à parts égales entre les héritiers. Un testament ou une donation-partage peut le modifier.",
    );
  }
  hypotheses.push(
    "Le calcul porte sur le second décès, celui qui produit la facture : entre époux et partenaires de PACS, aucun droit n'est dû (art. 796-0 bis).",
  );

  // ── L'ASSURANCE-VIE, HORS SUCCESSION ────────────────────────────
  const avAvant = s.contrats.reduce((n, c) => n + c.verseAvant70, 0);
  const avApres = s.contrats.reduce((n, c) => n + c.verseApres70, 0);
  const beneficiaires = Math.max(
    1,
    s.contrats.reduce((n, c) => Math.max(n, c.beneficiaires), 0) || heritiers.length,
  );

  // Article 990 I : l'abattement est PAR BÉNÉFICIAIRE.
  const taxableAvant = Math.max(0, avAvant / beneficiaires - ASSURANCE_VIE.avant70ParBeneficiaire);
  const droitsAvant =
    (Math.min(taxableAvant, ASSURANCE_VIE.avant70Seuil2) * ASSURANCE_VIE.avant70Taux1 +
      Math.max(0, taxableAvant - ASSURANCE_VIE.avant70Seuil2) * ASSURANCE_VIE.avant70Taux2) *
    beneficiaires;

  // Article 757 B : 30 500 € AU TOTAL, tous contrats et bénéficiaires confondus,
  // puis le barème ordinaire. C'est ici que se joue le facteur cinq.
  const taxableApres = Math.max(0, avApres - ASSURANCE_VIE.apres70Global);
  if (avApres > 0) {
    hypotheses.push(
      "Les primes versées après 70 ans partagent un seul abattement de 30 500 €, tous contrats et tous bénéficiaires confondus (art. 757 B), puis suivent le barème ordinaire.",
    );
  }
  if (s.donations.length) {
    hypotheses.push(
      "Les donations déclarées servent ici à repérer le délai de quinze ans. Leur effet exact sur les abattements et le rapport civil n’est pas déduit automatiquement : faites vérifier les actes et déclarations.",
    );
  }

  // ── PAR HÉRITIER ────────────────────────────────────────────────
  const parts: PartHeritier[] = heritiers.map((h) => {
    const ab = abattementDe(h);
    const base = Math.max(0, part + taxableApres / heritiers.length - ab.montant);
    const bar = baremeDe(h);
    const d = bar ? droits(base, bar) : { lignes: [], total: base * tauxUniqueDe(h) };
    return {
      heritier: h,
      part,
      abattement: ab.montant,
      abattementArticle: ab.article,
      base,
      lignes: d.lignes,
      droits: d.total,
      droitsAssuranceVie: droitsAvant / heritiers.length,
    };
  });

  const total = parts.reduce((n, p) => n + p.droits + p.droitsAssuranceVie, 0);
  return { masse, parts, total, dates: datesButoir(s, anneeCourante), hypotheses };
}

/**
 * LES 3 DATES DU CLIENT.
 *
 * Rend des mois, pas des dates civiles : on ne demande jamais sa date de
 * naissance exacte — un âge suffit, et une question de moins est une question
 * de moins.
 */
export function datesButoir(s: Saisie, anneeCourante: number): DateButoir[] {
  const age = s.age;
  const derniere = s.donations.length ? Math.max(...s.donations.map((d) => d.annee)) : null;

  const quinze: DateButoir = derniere
    ? {
        cle: "quinze-ans",
        libelle: `Votre abattement redevient plein en ${derniere + RECHARGEMENT_ANS}`,
        article: "art. 779 et 784",
        moisRestants: (derniere + RECHARGEMENT_ANS - anneeCourante) * 12,
      }
    : {
        cle: "quinze-ans",
        libelle:
          "Aucune donation déclarée : votre abattement est entier, et le compteur ne court pas encore",
        article: "art. 779 et 784",
        moisRestants: null,
        note: "C'est une bonne nouvelle : les 100 000 € par parent et par enfant sont disponibles aujourd'hui. Le compteur de 15 ans ne démarre qu'au premier don déclaré.",
      };

  const mois = (cible: number) => (age === undefined ? null : (cible - age) * 12);

  return [
    quinze,
    {
      cle: "soixante-dix",
      libelle: "Votre 70e anniversaire — assurance-vie",
      article: "art. 990 I, puis art. 757 B",
      moisRestants: mois(70),
      note:
        age !== undefined && age >= 70
          ? "Cette date est derrière vous : les primes versées désormais relèvent des 30 500 € globaux. Ce qui a été versé avant reste acquis."
          : undefined,
    },
    {
      cle: "soixante-et-onze",
      libelle: "Votre 71e anniversaire — nue-propriété",
      article: "art. 669",
      moisRestants: mois(71),
      note:
        age !== undefined && age >= 71
          ? "Cette date est derrière vous : la nue-propriété est désormais comptée à 70 % au lieu de 60 %. L'opération reste possible et reste avantageuse."
          : undefined,
    },
  ];
}

/**
 * VÉRIFICATION DU MOTEUR sur les deux cas canoniques du projet.
 *
 * Ce n'est pas de la décoration : ces deux nombres sont écrits sur la page de
 * vente, dans la VSL et dans les 9 fiches de tournage. Le jour où le moteur
 * rendrait autre chose, c'est le moteur qui aurait tort, et il faudrait le voir
 * immédiatement plutôt qu'à travers un client qui écrit au support.
 *
 * Appelée par le simulateur au premier rendu, en développement uniquement.
 */
export function verifierMoteur(): { cas: string; attendu: number; obtenu: number; ok: boolean }[] {
  const bareme = (base: number) => Math.round(droits(base).total * 100) / 100;
  return [
    {
      cas: "Julien — 520 000 € moins 100 000 €",
      attendu: 82_194.35,
      obtenu: bareme(420_000),
      ok: bareme(420_000) === 82_194.35,
    },
    {
      cas: "Jean-Pierre — 500 000 € moins 100 000 €",
      attendu: 78_194.35,
      obtenu: bareme(400_000),
      ok: bareme(400_000) === 78_194.35,
    },
  ];
}
