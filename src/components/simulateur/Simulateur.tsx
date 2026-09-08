"use client";

import { useEffect, useMemo, useState } from "react";
import { VERIFIE_LE, partNuePropriete } from "@/lib/simulateur/bareme";
import { calculer } from "@/lib/simulateur/moteur";
import { SAISIE_VIDE, type Bien, type Heritier, type Saisie } from "@/lib/simulateur/types";

/**
 * LE SIMULATEUR AUTOMATIQUE.
 *
 * ═══ LA RÈGLE QUI COMMANDE TOUT LE RESTE ═══
 *
 * RIEN NE SORT DE CE NAVIGATEUR. Aucun `fetch`, aucune server action, aucun
 * cookie ne transporte ce que le client saisit. Tout vit dans `localStorage`,
 * sur sa machine, et le calcul se fait dans sa page.
 *
 * Ce n'est pas une précaution technique, c'est l'argument de vente numéro un :
 * cet acheteur ne confiera jamais l'inventaire de ce qu'il possède à un site
 * qu'il ne connaît pas. Et ça supprime au passage toute la question RGPD — il
 * n'y a pas de donnée à protéger, puisqu'il n'y a pas de donnée collectée.
 *
 * ⚠️ Toute évolution qui enverrait ces données quelque part — sauvegarde,
 * statistiques, « pour vous aider » — casse la promesse écrite à l'écran. Il
 * faudrait alors retirer la phrase avant d'écrire la ligne de code.
 *
 * ═══ POURQUOI UNE QUESTION PAR ÉCRAN ═══
 *
 * Le lecteur a 75 ans et il a peur de mal faire. Un formulaire long lui montre
 * tout ce qu'il ne sait pas encore, d'un coup. Une question seule, avec un
 * bouton pour avancer et un pour revenir, ne lui montre que ce qu'il peut
 * traiter maintenant. Et il peut fermer la page : il retrouvera sa place.
 */

const CLE = "hi_simulateur";

type Etape = { titre: string; aide?: string };

const ETAPES: Etape[] = [
  { titre: "Votre âge", aide: "C'est lui qui commande deux de vos trois dates." },
  { titre: "Votre situation" },
  { titre: "Vos héritiers", aide: "Ceux à qui vous voulez laisser quelque chose." },
  { titre: "Ce que vous possédez", aide: "Des ordres de grandeur suffisent." },
  { titre: "Vos contrats d'assurance-vie" },
  { titre: "Vos donations déjà déclarées" },
  { titre: "Votre chiffre" },
];

const id = (n: number) => `x${n}`;

const euros = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const euros2 = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);

