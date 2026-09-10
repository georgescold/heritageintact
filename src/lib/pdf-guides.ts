import type { ProductSku } from "./config";
/** Liste fermée : aucun chemin de fichier issu de l’URL. Fichiers jamais placés sous public/. */
export const PDF_GUIDES: {slug:string;sku:ProductSku;titre:string;description:string;bouton:string}[]=[
 {slug:"les-7-erreurs",sku:"front",titre:"Guide Héritage Intact — Les 7 erreurs qui offrent votre héritage à l’État",description:"Le guide principal que vous avez acheté, réuni dans un seul fichier à lire, imprimer ou conserver.",bouton:"Télécharger le guide des 7 erreurs"},
 {slug:"dossier-notaire",sku:"bump",titre:"Dossier à apporter chez votre notaire — mode d’emploi et fiches",description:"Votre dossier pratique pour préparer le rendez-vous : documents à réunir, questions à poser et fiches à compléter.",bouton:"Télécharger mon dossier notaire"},
 {slug:"preparation-familiale",sku:"upsell1",titre:"Simulateur + plan adapté — guide de préparation familiale",description:"Le guide inclus avec votre plan pour comprendre vos priorités, vos résultats et les vérifications à préparer.",bouton:"Télécharger le guide de préparation"},
 {slug:"assurance-vie",sku:"upsell2",titre:"Guide assurance-vie — contrat, clause et vérifications",description:"Le support acheté pour retrouver les informations de votre contrat et préparer les vérifications utiles.",bouton:"Télécharger mon guide assurance-vie"}
];
