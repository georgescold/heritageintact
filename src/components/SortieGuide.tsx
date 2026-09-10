import { ExitPopup } from "./ExitPopup";
import { euros } from "@/lib/config";
import type { Palier } from "@/lib/promotions";

export function SortieGuide({
  storageKey,
  montant,
  promotion,
}: {
  storageKey: string;
  montant: number;
  promotion: Palier;
}) {
  return (
    <ExitPopup storageKey={storageKey} title="Ce que vous risquez si vous fermez cette page">
      <ul className="space-y-2 text-[1.03rem]">
        {[
          "Vous ne saurez toujours pas ce qu’il faut faire vérifier sur votre maison, votre épargne et les documents que vous avez signés.",
          "Vous ne saurez pas laquelle des dates vous concerne en premier. Elle arrivera quand même.",
          "La question retournera dans la pile « plus tard ». Elle ne sera pas réglée pour autant.",
          "Et si rien ne change, ce sont vos enfants qui devront chercher les réponses — pendant leur deuil, sans pouvoir vous les demander.",
        ].map((texte) => (
          <li key={texte} className="flex gap-2 border-l-4 border-red bg-red-bg p-3">
            <span aria-hidden className="shrink-0 font-bold text-red">✕</span>
            <span>{texte}</span>
          </li>
        ))}
      </ul>
      <p className="text-[1rem] font-bold text-blue">
        Une première lecture, une première fiche. Commencez pendant que vous pouvez encore leur
        expliquer ce qui compte pour vous.
      </p>
      {promotion.pourcent > 0 && promotion.fin && (
        <p className="text-sm text-text-soft">
          Votre palier de −{promotion.pourcent}% se termine le{" "}
          {new Date(promotion.fin).toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
          , heure de Paris. Le prix sera revérifié avant confirmation.
        </p>
      )}
      <div data-mesure="clic_commande">
        <a
          href="/commander"
          className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 py-3 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
        >
          Accéder au guide
        </a>
        <p className="mt-2 text-center text-[0.95rem] text-text-soft">
          {euros(montant)} · Paiement unique · Accès immédiat · Garantie 30 jours
        </p>
      </div>
    </ExitPopup>
  );
}
