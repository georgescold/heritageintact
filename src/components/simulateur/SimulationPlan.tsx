"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { calculer } from "@/lib/simulateur/moteur";
import type { Saisie } from "@/lib/simulateur/types";
import {
  CLE_SIMULATION,
  DONNEES_VIDES,
  dossierProfessionnel,
  donneesVersSaisie,
  planPreparation,
  pointsPreparation,
  type DonneesSimulation as Donnees,
} from "@/lib/simulateur/donnees";
import { euros } from "@/lib/config";
import type { Reponses } from "@/lib/qualification";

type Cle = keyof Donnees;
type Option = readonly [string, string];
type Etape = {
  cle: Cle;
  titre: string;
  aide: string;
  type: "choix" | "nombre" | "montant" | "annee";
  options?: readonly Option[];
  min?: number;
  max?: number;
  visible?: (d: Donnees) => boolean;
};

const ETAPES: readonly Etape[] = [
  { cle: "age", titre: "Quel âge avez-vous aujourd’hui ?", aide: "Votre âge permet de situer les repères de 70 et 71 ans sans demander votre date de naissance.", type: "nombre", min: 18, max: 120 },
  { cle: "vie", titre: "Quelle est votre situation de couple ?", aide: "La situation de couple peut modifier les droits à examiner et les documents à retrouver.", type: "choix", options: [["M", "Marié(e)"], ["P", "Pacsé(e)"], ["U", "En couple sans mariage ni PACS"], ["V", "Veuf ou veuve"], ["S", "Seul(e)"]] },
  { cle: "residence", titre: "Quelle part de votre résidence principale faut-il examiner ?", aide: "Indiquez uniquement la valeur de la part qui vous appartient ou que vous souhaitez modéliser. Elle devra être confirmée avec le titre de propriété.", type: "montant" },
  { cle: "detentionResidence", titre: "Comment cette résidence est-elle détenue ?", aide: "Le prix de la maison ne dit pas quelle part entre réellement dans une succession.", type: "choix", visible: d => d.residence > 0, options: [["propre", "Par moi seul(e)"], ["couple", "Avec mon conjoint ou partenaire"], ["indivision", "En indivision avec d’autres personnes"], ["?", "Je dois encore le vérifier"]] },
  { cle: "souhaitResidence", titre: "Que souhaitez-vous principalement pour cette résidence ?", aide: "Votre intention ne crée pas encore un droit, mais elle détermine les scénarios à faire vérifier.", type: "choix", visible: d => d.residence > 0, options: [["rester", "Pouvoir y vivre aussi longtemps que possible"], ["transmettre", "Permettre à un proche de la conserver"], ["vendre", "Éviter qu’une vente éventuelle se bloque"], ["?", "Je ne l’ai pas encore décidé"]] },
  { cle: "immobilier", titre: "Quelle est la valeur de votre part dans vos autres biens immobiliers ?", aide: "Additionnez uniquement les parts que vous souhaitez inclure dans cette estimation.", type: "montant" },
  { cle: "epargne", titre: "Quel montant d’épargne disponible faut-il inclure ?", aide: "Comptes courants, livrets et liquidités, hors assurance-vie.", type: "montant" },
  { cle: "titres", titre: "Quelle valeur de titres et placements faut-il inclure ?", aide: "Actions, obligations, comptes-titres ou autres placements, hors assurance-vie.", type: "montant" },
  { cle: "autres", titre: "Quelle valeur donner aux autres biens concernés ?", aide: "Véhicules, objets de valeur ou autres éléments que vous souhaitez faire apparaître dans le scénario.", type: "montant" },
  { cle: "dettes", titre: "Quel montant de dettes faut-il signaler ?", aide: "Leur déductibilité n’est pas automatique : le plan vous indiquera de les faire confirmer.", type: "montant" },
  { cle: "enfants", titre: "Combien avez-vous d’enfants ?", aide: "Indiquez vos enfants, qu’ils soient communs au couple ou issus d’une précédente union.", type: "nombre", min: 0, max: 30 },
  { cle: "beauxEnfants", titre: "Combien d’enfants de votre conjoint non adoptés souhaitez-vous protéger ?", aide: "Ils ne sont pas automatiquement traités fiscalement comme vos propres enfants : cette distinction peut changer fortement l’estimation.", type: "nombre", min: 0, max: 30 },
  { cle: "petitsEnfants", titre: "Combien de petits-enfants faut-il inclure dans le scénario ?", aide: "Ne les ajoutez que si vous souhaitez examiner une transmission qui les concerne directement.", type: "nombre", min: 0, max: 30 },
  { cle: "fratrie", titre: "Combien de frères ou sœurs faut-il inclure ?", aide: "Cette question sert au scénario demandé ; elle ne détermine pas qui héritera réellement.", type: "nombre", min: 0, max: 30 },
  { cle: "neveux", titre: "Combien de neveux ou nièces faut-il inclure ?", aide: "Ajoutez uniquement les personnes que vous souhaitez voir apparaître dans l’estimation.", type: "nombre", min: 0, max: 30 },
  { cle: "sansLien", titre: "Combien d’autres personnes sans lien familial faut-il inclure ?", aide: "Une personne non parente peut relever d’un traitement très différent : mieux vaut la faire apparaître que la laisser cachée dans une intention générale.", type: "nombre", min: 0, max: 30 },
  { cle: "protectionSignee", titre: "Avez-vous signé un dispositif officiel si vous ne pouviez plus gérer vos intérêts ?", aide: "Une intention orale ne donne aucun pouvoir pour agir à votre place.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je ne sais pas"]] },
  { cle: "personneConfiance", titre: "La personne envisagée a-t-elle accepté cette responsabilité ?", aide: "Le plan distinguera la personne à laquelle vous pensez du pouvoir qui devra réellement être formalisé.", type: "choix", options: [["O", "Oui"], ["N", "Non ou personne non identifiée"], ["?", "Nous n’en avons pas encore parlé"]] },
  { cle: "avAvant", titre: "Combien avez-vous versé en assurance-vie avant 70 ans ?", aide: "Indiquez une estimation pour tous les contrats concernés. Le relevé de l’assureur devra ensuite confirmer les dates.", type: "montant" },
  { cle: "avApres", titre: "Combien avez-vous versé en assurance-vie après 70 ans ?", aide: "Cette distinction est essentielle : les primes versées avant et après 70 ans ne suivent pas le même mécanisme.", type: "montant" },
  { cle: "beneficiaires", titre: "Combien de bénéficiaires se partagent l’assurance-vie ?", aide: "Le simulateur ne lit pas la clause : indiquez le nombre que vous pensez actuel, puis faites-le confirmer par l’assureur.", type: "nombre", min: 1, max: 30, visible: d => d.avAvant + d.avApres > 0 },
  { cle: "donationAnnee", titre: "En quelle année a eu lieu votre dernière donation connue ?", aide: "L’année sert à repérer le délai de quinze ans. Si vous n’en connaissez aucune, choisissez le bouton prévu.", type: "annee", min: 1900, max: new Date().getFullYear() },
  { cle: "donationMontant", titre: "Quel était le montant approximatif de cette donation ?", aide: "Le montant et l’année ne remplacent pas l’acte : ils font apparaître la vérification à préparer.", type: "montant", visible: d => d.donationAnnee > 0 },
] as const;

