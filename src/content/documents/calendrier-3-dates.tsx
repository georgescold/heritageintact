import type { ReactNode } from "react";
import { Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";
import type { ProfilDocument } from "@/lib/methode";
import { codeUtile } from "@/lib/qualification";

/**
 * LE CALENDRIER DES 3 DATES.
 *
 * ⚠️ « Les 3 dates », jamais « les 3 portes » ni « les 3 verrous ». Le mot
 * « verrou » a été essayé et abandonné : personne ne le comprend à l'oral, et
 * il donne l'impression que quelque chose est fermé alors que le sujet est
 * exactement l'inverse — trois échéances encore ouvertes, pour l'instant.
 *
 * C'est la feuille qui va sur le frigo. Elle ne contient donc qu'une seule
 * idée par ligne, et trois dates à écrire à la main.
 *
 * ═══ LA DATE SURLIGNÉE ═══
 *
 * Quand l'acheteur a répondu aux questions du bon de commande, une date — une
 * seule, jamais deux — sort marquée d'un filet noir. C'est, avec la case
 * pré-cochée de « Quelle est ma situation ? », la contrepartie visible de ces
 * questions : sans elle, on aurait demandé quelque chose sans rien rendre.
 *
 * ⚠️ ON MARQUE, ON NE CONSEILLE PAS. Le filet dit « celle-ci vous concerne
 * d'abord », il ne dit jamais quoi verser, quoi arbitrer ni quoi souscrire —
 * ce serait une recommandation de placement, et le statut CIF commence là. Les
 * deux autres dates restent entières, à remplir comme aujourd'hui.
 */

/** Les trois dates de la feuille, dans l'ordre où elles y sont imprimées. */
type Date3 = "compteur15" | "anniversaire70" | "anniversaire71";

/**
 * LA DATE QUI CONCERNE CE LECTEUR EN PREMIER, ou `null`.
 *
 * Trois règles, dans l'ordre, premier match gagnant :
 *
 *   1. moins de 70 ans ET une assurance-vie (ou un doute) → le 70e anniversaire.
 *      C'est la seule des trois qui se referme sur une somme : après cette
 *      date, ce sont les PRIMES VERSÉES qui relèvent d'un autre régime (art.
 *      757 B du CGI) — ni le contrat, ni ses gains, ni ce qui a déjà été versé.
 *   2. 70 ans → le 71e anniversaire. L'article 669 du CGI compte la
 *      nue-propriété à 60 % jusqu'à 71 ans, à 70 % ensuite : la porte suivante
 *      est celle-là, et elle ne dépend d'aucun contrat.
 *   3. tout le reste → le compteur des 15 ans. C'est la date qui ne se referme
 *      jamais : elle vaut pour qui a 71 ans passés comme pour qui n'a aucune
 *      assurance-vie, et c'est la seule qu'on puisse marquer sans rien
 *      supposer d'autre que ce qui a été répondu.
 *
 * ⚠️ AUCUNE RÉPONSE, AUCUN SURLIGNAGE. Sans profil — ou avec quatre réponses
 * vides, ce qui revient au même —, la feuille imprimée est exactement celle
 * d'aujourd'hui. C'est ce qui rend le retour en arrière gratuit.
 */
function dateSurlignee(profil: ProfilDocument | undefined): Date3 | null {
  if (!profil) return null;

  const vie = codeUtile(profil.vie);
  const enfants = codeUtile(profil.enfants);
  const av = codeUtile(profil.av);
  const age = codeUtile(profil.age);

  if (!vie && !enfants && !av && !age) return null;

  if ((age === "a" || age === "b") && av !== "N") return "anniversaire70";
  if (age === "c") return "anniversaire71";
  return "compteur15";
}

/**
 * L'intertitre d'une date. Surligné, il porte un filet noir de 4 px à gauche
 * plutôt qu'un fond : l'acheteur imprime chez lui en noir et blanc, et un aplat
 * gris disparaît à la photocopie comme sur une cartouche presque vide. Un trait
 * noir, lui, survit à tout — y compris à un fax, ce qui n'est pas une
 * plaisanterie sur cette cible.
 */
function TitreDate({ surligne, children }: { surligne: boolean; children: ReactNode }) {
  if (!surligne) return <Titre>{children}</Titre>;

  return (
    <div className="eviter-coupure border-l-4 border-black pl-3">
      <h3 className="text-[1.1rem] font-bold text-black">{children}</h3>
      <p className="text-[0.85rem]">
        Marquée d&apos;après les réponses données au bon de commande. Les deux autres dates restent
        à remplir : elles peuvent vous concerner aussi.
      </p>
    </div>
  );
}

export function CalendrierTroisDates({ profil }: { profil?: ProfilDocument }) {
  const surlignee = dateSurlignee(profil);

  return (
    <Feuille
      titre="Le Calendrier des 3 dates"
      sousTitre="Trois échéances qui ne préviennent pas. Écrivez les vôtres et affichez cette feuille."
    >
      <Champ label="Ma facture invisible aujourd'hui" indice="reportée du Simulateur" />

      <TitreDate surligne={surlignee === "compteur15"}>
        Date n° 1 — le compteur des 15 ans
      </TitreDate>
      <p>
        Chaque parent peut donner <strong>100 000 €</strong> à chaque enfant sans droits. Cet
        abattement se reconstitue <strong>tous les 15 ans</strong>. Une donation faite à 62 ans et
        une seconde à 77 ans transmettent 200 000 € par enfant au lieu de 100 000 €.
      </p>
      <Source>Articles 779 et 784 du Code général des impôts (rappel fiscal de 15 ans).</Source>
      <Champ label="Date de ma dernière donation" indice="écrivez « jamais » si c'est le cas" />
      <Champ label="Donc mon compteur se recharge le" indice="cette date + 15 ans" />

      <TitreDate surligne={surlignee === "anniversaire70"}>
        Date n° 2 — mon 70e anniversaire
      </TitreDate>
      <p>
        Sur l&apos;assurance-vie, les sommes versées <strong>avant</strong> 70 ans bénéficient
        d&apos;un abattement de <strong>152 500 € par bénéficiaire</strong>. Celles versées{" "}
        <strong>après</strong> relèvent d&apos;un abattement de <strong>30 500 €</strong> global,
        tous bénéficiaires et tous contrats confondus. La même somme, versée de part et d&apos;autre
        de cet anniversaire, ne subit pas le même traitement.
      </p>
      <Source>
        Article 990 I du Code général des impôts (avant 70 ans), article 757 B (après 70 ans),
        article L132-12 du Code des assurances (l&apos;assurance-vie est hors succession civile).
      </Source>
      <Champ label="Mon 70e anniversaire" indice="ou celui de mon conjoint" />

      <TitreDate surligne={surlignee === "anniversaire71"}>
        Date n° 3 — mon 71e anniversaire
      </TitreDate>
      <p>
        Si vous donnez la nue-propriété d&apos;un bien en gardant l&apos;usage à vie, la valeur
        transmise est comptée à <strong>60 %</strong> tant que vous n&apos;avez pas 71 ans, et à{" "}
        <strong>70 %</strong> à partir de 71 ans. Dix points de patrimoine, pour un anniversaire.
      </p>
      <Source>Article 669 du Code général des impôts, barème de l&apos;usufruit.</Source>
      <Champ label="Mon 71e anniversaire" indice="ou celui de mon conjoint" />

      <Encadre titre="LA PROCHAINE ÉCHÉANCE QUI ME CONCERNE">
        <div className="min-h-[44px] border-b border-black" />
        <p className="mt-2 text-[0.9rem]">
          Des trois dates ci-dessus, recopiez ici la plus proche. C&apos;est celle-là, et aucune
          autre, qui décide de ce que vous faites en premier.
        </p>
      </Encadre>

      <p className="text-[0.9rem]">
        Les montants et les barèmes sont ceux en vigueur à la date de production de cette méthode.
        La législation évolue : vérifiez-les sur impots.gouv.fr avant toute décision, et faites
        relire votre projet par votre notaire.
      </p>
      <Champ label="Feuille remplie le" />
    </Feuille>
  );
}
