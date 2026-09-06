import Image from "next/image";
import { Section, SectionTitle } from "./Lp";

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
          alt="Un homme âgé et un enfant marchant main dans la main vers une maison, vus de dos."
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <span className="scrim" />
        <div className="absolute inset-0 flex items-center">
          <div className="wrap">
            <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
              Commençons par la fin
            </p>
            <h2 className="max-w-[34rem] text-[1.5rem] leading-tight text-white sm:text-[2.1rem]">
              Il y a une phrase que vos enfants diront de vous. Vous pouvez encore choisir laquelle.
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white py-8 sm:py-12">
        <div className="wrap space-y-4 text-[1.08rem]">
          <p>
            Imaginez le jour. Il arrivera, et ce n&apos;est pas la peine d&apos;en faire un drame.
            Mais imaginez-le vraiment.
          </p>
          <p>
            <strong>La maison est encore là.</strong> Personne n&apos;a mis de panneau devant. Vos
            enfants ne se sont pas assis à trois autour d&apos;une table pour décider laquelle de
            vos affaires il fallait vendre en premier.
          </p>
          <p>
            Votre petit-fils a eu son coup de pouce pour démarrer — l&apos;apport de son premier
            appartement, ou ses deux dernières années d&apos;études. Et vous étiez là pour le voir.
            Vous avez vu ce que ça faisait. C&apos;est la seule chose qu&apos;on ne peut pas
            transmettre après.
          </p>
          <p>
            Sophie et Thomas ne se sont pas fâchés. Il n&apos;y avait rien à trancher : tout était
            écrit, daté, signé, et ils le savaient depuis des années.
          </p>
          <p className="border-l-4 border-orange bg-grey-bg p-4 text-[1.2rem] font-bold text-blue">
            Et à un moment, quelqu&apos;un dit&nbsp;: «&nbsp;il avait tout prévu. On n&apos;a eu à
            s&apos;occuper de rien.&nbsp;»
          </p>
          <p>
            Ce n&apos;est pas une question d&apos;argent. Un homme qui a travaillé quarante ans,
            remboursé sa maison et élevé deux enfants n&apos;a pas besoin qu&apos;on lui explique la
            valeur de l&apos;argent.{" "}
            <strong>
              C&apos;est la dernière chose que vous ferez pour eux, et c&apos;est celle dont ils se
              souviendront.
            </strong>
          </p>
          <p className="text-text-soft">Tout ce qui suit sert à ça. Rien d&apos;autre.</p>
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
   L'ORIENTATION. Placée tôt exprès.

   Toute la page parlait des « 3 décisions » et des « 3 dates » comme de
   deux choses distinctes, alors que c'est le même trio : chaque décision
   a une date après laquelle elle coûte plus cher. Et le lecteur ne les
   découvrait qu'au douzième écran, après en avoir lu le nom dix fois.

   Ce bloc les nomme d'entrée. Il ne les explique pas — c'est le rôle du
   bloc MÉCANISME plus bas — il donne la carte.
   ═══════════════════════════════════════════════════════════════ */
const TROIS = [
  {
    n: "1",
    quoi: "Faire partir le compteur des donations",
    date: "Il court sur 15 ans, et il n'a pas encore commencé",
  },
  {
    n: "2",
    quoi: "Régler l'assurance-vie ouverte à la banque",
    date: "Votre 70e anniversaire",
  },
  {
    n: "3",
    quoi: "Transmettre les murs en gardant l'usage à vie",
    date: "Votre 71e anniversaire",
  },
];

