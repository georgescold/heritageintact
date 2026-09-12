import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { CaptureDocument } from "@/components/CaptureDocument";
import { FAQ } from "@/components/ui";
import { BRAND, CONTACT_EMAIL } from "@/lib/config";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/faq";

export const metadata: Metadata = metadataPublique(
  CHEMIN,
  "Questions fréquentes",
  "Qui nous sommes, ce que nous faisons et ce que nous ne faisons pas, ce que deviennent vos données, et pourquoi nous ne remplaçons pas votre notaire.",
);

/**
 * LA PAGE QUI REPOND AVANT QU'ON DEMANDE.
 *
 * Les questions ne sont pas inventées : ce sont les objections relevées dans
 * `strategie/02-avatar.md` § A.6, dans leur ordre de fréquence, reformulées avec
 * les mots du lecteur. Deux d'entre elles — « sur internet c'est des arnaques »
 * et « qui êtes-vous pour parler de ça » — sont traitées en premier, parce que
 * quelqu'un qui a tapé notre nom dans Google cherche exactement cela.
 *
 * ⚠️ AUCUN PRIX, AUCUNE REMISE, AUCUN COMPTE A REBOURS. La page est indexée, et
 * `lib/seo.ts` l'interdit — la grille tarifaire vit dans les CGV, qui ne sont
 * volontairement pas indexées puisque les prix du tunnel varient. La question
 * « combien ça coûte » est donc renvoyée vers les CGV plutôt que chiffrée ici :
 * un prix affiché dans un résultat de recherche contredirait l'affichage réel.
 */
