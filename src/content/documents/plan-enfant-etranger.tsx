import { Case, Champ, Encadre, Feuille, Source, Titre } from "@/components/documents/Feuille";

/**
 * SITUATION 9 — UN ENFANT À L'ÉTRANGER (plan-type du Plan familial, upsell 1).
 *
 * ⚠️ POURQUOI CE PLAN NE COMMENCE PAS PAR LE COMPTEUR DES 15 ANS. Dans presque
 * toutes les autres situations, le compteur passe en premier parce que c'est
 * lui qui rapporte le plus. Ici, ce qui coûte le plus cher n'est pas l'impôt :
 * c'est le blocage. Un héritier à 8 000 km, c'est une signature qu'on attend
 * six semaines, un logement invendable et une déclaration hors délai. On
 * ouvre donc par le levier qui ne demande ni procuration, ni partage, ni
 * notaire — l'assurance-vie, dont la date tombe au 70e anniversaire.
 *
 * ⚠️ POURQUOI LA VRAIE VICTIME N'EST PAS L'ENFANT PARTI. Les cohéritiers sont
 * solidaires des droits (art. 1709 du CGI) : c'est l'enfant resté en France
 * qu'on relance, qui avance l'argent, et qui finit par en vouloir à son frère.
 * Le document le dit, parce que personne ne le dit à cette famille. Il écrit
 * l'effet et pas le mot : « solidaires » ne dit rien à personne, « on peut lui
 * réclamer à lui seul la totalité des droits » se comprend du premier coup.
 *
 * ⚠️ POURQUOI LES DEUX ENFANTS SONT BÉNÉFICIAIRES DU CONTRAT DANS L'EXEMPLE.
 * La version précédente attribuait les 152 500 € au seul enfant parti : elle
 * lui donnait 152 500 € de plus qu'à son frère — un quart du patrimoine — dans
 * la feuille même qui explique que la victime est le frère resté ici.
 * L'abattement de l'article 990 I est PAR bénéficiaire : désigner les deux
 * supprime le déséquilibre sans rien coûter, garde de la marge si le contrat
 * progresse, et réduit la prise de l'article L. 132-13 al. 2 du code des
 * assurances (primes manifestement exagérées), qui est justement l'arme de
 * l'enfant lésé.
 *
 * ⚠️ LE §6 EST DESCRIPTIF, JAMAIS PRESCRIPTIF. Il ne dit pas de verser
 * 152 500 € : il part d'un contrat DÉJÀ alimenté avant 70 ans et montre ce que
 * l'article 990 I produit dessus. Écrire un montant à placer à un lecteur
 * identifié par sa situation serait une recommandation personnalisée sur un
 * produit d'assurance (art. L. 511-1 du code des assurances) — et la clause de
 * style qui la nie trois lignes plus bas aggraverait le risque au lieu de le
 * couvrir. L'abattement porte d'ailleurs sur le capital versé AU DÉCÈS, primes
 * et intérêts confondus, pas sur ce qu'on verse aujourd'hui : annoncer « 0 € »
 * sur des primes serait faux dès que le contrat progresse.
 *
 * ⚠️ CE QUE LE CONTRAT APPORTE ICI N'EST PAS FISCAL. Le §6 a longtemps compté
 * les 152 500 € du contrat DANS la succession de l'encadré « avant », puis les
 * en sortait « après », et s'attribuait ainsi 30 504 € de gain — soit
 * 152 500 × 20 %, un impôt fictif sur un capital qui n'a jamais été dans la
 * succession. Le document se contredisait lui-même : sa 1re date écrit que ce
 * capital est hors succession (art. L. 132-12 du code des assurances) et déjà
 * sous l'abattement de l'article 990 I. Un contrat de 152 500 € est à 0 € de
 * prélèvement AVANT le plan, même avec un seul bénéficiaire. L'écart réel du
 * plan est de 12 746 €, et il vient en entier du don de somme d'argent
 * (63 730 × 20 %). L'apport du contrat est de trésorerie et de canal —
 * l'assureur verse directement, hors indivision, sans attendre de signature —
 * ce que le reste de la feuille dit très bien. C'est cela qu'on vend ici, pas
 * une économie d'impôt qui n'existe pas.
 *
 * ⚠️ LA PRÉMISSE DU §6 EST ÉCRITE, ELLE N'EST PLUS SOUS-ENTENDUE. Le chiffrage
 * suppose une clause bénéficiaire valable qui nomme quelqu'un. Un contrat sans
 * clause, ou dont la clause désigne « mes héritiers », retombe dans la
 * succession (art. L. 132-11 du code des assurances) : le point de départ du
 * lecteur est alors tout autre, et il doit pouvoir s'en apercevoir avant de
 * recopier nos chiffres au §7.
 *
 * ⚠️ CONVENTION D'ARRONDI : centimes dans le détail des tranches, arrondi à
 * l'euro sur le total de chaque part (art. 1724 du CGI), puis addition des
 * parts arrondies — comme simulateur-papier, plan-veuf-veuve,
 * plan-marie-1-enfant et plan-enfant-vulnerable. En revanche, cette feuille et
 * plan-enfant-vulnerable N'AFFICHENT PAS les mêmes nombres, et c'est normal :
 * le patrimoine de 600 000 € n'y est pas composé pareil. Là-bas, aucun contrat
 * d'assurance-vie, donc 300 000 € par enfant et 200 000 € taxés. Ici,
 * 152 500 € sont hors succession, donc 223 750 € par enfant et 123 750 €
 * taxés. Vouloir « le même nombre dans les deux feuilles » est ce qui a fait
 * recopier 38 194 € là où il ne s'applique pas.
 *
 * ⚠️ TOUS LES SÉPARATEURS DE MILLIERS ET TOUTES LES ESPACES DEVANT € ET % SONT
 * DES ESPACES FINES INSÉCABLES (U+202F), comme dans plan-concubins-pacs. En
 * JSX, un retour à la ligne se réduit à une espace sécable : prettier avait
 * coupé « 152 / 500 € » et « 31 / 865 € » dans la source, et le moteur
 * d'impression pouvait couper au même endroit. Sur une feuille imprimée,
 * annotée au stylo et relue des mois plus tard, un « 31 » resté seul en fin de
 * ligne n'est pas rattrapable.
 *
 * ⚠️ AUCUN CONTRAT, AUCUN ASSUREUR, AUCUNE BANQUE N'EST NOMMÉ, et aucun pays
 * n'est traité en particulier : la France n'a de convention sur les
 * successions qu'avec une partie des pays, chacune a ses règles, et une liste
 * imprimée serait fausse le jour d'un avenant. On fait poser la question.
 */

