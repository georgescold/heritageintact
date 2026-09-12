import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { CaptureDocument } from "@/components/CaptureDocument";
import { BRAND } from "@/lib/config";
import { ARTICLES } from "@/content/guide/articles";
import { metadataPublique } from "@/lib/seo";

const CHEMIN = "/";

export const metadata: Metadata = metadataPublique(
  CHEMIN,
  `${BRAND} — comprendre ce que vos enfants paieront, et ce qui reste évitable`,
  "La succession expliquée en français simple, à partir du Code général des impôts. Recevez la grille des droits par patrimoine et par nombre d’enfants, et retrouvez votre espace si vous êtes déjà client.",
);

/**
 * LA PAGE DE MARQUE — celle que Google doit renvoyer sur « heritage intact ».
 *
 * ⚠️ ELLE N'EST PAS LA PAGE DE CAPTURE PUBLICITAIRE. Celle-ci vit sur `/lp` et
 * poursuit un autre but. La différence n'est pas cosmétique :
 *
 * | | `/lp` (pub) | `/` (marque) |
 * |---|---|---|
 * | Visiteur | payé, sans contexte | il a tapé notre nom |
 * | Il veut | être accroché | savoir qui nous sommes, lire, se connecter |
 * | Navigation | aucune, c'est une fuite | header complet, c'est le service |
 * | Index | non | OUI, c'est sa raison d'être |
 *
 * ⚠️ CONSEQUENCE DE L'INDEXATION, ET ELLE CONTRAINT LE CONTENU : la règle de
 * `lib/seo.ts` interdit d'indexer une page qui affiche un prix, une remise ou
 * un compte à rebours. Cette page n'en affiche donc aucun, et ne doit jamais en
 * afficher. L'urgence qu'elle porte est réelle et vérifiable — un délai de
 * quinze ans, un seuil d'âge, une fenêtre de loi de finances — jamais un
 * minuteur. C'est aussi la seule urgence qui tienne devant quelqu'un qui nous
 * découvre : une horloge sur une page de marque détruit exactement la confiance
 * qu'on vient d'obtenir.
 *
 * STRUCTURE — CEO (Blair Warren) posée sur le squelette « LP classique » :
 * headline bénéfice → objection levée → mécanisme en deux lignes → formulaire,
 * puis rêve, échec, ennemi, peur, doute, mécanisme, urgence, CTA. L'ennemi est
 * celui retenu dans `strategie/02-avatar.md` : LE SILENCE — le système et ses
 * incitations, jamais les notaires ou les banquiers en tant que personnes.
 *
 * ⚠️ AUCUN TEMOIGNAGE ICI TANT QU'IL N'Y EN A PAS DE VRAI. La preuve de cette
 * page est le Code général des impôts, article par article, vérifiable par le
 * lecteur lui-même. C'est la preuve la plus forte dont on dispose aujourd'hui
 * (« ce n'est pas mon avis, c'est la loi ») et la seule qui ne s'invente pas.
 */
