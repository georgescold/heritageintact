import type { Metadata } from "next";
import Image from "next/image";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { ExitPopup } from "@/components/ExitPopup";
import { PixelEvent } from "@/components/MetaPixel";
import { StickyCta } from "@/components/StickyCta";
import {
  EchelleDesPrix,
  FlashBar,
  FlashPrice,
  FlashTrigger,
  PrixDuJour,
} from "@/components/OffreFlash";
import { CtaMethode } from "@/components/Rattrapage";
import { Statistiques } from "@/components/Statistiques";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Check, Cross, FAQ, ValueStack } from "@/components/ui";
import { BeforeAfter, TheComparison, TheDeadline, TheNumber } from "@/components/Lp";
import { TheCostOfWaiting, TheFailure, TheGuarantee, TheLastWord } from "@/components/LpCeo";
import { CTA, FLASH_MINUTES, PRIX_APRES_FLASH, PRODUCTS, VIDEO, euros } from "@/lib/config";

export const metadata: Metadata = { title: "Les 3 décisions" };

const PACKAGING = [
  {
    label:
      "Savoir exactement ce que l'État prendra sur votre succession : le Simulateur de Facture Invisible",
    value: "97 €",
  },
  {
    label: "La Méthode complète, étape par étape et en français simple : les 8 étapes",
    value: "147 €",
  },
  {
    label: "Vos 3 dates personnelles : savoir quand agir avant que la date soit passée",
    value: "47 €",
  },
  { label: "Le Plan en 1 Page, à montrer à votre conjoint et à vos enfants", value: "47 €" },
  {
    label: "Bonus : les 12 questions à poser à votre notaire (et les 3 à ne jamais poser)",
    value: "37 €",
  },
  { label: "Bonus : la lettre pour ouvrir le sujet avec vos enfants, sans drame", value: "27 €" },
  {
    label: "Bonus : que faire si la loi change, la Règle de Mise à Jour, mises à jour à vie",
    value: "27 €",
  },
];

/**
 * LA PAGE DE VENTE.
 *
 * ═══ Pourquoi elle a été raccourcie le 6 septembre 2026 ═══
 *
 * Elle portait les onze blocs de la structure CEO, en texte, sous la vidéo :
 * 38 écrans sur téléphone. C'était un doublon, et pas une question de goût —
 * `05-vsl-front.md` organise le script de la VSL exactement comme ça :
 *
 *     LEAD (20 %)     le récit : Jean-Pierre, le notaire, 82 194 €
 *     BODY (65 %)     la structure CEO
 *     CLOSING (15 %)  trois outils de closing
 *
 * **La structure CEO est le travail de la VIDÉO.** La page racontait la même
 * histoire juste en dessous. Rien n'est perdu : ce texte EST le script, il vit
 * dans `05-vsl-front.md`, et les composants restent dans `LpCeo.tsx` si on veut
 * un jour tester une variante longue.
 *
 * ═══ Le gabarit, tel qu'il est écrit ═══
 *
 *     [H1][H2][VIDÉO][BOUTON][+ preuves / bonus / garantie / FAQ][CGV]
 *
 * ⚠️ Jamais de prix ni de bouton AU-DESSUS de la vidéo.
 *
 * Ce qui reste sous la vidéo entre dans les cases prévues, et rien d'autre :
 *   — preuve    TheNumber (d'où sortent les 82 194 €) et BeforeAfter
 *   — bonus     le packaging et sa pile de valeur
 *   — urgence   TheDeadline, avant le dernier appel
 *   — garantie  TheGuarantee
 *   — FAQ       les six objections
 *
 * La checklist d'optimisation le confirme de son côté : « ajouter des preuves
 * sous la vidéo » est un levier du CTR de la VSL. Des preuves — pas un second
 * récit.
 */
