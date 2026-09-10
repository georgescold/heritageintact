"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { calculer } from "@/lib/simulateur/moteur";
import type { Heritier, Saisie } from "@/lib/simulateur/types";
import { euros } from "@/lib/config";

type Donnees = {
  age: number; vie: string; residence: number; immobilier: number; epargne: number;
  titres: number; autres: number; dettes: number; enfants: number; petitsEnfants: number;
  fratrie: number; neveux: number; sansLien: number; beauxEnfants: number; handicap: number;
  avAvant: number; avApres: number; beneficiaires: number; donationAnnee: number; donationMontant: number;
};
const CLE = "hi_simulation_plan_v1";
const VIDE: Donnees = {age:65,vie:"M",residence:0,immobilier:0,epargne:0,titres:0,autres:0,dettes:0,enfants:1,petitsEnfants:0,fratrie:0,neveux:0,sansLien:0,beauxEnfants:0,handicap:0,avAvant:0,avApres:0,beneficiaires:1,donationAnnee:0,donationMontant:0};

function heritiers(d: Donnees): Heritier[] {
  const liste: Heritier[] = [];
  const ajouter = (n:number,lien:Heritier["lien"],prefixe:string,extra:Partial<Heritier>={}) => {
    for(let i=0;i<Math.max(0,n);i++) liste.push({id:`${prefixe}-${i}`,prenom:`${prefixe} ${i+1}`,lien,...extra});
  };
  ajouter(d.enfants,"enfant","Enfant");
  ajouter(d.beauxEnfants,"enfant","Enfant du conjoint",{duConjointNonAdopte:true});
  ajouter(d.petitsEnfants,"petit-enfant","Petit-enfant");
  ajouter(d.fratrie,"fratrie","Frère ou sœur");
  ajouter(d.neveux,"neveu","Neveu ou nièce");
  ajouter(d.sansLien,"sans-lien","Autre personne");
  for(let i=0;i<Math.min(d.handicap,liste.length);i++) liste[i].handicap=true;
  return liste;
}
function saisie(d: Donnees): Saisie {
  const biens = [
    ["Résidence principale","residence",d.residence], ["Autres biens immobiliers","immobilier",d.immobilier],
    ["Épargne","liquide",d.epargne], ["Titres et placements","titres",d.titres], ["Autres biens","autre",d.autres],
  ].filter(([, , valeur])=>Number(valeur)>0).map(([libelle,type,valeur],i)=>({id:`bien-${i}`,libelle:String(libelle),type:type as "residence"|"immobilier"|"liquide"|"titres"|"autre",valeur:Number(valeur)}));
  return {age:d.age,vie:d.vie,heritiers:heritiers(d),biens,dettes:d.dettes,
    contrats:d.avAvant||d.avApres?[{id:"av-1",libelle:"Contrats déclarés",verseAvant70:d.avAvant,verseApres70:d.avApres,beneficiaires:Math.max(1,d.beneficiaires)}]:[],
    donations:d.donationAnnee?[{id:"don-1",annee:d.donationAnnee,montant:d.donationMontant,pour:"Bénéficiaires déclarés"}]:[]};
}
const champ = "field mt-1 min-w-0 max-w-full";
export function SimulationPlan({ verrouille, children, demarrerOffre }: { verrouille: boolean; children?: ReactNode; demarrerOffre?:()=>Promise<{ok:boolean;error?:string}> }) {
  const router=useRouter();
  const [d,setD]=useState<Donnees>(VIDE),[commence,setCommence]=useState(!verrouille),[termine,setTermine]=useState(false),[attente,setAttente]=useState(false),[erreur,setErreur]=useState("");
  useEffect(()=>{try{const v=localStorage.getItem(CLE);if(v){setD({...VIDE,...JSON.parse(v)});if(!verrouille)setTermine(true);}}catch{}},[verrouille]);
  const s=useMemo(()=>saisie(d),[d]), resultat=useMemo(()=>calculer(s,new Date().getFullYear()),[s]);
  const nombreHeritiers=s.heritiers.length;
  const setNombre=(cle:keyof Donnees,valeur:string)=>setD(v=>({...v,[cle]:Math.max(0,Number(valeur)||0)}));
  async function terminer(){
    if(nombreHeritiers<1||attente)return;
    setAttente(true);setErreur("");
    try {
      try{localStorage.setItem(CLE,JSON.stringify(d));}catch{}
      if(demarrerOffre){
        const r=await demarrerOffre();
        if(!r.ok){setErreur(r.error??"Impossible de préparer l’offre.");return;}
        router.refresh();
      }
      setTermine(true);
    } catch {
      setErreur("La connexion a été interrompue. Vos réponses restent affichées : réessayez.");
    } finally { setAttente(false); }
  }
  const alertes=[
    d.age>=69?"Un repère lié à vos 70 ou 71 ans mérite d’être examiné sans attendre.":null,
    d.beauxEnfants>0?"Un enfant du conjoint non adopté peut relever d’un traitement très différent.":null,
    d.donationAnnee>0?"Une donation passée peut modifier les abattements encore disponibles.":null,
    d.avAvant+d.avApres>0?"Les dates de versement et la clause bénéficiaire de l’assurance-vie doivent être rapprochées.":null,
    d.vie==="U"||d.vie==="P"?"Votre situation de couple change les questions civiles à faire vérifier.":null,
    d.handicap>0?"Un abattement supplémentaire peut être pertinent pour un héritier en situation de handicap.":null,
  ].filter(Boolean) as string[];
  if(!commence)return <button onClick={()=>setCommence(true)} className="min-h-[58px] w-full bg-orange px-5 py-4 text-[1.15rem] font-bold text-white">Simuler pour ma situation</button>;
  return <section className="my-6 border-2 border-blue bg-white p-4 sm:p-6">
    <p className="font-bold text-orange-dark">ÉTAPE 1 — VOTRE SIMULATION</p>
    <h2 className="my-3 text-[1.5rem]">Répondez maintenant : votre aperçu sera préparé à partir de vos informations</h2>
    <p className="mb-5">Aucun nom de proche ni adresse n’est demandé. Indiquez des montants arrondis si vous ne connaissez pas encore les chiffres exacts.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <label>Votre âge<input className={champ} type="number" min="18" max="120" value={d.age} onChange={e=>setNombre("age",e.target.value)}/></label>
      <label>Votre situation<select className={champ} value={d.vie} onChange={e=>setD(v=>({...v,vie:e.target.value}))}><option value="M">Marié(e)</option><option value="P">Pacsé(e)</option><option value="U">En couple sans mariage ni PACS</option><option value="V">Veuf ou veuve</option><option value="S">Seul(e)</option></select></label>
      <Montant titre="Résidence principale" valeur={d.residence} change={v=>setNombre("residence",v)}/><Montant titre="Autres biens immobiliers" valeur={d.immobilier} change={v=>setNombre("immobilier",v)}/>
      <Montant titre="Épargne disponible" valeur={d.epargne} change={v=>setNombre("epargne",v)}/><Montant titre="Titres et placements" valeur={d.titres} change={v=>setNombre("titres",v)}/>
      <Montant titre="Autres biens" valeur={d.autres} change={v=>setNombre("autres",v)}/><Montant titre="Dettes estimées" valeur={d.dettes} change={v=>setNombre("dettes",v)}/>
    </div>
    <h3 className="mb-3 mt-6 text-[1.2rem]">Personnes susceptibles de recevoir</h3>
    <div className="grid gap-4 sm:grid-cols-3">
      <Nombre titre="Enfants" valeur={d.enfants} change={v=>setNombre("enfants",v)}/><Nombre titre="Enfants du conjoint non adoptés" valeur={d.beauxEnfants} change={v=>setNombre("beauxEnfants",v)}/><Nombre titre="Petits-enfants" valeur={d.petitsEnfants} change={v=>setNombre("petitsEnfants",v)}/>
      <Nombre titre="Frères ou sœurs" valeur={d.fratrie} change={v=>setNombre("fratrie",v)}/><Nombre titre="Neveux ou nièces" valeur={d.neveux} change={v=>setNombre("neveux",v)}/><Nombre titre="Autres personnes" valeur={d.sansLien} change={v=>setNombre("sansLien",v)}/>
      <Nombre titre="Dont personnes handicapées" valeur={d.handicap} change={v=>setNombre("handicap",v)}/>
    </div>
    <h3 className="mb-3 mt-6 text-[1.2rem]">Assurance-vie et donations passées</h3>
    <div className="grid gap-4 sm:grid-cols-2"><Montant titre="Versements avant 70 ans" valeur={d.avAvant} change={v=>setNombre("avAvant",v)}/><Montant titre="Versements après 70 ans" valeur={d.avApres} change={v=>setNombre("avApres",v)}/><Nombre titre="Bénéficiaires assurance-vie" valeur={d.beneficiaires} change={v=>setNombre("beneficiaires",v)}/><label>Année de la dernière donation<input className={champ} type="number" min="1900" max={new Date().getFullYear()} value={d.donationAnnee||""} onChange={e=>setNombre("donationAnnee",e.target.value)}/></label><Montant titre="Montant approximatif de cette donation" valeur={d.donationMontant} change={v=>setNombre("donationMontant",v)}/></div>
    {nombreHeritiers<1&&<p role="alert" className="mt-4 border border-red bg-red-bg p-3">Indiquez au moins une personne susceptible de recevoir.</p>}
    <button type="button" onClick={terminer} disabled={nombreHeritiers<1||attente} className="mt-6 min-h-[56px] w-full bg-blue px-5 py-3 font-bold text-white disabled:opacity-50">{attente?"Préparation en cours…":"Préparer mon aperçu personnalisé"}</button>
    {erreur&&<p role="alert" className="mt-3 border border-red bg-red-bg p-3">{erreur}</p>}
    {termine&&<div className="mt-6 border-t-2 border-blue pt-5">
      <p className="font-bold text-green">Votre simulation est prête.</p>
      <h3 className="my-3 text-[1.4rem]">{alertes.length||1} point{alertes.length>1?"s":""} prioritaire{alertes.length>1?"s":""} détecté{alertes.length>1?"s":""}</h3>
      <ul className="mb-5 list-disc space-y-2 pl-6">{(alertes.length?alertes:["La composition de votre patrimoine et les personnes désignées doivent être reliées dans un ordre clair."]).slice(0,3).map(a=><li key={a}>{a}</li>)}</ul>
      {verrouille?<><div className="relative overflow-hidden border-2 border-grey-line bg-grey-bg p-5"><div className="select-none blur-[7px]" aria-hidden="true"><p className="text-[1.6rem] font-bold">Estimation : {euros(resultat.total)}</p><p>Votre ordre de vérification personnalisé et vos échéances apparaissent ici.</p></div><div className="absolute inset-0 flex items-center justify-center bg-white/70 p-5 text-center font-bold text-blue">Déverrouillez votre estimation détaillée et votre plan adapté</div></div>{children}</>:<Resultat d={d} s={s}/>} 
    </div>}
  </section>;
}
function Montant({titre,valeur,change}:{titre:string;valeur:number;change:(v:string)=>void}){return <label>{titre} (€)<input className={champ} type="number" min="0" step="1000" value={valeur||""} onChange={e=>change(e.target.value)}/></label>}
function Nombre({titre,valeur,change}:{titre:string;valeur:number;change:(v:string)=>void}){return <label>{titre}<input className={champ} type="number" min="0" max="30" value={valeur} onChange={e=>change(e.target.value)}/></label>}
function Resultat({d,s}:{d:Donnees;s:Saisie}){const r=calculer(s,new Date().getFullYear());const plan=["Faire confirmer la propriété réelle des biens, les dettes déductibles et les personnes appelées à recevoir.",d.donationAnnee?"Retrouver les actes et déclarations de donations avant de considérer un abattement comme disponible.":"Faire vérifier les abattements disponibles avant toute opération.",d.avAvant+d.avApres>0?"Obtenir la clause bénéficiaire actuellement enregistrée et l’historique des versements.":"Décider si l’assurance-vie fait partie des sujets à examiner.","Comparer les scénarios utiles avec le professionnel avant toute décision irréversible."];return <div className="border-2 border-green bg-green-bg p-5"><h2 className="text-[1.5rem]">Votre estimation pédagogique : {euros(r.total)}</h2><p className="my-3">Masse nette saisie : {euros(r.masse)} · {r.parts.length} bénéficiaire(s) modélisé(s).</p><h3 className="mt-5">Votre ordre de préparation</h3><ol className="mt-3 list-decimal space-y-2 pl-6">{plan.map(p=><li key={p}>{p}</li>)}</ol>{r.hypotheses.length>0&&<details className="mt-5"><summary className="cursor-pointer font-bold">Hypothèses et limites du calcul</summary><ul className="mt-3 list-disc space-y-2 pl-6">{r.hypotheses.map(h=><li key={h}>{h}</li>)}</ul></details>}<p className="mt-4 text-sm">Ce résultat prépare vos questions ; il ne constitue ni un devis notarial ni un conseil fiscal personnalisé.</p></div>}
