import { Section, SectionTitle } from "@/components/Lp";

/**
 * LES CHIFFRES PUBLICS, AVEC LEUR SOURCE.
 *
 * Règle absolue de ce bloc, et de tout le site : aucun nombre sans l'organisme
 * qui le publie, l'intitulé de l'étude et son année. Un chiffre orphelin sur
 * une page qui cite un article du CGI en face de chaque montant détruit la
 * crédibilité de tous les autres — c'est exactement pour ça que le « 1
 * succession sur 4 » a été retiré.
 *
 * ⚠️ CE QUI N'EST PAS ICI, ET POURQUOI.
 * Le Conseil d'analyse économique publie deux chiffres que ce bloc n'affiche
 * pas : « 87 % des héritages sont inférieurs à 100 000 € » et « le taux
 * effectif moyen d'imposition est de 5 % ». Ils sont vrais, et ils disent que
 * la plupart des Français ne paient rien.
 *
 * On ne les cache pas — le dernier encadré du bloc les affronte de face,
 * parce qu'un prospect méfiant les trouvera de toute façon en cinq minutes,
 * et qu'il vaut infiniment mieux qu'il les lise chez nous. Et la réponse est
 * vraie : l'avatar de ce site — une maison payée et des enfants — est
 * précisément dans la minorité qui paie.
 */

type Stat = {
  chiffre: string;
  quoi: string;
  ce_que_ca_dit: string;
  source: string;
};

const STATS: Stat[] = [
  {
    chiffre: "8 %",
    quoi: "des ménages français ont déjà consenti une donation",
    ce_que_ca_dit:
      "Ce n'est pas une affaire de gens fortunés ou de montages compliqués. C'est simplement que presque personne ne le fait — et personne n'est payé pour vous dire que c'est possible.",
    source: "Insee, « Transmissions intergénérationnelles en 2018 », publié le 17 février 2022",
  },
  {
    chiffre: "+ de 60 %",
    quoi: "de ceux qui donnent ont 70 ans ou plus au moment où ils s'y décident",
    ce_que_ca_dit:
      "C'est le chiffre le plus important de cette page. Ceux qui agissent le font, en très grande majorité, après leur 70e anniversaire — c'est-à-dire une fois deux des trois dates déjà passées. Ils font la bonne chose, trop tard.",
    source: "Insee, « Transmissions intergénérationnelles en 2018 », publié le 17 février 2022",
  },
  {
    chiffre: "50 ans",
    quoi: "l'âge moyen auquel on hérite en France. 58 ans d'ici 2050",
    ce_que_ca_dit:
      "L'argent arrive quand la maison est déjà achetée et les études des enfants déjà payées. Il arrive, mais il arrive après.",
    source: "Conseil d'analyse économique, note n° 69 « Repenser l'héritage », décembre 2021",
  },
  {
    chiffre: "16,6 Md€",
    quoi: "de droits de succession encaissés par l'État en 2023",
    ce_que_ca_dit:
      "20,8 milliards en ajoutant les donations. C'est de l'argent qui a déjà été gagné, déjà imposé, et sur lequel les familles paient une seconde fois.",
    source: "DGFiP et Insee, repris par Fipeco, « La fiscalité des successions »",
  },
];

export function Statistiques() {
  return (
    <Section tone="grey">
      <SectionTitle>Ce que disent les chiffres publics</SectionTitle>
      <p className="mb-5 max-w-[42rem] text-[1.06rem]">
        Aucun de ces chiffres n&apos;est de nous. Chacun porte l&apos;organisme qui le publie,
        l&apos;intitulé de l&apos;étude et son année&nbsp;: vous pouvez tout vérifier.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {STATS.map((s) => (
          <li key={s.chiffre + s.quoi} className="border border-grey-line bg-white p-4">
            <p className="text-[2.1rem] font-bold leading-none tabular-nums text-orange">
              {s.chiffre}
            </p>
            <p className="mt-1 text-[1.05rem] font-bold text-blue">{s.quoi}</p>
            <p className="mt-2 text-[1rem]">{s.ce_que_ca_dit}</p>
            <p className="mt-3 border-t border-grey-line-soft pt-2 text-[0.85rem] text-text-soft">
              Source&nbsp;: {s.source}
            </p>
          </li>
        ))}
      </ul>

      {/* L'objection, affrontée avec le chiffre qui la porte. Un prospect
          méfiant trouvera « 87 % des héritages ne sont pas taxés » en cinq
          minutes de recherche. Autant qu'il le lise ici, avec sa réponse —
          et la réponse est vraie, ce qui est la seule raison de l'écrire. */}
      <div className="mt-5 border-l-4 border-blue bg-white p-4">
        <p className="mb-2 text-[1.08rem] font-bold text-blue">
          Un chiffre que vous trouverez ailleurs, et qui semble nous contredire
        </p>
        <p className="text-[1.03rem]">
          Le Conseil d&apos;analyse économique écrit que <strong>87 % des héritages</strong> sont
          inférieurs à 100 000 € et ne coûtent donc rien à personne. C&apos;est exact, et nous
          préférons vous le dire nous-mêmes.
        </p>
        <p className="mt-2 text-[1.03rem]">
          Mais un abattement de 100 000 € par enfant se remplit avec{" "}
          <strong>une maison payée</strong>. Si vous êtes propriétaire de votre logement et que vous
          avez des enfants, vous n&apos;êtes pas dans les 87 %&nbsp;: vous êtes dans les autres. Et
          c&apos;est précisément à eux que cette page s&apos;adresse.
        </p>
        <p className="mt-3 text-[0.85rem] text-text-soft">
          Source&nbsp;: Conseil d&apos;analyse économique, note n° 69 « Repenser l&apos;héritage »,
          décembre 2021.
        </p>
      </div>
    </Section>
  );
}