export function SimulationPlan({ verrouille, children, demarrerOffre }: { verrouille: boolean; children?: ReactNode; demarrerOffre?:(reponses:Reponses)=>Promise<{ok:boolean;error?:string}> }) {
  const router = useRouter();
  const [d, setD] = useState<Donnees>(DONNEES_VIDES);
  const [index, setIndex] = useState(0);
  const [termine, setTermine] = useState(false);
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const valeur = localStorage.getItem(CLE_SIMULATION);
        if (valeur) {
          setD({ ...DONNEES_VIDES, ...JSON.parse(valeur), handicap: 0 });
          if (!verrouille) setTermine(true);
        }
      } catch {}
    });
    return () => cancelAnimationFrame(frame);
  }, [verrouille]);

  const etapes = ETAPES.filter(etape => !etape.visible || etape.visible(d));
  const etape = etapes[Math.min(index, etapes.length - 1)];
  const s = donneesVersSaisie(d);
  const resultat = calculer(s, new Date().getFullYear());
  const alertes = pointsPreparation(d);
  const progression = Math.round(((Math.min(index, etapes.length - 1) + 1) / etapes.length) * 100);
  const valeurNumerique = Number(d[etape.cle]) || 0;

  const definir = (cle: Cle, valeur: string | number) => setD(actuel => ({ ...actuel, [cle]: valeur }));
  const suivant = () => setIndex(actuel => Math.min(actuel + 1, etapes.length - 1));
  const precedent = () => { setErreur(""); setIndex(actuel => Math.max(0, actuel - 1)); };

  async function terminer(donnees: Donnees = d) {
    if (attente) return;
    setAttente(true);
    setErreur("");
    try {
      try { localStorage.setItem(CLE_SIMULATION, JSON.stringify(donnees)); } catch {}
      if (demarrerOffre) {
        const age = donnees.age < 60 ? "a" : donnees.age < 65 ? "b" : donnees.age < 70 ? "c" : donnees.age === 70 ? "d" : "e";
        const enfants = donnees.beauxEnfants > 0 ? "R" : donnees.enfants === 0 ? "0" : donnees.enfants === 1 ? "1" : "2";
        const objectif = donnees.avAvant + donnees.avApres > 0 ? "assurance-vie" : donnees.residence > 0 ? "maison" : "facture";
        const reponse = await demarrerOffre({ objectif, vie: donnees.vie, enfants, age, av: donnees.avAvant + donnees.avApres > 0 ? "O" : "N", blocage: "ordre" });
        if (!reponse.ok) { setErreur(reponse.error ?? "Impossible de préparer l’aperçu."); return; }
        router.refresh();
      }
      setTermine(true);
    } catch {
      setErreur("La connexion a été interrompue. Vos réponses restent affichées : réessayez.");
    } finally {
      setAttente(false);
    }
  }

  if (termine) return <section className="my-6 border-2 border-blue bg-white p-4 sm:p-6">
    <p className="font-bold text-green">Votre aperçu personnalisé est prêt.</p>
    <h2 className="my-3 text-[1.5rem]">{alertes.length || 1} point{alertes.length > 1 ? "s" : ""} de vigilance détecté{alertes.length > 1 ? "s" : ""}</h2>
    <ul className="mb-5 list-disc space-y-2 pl-6">{(alertes.length ? alertes.map(a => a.titre) : ["La composition de votre patrimoine et les personnes incluses doivent être reliées dans un ordre clair."]).slice(0, 3).map(a => <li key={a}>{a}</li>)}</ul>
    {verrouille ? <>
      <div className="relative overflow-hidden border-2 border-grey-line bg-grey-bg p-5">
        <div className="select-none blur-[7px]" aria-hidden="true"><p className="text-[1.6rem] font-bold">Estimation : {euros(resultat.total)}</p><p>Votre ordre de vérification personnalisé, vos échéances et les documents à préparer apparaissent ici.</p></div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-5 text-center font-bold text-blue">Votre résultat complet est prêt : déverrouillez votre estimation et votre plan adapté</div>
      </div>
      {children}
    </> : <Resultat d={d} s={s} />}
  </section>;

  return <section className="my-6 overflow-hidden border-2 border-blue bg-white shadow-[0_8px_24px_rgba(9,55,96,0.10)]">
    <div className="border-b border-grey-line bg-grey-bg px-4 py-4 sm:px-6">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold text-blue"><span>QUESTION {index + 1} SUR {etapes.length}</span><span>{progression} %</span></div>
      <div className="h-2 overflow-hidden bg-white" aria-label={`Progression : ${progression} %`}><div className="h-full bg-orange transition-all" style={{ width: `${progression}%` }} /></div>
    </div>
    <div className="p-5 sm:p-8">
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-dark">Une seule réponse à la fois</p>
      <h2 className="text-[1.55rem] leading-snug sm:text-[1.85rem]">{etape.titre}</h2>
      <p className="mb-6 mt-3 text-[1.02rem] text-text-soft">{etape.aide}</p>

      {etape.type === "choix" ? <div className="grid gap-3">
        {etape.options?.map(([code, libelle]) => <button key={code} type="button" onClick={() => { definir(etape.cle, code); suivant(); }} className="min-h-[56px] border-2 border-grey-line bg-white px-4 py-3 text-left text-[1.05rem] font-bold text-blue hover:border-orange focus:border-orange">{libelle}</button>)}
      </div> : <>
        <label className="block font-bold" htmlFor={`question-${etape.cle}`}>{etape.type === "montant" ? "Votre réponse en euros" : "Votre réponse"}</label>
        <input id={`question-${etape.cle}`} className="field mt-2 w-full text-[1.2rem]" type="number" min={etape.min ?? 0} max={etape.max} step={etape.type === "montant" ? 1000 : 1} value={valeurNumerique || ""} onChange={e => definir(etape.cle, Math.max(0, Number(e.target.value) || 0))} autoFocus />
        {etape.type === "annee" && <button type="button" onClick={() => { const sansDonation = { ...d, donationAnnee: 0, donationMontant: 0 }; setD(sansDonation); if (index === etapes.length - 1) void terminer(sansDonation); else suivant(); }} className="mt-3 min-h-[48px] w-full border border-blue px-4 py-2 font-bold text-blue">Je ne connais aucune donation passée</button>}
        <button type="button" onClick={index === etapes.length - 1 ? () => void terminer() : suivant} disabled={attente || valeurNumerique < (etape.min ?? 0) || (etape.max !== undefined && valeurNumerique > etape.max)} className="mt-4 min-h-[56px] w-full bg-orange px-5 py-3 text-[1.05rem] font-bold text-white disabled:opacity-50">{attente ? "Préparation en cours…" : index === etapes.length - 1 ? "Préparer mon aperçu personnalisé" : "Continuer"}</button>
      </>}

      <div className="mt-6 flex items-center justify-between gap-4 text-sm">{index > 0 ? <button type="button" onClick={precedent} className="underline">← Question précédente</button> : <span />}<span className="text-right text-text-soft">Environ 4 minutes</span></div>
      {erreur && <p role="alert" className="mt-4 border border-red bg-red-bg p-3">{erreur}</p>}
      <p className="mt-5 border-t border-grey-line pt-4 text-[0.88rem] text-text-soft">Aucun nom de proche, aucune adresse ni aucun document n’est demandé. Vos réponses détaillées restent dans ce navigateur et servent uniquement à préparer votre aperçu.</p>
    </div>
  </section>;
}