export function Simulateur({ anneeCourante }: { anneeCourante: number }) {
  const [etape, setEtape] = useState(0);
  const [s, setS] = useState<Saisie>(SAISIE_VIDE);
  const [charge, setCharge] = useState(false);

  // Reprise automatique. On ne la signale qu'une fois chargée, pour ne pas
  // annoncer une reprise à quelqu'un qui arrive pour la première fois.
  useEffect(() => {
    try {
      const v = localStorage.getItem(CLE);
      if (v) {
        const d = JSON.parse(v);
        if (d && typeof d === "object") {
          setS({ ...SAISIE_VIDE, ...d.saisie });
          setEtape(Math.min(d.etape ?? 0, ETAPES.length - 1));
        }
      }
    } catch {}
    setCharge(true);
  }, []);

  useEffect(() => {
    if (!charge) return;
    try {
      localStorage.setItem(CLE, JSON.stringify({ saisie: s, etape }));
    } catch {}
  }, [s, etape, charge]);

  const r = useMemo(() => calculer(s, anneeCourante), [s, anneeCourante]);

  if (!charge) return null;

  const maj = (p: Partial<Saisie>) => setS((v) => ({ ...v, ...p }));

  return (
    <div className="wrap py-8">
      <p className="mb-2 text-[0.85rem] uppercase tracking-wide text-text-soft">
        Étape {etape + 1} sur {ETAPES.length}
      </p>
      <div className="mb-5 h-2 w-full bg-grey-bg" aria-hidden>
        <div
          className="h-2 bg-orange transition-all"
          style={{ width: `${((etape + 1) / ETAPES.length) * 100}%` }}
        />
      </div>

      <h1 className="mb-2 text-[1.5rem] sm:text-[1.9rem]">{ETAPES[etape].titre}</h1>
      {ETAPES[etape].aide && <p className="mb-5 text-[1.05rem]">{ETAPES[etape].aide}</p>}

      {etape === 0 && (
        <Nombre
          libelle="Quel âge avez-vous ?"
          valeur={s.age}
          onChange={(n) => maj({ age: n })}
          suffixe="ans"
        />
      )}

      {etape === 1 && (
        <Choix
          libelle="Aujourd'hui, vous vivez…"
          valeur={s.vie}
          onChange={(v) => maj({ vie: v })}
          options={[
            ["M", "Marié(e)"],
            ["P", "Pacsé(e)"],
            ["U", "En couple, sans mariage ni PACS"],
            ["V", "Veuf ou veuve"],
            ["S", "Seul(e)"],
          ]}
        />
      )}

      {etape === 2 && (
        <Heritiers liste={s.heritiers} onChange={(heritiers) => maj({ heritiers })} />
      )}

      {etape === 3 && <Biens liste={s.biens} onChange={(biens) => maj({ biens })} age={s.age} />}

      {etape === 4 && (
        <Contrats liste={s.contrats} onChange={(contrats) => maj({ contrats })} age={s.age} />
      )}

      {etape === 5 && (
        <Donations liste={s.donations} onChange={(donations) => maj({ donations })} />
      )}

      {etape === 6 && <Resultat r={r} />}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {etape > 0 && (
          <button
            type="button"
            onClick={() => setEtape((e) => e - 1)}
            className="flex min-h-[52px] flex-1 items-center justify-center border border-grey-line bg-white px-4 text-[1.05rem]"
          >
            Revenir
          </button>
        )}
        {etape < ETAPES.length - 1 && (
          <button
            type="button"
            onClick={() => setEtape((e) => e + 1)}
            className="flex min-h-[60px] flex-1 items-center justify-center border-b-4 border-orange-dark bg-orange px-5 text-[1.15rem] font-bold text-white"
          >
            Continuer
          </button>
        )}
      </div>

      <p className="mt-6 border-t border-grey-line pt-4 text-[0.9rem] text-text-soft">
        Ce que vous saisissez reste sur votre ordinateur. Rien n&apos;est envoyé, rien n&apos;est
        enregistré chez nous. Vous pouvez fermer cette page : vous retrouverez votre place.
      </p>
    </div>
  );
}

/* ── Les briques de saisie ─────────────────────────────────────── */

function Nombre({
  libelle,
  valeur,
  onChange,
  suffixe,
}: {
  libelle: string;
  valeur: number | undefined;
  onChange: (n: number | undefined) => void;
  suffixe?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[1.1rem] font-bold text-blue">{libelle}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={valeur ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          className="min-h-[52px] w-40 border border-grey-line px-3 text-[1.2rem]"
        />
        {suffixe && <span className="text-[1.05rem]">{suffixe}</span>}
      </span>
    </label>
  );
}

