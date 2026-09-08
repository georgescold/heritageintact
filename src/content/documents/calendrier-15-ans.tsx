import {
  Champ,
  Encadre,
  Feuille,
  Source,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";

/**
 * LE CALENDRIER DE TRANSMISSION SUR 15 ANS (Le Plan familial, upsell 1).
 *
 * ═══ CE QUI ÉTAIT FAUX, ET QUI EST REDRESSÉ ICI ═══
 *
 * ⚠️ IL N'Y A PAS UN COMPTEUR, IL Y EN A UN PAR DONATION. La version d'origine
 * faisait partir un compteur unique du « premier don déclaré » et le faisait
 * repartir à zéro en « année 16 ». L'article 784 du CGI ne dit pas cela : il
 * fait additionner chaque donation antérieure « à l'exception de celles passées
 * depuis plus de quinze ans » — donc date par date. Un parent qui a donné
 * 40 000 € en 2010 puis 60 000 € en 2018 lisait ici qu'il disposait de
 * 100 000 € libres en 2026 ; il n'en a que 40 000, le reste étant rappelé
 * jusqu'en 2033, et le surplus taxé dès le premier euro (art. 777). Le lecteur
 * qui a déjà donné — celui que cette feuille visait — était précisément celui
 * qu'elle trompait. C'est aussi la doctrine de tableau-bord-familial.tsx : les
 * trois feuilles du classeur disent maintenant la même chose.
 *
 * ⚠️ DES DATES, PLUS DES ANNÉES. Le délai court de la date de l'acte, ou de la
 * révélation du don manuel, pas du 1er janvier. Un don de décembre 2010 est
 * libéré en décembre 2025 : le lecteur qui écrivait « 2010 » et donnait en
 * janvier 2025 donnait onze mois trop tôt, et son abattement était réputé déjà
 * consommé. Toutes les saisies de donation demandent donc jour, mois et année,
 * et la feuille 2 fait écrire la date de libération à côté.
 *
 * ⚠️ LE BARÈME DE L'ARTICLE 669 NE S'ARRÊTE PAS À 70 %. Il continue : 80 % de
 * 81 à 90 ans, 90 % au-delà. Sur une cible annoncée 65-85 ans, écrire « à
 * partir de 71 ans, 70 % » est faux pour toute une part du lectorat — 10 points
 * d'assiette oubliés, soit 8 000 € de droits sur un bien à 400 000 €. Le barème
 * est donc donné en entier, en tableau, feuille 4.
 *
 * ═══ POURQUOI CINQ FEUILLES ALORS QU'IL N'Y EN AVAIT QU'UNE ═══
 *
 * Mesurée aux conditions d'impression du projet (A4, marges 18/16 mm, 12 pt,
 * soit 161 mm de largeur utile et environ 261 mm de hauteur par page), la
 * version d'origine sortait déjà sur deux à trois pages — sans en-tête ni
 * avertissement légal sur les pages 2 et 3, alors que `Feuille` les répète
 * justement sur CHAQUE feuille parce que les feuilles sont séparées, rangées
 * dans un classeur et relues des mois plus tard, parfois par un enfant. Les
 * corrections de droit ci-dessus ont ajouté du texte, pas retiré. On découpe
 * donc selon les cinq choses que le document fait réellement, comme
 * grille-audit-assurance-vie.tsx l'a fait pour le même motif.
 *
 * ⚠️ LA FEUILLE QU'ON AFFICHE EST LA 5, ET ELLE EST SEULE SUR SA PAGE. C'est le
 * calendrier lui-même. Les quatre premières se rangent derrière, dans le
 * classeur : ce sont les règles qu'on relit avant d'écrire une ligne. Le
 * sous-titre ne promet donc plus une feuille unique.
 *
 * ⚠️ `eviter-coupure` SUR CHAQUE BLOC. `.feuille { break-inside: avoid }` est
 * inopérant dès que le bloc dépasse une page ; sans la classe, un encadré à
 * bordure épaisse s'ouvre sur une page et se referme sur la suivante.
 *
 * ═══ CE QUI COMMANDE LA MISE EN PAGE DU TABLEAU ═══
 *
 * ⚠️ `h-[36px]`, LE PLANCHER DE `TableauVierge`. La version d'origine était à
 * 34 px, seul endroit du produit sous les deux planchers maison. 44 px, le
 * plancher de `Champ`, a été essayé pour la colonne « ce que je fais » : la
 * hauteur d'une ligne de tableau est celle de sa cellule la plus haute, donc
 * 44 px partout, soit 175 mm de corps de tableau. Avec l'en-tête et le pied de
 * page de `Feuille`, il ne restait plus rien sur la page — ni la consigne du
 * crayon, ni les lignes de date. On garde donc le plancher des tableaux, celui
 * que le reste du classeur donne à écrire.
 *
 * ⚠️ AUCUN UNDERSCORE. Le « 20__ » pré-imprimé laissait 4 mm pour écrire deux
 * chiffres, à faire quinze fois au crayon à 78 ans. La case est vide, la
 * colonne élargie à 16 % (~26 mm), et seul le numéro de ligne reste en gras
 * comme repère.
 *
 * ⚠️ `<colgroup>` + `table-fixed`. Les `w-[9%]` posés sur des `td` d'un tableau
 * en `table-layout: auto` sont des indications que le navigateur redistribue
 * selon les en-têtes : les largeurs écrites n'étaient pas celles qui
 * sortaient. Les largeurs sont donc déclarées une fois, sur les `col`.
 *
 * ⚠️ Tous les séparateurs de milliers et tous les espaces devant € et % sont
 * des espaces fines insécables (U+202F), comme dans plan-concubins-pacs.tsx :
 * sur une feuille annotée au stylo et relue des mois plus tard, un « 152 »
 * resté seul en fin de ligne n'est pas rattrapable.
 *
 * ⚠️ La colonne « son âge » n'est pas une politesse. Les deux parents ont
 * chacun leur abattement et chacun leur 70e anniversaire : dans un couple, il y
 * a deux calendriers superposés, et c'est celui du plus âgé qui commande
 * l'ordre des opérations. La feuille imprimée le dit maintenant, au lieu de le
 * garder dans le code.
 */

/** Le repère central : la règle des quinze ans, telle que l'article 784 l'écrit. */
const COMPTEUR: string[] = [
  "Chaque parent peut donner 100 000 € à chaque enfant sans droits (art. 779, I du CGI). Mais il n’existe pas un compteur unique qui repartirait quinze ans après votre premier don : l’article 784 du CGI fait additionner chaque donation antérieure « à l’exception de celles passées depuis plus de quinze ans ». Chaque donation a donc sa propre date de libération.",
  "Quinze ans jour pour jour, et non quinze années civiles : le délai court de la date de l’acte — ou du jour où un don manuel a été révélé à l’administration — pas du 1er janvier. Un don du 12 décembre 2010 sort du rappel le 12 décembre 2025, pas le 1er janvier 2025.",
  "Un exemple. Qui a donné 40 000 € en mars 2010, puis 60 000 € en mars 2018, ne retrouve pas 100 000 € libres en 2026 : il retrouve 40 000 € en mars 2025, et les 60 000 € de 2018 restent rappelés jusqu’en mars 2033. Ce qui dépasse est taxé dès le premier euro, au barème en ligne directe (art. 777 du CGI).",
  "Enfin, ces 100 000 € ne s’ajoutent pas à la succession : c’est le même abattement des deux côtés. Utilisé par une donation faite moins de quinze ans avant le décès, il ne se représente pas au moment de la succession (art. 779 et 784 du CGI). Donner tôt, c’est parier sur quinze années de vie.",
];

/** Ce que « déclaré » veut dire — le mot dont dépend toute la feuille 2. */
const DECLARE =
  "Déclaré, cela veut dire : passé devant notaire, ou signalé à l’administration par un formulaire. Un chèque remis sans rien signer n’a pas de date officielle, et un don manuel ne fait courir le délai de quinze ans qu’à partir du jour où il est révélé (art. 784 et 635 A du CGI). Demandez à votre notaire quelle date retenir avant de remplir le tableau ci-dessous : c’est la question n° 8 des 12 questions à poser à votre notaire.";

/** Une ligne par donation, avec sa propre date de sortie du rappel. */
const COLONNES_DONATIONS: string[] = [
  "À qui, et quoi",
  "Faite le (jour, mois, année)",
  "Elle sort du rappel le (cette date + 15 ans)",
];

/** Le 70e anniversaire, assurance-vie. Descriptif : on n’écrit jamais « versez avant ». */
const SOIXANTE_DIX: string[] = [
  "Sur l’assurance-vie, c’est la date de chaque versement qui commande, pas celle du contrat. Ce qui provient de versements faits avant vos 70 ans laisse 152 500 € à chaque bénéficiaire sans droits, gains compris (art. 990 I du CGI).",
  "Après 70 ans, seule la fraction des primes versées qui dépasse 30 500 €, tous contrats et tous bénéficiaires confondus, entre dans la succession — les intérêts et les plus-values que ces primes produisent, eux, restent hors du calcul (art. 757 B du CGI). Cet anniversaire change l’assiette ; il ne ferme rien.",
  "Deux réserves fréquentes à votre âge. Le conjoint marié et le partenaire de PACS bénéficiaires ne paient rien, dans les deux régimes (art. 796-0 bis du CGI). Et les contrats les plus anciens relèvent de règles propres : l’art. 757 B ne vise que ceux souscrits depuis le 20 novembre 1991, l’art. 990 I que les primes versées depuis le 13 octobre 1998. À faire vérifier contrat par contrat.",
  "Si vos 70 ans sont déjà passés, ne cherchez pas de ligne dans le tableau de la feuille 5 : c’est déjà ce régime-là qui s’applique à vos versements. Écrivez la date ci-dessous quand même — dans un couple, c’est celle du plus âgé qui commande l’ordre des opérations.",
];

/** Les deux abattements que le calendrier oublie toujours. */
const DEUX_COMPTEURS: string[] = [
  "En donation seulement, chaque grand-parent peut donner 31 865 € à chaque petit-enfant (art. 790 B du CGI). Cet abattement n’existe pas à la succession : le petit-enfant qui ne vient pas à la place de son parent n’y a que 1 594 € (art. 788, IV du CGI). Il se reconstitue lui aussi quinze ans après chaque donation (art. 784 du CGI).",
  "S’y ajoute le don familial de somme d’argent : 31 865 €, tant que vous avez moins de 80 ans, à un enfant, un petit-enfant ou un arrière-petit-enfant majeur — et, à défaut d’une telle descendance, à un neveu ou une nièce (art. 790 G du CGI, qui prévoit son renouvellement tous les quinze ans). Il doit porter sur de l’argent — chèque, virement, mandat ou espèces — et être déclaré dans le mois, formulaire 2735 (art. 635 A du CGI). Sans cette déclaration, aucune exonération, et le délai de quinze ans ne commence même pas à courir.",
];

/** Le 71e anniversaire : la nue-propriété, définie avant d’être chiffrée. */
const SOIXANTE_ET_ONZE =
  "L’usufruit, c’est le droit de se servir d’un bien qui appartient à un autre et d’en percevoir les revenus, à charge d’en conserver la substance (art. 578 du code civil) ; il s’éteint à la mort de l’usufruitier (art. 617 du code civil). Donner la nue-propriété, c’est donner le bien en gardant cet usage jusqu’à la fin. La part donnée est alors comptée selon votre âge au jour de la donation, et le barème ne s’arrête pas à 70 %.";

/**
 * Le barème de l’usufruit viager en entier (art. 669, I du CGI). Les tranches
 * sont écrites en âges pleins parce que c’est ce qu’un lecteur cherche sur une
 * feuille ; la formulation de la loi — « moins de 71 ans révolus » — est
 * rappelée juste sous le tableau, pour qu’on la reconnaisse chez le notaire.
 */
const BAREME_669: { age: string; part: string }[] = [
  { age: "Moins de 61 ans", part: "50 %" },
  { age: "De 61 à 70 ans", part: "60 %" },
  { age: "De 71 à 80 ans", part: "70 %" },
  { age: "De 81 à 90 ans", part: "80 %" },
  { age: "91 ans et plus", part: "90 %" },
];

const APRES_BAREME =
  "La loi écrit ces tranches « moins de 71 ans révolus », « moins de 81 ans révolus » : c’est la même chose que jusqu’à 70 ans inclus, jusqu’à 80 ans inclus. Ce barème ne vaut que pour l’usufruit viager, celui qui dure jusqu’à la mort ; un usufruit consenti pour une durée fixe suit un tout autre calcul, 23 % de la valeur du bien par période de dix ans (art. 669, II du CGI). Si votre 71e anniversaire est derrière vous, ne cherchez pas de ligne dans le tableau de la feuille 5 : lisez la ligne du barème qui correspond à votre âge d’aujourd’hui.";

/**
 * Les seules cases pré-remplies du calendrier : les deux bornes de la grille
 * elle-même. Elles ne prétendent plus rien sur le compteur des 15 ans, qui ne
 * part pas de la ligne 1 mais de la date de chaque donation.
 */
const NOTES_PRE_REMPLIES: Record<number, string> = {
  1: "L’année en cours",
  15: "Quatorze ans plus tard",
};

const LIGNES: number[] = Array.from({ length: 15 }, (_, i) => i + 1);

export function Calendrier15Ans() {
  return (
    <>
      <Feuille
        titre="Le calendrier de transmission sur 15 ans (feuille 1 sur 5)"
        sousTitre="La règle des quinze ans : il y a un délai par donation, pas un compteur par famille."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Champ label="Établi par" />
          <Champ label="Le" />
        </div>

        <div className="eviter-coupure">
          <Encadre titre="UN DÉLAI PAR DONATION, PAS UN COMPTEUR DE FAMILLE">
            <div className="space-y-2">
              {COMPTEUR.map((p) => (
                <p key={p} className="text-[0.93rem]">
                  {p}
                </p>
              ))}
            </div>
          </Encadre>
        </div>

        <p className="eviter-coupure text-[0.9rem]">
          Les montants et les barèmes de ces cinq feuilles sont ceux en vigueur à la date de
          production de cette méthode. La législation évolue : vérifiez-les sur impots.gouv.fr avant
          toute décision, et faites relire votre projet par votre notaire. Ce calendrier est fait
          pour rester au mur quinze ans — re-datez la ligne ci-dessous à chaque relecture.
        </p>
        <Champ label="Chiffres vérifiés le" indice="et à revérifier à chaque relecture" />

        <Source>
          Abattement de 100 000 € par parent et par enfant : art. 779, I du CGI. Rappel des
          donations de moins de quinze ans, donation par donation : art. 784 du CGI. Barème en ligne
          directe : art. 777 du CGI.
        </Source>
      </Feuille>

      <Feuille
        titre="Mes donations déjà faites (feuille 2 sur 5)"
        sousTitre="Une ligne par donation, et sa propre date de sortie du rappel. À remplir au crayon."
      >
        <div className="eviter-coupure">
          <Encadre titre="CE QUE « DÉCLARÉ » VEUT DIRE">
            <p className="text-[0.93rem]">{DECLARE}</p>
          </Encadre>
        </div>

        <Titre>Une ligne par donation</Titre>
        <p className="text-[0.93rem]">
          Reportez chaque donation déjà faite, la plus ancienne d&apos;abord. Colonne 3 : la même
          date, quinze ans plus tard, jour pour jour. Tant que cette date n&apos;est pas passée, la
          donation est recomptée et l&apos;abattement correspondant reste consommé.
        </p>
        <div className="eviter-coupure">
          <TableauVierge colonnes={COLONNES_DONATIONS} lignes={6} />
        </div>
        <p className="text-[0.93rem]">
          Reportez ensuite chaque date de la colonne 3 sur la ligne correspondante du calendrier, en
          feuille 5. Si aucune donation n&apos;a été faite, écrivez « aucune » sur la première ligne
          : c&apos;est une information, pas un blanc.
        </p>

        <Source>
          Rappel des donations antérieures, à l&apos;exception de celles passées depuis plus de
          quinze ans : art. 784 du CGI. Déclaration des dons manuels et des dons familiaux,
          formulaire 2735 : art. 635 A du CGI.
        </Source>
      </Feuille>

      <Feuille
        titre="Le 70e anniversaire (feuille 3 sur 5)"
        sousTitre="Assurance-vie : c'est la date de chaque versement qui commande, pas celle du contrat."
      >
        <div className="eviter-coupure">
          <Encadre titre="CE QUE CHANGE LE 70e ANNIVERSAIRE">
            <div className="space-y-2">
              {SOIXANTE_DIX.map((p) => (
                <p key={p} className="text-[0.93rem]">
                  {p}
                </p>
              ))}
            </div>
          </Encadre>
        </div>

        <div className="eviter-coupure grid gap-2 sm:grid-cols-2">
          <Champ label="Mes 70 ans, c'est le" indice="jour, mois, année" />
          <Champ label="Ceux de mon conjoint, le" />
        </div>

        <div className="eviter-coupure">
          <Encadre titre="LES DEUX COMPTEURS QU’ON OUBLIE">
            <div className="space-y-2">
              {DEUX_COMPTEURS.map((p) => (
                <p key={p} className="text-[0.93rem]">
                  {p}
                </p>
              ))}
              <p className="text-[0.93rem]">
                Ajoutez-les dans la colonne « ce que je fais » du calendrier, en feuille 5.
              </p>
            </div>
          </Encadre>
        </div>

        <Source>
          Assurance-vie : art. 990 I du CGI pour les primes versées avant 70 ans, art. 757 B pour la
          fraction des primes versées après 70 ans qui excède 30 500 €. Conjoint et partenaire de
          PACS bénéficiaires, exonérés dans les deux régimes : art. 796-0 bis. Petit-enfant en
          donation : art. 790 B ; au décès : art. 788, IV. Don familial de somme d&apos;argent :
          art. 790 G. Déclaration dans le mois : art. 635 A. Rechargement : art. 784.
        </Source>
      </Feuille>

      <Feuille
        titre="Le 71e anniversaire (feuille 4 sur 5)"
        sousTitre="La nue-propriété, et le barème de l'article 669 en entier — il ne s'arrête pas à 70 %."
      >
        <div className="eviter-coupure">
          <Encadre titre="DONNER LE BIEN, EN GARDER L’USAGE">
            <p className="text-[0.93rem]">{SOIXANTE_ET_ONZE}</p>
          </Encadre>
        </div>

        <Titre>Le barème de l&apos;usufruit viager</Titre>
        <div className="eviter-coupure overflow-x-auto">
          <table className="w-full min-w-[16rem] border-collapse text-left text-[0.92rem]">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  Mon âge le jour de la donation
                </th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  La nue-propriété donnée est comptée à
                </th>
              </tr>
            </thead>
            <tbody>
              {BAREME_669.map((b) => (
                <tr key={b.age}>
                  <td className="h-[36px] border border-black px-2 py-1.5">{b.age}</td>
                  <td className="h-[36px] border border-black px-2 py-1.5">{b.part}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="eviter-coupure text-[0.93rem]">{APRES_BAREME}</p>

        <div className="eviter-coupure grid gap-2 sm:grid-cols-2">
          <Champ label="Mes 71 ans, c'est le" indice="jour, mois, année" />
          <Champ label="Ceux de mon conjoint, le" />
        </div>

        <Source>
          Définition de l&apos;usufruit : art. 578 du code civil ; extinction à la mort de
          l&apos;usufruitier : art. 617 du code civil. Barème de l&apos;usufruit viager : art. 669,
          I du CGI. Usufruit à durée fixe : art. 669, II du CGI.
        </Source>
      </Feuille>

      <Feuille
        titre="Mes quinze années (feuille 5 sur 5)"
        sousTitre="Le calendrier lui-même : c'est cette feuille-ci qu'on affiche. Au crayon, pas au stylo — une année se décale, un enfant déménage, un bien se vend : vous corrigerez sans refaire la feuille."
      >
        <div className="eviter-coupure overflow-x-auto">
          <table className="w-full min-w-[16rem] table-fixed border-collapse text-left text-[0.92rem]">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[9%]" />
              <col className="w-[9%]" />
              <col className="w-[27%]" />
              <col className="w-[31%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  Année (à écrire)
                </th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">Mon âge</th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">Son âge</th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  Ce qui tombe cette année-là
                </th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">
                  Ce que je fais
                </th>
                <th className="border border-black px-2 py-1.5 align-bottom font-bold">Fait</th>
              </tr>
            </thead>
            <tbody>
              {LIGNES.map((n) => (
                <tr key={n}>
                  <td className="h-[36px] border border-black px-2 py-1.5 align-middle">
                    <strong>{n}</strong>
                  </td>
                  <td className="h-[36px] border border-black px-2 py-1.5" />
                  <td className="h-[36px] border border-black px-2 py-1.5" />
                  <td className="h-[36px] border border-black px-2 py-1.5">
                    {NOTES_PRE_REMPLIES[n] ?? ""}
                  </td>
                  <td className="h-[36px] border border-black px-2 py-1.5" />
                  <td className="h-[36px] border border-black px-2 py-1.5 text-center align-middle">
                    <span
                      aria-hidden
                      className="mx-auto block h-[18px] w-[18px] border border-black"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="eviter-coupure grid gap-2 sm:grid-cols-3">
          <Champ label="Feuille remplie le" />
          <Champ label="par" />
          <Champ label="Dernière mise à jour le" />
        </div>

        <Source>
          Les articles qui portent les chiffres de ce calendrier sont cités sur les feuilles 1 à 4.
          Ce calendrier n&apos;a aucune valeur juridique : chaque ligne cochée correspond à un acte
          à faire relire par votre notaire.
        </Source>
      </Feuille>
    </>
  );
}
