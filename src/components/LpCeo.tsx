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
   BLOC 7 — LE MÉCANISME. Simple, rapide, facile, clair.
   Trois étapes, pas quatre. C'est le pont du point A au point B.
   ═══════════════════════════════════════════════════════════════ */
export function TheMechanism() {
  const verrous = [
    {
      n: "Verrou 1",
      t: "Le compteur",
      d: "Faire partir le délai de quinze ans. Aujourd'hui, pas dans deux ans. C'est la seule décision qui ne coûte rien et qui vaut le plus cher, parce que c'est du temps, et que le temps ne se rattrape pas.",
    },
    {
      n: "Verrou 2",
      t: "Le contrat",
      d: "Reprendre l'assurance-vie ouverte à la banque : la clause bénéficiaire, et la date des versements. Trois questions, cinq minutes. C'est là que se trouvent les 152 500 € par bénéficiaire que presque personne n'utilise correctement.",
    },
    {
      n: "Verrou 3",
      t: "Les murs",
      d: "Transmettre la nue-propriété de la maison en gardant l'usage à vie. Vous restez chez vous, vous pouvez même la louer, et au décès l'usufruit s'éteint sans un euro de droits.",
    },
  ];
  return (
    <Section>
      <SectionTitle>La Méthode des 3 Verrous</SectionTitle>
      <p className="mb-6 text-[1.06rem]">
        Trois décisions. Pas douze. Elles se prennent dans cet ordre, et elles tiennent en un
        après-midi chez le notaire.
      </p>

      <div className="space-y-3">
        {verrous.map((v) => (
          <div key={v.n} className="flex gap-4 border-l-4 border-blue bg-grey-bg p-4">
            <div>
              <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-orange">
                {v.n}
              </p>
              <p className="mb-1 text-[1.2rem] font-bold text-blue">{v.t}</p>
              <p className="text-[1.02rem]">{v.d}</p>
            </div>
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
