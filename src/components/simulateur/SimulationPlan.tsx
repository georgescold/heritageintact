"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { TelechargerPlanPersonnalise } from "@/components/espace/TelechargerPlanPersonnalise";
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
  raisonsChiffrage,
  informationsARetrouver,
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
  { cle: "regime", titre: "Quel est votre régime matrimonial ?", aide: "Regardez votre contrat de mariage. Sans contrat, choisissez la première réponse seulement si vous avez confirmé votre régime.", type: "choix", visible: d => d.vie === "M", options: [["communaute", "Communauté réduite aux acquêts"], ["separation", "Séparation de biens"], ["autre", "Autre régime"], ["?", "Je ne sais pas : à retrouver avec le notaire"]] },
  { cle: "recomposition", titre: "Avez-vous des enfants d’une précédente union ?", aide: "Nous pourrons ainsi préparer les questions propres à votre famille.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je préfère le préciser au rendez-vous"]] },
  { cle: "testament", titre: "Avez-vous déjà rédigé un testament ?", aide: "Ne recopiez pas son contenu ici. Retrouvez simplement son existence et son lieu de conservation.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je dois le vérifier"]] },
  { cle: "donationEpoux", titre: "Une donation entre époux a-t-elle été signée ?", aide: "Votre notaire peut retrouver cet acte. Il est distinct d’un don d’argent.", type: "choix", visible: d => d.vie === "M", options: [["O", "Oui"], ["N", "Non"], ["?", "Je ne sais pas"]] },
  { cle: "residenceTotale", titre: "Combien vaut votre résidence principale entière ?", aide: "Indiquez la valeur totale de la maison ou de l’appartement. Nous calculerons votre part à la question suivante. Sans résidence vous appartenant, choisissez « Aucun ».", type: "montant" },
  { cle: "quotePart", titre: "Quel pourcentage de ce logement vous appartient ?", aide: "Pour une moitié, indiquez 50 ; pour la totalité, 100. Vous trouverez cette proportion sur le titre de propriété. Ne déduisez pas votre part du seul fait d’être marié(e).", type: "nombre", min: 0, max: 100, visible: d => (d.residenceTotale ?? 0) > 0 },
  { cle: "detentionResidence", titre: "Comment cette résidence est-elle détenue ?", aide: "Le prix de la maison ne dit pas quelle part entre réellement dans une succession.", type: "choix", visible: d => d.residence > 0, options: [["propre", "Par moi seul(e)"], ["couple", "Avec mon conjoint ou partenaire"], ["indivision", "En indivision avec d’autres personnes"], ["?", "Je dois encore le vérifier"]] },
  { cle: "souhaitResidence", titre: "Que souhaitez-vous principalement pour cette résidence ?", aide: "Votre intention ne crée pas encore un droit, mais elle détermine les scénarios à faire vérifier.", type: "choix", visible: d => d.residence > 0, options: [["rester", "Pouvoir y vivre aussi longtemps que possible"], ["transmettre", "Permettre à un proche de la conserver"], ["vendre", "Éviter qu’une vente éventuelle se bloque"], ["?", "Je ne l’ai pas encore décidé"]] },
  { cle: "immobilier", titre: "Quelle est la valeur de votre part dans vos autres biens immobiliers ?", aide: "Additionnez uniquement les parts que vous souhaitez inclure dans cette estimation.", type: "montant" },
  { cle: "demembrement", titre: "Un de vos biens est-il détenu en usufruit ou en nue-propriété ?", aide: "Ces mentions figurent dans l’acte. Elles doivent être distinguées de la pleine propriété pour interpréter la valeur du bien.", type: "choix", visible: d => d.residence + d.immobilier > 0, options: [["O", "Oui"], ["N", "Non"], ["?", "Je dois relire le titre de propriété"]] },
  { cle: "epargne", titre: "Quel montant d’épargne disponible faut-il inclure ?", aide: "Comptes courants, livrets et liquidités, hors assurance-vie.", type: "montant" },
  { cle: "titres", titre: "Quelle valeur de titres et placements faut-il inclure ?", aide: "Actions, obligations, comptes-titres ou autres placements, hors assurance-vie.", type: "montant" },
  { cle: "autres", titre: "Quelle valeur donner aux autres biens concernés ?", aide: "Véhicules, objets de valeur ou autres éléments que vous souhaitez faire apparaître dans le scénario.", type: "montant" },
  { cle: "dettes", titre: "Quel montant de dettes faut-il signaler ?", aide: "Leur déductibilité n’est pas automatique : le plan vous indiquera de les faire confirmer.", type: "montant" },
  { cle: "enfants", titre: "Combien avez-vous d’enfants en vie ?", aide: "Indiquez vos enfants en vie, qu’ils soient communs au couple ou issus d’une précédente union. La question suivante permet de préciser les autres descendants.", type: "nombre", min: 0, max: 30 },
  { cle: "descendantDecede", titre: "Un enfant décédé a-t-il laissé des descendants ?", aide: "Cette situation peut changer les personnes et les parts à retenir. Aucun nom ni détail personnel n’est demandé.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je préfère préciser ce point avec le notaire"]] },
  { cle: "repartition", titre: "Souhaitez-vous comparer des parts égales entre vos enfants ?", aide: "Il s’agit d’une hypothèse de calcul, pas d’une décision. Une autre répartition sera notée comme un point à examiner dans votre plan.", type: "choix", visible: d => d.enfants > 0, options: [["O", "Oui, à parts égales"], ["N", "Non"], ["?", "Je ne sais pas encore"]] },
  { cle: "beauxEnfants", titre: "Combien d’enfants de votre conjoint non adoptés souhaitez-vous protéger ?", aide: "Ils ne sont pas automatiquement traités fiscalement comme vos propres enfants : cette distinction peut changer fortement l’estimation.", type: "nombre", min: 0, max: 30 },
  { cle: "petitsEnfants", titre: "Combien de petits-enfants faut-il inclure dans le scénario ?", aide: "Ne les ajoutez que si vous souhaitez examiner une transmission qui les concerne directement.", type: "nombre", min: 0, max: 30 },
  { cle: "fratrie", titre: "Combien de frères ou sœurs faut-il inclure ?", aide: "Cette question sert au scénario demandé ; elle ne détermine pas qui héritera réellement.", type: "nombre", min: 0, max: 30 },
  { cle: "neveux", titre: "Combien de neveux ou nièces faut-il inclure ?", aide: "Ajoutez uniquement les personnes que vous souhaitez voir apparaître dans l’estimation.", type: "nombre", min: 0, max: 30 },
  { cle: "sansLien", titre: "Combien d’autres personnes sans lien familial faut-il inclure ?", aide: "Une personne non parente peut relever d’un traitement très différent : mieux vaut la faire apparaître que la laisser cachée dans une intention générale.", type: "nombre", min: 0, max: 30 },
  { cle: "protectionSignee", titre: "Avez-vous signé un dispositif officiel si vous ne pouviez plus gérer vos intérêts ?", aide: "Une intention orale ne donne aucun pouvoir pour agir à votre place.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je ne sais pas"]] },
  { cle: "personneConfiance", titre: "La personne envisagée a-t-elle accepté cette responsabilité ?", aide: "Le plan distinguera la personne à laquelle vous pensez du pouvoir qui devra réellement être formalisé.", type: "choix", options: [["O", "Oui"], ["N", "Non ou personne non identifiée"], ["?", "Nous n’en avons pas encore parlé"]] },
  { cle: "international", titre: "Votre situation concerne-t-elle un autre pays ?", aide: "Par exemple : un bien à l’étranger, votre résidence à l’étranger ou celle d’une personne à protéger. Aucun nom ni adresse n’est nécessaire.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je dois le préciser"]] },
  { cle: "entreprise", titre: "Possédez-vous une entreprise ou des parts de société ?", aide: "Cela permet de préparer les pièces spécifiques et d’éviter de les traiter comme un simple compte d’épargne.", type: "choix", options: [["O", "Oui"], ["N", "Non"], ["?", "Je dois le vérifier"]] },
  { cle: "urgence", titre: "Une démarche est-elle déjà urgente ?", aide: "Cette réponse place la prise de contact en tête du plan lorsque c’est nécessaire.", type: "choix", options: [["succession", "Une succession est déjà ouverte"], ["signature", "Un rendez-vous ou une signature approche"], ["conflit", "Un désaccord bloque déjà les démarches"], ["non", "Je prépare l’avenir"]] },
  { cle: "intention", titre: "Quel résultat compte le plus pour vous ?", aide: "Nous relierons votre première action à cette priorité.", type: "choix", options: [["maison", "Clarifier l’avenir de la maison"], ["conjoint", "Préparer la protection de mon conjoint ou partenaire"], ["famille", "Clarifier ce que je veux transmettre"], ["ordre", "Savoir par quoi commencer"]] },
  { cle: "avAvant", titre: "Combien avez-vous versé en assurance-vie avant 70 ans ?", aide: "Indiquez une estimation pour tous les contrats concernés. Le relevé de l’assureur devra ensuite confirmer les dates.", type: "montant" },
  { cle: "avApres", titre: "Combien avez-vous versé en assurance-vie après 70 ans ?", aide: "Cette distinction est essentielle : les primes versées avant et après 70 ans ne suivent pas le même mécanisme.", type: "montant" },
  { cle: "beneficiaires", titre: "Combien de bénéficiaires se partagent l’assurance-vie ?", aide: "Le simulateur ne lit pas la clause : indiquez le nombre que vous pensez actuel, puis faites-le confirmer par l’assureur.", type: "nombre", min: 1, max: 30, visible: d => d.avAvant + d.avApres > 0 },
  { cle: "donationsMultiples", titre: "Avez-vous effectué plusieurs donations ?", aide: "Dans ce cas, le plan vous demandera de réunir chaque acte, son bénéficiaire, sa date et son montant. Un seul total ne suffit pas.", type: "choix", options: [["O", "Oui, plusieurs"], ["N", "Non"], ["?", "Je dois retrouver l’historique"]] },
  { cle: "donationAnnee", titre: "En quelle année a eu lieu votre dernière donation connue ?", aide: "Retrouvez la date sur l’acte ou la déclaration de don. Si vous hésitez, utilisez « Je ne sais pas » : votre plan gardera ce point à retrouver.", type: "annee", min: 1900, max: new Date().getFullYear() },
  { cle: "donationMontant", titre: "Quel était le montant approximatif de cette donation ?", aide: "Le montant et l’année ne remplacent pas l’acte : ils font apparaître la vérification à préparer.", type: "montant", visible: d => d.donationAnnee > 0 },
] as const;