function Choix({
  libelle,
  valeur,
  onChange,
  options,
}: {
  libelle: string;
  valeur: string | undefined;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-3 p-0 text-[1.1rem] font-bold text-blue">{libelle}</legend>
      <div className="space-y-2">
        {options.map(([code, texte]) => (
          <label
            key={code}
            className={`flex min-h-[52px] cursor-pointer items-center gap-3 border px-4 text-[1.05rem] ${
              valeur === code ? "border-blue bg-grey-bg" : "border-grey-line bg-white"
            }`}
          >
            <input
              type="radio"
              checked={valeur === code}
              onChange={() => onChange(code)}
              className="h-5 w-5"
            />
            {texte}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Heritiers({ liste, onChange }: { liste: Heritier[]; onChange: (l: Heritier[]) => void }) {
  return (
    <div className="space-y-4">
      {liste.map((h, i) => (
        <div key={h.id} className="border border-grey-line bg-white p-4">
          <input
            value={h.prenom}
            placeholder="Prénom"
            onChange={(e) =>
              onChange(liste.map((x, j) => (i === j ? { ...x, prenom: e.target.value } : x)))
            }
            className="mb-3 min-h-[48px] w-full border border-grey-line px-3 text-[1.05rem]"
          />
          <Choix
            libelle="Son lien avec vous"
            valeur={h.lien}
            onChange={(v) =>
              onChange(liste.map((x, j) => (i === j ? { ...x, lien: v as Heritier["lien"] } : x)))
            }
            options={[
              ["enfant", "Mon enfant"],
              ["petit-enfant", "Mon petit-enfant"],
              ["fratrie", "Mon frère ou ma sœur"],
              ["neveu", "Mon neveu ou ma nièce"],
              ["sans-lien", "Aucun lien de parenté"],
            ]}
          />
          <label className="mt-3 flex min-h-[44px] items-center gap-3 text-[1rem]">
            <input
              type="checkbox"
              checked={!!h.duConjointNonAdopte}
              onChange={(e) =>
                onChange(
                  liste.map((x, j) =>
                    i === j ? { ...x, duConjointNonAdopte: e.target.checked } : x,
                  ),
                )
              }
              className="h-5 w-5"
            />
            C&apos;est l&apos;enfant de mon conjoint, et je ne l&apos;ai pas adopté
          </label>
          <button
            type="button"
            onClick={() => onChange(liste.filter((_, j) => j !== i))}
            className="mt-3 min-h-[44px] text-[0.95rem] text-link underline"
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...liste, { id: id(liste.length), prenom: "", lien: "enfant" }])}
        className="flex min-h-[52px] w-full items-center justify-center border-2 border-blue bg-white px-4 text-[1.05rem] font-bold text-blue"
      >
        Ajouter un héritier
      </button>
    </div>
  );
}

function Biens({
  liste,
  onChange,
  age,
}: {
  liste: Bien[];
  onChange: (l: Bien[]) => void;
  age?: number;
}) {
  return (
    <div className="space-y-4">
      {liste.map((b, i) => (
        <div key={b.id} className="border border-grey-line bg-white p-4">
          <input
            value={b.libelle}
            placeholder="Ce que c'est (la maison, les livrets…)"
            onChange={(e) =>
              onChange(liste.map((x, j) => (i === j ? { ...x, libelle: e.target.value } : x)))
            }
            className="mb-3 min-h-[48px] w-full border border-grey-line px-3 text-[1.05rem]"
          />
          <Nombre
            libelle="Ce que ça vaut aujourd'hui, à peu près"
            valeur={b.valeur || undefined}
            onChange={(n) =>
              onChange(liste.map((x, j) => (i === j ? { ...x, valeur: n ?? 0 } : x)))
            }
            suffixe="€"
          />
          <label className="mt-3 flex min-h-[44px] items-center gap-3 text-[1rem]">
            <input
              type="checkbox"
              checked={!!b.enCommun}
              onChange={(e) =>
                onChange(liste.map((x, j) => (i === j ? { ...x, enCommun: e.target.checked } : x)))
              }
              className="h-5 w-5"
            />
            Ce bien est en commun avec mon conjoint
          </label>
          <button
            type="button"
            onClick={() => onChange(liste.filter((_, j) => j !== i))}
            className="mt-3 min-h-[44px] text-[0.95rem] text-link underline"
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...liste, { id: id(liste.length), libelle: "", type: "autre", valeur: 0 }])
        }
        className="flex min-h-[52px] w-full items-center justify-center border-2 border-blue bg-white px-4 text-[1.05rem] font-bold text-blue"
      >
        Ajouter un bien
      </button>
      {age !== undefined && liste.some((b) => b.valeur > 0) && (
        <p className="border-l-4 border-orange bg-yellow-bg p-3 text-[0.98rem]">
          À {age} ans, si vous donniez la nue-propriété d&apos;un bien, elle serait comptée pour{" "}
          <strong>{Math.round(partNuePropriete(age) * 100)} %</strong> de sa valeur (art. 669).
          {age <= 70 && " À partir de 71 ans, ce sera 70 %."}
        </p>
      )}
    </div>
  );
}

function Contrats({
  liste,
  onChange,
  age,
}: {
  liste: Saisie["contrats"];
  onChange: (l: Saisie["contrats"]) => void;
  age?: number;
}) {
  return (
    <div className="space-y-4">
      <p className="border-l-4 border-blue bg-grey-bg p-3 text-[1rem]">
        Ce qui compte ici, c&apos;est la <strong>date de vos versements</strong>, pas la date
        d&apos;ouverture du contrat. Un contrat ouvert à 40 ans n&apos;est pas protégé pour autant
        si l&apos;argent y a été versé à 72.
      </p>
      {liste.map((c, i) => (
        <div key={c.id} className="border border-grey-line bg-white p-4">
          <input
            value={c.libelle}
            placeholder="Le contrat (celui de la banque, l'autre…)"
            onChange={(e) =>
              onChange(liste.map((x, j) => (i === j ? { ...x, libelle: e.target.value } : x)))
            }
            className="mb-3 min-h-[48px] w-full border border-grey-line px-3 text-[1.05rem]"
          />
          <Nombre
            libelle="Versé AVANT mes 70 ans"
            valeur={c.verseAvant70 || undefined}
            onChange={(n) =>
              onChange(liste.map((x, j) => (i === j ? { ...x, verseAvant70: n ?? 0 } : x)))
            }
            suffixe="€"
          />
          <div className="mt-3">
            <Nombre
              libelle="Versé APRÈS mes 70 ans"
              valeur={c.verseApres70 || undefined}
              onChange={(n) =>
                onChange(liste.map((x, j) => (i === j ? { ...x, verseApres70: n ?? 0 } : x)))
              }
              suffixe="€"
            />
          </div>
          <div className="mt-3">
            <Nombre
              libelle="Combien de bénéficiaires se le partagent"
              valeur={c.beneficiaires || undefined}
              onChange={(n) =>
                onChange(liste.map((x, j) => (i === j ? { ...x, beneficiaires: n ?? 1 } : x)))
              }
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(liste.filter((_, j) => j !== i))}
            className="mt-3 min-h-[44px] text-[0.95rem] text-link underline"
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...liste,
            {
              id: id(liste.length),
              libelle: "",
              verseAvant70: 0,
              verseApres70: 0,
              beneficiaires: 1,
            },
          ])
        }
        className="flex min-h-[52px] w-full items-center justify-center border-2 border-blue bg-white px-4 text-[1.05rem] font-bold text-blue"
      >
        Ajouter un contrat
      </button>
      {age !== undefined && age < 70 && (
        <p className="border-l-4 border-orange bg-yellow-bg p-3 text-[0.98rem]">
          Il vous reste <strong>{(70 - age) * 12} mois</strong> avant votre 70e anniversaire.
          Au-delà, l&apos;abattement passe de 152 500 € par bénéficiaire (art. 990 I) à 30 500 € au
          total, tous contrats confondus (art. 757 B).
        </p>
      )}
    </div>
  );
}

function Donations({
  liste,
  onChange,
}: {
  liste: Saisie["donations"];
  onChange: (l: Saisie["donations"]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="border-l-4 border-blue bg-grey-bg p-3 text-[1rem]">
        Uniquement les donations <strong>déclarées</strong> : ce sont elles qui font courir le
        compteur de 15 ans (art. 784). Si vous n&apos;en avez jamais déclaré, laissez vide —
        c&apos;est une bonne nouvelle, et le résultat vous le dira.
      </p>
      {liste.map((d, i) => (
        <div key={d.id} className="border border-grey-line bg-white p-4">
          <Nombre
            libelle="Année de la déclaration"
            valeur={d.annee || undefined}
            onChange={(n) => onChange(liste.map((x, j) => (i === j ? { ...x, annee: n ?? 0 } : x)))}
          />
          <div className="mt-3">
            <Nombre
              libelle="Montant"
              valeur={d.montant || undefined}
              onChange={(n) =>
                onChange(liste.map((x, j) => (i === j ? { ...x, montant: n ?? 0 } : x)))
              }
              suffixe="€"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(liste.filter((_, j) => j !== i))}
            className="mt-3 min-h-[44px] text-[0.95rem] text-link underline"
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...liste, { id: id(liste.length), annee: 0, montant: 0, pour: "" }])
        }
        className="flex min-h-[52px] w-full items-center justify-center border-2 border-blue bg-white px-4 text-[1.05rem] font-bold text-blue"
      >
        Ajouter une donation déclarée
      </button>
    </div>
  );
}

/* ── Le résultat ───────────────────────────────────────────────── */

function Resultat({ r }: { r: ReturnType<typeof calculer> }) {
  return (
    <div className="space-y-6">
      <div className="border-2 border-red bg-red-bg p-5 text-center">
        <p className="text-[0.85rem] uppercase tracking-wide text-red">
          Ce que vos héritiers devraient payer
        </p>
        <p className="my-1 text-[3rem] font-bold leading-none text-red">{euros(r.total)}</p>
        <p className="text-[1rem]">sur un patrimoine de {euros(r.masse)}</p>
      </div>

      {r.parts.map((p) => (
        <div key={p.heritier.id} className="border border-grey-line bg-white p-4">
          <h2 className="mb-2 text-[1.15rem] text-blue">
            {p.heritier.prenom || "Cet héritier"} — {euros(p.droits + p.droitsAssuranceVie)}
          </h2>
          <table className="w-full text-left text-[0.98rem]">
            <tbody>
              <tr className="border-b border-grey-line-soft">
                <td className="py-1">Sa part</td>
                <td className="py-1 text-right tabular-nums">{euros(p.part)}</td>
              </tr>
              <tr className="border-b border-grey-line-soft">
                <td className="py-1">
                  Son abattement <span className="text-text-soft">({p.abattementArticle})</span>
                </td>
                <td className="py-1 text-right tabular-nums">− {euros(p.abattement)}</td>
              </tr>
              <tr className="border-b border-grey-line font-bold">
                <td className="py-1">Sa base taxable</td>
                <td className="py-1 text-right tabular-nums">{euros(p.base)}</td>
              </tr>
              {p.lignes.map((l) => (
                <tr key={l.de} className="border-b border-grey-line-soft">
                  <td className="py-1 text-text-soft">
                    de {euros(l.de)} à {euros(l.a)} — {Math.round(l.taux * 100)} %
                  </td>
                  <td className="py-1 text-right tabular-nums text-text-soft">
                    {euros2(l.montant)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-1">Droits — art. 777</td>
                <td className="py-1 text-right tabular-nums">{euros2(p.droits)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div className="border-2 border-blue bg-white p-4">
        <h2 className="mb-3 text-[1.2rem] text-blue">Vos 3 dates</h2>
        <ul className="space-y-3">
          {r.dates.map((d) => (
            <li key={d.cle} className="border-l-4 border-orange pl-3">
              <p className="font-bold">{d.libelle}</p>
              <p className="text-[0.95rem] text-text-soft">
                {d.article}
                {d.moisRestants !== null &&
                  (d.moisRestants > 0
                    ? ` — dans ${d.moisRestants} mois`
                    : " — cette date est derrière vous")}
              </p>
              {d.note && <p className="mt-1 text-[0.98rem]">{d.note}</p>}
            </li>
          ))}
        </ul>
      </div>

      {r.hypotheses.length > 0 && (
        <div className="border border-grey-line bg-grey-bg p-4">
          <h2 className="mb-2 text-[1.05rem] font-bold text-blue">Ce que ce calcul suppose</h2>
          <ul className="space-y-2 text-[0.98rem]">
            {r.hypotheses.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden className="shrink-0">
                  ·
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="border-t border-grey-line pt-4 text-[0.9rem] text-text-soft">
        Estimation pédagogique, calculée sur le droit en vigueur au {VERIFIE_LE}. Elle ne constitue
        pas un conseil personnalisé. Seul votre notaire peut chiffrer votre situation et tenir
        compte de ce que ce simulateur ignore.
      </p>
    </div>
  );
}