const DATES: { rang: string; date: string; pourquoi: string }[] = [
  {
    rang: "1re",
    date: "Le 70e anniversaire",
    pourquoi:
      "C’est le canal le plus direct : l’assureur verse au bénéficiaire sans passer par le notaire ni par l’indivision — cette période où le bien appartient à tous les héritiers ensemble et où aucun d’eux ne peut décider seul —, et ce capital ne fait pas partie de la succession (art. L. 132-12 du code des assurances). L’assureur, lui, aura ses propres exigences de pièces pour un bénéficiaire qui réside à l’étranger : demandez-les-lui par écrit. Les sommes issues des versements faits avant vos 70 ans laissent 152 500 € à chaque bénéficiaire (art. 990 I du CGI) — l’abattement porte sur ce qu’il touche au décès, primes et intérêts confondus, pas sur ce que vous versez aujourd’hui ; au-delà, la part taxable de chaque bénéficiaire subit 20 %, puis 31,25 % au-dessus de 700 000 €. Après 70 ans, seules les sommes versées se comparent à un abattement de 30 500 €, tous contrats et tous bénéficiaires confondus — les intérêts qu’elles produisent restent hors du calcul (art. 757 B du CGI). Tout ceci vaut en France : le pays où vit votre bénéficiaire peut, lui, taxer ce qu’il reçoit — voir l’encadré de la fin.",
  },
  {
    rang: "2e",
    date: "Le compteur des 15 ans",
    pourquoi:
      "Un virement et une déclaration se font à distance, sans acte notarié. 100 000 € par parent et par enfant (art. 779 du CGI) ; chaque donation déclarée cesse d’être recomptée quinze ans après sa propre date (art. 784 du CGI) — notez donc la date de chacune, il y a une ligne pour cela juste en dessous. S’y ajoute 31 865 € de don de somme d’argent tant que vous avez moins de 80 ans (art. 790 G du CGI). Mais vérifiez d’abord ce que le pays de votre enfant fait payer sur ce qu’il reçoit.",
  },
  {
    rang: "3e",
    date: "Le 71e anniversaire",
    pourquoi:
      "La nue-propriété — la propriété sans le droit d’habiter ni de louer — est comptée à 60 % de la valeur du bien avant 71 ans, 70 % après (art. 669 du CGI). Excellent levier, mais donner des murs à quelqu’un qui vit à 8 000 km, c’est vingt ans de décisions à prendre par procuration. On le réserve à l’enfant resté en France, et on remplit l’autre en argent — par une donation-partage. C’est un acte notarié (art. 931 du code civil) : il faudra la signature de l’enfant à l’étranger, ou sa procuration. À organiser des mois à l’avance.",
  },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "1. Le logement en indivision, à 8 000 km",
    texte:
      "Chacun peut à tout moment provoquer le partage (art. 815 du code civil) ; mais tant qu’il n’est pas fait, aucun indivisaire ne décide seul, et vendre suppose l’accord de tous (art. 815-3). Un enfant qui met trois semaines à répondre à chaque courrier, sans mauvaise volonté, fait durer une vente plus d’un an — ajoutez la légalisation ou l’apostille, un tampon officiel qui rend sa signature valable en France, et la traduction par un traducteur agréé par un tribunal. Il existe une issue judiciaire : le tribunal peut autoriser la vente à la demande d’indivisaires détenant au moins deux tiers des droits (art. 815-5-1). Elle coûte du temps et de la procédure.",
  },
  {
    titre: "2. Croire qu’on ne paie l’impôt qu’une fois",
    texte:
      "L’impôt payé à l’étranger ne s’impute sur l’impôt français que pour les biens situés hors de France (art. 784 A du CGI). Si tout votre patrimoine est en France et que le pays de votre enfant taxe ce qu’il reçoit, il risque de payer deux fois — sur une donation comme sur une succession, et aussi bien sur un capital d’assurance-vie — sauf si une convention le prévoit, ou si le droit interne de son pays lui accorde de lui-même un crédit d’impôt. Question à poser sur place.",
  },
  {
    titre: "3. Le délai qui court, et celui qui reste",
    texte:
      "La déclaration de succession est due dans les six mois si le décès survient en France métropolitaine, un an dans tous les autres cas (art. 641 du CGI ; délais particuliers outre-mer, art. 642, et en Corse, art. 641 bis). Au-delà : intérêt de retard de 0,20 % par mois (art. 1727) et majoration (art. 1728). Ce compte à rebours court pour les deux enfants à la fois, et c’est celui qui est resté ici qui le subit.",
  },
];

