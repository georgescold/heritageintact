import { Section, SectionTitle } from "../Lp";
import { EXEMPLE_HEADLINE as e } from "@/lib/exemple-headline";
import { euros } from "@/lib/config";

/** Encadrés historiques, raccordés au modèle existant sans le modifier. */
export function CalculHistorique() {
  const lignes = [
    ["Maison de province, payée", euros(e.maison)],
    ["Livrets et comptes", euros(e.epargne)],
    ["Part reçue par chacun des deux enfants", "314 515 €"],
    ["Abattement disponible par enfant", "− 100 000 €"],
    ["Reste à taxer par enfant", "214 515 €"],
  ];
  return <>
    <Section id="exemple-chiffre" tone="grey">
      <SectionTitle>D’où sortent les 82 194 €</SectionTitle>
      <p className="mb-4 text-[1.05rem]">Il n’y a aucune astuce dans ce calcul. Dans cet exemple, un parent de 65 ans, seul propriétaire et sans conjoint, possède une maison de 480 000 € et 149 030 € d’épargne. Ses deux enfants reçoivent chacun la moitié ; aucun don antérieur n’a utilisé leurs abattements.</p>
      <p className="mb-5 text-[1.05rem]">Le barème s’applique à chaque part. Voici comment on arrive à environ 82 194 € de droits pour les deux enfants réunis, hors frais.</p>
      <div className="overflow-hidden border border-grey-line bg-white">
        <table className="w-full text-left"><tbody>{lignes.map(([l,v],i)=><tr key={l} className={i<lignes.length-1?"border-b border-grey-line-soft":"border-b border-blue bg-grey-bg"}><td className="px-4 py-2.5">{l}</td><td className="whitespace-nowrap px-4 py-2.5 text-right font-bold tabular-nums">{v}</td></tr>)}</tbody></table>
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-4"><span className="text-[1.05rem] font-bold text-blue">Droits calculés pour les deux enfants</span><span className="figure-xl text-red">{euros(e.succession)}</span></div>
      </div>
      <p className="mt-5 text-[1.05rem]">Les tranches à 5 %, 10 % et 15 % sont suivies d’une tranche à 20 %. La valeur du bien, les parts de chacun et les abattements changent le résultat.</p>
      <blockquote className="mt-6 border-l-4 border-orange bg-white p-4 text-[1.1rem] leading-snug text-blue sm:p-5 sm:text-[1.25rem]">Vous avez mis une vie à construire ce patrimoine. La question mérite d’être posée pendant que vous pouvez encore décider de ce que vous voulez préserver.</blockquote>
    </Section>
    <Section>
      <SectionTitle>Ce que les 7 erreurs changent</SectionTitle>
      <div className="max-w-[38rem] border-2 border-blue bg-white">
        <p className="border-b border-grey-line bg-grey-bg px-4 py-2 text-[0.88rem] uppercase tracking-[0.08em] text-text-soft">Cas fictif · Un parent · Deux enfants · Même patrimoine</p>
        <dl className="px-4 py-3">
          <div className="flex items-baseline justify-between gap-3 border-b border-grey-line pb-3"><dt>Sans les opérations décrites</dt><dd className="whitespace-nowrap text-[1.7rem] font-bold text-red">{euros(e.succession)}</dd></div>
          <div className="flex items-baseline justify-between gap-3 border-b border-grey-line py-3"><dt>Avec les opérations décrites</dt><dd className="whitespace-nowrap text-[1.7rem] font-bold text-green">{euros(e.donation)}</dd></div>
          <div className="flex items-baseline justify-between gap-3 pt-3"><dt className="font-bold text-blue">Écart de droits dans ce modèle</dt><dd className="whitespace-nowrap text-[2rem] font-bold text-red">68 206 €</dd></div>
        </dl>
        <p className="border-t border-grey-line bg-grey-bg px-4 py-2 text-[0.88rem] text-text-soft">Barème en ligne directe · Hors frais · Hypothèses constantes</p>
      </div>
      <p className="mt-5 max-w-[38rem] text-[1.06rem]">Ces <strong>68 206 €</strong> illustrent ce que l’anticipation peut changer dans un cas précis.</p>
      <details className="mt-5 border border-grey-line p-4"><summary className="cursor-pointer font-bold text-blue">Voir les hypothèses et le calcul des 68 206 €</summary><div className="mt-3 space-y-3 text-sm"><p>{e.hypotheses}</p><p>{e.scenarioA}</p><p>{e.scenarioB}</p><p>{e.limites}</p><p>Repères : <a href="https://www.impots.gouv.fr/particulier/questions/comment-dois-je-calculer-les-droits-de-succession">succession</a>, <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">donation</a>, <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F934">usufruit</a>, <a href="https://www.impots.gouv.fr/particulier/questions/je-suis-beneficiaire-dune-assurance-vie-comment-la-declarer">assurance-vie</a>.</p></div></details>
    </Section>
  </>;
}
