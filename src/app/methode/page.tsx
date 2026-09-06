import type { Metadata } from "next";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { ExitPopup } from "@/components/ExitPopup";
import { FoundersCounter } from "@/components/FoundersCounter";
import { PixelEvent } from "@/components/MetaPixel";
import { StickyCta } from "@/components/StickyCta";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ButtonLink, Check, FAQ, Panel, ValueStack } from "@/components/ui";
import { BeforeAfter, TheDeadline, TheNumber } from "@/components/Lp";
import { TheGuarantee, TheLastWord } from "@/components/LpCeo";
import { PRODUCTS, VIDEO, euros } from "@/lib/config";

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
  const cta = `Je veux mon chiffre et les 3 décisions : ${euros(PRODUCTS.front.price)}`;

  return (
    <>
      <PixelEvent name="Lead" />
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
          <p className="mb-5 text-[1.05rem]">
            Voici les trois décisions qui divisent cette part par trois —{" "}
            <strong>légalement, de votre vivant, en trois semaines</strong>, sans rien vendre et
            sans quitter votre maison. <strong>Regardez cette vidéo de 9 minutes.</strong>
          </p>

          <VideoEmbed id={VIDEO.vsl} title="Les 3 décisions" minutes={9} />

          <div className="mt-5 space-y-3">
            <ButtonLink href="/commande">{cta}</ButtonLink>
            <p className="text-center text-[0.95rem] text-text-soft">
              au lieu de <span className="line-through">{euros(PRODUCTS.front.anchor)}</span>.
              Garantie 30 jours, satisfait ou remboursé.
            </p>
            <FoundersCounter />
          </div>
        </section>

        {/* ═══ PREUVE — le chiffre, ligne par ligne ════════════════════ */}
        <TheNumber />

        {/* ═══ PREUVE — l'écart, rendu visible ════════════════════════ */}
        <BeforeAfter />

        {/* ═══ L'OFFRE — ce qu'il y a dans la boîte ═══════════════════ */}
        <section className="wrap py-10">
          <h2 className="mb-4 text-[1.4rem]">
            Ce que vous recevez dans les deux minutes qui suivent
          </h2>
          <ul className="mb-5 space-y-2 text-[1.05rem]">
            <Check>
              <strong>Le programme « Les 7 Erreurs »</strong> : 8 modules de 8 à 12 minutes,
              regardables sur télé, tablette ou téléphone, accès à vie
            </Check>
            <Check>
              <strong>Le Simulateur de Facture Invisible</strong> : votre chiffre en 20 minutes,
              version tableur et version papier
            </Check>
            <Check>
              <strong>Le Calendrier des 3 Dates</strong> : vos échéances personnelles (70 ans, 71
              ans, le compteur des 15 ans) sur une page
            </Check>
            <Check>
              <strong>Le Plan en 1 Page</strong> : la fiche qui résume vos 3 décisions
            </Check>
            <Check>
              <strong>Le guide imprimable de 40 pages</strong> et 5 bonus
            </Check>
          </ul>
          <ValueStack rows={PACKAGING} total="429 €" today={euros(PRODUCTS.front.price)} />
          <p className="mt-3 text-[0.95rem] text-text-soft">
            Pourquoi {euros(PRODUCTS.front.price)} ? Prix fondateur pour les 500 premiers membres :
            nous collectons vos retours pour la version 2 du simulateur. Au 500<sup>e</sup>, le prix
            passe à {euros(PRODUCTS.front.anchor)}.
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

        {/* ═══ GARANTIE ══════════════════════════════════════════════ */}
        <TheGuarantee />

        {/* ═══ FAQ — les objections, en titres de section ════════════ */}
        <section className="wrap py-10">
          <h2 className="mb-3 text-[1.4rem]">Questions fréquentes</h2>
          <FAQ
            items={[
              {
                q: "Est-ce que ça remplace le notaire ?",
                a: "Non. Ça vous permet d'y aller avec un dossier et des décisions, au lieu des mains vides. Le notaire acte ; vous décidez.",
              },
              {
                q: "Ma situation est particulière.",
                a: "Elle l'est, comme presque toutes. La méthode commence par votre chiffre et vos dates, pas par une théorie. Le module 7 vous oriente selon votre situation familiale.",
              },
              {
                q: "Je ne veux pas me déposséder de mon vivant.",
                a: "Personne ne vous le demande. Le troisième levier transmet la maison en vous gardant chez vous, à vie. Et on ne donne jamais ce dont on n'est pas sûr de pouvoir se passer.",
              },
              {
                q: "Et si la loi change ?",
                a: "La Règle de Mise à Jour est incluse, et les mises à jour du programme sont à vie.",
              },
              {
                q: "Je trouve ça gratuitement sur YouTube.",
                a: "Gratuit, contradictoire, et sans votre chiffre. Ici : votre chiffre, votre plan, dans l'ordre.",
              },
              {
                q: "Je ne suis pas à l'aise avec le paiement en ligne.",
                a: "Le paiement passe par Stripe, le même système que des milliers de sites marchands. Nous ne voyons jamais votre numéro de carte. Et il y a une adresse email de contact avec une vraie personne derrière.",
              },
            ]}
          />
        </section>

        {/* ═══ LE DERNIER MOT, puis le bouton ════════════════════════ */}
        <TheLastWord />

        <section className="wrap pb-12">
          <ButtonLink href="/commande">{cta}</ButtonLink>
          <p className="mt-3 text-center text-[0.95rem] text-text-soft">
            Garantie 30 jours, sans justification à fournir. Vous gardez le simulateur.
          </p>
        </section>
      </main>
      <Footer />

      <StickyCta href="/commande" label={`Accéder au programme — ${euros(PRODUCTS.front.price)}`} />

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
