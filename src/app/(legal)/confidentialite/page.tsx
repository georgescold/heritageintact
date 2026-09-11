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
          Après le premier achat payé : prénom, adresse email, produit acheté et montant transmis
          à Trustpilot avec le reçu afin de permettre l’envoi d’une invitation à partager un avis.
          Le lien personnel de l’espace, les réponses au questionnaire et les données patrimoniales
          ne sont jamais transmis à Trustpilot.
        </li>
        <li>
          Lorsque la mesure publicitaire est activée et que vous l&apos;autorisez : achats confirmés,
          montant, date, identifiant technique d&apos;événement et empreinte de votre adresse email
          transmis à Meta pour mesurer et améliorer les publicités. L&apos;empreinte peut être
          rapprochée d&apos;un compte Meta ; ce n&apos;est pas une anonymisation.
        </li>
        <li>
          Les réponses fournies <strong>uniquement lorsque vous demandez votre plan personnalisé</strong> :
          situation familiale, âge, catégories et montants arrondis de patrimoine, bénéficiaires,
          donations et assurance-vie. Vos réponses et votre avancement sont enregistrés dans votre
          espace sur nos serveurs pour reprendre sur un autre appareil et générer votre PDF après
          l’achat du Plan. Une copie de reprise peut également être conservée dans votre navigateur.
          Les fiches que vous choisissez de compléter en ligne sont enregistrées lorsque vous cliquez
          sur « Enregistrer ma fiche ». N’y inscrivez pas de données de santé, de coordonnées bancaires
          ni de pièces d’identité. Ces contenus ne sont transmis ni aux outils publicitaires ni à Trustpilot.
        </li>
      </ul>

      <h2>Orientation et fiabilité des envois</h2>
      <p>Le produit de base est commun à tous et accessible sans remplir ce questionnaire. Les informations du plan ne sont demandées que si vous choisissez de lancer la simulation, afin de préparer l’aperçu et de présenter le produit correspondant. L’accès déjà acquis et l’assistance restent disponibles en cas de difficulté. Ces réponses ne valent pas consentement aux emails commerciaux ni à la publicité.</p>
      <p>Les avantages de démarrage utilisent une date enregistrée avec l’adresse email et la gamme d’offre. Le cookie de fonctionnement « hi_offre » conserve pendant 30 jours une clé aléatoire permettant de retrouver le palier de prix, sans contenir l’adresse email. Il ne sert pas à vous suivre sur des sites tiers. Une nouvelle visite ne relance pas une offre expirée. Voir les <a href="/conditions-offres">conditions des offres</a>.</p>
      <p>Un journal technique conserve des identifiants et états d’envoi, des empreintes et les réponses de rejet ou plainte nécessaires pour limiter les doublons et cesser les envois vers les adresses concernées. Il ne contient ni vos réponses familiales ni le corps des emails. Les empreintes sont des données pseudonymisées, pas une anonymisation.</p>
      <p>Des compteurs internes peuvent mesurer des vues et clics agrégés, sans identifiant visiteur ni réponses au questionnaire. Ils ne constituent pas un suivi individuel.</p>
      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Fourniture des contenus commandés : exécution du contrat.</li>
        <li>
          Invitation unique à partager un avis après le premier achat : intérêt légitime à recueillir
          l’expérience réelle des clients. Vous pouvez vous y opposer gratuitement en écrivant à {CONTACT_EMAIL}
          ou au moyen du lien prévu dans l’invitation.
        </li>
        <li>
          Envoi d&apos;informations et d&apos;offres par email : consentement ; désinscription
          possible à tout moment par le lien présent dans chaque email.
        </li>
        <li>Mesure d&apos;audience et publicité : consentement.</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>Les réponses au questionnaire et les fiches enregistrées sont conservées pour permettre la reprise de votre préparation tant que votre espace reste actif, ou jusqu’à votre demande d’effacement auprès de {CONTACT_EMAIL}. Pour retirer aussi la copie locale de votre questionnaire, effacez les données du site dans votre navigateur.</p>
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
        (vidéos), Trustpilot (invitation à déposer un avis après achat), Meta (publicité).
      </p>

      <h2>Vos droits</h2>
      <p>
        Accès, rectification, effacement, opposition, limitation, portabilité : écrivez à{" "}
        {CONTACT_EMAIL}. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>
    </>
  );
}
