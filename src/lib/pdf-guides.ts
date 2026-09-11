import type { ProductSku } from "./config";
/** Liste fermée : aucun chemin de fichier issu de l’URL. Fichiers jamais placés sous public/. */
export type GuidePdf = {slug:string;sku:ProductSku;titre:string;description:string;bouton:string;categorie:"achat"|"offert"};
export const PDF_GUIDES: GuidePdf[]=[
 {slug:"les-7-erreurs",sku:"front",categorie:"achat",titre:"Guide Héritage Intact — Les 7 erreurs qui offrent votre héritage à l’État",description:"Le guide principal que vous avez acheté, réuni dans un seul fichier à lire, imprimer ou conserver.",bouton:"Télécharger le guide des 7 erreurs"},
 {slug:"dossier-notaire",sku:"bump",categorie:"achat",titre:"Dossier Notaire",description:"Votre dossier pratique pour préparer le rendez-vous : documents à réunir, questions à poser et fiches à compléter.",bouton:"Télécharger mon dossier notaire"},
 {slug:"preparation-familiale",sku:"upsell1",categorie:"achat",titre:"Mon plan adapté à ma situation",description:"Votre guide de préparation : points de vigilance personnalisés, protection future, famille, maison et dossier à remettre au professionnel.",bouton:"Télécharger mon plan adapté"},
 {slug:"assurance-vie",sku:"upsell2",categorie:"achat",titre:"Guide assurance-vie — contrat, clause et vérifications",description:"Le support acheté pour retrouver les informations de votre contrat et préparer les vérifications utiles.",bouton:"Télécharger mon guide assurance-vie"},
 {slug:"lexique-succession",sku:"front",categorie:"offert",titre:"Lexique détaillé de la succession",description:"Votre bonus offert : les notions essentielles expliquées en langage courant, avec les articles de loi officiels à consulter.",bouton:"Télécharger mon lexique offert"}
];
