import Image from "next/image";
import { Section, SectionTitle } from "../Lp";

/** Présentation et récits pré-refonte restaurés ; hypothèses explicites, aucun changement produit. */
export function JeanPierreHistorique() {
  return (
    <Section id="jean-pierre" tone="grey" wide>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <figure className="lg:sticky lg:top-4">
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
              src="/img/jean-pierre.jpg"
              alt="Un homme âgé assis seul à sa table de cuisine, vu de dos, une lettre ouverte devant lui."
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 border-l-4 border-blue bg-white px-3 py-2 text-[0.9rem]">
            <strong className="block text-blue">
              Jean-Pierre, 67 ans — Nantes · marié, un fils unique : Nicolas
            </strong>
            <span className="text-text-soft">
              Personnage fictif. Exemple pédagogique, pas un témoignage client.
            </span>
          </figcaption>
        </figure>

        <div>
          <SectionTitle>
            Jean-Pierre a fait tout ce qu&apos;il fallait. Ça n&apos;a rien changé.
          </SectionTitle>

          <div className="space-y-4 text-[1.06rem]">
            <p>
              Jean-Pierre a 67 ans. Un pavillon en périphérie de Nantes, quatre chambres, un garage
              avec un établi. Il l&apos;a remboursé en vingt-deux ans. Ancien technicien dans
              l&apos;industrie, retraité depuis quatre ans. Un fils unique, Nicolas, deux
              petits-enfants, un épagneul, et un camping-car qui part trois semaines en juin.
            </p>
            <p>
              Il a fait <em>exactement</em> ce qu&apos;on lui a dit de faire. Il a ouvert une
              assurance-vie à sa banque en 2003, parce que le conseiller la lui a proposée. Il est
              allé chez le notaire en 2015 faire un testament, parce que ça se fait. Il a mis 250 €
              de côté tous les mois pendant quarante ans, sans exception, y compris les années où
              c&apos;était difficile.
            </p>
            <p>
              Il n&apos;a rien raté. Il n&apos;a rien dépensé bêtement. Il a fait ce qu&apos;un
              homme prévoyant fait.
            </p>
            {/* ⚠️ Ce chiffre n'est PAS celui de Julien (82 194 €), et c'est voulu :
                deux familles différentes, deux patrimoines différents, deux
                factures différentes. Les faire coïncider donnerait un seul cas
                raconté deux fois. Le calcul de celui-ci est dans
                `12-chiffres-succession.md` § Le cas Jean-Pierre. */}
            <p className="border-l-4 border-red bg-red-bg p-4 text-[1.15rem] font-bold text-blue">
              Dans ce cas fictif, son fils Nicolas ferait face à 78 194 € de droits.
            </p>
            <p className="text-[0.95rem] text-text-soft">
              Hypothèse : Jean-Pierre est devenu seul propriétaire d’une maison de 380 000 € et de 120 000 € sur ses livrets. À son décès, sans conjoint survivant, Nicolas reçoit ces 500 000 €, avec un abattement intégral de 100 000 € disponible, sans dette ni autre correction. Le barème en ligne directe s’applique aux 400 000 € restants, hors frais. Cette hypothèse ne décrit pas automatiquement le règlement de deux successions. Article 777 du Code général des impôts.
            </p>
            <p>
              Ce n&apos;est pas parce qu&apos;il a mal géré. Ce n&apos;est pas parce qu&apos;il
              n&apos;a pas assez mis de côté. Ce n&apos;est pas parce qu&apos;il est mauvais avec
              l&apos;argent — il est même plutôt meilleur que la moyenne.
            </p>
            <p className="text-[1.1rem] font-bold text-blue">
              C&apos;est parce que personne ne lui a jamais dit qu&apos;il y avait autre chose à
              faire. Et surtout, que ça se faisait avant.
            </p>
            <p>
              Si vous vous reconnaissez là-dedans, vous n&apos;avez strictement rien à vous
              reprocher. Vous avez fait ce qu&apos;on vous a appris à faire, et vous l&apos;avez
              bien fait.{" "}
              <strong>
                Le problème n&apos;est pas ce que vous avez fait. C&apos;est ce qu&apos;on ne vous a
                jamais dit.
              </strong>
            </p>
            <p>Reste à savoir pourquoi personne ne vous l&apos;a dit.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function MartineHistorique() {
  return (
    <Section id="martine" tone="grey" wide>
      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div>
          <SectionTitle>Martine a fait la bonne chose. Trois mois trop tard.</SectionTitle>

          <div className="space-y-4 text-[1.06rem]">
            <p>
              Martine a 71 ans, un appartement à Montpellier et la maison de vacances où ses cinq
              petits-enfants ont appris à nager. Elle est veuve depuis deux ans.
            </p>
            <p>
              Elle a enterré son mari un jeudi de novembre, et elle a passé les onze mois suivants
              dans les papiers. Les comptes bloqués. Les organismes à prévenir un par un, en
              réexpliquant à chaque fois. Les actes de décès qu&apos;il faut recommander parce
              qu&apos;on n&apos;en avait pas demandé assez.
            </p>
            <p>
              Alors elle s&apos;est juré une chose&nbsp;:{" "}
              <strong>ses trois enfants ne vivraient pas ça.</strong>
            </p>
            <p>
              Elle a rangé, classé, regroupé. Et pour faire simple, elle a viré{" "}
              <strong>90 000 €</strong> — ce qui restait de l&apos;épargne du ménage — sur son
              assurance-vie. «&nbsp;Comme ça, tout est au même endroit.&nbsp;»
            </p>
            <p className="text-[1.1rem] font-bold text-blue">Elle avait 70 ans et trois mois.</p>

            <div className="border-l-4 border-red bg-red-bg p-4">
              <p className="mb-2">
                Personne ne lui avait dit qu&apos;il y avait une date. Dans cet exemple, versés <strong>avant</strong>{" "}
                son soixante-dixième anniversaire, ces 90 000 € seraient sortis de la succession
                sans droits dans la limite des abattements disponibles de ses enfants bénéficiaires. Pour les primes versées <strong>après</strong> sur ce contrat, les régimes distinguent{" "}
                {/* ⚠️ « par bénéficiaire », jamais « par enfant ». L'abattement de
                    l'art. 990 I porte sur la personne DÉSIGNÉE dans la clause, qui
                    n'est pas forcément un enfant — la clause standard de cette
                    audience commence par « mon conjoint ». Quelqu'un avec trois
                    enfants dont la clause désigne son épouse n'a pas trois fois
                    152 500 € : il a un conjoint exonéré et trois abattements
                    jamais utilisés. C'est précisément l'erreur n° 3 du produit,
                    et la page ne peut pas la commettre en l'annonçant. */}
                152 500 € par bénéficiaire avant 70 ans et 30 500 € au total après 70 ans, tous bénéficiaires et contrats
                confondus.
              </p>
              <p>
                Hypothèse : contrat relevant de ces régimes, aucun autre versement après 70 ans, abattements successoraux des trois enfants déjà utilisés et primes taxées à 20 %. Les 59 500 € de primes restantes entraîneraient alors{" "}
                <strong>11 900 € de droits au total</strong>. Les gains sont exclus de cette assiette après 70 ans. Un autre historique ou d’autres abattements changeraient le résultat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-2 border-red bg-white p-4">
              <span className="figure-xl text-red">11 900 €</span>
              <p className="min-w-[12rem] flex-1 text-[1.06rem] font-bold text-blue">
                Pour un virement fait trois mois trop tard.
              </p>
            </div>

            <p>
              Martine n&apos;a rien fait de mal. Elle pensait même faire exactement ce qu&apos;il fallait
              faire — dans le mauvais ordre, et après la mauvaise date. Elle avait déjà vécu une
              succession&nbsp;: elle savait mieux que la plupart des gens. Ça n&apos;a rien changé.
            </p>
            <p className="border-l-4 border-blue bg-white p-4 text-[1.15rem] font-bold text-blue">
              Sur une succession, la décision compte. Le moment où on la prend peut compter tout autant.
            </p>
          </div>
        </div>

        <figure className="lg:sticky lg:top-4">
          <div className="relative aspect-[4/3] overflow-hidden border border-grey-line">
            <Image
              src="/img/martine.jpg"
              alt="Une femme âgée vue de dos, assise droite à la table de sa salle à manger, la main posée sur un dossier de succession ouvert devant elle."
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 border-l-4 border-blue bg-white px-3 py-2 text-[0.9rem]">
            <strong className="block text-blue">Martine, 71 ans — Montpellier</strong>
            <span className="text-text-soft">
              Personnage fictif. Exemple pédagogique, pas un témoignage client.
            </span>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
