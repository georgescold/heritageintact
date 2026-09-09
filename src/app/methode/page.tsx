import { cookies } from "next/headers";
import { MesureFunnel } from "@/components/MesureFunnel";
import Link from "next/link";
import { ApercuProduit } from "@/components/ApercuProduit";
import { PreuvePreparation } from "@/components/PreuvePreparation";
import { AideDecision } from "@/components/AideDecision";
import { objectifValide } from "@/lib/positionnement";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { ButtonLink, FAQ, Guarantee, Panel } from "@/components/ui";
import { VideoEmbed } from "@/components/VideoEmbed";
import { PRODUCTS, VIDEO, euros } from "@/lib/config";
import { LECONS } from "@/lib/lecons";
export const metadata: Metadata = { title: "Comprendre ma transmission · 27 €" };
export default async function Page() {
  const objectif = objectifValide((await cookies()).get("hi_objectif")?.value);
  const angle = objectif === "preparer" ? "Arrivez chez le notaire avec vos priorités, vos pièces et vos questions." : objectif === "assurance-vie" ? "Vos contrats sont signés. Savez-vous quelles questions poser pour les vérifier ?" : "Ce que vous avez construit mérite mieux que « on verra plus tard ».";

  return (
    <>
      <MesureFunnel evenement="vue_vente" />
      <Header />
      <main className="wrap flex-1 pb-28 pt-10">
        <p className="mb-3 font-bold text-orange-dark">
          Une première étape, pas une décision irréversible
        </p>
        <h1 className="mb-5 text-[2rem] leading-tight sm:text-[2.6rem]">
          {angle}
        </h1>
        <p className="mb-6 text-[1.2rem]">
          Vous n’avez pas besoin de devenir fiscaliste. Vous avez besoin de comprendre votre
          situation, de repérer ce qui reste à vérifier et de savoir quoi demander au notaire.
        </p>
        {objectif && <p className="mb-5 border-l-4 border-orange bg-grey-bg p-4">Présentation adaptée à votre priorité. <Link href="/#orientation">Modifier mon choix</Link>. La méthode conserve le même contenu et le même prix.</p>}
        <p className="mb-6 text-[1.1rem]">Imaginez votre prochain rendez-vous : vous ouvrez votre fiche, vous dites ce qui compte pour vous et vous savez quelles réponses demander. C’est ce passage du flou à une préparation concrète que nous vous aidons à faire.</p>
        {VIDEO.vsl && process.env.VSL_VALIDEE === "true" && (
          <VideoEmbed id={VIDEO.vsl} title="Présentation de la méthode" />
        )}
        <section className="my-7 border-l-4 border-blue bg-grey-bg p-5">
          <h2 className="mb-3 text-[1.4rem]">« Mon réflexe, c’est de prendre rendez-vous chez le notaire. »</h2>
          <p className="mb-3">C’est une bonne première démarche. La méthode vous aide à préparer cet échange : dire ce que vous souhaitez préserver, retrouver les informations utiles et formuler vos questions.</p>
          <p>Vous pouvez prendre rendez-vous dès maintenant. Pendant votre préparation, vous avancez à votre rythme, avec des explications écrites, des exemples et une action à chaque étape. Le notaire examine votre situation et vous conseille sur les décisions.</p>
        </section>
        <PreuvePreparation />
        <Panel title="Votre premier résultat concret">
          <p>
            Une fiche de situation, une priorité et trois questions à faire valider. Commencez par
            une dizaine de minutes, puis avancez à votre rythme. Aucun don ni changement de contrat
            n’est nécessaire pour suivre la formation.
          </p>
        </Panel>
        <div id="premier-cta" data-mesure="clic_commande" className="my-6">
          <ButtonLink href="/commande">Commencer pour {euros(PRODUCTS.front.price)}</ButtonLink>
          <p className="mt-2 text-center text-text-soft">
            Paiement unique · Aucun abonnement · Garantie 30 jours
          </p>
        </div>
        <ApercuProduit />
        <section className="my-7 border border-grey-line p-5">
          <h2 className="mb-4 text-[1.4rem]">Après votre achat, vous savez où commencer</h2>
          <ol className="list-decimal space-y-3 pl-6">
            <li><strong>Retrouvez votre accès personnel</strong> sur la confirmation et dans l’email d’accès.</li>
            <li><strong>Ouvrez « Mon parcours ».</strong> Commencez par la première fiche : une priorité, les informations connues et trois questions.</li>
            <li><strong>Reprenez à votre rythme.</strong> Les étapes cochées restent repérées ; les supports de base se lisent à l’écran ou s’impriment.</li>
          </ol>
          <p className="mt-4">Vous n’avez pas à regarder toutes les vidéos avant d’avancer. Les explications sont écrites et les vidéos complémentaires.</p>
        </section>
        <AideDecision />
        <section className="my-10">
          <h2 className="mb-4 text-[1.6rem]">« J’ai peur de donner trop tôt… et de regretter. »</h2>
          <p className="mb-4">
            C’est précisément pour cela que nous commençons par ce dont vous avez besoin pour vivre.
            Une économie d’impôt n’est pas une bonne affaire si elle vous prive de votre sécurité,
            de votre liberté ou de ressources utiles.
          </p>
          <p>
            La méthode distingue trois sujets souvent mélangés : ce qui vous appartient, les droits
            de votre famille et les règles fiscales. Elle vous aide à préparer une discussion
            éclairée, sans vous dicter un montage.
          </p>
        </section>
        <section className="my-10">
          <h2 className="mb-4 text-[1.6rem]">Ce que vous recevez pour 27 €</h2>
          <p className="mb-5">
            Huit étapes entièrement lisibles. Pour chacune : l’explication, un exercice en trois
            gestes, un exemple et une question pour vérifier votre compréhension. Les supports de
            base sont imprimables ; les vidéos restent complémentaires.
          </p>
          <ol className="space-y-3">
            {LECONS.map((l, i) => (
              <li key={l.cle} className="border border-grey-line p-4">
                <h3 className="font-bold">
                  {i + 1}. {l.titre}
                </h3>
                <p className="mt-1 text-text-soft">{l.resume}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="my-10 bg-grey-bg p-6">
          <h2 className="mb-3 text-[1.5rem]">Les repères ne sont pas des ordres d’agir</h2>
          <p>
            Les donations passées, l’âge lors des versements en assurance-vie et l’âge lors d’une
            donation avec réserve d’usufruit peuvent modifier le calcul. Un anniversaire n’oblige
            jamais à donner. La formation explique les distinctions et les vérifications à demander.
          </p>
        </section>
        <details className="my-10 border border-grey-line p-5">
          <summary className="min-h-[44px] cursor-pointer text-[1.3rem] font-bold">Existe-t-il des compléments ? Voir les offres et leurs prix</summary>
          <p className="mb-4">
            La méthode à 27 € est autonome. Le dossier notaire à 17 € est facultatif. Le pack
            Préparation à 197 € au total rassemble la méthode, le dossier, les parcours familiaux et
            l’atelier de simulation pédagogique. Avec le module assurance-vie : 247 € au total. Le
            module assurance-vie seul coûte 67 €.
          </p>
          <p>
            Les achats inclus déjà payés sont déduits lors d’un complément. Exemple : après la
            méthode à 27 €, le pack Préparation revient à 170 € supplémentaires. Aucun complément
            n’est nécessaire pour terminer la méthode.
          </p>
        </details>
        <section className="my-10 border-y border-grey-line py-7">
          <h2 className="mb-4 text-[1.5rem]">Attendre peut changer la facture. Vérifier maintenant vous permet de décider en connaissance de cause.</h2>
          <p className="mb-5">Vous pouvez remettre cette préparation à plus tard. Mais certaines règles dépendent de dates qui continuent d’avancer. Si un projet de transmission vous concerne, voici trois raisons de ne pas attendre le dernier moment pour le faire examiner.</p>
          <ol className="list-decimal space-y-5 pl-6">
            <li><strong>Une donation reportée peut décaler le renouvellement d’un abattement.</strong> Le délai de quinze ans s’apprécie pour les donations concernées, entre un même donateur et un même bénéficiaire. Attendre pour engager un projet adapté peut donc repousser une prochaine possibilité de transmission. L’historique et les dates d’enregistrement sont à vérifier.</li>
            <li><strong>Un seuil d’âge peut augmenter la valeur soumise aux droits.</strong> Pour une donation de nue-propriété avec usufruit viager, la valeur fiscale passe de 60 % à 70 % au 71e anniversaire de l’usufruitier. L’effet sur l’impôt dépend du bien, des bénéficiaires et des abattements disponibles.</li>
            <li><strong>En assurance-vie, la date des versements compte.</strong> Le régime applicable peut changer selon que les primes sont versées avant ou après 70 ans. Ce n’est pas la fermeture du contrat ni la disparition de tout avantage : c’est une raison de faire examiner un projet de versement avant, pas après son exécution.</li>
          </ol>
          <p className="mt-5">La première démarche peut être de contacter votre notaire dès aujourd’hui. Si vous souhaitez être guidé pour préparer les informations et les questions, commencez la Méthode. Son achat ne déclenche aucun délai fiscal et ne garantit aucune économie.</p>
          <p className="mt-3">Vos besoins et votre sécurité restent prioritaires. Si un seuil est proche, n’attendez pas d’avoir terminé le parcours pour consulter.</p>
          <p className="mt-4 text-sm text-text-soft">Repères vérifiés le 9 septembre 2026 : <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">donations et abattements</a>, <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934">barème de l’usufruit</a>, <a href="https://www.impots.gouv.fr/particulier/questions/je-suis-beneficiaire-dune-assurance-vie-comment-la-declarer">assurance-vie</a>. Leur application à votre situation doit être vérifiée.</p>
        </section>
        <section className="my-10">
          <h2 className="mb-3 text-[1.5rem]">Qui prépare ce parcours ?</h2>
          <p>Héritage Intact est édité par Loys Coquelle EI. Notre rôle est de rendre la préparation plus claire : organiser les notions, les documents et les questions. Nous ne remplaçons pas le professionnel qui examine votre situation.</p>
          <p className="mt-3"><Link href="/apercu">Essayez le premier exercice et regardez les supports</Link>, puis consultez nos <Link href="/mentions-legales">informations d’éditeur</Link>. Vous pouvez juger la pédagogie avant de choisir.</p>
        </section>
        <Guarantee />
        <section className="my-10">
          <h2 className="mb-4 text-[1.6rem]">Vos questions, sans détour</h2>
          <FAQ
            items={[
              {
                q: "Est-ce adapté si je n’y connais rien ?",
                a: "Oui : chaque notion est expliquée avec une action simple. Vous pouvez suivre le parcours à l’écrit et n’imprimer que vos supports utiles.",
              },
              {
                q: "Vais-je connaître le montant exact de ma succession ?",
                a: "Non. Une succession dépend d’éléments civils et fiscaux qu’un questionnaire ne suffit pas à établir. Les calculs sont des illustrations sous hypothèses, à faire vérifier.",
              },
              {
                q: "Pourquoi payer si le notaire peut m’expliquer ?",
                a: "Vous pouvez consulter votre notaire directement. La formation sert à préparer vos informations et vos questions, à votre rythme. Si vous êtes déjà à l’aise et bien accompagné, elle n’est peut-être pas nécessaire.",
              },
              {
                q: "Après 70 ans, est-ce trop tard ?",
                a: "Non. Les règles et les possibilités changent selon les opérations. La préparation familiale, la vérification des contrats et le rendez-vous professionnel restent utiles.",
              },
              {
                q: "Pour qui n’est-ce pas suffisant ?",
                a: "Succession déjà ouverte, conflit familial, patrimoine à l’étranger, entreprise ou montage complexe : sollicitez un professionnel. La formation ne fournit pas de conseil juridique ou fiscal personnalisé.",
              },
            ]}
          />
        </section>
        <div id="dernier-cta" data-mesure="clic_commande"><ButtonLink href="/commande">Préparer ma première fiche · 27 €</ButtonLink></div>
        <p className="mt-4 text-center text-text-soft">
          Votre prochaine étape : clarifier. Pas vous engager à donner.
        </p>
      </main>
      <Footer />
    </>
  );
}
