import type { ProductSku } from "./config";
/** Liste fermée : aucun chemin de fichier issu de l’URL. Fichiers jamais placés sous public/. */
export const PDF_GUIDES: {slug:string;sku:ProductSku;titre:string}[]=[
 {slug:"les-7-erreurs",sku:"front",titre:"Les 7 erreurs - comprendre et préparer"},
 {slug:"dossier-notaire",sku:"bump",titre:"Mon dossier - mode d’emploi et fiches"},
 {slug:"preparation-familiale",sku:"upsell1",titre:"Ma préparation familiale - guide et situations"},
 {slug:"assurance-vie",sku:"upsell2",titre:"Mon assurance-vie - guide et vérifications"}
];
