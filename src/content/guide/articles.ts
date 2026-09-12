/**
 * LE SOMMAIRE DE LA SECTION EDITORIALE.
 *
 * Une page éditoriale existe à trois endroits, et les trois doivent s'accorder :
 *
 *   1. sa route        `src/app/guide/<slug>/page.tsx`
 *   2. son indexation  `CHEMINS_INDEXABLES` dans `src/lib/seo.ts`
 *   3. son entrée ici  — ce qui la rend visible depuis `/guide` et la racine
 *
 * Les trois sont volontairement séparés. Un article peut ainsi être écrit et
 * relu (route seule), puis listé pour les lecteurs (ici), puis seulement
 * proposé à Google (liste blanche) — dans cet ordre, jamais l'inverse.
 *
 * ⚠️ Un article absent de cette liste reste accessible par son adresse : c'est
 * voulu, c'est ce qui permet de le faire relire avant publication. Il ne sera
 * simplement listé nulle part.
 *
 * ⚠️ `date` est la date de publication, au format ISO. Elle sert à l'ordre
 * d'affichage — le plus récent en premier — et à rien d'autre.
 */
export type Article = {
  slug: string;
  titre: string;
  chapo: string;
  date: string;
};

const TOUS: Article[] = [
  {
    slug: "usufruit-nue-propriete-indivision",
    titre: "Usufruit et nue-propriété en indivision : qui décide quoi",
    chapo:
      "Ce que vous créez en donnant la nue-propriété de votre maison à vos enfants : qui décide, qui paie les grosses réparations, et ce qui se passe à votre décès.",
    date: "2026-09-12",
  },
  {
    slug: "vendre-maison-usufruit-nue-propriete",
    titre: "Vendre une maison en usufruit et nue-propriété : qui peut, et qui touche l’argent",
    chapo:
      "Après une donation avec réserve d’usufruit, trois ventes différentes sont possibles et n’exigent pas les mêmes accords. Comment le prix se répartit, et les deux façons de reporter l’usufruit au lieu de l’encaisser.",
    date: "2026-09-12",
  },
  {
    slug: "usufruit-travaux-charges",
    titre: "Usufruit et nue-propriété : qui paie les travaux, la taxe foncière et les charges",
    chapo:
      "La répartition des articles 605, 606 et 608 ligne par ligne — et ce qu’elle produit le jour où la toiture est à refaire : la charge est écrite, l’obligation de l’exécuter ne l’est pas.",
    date: "2026-09-12",
  },
];

/** Du plus récent au plus ancien. L'ordre d'écriture dans le tableau ne compte pas. */
export const ARTICLES: readonly Article[] = [...TOUS].sort((a, b) => b.date.localeCompare(a.date));
