import { redirect } from "next/navigation";

/**
 * L'ANCIENNE ADRESSE DE L'ESPACE, CONSERVEE POUR TOUJOURS.
 *
 * La page d'entree des membres vit desormais sur /connexion : c'est le mot que
 * le lecteur emploie lui-meme, et il ne doit pas etre confondu avec la page
 * d'atterrissage publicitaire, qui vit sur / et poursuit un tout autre but.
 *
 * On ne supprime pas cette route pour autant. Des liens sont deja partis par
 * email, des favoris sont deja poses, et un client de 78 ans qui tombe sur une
 * 404 ne reessaie pas : il demande un remboursement. Une redirection permanente
 * coute une ligne et ne s'enleve jamais.
 */
export default function AncienneEntreeEspace() {
  redirect("/connexion");
}
