import {
  Case,
  Champ,
  Encadre,
  Feuille,
  Source,
  TableauVierge,
  Titre,
} from "@/components/documents/Feuille";

/**
 * SITUATION 12 — DES DONATIONS DÉJÀ FAITES (plan-type, Le Plan familial).
 *
 * ⚠️ C'est la seule des douze situations où le lecteur arrive avec un passé.
 * Partout ailleurs on lui dit « voilà par quoi commencer » ; ici il a déjà
 * commencé, souvent sans le savoir, et la première chose à faire n'est pas de
 * donner mais de RETROUVER DES DATES. Au pluriel : c'est aussi la seule
 * situation où le lecteur en a, par définition, plusieurs.
 *
 * ⚠️ Chaque donation a SON propre compteur de 15 ans (art. 784 al. 2 CGI :
 * sont exclues du rappel « celles passées depuis plus de quinze ans »).
 * L'abattement se reconstitue donc par paliers, et il n'est entier que quinze
 * ans après la donation la PLUS RÉCENTE — jamais après la première. Écrire
 * l'inverse ferait signer un lecteur qui croit son compteur rechargé alors
 * qu'une donation récente est encore rappelée : c'est l'erreur la plus chère
 * que cette feuille puisse causer.
 *
 * ⚠️ « PLUS DE QUINZE ANS », PAS « QUINZE ANS ». Le jour anniversaire lui-même,
 * quinze ans sont écoulés, pas davantage : la donation est encore rappelée ce
 * jour-là. Toutes les bornes de cette feuille sont donc écrites « jusqu'au
 * [jour] inclus » / « à partir du lendemain », sans jour orphelin entre les
 * deux — c'est précisément le jour où le lecteur ira signer.
 *
 * ⚠️ Deux compteurs sont confondus par presque tout le monde, et c'est le cœur
 * du document : le compteur FISCAL (15 ans, art. 784 CGI, il s'éteint) et le
 * rapport CIVIL entre les enfants (qui, lui, ne connaît pas ce délai). Le
 * premier coûte de l'impôt, le second coûte une famille.
 *
 * ⚠️ ET LES DEUX RÈGLES CIVILES NE S'EXCLUENT PAS — c'était l'erreur de la
 * version précédente. TOUTES les donations, avancement de part compris, sont
 * réunies fictivement pour calculer la part réservée à chaque enfant (art.
 * 922). Ce que la mention de l'acte change, c'est le RAPPORT : dû si la
 * donation est en avancement de part (art. 843 et 860 — valeur au jour du
 * partage, d'après l'état du bien au jour du don), non dû si elle est hors part
 * successorale. Et cette mention hors part doit être EXPRESSE : dans une
 * donation-partage, à défaut, les lots s'imputent sur la part de réserve de
 * chaque enfant (art. 1077). Écrire l'inverse ferait classer au lecteur sa
 * propre donation-partage dans la mauvaise case.
 *
 * ⚠️ Aucun montant d'émoluments n'est écrit : le coût d'une donation-partage
 * incorporant des donations passées est une question au notaire, pas un chiffre
 * imprimé qui serait faux dans un an.
 *
 * ⚠️ L'exemple du point 8 est ancré sur des DATES, jamais sur une durée
 * (« dans trois ans ») ni sur l'année en cours : la feuille est imprimée,
 * rangée dans un classeur et relue des mois plus tard, parfois par un enfant.
 * Une durée chiffrée serait fausse dès le lendemain de l'impression. Et les
 * quatre lignes de tranches portent leurs centimes : elles sont additionnées au
 * stylo, un arrondi ligne à ligne décalerait le total d'un euro et jetterait le
 * doute sur tout le reste du calcul.
 *
 * ⚠️ Tous les séparateurs de milliers et tous les espaces devant € et % sont
 * des espaces fines insécables (U+202F), comme dans plan-concubins-pacs.tsx :
 * un « 100 » resté seul en fin de ligne imprimée n'est pas rattrapable.
 */

