import { REVIEWS } from "@/lib/config";

/**
 * Bandeau de réassurance, juste sous le hero.
 *
 * ⚠️ Pourquoi il n'y a pas d'étoiles aujourd'hui.
 *
 * Le modèle britannique affiche « ★★★★★ 4.9 / 5 — used by families across
 * England & Wales ». C'est le bon emplacement et le bon format, mais afficher
 * une note sans avoir un seul client, ce serait une allégation d'avis
 * inexistants : pratique commerciale trompeuse (art. L121-2 du code de la
 * consommation), et les avis en ligne ont en plus leur propre régime
 * (art. L111-7-2, qui impose de dire si les avis sont contrôlés et comment).
 * C'est le seul risque du projet qui puisse tuer la marque publiquement.
 *
 * Donc : les quatre signaux affichés ici sont vrais aujourd'hui, et sur cet
 * avatar « aucun démarchage téléphonique » vaut plus cher que cinq étoiles.
 *
 * Le jour où les 10 testeurs du programme bêta auront donné leur accord écrit
 * (`03-offre-et-mecanisme.md` § 4 bis), il suffit de renseigner REVIEWS dans
 * `lib/config.ts` : la note s'affiche automatiquement, ici et partout ailleurs.
 */
export function TrustBar() {
  const signaux = [
    { i: "⚖", t: "Chiffres vérifiables sur impots.gouv.fr" },
    { i: "☎", t: "Aucun démarchage téléphonique, jamais" },
    { i: "↩", t: "Garantie 30 jours, sans justification" },
    { i: "🇫🇷", t: "Entreprise française, paiement sécurisé" },
  ];

  return (
    <div className="border-b border-grey-line bg-grey-bg">
      <div className="wrap-wide flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2.5 text-[0.9rem]">
        {REVIEWS && (
          <span className="flex items-center gap-2 font-bold text-blue">
            <span aria-hidden className="text-[1.05rem] tracking-[0.06em] text-orange">
              ★★★★★
            </span>
            <span>
              {REVIEWS.note} / 5 — {REVIEWS.nombre} avis de membres, en France
            </span>
          </span>
        )}
        {signaux.map((s) => (
          <span key={s.t} className="flex items-center gap-1.5 text-text-soft">
            <span aria-hidden className="text-[1rem]">
              {s.i}
            </span>
            <span>{s.t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