export function SimulationPlan({ verrouille, children, demarrerOffre, jeton }: { verrouille: boolean; children?: ReactNode; jeton?: string; demarrerOffre?:(reponses:Reponses)=>Promise<{ok:boolean;error?:string}> }) {
  const router = useRouter();
  const [d, setD] = useState<Donnees>(DONNEES_VIDES);
  const [index, setIndex] = useState(0);
  const [termine, setTermine] = useState(false);
  const [attente, setAttente] = useState(false);
  const [erreur, setErreur] = useState("");
  const [charge, setCharge] = useState(false);
  const [sauvegarde, setSauvegarde] = useState("");
  const [anciennes, setAnciennes] = useState<Donnees | null>(null);
  const version = useRef(0);
  const cleLocale = `${CLE_SIMULATION}:${jeton ?? "atelier"}`;
  const endpoint = jeton ? `/espace/${jeton}/sauvegarde/simulation` : "";

  useEffect(() => {
    let active = true;
    async function charger() {
      try {
        const response = endpoint ? await fetch(endpoint) : null;
        if (response && !response.ok) throw new Error("Le chargement n’a pas abouti. Rechargez la page avant de reprendre.");
        const remote = response ? await response.json() : null;
        let saved = remote?.value;
        try {
          const local = JSON.parse(localStorage.getItem(cleLocale) ?? "null");
          if (local && local.version === (remote?.version ?? 0)) {
            // Conserver la saisie locale, mais pas un ancien état de validation.
            saved = { ...local, termine: remote ? Boolean(remote.value?.termine) : Boolean(local.termine) };
          }
          if (!saved && active) {
            const legacy = JSON.parse(localStorage.getItem(CLE_SIMULATION) ?? "null");
            if (legacy?.age) setAnciennes(legacy);
          }
        } catch {}
        if (!active) return;
        version.current = remote?.version ?? 0;
        if (saved?.donnees) {
          setD({ ...DONNEES_VIDES, ...saved.donnees, handicap: 0 });
          setIndex(saved.index ?? 0);
          setTermine(Boolean(saved.termine));
        }
        setCharge(true);
      } catch (error) { if (active) setErreur((error as Error).message); }
    }
    void charger();
    return () => { active = false; };
  }, [endpoint, cleLocale]);

  // Sauvegarde locale à chaque saisie ; sauvegarde durable avant de quitter chaque question.
  useEffect(() => {
    if (!charge) return;
    try { localStorage.setItem(cleLocale, JSON.stringify({ donnees: d, index, termine, version: version.current })); } catch {}
  }, [d, index, termine, charge, cleLocale]);
  async function sauver(donnees: Donnees, position: number, fini: boolean) {
    if (!endpoint) return true;
    setSauvegarde("Enregistrement…");
    try {
      const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: { donnees, index: position, termine: fini }, version: version.current }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      version.current = result.version;
      // Écrire la version complète avant toute navigation/actualisation React.
      try { localStorage.setItem(cleLocale, JSON.stringify({ ...result.value, version: result.version })); } catch {}
      setSauvegarde("Réponses enregistrées dans votre espace.");
      return true;
    } catch (error) { setErreur((error as Error).message); setSauvegarde(""); return false; }
  }

  const etapes = ETAPES.filter(etape => !etape.visible || etape.visible(d));
  const etape = etapes[Math.min(index, etapes.length - 1)];
  const s = donneesVersSaisie(d);
  const resultat = calculer(s, new Date().getFullYear());
  const alertes = pointsPreparation(d);
  const progression = Math.round(((Math.min(index, etapes.length - 1) + 1) / etapes.length) * 100);
  const valeurNumerique = Number(d[etape.cle]) || 0;

  const modifier = (actuel: Donnees, cle: Cle, valeur: string | number): Donnees => {
    const next = { ...actuel, [cle]: valeur, inconnues: (actuel.inconnues ?? []).filter(k => k !== cle) };
    if (cle === "residenceTotale" || cle === "quotePart") next.residence = Math.round((next.residenceTotale ?? 0) * (next.quotePart ?? 0) / 100);
    if (cle === "donationAnnee" && valeur === 0) next.donationMontant = 0;
    if (cle === "vie" && valeur !== "M") { next.regime = undefined; next.donationEpoux = undefined; next.inconnues = next.inconnues.filter(k => !["regime", "donationEpoux"].includes(k)); }
    return next;
  };
  const definir = (cle: Cle, valeur: string | number) => setD(actuel => modifier(actuel, cle, valeur));
  async function suivant(donnees: Donnees = d) {
    if (attente) return;
    setAttente(true); setErreur("");
    const position = Math.min(index + 1, ETAPES.filter(e => !e.visible || e.visible(donnees)).length - 1);
    if (await sauver(donnees, position, false)) { setD(donnees); setIndex(position); }
    setAttente(false);
  }
  const precedent = () => { setErreur(""); setIndex(actuel => Math.max(0, actuel - 1)); };

  async function terminer(donnees: Donnees = d) {
    if (attente) return;
    setAttente(true);
    setErreur("");
    try {
      const visibles = new Set(ETAPES.filter(e => !e.visible || e.visible(donnees)).map(e => e.cle));
      donnees = { ...donnees, inconnues: (donnees.inconnues ?? []).filter(k => visibles.has(k as Cle)) };
      if (!await sauver(donnees, index, true)) return;
      if (demarrerOffre) {
        const age = donnees.age < 60 ? "a" : donnees.age < 65 ? "b" : donnees.age < 70 ? "c" : donnees.age === 70 ? "d" : "e";
        const enfants = donnees.beauxEnfants > 0 ? "R" : donnees.enfants === 0 ? "0" : donnees.enfants === 1 ? "1" : "2";
        const objectif = donnees.avAvant + donnees.avApres > 0 ? "assurance-vie" : donnees.residence > 0 ? "maison" : "facture";
        const reponse = await demarrerOffre({ objectif, vie: donnees.vie, enfants, age, av: donnees.avAvant + donnees.avApres > 0 ? "O" : "N", blocage: "ordre" });
        if (!reponse.ok) { setErreur(reponse.error ?? "Impossible de préparer l’aperçu."); return; }
        router.refresh();
      }
      setD(donnees); setTermine(true);
    } catch {
      setErreur("La connexion a été interrompue. Vos réponses restent affichées : réessayez.");
    } finally {
      setAttente(false);
    }
  }

  if (termine) return <section className="my-6 border-2 border-blue bg-white p-4 sm:p-6">
    <p className="font-bold text-green">{verrouille ? "Votre aperçu personnalisé est prêt." : "Votre plan personnalisé est prêt."}</p>
    <h2 className="my-3 text-[1.5rem]">{alertes.length || 1} point{alertes.length > 1 ? "s" : ""} de vigilance détecté{alertes.length > 1 ? "s" : ""}</h2>
    <ul className="mb-5 list-disc space-y-2 pl-6">{(alertes.length ? alertes.map(a => a.titre) : ["La composition de votre patrimoine et les personnes incluses doivent être reliées dans un ordre clair."]).slice(0, 3).map(a => <li key={a}>{a}</li>)}</ul>
    {verrouille ? <>
      <div className="relative overflow-hidden border-2 border-grey-line bg-grey-bg p-5">
        <div className="select-none blur-[7px]" aria-hidden="true"><p className="text-[1.6rem] font-bold">{raisonsChiffrage(d).length ? "Votre chiffrage : les éléments à préciser" : `Estimation : ${euros(resultat.total)}`}</p><p>Votre ordre de vérification personnalisé, vos échéances et les documents à préparer apparaissent ici.</p></div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-5 text-center font-bold text-blue">Votre résultat complet est prêt : déverrouillez votre estimation et votre plan adapté</div>
      </div>
      {children}
    </> : <><Resultat d={d} s={s} />{jeton && <ul className="mt-5"><TelechargerPlanPersonnalise jeton={jeton} donnees={d}/></ul>}</>}
    <button type="button" onClick={() => { setTermine(false); setIndex(0); }} className="mt-5 min-h-[48px] underline">Relire ou modifier mes réponses</button>
    {jeton && <p className="mt-3"><Link href={`/espace/${jeton}?vue=dossier`}>Retrouver tous mes documents</Link></p>}
  </section>;

  if (!charge) return <p role="status" className="my-6">{erreur || "Chargement de vos réponses…"}{erreur && <button className="ml-3 underline" onClick={() => location.reload()}>Réessayer</button>}</p>;

  return <section className="my-6 overflow-hidden border-2 border-blue bg-white shadow-[0_8px_24px_rgba(9,55,96,0.10)]">
    <div className="border-b border-grey-line bg-grey-bg px-4 py-4 sm:px-6">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold text-blue"><span>QUESTION {index + 1} SUR {etapes.length}</span><span>{progression} %</span></div>
      <div className="h-2 overflow-hidden bg-white" aria-label={`Progression : ${progression} %`}><div className="h-full bg-orange transition-all" style={{ width: `${progression}%` }} /></div>
    </div>
    <div className="p-5 sm:p-8">
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-dark">Une seule réponse à la fois</p>
      {anciennes && <div className="mb-5 border border-green bg-green-bg p-4"><p>Une ancienne simulation existe sur cet appareil. Si vous l’avez réalisée, vous pouvez reprendre ses réponses puis les compléter.</p><button className="mt-2 min-h-[48px] underline" onClick={() => { setD({ ...DONNEES_VIDES, ...anciennes, handicap: 0, regime: "?", testament: "?", inconnues: ["regime", "testament"] }); setAnciennes(null); }}>Reprendre mes anciennes réponses</button><button className="ml-4 min-h-[48px] underline" onClick={() => setAnciennes(null)}>Commencer de zéro</button></div>}
      <h2 className="text-[1.55rem] leading-snug sm:text-[1.85rem]">{etape.titre}</h2>
      <p className="mb-6 mt-3 text-[1.02rem] text-text-soft">{etape.aide}</p>

      {etape.type === "choix" ? <div className="grid gap-3">
        {etape.options?.map(([code, libelle]) => <button disabled={attente} key={code} type="button" onClick={() => { const next = modifier(d, etape.cle, code); if (code === "?") next.inconnues = [...(next.inconnues ?? []), etape.cle]; void suivant(next); }} className="min-h-[56px] border-2 border-grey-line bg-white px-4 py-3 text-left text-[1.05rem] font-bold text-blue hover:border-orange focus:border-orange">{libelle}</button>)}
      </div> : <>
        <label className="block font-bold" htmlFor={`question-${etape.cle}`}>{etape.type === "montant" ? "Votre réponse en euros" : "Votre réponse"}</label>
        <input id={`question-${etape.cle}`} className="field mt-2 w-full text-[1.2rem]" type="number" min={etape.min ?? 0} max={etape.max} step={etape.type === "montant" ? 1000 : 1} value={valeurNumerique || ""} onChange={e => definir(etape.cle, Math.max(0, Number(e.target.value) || 0))} autoFocus />
        {etape.type === "annee" && <button disabled={attente} type="button" onClick={() => { const sansDonation = { ...d, donationAnnee: 0, donationMontant: 0, inconnues: (d.inconnues ?? []).filter(k => k !== "donationAnnee" && k !== "donationMontant") }; void terminer(sansDonation); }} className="mt-3 min-h-[48px] w-full border border-blue px-4 py-2 font-bold text-blue">Je n’ai effectué aucune donation</button>}
        <button type="button" onClick={index === etapes.length - 1 ? () => void terminer() : () => void suivant()} disabled={attente || valeurNumerique === 0 || valeurNumerique < (etape.min ?? 0) || (etape.max !== undefined && valeurNumerique > etape.max)} className="mt-4 min-h-[56px] w-full bg-orange px-5 py-3 text-[1.05rem] font-bold text-white disabled:opacity-50">{attente ? "Enregistrement…" : index === etapes.length - 1 ? "Préparer mon aperçu personnalisé" : "Continuer"}</button>
        {etape.cle !== "age" && <div className="mt-3 grid gap-2 sm:grid-cols-2"><button disabled={attente} className="min-h-[48px] border border-blue p-3" onClick={() => { const next = modifier(d, etape.cle, 0); if (index === etapes.length - 1) void terminer(next); else void suivant(next); }}>Aucun / zéro</button><button disabled={attente} className="min-h-[48px] border border-blue p-3" onClick={() => { const next = { ...modifier(d, etape.cle, 0), inconnues: [...new Set([...(d.inconnues ?? []), etape.cle])] }; if (index === etapes.length - 1) void terminer(next); else void suivant(next); }}>Je ne sais pas : à retrouver</button></div>}
      </>}

      <div className="mt-6 flex items-center justify-between gap-4 text-sm">{index > 0 ? <button disabled={attente} type="button" onClick={precedent} className="underline">← Question précédente</button> : <span />}<span className="text-right text-text-soft">À votre rythme, reprise possible</span></div>
      <p role="status" className="mt-3 text-sm text-green">{sauvegarde}</p>
      {erreur && <p role="alert" className="mt-4 border border-red bg-red-bg p-3">{erreur}</p>}
      <p className="mt-5 border-t border-grey-line pt-4 text-[0.88rem] text-text-soft">Aucun nom de proche, aucune adresse ni aucun document n’est demandé. Vos réponses sont enregistrées dans votre espace pour reprendre sur un autre appareil. Conservez votre lien personnel pour vous.</p>
    </div>
  </section>;
}

