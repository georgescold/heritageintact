import { VIDEO } from "@/lib/config";
import { VideoEmbed } from "./VideoEmbed";

/** L’emplacement ne disparaît plus silencieusement quand le film manque. */
export function VslPresentation() {
  const lisible = Boolean(VIDEO.vsl && process.env.VSL_VALIDEE === "true");
  return <section id="presentation-video" aria-label="Présentation vidéo" className="my-6">
    {lisible ? <VideoEmbed id={VIDEO.vsl} title="Les repères à connaître avant de transmettre" /> :
      <div className="flex aspect-video flex-col justify-center border-2 border-blue bg-blue px-6 py-8 text-center text-white sm:px-12">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-white/80">Héritage Intact · La présentation</p>
        <h2 className="text-[1.45rem] leading-tight text-white sm:text-[2rem]">Ce que vous pouvez préparer aujourd’hui<br className="hidden sm:block" /> pour ne pas les laisser chercher demain.</h2>
        <p className="mt-4 text-sm text-white/90">La vidéo n’est pas encore disponible sur cette page.</p>
        <a href="#presentation-ecrite" className="mt-3 inline-block min-h-[44px] font-bold text-white underline">Lire la présentation ci-dessous</a>
      </div>}
  </section>;
}
