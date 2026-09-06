import { FOUNDERS_CAP, PRIX_APRES_FONDATEURS, PRODUCTS, euros } from "@/lib/config";
import { countFounders } from "@/lib/db";

/**
 * Le compteur des places fondatrices.
 *
 * ⚠️ **Il lit la base à chaque affichage. Il n'invente rien, et il ne doit
 * jamais inventer.** Un compteur qui descend tout seul pendant que le visiteur
 * lit est une fausse rareté : l'article L121-4 du code de la consommation la
 * cite nommément parmi les pratiques réputées trompeuses, et un rechargement de
 * page suffit à la démasquer devant un avatar qui se méfie déjà d'internet.
 *
 * La rareté est rendue vraie autrement : le plafond est passé de 500 à 50
 * places (`FOUNDERS_CAP`). « Il reste 47 places » se lit comme une urgence,
 * « il reste 500 places » comme une invitation à revenir plus tard — et cette
 * fois le compteur descend pour de bon.
 */
export async function FoundersCounter() {
  const count = await countFounders();
  const left = Math.max(0, FOUNDERS_CAP - count);
  const pct = Math.min(100, Math.round((count / FOUNDERS_CAP) * 100));

  // Sous dix places, le bloc passe au rouge : c'est le moment où il faut que ça
  // se voie sans lire.
  const critique = left <= 10;

  return (
    <div
      className={`border-2 p-3 text-center ${
        critique ? "border-red bg-red-bg" : "border-yellow-line bg-yellow-bg"
      }`}
    >
      <p className="text-[1.05rem] leading-tight">
        Il reste{" "}
        <strong className={`text-[1.5rem] ${critique ? "text-red" : "text-orange-dark"}`}>
          {left}
        </strong>{" "}
        {left > 1 ? "places" : "place"} à {euros(PRODUCTS.front.price)}.
      </p>
      <div className="mx-auto mt-2 h-3 w-full max-w-[26rem] overflow-hidden border border-grey-line bg-white">
        <div
          className={critique ? "h-full bg-red" : "h-full bg-orange"}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <p className="mt-2 text-[0.9rem] text-text-soft">
        {count} {count > 1 ? "membres fondateurs" : "membre fondateur"} sur {FOUNDERS_CAP}. À la{" "}
        {FOUNDERS_CAP}
        <sup>e</sup>, le prix passe à {euros(PRIX_APRES_FONDATEURS)} — définitivement.
      </p>
    </div>
  );
}
