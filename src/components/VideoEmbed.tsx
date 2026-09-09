import { VIDEO } from "@/lib/config";

/**
 * Lecteur vidéo Vimeo / Wistia. Jamais YouTube (règle du funnel).
 * Sans identifiant : cadre de remplacement, pour construire et tester le funnel.
 */
export function VideoEmbed({
  id,
  title,
  minutes,
  dejaPossede = false,
}: {
  id?: string;
  title: string;
  minutes?: number;
  /**
   * LE SPECTATEUR POSSÈDE-T-IL DÉJÀ CE QUE CETTE PAGE DÉCRIT ?
   *
   * ⚠️ LE DÉFAUT EST `false`, ET C'EST LE CAS PRUDENT. La phrase d'attente
   * affirmait « Les documents de cette page sont déjà à vous » PARTOUT. Elle
   * n'était vraie que sur un des trois appels — la page d'étape de l'espace
   * membre. Sur la page de vente et sur les deux écrans d'upsell, elle disait
   * à quelqu'un qui n'a rien acheté que le contenu lui appartient déjà.
   *
   * Deux dégâts, et le second coûte cher : elle est fausse, et elle retire la
   * raison d'acheter. Pire, sur un acheteur qui vient de payer 27 € et à qui
   * on propose 297 €, lire « c'est déjà à vous » fait naître exactement le
   * soupçon qu'on passe la page à éviter : « on me refacture ce que j'ai
   * déjà ».
   *
   * Un composant partagé qui affirme une possession doit donc se la faire
   * dire. Le défaut ne promet rien.
   */
  dejaPossede?: boolean;
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
          Cette vidéo arrive très prochainement.{" "}
          {dejaPossede
            ? "Les documents de cette page sont déjà à vous."
            : "Tout ce qui est décrit sur cette page est livré immédiatement."}
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
