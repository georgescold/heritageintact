import type { Metadata } from "next";
import { BRAND, CONTACT_EMAIL, LEGAL } from "@/lib/config";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p>
        Responsable du traitement : {LEGAL.operatorName} ({LEGAL.legalForm}, SIRET {LEGAL.siret}),
        exerçant sous le nom commercial « {BRAND} », {LEGAL.address}. Contact : {CONTACT_EMAIL}.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>Prénom et adresse email, lors de l&apos;inscription à la vidéo et de la commande.</li>
        <li>Données de commande (produits, montants, date). Les données de carte bancaire sont traitées exclusivement par Stripe et ne nous sont jamais transmises.</li>
        <li>Données de navigation à des fins de mesure d&apos;audience et publicitaire (pixel Meta), sous réserve de votre consentement.</li>
      </ul>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Fourniture des contenus commandés : exécution du contrat.</li>
        <li>Envoi d&apos;informations et d&apos;offres par email : consentement ; désinscription possible à tout moment par le lien présent dans chaque email.</li>
        <li>Mesure d&apos;audience et publicité : consentement.</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Données de prospection : 3 ans après le dernier contact. Données de commande : 10 ans (obligations
        comptables).
      </p>

      <h2>Destinataires et sous-traitants</h2>
      <p>Vercel (hébergement), Stripe (paiement), Resend (emails), Supabase (base de données), Vimeo (vidéos), Meta (publicité).</p>

      <h2>Vos droits</h2>
      <p>
        Accès, rectification, effacement, opposition, limitation, portabilité : écrivez à {CONTACT_EMAIL}.
        Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>
    </>
  );
}
