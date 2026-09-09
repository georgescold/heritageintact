# Retour aux pages historiques — V11

Demande de Loys : reprendre l’ancienne LP et son pop-up, conserver uniquement les blocs « Le jour où ils chercheront… » et « Un exemple chiffré… » parmi les ajouts récents, présenter la Méthode, ne rien changer au produit.

Référence de présentation : `805ff6f^`, juste avant le premier commit de refonte. La restauration concerne la page de capture et la page de vente, pas le code historique de paiement.

## Ce qui revient

- LP courte : bénéfice chiffré, objection, mécanisme, formulaire, repères, disqualification.
- Page de vente : headline sur la mort, sous-headline chiffrée, VSL puis CTA, encadrés de calcul, avant/après illustré, Jean-Pierre, Martine, chiffres publics, offre, échéance, garantie, FAQ, dernière section photo et CTA mobile.
- Pop-up « Ce que vous risquez si vous fermez cette page » avec quatre lignes rouges et croix, puis l’accès à la Méthode.
- Visuels originaux : maison, désordre/classeur, Jean-Pierre, Martine, calendrier, transmission des clés.
- Les deux blocs récents demandés sont conservés sans réécriture. Le second est bien `ExempleSeuil` (9 600 €), pas une nouvelle section substituée.

## Adaptations indispensables, sans changement produit

- Les anciennes promesses de simulation personnelle incluse dans le premier achat, de neuf vidéos ou de bonus vendus séparément à des valeurs non établies ne sont pas remises en ligne. La présentation décrit les 8 étapes écrites, le PDF et les fiches réellement incluses.
- Les prix et promotions restent lus depuis `devisFront` et les compteurs actuels. Aucun retour aux anciens cookies ou prix de rattrapage.
- Les personnages demeurent fictifs. Les anciens visuels et récits reviennent avec des hypothèses précises ; ce ne sont pas des avis clients.
- Le calcul actuel est conservé dans son module existant et affiché dans les anciens gabarits. Les statistiques historiques sont datées et rattachées aux sources primaires.
- Les 65 % de donateurs âgés d’au moins 70 ans décrivent leur âge à l’enquête, pas leur âge au moment du don.
- La VSL n’est pas inventée : l’emplacement actuel reste en attente du fichier.
- Aucun changement aux guides/PDF, à l’espace membre, au questionnaire, au catalogue, aux inclusions, aux upsells, au paiement ou aux emails.

## Vérification

Contrôler le diff et les empreintes des fichiers produit par rapport au commit `e5492b1`. Les tests de présentation suivent la structure historique ; les tests de produit, d’accès, de promotion et de paiement restent exercés.
Publication par Git et suivi via l’API Vercel, jamais via CLI Vercel.

Sources des chiffres remis en page : [Insee 2021, enquête 2018](https://www.insee.fr/fr/statistiques/5359234), [CAE, note 69 de décembre 2021](https://www.cae-eco.fr/staticfiles/pdf/cae-note069.pdf), [rapport sur les droits de succession 2024](https://www.economie.gouv.fr/daj/lettre-de-la-daj-publication-du-rapport-de-la-cour-des-comptes-sur-les-droits-de-succession). Sources fiscales dans les encadrés correspondants.