const DATES: { titre: string; texte: string }[] = [
  {
    titre: "1. Le compteur des 15 ans — mais il n’a pas démarré aujourd’hui",
    texte:
      "Il a démarré le jour de chacune de vos donations déclarées, et chacune a son propre compteur. Celui qui commande, pour redonner sans impôt, est celui de la plus récente. Vous êtes peut-être bien plus près du rechargement que vous ne le croyez : une signature déplacée de quelques mois peut valoir plusieurs milliers d’euros.",
  },
  {
    titre: "2. Le 70e anniversaire — il coupe vos contrats d’assurance-vie en deux",
    texte:
      "Les primes versées AVANT 70 ans donnent droit à 152 500 € d’abattement par bénéficiaire (art. 990 I du CGI). Celles versées APRÈS n’ouvrent que 30 500 € au total, tous contrats et tous bénéficiaires confondus (art. 757 B du CGI) — et seules les primes sont taxées, pas les intérêts. C’est la date de chaque versement qui compte, pas la date d’ouverture du contrat. Une réserve, et elle compte à votre âge : les contrats souscrits avant le 20 novembre 1991 et les primes versées avant le 13 octobre 1998 obéissent à des règles particulières. Notez donc aussi la date de souscription de chaque contrat, en plus de celle de chaque versement, et faites-les vérifier (art. 990 I et 757 B du CGI). Sortez vos relevés et notez, contrat par contrat, ce qui a été versé avant et ce qui l’a été après.",
  },
  {
    titre: "3. Le 71e anniversaire — à mettre en balance avec l’attente",
    texte:
      "Le 71e anniversaire fait passer la nue-propriété — la propriété sans l’usage, celle que reçoit votre enfant, pendant que vous gardez l’usufruit, donc le logement et les loyers (art. 578 et 582 du code civil) — de 60 % à 70 % de la valeur du bien (art. 669 du CGI). Mais attendre le rechargement récupère de l’abattement (art. 784 du CGI). Les deux se compensent : plus le bien est cher, plus l’anniversaire pèse ; plus il vous reste d’abattement à récupérer, plus l’attente pèse. Écrivez les deux chiffres et faites-les comparer par votre notaire avant de choisir.",
  },
];

const PIEGES: { titre: string; texte: string }[] = [
  {
    titre: "Le don manuel jamais déclaré",
    texte:
      "Un chèque de la main à la main n’a pas fait partir le compteur. Il ne part qu’à la déclaration du don par celui qui l’a reçu, à sa révélation à l’administration par lui-même, ou à sa reconnaissance en justice (art. 757 du CGI) — et le don devient alors taxable. Au décès, par ailleurs, vos héritiers sont tenus de déclarer les donations antérieures (art. 784 al. 1 du CGI) : le don refait surface là. Quinze ans d’attente pour rien.",
  },
  {
    titre: "Croire que 15 ans efface tout",
    texte:
      "Quinze ans effacent l’impôt (art. 784 du CGI), pas le partage entre vos enfants. Une donation de 1998 compte toujours au moment de la succession : elle est réunie fictivement pour calculer la part réservée à chacun (art. 922), quelle que soit la mention de l’acte, et elle est en plus rapportée au partage si elle a été faite en avancement de part successorale (art. 843) — voir le point 2. Et pas à la valeur du jour du don, sauf pour une somme d’argent non réinvestie (art. 860-1) ou si l’acte en a décidé autrement (art. 860, dernier alinéa).",
  },
  {
    titre: "Rééquilibrer en cachette",
    texte:
      "Un second don « discret » pour rattraper l’écart est repris deux fois : rappelé fiscalement s’il a moins de 15 ans, et recompté civilement au partage. Le déséquilibre revient au pire moment, au décès, entre des frères et sœurs sans arbitre.",
  },
];

