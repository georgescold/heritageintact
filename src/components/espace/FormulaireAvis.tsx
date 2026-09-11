"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui";
import { CONTACT_EMAIL, URL_AVIS_TRUSTPILOT } from "@/lib/config";
import type { SectionAvis } from "@/lib/avis-questions";

type EtatAvis = { ok: boolean; message: string } | undefined;
type Existant = { note: number; reponses: Record<string, string>; message: string; publication: boolean; modifieLe: string } | null;

const LIBELLES_NOTE = ["Très déçu", "Déçu", "Correct", "Satisfait", "Très satisfait"];

/**
 * LE QUESTIONNAIRE D'AVIS. Gros caractères, grandes zones à toucher : le
 * lecteur a souvent plus de 65 ans et remplit depuis son téléphone.
 *
 * ⚠️ Le bloc Trustpilot est rendu hors de tout état : il ne dépend ni de la
 * note, ni de l'envoi. Le conditionner à une bonne note serait un tri des avis,
 * interdit par Trustpilot.
 */
export function FormulaireAvis({
  action,
  sections,
  existant,
  messageMax,
}: {
  action: (prev: EtatAvis, formData: FormData) => Promise<EtatAvis>;
  sections: SectionAvis[];
  existant: Existant;
  messageMax: number;
}) {
  const [etat, envoyer, pending] = useActionState<EtatAvis, FormData>(action, undefined);
  const [note, setNote] = useState(existant?.note ?? 0);

  return (
    <div>
      <h2 className="mb-2 text-[1.5rem]">Votre avis sur Héritage Intact</h2>
      <p className="mb-5 text-[1.05rem]">
        Deux minutes suffisent. Vos réponses restent privées : elles servent uniquement à améliorer
        les guides. Seule la note est obligatoire.
      </p>
      {existant && (
        <p className="mb-5 border-l-4 border-blue bg-grey-bg p-4">
          Vous nous avez donné votre avis le{" "}
          {new Date(existant.modifieLe).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
          Vous pouvez le modifier ci-dessous à tout moment.
        </p>
      )}

      {/* La clé remonte le formulaire quand l'avis enregistré change : les
          valeurs par défaut suivent alors la version en base. */}
      <form key={existant?.modifieLe ?? "nouveau"} action={envoyer} className="space-y-8">
        <fieldset>
          <legend className="mb-2 text-[1.2rem] font-bold">Dans l’ensemble, comment notez-vous votre expérience ?</legend>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue">
                <input type="radio" name="note" value={n} checked={note === n} onChange={() => setNote(n)} className="sr-only" required />
                <span aria-hidden className={`block px-1 text-[2.6rem] leading-none ${n <= note ? "text-orange" : "text-grey-line"}`}>★</span>
                <span className="sr-only">{`${n} sur 5 : ${LIBELLES_NOTE[n - 1]}`}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 min-h-[1.5em] text-text-soft" aria-live="polite">
            {note ? `${note}/5 : ${LIBELLES_NOTE[note - 1]}` : "Touchez une étoile pour noter."}
          </p>
        </fieldset>

        {sections.map((s) => (
          <section key={s.cle} className="border-t border-grey-line pt-6">
            <h3 className="mb-4 text-[1.2rem] text-blue">{s.titre}</h3>
            <div className="space-y-6">
              {s.questions.map((q) => (
                <fieldset key={q.cle}>
                  <legend className="mb-2 font-bold">{q.libelle}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((o) => (
                      <label
                        key={o}
                        className="flex min-h-[48px] cursor-pointer items-center gap-3 border border-grey-line bg-white px-3 py-2 has-[:checked]:border-blue has-[:checked]:bg-grey-bg"
                      >
                        <input
                          type="radio"
                          name={q.cle}
                          value={o}
                          defaultChecked={existant?.reponses[q.cle] === o}
                          className="h-5 w-5 shrink-0 accent-blue-mid"
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
        ))}

        <section className="border-t border-grey-line pt-6">
          <label htmlFor="avis-message" className="mb-2 block text-[1.2rem] font-bold text-blue">
            Un mot libre, si vous le souhaitez
          </label>
          <p className="mb-2 text-text-soft">
            Ce qui vous a aidé, ce qui vous a manqué, une suggestion. N’indiquez ni données de santé,
            ni montants précis, ni noms de vos proches.
          </p>
          <textarea
            id="avis-message"
            name="message"
            rows={5}
            maxLength={messageMax}
            defaultValue={existant?.message ?? ""}
            className="w-full border-2 border-grey-line p-3 text-[1.05rem]"
          />
          <label className="mt-3 flex items-start gap-3">
            <input type="checkbox" name="publication" value="oui" defaultChecked={existant?.publication} className="mt-1 h-5 w-5 shrink-0 accent-blue-mid" />
            <span className="text-[0.98rem]">
              J’accepte que ce message soit publié sur le site d’Héritage Intact avec mon prénom et la
              date de mon avis. Je peux retirer cet accord à tout moment en écrivant à {CONTACT_EMAIL}.
            </span>
          </label>
        </section>

        <Button disabled={pending}>{pending ? "Envoi en cours…" : existant ? "Mettre à jour mon avis" : "Envoyer mon avis"}</Button>
      </form>

      {etat && (
        <p role="status" className={`mt-4 border-2 px-4 py-3 font-bold ${etat.ok ? "border-green bg-green-bg text-green" : "border-red bg-red-bg text-red"}`}>
          {etat.message}
        </p>
      )}

      <section className="mt-10 border-2 border-grey-line bg-grey-bg p-5">
        <h3 className="mb-2 text-[1.2rem]">Publier aussi un avis public sur Trustpilot</h3>
        <p className="mb-4">
          Trustpilot est une plateforme indépendante : votre avis y est visible par tous, qu’il soit
          positif ou négatif, et nous ne pouvons ni le modifier ni le supprimer. Vous pouvez le
          publier que vous ayez rempli ce questionnaire ou non.
        </p>
        <a
          href={URL_AVIS_TRUSTPILOT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[52px] items-center justify-center border-b-4 border-blue bg-blue-mid px-5 py-3 text-center font-bold text-white no-underline"
        >
          Publier mon avis sur Trustpilot ↗
        </a>
      </section>
    </div>
  );
}
