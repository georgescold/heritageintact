import { permanentRedirect } from "next/navigation";

/**
 * LA FAQ A REJOINT LE BAS DE LA PAGE DE MARQUE.
 *
 * Décidé le 12/09/2026 : depuis le header, « Questions fréquentes » descend sur
 * la page plutôt que d'en ouvrir une autre. Les douze réponses vivent donc
 * désormais dans `content/faq.tsx`, affichées par la racine.
 *
 * Cette adresse ne disparaît pas pour autant. Elle a été mise en ligne et
 * indexée : la laisser tomber en 404 perdrait le référencement acquis et
 * casserait tout lien déjà partagé. Une redirection permanente transmet ce
 * référencement à l'ancre de la racine, et ne coûte rien.
 *
 * ⚠️ Elle est sortie de `CHEMINS_INDEXABLES` en même temps : garder deux
 * adresses indexées portant les mêmes douze réponses les ferait se
 * cannibaliser, et c'est exactement ce que la page de marque doit éviter.
 */
export default function AncienneFaq() {
  permanentRedirect("/#questions");
}
