import { Footer, Header, TrustRow } from "@/components/Chrome";
import { SortieGuide } from "@/components/SortieGuide";
import { StickyCta } from "@/components/StickyCta";
import { MesureFunnel } from "@/components/MesureFunnel";
import { VslPresentation } from "@/components/VslPresentation";
import { UrgencyBar } from "@/components/Urgency";
import { FAQ, Guarantee } from "@/components/ui";
import { CalculHistorique } from "@/components/marketing/CalculHistorique";
import { JeanPierreHistorique, MartineHistorique } from "@/components/marketing/RecitsHistoriques";
import {
  AvantApresHistorique,
  DernierMotHistorique,
} from "@/components/marketing/SectionsHistoriques";
import { OffreMethodeHistorique } from "@/components/marketing/OffreMethodeHistorique";
import type { ReactNode } from "react";
import { EvenementPixel, LeadInscription } from "@/components/EvenementPixel";

function AccesMethode({ href = "/commander" }: { href?: string }) {
  return (
    <div data-mesure="clic_commande">
      {/* Un vrai <a>, pas <Link> : /commander est une route qui démarre le compte à
          rebours de l'offre. Le préchargement de <Link> le lancerait sans clic. */}
      <a
        href={href}
        className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 py-3 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
      >
        Accéder au guide
      </a>
    </div>
  );
}

/**
 * LA PAGE DE VENTE — partagée par /methode et /lp.
 *
 * ⚠️ PLUS AUCUNE CAPTURE D'EMAIL AVANT LA VENTE (décision de Loys, 16/09/2026,
 * « skip les mails »). La pub mène ici et le paiement se fait SUR CETTE PAGE :
 * `paywall` reçoit le bon de commande, posé sous la vidéo (version A) ou à sa
 * place (version B, `sansVideo`). Tous les boutons deviennent alors des ancres
 * vers ce bloc : pas de page en plus, pas de clic supplémentaire.
 *
 * Sans `paywall` (c'est le cas de /methode), la page garde son fonctionnement
 * d'origine : les boutons mènent à /commander.
 *
 * L'email n'est demandé qu'au moment de payer, dans le formulaire de commande.
 * Historique : la fenêtre email du 14/09 et la page de capture seule vivent
 * encore sur /lp-email.
 */
