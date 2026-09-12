/**
 * LEAD MAGNET — GRATUIT. Structure CEO appliquée (03-marketing-copy/structure-ceo.md).
 *
 * Pain point visé, pris dans `strategie/02-avatar.md` : la FRUSTRATION n°1 de
 * Jean-Pierre — « ne pas savoir combien ses enfants paieront réellement » — et
 * son DÉSIR n°1 — « un chiffre clair : ce que l'État prendra ». L'objection n°2
 * de A.6 dit la même chose. C'est le trou le plus large de l'avatar.
 *
 * Ennemi retenu (A.5) : LE SILENCE. Règle d'exécution respectée ici — on tape
 * sur le système et ses incitations, jamais sur les notaires ou les banquiers
 * en tant que personnes.
 *
 * ⚠️ FRONTIÈRE AVEC LE PRODUIT. Ce document donne un chiffre de RÉFÉRENCE lu
 * dans une grille fixe. Il ne calcule rien, ne demande aucune saisie, et ne dit
 * jamais quoi faire : ni pièce à réunir, ni question à poser, ni action. Ces
 * quatre-là sont le parcours vendu (`content/documents/`, `lib/simulateur/`).
 * Le gratuit dit ce que la loi fait ; le produit dit quoi faire, pour vous.
 *
 * ⚠️ Montants écrits en clair plutôt qu'importés de `lib/simulateur/bareme.ts` :
 * ce moteur est un composant du plan à 297 € (`INCLUS_DANS.upsell1`). `bareme.ts`
 * fait foi ; ce fichier s'aligne sur lui, jamais l'inverse. Une loi de finances
 * oblige à corriger les deux.
 */
import Link from "next/link";

/** Doit rester identique à `VERIFIE_LE` de lib/simulateur/bareme.ts. */
export const VERIFIE_LE = "8 septembre 2026";

/**
 * Droits totaux payés par l'ensemble des enfants, parts égales, après
 * l'abattement de 100 000 € par enfant (art. 779 I) et le barème en ligne
 * directe (art. 777). Calculés une fois, vérifiés, puis figés : cette page
 * n'est pas un simulateur et ne doit pas le devenir.
 */
const GRILLE: { patrimoine: number; droits: [number, number, number] }[] = [
  { patrimoine: 300_000, droits: [38_194, 16_389, 0] },
  { patrimoine: 400_000, droits: [58_194, 36_389, 14_583] },
  { patrimoine: 500_000, droits: [78_194, 56_389, 34_583] },
  { patrimoine: 650_000, droits: [108_194, 86_389, 64_583] },
  { patrimoine: 800_000, droits: [152_962, 116_389, 94_583] },
  { patrimoine: 1_000_000, droits: [212_962, 156_389, 134_583] },
];

const eur = (n: number) => n.toLocaleString("fr-FR") + " €";

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-[1.2rem] font-bold leading-snug">{titre}</h2>
      {children}
    </section>
  );
}

