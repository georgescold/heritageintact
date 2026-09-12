/**
 * PAGE ÉDITORIALE n°3 — grappe démembrement, sous-intention « charges et travaux »
 * (8 requêtes : « usufruit nu propriété travaux », « qui paie quoi »,
 * « taxe foncière », « charges de copropriété »).
 *
 * ANGLE DIFFÉRENCIANT : la SERP répartit les charges en recopiant les articles
 * 605 et 606. Cette page traite ce que la répartition PRODUIT quand elle tombe
 * sur une famille — la charge existe, l'obligation d'exécuter n'est écrite nulle
 * part, et c'est de là que vient le blocage. Personne ne l'écrit pour le parent
 * qui va créer la situation.
 *
 * Approfondit le bloc « Qui paie quoi » de la page pilier, qui y renvoie.
 *
 * ⚠️ FRONTIÈRE PRODUIT. Ce qui se passe, jamais quoi faire. Et aucun pourcentage
 * de l'article 669 : ces valeurs sont dans `calendrier-3-dates.tsx`, qui est vendu.
 */
import Link from "next/link";
import { CaptureDocument } from "@/components/CaptureDocument";

export const VERIFIE_LE = "12 septembre 2026";

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-[1.35rem] font-bold leading-snug">{titre}</h2>
      {children}
    </section>
  );
}

const LIGNES: [string, string, string][] = [
  ["Taxe foncière", "Usufruitier", "art. 608 C. civ. · art. 1400 II CGI"],
  ["Entretien courant, petites réparations", "Usufruitier", "art. 605 et 606"],
  ["Charges courantes de copropriété", "Usufruitier", "art. 608"],
  ["Gros murs et voûtes", "Nu-propriétaire", "art. 606"],
  ["Réfection d’une couverture entière", "Nu-propriétaire", "art. 606"],
  ["Rétablissement des poutres", "Nu-propriétaire", "art. 606"],
  ["Murs de soutènement et de clôture en entier", "Nu-propriétaire", "art. 606"],
  ["Travaux d’amélioration (non obligatoires)", "Celui qui les décide", "art. 599"],
];

