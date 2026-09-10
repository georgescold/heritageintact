import type { Metadata } from "next";
import { BRAND, CONTACT_EMAIL, LEGAL, PRODUCTS, euros } from "@/lib/config";

export const metadata: Metadata = { title: "Conditions générales de vente" };

/** ⚠️ Trame à faire relire par un avocat avant mise en ligne. */
export default function CGV() {
  return (
    <>
      <h1>Conditions générales de vente</h1>
      <p>Version de travail mise à jour le 9 septembre 2026</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent la vente, par {LEGAL.operatorName} ({LEGAL.legalForm},
        SIRET {LEGAL.siret}), sous le nom commercial « {BRAND} », de contenus numériques
        pédagogiques accessibles en ligne : parcours écrits, guides PDF, documents et
        outils de calcul.
      </p>

      <h2>2. Produits et prix</h2>
      <ul>
        {Object.values(PRODUCTS)
          .filter((p) => p.disponible)
          .map((p) => (
            <li key={p.sku}>
              {p.name} : {euros(p.price)} TTC
            </li>
          ))}
      </ul>
      <p>Chaque produit est vendu séparément. Le Dossier notaire à 17 € est une option non précochée. « Mon simulateur + mon plan adapté » inclut l’outil de simulation, le résultat pédagogique, les hypothèses et les supports de préparation correspondants. Le guide assurance-vie est un achat distinct.</p>
      <p>
        Paiements uniques, sans abonnement. Des réductions personnelles à paliers peuvent s’appliquer selon les <a href="/conditions-offres">conditions des avantages de démarrage</a>. Le prix et sa date de fin sont affichés ; un changement avant paiement nécessite une nouvelle confirmation. Les prix
        sont en euros, toutes taxes comprises. {LEGAL.vatNotice}
      </p>

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
        l&apos;accès à la fiche de calcul pédagogique. Le simulateur interactif et son plan adapté sont distincts.
        Cette précision ne réduit pas les droits expressément accordés lors d’un achat antérieur.
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