export default function VslPage() {
  // ⚠️ Un CTA est un VERBE D'ACTION, à l'impératif. C'est le seul exemple
  // rédigé du repo — « Cliquez sur le bouton ci-dessous pour découvrir… »
  // (`05-funnel/landing-pages.md`) — et « Agressivité du CTA » est un levier
  // nommé de la checklist d'optimisation.
  //
  // Deux versions ont été écartées : « Je veux mon chiffre et les 3 décisions :
  // 27 € » (un bordereau de livraison), puis « Je veux mon chiffre » (correct,
  // mais au présent de l'indicatif : ça décrit une envie, ça n'ordonne pas un
  // geste). Le prix et la garantie vivent sur la ligne d'en dessous.
  const cta = CTA.benefice;

  return (
    <>
      <PixelEvent name="Lead" />
      {/* Le bandeau colle en haut et n'apparaît qu'une fois le compteur lancé,
          c'est-à-dire quand le visiteur a quitté la vidéo. Avant ça, rien ne
          presse : il regarde. Le compteur du 31 décembre 2026 n'est plus ici,
          deux horloges rouges sur le même écran n'en font croire aucune. */}
      <FlashBar />
      <Header minimal />
      <main className="flex-1">
        {/* ═══ H1 → H2 → VIDÉO → BOUTON ════════════════════════════════
            La H1 reprend la ligne qui portait l'ancienne page : qualification
            puis coût de l'inaction, dans la proposition principale. La H2 tient
            le format du gabarit — bénéfice, sans douleur, délai, puis l'appel à
            regarder la vidéo. */}
        <section className="wrap pt-6 sm:pt-10">
          <h1 className="mb-3 text-[1.5rem] leading-[1.14] sm:text-[2.1rem]">
            Vous avez une maison payée et des enfants&nbsp;?
            <br />
            <span className="text-orange">
              Si vous ne faites rien, l&apos;État en prendra une part à votre mort.
            </span>
          </h1>
          {/* ⚠️ La sous-headline ANNONCE les deux chiffres.
              Sans ça, la première section sous la vidéo — « D'où sortent les
              82 194 € » — tombait sur un chiffre dont la page n'avait jamais
              parlé. Elle répondait à une question que personne ne s'était
              posée. Le raisonnement se tient maintenant de bout en bout :
              l'État prend une part → cette part vaut 82 194 € → trois
              décisions la ramènent à 13 988 € → et voici le calcul. */}
          <p className="mb-5 text-[1.12rem] leading-snug">
            Sur une maison de province et les économies d&apos;une vie, cette part est de{" "}
            <strong className="whitespace-nowrap text-red">82 194 €</strong>. Trois décisions,
            prises de votre vivant, la ramènent à{" "}
            <strong className="whitespace-nowrap text-green">13 988 €</strong> — sans rien vendre et
            sans quitter votre maison.
          </p>

          {/* FlashTrigger observe le lecteur : dès qu'il sort de l'écran —
              la vidéo est finie, ou le visiteur descend — les dix minutes
              partent, et elles ne repartiront plus jamais de zéro. */}
          <FlashTrigger>
            <VideoEmbed id={VIDEO.vsl} title="Les 3 décisions" />
          </FlashTrigger>

          <div className="mt-5 space-y-3">
            <FlashPrice />
            <CtaMethode label={cta} />
            <p className="text-center text-[0.95rem] text-text-soft">
              Accès immédiat · garantie 30 jours, sans justification
            </p>
            <div className="flex justify-center">
              <TrustRow />
            </div>
          </div>
        </section>

        {/* ═══ PREUVE — le chiffre, ligne par ligne ════════════════════ */}
        <TheNumber />

        {/* ═══ PREUVE — le second chiffre, celui qu'on promettait ═════
            La sous-headline annonce 82 194 € ramenés à 13 988 €. Le bloc
            précédent prouve le premier ; celui-ci montre le second et l'écart
            entre les deux. Sans lui, la moitié de la promesse restait à
            croire sur parole. */}
        <TheComparison />

        {/* ═══ Ce que ça donne concrètement, le jour venu ═════════════ */}
        <BeforeAfter />

        {/* ═══ LES DEUX CAS ════════════════════════════════
            Un chiffre ne fait identifier personne — un cas, oui. Jean-Pierre
            est l'avatar principal (`02-avatar.md`) : il a tout bien fait, et
            ça n'a rien changé. Martine est l'avatar secondaire : elle a fait la
            bonne chose, trois mois trop tard. Les deux disent la même chose —
            ce n'est pas une faute, c'est une date — mais l'une par l'ignorance
            et l'autre par le retard, ce qui couvre les deux façons de perdre.
            Ils encadrent la FAQ : on se reconnaît AVANT de lire l'offre. */}
        <TheFailure />
        <TheCostOfWaiting />

        {/* Les cas montrent deux familles. Les chiffres publics montrent
            qu'elles ne sont pas des exceptions. L'ordre compte : l'histoire
            d'abord, la statistique ensuite — un chiffre ne fait s'identifier
            personne, mais il empêche de se dire « ça n'arrive qu'aux autres ». */}
        <Statistiques />

        {/* ═══ L'OFFRE — ce qu'il y a dans la boîte ═══════════════════ */}
        <section className="wrap py-10">
          {/* ⚠️ CETTE SECTION A ÉTÉ RETOURNÉE, et c'est une correction de fond.
              Elle disait ce que la Méthode CONTIENT, et elle annonçait « sur les
              sept, trois sont des dates ». Or la vidéo vient de donner ces trois
              dates : le lecteur lisait donc « trois septièmes de ce que vous
              allez payer, vous les connaissez déjà ». On dévaluait le produit
              avec notre propre argument.

              Le principe maintenant : la VSL dit ce qu'il faut savoir, la page
              dit ce qu'on ÉVITE. Le contenu ne se détaille plus — on ne peut
              pas vendre ce qu'on vient de donner. */}
          <h2 className="mb-2 text-[1.4rem]">
            Ce que vous éviterez en ne faisant pas les 7 erreurs qui donnent votre héritage à
            l&apos;État
          </h2>
          <p className="mb-4 text-[1.06rem]">
            La Méthode est une suite de <strong>8 étapes, dans un ordre précis</strong>. Vous
            n&apos;avez rien à décider par vous-même et rien à improviser. Voilà ce qu&apos;elle met
            hors de portée de votre famille.
          </p>

          {/* L'image porte l'argument mieux que la phrase. Un panneau « À vendre »
              devant une maison, c'est la scène que l'avatar redoute et qu'il n'a
              jamais vue mise en mots. */}
          <figure className="mb-5">
            <div className="relative aspect-[16/9] overflow-hidden border border-grey-line">
              <Image
                src="/img/maison-a-vendre.jpg"
                alt="Un panneau « À vendre » planté devant une maison de famille."
                fill
                sizes="(min-width: 640px) 42rem, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-[0.92rem] text-text-soft">
              {/* ⚠️ Il y avait ici « 1 succession sur 4 ». Retiré : c'était un ordre de
                  grandeur, pas une statistique sourçable. Sur une page qui affiche un
                  article de loi en face de chaque nombre, un chiffre orphelin détruit la
                  crédibilité de tous les autres. N'en remettre un que sourcé (INSEE ou
                  Conseil supérieur du notariat). */}
              Quand les héritiers n&apos;ont pas la somme, c&apos;est la maison qui paie. C&apos;est
              la première chose que la Méthode écarte.
            </figcaption>
          </figure>

          <ul className="mb-5 space-y-3 text-[1.05rem]">
            <Cross>
              <strong>La vente de la maison pour payer l&apos;État.</strong> Six mois pour trouver
              la somme, dans l&apos;urgence, au prix qu&apos;on vous en donne.
            </Cross>
            <Cross>
              <strong>Le chiffre découvert trop tard.</strong> Il existe déjà, il est calculable ce
              soir, et il n&apos;est plus négociable le jour où le notaire l&apos;annonce.
            </Cross>
            <Cross>
              <strong>La date qui se referme sans que personne ne vous prévienne.</strong> Aucune
              administration n&apos;écrit pour dire qu&apos;une possibilité vient de disparaître.
            </Cross>
            <Cross>
              <strong>Les erreurs que vous êtes en train de commettre.</strong> Il y en a presque
              toujours au moins deux, et la plus courante se joue sur un document que vous avez
              signé sans le relire.
            </Cross>
            <Cross>
              <strong>Vos enfants qui décident à votre place, en deuil et sans vous.</strong> Ce que
              vous n&apos;aurez pas écrit, ils devront le deviner.
            </Cross>
          </ul>

          <h3 className="mb-3 text-[1.15rem]">Et ce que vous aurez, ce soir</h3>
          <ul className="mb-5 space-y-3 text-[1.05rem]">
            <Check>
              <strong>Votre chiffre. Le vrai, pas une fourchette.</strong> Ce que l&apos;État
              prendrait si ça arrivait cette année — calculé sur votre maison, votre épargne, votre
              famille. <span className="text-text-soft">(le Simulateur de Facture Invisible)</span>
            </Check>
            <Check>
              <strong>
                Laquelle de vos dates arrive en premier, et ce qu&apos;elle vous coûte.
              </strong>{" "}
              Elles ne tombent pas au même moment pour tout le monde.{" "}
              <span className="text-text-soft">(le Calendrier des 3 Dates)</span>
            </Check>
            <Check>
              <strong>Les sept erreurs, et la correction de chacune.</strong> Dans l&apos;ordre où
              il faut s&apos;en occuper, avec ce qu&apos;il faut vérifier et où.{" "}
              <span className="text-text-soft">(la Méthode, 8 étapes)</span>
            </Check>
            <Check>
              <strong>Comment en parler à votre conjoint sans l&apos;inquiéter.</strong> Une feuille
              qu&apos;il comprend en deux minutes, et qu&apos;il pourra sortir le jour où vous ne
              serez plus là pour l&apos;expliquer.{" "}
              <span className="text-text-soft">(le Plan en 1 Page, la lettre aux enfants)</span>
            </Check>
            <Check>
              <strong>Quoi demander au notaire — et quoi ne surtout pas lui demander.</strong> Pour
              ressortir avec un acte, pas avec « revenez quand vous saurez ».{" "}
              <span className="text-text-soft">(les 12 questions, le manuel de 40 pages)</span>
            </Check>
          </ul>
          <ValueStack rows={PACKAGING} total="429 €" today={<PrixDuJour />} />
          <EchelleDesPrix />
          {/* La justification du prix n'est plus « les 20 premiers membres » :
              c'est le compteur. Une seule rarété à la fois, sinon aucune des
              deux n'est crue. */}
          <div className="mt-5 space-y-3">
            <FlashPrice />
            <CtaMethode label={cta} />
            <div className="flex justify-center">
              <TrustRow />
            </div>
          </div>
        </section>

        {/* ═══ URGENCE — elle précède toujours le dernier appel ═══════ */}
        <TheDeadline />

        {/* ═══ GARANTIE — trois lignes, à sa place ═══════════════════ */}
        <TheGuarantee />

        {/* ═══ FAQ — les objections réelles de `02-avatar.md` ═══════
            Les six questions d'avant étaient polies et théoriques. Celles-ci
            sont copiées de la liste des douze objections de l'avatar, dans ses
            mots à lui, et les réponses ne s'excusent pas : chacune retourne
            l'objection en raison d'agir. */}
        <section className="wrap py-10">
          <h2 className="mb-3 text-[1.4rem]">
            Ce que vous êtes en train de vous dire — et la réponse
          </h2>
          <FAQ
            items={[
              {
                q: "« J'ai le temps, je suis en forme. »",
                a: "C'est exactement ce que pensait tout le monde, la veille. Mais ce n'est même pas le sujet : ces 3 dates ne tombent pas à votre mort, elles se ferment à vos anniversaires. Le compteur des quinze ans court à partir du jour de la signature, pas du jour du décès. À 67 ans, une donation faite ce soir arrive à terme à 82 ans. Faite dans deux ans, à 84. Vous n'attendez pas la mort, vous perdez des années d'avance.",
              },
              {
                q: "« Il faut de toute façon aller chez le notaire, alors autant y aller directement. »",
                a: "Allez-y. Mais un notaire est payé à l'acte : il enregistre ce que vous demandez, il ne fait pas votre stratégie. Arrivez les mains vides, vous ressortez avec « revenez quand vous saurez ce que vous voulez » — et un rendez-vous à deux mois. Arrivez avec votre chiffre, vos trois dates et douze questions écrites, vous ressortez avec un acte. C'est la même consultation, ce n'est pas le même résultat.",
              },
              {
                q: "« Je ne veux pas me déposséder de mon vivant. Et si j'en ai besoin pour l'EHPAD ? »",
                a: "La bonne objection, et personne ne vous demande ça. Le troisième levier transmet les murs de la maison en vous gardant l'usage à vie : vous y habitez, vous la louez si vous voulez, vous en encaissez les loyers. Elle ne sort de votre patrimoine fiscal qu'à votre décès. Et la règle vaut pour le reste : on ne donne jamais ce dont on n'est pas certain de pouvoir se passer. L'étape 4 chiffre précisément ce que vous devez garder.",
              },
              {
                q: "« Mon assurance-vie est déjà faite, c'est réglé. »",
                a: "C'est l'erreur la plus chère des sept, et la plus répandue. Deux questions : vos versements ont-ils été faits avant ou après vos 70 ans ? Et qu'y a-t-il exactement écrit dans votre clause bénéficiaire ? Neuf personnes sur dix ne savent pas répondre. Avant 70 ans, 152 500 € par bénéficiaire passent sans droits. Après, c'est 30 500 € au total, tous contrats et tous bénéficiaires confondus. Même somme, même contrat, cinq fois moins transmis.",
              },
              {
                q: "« 27 € pour un truc que je peux trouver gratuitement sur YouTube. »",
                a: "Vous trouverez tout, gratuitement, et contradictoire. Ce que vous ne trouverez nulle part, c'est VOTRE chiffre, VOS trois dates et l'ordre dans lequel agir sur VOTRE situation. Le prix n'est pas la question : la question est de savoir ce que coûte une soirée de vidéos YouTube qui vous laisse exactement là où vous étiez. Vos enfants, eux, ont 82 194 € en jeu.",
              },
              {
                q: "« Sur internet, c'est des arnaques. Qui êtes-vous pour parler de ça ? »",
                a: "Personne, et c'est volontaire. Héritage Intact n'est pas un gourou : rien ici n'est une opinion. Chaque chiffre est un article du Code général des impôts, affiché à l'écran, vérifiable sur impots.gouv.fr en cinq minutes. Ne nous croyez pas : vérifiez. Et le paiement passe par Stripe, comme sur des milliers de sites marchands — nous ne voyons jamais votre numéro de carte.",
              },
              {
                q: "« C'est compliqué, je ne vais rien comprendre. »",
                a: "Le sujet a été rendu illisible, et pas par hasard : usufruit, nue-propriété, clause démembrée, rapport à succession. Personne ne parle comme ça à table. Ici, zéro jargon : vous remplissez un tableau avec ce que vous possédez, il vous rend un chiffre et trois dates. Si vous savez remplir une feuille d'impôts, vous saurez faire ça.",
              },
              {
                q: "« Ma situation est particulière. »",
                a: "Elle l'est. Je n'en ai jamais vu qui ne le soit pas — famille recomposée, enfant en concubinage, studio locatif, donation de la main à la main jamais déclarée. C'est pour ça que la méthode ne commence pas par une théorie mais par VOTRE chiffre, et que l'étape 7 vous oriente parmi douze situations familiales. Trouvez la vôtre, suivez le plan.",
              },
              {
                q: "« Et si la loi change ? »",
                a: "Elle change. La loi de finances 2026 vient de modifier deux dispositifs. C'est précisément pourquoi les mises à jour sont incluses à vie, et pourquoi une fenêtre supplémentaire — les 100 000 € exonérés pour un logement — se referme le 31 décembre 2026 et n'a pas été prolongée à ce jour. Elle vient en plus de vos 3 dates, elle ne les remplace pas.",
              },
            ]}
          />
        </section>

        {/* ═══ LE DERNIER MOT, puis le bouton ════════════════════════ */}
        {/* Le dernier mot porte son propre bouton : plus de section CTA
            orpheline collée sous la découpe du bloc sombre. */}
        <TheLastWord />
      </main>
      <Footer />

      <StickyCta href="/commande" label={CTA.urgence} />

      {/* La fenêtre de sortie ne donne plus rien — elle ne fait que nommer
          ce qui reste sur la table. Offrir un module gratuit à quelqu'un qui
          part, c'est lui donner une raison de partir. */}
      <ExitPopup storageKey="vsl" title="Ce que vous risquez si vous fermez cette page">
        <ul className="space-y-2 text-[1.03rem]">
          {[
            "Vous ne saurez toujours pas votre chiffre. Il existe déjà, il est calculé sur votre maison et votre épargne, et vous ne l'aurez jamais vu.",
            "Vous ne saurez pas laquelle de vos 3 dates arrive en premier. Elle arrivera quand même.",
            "L'offre à 27 € ne se rouvre pas. Ce compteur ne repart pas de zéro au prochain passage.",
            "Et si rien ne change, ce sont vos enfants qui l'apprendront — dans le bureau d'un notaire, avec six mois pour payer.",
          ].map((t) => (
            <li key={t} className="flex gap-2 border-l-4 border-red bg-red-bg p-3">
              <span aria-hidden className="shrink-0 font-bold text-red">
                ✕
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="text-[1rem] font-bold text-blue">
          Il vous reste {FLASH_MINUTES} minutes de décision, et une soirée de travail. C&apos;est
          tout ce que ça demande.
        </p>
        <CtaMethode label={cta} />
      </ExitPopup>
    </>
  );
}
