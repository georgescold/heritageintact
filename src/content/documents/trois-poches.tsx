import { Champ, Encadre, Feuille, Titre } from "@/components/documents/Feuille";

/**
 * LA RÈGLE DES 3 POCHES — « combien garder pour soi » (bonus B5).
 *
 * ⚠️ C'est la réponse à la seule objection qui bloque réellement l'étape 1 :
 * « et si j'en ai besoin ? ». Tant qu'elle n'est pas traitée, personne ne
 * donne rien, et toute la méthode reste théorique.
 *
 * ⚠️ AUCUN POURCENTAGE RECOMMANDÉ, AUCUN SUPPORT D'ÉPARGNE NOMMÉ. Dire
 * « gardez 30 % » ou « placez ceci » serait un conseil en investissement
 * financier, activité réglementée (statut CIF). On donne une méthode de
 * calcul ; le lecteur pose ses propres chiffres.
 */
export function TroisPoches() {
  return (
    <Feuille
      titre="Combien garder pour soi : la règle des 3 poches"
      sousTitre="On ne transmet jamais ce dont on peut avoir besoin. Voici comment tracer la limite."
    >
      <p>
        Une donation est définitive. C&apos;est ce qui la rend efficace, et c&apos;est ce qui la
        rend effrayante. La règle est simple : on ne donne que la troisième poche, et jamais avant
        d&apos;avoir rempli les deux premières.
      </p>

      <Titre>Poche 1 — vivre</Titre>
      <p>
        Ce qu&apos;il vous faut chaque mois, une fois vos revenus déduits. Comptez le logement, les
        charges, l&apos;alimentation, la santé, la voiture, les assurances.
      </p>
      <Champ label="A. Mes dépenses annuelles" />
      <Champ label="B. Mes revenus annuels" indice="retraites, pensions, loyers" />
      <Champ label="C. Ce que je dois prendre sur mon épargne chaque année (A − B)" />
      <p className="text-[0.95rem]">
        Multipliez C par le nombre d&apos;années que vous voulez couvrir. Beaucoup de gens
        raisonnent sur vingt ans : à vous de choisir.
      </p>
      <Champ label="POCHE 1 = C × nombre d'années" />

      <Titre>Poche 2 — l&apos;imprévu</Titre>
      <p>
        Ce que vous voulez pouvoir sortir sans demander à personne : une toiture, une aide à
        domicile, une maison de retraite pendant quelques années, un coup de main à un enfant en
        difficulté.
      </p>
      <Champ label="POCHE 2 = ce que je veux garder disponible" />

      <Titre>Poche 3 — transmettre</Titre>
      <Champ label="D. Mon patrimoine total" indice="reporté de La Facture Invisible, ligne C" />
      <Encadre titre="POCHE 3 = D − POCHE 1 − POCHE 2">
        <div className="min-h-[44px] border-b border-black" />
        <p className="mt-2 text-[0.9rem]">
          Voilà le montant, et le seul, sur lequel les étapes suivantes travaillent. S&apos;il est
          nul ou négatif, la méthode reste utile : la clause bénéficiaire de votre assurance-vie et
          votre testament ne coûtent rien et ne vous dépossèdent de rien.
        </p>
      </Encadre>

      <Titre>Trois façons de transmettre sans se déposséder</Titre>
      <ol className="list-decimal space-y-1 pl-5">
        <li>
          Donner la nue-propriété d&apos;un bien en gardant l&apos;usage à vie : vous restez chez
          vous, et vous pouvez même le louer.
        </li>
        <li>
          Désigner des bénéficiaires sur un contrat d&apos;assurance-vie : l&apos;argent reste le
          vôtre, disponible, jusqu&apos;au bout.
        </li>
        <li>
          Écrire un testament : il ne transfère rien de votre vivant et se modifie autant de fois
          que vous voulez.
        </li>
      </ol>

      <p className="text-[0.9rem]">
        Cette feuille est un cadre de réflexion, pas une recommandation de placement ni de
        répartition. Aucun montant, aucun pourcentage et aucun produit d&apos;épargne ne vous sont
        conseillés ici. Pour une recommandation personnalisée, adressez-vous à un professionnel
        habilité.
      </p>
      <Champ label="Feuille remplie le" />
    </Feuille>
  );
}
