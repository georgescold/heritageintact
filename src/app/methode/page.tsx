import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Footer, Header, TrustRow } from "@/components/Chrome";
import { ExitPopup } from "@/components/ExitPopup";
import { StickyCta } from "@/components/StickyCta";
import { MesureFunnel } from "@/components/MesureFunnel";
import { VslPresentation } from "@/components/VslPresentation";
import { UrgencyBar } from "@/components/Urgency";
import { FAQ, Guarantee } from "@/components/ui";
import { ExempleSeuil } from "@/components/ExempleSeuil";
import { CalculHistorique } from "@/components/marketing/CalculHistorique";
import { JeanPierreHistorique, MartineHistorique } from "@/components/marketing/RecitsHistoriques";
import {
  AvantApresHistorique,
  DernierMotHistorique,
} from "@/components/marketing/SectionsHistoriques";
import { ChiffresHistoriques } from "@/components/marketing/ChiffresHistoriques";
import { OffreMethodeHistorique } from "@/components/marketing/OffreMethodeHistorique";
import { devisFront } from "@/lib/prix-front";
import { euros } from "@/lib/config";

export const metadata: Metadata = { title: "Les 7 erreurs qui offrent votre héritage à l’État" };

function AccesMethode({ montant, sombre = false }: { montant: number; sombre?: boolean }) {
  return (
    <div data-mesure="clic_commande">
      <a
        href="/commander"
        className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 py-3 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
      >
        Accéder au guide
      </a>
      <p
        className={`mt-2 text-center text-[0.95rem] ${sombre ? "text-white/90" : "text-text-soft"}`}
      >
        {euros(montant)} · Paiement unique · Accès immédiat · Garantie 30 jours
      </p>
    </div>
  );
}

