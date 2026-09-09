import type { Metadata } from "next";
import { cookies } from "next/headers";
import { devisFront } from "@/lib/prix-front";
import { AvantageDemarrage } from "@/components/AvantageDemarrage";
import { SortieOffre } from "@/components/SortieOffre";
import { ExempleSeuil } from "@/components/ExempleSeuil";
import { ExempleHeadline } from "@/components/ExempleHeadline";
import { UrgencyBar, UrgencyUnderButton, ConditionsExoneration } from "@/components/Urgency";
import { MesureFunnel } from "@/components/MesureFunnel";
import { Header, Footer } from "@/components/Chrome";
import { ButtonLink, FAQ, Guarantee } from "@/components/ui";
import { VslPresentation } from "@/components/VslPresentation";
import { RecitJeanPierre, RecitMartine } from "@/components/RecitsFamilles";
import { ApercuProduit } from "@/components/ApercuProduit";
import { PreuvePreparation } from "@/components/PreuvePreparation";
import { euros } from "@/lib/config";
export const metadata: Metadata = { title: "Les 7 erreurs qui offrent votre héritage à l’État" };
/** Même promesse et contenu pour tous ; avantage personnel horodaté, qualification après achat. */
export default async function Page() {
  const jar = await cookies();
  const d = await devisFront(jar.get("hi_offre")?.value);
  return <>
    <MesureFunnel evenement="vue_vente" />
    <UrgencyBar />
    <Header minimal />
    <main className="wrap flex-1 pb-16 pt-6 sm:pt-9">
      <p className="mb-3 text-sm font-bold uppercase tracking-wide text-orange-dark">Parents propriétaires · Vous avez construit pour eux</p>
      <h1 className="mb-4 text-[1.7rem] leading-tight sm:text-[2.35rem]">Vous avez une maison payée et des enfants ?<br /><span className="text-orange-dark">Si vous ne faites rien, l’État peut en prendre une part à votre mort.</span></h1>
      <p className="mb-5 text-[1.15rem] font-bold text-blue">Et si vos enfants héritaient de <span className="whitespace-nowrap text-orange-dark">68 206 €</span> de plus ? Découvrez les 7 erreurs à vérifier de votre vivant — sans vendre votre maison ni la quitter pour suivre le guide.</p>
      <VslPresentation />

      <div id="premier-cta" data-mesure="clic_commande" className="mb-7 mt-4">
        <ButtonLink href="/commande">Oui, je commence pour mes enfants · {euros(d.montant)}</ButtonLink>
        <p className="mt-2 text-center text-sm text-text-soft">Paiement unique · Aucun abonnement · Accès dès le paiement · Garantie 30 jours</p>
        <AvantageDemarrage promotion={d.promotion} base={d.total} />
      </div>
      <UrgencyUnderButton />
      <section id="presentation-ecrite" className="my-8">
        <h2 className="mb-4 text-[1.55rem]">Un jour, vous aimeriez qu’ils se disent : « Ils avaient pensé à nous. »</h2>
        <p className="mb-4">Imaginez un dimanche autour de la table. Les enfants parlent de leurs projets. Les petits-enfants jouent dans le jardin. Cette maison, ce n’est pas une ligne sur un relevé : c’est une partie de votre vie. Vous aimeriez qu’elle reste un souvenir heureux, pas le début d’une discussion tendue sur des papiers que personne ne comprend.</p>
        <p>Vous n’avez pas travaillé toutes ces années pour leur laisser des cartons de papiers, des interrogations… et la crainte de découvrir trop tard ce qu’il était possible d’anticiper.</p>
      </section>
      <ExempleHeadline />
      <RecitJeanPierre />
      <section className="my-8">
        <h2 className="mb-4 text-[1.55rem]">Si vous avez repoussé ce sujet, ce n’est pas par manque d’amour.</h2>
        <p className="mb-4">On vous parle d’usufruit, d’abattements, de clauses bénéficiaires. Vous cherchez une réponse sur internet ; vous repartez avec trois nouvelles questions. Alors vous refermez la page : « Je regarderai quand j’aurai le temps. »</p>
        <p className="mb-4">Le vrai piège, c’est de croire que <strong>« ma maison est payée » signifie « ma transmission est prête ».</strong> Posséder, protéger son conjoint et transmettre sont trois sujets différents.</p>
        <p>Ce qui manque n’est pas une pile d’articles supplémentaires. C’est un chemin simple pour relier les règles à vos préoccupations, sans décider seul d’un acte qui vous engage.</p>
      </section>
      <RecitMartine />
      <section className="my-8 border-l-4 border-red bg-red-bg p-5">
        <h2 className="mb-3 text-[1.5rem]">Le jour où ils chercheront les réponses, pourrez-vous encore les leur donner ?</h2>
        <p className="mb-3">« Où est le contrat ? Est-ce que la maison appartenait aux deux ? Est-ce que papa avait déjà donné quelque chose ? » Ce sont des questions ordinaires. Posées au milieu d’un deuil, elles prennent une tout autre place.</p>
        <p className="mb-3">Vous ne pouvez pas supprimer toutes les difficultés d’une succession. Mais vous pouvez commencer à regarder ce qui dépend encore de vous : les documents, les volontés à exprimer, les dates et les décisions à faire examiner.</p>
        <p className="font-bold">Le piège, c’est le silence : aimer ses enfants, penser à leur avenir… et croire que, puisque rien ne presse aujourd’hui, tout sera clair demain.</p>
      </section>
      <section className="my-8 border-l-4 border-blue bg-grey-bg p-5">
        <h2 className="mb-3 text-[1.4rem]">« Mon réflexe, c’est de prendre rendez-vous chez le notaire. »</h2>
        <p className="mb-3">Oui. Et imaginez la différence entre « Que dois-je faire ? » et « Je veux préserver mon logement, protéger mon conjoint et comprendre les droits de mes enfants. Voici ce que j’ai retrouvé. Voici mes trois questions. »</p>
        <p className="mb-3">Vous achetez cette préparation : des explications à reprendre chez vous, des exemples et une première fiche pour ne pas tout garder dans votre tête. Le notaire examine votre cas et vous conseille sur les décisions.</p>
        <p>Réservez le rendez-vous. Et en attendant, ne laissez pas cette démarche redevenir « je m’en occuperai ». Le guide vous donne les mots et les premiers supports pour commencer chez vous. Le tarif d’un échange chez le notaire dépend de la prestation : nous ne vous vendons pas une prétendue économie sur une consultation forcément payante.</p>
      </section>
      <section className="my-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-dark">La Méthode Héritage Intact · Les 7 erreurs</p>
        <h2 className="mb-4 text-[1.6rem]">Passez de « j’espère que tout ira bien » à « je sais ce qu’il faut vérifier ».</h2>
        <p className="mb-5">Un même parcours de base pour tous. Votre première fiche, puis sept erreurs expliquées en langage courant. Vous n’avez pas besoin de tout apprendre avant de commencer.</p>
        <ol className="list-decimal space-y-4 pl-6">
          <li><strong>Posez votre situation.</strong> Ce que vous voulez protéger, ce que vous savez déjà et ce qui reste inconnu.</li>
          <li><strong>Repérez les points sensibles.</strong> Maison, couple, enfants, donations et assurance-vie : vous distinguez les sujets au lieu de les mélanger.</li>
          <li><strong>Préparez vos questions.</strong> Vous repartez avec une priorité et les vérifications à demander au professionnel.</li>
        </ol>
      </section>
      <section className="my-7 border-l-4 border-orange bg-yellow-bg p-5"><h2 className="mb-3 text-[1.4rem]">Ce soir, une première fiche. Au prochain échange, quelque chose de concret à ouvrir.</h2><p className="mb-3"><strong>Pour commencer :</strong> votre priorité, une information retrouvée, une question précise. <strong>Puis :</strong> les sept erreurs pour repérer les points à examiner. <strong>Au rendez-vous :</strong> votre préparation pour expliquer ce qui compte, sans tout garder dans votre tête.</p><p>Pas « toute ma succession est réglée ». Mais enfin : « J’ai commencé, et je sais quelle question poser ensuite. »</p></section>
      <PreuvePreparation />
      <ApercuProduit />
      <section className="my-8 border-2 border-blue p-5 sm:p-6">
        <h2 className="mb-4 text-[1.6rem]">Pour {euros(d.montant)}, ne repartez pas seulement avec de bonnes intentions.</h2>
        <ul className="space-y-4">
          <li><strong>Vous voulez protéger votre famille, sans vous mettre en difficulté ?</strong> Apprenez à séparer votre sécurité personnelle des objectifs de transmission.</li>
          <li><strong>Vous avez peur de laisser passer quelque chose ?</strong> Parcourez les sept erreurs et notez les dates et documents à faire vérifier.</li>
          <li><strong>Vous redoutez de ne rien comprendre au rendez-vous ?</strong> Retrouvez les notions expliquées simplement, des exemples et les questions à préparer.</li>
          <li><strong>Vous n’avez pas envie d’une formation interminable ?</strong> Tout le parcours de base se lit à votre rythme ; les supports sont imprimables. Les guides PDF, les exemples et les fiches utiles remplacent les vidéos pédagogiques.</li>
        </ul>
        <p className="mt-5 font-bold">La Méthode est autonome. Vous n’avez pas à acheter une autre offre pour la terminer.</p>
        <div data-mesure="clic_commande" className="mt-5"><ButtonLink href="/commande">Je prépare ma transmission maintenant · {euros(d.montant)}</ButtonLink></div>
      </section>
      <section className="my-8">
        <h2 className="mb-4 text-[1.5rem]">Après le paiement : une suite simple, sans surprise</h2>
        <ol className="list-decimal space-y-3 pl-6">
          <li><strong>Quatre questions obligatoires</strong> pour connaître votre priorité et orienter la suite. Elles ne changent ni le contenu ni le prix de la Méthode achetée.</li>
          <li><strong>Votre Méthode prête à ouvrir</strong> et un point de départ clair. Votre accès est créé dès le paiement et reste acquis. « Je ne sais pas » est une réponse acceptée lorsque proposée.</li>
          <li><strong>Un complément adapté, si utile.</strong> Vous voyez ce qu’il apporte et le montant exact avant de décider. Vous pouvez rester avec la Méthode seule.</li>
        </ol>
      </section>
      <section id="pourquoi-maintenant" className="my-9 border-l-4 border-red bg-red-bg p-5">
        <h2 className="mb-4 text-[1.55rem]">Ce qui coûte, ce n’est pas seulement l’impôt. C’est parfois d’avoir regardé trop tard.</h2>
        <p className="mb-4">Fermer cette page ne règle aucune des questions que vous vous posiez en arrivant. Et certaines dates, elles, continuent d’avancer.</p>
        <ul className="space-y-4">
          <li><strong>Le compteur des 15 ans ne se lance pas avec une bonne intention.</strong> Une donation à 67 ans atteint ce repère à 82 ans. La repousser à 69 ans le décale à 84 ans. Pour un même parent et un même enfant, le renouvellement de l’abattement dépend des donations antérieures. Ce que vous ne pouvez pas faire : attendre deux ans, puis antidater le don.</li>
          <li><strong>Les versements avant ou après 70 ans.</strong> Le régime fiscal de l’assurance-vie peut différer. Il reste des possibilités après 70 ans : mieux vaut examiner un projet avant son exécution.</li>
          <li><strong>Le seuil de 71 ans.</strong> Pour une donation de nue-propriété avec usufruit viager, la valeur fiscale passe de 60 % à 70 % au 71e anniversaire de l’usufruitier. L’effet sur l’impôt dépend ensuite du bien et des abattements disponibles.</li>
        </ul>
        <p className="mt-4 font-bold">Vous ne pouvez pas refaire hier. Vous pouvez commencer à mettre vos questions au clair aujourd’hui.</p>
        <p className="mt-3 text-sm text-text-soft">L’achat ne déclenche aucun délai fiscal et ne garantit aucune économie. Si une échéance est proche, contactez un professionnel sans attendre la fin du parcours.</p>
        <p className="mt-3 text-sm text-text-soft">Repères : <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">donations et abattements</a>, <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934">barème de l’usufruit</a>, <a href="https://www.impots.gouv.fr/particulier/questions/je-suis-beneficiaire-dune-assurance-vie-comment-la-declarer">assurance-vie</a>.</p>
      </section>
      <ConditionsExoneration />
      <ExempleSeuil />
      <Guarantee />
      <section className="my-8">
        <h2 className="mb-4 text-[1.5rem]">Les dernières questions avant de commencer</h2>
        <FAQ items={[
          {q:"Est-ce adapté si je n’y connais rien ?",a:"Oui. Les notions sont expliquées à l’écrit, avec des exemples et des actions simples. Vous pouvez commencer par une première fiche et reprendre ensuite à votre rythme."},
          {q:"Pourquoi faire confiance à Héritage Intact ?",a:"Vous pouvez examiner l’exemple, ses hypothèses et les sources avant d’acheter. L’offre porte sur des guides et des supports de préparation déjà écrits, pas sur un résultat fiscal promis. L’éditeur est identifié dans les mentions légales ; aucun titre de notaire ou d’expert n’est revendiqué. La garantie commerciale de 30 jours est décrite dans les CGV."},
          {q:"Vais-je devoir donner ma maison ?",a:"Non. Suivre la Méthode ne vous engage à aucun don, placement ou changement de contrat. Votre sécurité et vos besoins restent prioritaires."},
          {q:"Vais-je connaître le montant exact des droits à payer ?",a:"Non. La formation aide à comprendre et à préparer ; elle ne constitue pas un audit juridique ou fiscal personnalisé. Les calculs pédagogiques reposent sur des hypothèses à faire vérifier."},
          {q:"Après 70 ans, est-ce trop tard ?",a:"Non. Les règles diffèrent selon les opérations. Organiser les informations, vérifier les contrats et préparer un rendez-vous restent utiles."},
          {q:"Y a-t-il d’autres achats obligatoires ?",a:"Non. La Méthode à 27 € est autonome. Le Dossier à 17 € est facultatif. Les packs Préparation à 197 € au total ou avec assurance-vie à 247 € au total incluent la Méthode et le Dossier ; les achats inclus déjà payés sont déduits. Le module assurance-vie seul coûte 67 €."},
          {q:"Pour qui ce parcours n’est-il pas suffisant ?",a:"Une succession déjà ouverte, un conflit, une entreprise ou un patrimoine international nécessitent un professionnel. Ne retardez pas cette démarche pour suivre une formation."}
        ]} />
      </section>
      <section className="my-8 text-center">
        <h2 className="mb-4 text-[1.7rem]">Vous avez pris soin d’eux toute votre vie.<br />Commencez à préparer ce qu’ils n’auront pas à deviner.</h2>
        <p className="mb-5">Ce soir, vous pouvez encore vous dire « j’y penserai ». Ou ouvrir votre première fiche et mettre des mots sur ce que vous voulez préserver.</p>
        <div id="dernier-cta" data-mesure="clic_commande"><ButtonLink href="/commande">Oui, je commence maintenant · {euros(d.montant)}</ButtonLink></div>
        <p className="mt-3 text-sm text-text-soft">Paiement unique · Méthode complète à l’écrit · Garantie 30 jours</p>
      </section>
    </main>
    <SortieOffre produit="front" href="/commande" montant={d.montant} promotion={d.promotion} />
    <Footer />
  </>;
}