function Resultat({ d, s }: { d: Donnees; s: Saisie }) {
  const r = calculer(s, new Date().getFullYear());
  const plan = planPreparation(d), points = pointsPreparation(d), pieces = dossierProfessionnel(d);
  return <div className="border-2 border-green bg-green-bg p-5"><h2 className="text-[1.5rem]">Votre estimation indicative : {euros(r.total)}</h2><p className="my-3">Masse nette saisie : {euros(r.masse)} · {r.parts.length} personne(s) incluse(s) dans le scénario.</p><div className="my-5 border-2 border-blue bg-white p-4"><p className="font-bold text-blue">Ce résultat n’a aucun effet juridique à lui seul.</p><p className="mt-2">Il prépare les décisions et les pièces à apporter. Seuls la loi, les contrats réellement enregistrés et les actes valablement établis détermineront vos droits.</p></div><h3 className="mt-5">Vos points de vigilance personnels</h3><div className="mt-3 space-y-4">{points.map(point => <article key={point.cle} className="border-l-4 border-orange bg-white p-4"><p className="font-bold text-blue">{point.titre}</p><p className="mt-1">{point.constat}</p><p className="mt-3 font-bold">À préparer :</p><ul className="mt-1 list-disc space-y-1 pl-6">{point.actions.map(action => <li key={action}>{action}</li>)}</ul><p className="mt-3 text-sm"><strong>Ce qui donnera un effet réel :</strong> {point.effetReel}</p></article>)}</div><h3 className="mt-5">Votre ordre de préparation</h3><ol className="mt-3 list-decimal space-y-2 pl-6">{plan.map(p => <li key={p}>{p}</li>)}</ol><h3 className="mt-5">Votre dossier pour le professionnel</h3><ul className="mt-3 list-disc space-y-2 pl-6">{pieces.map(piece => <li key={piece}>{piece}</li>)}</ul>{r.hypotheses.length > 0 && <details className="mt-5"><summary className="cursor-pointer font-bold">Hypothèses et limites du calcul</summary><ul className="mt-3 list-disc space-y-2 pl-6">{r.hypotheses.map(h => <li key={h}>{h}</li>)}</ul></details>}<p className="mt-4 text-sm">Ce résultat prépare vos questions ; il ne constitue ni un devis notarial, ni un acte, ni un conseil fiscal personnalisé.</p></div>;
}
