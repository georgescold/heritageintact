import type { Metadata } from "next";
import {
  BRAND,
  CONTACT_EMAIL,
  FOUNDERS_CAP,
  LEGAL,
  PRIX_APRES_FONDATEURS,
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
        pédagogiques accessibles en ligne : programmes vidéo, documents téléchargeables et outils de
        calcul.
      </p>

      <h2>2. Produits et prix</h2>
      <ul>
        <li>
          {/* ⚠️ Le prix ultérieur est PRIX_APRES_FONDATEURS, jamais l'ancrage.
              L'ancrage (429 €) est la valeur du contenu ; le prix ultérieur
              (67 €) est ce qui sera réellement facturé après les places
              fondatrices. Les confondre dans un document contractuel serait
              une information tarifaire fausse. */}
          {PRODUCTS.front.name} : {euros(PRODUCTS.front.price)} TTC (prix fondateur, limité aux{" "}
          {FOUNDERS_CAP} premiers membres ; prix ultérieur : {euros(PRIX_APRES_FONDATEURS)} TTC)
        </li>
        <li>
          {PRODUCTS.bump.name} : {euros(PRODUCTS.bump.price)} TTC
        </li>
        <li>
          {PRODUCTS.upsell1.name} : {euros(PRODUCTS.upsell1.price)} TTC
        </li>
        <li>
          {PRODUCTS.upsell2.name} : {euros(PRODUCTS.upsell2.price)} TTC
        </li>
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
      <p>
        L&apos;accès est délivré immédiatement après paiement, par email, pour une durée illimitée,
        à titre personnel et non cessible.
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
