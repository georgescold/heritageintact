import { FOUNDERS_CAP, PRIX_APRES_FONDATEURS, PRODUCTS, euros } from "@/lib/config";
import { countFounders } from "@/lib/db";

/**
 * Le compteur de places.
 *
 * ═══ Écrit pour un lecteur de 67 ans ═══
 *
 * Le chiffre est énorme et seul sur sa ligne : il doit se lire à un mètre de
 * l'écran, sans lunettes, en une fraction de seconde. Le mot « membres
 * fondateurs » a sauté — c'est du vocabulaire de lancement de startup, il ne
 * dit rien à quelqu'un qui vient de lire une page sur sa succession. Ce qui
 * compte tient en cinq mots : combien il reste, et à quel prix.
 *
 * Le bloc pulse, lentement (deux secondes, opacité 0,82). Un clignotement
 * rapide fatigue et fait fuir cette tranche d'âge, et la pulsation se coupe
 * toute seule si le système demande moins d'animation.
 *
 * ═══ Sur la barre ═══
 *
 * Elle montre les places **prises**, et elle lit la base. Tant qu'il n'y a pas
 * de vente elle est presque vide, et c'est normal : c'est la seule chose
 * honnête qu'elle puisse afficher. La barre « déjà bien remplie » est celle du
 * bandeau du haut — elle mesure la part du délai légal déjà écoulée depuis la
 * loi du 14 février 2025, et celle-là est pleine à plus de 80 % pour de vrai.
 */
export async function FoundersCounter() {
  const count = await countFounders();
  const left = Math.max(0, FOUNDERS_CAP - count);
  const pris = Math.min(100, Math.round((count / FOUNDERS_CAP) * 100));
  const critique = left <= 10;

  return (
    <div
      className={`pulse-urgence border-[3px] p-4 text-center ${
        critique ? "border-red bg-red-bg" : "border-orange bg-yellow-bg"
      }`}
    >
      <p className="text-[1.15rem] leading-tight">
        Il reste{" "}
        <strong
          className={`text-[2.6rem] leading-none ${critique ? "text-red" : "text-orange-dark"}`}
        >
          {left}
        </strong>{" "}
        <strong className="text-[1.3rem]">{left > 1 ? "places" : "place"}</strong>
        <br />
        <span className="text-[1.05rem]">
          à <strong>{euros(PRODUCTS.front.price)}</strong> au lieu de{" "}
          <strong>{euros(PRIX_APRES_FONDATEURS)}</strong>
        </span>
      </p>

      <div className="mx-auto mt-3 h-4 w-full max-w-[26rem] overflow-hidden border border-grey-line bg-white">
        <div
          className={critique ? "h-full bg-red" : "h-full bg-orange"}
          style={{ width: `${Math.max(pris, 3)}%` }}
        />
      </div>

      <p className="mt-2 text-[0.95rem] text-text">
        {count > 0 ? (
          <>
            {count} {count > 1 ? "places déjà prises" : "place déjà prise"} sur {FOUNDERS_CAP}.{" "}
          </>
        ) : null}
        Ensuite, le prix passe à <strong>{euros(PRIX_APRES_FONDATEURS)}</strong> et n&apos;en
        redescend plus.
      </p>
    </div>
  );
}