/**
 * Les questions à poser au notaire.
 *
 * ⚠️ Chacune est fermée et appelle une réponse que le notaire peut donner en
 * une phrase — c'est la règle du document « Les 12 questions ». Celle de la
 * procuration était à quatre étages (forme, légalisation, apostille,
 * traduction, signature à distance) avec une seule ligne pour répondre : elle
 * est coupée en deux, parce que « ce qu'il exige » et « accepte-t-il qu'il
 * signe de là-bas » sont deux réponses différentes, et que la seconde décide à
 * elle seule du calendrier. Elles passent donc de trois à quatre, et le titre
 * du §5 le dit.
 *
 * `lignes` vaut 2 quand la réponse comporte plusieurs éléments : deux lignes de
 * stylo, pas une. Les deux classes sont écrites en toutes lettres, sinon
 * Tailwind ne les génère pas.
 */
const QUESTIONS: { texte: string; lignes: 1 | 2 }[] = [
  {
    texte:
      "La France a-t-elle une convention fiscale sur les successions avec le pays où vit mon enfant ? Si oui, lequel des deux États impose ce qu’il recevra, et sur quels biens ?",
    lignes: 2,
  },
  {
    texte:
      "Quelle forme de procuration exigez-vous d’un héritier qui réside dans ce pays : légalisation, apostille, traduction assermentée ?",
    lignes: 2,
  },
  { texte: "Acceptez-vous qu’il signe à distance, sans se déplacer en France ?", lignes: 1 },
  {
    texte:
      "Si j’attribue le logement à l’enfant resté en France et de l’argent à l’autre, une donation-partage fige-t-elle les valeurs au jour de l’acte dans notre cas (art. 1078 du code civil) ?",
    lignes: 2,
  },
];

