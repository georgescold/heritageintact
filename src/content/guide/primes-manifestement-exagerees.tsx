/**
 * Grappe assurance-vie — le droit pur, seul terrain libre.
 *
 * ANGLE : « l'assurance-vie est hors succession » est répété partout comme une
 * certitude. L.132-13 est la porte par laquelle ça se défait, et les articles
 * grand public l'évoquent en une ligne, sans jamais dire ce que le juge regarde.
 * Or c'est exactement ce que veut savoir quelqu'un qui verse à 75 ans.
 *
 * ⚠️ Frontière : aucun document vendu ne traite la réintégration des primes.
 */
import Link from "next/link";
import { CaptureDocument } from "@/components/CaptureDocument";

export const VERIFIE_LE = "12 septembre 2026";

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-[1.35rem] font-bold leading-snug">{titre}</h2>
      {children}
    </section>
  );
}

export function PrimesManifestementExagerees() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Quand l’assurance-vie retombe dans la succession : les primes manifestement exagérées
      </h1>
      <p className="mb-2 text-text-soft">
        C’est la seule porte par laquelle vos enfants peuvent contester ce que vous avez transmis
        hors héritage. Ce que le juge regarde vraiment, et ce qu’il ne regarde pas. Vérifié le{" "}
        {VERIFIE_LE}.
      </p>

      <Bloc titre="Le texte, et pourquoi il existe">
        <p className="mb-3">
          L’article L.132-13 du Code des assurances écarte le capital d’assurance-vie du rapport et
          de la réduction — c’est le principe qui fait toute la souplesse de l’outil. Puis il ajoute
          une exception d’une phrase : ces règles{" "}
          <strong>ne s’appliquent pas aux primes manifestement exagérées eu égard aux facultés</strong>{" "}
          du souscripteur.
        </p>
        <p>
          La raison est simple : sans ce garde-fou, il suffirait de verser tout son patrimoine sur
          un contrat pour déshériter ses enfants en toute légalité. La réserve héréditaire
          deviendrait décorative.
        </p>
      </Bloc>

      <Bloc titre="Ce que le juge examine">
        <p className="mb-3">
          Le texte ne fixe aucun seuil, aucun pourcentage, aucun plafond. L’appréciation se fait au
          cas par cas, <strong>au moment du versement</strong>, et non au décès. Quatre éléments
          reviennent systématiquement :
        </p>
        <ul className="mb-3 list-disc space-y-2 pl-6">
          <li>
            <strong>Votre âge</strong> au jour du versement. Verser à 85 ans et verser à 60 ans ne
            se regardent pas de la même manière.
          </li>
          <li>
            <strong>La part que représente la prime dans votre patrimoine.</strong> Cent mille euros
            versés par quelqu’un qui en possède deux millions n’ont rien d’exagéré ; les mêmes cent
            mille versés par quelqu’un qui possède cent vingt mille le sont manifestement.
          </li>
          <li>
            <strong>Vos revenus et votre situation familiale</strong> : vous étiez-vous démuni au
            point de dépendre d’autrui ?
          </li>
          <li>
            <strong>L’utilité du contrat pour vous.</strong> C’est le critère le moins connu et
            souvent le plus décisif : à un âge avancé, un contrat qui ne pouvait plus servir à
            épargner ni à vous procurer un revenu ressemble à une transmission déguisée.
          </li>
        </ul>
        <p>
          Aucun de ces critères ne suffit seul. C’est leur combinaison qui emporte la décision, et
          c’est pourquoi il n’existe pas de règle du type « ne pas dépasser tel pourcentage ».
        </p>
      </Bloc>

      <Bloc titre="Ce que ça donne si l’exagération est retenue">
        <p className="mb-3">
          Le contrat n’est pas annulé et le bénéficiaire ne perd pas tout. Ce sont{" "}
          <strong>les primes jugées excessives</strong> qui réintègrent la succession : elles sont
          alors rapportées et partagées comme le reste du patrimoine, et soumises aux droits selon
          le lien de parenté.
        </p>
        <p>
          Autrement dit, la personne que vous vouliez avantager se retrouve à devoir restituer une
          part à vos héritiers — plusieurs années après votre décès, au terme d’une procédure. C’est
          le contraire de ce que vous aviez organisé.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Le contexte chiffré de cet arbitrage"
        accroche="L'exagération s'apprécie en proportion de votre patrimoine. Commencez par savoir ce qu'il représente : recevez la grille de ce que vos enfants paieraient aujourd'hui, par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Qui peut soulever la question">
        <p className="mb-3">
          Vos héritiers, et personne d’autre. L’administration fiscale dispose de ses propres
          moyens, notamment l’article 757 B pour les versements après 70 ans — mais l’exagération
          des primes est une question <strong>civile</strong>, entre héritiers, tranchée par le juge
          judiciaire.
        </p>
        <p>
          C’est pour cette raison qu’elle se règle rarement à l’amiable : quand elle est soulevée,
          c’est que le dialogue familial a déjà échoué. Voir aussi{" "}
          <Link href="/guide/assurance-vie-et-succession">
            pourquoi le capital échappe à la succession
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p>
          Elle ne dit pas si vos versements sont exagérés. Aucun article ne le peut : la réponse
          dépend de chiffres qui vous sont propres, appréciés au jour de chaque versement. Si la
          question se pose pour vous, elle se pose à un professionnel — et elle se pose de votre
          vivant, pendant qu’il reste des choses à ajuster.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code des assurances : articles L.132-12 (capital hors succession) et L.132-13 (exception
          des primes manifestement exagérées). Code civil : articles 912 et 913 (réserve
          héréditaire). Code général des impôts : article 757 B. État du droit vérifié le{" "}
          {VERIFIE_LE} sur Legifrance.
        </p>
        <p className="text-[0.9rem] text-text-soft">
          Information générale. Ne constitue ni une consultation juridique au sens de la loi
          n°71-1130, ni un conseil fiscal personnalisé, ni une activité d’intermédiation en
          assurance. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