/** Retour au gabarit pré-refonte : la vente uniquement, jamais un retour arrière du produit. */
export default async function VslPage() {
  const jar = await cookies(),
    d = await devisFront(jar.get("hi_offre")?.value);
  return (
    <>
      <MesureFunnel evenement="vue_vente" />
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
          <VslPresentation />
          <div id="premier-cta" className="mt-5 space-y-3">
            <AccesMethode montant={d.montant} />
            <div className="flex justify-center">
              <TrustRow />
            </div>
          </div>
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
        <ChiffresHistoriques />
        <OffreMethodeHistorique montant={d.montant} action={<AccesMethode montant={d.montant} />} />
        <div className="wrap">
          <ExempleSeuil />
        </div>
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
                a: "Allez-y : le notaire reste indispensable pour valider votre situation et rédiger les actes. Mais pour obtenir une étude personnalisée couvrant ces mêmes points, vous paierez très probablement bien plus que le prix du guide : les consultations et études détachables d’un acte sont facturées librement selon le cabinet. Ici, vous comprenez les 7 erreurs en quelques minutes, retrouvez vos priorités et arrivez avec les bonnes questions. Vous utilisez alors le temps du notaire pour votre situation, pas pour découvrir les bases.",
              },
              {
                q: "« Je ne veux pas me déposséder de mon vivant. Et si j’en ai besoin pour l’EHPAD ? »",
                a: "Vous avez raison de protéger vos besoins d’abord. Suivre la Méthode ne vous demande ni donation ni placement. Comprendre la nue-propriété ne signifie pas qu’il faut donner sa maison. Logement, revenus, autonomie et conséquences d’un acte doivent être examinés avant toute décision.",
              },
              {
                q: "« Mon assurance-vie est déjà faite, c’est réglé. »",
                a: "Deux questions restent utiles même quand le contrat est signé : quand avez-vous versé les sommes, et qui est désigné aujourd’hui ? Avant et après 70 ans, les règles et les assiettes fiscales diffèrent. Ce n’est pas une raison de modifier le contrat dans l’urgence : c’est une raison de retrouver les informations pendant que vous pouvez encore demander des explications.",
              },
              {
                q: "« 52 € pour un truc que je peux trouver gratuitement sur YouTube. »",
                a: "Vous pouvez trouver les règles gratuitement. Ce que vous achetez ici, c’est un parcours écrit dans l’ordre, avec les sept erreurs expliquées, des exemples et des fiches à garder. Vous reprenez votre lecture sans rechercher dix vidéos ni tout retenir de tête. Vous achetez cette préparation, pas un montant de droits garanti.",
              },
              {
                q: "« Sur internet, c’est des arnaques. Qui êtes-vous pour parler de ça ? »",
                a: "Ne croyez pas un chiffre sur parole : les exemples et leurs hypothèses sont présentés avec les sources. Héritage Intact est une méthode pédagogique, pas un cabinet de notaires. L’éditeur figure dans les mentions légales, les conditions sont accessibles, et vous disposez d’une garantie commerciale de 30 jours.",
              },
              {
                q: "« C’est compliqué, je ne vais rien comprendre. »",
                a: "Usufruit, nue-propriété, clause bénéficiaire : personne ne parle comme ça à table. La Méthode reprend les notions en français simple. Vous commencez par faire le point, puis vous lisez les sept erreurs dans l’ordre. Tout est écrit et imprimable ; aucun quiz ni vidéo pédagogique obligatoire.",
              },
              {
                q: "« Ma situation est particulière. »",
                a: "Elle mérite d’être comprise, pas rangée de force dans un exemple. Le premier produit est commun à tous. Après le paiement, quatre questions obligatoires orientent votre parcours et les éventuels compléments, sans changer votre achat. Une situation complexe, une succession ouverte ou un conflit demandent un professionnel sans attendre.",
              },
              {
                q: "« Et si la loi change ? »",
                a: "Vérifiez les règles en vigueur avant un acte. Les exemples sont datés et leurs sources sont accessibles. Le guide explique les notions ; il ne remplace pas la vérification de votre situation au moment de décider. La date du 31 décembre 2026 concerne une exonération temporaire particulière, pas la fin de l’abattement parent-enfant.",
              },
            ]}
          />
        </section>
        <DernierMotHistorique
          action={
            <div id="dernier-cta">
              <AccesMethode montant={d.montant} sombre />
            </div>
          }
        />
      </main>
      <Footer />
      <StickyCta href="/commander" label="Accéder au guide" />
      <ExitPopup
        storageKey="vsl-historique-v11"
        title="Ce que vous risquez si vous fermez cette page"
      >
        <ul className="space-y-2 text-[1.03rem]">
          {[
            "Vous ne saurez toujours pas ce qu’il faut faire vérifier sur votre maison, votre épargne et les documents que vous avez signés.",
            "Vous ne saurez pas laquelle des dates vous concerne en premier. Elle arrivera quand même.",
            "La question retournera dans la pile « plus tard ». Elle ne sera pas réglée pour autant.",
            "Et si rien ne change, ce sont vos enfants qui devront chercher les réponses — pendant leur deuil, sans pouvoir vous les demander.",
          ].map((t) => (
            <li key={t} className="flex gap-2 border-l-4 border-red bg-red-bg p-3">
              <span aria-hidden className="shrink-0 font-bold text-red">
                ✕
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="text-[1rem] font-bold text-blue">
          Une première lecture, une première fiche. Commencez pendant que vous pouvez encore leur
          expliquer ce qui compte pour vous.
        </p>
        {d.promotion.pourcent > 0 && d.promotion.fin && (
          <p className="text-sm text-text-soft">
            Votre palier de −{d.promotion.pourcent}% se termine le{" "}
            {new Date(d.promotion.fin).toLocaleString("fr-FR", {
              timeZone: "Europe/Paris",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
            , heure de Paris. Le prix sera revérifié avant confirmation.
          </p>
        )}
        <AccesMethode montant={d.montant} />
      </ExitPopup>
    </>
  );
}
