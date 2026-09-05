import { FOUNDERS_CAP, PRODUCTS, euros } from "@/lib/config";
import { countFounders } from "@/lib/db";

/** Compteur réel des membres fondateurs, lu en base à chaque affichage. */
export async function FoundersCounter() {
  const count = await countFounders();
  const left = Math.max(0, FOUNDERS_CAP - count);
  const pct = Math.min(100, Math.round((count / FOUNDERS_CAP) * 100));

  return (
    <div className="border border-yellow-line bg-yellow-bg p-3 text-center text-[0.95rem]">
      <p>
        Membres fondateurs : <strong>{count}</strong> sur {FOUNDERS_CAP}. Il reste{" "}
        <strong>{left} places</strong> au prix de {euros(PRODUCTS.front.price)}. Ensuite :{" "}
        {euros(PRODUCTS.front.anchor)}.
      </p>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-sm border border-yellow-line bg-white">
        <div className="h-full bg-orange" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