function Resultat({ d, s }: { d: Donnees; s: Saisie }) {
  const r = calculer(s, new Date().getFullYear());
  const plan = planPreparation(d), points = pointsPreparation(d), pieces = dossierProfessionnel(d);
  const raisons = raisonsChiffrage(d);
  if (raisons.length) return <div className="border-2 border-green bg-green-bg p-5">
    <h2 className="text-[1.5rem]">Votre plan : les étapes adaptées à vos réponses</h2>
    <p className="mt-3 font-bold">Commencez par cette action</p><p className="mt-2">{plan[0]}</p>
    <h3 className="mt-6">Pour établir votre chiffrage personnel</h3><ul className="mt-3 list-disc space-y-2 pl-5">{raisons.map(x => <li key={x}>{x}</li>)}</ul>
    {informationsARetrouver(d).length > 0 && <><h3 className="mt-6">Où retrouver les informations manquantes</h3><ul className="mt-3 list-disc pl-5">{informationsARetrouver(d).map(x => <li key={x}>{x}</li>)}</ul></>}
    <h3 className="mt-6">Vos prochaines actions, dans l’ordre</h3><ol className="mt-3 list-decimal space-y-3 pl-5">{plan.map(x => <li key={x}>{x}</li>)}</ol>
    <h3 className="mt-6">Les points propres à votre situation</h3>{points.map(p => <article key={p.cle} className="my-4 bg-white p-4"><h4 className="font-bold">{p.titre}</h4><p>{p.constat}</p><ul className="mt-3 list-disc pl-5">{p.actions.map(x => <li key={x}>{x}</li>)}</ul></article>)}
    <h3 className="mt-6">Vos pièces pour le rendez-vous</h3><ul className="mt-3 list-disc pl-5">{pieces.map(x => <li key={x}>{x}</li>)}</ul>
    <p className="mt-5 font-bold">Cette étape est préparée lorsque vos informations connues et vos questions restantes sont réunies dans le même dossier.</p>
  </div>;
  return <div className="border-2 border-green bg-green-bg p-5"><h2 className="text-[1.5rem]">Votre estimation indicative : {euros(r.total)}</h2><p className="my-3">Masse nette saisie : {euros(r.masse)} · {r.parts.length} personne(s) incluse(s) dans le scénario.</p><div className="my-5 border-2 border-blue bg-white p-4"><p className="font-bold text-blue">Voici comment utiliser ce résultat.</p><p className="mt-2">Il met vos priorités, vos hypothèses et vos pièces dans le bon ordre. Le professionnel pourra ensuite confronter cette préparation à la loi, aux contrats enregistrés et aux actes en vigueur.</p></div><h3 className="mt-5">Vos points de vigilance personnels</h3><div className="mt-3 space-y-4">{points.map(point => <article key={point.cle} className="border-l-4 border-orange bg-white p-4"><p className="font-bold text-blue">{point.titre}</p><p className="mt-1">{point.constat}</p><p className="mt-3 font-bold">À préparer :</p><ul className="mt-1 list-disc space-y-1 pl-6">{point.actions.map(action => <li key={action}>{action}</li>)}</ul><p className="mt-3 text-sm"><strong>Ce qui donnera un effet réel :</strong> {point.effetReel}</p></article>)}</div><h3 className="mt-5">Votre ordre de préparation</h3><ol className="mt-3 list-decimal space-y-2 pl-6">{plan.map(p => <li key={p}>{p}</li>)}</ol><h3 className="mt-5">Votre dossier pour le professionnel</h3><ul className="mt-3 list-disc space-y-2 pl-6">{pieces.map(piece => <li key={piece}>{piece}</li>)}</ul>{r.hypotheses.length > 0 && <details className="mt-5"><summary className="cursor-pointer font-bold">Hypothèses et limites du calcul</summary><ul className="mt-3 list-disc space-y-2 pl-6">{r.hypotheses.map(h => <li key={h}>{h}</li>)}</ul></details>}<p className="mt-4 text-sm">Conservez ce résultat avec les réponses et les actes que le professionnel aura confirmés.</p></div>;
}
