/** VSL finale auto-hébergée, optimisée pour le web et chargée à la demande. */
export function VslPresentation() {
  return (
    <section id="presentation-video" aria-label="Présentation vidéo" className="my-6">
      <div className="aspect-video w-full overflow-hidden border-2 border-blue bg-black shadow-lg">
        <video
          className="h-full w-full"
          controls
          playsInline
          preload="metadata"
          poster="/img/vsl-heritage-intact-thumbnail-v3.jpg"
          aria-label="Les 7 erreurs qui offrent votre héritage à l’État"
        >
          <source src="/videos/vsl-heritage-intact.mp4" type="video/mp4" />
          Votre navigateur ne permet pas de lire cette vidéo.
        </video>
      </div>
      <p className="mt-2 text-center text-sm text-text-soft">
        Présentation complète · 5 min 14 · Activez le son
      </p>
    </section>
  );
}
