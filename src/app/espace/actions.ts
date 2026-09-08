"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accesParJeton, cocherEtape } from "@/lib/db";
import { estJetonValide } from "@/lib/jeton";
import { renvoyerAcces } from "@/lib/livraison";
import { etapeParNumero } from "@/lib/methode";

/**
 * LES DEUX SEULES ÉCRITURES QUE LE MEMBRE DÉCLENCHE LUI-MÊME.
 *
 * Cocher une étape, et redemander son lien. Tout le reste de l'espace est en
 * lecture, ou passe par `achat.ts`.
 *
 * ⚠️ UNE SERVER ACTION EST UNE URL. Elle s'appelle sans passer par l'écran qui
 * la précède : le jeton est donc revalidé ICI, à partir de rien d'autre que ce
 * qui arrive en argument. Ne jamais faire confiance à la page appelante.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * LA CASE « J'AI TERMINÉ CETTE ÉTAPE ».
 *
 * ⚠️ BASCULE EXPLICITE, JAMAIS UN TOGGLE AVEUGLE : la valeur cible `faite`
 * vient du bouton, pas de l'état lu en base. Un double envoi du formulaire —
 * chose banale sur une connexion lente, ou quand le lecteur reclique parce
 * qu'il ne voit « rien se passer » — donne donc exactement le même résultat,
 * là où un toggle décocherait ce qu'il vient de cocher.
 *
 * ⚠️ `redirect()` LÈVE PAR CONCEPTION. Elle est appelée hors de tout
 * try/catch : à l'intérieur, elle serait avalée et transformée en panne.
 */
export async function basculerEtape(jeton: string, numero: number, faite: boolean): Promise<void> {
  const hub = `/espace/${jeton}`;

  // La forme du jeton se vérifie sans ouvrir la base. Un jeton malformé ne mène
  // pas au hub — il n'y en a pas — mais au formulaire de récupération.
  if (!estJetonValide(jeton)) redirect("/espace");

  const acces = await accesParJeton(jeton);
  if (!acces) redirect("/espace");

  // Accès clôturé : on ne modifie plus rien, et on le dit poliment ailleurs.
  if (acces.revoque) redirect(hub);

  // Le numéro arrive d'un formulaire. `etapeParNumero` rend `null` hors des
  // bornes, ce qui évite d'écrire en base une clé d'étape qui n'existe pas et
  // que plus rien ne saurait relire ensuite.
  const etape = etapeParNumero(numero);
  if (!etape) redirect(hub);

  await cocherEtape(acces.email, etape.cle, faite);

  // Les deux pages qui affichent cet état : la page de l'étape (la case
  // elle-même) et le hub (le compteur, le bouton « Reprendre », la boutique
  // qui se réordonne sur la dernière étape terminée).
  revalidatePath(hub);
  revalidatePath(`${hub}/etape/${numero}`);

  // Retour au hub, et c'est le bon endroit : il vient de finir quelque chose,
  // il veut voir sa ligne cochée et savoir ce qui vient après.
  redirect(hub);
}

/**
 * « JE N'AI PLUS MON LIEN » — le renvoi du lien personnel.
 *
 * ⚠️ LA RÉPONSE EST RIGOUREUSEMENT LA MÊME QUE L'ADRESSE CORRESPONDE À UN
 * ACHAT OU NON. Sans cela, ce formulaire deviendrait un moyen de savoir qui a
 * acheté : on saisit l'adresse de quelqu'un, on lit la réponse, on sait. Le
 * silence est porté par `renvoyerAcces`, qui ne renvoie rien d'exploitable ;
 * il ne tient que si l'écran ne le trahit pas.
 *
 * La seule réponse différente est celle d'une adresse MAL FORMÉE, et elle ne
 * dit rien de nos clients : elle ne dépend que de ce que le visiteur vient de
 * taper. Lui répondre « votre lien vient de repartir » alors qu'il a écrit son
 * adresse sans le « @ », c'est le faire attendre un email qui ne partira
 * jamais — et sur cette cible, une attente sans fin finit au support.
 */
export async function renvoyerLien(
  prev: unknown,
  formData: FormData,
): Promise<{ message: string }> {
  const brut = formData.get("email");
  const email = typeof brut === "string" ? brut.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return {
      message:
        "Cette adresse semble incomplète. Vérifiez qu'elle contient bien un « @ » et la fin de votre fournisseur, par exemple : prenom.nom@orange.fr",
    };
  }

  // Ne lève jamais, et ne dit rien de ce qu'elle a trouvé. Le garde anti-abus
  // (un renvoi toutes les 2 minutes) est déjà à l'intérieur : le répéter ici
  // ferait apparaître un second message, donc un second comportement, donc une
  // information sur l'existence de l'adresse.
  await renvoyerAcces(email);

  return {
    message: "Si cette adresse correspond à un achat, votre lien vient de repartir.",
  };
}
