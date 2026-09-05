import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Les blocs de la landing page, structure MAX (05-funnel/landing-pages.md, LP #6) :
 * qualification → autorité + résultats chiffrés → promesse + garantie → CTA → disqualification.
 *
 * Trois règles de projet tiennent tout ce fichier :
 *
 * 1. La QUALIFICATION s'écrit à la 2e personne, comme l'enseigne la structure MAX :
 * on interpelle l'avatar directement, sinon la structure perd son premier bloc.
 *    ⚠️ Cette liberté s'arrête à la page. Dans les ANNONCES Meta, la règle Personal
 *    Attributes reste absolue — jamais « vous » + un attribut (âge, patrimoine,
 * statut familial, santé). Voir 08-creatives-ads.md, qui s'écrit en 1re ou en
 *    3e personne. Ne jamais recopier une phrase de cette page dans une annonce.
 * 2. Aucune preuve inventée : la seule autorité citée est le Code général des impôts.
 * 3. Aucun visage : la marque est éditoriale, les photos sont des scènes
 *    (15-identite-visuelle.md).
 */

/* ─────────────────────────────────────────────────────────────────
   Une section de page, avec ses variantes de fond.
   ───────────────────────────────────────────────────────────── */
export function Section({
 children,
 tone = "white",
 id,
 wide = false,
}: {
 children: ReactNode;
 tone?: "white" | "grey" | "blue";
 id?: string;
 wide?: boolean;
}) {
 const bg = {
 white: "bg-white",
 grey: "bg-grey-bg border-y border-grey-line",
 blue: "band-blue",
  }[tone];
 return (
    <section id={id} className={`${bg} py-9 sm:py-14`}>
      <div className={wide ? "wrap-wide" : "wrap"}>{children}</div>
    </section>
  );
}

/** Titre de section : filet orange, puis le titre. */
export function SectionTitle({ children, light = false }: { children: ReactNode; light?: boolean }) {
 return (
    <>
      <span className="rule-orange mb-4" />
      <h2 className={`mb-5 text-[1.5rem] leading-tight sm:text-[2rem] ${light ? "text-white" : ""}`}>
        {children}
      </h2>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   1. HERO — qualification, bénéfice, objection, mécanisme, chiffre.
   ───────────────────────────────────────────────────────────── */
export function Hero({ form }: { form: ReactNode }) {
 return (
    <section className="relative isolate overflow-hidden">
      <Image
 src="/img/lettre-notaire.jpg"
 alt=""
 fill
 priority
 sizes="100vw"
 className="object-cover object-center"
      />
      <span className="scrim" />

      {/*
        Trois blocs, deux ordres.

        Sur téléphone : titre → FORMULAIRE → chiffre. Le bouton passe au-dessus
 de la ligne de flottaison, ce qui est la seule optimisation de LP qui se
 voit tout de suite dans le taux d'opt-in. Le chiffre reste juste dessous,
 il donne la raison de faire défiler.

        À partir de 64rem : deux colonnes, tout est visible d'un coup.
      */}
      <div className="wrap-wide relative grid items-center gap-5 py-6 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-12 lg:gap-y-6 lg:py-12">
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          {/* Qualification : l'appel direct à l'avatar, avant même le titre */}
          <p className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange sm:text-[0.9rem]">
            Propriétaires de plus de 60 ans · France
          </p>

          <h1 className="mb-3 text-[1.6rem] leading-[1.12] text-white sm:text-[2.3rem] lg:text-[2.6rem]">
            Vous avez une maison payée et des enfants&nbsp;?
            <br />
            <span className="text-orange">Voici ce que l&apos;État prendra dessus.</span>
          </h1>

          {/* L'objection levée, immédiatement */}
          <p className="max-w-[36rem] text-[1.05rem] text-white/90 sm:text-[1.15rem]">
            Ce soir, en 20 minutes, chez vous. Sans rendez-vous et{" "}
            <strong className="text-white">sans donner un centime de votre vivant.</strong>
          </p>
        </div>

        {/*
          Chaque nombre porte son étiquette. La première version montrait
          « 82 194 € barré → 23 794 € » sans dire de quoi il s'agissait : on
 y lisait une remise sur le prix du programme. Un chiffre qu'on doit
 expliquer est un chiffre perdu.
        */}
        <div className="order-3 max-w-[34rem] border-l-4 border-orange bg-black/50 lg:col-start-1 lg:row-start-2">
          <p className="border-b border-white/20 px-4 py-2 text-[0.8rem] uppercase tracking-[0.1em] text-white/70">
            Cas type · Maison 380 000 € · Épargne 140 000 € · Un enfant
          </p>
          <dl className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-2">
              <dt className="text-[0.98rem] text-white/85">
                Ce que l&apos;État prend aujourd&apos;hui
              </dt>
              <dd className="figure-lg whitespace-nowrap text-white">82 194 €</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-b border-white/15 py-2">
              <dt className="text-[0.98rem] text-white/85">
                Ce qu&apos;il prendrait après les 3 décisions
              </dt>
              <dd className="whitespace-nowrap text-[1.35rem] font-bold text-white/70">23 794 €</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 pt-2">
              <dt className="text-[1.02rem] font-bold text-white">
                Ce qui reste dans la famille
              </dt>
              <dd className="figure-lg whitespace-nowrap text-orange">+ 58 400 €</dd>
            </div>
          </dl>
          <p className="border-t border-white/20 px-4 py-2 text-[0.85rem] text-white/60">
            Barème officiel, art. 777 du CGI. Cas illustratif, calcul détaillé plus bas.
          </p>
        </div>

        <div className="order-2 border-2 border-blue bg-white p-4 sm:p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <p className="mb-1 text-[1.15rem] font-bold text-blue">
            Recevez la vidéo de 9 minutes, gratuitement
          </p>
          {/* Le mécanisme, en une ligne : ici il dit ce que la vidéo contient. */}
          <p className="mb-3 text-[0.92rem] text-text-soft">
            La Méthode des 3 Verrous : trois décisions écrites dans le Code général des impôts, que
 les familles averties prennent de leur vivant.
          </p>
          {form}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   2. AUTORITÉ — la nôtre est empruntée, et c'est la plus forte.
   ───────────────────────────────────────────────────────────── */
export function AuthorityBand() {
 const sources = [
    { art: "Art. 777 et 779", quoi: "Le barème et l'abattement de 100 000 € par enfant" },
    { art: "Art. 990 I et 757 B", quoi: "L'assurance-vie, avant et après votre 70e anniversaire" },
    { art: "Art. 669", quoi: "La valeur de votre maison selon votre âge, à l'année près" },
  ];
 return (
    <Section tone="blue">
      <SectionTitle light>Ces chiffres ne sont pas les nôtres.</SectionTitle>
      <p className="mb-6 max-w-[40rem] text-[1.05rem] text-white/85">
        Ils sont dans le Code général des impôts. Vous pouvez tous les vérifier ce soir sur
 impots.gouv.fr, <strong className="text-white">avant même de nous donner votre email</strong>.
        C&apos;est d&apos;ailleurs ce que nous vous conseillons de faire.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {sources.map((s) => (
          <div key={s.art} className="border border-white/25 bg-white/5 p-4">
            <p className="mb-1 font-bold text-orange">{s.art}</p>
            <p className="text-[0.95rem] text-white/85">{s.quoi}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[0.95rem] text-white/70">
        Nous ne vendons ni contrat, ni placement, ni assurance. Nous n&apos;avons rien à vous faire
 signer. Nous expliquons ce que la loi permet déjà.
      </p>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   3. LE CALCUL — la preuve par la démonstration.
   ───────────────────────────────────────────────────────────── */
export function TheNumber() {
 const lignes = [
 ["Maison de province, payée", "380 000 €"],
 ["Assurance-vie et livrets", "140 000 €"],
 ["Abattement, un enfant", "− 100 000 €"],
 ["Reste à taxer", "420 000 €"],
  ];
 return (
    <Section tone="grey">
      <SectionTitle>D&apos;où sortent les 82 194 €</SectionTitle>
      <p className="mb-5 text-[1.05rem]">
        Rien d&apos;exceptionnel dans cette famille. Une maison de ville moyenne, quarante ans de
 remboursements, des économies laissées sur un contrat ouvert à la banque en 2003. Un enfant.
      </p>

      <div className="overflow-hidden border border-grey-line bg-white">
        <table className="w-full text-left">
          <tbody>
            {lignes.map(([l, v], i) => (
              <tr key={l} className={i < 3 ? "border-b border-grey-line-soft" : "border-b border-blue bg-grey-bg"}>
                <td className="px-4 py-2.5">{l}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right font-bold tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-4">
          <span className="text-[1.05rem] font-bold text-blue">
            Droits de succession à payer, sous six mois
          </span>
          <span className="figure-xl text-red">82 194 €</span>
        </div>
      </div>

      <p className="mt-5 text-[1.05rem]">
        Le barème monte vite : 5 %, puis 10 %, puis 15 %, et <strong>20 % sur tout le reste</strong>{" "}
 dès 15 932 € au-dessus de l&apos;abattement. Une maison de province et des économies suffisent
 pour y être.
      </p>

      <blockquote className="mt-6 border-l-4 border-orange bg-white p-4 text-[1.1rem] leading-snug text-blue sm:p-5 sm:text-[1.25rem]">
        Sur le trottoir, en sortant de l&apos;étude, le notaire a dit&nbsp;: «&nbsp;
        <em>si votre père était venu dix ans plus tôt, on aurait divisé ça par trois.</em>&nbsp;»
      </blockquote>
      <p className="mt-3 text-[0.9rem] text-text-soft">
        Cas type construit à partir du barème officiel, à titre d&apos;illustration. Votre chiffre
 dépend de votre situation — c&apos;est précisément ce que la vidéo vous apprend à calculer.
      </p>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   4. L'ENNEMI — le silence, pas la loi.
   ───────────────────────────────────────────────────────────── */
export function TheEnemy() {
 return (
    <Section>
      <SectionTitle>Personne ne lui avait rien dit. Et personne n&apos;est payé pour ça.</SectionTitle>
      <div className="space-y-4 text-[1.05rem]">
        <p>
          Sa banque le voyait deux fois par an. Elle lui a vendu un contrat, jamais expliqué ce
 qu&apos;il fallait en faire avant 70 ans.
        </p>
        <p>
          Son notaire l&apos;aurait très bien conseillé. Encore fallait-il aller le voir{" "}
          <strong>avant</strong>. Un notaire applique ce que vous avez décidé. Il n&apos;est pas payé
 pour venir sonner chez vous pendant qu&apos;il est encore temps.
        </p>
        <p>
          L&apos;État, lui, n&apos;a aucune raison de vous prévenir. Les abattements, les donations, le
 démembrement, tout est public, écrit, légal, et gratuit à connaître. Simplement, personne ne
 vous l&apos;envoie par courrier.
        </p>
        <p className="border-l-4 border-blue bg-grey-bg p-4 text-[1.15rem] font-bold text-blue">
          Ce n&apos;est pas la loi, le problème. C&apos;est le silence.
        </p>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   5. AVANT / APRÈS — deux photos, deux états.
   ───────────────────────────────────────────────────────────── */
export function BeforeAfter() {
 return (
    <Section tone="grey" wide>
      <div className="wrap px-0">
        <SectionTitle>Ce que vos enfants trouveront sur la table</SectionTitle>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
 src="/img/avant-desordre.jpg"
 alt="Une table couverte de courriers, de relevés et de chemises cartonnées en désordre."
 fill
 sizes="(min-width: 640px) 30rem, 100vw"
 className="object-cover"
            />
            <span className="absolute left-0 top-0 bg-red px-3 py-1.5 text-[0.9rem] font-bold uppercase tracking-wider text-white">
              Sans plan
            </span>
          </div>
          <figcaption className="mt-3 text-[1rem]">
            Onze mois de démarches. Vingt-deux organismes à prévenir. Des mots de passe que personne
 n&apos;a. Et une facture de 82 194 € qui tombe pendant qu&apos;ils font le tri.
          </figcaption>
        </figure>

        <figure>
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
 src="/img/apres-classeur.jpg"
 alt="Une table nette avec un classeur bleu marine fermé et une pile de feuilles rangée."
 fill
 sizes="(min-width: 640px) 30rem, 100vw"
 className="object-cover"
            />
            <span className="absolute left-0 top-0 bg-green px-3 py-1.5 text-[0.9rem] font-bold uppercase tracking-wider text-white">
              Avec un plan
            </span>
          </div>
          <figcaption className="mt-3 text-[1rem]">
            Un document d&apos;une page. Les trois décisions déjà prises, datées, signées. Et une
 facture divisée par trois, parfois davantage.
          </figcaption>
        </figure>
      </div>
      {/* Les deux colonnes, ligne à ligne. C'est le bloc le plus dur de la page,
 et c'est celui qui fait le plus de travail : chacun se place tout seul
 dans l'une des deux listes. */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="border-2 border-red bg-red-bg">
          <p className="border-b-2 border-red bg-red px-4 py-2 text-[1.05rem] font-bold text-white">
            Le jour où ça arrive, sans plan
          </p>
          <ul className="space-y-2 p-4 text-[1rem]">
            {[
              "Une facture de 82 194 €, à régler sous six mois",
              "L'épargne bloquée pendant tout le règlement",
              "La maison mise en vente pour payer l'État",
              "Des décisions prises à plusieurs, dans l'urgence",
              "Le contrat d'assurance-vie mal réglé, découvert trop tard",
              "Des mois de démarches, sans savoir par quoi commencer",
              "Un enfant qui porte tout, les autres qui commentent",
              "Le deuil, avec de l'administratif par-dessus",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="shrink-0 font-bold text-red">
                  ✕
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-green bg-green-bg">
          <p className="border-b-2 border-green bg-green px-4 py-2 text-[1.05rem] font-bold text-white">
            Le jour où ça arrive, avec le plan
          </p>
          <ul className="space-y-2 p-4 text-[1rem]">
            {[
              "Une facture de 23 794 €, connue depuis des années",
              "De quoi la payer, prévu à l'avance",
              "La maison qui reste dans la famille",
              "Les décisions déjà prises, datées, signées",
              "La clause bénéficiaire relue et corrigée à temps",
              "Un document d'une page qui dit quoi faire, dans l'ordre",
              "Personne à blâmer, personne à convaincre",
              "De la place pour faire son deuil",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="shrink-0 font-bold text-green">
                  ✔
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="wrap mt-6 px-0 text-[1.05rem]">
        La différence entre ces deux colonnes ne tient ni à l&apos;argent, ni à l&apos;intelligence,
 ni à l&apos;amour qu&apos;on porte à ses enfants. <strong>Elle tient à un après-midi.</strong>
      </p>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   6. L'URGENCE — vraie, datée, vérifiable. Règle n°1 d'une LP.
   ───────────────────────────────────────────────────────────── */
export function ThreeDoors() {
 const portes = [
    {
 t: "Le compteur des 15 ans",
 d: "Une donation ne s'efface fiscalement qu'au bout de quinze ans. À 67 ans, il faut atteindre 82 ans pour recharger l'abattement. Chaque année d'attente est une année perdue, définitivement.",
 cout: "L'abattement de 100 000 € par enfant ne sert qu'une fois, au décès, au lieu d'avoir servi deux fois.",
    },
    {
 t: "Votre 70e anniversaire",
 d: "Avant : 152 500 € transmis hors droits, pour chacun de vos bénéficiaires. Après : 30 500 € au total, tous bénéficiaires et tous vos contrats confondus. Le même argent, sur le même contrat.",
 cout: "122 000 € d'abattement en moins sur le même contrat, pour une date de versement.",
    },
    {
 t: "Votre 71e anniversaire",
 d: "Tant que vous n'avez pas 71 ans, la valeur transmise de votre maison est calculée sur 60 %. Le jour de vos 71 ans, elle passe à 70 %. Dix points de patrimoine, pour un anniversaire.",
 cout: "Sur une maison à 380 000 € : 38 000 € de base taxable en plus, du jour au lendemain.",
    },
  ];
 return (
    <Section>
      <SectionTitle>Trois portes se ferment avec le temps. Aucune ne se rouvre.</SectionTitle>
      <div className="space-y-3">
        {portes.map((p, i) => (
          <div key={p.t} className="border border-grey-line bg-white">
            <div className="flex gap-4 p-4">
              <span className="figure-lg shrink-0 text-grey-line" aria-hidden>
                {i + 1}
              </span>
              <div>
                <p className="mb-1 text-[1.1rem] font-bold text-blue">{p.t}</p>
                <p className="text-[1rem]">{p.d}</p>
              </div>
            </div>
            {/* Le prix de l'inaction, chiffré, sous chaque porte. */}
            <p className="border-t border-red/30 bg-red-bg px-4 py-2 text-[0.95rem]">
              <strong className="text-red">⚠ Si la porte se ferme&nbsp;:</strong> {p.cout}
            </p>
          </div>
        ))}
      </div>

      {/* La quatrième, celle qui a une date au calendrier */}
      <div className="mt-5 overflow-hidden border-2 border-orange">
        <div className="relative">
          <div className="relative aspect-[21/6]">
            <Image
 src="/img/calendrier.jpg"
 alt="Un calendrier mural avec une date entourée au stylo rouge."
 fill
 sizes="(min-width: 640px) 46rem, 100vw"
 className="object-cover object-center"
            />
            <span className="scrim" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
              Et il y en a une quatrième
            </p>
            <p className="figure-lg text-white">31 décembre 2026</p>
          </div>
        </div>
        <div className="bg-yellow-bg p-4">
          <p className="text-[1rem]">
            Depuis février 2025, un dispositif temporaire permet de donner{" "}
            <strong>jusqu&apos;à 100 000 € par parent</strong>, totalement exonérés, à un enfant ou un
 petit-enfant qui achète son logement ou fait des travaux de rénovation énergétique
            (art. 790 A bis du CGI). <strong>Il s&apos;arrête le 31 décembre 2026</strong> et
 n&apos;a pas été prolongé à ce jour.
          </p>
          <p className="mt-2 text-[0.95rem] text-text-soft">
            Ce n&apos;est pas un compte à rebours de page de vente. C&apos;est une date votée au
            Parlement, que vous pouvez vérifier sur legifrance.gouv.fr.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   7. L'OBJECTION EN TITRE DE SECTION — repris du benchmark US.
   ───────────────────────────────────────────────────────────── */
export function NotThis() {
 const items = [
    {
 t: "Ce n'est pas un testament.",
 d: "Un testament dit qui reçoit quoi. Il ne fait pas baisser la facture d'un centime. C'est le malentendu le plus coûteux du sujet : des milliers de familles croient avoir tout réglé parce qu'elles en ont un.",
    },
    {
 t: "Ce n'est pas un notaire.",
 d: "Vous irez chez le notaire, et c'est très bien. Vous irez simplement en sachant quoi lui demander, au lieu de découvrir vos options en face de lui, montre en main.",
    },
    {
 t: "Ce n'est pas un placement.",
 d: "Aucun contrat à souscrire, aucun produit à acheter, aucune commission. Nous ne sommes ni banque, ni assureur, ni courtier, et nous n'avons rien à vous vendre après.",
    },
    {
 t: "Ce n'est pas une application.",
 d: "Pas de compte à créer, pas de mot de passe à retenir. Une vidéo, un simulateur qui tient dans un navigateur, et un plan qui s'imprime sur une page.",
    },
  ];
 return (
    <Section tone="grey">
      <SectionTitle>
        Non, ce n&apos;est ni un testament, ni un notaire, ni un placement de plus.
      </SectionTitle>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.t} className="border border-grey-line bg-white p-4">
            <p className="mb-1 text-[1.05rem] font-bold text-blue">{it.t}</p>
            <p>{it.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l-4 border-green bg-green-bg p-4 text-[1.05rem]">
        Et une question qui vaut le détour&nbsp;:{" "}
        <strong>avez-vous déjà vu une facture de notaire arriver avec une garantie de
 remboursement&nbsp;?</strong>{" "}
        Nous, si. C&apos;est la nôtre, 30 jours, sans justification.
      </p>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   8. LA PEUR — la maison. Le visuel n°1 du projet.
   ───────────────────────────────────────────────────────────── */
export function TheFear() {
 return (
    <section className="relative isolate overflow-hidden">
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/8]">
        <Image
 src="/img/maison-a-vendre.jpg"
 alt="Une maison de banlieue aux volets fermés, avec un panneau « À vendre » planté devant."
 fill
 sizes="100vw"
 className="object-cover object-center"
        />
        <span className="scrim" />
        <div className="absolute inset-0 flex items-center">
          <div className="wrap">
            <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
              La vraie question
            </p>
            <h2 className="mb-3 max-w-[30rem] text-[1.5rem] leading-tight text-white sm:text-[2.1rem]">
              Vos enfants paieront. La question, c&apos;est avec quel argent.
            </h2>
            <p className="max-w-[32rem] text-[1rem] text-white/85 sm:text-[1.1rem]">
              Les droits de succession se règlent dans les six mois, en euros, pas en parts de maison.
              Quand votre épargne ne suffit pas, il reste une seule solution. Vos enfants la
 connaissent déjà, longtemps avant d&apos;oser vous en parler.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   9. LE RÊVE — les clés. On finit sur ce qu'on veut, pas sur la peur.
   ───────────────────────────────────────────────────────────── */
export function TheDream() {
 return (
    <Section wide>
      <div className="grid items-center gap-6 sm:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
          <Image
 src="/img/mains-cles.jpg"
 alt="Des mains âgées qui transmettent un trousseau de clés au-dessus d'une table en bois."
 fill
 sizes="(min-width: 640px) 30rem, 100vw"
 className="object-cover"
          />
        </div>
        <div>
          <SectionTitle>Ou alors, il y a l&apos;autre version</SectionTitle>
          <div className="space-y-3 text-[1.05rem]">
            <p>
              Celle où il n&apos;y a rien à décider dans l&apos;urgence, rien à vendre, rien à se
 disputer. Où la maison reste dans la famille parce que c&apos;était prévu.
            </p>
            <p>
              Où vous voyez, de votre vivant, vos petits-enfants recevoir un coup de main pour
 démarrer — au lieu d&apos;imaginer ce qu&apos;ils en feront.
            </p>
            <p className="text-[1.15rem] font-bold text-blue">
              Celle où l&apos;on dit, après&nbsp;: «&nbsp;il avait tout prévu, on n&apos;a eu à
 s&apos;occuper de rien.&nbsp;»
            </p>
            <p className="text-text-soft">
              Cela ne peut se faire qu&apos;à un seul moment&nbsp;: un après-midi ordinaire, en bonne
 santé, pendant que tout est encore possible.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   10. LA DISQUALIFICATION ⭐ — l'élément signature de la LP MAX.
   Deux effets : des leads qualifiés, et Meta qui récompense la qualité.
   ───────────────────────────────────────────────────────────── */
export function Disqualification() {
 const cas = [
    "Vous êtes locataire et sans épargne : vos héritiers ne paieront probablement rien. Gardez vos 20 minutes.",
    "Vous avez un enfant et moins de 100 000 € de patrimoine : l'abattement couvre déjà tout, cette vidéo ne vous apprendrait rien.",
    "Vous cherchez un moyen de ne pas déclarer quelque chose : ici tout est légal, déclaré, et vérifiable article par article. Vous perdriez votre temps.",
  ];
 return (
    <div className="border-2 border-red bg-red-bg p-4 sm:p-5">
      <p className="mb-3 text-[1.1rem] font-bold text-red">
        <span aria-hidden>⚠</span> Ne remplissez pas ce formulaire si&nbsp;:
      </p>
      <ul className="space-y-2">
        {cas.map((c) => (
          <li key={c} className="flex gap-2 text-[1rem]">
            <span aria-hidden className="shrink-0 font-bold text-red">
              ✕
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.95rem] text-text-soft">
        Nous préférons vous le dire avant. Une vidéo qui ne sert à rien fait perdre du temps à
 tout le monde.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   11. BANDEAU PHOTO — le hero des variantes A/B.
   Même langage visuel que la LP MAX, structure différente : c'est
 la structure qu'on teste, pas le design.
   ───────────────────────────────────────────────────────────── */
export function PhotoBanner({
 image,
 kicker,
 title,
 children,
}: {
 image: string;
 kicker: string;
 title: ReactNode;
 children?: ReactNode;
}) {
 return (
    <section className="relative isolate overflow-hidden">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center" />
      <span className="scrim" />
      <div className="wrap relative py-8 sm:py-14">
        <p className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange sm:text-[0.9rem]">
          {kicker}
        </p>
        <h1 className="mb-4 text-[1.7rem] leading-[1.14] text-white sm:text-[2.3rem]">{title}</h1>
        {children && <div className="max-w-[38rem] text-[1.05rem] text-white/90 sm:text-[1.15rem]">{children}</div>}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   12. L'ÉCART QUE PERSONNE NE MONTRE
   Trois scènes, chacune suivie de sa résolution. Structure reprise de
 myestatekit.co.uk, qui l'utilise comme bloc principal de sa page.
   ───────────────────────────────────────────────────────────── */
export function TheGap() {
 const scenes = [
    {
 t: "La lettre qui arrive",
 d: "Le notaire écrit. Le chiffre est en bas de la page, et il faut le régler dans les six mois. Personne ne l'avait jamais calculé, et il n'est plus négociable.",
 p: "le chiffre était connu depuis des années, et il a été divisé avant.",
    },
    {
 t: "L'argent qui n'est pas là",
 d: "Les droits se paient en euros, pas en parts de maison. L'épargne est immobilisée le temps du règlement, et un bien ne se vend pas toujours en six mois.",
 p: "de quoi payer était prévu, et la maison n'entre plus dans le calcul.",
    },
    {
 t: "La conversation qu'on n'a jamais eue",
 d: "Ce qui divise les familles, ce n'est presque jamais l'argent. C'est de devoir décider à plusieurs, vite, sans savoir ce que le parent aurait voulu.",
 p: "les décisions sont écrites, datées, signées. Il n'y a plus rien à décider.",
    },
  ];
 return (
    <Section tone="grey">
      <SectionTitle>L&apos;écart que personne ne montre</SectionTitle>
      <p className="mb-6 text-[1.05rem]">
        Entre le jour du décès et le jour où la succession est réglée, il y a six mois. Ce qui se
 passe pendant ces six mois-là ne dépend presque pas de la loi.{" "}
        <strong>Ça dépend de ce qui a été fait avant.</strong> Voici à quoi ça ressemble.
      </p>

      <div className="space-y-4">
        {scenes.map((sc) => (
          <div key={sc.t} className="border border-grey-line bg-white">
            <div className="p-4">
              <p className="mb-1 text-[1.15rem] font-bold text-blue">{sc.t}</p>
              <p className="text-[1.02rem]">{sc.d}</p>
            </div>
            <p className="border-t border-green/40 bg-green-bg px-4 py-2.5 text-[1rem]">
              <strong className="text-green">Avec un plan&nbsp;:</strong> {sc.p}
            </p>
          </div>
        ))}
      </div>

      {/* Le chiffre qui résume tout, avec sa source. Notre seule statistique
 est officielle : c'est le taux du barème, et il est vérifiable. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-l-4 border-blue bg-white p-4">
        <span className="figure-xl text-blue">20 %</span>
        <p className="min-w-[14rem] flex-1 text-[1.05rem]">
          Le taux qui s&apos;applique dès <strong>15 932 €</strong> au-dessus de l&apos;abattement.
          Autrement dit&nbsp;: sur presque tout, dès qu&apos;il y a une maison.
          <span className="block text-[0.9rem] text-text-soft">Article 777 du Code général des impôts.</span>
        </p>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   13. L'OBJECTION LA PLUS FRÉQUENTE, EN TITRE DE SECTION.
   ───────────────────────────────────────────────────────────── */
export function TheyWillManage() {
 return (
    <Section tone="blue">
      <SectionTitle light>«&nbsp;Ils se débrouilleront bien.&nbsp;»</SectionTitle>
      <div className="max-w-[42rem] space-y-4 text-[1.08rem] text-white/90">
        <p>
          Oui, ils se débrouilleront. En six mois, avec des comptes bloqués, un notaire à régler, et
 une facture qu&apos;aucun d&apos;eux n&apos;avait vue venir.
        </p>
        <p>
          Il ne leur manquera ni l&apos;intelligence, ni la bonne volonté, ni l&apos;affection. Il
 leur manquera seulement les décisions que vous étiez le seul à pouvoir prendre — et
 qu&apos;on ne peut plus prendre après.
        </p>
        <p className="border-l-4 border-orange pl-4 text-[1.2rem] font-bold text-white">
          Ce ne sont pas des informations qu&apos;on leur laisse. Ce sont des décisions.
        </p>
      </div>
    </Section>
  );
}
