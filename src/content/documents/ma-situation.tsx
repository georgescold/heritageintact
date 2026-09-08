import { Case, Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";
import type { ProfilDocument } from "@/lib/methode";
import { codeUtile } from "@/lib/qualification";

/**
 * LA GRILLE « QUELLE EST MA SITUATION ? » — les 12 cases.
 *
 * ⚠️ Cette feuille désigne le point d'attention principal de chaque situation.
 * Elle ne donne AUCUN plan d'action personnalisé : ce serait un conseil, et
 * c'est aussi ce que Le Plan adapté à votre famille contient. La frontière est
 * volontaire et elle doit le rester — une grille qui déciderait à la place du
 * lecteur ferait deux dégâts d'un coup, l'un juridique, l'autre commercial.
 *
 * ⚠️ L'ORDRE DE CETTE LISTE EST UN CONTRAT AVEC LE CLASSEUR, PAS UN CHOIX DE
 * RÉDACTION. Le lecteur écrit ici « Ma situation est la n° ___ », puis il va
 * chercher l'onglet correspondant : le rang de chaque case DOIT être celui du
 * plan-type qui porte le même numéro (plan-marie-1-enfant = 1 … plan-donations-
 * deja-faites = 12). Cette grille numérotait « Concubins » 5 et « Pacsés » 6
 * alors qu'un seul plan-type couvre les deux (Situation 5 — Concubins ou
 * pacsés), et il lui manquait « Patrimoine supérieur à 1 million », qui existe
 * en Situation 11 : tout le reste de la liste était décalé d'un cran, et le
 * lecteur pacsé qui écrivait 6 tombait sur « Sans enfant ». Avant d'ajouter,
 * de retirer ou de déplacer une case ici, vérifier les douze titres
 * `titre="Situation N — …"` des fichiers plan-*.tsx.
 *
 * ═══ LA CASE PRÉ-COCHÉE ═══
 *
 * Quand l'acheteur a répondu aux questions du bon de commande, une case — une
 * seule — sort déjà cochée. C'est la contrepartie visible de ces questions, et
 * sans elle les questions sont un péage : on aurait demandé quelque chose sans
 * rien rendre, à quelqu'un qui vient de payer et qui est méfiant par
 * construction.
 *
 * ⚠️ ON PRÉ-COCHE, ON N'ORIENTE PAS. La feuille ne dit nulle part « votre
 * situation est la n° 3 », ni « nous avons analysé votre cas » : elle coche une
 * case au crayon, à la place du lecteur, et lui dit qu'il peut la corriger.
 * Une case fausse est plus grave qu'une case vide — d'où le premier match
 * gagnant sur une liste courte, et AUCUNE case cochée dès qu'un doute existe.
 */

const SITUATIONS: { titre: string; attention: string }[] = [
  {
    titre: "Marié, un enfant",
    attention:
      "Le conjoint survivant ne paie aucun droit. L'enfant, si. Le point à vérifier est l'existence d'une donation au dernier vivant.",
  },
  {
    titre: "Marié, deux enfants ou plus",
    attention:
      "Chaque enfant a son propre abattement de 100 000 € par parent. Le partage entre eux se prépare de son vivant, sinon il se règle après.",
  },
  {
    titre: "Famille recomposée",
    attention:
      "Un enfant du conjoint sans lien de filiation n'est pas un héritier en ligne directe : le taux applicable au-delà de son abattement est de 60 %.",
  },
  {
    titre: "Veuf ou veuve",
    attention:
      "Tout ce qui restait à décider à deux se décide désormais seul, et le compteur des 15 ans ne se recharge plus que d'un côté.",
  },
  {
    titre: "Concubins ou pacsés",
    attention:
      "Sans mariage ni PACS, l'abattement est de 1 594 € et le taux de 60 % : c'est la situation la plus lourdement taxée du barème. Le partenaire de PACS, lui, est exonéré — mais à condition qu'un testament le désigne, car le PACS seul ne fait pas hériter.",
  },
  {
    titre: "Sans enfant",
    attention:
      "Les héritiers sont alors les frères et sœurs, puis les neveux et nièces (55 %), puis les parents plus éloignés (60 %).",
  },
  {
    titre: "Avec une entreprise ou des parts",
    attention:
      "Un régime d'exonération partielle existe (pacte Dutreil), mais il est technique, conditionné dans le temps, et il a été modifié récemment.",
  },
  {
    titre: "Avec de l'immobilier locatif",
    attention:
      "La question n'est pas la valeur des murs mais le mode de détention : en direct, en indivision ou en société, les conséquences diffèrent.",
  },
  {
    titre: "Un enfant à l'étranger",
    attention:
      "Sa résidence fiscale et la convention conclue avec son pays peuvent changer le traitement de sa part.",
  },
  {
    titre: "Un enfant vulnérable ou handicapé",
    attention:
      "Un abattement spécifique existe, cumulable avec les autres, et des dispositifs de protection dans la durée méritent d'être examinés.",
  },
  {
    titre: "Patrimoine supérieur à 1 million",
    attention:
      "Un seul levier ne suffit plus : les tranches à 20 % puis à 30 % du barème se remplissent, et l'ordre dans lequel les gestes sont faits change le résultat.",
  },
  {
    titre: "Des donations déjà faites",
    attention:
      "La date de chacune commande tout : moins de 15 ans, elle se recompte ; au-delà, elle est effacée du calcul.",
  },
];

/**
 * LES SEPT RÈGLES DE PRÉ-COCHAGE, DANS L'ORDRE. PREMIER MATCH GAGNANT.
 *
 * L'ordre n'est pas alphabétique et il n'est pas négociable : il classe les
 * situations par gravité de la conséquence fiscale, pas par fréquence.
 *
 *   · « des enfants d'une autre union » passe avant « veuf » : une veuve dont
 *     un enfant vient d'une autre union est d'abord une famille recomposée,
 *     parce que c'est là qu'un héritier sort du barème de la ligne directe.
 *   · concubins et pacsés passent avant tout le reste : 60 % au-delà de
 *     1 594 €, c'est la ligne la plus lourde du barème français.
 *   · « marié ou seul » avec un ou plusieurs enfants vient en dernier : c'est
 *     le cas le plus courant, et le moins urgent.
 *
 * ⚠️ LES SITUATIONS 7 À 12 N'ONT AUCUNE RÈGLE, ET C'EST DÉLIBÉRÉ. Elles
 * dépendent de faits qu'on ne demande pas en ligne : une entreprise, un
 * locatif, un enfant expatrié, un patrimoine, des donations déjà faites — et
 * surtout, pour la n° 10, un enfant vulnérable ou handicapé, qui est une donnée
 * de santé relative à un tiers qui n'a consenti à rien (RGPD art. 9). Cette
 * question-là ne se pose JAMAIS sur un bon de commande. Elle reste sur cette
 * feuille, que le lecteur coche lui-même, dans son salon.
 */
const REGLES: { quand: (p: ProfilDocument) => boolean; situation: number }[] = [
  { quand: (p) => p.enfants === "R", situation: 3 },
  { quand: (p) => p.vie === "U", situation: 5 },
  { quand: (p) => p.vie === "P", situation: 5 },
  { quand: (p) => p.vie === "V", situation: 4 },
  { quand: (p) => p.enfants === "0", situation: 6 },
  { quand: (p) => (p.vie === "M" || p.vie === "S") && p.enfants === "1", situation: 1 },
  { quand: (p) => (p.vie === "M" || p.vie === "S") && p.enfants === "2", situation: 2 },
];

/** Les numéros qu'une règle peut cocher. Le reste ne se pré-coche jamais. */
const PRECOCHABLES = new Set(REGLES.map((r) => r.situation));

/**
 * LE NUMÉRO DE LA CASE À PRÉ-COCHER, ou `null` — et `null` est le cas normal.
 *
 * Les codes passent tous par `codeUtile` : « X » (« Je préfère ne pas
 * répondre ») et l'absence de réponse sont strictement équivalents, ici comme
 * dans le routage du tunnel. Un code inconnu — une vieille ligne en base, une
 * faute de frappe — ne déclenche donc rien non plus.
 */
function situationPrecochee(profil: ProfilDocument | undefined): number | null {
  if (!profil) return null;

  const p: ProfilDocument = {
    vie: codeUtile(profil.vie),
    enfants: codeUtile(profil.enfants),
    av: codeUtile(profil.av),
    age: codeUtile(profil.age),
  };

  return REGLES.find((r) => r.quand(p))?.situation ?? null;
}

/**
 * La case à cocher au stylo. Cochée, elle porte une croix noire pleine : le
 * document part sur une imprimante à jet d'encre en noir et blanc, et un aplat
 * de gris ne survit ni à la photocopie ni à un niveau d'encre bas.
 */
function Carre({ cochee }: { cochee: boolean }) {
  if (!cochee) {
    return (
      <span aria-hidden className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black" />
    );
  }
  return (
    <span
      aria-hidden
      className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center border-2 border-black text-[13px] font-bold leading-none"
    >
      ✕
    </span>
  );
}

export function MaSituation({ profil }: { profil?: ProfilDocument }) {
  const precochee = situationPrecochee(profil);

  // « Seul(e) aujourd'hui » coché sur une case qui parle du conjoint : la
  // moitié de la ligne ne le concerne pas, et il faut le lui dire là où il
  // lit, pas dans une note de bas de page.
  const seul = codeUtile(profil?.vie) === "S";

  // Les numéros jamais pré-cochés sont contigus (7 à 12) par construction de la
  // grille. Si une règle venait à en couvrir un au milieu, cette phrase
  // deviendrait fausse : la recalculer, ou l'écrire en liste.
  const jamais = SITUATIONS.map((_, i) => i + 1).filter((n) => !PRECOCHABLES.has(n));
  const premierJamais = jamais[0];
  const dernierJamais = jamais[jamais.length - 1];

  return (
    <Feuille
      titre="Quelle est ma situation ?"
      sousTitre="Cochez la vôtre. Vous pouvez en cocher deux — beaucoup de familles sont dans ce cas."
    >
      <p>
        Chaque situation a son point d&apos;attention principal. Il ne remplace pas un examen de
        votre dossier : il vous dit sur quoi porter la première question, chez le notaire.
      </p>

      <ul className="divide-y divide-black border-y border-black">
        {SITUATIONS.map((s, i) => {
          const cochee = precochee === i + 1;
          return (
            <li key={s.titre} className="flex min-h-[44px] items-start gap-3 py-2">
              <Carre cochee={cochee} />
              <div>
                <p className="font-bold">
                  {i + 1}. {s.titre}
                </p>
                <p className="text-[0.95rem]">{s.attention}</p>
                {cochee && seul && (
                  <p className="text-[0.95rem]">
                    Vous nous avez indiqué vivre seul aujourd&apos;hui : la partie conjoint ne vous
                    concerne pas.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Les deux phrases n'apparaissent que si une case est pré-cochée. Sans
          réponse, la feuille est celle d'aujourd'hui, au mot près : « nous ne
          vous les avons pas demandées » n'a aucun sens quand on n'a rien
          demandé du tout. */}
      {precochee !== null && (
        <div className="space-y-1 text-[0.95rem]">
          <p>
            La case cochée l&apos;a été d&apos;après les réponses données au bon de commande.
            Barrez-la et cochez la bonne si elle ne correspond pas : c&apos;est votre feuille.
          </p>
          <p>
            Les situations {premierJamais} à {dernierJamais}, nous ne vous les avons pas demandées.
            Cochez-les vous-même si elles vous concernent.
          </p>
        </div>
      )}

      <Titre>Ce que j&apos;en retiens</Titre>
      <Champ label="Ma situation est la n°" />
      <Champ label="La première question que je poserai au notaire" />

      <Encadre>
        <p className="text-[0.93rem]">
          Les abattements et les taux cités sont ceux en vigueur à la date de production de cette
          méthode et s&apos;appliquent par héritier. Ils changent selon les lois de finances.
          Vérifiez-les sur impots.gouv.fr, et faites examiner votre situation par votre notaire
          avant toute décision.
        </p>
      </Encadre>

      <Titre>Ce soir, faites ceci</Titre>
      <ul className="space-y-1">
        <Case>J&apos;ai coché ma case, et celle de mon conjoint si elle diffère.</Case>
        <Case>J&apos;ai écrit ma première question sur la feuille des questions au notaire.</Case>
      </ul>
    </Feuille>
  );
}
