import { notFound, redirect } from "next/navigation";
import { adminConfigure, sessionAdminOuverte } from "./session";

/**
 * À APPELER EN PREMIÈRE LIGNE DE CHAQUE PAGE DU PANEL.
 *
 * Pas dans le layout : sous le routeur d'application, un layout peut ne pas
 * être ré-exécuté à chaque rendu de page, et une garde qui ne s'exécute pas est
 * une garde absente. Répéter un appel d'une ligne coûte moins cher qu'une fuite
 * silencieuse d'adresses email.
 *
 * Sans `ADMIN_PASSWORD`, la réponse est un 404 et non une page « panel non
 * configuré » : sur une installation où le panel n'est pas monté, l'adresse
 * doit se comporter exactement comme une adresse qui n'existe pas.
 */
export async function exigerAdmin(): Promise<void> {
  if (!adminConfigure()) notFound();
  if (!(await sessionAdminOuverte())) redirect("/admin/connexion");
}
