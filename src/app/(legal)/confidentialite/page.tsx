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
        <li>
          Données de commande (produits, montants, date). Les données de carte bancaire sont
          traitées exclusivement par Stripe et ne nous sont jamais transmises.
        </li>
        <li>
          Lorsque la mesure publicitaire est activée et que vous l&apos;autorisez : achats confirmés,
          montant, date, identifiant technique d&apos;événement et empreinte de votre adresse email
          transmis à Meta pour mesurer et améliorer les publicités. L&apos;empreinte peut être
          rapprochée d&apos;un compte Meta ; ce n&apos;est pas une anonymisation.
        </li>
        <li>
          Quatre réponses <strong>obligatoires pour terminer la qualification après achat</strong> : votre situation de couple, la présence d&apos;enfants, l&apos;existence
          d&apos;une assurance-vie et votre objectif de préparation. Les anciennes réponses de tranche d’âge peuvent être conservées dans l’historique. Elles servent uniquement à choisir
          les documents et les offres qui vous sont présentés ensuite. Elles ne modifient ni le prix
          de votre commande ni le contenu de votre Méthode, ne sont transmises à aucun tiers ni à
          aucun outil publicitaire, et sont supprimées lors de votre désinscription. Aucune donnée
          de santé n&apos;est demandée, ni vous concernant, ni concernant vos proches.
        </li>
      </ul>

      <h2>Orientation et fiabilité des envois</h2>
      <p>Le produit de base est commun à tous. La qualification intervient après paiement pour ordonner les documents et présenter une suite pertinente. Vous pouvez indiquer une situation à préciser ou « Je ne sais pas » sans communiquer de détail familial. Une réponse incertaine n’empêche pas de continuer. L’accès déjà acquis et l’assistance restent disponibles en cas de difficulté. Ces réponses ne valent pas consentement aux emails commerciaux ni à la publicité.</p>
      <p>Les avantages de démarrage utilisent une date enregistrée avec l’adresse email et la gamme d’offre. Le cookie de fonctionnement « hi_offre » conserve pendant 30 jours une clé aléatoire permettant de retrouver le palier de prix, sans contenir l’adresse email. Il ne sert pas à vous suivre sur des sites tiers. Une nouvelle visite ne relance pas une offre expirée. Voir les <a href="/conditions-offres">conditions des offres</a>.</p>
      <p>Un journal technique conserve des identifiants et états d’envoi, des empreintes et les réponses de rejet ou plainte nécessaires pour limiter les doublons et cesser les envois vers les adresses concernées. Il ne contient ni vos réponses familiales ni le corps des emails. Les empreintes sont des données pseudonymisées, pas une anonymisation.</p>
      <p>Des compteurs internes peuvent mesurer des vues et clics agrégés, sans identifiant visiteur ni réponses au questionnaire. Ils ne constituent pas un suivi individuel.</p>
      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Fourniture des contenus commandés : exécution du contrat.</li>
        <li>
          Envoi d&apos;informations et d&apos;offres par email : consentement ; désinscription
          possible à tout moment par le lien présent dans chaque email.
        </li>
        <li>Mesure d&apos;audience et publicité : consentement.</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p id="mesure-publicitaire">Votre préférence publicitaire est mémorisée pendant 180 jours dans ce navigateur par un cookie de première partie, « hi_publicite », qui contient une clé aléatoire, pas votre adresse email. Sans accord explicite et valable, aucune transmission publicitaire n’est effectuée. Le dispositif n’utilise pas de Pixel Meta dans votre navigateur.</p>
      <p>Vous pouvez refuser, fermer le bandeau sans accepter, ou retirer votre accord depuis « Mes préférences publicitaires », en bas de page. Le retrait arrête les transmissions futures depuis ce navigateur ; il ne rappelle pas les données déjà envoyées. Les autres navigateurs ont leurs propres préférences. Pour exercer vos droits sur les données déjà transmises, contactez-nous.</p>
      <p>La preuve de votre choix (date, version et texte présenté) et le journal technique des transmissions sont conservés au maximum 13 mois, avec purge planifiée. Ni vos réponses familiales ni vos liens privés ne figurent dans les données transmises à Meta. Le consentement publicitaire est distinct de celui des emails commerciaux.</p>
      <p>
        Données de prospection : 3 ans après le dernier contact. Données de commande : 10 ans
        (obligations comptables).
      </p>

      <h2>Destinataires et sous-traitants</h2>
      <p>
        Vercel (hébergement), Stripe (paiement), Resend (emails), Supabase (base de données), Vimeo
        (vidéos), Meta (publicité).
      </p>

      <h2>Vos droits</h2>
      <p>
        Accès, rectification, effacement, opposition, limitation, portabilité : écrivez à{" "}
        {CONTACT_EMAIL}. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>
    </>
  );
}
