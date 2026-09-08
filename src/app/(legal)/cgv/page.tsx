import type { Metadata } from "next";
import {
  BRAND,
  CONTACT_EMAIL,
  FOUNDERS_CAP,
  LEGAL,
  FLASH_MINUTES,
  PRIX_APRES_FONDATEURS,
  PRIX_RATTRAPAGE,
  REDUCTION_RATTRAPAGE,
  PRODUCTS,
  euros,
} from "@/lib/config";

export const metadata: Metadata = { title: "Conditions générales de vente" };

/** ⚠️ Trame à faire relire par un avocat avant mise en ligne. */
export default function CGV() {
  return (
    <>
      <h1>Conditions générales de vente</h1>
      <p>Dernière mise à jour : {LEGAL.updatedAt}</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent la vente, par {LEGAL.operatorName} ({LEGAL.legalForm},
        SIRET {LEGAL.siret}), sous le nom commercial « {BRAND} », de contenus numériques
        pédagogiques accessibles en ligne : méthodes vidéo, documents téléchargeables et outils de
        calcul.
      </p>

      <h2>2. Produits et prix</h2>
      <ul>
        <li>
          {/* ⚠️ Le prix ultérieur est PRIX_APRES_FONDATEURS, jamais l'ancrage.
              L'ancrage (429 €) est la valeur du contenu ; le prix ultérieur
              ({euros(PRIX_APRES_FONDATEURS)}) est ce qui sera réellement
              facturé. Les confondre dans un document contractuel serait une
              information tarifaire fausse.

              Et les DEUX conditions du prix fondateur doivent être écrites
              ici, pas seulement les places : depuis l'ajout du compteur de
              {" "}{FLASH_MINUTES} minutes, un acheteur peut perdre le prix
              fondateur par le temps aussi bien que par le rang. Une condition
              tarifaire qui s'applique réellement et qui ne figure pas aux CGV
              n'est pas opposable. */}
          {PRODUCTS.front.name} : {euros(PRODUCTS.front.price)} TTC (offre de lancement), sous
          réserve des deux conditions cumulatives suivantes : l&apos;offre est réservée aux{" "}
          {FOUNDERS_CAP} premiers membres, et elle est valable {FLASH_MINUTES} minutes à compter du
          moment où elle vous est présentée sur la page de vente. Au-delà de l&apos;une ou
          l&apos;autre de ces limites, le prix est de {euros(PRIX_APRES_FONDATEURS)} TTC. Le délai
          de {FLASH_MINUTES} minutes court une seule fois et n&apos;est pas réinitialisé par un
          rechargement de la page.
        </li>
        <li>
          {/* ⚠️ Le rattrapage change le prix réellement débité : il doit donc
              figurer ici, avec son caractère unique. C'est aussi ce
              caractère unique qui empêche l'annonce du prix plein
              d'être trompeuse. */}
          À l&apos;expiration du délai ci-dessus, une remise de {REDUCTION_RATTRAPAGE} % peut vous
          être proposée une fois, portant le prix à {euros(PRIX_RATTRAPAGE)} TTC. Elle n&apos;est
          appliquée que si vous l&apos;acceptez expressément, et le refus est définitif.
        </li>
        {/* ⚠️ LA LISTE EST GÉNÉRÉE, ET ELLE EST FILTRÉE SUR `disponible`.

            Générée, parce qu'un prix pratiqué qui ne figure pas aux CGV n'est
            pas opposable : le jour où un produit passe en vente, il doit
            apparaître ici sans que personne ait à y penser.

            Filtrée, parce que l'inverse est pire. Les quatre produits backend
            sont déclarés dans PRODUCTS — l'espace membre a besoin de leur nom
            — mais aucun contenu n'existe. Les annoncer au contrat avant de
            pouvoir les livrer, ce serait s'engager sur du vide.

            `front` est exclu : il a son propre paragraphe, plus haut, avec ses
            deux conditions tarifaires. */}
        {Object.values(PRODUCTS)
          .filter((p) => p.disponible && p.sku !== "front")
          .map((p) => (
            <li key={p.sku}>
              {p.name} : {euros(p.price)} TTC
            </li>
          ))}
      </ul>
      <p>Les prix sont indiqués en euros, toutes taxes comprises. {LEGAL.vatNotice}</p>

      <h2>3. Commande et paiement</h2>
      <p>
        Le paiement s&apos;effectue en ligne par carte bancaire via le prestataire Stripe. La
        commande est définitive à réception de la confirmation de paiement. Les offres
        complémentaires proposées après la commande initiale sont facturées séparément, sur
        acceptation expresse du client, au moyen de paiement enregistré.
      </p>

      <h2>4. Accès aux contenus</h2>
      {/* ⚠️ Cet article décrit désormais le mode d'accès RÉELLEMENT exécuté par
          le code : un lien personnel permanent, sans compte ni mot de passe.
          Le dire ici n'est pas cosmétique — c'est ce qui rend opposable le fait
          que le lien ne doive pas être transmis, et c'est ce que l'acheteur
          relit quand il se demande où sont ses identifiants (il n'y en a pas). */}
      <p>
        L&apos;accès est délivré immédiatement après paiement, par un lien personnel envoyé par
        email, sans mot de passe, pour une durée illimitée. Ce lien est personnel et ne doit pas
        être transmis.
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        Conformément à l&apos;article L221-28 13° du code de la consommation, le droit de
        rétractation ne peut être exercé pour un contenu numérique non fourni sur support matériel
        dont l&apos;exécution a commencé après accord préalable exprès du consommateur et
        renoncement exprès à son droit de rétractation. Ce consentement est recueilli lors de la
        commande.
      </p>

      <h2>6. Garantie contractuelle « satisfait ou remboursé »</h2>
      <p>
        Indépendamment de ce qui précède, {BRAND} accorde une garantie contractuelle de 30 jours
        calendaires à compter de l&apos;achat : sur simple demande par email à {CONTACT_EMAIL}, sans
        justification, le client est intégralement remboursé sous 7 jours. Le client conserve
        l&apos;accès au simulateur.
      </p>

      <h2>7. Nature des contenus</h2>
      <p>
        Les contenus sont pédagogiques et généraux. Ils ne constituent pas un conseil personnalisé
        et ne remplacent pas la consultation d&apos;un notaire, d&apos;un avocat ou d&apos;un
        conseiller habilité. Les exemples chiffrés sont illustratifs. Le client demeure seul
        responsable des décisions prises.
      </p>

      <h2>8. Données personnelles</h2>
      <p>Voir la politique de confidentialité.</p>

      <h2>9. Médiation et litiges</h2>
      <p>
        En cas de litige, le client peut recourir gratuitement au médiateur de la consommation :{" "}
        {LEGAL.mediator.name}, {LEGAL.mediator.address}, {LEGAL.mediator.email} (
        {LEGAL.mediator.url}). Le droit français est applicable.
      </p>
    </>
  );
}