const QUESTIONS = [
  {
    q: "Qui êtes-vous, et pourquoi devrais-je vous croire ?",
    a: (
      <>
        <p className="mb-2">
          {BRAND} est un éditeur de contenus pédagogiques sur la transmission. Nous ne sommes ni
          notaires, ni conseillers en gestion de patrimoine, ni intermédiaires en assurance — et
          nous ne prétendons pas l’être.
        </p>
        <p>
          Ce qui doit vous convaincre n’est donc pas notre parole, mais nos sources : chaque
          affirmation de ce site est accompagnée de l’article du Code général des impôts ou du Code
          civil qui la fonde. Vous pouvez tout vérifier vous-même sur impots.gouv.fr et
          legifrance.gouv.fr. Si un chiffre vous paraît faux, écrivez-nous : nous le corrigeons ou
          nous vous montrons d’où il vient.
        </p>
      </>
    ),
  },
  {
    q: "C’est gratuit — où est le piège ?",
    a: (
      <>
        <p className="mb-2">
          Il n’y en a pas, et l’économie du site est simple à expliquer. Le document que vous
          recevez est gratuit et le reste. En échange de votre adresse, nous vous envoyons ensuite
          quelques emails d’explication, et nous vous proposons à un moment des guides payants,
          plus complets. Vous n’êtes jamais obligé d’acheter quoi que ce soit pour lire ce qui est
          gratuit.
        </p>
        <p>
          Nous ne revendons pas votre adresse, nous ne touchons aucune commission sur un contrat
          d’assurance-vie ou un placement, et nous ne gérons pas d’argent. Vous vous désinscrivez
          en un clic, depuis n’importe lequel de nos emails.
        </p>
      </>
    ),
  },
  {
    q: "Il faut de toute façon aller chez le notaire. Alors à quoi bon ?",
    a: (
      <>
        <p className="mb-2">
          Oui, et nous vous y envoyons. Un acte se signe chez un notaire, et rien de ce que nous
          publions ne remplace son intervention.
        </p>
        <p>
          Ce que nous changeons, c’est ce que vous faites de son heure. Un rendez-vous où l’on
          découvre ce qu’est un abattement n’a pas la même valeur qu’un rendez-vous où l’on arrive
          avec ses documents réunis, sa situation écrite et trois questions précises. Le
          professionnel peut alors consacrer son temps à décider, ce pour quoi il est réellement
          irremplaçable.
        </p>
      </>
    ),
  },
  {
    q: "Je ne vais rien comprendre, c’est trop technique.",
    a: (
      <>
        <p className="mb-2">
          C’est l’objection que nous entendons le plus, et elle est légitime : le vocabulaire du
          sujet — démembrement, usufruit, clause bénéficiaire, quotité disponible — a été écrit
          pour des juristes, pas pour vous.
        </p>
        <p>
          Nous prenons le problème à l’envers : chaque notion est d’abord expliquée par ce qu’elle
          change concrètement pour votre famille, et le terme technique n’arrive qu’ensuite, comme
          une étiquette à connaître pour le jour où on vous la dira. Vous n’avez besoin d’aucune
          connaissance préalable.
        </p>
      </>
    ),
  },
  {
    q: "Ma situation est particulière. Est-ce que ça me concerne quand même ?",
    a: (
      <>
        <p className="mb-2">
          Famille recomposée, enfant en concubinage, bien locatif, PACS, veuvage, enfant à
          l’étranger : ces situations ne sont pas des exceptions, ce sont les cas les plus
          fréquents. Elles ne changent pas les repères généraux, elles changent les questions à
          poser.
        </p>
        <p>
          En revanche, plus votre situation est particulière, plus l’intervention d’un
          professionnel est nécessaire — et plus il est utile d’arriver préparé. C’est exactement
          l’inverse d’une raison de ne rien faire.
        </p>
      </>
    ),
  },
  {
    q: "Je n’ai pas envie de donner de mon vivant. Et si j’en ai besoin plus tard ?",
    a: (
      <p>
        Cette crainte est saine, et nous ne vous pousserons jamais à vous démunir. Comprendre les
        règles de la transmission ne vous engage à donner quoi que ce soit : beaucoup de décisions
        utiles ne coûtent rien et ne déplacent aucun euro — vérifier une clause bénéficiaire,
        réunir des documents, écrire ce que vous voulez, savoir ce que la loi prévoit par défaut si
        vous ne faites rien. La sécurité de votre propre fin de vie passe avant toute
        optimisation, et tout ce que nous publions part de ce principe.
      </p>
    ),
  },
  {
    q: "J’ai le temps, je suis en forme.",
    a: (
      <p>
        Nous l’espérons sincèrement, et ce n’est pas votre santé qui est en cause. Ce sont les
        délais : un abattement se reconstitue au bout de quinze ans (art. 784 CGI), et les
        versements sur une assurance-vie changent de régime à soixante-dix ans (art. 757 B). Ces
        durées courent, que vous soyez en forme ou non. Être en bonne santé à 65 ans, c’est
        précisément le meilleur moment — et le seul où l’on a encore le choix.
      </p>
    ),
  },
  {
    q: "Et si la loi change ?",
    a: (
      <p>
        Elle change, régulièrement, et c’est une raison de comprendre plutôt que de mémoriser.
        Chaque chiffre que nous publions est daté et accompagné de son article. Quand une loi de
        finances modifie une règle, nous corrigeons les pages concernées — et les fenêtres
        temporaires, comme celle prévue jusqu’au 31 décembre 2026 pour les dons familiaux affectés
        au logement (art. 790 A bis), sont toujours présentées comme telles.
      </p>
    ),
  },
  {
    q: "Qu’est-ce que vous faites de mon adresse email ?",
    a: (
      <>
        <p className="mb-2">
          Elle sert à vous envoyer le document demandé, puis nos explications. Elle n’est ni
          vendue, ni louée, ni transmise à un tiers à des fins commerciales. Nous ne vous demandons
          ni votre téléphone, ni votre adresse postale, ni le montant de votre patrimoine.
        </p>
        <p>
          Le détail figure dans notre <Link href="/confidentialite">politique de confidentialité</Link>.
          Chaque email contient un lien de désinscription qui fonctionne immédiatement.
        </p>
      </>
    ),
  },
  {
    q: "J’ai déjà acheté un guide. Comment je le retrouve ?",
    a: (
      <>
        <p className="mb-2">
          Par le lien personnel que vous avez reçu par email le jour de votre commande. Il ne
          s’arrête jamais de fonctionner : mettez-le dans vos favoris.
        </p>
        <p>
          Si vous l’avez perdu, allez sur <Link href="/connexion">la page Mon espace</Link> et
          indiquez l’adresse email de votre commande : le lien vous est renvoyé immédiatement. Il
          n’y a ni compte à créer, ni mot de passe à retenir — rien de tout cela n’existe sur ce
          site.
        </p>
      </>
    ),
  },
  {
    q: "Combien coûtent vos guides payants ?",
    a: (
      <p>
        Le prix exact est toujours affiché avant le paiement, sur le bon de commande, et il figure
        dans nos <Link href="/cgv">conditions générales de vente</Link>. Nous ne l’affichons pas
        ici pour une raison simple : selon le moment de votre parcours, l’offre qui vous est
        proposée n’est pas la même, et un montant lu dans un résultat de recherche risquerait de
        contredire celui que vous verrez réellement. Rien n’est prélevé sans que vous ayez vu le
        montant, et chaque achat est couvert par une garantie de 30 jours, sans justification.
      </p>
    ),
  },
  {
    q: "Est-ce que vous me donnez un conseil adapté à mon cas ?",
    a: (
      <p>
        Non, et c’est important. Nous publions de l’information générale et des outils de
        préparation. Nous ne délivrons aucune consultation juridique, fiscale ou patrimoniale
        individuelle, et nous ne pouvons pas vous dire ce que vous devez faire de votre maison ou
        de votre contrat. Ce jugement appartient au professionnel compétent, qui engage sa
        responsabilité. Notre rôle s’arrête à vous rendre capable de lui poser les bonnes
        questions — et de comprendre sa réponse.
      </p>
    ),
  },
];

export default function PageFaq() {
  return (
    <>
      <Header nav />
      <main className="flex-1">
        <div className="wrap py-8 sm:py-11">
          <h1 className="text-[1.7rem] leading-tight sm:text-[2.1rem]">Questions fréquentes</h1>
          <p className="mt-3 max-w-[60ch] text-[1.05rem]">
            Les questions qu’on nous pose le plus, dans l’ordre où on nous les pose. Si la vôtre
            n’y est pas, écrivez-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : nous répondons nous-mêmes.
          </p>

          <div className="mt-7">
            <FAQ items={QUESTIONS} />
          </div>

          <CaptureDocument />
        </div>
      </main>
      <Footer />
    </>
  );
}