export function UsufruitTravauxCharges() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 text-[1rem] leading-relaxed">
      <h1 className="mb-3 text-[1.9rem] font-bold leading-tight">
        Usufruit et nue-propriété : qui paie les travaux, la taxe foncière et les charges
      </h1>
      <p className="mb-2 text-text-soft">
        La répartition est écrite depuis 1804 et elle est plus déséquilibrée qu’on ne le croit. Ce
        qu’elle donne concrètement le jour où la toiture lâche. Vérifié le {VERIFIE_LE}.
      </p>

      <Bloc titre="Le scénario qui fâche les familles">
        <p className="mb-3">
          Vous avez donné la nue-propriété à vos deux enfants. Vous habitez toujours la maison, vous
          l’entretenez, vous payez la taxe foncière. Tout va bien pendant huit ans.
        </p>
        <p>
          Puis le couvreur passe et annonce que la toiture est à refaire entièrement. Devis :
          28 000 €. Et là, une conversation très désagréable commence — parce que la loi dit que
          cette facture n’est pas pour vous.
        </p>
      </Bloc>

      <Bloc titre="Qui paie quoi, ligne par ligne">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-current text-left">
                <th className="py-2 pr-3">La dépense</th>
                <th className="py-2 pr-3">À la charge de</th>
                <th className="py-2">L’article</th>
              </tr>
            </thead>
            <tbody>
              {LIGNES.map(([quoi, qui, art]) => (
                <tr key={quoi} className="border-b border-current/20">
                  <td className="py-2 pr-3">{quoi}</td>
                  <td className="py-2 pr-3 font-bold">{qui}</td>
                  <td className="py-2 text-[0.85rem] text-text-soft">{art}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          L’article 606 donne la liste des grosses réparations, et elle est limitative : gros murs
          et voûtes, rétablissement des poutres et des couvertures <em>entières</em>, digues, murs de
          soutènement et de clôture en entier.{" "}
          <strong>Tout le reste est réputé réparation d’entretien</strong>, donc pour l’usufruitier.
        </p>
        <p className="mt-3">
          Le mot « entières » n’est pas décoratif : réparer une partie de toiture est de
          l’entretien, refaire la couverture complète est une grosse réparation. La frontière passe
          entre les deux, et c’est souvent là que la discussion s’enlise.
        </p>
      </Bloc>

      <Bloc titre="Le piège que presque personne ne mentionne">
        <p className="mb-3">
          L’article 605 met les grosses réparations à la charge du nu-propriétaire. Mais lisez bien
          ce que le texte fait — et ce qu’il ne fait pas :{" "}
          <strong>il désigne qui doit payer, il n’organise aucun moyen de l’y contraindre.</strong>
        </p>
        <p className="mb-3">
          Vos enfants sont donc redevables d’une toiture qu’ils n’habitent pas, dont ils ne tirent
          aucun revenu, et dont ils ne profiteront qu’après votre décès. Si l’un des deux dit
          simplement « je n’ai pas 14 000 € », il ne se passe rien. La maison, elle, continue de
          prendre l’eau.
        </p>
        <p>
          Le même article ajoute un renversement : si les grosses réparations ont été rendues
          nécessaires par le défaut d’entretien depuis le début de l’usufruit, elles retombent sur
          l’usufruitier. Autrement dit, celui qui laisse filer l’entretien finit par payer le gros
          œuvre.
        </p>
      </Bloc>

      <Bloc titre="Et si vous voulez améliorer le bien">
        <p className="mb-3">
          Ni l’un ni l’autre n’est tenu de faire des travaux d’amélioration — une extension, une
          cuisine neuve, une pompe à chaleur. Celui qui les décide les finance.
        </p>
        <p>
          Et l’article 599 pose une règle que peu d’usufruitiers connaissent avant d’avoir payé :
          l’usufruitier <strong>ne peut réclamer aucune indemnité</strong> pour les améliorations
          qu’il a faites, même si elles ont augmenté la valeur du bien. Vous financez, vos enfants
          héritent de la plus-value.
        </p>
      </Bloc>

      <CaptureDocument
        titre="Ce que le silence coûte, en euros"
        accroche="Ces frictions naissent presque toujours d'un montage décidé sans chiffre en tête. Recevez la grille de ce que vos enfants paieraient aujourd'hui si rien n'était fait — par patrimoine et par nombre d'enfants, chaque montant avec son article."
        cta="Recevoir la grille"
      />

      <Bloc titre="Ce que cette page ne vous dit pas">
        <p className="mb-3">
          Ces règles sont supplétives pour l’essentiel : une convention peut répartir les charges
          autrement, et l’acte de donation peut le prévoir dès le départ. C’est précisément parce
          que c’est possible qu’il vaut mieux y penser avant de signer qu’après la première facture.
        </p>
        <p>
          Ce que produit cette répartition dans votre cas dépend de l’état du bien, de sa nature et
          de ce que votre acte prévoit déjà. Voir aussi{" "}
          <Link href="/guide/usufruit-nue-propriete-indivision">qui décide quoi</Link> et{" "}
          <Link href="/guide/vendre-maison-usufruit-nue-propriete">ce qui se passe en cas de vente</Link>.
        </p>
      </Bloc>

      <Bloc titre="Sources et limites">
        <p className="mb-3 text-[0.9rem]">
          Code civil : articles 599 (améliorations, absence d’indemnité), 605 (réparations
          d’entretien et grosses réparations), 606 (liste limitative des grosses réparations), 608
          (charges annuelles). Code général des impôts : article 1400 II (redevable de la taxe
          foncière). État du droit vérifié le {VERIFIE_LE} sur Legifrance.
        </p>
        <p className="text-[0.9rem] text-text-soft">
          Information générale. Ne constitue ni une consultation juridique au sens de la loi
          n°71-1130, ni un conseil fiscal personnalisé, et ne remplace pas l’intervention d’un
          notaire. Voir les <Link href="/mentions-legales">mentions légales</Link>.
        </p>
      </Bloc>
    </article>
  );
}