export function PageVente({
  paywall,
  sansVideo = false,
}: {
  /** Le bon de commande, posé directement sous la vidéo (version A) ou en tête (version B). */
  paywall?: ReactNode;
  /** Version B du test : la vidéo est retirée, la vente commence au bon de commande. */
  sansVideo?: boolean;
} = {}) {
  // Avec le paiement sur la page, les boutons ne changent plus d'adresse : ils
  // font défiler jusqu'au bon de commande. Aucun clic supplémentaire, aucune
  // page en plus — c'est toute la consigne du 16/09/2026.
  const lienCta = paywall ? "#paywall" : "/commander";
  return (
    <>
      <MesureFunnel evenement="vue_vente" />
      <EvenementPixel nom="ViewContent" />
      <LeadInscription />
      <UrgencyBar />
      <Header minimal />
      <main className="flex-1" data-version-vente="historique-v11">
        <section className="wrap pt-6 sm:pt-10">
          <h1 className="mb-3 text-[1.5rem] leading-[1.14] sm:text-[2.1rem]">
            Vous avez une maison payée et des enfants&nbsp;?
            <br />
            <span className="text-orange">
              Si vous ne faites rien, l’État en prendra une part à votre mort.
            </span>
          </h1>
          <p className="mb-5 text-[1.12rem] leading-snug">
            Sur une maison de province et les économies d’une vie, le cas expliqué ci-dessous passe
            d’environ <strong className="whitespace-nowrap text-red">82 194 €</strong> de droits à{" "}
            <strong className="whitespace-nowrap text-green">13 988 €</strong> après les opérations
            prises de son vivant — sans vendre ni quitter la maison. Soit{" "}
            <strong className="whitespace-nowrap">68 206 €</strong> d’écart dans cet exemple.
          </p>
          {!sansVideo && <VslPresentation />}
          {paywall ? (
            <div id="paywall" className={sansVideo ? "" : "mt-6"}>
              {paywall}
            </div>
          ) : (
            <div id="premier-cta" className="mt-5 space-y-3">
              <AccesMethode href={lienCta} />
              <div className="flex justify-center">
                <TrustRow />
              </div>
            </div>
          )}
        </section>
        <div id="presentation-ecrite">
          <CalculHistorique />
        </div>
        <AvantApresHistorique />
        <div className="wrap">
          <section className="my-8 border-l-4 border-red bg-red-bg p-5">
            <h2 className="mb-3 text-[1.5rem]">
              Le jour où vos enfants chercheront les réponses, pourrez-vous encore les leur donner ?
            </h2>
            <p className="mb-3">
              « Où est le contrat ? Est-ce que la maison appartenait aux deux ? Est-ce que papa
              avait déjà donné quelque chose ? » Ce sont des questions ordinaires. Posées au milieu
              d’un deuil, elles prennent une tout autre place.
            </p>
            <p className="mb-3">
              Vous ne pouvez pas supprimer toutes les difficultés d’une succession. Mais vous pouvez
              commencer à regarder ce qui dépend encore de vous : les documents, les volontés à
              exprimer, les dates et les décisions à faire examiner.
            </p>
            <p className="font-bold">
              Le piège, c’est le silence : aimer ses enfants, penser à leur avenir… et croire que,
              puisque rien ne presse aujourd’hui, tout sera clair demain.
            </p>
          </section>
        </div>
        <JeanPierreHistorique />
        <MartineHistorique />
        <OffreMethodeHistorique action={<AccesMethode href={lienCta} />} />
        <section className="wrap py-8">
          <Guarantee />
        </section>
        <section className="wrap py-10">
          <h2 className="mb-3 text-[1.4rem]">
            Vos questions - nos réponses
          </h2>
          <FAQ
            items={[
              {
                q: "« J’ai le temps, je suis en forme. »",
                a: "Le sujet n’est pas de deviner la date de votre mort. C’est de regarder ce qui dépend de votre vivant. À 67 ans, une donation atteint le repère des quinze ans à 82 ans. Faite deux ans plus tard, à 84 ans. Vous ne pouvez pas antidater ce que vous n’avez pas encore fait. Le guide aide à préparer la décision ; il ne déclenche aucun délai fiscal.",
              },
              {
                q: "« Il faut de toute façon aller chez le notaire, alors autant y aller directement. »",
                a: "Allez-y : le notaire reste indispensable pour valider votre situation et rédiger les actes. Ici, vous comprenez d’abord les 7 erreurs, retrouvez vos priorités et arrivez avec les bonnes questions. Vous utilisez alors le rendez-vous pour votre situation, pas pour découvrir les bases.",
              },
              {
                q: "« Je ne veux pas me déposséder de mon vivant. Et si j’en ai besoin pour l’EHPAD ? »",
                a: "Vous avez raison de protéger vos besoins d’abord. Suivre le guide ne vous demande ni donation ni placement. Comprendre la nue-propriété ne signifie pas qu’il faut donner sa maison. Logement, revenus, autonomie et conséquences d’un acte doivent être examinés avant toute décision.",
              },
              {
                q: "« Mon assurance-vie est déjà faite, c’est réglé. »",
                a: "Deux questions restent utiles même quand le contrat est signé : quand avez-vous versé les sommes, et qui est désigné aujourd’hui ? Avant et après 70 ans, les règles et les assiettes fiscales diffèrent. Ce n’est pas une raison de modifier le contrat dans l’urgence : c’est une raison de retrouver les informations pendant que vous pouvez encore demander des explications.",
              },
              {
                q: "« Sur internet, c’est des arnaques. Qui êtes-vous pour parler de ça ? »",
                a: "Ne croyez pas un chiffre sur parole : les exemples et leurs hypothèses sont présentés avec les sources. Héritage Intact est un guide pédagogique, pas un cabinet de notaires. L’éditeur figure dans les mentions légales, les conditions sont accessibles, et vous disposez d’une garantie commerciale de 30 jours.",
              },
              {
                q: "« C’est compliqué, je ne vais rien comprendre. »",
                a: "Usufruit, nue-propriété, clause bénéficiaire : personne ne parle comme ça à table. Le guide reprend les notions en français simple. Vous commencez par faire le point, puis vous lisez les sept erreurs dans l’ordre. Tout est écrit et imprimable ; aucun quiz ni vidéo pédagogique obligatoire.",
              },
              {
                q: "« Ma situation est particulière. »",
                a: "Elle mérite d’être comprise, pas rangée de force dans un exemple. Le premier produit est commun à tous et s’ouvre directement dans votre espace après le paiement. Si vous demandez ensuite votre plan personnalisé, un questionnaire détaillé prépare votre aperçu avant toute proposition payante. Une situation complexe, une succession ouverte ou un conflit demandent un professionnel sans attendre.",
              },
              {
                q: "« Et si la loi change ? »",
                a: "Les sources officielles sont accessibles directement dans le guide. Avant un acte, votre professionnel confronte les règles en vigueur à vos pièces, à votre famille et aux opérations déjà réalisées.",
              },
            ]}
          />
        </section>
        <DernierMotHistorique
          action={
            <div id="dernier-cta">
              <AccesMethode href={lienCta} />
            </div>
          }
        />
      </main>
      <Footer />
      <StickyCta href={lienCta} label="Accéder au guide" />
      <SortieGuide storageKey="vsl-historique-v12" />
    </>
  );
}
