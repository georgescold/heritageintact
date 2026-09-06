import Image from "next/image";
import { Section, SectionTitle } from "./Lp";
import { PRODUCTS, euros } from "@/lib/config";

/**
 * Les blocs de la structure CEO (Blair Warren) qui manquaient à la page.
 *
 * Rappel de `03-marketing-copy/structure-ceo.md` : le rêve est TOUJOURS en
 * premier, l'ennemi précède le mécanisme, le mécanisme précède le rêve final,
 * l'urgence précède le CTA. Et surtout : on vend le désir profond, jamais le
 * désir de surface. Ici le désir de surface est « payer moins de droits ». Le
 * désir profond est « être celui qui a protégé les siens, et le voir de son
 * vivant » (`02-avatar.md` § A.2).
 */

/* ═════════════════════════════════════════════════════════════════
   BLOC 1 — LE RÊVE. En premier, toujours.
   Visualisation → émotion → possibilité → amplification.
   ═══════════════════════════════════════════════════════════════ */
export function TheDreamFirst() {
  return (
    // Filet orange en haut : sans lui, le fond sombre du hero et la photo sombre
    // de ce bloc se confondent, et la page paraît ne jamais changer de section.
    <section className="relative isolate overflow-hidden border-t-[6px] border-orange">
      <div className="relative aspect-[16/11] w-full sm:aspect-[16/7]">
        <Image
          src="/img/grand-pere-petits-enfants.jpg"
          alt="Un couple âgé et leur petit-enfant, vus de dos, marchant main dans la main vers leur maison au soleil couchant."
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <span className="scrim-left" />
        <div className="absolute inset-0 flex items-center">
          <div className="wrap">
            <p className="text-on-photo mb-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
              Commençons par la fin
            </p>
            <h2 className="text-on-photo max-w-[34rem] text-[1.5rem] leading-tight text-white sm:text-[2.1rem]">
              Il y a une phrase que vos enfants diront de vous. Vous pouvez encore choisir laquelle.
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white py-8 sm:py-12">
        {/*
          Le jour est NOMMÉ dès la première ligne : « imaginez le jour » sans
          dire lequel laissait le lecteur chercher de quoi on parle.
          Aucun prénom d'enfant non plus — ils venaient du dossier avatar, et
          le lecteur ne les connaît évidemment pas.
          Un seul temps : une scène au présent, qu'on regarde.
        */}
        <div className="wrap space-y-4 text-[1.08rem]">
          <p>
            Un jour, vos enfants se retrouveront dans cette maison sans vous. C&apos;est le seul
            rendez-vous que personne ne manque, et il n&apos;y a pas de quoi en faire un drame. Mais
            prenez une minute pour l&apos;imaginer vraiment.
          </p>
          <p>
            <strong>La maison est encore là.</strong> Personne n&apos;a planté de panneau devant.
            Personne n&apos;a fait le tour des pièces en calculant ce qu&apos;il faudrait vendre
            pour payer l&apos;État.
          </p>
          <p>
            <strong>Personne ne se fâche.</strong> Il n&apos;y a rien à trancher&nbsp;: ce que vous
            vouliez est écrit, daté, signé, et ils le savent depuis des années.
          </p>
          <p className="border-l-4 border-orange bg-grey-bg p-4 text-[1.2rem] font-bold text-blue">
            Et l&apos;un d&apos;eux finit par dire&nbsp;: «&nbsp;il avait tout prévu. On n&apos;a eu
            à s&apos;occuper de rien.&nbsp;»
          </p>
          <p>
            C&apos;est la seule phrase que vous ne pourrez jamais prononcer vous-même. Elle se
            prépare de votre vivant, ou elle ne sera pas dite.
          </p>
          <p>
            Et il y a mieux&nbsp;: il y a ce que vous, vous pouvez voir. Un de vos petits-enfants
            qui démarre dans la vie avec un coup de main venu de vous — l&apos;apport de son premier
            appartement, ou ses deux dernières années d&apos;études. Vous étiez là. Vous avez vu sa
            tête. <strong>Ça, aucune succession ne le fera jamais à votre place.</strong>
          </p>
          <p className="text-text-soft">Tout ce qui suit sert à ça, et à rien d&apos;autre.</p>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BLOC 2 — EXCUSER L'ÉCHEC. « Ce n'est pas votre faute. »
   Le bloc le plus important de la page, et celui qui manquait.
   Il porte aussi le personnage : un prénom, un âge, une ville, une histoire.
   ═══════════════════════════════════════════════════════════════ */
export function TheFailure() {
  return (
    <Section tone="grey" wide>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <figure className="lg:sticky lg:top-4">
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
              src="/img/jean-pierre.jpg"
              alt="Un homme âgé assis seul à sa table de cuisine, vu de dos, une lettre ouverte devant lui."
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 border-l-4 border-blue bg-white px-3 py-2 text-[0.9rem]">
            <strong className="block text-blue">Jean-Pierre, 67 ans — Nantes</strong>
            <span className="text-text-soft">
              Cas type, reconstitué à partir du barème officiel et de situations courantes.
            </span>
          </figcaption>
        </figure>

        <div>
          <SectionTitle>
            Jean-Pierre a fait tout ce qu&apos;il fallait. Ça n&apos;a rien changé.
          </SectionTitle>

          <div className="space-y-4 text-[1.06rem]">
            <p>
              Jean-Pierre a 67 ans. Un pavillon en périphérie de Nantes, quatre chambres, un garage
              avec un établi. Il l&apos;a remboursé en vingt-deux ans. Ancien technicien dans
              l&apos;industrie, retraité depuis quatre ans. Deux enfants, trois petits-enfants, un
              épagneul, et un camping-car qui part trois semaines en juin.
            </p>
            <p>
              Il a fait <em>exactement</em> ce qu&apos;on lui a dit de faire. Il a ouvert une
              assurance-vie à sa banque en 2003, parce que le conseiller la lui a proposée. Il est
              allé chez le notaire en 2015 faire un testament, parce que ça se fait. Il a mis 400 €
              de côté tous les mois pendant quarante ans, sans exception, y compris les années où
              c&apos;était difficile.
            </p>
            <p>
              Il n&apos;a rien raté. Il n&apos;a rien dépensé bêtement. Il a fait ce qu&apos;un
              homme prévoyant fait.
            </p>
            <p className="border-l-4 border-red bg-red-bg p-4 text-[1.15rem] font-bold text-blue">
              Et le jour venu, ses enfants recevront quand même une facture de 82 194 €.
            </p>
            <p>
              Ce n&apos;est pas parce qu&apos;il a mal géré. Ce n&apos;est pas parce qu&apos;il
              n&apos;a pas assez mis de côté. Ce n&apos;est pas parce qu&apos;il est mauvais avec
              l&apos;argent — il est même plutôt meilleur que la moyenne.
            </p>
            <p className="text-[1.1rem] font-bold text-blue">
              C&apos;est parce que personne ne lui a jamais dit qu&apos;il y avait autre chose à
              faire. Et surtout, que ça se faisait avant.
            </p>
            <p>
              Si vous vous reconnaissez là-dedans, vous n&apos;avez strictement rien à vous
              reprocher. Vous avez fait ce qu&apos;on vous a appris à faire, et vous l&apos;avez
              bien fait.{" "}
              <strong>
                Le problème n&apos;est pas ce que vous avez fait. C&apos;est ce qu&apos;on ne vous a
                jamais dit.
              </strong>
            </p>
            <p>Reste à savoir pourquoi personne ne vous l&apos;a dit.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BLOC 5 — CONFIRMER LE DOUTE. « Vous avez raison de vous méfier. »
   On ne combat pas le scepticisme, on se met du même côté.
   ═══════════════════════════════════════════════════════════════ */
export function TheDoubt() {
  const sources = [
    { art: "Art. 777 et 779", quoi: "Le barème, et l'abattement de 100 000 € par enfant" },
    { art: "Art. 990 I et 757 B", quoi: "L'assurance-vie, avant et après votre 70e anniversaire" },
    { art: "Art. 669", quoi: "La valeur de votre maison selon votre âge, à l'année près" },
  ];
  return (
    <Section tone="blue">
      <SectionTitle light>«&nbsp;Tout ça a l&apos;air un peu trop beau.&nbsp;»</SectionTitle>
      <div className="max-w-[42rem] space-y-4 text-[1.06rem] text-white/90">
        <p>
          Vous avez raison de vous méfier. Sur ce sujet, sur internet, il y a surtout des gens qui
          veulent vous faire signer un contrat, et qui vous appellent trois fois par semaine
          ensuite.
        </p>
        <p>
          Alors voici comment vérifier <strong className="text-white">avant</strong> de nous laisser
          quoi que ce soit. Chaque chiffre de cette page vient d&apos;un article du Code général des
          impôts. Ouvrez impots.gouv.fr dans un autre onglet, tapez le numéro, comparez.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {sources.map((s) => (
          <div key={s.art} className="border border-white/25 bg-white/5 p-4">
            <p className="mb-1 font-bold text-orange">{s.art}</p>
            <p className="text-[0.95rem] text-white/85">{s.quoi}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-[42rem] border-l-4 border-orange pl-4 text-[1.15rem] font-bold text-white">
        Si un seul chiffre de cette page ne se retrouve pas sur impots.gouv.fr, fermez-la. Vous
        aurez eu raison.
      </p>
      <p className="mt-4 max-w-[42rem] text-[0.98rem] text-white/70">
        Nous ne vendons ni contrat, ni placement, ni assurance. Nous n&apos;avons rien à vous faire
        signer, et personne ne vous appellera. Nous expliquons ce que la loi permet déjà.
      </p>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   LE TEASER DES TROIS DATES. Placé tôt, exprès.

   ⚠️ Règle de ce bloc : on ne dit JAMAIS quelles sont les trois dates,
   ni ce qu'il faut faire. La page est là pour créer le manque, la vidéo
   pour le combler. Une landing page qui livre la méthode n'a plus rien
   à échanger contre une adresse email.

   Ce qui est permis ici : dire qu'elles existent, qu'elles sont
   personnelles, qu'aucun courrier ne les annonce, et ce que coûte
   précisément le fait d'en laisser passer une. La preuve de
   l'importance, jamais le mode d'emploi.
   ═══════════════════════════════════════════════════════════════ */
const CE_QUE_CA_EMPORTE = [
  {
    q: "La première",
    r: "Un abattement de 100 000 € par enfant qui ne servira qu'une seule fois, au lieu de deux.",
  },
  {
    q: "La deuxième",
    r: "122 000 € d'abattement en moins, sur un contrat que vous avez déjà, pour un versement fait trop tard.",
  },
  {
    q: "La troisième",
    r: "38 000 € de base taxable en plus sur une maison à 380 000 €, du jour au lendemain.",
  },
];

export function TheThreeDatesTease() {
  return (
    <Section tone="blue">
      <SectionTitle light>Il y a trois dates. Elles sont déjà dans votre état civil.</SectionTitle>

      <div className="max-w-[42rem] space-y-4 text-[1.06rem] text-white/90">
        <p>
          Deux d&apos;entre elles sont des anniversaires&nbsp;: les vôtres. La troisième n&apos;est
          même pas une date — c&apos;est un délai de quinze ans qui ne démarre que le jour où vous
          signez quelque chose, et qui n&apos;a donc pas encore commencé.
        </p>
        <p>
          Les règles sont les mêmes pour tout le monde. Les dates, elles, sont les vôtres. Et selon
          votre âge,{" "}
          <strong className="text-white">
            il y en a toujours une beaucoup plus proche que les deux autres.
          </strong>
        </p>
        <p>
          Personne ne vous préviendra. Il n&apos;existe aucun courrier, aucun rappel, aucune alerte.
          Aucune administration ne vous écrira pour vous dire «&nbsp;attention, dans huit mois vous
          perdez 122 000 € d&apos;abattement&nbsp;».
        </p>
      </div>

      <p className="mb-3 mt-6 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-orange">
        Ce qu&apos;emporte chaque date qu&apos;on laisse passer
      </p>
      <div className="overflow-hidden border border-white/25">
        {CE_QUE_CA_EMPORTE.map((c, i) => (
          <div
            key={c.q}
            className={`flex flex-col gap-1 bg-white/5 px-4 py-3 sm:flex-row sm:gap-5 ${
              i > 0 ? "border-t border-white/20" : ""
            }`}
          >
            <span className="shrink-0 font-bold text-orange sm:w-28">{c.q}</span>
            <span className="flex-1 text-[1.02rem] text-white/90">{c.r}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-[42rem] border-l-4 border-orange pl-4 text-[1.15rem] font-bold text-white">
        Vous devez connaître ces trois dates avant que la plus proche ne soit derrière vous. La
        vidéo de 9 minutes vous dit lesquelles, et où vous en êtes par rapport à chacune.
      </p>
      <CtaButton label="Connaître mes 3 dates" sombre />
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BLOC 7 — LE MÉCANISME : sa FORME, jamais son contenu.

   Valère : le mécanisme doit être simple, rapide, facile, clair. Il doit
   être NOMMÉ, pas enseigné. Ce bloc dit combien il y a de décisions, en
   combien de temps elles se prennent, et ce qu'on garde. Il ne dit pas
   lesquelles — c'est ce qu'on échange contre une adresse email.
   ═══════════════════════════════════════════════════════════════ */
export function TheMechanismShape() {
  const garde = [
    "Vous gardez votre maison, et vous y restez jusqu'au bout.",
    "Vous gardez vos revenus, vos loyers, votre épargne disponible.",
    "Vous ne souscrivez aucun produit, aucun contrat, aucune assurance.",
    "Rien ne sort de vos mains de votre vivant. Rien n'est irréversible avant que vous ne signiez.",
  ];
  return (
    <Section>
      <SectionTitle>Trois décisions. Un après-midi. Vous ne vous séparez de rien.</SectionTitle>

      <div className="space-y-4 text-[1.06rem]">
        <p>
          À chacune de ces trois dates correspond une décision. Trois en tout, pas douze. Elles sont
          écrites noir sur blanc dans le Code général des impôts&nbsp;: il n&apos;y a aucun montage
          à construire, aucune zone grise, rien à optimiser au sens où l&apos;entendent les
          publicités.
        </p>
        <p>
          Vous en avez déjà vu une&nbsp;: celle que Martine a manquée de trois mois.{" "}
          <strong>Il y en a deux autres</strong>, et l&apos;une des deux est presque toujours celle
          qui rapporte le plus.
        </p>
        <p className="border-l-4 border-orange bg-grey-bg p-4 text-[1.1rem] font-bold text-blue">
          Et elles se prennent dans un ordre précis. C&apos;est là que presque tout le monde se
          trompe&nbsp;: la bonne décision, prise dans le mauvais ordre, coûte plus cher que pas de
          décision du tout.
        </p>
      </div>

      <h3 className="mb-3 mt-7 text-[1.2rem]">Ce que vous gardez, dans tous les cas</h3>
      <ul className="space-y-2 text-[1.04rem]">
        {garde.map((g) => (
          <li key={g} className="flex gap-2">
            <span aria-hidden className="shrink-0 font-bold text-green">
              ✔
            </span>
            <span>{g}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-2 border-green bg-green-bg p-4 text-[1.08rem]">
        <strong className="text-green">Ce que la vidéo vous donne&nbsp;:</strong> les trois dates,
        où vous en êtes par rapport à chacune, et l&apos;ordre dans lequel les prendre. Neuf
        minutes, chez vous, sans rendez-vous.
      </p>
      <CtaButton label="Accéder aux 3 décisions" />
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BLOC 8 — L'ESCALIER DE L'IMAGINATION.
   Marche par marche, chaque étape paraît logique, donc l'arrivée aussi.
   ═══════════════════════════════════════════════════════════════ */
export function TheStaircase() {
  const marches = [
    [
      "Ce soir",
      "Vous connaissez votre chiffre. Le vrai, calculé sur votre situation, pas une moyenne.",
    ],
    [
      "Demain matin",
      "Vous savez laquelle de vos trois dates est la plus proche, et combien elle coûte.",
    ],
    [
      "Dans une semaine",
      "Vous avez pris rendez-vous chez le notaire, avec la liste écrite de ce qu'il faut lui demander.",
    ],
    [
      "Dans trois semaines",
      "Les trois décisions sont signées. Le sujet que vous repoussiez depuis dix ans est réglé.",
    ],
    [
      "Dans quinze ans",
      "Le compteur est reparti. L'abattement aura servi deux fois au lieu d'une.",
    ],
    [
      "Le jour venu",
      "Vos enfants ouvrent un dossier d'une page. Tout est dedans, dans l'ordre. Ils n'ont rien à décider.",
    ],
  ];
  return (
    <Section tone="grey">
      <SectionTitle>Où vous en serez, marche par marche</SectionTitle>
      <ol className="border-l-2 border-blue">
        {marches.map(([quand, quoi], i) => (
          <li key={quand} className="relative pb-5 pl-6 last:pb-0">
            <span
              aria-hidden
              className={`absolute -left-[9px] top-1 block h-4 w-4 border-2 border-blue ${
                i === marches.length - 1 ? "bg-orange" : "bg-white"
              }`}
            />
            <p className="text-[0.85rem] font-bold uppercase tracking-[0.12em] text-orange">
              {quand}
            </p>
            <p className="text-[1.05rem]">{quoi}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BLOC 10 — LA GARANTIE. Renversement du risque.
   Sur une page d'opt-in, le risque n'est pas l'argent : c'est l'email.
   ═══════════════════════════════════════════════════════════════ */
/**
 * LE COÛT DE L'INACTION.
 *
 * ⚠️ Cette section s'appelait « Ce que vous risquez : rien » et listait des
 * réassurances. Elle a été retournée le 6 septembre 2026, et c'est la
 * correction la plus importante de la page.
 *
 * « Vous ne risquez rien » est une phrase qui endort. Elle enlève la tension
 * juste avant le bouton, au moment précis où il en faut. Et elle contredit la
 * ligne du projet : *on vend le coût de l'inaction*.
 *
 * Le vrai risque n'est pas d'acheter. Le vrai risque est de fermer la page.
 * C'est ça qu'on met devant. La réassurance vient après, en deux lignes, à sa
 * place — sous le bouton, pas à la place de l'argument.
 */
export function TheCostOfInaction() {
  return (
    <Section tone="grey">
      <SectionTitle>Ce que vous risquez en fermant cette page</SectionTitle>

      <p className="mb-5 text-[1.1rem]">
        Rien ne se passera demain. Ni le mois prochain. C&apos;est exactement ce qui rend cette
        décision si facile à repousser — et si chère.
      </p>

      <ul className="space-y-3 text-[1.06rem]">
        {[
          [
            "Vos enfants recevront une facture, pas un héritage.",
            "82 194 € sur une maison de province et les économies d'une vie. Payables en six mois. En euros, pas en parts de maison.",
          ],
          [
            "Ils devront trouver cette somme. Ils ne l'auront pas.",
            "Une infirmière de 41 ans et un commercial de 38 ans ne sortent pas 41 000 € chacun en six mois. Alors on vend. Et un bien vendu dans l'urgence se vend au prix qu'on en donne.",
          ],
          [
            "Chaque année qui passe ferme une porte, définitivement.",
            "Le compteur des quinze ans ne se rattrape pas. Vos 70 ans et vos 71 ans n'arrivent qu'une fois. Attendre deux ans ne coûte pas deux ans : ça coûte un abattement entier.",
          ],
          [
            "Vous ne serez pas là pour arbitrer.",
            "Ce que vous n'aurez pas écrit, ils devront le deviner. À trois, en six mois, en deuil. C'est comme ça que des frères et sœurs cessent de se parler.",
          ],
        ].map(([titre, corps]) => (
          <li key={titre} className="border-l-4 border-red bg-white p-4">
            <strong className="block text-[1.08rem] text-red">{titre}</strong>
            <span className="mt-1 block">{corps}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-l-4 border-blue bg-white p-4 text-[1.15rem] font-bold text-blue">
        Ne rien faire n&apos;est pas une position neutre. C&apos;est un choix, et il a déjà un prix
        affiché&nbsp;: 82 194 €.
      </p>

      <p className="mt-5 text-[1.06rem]">
        En face, il y a <strong>{euros(PRODUCTS.front.price)}</strong> et une soirée. Vous
        n&apos;avez pas besoin d&apos;y croire&nbsp;: vous avez trente jours pour vérifier, et si
        vous ne trouvez pas au moins une erreur que vous étiez en train de commettre, vous êtes
        remboursé sans avoir à vous justifier.
      </p>

      <CtaButton label="Je veux mon chiffre" />
    </Section>
  );
}

/**
 * LA GARANTIE, compacte.
 *
 * Le renversement du risque est un levier de la checklist — mais il tient en
 * trois lignes. Étalé sur une section entière, il devient le sujet de la page
 * alors qu'il n'est qu'une objection levée.
 */
export function TheGuarantee() {
  return (
    <Section>
      <div className="border-2 border-green bg-green-bg p-5">
        <p className="mb-2 text-[1.25rem] font-bold text-blue">
          Trente jours pour changer d&apos;avis. Sans avoir à vous expliquer.
        </p>
        <p className="text-[1.06rem]">
          Faites votre simulation. Si vous n&apos;avez pas trouvé au moins{" "}
          <strong>une erreur que vous étiez en train de commettre</strong>, un email suffit et vous
          êtes remboursé. <strong>Vous gardez le simulateur.</strong>
        </p>
        <p className="mt-3 text-[1.06rem] font-bold text-blue">
          Avez-vous déjà vu une facture de notaire arriver avec une garantie de remboursement&nbsp;?
        </p>
      </div>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   LE DERNIER ARGUMENT.
   Le benchmark le dit : la charge émotionnelle doit être le dernier
   argument avant le bouton, pas un bonus perdu dans une liste
   (16-benchmark-marches.md § 5).
   ═══════════════════════════════════════════════════════════════ */
export function TheLastWord() {
  return (
    <section className="relative isolate overflow-hidden border-t-[6px] border-orange">
      {/* La hauteur suit le texte au lieu d'être imposée par un ratio.
          Avec `aspect-[21/8]`, le bloc gardait une hauteur fixe pendant que le
          texte, lui, occupait le tiers haut : une grande zone sombre et vide
          sous la dernière ligne, et le bouton qui venait se coller à la
          découpe. Un padding fait le travail et ne se décale jamais. */}
      <Image
        src="/img/mains-cles.jpg"
        alt="Des mains âgées transmettant un trousseau de clés au-dessus d'une table en bois."
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <span className="scrim-left" />

      <div className="relative py-12 sm:py-16">
        <div className="wrap">
          <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
            Une dernière chose
          </p>
          <h2 className="text-on-photo mb-4 max-w-[32rem] text-[1.45rem] leading-tight text-white sm:text-[2rem]">
            Un jour, quelqu&apos;un ouvrira un tiroir chez vous.
          </h2>
          <div className="max-w-[34rem] space-y-3 text-[1.02rem] text-white/90 sm:text-[1.1rem]">
            <p>
              Ce qu&apos;il y trouvera dira ce que vous aviez prévu pour lui. Une pile de courriers
              qu&apos;il faudra six mois à démêler, ou une page écrite par vous, qui commence
              par&nbsp;: «&nbsp;voilà ce que j&apos;ai décidé, et pourquoi&nbsp;».
            </p>
            <p className="font-bold text-white">
              Ce ne sont pas des papiers que vous laissez. C&apos;est la preuve que vous y aviez
              pensé.
            </p>
            <p className="text-white/75">
              Et ça ne peut se faire qu&apos;à un seul moment&nbsp;: un après-midi ordinaire, en
              bonne santé, pendant que tout est encore possible.
            </p>
          </div>

          {/* Le bouton vit DANS la section : le dernier argument et l'action
              ne doivent pas être séparés par une découpe de fond. */}
          <div className="mt-7 max-w-[34rem]">
            <CtaButton label="Je veux mon chiffre" sombre />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   LE COÛT DE L'INACTION, INCARNÉ.
   Deuxième persona (`02-avatar.md`, avatar secondaire) : Martine, 71 ans,
   veuve. Elle a déjà vécu une succession, donc elle sait. Et elle vient
   quand même de perdre 11 900 € — pour une date.
   C'est la démonstration que ce n'est pas l'ignorance qui coûte cher,
   c'est le moment où l'on agit.
   ═══════════════════════════════════════════════════════════════ */
export function TheCostOfWaiting() {
  return (
    <Section tone="grey" wide>
      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div>
          <SectionTitle>Martine a fait la bonne chose. Trois mois trop tard.</SectionTitle>

          <div className="space-y-4 text-[1.06rem]">
            <p>
              Martine a 71 ans, un appartement à Montpellier et la maison de vacances où ses cinq
              petits-enfants ont appris à nager. Elle est veuve depuis deux ans.
            </p>
            <p>
              Elle a enterré son mari un jeudi de novembre, et elle a passé les onze mois suivants
              dans les papiers. Les comptes bloqués. Les organismes à prévenir un par un, en
              réexpliquant à chaque fois. Les actes de décès qu&apos;il faut recommander parce
              qu&apos;on n&apos;en avait pas demandé assez.
            </p>
            <p>
              Alors elle s&apos;est juré une chose&nbsp;:{" "}
              <strong>ses trois enfants ne vivraient pas ça.</strong>
            </p>
            <p>
              Elle a rangé, classé, regroupé. Et pour faire simple, elle a viré{" "}
              <strong>90 000 €</strong> — ce qui restait de l&apos;épargne du ménage — sur son
              assurance-vie. «&nbsp;Comme ça, tout est au même endroit.&nbsp;»
            </p>
            <p className="text-[1.1rem] font-bold text-blue">Elle avait 70 ans et trois mois.</p>

            <div className="border-l-4 border-red bg-red-bg p-4">
              <p className="mb-2">
                Personne ne lui avait dit qu&apos;il y avait une date. Versés <strong>avant</strong>{" "}
                son soixante-dixième anniversaire, ces 90 000 € seraient sortis de la succession
                sans un centime de droits. Versés <strong>après</strong>, l&apos;abattement tombe de
                152 500 € par enfant à 30 500 € pour tout le monde et tous les contrats confondus.
              </p>
              <p>
                Les 59 500 € qui dépassent retombent dans la succession. À 20 %, cela fera{" "}
                <strong>11 900 € à payer par ses enfants</strong> — sur de l&apos;argent qui était
                déjà le leur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-2 border-red bg-white p-4">
              <span className="figure-xl text-red">11 900 €</span>
              <p className="min-w-[12rem] flex-1 text-[1.06rem] font-bold text-blue">
                Pour un virement fait trois mois trop tard.
              </p>
            </div>

            <p>
              Martine n&apos;a rien fait de mal. Elle a même fait exactement ce qu&apos;il fallait
              faire — dans le mauvais ordre, et après la mauvaise date. Elle avait déjà vécu une
              succession&nbsp;: elle savait mieux que la plupart des gens. Ça n&apos;a rien changé.
            </p>
            <p className="border-l-4 border-blue bg-white p-4 text-[1.15rem] font-bold text-blue">
              Sur une succession, ce n&apos;est presque jamais la décision qui coûte cher.
              C&apos;est le moment où on la prend.
            </p>
          </div>
        </div>

        <figure className="lg:sticky lg:top-4">
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
              src="/img/martine.jpg"
              alt="Une femme âgée vue de dos, assise droite à la table de sa salle à manger, la main posée sur un dossier de succession ouvert devant elle."
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 border-l-4 border-blue bg-white px-3 py-2 text-[0.9rem]">
            <strong className="block text-blue">Martine, 71 ans — Montpellier</strong>
            <span className="text-text-soft">
              Cas type, reconstitué à partir du barème officiel et de situations courantes.
            </span>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   LES RELANCES.

   « Un seul CTA » figure dans l'anatomie d'une MAUVAISE page
   (03-marketing-copy/vsl.md). Le closing commence après le premier appel
   à l'action, et il faut un CTA entre chaque outil de closing — parce
   que ceux qui lisent encore sont les sceptiques, et qu'ils décident
   chacun à un moment différent.

   Quatre relances, placées chacune juste après un pic émotionnel, et
   portant chacune un outil de closing différent : étiquetage, rappel de
   la douleur présente, Choice 1 / Choice 2, urgence finale.
   ═══════════════════════════════════════════════════════════════ */
function InlineCta({
  kicker,
  title,
  children,
  label,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="border-[3px] border-orange bg-white p-4 sm:p-5">
      <p className="mb-1.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-orange-dark">
        {kicker}
      </p>
      <p className="mb-2 text-[1.25rem] font-bold leading-tight text-blue sm:text-[1.4rem]">
        {title}
      </p>
      <div className="mb-4 text-[1.02rem]">{children}</div>
      <a
        href="/commande"
        className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
      >
        {label}
      </a>
      <p className="mt-2 text-center text-[0.85rem] text-text-soft">
        Accès immédiat · garantie 30 jours, sans justification · paiement sécurisé
      </p>
    </div>
  );
}

/** Relance 1 — après le calcul. Outil : l'étiquetage. « Vérifiez vous-même. » */
export function CtaVerify() {
  return (
    <Section tone="white">
      <InlineCta
        kicker="Et chez vous, ça donne quoi ?"
        title="Ce calcul, vous pouvez le refaire sur votre propre situation dès maintenant."
        label="Faire le calcul pour ma maison"
      >
        <p>
          Vous n&apos;êtes pas du genre à croire un chiffre sur parole, sinon vous ne seriez pas
          encore en train de lire. Alors ne nous croyez pas&nbsp;: la vidéo reprend ce calcul à
          l&apos;écran, ligne par ligne, avec les articles en référence. Vous n&apos;avez plus
          qu&apos;à remplacer les montants par les vôtres — un stylo suffit.
        </p>
        <p className="mt-2 font-bold text-blue">
          Elle se débloque avec un prénom et un email, et elle s&apos;ouvre tout de suite.
        </p>
      </InlineCta>
    </Section>
  );
}

/** Relance 2 — après Martine. Outil : le rappel de la douleur présente. */
export function CtaDates() {
  return (
    <Section tone="white">
      <InlineCta
        kicker="La seule question qui compte maintenant"
        title="Laquelle de vos trois dates est la plus proche ?"
        label="Savoir laquelle me concerne en premier"
      >
        <p>
          Martine avait dépassé la sienne de trois mois, et elle ne l&apos;a jamais su. Il y en a
          trois. Elles dépendent de votre âge et de la date de vos versements, et il y en a toujours
          une qui arrive plus vite que les deux autres.
        </p>
        <p className="mt-2 font-bold text-blue">
          Neuf minutes suffisent pour savoir laquelle est la vôtre.
        </p>
      </InlineCta>
    </Section>
  );
}

/** Relance 3 — après les deux colonnes. Outil : Choice 1 / Choice 2. */
export function CtaTwoChoices() {
  return (
    <Section tone="white">
      <InlineCta
        kicker="Vous avez deux options"
        title="Il n'y a pas de troisième colonne."
        label="Passer dans la colonne de droite"
      >
        <p>
          Soit vos enfants ouvrent un tiroir et tombent sur la colonne de gauche&nbsp;: la facture,
          les comptes bloqués, la maison à vendre, et l&apos;un d&apos;eux qui porte tout pendant
          que les autres commentent.
        </p>
        <p className="mt-2">
          Soit ils tombent sur celle de droite. Et ce qui décide, ce n&apos;est ni votre patrimoine,
          ni votre chance&nbsp;:{" "}
          <strong>c&apos;est un après-midi que vous prenez, ou que vous ne prenez pas.</strong>
        </p>
      </InlineCta>
    </Section>
  );
}

/** Relance 4 — après l'escalier. Outil : l'urgence finale, ramenée à la première marche. */
export function CtaFirstStep() {
  return (
    <Section tone="white">
      <InlineCta
        kicker="La première marche"
        title="Tout ça commence par neuf minutes, maintenant."
        label="Commencer par la première décision"
      >
        <p>
          Pas un rendez-vous à décrocher. Pas un dossier à monter. Pas un centime pour la regarder.
          Une vidéo, et votre chiffre. <strong>Le reste se décide après, à tête reposée</strong>, et
          c&apos;est vous qui décidez.
        </p>
      </InlineCta>
    </Section>
  );
}

/** Relance 5 — après « Ils se débrouilleront bien ». Outil : Always Be Leaving. */
export function CtaDetached() {
  return (
    <Section tone="white">
      <InlineCta
        kicker="Ça ne changera rien pour nous"
        title="Que vous regardiez cette vidéo ou non, la loi ne bouge pas."
        label="Savoir où j'en suis exactement"
      >
        <p>
          Les trois dates avanceront exactement pareil. Le barème s&apos;appliquera exactement
          pareil. Personne ne vous rappellera, personne n&apos;insistera&nbsp;: dans trois jours
          cette page ne sera plus dans votre historique, et voilà tout.
        </p>
        <p className="mt-2 font-bold text-blue">
          La seule chose qui change, c&apos;est que vous saurez. Ou pas.
        </p>
      </InlineCta>
    </Section>
  );
}

/**
 * Bouton seul, sans encadré.
 *
 * Règle du projet : chaque fois que la page promet la vidéo, un bouton
 * doit suivre. Les cinq relances encadrées suffisent aux pics
 * émotionnels ; partout ailleurs, cette version légère évite de
 * transformer la page en mur de blocs orange.
 */
export function CtaButton({ label, sombre = false }: { label: string; sombre?: boolean }) {
  return (
    <div className="mt-5">
      <a
        href="/commande"
        className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
      >
        {label}
      </a>
      <p
        className={`mt-2 text-center text-[0.85rem] ${sombre ? "text-white/70" : "text-text-soft"}`}
      >
        Accès immédiat · garantie 30 jours, sans justification · paiement sécurisé
      </p>
    </div>
  );
}
