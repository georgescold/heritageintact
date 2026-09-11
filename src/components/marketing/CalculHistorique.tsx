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
    <DelaiPaiement />
    <Section>
      <SectionTitle>Ce que les 7 erreurs changent</SectionTitle>
      <div className="max-w-[38rem] border-2 border-blue bg-white">
        <p className="border-b border-grey-line bg-grey-bg px-4 py-2 text-[0.88rem] uppercase tracking-[0.08em] text-text-soft">Cas chiffré · Un parent · Deux enfants · Même patrimoine</p>
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

/** Taux légaux de retard (art. 1727 et 1728 du CGI), appliqués aux droits de l'exemple. Calcul pédagogique, sans mise en demeure. */
const INTERET_MENSUEL = 0.002;
const MAJORATION = 0.1;
/** `euros()` affiche les centimes ; ce bloc parle en euros entiers, comme la headline (82 194 €). */
const entier = (n: number) => `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} €`;

/** Ce que devient la facture quand elle n'est pas payée dans les six mois — typiquement, une maison qui ne se vend pas à temps. */
function DelaiPaiement() {
  const droits = Math.floor(e.succession);
  const parMois = Math.round(e.succession * INTERET_MENSUEL);
  const majoration = Math.round(e.succession * MAJORATION);
  // Paiement au 15e mois : intérêts du 7e au 15e mois inclus (9 mois) + majoration de 10 %.
  const auQuinziemeMois = Math.round(e.succession * (INTERET_MENSUEL * 9 + MAJORATION));
  const lignes = [
    ["Du 1er au 6e mois", "Délai légal pour déclarer et payer", "0 €"],
    ["Dès le 7e mois", "Intérêts de retard : 0,20 % par mois", `+ ${entier(parMois)} par mois`],
    ["À partir du 13e mois", "Majoration de 10 % des droits", `+ ${entier(majoration)}`],
  ];
  return (
    <Section id="delai-paiement">
      <SectionTitle>Cette facture a une date limite : six mois</SectionTitle>
      <p className="mb-4 text-[1.05rem]">Le jour du décès, un délai commence. Les héritiers ont six mois pour déposer la déclaration de succession et payer les droits. En euros, pas en parts de maison.</p>
      <p className="mb-5 text-[1.05rem]">Dans l’exemple ci-dessus, l’épargne suffirait à régler la facture. Mais quand l’essentiel de ce qu’on laisse, c’est la maison, il faut trouver l’argent ailleurs : emprunter, ou vendre. Et une maison ne se vend pas toujours en six mois.</p>
      <div className="max-w-[38rem] overflow-hidden border-2 border-red bg-white">
        <p className="border-b border-grey-line bg-red-bg px-4 py-2 text-[0.88rem] font-bold uppercase tracking-[0.08em] text-red">Si le paiement prend du retard · Droits de {entier(droits)}</p>
        <table className="w-full text-left"><tbody>{lignes.map(([quand, quoi, montant]) => <tr key={quand} className="border-b border-grey-line-soft"><td className="px-4 py-2.5"><span className="block font-bold">{quand}</span><span className="text-[0.95rem] text-text-soft">{quoi}</span></td><td className="whitespace-nowrap px-4 py-2.5 text-right font-bold tabular-nums text-red">{montant}</td></tr>)}</tbody></table>
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-4"><span className="text-[1.05rem] font-bold text-blue">Payé au 15e mois : pénalités cumulées</span><span className="figure-xl text-red">{entier(auQuinziemeMois)}</span></div>
      </div>
      <p className="mt-5 text-[1.05rem]"><strong>Le fisc peut accepter d’étaler le paiement.</strong> À condition de le demander avec la déclaration, de payer des intérêts et d’apporter une garantie dans les quatre mois, le plus souvent une hypothèque sur un bien de la succession. Pour garder la maison de leurs parents, vos enfants pourraient devoir la donner en garantie à l’État.</p>
      <blockquote className="mt-6 border-l-4 border-orange bg-grey-bg p-4 text-[1.1rem] leading-snug text-blue sm:p-5 sm:text-[1.25rem]">Rien de tout cela ne se règle le jour du décès. Tout se prépare avant, pendant que vous êtes là pour décider.</blockquote>
      <p className="mt-4 text-sm text-text-soft">Calcul pédagogique sur les droits de l’exemple, hors frais et sans mise en demeure, pour un décès en France métropolitaine (délai de 12 mois dans les autres cas). Sources : <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F36432">paiement des droits de succession</a>, <a href="https://www.cnaf.notaires.fr/actualites/succession-et-depot-tardif-de-la-ds">dépôt tardif de la déclaration</a>.</p>
    </Section>
  );
}
