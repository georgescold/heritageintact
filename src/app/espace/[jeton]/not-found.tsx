import { redirect } from "next/navigation";

/**
 * PAS DE 404 SOUS /espace. JAMAIS.
 *
 * La 404 générique du site est écrite pour un visiteur ; ici, la personne qui
 * l'atteindrait a payé. « Cette page n'existe pas » ne se lit pas comme un
 * incident technique sur un homme de 74 ans qui doute déjà d'avoir bien fait :
 * ça se lit comme la confirmation qu'il s'est fait avoir, et ça part en demande
 * de remboursement le jour même.
 *
 * On l'envoie donc là où il y a quelque chose à faire — le formulaire qui lui
 * renvoie son lien. C'est le dernier filet, pour les chemins que les pages
 * elles-mêmes n'ont pas interceptés.
 */
export default function EspaceIntrouvable() {
  redirect("/espace");
}