export function GrilleDroitsEnfants() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <p className="mb-2 text-[0.8rem] uppercase tracking-wide text-text-soft">
        Document de référence · Héritage Intact
      </p>
      <h1 className="mb-3 text-[1.8rem] font-bold leading-tight">
        Ce que vos enfants paieront vraiment sur ce que vous leur laissez
      </h1>
      <p className="mb-2 text-text-soft">
        La grille complète, par patrimoine et par nombre d’enfants. Vous trouverez votre ligne en dix
        secondes. Chaque chiffre porte l’article qui le fonde, et la date à laquelle il a été
        vérifié.
      </p>

      {/* ── 1. RÊVE ─────────────────────────────────────────────────────── */}
      <Bloc titre="Ce que vous voulez, au fond">
        <p className="mb-3">
          Un dimanche, dans quelques années. La table est mise, les petits-enfants courent dans le
          jardin. Vos enfants parlent de leurs projets. Et à un moment, l’un d’eux dit à l’autre :
          <em> « Papa avait tout prévu. On n’a eu à s’occuper de rien. »</em>
        </p>
        <p>
          Ce n’est pas une économie d’impôt que vous cherchez. C’est ça. Que la maison reste dans la
          famille. Que personne ne se déchire. Que ce que vous avez mis trente ans à construire
          arrive entier, et que vos enfants sachent que vous y aviez pensé pour eux.
        </p>
      </Bloc>

      {/* ── 2. ÉCHEC ────────────────────────────────────────────────────── */}
      <Bloc titre="Si vous n’avez rien fait, ce n’est pas de la négligence">
        <p className="mb-3">
          Vous avez peut-être ce dossier en tête depuis dix ans. Un article lu chez le médecin, une
          vidéo regardée un soir à la télévision, une conversation coupée court parce que le sujet
          met tout le monde mal à l’aise. Et à chaque fois la même phrase : « il faudra que je m’en
          occupe ».
        </p>
        <p>
          Ce n’est pas un manque de volonté. Vous avez su rembourser une maison, élever vos enfants
          et tenir un budget pendant quarante ans. Si ce dossier-là est resté fermé, c’est qu’il
          mélange trois choses dont on ne parle pas facilement : l’argent, la famille, et sa propre
          disparition. Et surtout, c’est que <strong>personne ne vous a jamais donné le chiffre</strong>.
          Tant qu’on n’a pas de chiffre, il n’y a rien à décider.
        </p>
      </Bloc>

      {/* ── 3. ENNEMI ───────────────────────────────────────────────────── */}
      <Bloc titre="Pourquoi personne ne vous a prévenu">
        <p className="mb-3">
          Posez-vous la question autrement : <strong>qui était payé pour vous appeler à 62 ans et
          vous dire qu’il vous restait quinze ans pour agir ?</strong>
        </p>
        <p className="mb-3">Personne.</p>
        <p className="mb-3">
          L’État encaisse au décès — il n’a aucune raison de vous avertir avant. Votre banque est
          rémunérée sur les frais du contrat, pas sur la bonne rédaction de sa clause bénéficiaire.
          Votre notaire est payé à l’acte, et l’acte arrive au moment de la succession, c’est-à-dire
          trop tard pour changer quoi que ce soit.
        </p>
        <p className="mb-3">
          Votre banquier n’est pas malhonnête. Votre notaire non plus. Ils ne sont simplement pas
          payés pour ça.
        </p>
        <p>
          L’adversaire n’a pas de visage : <strong>c’est le silence.</strong> Un système où chacun
          fait correctement son métier, où tout est légal, public et voté — et où le seul à ne rien
          savoir est celui qui a construit le patrimoine.
        </p>
      </Bloc>

      {/* ── 4. PEUR ─────────────────────────────────────────────────────── */}
      <Bloc titre="Le jour où le silence se paie : six mois">
        <p className="mb-3">
          Au décès, un compte à rebours démarre. Vos enfants ont <strong>six mois</strong> pour
          déclarer la succession et payer les droits. En euros. Pas en parts de maison.
        </p>
        <p className="mb-3">
          Si l’épargne disponible ne couvre pas la somme, il faut la trouver ailleurs : emprunter, ou
          vendre. Et une maison de famille ne se vend pas toujours en six mois — surtout quand deux
          enfants ne sont pas d’accord sur le fait de la vendre.
        </p>
        <p>
          Passé le délai, la note grossit toute seule : <strong>0,20 % d’intérêt par mois</strong> dès
          le 7<sup>e</sup> mois, puis une <strong>majoration de 10 %</strong> à partir du 13<sup>e</sup>.
          Sur des droits de {eur(58_389)}, cela fait 117 € de plus chaque mois, puis{" "}
          {eur(5_839)} d’un seul coup.
        </p>
      </Bloc>

      {/* ── 5. PREUVE : LA GRILLE ───────────────────────────────────────── */}
      <Bloc titre="Votre ligne">
        <p className="mb-4">
          Ce que l’ensemble de vos enfants paiera, selon ce que vous laissez et selon leur nombre.
          Patrimoine taxable, parts égales, abattement de {eur(100_000)} par enfant déjà déduit.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-current text-left">
                <th className="py-2 pr-3">Ce que vous laissez</th>
                <th className="py-2 pr-3 text-right">1 enfant</th>
                <th className="py-2 pr-3 text-right">2 enfants</th>
                <th className="py-2 text-right">3 enfants</th>
              </tr>
            </thead>
            <tbody>
              {GRILLE.map((l) => (
                <tr key={l.patrimoine} className="border-b border-current/20">
                  <td className="py-2 pr-3 font-bold">{eur(l.patrimoine)}</td>
                  {l.droits.map((d, i) => (
                    <td key={i} className={`py-2 text-right ${i < 2 ? "pr-3" : ""}`}>
                      {d === 0 ? "0 €" : eur(d)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded border-l-4 border-current/40 bg-current/5 py-3 pl-4">
          Regardez la première ligne. À {eur(300_000)} avec trois enfants, l’État ne prend rien.
          Avec un seul enfant, sur le même patrimoine, il prend {eur(38_194)}. Le nombre d’enfants
          pèse aussi lourd que le montant — et c’est une chose que personne ne vous dit.
        </p>
      </Bloc>

      {/* ── 6. DOUTE ────────────────────────────────────────────────────── */}
      <Bloc titre="« Avec 100 000 € chacun, ça devrait aller »">
        <p className="mb-3">
          C’est ce que pensent presque tous ceux qui lisent cette grille pour la première fois. Et
          c’était vrai. En 2012.
        </p>
        <p className="mb-3">
          L’abattement de {eur(100_000)} par enfant <strong>n’a pas été revalorisé depuis</strong>{" "}
          (art. 779 I). Pendant ce temps, le prix de l’immobilier a, dans beaucoup de régions,
          doublé. Une maison achetée 180 000 € en 2005 et qui en vaut 380 000 aujourd’hui n’a pas
          rendu son propriétaire plus riche : il habite toujours la même maison. Mais elle a fait
          passer ses enfants dans la tranche à 20 %.
        </p>
        <p>
          C’est pour cette raison que des familles qui ne se sont jamais considérées comme fortunées
          découvrent des droits à cinq chiffres. Elles n’ont pas changé. Le barème non plus. C’est
          l’écart entre les deux qui s’est creusé, année après année, en silence.
        </p>
      </Bloc>

      {/* ── 7. CE QUE LE DOCUMENT NE DIT PAS ────────────────────────────── */}
      <Bloc titre="Ce que cette grille ne vous dit pas">
        <p className="mb-3">
          Elle vous donne un ordre de grandeur, et c’est déjà beaucoup : vous ne naviguez plus à
          l’aveugle. Mais elle raisonne sur un patrimoine simple et des parts égales.
        </p>
        <p className="mb-3">
          Elle ne tient compte ni de votre régime matrimonial, ni de vos donations passées, ni de la
          clause bénéficiaire de votre assurance-vie — qui peut, à elle seule, faire varier la
          facture de plus de {eur(21_900)} selon l’âge auquel les versements ont été faits. Elle ne
          sait pas non plus si votre famille est recomposée, ni si l’un de vos enfants vit à
          l’étranger.
        </p>
        <p>
          Autrement dit : vous savez maintenant <em>de quel ordre</em> est le problème. Savoir ce
          qu’il faut faire dans votre situation précise, et dans quel ordre, est une autre question —
          et elle se règle avec un professionnel, en arrivant préparé.
        </p>
      </Bloc>

      {/* ── SOURCES ─────────────────────────────────────────────────────── */}
      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.88rem]">
          Code général des impôts, articles 777 (barème en ligne directe), 779 I (abattement de
          100 000 € par enfant et par parent) et 1727 (intérêt de retard). Montants en vigueur au{" "}
          {VERIFIE_LE}. Une loi de finances est votée chaque décembre : passé cette date, vérifiez
          sur <span className="whitespace-nowrap">service-public.fr</span> ou{" "}
          <span className="whitespace-nowrap">impots.gouv.fr</span>.
        </p>
        <p className="mb-3 text-[0.88rem]">
          Hypothèses de la grille, assumées et visibles : patrimoine taxable net, enfants héritant à
          parts égales, aucune donation antérieure de moins de quinze ans, aucun bien exonéré,
          transmission en pleine propriété.
        </p>
        <p className="text-[0.88rem] text-text-soft">
          Ce document est une information générale. Il ne constitue ni une consultation juridique au
          sens de la loi n°71-1130, ni un conseil fiscal personnalisé, et ne remplace pas
          l’intervention d’un notaire. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
