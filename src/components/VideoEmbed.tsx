import { VIDEO } from "@/lib/config";

/**
 * Lecteur vidéo Vimeo / Wistia. Jamais YouTube (règle du funnel).
 * Sans identifiant : cadre de remplacement, pour construire et tester le funnel.
 */
export function VideoEmbed({
  id,
  title,
  minutes,
}: {
  id?: string;
  title: string;
  minutes?: number;
}) {
  if (!id) {
    return (
      <div
        role="img"
        aria-label={`Vidéo : ${title}`}
        className="relative flex aspect-video w-full flex-col items-center justify-center border border-grey-line bg-[#1b2633] text-white"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange text-[1.6rem] sm:h-20 sm:w-20 sm:text-[2rem]">
          ▶
        </span>
        <span className="mt-3 px-4 text-center text-[1rem] font-bold sm:text-[1.1rem]">
          {title}
        </span>
        {minutes && (
          <span className="mt-1 text-[0.85rem] text-white/75">Durée : {minutes} minutes</span>
        )}
        {/*
          ⚠️ ICI SE TROUVAIT UN BADGE « vidéo à intégrer ».

          C'était une note de chantier, écrite quand ce composant ne servait
          qu'à construire le funnel. Il est aujourd'hui monté derrière un
          paywall à 27 €, sur les 8 étapes de La Méthode : un acheteur de 74 ans
          qui ouvre son étape 0 le soir de sa commande y lisait, en toutes
          lettres, qu'il venait de payer pour un site inachevé. C'est un
          remboursement le soir même.

          La phrase ci-dessous est vraie, calme, et elle dit ce qui reste
          utilisable tout de suite.
        */}
        <span className="mt-3 max-w-[36ch] px-4 text-center text-[0.9rem] text-white/80">
          Cette vidéo arrive très prochainement. Les documents de cette page sont déjà à vous.
        </span>
      </div>
    );
  }

  const src =
    VIDEO.provider === "wistia"
      ? `https://fast.wistia.net/embed/iframe/${id}?videoFoam=true`
      : `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&texttrack=fr`;

  return (
    <div className="aspect-video w-full overflow-hidden border border-grey-line bg-black">
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
