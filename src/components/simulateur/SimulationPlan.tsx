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
const champ = "field mt-1 min-w-0 max-w-full";
export function SimulationPlan({ verrouille, children, demarrerOffre }: { verrouille: boolean; children?: ReactNode; demarrerOffre?:(reponses:Reponses)=>Promise<{ok:boolean;error?:string}> }) {
  const router=useRouter();
  const [d,setD]=useState<Donnees>(DONNEES_VIDES),[commence,setCommence]=useState(!verrouille),[termine,setTermine]=useState(false),[attente,setAttente]=useState(false),[erreur,setErreur]=useState("");
  useEffect(()=>{const frame=requestAnimationFrame(()=>{try{const v=localStorage.getItem(CLE_SIMULATION);if(v){setD({...DONNEES_VIDES,...JSON.parse(v),handicap:0});if(!verrouille)setTermine(true);}}catch{}});return()=>cancelAnimationFrame(frame);},[verrouille]);
  const s=donneesVersSaisie(d), resultat=calculer(s,new Date().getFullYear());
  const nombreHeritiers=s.heritiers.length;
  const setNombre=(cle:keyof Donnees,valeur:string)=>setD(v=>({...v,[cle]:Math.max(0,Number(valeur)||0)}));
  async function terminer(){
    if(nombreHeritiers<1||attente)return;
    setAttente(true);setErreur("");
    try {
      try{localStorage.setItem(CLE_SIMULATION,JSON.stringify(d));}catch{}
      if(demarrerOffre){
        const age=d.age<60?"a":d.age<65?"b":d.age<70?"c":d.age===70?"d":"e";
        const enfants=d.beauxEnfants>0?"R":d.enfants===0?"0":d.enfants===1?"1":"2";
        const objectif=d.avAvant+d.avApres>0?"assurance-vie":d.residence>0?"maison":"facture";
        const r=await demarrerOffre({objectif,vie:d.vie,enfants,age,av:d.avAvant+d.avApres>0?"O":"N",blocage:"ordre"});
        if(!r.ok){setErreur(r.error??"Impossible de préparer l’offre.");return;}
        router.refresh();
      }
      setTermine(true);
    } catch {
      setErreur("La connexion a été interrompue. Vos réponses restent affichées : réessayez.");
    } finally { setAttente(false); }
  }
  const alertes=pointsPreparation(d);
  if(!commence)return <button onClick={()=>setCommence(true)} className="min-h-[58px] w-full bg-orange px-5 py-4 text-[1.15rem] font-bold text-white">Simuler pour ma situation</button>;
  return <section className="my-6 border-2 border-blue bg-white p-4 sm:p-6">
    <p className="font-bold text-orange-dark">ÉTAPE 1 — VOTRE SIMULATION</p>
    <h2 className="my-3 text-[1.5rem]">Répondez maintenant : votre aperçu sera préparé à partir de vos informations</h2>
    <p className="mb-5">Aucun nom de proche, adresse ni donnée de santé n’est demandé. Pour un bien détenu à plusieurs, indiquez seulement la part que vous souhaitez modéliser et faites-la ensuite confirmer.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <label>Votre âge<input className={champ} type="number" min="18" max="120" value={d.age} onChange={e=>setNombre("age",e.target.value)}/></label>
      <label>Votre situation<select className={champ} value={d.vie} onChange={e=>setD(v=>({...v,vie:e.target.value}))}><option value="M">Marié(e)</option><option value="P">Pacsé(e)</option><option value="U">En couple sans mariage ni PACS</option><option value="V">Veuf ou veuve</option><option value="S">Seul(e)</option></select></label>
      <Montant titre="Part de la résidence principale à modéliser" valeur={d.residence} change={v=>setNombre("residence",v)}/><Montant titre="Part des autres biens immobiliers à modéliser" valeur={d.immobilier} change={v=>setNombre("immobilier",v)}/>
      <Montant titre="Épargne disponible" valeur={d.epargne} change={v=>setNombre("epargne",v)}/><Montant titre="Titres et placements" valeur={d.titres} change={v=>setNombre("titres",v)}/>
      <Montant titre="Autres biens" valeur={d.autres} change={v=>setNombre("autres",v)}/><Montant titre="Dettes estimées" valeur={d.dettes} change={v=>setNombre("dettes",v)}/>
    </div>
    <h3 className="mb-1 mt-6 text-[1.2rem]">Personnes incluses dans votre scénario</h3>
    <p className="mb-3 text-[0.9rem] text-text-soft">Cette liste ne détermine pas vos héritiers légaux. Elle sert uniquement à construire le scénario que vous souhaitez examiner.</p>
    <div className="grid gap-4 sm:grid-cols-3">
      <Nombre titre="Enfants" valeur={d.enfants} change={v=>setNombre("enfants",v)}/><Nombre titre="Enfants du conjoint non adoptés" valeur={d.beauxEnfants} change={v=>setNombre("beauxEnfants",v)}/><Nombre titre="Petits-enfants" valeur={d.petitsEnfants} change={v=>setNombre("petitsEnfants",v)}/>
      <Nombre titre="Frères ou sœurs" valeur={d.fratrie} change={v=>setNombre("fratrie",v)}/><Nombre titre="Neveux ou nièces" valeur={d.neveux} change={v=>setNombre("neveux",v)}/><Nombre titre="Autres personnes" valeur={d.sansLien} change={v=>setNombre("sansLien",v)}/>
    </div>
    <h3 className="mb-1 mt-6 text-[1.2rem]">Votre capacité de décider et votre maison</h3>
    <p className="mb-3 text-[0.9rem] text-text-soft">Ces réponses ne créent aucun droit. Elles servent à faire apparaître les décisions personnelles à préparer avant un rendez-vous professionnel.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Choix titre="Avez-vous déjà signé un dispositif officiel pour être représenté si vous ne pouviez plus gérer vos intérêts ?" valeur={d.protectionSignee} change={v=>setD(a=>({...a,protectionSignee:v as Donnees["protectionSignee"]}))} options={[["?","Je ne sais pas"],["N","Non"],["O","Oui"]]}/>
      <Choix titre="Une personne de confiance a-t-elle accepté cette responsabilité ?" valeur={d.personneConfiance} change={v=>setD(a=>({...a,personneConfiance:v as Donnees["personneConfiance"]}))} options={[["?","Nous n’en avons pas encore parlé"],["N","Non ou personne non identifiée"],["O","Oui"]]}/>
      {d.residence>0&&<Choix titre="Comment votre résidence principale est-elle détenue ?" valeur={d.detentionResidence} change={v=>setD(a=>({...a,detentionResidence:v as Donnees["detentionResidence"]}))} options={[["?","Je ne sais pas"],["propre","Par moi seul(e)"],["couple","Avec mon conjoint ou partenaire"],["indivision","En indivision avec une ou plusieurs personnes"]]}/>}
      {d.residence>0&&<Choix titre="Quel est votre souhait principal concernant cette résidence ?" valeur={d.souhaitResidence} change={v=>setD(a=>({...a,souhaitResidence:v as Donnees["souhaitResidence"]}))} options={[["?","Je ne l’ai pas encore décidé"],["rester","Pouvoir y vivre aussi longtemps que possible"],["transmettre","Permettre à un proche de la conserver"],["vendre","Éviter qu’une vente éventuelle se bloque"]]}/>}
    </div>
    <h3 className="mb-3 mt-6 text-[1.2rem]">Assurance-vie et donations passées</h3>
    <div className="grid gap-4 sm:grid-cols-2"><Montant titre="Versements avant 70 ans" valeur={d.avAvant} change={v=>setNombre("avAvant",v)}/><Montant titre="Versements après 70 ans" valeur={d.avApres} change={v=>setNombre("avApres",v)}/><Nombre titre="Bénéficiaires assurance-vie" valeur={d.beneficiaires} change={v=>setNombre("beneficiaires",v)}/><label>Année de la dernière donation<input className={champ} type="number" min="1900" max={new Date().getFullYear()} value={d.donationAnnee||""} onChange={e=>setNombre("donationAnnee",e.target.value)}/></label><Montant titre="Montant approximatif de cette donation" valeur={d.donationMontant} change={v=>setNombre("donationMontant",v)}/></div>
    {nombreHeritiers<1&&<p role="alert" className="mt-4 border border-red bg-red-bg p-3">Indiquez au moins une personne susceptible de recevoir.</p>}
    <button type="button" onClick={terminer} disabled={nombreHeritiers<1||attente} className="mt-6 min-h-[56px] w-full bg-blue px-5 py-3 font-bold text-white disabled:opacity-50">{attente?"Préparation en cours…":"Préparer mon aperçu personnalisé"}</button>
    {erreur&&<p role="alert" className="mt-3 border border-red bg-red-bg p-3">{erreur}</p>}
    {termine&&<div className="mt-6 border-t-2 border-blue pt-5">
      <p className="font-bold text-green">Votre simulation est prête.</p>
      <h3 className="my-3 text-[1.4rem]">{alertes.length||1} point{alertes.length>1?"s":""} de vigilance détecté{alertes.length>1?"s":""}</h3>
      <ul className="mb-5 list-disc space-y-2 pl-6">{(alertes.length?alertes.map(a=>a.titre):["La composition de votre patrimoine et les personnes incluses dans le scénario doivent être reliées dans un ordre clair."]).slice(0,3).map(a=><li key={a}>{a}</li>)}</ul>
      {verrouille?<><div className="relative overflow-hidden border-2 border-grey-line bg-grey-bg p-5"><div className="select-none blur-[7px]" aria-hidden="true"><p className="text-[1.6rem] font-bold">Estimation : {euros(resultat.total)}</p><p>Votre ordre de vérification personnalisé et vos échéances apparaissent ici.</p></div><div className="absolute inset-0 flex items-center justify-center bg-white/70 p-5 text-center font-bold text-blue">Déverrouillez votre estimation détaillée et votre plan adapté</div></div>{children}</>:<Resultat d={d} s={s}/>} 
    </div>}
  </section>;
}
function Montant({titre,valeur,change}:{titre:string;valeur:number;change:(v:string)=>void}){return <label>{titre} (€)<input className={champ} type="number" min="0" step="1000" value={valeur||""} onChange={e=>change(e.target.value)}/></label>}
function Nombre({titre,valeur,change}:{titre:string;valeur:number;change:(v:string)=>void}){return <label>{titre}<input className={champ} type="number" min="0" max="30" value={valeur} onChange={e=>change(e.target.value)}/></label>}
function Choix({titre,valeur,change,options}:{titre:string;valeur:string;change:(v:string)=>void;options:[string,string][]}){return <label>{titre}<select className={champ} value={valeur} onChange={e=>change(e.target.value)}>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
function Resultat({d,s}:{d:Donnees;s:Saisie}){const r=calculer(s,new Date().getFullYear());const plan=planPreparation(d),points=pointsPreparation(d),pieces=dossierProfessionnel(d);return <div className="border-2 border-green bg-green-bg p-5"><h2 className="text-[1.5rem]">Votre estimation indicative : {euros(r.total)}</h2><p className="my-3">Masse nette saisie : {euros(r.masse)} · {r.parts.length} personne(s) incluse(s) dans le scénario.</p><div className="my-5 border-2 border-blue bg-white p-4"><p className="font-bold text-blue">Ce résultat n’a aucun effet juridique à lui seul.</p><p className="mt-2">Il prépare les décisions et les pièces à apporter. Seuls la loi, les contrats réellement enregistrés et les actes valablement établis détermineront vos droits.</p></div><h3 className="mt-5">Vos points de vigilance personnels</h3><div className="mt-3 space-y-4">{points.map(point=><article key={point.cle} className="border-l-4 border-orange bg-white p-4"><p className="font-bold text-blue">{point.titre}</p><p className="mt-1">{point.constat}</p><p className="mt-3 font-bold">À préparer :</p><ul className="mt-1 list-disc space-y-1 pl-6">{point.actions.map(action=><li key={action}>{action}</li>)}</ul><p className="mt-3 text-sm"><strong>Ce qui donnera un effet réel :</strong> {point.effetReel}</p></article>)}</div><h3 className="mt-5">Votre ordre de préparation</h3><ol className="mt-3 list-decimal space-y-2 pl-6">{plan.map(p=><li key={p}>{p}</li>)}</ol><h3 className="mt-5">Votre dossier pour le professionnel</h3><ul className="mt-3 list-disc space-y-2 pl-6">{pieces.map(piece=><li key={piece}>{piece}</li>)}</ul>{r.hypotheses.length>0&&<details className="mt-5"><summary className="cursor-pointer font-bold">Hypothèses et limites du calcul</summary><ul className="mt-3 list-disc space-y-2 pl-6">{r.hypotheses.map(h=><li key={h}>{h}</li>)}</ul></details>}<p className="mt-4 text-sm">Ce résultat prépare vos questions ; il ne constitue ni un devis notarial, ni un acte, ni un conseil fiscal personnalisé.</p></div>}