export function PlanEnfantEtranger() {
  return (
    <Feuille
      titre="Situation 9 — Un enfant à l’étranger"
      sousTitre="Le plan-type de votre situation. Remplissez-le au stylo, emportez-le chez le notaire."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="space-y-1">
        <Case>
          Au moins un de vos enfants vit et paie ses impôts hors de France, et son retour n&apos;est
          pas certain.
        </Case>
        <Case>
          Vous êtes domicilié en France, et l&apos;essentiel de ce que vous laisserez y est situé —
          le logement surtout.
        </Case>
        <Case>
          C&apos;est un enfant resté en France qui s&apos;occupera du notaire, de la banque et des
          papiers. Il le sait, ou il l&apos;ignore encore.
        </Case>
      </ul>
      <Champ label="Le pays où vit mon enfant" indice="et depuis quelle année" />

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      <p>
        Vos biens sont en France, vous y êtes domicilié : tout est taxé en France, quel que soit le
        pays où vivent vos enfants. Celui qui est parti reçoit une part du logement et une note de
        droits à payer dans les six mois. S&apos;il n&apos;a pas les liquidités, le paiement
        fractionné ou différé des droits existe et se demande au moment de la déclaration — sinon il
        faut vendre, ce que son frère resté ici ne peut pas faire sans sa signature. Pendant ce
        temps, c&apos;est ce frère que l&apos;administration relance : les cohéritiers répondent
        solidairement des droits, ce qui veut dire qu&apos;elle peut réclamer à lui seul la totalité
        des droits — les siens et ceux de son frère — quitte à ce qu&apos;il se fasse rembourser
        ensuite.
      </p>
      <Source>
        Ce qui est taxé en France : art. 750 ter du Code général des impôts (CGI). Délai de
        déclaration : art. 641. Solidarité des cohéritiers : art. 1709. Paiement fractionné ou
        différé : art. 1717 du CGI et articles 396 et suivants de l&apos;annexe III. Indivision :
        art. 815 et 815-3 du code civil.
      </Source>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      <p className="text-[0.95rem]">
        Dans la plupart des familles, le compteur des 15 ans passe en premier. Pas ici : ce qui vous
        coûtera le plus cher n&apos;est pas l&apos;impôt, c&apos;est le blocage. On commence donc
        par le levier qui ne demande ni signature à distance, ni partage.
      </p>
      <div className="space-y-2">
        {DATES.map((d) => (
          /* Chaque date reste d'un seul tenant : coupée en deux par un saut de
             page, elle perd l'article qui la porte — et c'est l'article que le
             notaire lira. Sans `eviter-coupure`, le moteur d'impression
             fragmente où il veut, la feuille faisant plus d'une page. */
          <div key={d.date} className="eviter-coupure">
            <Encadre titre={`${d.rang} — ${d.date}`}>
              <p className="text-[0.93rem]">{d.pourquoi}</p>
            </Encadre>
          </div>
        ))}
      </div>
      {/* La cible du produit a 65 à 85 ans : une bonne moitié des lecteurs de
          cette feuille ont dépassé la 1re date, qui est pourtant la colonne
          vertébrale du plan. Sans cet encadré, on leur annonce ce qu'ils ont
          perdu et on les laisse là. */}
      <div className="eviter-coupure">
        <Encadre titre="SI VOUS AVEZ DÉJÀ PASSÉ 70 ANS">
          <p className="text-[0.93rem]">
            L&apos;abattement de 152 500 € n&apos;est plus ouvert pour vos nouveaux versements :
            après 70 ans, seules les sommes versées se comparent à un abattement de 30 500 €, tous
            contrats et tous bénéficiaires confondus — les intérêts qu&apos;elles produisent restent
            hors du calcul (art. 757 B du CGI). Le contrat garde pourtant ce que rien d&apos;autre
            n&apos;offre à un enfant à l&apos;étranger : l&apos;assureur verse directement au
            bénéficiaire, hors succession, sans passer par le notaire ni par l&apos;indivision (art.
            L. 132-12 du code des assurances) — l&apos;assureur, lui, aura ses propres exigences de
            pièces pour un bénéficiaire qui réside à l&apos;étranger, demandez-les-lui par écrit.
            Vos 2e et 3e dates deviennent alors prioritaires — commencez par le don de somme
            d&apos;argent.
          </p>
        </Encadre>
      </div>
      {/* Le §3 demandait au lecteur de trancher sa 1re date sans lui donner où
          l'écrire, et la 2e date lui disait « notez la date de chacune » sans
          ligne pour le faire. Un champ par fait : deux dates sur un trait de
          44 px, écrites à la main, ne rentrent pas. */}
      <Champ label="Mon 70e anniversaire" indice="passé ou à venir — écrivez la date" />
      <Champ label="Mon 71e anniversaire tombe le" indice="jour, mois, année" />
      <Champ label="J’aurai 80 ans le" indice="dernier jour pour le don de 31 865 €" />
      <Champ label="Ma dernière donation déclarée" indice="ou « jamais »" />
      <Champ label="Mon compteur recharge le" indice="cette date + 15 ans" />
      <Source>
        Compteur des 15 ans : art. 779 et 784 du CGI. 70e anniversaire : art. 990 I et 757 B du CGI.
        71e anniversaire : art. 669 du CGI.
      </Source>

      <Titre>4. Les 3 pièges de cette situation</Titre>
      <div className="space-y-2">
        {PIEGES.map((p) => (
          <div key={p.titre} className="eviter-coupure">
            <Encadre titre={p.titre}>
              <p className="text-[0.93rem]">{p.texte}</p>
            </Encadre>
          </div>
        ))}
      </div>

      <Titre>5. Les 4 questions à poser à votre notaire</Titre>
      {/* Bloc repris tel quel des « 12 questions à poser à votre notaire » :
          case de 18 px, ligne de réponse indentée dessous. Sans la case, le
          lecteur n'a aucun moyen de suivre où il en est pendant le rendez-vous
          — c'est pourtant l'usage annoncé sur l'autre feuille. */}
      <ol className="eviter-coupure divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          <li key={q.texte} className="py-2">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
              />
              <p>
                <strong>{i + 1}.</strong> {q.texte}
              </p>
            </div>
            <div
              className={`ml-[30px] mt-1 border-b border-black ${
                q.lignes === 2 ? "min-h-[72px]" : "min-h-[36px]"
              }`}
            />
          </li>
        ))}
      </ol>

      <Titre>6. Ce que ça change, en euros</Titre>
      {/* Une bonne moitié de la cible a plus de 70 ans : sans cette ligne, le §6
          s'ouvre sur un geste qui leur est fermé et « Mon cas » leur demande
          quand même un chiffre qu'ils n'ont aucun moyen de calculer. */}
      <p className="text-[0.95rem]">
        Si vous avez déjà passé 70 ans, sautez le premier geste et reprenez le calcul à partir du
        don de somme d&apos;argent — voir l&apos;encadré du point 3.
      </p>
      <p className="text-[0.95rem]">
        Vous avez 68 ans, veuf, veuve ou seul(e), deux enfants — un en France, un à l&apos;étranger.
        Vous laissez 600 000 € : un logement de 350 000 € et 250 000 € d&apos;épargne, dont
        152 500 € déjà placés sur un contrat d&apos;assurance-vie alimenté avant vos 70 ans, dont la
        clause nomme un bénéficiaire. Si vous êtes marié, les montants ne sont pas les mêmes —
        reportez-vous à la situation qui correspond à votre famille. L&apos;illustration suppose des
        valeurs constantes jusqu&apos;au décès : dans la réalité, le logement et le contrat bougent,
        et c&apos;est le montant transmis ce jour-là qui compte. Détail des tranches au centime,
        totaux arrondis à l&apos;euro.
      </p>
      <div className="eviter-coupure">
        <Encadre titre="AUJOURD’HUI, SANS RIEN FAIRE">
          <div className="space-y-1 text-[0.93rem]">
            {/* La prémisse était sous-entendue, et c'est ce qui avait fait
                compter le contrat dans la succession : un lecteur dont la clause
                nomme déjà quelqu'un lisait un « avant » qui n'était pas le sien. */}
            <p>
              Le contrat étant alimenté avant vos 70 ans et sa clause nommant un bénéficiaire, ses
              152 500 € ne font pas partie de la succession (art. L. 132-12 du code des assurances)
              et restent sous l&apos;abattement de 152 500 € par bénéficiaire (art. 990 I du CGI) :
              0 € de prélèvement en France, avant ce plan comme après. Si votre clause est absente
              ou désigne « mes héritiers », le capital retombe au contraire dans la succession et se
              partage comme le reste (art. L. 132-11 du code des assurances) : votre point de départ
              est alors différent, et c&apos;est le premier chiffre à vérifier.
            </p>
            <p>
              La succession porte donc 350 000 + 97 500 = 447 500 €. Part de chaque enfant :
              223 750 €. Abattement 100 000 € (art. 779) → 123 750 € taxés.
            </p>
            {/* Une tranche par ligne : sur du jet d'encre, le point médian qui
                les séparait était presque invisible et les trois calculs se
                lisaient comme une seule bouillie de chiffres. */}
            <p>
              8 072 € à 5 % = 403,60 €
              <br />
              4 037 € à 10 % = 403,70 €
              <br />
              3 823 € à 15 % = 573,45 €
              <br />
              107 818 € à 20 % = 21 563,60 €
              <br />→ 22 944,35 €, soit 22 944 € arrondis (art. 1724).
            </p>
            <p>
              <strong>22 944 € par enfant, soit 45 888 € pour les deux.</strong> La succession
              contient 97 500 € d&apos;épargne, soit 48 750 € chacun : de quoi payer ces droits.
              Mais la moitié du logement reste en indivision avec quelqu&apos;un à 8 000 km — et si
              la clause du contrat ne nomme qu&apos;un seul enfant, l&apos;autre reçoit 152 500 € de
              moins que lui.
            </p>
          </div>
        </Encadre>
      </div>
      {/* « ORDRE DE PRIORITÉ », et non « ordre des dates » : pour quelqu'un qui a
          68 ans, « cette année » vient AVANT « avant vos 70 ans ». Le lecteur
          qui reportait ces gestes sur son calendrier les inscrivait à l'envers. */}
      <div className="eviter-coupure">
        <Encadre titre="APRÈS LE PLAN, DANS L’ORDRE DE PRIORITÉ">
          <div className="space-y-1 text-[0.93rem]">
            <p>
              <strong>Le contrat d&apos;assurance-vie — vos deux enfants bénéficiaires.</strong> Ce
              geste-là ne fait pas baisser l&apos;impôt d&apos;un euro : les 152 500 € étaient déjà
              hors succession et déjà sous l&apos;abattement. Ce qu&apos;il change est ailleurs, et
              c&apos;est ce qui manque le plus dans votre situation — l&apos;argent arrive
              directement de l&apos;assureur, sans passer par le notaire ni par l&apos;indivision,
              et il arrive à chacun des deux. L&apos;abattement de l&apos;article 990 I est par
              bénéficiaire : partagé entre deux, chacun reste largement en dessous même si le
              contrat progresse d&apos;ici là. Au-delà de 152 500 € par bénéficiaire,
              l&apos;excédent subit un prélèvement de 20 %, puis 31,25 % au-dessus de 700 000 € de
              part taxable par bénéficiaire (art. 990 I du CGI). Ce capital échappe aussi au rapport
              et à la réduction (art. L. 132-13 al. 1 du code des assurances) — il n&apos;est pas
              remis dans le pot commun au moment du partage —, sauf primes manifestement exagérées
              (art. L. 132-13 al. 2). Une clause qui ne nomme qu&apos;un seul enfant lui donne ce
              capital EN PLUS de sa part, l&apos;autre reçoit d&apos;autant moins — et le lésé peut
              la contester.
            </p>
            <p>
              <strong>Cette année — le don de somme d&apos;argent.</strong> 31 865 € à chaque enfant
              : 0 € (art. 790 G du CGI). Ce don n&apos;entame pas le compteur des 15 ans — il
              n&apos;est pas pris en compte pour l&apos;article 784 — et l&apos;exonération de
              31 865 € se renouvelle elle-même tous les quinze ans. Votre abattement de 100 000 €
              par enfant (art. 779) reste donc entier. C&apos;est votre enfant qui déclare, dans le
              mois — formulaire 2735, art. 635 A du CGI — au service des impôts dont il dépend :
              celui de son domicile, ou le service des non-résidents s&apos;il vit hors de France ;
              faites-le-lui confirmer avant l&apos;envoi. Sans cette déclaration dans le délai,
              l&apos;exonération de l&apos;article 790 G est perdue. Il doit être majeur, et vous
              devez avoir moins de 80 ans. Épargne restante : 250 000 − 152 500 − 63 730 = 33 770 €.
              Ce qui est donné est donné : ne descendez pas en dessous de ce dont vous avez besoin
              pour vivre et pour faire face à une perte d&apos;autonomie. Ce montant-là se décide
              avant, pas après.
            </p>
            <p>
              <strong>À la succession</strong> — 350 000 + 33 770 = 383 770 €. Part de chacun
              191 885 €, moins 100 000 € (art. 779) = 91 885 € taxés.
              <br />
              8 072 € à 5 % = 403,60 €
              <br />
              4 037 € à 10 % = 403,70 €
              <br />
              3 823 € à 15 % = 573,45 €
              <br />
              75 953 € à 20 % = 15 190,60 €
              <br />→ 16 571,35 €, soit{" "}
              <strong>16 571 € par enfant, et 33 142 € pour les deux</strong>.
            </p>
            <p>
              <strong>12 746 € de moins</strong> — soit exactement 63 730 € × 20 %, l&apos;effet du
              seul don de somme d&apos;argent. Le contrat, lui, ne change pas l&apos;impôt. Ce
              qu&apos;il apporte est ailleurs, et ça ne se chiffre pas en droits : chaque enfant
              touche sa part directement de l&apos;assureur, donc celui qui vit à l&apos;étranger
              paie ses droits sans qu&apos;on ait à vendre le logement, et sans attendre la
              signature de personne.
            </p>
          </div>
        </Encadre>
      </div>
      {/* Le §2 et le piège 1 posent l'indivision comme LE risque de cette
          situation. Le chiffrage ci-dessus n'y touche pas : le dire est plus
          honnête que laisser croire que le plan a tout réglé. */}
      <div className="eviter-coupure">
        <Encadre titre="CE QUE CE PLAN NE RÈGLE PAS">
          <p className="text-[0.93rem]">
            Le logement, lui, tombe entier dans la succession : 350 000 € en indivision entre vos
            deux enfants, dont un à 8 000 km. Ce plan traite l&apos;impôt et la trésorerie, pas
            l&apos;indivision. Elle se règle par un seul acte — la donation-partage de votre 3e
            date, qui attribue le logement à l&apos;enfant resté en France, et à l&apos;autre de
            l&apos;argent ou une soulte, c&apos;est-à-dire une somme versée par celui qui reçoit le
            logement à son frère pour rétablir l&apos;égalité. Elle n&apos;est pas chiffrée ici, et
            elle suppose la signature de l&apos;autre : c&apos;est la question 4 de votre liste.
          </p>
        </Encadre>
      </div>
      {/* Cette vérification conditionne TOUT le plan, y compris son levier n° 1 :
          le « 0 € » de l'assurance-vie n'est vrai qu'en France. En petit texte
          de fin, un lecteur de 78 ans la prend pour une mention légale et la
          saute : elle sort donc en encadré, et elle a sa case au §7. */}
      <div className="eviter-coupure">
        <Encadre titre="À VÉRIFIER AVANT DE DÉSIGNER OU DE VIRER QUOI QUE CE SOIT">
          <p className="text-[0.95rem]">
            Le pays où vit votre enfant taxe-t-il ce qu&apos;il reçoit ? L&apos;impôt payé là-bas ne
            s&apos;impute sur l&apos;impôt français que pour les biens situés hors de France (art.
            784 A du CGI). Cela vaut aussi pour le capital d&apos;assurance-vie, qui est le premier
            levier de ce plan : hors de France, ce capital peut être taxé chez votre bénéficiaire
            même s&apos;il ne coûte rien ici, et l&apos;art. 784 A n&apos;imputera rien, le contrat
            étant un bien situé en France. À faire vérifier sur place avant de désigner un
            bénéficiaire non-résident, et avant le premier virement : c&apos;est cette réponse qui
            décide si ce plan tient.
          </p>
        </Encadre>
      </div>
      <Source>
        Barème en ligne directe : art. 777 du CGI. Abattements : art. 779 et 790 G. Déclaration du
        don dans le mois, formulaire 2735 : art. 635 A. Rappel des donations : art. 784.
        Assurance-vie : art. 990 I du CGI, et art. L. 132-11, L. 132-12 et L. 132-13 du code des
        assurances. Les émoluments du notaire ne sont pas comptés ici : leur barème est réglementé
        et révisé par arrêté — demandez-lui le coût complet des actes.
      </Source>
      <p className="text-[0.9rem]">
        Cette méthode explique comment lire un contrat d&apos;assurance-vie, jamais lequel souscrire
        : aucun assureur, aucune banque, aucun placement n&apos;est recommandé ici, et aucun montant
        à verser n&apos;est indiqué.
      </p>

      {/* Sans ces lignes, le §6 reste l'exemple de quelqu'un d'autre : le lecteur
          de 74 ans qui a trois enfants et 400 000 € lit, hoche la tête, et ne
          calcule rien. Un bloc non numéroté entre le 6 et le 7 faisait croire,
          sur papier, à une page sautée : fusionné dans un point 7 numéroté,
          comme plan-enfant-vulnerable et plan-marie-2-enfants. */}
      <Titre>7. Mon cas, et ce que je décide</Titre>
      <Champ label="Ce que je laisserai" indice="chiffre du simulateur" />
      <Champ label="La part de chaque enfant" />
      {/* Deux montants à six chiffres ne rentrent pas sur une ligne de 44 px,
          écrits à la main : deux Champ, comme plan-en-1-page et
          plan-enfant-vulnerable pour ces deux mêmes chiffres. */}
      <Champ label="Ce qu’ils paieraient aujourd’hui" indice="chiffre du simulateur" />
      <Champ label="Ce qu’ils paieraient après ce plan" />
      <ul className="space-y-1">
        <Case>
          J&apos;ai fait vérifier si le pays de mon enfant taxe ce qu&apos;il reçoit — y compris le
          capital d&apos;assurance-vie — et s&apos;il existe une convention avec la France (art. 784
          A du CGI).
        </Case>
        <Case>
          J&apos;ai noté le pays de résidence de mon enfant, l&apos;année de son départ, et son
          numéro fiscal français s&apos;il en a un.
        </Case>
        <Case>
          J&apos;ai demandé par écrit à mon assureur ce qu&apos;il exige d&apos;un bénéficiaire qui
          réside dans ce pays.
        </Case>
        <Case>
          J&apos;ai relu ma clause bénéficiaire : si elle ne nomme qu&apos;un seul de mes enfants,
          il recevra ce capital en plus de sa part, et l&apos;autre recevra d&apos;autant moins.
        </Case>
        <Case>J&apos;ai posé les quatre questions ci-dessus au notaire et noté ses réponses.</Case>
        <Case>
          J&apos;ai dit à l&apos;enfant resté en France ce qui l&apos;attend, et il est
          d&apos;accord — y compris sur ce qu&apos;il recevra par rapport à son frère.
        </Case>
      </ul>
      {/* Une case cochée sans champ en face, c'est un stylo qui reste en l'air.
          Ces lignes sont exactement ce que les cases ci-dessus demandent de
          noter, et ce qu'il faudra retrouver dans le classeur six mois plus
          tard. */}
      <Champ label="Numéro fiscal français de mon enfant" indice="s’il en a un" />
      <Champ label="Mon contrat d’assurance-vie" indice="compagnie, numéro, où est le contrat" />
      <Champ label="Demande écrite envoyée à l’assureur le" />
      <Champ label="Décidé le" indice="signature" />
      <p className="text-[0.9rem]">
        Tout modèle d&apos;acte ou de clause issu de ce plan est à faire relire par votre notaire
        avant signature.
      </p>
    </Feuille>
  );
}
