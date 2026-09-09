import { Section, SectionTitle } from "../Lp";

const chiffres = [
  { nombre: "8 %", titre: "des ménages avaient déjà versé une donation début 2018", texte: "La transmission de son vivant reste peu répandue. Savoir ce qui existe est le premier pas ; vérifier si cela vous convient vient ensuite.", source: "Insee Focus n° 232, avril 2021 — enquête 2017-2018", lien: "https://www.insee.fr/fr/statistiques/5359234" },
  { nombre: "65 %", titre: "des ménages donateurs avaient 70 ans ou plus lors de cette enquête", texte: "Ce chiffre décrit leur âge à l’enquête, pas forcément leur âge au moment du don. Il rappelle combien la transmission concerne souvent la seconde partie de la vie.", source: "Insee Focus n° 232, avril 2021 — enquête 2017-2018", lien: "https://www.insee.fr/fr/statistiques/5359234" },
  { nombre: "50 ans", titre: "environ : l’âge moyen des héritiers dans la note du CAE de 2021", texte: "Au moment de recevoir, vos enfants peuvent avoir déjà construit leur propre vie. Préparer la transmission, c’est aussi pouvoir en parler avec eux avant.", source: "Conseil d’analyse économique, note n° 69, décembre 2021", lien: "https://www.cae-eco.fr/staticfiles/pdf/cae-note069.pdf" },
  { nombre: "16,6 Md€", titre: "de droits de succession encaissés en France en 2023", texte: "Plus du double des 7 milliards encaissés en 2011, en euros courants. Ce total national ne permet pas de prédire la facture de votre famille.", source: "Cour des comptes, rapport sur les droits de succession, septembre 2024", lien: "https://www.economie.gouv.fr/daj/lettre-de-la-daj-publication-du-rapport-de-la-cour-des-comptes-sur-les-droits-de-succession" },
];
export function ChiffresHistoriques() {
  return <Section tone="grey" id="chiffres-publics">
    <SectionTitle>Ce que disent les chiffres publics</SectionTitle>
    <p className="mb-5 max-w-[42rem] text-[1.06rem]">Aucun de ces chiffres n’est de nous. Chacun porte l’organisme qui le publie, l’étude et son année : vous pouvez tout vérifier.</p>
    <ul className="grid gap-4 sm:grid-cols-2">{chiffres.map(s => <li key={s.nombre} className="border border-grey-line bg-white p-4">
      <p className="text-[2.1rem] font-bold leading-none tabular-nums text-orange">{s.nombre}</p>
      <p className="mt-1 text-[1.05rem] font-bold text-blue">{s.titre}</p>
      <p className="mt-2 text-[1rem]">{s.texte}</p>
      <p className="mt-3 border-t border-grey-line-soft pt-2 text-[0.85rem] text-text-soft"><a href={s.lien}>{s.source}</a></p>
    </li>)}</ul>
    <div className="mt-5 border-l-4 border-blue bg-white p-4">
      <p className="mb-2 text-[1.08rem] font-bold text-blue">« Beaucoup d’héritages ne sont pas taxés. Alors pourquoi regarder ? »</p>
      <p>Parce qu’une statistique nationale ne répond pas pour votre famille. La valeur transmise, le nombre d’héritiers, le lien familial et les donations passées changent le calcul. Une maison payée ne suffit pas à dire que vous serez imposé — ni que tout est déjà préparé.</p>
    </div>
  </Section>;
}
