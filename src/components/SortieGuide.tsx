import { ExitPopup } from "./ExitPopup";

export function SortieGuide({ storageKey }: { storageKey: string }) {
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
      <div data-mesure="clic_commande">
        <a
          href="/commander"
          className="flex min-h-[58px] w-full items-center justify-center border-b-4 border-orange-dark bg-orange px-4 py-3 text-center text-[1.08rem] font-bold leading-tight text-white no-underline hover:bg-orange-dark sm:text-[1.15rem]"
        >
          Accéder au guide
        </a>
      </div>
    </ExitPopup>
  );
}
