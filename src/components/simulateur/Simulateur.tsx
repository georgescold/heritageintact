"use client";
import { useState } from "react";
import { calculerAtelier, type Scenario } from "@/lib/simulateur/atelier";
import { euros } from "@/lib/config";
const INITIAL: Scenario = {
  valeur: 520000,
  enfants: 1,
  parents: 1,
  age: 65,
  mode: "succession",
  confirme: false,
};
export function Simulateur({ anneeCourante }: { anneeCourante: number }) {
  const [s, setS] = useState<Scenario>(INITIAL);
  const [compare, setCompare] = useState<Scenario | null>(null);
  const r = calculerAtelier(s);
  const autre = compare ? calculerAtelier(compare) : null;
  const maj = (p: Partial<Scenario>) => setS((v) => ({ ...v, ...p, confirme: false }));
  return (
    <main className="wrap py-8">
      <p className="font-bold text-orange-dark">Atelier pédagogique · {anneeCourante}</p>
      <h1 className="my-4 text-[2rem]">Comprendre un calcul, comparer des hypothèses</h1>
      <p className="mb-5">
        Les montants préremplis sont fictifs. Cet atelier ne détermine pas les droits civils de
        votre famille et ne calcule pas deux successions successives. Les saisies restent dans cette
        page, sans envoi au serveur ni sauvegarde automatique. Vos anciennes saisies locales ne sont
        pas supprimées, mais ne sont pas reprises dans ce modèle corrigé.
      </p>
      <div className="space-y-4 border border-grey-line p-5">
        <label className="block font-bold">
          Type de calcul
          <select
            className="field mt-2"
            value={s.mode}
            onChange={(e) => maj({ mode: e.target.value as Scenario["mode"], parents: 1 })}
          >
            <option value="succession">Une succession parent → enfants</option>
            <option value="nue-propriete">Une donation de nue-propriété → enfants</option>
          </select>
        </label>
        <label className="block font-bold">
          {s.mode === "succession"
            ? "Montant net attribué aux enfants dans CETTE succession (€)"
            : "Valeur en pleine propriété de la seule quote-part donnée (€)"}
          <input
            className="field mt-2"
            type="number"
            min="0"
            step="1000"
            value={Number.isNaN(s.valeur) ? "" : s.valeur}
            onChange={(e) => maj({ valeur: e.target.value === "" ? NaN : Number(e.target.value) })}
          />
        </label>
        <p className="text-text-soft">
          {s.mode === "succession"
            ? "Ce n’est pas nécessairement le patrimoine total du couple. Les droits du conjoint, la propriété et les dettes doivent avoir été examinés séparément."
            : "Ne comptez pas la part d’un propriétaire qui ne donne pas. Avec deux donateurs, ce modèle suppose des parts égales et le même âge."}
        </p>
        <label className="block font-bold">
          Nombre d’enfants recevant des parts égales
          <input
            className="field mt-2"
            type="number"
            min="1"
            max="20"
            value={Number.isNaN(s.enfants) ? "" : s.enfants}
            onChange={(e) => maj({ enfants: e.target.value === "" ? NaN : Number(e.target.value) })}
          />
        </label>
        {s.mode === "nue-propriete" && (
          <>
            <label className="block font-bold">
              Donateurs
              <select
                className="field mt-2"
                value={s.parents}
                onChange={(e) => maj({ parents: Number(e.target.value) })}
              >
                <option value="1">Un parent</option>
                <option value="2">Deux parents, propriétaires à parts égales et de même âge</option>
              </select>
            </label>
            <label className="block font-bold">
              Âge de l’usufruitier au jour de la donation
              <input
                className="field mt-2"
                type="number"
                min="18"
                max="120"
                value={Number.isNaN(s.age) ? "" : s.age}
                onChange={(e) => maj({ age: e.target.value === "" ? NaN : Number(e.target.value) })}
              />
            </label>
          </>
        )}
        <label className="flex gap-3 border-l-4 border-orange bg-yellow-bg p-4">
          <input
            type="checkbox"
            className="mt-1 h-6 w-6 shrink-0"
            checked={s.confirme}
            onChange={(e) => setS((v) => ({ ...v, confirme: e.target.checked }))}
          />
          <span>
            Je comprends les hypothèses : enfants en ligne directe, parts égales, abattement de 100
            000 € entièrement disponible pour chaque relation parent-enfant, aucune donation
            antérieure fiscalement rappelable, aucun abattement ou régime particulier. Hors
            assurance-vie, frais d’actes, partage, exonérations particulières et international. Je
            ne peux pas appliquer ce résultat si ma situation sort de ce cadre.
          </span>
        </label>
      </div>
      <section className="my-6" aria-live="polite">
        {!r.ok ? (
          <p className="border border-grey-line p-5">{r.raison}</p>
        ) : (
          <>
            <h2 className="text-[1.5rem]">Résultat illustratif : {euros(r.total)}</h2>
            <p className="my-3">
              Droits calculés avant arrondi fiscal final et hors frais. Ce n’est pas un devis de
              notaire.
            </p>
            <dl className="grid grid-cols-2 gap-3 border-y border-grey-line py-4">
              <dt>Valeur fiscale retenue</dt>
              <dd>{euros(r.valeurFiscale)}</dd>
              <dt>Part par relation parent-enfant</dt>
              <dd>{euros(r.partParRelation)}</dd>
              <dt>Base après abattement</dt>
              <dd>{euros(r.baseParRelation)}</dd>
              <dt>Droits par relation</dt>
              <dd>{euros(r.droitsParRelation)}</dd>
              <dt>Nombre de relations</dt>
              <dd>{r.relations}</dd>
            </dl>
            <details className="my-4">
              <summary className="cursor-pointer font-bold">
                Voir le calcul par tranche (par relation)
              </summary>
              <ul className="mt-3 space-y-2">
                {r.lignes.map((l) => (
                  <li key={l.de}>
                    {euros(l.de)} à {euros(l.a)} × {l.taux * 100} % = {euros(l.montant)}
                  </li>
                ))}
              </ul>
              {r.lignes.length === 0 && <p>Base taxable nulle dans ces hypothèses.</p>}
            </details>
            <button
              className="min-h-[48px] border-2 border-blue px-4 font-bold text-blue"
              onClick={() => setCompare({ ...s })}
            >
              Garder ce scénario pour comparer
            </button>
          </>
        )}
      </section>
      {compare && autre?.ok && (
        <section className="my-6 border border-grey-line p-5">
          <h2 className="text-[1.3rem]">Scénario conservé : {euros(autre.total)}</h2>
          <p className="mt-3">
            {compare.mode === "succession" ? "Succession" : "Donation de nue-propriété"} ·{" "}
            {euros(compare.valeur)} · {compare.enfants} enfant(s) · {compare.parents} parent(s)
            {compare.mode === "nue-propriete" && ` · ${compare.age} ans`}.
          </p>
          {r.ok && (
            <p className="my-3">
              Écart actuel − conservé : {euros(r.total - autre.total)}. Cet écart compare des
              hypothèses, pas une économie personnelle garantie. Deux opérations différentes ne sont
              pas équivalentes : frais, patrimoine restant et droits futurs ne sont pas calculés.
            </p>
          )}
          <button className="min-h-[44px] underline" onClick={() => setCompare(null)}>
            Retirer la comparaison
          </button>
        </section>
      )}
      <section className="my-8">
        <h2 className="mb-3 text-[1.4rem]">À faire vérifier avant d’utiliser ces chiffres</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Le montant qui appartient réellement au parent concerné et les parts civiles transmises.
          </li>
          <li>Les donations passées, les exonérations et la situation de chaque enfant.</li>
          <li>
            Le coût total, la protection du donateur, les possibilités de vendre et les conséquences
            au décès.
          </li>
        </ol>
      </section>
      <button
        className="min-h-[48px] border-2 border-blue px-4 font-bold print:hidden"
        onClick={() => window.print()}
      >
        Imprimer les hypothèses et le résultat
      </button>
      <p className="mt-6 text-sm">
        Sources officielles à consulter dans leur version en vigueur :{" "}
        <a href="https://www.impots.gouv.fr/particulier/calcul-et-paiement-des-droits">
          barème et abattements
        </a>{" "}
        ;{" "}
        <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F33076">
          usufruit et nue-propriété
        </a>
        . Les règles doivent être revérifiées avant une décision.
      </p>
    </main>
  );
}