export default function PageDeMarque() {
  return (
    <>
      <Header nav />
      <main className="flex-1">
        {/* ───────────── RÊVE : la promesse, le nom de la marque tenu ───────────── */}
        <section className="border-b border-grey-line bg-white">
          <div className="wrap py-8 sm:py-12">
            <p className="mb-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-orange">
              Propriétaires de plus de 60 ans · France
            </p>
            <h1 className="text-[1.7rem] leading-[1.12] sm:text-[2.4rem]">
              Transmettre <span className="text-orange">intact</span> ce que vous avez mis
              quarante ans à construire
            </h1>
            <p className="mt-3 text-[1.08rem] font-bold text-blue sm:text-[1.3rem]">
              Sans rien vendre, sans quitter votre maison, et sans confier un centime à qui que ce
              soit.
            </p>
            <p className="mt-3 text-[1.02rem] leading-snug">
              Les droits que paieront vos enfants sont écrits dans le Code général des impôts, et
              une grande partie se joue sur des décisions prises <strong>de votre vivant</strong>.
              Nous vous donnons les repères en français simple, avec l’article de loi en face de
              chaque chiffre — pour que vous arriviez chez le notaire en sachant quoi demander.
            </p>

            {/* Le formulaire dès le premier écran : c'est la seule action demandée. */}
            <div id="recevoir">
              <CaptureDocument />
            </div>

            {/* Amélioration n°1 des LP : la preuve juste sous le premier bouton.
                Ici ce sont les sources, faute de témoignages réels — et c'est de
                toute façon ce qui convainc cet avatar, méthodique et méfiant. */}
            <div className="border border-grey-line bg-grey-bg px-3.5 py-3">
              <p className="mb-2 text-[0.98rem] font-bold text-blue">
                Sur quoi repose ce que vous allez lire :
              </p>
              <ul className="space-y-1.5">
                {[
                  ["Le barème et les abattements en ligne directe", "art. 777 et 779 CGI"],
                  ["La valeur d’un bien démembré selon votre âge", "art. 669 CGI"],
                  ["Le régime de l’assurance-vie selon la date des versements", "art. 990 I et 757 B"],
                  ["Le délai de renouvellement d’un abattement", "art. 784 CGI"],
                ].map(([t, a]) => (
                  <li key={a} className="flex gap-2 text-[0.92rem] leading-snug">
                    <span aria-hidden className="mt-0.5 shrink-0 font-bold text-green">
                      ✔
                    </span>
                    <span>
                      {t}{" "}
                      <span className="whitespace-nowrap text-[0.8rem] text-text-soft">— {a}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 border-t border-grey-line pt-2 text-[0.85rem] text-text-soft">
                Chaque chiffre est vérifiable sur impots.gouv.fr. Ce n’est pas notre avis, c’est la
                loi.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── ÉCHEC + ENNEMI : ce n'est pas votre faute ───────────── */}
        <section className="border-b border-grey-line bg-grey-bg">
          <div className="wrap py-8 sm:py-11">
            <h2 className="text-[1.4rem] leading-snug sm:text-[1.8rem]">
              Si personne ne vous l’a dit, ce n’est pas parce que vous n’avez pas cherché.
            </h2>
            <p className="mt-3 text-[1.05rem]">
              C’est parce que <strong>personne n’est payé pour vous le dire</strong>.
            </p>
            <ul className="mt-4 space-y-3 text-[1.02rem]">
              {[
                [
                  "Votre banquier",
                  "n’est pas malhonnête : il est rémunéré sur les frais du contrat, pas sur ce que vos enfants paieront après vous.",
                ],
                [
                  "Votre notaire",
                  "est payé à l’acte, pas à la planification. Il fait très bien son travail — mais on l’appelle le plus souvent au décès, quand les décisions utiles ne sont plus possibles.",
                ],
                [
                  "L’État",
                  "publie tout : les abattements, les délais, les dispositifs. Il les publie au Journal officiel, pas dans votre boîte aux lettres le jour de vos 62 ans.",
                ],
              ].map(([qui, quoi]) => (
                <li key={qui} className="border-l-4 border-grey-line pl-3">
                  <strong className="text-blue">{qui}</strong> {quoi}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-2 border-blue bg-white p-4 text-[1.05rem] font-bold sm:text-[1.12rem]">
              Le résultat n’est pas un complot. C’est un silence. Et ce silence a un prix, payé
              une seule fois, par vos enfants, au pire moment de leur vie.
            </p>
          </div>
        </section>

        {/* ───────────── PEUR : le coût de l'inaction, daté ───────────── */}
        <section className="border-b border-grey-line bg-white">
          <div className="wrap py-8 sm:py-11">
            <h2 className="text-[1.4rem] leading-snug sm:text-[1.8rem]">
              Ce que le temps décide à votre place
            </h2>
            <p className="mt-3 text-[1.02rem]">
              Les principaux dispositifs de transmission ne se jugent pas au montant, mais à la
              date. Trois repères suffisent à comprendre pourquoi attendre coûte cher :
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                [
                  "15 ans",
                  "C’est le délai au bout duquel un abattement se reconstitue entre deux donations (art. 784 CGI). Une année d’attente est une année qui ne se rattrape pas.",
                ],
                [
                  "70 ans",
                  "Au-delà, les versements sur une assurance-vie changent de régime (art. 757 B au lieu de l’art. 990 I). L’anniversaire compte, pas l’intention.",
                ],
                [
                  "31 déc. 2026",
                  "Fin de la fenêtre prévue pour les dons familiaux affectés au logement (art. 790 A bis). Une fenêtre ouverte par une loi de finances se referme par une autre.",
                ],
              ].map(([titre, texte]) => (
                <div key={titre} className="border-2 border-orange bg-white p-4">
                  <p className="mb-1.5 text-[1.25rem] font-bold text-orange">{titre}</p>
                  <p className="text-[0.95rem] leading-snug">{texte}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[1.02rem] text-text-soft">
              Aucun de ces trois repères ne dépend de votre patrimoine ni de votre notaire. Ils
              dépendent uniquement du calendrier — c’est précisément ce qui les rend rattrapables
              tant que vous êtes là.
            </p>
          </div>
        </section>

        {/* ───────────── DOUTE : on lui donne raison, puis on lève ───────────── */}
        <section className="border-b border-grey-line bg-grey-bg">
          <div className="wrap py-8 sm:py-11">
            <h2 className="text-[1.4rem] leading-snug sm:text-[1.8rem]">
              Vous avez raison d’être méfiant
            </h2>
            <p className="mt-3 text-[1.02rem]">
              Le sujet attire les vendeurs. Voici donc, avant que vous ne le demandiez, ce que ce
              site <strong>ne fait pas</strong> :
            </p>
            <ul className="mt-4 space-y-2.5 text-[1.02rem]">
              {[
                "Nous ne gérons pas votre argent, ne plaçons rien et ne touchons aucune commission sur un contrat. Nous ne saurons jamais combien vous avez.",
                "Nous ne remplaçons pas votre notaire. Nous vous aidons à arriver devant lui avec des questions précises, ce qui est exactement ce dont il a besoin pour être utile.",
                "Nous ne donnons aucun conseil juridique ou fiscal individuel. Nous donnons des repères généraux, sourcés, que le professionnel compétent confirmera pour votre situation.",
                "Nous ne vous demandons ni votre patrimoine, ni votre numéro de téléphone. Une adresse email suffit, et vous vous désinscrivez en un clic.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="shrink-0 font-bold text-blue">
                    —
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[1.02rem]">
              Reste la question honnête :{" "}
              <Link href="/faq">pourquoi est-ce gratuit, et où est le piège</Link> ? Nous y
              répondons dans les questions fréquentes, sans détour.
            </p>
          </div>
        </section>

        {/* ───────────── MÉCANISME : le pont A → B, en trois temps ───────────── */}
        <section className="border-b border-grey-line bg-white">
          <div className="wrap py-8 sm:py-11">
            <h2 className="text-[1.4rem] leading-snug sm:text-[1.8rem]">
              Comment on passe de « je ne sais pas » à « je sais quoi demander »
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                [
                  "Vous mesurez",
                  "Vous lisez, sur une grille, ce que vos enfants paieraient aujourd’hui selon votre patrimoine et leur nombre. Un chiffre, pas une impression. C’est le document que vous recevez en donnant votre adresse.",
                ],
                [
                  "Vous comprenez",
                  "Vous découvrez les repères qui font varier ce chiffre — les dates, les abattements, les régimes — expliqués sans jargon, avec l’article de loi en face. Vous cessez d’être exclu de votre propre dossier.",
                ],
                [
                  "Vous demandez",
                  "Vous arrivez chez le professionnel avec vos questions écrites et vos documents réunis. Son heure sert enfin à décider, au lieu de vous expliquer ce que vous auriez pu lire.",
                ],
              ].map(([titre, texte], i) => (
                <li key={titre} className="flex gap-4">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue text-[1.2rem] font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[1.12rem] font-bold text-blue">{titre}</p>
                    <p className="mt-1 text-[1.02rem] leading-snug">{texte}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────── CTA final : le même document, la même action ───────────── */}
        <section className="border-b border-grey-line bg-grey-bg">
          <div className="wrap py-8 sm:py-11">
            <h2 className="text-[1.4rem] leading-snug sm:text-[1.8rem]">
              Commencez par le chiffre
            </h2>
            <p className="mt-3 text-[1.02rem]">
              Tant que vous n’avez pas mesuré, tout le reste reste théorique. La grille se lit en
              dix secondes : vous trouvez votre ligne, et vous savez.
            </p>
            <CaptureDocument cta="Recevoir la grille des droits" />
          </div>
        </section>

        {/* ───────────── Les rubriques : lire, ou revenir chez soi ───────────── */}
        <section className="bg-white">
          <div className="wrap py-8 sm:py-11">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="border border-grey-line p-5">
                <h2 className="mb-2 text-[1.2rem]">Lire avant de décider</h2>
                <p className="mb-3 text-[0.98rem]">
                  Nos explications de fond, une règle à la fois, avec les articles du Code en face.
                </p>
                <ul className="mb-3 space-y-2 text-[0.98rem]">
                  {ARTICLES.slice(0, 3).map((a) => (
                    <li key={a.slug}>
                      <Link href={`/guide/${a.slug}`}>{a.titre}</Link>
                    </li>
                  ))}
                </ul>
                <Link href="/guide" className="font-bold">
                  Voir tous les articles →
                </Link>
              </div>
              <div className="border border-grey-line p-5">
                <h2 className="mb-2 text-[1.2rem]">Vous êtes déjà client ?</h2>
                <p className="mb-3 text-[0.98rem]">
                  Votre espace s’ouvre par un lien personnel reçu par email. Il n’y a ni compte à
                  créer, ni mot de passe : indiquez votre adresse, le lien vous est renvoyé
                  immédiatement.
                </p>
                <Link href="/connexion" className="font-bold">
                  Retrouver mon espace →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
