/**
 * Grappe assurance-vie. Le SEUL terrain libre de cette grappe : le DROIT.
 * Les types de clause, la lecture d'un contrat et les courriers à l'assureur
 * sont vendus (trois-clauses-beneficiaires, grille-audit-assurance-vie,
 * lettre-modification-clause). Cette page n'explique jamais comment rédiger.
 *
 * ⚠️ Les montants 152 500 / 30 500 ne figurent dans AUCUN document vendu :
 * `decision-70-ans.tsx` traite les questions à poser autour du seuil, sans
 * jamais donner de chiffre. Publier les articles 990 I et 757 B ne lui retire
 * donc rien — à la différence des pourcentages de l'art. 669, qui sont écrits
 * dans `calendrier-3-dates.tsx` et restent interdits ici.
 *
 * ANGLE : partout on lit « l'assurance-vie échappe à la succession ». Presque
 * personne n'explique que c'est la DATE DU VERSEMENT qui commande, pas la date
 * du contrat — l'erreur la plus chère de la grappe.
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

const eur = (n: number) => n.toLocaleString("fr-FR") + " €";

export function AssuranceVieHorsSuccession() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Assurance-vie et succession : ce qui compte, c’est la date du versement
      </h1>
      <p className="mb-2 text-text-soft">
        Un contrat ouvert à 40 ans n’est pas protégé pour autant si l’argent y est versé à 72. C’est
        l’erreur la plus coûteuse du sujet, et elle se joue sur un seul mot. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Pourquoi le capital sort de la succession">
        <p className="mb-3">
          L’article L.132-12 du Code des assurances pose le principe : le capital stipulé payable à
          un bénéficiaire déterminé <strong>n’entre pas dans la succession</strong> de l’assuré. Il
          est versé directement au bénéficiaire, sans passer par le partage.
        </p>
        <p>
          C’est ce qui fait de l’assurance-vie l’outil le plus souple de la transmission française :
          elle permet de donner à quelqu’un sans toucher à l’équilibre de l’héritage, et de le faire
          arriver vite, sans attendre le règlement de la succession.
        </p>
      </Bloc>

      <Bloc titre="Deux régimes, et c’est votre âge au versement qui tranche">
        <p className="mb-3">
          Le point que presque tous les articles escamotent : le droit ne regarde pas la date
          d’ouverture du contrat. Il regarde <strong>l’âge que vous aviez le jour où vous avez versé
          l’argent</strong>. Un même contrat peut donc relever des deux régimes à la fois, poche par
          poche.
        </p>
        <p className="mb-3">
          <strong>Versements avant 70 ans (art. 990 I du CGI).</strong> Chaque bénéficiaire dispose
          d’un abattement de {eur(152_500)} qui lui est propre. Au-delà, un prélèvement de 20 %,
          puis de 31,25 % sur la part taxable dépassant {eur(700_000)}. Avec trois bénéficiaires,
          ce sont {eur(457_500)} qui passent sans prélèvement.
        </p>
        <p className="mb-3">
          <strong>Versements après 70 ans (art. 757 B).</strong> L’abattement tombe à{" "}
          {eur(30_500)} — et il est <strong>global</strong> : tous contrats et tous bénéficiaires
          confondus. Au-delà, ce sont les droits de succession ordinaires qui s’appliquent, selon le
          lien de parenté.
        </p>
        <p>
          D’un côté {eur(152_500)} par personne, de l’autre {eur(30_500)} pour tout le monde. Le
          rapport est de un à cinq, et il bascule du jour au lendemain.
        </p>
      </Bloc>

      <Bloc titre="La consolation, rarement dite">
        <p>
          Après 70 ans, seules les <strong>primes versées</strong> sont taxables. Les gains produits
          par ces versements, eux, restent exonérés, quel que soit leur montant. Un versement de{" "}
          {eur(50_000)} à 72 ans qui en vaut {eur(80_000)} au décès n’est taxé que sur{" "}
          {eur(50_000)} — et après l’abattement global. Ce n’est pas anodin sur un contrat ancien.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Ce que l’assurance-vie ne couvre pas"
        accroche="Le capital sort de la succession ; la maison, elle, y reste. Recevez la grille de ce que vos enfants paieraient sur ce que vous leur laissez — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Deux limites au principe">
        <p className="mb-3">
          Le capital ne sort de la succession qu’à deux conditions. D’abord qu’un bénéficiaire soit
          réellement désigné : sans désignation, le capital retombe dans la succession et perd tout
          l’avantage — voir{" "}
          <Link href="/guide/assurance-vie-sans-beneficiaire">
            un contrat sans bénéficiaire désigné
          </Link>
          .
        </p>
        <p>
          Ensuite que les primes ne soient pas manifestement exagérées au regard de vos moyens.
          C’est la seconde porte de réintégration, et elle est plus utilisée qu’on ne le croit :{" "}
          <Link href="/guide/primes-manifestement-exagerees">
            les primes manifestement exagérées
          </Link>
          .
        </p>
      </Bloc>

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Elle n’examine pas votre contrat. Savoir quelle poche relève de quel régime suppose de
          reprendre l’historique des versements, date par date, auprès de l’assureur — c’est un
          travail de pièces, pas de lecture.
        </p>
        <p>
          Et elle ne dit pas comment désigner vos bénéficiaires. La rédaction d’une clause engage
          des conséquences civiles et fiscales durables : c’est un acte professionnel, pas un modèle
          à recopier.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code des assurances : article L.132-12 (le capital hors succession). Code général des
          impôts : articles 990 I (versements avant 70 ans) et 757 B (versements après 70 ans).
          Montants et état du droit vérifiés le {VERIFIE_LE}. Une loi de finances est votée chaque
          décembre.
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
