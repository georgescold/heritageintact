import type { Metadata } from "next";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { ExitPopup } from "@/components/ExitPopup";
import { FoundersCounter } from "@/components/FoundersCounter";
import { PixelEvent } from "@/components/MetaPixel";
import { StickyCta } from "@/components/StickyCta";
import { UrgencyBar, UrgencyCountdown } from "@/components/Urgency";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ButtonLink, Check, FAQ, Panel, ValueStack } from "@/components/ui";
import { BeforeAfter, TheDeadline, TheNumber } from "@/components/Lp";
import { TheCostOfInaction, TheGuarantee, TheLastWord } from "@/components/LpCeo";
import { CTA, FOUNDERS_CAP, PRIX_APRES_FONDATEURS, PRODUCTS, VIDEO, euros } from "@/lib/config";

export const metadata: Metadata = { title: "Les 3 décisions" };

const PACKAGING = [
  {
    label:
      "Savoir exactement ce que l'État prendra sur votre succession : le Simulateur de Facture Invisible",
    value: "97 €",
  },
  {
    label:
      "Les 7 erreurs et comment les corriger, en français simple : le programme complet (8 modules)",
    value: "147 €",
  },
  {
    label: "Vos 3 dates personnelles : savoir quand agir avant que la porte se ferme",
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
      {/* Le bandeau était absent de la page de vente — c'est-à-dire de la seule
          page où l'on demande de l'argent. Il est tout en haut, au-dessus de
          l'en-tête, comme sur les landing pages. */}
      <UrgencyBar />
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
          <p className="mb-5 text-[1.12rem] leading-snug">
            <strong>Trois décisions divisent cette part par trois.</strong> Elles sont écrites dans
            le Code général des impôts, elles se prennent de votre vivant, et elles ne vous
            demandent ni de vendre, ni de quitter votre maison.
          </p>

          <VideoEmbed id={VIDEO.vsl} title="Les 3 décisions" minutes={9} />

          <div className="mt-5 space-y-3">
            <ButtonLink href="/commande">{cta}</ButtonLink>
            <p className="text-center text-[0.95rem] text-text-soft">
              {euros(PRODUCTS.front.price)} au lieu de{" "}
              <span className="line-through">{euros(PRODUCTS.front.anchor)}</span> · accès immédiat
              · garantie 30 jours, sans justification
            </p>
            {/* Les deux raretés côte à côte, et les deux sont vraies : le
                nombre de places lit la base et descend à chaque vente ; le
                compte à rebours bat à la seconde vers une date votée au
                Parlement. C'est ce qui donne du mouvement à l'écran sans
                inventer un seul chiffre. */}
            <FoundersCounter />
            <UrgencyCountdown />
          </div>
        </section>

        {/* ═══ PREUVE — le chiffre, ligne par ligne ════════════════════ */}
        <TheNumber />

        {/* ═══ PREUVE — l'écart, rendu visible ════════════════════════ */}
        <BeforeAfter />

        {/* ═══ L'OFFRE — ce qu'il y a dans la boîte ═══════════════════ */}
        <section className="wrap py-10">
          {/* Des BÉNÉFICES, pas des fonctionnalités. « 8 modules de 8 à 12
              minutes » ne déclenche rien : c'est un bordereau de livraison. Ce
              qui déclenche, c'est ce que le lecteur pourra faire ce soir-là, et
              ce qu'il cessera de craindre. Le nom du livrable passe derrière. */}
          <h2 className="mb-4 text-[1.4rem]">Ce que vous saurez ce soir</h2>
          <ul className="mb-5 space-y-3 text-[1.05rem]">
            <Check>
              <strong>Votre chiffre. Le vrai, pas une fourchette.</strong> Ce que l&apos;État
              prendrait si ça arrivait cette année — calculé sur votre maison, votre épargne, votre
              famille. <span className="text-text-soft">(le Simulateur de Facture Invisible)</span>
            </Check>
            <Check>
              <strong>Laquelle de vos trois portes se ferme en premier.</strong> Elles dépendent de
              votre âge, et il y en a toujours une beaucoup plus proche que les deux autres.{" "}
              <span className="text-text-soft">(le Calendrier des 3 Dates)</span>
            </Check>
            <Check>
              <strong>Les erreurs que vous êtes en train de commettre.</strong> Il y en a toujours
              au moins deux. Souvent quatre. Et celle de l&apos;assurance-vie de votre banque coûte
              à elle seule des dizaines de milliers d&apos;euros.{" "}
              <span className="text-text-soft">(le programme, 8 modules)</span>
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
              <span className="text-text-soft">(les 12 questions, le guide de 40 pages)</span>
            </Check>
          </ul>
          <ValueStack rows={PACKAGING} total="429 €" today={euros(PRODUCTS.front.price)} />
          <p className="mt-3 text-[0.95rem] text-text-soft">
            Pourquoi {euros(PRODUCTS.front.price)} pour {euros(PRODUCTS.front.anchor)} de contenu ?
            Parce que les {FOUNDERS_CAP} premiers membres nous donnent leurs retours pour la version
            2 du simulateur. En échange, ils ont le prix fondateur à vie, mises à jour comprises. À
            la {FOUNDERS_CAP}
            <sup>e</sup> place, le prix passe à {euros(PRIX_APRES_FONDATEURS)} et n&apos;en
            redescend plus.
          </p>
          <div className="mt-5 space-y-3">
            <ButtonLink href="/commande">{cta}</ButtonLink>
            <div className="flex justify-center">
              <TrustRow />
            </div>
          </div>
        </section>

        {/* ═══ URGENCE — elle précède toujours le dernier appel ═══════ */}
        <TheDeadline />

        {/* ═══ LE COÛT DE L'INACTION — le vrai risque n'est pas d'acheter ══ */}
        <TheCostOfInaction />

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
                a: "C'est exactement ce que pensait tout le monde, la veille. Mais ce n'est même pas le sujet : les portes ne se ferment pas à votre mort, elles se ferment à vos anniversaires. Le compteur des quinze ans court à partir du jour de la signature, pas du jour du décès. À 67 ans, une donation faite ce soir arrive à terme à 82 ans. Faite dans deux ans, à 84. Vous n'attendez pas la mort, vous perdez des années d'avance.",
              },
              {
                q: "« Il faut de toute façon aller chez le notaire, alors autant y aller directement. »",
                a: "Allez-y. Mais un notaire est payé à l'acte : il enregistre ce que vous demandez, il ne fait pas votre stratégie. Arrivez les mains vides, vous ressortez avec « revenez quand vous saurez ce que vous voulez » — et un rendez-vous à deux mois. Arrivez avec votre chiffre, vos trois dates et douze questions écrites, vous ressortez avec un acte. C'est la même consultation, ce n'est pas le même résultat.",
              },
              {
                q: "« Je ne veux pas me déposséder de mon vivant. Et si j'en ai besoin pour l'EHPAD ? »",
                a: "La bonne objection, et personne ne vous demande ça. Le troisième levier transmet les murs de la maison en vous gardant l'usage à vie : vous y habitez, vous la louez si vous voulez, vous en encaissez les loyers. Elle ne sort de votre patrimoine fiscal qu'à votre décès. Et la règle vaut pour le reste : on ne donne jamais ce dont on n'est pas certain de pouvoir se passer. Le module 4 chiffre précisément ce que vous devez garder.",
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
                a: "Elle l'est. Je n'en ai jamais vu qui ne le soit pas — famille recomposée, enfant en concubinage, studio locatif, donation de la main à la main jamais déclarée. C'est pour ça que la méthode ne commence pas par une théorie mais par VOTRE chiffre, et que le module 7 vous oriente parmi douze situations familiales. Trouvez la vôtre, suivez le plan.",
              },
              {
                q: "« Et si la loi change ? »",
                a: "Elle change. La loi de finances 2026 vient de modifier deux dispositifs. C'est précisément pourquoi les mises à jour sont incluses à vie, et pourquoi une des trois portes — la fenêtre des 100 000 € exonérés — ferme le 31 décembre 2026 et n'a pas été prolongée à ce jour.",
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

      <ExitPopup
        storageKey="vsl"
        title="Vous hésitez ? C'est normal. Regardez d'abord le module 1."
      >
        <Panel tone="grey">
          <p>
            « Je verrai ça plus tard », le compteur des 15 ans. En accès libre pendant 24 heures.
            Regardez-le, puis décidez.
          </p>
        </Panel>
        <ButtonLink href="/module-1" variant="blue">
          Voir le module 1 gratuitement
        </ButtonLink>
      </ExitPopup>
    </>
  );
}