const QUESTIONS: string[] = [
  "Voici la liste de ce que j’ai donné et à quelle date (voir mon tableau du point 4) : lesquelles de ces donations seront encore rappelées fiscalement, et à quelle date exacte chacune sort du compteur ?",
  "Les dons que j’ai faits de la main à la main ont-ils été déclarés ? Si je les déclare aujourd’hui, qu’est-ce que cela change et qu’est-ce que cela coûte ?",
  "Une donation-partage incorporant mes donations passées — les faisant entrer dans l’acte — est-elle possible chez moi, quelle valeur figerait-elle pour chaque enfant, la part réservée à chacun est-elle respectée, et quel est le coût complet de l’acte ?",
];

export function PlanDonationsDejaFaites() {
  return (
    <Feuille
      titre="Situation 12 — Des donations déjà faites"
      sousTitre="Votre compteur n’est pas à zéro, et il n’est pas parti aujourd’hui. Retrouvez la date de chacune de vos donations : tout le reste en découle."
    >
      <Titre>1. Vous êtes dans ce cas si…</Titre>
      <ul className="space-y-1">
        <Case>
          Vous avez déjà donné quelque chose — de l&apos;argent, un logement, des parts — à un
          enfant ou à un petit-enfant.
        </Case>
        <Case>
          Vous ne savez plus la date exacte de l&apos;acte, ni si ce don a été déclaré à
          l&apos;administration.
        </Case>
        <Case>
          Vous sentez qu&apos;un de vos enfants a reçu plus que les autres, et que personne
          n&apos;en parle à table.
        </Case>
      </ul>

      <Titre>2. Ce qui se passe si vous ne faites rien</Titre>
      <p className="text-[0.95rem]">
        <strong>Deux compteurs tournent, et ils ne se ressemblent pas.</strong> Le compteur fiscal
        s&apos;éteint au bout de 15 ans : passé ce délai, votre abattement de 100 000 € par parent
        et par enfant est reconstitué en entier. Le rapport civil — la remise dans le calcul, au
        décès, de ce que chacun a déjà reçu —, lui, ne s&apos;éteint pas au bout de quinze ans : ce
        délai-là ne le concerne pas. Seule l&apos;action de l&apos;enfant dont la part réservée a
        été entamée obéit à ses propres délais (art. 921 du code civil).
      </p>
      <p className="text-[0.95rem]">
        Ensuite, ne confondez pas deux choses. D&apos;abord,{" "}
        <strong>toutes vos donations sont recomptées</strong> — quelle que soit la mention portée
        sur l&apos;acte — pour calculer la part réservée à chaque enfant : on les réunit fictivement
        à ce qui reste au jour du décès (art. 922 du code civil). Ensuite seulement vient le{" "}
        <strong>rapport</strong>, c&apos;est-à-dire ce que l&apos;enfant doit remettre dans le
        partage avec ses frères et sœurs. Et c&apos;est là, et là seulement, que la mention de
        l&apos;acte change la règle.
      </p>
      <p className="text-[0.95rem]">
        Si la donation a été faite <strong>en avancement de part successorale</strong>, elle est
        rapportée : à la valeur du jour du partage — le jour où les enfants se répartissent
        réellement les biens, souvent des mois après le décès —, mais d&apos;après l&apos;état du
        bien au jour de la donation (art. 843 et 860 du code civil). Si elle a été faite{" "}
        <strong>hors part successorale</strong>, elle n&apos;est pas rapportée : cet enfant la garde
        en plus de sa part. Mais cette mention-là doit être <strong>expresse</strong>, écrite noir
        sur blanc dans l&apos;acte : dans une donation-partage, à défaut de mention expresse, le lot
        de chaque enfant s&apos;impute par défaut sur sa part de réserve (art. 1077 du code civil).
        Regardez la mention portée sur l&apos;acte : c&apos;est la ligne qui change tout.
      </p>
      <p className="text-[0.95rem]">
        Concrètement, pour une donation faite en avancement de part : l&apos;appartement donné
        100 000 € en 2005 et qui en vaut 250 000 € au partage est recompté 250 000 € — mais
        d&apos;après son état au jour du don, de sorte que les travaux payés par votre enfant depuis
        ce jour-là ne sont pas recomptés contre lui (art. 860 du code civil). Le frère qui avait
        reçu 100 000 € en argent, dépensés depuis, recompte 100 000 € — sauf s&apos;il a acheté un
        bien avec cet argent : dans ce cas c&apos;est la valeur actuelle de ce bien qui est
        recomptée (art. 860-1 du code civil). Sur ces donations-là, plus d&apos;impôt à payer — le
        reste de la succession, lui, reste taxé normalement. Familialement, en revanche, 150 000 €
        d&apos;écart découverts le jour de l&apos;enterrement.
      </p>
      {/* Le pivot civil de toute la feuille est une MENTION écrite sur un acte. Sans
          case à cocher ni ligne pour la noter, le lecteur relit « c'est la ligne qui
          change tout » et n'a nulle part où écrire ce qu'il a trouvé. */}
      <div className="eviter-coupure space-y-1">
        <ul className="space-y-1">
          <Case>Mon acte porte la mention EN AVANCEMENT DE PART SUCCESSORALE.</Case>
          <Case>Mon acte porte la mention HORS PART SUCCESSORALE.</Case>
        </ul>
        <Champ
          label="Si je ne trouve pas la mention, à demander au notaire le"
          indice="jour / mois / année"
        />
      </div>
      <Source>
        Abattement et rechargement : art. 779 et 784 du CGI. Réunion fictive de TOUTES les donations
        pour le calcul de la part réservée : art. 922 du code civil. Rapport des donations : art.
        843. Valeur retenue au jour du partage, d&apos;après l&apos;état du bien au jour de la
        donation : art. 860 — sauf stipulation contraire dans l&apos;acte de donation, prévue par le
        dernier alinéa du même article. Rapport d&apos;une somme d&apos;argent, et exception si elle
        a servi à acheter un bien : art. 860-1. Mention hors part successorale, qui doit être
        expresse, et imputation par défaut sur la part de réserve dans une donation-partage : art.
        1077. Délais de l&apos;action de l&apos;enfant dont la réserve est entamée : art. 921.
      </Source>

      <Titre>3. Les 3 dates, dans VOTRE ordre</Titre>
      {/* Les trois dates portent toute la logique de la feuille : imprimées, elles
          doivent se lire comme trois blocs distincts et non comme un seul pavé. */}
      <ol className="divide-y divide-black border-y border-black">
        {DATES.map((d) => (
          <li key={d.titre} className="eviter-coupure py-2">
            <p className="font-bold">{d.titre}</p>
            <p className="text-[0.93rem]">{d.texte}</p>
          </li>
        ))}
      </ol>
      <p className="text-[0.93rem]">
        <strong>Pourquoi l&apos;ordre change d&apos;une personne à l&apos;autre :</strong> ailleurs,
        le point de départ est un âge. Ici, c&apos;est la date d&apos;un acte signé il y a des
        années. Deux voisins du même âge n&apos;ont donc pas le même premier geste à faire.
      </p>
      <Source>
        Art. 779 et 784 du CGI. Assurance-vie : art. 990 I pour les primes versées avant 70 ans,
        art. 757 B pour celles versées après — l&apos;art. 990 I ne vise que les primes versées à
        compter du 13 octobre 1998, et l&apos;art. 757 B que les contrats souscrits à compter du
        20 novembre 1991. Valeur de la nue-propriété : art. 669 du CGI — 60 % tant que vous
        n&apos;avez pas atteint votre 71e anniversaire, 70 % à partir de ce jour-là. Usufruit
        conservé, droit d&apos;user du bien et d&apos;en percevoir les loyers : art. 578 et 582 du
        code civil.
      </Source>
      <p className="text-[0.93rem]">
        <strong>Si j&apos;ai fait plusieurs donations, chacune a son propre compteur.</strong> Celui
        qui commande, pour redonner sans impôt, est celui de la DERNIÈRE.
      </p>
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Date de ma première donation déclarée"
          indice="repère historique — celle de l’acte, pas du virement"
        />
        <Champ
          label="Date de ma donation la plus RÉCENTE"
          indice="celle de l’acte, pas du virement"
        />
        <Champ
          label="Mon abattement est reconstitué en entier le"
          indice="cette date + 15 ans, et le lendemain pour être tranquille — art. 784 CGI"
        />
        <Champ label="J’aurai alors, cette année-là" indice="mon âge en années" />
      </div>
      <p className="text-[0.93rem]">
        Chaque donation sort du rappel quinze ans après sa propre date, et le jour anniversaire
        lui-même elle est encore rappelée : c&apos;est le lendemain qui est tranquille (art. 784 du
        CGI vise les donations « passées depuis plus de quinze ans »). L&apos;abattement se
        reconstitue par paliers, pas d&apos;un coup. Reportez chaque date dans le tableau du point
        4.
      </p>

      {/* Le document demande de retrouver des dates depuis la première ligne. Sans
          cet encadré, le lecteur qui n'a plus ses papiers est bloqué au point 3.
          Douze lignes imprimées : coupé en deux par la césure, il ne sert plus. */}
      <div className="eviter-coupure">
        <Encadre titre="OÙ RETROUVER LA DATE">
          <ul className="list-disc space-y-1 pl-5 text-[0.93rem]">
            <li>
              Votre notaire conserve la minute — l&apos;original — de tout acte de donation
              qu&apos;il a reçu, et vous en délivre une copie sur demande. Si l&apos;acte a été
              signé dans une autre étude, la vôtre sait à qui écrire.
            </li>
            <li>
              Un don manuel déclaré a laissé un formulaire de déclaration déposé au service des
              impôts : ce service peut vous en confirmer la date.
            </li>
            <li>
              À défaut d&apos;acte retrouvé, le relevé de compte de l&apos;année du virement donne
              le mois — c&apos;est déjà assez pour que le notaire cherche.
            </li>
          </ul>
          <p className="mt-2 text-[0.93rem]">
            Tant que ces dates ne sont pas écrites, ne signez rien de nouveau. Ce sont les questions
            1 et 2 du point 7.
          </p>
        </Encadre>
      </div>

      <Titre>4. Ce que j&apos;ai déjà donné</Titre>
      {/* Le tableau et sa consigne ne valent que lus ensemble : un tableau seul en
          bas de page, sa règle de remplissage sur la page suivante, ne sert à rien. */}
      <div className="eviter-coupure space-y-2">
        <TableauVierge
          colonnes={[
            "Qui a reçu",
            "Quoi, et combien",
            "Date de l’acte",
            "Déclarée ?",
            "Compteur rechargé le",
          ]}
          lignes={5}
        />
        <p className="text-[0.93rem]">
          Si vous avez déjà rempli le point 6 de <em>Ma fiche famille</em>, recopiez-le ici et
          complétez la dernière colonne : une seule liste, à un seul endroit.
        </p>
        <p className="text-[0.93rem]">
          Si la colonne « Déclarée ? » porte NON, laissez la case de droite vide : le compteur
          n&apos;est pas parti.
        </p>
      </div>

      <Titre>5. Les 3 pièges de cette situation</Titre>
      {/* Un piège coupé en deux par la césure laisse sa conclusion — la phrase qui
          coûte cher — seule en haut de la page suivante. */}
      <div className="space-y-2">
        {PIEGES.map((p) => (
          <div key={p.titre} className="eviter-coupure">
            <Encadre titre={p.titre}>
              <p className="text-[0.93rem]">{p.texte}</p>
            </Encadre>
          </div>
        ))}
      </div>

      <Titre>6. Solder le passé une fois pour toutes</Titre>
      <p className="text-[0.93rem]">
        La manière la plus sûre de solder le passé est de le mettre sur la table une fois pour
        toutes, avec tout le monde autour. La donation-partage sert exactement à cela : elle fige la
        valeur de chaque part au jour de l&apos;acte,{" "}
        <strong>
          à condition que TOUS vos enfants reçoivent un lot et l&apos;acceptent expressément
        </strong>
        , et qu&apos;il n&apos;y ait pas de réserve d&apos;usufruit — l&apos;usufruit étant le droit
        de garder l&apos;usage du bien et d&apos;en percevoir les revenus — portant sur une somme
        d&apos;argent (art. 1078 du code civil). Un seul enfant écarté et le gel ne joue pas. Les
        donations déjà faites peuvent y être incorporées — les faire entrer dans l&apos;acte —, même
        si vous n&apos;avez plus rien à donner aujourd&apos;hui. Quand ces trois conditions sont
        réunies, personne ne découvre les chiffres au décès, parce que tout le monde les a lus et
        signés.
      </p>
      <ul className="space-y-1">
        <Case>
          Je réunis les actes et les relevés, et j&apos;écris les vrais chiffres dans le tableau
          ci-dessus.
        </Case>
        <Case>
          J&apos;en parle à mes enfants avant le rendez-vous, tous ensemble et pas un par un.
        </Case>
        <Case>
          Je demande au notaire si une donation-partage peut incorporer ce qui a déjà été donné, à
          quelles conditions le gel des valeurs tient, et si la part réservée à chaque enfant reste
          respectée.
        </Case>
      </ul>
      <Source>
        Donation-partage : art. 1078 du code civil. Incorporation des donations antérieures : art.
        1078-1 et 1078-2. Possible même si vous n&apos;avez plus rien à donner aujourd&apos;hui :
        art. 1078-3 du code civil.
      </Source>

      <Titre>7. Les 3 questions à poser à votre notaire</Titre>
      {/* Le carré de 18 px vient de questions-notaire.tsx : c'est la feuille qu'on
          emporte au rendez-vous, et on coche pendant qu'on parle. Séparer une
          question de sa ligne de réponse par une césure la rend inutilisable. */}
      <ol className="eviter-coupure divide-y divide-black border-y border-black">
        {QUESTIONS.map((q, i) => (
          <li key={q} className="py-2">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[3px] block h-[18px] w-[18px] shrink-0 border border-black"
              />
              <p>
                <strong>{i + 1}.</strong> {q}
              </p>
            </div>
            {/* La question 1 appelle une date PAR donation, pas une réponse unique :
                deux lignes réglées pour elle, une seule pour les deux autres. */}
            <div className="ml-[30px] mt-1 min-h-[36px] border-b border-black" />
            {i === 0 && <div className="ml-[30px] mt-1 min-h-[36px] border-b border-black" />}
          </li>
        ))}
      </ol>

      <Titre>8. Ce que ça change, en euros</Titre>
      <p className="text-[0.93rem]">
        Vous avez déclaré une donation de 60 000 € à votre fille le 12 mars 2014, portant sur un
        bien et non sur une somme d&apos;argent. Vous voulez lui transmettre 100 000 € de plus — ici
        encore un bien, une part de logement, et non de l&apos;argent.
      </p>
      {/* Les deux encadrés sont une comparaison : coupés l'un de l'autre par un saut
          de page, ils ne démontrent plus rien. Les centimes sont imprimés parce que
          ces quatre lignes sont additionnées au stylo. */}
      <div className="eviter-coupure space-y-4">
        <Encadre titre="SI VOUS SIGNEZ JUSQU’AU 12 MARS 2029 INCLUS">
          <div className="space-y-0.5 text-[0.93rem]">
            <p>Abattement encore disponible : 100 000 − 60 000 = 40 000 €</p>
            <p>Part taxable : 100 000 − 40 000 = 60 000 €</p>
            <p>5 % sur les 8 072 premiers euros = 403,60 €</p>
            <p>10 % de 8 072 à 12 109 € = 403,70 €</p>
            <p>15 % de 12 109 à 15 932 € = 573,45 €</p>
            <p>20 % de 15 932 à 60 000 € = 8 813,60 €</p>
            <p className="font-bold">Droits à payer : 10 194,35 €</p>
          </div>
        </Encadre>
        <Encadre titre="SI VOUS SIGNEZ À PARTIR DU 13 MARS 2029">
          <div className="space-y-0.5 text-[0.93rem]">
            <p>La donation de 2014 a plus de 15 ans : elle n&apos;est plus rappelée.</p>
            <p>Abattement disponible : 100 000 € en entier</p>
            <p>Part taxable : 100 000 − 100 000 = 0 €</p>
            <p className="font-bold">Droits à payer : 0 €</p>
          </div>
        </Encadre>
      </div>
      <p className="text-[0.93rem]">
        Ce calcul repart de la tranche à 5 % parce que la donation de 2014, absorbée en entier par
        l&apos;abattement, n&apos;a payé aucun droit. Si une de vos donations passées a payé des
        droits, les tranches basses sont déjà consommées et le calcul repart plus haut : faites-le
        refaire par votre notaire (art. 784 du CGI).
      </p>
      <p className="text-[0.95rem]">
        <strong>Différence : 10 194,35 €</strong>, pour une seule signature, déplacée au
        13 mars 2029 — le lendemain des quinze ans de cette donation-là. C&apos;est pour cela que la
        date de chacun de vos actes est la première chose à retrouver.
      </p>
      {/* L'aparté sur l'argent vaut dans les DEUX cas : enfermé dans le premier
          encadré, il déséquilibrait la comparaison et se lisait comme une règle
          propre au premier scénario. */}
      <p className="text-[0.93rem]">
        <strong>Dans les deux cas</strong>, si ce que vous donnez est de l&apos;argent et non un
        bien : 31 865 € de plus sont exonérés, à un enfant majeur, tant que vous n&apos;avez pas 80
        ans (art. 790 G du CGI). Cette exonération se cumule avec l&apos;abattement de l&apos;art.
        779 et se recharge elle aussi tous les 15 ans.
      </p>
      <div className="eviter-coupure grid gap-3">
        <Champ
          label="Ce que j’ai déjà donné à cet enfant"
          indice="ce qui est encore rappelé — voir le tableau du point 4"
        />
        <Champ
          label="Abattement qui me reste"
          indice="100 000 € moins la ligne du dessus — art. 779"
        />
        <Champ label="Ce que je veux donner en plus" />
        <Champ label="Part taxable" indice="si le résultat est négatif, écrivez 0" />
      </div>
      <Source>
        Barème en ligne directe : art. 777 du CGI. Abattement de 100 000 € : art. 779. Don familial
        de somme d&apos;argent : art. 790 G. Rappel des donations passées depuis quinze ans ou
        moins, et règle des tranches les plus élevées quand une donation antérieure a déjà payé des
        droits : art. 784 du CGI.
      </Source>

      <Titre>9. Ma décision</Titre>
      <ul className="space-y-1">
        <Case>J&apos;ai rempli le tableau du point 4 avec les vraies dates.</Case>
        <Case>J&apos;en ai parlé à mes enfants, tous ensemble.</Case>
        <Case>
          J&apos;ai retrouvé la date de mes donations passées et j&apos;ai pris rendez-vous chez le
          notaire pour les faire vérifier.
        </Case>
      </ul>
      {/* Une feuille rangée dans un classeur sans la date du rendez-vous ne se relit
          pas : le lecteur ne sait plus si le geste a été fait ou seulement décidé. */}
      <div className="eviter-coupure grid gap-3">
        <Champ label="Rendez-vous chez le notaire le" indice="jour / mois / année, et l’heure" />
        <Champ label="Décidé le" indice="jour / mois / année" />
        <Champ label="Fait le" indice="quand l’acte est signé" />
      </div>

      <p className="text-[0.9rem]">
        Ce plan-type est une trame de travail. Les actes et modèles évoqués ici sont à faire relire
        par votre notaire, qui seul peut les adapter à votre dossier.
      </p>
    </Feuille>
  );
}