export function TheThreeAtAGlance() {
  return (
    <Section tone="blue">
      <SectionTitle light>Tout tient en trois décisions. Chacune a sa date limite.</SectionTitle>
      <p className="mb-6 max-w-[42rem] text-[1.06rem] text-white/85">
        Vous les verrez détaillées plus bas, avec ce que chacune rapporte. Voici déjà de quoi on
        parle, pour que le reste de cette page soit clair.
      </p>

      <div className="overflow-hidden border border-white/25">
        {TROIS.map((t, i) => (
          <div
            key={t.n}
            className={`flex flex-col gap-1 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:gap-5 ${
              i > 0 ? "border-t border-white/20" : ""
            }`}
          >
            <span
              aria-hidden
              className="shrink-0 text-[1.5rem] font-bold leading-none text-orange sm:w-8"
            >
              {t.n}
            </span>
            <span className="flex-1 text-[1.08rem] font-bold text-white">{t.quoi}</span>
            <span className="shrink-0 border-l-0 text-[0.98rem] text-orange sm:border-l sm:border-white/25 sm:pl-5">
              <span className="text-white/60 sm:hidden">Sa date&nbsp;: </span>
              {t.date}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 max-w-[42rem] text-[1.1rem] font-bold text-white">
        Trois décisions, trois dates. Une fois la date passée, la décision ne se rattrape pas.
        C&apos;est tout le sujet de cette page.
      </p>
    </Section>
  );
}

/* ═════════════════════════════════════════════════════════════════
   BLOC 7 — LE MÉCANISME, avec ses dates et ses coûts.

   Fusion de deux sections qui disaient la même chose à 3 000 px d'écart :
   « les 3 décisions » d'un côté, « les 3 portes qui se ferment » de
   l'autre. Chaque décision porte maintenant sa date et le prix de
   l'attente, dans le même encadré.
   ═══════════════════════════════════════════════════════════════ */
export function TheThreeDecisions() {
  const decisions = [
    {
      n: "Décision 1",
      t: "Faire partir le compteur",
      d: "Une donation ne s'efface fiscalement qu'au bout de quinze ans. Passé ce délai, l'abattement de 100 000 € par enfant se recharge, et vous pouvez donner une deuxième fois sans droits. Le compteur ne démarre pas tout seul : il démarre le jour où vous signez.",
      date: "Le compteur des 15 ans, à partir du jour de la signature",
      cout: "Une donation faite à 67 ans est effacée à 82 ans. Faite à 72, elle l'est à 87. Chaque année d'attente est une année perdue, et l'abattement ne sert qu'une fois au lieu de deux.",
    },
    {
      n: "Décision 2",
      t: "Reprendre le contrat de la banque",
      d: "Ressortir l'assurance-vie ouverte il y a vingt ans et regarder deux choses : la clause bénéficiaire, et la date des versements. Trois questions, cinq minutes. C'est là que se trouvent les 152 500 € par bénéficiaire que presque personne n'utilise correctement.",
      date: "Votre 70e anniversaire",
      cout: "Avant : 152 500 € hors droits pour chaque bénéficiaire. Après : 30 500 € au total, tous bénéficiaires et tous contrats confondus. Soit 122 000 € d'abattement en moins, sur le même contrat, pour une date de versement.",
    },
    {
      n: "Décision 3",
      t: "Transmettre les murs sans quitter la maison",
      d: "Donner la nue-propriété de la maison en gardant l'usage à vie. Vous restez chez vous, vous pouvez même la louer, et au décès l'usufruit s'éteint sans un euro de droits. La valeur transmise dépend de votre âge le jour de la signature.",
      date: "Votre 71e anniversaire",
      cout: "Avant 71 ans, la valeur transmise est calculée sur 60 % du bien. À partir de 71 ans, sur 70 %. Sur une maison à 380 000 € : 38 000 € de base taxable en plus, du jour au lendemain.",
    },
  ];

  return (
    <Section>
      <SectionTitle>Les 3 décisions, et les 3 dates qui les ferment</SectionTitle>
      <p className="mb-6 text-[1.06rem]">
        Trois. Pas douze. Elles se prennent dans cet ordre, elles sont toutes les trois écrites dans
        le Code général des impôts, et elles tiennent en un après-midi chez le notaire. Chacune a
        une date après laquelle elle coûte beaucoup plus cher.
      </p>

      <div className="space-y-5">
        {decisions.map((v) => (
          <div key={v.n} className="border border-grey-line bg-white">
            <div className="border-l-4 border-blue bg-grey-bg p-4">
              <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-orange">
                {v.n}
              </p>
              <p className="mb-1 text-[1.2rem] font-bold text-blue">{v.t}</p>
              <p className="text-[1.02rem]">{v.d}</p>
            </div>
            <p className="border-t border-grey-line bg-white px-4 py-2.5 text-[1rem]">
              <strong className="text-blue">Sa date limite&nbsp;:</strong> {v.date}
            </p>
            <p className="border-t-2 border-red bg-red-bg px-4 py-2.5 text-[1rem]">
              <strong className="text-red">Ce que ça coûte de la laisser passer&nbsp;:</strong>{" "}
              {v.cout}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 border-2 border-green bg-green-bg p-4 text-[1.1rem]">
        <strong className="text-green">Et voilà tout le secret&nbsp;:</strong> vous ne vous
        dépouillez de rien. Vous gardez votre maison, vos revenus et votre épargne. Vous décidez
        simplement, de votre vivant, de ce qui se passera après — pendant que c&apos;est encore vous
        qui décidez.
      </p>
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
export function TheGuarantee() {
  return (
    <Section>
      <SectionTitle>Ce que vous risquez&nbsp;: rien</SectionTitle>
      <ul className="space-y-2 text-[1.06rem]">
        {[
          "La vidéo est gratuite. Il n'y a rien à payer pour la voir, ni maintenant, ni après.",
          "Personne ne vous appellera. Nous ne demandons pas votre numéro, et nous ne le demanderons jamais.",
          "Votre adresse n'est ni vendue, ni transmise, ni louée à qui que ce soit. Un lien de désinscription est en bas de chaque message.",
          "Et si vous décidez un jour d'aller plus loin, la garantie est de 30 jours, sans justification à fournir.",
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden className="shrink-0 font-bold text-green">
              ✔
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[1.06rem]">
        Autrement dit&nbsp;: le seul risque que vous prenez ce soir, c&apos;est celui de découvrir
        un chiffre que vous auriez préféré ne pas connaître. C&apos;est aussi le seul moyen de le
        faire baisser.
      </p>
      <p className="mt-4 border-l-4 border-green bg-green-bg p-4 text-[1.06rem]">
        Une question qui vaut le détour&nbsp;:{" "}
        <strong>
          avez-vous déjà vu une facture de notaire arriver avec une garantie de remboursement&nbsp;?
        </strong>
      </p>
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
      <div className="relative aspect-[16/12] w-full sm:aspect-[21/8]">
        <Image
          src="/img/mains-cles.jpg"
          alt="Des mains âgées transmettant un trousseau de clés au-dessus d'une table en bois."
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <span className="scrim" />
        <div className="absolute inset-0 flex items-center">
          <div className="wrap">
            <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-orange">
              Une dernière chose
            </p>
            <h2 className="mb-4 max-w-[32rem] text-[1.45rem] leading-tight text-white sm:text-[2rem]">
              Un jour, quelqu&apos;un ouvrira un tiroir chez vous.
            </h2>
            <div className="max-w-[34rem] space-y-3 text-[1.02rem] text-white/90 sm:text-[1.1rem]">
              <p>
                Ce qu&apos;il y trouvera dira ce que vous aviez prévu pour lui. Une pile de
                courriers qu&apos;il faudra six mois à démêler, ou une page écrite par vous, qui
                commence par&nbsp;: «&nbsp;voilà ce que j&apos;ai décidé, et pourquoi&nbsp;».
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
              alt="Une femme âgée assise seule à une table couverte de dossiers, vue de dos, une chaise vide en face d'elle."
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
        href="#acces"
        className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
      >
        {label}
      </a>
      <p className="mt-2 text-center text-[0.85rem] text-text-soft">
        Vidéo de 9 minutes · gratuite · aucun appel téléphonique
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
        title="Ce calcul, vous pouvez le refaire sur votre propre situation ce soir."
        label="Calculer mon chiffre — gratuit"
      >
        <p>
          Vous n&apos;êtes pas du genre à croire un chiffre sur parole, sinon vous ne seriez pas
          encore en train de lire. Alors ne nous croyez pas&nbsp;: refaites le calcul avec vos
          montants à vous. Mêmes articles, mêmes tranches, votre maison et votre épargne.
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
        label="Connaître mes 3 dates — gratuit"
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
        label="Voir comment on passe à droite"
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
        title="Tout ça commence par neuf minutes, ce soir."
        label="Commencer ce soir — gratuit"
      >
        <p>
          Pas un rendez-vous à décrocher. Pas un dossier à monter. Pas un centime à sortir. Une
          vidéo, et votre chiffre. <strong>Le reste se décide après, à tête reposée</strong>, et
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
        label="Savoir où j'en suis — gratuit"
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
